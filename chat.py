# chat.py
import os
import logging
from dotenv import load_dotenv
from typing import List, Dict, Any, Tuple
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# --- Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# Ensure the GOOGLE_API_KEY is set
load_dotenv()
api_key=os.getenv("GOOGLE_API_KEY")

if not api_key:
    logging.error("Google API Key not found. Please set the GOOGLE_API_KEY environment variable.")
    raise ValueError("Missing GOOGLE_API_KEY")

VECTORSTORE_FOLDER = os.getenv("VECTORSTORE_PATH", "vectorstore/db_faiss")
EMBEDDING_MODEL = "models/text-embedding-004"

# ========================= THE FIX IS HERE =========================
# 1. Use the latest and most robust model identifier.
CHAT_MODEL = "gemini-2.0-flash-lite" 
# ===================================================================

K_RETRIEVED_DOCS = 4



class ChatBot:
    def __init__(self, store_path: str = VECTORSTORE_FOLDER):
        logging.info("📦 [ChatBot] Initializing...")
        self.vector_store = self._load_vectorstore(store_path)
        self.llm = self._load_llm()
        self.qa_chain = self._setup_qa_chain()
        logging.info("✅ [ChatBot] Initialization complete.")

    def _load_llm(self) -> ChatGoogleGenerativeAI:
        """Loads the Gemini Pro language model."""
        logging.info(f"🧠 Loading LLM: {CHAT_MODEL}...")
        try:
            # ========================= THE SECOND FIX =========================
            # 2. Remove the deprecated 'convert_system_message_to_human' parameter.
            #    The library now handles this automatically.
            llm = ChatGoogleGenerativeAI(model=CHAT_MODEL, temperature=0.7)
            # ===================================================================
            logging.info("✅ LLM loaded.")
            return llm
        except Exception as e:
            logging.error(f"❌ Failed to load LLM: {e}")
            raise

    # ... (the rest of your chat.py file remains unchanged) ...

    def _load_vectorstore(self, store_path: str) -> FAISS:
        """Loads the FAISS vector store from the specified folder."""
        if not os.path.isdir(store_path):
            logging.error(f"❌ Vector store folder not found at `{store_path}`. Please run the ingest script first.")
            raise FileNotFoundError(f"FAISS folder not found at {store_path}")

        logging.info(f"📚 Loading vector store from `{store_path}`...")
        try:
            embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL)
            store = FAISS.load_local(
                folder_path=store_path,
                embeddings=embeddings,
                allow_dangerous_deserialization=True
            )
            logging.info("✅ Vector store loaded.")
            return store
        except Exception as e:
            logging.error(f"❌ Failed to load vector store: {e}")
            raise

    
    def _setup_qa_chain(self) -> RetrievalQA:
        """Sets up the LangChain RetrievalQA chain."""
        logging.info("🔗 Setting up QA chain...")
        
        # Define a custom prompt to guide the LLM
        prompt_template = """
        ### INSTRUCTION
        You are a highly intelligent and professional AI assistant designed to analyze documents.
        Your primary task is to answer the user's question accurately and exclusively based on the text provided in the 'CONTEXT' section.
        
        RULES:
        - Your answer must be derived *only* from the 'CONTEXT' provided. Do not use any external knowledge or information you were trained on.
        - If the 'CONTEXT' does not contain the information needed to answer the question, you must explicitly state: "The provided documents do not contain enough information to answer this question."
        - Do not make up information, infer details not present, or speculate.
        - Present the answer in a clear and concise manner.

        ### CONTEXT
        {context}

        ### QUESTION
        {question}

        ### ANSWER
        """
        PROMPT = PromptTemplate(
            template=prompt_template, input_variables=["context", "question"]
        )

        try:
            qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=self.vector_store.as_retriever(search_kwargs={"k": K_RETRIEVED_DOCS}),
                return_source_documents=True,
                chain_type_kwargs={"prompt": PROMPT}
            )
            logging.info("✅ QA chain setup complete.")
            return qa_chain
        except Exception as e:
            logging.error(f"❌ Failed to set up QA chain: {e}")
            raise

    def ask(self, question: str) -> Tuple[str, List[Dict[str, Any]]]:
        """Asks a question to the chatbot and returns the answer and source documents."""
        logging.info(f"🤖 Processing question: {question}")
        if not question:
            return "Please provide a question.", []
        try:
            result = self.qa_chain.invoke({"query": question})
            answer = result.get("result", "No answer could be generated.")
            source_docs = result.get("source_documents", [])
            sources = []
            for i, doc in enumerate(source_docs, 1):
                sources.append({
                    "index": i, "file": doc.metadata.get("source", "unknown"),
                    "page": doc.metadata.get("page", "unknown"),
                    "snippet": doc.page_content[:200].replace("\n", " ") + "..."
                })
            logging.info("✅ Response generation complete.")
            return answer, sources
        except Exception as e:
            logging.error(f"❌ An error occurred during response generation: {e}")
            return "Sorry, an error occurred while processing your request.", []


# print("📦 [Chat Module] Initializing...")

# from langchain_community.vectorstores import FAISS
# from langchain_community.embeddings import HuggingFaceEmbeddings
# from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
# from langchain.chains import RetrievalQA
# import os

# print("✅ [Chat Module] Libraries loaded.")

# def load_llm():
#     print("🧠 Loading TinyLLaMA LLM...")
#     tokenizer = AutoTokenizer.from_pretrained("../LLMs/TinyLlama-1.1B-Chat-v1.0")
#     model = AutoModelForCausalLM.from_pretrained("../LLMs/TinyLlama-1.1B-Chat-v1.0")
#     print("✅ LLM loaded.")
#     return pipeline("text-generation", model=model, tokenizer=tokenizer, max_new_tokens=512, do_sample=True)

# def load_vectorstore(index_path="vectorstore/index.faiss"):
#     print("📚 Loading vectorstore...")
#     embedding_model = HuggingFaceEmbeddings(model_name="../LLMs/all-MiniLM-L6-v2")
#     store = FAISS.load_local(index_path, embedding_model, allow_dangerous_deserialization=True)
#     print(f"✅ Vectorstore loaded from `{index_path}`.")
#     return store

# def get_chat_response(question, k=3, index_path="vectorstore/index.faiss"):
#     print(f"🤖 Generating response for: {question}")
#     vectorstore = load_vectorstore(index_path)
#     llm_pipeline = load_llm()
#     docs = vectorstore.similarity_search(question, k=k)

#     context = "\n\n".join(doc.page_content for doc in docs)
#     prompt = f"""### Instruction:
#     Answer the question based on the context below.

#     ### Context:
#     {context}

#     ### Question:
#     {question}

#     ### Answer:
#     """
#     result = llm_pipeline(prompt)[0]["generated_text"]
#     answer = result.split("### Answer:")[-1].strip()

#     sources = []
#     for i, doc in enumerate(docs, 1):
#         sources.append({
#             "index": i,
#             "file": doc.metadata.get("source", "unknown"),
#             "page": doc.metadata.get("page", "unknown"),
#             "snippet": doc.page_content[:150].replace("\n", " ") + "..."
#         })

#     print("✅ Response generation complete.")
#     return answer, sources
