# Load DB + Answer Query 


print("Chat module loaded")
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from langchain.chains import RetrievalQA
import os


def load_llm():
    tokenizer = AutoTokenizer.from_pretrained("../LLMs/TinyLlama-1.1B-Chat-v1.0")
    model = AutoModelForCausalLM.from_pretrained("../LLMs/TinyLlama-1.1B-Chat-v1.0")
    return pipeline("text-generation", model=model, tokenizer=tokenizer, max_new_tokens=512, do_sample=True)



def load_vectorstore(index_path="vectorstore/index.faiss"):
    embedding_model = HuggingFaceEmbeddings(model_name="../LLMs/TinyLlama-1.1B-Chat-v1.0")  # path to your local model
    return FAISS.load_local(index_path, embedding_model, allow_dangerous_deserialization=True)


def get_chat_response(question, k=3, index_path="vectorstore/index.faiss"):
    # Load vector store and LLM
    vectorstore = load_vectorstore(index_path)
    llm_pipeline = load_llm()

    # Search relevant documents
    docs = vectorstore.similarity_search(question, k=k)
    context = "\n\n".join(doc.page_content for doc in docs)

    # Format prompt
    prompt = f"""### Instruction:
    Answer the question based on the context below.

    ### Context:
    {context}

    ### Question:
    {question}

    ### Answer:
    """
    # Generate answer
    result = llm_pipeline(prompt)[0]["generated_text"]
    answer = result.split("### Answer:")[-1].strip()

  # Collect metadata sources
    sources = []
    for i, doc in enumerate(docs, 1):
        page = doc.metadata.get("page", "unknown")
        file = doc.metadata.get("source", "unknown")
        snippet = doc.page_content[:150].replace("\n", " ") + "..."
        sources.append({
            "index": i,
            "file": file,
            "page": page,
            "snippet": snippet
        })



    return answer, sources
