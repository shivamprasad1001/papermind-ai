
import { Pinecone } from '@pinecone-database/pinecone';

let pinecone: Pinecone | null = null;
let pineconeInitialized = false;

export const initPinecone = async (): Promise<Pinecone> => {
    if (pinecone && pineconeInitialized) {
        return pinecone;
    }

    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
        console.warn("⚠️  PINECONE_API_KEY is not set. Pinecone features will be disabled.");
        throw new Error('Pinecone API key is not set.');
    }

    const indexName = process.env.PINECONE_INDEX;
    if (!indexName) {
        console.warn("⚠️  PINECONE_INDEX is not set. Pinecone features will be disabled.");
        throw new Error('Pinecone index name is not set.');
    }

    try {
        pinecone = new Pinecone({ apiKey });
        pineconeInitialized = true;
        console.log("✅ Pinecone initialized successfully");
        return pinecone;
    } catch (error) {
        console.error("❌ Failed to initialize Pinecone:", error);
        throw error;
    }
};

const getIndex = (pinecone: Pinecone) => {
    const indexName = process.env.PINECONE_INDEX;
    if (!indexName) {
        throw new Error('Pinecone index name is not set.');
    }
    return pinecone.index(indexName);
};

export const upsertToPinecone = async (pinecone: Pinecone, embeddings: number[][], chunks: string[], docId: string): Promise<void> => {
    if (!pineconeInitialized) {
        throw new Error('Pinecone is not initialized. Please set PINECONE_API_KEY and PINECONE_INDEX environment variables.');
    }

    const index = getIndex(pinecone);
    const namespace = index.namespace(docId);

    const vectors = chunks.map((chunk, i) => {
        const embedding = embeddings[i];
        if (!embedding || embedding.length === 0) {
            throw new Error(`Invalid embedding at index ${i}`);
        }
        
        return {
            id: `${docId}-chunk-${i}`,
            values: embedding,
            metadata: { text: chunk },
        };
    }).filter(vector => vector.values && vector.values.length > 0);
    
    // Upsert in batches to avoid overwhelming the API
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        await namespace.upsert(batch);
    }
};

export const queryPinecone = async (pinecone: Pinecone, embedding: number[], docId: string, topK: number = 5) => {
    if (!pineconeInitialized) {
        throw new Error('Pinecone is not initialized. Please set PINECONE_API_KEY and PINECONE_INDEX environment variables.');
    }

    const index = getIndex(pinecone);
    const namespace = index.namespace(docId);
    
    const results = await namespace.query({
        vector: embedding,
        topK,
        includeMetadata: true,
    });
    
    return results.matches || [];
};
