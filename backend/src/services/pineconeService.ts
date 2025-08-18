
import { Pinecone } from '@pinecone-database/pinecone';

let pinecone: Pinecone | null = null;

export const initPinecone = async (): Promise<Pinecone> => {
    if (pinecone) {
        return pinecone;
    }

    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
        throw new Error('Pinecone API key is not set.');
    }

    pinecone = new Pinecone({ apiKey });
    return pinecone;
};

const getIndex = (pinecone: Pinecone) => {
    const indexName = process.env.PINECONE_INDEX;
    if (!indexName) {
        throw new Error('Pinecone index name is not set.');
    }
    return pinecone.index(indexName);
};

export const upsertToPinecone = async (pinecone: Pinecone, embeddings: number[][], chunks: string[], docId: string): Promise<void> => {
    const index = getIndex(pinecone);
    const namespace = index.namespace(docId);

    const vectors = chunks.map((chunk, i) => ({
        id: `${docId}-chunk-${i}`,
        values: embeddings[i],
        metadata: { text: chunk },
    }));
    
    // Upsert in batches to avoid overwhelming the API
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        await namespace.upsert(batch);
    }
};

export const queryPinecone = async (pinecone: Pinecone, embedding: number[], docId: string, topK: number = 5) => {
    const index = getIndex(pinecone);
    const namespace = index.namespace(docId);
    
    const results = await namespace.query({
        vector: embedding,
        topK,
        includeMetadata: true,
    });
    
    return results.matches || [];
};
