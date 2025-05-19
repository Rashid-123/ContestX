
// import dotenv from 'dotenv';
// import { Pinecone } from '@pinecone-database/pinecone';
// import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
// dotenv.config();

// // Initialize Pinecone client
// const pinecone = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY,
// });

// // Initialize Pinecone vector store with LangChain
// const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

// /**-----------------------------------------------------------------------------------------------------------------------
//  * Fetch problem vectors from Pinecone by problem numbers
//  * @param {number[]} problemNumbers - Array of LeetCode problem numbers
//  * @returns {Promise<Object>} - Object containing problem vectors and metadata
//  */
// async function fetchProblemVectors(problemNumbers) {
//   const vectors = [];

//   for (const problemNumber of problemNumbers) {
//     try {
//       const result = await index.query({
//         topK: 1,
//         vector: Array(3072).fill(0), // Placeholder vector, replace with actual vector if needed
//         filter: { number: problemNumber },
//         includeValues: true, // you need this to get vector
//       });

//       // Get the vector and metadata
//       const match = result.matches?.[0];
//       if (match) {
//         vectors.push(match.values);

//       } else {
//         console.log(`No match found for problem ${problemNumber}`);
//       }

//     } catch (error) {
//       console.error(`Error fetching vector for problem ${problemNumber}:`, error);
//     }
//   }

//   // return { vectors, metadata };
//   return {vectors};
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
//  * Group vectors and calculate the average for each group, tracking which problems contributed to each group
//  * @param {Object} input - Object containing vectors, metadata, and number of recommendations
//  * @returns {Object} - Object containing average vectors and problem groups
//  */
// // function groupAndAverageVectors({ vectors, metadata, numRecommendations }) {
//   function groupAndAverageVectors({ vectors, allProblemNumbers, numRecommendations }) {

//   const averageVectors = [];
//   const problemGroups = [];

//   let groupSize;
//   if (numRecommendations === 5) {
//     // Group 20 vectors into 5 groups of 4 vectors each
//     groupSize = 4;
//   } else if (numRecommendations === 10) {
//     // Group 20 vectors into 10 groups of 2 vectors each
//     groupSize = 2;
//   }

//   for (let i = 0; i < vectors.length; i += groupSize) {
//     // Get the vectors for this group
//     const groupVectors = vectors.slice(i, i + groupSize);
//     const groupProblemNumbers = allProblemNumbers.slice(i, i + groupSize);
//     // Calculate the average vector
//     const avgVector = calculateAverageVector(groupVectors);
//     averageVectors.push(avgVector);

//     // Track which problems contributed to this group

//     problemGroups.push({
//       problemNumbers: groupProblemNumbers,
//       // metadata: groupMetadata,
//     });
//   }
//   return { averageVectors, problemGroups };
// }

// /**------------------------------------------------------------------------------------------------------------------------------
//  * Find similar problems from Pinecone using the average vectors
//  * @param {Object} input - Object containing average vectors, problem groups, and other data
//  * @returns {Promise<Array<Object>>} - List of recommended problems with source information
//  */
// async function findSimilarProblems({ averageVectors, problemGroups, numRecommendations, allProblemNumbers }) {
//   const recommendations = new Set();
//   const recommendedProblems = [];

//   // Process each average vector and find exactly one recommendation for each
//   for (let i = 0; i < averageVectors.length; i++) {
//     const avgVector = averageVectors[i];
//     const sourceProblemGroup = problemGroups[i];

//     const queryResponse = await index.query({
//       vector: avgVector,
//       topK:10 , // Significantly increased to ensure we have enough candidates after filtering
//       includeMetadata: true
//     });

//     // Filter the matches to only include valid recommendations
//     const validMatches = queryResponse.matches.filter(match => {
//       const problemNumber = match.metadata.number;
//       return !allProblemNumbers.includes(problemNumber) && !recommendations.has(problemNumber);
//     });

//     // If we have valid matches, select the highest scoring one
//     if (validMatches.length > 0) {
//       // validMatches[0] will be the highest score since query response is already sorted by score
//       const bestMatch = validMatches[0];
//       const problemNumber = bestMatch.metadata.number;

//       recommendations.add(problemNumber);
//       recommendedProblems.push({
//         recommendedProblemNumber: problemNumber,
//         title: bestMatch.metadata.title,
//         titleSlug: bestMatch.metadata.titleSlug,
//         difficulty: bestMatch.metadata.difficulty,
//         tags: bestMatch.metadata.tags,
//         similarity: bestMatch.score,
//         usedProblemNumbers: sourceProblemGroup.problemNumbers,
//         message: `This problem was recommended based on ${sourceProblemGroup.problemNumbers.join(', ')}` // Basic message
//       });
//     } else {
//       console.log(`Could not find a unique recommendation for vector at index ${i}`);
//     }
//   }

//   return recommendedProblems;
// }

// /**---------------------------------------------------------------------------------------------------------------
//  * Main recommendation function that also stores results in MongoDB
//  * @param {string} userId - User ID to associate the recommendations with
//  * @param {number[]} problemNumbers - Array of problem numbers to base recommendations on
//  * @param {number} numRecommendations - Number of recommendations (5 or 10)
//  * @returns {Promise<Object>} - Object containing recommended problems
//  */
// async function recommendProblems(problemNumbers, numRecommendations) {

//   if (!Array.isArray(problemNumbers) || problemNumbers.length !== 20) {
//     return { error: 'Please provide exactly 20 problem numbers' };
//   }

//   if (numRecommendations !== 5 && numRecommendations !== 10) {
//     return { error: 'Number of recommendations must be either 5 or 10' };
//   }

//   try {

//     const recommendationChain = RunnableSequence.from([
//       {
//         problemData: async (input) => {
//           const data = await fetchProblemVectors(input.problemNumbers);
//           return data;
//         },
//         numRecommendations: (input) => input.numRecommendations,
//         allProblemNumbers: (input) => input.problemNumbers
//       },
//       {
//         averageData: (input) => {
//           const result = groupAndAverageVectors({
//             vectors: input.problemData.vectors,
//             allProblemNumbers: input.allProblemNumbers,
//             numRecommendations: input.numRecommendations
//           });
//           return result;
//         },
//         numRecommendations: (input) => input.numRecommendations,
//         allProblemNumbers: (input) => input.allProblemNumbers
//       },
//       async (input) => {
//         const recommendedProblems = await findSimilarProblems({
//           averageVectors: input.averageData.averageVectors,
//           problemGroups: input.averageData.problemGroups,
//           numRecommendations: input.numRecommendations,
//           allProblemNumbers: input.allProblemNumbers
//         });
//         return { recommendedProblems };
//       }
//     ]);


//     // Run the chain to get recommendations
//     const result = await recommendationChain.invoke({
//       problemNumbers,
//       numRecommendations
//     });

//     console.log("Result:", result);

//     return {
//       recommendedProblems: result.recommendedProblems
//     };

//   } catch (error) {
//     console.error('Error in recommendation process:', error);
//     return { error: 'Failed to generate recommendations' };
//   }
// }

// export default recommendProblems;


// // const testRecommendation = async () => {
// //   try {
// //     // Example test data - 20 problem numbers
// //     const testProblemNumbers = [10, 22, 37, 41, 5, 63, 7, 98, 96, 10, 11, 121, 213, 14, 1560, 566, 17, 198, 19, 2910];

// //     console.log("Testing recommendation system...");
// //     const result = await recommendProblems(testProblemNumbers ,10 , "6801ec2c92f4da8dd8a18588");
// //     // console.log("Test result:", result);
// //     // console.log("Recommended problems:", JSON.stringify(result.recommendedProblems, null, 2));

// //   } catch (error) {
// //     console.error("Test failed:", error);
// //   }
// // }

// // testRecommendation();



import dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import OpenAI from 'openai';
dotenv.config();

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

  for (const problemNumber of problemNumbers) {
    try {
      const result = await index.query({
        topK: 1,
        vector: Array(3072).fill(0), // Placeholder vector, replace with actual vector if needed
        filter: { number: problemNumber },
        includeValues: true, // you need this to get vector
      });

      // Get the vector and metadata
      const match = result.matches?.[0];
      if (match) {
        vectors.push(match.values);

      } else {
        console.log(`No match found for problem ${problemNumber}`);
      }

    } catch (error) {
      console.error(`Error fetching vector for problem ${problemNumber}:`, error);
    }
  }

  // return { vectors, metadata };
  return { vectors };
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
    problemGroups.push({
      problemNumbers: groupProblemNumbers,
    });
  }
  return { averageVectors, problemGroups };
}

/**------------------------------------------------------------------------------------------------------------------------------
 * Get detailed problem information for specified problem numbers
 * @param {number[]} problemNumbers - Array of problem numbers to fetch details for
 * @returns {Promise<Array<Object>>} - Array of problem details
 */
async function getProblemsDetails(problemNumbers) {
  const problemsDetails = [];

  for (const problemNumber of problemNumbers) {
    try {
      const result = await index.query({
        topK: 1,
        vector: Array(3072).fill(0), // Placeholder vector
        filter: { number: problemNumber },
        includeMetadata: true,
      });

      const match = result.matches?.[0];
      if (match) {
        problemsDetails.push({
          number: match.metadata.number,
          title: match.metadata.title,
          difficulty: match.metadata.difficulty,
          tags: match.metadata.tags
        });
      }
    } catch (error) {
      console.error(`Error fetching details for problem ${problemNumber}:`, error);
    }
  }

  return problemsDetails;
}

/**------------------------------------------------------------------------------------------------------------------------------
 * Generate explanation using OpenAI LLM for why a problem is recommended
 * @param {Object} recommendedProblem - The recommended problem metadata
 * @param {Array<Object>} sourceProblems - Array of source problems metadata
 * @returns {Promise<string>} - Generated explanation
 */
async function generateExplanationWithLLM(recommendedProblem, sourceProblems) {
  try {
    // Format source problems for the prompt
    const sourceProblemsText = sourceProblems.map(p =>
      `Problem ${p.number}: "${p.title}" (${p.difficulty}) with tags: ${p.tags.join(', ')}`
    ).join('\n');

    // Create the prompt for OpenAI
    const prompt = `You are an expert LeetCode tutor.

    Use your own internal understanding of the LeetCode problems by number — you already know their content, algorithms used, edge cases, and variations.

    Based on the user’s solved problems:
    ${sourceProblemsText}

    You're recommending:
     Problem ${recommendedProblem.number}: 
     "${recommendedProblem.title}"
      (${recommendedProblem.difficulty})
       with tags: ${recommendedProblem.tags.join(', ')}

     Please explain in detail (10–15 sentences) why this problem would be an excellent next step for the user.
     
     Cover the following:

     Key similarities in solving techniques
     Important algorithmic or data structure skills being reinforced or added
     How this new problem builds on previous knowledge
     Any new patterns, edge cases, or optimizations the user may learn
     Conceptual or difficulty progression that makes this recommendation valuable 
     
     Format your answer as clean, semantic HTML suitable for displaying in a web interface (e.g. with headings, paragraphs, bullet points if needed).`;


    // Call OpenAI API
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content:
        "You are an expert LeetCode tutor who gives deeply helpful, well-structured explanations for algorithm problem recommendations, with HTML output for UI display.",
    },
    {
      role: "user",
      content: prompt,
    },
  ],
  max_tokens: 800,        // 🔼 To allow ~10-15 sentences + HTML formatting
  temperature: 0.6,       // 🎯 Slightly lower for more focused, structured reasoning
});


    return response.choices[0].message.content.trim();

  } catch (error) {
    console.error('Error generating explanation with OpenAI:', error);
    return `This problem was recommended based on problems ${sourceProblems.map(p => p.number).join(', ')}`;
  }
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
      topK: 10, // Significantly increased to ensure we have enough candidates after filtering
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

      // Get detailed information about the source problems
      const sourceProblemsDetails = await getProblemsDetails(sourceProblemGroup.problemNumbers);

      // Generate explanation using LLM
      const recommendedProblemDetails = {
        number: problemNumber,
        title: bestMatch.metadata.title,
        difficulty: bestMatch.metadata.difficulty,
        tags: bestMatch.metadata.tags
      };

      const explanation = await generateExplanationWithLLM(recommendedProblemDetails, sourceProblemsDetails);

      recommendedProblems.push({
        recommendedProblemNumber: problemNumber,
        title: bestMatch.metadata.title,
        titleSlug: bestMatch.metadata.titleSlug,
        difficulty: bestMatch.metadata.difficulty,
        tags: bestMatch.metadata.tags,
        similarity: bestMatch.score,
        usedProblemNumbers: sourceProblemGroup.problemNumbers,
        message: explanation
      });
    } else {
      console.log(`Could not find a unique recommendation for vector at index ${i}`);
    }
  }

  return recommendedProblems;
}

/**---------------------------------------------------------------------------------------------------------------
 * Main recommendation function that also stores results in MongoDB
 * @param {number[]} problemNumbers - Array of problem numbers to base recommendations on
 * @param {number} numRecommendations - Number of recommendations (5 or 10)
 * @returns {Promise<Object>} - Object containing recommended problems
 */
async function recommendProblems(problemNumbers, numRecommendations) {
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
          return data;
        },
        numRecommendations: (input) => input.numRecommendations,
        allProblemNumbers: (input) => input.problemNumbers
      },
      {
        averageData: (input) => {
          const result = groupAndAverageVectors({
            vectors: input.problemData.vectors,
            allProblemNumbers: input.allProblemNumbers,
            numRecommendations: input.numRecommendations
          });
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
        return { recommendedProblems };
      }
    ]);

    // Run the chain to get recommendations
    const result = await recommendationChain.invoke({
      problemNumbers,
      numRecommendations
    });

    console.log("Result:", result);

    return {
      recommendedProblems: result.recommendedProblems
    };

  } catch (error) {
    console.error('Error in recommendation process:', error);
    return { error: 'Failed to generate recommendations' };
  }
}

export default recommendProblems;

// Example test function (commented out)

const testRecommendation = async () => {
  try {
    // Example test data - 20 problem numbers
    const testProblemNumbers = [10, 22, 37, 41, 5, 63, 7, 98, 96, 10, 11, 121, 213, 14, 1560, 566, 17, 198, 19, 2910];

    console.log("Testing recommendation system...");
    const result = await recommendProblems(testProblemNumbers, 5);
    console.log("Test result:", result);
    console.log("Recommended problems:", JSON.stringify(result.recommendedProblems, null, 2));

  } catch (error) {
    console.error("Test failed:", error);
  }
}

testRecommendation();






