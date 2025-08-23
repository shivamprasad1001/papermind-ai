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
  origin: (origin, cb) => {
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
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
app.get('/status', (_req: Request, res: Response) => res.status(200).send('ok'));
app.get('/ready', (_req: Request, res: Response) => res.status(200).json({ ready: true }));

// Swagger (mounted only when NODE_ENV !== 'production')
setupSwagger(app);

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found', path: req.path });
  console.log(req.path);        // should work
  console.log(req.originalUrl); // alternative

});

// Error handler
app.use(errorHandler);

export default app;



