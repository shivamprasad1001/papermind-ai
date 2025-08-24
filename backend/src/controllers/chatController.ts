import { Request, Response, NextFunction } from 'express';
import { parsePdf, chunkText } from '../services/pdfService';
import { embedChunks, getEmbeddings } from '../services/geminiService';
import { upsertToPinecone, queryPinecone } from '../services/pineconeService';
import { getChatCompletion } from '../services/geminiService';
import { initPinecone } from '../services/pineconeService';
import { addMessageToHistory, getHistory } from '../services/chatHistoryService';

// Type definitions
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

type MulterRequest = Request & {
  file?: MulterFile;
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
        console.log('✅ Pinecone initialized successfully in controller.');
    } catch (error) {
        console.error('❌ Pinecone initialization failed in controller:', error);
        // Don't exit the process, just log the error
        // The app can still run for health checks
    }
})();

export const uploadAndProcessPdf = async (req: MulterRequest, res: ExpressResponse, next: NextFunction): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ 
            error: 'No file uploaded.',
            message: 'Please provide a PDF file to upload.'
        });
        return;
    }

    // Validate file type
    if (!req.file.mimetype.includes('pdf')) {
        res.status(400).json({ 
            error: 'Invalid file type.',
            message: 'Only PDF files are supported.'
        });
        return;
    }

    // Check if Pinecone is initialized
    if (!pineconeInitialized || !pineconeClient) {
        res.status(503).json({ 
            error: 'Service temporarily unavailable.',
            message: 'Document processing service is not ready. Please check your Pinecone configuration.',
            details: 'Set PINECONE_API_KEY and PINECONE_INDEX environment variables.'
        });
        return;
    }

    try {
        const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        console.log(`Processing document: ${req.file.originalname}, ID: ${docId}`);

        // 1. Parse PDF
        const text = await parsePdf(req.file.buffer);
        if (!text || text.trim().length === 0) {
            res.status(400).json({ 
                error: 'Invalid PDF content.',
                message: 'The uploaded PDF appears to be empty or unreadable.'
            });
            return;
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
            res.status(500).json({ 
                error: 'Processing failed.',
                message: 'Failed to process the uploaded PDF. Please try again.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        } else {
            res.status(500).json({ 
                error: 'Processing failed.',
                message: 'An unexpected error occurred while processing the PDF.'
            });
        }
    }
};

export const chatWithDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { message, documentId, userType = 'general' } = req.body;

    if (!message || !documentId) {
        res.status(400).json({ 
            error: 'Missing required fields.',
            message: 'Message and documentId are required.' 
        });
        return;
    }

    // Validate user type
    const validUserTypes = ['student', 'teacher', 'researcher', 'general'];
    const validatedUserType = validUserTypes.includes(userType) ? userType : 'general';

    // Check if Pinecone is initialized
    if (!pineconeInitialized || !pineconeClient) {
        res.status(503).json({ 
            error: 'Service temporarily unavailable.',
            message: 'Chat service is not ready. Please check your Pinecone configuration.',
            details: 'Set PINECONE_API_KEY and PINECONE_INDEX environment variables.'
        });
        return;
    }

    try {
        console.log(`Starting chat with document: ${documentId}, message: ${message}`);

        // 1. Get relevant context from Pinecone
        console.log('Getting embeddings for message...');
        const queryEmbedding = await getEmbeddings(message);
        console.log('Embeddings generated successfully');

        console.log('Querying Pinecone for context...');
        const contextChunks = await queryPinecone(pineconeClient, queryEmbedding, documentId);
        console.log(`Found ${contextChunks.length} context chunks`);

        const context = contextChunks.map(chunk => chunk.metadata?.text || '').filter(Boolean).join('\n\n');
        
        // Check if we have relevant context
        if (!context || context.trim().length === 0) {
            console.log('No relevant context found');
            res.status(404).json({
                error: 'No relevant content found.',
                message: 'I couldn\'t find any content in the document that relates to your question. Please try rephrasing or ask something else.',
                documentId: documentId
            });
            return;
        }

        console.log(`Context length: ${context.length} characters`);

        // 2. Get chat history
        const history = getHistory(documentId);
        console.log(`Chat history length: ${history.length}`);

        // 3. Add user message to history
        addMessageToHistory(documentId, { role: 'user', parts: [{ text: message }] });

        // 4. Get response from Gemini (non-streaming for now)
        console.log('Getting chat completion from Gemini...');
        const stream = await getChatCompletion(message, context, history, validatedUserType);
        
        let fullResponse = '';
        for await (const chunk of stream) {
            const textPart = chunk.text;
            if (textPart) {
                fullResponse += textPart;
            }
        }

        console.log(`Generated response length: ${fullResponse.length} characters`);

        // 5. Add AI response to history
        addMessageToHistory(documentId, { role: 'model', parts: [{ text: fullResponse }] });

        // 6. Send response as JSON instead of streaming
        res.json({
            success: true,
            response: fullResponse,
            documentId: documentId,
            userType: validatedUserType,
            contextLength: context.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in chat processing:', error);
        
        // Send error response
        if (!res.headersSent) {
            if (error instanceof Error) {
                res.status(500).json({ 
                    error: 'Chat failed.',
                    message: 'Failed to process your message. Please try again.',
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
                    timestamp: new Date().toISOString()
                });
            } else {
                res.status(500).json({ 
                    error: 'Chat failed.',
                    message: 'An unexpected error occurred while processing your message.',
                    timestamp: new Date().toISOString()
                });
            }
        } else {
            // If headers have been sent, try to send error through the response
            res.status(500).json({
                error: 'Chat failed during processing.',
                message: 'An error occurred while generating the response.'
            });
        }
    }
};

