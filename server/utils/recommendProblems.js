
// import dotenv from 'dotenv';
// import { Pinecone } from '@pinecone-database/pinecone';
// import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
// dotenv.config();

// // Initialize Pinecone client
// const pinecone = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY,
// });

// // // Initialize Pinecone vector store with LangChain`
// const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);


// /**-----------------------------------------------------------------------------------------------------------------------
//  * Fetch problem vectors from Pinecone by problem numbers
//  * @param {number[]} problemNumbers - Array of LeetCode problem numbers
//  * @returns {Promise<Array>} - Array of problem vectors
//  */
// async function fetchProblemVectors(problemNumbers) {
//   const vectors = [];
  
//   for (const problemNumber of problemNumbers) {
//     try {
//       const result = await index.query({
//         topK: 1,
//         vector: Array(3072).fill(0), // dummy vector, since we're filtering
//         filter: { number: problemNumber },
//         includeMetadata: true,
//         includeValues: true, // you need this to get vector
//       });
      
//       // Step 2: Get the vector
//       const match = result.matches?.[0];
//       if (match) {
//         const vector = match.values;
//         // console.log('Vector:', vector);
//         vectors.push(vector);
//       } else {
//         console.log('No match found for number 2181');
//       }
      
//     } catch (error) {
//       console.error(`Error fetching vector for problem ${problemNumber}:`, error);
//     }
//   }
//   // console.log('Fetched vectors:', vectors);
//   return vectors;
// }

// /**------------------------------------------------------------------------------------------------------------------------------
//  * Calculate the average of an array of vectors
//  * @param {Array<Array<number>>} vectors - Array of vectors to average
//  * @returns {Array<number>} - The average vector
//  */
// function calculateAverageVector(vectors) {
//   if (vectors.length === 0) return [];
  
//   const dimension = vectors[0].length;
//   const average = new Array(dimension).fill(0);
  
//   for (const vector of vectors) {
//     for (let i = 0; i < dimension; i++) {
//       average[i] += vector[i];
//     }
//   }
  
//   for (let i = 0; i < dimension; i++) {
//     average[i] /= vectors.length;
//   }
  
//   return average;
// }

// /**------------------------------------------------------------------------------------------------------------------------------------
//  * Group vectors and calculate the average for each group
//  * @param {Array<Array<number>>} vectors - List of problem vectors
//  * @param {number} numRecommendations - Number of recommendations (5 or 10)
//  * @returns {Array<Array<number>>} - List of average vectors
//  */
// function groupAndAverageVectors(vectors, numRecommendations) {
//   const averageVectors = [];
  
//   if (numRecommendations === 5) {
//     // Group 20 vectors into 5 groups of 4 vectors each
//     const groupSize = 4;
    
//     for (let i = 0; i < vectors.length; i += groupSize) {
//       const group = vectors.slice(i, i + groupSize);
//       const avgVector = calculateAverageVector(group);
//       averageVectors.push(avgVector);
//     }
//   } else if (numRecommendations === 10) {
//     // Group 20 vectors into 10 groups of 2 vectors each
//     const groupSize = 2;
    
//     for (let i = 0; i < vectors.length; i += groupSize) {
//       const group = vectors.slice(i, i + groupSize);
//       const avgVector = calculateAverageVector(group);
//       averageVectors.push(avgVector);
//     }
//   }
//   // console.log('Average vectors:', averageVectors);
//   return averageVectors;
// }

// /**------------------------------------------------------------------------------------------------------------------------------
//  * Find similar problems from Pinecone using the average vectors
//  * @param {Array<Array<number>>} averageVectors - List of average vectors
//  * @param {number} numRecommendations - Number of recommendations (5 or 10)
//  * @returns {Promise<Array<Object>>} - List of recommended problems
//  */


// async function findSimilarProblems(averageVectors, numRecommendations , problemNumbers) {
//   const recommendations = new Set();
//   const recommendedProblems = [];
  
//   // Process each average vector and find exactly one recommendation for each
//   for (const avgVector of averageVectors) {
//     const queryResponse = await index.query({
//       vector: avgVector,
//       topK: 50, // Significantly increased to ensure we have enough candidates after filtering
//       includeMetadata: true
//     });
    
//     // Filter the matches to only include valid recommendations
//     const validMatches = queryResponse.matches.filter(match => {
//       const problemNumber = match.metadata.number;
//       return !problemNumbers.includes(problemNumber) && !recommendations.has(problemNumber);
//     });
    
//     // If we have valid matches, select the highest scoring one
//     if (validMatches.length > 0) {
//       // validMatches[0] will be the highest score since query response is already sorted by score
//       const bestMatch = validMatches[0];
//       const problemNumber = bestMatch.metadata.number;
      
//       recommendations.add(problemNumber);
//       recommendedProblems.push({
//         number: problemNumber,
//         title: bestMatch.metadata.title,
//         difficulty: bestMatch.metadata.difficulty,
//         tags: bestMatch.metadata.tags,
//         similarity: bestMatch.score,
//         vectorIndex: averageVectors.indexOf(avgVector) // Track which vector this recommendation is for
//       });
//     } else {
//       console.log(`Could not find a unique recommendation for vector at index ${averageVectors.indexOf(avgVector)}`);
//       // Optionally add a placeholder or handle this case as needed
//     }
//   }
  
//   return recommendedProblems;
// }

// /**------------------------------------------------------------------------------------------------------------------------------------
//  * Main recommendation function
//  * @param {Object} input - Input object with problem numbers and recommendation count
//  * @returns {Promise<Object>} - Object containing recommended problems
//  */
// async function recommendProblems({ problemNumbers, numRecommendations }) {
//   // Validate input
//   if (!Array.isArray(problemNumbers) || problemNumbers.length !== 20) {
//     throw new Error('Please provide exactly 20 problem numbers');
//   }
  
//   if (numRecommendations !== 5 && numRecommendations !== 10) {
//     throw new Error('Number of recommendations must be either 5 or 10');
//   }
  
//   // Create a runnable chain with LangChain
//   const recommendationChain = RunnableSequence.from([
//     {
//       problemVectors: async (input) => await fetchProblemVectors(input.problemNumbers),
//       numRecommendations: (input) => input.numRecommendations,
//       problemNumbers: (input) => input.problemNumbers
//     },
//     {
//       averageVectors: (input) => groupAndAverageVectors(input.problemVectors, input.numRecommendations),
//       numRecommendations: (input) => input.numRecommendations,
//       problemNumbers: (input) => input.problemNumbers
//     },
//     async (input) => {
//       const recommendations = await findSimilarProblems(input.averageVectors, input.numRecommendations , input.problemNumbers);
//       return { recommendations };
//     }
//   ]);
  
//   // Run the chain
//   return await recommendationChain.invoke({
//     problemNumbers,
//     numRecommendations
//   });
// }

// module.exports = {
//   recommendProblems
// };




import dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import mongoose from 'mongoose';
dotenv.config();

// Import models
import User from '../models/User.js';
// Dynamic import for Recommendation if it hasn't been imported yet
const Recommendation = mongoose.models.Recommendation || 
  (await import('../models/Recommendation.js')).default;

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
        vector: Array(3072).fill(0), // dummy vector, since we're filtering
        filter: { number: problemNumber },
        includeMetadata: true,
        includeValues: true, // you need this to get vector
      });
      
      // Get the vector and metadata
      const match = result.matches?.[0];
      if (match) {
        vectors.push(match.values);
        metadata.push({
          number: match.metadata.number,
          title: match.metadata.title,
          difficulty: match.metadata.difficulty,
          tags: match.metadata.tags
        });
      } else {
        console.log(`No match found for problem ${problemNumber}`);
      }
      
    } catch (error) {
      console.error(`Error fetching vector for problem ${problemNumber}:`, error);
    }
  }
  
  return { vectors, metadata };
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
function groupAndAverageVectors({ vectors, metadata, numRecommendations }) {
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
    // Calculate the average vector
    const avgVector = calculateAverageVector(groupVectors);
    averageVectors.push(avgVector);
    
    // Track which problems contributed to this group
    const groupMetadata = metadata.slice(i, i + groupSize);
    const groupProblemNumbers = groupMetadata.map(item => item.number);
    problemGroups.push({
      problemNumbers: groupProblemNumbers,
      metadata: groupMetadata
    });
  }
  
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
      topK: 50, // Significantly increased to ensure we have enough candidates after filtering
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
        difficulty: bestMatch.metadata.difficulty,
        tags: bestMatch.metadata.tags,
        similarity: bestMatch.score,
        usedProblemNumbers: sourceProblemGroup.problemNumbers,
        usedProblemMetadata: sourceProblemGroup.metadata,
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
    // Create a runnable chain with LangChain
    const recommendationChain = RunnableSequence.from([
      {
        problemData: async (input) => await fetchProblemVectors(input.problemNumbers),
        numRecommendations: (input) => input.numRecommendations,
        allProblemNumbers: (input) => input.problemNumbers
      },
      {
        averageData: (input) => groupAndAverageVectors({
          vectors: input.problemData.vectors,
          metadata: input.problemData.metadata,
          numRecommendations: input.numRecommendations
        }),
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
    
    // Return both the saved document ID and the full recommendation data
    return {
    //   recommendationId: savedRecommendation._id,
      recommendedProblems: result.recommendedProblems
    };
    
  } catch (error) {
    console.error('Error in recommendation process:', error);
    return { error: 'Failed to generate recommendations' };
  }
}

export default recommendProblems;