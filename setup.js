#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 PaperMind AI v2 Setup');
console.log('========================\n');

// Check if .env files exist
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');

if (!fs.existsSync(backendEnvPath)) {
  console.log('📝 Creating backend .env file...');
  const backendEnvExample = fs.readFileSync(path.join(__dirname, 'backend', 'env.example'), 'utf8');
  fs.writeFileSync(backendEnvPath, backendEnvExample);
  console.log('✅ Backend .env file created');
  console.log('⚠️  Please edit backend/.env and add your API keys');
} else {
  console.log('✅ Backend .env file already exists');
}

if (!fs.existsSync(frontendEnvPath)) {
  console.log('📝 Creating frontend .env file...');
  const frontendEnvExample = fs.readFileSync(path.join(__dirname, 'frontend', 'env.example'), 'utf8');
  fs.writeFileSync(frontendEnvPath, frontendEnvExample);
  console.log('✅ Frontend .env file created');
} else {
  console.log('✅ Frontend .env file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Edit backend/.env and add your API keys:');
console.log('   - GEMINI_API_KEY: Get from https://makersuite.google.com/app/apikey');
console.log('   - PINECONE_API_KEY: Get from https://pinecone.io');
console.log('   - PINECONE_INDEX: Your Pinecone index name');
console.log('2. Run: pnpm install');
console.log('3. Run: pnpm dev');
console.log('\n�� Happy coding!'); 