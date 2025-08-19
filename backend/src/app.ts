import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/api';
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './utils/swagger';

dotenv.config();

// Check for required environment variables
const requiredEnvVars = ['GEMINI_API_KEY', 'PINECONE_API_KEY', 'PINECONE_INDEX'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
}


const app = express();
const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Log incoming requests
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${req.method}] ${req.url} from ${req.ip}`);
  next();
});



// JSON parser middleware
app.use(express.json());

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Mount your API routes
app.use('/api', apiRoutes);

// Health check endpoint ,
app.get('/status', (_req: Request, res: Response) => {
  res.status(200).send('Backend is running');
});

// Global error handler middleware
app.use(errorHandler);


setupSwagger(app);
export default app;