

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
      maxTokens: 1200,
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




// const explanationPromptTemplate = PromptTemplate.fromTemplate(`You are an expert LeetCode tutor.

// Use your own internal understanding of the LeetCode problems by number — you already know their content, algorithms used, edge cases, and variations.

// The user has solved these problems:
// {sourceProblemsText}

// You're recommending:
// Problem {recommendedProblemNumber}: "{recommendedProblemTitle}" ({recommendedProblemDifficulty}) with tags: {recommendedProblemTags}

// Please explain in detail ( 400-500 words)  why this problem would be an excellent next step for the user , choose slighty easy words .

// Cover the following:

// Key similarities in solving techniques
// Important algorithmic or data structure skills being reinforced or added
// How this new problem builds on previous knowledge
// Any new patterns, edge cases, or optimizations the user may learn
// Conceptual or difficulty progression that makes this recommendation valuable

// IMPORTANT: Format your response as clean, semantic HTML that is ready to display directly in a web interface. Use these specific styles:

// - Main heading: <h2 style="color: #1f2937; font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; margin-top: 1.5rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem;">
// - Sub headings: <h3 style="color: #374151; font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1.25rem;">
// - Paragraphs: <p style="color: #4b5563; line-height: 1.6; margin-bottom: 1rem;">
// - Lists: <ul style="margin-bottom: 1rem;">
// - List items: <li style="color: #4b5563; margin-bottom: 0.25rem; line-height: 1.5;">
// - Bold text: <strong style="color: #1f2937; font-weight: 600;">

// Do NOT use code blocks, markdown, or any wrapper formatting. Return only the styled HTML content that can be directly inserted into a web page.

// For the first heading, do NOT add margin-top since it will be the first element.`);






const explanationPromptTemplate = PromptTemplate.fromTemplate(`You are an expert LeetCode tutor with a supportive and encouraging tone. Your goal is to explain why a recommended problem is an excellent next step for a user, using simple, clear language. Imagine you are explaining this to someone who is just learning these concepts.

User's solved problems:
{sourceProblemsText}

Problem being recommended:
Problem {recommendedProblemNumber}: "{recommendedProblemTitle}" ({recommendedProblemDifficulty}) with tags: {recommendedProblemTags}

Please provide a detailed explanation (500-600 words) covering the following points:

Cover the following:

(1).Key Similarities in Solving Techniques: Explain how the recommended problem shares solving techniques with the user's previously solved problems. For each similarity, mention the full name of the past problem (e.g., "Problem X: 'Problem Name'") and briefly recall how that technique was applied in the past problem to help the user connect their previous experience to the new challenge.
(2).Important Algorithmic or Data Structure Skills Being Reinforced or Added: Describe the specific algorithmic or data structure skills the user will strengthen or gain.
(3).How This New Problem Builds on Previous Knowledge: Clearly explain how this new problem extends or builds upon the concepts the user has already learned and applied in their solved problems, again referring to past problems by their full names when relevant.
(4).Any New Patterns, Edge Cases, or Optimizations the User May Learn: Highlight any new problem patterns, specific edge cases to watch out for, or optimization techniques the user will encounter and learn to handle.
(5).Conceptual or Difficulty Progression That Makes This Recommendation Valuable: Explain the logical progression in difficulty or concept that makes this problem a worthwhile next step.


IMPORTANT: Format your response as clean, semantic HTML that is ready to display directly in a web interface. Use these specific styles:

- Main heading: <h2 style="color: #1f2937; font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; margin-top: 1.5rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem;">
- Sub headings: <h3 style="color: #374151; font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1.25rem;">
- Paragraphs: <p style="color: #4b5563; line-height: 1.6; margin-bottom: 1rem;">
- Lists: <ul style="margin-bottom: 1rem;">
- List items: <li style="color: #4b5563; margin-bottom: 0.25rem; line-height: 1.5;">
- Bold text: <strong style="color: #1f2937; font-weight: 600;">

Do NOT use code blocks, markdown, or any wrapper formatting.
Return only the styled HTML content that can be directly inserted into a web page.
For the first heading, do NOT add margin-top since it will be the first element `)


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














// import dotenv from 'dotenv';
// import { Pinecone } from '@pinecone-database/pinecone';
// import { RunnableSequence } from '@langchain/core/runnables';
// import { ChatOpenAI } from '@langchain/openai';
// import { PineconeStore } from '@langchain/pinecone';
// import { OpenAIEmbeddings } from '@langchain/openai';
// import { StringOutputParser } from '@langchain/core/output_parsers';
// import { PromptTemplate } from '@langchain/core/prompts';

// // Ensure dotenv is loaded
// dotenv.config();

// // Validate environment variables
// const validateEnvVars = () => {
//     const required = ['PINECONE_API_KEY', 'PINECONE_INDEX_NAME', 'OPENAI_API_KEY'];
//     const missing = required.filter(key => !process.env[key]);

//     if (missing.length > 0) {
//         throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
//     }
// };

// // Initialize components with proper error handling
// let llmInstance;
// let embeddingsInstance;
// let pineconeClient;
// let pineconeIndex;
// let pineconeLangchainStore; // Renamed to avoid confusion with the raw Pinecone index
// let isInitialized = false;

// const initializeServices = async () => {
//     if (isInitialized) {
//         console.log('Services already initialized.');
//         return;
//     }

//     try {
//         validateEnvVars();

//         // Initialize OpenAI Components concurrently (they don't depend on each other)
//         [llmInstance, embeddingsInstance] = await Promise.all([
//             new ChatOpenAI({
//                 modelName: "gpt-4o",
//                 temperature: 0.6,
//                 maxTokens: 900,
//                 openAIApiKey: process.env.OPENAI_API_KEY, 
//             }),
//             new OpenAIEmbeddings({
//                 modelName: "text-embedding-ada-002",
//                 openAIApiKey: process.env.OPENAI_API_KEY, // Explicitly pass API key
//             })
//         ]);

//         // Initialize Pinecone client
//         pineconeClient = new Pinecone({
//             apiKey: process.env.PINECONE_API_KEY,
//         });

//         // Initialize Pinecone index
//         pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX_NAME);

//         // Test connection
//         await pineconeIndex.describeIndexStats();
//         console.log('Pinecone connection established successfully');

//         // Initialize Pinecone via LangChain for vector operations
//         // This *must* happen after embeddingsInstance and pineconeIndex are ready
//         pineconeLangchainStore = await PineconeStore.fromExistingIndex(embeddingsInstance, {
//             pineconeIndex: pineconeIndex
//         });

//         isInitialized = true;
//         console.log('All services initialized successfully.');
//     } catch (error) {
//         console.error('Failed to initialize services:', error);
//         throw error;
//     }
// };


// const explanationPromptTemplate = PromptTemplate.fromTemplate(`You are an expert LeetCode tutor with a supportive and encouraging tone. Your goal is to explain why a recommended problem is an excellent next step for a user, using simple, clear language. Imagine you are explaining this to someone who is just learning these concepts.

// User's solved problems:
// {sourceProblemsText}

// Problem being recommended:
// Problem {recommendedProblemNumber}: "{recommendedProblemTitle}" ({recommendedProblemDifficulty}) with tags: {recommendedProblemTags}

// Please provide a detailed explanation (400-500 words) covering the following points:

// Cover the following:

// (1).Key Similarities in Solving Techniques: Explain how the recommended problem shares solving techniques with the user's previously solved problems. For each similarity, mention the full name of the past problem (e.g., "Problem X: 'Problem Name'") and briefly recall how that technique was applied in the past problem to help the user connect their previous experience to the new challenge.
// (2).Important Algorithmic or Data Structure Skills Being Reinforced or Added: Describe the specific algorithmic or data structure skills the user will strengthen or gain.
// (3).How This New Problem Builds on Previous Knowledge: Clearly explain how this new problem extends or builds upon the concepts the user has already learned and applied in their solved problems, again referring to past problems by their full names when relevant.
// (4).Any New Patterns, Edge Cases, or Optimizations the User May Learn: Highlight any new problem patterns, specific edge cases to watch out for, or optimization techniques the user will encounter and learn to handle.
// (5).Conceptual or Difficulty Progression That Makes This Recommendation Valuable: Explain the logical progression in difficulty or concept that makes this problem a worthwhile next step.


// IMPORTANT: Format your response as clean, semantic HTML that is ready to display directly in a web interface. Use these specific styles:

// - Main heading: <h2 style="color: #1f2937; font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; margin-top: 1.5rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem;">
// - Sub headings: <h3 style="color: #374151; font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1.25rem;">
// - Paragraphs: <p style="color: #4b5563; line-height: 1.6; margin-bottom: 1rem;">
// - Lists: <ul style="margin-bottom: 1rem;">
// - List items: <li style="color: #4b5563; margin-bottom: 0.25rem; line-height: 1.5;">
// - Bold text: <strong style="color: #1f2937; font-weight: 600;">

// Do NOT use code blocks, markdown, or any wrapper formatting.
// Return only the styled HTML content that can be directly inserted into a web page.
// For the first heading, do NOT add margin-top since it will be the first element `)
// /**
//  * Fetch problem details and vectors from Pinecone in batches
//  */
// async function fetchProblemsData(problemNumbers) {
//     // initializeServices is called once at the start of recommendProblems.
//     // So, pineconeIndex and embeddingsInstance are guaranteed to be available here.

//     const batchSize = 10;
//     const batches = [];

//     for (let i = 0; i < problemNumbers.length; i += batchSize) {
//         batches.push(problemNumbers.slice(i, i + batchSize));
//     }

//     const allProblems = [];
//     const vectors = [];

//     try {
//         // Process each batch concurrently
//         const batchResults = await Promise.all(batches.map(async (batch) => {
//             const filter = {
//                 number: { $in: batch }
//             };

//             // Using query with a filter as 'number' is in metadata.
//             // If 'number' could be an ID, pineconeIndex.fetch could be faster.
//             const result = await pineconeIndex.query({
//                 topK: batch.length,
//                 vector: Array(3072).fill(0), // Placeholder vector for filter-only queries
//                 filter: filter,
//                 includeValues: true,
//                 includeMetadata: true,
//             });

//             return result.matches;
//         }));

//         // Flatten results and organize data
//         const allMatches = batchResults.flat();
//         const problemsMap = new Map();

//         allMatches.forEach(match => {
//             if (match) {
//                 problemsMap.set(match.metadata.number, {
//                     vector: match.values,
//                     metadata: match.metadata
//                 });
//             }
//         });

//         // Ensure we have data for each requested problem in the original order
//         problemNumbers.forEach(number => {
//             const problemData = problemsMap.get(number);
//             if (problemData) {
//                 vectors.push(problemData.vector);
//                 allProblems.push({
//                     number: problemData.metadata.number,
//                     title: problemData.metadata.title,
//                     difficulty: problemData.metadata.difficulty,
//                     tags: problemData.metadata.tags || []
//                 });
//             } else {
//                 console.log(`No data found for problem ${number}`);
//                 // Optionally throw an error or handle missing data more robustly
//             }
//         });

//         return { vectors, allProblems };
//     } catch (error) {
//         console.error('Error fetching problems data:', error);
//         throw error;
//     }
// }

// /**
//  * Calculate the average of an array of vectors
//  */
// function calculateAverageVector(vectors) {
//     if (vectors.length === 0) return [];

//     const dimension = vectors[0].length;
//     const average = new Float32Array(dimension); // Use Float32Array for better performance with numerical ops

//     for (const vector of vectors) {
//         for (let i = 0; i < dimension; i++) {
//             average[i] += vector[i];
//         }
//     }

//     const divisor = 1.0 / vectors.length;
//     for (let i = 0; i < dimension; i++) {
//         average[i] *= divisor;
//     }

//     return Array.from(average); // Convert back to standard Array for consistency
// }

// /**
//  * Group vectors and calculate the average for each group
//  */
// function groupAndAverageVectors({ vectors, allProblems, numRecommendations }) {
//     const averageVectors = [];
//     const problemGroups = [];

//     // Adjust groupSize dynamically based on numRecommendations, aiming for logical grouping
//     const groupSize = numRecommendations === 5 ? 4 : 2; // For 20 problems: 5 groups of 4 for 5 recommendations, 10 groups of 2 for 10 recommendations

//     for (let i = 0; i < vectors.length; i += groupSize) {
//         const groupVectors = vectors.slice(i, Math.min(i + groupSize, vectors.length));
//         const groupProblems = allProblems.slice(i, Math.min(i + groupSize, allProblems.length));

//         const avgVector = calculateAverageVector(groupVectors);
//         averageVectors.push(avgVector);

//         problemGroups.push({
//             problems: groupProblems,
//             problemNumbers: groupProblems.map(p => p.number)
//         });
//     }

//     return { averageVectors, problemGroups };
// }

// /**
//  * Find similar problems from Pinecone using batch queries
//  */
// async function findSimilarProblems({ averageVectors, problemGroups, numRecommendations, allProblemNumbers, includeHard }) {
//     // pineconeIndex is guaranteed to be available from initial service initialization

//     const allCandidates = [];

//     try {
//         // Process each query concurrently. No explicit batching of queries needed for Promise.all,
//         // as each query can be independent. Pinecone handles internal batching if multiple queries are sent
//         // in a single request, but Promise.all is for client-side concurrency.
//         const queryResults = await Promise.all(averageVectors.map(async (vector, index) => {
//             const queryResponse = await pineconeIndex.query({
//                 vector: vector,
//                 topK: 15,
//                 includeMetadata: true
//             });
//             return {
//                 matches: queryResponse.matches,
//                 sourceGroup: problemGroups[index], // Link back to the original source group
//                 index: index // Keep original index for sorting later
//             };
//         }));

//         allCandidates.push(...queryResults); // Flatten results into allCandidates

//         const selectedProblems = new Set(allProblemNumbers);
//         const recommendations = [];

//         for (const candidate of allCandidates) {
//             const validMatches = candidate.matches.filter(match => {
//                 const problemNumber = match.metadata.number;
//                 const difficulty = match.metadata.difficulty;

//                 const notAlreadySelected = !selectedProblems.has(problemNumber);
//                 const meetsDifficultyRequirement = includeHard ? true : difficulty !== "Hard";

//                 return notAlreadySelected && meetsDifficultyRequirement;
//             });

//             if (validMatches.length > 0) {
//                 const bestMatch = validMatches[0]; // Take the highest similarity match
//                 const problemNumber = bestMatch.metadata.number;

//                 // Add to selectedProblems to avoid recommending the same problem multiple times
//                 selectedProblems.add(problemNumber);

//                 recommendations.push({
//                     recommendedProblemNumber: problemNumber,
//                     title: bestMatch.metadata.title,
//                     titleSlug: bestMatch.metadata.titleSlug || bestMatch.metadata.title.toLowerCase().replace(/\s+/g, '-'),
//                     difficulty: bestMatch.metadata.difficulty,
//                     tags: bestMatch.metadata.tags || [],
//                     similarity: bestMatch.score,
//                     usedProblemNumbers: candidate.sourceGroup.problemNumbers,
//                     sourceProblems: candidate.sourceGroup.problems,
//                     index: candidate.index
//                 });
//             }
//         }

//         // Sort recommendations by their original group index to maintain order
//         recommendations.sort((a, b) => a.index - b.index);
//         return recommendations.slice(0, numRecommendations); // Take only the required number of recommendations
//     } catch (error) {
//         console.error('Error finding similar problems:', error);
//         throw error;
//     }
// }

// /**
//  * Generate explanations for all recommendations in a single batch
//  */
// async function generateExplanationsInBatch(recommendations) {
//     // llmInstance is guaranteed to be available from initial service initialization

//     const promptInputs = recommendations.map(rec => {
//         const sourceProblemsText = rec.sourceProblems.map(p =>
//             `Problem ${p.number}: "${p.title}" (${p.difficulty}) with tags: ${p.tags.join(', ')}`
//         ).join('\n');

//         return {
//             sourceProblemsText,
//             recommendedProblemNumber: rec.recommendedProblemNumber,
//             recommendedProblemTitle: rec.title,
//             recommendedProblemDifficulty: rec.difficulty,
//             recommendedProblemTags: rec.tags.join(', ')
//         };
//     });

//     const explanationChain = explanationPromptTemplate
//         .pipe(llmInstance) // Use the initialized LLM
//         .pipe(new StringOutputParser());

//     try {
//         // This is already well-parallelized using Promise.all for concurrent LLM calls
//         const explanations = await Promise.all(
//             promptInputs.map(input => explanationChain.invoke(input))
//         );

//         for (let i = 0; i < recommendations.length; i++) {
//             recommendations[i].message = explanations[i];
//         }

//     } catch (error) {
//         console.error('Error generating batch explanations:', error);
//         // Fallback message if LLM call fails
//         for (let i = 0; i < recommendations.length; i++) {
//             if (!recommendations[i].message) {
//                 recommendations[i].message = `This problem was recommended based on problems ${recommendations[i].usedProblemNumbers.join(', ')}`;
//             }
//         }
//     }

//     return recommendations;
// }

// /**
//  * Main recommendation function
//  */
// async function recommendProblems(problemNumbers, numRecommendations, includeHard) {
//     console.log("Input problem numbers:", problemNumbers);
//     console.log("Input number of recommendations:", numRecommendations);
//     console.log("Input includeHard:", includeHard);

//     // Input validation
//     if (!Array.isArray(problemNumbers) || problemNumbers.length !== 20) {
//         return { error: 'Please provide exactly 20 problem numbers' };
//     }

//     if (numRecommendations !== 5 && numRecommendations !== 10) {
//         return { error: 'Number of recommendations must be either 5 or 10' };
//     }

//     // Convert string numbers to integers - THIS IS THE KEY FIX
//     const convertedProblemNumbers = problemNumbers.map(num => {
//         const converted = typeof num === 'string' ? parseInt(num, 10) : num;
//         if (isNaN(converted)) {
//             throw new Error(`Invalid problem number: ${num}`);
//         }
//         return converted;
//     });

//     console.log("Converted problem numbers:", convertedProblemNumbers);

//     try {
//         // Ensure all services are initialized once at the very beginning
//         console.time('initializeServices');
//         await initializeServices();
//         console.timeEnd('initializeServices');

//         // The LangChain PineconeStore relies on the initialized Pinecone index and embeddings,
//         // so `initPineconeStore` is effectively part of `initializeServices` now.

//         const recommendationChain = RunnableSequence.from([
//             async (input) => {
//                 console.time('fetchData');
//                 const data = await fetchProblemsData(input.problemNumbers);
//                 console.timeEnd('fetchData');
//                 return {
//                     ...input,
//                     problemData: data
//                 };
//             },

//             (input) => {
//                 console.time('groupVectors');
//                 const result = groupAndAverageVectors({
//                     vectors: input.problemData.vectors,
//                     allProblems: input.problemData.allProblems,
//                     numRecommendations: input.numRecommendations
//                 });
//                 console.timeEnd('groupVectors');
//                 return {
//                     ...input,
//                     averageData: result
//                 };
//             },

//             async (input) => {
//                 console.time('findSimilar');
//                 const rawRecommendations = await findSimilarProblems({
//                     averageVectors: input.averageData.averageVectors,
//                     problemGroups: input.averageData.problemGroups,
//                     numRecommendations: input.numRecommendations,
//                     allProblemNumbers: input.problemNumbers,
//                     includeHard: input.includeHard
//                 });
//                 console.timeEnd('findSimilar');
//                 return {
//                     ...input,
//                     rawRecommendations
//                 };
//             },

//             async (input) => {
//                 console.time('generateExplanations');
//                 const recommendedProblems = await generateExplanationsInBatch(input.rawRecommendations);
//                 console.timeEnd('generateExplanations');
//                 return { recommendedProblems };
//             }
//         ]);

//         console.time('totalRecommendation');
//         const result = await recommendationChain.invoke({
//             problemNumbers: convertedProblemNumbers, // Use converted numbers
//             numRecommendations,
//             includeHard
//         });
//         console.timeEnd('totalRecommendation');

//         return {
//             recommendedProblems: result.recommendedProblems
//         };

//     } catch (error) {
//         console.error('Error in recommendation process:', error);
//         return { error: 'Failed to generate recommendations', details: error.message };
//     }
// }

// export default recommendProblems;