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
    discription: p.description,
    difficulty: p.difficulty,
}));


const ids = problems.map((p) => p.number.toString());
console.log(ids)


const pinecone = new Pinecone({
    apiKey: PINECONE_API_KEY,
});


const run = async () => {
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

    // Continue with the rest of your code...
    const index = pinecone.Index(INDEX_NAME);

    // === 🧠 Create Embedding Model ===
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: OPENAI_API_KEY,
        modelName: 'text-embedding-3-large', // ✅ Explicit and latest
    });

    // === 📤 Embed & Store in Pinecone ===
    await PineconeStore.fromTexts(texts, metadatas, embeddings, {
        pineconeIndex: index,
        ids,
    });

    console.log('🎉 All problems embedded and stored successfully!');

}


run().catch((err) => {
    console.error('❌ Error embedding problems:', err);
});
