import dotenv from 'dotenv';
dotenv.config();

const required = ['GEMINI_API_KEY', 'PINECONE_API_KEY', 'PINECONE_INDEX'] as const;

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[env] Missing ${key}. Some features may be disabled.`);
  }
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  FRONTEND_URL: process.env.FRONTEND_URL || '*',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  PINECONE_API_KEY: process.env.PINECONE_API_KEY || '',
  PINECONE_INDEX: process.env.PINECONE_INDEX || '',
};
