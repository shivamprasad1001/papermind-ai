# ingest.py
import os
from dotenv import load_dotenv
import logging
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# --- Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Ensure the GOOGLE_API_KEY is set
# Ensure the GOOGLE_API_KEY is set
load_dotenv()
api_key=os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("Google API Key not found. Please set the GOOGLE_API_KEY environment variable.")


EMBEDDING_MODEL = "models/text-embedding-004"
# Define a dedicated folder for our vector store
VECTORSTORE_FOLDER = "vectorstore/db_faiss" 

def ingest_pdf(file_path: str, store_path: str = VECTORSTORE_FOLDER):
    """
    Ingests a PDF, chunks it, creates embeddings, and saves it to a FAISS vector store.
    """
    logging.info(f"🚀 Starting ingestion for: {file_path}")
    
    loader = PyMuPDFLoader(file_path)
    documents = loader.load()
    logging.info(f"📄 Loaded {len(documents)} documents from PDF.")

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    chunks = splitter.split_documents(documents)
    logging.info(f"🧩 Split document into {len(chunks)} chunks.")

    logging.info(f"💡 Generating embeddings with {EMBEDDING_MODEL}...")
    embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL)
    
    logging.info(f"💾 Creating and saving FAISS vector store to `{store_path}`...")
    # Create the vector store from the chunks and embeddings
    db = FAISS.from_documents(chunks, embeddings)
    
    # Save the vector store to the specified folder. FAISS will create index.faiss and index.pkl inside.
    db.save_local(store_path)
    
    logging.info(f"✅ Ingestion complete. Vector store saved to `{store_path}`.")

# --- Example Usage ---
# if __name__ == '__main__':
#     PDF_FILE = "sample.pdf" # Make sure this file exists
#     if not os.path.exists(PDF_FILE):
#         logging.error(f"File '{PDF_FILE}' not found. Please place a PDF in this directory to ingest.")
#     else:
#         ingest_pdf(file_path=PDF_FILE)