
<h1 align="center">🧠 PaperMind AI</h1>
<p align="center">
  <b>Chat with your PDFs using natural language</b><br/>
  FastAPI ⚡ | LangChain 🔗 | React 💬 | RAG 🧩 | FAISS 🔍
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Language-Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Framework-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/LLM-RAG-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Search-FAISS-orange?style=for-the-badge" />
</p>

---

## 🧩 What is PaperMind AI?

**PaperMind AI** is a full-stack AI-powered document assistant that allows you to upload any PDF and ask questions about its content — just like chatting with a human expert. It's built using cutting-edge NLP technologies such as LangChain, Vector Databases, and Retrieval-Augmented Generation (RAG) pipelines.

This is your personalized document analyst, researcher, and assistant — all in one!

---

## ✨ Features

- 📄 Upload and parse PDF documents
- 💬 Natural language chat interface
- 🧠 Retrieval-Augmented Generation (RAG)
- 🔍 Semantic search using FAISS
- ⚡ FastAPI backend with LangChain integration
- 🖥️ React-based real-time chat UI
- 🎯 Lightweight and production-ready structure

---

## 📁 Project Structure

```base

papermind-ai/
├── app.py               # FastAPI backend entry point
├── chat.py              # Handles user queries with LangChain
├── ingest.py            # Parses and indexes PDFs into vector DB
├── templates/
│   └── index.html       # Frontend HTML
├── static/
│   └── styles.css       # Custom styles
├── js/
│   └── main.js          # Upload/chat frontend logic
└── README.md            # Project documentation

````

---

## 🚀 Getting Started

### 🔧 Requirements

- Python 3.10+
- Node.js (for frontend dev, optional)
- pip

### 📦 Install Dependencies

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install backend dependencies
pip install -r requirements.txt
````

### 📂 Run the App

```bash
uvicorn app:app --reload
```

Now visit: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🧠 Tech Stack

| Layer      | Tool/Library               |
| ---------- | -------------------------- |
| Backend    | FastAPI, LangChain         |
| LLM & RAG  | OpenAI, FAISS              |
| Frontend   | HTML, JS, React            |
| Parsing    | PyPDFLoader                |
| Deployment | Uvicorn, Docker (optional) |

---

## 📌 To-Do (V2 Roadmap)

* [ ] Add multi-file PDF support
* [ ] Add chatbot memory (context persistence)
* [ ] Switch to local open-source LLMs (e.g., Ollama, Mistral)
* [ ] User authentication
* [ ] Chat history & export

---

## 🧠 Behind the Name: "PaperMind AI"

The name **PaperMind AI** symbolizes the fusion of static knowledge (paper) and dynamic intelligence (mind). It brings your documents to life with interactive understanding.

---

## 💡 Inspiration

Inspired by ChatGPT, LangChain agents, and the growing need for personalized AI tools for document analysis.

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit pull requests, issues, or feature suggestions.

```bash
git clone https://github.com/your-username/papermind-ai.git
cd papermind-ai
```

---

## 📄 License

This project is licensed under the **MIT License**. See `LICENSE` for details.

---

## 🙋‍♂️ Author

**Shivam Prasad**
AI Developer | Final Year B.Tech Student
GitHub: [shivamprasad1001](https://github.com/shivamprasad1001)
Portfolio: \[coming soon]

---

## 🌐 Demo (Optional)

> 🧪 Coming soon — [Live Demo URL](#)


