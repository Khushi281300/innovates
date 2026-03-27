import os
import sys
import pickle
import numpy as np
from unittest.mock import MagicMock

# Define a global mock for torch to prevent DLL initialization errors
if "torch" not in sys.modules and os.name == 'nt':
    import importlib.util
    class MockClass: pass
    mock_torch = MagicMock()
    mock_torch.__version__ = "2.0.0" 
    mock_torch.__spec__ = importlib.util.spec_from_loader("torch", None)
    
    mock_nn = MagicMock()
    mock_nn.Module = MockClass
    mock_torch.nn = mock_nn
    mock_torch.Tensor = MockClass
    
    sys.modules["torch"] = mock_torch
    sys.modules["torch.nn"] = mock_nn
    sys.modules["torch.nn.functional"] = MagicMock()
    sys.modules["torch.distributed"] = MagicMock()
    sys.modules["torch.distributions"] = MagicMock()
    sys.modules["torch.jit"] = MagicMock()
    sys.modules["torch.utils"] = MagicMock()
    sys.modules["torch.utils.data"] = MagicMock()
    sys.modules["torch.serialization"] = MagicMock()

from typing import List

# --- CLOUD BRIDGE CONFIG ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

class CloudEmbeddings:
    """Lightweight connector for HuggingFace Inference API"""
    def __init__(self):
        self.api_url = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
        # Using a public model that often works without token for low volume
        self.headers = {} 
        # Note: In production, user should add HF_TOKEN to Render env
        hf_token = os.getenv("HF_TOKEN")
        if hf_token:
            self.headers = {"Authorization": f"Bearer {hf_token}"}

    def embed_query(self, text: str) -> List[float]:
        import requests
        import time
        for i in range(3): # Retry logic for cold-booted models
            response = requests.post(self.api_url, headers=self.headers, json={"inputs": text})
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 503: # Model loading
                time.sleep(5)
                continue
            else:
                raise Exception(f"HF Inference Error: {response.text}")
        return []

def get_embeddings_model():
    """Returns Cloud OpenAI or Cloud HuggingFace"""
    if OPENAI_API_KEY:
        from langchain_openai import OpenAIEmbeddings
        return OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    else:
        return CloudEmbeddings()

def get_llm():
    """Returns Cloud LLM if Groq/OpenAI key exists, else raises explicit error"""
    if GROQ_API_KEY:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            openai_api_key=GROQ_API_KEY,
            openai_api_base="https://api.groq.com/openai/v1",
            model_name="llama-3.3-70b-versatile"
        )
    elif OPENAI_API_KEY:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(openai_api_key=OPENAI_API_KEY, model_name="gpt-4o-mini")
    else:
        raise ValueError("Render Error: GROQ_API_KEY or OPENAI_API_KEY must be set in Render environment variables. You cannot use Ollama in the cloud.")

# Use a failsafe pickle-based store instead of Chroma to avoid DLL crashes
PKL_PATH = "vectorstore.pkl"

def ingest_document(file_path: str):
    """
    Failsafe ingestion using pure-Python storage.
    """
    import logging
    logger = logging.getLogger(__name__)
    
    logger.info(f"Ingesting document: {file_path}")
    from langchain_community.document_loaders import PyPDFLoader
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    
    logger.info("Loading PDF...")
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    logger.info(f"Splitting {len(documents)} pages into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_documents(documents)
    
    logger.info(f"Creating embeddings for {len(chunks)} chunks...")
    embeddings_model = get_embeddings_model()
    
    data = []
    for chunk in chunks:
        vector = embeddings_model.embed_query(chunk.page_content)
        data.append({"text": chunk.page_content, "vector": vector})
    
    # Save to failsafe store
    logger.info(f"Saving {len(data)} vectors to {PKL_PATH}...")
    with open(PKL_PATH, "wb") as f:
        pickle.dump(data, f)
        
    logger.info("Ingestion complete.")
    return len(data)

def generate_draft(query: str):
    """
    Failsafe generation using pure-Python similarity search.
    """
    import logging
    logger = logging.getLogger(__name__)
    
    logger.info(f"Generating draft for prompt: {query[:50]}...")
    
    try:
        # Embeddings import moved to get_embeddings_model

        # Load data if exists
        context = "No specific municipal documents found."
        top_docs = []
        
        if os.path.exists(PKL_PATH):
            with open(PKL_PATH, "rb") as f:
                data = pickle.load(f)
            
            logger.info("Embedding query...")
            embeddings_model = get_embeddings_model()
            query_vec = np.array(embeddings_model.embed_query(query))
            
            logger.info("Calculating manual similarity...")
            # Compute cosine similarities
            results = []
            for item in data:
                doc_vec = np.array(item["vector"])
                dot = np.dot(query_vec, doc_vec)
                norm = np.linalg.norm(query_vec) * np.linalg.norm(doc_vec)
                similarity = dot / (norm + 1e-9)
                results.append((similarity, item["text"]))
            
            # Sort and pick top 3
            results.sort(key=lambda x: x[0], reverse=True)
            top_docs = results[:3]
            context = "\n\n".join([doc[1] for doc in top_docs])
            logger.info(f"Context retrieved (best similarity: {results[0][0]:.4f})")

        logger.info("Initializing LLM (Cloud or Local)...")
        llm = get_llm()
        
        system_prompt = f"""
        You are an AI Assistant for the Municipal Corporation of Delhi (MCD). 
        Your task is to draft a professional response based on the provided document context.
        
        CRITICAL INSTRUCTION: STICK TO THE FACTS IN THE CONTEXT. Do not invent MCD roles or events if they are not present.
        
        Retrieved Context (SOURCE TRUTH):
        {context}
        
        User Query: {query}
        
        Draft Requirements:
        - TONE: Professional, bureaucratic, and precise.
        - GROUNDING: Base the response EXCLUSIVELY on the 'Retrieved Context' above.
        - IDENTITY: If the context is technical or unrelated to MCD affairs (e.g. Compiler Design), acknowledge the content as a 'submitted technical record' for departmental review.
        - HEADER: "MCD OFFICIAL DRAFT - RECORD ANALYSIS"
        
        Maintain a formal style, but do NOT invent specific names or bureaucratic roles unless they appear in the source text.
        """
        
        response = llm.invoke(system_prompt)
        
        # Return expected 'sources' array to satisfy frontend contract
        return {
            "draft": response.content if hasattr(response, 'content') else str(response),
            "sources": [{"content": doc[1], "metadata": {"similarity": float(doc[0])}} for doc in top_docs]
        }

    except Exception as e:
        logger.error(f"Draft generation failed: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return {"error": str(e)}
