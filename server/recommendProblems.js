
import dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import mongoose from 'mongoose';
dotenv.config();

// Import models
import User from './models/User.js';
// Dynamic import for Recommendation if it hasn't been imported yet
const Recommendation = mongoose.models.Recommendation || 
  (await import('./models/Recommendation.js')).default;

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Initialize Pinecone vector store with LangChain
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

/**-----------------------------------------------------------------------------------------------------------------------
 * Fetch problem vectors from Pinecone by problem numbers
 * @param {number[]} problemNumbers - Array of LeetCode problem numbers
 * @returns {Promise<Object>} - Object containing problem vectors and metadata
 */
async function fetchProblemVectors(problemNumbers) {
  const vectors = [];
  const metadata = [];
  
  for (const problemNumber of problemNumbers) {
    try {
      const result = await index.query({
        topK: 1,
        vector: Array(3072).fill(0), // Placeholder vector, replace with actual vector if needed
        filter: { number: problemNumber },
        // includeMetadata: true,
        includeValues: true, // you need this to get vector
      });
      console.log("Query result:", result);
      
      // Get the vector and metadata
      const match = result.matches?.[0];
      if (match) {
        vectors.push(match.values);
        // metadata.push({
        //   number: match.metadata.number,
        //   title: match.metadata.title,
        //   difficulty: match.metadata.difficulty,
        //   titleSlug: match.metadata.titleSlug,
        // });
      } else {
        console.log(`No match found for problem ${problemNumber}`);
      }
      
    } catch (error) {
      console.error(`Error fetching vector for problem ${problemNumber}:`, error);
    }
  }
  
  // return { vectors, metadata };
  return {vectors};
}

/**------------------------------------------------------------------------------------------------------------------------------
 * Calculate the average of an array of vectors
 * @param {Array<Array<number>>} vectors - Array of vectors to average
 * @returns {Array<number>} - The average vector
 */
function calculateAverageVector(vectors) {
  if (vectors.length === 0) return [];
  
  const dimension = vectors[0].length;
  const average = new Array(dimension).fill(0);
  
  for (const vector of vectors) {
    for (let i = 0; i < dimension; i++) {
      average[i] += vector[i];
    }
  }
  
  for (let i = 0; i < dimension; i++) {
    average[i] /= vectors.length;
  }
  
  return average;
}

/**------------------------------------------------------------------------------------------------------------------------------------
 * Group vectors and calculate the average for each group, tracking which problems contributed to each group
 * @param {Object} input - Object containing vectors, metadata, and number of recommendations
 * @returns {Object} - Object containing average vectors and problem groups
 */
// function groupAndAverageVectors({ vectors, metadata, numRecommendations }) {
  function groupAndAverageVectors({ vectors, allProblemNumbers, numRecommendations }) {

  const averageVectors = [];
  const problemGroups = [];
  
  let groupSize;
  if (numRecommendations === 5) {
    // Group 20 vectors into 5 groups of 4 vectors each
    groupSize = 4;
  } else if (numRecommendations === 10) {
    // Group 20 vectors into 10 groups of 2 vectors each
    groupSize = 2;
  }
  
  for (let i = 0; i < vectors.length; i += groupSize) {
    // Get the vectors for this group
    const groupVectors = vectors.slice(i, i + groupSize);
    const groupProblemNumbers = allProblemNumbers.slice(i, i + groupSize);
    // Calculate the average vector
    const avgVector = calculateAverageVector(groupVectors);
    averageVectors.push(avgVector);
    
    // Track which problems contributed to this group
    // const groupMetadata = metadata.slice(i, i + groupSize);
    // const groupProblemNumbers = groupMetadata.map(item => item.number);
    problemGroups.push({
      problemNumbers: groupProblemNumbers,
      // metadata: groupMetadata,
    });
  }
  console.log("Grouped problem numbers:", problemGroups);
  console.log("Average vectors:", averageVectors);
  return { averageVectors, problemGroups };
}

/**------------------------------------------------------------------------------------------------------------------------------
 * Find similar problems from Pinecone using the average vectors
 * @param {Object} input - Object containing average vectors, problem groups, and other data
 * @returns {Promise<Array<Object>>} - List of recommended problems with source information
 */
async function findSimilarProblems({ averageVectors, problemGroups, numRecommendations, allProblemNumbers }) {
  const recommendations = new Set();
  const recommendedProblems = [];
  
  // Process each average vector and find exactly one recommendation for each
  for (let i = 0; i < averageVectors.length; i++) {
    const avgVector = averageVectors[i];
    const sourceProblemGroup = problemGroups[i];
    
    const queryResponse = await index.query({
      vector: avgVector,
      topK:20 , // Significantly increased to ensure we have enough candidates after filtering
      includeMetadata: true
    });
    
    // Filter the matches to only include valid recommendations
    const validMatches = queryResponse.matches.filter(match => {
      const problemNumber = match.metadata.number;
      return !allProblemNumbers.includes(problemNumber) && !recommendations.has(problemNumber);
    });
    
    // If we have valid matches, select the highest scoring one
    if (validMatches.length > 0) {
      // validMatches[0] will be the highest score since query response is already sorted by score
      const bestMatch = validMatches[0];
      const problemNumber = bestMatch.metadata.number;
      
      recommendations.add(problemNumber);
      recommendedProblems.push({
        recommendedProblemNumber: problemNumber,
        title: bestMatch.metadata.title,
        titleSlug: bestMatch.metadata.titleSlug,
        difficulty: bestMatch.metadata.difficulty,
        tags: bestMatch.metadata.tags,
        similarity: bestMatch.score,
        usedProblemNumbers: sourceProblemGroup.problemNumbers,
        message: `This problem was recommended based on ${sourceProblemGroup.problemNumbers.join(', ')}` // Basic message
      });
    } else {
      console.log(`Could not find a unique recommendation for vector at index ${i}`);
    }
  }
  
  return recommendedProblems;
}

/**------------------------------------------------------------------------------------------------------------------------------------
 * Main recommendation function that also stores results in MongoDB
 * @param {string} userId - User ID to associate the recommendations with
 * @param {number[]} problemNumbers - Array of problem numbers to base recommendations on
 * @param {number} numRecommendations - Number of recommendations (5 or 10)
 * @returns {Promise<Object>} - Object containing recommended problems
 */
async function recommendProblems(problemNumbers, numRecommendations) {
  // Validate input
  if (!Array.isArray(problemNumbers) || problemNumbers.length !== 20) {
    return { error: 'Please provide exactly 20 problem numbers' };
  }
  
  if (numRecommendations !== 5 && numRecommendations !== 10) {
    return { error: 'Number of recommendations must be either 5 or 10' };
  }
  
  try {
    
    const recommendationChain = RunnableSequence.from([
      {
        problemData: async (input) => {
          const data = await fetchProblemVectors(input.problemNumbers);
          // console.log("Fetched problem vectors:", data);
          return data;
        },
        numRecommendations: (input) => input.numRecommendations,
        allProblemNumbers: (input) => input.problemNumbers
      },
      {
        averageData: (input) => {
          const result = groupAndAverageVectors({
            vectors: input.problemData.vectors,
            // metadata: input.problemData.metadata,
            allProblemNumbers: input.allProblemNumbers,
            numRecommendations: input.numRecommendations
          });
          // console.log("Grouped and averaged vectors:", result);
          return result;
        },
        numRecommendations: (input) => input.numRecommendations,
        allProblemNumbers: (input) => input.allProblemNumbers
      },
      async (input) => {
        const recommendedProblems = await findSimilarProblems({
          averageVectors: input.averageData.averageVectors,
          problemGroups: input.averageData.problemGroups,
          numRecommendations: input.numRecommendations,
          allProblemNumbers: input.allProblemNumbers
        });
        // console.log("Final recommended problems:", recommendedProblems);
        return { recommendedProblems };
      }
    ]);
    

    // Run the chain to get recommendations
    const result = await recommendationChain.invoke({
      problemNumbers,
      numRecommendations
    });
    
    // Format recommendations for MongoDB storage
    // const formattedRecommendations = result.recommendedProblems.map(problem => ({
    //   recommendedProblemNumber: problem.recommendedProblemNumber,
    //   usedProblemNumbers: problem.usedProblemNumbers,
    //   message: problem.message
    // }));
    
    // Create a new recommendation document
    // const recommendationDoc = new Recommendation({
    //   recommendations: formattedRecommendations,
    //   createdAt: new Date()
    // });
    
    // Save the recommendation document
    // const savedRecommendation = await recommendationDoc.save();
    
    // Update the user's recommendation history
    // await User.findByIdAndUpdate(
    //   userId,
    //   { $push: { recommendationHistory: savedRecommendation._id } },
    //   { new: true }
    // );
    
    // Return both the saved document ID and the full recommendation data'
    // console.log("Recommendations:", result.recommendedProblems);
    return {
    //   recommendationId: savedRecommendation._id,
      recommendedProblems: result.recommendedProblems
    };
    
  } catch (error) {
    console.error('Error in recommendation process:', error);
    return { error: 'Failed to generate recommendations' };
  }
}

// export default recommendProblems;


const testRecommendation = async () => {
  try {
    // Example test data - 20 problem numbers
    const testProblemNumbers = [10, 22, 37, 41, 5, 63, 7, 98, 96, 10, 11, 121, 213, 14, 1560, 566, 17, 198, 19, 2910];
    
    console.log("Testing recommendation system...");
    const result = await recommendProblems(testProblemNumbers ,10);
    
    console.log("Recommended problems:", JSON.stringify(result.recommendedProblems, null, 2));
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testRecommendation();