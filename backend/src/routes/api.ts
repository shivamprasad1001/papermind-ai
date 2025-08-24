import express, { Request, Response, NextFunction, Router } from 'express';
import multer from 'multer';
import { uploadAndProcessPdf, chatWithDocument } from '../controllers/chatController';

const router: Router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB limit
    }
});

// Debug route to test if API routes are working
router.get('/test', (req: Request, res: Response) => {
    res.json({ message: 'API routes are working!', timestamp: new Date().toISOString() });
});

/**
 * Upload a PDF file for processing
 * POST /api/upload
 * Content-Type: multipart/form-data
 * Body: { file: PDF file }
 */
router.post('/upload', upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
    uploadAndProcessPdf(req as any, res as any, next);
});

/**
 * Chat with a processed document
 * POST /api/chat
 * Content-Type: application/json
 * Body: { message: string, documentId: string, userType?: string }
 */
router.post('/chat', (req: Request, res: Response, next: NextFunction) => {
    chatWithDocument(req, res, next);
});

export default router;