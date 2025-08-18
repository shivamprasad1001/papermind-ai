import express from 'express';
import multer from 'multer';
import { uploadAndProcessPdf, chatWithDocument } from '../controllers/chatController';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB limit
    }
});

/**
 * @swagger
 * tags:
 *   - name: PDF
 *     description: PDF file processing operations
 *   - name: Chat
 *     description: Document conversation endpoints
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a PDF file for processing
 *     tags: [PDF]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The PDF file to upload
 *         required: true
 *     responses:
 *       201:
 *         description: PDF successfully uploaded and processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded and processed successfully
 *                 document:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: doc-123456789
 *                     name:
 *                       type: string
 *                       example: example.pdf
 *       400:
 *         description: Bad request (no file provided)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       413:
 *         description: File too large (max 10MB)
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/upload', upload.single('file'), uploadAndProcessPdf);

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Chat with a processed document
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *     responses:
 *       200:
 *         description: Successful chat response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/chat', chatWithDocument);

// Define reusable schemas in Swagger components
/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Error description
 *         details:
 *           type: string
 *           example: Additional error details (optional)
 * 
 *     ChatRequest:
 *       type: object
 *       required:
 *         - message
 *         - documentId
 *       properties:
 *         message:
 *           type: string
 *           example: What is this document about?
 *         documentId:
 *           type: string
 *           example: doc-123456789
 *         userType:
 *           type: string
 *           enum: [student, teacher, researcher, general]
 *           default: general
 * 
 *     ChatResponse:
 *       type: object
 *       properties:
 *         response:
 *           type: string
 *           example: This document discusses...
 *         documentId:
 *           type: string
 *           example: doc-123456789
 *         userType:
 *           type: string
 *           example: general
 */

export default router;