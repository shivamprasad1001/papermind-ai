import express, { Request, Response, NextFunction } from "express";
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import apiRoutes from './routes/api'; 
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './utils/swagger';
import { ENV } from './config/env';

const app = express();

// Mock objects for missing imports to make the file self-contained for fixing
const apiRoutes = express.Router();
apiRoutes.get('/', (req: Request, res: Response) => res.json({ message: 'API is working' }));
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: 'Internal Server Error' });
};
const setupSwagger = (app: express.Application) => { /* Swagger setup logic */ };
const ENV = { FRONTEND_URL: process.env.FRONTEND_URL || '*' };

// Trust Vercel proxy
app.set('trust proxy', true);

// Security, compression, logging
app.use(compression());
app.use(pinoHttp());

// Body parsing with sane limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// CORS
app.use(cors({
  origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return cb(null, true);
    const allowed = ENV.FRONTEND_URL === '*' || origin === ENV.FRONTEND_URL;
    cb(allowed ? null : new Error('Not allowed by CORS'), allowed);
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
}));

// Basic rate limiting per IP (works behind proxy)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api', apiRoutes);

// Health + readiness
// FIX APPLIED HERE: Added (req: Request, res: Response) types
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get('/status', (req: Request, res: Response) => res.status(200).send('ok'));
app.get('/ready', (req: Request, res: Response) => res.status(200).json({ ready: true }));

// Swagger (mounted only when NODE_ENV !== 'production')
setupSwagger(app);

// 404
// FIX APPLIED HERE: Added (req: Request, res: Response) types
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found', path: req.path });
  console.log(req.path);
  console.log(req.originalUrl);
});

// Error handler
app.use(errorHandler);

export default app;


