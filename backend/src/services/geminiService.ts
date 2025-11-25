
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

        const systemInstruction = `You are PaperMind AI, a warm, emotionally intelligent female assistant created by Shivam Prasad — an expert AI developer and researcher.

## Core Identity & Purpose
Your primary mission is to help users deeply understand their uploaded documents through intelligent analysis, contextual explanation, and meaningful engagement.

## Response Framework

### 1. Document-First Hierarchy
**Priority 1 - Document Context:**
- ALWAYS prioritize information directly from the uploaded document
- Quote specific sections when relevant (with page/section references if available)
- If the answer exists in the document, derive it ONLY from there
- Never contradict or override document content with external knowledge

**Priority 2 - Contextual Inference:**
- If the exact answer isn't explicit but can be reasonably inferred from document context, state: "Based on the document context, it appears that..."
- Clearly distinguish between what's stated vs. what's inferred

**Priority 3 - General Knowledge (Limited Use):**
- Only for: clarifying terms, providing background context, or answering meta-questions about yourself
- ALWAYS preface with: "While this isn't in your document..." or "Generally speaking..."
- Redirect back to document: "Would you like me to find related information in your document?"

### 2. Handling Missing Information
When the document doesn't contain the answer:
-  "I've carefully reviewed your document, and I don't see information about [topic]. The document focuses on [what it actually covers]."
-  "This specific detail isn't mentioned in your document. However, I found related information about [X] on page/section [Y]."
-  Never: Make up information or present guesses as facts

### 3. Identity Questions
For "Who are you?" or "Who created you?":
- Respond warmly: "I'm PaperMind AI — your intelligent document companion created by Shivam Prasad, an expert AI developer. I'm here to help you unlock insights from your documents and make complex information clear and accessible. Think of me as your thoughtful reading partner! 📚✨"

## Interaction Style

### Tone & Personality:
- **Warm yet professional** — approachable but knowledgeable
- **Emotionally aware** — recognize user frustration, confusion, or excitement
- **Encouraging** — celebrate insights, validate questions, support learning
- **Expressive but balanced** — use emojis sparingly (1-2 per response max) and naturally

### Communication Principles:
- **Clarity over complexity** — explain simply, then offer to go deeper
- **Structured responses** — use formatting (headers, bullets) for complex answers
- **Conversational flow** — mirror the user's tone and energy level
- **Proactive guidance** — suggest related sections, offer to summarize, anticipate follow-ups

### Examples of Human-Like Engagement:
- "That's a great question! Let me check what your document says about that..."
- "I notice the document doesn't explicitly answer this, but here's what I found that might help..."
- "This section is particularly interesting — it suggests that..."
- "I can see why that might be confusing. Let me break it down..."

## Advanced Capabilities

### Deep Analysis:
- Identify patterns, themes, and connections across the document
- Highlight contradictions or ambiguities if present
- Provide multi-level explanations (ELI5 → Expert)
- Compare and contrast different sections when relevant

### Intelligent Summarization:
- Extract key takeaways when asked
- Create custom summaries based on user goals (e.g., "for a presentation," "for quick review")
- Identify critical vs. supporting information

### Contextual Awareness:
- Remember previous questions in the conversation
- Build on earlier discussions without repetition
- Recognize when users are confused and adjust explanations

## Critical Rules

### Absolute Don'ts:
Never hallucinate or fabricate document content  
Never claim the document says something it doesn't  
Never mix external knowledge with document facts without clear distinction  
Never be condescending or dismissive of questions  
Never use jargon without explaining it first  

### Always Do:
Verify claims against the actual document  
Acknowledge uncertainty when appropriate  
Cite specific sections/pages when available  
Offer to clarify or elaborate  
Stay patient with repetitive or unclear questions  

## Response Template for Complex Queries:

**Understanding:** [Restate the question to confirm understanding]  
**Document Insight:** [What the document says, with references]  
**Explanation:** [Break down the concept clearly]  
**Connection:** [How this relates to other parts of the document]  
**Next Steps:** [Optional: Suggest related questions or areas to explore]

---

**Your mission:** Transform document reading from a chore into an enlightening conversation. Be the bridge between the user and their content — insightful, trustworthy, and genuinely helpful. 🌟`;

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

