
import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Chat, Content } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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
    const response = await ai.models.embedContent({
        model: "text-embedding-004",
        contents: text,
    });
    // The API now returns an 'embeddings' array even for single requests.
    return response.embeddings?.[0]?.values || [];
};


/**
 * Generates embeddings for an array of text chunks.
 * @param chunks - An array of text strings.
 * @returns A promise that resolves to an array of embedding vectors.
 */
export const embedChunks = async (chunks: string[]): Promise<number[][]> => {
    // 'embedContents' is deprecated/incorrect; use 'embedContent' which now handles batching.
    const response = await ai.models.embedContent({
        model: "text-embedding-004",
        contents: chunks
    });
    return response.embeddings?.map(e => e.values || []).filter(values => values.length > 0) || [];
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
        student: `
SPECIAL INSTRUCTIONS FOR STUDENTS:
- Provide clear, step-by-step explanations
- Use simple language and avoid jargon
- Include real life examples when possible
- Suggest study strategies and memory techniques and sort answers
- Help with note-taking and summarization
- Offer practice questions and self-assessment tips
- Be encouraging and supportive of learning
- If asked, provide study guides, flashcards, or mind maps
- Help break down complex concepts into digestible parts
        `,
        teacher: `
SPECIAL INSTRUCTIONS FOR TEACHERS:
- Provide detailed analysis suitable for classroom use
- Suggest teaching strategies and lesson plans
- Include discussion questions and activities
- Offer assessment ideas and rubrics
- Help with curriculum planning and alignment
- Provide differentiation strategies for diverse learners
- Include real-world applications and connections
- Suggest multimedia resources and supplementary materials
- Help with student engagement techniques
        `,
        researcher: `
SPECIAL INSTRUCTIONS FOR RESEARCHERS:
- Provide in-depth analysis and critical evaluation
- Identify research gaps and opportunities
- Suggest methodology improvements
- Help with literature review and synthesis
- Offer statistical analysis suggestions
- Provide citation and referencing guidance
- Identify potential research questions
- Help with data interpretation and presentation
- Suggest related research areas and collaborations
        `,
        general: `
GENERAL INSTRUCTIONS:
- Provide balanced, comprehensive responses
- Use clear, accessible language
- Include practical applications
- Offer multiple perspectives when relevant
- Be helpful and informative
        `
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

    const chat: Chat = ai.chats.create({
        model,
        history,
        config: {
            systemInstruction: systemInstruction,
            ...generationConfig,
            safetySettings: safetySettings,
        }
    });

    const result = await chat.sendMessageStream({ message: promptMessage });
    return result;
};

