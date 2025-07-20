# PDF → Chunks → Embeddings → FAISS DB
print("Ingest module loaded")
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

import os

def ingest_pdf(file_path: str, index_path: str = "vectorstore/index.faiss"):
    loader = PyMuPDFLoader(file_path)
    documents = loader.load()
    print("spliting ....")
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    print("Chunking ....")

    chunks = splitter.split_documents(documents)
    print("Chunking done ....")

    # Embed using MiniLM
    embeddings  = HuggingFaceEmbeddings(model_name ="../LLMs/all-MiniLM-L6-v2")

    
    # vectorstore
    db = FAISS.from_documents(chunks, embeddings)

    os.makedirs(os.path.dirname(index_path), exist_ok=True)
    db.save_local(index_path)
    print("Vector store saved.")
    # extra inro about FAISS


