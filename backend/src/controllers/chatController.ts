import { Request, Response, NextFunction } from 'express';
import { parsePdf, chunkText } from '../services/pdfService';
import { embedChunks, getEmbeddings } from '../services/geminiService';
import { upsertToPinecone, queryPinecone } from '../services/pineconeService';
import { getChatCompletion } from '../services/geminiService';
import { initPinecone } from '../services/pineconeService';
import { addMessageToHistory, getHistory } from '../services/chatHistoryService';

// Type definitions
type MulterRequest = Request & {
  file?: Express.Multer.File;
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
let pineconeInitialized = false;

(async () => {
    try {
        pineconeClient = await initPinecone();
        pineconeInitialized = true;
        console.log('Pinecone initialized successfully.');
    } catch (error) {
        console.error('Pinecone initialization failed:', error);
        // Don't exit the process, just log the error
        // The app can still run for health checks
    }
})();

export const uploadAndProcessPdf = async (req: MulterRequest, res: ExpressResponse, next: NextFunction) => {
    if (!req.file) {
        return res.status(400).json({ 
            error: 'No file uploaded.',
            message: 'Please provide a PDF file to upload.'
        });
    }

    // Validate file type
    if (!req.file.mimetype.includes('pdf')) {
        return res.status(400).json({ 
            error: 'Invalid file type.',
            message: 'Only PDF files are supported.'
        });
    }

    // Check if Pinecone is initialized
    if (!pineconeInitialized || !pineconeClient) {
        return res.status(503).json({ 
            error: 'Service temporarily unavailable.',
            message: 'Document processing service is not ready. Please try again later.'
        });
    }

    try {
        const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        console.log(`Processing document: ${req.file.originalname}, ID: ${docId}`);

        // 1. Parse PDF
        const text = await parsePdf(req.file.buffer);
        if (!text || text.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Invalid PDF content.',
                message: 'The uploaded PDF appears to be empty or unreadable.'
            });
        }
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
                name: req.file.originalname,
                size: req.file.size,
                processedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error in file upload and processing:', error);
        
        // Send user-friendly error message
        if (error instanceof Error) {
            return res.status(500).json({ 
                error: 'Processing failed.',
                message: 'Failed to process the uploaded PDF. Please try again.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
        
        res.status(500).json({ 
            error: 'Processing failed.',
            message: 'An unexpected error occurred while processing the PDF.'
        });
    }
};

export const chatWithDocument = async (req: Request, res: Response, next: NextFunction) => {
    const { message, documentId, userType = 'general' } = req.body;

    if (!message || !documentId) {
        return res.status(400).json({ 
            error: 'Missing required fields.',
            message: 'Message and documentId are required.' 
        });
    }

    // Validate user type
    const validUserTypes = ['student', 'teacher', 'researcher', 'general'];
    const validatedUserType = validUserTypes.includes(userType) ? userType : 'general';

    // Check if Pinecone is initialized
    if (!pineconeInitialized || !pineconeClient) {
        return res.status(503).json({ 
            error: 'Service temporarily unavailable.',
            message: 'Chat service is not ready. Please try again later.'
        });
    }

    try {
        // 1. Get relevant context from Pinecone
        const queryEmbedding = await getEmbeddings(message);
        const contextChunks = await queryPinecone(pineconeClient, queryEmbedding, documentId);
        const context = contextChunks.map(chunk => chunk.metadata?.text || '').filter(Boolean).join('\n\n');
        
        // Check if we have relevant context
        if (!context || context.trim().length === 0) {
            return res.status(404).json({
                error: 'No relevant content found.',
                message: 'I couldn\'t find any content in the document that relates to your question. Please try rephrasing or ask something else.',
                documentId: documentId
            });
        }

        // 2. Get chat history
        const history = getHistory(documentId);

        // 3. Add user message to history
        addMessageToHistory(documentId, { role: 'user', parts: [{ text: message }] });

        // 4. Set up headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
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
        
        // If headers haven't been sent, send a JSON error
        if (!res.headersSent) {
            if (error instanceof Error) {
                return res.status(500).json({ 
                    error: 'Chat failed.',
                    message: 'Failed to process your message. Please try again.',
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
            
            return res.status(500).json({ 
                error: 'Chat failed.',
                message: 'An unexpected error occurred while processing your message.'
            });
        } else {
            // If streaming has started, send error through the stream
            res.write(`\n\nError: Failed to complete the response. Please try again.`);
            res.end();
        }
    }
};

