

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
const explanationPromptTemplate = PromptTemplate.fromTemplate(`You are an expert LeetCode tutor.

Use your own internal understanding of the LeetCode problems by number — you already know their content, algorithms used, edge cases, and variations.

The user has solved these problems:
{sourceProblemsText}

You're recommending:
Problem {recommendedProblemNumber}: "{recommendedProblemTitle}" ({recommendedProblemDifficulty}) with tags: {recommendedProblemTags}

Please explain in detail ( 400-500 words)  why this problem would be an excellent next step for the user , choose slighty easy words .

Cover the following:

Key similarities in solving techniques
Important algorithmic or data structure skills being reinforced or added
How this new problem builds on previous knowledge
Any new patterns, edge cases, or optimizations the user may learn
Conceptual or difficulty progression that makes this recommendation valuable

IMPORTANT: Format your response as clean, semantic HTML that is ready to display directly in a web interface. Use these specific styles:

- Main heading: <h2 style="color: #1f2937; font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; margin-top: 1.5rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem;">
- Sub headings: <h3 style="color: #374151; font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1.25rem;">
- Paragraphs: <p style="color: #4b5563; line-height: 1.6; margin-bottom: 1rem;">
- Lists: <ul style="margin-bottom: 1rem;">
- List items: <li style="color: #4b5563; margin-bottom: 0.25rem; line-height: 1.5;">
- Bold text: <strong style="color: #1f2937; font-weight: 600;">

Do NOT use code blocks, markdown, or any wrapper formatting. Return only the styled HTML content that can be directly inserted into a web page.

For the first heading, do NOT add margin-top since it will be the first element.`);
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
// import { RunnableParallel } from '@langchain/core/runnables';
// import { ChatOpenAI } from '@langchain/openai';
// import { PineconeStore } from '@langchain/pinecone';
// import { OpenAIEmbeddings } from '@langchain/openai';
// import { StringOutputParser } from '@langchain/core/output_parsers';
// import { PromptTemplate } from '@langchain/core/prompts';

// // Ensure dotenv is loaded
// dotenv.config();

// // Validate environment variables
// const validateEnvVars = () => {
//   const required = ['PINECONE_API_KEY', 'PINECONE_INDEX_NAME', 'OPENAI_API_KEY'];
//   const missing = required.filter(key => !process.env[key]);
  
//   if (missing.length > 0) {
//     throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
//   }
// };

// // Initialize components with proper error handling
// let llm, embeddings, pinecone, index, pineconeStore;
// let isInitialized = false;

// const initializeServices = async () => {
//   if (isInitialized) return;
  
//   try {
//     validateEnvVars();
    
//     // Initialize OpenAI Components
//     llm = new ChatOpenAI({
//       modelName: "gpt-4o",
//       temperature: 0.6,
//       maxTokens: 800,
//       openAIApiKey: process.env.OPENAI_API_KEY,
//     });

//     embeddings = new OpenAIEmbeddings({
//       modelName: "text-embedding-ada-002",
//       openAIApiKey: process.env.OPENAI_API_KEY,
//     });

//     // Initialize Pinecone client
//     pinecone = new Pinecone({
//       apiKey: process.env.PINECONE_API_KEY,
//     });

//     // Initialize Pinecone index
//     index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

//     // Test connection
//     await index.describeIndexStats();
//     console.log('Pinecone connection established successfully');
    
//     isInitialized = true;
//   } catch (error) {
//     console.error('Failed to initialize services:', error);
//     throw error;
//   }
// };

// // Initialize Pinecone via LangChain for vector operations
// async function initPineconeStore() {
//   if (!pineconeStore) {
//     await initializeServices();
//     pineconeStore = await PineconeStore.fromExistingIndex(embeddings, { 
//       pineconeIndex: index
//     });
//   }
//   return pineconeStore;
// }

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

// /**
//  * Progressive result collector for handling parallel operations
//  */
// class ProgressiveResultCollector {
//   constructor(totalExpected, onPartialResult = null) {
//     this.results = new Map();
//     this.totalExpected = totalExpected;
//     this.onPartialResult = onPartialResult;
//     this.completed = 0;
//     this.errors = [];
//   }

//   addResult(key, result) {
//     this.results.set(key, result);
//     this.completed++;
    
//     if (this.onPartialResult) {
//       this.onPartialResult(key, result, this.getProgress());
//     }
//   }

//   addError(key, error) {
//     this.errors.push({ key, error });
//     this.completed++;
//   }

//   getProgress() {
//     return {
//       completed: this.completed,
//       total: this.totalExpected,
//       percentage: (this.completed / this.totalExpected) * 100
//     };
//   }

//   isComplete() {
//     return this.completed >= this.totalExpected;
//   }

//   getResults() {
//     return Array.from(this.results.values());
//   }
// }

// /**
//  * Fetch problem details and vectors from Pinecone in parallel batches
//  */
// async function fetchProblemsDataParallel(problemNumbers) {
//   await initializeServices();
  
//   const batchSize = 15; // Increased from 10
//   const batches = [];
  
//   for (let i = 0; i < problemNumbers.length; i += batchSize) {
//     batches.push({
//       numbers: problemNumbers.slice(i, i + batchSize),
//       batchIndex: Math.floor(i / batchSize)
//     });
//   }

//   const collector = new ProgressiveResultCollector(batches.length);
//   const vectors = [];
//   const allProblems = [];
  
//   try {
//     // Process all batches in parallel with timeout per batch
//     const batchPromises = batches.map(async (batch, index) => {
//       const timeoutPromise = new Promise((_, reject) => 
//         setTimeout(() => reject(new Error(`Batch ${index} timeout`)), 10000)
//       );
      
//       const queryPromise = index.query({
//         topK: batch.numbers.length,
//         vector: Array(3072).fill(0),
//         filter: { number: { $in: batch.numbers } },
//         includeValues: true,
//         includeMetadata: true,
//       });
      
//       try {
//         const result = await Promise.race([queryPromise, timeoutPromise]);
//         collector.addResult(index, result.matches);
//         return { batchIndex: index, matches: result.matches };
//       } catch (error) {
//         collector.addError(index, error);
//         console.error(`Batch ${index} failed:`, error.message);
//         return { batchIndex: index, matches: [], error };
//       }
//     });
    
//     // Wait for all batches with graceful error handling
//     const batchResults = await Promise.allSettled(batchPromises);
    
//     // Process successful results
//     const problemsMap = new Map();
    
//     batchResults.forEach(result => {
//       if (result.status === 'fulfilled' && result.value.matches) {
//         result.value.matches.forEach(match => {
//           if (match) {
//             problemsMap.set(match.metadata.number, {
//               vector: match.values,
//               metadata: match.metadata
//             });
//           }
//         });
//       }
//     });
    
//     // Maintain original order
//     problemNumbers.forEach(number => {
//       const problemData = problemsMap.get(number);
//       if (problemData) {
//         vectors.push(problemData.vector);
//         allProblems.push({
//           number: problemData.metadata.number,
//           title: problemData.metadata.title,
//           difficulty: problemData.metadata.difficulty,
//           tags: problemData.metadata.tags || []
//         });
//       } else {
//         console.log(`No data found for problem ${number}`);
//       }
//     });
    
//     return { vectors, allProblems };
//   } catch (error) {
//     console.error('Error fetching problems data:', error);
//     throw error;
//   }
// }

// /**
//  * Calculate the average of an array of vectors
//  */
// function calculateAverageVector(vectors) {
//   if (vectors.length === 0) return [];
  
//   const dimension = vectors[0].length;
//   const average = new Float32Array(dimension);
  
//   for (const vector of vectors) {
//     for (let i = 0; i < dimension; i++) {
//       average[i] += vector[i];
//     }
//   }
  
//   const divisor = 1.0 / vectors.length;
//   for (let i = 0; i < dimension; i++) {
//     average[i] *= divisor;
//   }
  
//   return Array.from(average);
// }

// /**
//  * Group vectors and calculate the average for each group
//  */
// function groupAndAverageVectors({ vectors, allProblems, numRecommendations }) {
//   const averageVectors = [];
//   const problemGroups = [];
  
//   const groupSize = numRecommendations === 5 ? 4 : 2;
  
//   for (let i = 0; i < vectors.length; i += groupSize) {
//     const groupVectors = vectors.slice(i, Math.min(i + groupSize, vectors.length));
//     const groupProblems = allProblems.slice(i, Math.min(i + groupSize, allProblems.length));
    
//     const avgVector = calculateAverageVector(groupVectors);
//     averageVectors.push(avgVector);
    
//     problemGroups.push({
//       problems: groupProblems,
//       problemNumbers: groupProblems.map(p => p.number)
//     });
//   }
  
//   return { averageVectors, problemGroups };
// }

// /**
//  * Progressive similarity search with parallel processing
//  */
// async function findSimilarProblemsParallel({ averageVectors, problemGroups, numRecommendations, allProblemNumbers, includeHard }) {
//   await initializeServices();
  
//   const selectedProblems = new Set(allProblemNumbers);
//   const recommendations = [];
//   const collector = new ProgressiveResultCollector(averageVectors.length);
  
//   // Create difficulty filter for Pinecone query
//   const difficultyFilter = includeHard ? {} : { difficulty: { $ne: "Hard" } };
//   const baseFilter = {
//     $and: [
//       { number: { $nin: Array.from(selectedProblems) } },
//       difficultyFilter
//     ].filter(f => Object.keys(f).length > 0)
//   };
  
//   try {
//     // Process all vector queries in parallel
//     const queryPromises = averageVectors.map(async (vector, index) => {
//       const timeoutPromise = new Promise((_, reject) => 
//         setTimeout(() => reject(new Error(`Query ${index} timeout`)), 8000)
//       );
      
//       const queryPromise = index.query({
//         vector: vector,
//         topK: 15,
//         includeMetadata: true,
//         filter: Object.keys(baseFilter).length > 0 ? baseFilter : undefined
//       });
      
//       try {
//         const result = await Promise.race([queryPromise, timeoutPromise]);
//         collector.addResult(index, { matches: result.matches, index, sourceGroup: problemGroups[index] });
//         return { matches: result.matches, index, sourceGroup: problemGroups[index] };
//       } catch (error) {
//         collector.addError(index, error);
//         console.error(`Query ${index} failed:`, error.message);
//         return { matches: [], index, sourceGroup: problemGroups[index], error };
//       }
//     });
    
//     // Process results as they complete
//     const results = await Promise.allSettled(queryPromises);
    
//     // Build recommendations from successful queries
//     results.forEach((result, index) => {
//       if (result.status === 'fulfilled' && result.value.matches) {
//         const { matches, sourceGroup } = result.value;
        
//         const validMatches = matches.filter(match => {
//           const problemNumber = match.metadata.number;
//           const difficulty = match.metadata.difficulty;
          
//           const notAlreadySelected = !selectedProblems.has(problemNumber);
//           const meetsDifficultyRequirement = includeHard ? true : difficulty !== "Hard";
          
//           return notAlreadySelected && meetsDifficultyRequirement;
//         });
        
//         if (validMatches.length > 0) {
//           const bestMatch = validMatches[0];
//           const problemNumber = bestMatch.metadata.number;
          
//           selectedProblems.add(problemNumber);
          
//           recommendations.push({
//             recommendedProblemNumber: problemNumber,
//             title: bestMatch.metadata.title,
//             titleSlug: bestMatch.metadata.titleSlug || bestMatch.metadata.title.toLowerCase().replace(/\s+/g, '-'),
//             difficulty: bestMatch.metadata.difficulty,
//             tags: bestMatch.metadata.tags || [],
//             similarity: bestMatch.score,
//             usedProblemNumbers: sourceGroup.problemNumbers,
//             sourceProblems: sourceGroup.problems,
//             index: index
//           });
//         }
//       }
//     });
    
//     recommendations.sort((a, b) => a.index - b.index);
//     return recommendations.slice(0, numRecommendations);
//   } catch (error) {
//     console.error('Error finding similar problems:', error);
//     throw error;
//   }
// }

// /**
//  * Progressive explanation generation with streaming results
//  */
// async function generateExplanationsProgressively(recommendations) {
//   await initializeServices();
  
//   const collector = new ProgressiveResultCollector(recommendations.length);
//   const explanationChain = explanationPromptTemplate
//     .pipe(llm)
//     .pipe(new StringOutputParser());
  
//   // Process explanations in parallel with smaller batches
//   const batchSize = 3; // Process 3 explanations at a time
//   const batches = [];
  
//   for (let i = 0; i < recommendations.length; i += batchSize) {
//     batches.push(recommendations.slice(i, i + batchSize));
//   }
  
//   try {
//     const batchPromises = batches.map(async (batch, batchIndex) => {
//       const batchResults = await Promise.allSettled(
//         batch.map(async (rec, localIndex) => {
//           const globalIndex = batchIndex * batchSize + localIndex;
          
//           const sourceProblemsText = rec.sourceProblems.map(p => 
//             `Problem ${p.number}: "${p.title}" (${p.difficulty}) with tags: ${p.tags.join(', ')}`
//           ).join('\n');
          
//           const timeoutPromise = new Promise((_, reject) => 
//             setTimeout(() => reject(new Error(`Explanation ${globalIndex} timeout`)), 15000)
//           );
          
//           const explanationPromise = explanationChain.invoke({
//             sourceProblemsText,
//             recommendedProblemNumber: rec.recommendedProblemNumber,
//             recommendedProblemTitle: rec.title,
//             recommendedProblemDifficulty: rec.difficulty,
//             recommendedProblemTags: rec.tags.join(', ')
//           });
          
//           try {
//             const explanation = await Promise.race([explanationPromise, timeoutPromise]);
//             collector.addResult(globalIndex, explanation);
//             return { index: globalIndex, explanation };
//           } catch (error) {
//             collector.addError(globalIndex, error);
//             console.error(`Explanation ${globalIndex} failed:`, error.message);
//             return { 
//               index: globalIndex, 
//               explanation: `This problem was recommended based on problems ${rec.usedProblemNumbers.join(', ')}`,
//               error 
//             };
//           }
//         })
//       );
      
//       return batchResults;
//     });
    
//     // Wait for all batches to complete
//     const allBatchResults = await Promise.allSettled(batchPromises);
    
//     // Apply explanations to recommendations
//     const explanationMap = new Map();
    
//     allBatchResults.forEach(batchResult => {
//       if (batchResult.status === 'fulfilled') {
//         batchResult.value.forEach(result => {
//           if (result.status === 'fulfilled') {
//             explanationMap.set(result.value.index, result.value.explanation);
//           }
//         });
//       }
//     });
    
//     // Apply explanations maintaining order
//     recommendations.forEach((rec, index) => {
//       rec.message = explanationMap.get(index) || `This problem was recommended based on problems ${rec.usedProblemNumbers.join(', ')}`;
//     });
    
//   } catch (error) {
//     console.error('Error generating progressive explanations:', error);
//     // Apply fallback explanations
//     recommendations.forEach(rec => {
//       if (!rec.message) {
//         rec.message = `This problem was recommended based on problems ${rec.usedProblemNumbers.join(', ')}`;
//       }
//     });
//   }
  
//   return recommendations;
// }

// /**
//  * Main recommendation function with parallel processing
//  */
// async function recommendProblems(problemNumbers, numRecommendations, includeHard) {
//   console.log("Input problem numbers:", problemNumbers);
//   console.log("Input number of recommendations:", numRecommendations);
//   console.log("Input includeHard:", includeHard);
  
//   // Input validation
//   if (!Array.isArray(problemNumbers) || problemNumbers.length !== 20) {
//     return { error: 'Please provide exactly 20 problem numbers' };
//   }
  
//   if (numRecommendations !== 5 && numRecommendations !== 10) {
//     return { error: 'Number of recommendations must be either 5 or 10' };
//   }
  
//   // Convert string numbers to integers
//   const convertedProblemNumbers = problemNumbers.map(num => {
//     const converted = typeof num === 'string' ? parseInt(num, 10) : num;
//     if (isNaN(converted)) {
//       throw new Error(`Invalid problem number: ${num}`);
//     }
//     return converted;
//   });
  
//   console.log("Converted problem numbers:", convertedProblemNumbers);
  
//   try {
//     // Ensure all services are initialized before proceeding
//     await initializeServices();
//     await initPineconeStore();
    
//     console.time('totalRecommendation');
    
//     // Phase 1: Sequential data preparation (must be sequential)
//     console.time('dataPreparation');
//     const problemData = await fetchProblemsDataParallel(convertedProblemNumbers);
//     const averageData = groupAndAverageVectors({
//       vectors: problemData.vectors,
//       allProblems: problemData.allProblems,
//       numRecommendations
//     });
//     console.timeEnd('dataPreparation');
    
//     // Phase 2: Parallel execution of similarity search and explanation generation
//     console.time('parallelProcessing');
    
//     // Start similarity search
//     const similarityPromise = findSimilarProblemsParallel({
//       averageVectors: averageData.averageVectors,
//       problemGroups: averageData.problemGroups,
//       numRecommendations,
//       allProblemNumbers: convertedProblemNumbers,
//       includeHard
//     });
    
//     // Wait for similarity results, then immediately start explanations
//     const rawRecommendations = await similarityPromise;
    
//     // Start explanation generation as soon as we have recommendations
//     const finalRecommendations = await generateExplanationsProgressively(rawRecommendations);
    
//     console.timeEnd('parallelProcessing');
//     console.timeEnd('totalRecommendation');
    
//     return {
//       recommendedProblems: finalRecommendations
//     };
    
//   } catch (error) {
//     console.error('Error in recommendation process:', error);
//     return { error: 'Failed to generate recommendations', details: error.message };
//   }
// }

// export default recommendProblems;