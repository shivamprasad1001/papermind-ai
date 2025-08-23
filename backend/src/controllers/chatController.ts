import { Request, Response, NextFunction } from 'express';
import * as express from 'express';
import { parsePdf, chunkText } from '../services/pdfService';
import { embedChunks, getEmbeddings } from '../services/geminiService';
import { upsertToPinecone, queryPinecone } from '../services/pineconeService';
import { getChatCompletion } from '../services/geminiService';
import { initPinecone } from '../services/pineconeService';
import { addMessageToHistory, getHistory } from '../services/chatHistoryService';
import { randomUUID } from 'crypto'; // Built-in Node.js module for unique IDs
import { readChatDatabase, writeChatDatabase, ChatMessage } from '../utils/db'; // Import our new DB functions

type MulterRequest = Request & {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
  body: any;
};

type ExpressResponse = Response & {
  setHeader: any;
  flushHeaders?: () => void;
  write?: (chunk: any) => void;
  end?: () => void;
};
// Initialize Pinecone client at startup
let pineconeClient: any;
(async () => {
    try {
        pineconeClient = await initPinecone();
        console.log('Pinecone initialized successfully.');
    } catch (error) {
        console.error('Pinecone initialization failed:', error);
        (process as any).exit(1);
    }
})();



export const uploadAndProcessPdf = async (req: MulterRequest, res: ExpressResponse, next: NextFunction) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        console.log(`Processing document: ${req.file.originalname}, ID: ${docId}`);

        // 1. Parse PDF
        const text = await parsePdf(req.file.buffer);
        console.log(`PDF parsed, ${text.length} characters.`);

        // 2. Chunk Text
        const chunks = chunkText(text);
        console.log(`Text chunked into ${chunks.length} parts.`);

        // 3. Embed Chunks
        const embeddings = await embedChunks(chunks);
        console.log('Chunks embedded successfully.');

        // 4. Upsert to Pinecone
        await upsertToPinecone(pineconeClient, embeddings, chunks, docId);
        console.log('Embeddings upserted to Pinecone.');
        
        res.status(201).json({ 
            message: 'File uploaded and processed successfully.',
            document: {
                id: docId,
                name: req.file.originalname
            }
        });
    } catch (error) {
        console.error('Error in file upload and processing:', error);
        next(error);
    }
};


export const chatWithDocument = async (req: Request, res: Response, next: NextFunction) => {
        
    const { message, documentId, userType = 'general' } = req.body;

    if (!message || !documentId) {
        return res.status(400).json({ message: 'Message and documentId are required.' });
    }

    // Validate user type
    const validUserTypes = ['student', 'teacher', 'researcher', 'general'];
    const validatedUserType = validUserTypes.includes(userType) ? userType : 'general';

    try {
        // 1. Get relevant context from Pinecone
        const queryEmbedding = await getEmbeddings(message);
        const contextChunks = await queryPinecone(pineconeClient, queryEmbedding, documentId);
        const context = contextChunks.map(chunk => chunk.metadata?.text || '').filter(Boolean).join('\n\n');
        
        // 2. Get chat history
        const history = getHistory(documentId);

        // 3. Add user message to history
        addMessageToHistory(documentId, { role: 'user', parts: [{ text: message }] });

        // 4. Set up headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        // 5. Get streaming response from Gemini
        const stream = await getChatCompletion(message, context, history, validatedUserType);
        
        let fullResponse = '';
        for await (const chunk of stream) {
            const textPart = chunk.text;
            if (textPart) {
                fullResponse += textPart;
                res.write(textPart);
            }
        }

        // 6. Add AI response to history
        addMessageToHistory(documentId, { role: 'model', parts: [{ text: fullResponse }] });

        res.end();

    } catch (error) {
        console.error('Error in chat processing:', error);
        next(error);
    }
};

// TODO : this commented code block is send message data in best formate with datatime stamp  

// export const chatWithDocument = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     const { message, documentId, userType = 'general' } = req.body;

//     if (!message || !documentId) {
//         return res.status(400).json({ message: 'Message and documentId are required.' });
//     }

//     const validUserTypes = ['student', 'teacher', 'researcher', 'general'];
//     const validatedUserType = validUserTypes.includes(userType) ? userType : 'general';

//     try {
//         // --- MODIFIED: History and Database Management ---
//         const db = await readChatDatabase();
//         const history = db[documentId] || [];

//         // Create the new user message object with our enriched format
//         const userMessage: ChatMessage = {
//             messageId: `msg_${randomUUID()}`,
//             role: 'user',
//             text: message,
//             timestamp: new Date().toISOString()
//         };

//         // Add user message to history in memory
//         const updatedHistory = [...history, userMessage];
//         db[documentId] = updatedHistory;
        
//         // Asynchronously write the updated history back to the file
//         await writeChatDatabase(db);
        
//         // --- Context Fetching (no change) ---
//         const queryEmbedding = await getEmbeddings(message);
//         const contextChunks = await queryPinecone(pineconeClient, queryEmbedding, documentId);
//         const context = contextChunks.map(chunk => chunk.metadata?.text || '').join('\n\n');
        
//         // ... (empty context check remains the same)

//         // --- MODIFIED: Streaming with SSE and Enriched Format ---
//         res.setHeader('Content-Type', 'text/event-stream');
//         res.setHeader('Cache-Control', 'no-cache');
//         res.setHeader('Connection', 'keep-alive');
//         res.flushHeaders();

//         const sendEvent = (data: object) => res.write(`data: ${JSON.stringify(data)}\n\n`);
        
//         const stream = await getChatCompletion(message, context, history, validatedUserType);
        
//         let fullResponse = '';
//         for await (const chunk of stream) {
//             const textPart = chunk.text;
//             if (textPart) {
//                 fullResponse += textPart;
//                 sendEvent({ type: 'token', payload: textPart });
//             }
//         }
        
//         // --- MODIFIED: Create the Final AI Message Object ---
//         const sources = contextChunks.map(chunk => ({
//             pageNumber: chunk.metadata?.pageNumber,
//             textSnippet: (chunk.metadata?.text || '').substring(0, 120) + '...'
//         }));

//         const aiMessage: ChatMessage = {
//             messageId: `msg_${randomUUID()}`,
//             role: 'model',
//             text: fullResponse,
//             timestamp: new Date().toISOString(),
//             sources: sources
//         };
        
//         // Send the final 'complete' event with all the new data
//         sendEvent({ type: 'complete', payload: aiMessage });

//         // Add the AI's response to the database
//         const finalDb = await readChatDatabase(); // Read again to be safe from race conditions
//         finalDb[documentId] = [...(finalDb[documentId] || history), aiMessage];
//         await writeChatDatabase(finalDb);

//         res.end();

//     } catch (error) {
//         console.error('Error in chat processing:', error);
//         next(error);
//     }
// };


//past chat logic -----

// export const chatWithDocument = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     const { message, documentId, userType = 'general' } = req.body;

//     if (!message || !documentId) {
//         // --- CHANGE 1: Using a structured JSON error for invalid input ---
//         return res.status(400).json({
//             status: 'error',
//             errorCode: 'INVALID_REQUEST',
//             message: 'Message and documentId are required.'
//         });
//     }

//     const validUserTypes = ['student', 'teacher', 'researcher', 'general'];
//     const validatedUserType = validUserTypes.includes(userType) ? userType : 'general';

//     try {
//         // 1. Get relevant context from Pinecone
//         const queryEmbedding = await getEmbeddings(message);
//         const contextChunks = await queryPinecone(pineconeClient, queryEmbedding, documentId);
//         const context = contextChunks.map(chunk => chunk.metadata?.text || '').filter(Boolean).join('\n\n');

//         // --- CHANGE 2: Handle the "empty context" scenario gracefully ---
//         // This was your original problem. If no context is found for the query,
//         // we send a specific, non-streaming JSON response.
//         if (!context || context.trim() === '') {
//             return res.status(200).json({
//                 status: 'error',
//                 errorCode: 'NO_RELEVANT_CONTEXT_FOUND',
//                 displayText: {
//                     primaryMessage: "Oh dear! I couldn't find any content in the document that relates to your question.",
//                     callToAction: "Could you please try rephrasing your question or asking something else? 😊"
//                 },
//                 suggestedActions: [
//                     { title: "Try another question", action: "FOCUS_INPUT" }
//                 ]
//             });
//         }

//         // 2. Get chat history and add the user's new message
//         const history = getHistory(documentId);
//         addMessageToHistory(documentId, { role: 'user', parts: [{ text: message }] });

//         // 3. Set up headers for Server-Sent Events (SSE)
//         res.setHeader('Content-Type', 'text/event-stream');
//         res.setHeader('Cache-Control', 'no-cache');
//         res.setHeader('Connection', 'keep-alive');
//         res.flushHeaders();

//         // Helper function to send SSE-formatted data
//         const sendEvent = (data: object) => {
//             res.write(`data: ${JSON.stringify(data)}\n\n`);
//         };

//         // 4. Get streaming response from Gemini
//         const stream = await getChatCompletion(message, context, history, validatedUserType);
        
//         let fullResponse = '';
//         for await (const chunk of stream) {
//             const textPart = chunk.text;
//             if (textPart) {
//                 fullResponse += textPart;
//                 // --- CHANGE 3: Stream structured JSON instead of raw text ---
//                 sendEvent({ type: 'token', payload: textPart });
//             }
//         }

//         // --- CHANGE 4: Send a 'complete' event with final data and sources ---
//         // This is highly relevant info for a "chat with PDF" bot.
//         sendEvent({
//             type: 'complete',
//             payload: {
//                 // We send the full response again so the client can easily store it
//                 // without having to piece it together from tokens.
//                 fullResponse: fullResponse,
//                 // We send citation sources (assuming your Pinecone metadata has this info)
//                 sources: contextChunks.map(chunk => ({
//                     pageNumber: chunk.metadata?.pageNumber,
//                     textSnippet: (chunk.metadata?.text || '').substring(0, 120) + '...'
//                 }))
//             }
//         });

//         // 5. Add the complete AI response to history
//         addMessageToHistory(documentId, { role: 'model', parts: [{ text: fullResponse }] });

//         // 6. End the connection
//         res.end();

//     } catch (error) {
//         console.error('Error in chat processing:', error);
        
//         // --- CHANGE 5: Improved error handling for streaming contexts ---
//         if (!res.headersSent) {
//             // If the stream hasn't started, send a normal 500 error
//             return res.status(500).json({
//                 status: 'error',
//                 errorCode: 'INTERNAL_SERVER_ERROR',
//                 message: 'An unexpected error occurred.'
//             });
//         } else {
//             // If the stream has started, send an error event through the stream
//             const errorPayload = { type: 'error', payload: { message: 'An error occurred during the stream.' } };
//             res.write(`data: ${JSON.stringify(errorPayload)}\n\n`);
//             res.end();
//         }
//     }
// };

//hello

