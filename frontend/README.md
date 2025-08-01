# 🧠 PaperMind AI — Frontend

The **frontend** of **PaperMind AI** offers a clean, responsive interface for interacting with your AI-powered PDF assistant. This interface enables users to upload documents and ask natural language questions, receiving intelligent answers in real time.

---
## 🚀 Features

- 📁 Drag-and-drop PDF upload with preview
- 💬 Natural language chat interface
- ⚡ Real-time communication with backend API
- 📱 Responsive design for desktop and mobile
- 🔔 User-friendly alerts and error handling

---

## 🗂️ Folder Structure

```bash
frontend/
├── index.html     # Main HTML layout
├── style.css      # Modern, responsive CSS styles
└── index.js       # JavaScript for chat & file upload functionality

```
---

🧩 File Overview

index.html

Serves as the main container for the user interface.

Includes:

Drag-and-drop file upload

Chat interface section

Response display area

Links to style.css and index.js.


style.css

Defines visual styles for the app:

Clean white/dark theme

Animated transitions

Responsive mobile layout


Modern UI inspired by productivity tools.


index.js

Handles:

PDF file selection & upload

Sending user queries to backend (/chat API)

Rendering AI responses in the chat interface


Includes error messages and loading indicators for better UX.



---

🔧 Setup Instructions

> ✅ Prerequisite: Backend must be running and available at /chat.



1. Open the Interface

You can launch the frontend locally by simply opening index.html in any modern browser:

cd frontend/
open index.html

Or host via any static server:

npx serve .

2. Upload & Chat

Drop a .pdf file into the UI.

Ask questions like:

> “Summarize section 2”
“What is the conclusion?”
“Explain the math formula on page 3”




The response will be streamed back into the chat box from the backend.


---

📦 Tech Stack

HTML5 / CSS3 / Vanilla JS

No frontend framework (lightweight and fast)

Works with any RESTful backend (FastAPI, Express, etc.)



---

🧠 Powered By

This frontend works in tandem with the PaperMind AI backend powered by:

🤖 TinyLLaMA or Gemini Pro

🧬 Sentence Transformers / Nomic Embedding


