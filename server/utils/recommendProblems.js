
// //-------------------------------------------------------------------------------------------------

// import dotenv from 'dotenv';
// import { Pinecone } from '@pinecone-database/pinecone';
// import { RunnableSequence } from '@langchain/core/runnables';
// import { ChatOpenAI } from '@langchain/openai';
// import { PineconeStore } from '@langchain/pinecone';
// import { OpenAIEmbeddings } from '@langchain/openai';
// import { StringOutputParser } from '@langchain/core/output_parsers';
// import { PromptTemplate } from '@langchain/core/prompts';
// dotenv.config();

// // Initialize OpenAI Components - create once and reuse
// const llm = new ChatOpenAI({
//   modelName: "gpt-4o",
//   temperature: 0.6,
//   maxTokens: 800,
// });

// const embeddings = new OpenAIEmbeddings({
//   modelName: "text-embedding-ada-002",
// });

// // Initialize Pinecone client once
// const pinecone = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY,
// });

// // Initialize Pinecone index once
// const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

// // Initialize Pinecone via LangChain for vector operations
// let pineconeStore;
// async function initPineconeStore() {
//   if (!pineconeStore) {
//     pineconeStore = await PineconeStore.fromExistingIndex(embeddings, { 
//       pineconeIndex: index
//     });
//   }
//   return pineconeStore;
// }

// // Setup LLM prompt template for explanations
// const explanationPromptTemplate = PromptTemplate.fromTemplate(`You are an expert LeetCode tutor.

// Use your own internal understanding of the LeetCode problems by number — you already know their content, algorithms used, edge cases, and variations.

// The user has solved these problems:
// {sourceProblemsText}

// You're recommending:
// Problem {recommendedProblemNumber}: "{recommendedProblemTitle}" ({recommendedProblemDifficulty}) with tags: {recommendedProblemTags}

// Please explain in detail (10-15 sentences) why this problem would be an excellent next step for the user.

// Cover the following:

// Key similarities in solving techniques
// Important algorithmic or data structure skills being reinforced or added
// How this new problem builds on previous knowledge
// Any new patterns, edge cases, or optimizations the user may learn
// Conceptual or difficulty progression that makes this recommendation valuable

// Format your answer as clean, semantic HTML suitable for displaying in a web interface (e.g. with headings, paragraphs, bullet points if needed).`);

// /**
//  * Fetch problem details and vectors from Pinecone in batches
//  * @param {number[]} problemNumbers - Array of LeetCode problem numbers
//  * @returns {Promise<Object>} - Object containing problem vectors and metadata
//  */
// async function fetchProblemsData(problemNumbers) {
//   // Create batches for more efficient querying (10 problems per batch)
//   const batchSize = 10;
//   const batches = [];
  
//   for (let i = 0; i < problemNumbers.length; i += batchSize) {
//     batches.push(problemNumbers.slice(i, i + batchSize));
//   }

//   const allProblems = [];
//   const vectors = [];
  
//   // Process each batch concurrently
//   const batchResults = await Promise.all(batches.map(async (batch) => {
//     // Create filter for batch of problem numbers
//     const filter = {
//       number: { $in: batch }
//     };
    
//     // Execute a single query for the batch with real filter
//     const result = await index.query({
//       topK: batch.length,
//       vector: Array(3072).fill(0), // Placeholder vector is fine here as we're using filters
//       filter: filter,
//       includeValues: true,
//       includeMetadata: true,
//     });
    
//     return result.matches;
//   }));
  
//   // Flatten results and organize data
//   const allMatches = batchResults.flat();
  
//   // Map results to problems by number for easy lookup
//   const problemsMap = new Map();
  
//   allMatches.forEach(match => {
//     if (match) {
//       problemsMap.set(match.metadata.number, {
//         vector: match.values,
//         metadata: match.metadata
//       });
//     }
//   });
  
//   // Ensure we have data for each requested problem in the original order
//   problemNumbers.forEach(number => {
//     const problemData = problemsMap.get(number);
//     if (problemData) {
//       vectors.push(problemData.vector);
//       allProblems.push({
//         number: problemData.metadata.number,
//         title: problemData.metadata.title,
//         difficulty: problemData.metadata.difficulty,
//         tags: problemData.metadata.tags || []
//       });
//     } else {
//       console.log(`No data found for problem ${number}`);
//     }
//   });
  
//   return { vectors, allProblems };
// }

// /**
//  * Calculate the average of an array of vectors
//  * @param {Array<Array<number>>} vectors - Array of vectors to average
//  * @returns {Array<number>} - The average vector
//  */
// function calculateAverageVector(vectors) {
//   if (vectors.length === 0) return [];
  
//   const dimension = vectors[0].length;
//   const average = new Float32Array(dimension); // Using typed arrays for better performance
  
//   // Optimized vector averaging
//   for (const vector of vectors) {
//     for (let i = 0; i < dimension; i++) {
//       average[i] += vector[i];
//     }
//   }
  
//   const divisor = 1.0 / vectors.length;
//   for (let i = 0; i < dimension; i++) {
//     average[i] *= divisor; // Multiply by reciprocal is faster than division
//   }
  
//   return Array.from(average); // Convert back to regular array for compatibility
// }

// /**
//  * Group vectors and calculate the average for each group
//  * @param {Object} input - Object containing vectors and number of recommendations
//  * @returns {Object} - Object containing average vectors and problem groups
//  */
// function groupAndAverageVectors({ vectors, allProblems, numRecommendations }) {
//   const averageVectors = [];
//   const problemGroups = [];
  
//   // Determine group size based on number of recommendations
//   const groupSize = numRecommendations === 5 ? 4 : 2;
  
//   for (let i = 0; i < vectors.length; i += groupSize) {
//     // Get the vectors for this group
//     const groupVectors = vectors.slice(i, Math.min(i + groupSize, vectors.length));
//     const groupProblems = allProblems.slice(i, Math.min(i + groupSize, allProblems.length));
    
//     // Calculate the average vector
//     const avgVector = calculateAverageVector(groupVectors);
//     averageVectors.push(avgVector);
    
//     // Track which problems contributed to this group
//     problemGroups.push({
//       problems: groupProblems,
//       problemNumbers: groupProblems.map(p => p.number)
//     });
//   }
  
//   return { averageVectors, problemGroups };
// }

// /**
//  * Find similar problems from Pinecone using batch queries
//  * @param {Object} input - Object containing average vectors, problem groups, and other data
//  * @returns {Promise<Array<Object>>} - Raw recommended problems
//  */
// // async function findSimilarProblems({ averageVectors, problemGroups, numRecommendations, allProblemNumbers, includeHard }) {
// //   // Batch the vector queries for better performance
// //   const batchSize = 5; // Process 5 vectors at a time
// //   const batches = [];
  
// //   for (let i = 0; i < averageVectors.length; i += batchSize) {
// //     batches.push({
// //       vectors: averageVectors.slice(i, i + batchSize),
// //       groups: problemGroups.slice(i, i + batchSize),
// //       indices: Array.from({ length: Math.min(batchSize, averageVectors.length - i) }, (_, idx) => i + idx)
// //     });
// //   }
  
// //   const allCandidates = [];
  
// //   // Process each batch of queries concurrently
// //   await Promise.all(batches.map(async (batch) => {
// //     // Perform multiple vector queries in parallel
// //     const queryResults = await Promise.all(batch.vectors.map(vector => 
// //       index.query({
// //         vector: vector,
// //         topK: 15, // Increased to ensure enough candidates after filtering
// //         includeMetadata: true
// //       })
// //     ));
    
// //     // Process results for each vector in this batch
// //     for (let i = 0; i < queryResults.length; i++) {
// //       const queryResponse = queryResults[i];
// //       const originalIndex = batch.indices[i];
// //       const sourceProblemGroup = batch.groups[i];
      
// //       // Add batch results to candidates list
// //       allCandidates.push({
// //         matches: queryResponse.matches,
// //         sourceGroup: sourceProblemGroup,
// //         index: originalIndex
// //       });
// //     }
// //   }));
  
// //   // Set of already selected problem numbers to avoid duplicates
// //   const selectedProblems = new Set(allProblemNumbers);
// //   const recommendations = [];
  
// //   // Process all candidates to select the best matches
// //   for (const candidate of allCandidates) {
// //     // Filter valid matches that haven't been recommended yet
// //     const validMatches = candidate.matches.filter(match => {
// //       const problemNumber = match.metadata.number;
// //       const notAlreadySelected = !selectedProblems.has(problemNumber);
// //       const validDifficulty = includeHard || match.metadata.difficulty !== "Hard";
// //       return notAlreadySelected && validDifficulty;
// //     });
    
// //     // Select the best match if available
// //     if (validMatches.length > 0) {
// //       const bestMatch = validMatches[0];
// //       const problemNumber = bestMatch.metadata.number;
      
// //       // Mark as selected to avoid duplicates
// //       selectedProblems.add(problemNumber);
      
// //       // Add to recommendations
// //       recommendations.push({
// //         recommendedProblemNumber: problemNumber,
// //         title: bestMatch.metadata.title,
// //         titleSlug: bestMatch.metadata.titleSlug || bestMatch.metadata.title.toLowerCase().replace(/\s+/g, '-'),
// //         difficulty: bestMatch.metadata.difficulty,
// //         tags: bestMatch.metadata.tags || [],
// //         similarity: bestMatch.score,
// //         usedProblemNumbers: candidate.sourceGroup.problemNumbers,
// //         sourceProblems: candidate.sourceGroup.problems,
// //         index: candidate.index
// //       });
// //     }
// //   }
  
// //   // Sort recommendations to maintain original order
// //   recommendations.sort((a, b) => a.index - b.index);
  
// //   return recommendations.slice(0, numRecommendations); // Limit to requested number
// // }


// async function findSimilarProblems({ averageVectors, problemGroups, numRecommendations, allProblemNumbers, includeHard }) {
//   // Batch the vector queries for better performance
//   const batchSize = 5; // Process 5 vectors at a time
//   const batches = [];
  
//   for (let i = 0; i < averageVectors.length; i += batchSize) {
//     batches.push({
//       vectors: averageVectors.slice(i, i + batchSize),
//       groups: problemGroups.slice(i, i + batchSize),
//       indices: Array.from({ length: Math.min(batchSize, averageVectors.length - i) }, (_, idx) => i + idx)
//     });
//   }
  
//   const allCandidates = [];
  
//   // Process each batch of queries concurrently
//   await Promise.all(batches.map(async (batch) => {
//     // Perform multiple vector queries in parallel
//     const queryResults = await Promise.all(batch.vectors.map(vector => 
//       index.query({
//         vector: vector,
//         topK: 15, // Increased to ensure enough candidates after filtering
//         includeMetadata: true
//       })
//     ));
    
//     // Process results for each vector in this batch
//     for (let i = 0; i < queryResults.length; i++) {
//       const queryResponse = queryResults[i];
//       const originalIndex = batch.indices[i];
//       const sourceProblemGroup = batch.groups[i];
      
//       // Add batch results to candidates list
//       allCandidates.push({
//         matches: queryResponse.matches,
//         sourceGroup: sourceProblemGroup,
//         index: originalIndex
//       });
//     }
//   }));
  
//   // Set of already selected problem numbers to avoid duplicates
//   const selectedProblems = new Set(allProblemNumbers);
//   const recommendations = [];
  
//   // Process all candidates to select the best matches
//   for (const candidate of allCandidates) {
//     // Filter valid matches that haven't been recommended yet
//     const validMatches = candidate.matches.filter(match => {
//       const problemNumber = match.metadata.number;
//       const difficulty = match.metadata.difficulty;
      
//       // Check if problem is already selected
//       const notAlreadySelected = !selectedProblems.has(problemNumber);
      
//       // Check difficulty constraint
//       // If includeHard is true: allow all difficulties (including Hard)
//       // If includeHard is false: exclude Hard problems
//       const meetsDifficultyRequirement = includeHard ? true : difficulty !== "Hard";
      
//       return notAlreadySelected && meetsDifficultyRequirement;
//     });
    
//     // Select the best match if available
//     if (validMatches.length > 0) {
//       const bestMatch = validMatches[0];
//       const problemNumber = bestMatch.metadata.number;
      
//       // Mark as selected to avoid duplicates
//       selectedProblems.add(problemNumber);
      
//       // Add to recommendations
//       recommendations.push({
//         recommendedProblemNumber: problemNumber,
//         title: bestMatch.metadata.title,
//         titleSlug: bestMatch.metadata.titleSlug || bestMatch.metadata.title.toLowerCase().replace(/\s+/g, '-'),
//         difficulty: bestMatch.metadata.difficulty,
//         tags: bestMatch.metadata.tags || [],
//         similarity: bestMatch.score,
//         usedProblemNumbers: candidate.sourceGroup.problemNumbers,
//         sourceProblems: candidate.sourceGroup.problems,
//         index: candidate.index
//       });
//     }
//   }
  
//   // Sort recommendations to maintain original order
//   recommendations.sort((a, b) => a.index - b.index);
  
//   return recommendations.slice(0, numRecommendations); // Limit to requested number
// }

// /**
//  * Generate explanations for all recommendations in a single batch
//  * @param {Array<Object>} recommendations - Array of recommendation objects
//  * @returns {Promise<Array<Object>>} - Updated recommendations with explanations
//  */
// async function generateExplanationsInBatch(recommendations) {
//   // Prepare all LLM inputs at once
//   const promptInputs = recommendations.map(rec => {
//     const sourceProblemsText = rec.sourceProblems.map(p => 
//       `Problem ${p.number}: "${p.title}" (${p.difficulty}) with tags: ${p.tags.join(', ')}`
//     ).join('\n');
    
//     return {
//       sourceProblemsText,
//       recommendedProblemNumber: rec.recommendedProblemNumber,
//       recommendedProblemTitle: rec.title,
//       recommendedProblemDifficulty: rec.difficulty,
//       recommendedProblemTags: rec.tags.join(', ')
//     };
//   });
  
//   // Create LangChain chain for generating explanations
//   const explanationChain = explanationPromptTemplate
//     .pipe(llm)
//     .pipe(new StringOutputParser());
  
//   try {
//     // Generate all explanations in parallel
//     const explanations = await Promise.all(
//       promptInputs.map(input => explanationChain.invoke(input))
//     );
    
//     // Update recommendations with explanations
//     for (let i = 0; i < recommendations.length; i++) {
//       recommendations[i].message = explanations[i];
//     }
    
//   } catch (error) {
//     console.error('Error generating batch explanations:', error);
//     // Fallback for any failures
//     for (let i = 0; i < recommendations.length; i++) {
//       if (!recommendations[i].message) {
//         recommendations[i].message = `This problem was recommended based on problems ${recommendations[i].usedProblemNumbers.join(', ')}`;
//       }
//     }
//   }
  
//   return recommendations;
// }

// /**
//  * Main recommendation function
//  * @param {number[]} problemNumbers - Array of problem numbers to base recommendations on
//  * @param {number} numRecommendations - Number of recommendations (5 or 10)
//  * @param {boolean} includeHard - Whether to include Hard difficulty problems
//  * @returns {Promise<Object>} - Object containing recommended problems
//  */
// async function recommendProblems(problemNumbers, numRecommendations, includeHard ) {
//   // Input validation
//   console.log("Input problem numbers:", problemNumbers);
//   console.log("Input number of recommendations:", numRecommendations);
//   console.log("Input includeHard:", includeHard);
  
//   if (!Array.isArray(problemNumbers) || problemNumbers.length !== 20) {
//     return { error: 'Please provide exactly 20 problem numbers' };
//   }
  
//   if (numRecommendations !== 5 && numRecommendations !== 10) {
//     return { error: 'Number of recommendations must be either 5 or 10' };
//   }
  
//   try {
//     // Initialize services if needed
//     await initPineconeStore();
    
//     // Create a more efficient recommendation pipeline
//     const recommendationChain = RunnableSequence.from([
//       // Step 1: Fetch problem data in batches
//       async (input) => {
//         console.time('fetchData');
//         const data = await fetchProblemsData(input.problemNumbers);
//         console.timeEnd('fetchData');
//         return {
//           ...input,
//           problemData: data
//         };
//       },
      
//       // Step 2: Group and average vectors
//       (input) => {
//         console.time('groupVectors');
//         const result = groupAndAverageVectors({
//           vectors: input.problemData.vectors,
//           allProblems: input.problemData.allProblems,
//           numRecommendations: input.numRecommendations
//         });
//         console.timeEnd('groupVectors');
//         return {
//           ...input,
//           averageData: result
//         };
//       },
      
//       // Step 3: Find similar problems
//       async (input) => {
//         console.time('findSimilar');
//         const rawRecommendations = await findSimilarProblems({
//           averageVectors: input.averageData.averageVectors,
//           problemGroups: input.averageData.problemGroups,
//           numRecommendations: input.numRecommendations,
//           allProblemNumbers: input.problemNumbers,
//           includeHard: input.includeHard
//         });
//         console.timeEnd('findSimilar');
//         return {
//           ...input,
//           rawRecommendations
//         };
//       },
      
//       // Step 4: Generate explanations in batch
//       async (input) => {
//         console.time('generateExplanations');
//         const recommendedProblems = await generateExplanationsInBatch(input.rawRecommendations);
//         console.timeEnd('generateExplanations');
//         return { recommendedProblems };
//       }
//     ]);
    
//     // Run the optimized chain
//     console.time('totalRecommendation');
//     const result = await recommendationChain.invoke({
//       problemNumbers,
//       numRecommendations,
//       includeHard
//     });
//     console.timeEnd('totalRecommendation');
    
//     return {
//       recommendedProblems: result.recommendedProblems
//     };
    
//   } catch (error) {
//     console.error('Error in recommendation process:', error);
//     return { error: 'Failed to generate recommendations', details: error.message };
//   }
// }

// export default recommendProblems;

// // Example test function (commented out)

// // const testRecommendation = async () => {
// //   try {
// //     // Example test data - 20 problem numbers
// //     const testProblemNumbers = [10, 22, 373, 41, 5, 673, 7, 98, 96, 100, 11, 121, 213, 14, 1560, 566, 17, 198, 19, 2910];
    
// //     console.log("Testing recommendation system...");
// //     console.time('totalTest');
// //     const result = await recommendProblems(testProblemNumbers, 5, false);
// //     console.timeEnd('totalTest');
// //     console.log("Recommended problems:", JSON.stringify(result.recommendedProblems, null, 2));
    
// //   } catch (error) {
// //     console.error("Test failed:", error);
// //   }
// // }

// // testRecommendation();


import dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';

// Ensure dotenv is loaded
dotenv.config();

// Validate environment variables
const validateEnvVars = () => {
  const required = ['PINECONE_API_KEY', 'PINECONE_INDEX_NAME', 'OPENAI_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Initialize components with proper error handling
let llm, embeddings, pinecone, index, pineconeStore;
let isInitialized = false;

const initializeServices = async () => {
  if (isInitialized) return;
  
  try {
    validateEnvVars();
    
    // Initialize OpenAI Components
    llm = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.6,
      maxTokens: 800,
      openAIApiKey: process.env.OPENAI_API_KEY, // Explicitly pass API key
    });

    embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-ada-002",
      openAIApiKey: process.env.OPENAI_API_KEY, // Explicitly pass API key
    });

    // Initialize Pinecone client
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // Initialize Pinecone index
    index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    // Test connection
    await index.describeIndexStats();
    console.log('Pinecone connection established successfully');
    
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize services:', error);
    throw error;
  }
};

// Initialize Pinecone via LangChain for vector operations
async function initPineconeStore() {
  if (!pineconeStore) {
    await initializeServices(); // Ensure services are initialized first
    pineconeStore = await PineconeStore.fromExistingIndex(embeddings, { 
      pineconeIndex: index
    });
  }
  return pineconeStore;
}

// Setup LLM prompt template for explanations
const explanationPromptTemplate = PromptTemplate.fromTemplate(`You are an expert LeetCode tutor.

Use your own internal understanding of the LeetCode problems by number — you already know their content, algorithms used, edge cases, and variations.

The user has solved these problems:
{sourceProblemsText}

You're recommending:
Problem {recommendedProblemNumber}: "{recommendedProblemTitle}" ({recommendedProblemDifficulty}) with tags: {recommendedProblemTags}

Please explain in detail (10-15 sentences) why this problem would be an excellent next step for the user.

Cover the following:

Key similarities in solving techniques
Important algorithmic or data structure skills being reinforced or added
How this new problem builds on previous knowledge
Any new patterns, edge cases, or optimizations the user may learn
Conceptual or difficulty progression that makes this recommendation valuable

Format your answer as clean, semantic HTML suitable for displaying in a web interface (e.g. with headings, paragraphs, bullet points if needed).`);

/**
 * Fetch problem details and vectors from Pinecone in batches
 */
async function fetchProblemsData(problemNumbers) {
  await initializeServices(); // Ensure services are initialized
  
  const batchSize = 10;
  const batches = [];
  
  for (let i = 0; i < problemNumbers.length; i += batchSize) {
    batches.push(problemNumbers.slice(i, i + batchSize));
  }

  const allProblems = [];
  const vectors = [];
  
  try {
    // Process each batch concurrently
    const batchResults = await Promise.all(batches.map(async (batch) => {
      const filter = {
        number: { $in: batch }
      };
      
      const result = await index.query({
        topK: batch.length,
        vector: Array(3072).fill(0),
        filter: filter,
        includeValues: true,
        includeMetadata: true,
      });
      
      return result.matches;
    }));
    
    // Flatten results and organize data
    const allMatches = batchResults.flat();
    const problemsMap = new Map();
    
    allMatches.forEach(match => {
      if (match) {
        problemsMap.set(match.metadata.number, {
          vector: match.values,
          metadata: match.metadata
        });
      }
    });
    
    // Ensure we have data for each requested problem in the original order
    problemNumbers.forEach(number => {
      const problemData = problemsMap.get(number);
      if (problemData) {
        vectors.push(problemData.vector);
        allProblems.push({
          number: problemData.metadata.number,
          title: problemData.metadata.title,
          difficulty: problemData.metadata.difficulty,
          tags: problemData.metadata.tags || []
        });
      } else {
        console.log(`No data found for problem ${number}`);
      }
    });
    
    return { vectors, allProblems };
  } catch (error) {
    console.error('Error fetching problems data:', error);
    throw error;
  }
}

/**
 * Calculate the average of an array of vectors
 */
function calculateAverageVector(vectors) {
  if (vectors.length === 0) return [];
  
  const dimension = vectors[0].length;
  const average = new Float32Array(dimension);
  
  for (const vector of vectors) {
    for (let i = 0; i < dimension; i++) {
      average[i] += vector[i];
    }
  }
  
  const divisor = 1.0 / vectors.length;
  for (let i = 0; i < dimension; i++) {
    average[i] *= divisor;
  }
  
  return Array.from(average);
}

/**
 * Group vectors and calculate the average for each group
 */
function groupAndAverageVectors({ vectors, allProblems, numRecommendations }) {
  const averageVectors = [];
  const problemGroups = [];
  
  const groupSize = numRecommendations === 5 ? 4 : 2;
  
  for (let i = 0; i < vectors.length; i += groupSize) {
    const groupVectors = vectors.slice(i, Math.min(i + groupSize, vectors.length));
    const groupProblems = allProblems.slice(i, Math.min(i + groupSize, allProblems.length));
    
    const avgVector = calculateAverageVector(groupVectors);
    averageVectors.push(avgVector);
    
    problemGroups.push({
      problems: groupProblems,
      problemNumbers: groupProblems.map(p => p.number)
    });
  }
  
  return { averageVectors, problemGroups };
}

/**
 * Find similar problems from Pinecone using batch queries
 */
async function findSimilarProblems({ averageVectors, problemGroups, numRecommendations, allProblemNumbers, includeHard }) {
  await initializeServices(); // Ensure services are initialized
  
  const batchSize = 5;
  const batches = [];
  
  for (let i = 0; i < averageVectors.length; i += batchSize) {
    batches.push({
      vectors: averageVectors.slice(i, i + batchSize),
      groups: problemGroups.slice(i, i + batchSize),
      indices: Array.from({ length: Math.min(batchSize, averageVectors.length - i) }, (_, idx) => i + idx)
    });
  }
  
  const allCandidates = [];
  
  try {
    // Process each batch of queries concurrently
    await Promise.all(batches.map(async (batch) => {
      const queryResults = await Promise.all(batch.vectors.map(vector => 
        index.query({
          vector: vector,
          topK: 15,
          includeMetadata: true
        })
      ));
      
      for (let i = 0; i < queryResults.length; i++) {
        const queryResponse = queryResults[i];
        const originalIndex = batch.indices[i];
        const sourceProblemGroup = batch.groups[i];
        
        allCandidates.push({
          matches: queryResponse.matches,
          sourceGroup: sourceProblemGroup,
          index: originalIndex
        });
      }
    }));
    
    const selectedProblems = new Set(allProblemNumbers);
    const recommendations = [];
    
    for (const candidate of allCandidates) {
      const validMatches = candidate.matches.filter(match => {
        const problemNumber = match.metadata.number;
        const difficulty = match.metadata.difficulty;
        
        const notAlreadySelected = !selectedProblems.has(problemNumber);
        const meetsDifficultyRequirement = includeHard ? true : difficulty !== "Hard";
        
        return notAlreadySelected && meetsDifficultyRequirement;
      });
      
      if (validMatches.length > 0) {
        const bestMatch = validMatches[0];
        const problemNumber = bestMatch.metadata.number;
        
        selectedProblems.add(problemNumber);
        
        recommendations.push({
          recommendedProblemNumber: problemNumber,
          title: bestMatch.metadata.title,
          titleSlug: bestMatch.metadata.titleSlug || bestMatch.metadata.title.toLowerCase().replace(/\s+/g, '-'),
          difficulty: bestMatch.metadata.difficulty,
          tags: bestMatch.metadata.tags || [],
          similarity: bestMatch.score,
          usedProblemNumbers: candidate.sourceGroup.problemNumbers,
          sourceProblems: candidate.sourceGroup.problems,
          index: candidate.index
        });
      }
    }
    
    recommendations.sort((a, b) => a.index - b.index);
    return recommendations.slice(0, numRecommendations);
  } catch (error) {
    console.error('Error finding similar problems:', error);
    throw error;
  }
}

/**
 * Generate explanations for all recommendations in a single batch
 */
async function generateExplanationsInBatch(recommendations) {
  await initializeServices(); // Ensure services are initialized
  
  const promptInputs = recommendations.map(rec => {
    const sourceProblemsText = rec.sourceProblems.map(p => 
      `Problem ${p.number}: "${p.title}" (${p.difficulty}) with tags: ${p.tags.join(', ')}`
    ).join('\n');
    
    return {
      sourceProblemsText,
      recommendedProblemNumber: rec.recommendedProblemNumber,
      recommendedProblemTitle: rec.title,
      recommendedProblemDifficulty: rec.difficulty,
      recommendedProblemTags: rec.tags.join(', ')
    };
  });
  
  const explanationChain = explanationPromptTemplate
    .pipe(llm)
    .pipe(new StringOutputParser());
  
  try {
    const explanations = await Promise.all(
      promptInputs.map(input => explanationChain.invoke(input))
    );
    
    for (let i = 0; i < recommendations.length; i++) {
      recommendations[i].message = explanations[i];
    }
    
  } catch (error) {
    console.error('Error generating batch explanations:', error);
    for (let i = 0; i < recommendations.length; i++) {
      if (!recommendations[i].message) {
        recommendations[i].message = `This problem was recommended based on problems ${recommendations[i].usedProblemNumbers.join(', ')}`;
      }
    }
  }
  
  return recommendations;
}

/**
 * Main recommendation function
 */
async function recommendProblems(problemNumbers, numRecommendations, includeHard) {
  console.log("Input problem numbers:", problemNumbers);
  console.log("Input number of recommendations:", numRecommendations);
  console.log("Input includeHard:", includeHard);
  
  // Input validation
  if (!Array.isArray(problemNumbers) || problemNumbers.length !== 20) {
    return { error: 'Please provide exactly 20 problem numbers' };
  }
  
  if (numRecommendations !== 5 && numRecommendations !== 10) {
    return { error: 'Number of recommendations must be either 5 or 10' };
  }
  
  // Convert string numbers to integers - THIS IS THE KEY FIX
  const convertedProblemNumbers = problemNumbers.map(num => {
    const converted = typeof num === 'string' ? parseInt(num, 10) : num;
    if (isNaN(converted)) {
      throw new Error(`Invalid problem number: ${num}`);
    }
    return converted;
  });
  
  console.log("Converted problem numbers:", convertedProblemNumbers);
  
  try {
    // Ensure all services are initialized before proceeding
    await initializeServices();
    await initPineconeStore();
    
    const recommendationChain = RunnableSequence.from([
      async (input) => {
        console.time('fetchData');
        const data = await fetchProblemsData(input.problemNumbers);
        console.timeEnd('fetchData');
        return {
          ...input,
          problemData: data
        };
      },
      
      (input) => {
        console.time('groupVectors');
        const result = groupAndAverageVectors({
          vectors: input.problemData.vectors,
          allProblems: input.problemData.allProblems,
          numRecommendations: input.numRecommendations
        });
        console.timeEnd('groupVectors');
        return {
          ...input,
          averageData: result
        };
      },
      
      async (input) => {
        console.time('findSimilar');
        const rawRecommendations = await findSimilarProblems({
          averageVectors: input.averageData.averageVectors,
          problemGroups: input.averageData.problemGroups,
          numRecommendations: input.numRecommendations,
          allProblemNumbers: input.problemNumbers,
          includeHard: input.includeHard
        });
        console.timeEnd('findSimilar');
        return {
          ...input,
          rawRecommendations
        };
      },
      
      async (input) => {
        console.time('generateExplanations');
        const recommendedProblems = await generateExplanationsInBatch(input.rawRecommendations);
        console.timeEnd('generateExplanations');
        return { recommendedProblems };
      }
    ]);
    
    console.time('totalRecommendation');
    const result = await recommendationChain.invoke({
      problemNumbers: convertedProblemNumbers, // Use converted numbers
      numRecommendations,
      includeHard
    });
    console.timeEnd('totalRecommendation');
    
    return {
      recommendedProblems: result.recommendedProblems
    };
    
  } catch (error) {
    console.error('Error in recommendation process:', error);
    return { error: 'Failed to generate recommendations', details: error.message };
  }
}

export default recommendProblems;