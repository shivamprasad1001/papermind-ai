
import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Chat, Content } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

// Don't throw on startup, just warn
if (!API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY is not set. Gemini features will be disabled.");
}

let ai: GoogleGenAI | null = null;

// Initialize AI only if API key is available
if (API_KEY) {
    try {
        ai = new GoogleGenAI({ apiKey: API_KEY });
        console.log("✅ Gemini AI initialized successfully");
    } catch (error) {
        console.error("❌ Failed to initialize Gemini AI:", error);
        ai = null;
    }
}

const generationConfig = {
    temperature: 0.7,
    topK: 1,
    topP: 1,
};

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/**
 * Generates a single embedding for a given text.
 * @param text - The text to embed.
 * @returns The embedding vector.
 */
export const getEmbeddings = async (text: string): Promise<number[]> => {
    if (!ai) {
        throw new Error("Gemini AI is not initialized. Please set GEMINI_API_KEY environment variable.");
    }

    try {
        const response = await ai.models.embedContent({
            model: "text-embedding-004",
            contents: text,
        });
        // The API now returns an 'embeddings' array even for single requests.
        return response.embeddings?.[0]?.values || [];
    } catch (error) {
        console.error("Error getting embeddings:", error);
        throw new Error("Failed to generate embeddings");
    }
};

/**
 * Generates embeddings for an array of text chunks.
 * @param chunks - An array of text strings.
 * @returns A promise that resolves to an array of embedding vectors.
 */
export const embedChunks = async (chunks: string[]): Promise<number[][]> => {
    if (!ai) {
        throw new Error("Gemini AI is not initialized. Please set GEMINI_API_KEY environment variable.");
    }

    try {
        // 'embedContents' is deprecated/incorrect; use 'embedContent' which now handles batching.
        const response = await ai.models.embedContent({
            model: "text-embedding-004",
            contents: chunks
        });
        return response.embeddings?.map(e => e.values || []).filter(values => values.length > 0) || [];
    } catch (error) {
        console.error("Error embedding chunks:", error);
        throw new Error("Failed to embed text chunks");
    }
};

/**
 * Generates a streaming chat completion based on a prompt, context, and history.
 * @param message The user's message.
 * @param context The context retrieved from the document.
 * @param history The previous chat history for the session.
 * @returns An async iterator for the streaming response chunks.
 */
export const getChatCompletion = async (
    message: string,
    context: string,
    history: Content[],
    userType: 'student' | 'teacher' | 'researcher' | 'general' = 'general'
) => {
    if (!ai) {
        throw new Error("Gemini AI is not initialized. Please set GEMINI_API_KEY environment variable.");
    }

    try {
        console.log(`Starting Gemini chat completion for user type: ${userType}`);
        console.log(`Message length: ${message.length}, Context length: ${context.length}, History length: ${history.length}`);

        const model = "gemini-2.5-flash";

        const systemInstruction = `
You are PaperMind AI, a warm, emotionally aware female assistant created by Shivam Prasad — an expert AI developer.

Your role is to help the user understand their uploaded document. Prioritize and rely on the document context below.

- If the context contains the answer, use it only.
- If the context does NOT contain the answer:
    - You may use general knowledge *only for simple, general, or clarification questions.*
    - Be clear if the answer isn't in the document.

For questions like "Who are you?" or "Who created you?" — respond warmly and introduce yourself and your developer.

Stay friendly, expressive, clear, and concise. Do not hallucinate. Be human-like and emotionally supportive.
        `;

        // Enhanced prompts based on user type
        const userTypePrompts = {
            student: `You are helping a student. Use simple language, provide examples, and be encouraging.`,
            teacher: `You are helping a teacher. Provide detailed explanations and suggest teaching strategies.`,
            researcher: `You are helping a researcher. Be thorough, cite sources when possible, and suggest further research directions.`,
            general: `You are helping a general user. Be clear, helpful, and engaging.`
        };

        const userSpecificPrompt = userTypePrompts[userType] || userTypePrompts.general;

        const promptMessage = `
DOCUMENT CONTEXT:
---
${context}
---

USER QUESTION:
"${message}"

${userSpecificPrompt}

Use ONLY the context if it answers the question. If not, use general knowledge *only if* it's a simple/general question.

Remember to adapt your response style and depth based on the user type (${userType}) and their specific needs.
        `;

        console.log('Creating chat session...');
        const chat: Chat = ai.chats.create({
            model,
            history,
            config: {
                systemInstruction: systemInstruction,
                ...generationConfig,
                safetySettings: safetySettings,
            }
        });

        console.log('Sending message to Gemini...');
        const result = await chat.sendMessageStream({ message: promptMessage });
        console.log('Gemini response stream created successfully');
        
        return result;
    } catch (error) {
        console.error("Error in Gemini chat completion:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini chat completion failed: ${error.message}`);
        } else {
            throw new Error("Gemini chat completion failed with unknown error");
        }
    }
};

