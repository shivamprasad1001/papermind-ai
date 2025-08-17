
# PaperMind AI v2

PaperMind AI is a full-stack, production-ready, ChatGPT-style AI assistant for your PDF documents. Upload one or more PDFs, and start a conversation with your documents using natural language. This project leverages the power of the Google Gemini API for embeddings and generating contextual answers, with Pinecone serving as the vector database for efficient similarity search.

![PaperMind AI Demo](https://storage.googleapis.com/maker-suite-assets/project-previews/papermind-demo.gif)

## Features

- **ChatGPT-Style Interface**: Clean, responsive, and intuitive chat UI inspired by modern AI assistants.
- **Multi-Document Support**: Upload multiple PDFs and switch between chat sessions for each document.
- **Conversational Memory**: Maintains short-term memory for follow-up questions within a chat session.
- **Advanced RAG Pipeline**:
    - **PDF Parsing**: Extracts text from your uploaded documents on the server.
    - **Smart Chunking**: Splits document text into optimized chunks for embedding.
    - **Gemini Embeddings**: Converts text chunks into vector embeddings using the Gemini API.
    - **Vector Storage**: Stores and indexes embeddings in Pinecone for fast retrieval, using namespaces for multi-document isolation.
- **Contextual Chat**: Uses Retrieval-Augmented Generation (RAG) to find the most relevant parts of your documents and feed them to Gemini for accurate, source-based answers.
- **Streaming Responses**: AI responses are streamed word-by-word for a real-time chat experience.
- **Sleek Document Preview**: A non-intrusive, slide-in panel (inspired by Claude AI) allows you to preview your PDFs without losing chat context.
- **Production-Ready**: Built with a scalable architecture, secure practices, and includes deployment guides for Vercel (frontend) and Render (backend).

---

## Architecture

The application is split into two main parts: a React frontend and a Node.js/Express backend.

**Flow Diagram:**
1.  **PDF Upload**: User uploads a PDF via the React frontend.
2.  **Backend Processing**: The Express server receives the file using `multer`.
3.  **Parsing & Chunking**: The PDF's text is extracted (`pdf-parse`) and divided into smaller, overlapping chunks.
4.  **Embedding**: Each chunk is sent to the Gemini API (`gemini-2.5-flash`) to be converted into a numerical vector embedding.
5.  **Vector Storage**: The embeddings and their corresponding text are stored in a Pinecone index under a unique namespace for that document.
6.  **Chat Interaction**:
    a. User sends a message from the frontend.
    b. The backend embeds the user's query using the Gemini API.
    c. It queries Pinecone within the document's namespace to find the most relevant text chunks (context).
    d. The query, chat history, and context are sent to the Gemini chat model.
7.  **Streaming Response**: Gemini generates a response, which is streamed back through the backend to the frontend UI.

---

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **AI & ML**:
    - Google Gemini API (`gemini-2.5-flash`)
    - Pinecone (Vector Database)
- **PDF Processing**: `pdf-parse`
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Package Manager**: `pnpm`

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- `pnpm` (run `npm install -g pnpm` to install)
- A Google Gemini API Key. Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
- A Pinecone account. Get a free API key from [Pinecone](https://www.pinecone.io/).

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/papermind-ai-v2.git
cd papermind-ai-v2
```

### 2. Setup Environment Variables

Create a `.env` file in the `backend` directory by copying the example file:

```bash
cp backend/.env.example backend/.env
```

Now, open `backend/.env` and fill in your API keys:

```
# Server Configuration
PORT=3001

# Google Gemini API
# Get your key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY="your_gemini_api_key"

# Pinecone
# Get your key from the Pinecone console
PINECONE_API_KEY="your_pinecone_api_key"
PINECONE_INDEX="papermind" # You can name your index whatever you like
```

### 3. Setup Pinecone

1.  Go to your [Pinecone dashboard](https://app.pinecone.io/) and create a new index.
2.  Set the **Index Name** to match `PINECONE_INDEX` in your `.env` file (e.g., `papermind`).
3.  Set the **Dimensions** to **768**, which is the output dimension for the `text-embedding-004` model used by Gemini.
4.  Choose your preferred metric (e.g., `Cosine`) and pod type. The free tier (`starter`) is sufficient.
5. Wait for the index to be initialized.

### 4. Install Dependencies & Run

This project uses `pnpm` workspaces. The install command in the root directory will install dependencies for all packages (`/`, `backend/`, `frontend/`).

```bash
# Install root, backend, and frontend dependencies
pnpm install

# Run both frontend (Vite) and backend (Node) servers concurrently
pnpm dev
```

- Backend server will be running on `http://localhost:3001`.
- Frontend dev server will be running on `http://localhost:5173`.

Open your browser to **`http://localhost:5173`** to use the application.

---

## Deployment

### Deploying the Backend to Render

1.  Push your code to a GitHub repository.
2.  Go to the [Render Dashboard](https://dashboard.render.com/) and create a "New Web Service".
3.  Connect your GitHub repository.
4.  Configure the service:
    - **Name**: `papermind-backend` (or your choice)
    - **Root Directory**: `backend`
    - **Environment**: `Node`
    - **Build Command**: `pnpm install; pnpm build`
    - **Start Command**: `pnpm start`
5.  Click "Advanced" and add your Environment Variables from your `backend/.env` file (`GEMINI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX`).
6.  Click "Create Web Service". Render will automatically build and deploy your backend. Once it's live, copy the `.onrender.com` URL.

### Deploying the Frontend to Vercel

1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard) and create a "New Project".
2.  Connect your GitHub repository.
3.  Configure the project:
    - **Framework Preset**: `Vite`
    - **Root Directory**: `frontend`
    - **Build and Output Settings**: Keep defaults.
4.  Expand the "Environment Variables" section and add the following:
    - **Name**: `VITE_API_BASE_URL`
    - **Value**: The URL of your deployed Render backend (e.g., `https://papermind-backend.onrender.com`).
5.  Click "Deploy". Vercel will build and deploy your frontend.
