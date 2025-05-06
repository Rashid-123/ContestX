// import fs from 'fs';
// import dotenv from 'dotenv';
// import { OpenAIEmbeddings } from '@langchain/openai';
// import { PineconeStore } from '@langchain/pinecone';
// import { Pinecone } from '@pinecone-database/pinecone';
// dotenv.config();

// // === 🔧 CONFIGURATION ===
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
// const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT;
// const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'problems';


// // === 📥 Load JSON Problems ===
// const rawData = fs.readFileSync('./problems.json', 'utf8');
// const problems = JSON.parse(rawData).problems;

// // === 🔁 Format Data for Embedding ===
// const texts = problems.map((p) =>
//     `Title: ${p.title}\nDescription: ${p.description}\nTags: ${p.tags.join(', ')}\nDifficulty: ${p.difficulty}`
// );

// const metadatas = problems.map((p) => ({
//     number: p.number,
//     title: p.title,
//     tags: p.tags,
//     discription: p.description,
//     difficulty: p.difficulty,
// }));


// const ids = problems.map((p) => p.number.toString());
// console.log(ids)


// const pinecone = new Pinecone({
//     apiKey: PINECONE_API_KEY,
// });


// const run = async () => {
//     // Check if the index exists
//     try {
//         const indexesList = await pinecone.listIndexes();
//         console.log("Available indexes:", indexesList);

//         // Handle different response formats based on Pinecone SDK version
//         let indexExists = false;
//         if (Array.isArray(indexesList)) {
//             indexExists = indexesList.includes(INDEX_NAME);
//         } else if (indexesList.indexes) {
//             indexExists = indexesList.indexes.some(index => index.name === INDEX_NAME);
//         } else {
//             console.log("Unexpected format of listIndexes response:", indexesList);
//         }

//         if (!indexExists) {
//             await pinecone.createIndex({
//                 name: INDEX_NAME,
//                 dimension: 3072,
//                 metric: 'cosine',
//             });
//             console.log('🆕 Created new index:', INDEX_NAME);
//         } else {
//             console.log('✅ Index already exists:', INDEX_NAME);
//         }
//     } catch (error) {
//         console.error("Error checking or creating index:", error);
//         return; // Exit the function to prevent further errors
//     }

//     // Continue with the rest of your code...
//     const index = pinecone.Index(INDEX_NAME);

//     // === 🧠 Create Embedding Model ===
//     const embeddings = new OpenAIEmbeddings({
//         openAIApiKey: OPENAI_API_KEY,
//         modelName: 'text-embedding-3-large', // ✅ Explicit and latest
//     });

//     // === 📤 Embed & Store in Pinecone ===
//     await PineconeStore.fromTexts(texts, metadatas, embeddings, {
//         pineconeIndex: index,
//         ids,
//     });

//     console.log('🎉 All problems embedded and stored successfully!');

// }


// run().catch((err) => {
//     console.error('❌ Error embedding problems:', err);
// });






import fs from 'fs';
import dotenv from 'dotenv';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
dotenv.config();

// === 🔧 CONFIGURATION ===
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT;
const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'problems';



// Function to delay execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// === 📥 Load JSON Problems ===
const rawData = fs.readFileSync('./problems.json', 'utf8');
const problems = JSON.parse(rawData).problems;

// === 🔁 Format Data for Embedding ===
const texts = problems.map((p) =>
    `Title: ${p.title}\nDescription: ${p.description}\nTags: ${p.tags.join(', ')}\nDifficulty: ${p.difficulty}`
);

const metadatas = problems.map((p) => ({
    number: p.number,
    title: p.title,
    tags: p.tags,
    description: p.description, 
    difficulty: p.difficulty,
}));

const ids = problems.map((p) => p.number.toString());
console.log(`Total problems to process: ${ids.length}`);

// Create batches of data

const BATCH_SIZE = 50; 
const DELAY_BETWEEN_BATCHES = 10000; 
function createBatches(array, size) {
    const batches = [];
    for (let i = 0; i < array.length; i += size) {
        batches.push(array.slice(i, i + size));
    }
    return batches;
}

const textBatches = createBatches(texts, BATCH_SIZE);
const metadataBatches = createBatches(metadatas, BATCH_SIZE);
const idBatches = createBatches(ids, BATCH_SIZE);

const run = async () => {
    // Initialize Pinecone client
    const pinecone = new Pinecone({
        apiKey: PINECONE_API_KEY,
    });

    // Check if the index exists
    try {
        const indexesList = await pinecone.listIndexes();
        console.log("Available indexes:", indexesList);

        // Handle different response formats based on Pinecone SDK version
        let indexExists = false;
        if (Array.isArray(indexesList)) {
            indexExists = indexesList.includes(INDEX_NAME);
        } else if (indexesList.indexes) {
            indexExists = indexesList.indexes.some(index => index.name === INDEX_NAME);
        } else {
            console.log("Unexpected format of listIndexes response:", indexesList);
        }

        if (!indexExists) {
            await pinecone.createIndex({
                name: INDEX_NAME,
                dimension: 3072,
                metric: 'cosine',
            });
            console.log('🆕 Created new index:', INDEX_NAME);
        } else {
            console.log('✅ Index already exists:', INDEX_NAME);
        }
    } catch (error) {
        console.error("Error checking or creating index:", error);
        return; // Exit the function to prevent further errors
    }

    // Get index
    const index = pinecone.Index(INDEX_NAME);

    // === 🧠 Create Embedding Model ===
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: OPENAI_API_KEY,
        modelName: 'text-embedding-3-large',
    });

    // === 📤 Process batches ===
    console.log(`Processing ${textBatches.length} batches with ${BATCH_SIZE} items each`);

    for (let i = 0; i < textBatches.length; i++) {
        try {
            console.log(`Processing batch ${i + 1}/${textBatches.length}`);

            // Get current batch data
            const batchTexts = textBatches[i];
            const batchMetadatas = metadataBatches[i];
            const batchIds = idBatches[i];

            // Embed and store the current batch
            await PineconeStore.fromTexts(
                batchTexts,
                batchMetadatas,
                embeddings,
                {
                    pineconeIndex: index,
                    ids: batchIds,
                }
            );

            console.log(`✅ Batch ${i + 1} completed successfully. Embedded ${batchTexts.length} problems.`);

            // Add delay between batches (except after the last batch)
            if (i < textBatches.length - 1) {
                console.log(`Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...`);
                await sleep(DELAY_BETWEEN_BATCHES);
            }
        } catch (error) {
            console.error(`❌ Error processing batch ${i + 1}:`, error);
            // Implement exponential backoff on rate limit errors
            if (error.message && error.message.includes('rate limit')) {
                const backoffTime = 30000; // 30 seconds backoff
                console.log(`Rate limit hit. Backing off for ${backoffTime / 1000}s...`);
                await sleep(backoffTime);
                i--; // Retry this batch
            }
        }
    }

    console.log('🎉 All problems embedded and stored successfully!');
};

run().catch((err) => {
    console.error('❌ Error embedding problems:', err);
});