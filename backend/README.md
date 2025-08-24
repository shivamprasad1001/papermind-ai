# PaperMind AI Backend

A production-ready Node.js backend for AI-powered PDF document processing and chat functionality.

## 🚀 Features

- **PDF Processing**: Upload and process PDF documents with AI
- **Document Chat**: Interactive chat with processed documents
- **AI Integration**: Powered by Google Gemini and Pinecone
- **Production Ready**: Security, rate limiting, error handling
- **TypeScript**: Full type safety and modern development experience

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Pinecone account and API key
- Google Gemini API key

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Environment Configuration
NODE_ENV=development
PORT=3000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX=your_pinecone_index_name_here

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# File Upload Limits (in bytes)
MAX_FILE_SIZE=10485760

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Build and Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🌐 API Endpoints

### Health Checks
- `GET /health` - Health status
- `GET /ready` - Readiness check
- `GET /api/test` - API test endpoint

### Core Functionality
- `POST /api/upload` - Upload and process PDF
- `POST /api/chat` - Chat with document

## 🚀 Deployment

### Render.com (Recommended)

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `papermind-backend`
   - **Root Directory**: `backend` (if your code is in a subfolder)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

3. **Environment Variables**
   - Add all variables from your `.env` file
   - Set `NODE_ENV=production`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment

### Railway.app

1. **Connect Repository**
   - Go to [Railway Dashboard](https://railway.app/)
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure**
   - Select your repository
   - Set build command: `npm run build`
   - Set start command: `npm start`

3. **Environment Variables**
   - Add all required environment variables

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: API request throttling
- **Input Validation**: File type and size validation
- **Error Handling**: Secure error messages

## 📊 Monitoring

### Health Checks
- `/health` - Basic health status
- `/ready` - Service readiness
- `/api/test` - API functionality test

### Logging
- Structured logging for production
- Error tracking and monitoring
- Request/response logging

## 🐛 Troubleshooting

### Common Issues

1. **"Not found" errors**
   - Ensure you're using POST for `/api/upload` and `/api/chat`
   - Check if the route is properly mounted

2. **"Internal Server Error"**
   - Verify all environment variables are set
   - Check Pinecone and Gemini API keys
   - Review server logs for detailed errors

3. **CORS errors**
   - Set `FRONTEND_URL` to your frontend domain
   - Ensure frontend is making requests from the correct origin

4. **File upload failures**
   - Check file size limits
   - Ensure file is a valid PDF
   - Verify multer configuration

### Debug Mode

Set `NODE_ENV=development` to get detailed error messages and stack traces.

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment mode |
| `PORT` | No | `3000` | Server port |
| `FRONTEND_URL` | No | `*` | Allowed CORS origin |
| `PINECONE_API_KEY` | Yes | - | Pinecone API key |
| `PINECONE_INDEX` | Yes | - | Pinecone index name |
| `GEMINI_API_KEY` | Yes | - | Google Gemini API key |
| `MAX_FILE_SIZE` | No | `10485760` | Max file size in bytes |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per window |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 
