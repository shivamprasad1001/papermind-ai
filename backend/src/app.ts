import express from 'express';
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
    console.error(`❌ Missing required environment variable: ${envVar}`);
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
}


const app = express();
const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Log incoming requests
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url} from ${req.ip}`);
  next();
});

// CORS config - allow localhost and LAN IP ranges
app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1') 
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

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

// Health check endpoint
app.get('/status', (_req, res) => {
  res.status(200).send('Backend is running');
});
app.get("/api/hello", (req, res) => {
  res.json({ msg: "Hello from Express on Vercel!" });
});
app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});

// Global error handler middleware
app.use(errorHandler);
setupSwagger(app);
// Start server, bind on all interfaces (0.0.0.0) to expose on LAN
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server ready at http://0.0.0.0:${PORT}`);
});
