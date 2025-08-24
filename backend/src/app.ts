import express, { Request, Response, NextFunction } from "express";
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import apiRoutes from './routes/api'; 

const app = express();

// Environment configuration
const ENV = {
  FRONTEND_URL: process.env.FRONTEND_URL || '*',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Trust proxy for production deployments
app.set('trust proxy', true);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Body parsing with reasonable limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow requests from your frontend domain
    const allowedOrigins = ENV.FRONTEND_URL === '*' ? ['*'] : [ENV.FRONTEND_URL];
    const isAllowed = allowedOrigins.includes('*') || allowedOrigins.includes(origin);
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false
});

app.use('/api/', limiter);

// Health check endpoints
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: ENV.NODE_ENV
  });
});

app.get('/ready', (req: Request, res: Response) => {
  res.json({ 
    ready: true, 
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV
  });
});

// API routes
app.use('/api', apiRoutes);

// 404 handler for unmatched routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Not found', 
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', err);
  
  // Don't leak error details in production
  const isProduction = ENV.NODE_ENV === 'production';
  
  res.status(500).json({
    error: isProduction ? 'Internal Server Error' : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
});

export default app;


