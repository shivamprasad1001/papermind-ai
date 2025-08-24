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

// --- Routes ---
app.use('/api', apiRoutes);

// Health + readiness
// 3. FIX: Added explicit Request and Response types to all handlers.
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});
app.get('/status', (req: Request, res: Response) => res.status(200).send('ok'));
app.get('/ready', (req: Request, res: Response) => res.status(200).json({ ready: true }));

// --- Swagger ---
setupSwagger(app);

// --- 404 Handler ---
// This must come after all valid routes.
// 3. FIX: Added explicit Request and Response types here too.
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found', path: req.path });
  console.log(req.path);
  console.log(req.originalUrl);
});

// --- Error Handler ---
app.use(errorHandler);

export default app;