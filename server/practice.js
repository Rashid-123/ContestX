
import dotenv from 'dotenv';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
dotenv.config();

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// // Initialize Pinecone vector store with LangChain`
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);


/**-----------------------------------------------------------------------------------------------------------------------
 * Fetch problem vectors from Pinecone by problem numbers
 * @param {number[]} problemNumbers - Array of LeetCode problem numbers
 * @returns {Promise<Array>} - Array of problem vectors
 */
async function fetchProblemVectors(problemNumbers) {
  const vectors = [];
  
  for (const problemNumber of problemNumbers) {
    try {
      const result = await index.query({
        topK: 1,
        vector: Array(3072).fill(0), // dummy vector, since we're filtering
        filter: { number: problemNumber },
        includeMetadata: true,
        includeValues: true, // you need this to get vector
      });
      
      // Step 2: Get the vector
      const match = result.matches?.[0];
      if (match) {
        const vector = match.values;
        // console.log('Vector:', vector);
        vectors.push(vector);
      } else {
        console.log('No match found for number 2181');
      }
      
    } catch (error) {
      console.error(`Error fetching vector for problem ${problemNumber}:`, error);
    }
  }
  // console.log('Fetched vectors:', vectors);
  return vectors;
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
 * Group vectors and calculate the average for each group
 * @param {Array<Array<number>>} vectors - List of problem vectors
 * @param {number} numRecommendations - Number of recommendations (5 or 10)
 * @returns {Array<Array<number>>} - List of average vectors
 */
function groupAndAverageVectors(vectors, numRecommendations) {
  const averageVectors = [];
  
  if (numRecommendations === 5) {
    // Group 20 vectors into 5 groups of 4 vectors each
    const groupSize = 4;
    
    for (let i = 0; i < vectors.length; i += groupSize) {
      const group = vectors.slice(i, i + groupSize);
      const avgVector = calculateAverageVector(group);
      averageVectors.push(avgVector);
    }
  } else if (numRecommendations === 10) {
    // Group 20 vectors into 10 groups of 2 vectors each
    const groupSize = 2;
    
    for (let i = 0; i < vectors.length; i += groupSize) {
      const group = vectors.slice(i, i + groupSize);
      const avgVector = calculateAverageVector(group);
      averageVectors.push(avgVector);
    }
  }
  // console.log('Average vectors:', averageVectors);
  return averageVectors;
}

/**------------------------------------------------------------------------------------------------------------------------------
 * Find similar problems from Pinecone using the average vectors
 * @param {Array<Array<number>>} averageVectors - List of average vectors
 * @param {number} numRecommendations - Number of recommendations (5 or 10)
 * @returns {Promise<Array<Object>>} - List of recommended problems
 */
// async function findSimilarProblems(averageVectors, numRecommendations , problemNumbers) {
//   const recommendations = new Set();
//   const recommendedProblems = [];
  
//   for (const avgVector of averageVectors) {
//     // Query the vector database for similar problems
//     const queryResponse = await index.query({
//       vector: avgVector,
//       topK: 5, // Get more than we need to filter out problems already seen
//       includeMetadata: true
//     });
//     console.log('Query response:', JSON.stringify(queryResponse, null, 2));
//     // Process results
//     for (const match of queryResponse.matches) { 
//       const problemNumber = match.number;
      
//       // Add to recommendations if not already recommended
//       if (!recommendations.has(problemNumber)) {
//         recommendations.add(problemNumber);
//         recommendedProblems.push({
//           number: problemNumber,
//           title: match.metadata.title,
//           difficulty: match.metadata.difficulty,
//           tags: match.metadata.tags,
//           similarity: match.score
//         });
        
//         // Break when we have enough recommendations
//         if (recommendations.size >= numRecommendations) {
//           break;
//         }
//       }
//     }
//   }
  
//   return recommendedProblems.slice(0, numRecommendations);
// }

async function findSimilarProblems(averageVectors, numRecommendations , problemNumbers) {
  const recommendations = new Set();
  const recommendedProblems = [];
  
  // Process each average vector and find exactly one recommendation for each
  for (const avgVector of averageVectors) {
    const queryResponse = await index.query({
      vector: avgVector,
      topK: 50, // Significantly increased to ensure we have enough candidates after filtering
      includeMetadata: true
    });
    
    // Filter the matches to only include valid recommendations
    const validMatches = queryResponse.matches.filter(match => {
      const problemNumber = match.metadata.number;
      return !problemNumbers.includes(problemNumber) && !recommendations.has(problemNumber);
    });
    
    // If we have valid matches, select the highest scoring one
    if (validMatches.length > 0) {
      // validMatches[0] will be the highest score since query response is already sorted by score
      const bestMatch = validMatches[0];
      const problemNumber = bestMatch.metadata.number;
      
      recommendations.add(problemNumber);
      recommendedProblems.push({
        number: problemNumber,
        title: bestMatch.metadata.title,
        difficulty: bestMatch.metadata.difficulty,
        tags: bestMatch.metadata.tags,
        similarity: bestMatch.score,
        vectorIndex: averageVectors.indexOf(avgVector) // Track which vector this recommendation is for
      });
    } else {
      console.log(`Could not find a unique recommendation for vector at index ${averageVectors.indexOf(avgVector)}`);
      // Optionally add a placeholder or handle this case as needed
    }
  }
  
  return recommendedProblems;
}

/**------------------------------------------------------------------------------------------------------------------------------------
 * Main recommendation function
 * @param {Object} input - Input object with problem numbers and recommendation count
 * @returns {Promise<Object>} - Object containing recommended problems
 */
async function recommendProblems({ problemNumbers, numRecommendations }) {
  // Validate input
  if (!Array.isArray(problemNumbers) || problemNumbers.length !== 20) {
    throw new Error('Please provide exactly 20 problem numbers');
  }
  
  if (numRecommendations !== 5 && numRecommendations !== 10) {
    throw new Error('Number of recommendations must be either 5 or 10');
  }
  
  // Create a runnable chain with LangChain
  const recommendationChain = RunnableSequence.from([
    {
      problemVectors: async (input) => await fetchProblemVectors(input.problemNumbers),
      numRecommendations: (input) => input.numRecommendations,
      problemNumbers: (input) => input.problemNumbers
    },
    {
      averageVectors: (input) => groupAndAverageVectors(input.problemVectors, input.numRecommendations),
      numRecommendations: (input) => input.numRecommendations,
      problemNumbers: (input) => input.problemNumbers
    },
    async (input) => {
      const recommendations = await findSimilarProblems(input.averageVectors, input.numRecommendations , input.problemNumbers);
      return { recommendations };
    }
  ]);
  
  // Run the chain
  return await recommendationChain.invoke({
    problemNumbers,
    numRecommendations
  });
}

/**---------------------------------------------------------------------------------------------------------------------------------------------
 * Handler for API endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
// async function handleRecommendationRequest(req, res) {
//   try {
//     const { problemNumbers, numRecommendations } = req.body;
    
//     const result = await recommendProblems({
//       problemNumbers,
//       numRecommendations
//     });
    
//     res.json(result);
//   } catch (error) {
//     console.error('Error generating recommendations:', error);
//     res.status(500).json({ error: error.message });
//   }
// }

// // Export functions for testing or direct usage
// module.exports = {
//   recommendProblems,
//   fetchProblemVectors,
//   groupAndAverageVectors,
//   findSimilarProblems
// };




async function testRecommendation() {
    try {
      // Example test data - 20 problem numbers
      const testProblemNumbers = [10, 22, 37, 41, 5, 63, 7, 98, 96, 10, 11, 121, 213, 14, 1560, 566, 17, 198, 19, 2910];
      
      console.log("Testing recommendation system...");
      const result = await recommendProblems({
        problemNumbers: testProblemNumbers,
        numRecommendations: 5
      });
      
      console.log("Recommended problems:", JSON.stringify(result.recommendations, null, 2));
    } catch (error) {
      console.error("Test failed:", error);
    }
  }
  
 testRecommendation()