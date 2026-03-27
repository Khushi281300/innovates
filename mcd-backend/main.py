from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
from unittest.mock import MagicMock

# Torch mock removed - Backend is now cloud-native and torch-free.

import logging
import traceback

# Setup basic file logging with immediate flush
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("backend_log.txt", mode='a', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

from services.rag_service import ingest_document, generate_draft
from services.audio_service import transcribe_audio

app = FastAPI(title="MCD AI Copilot API")
logger.info("MCD AI Copilot Backend Initialized")

# Setup CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for the hackathon cloud demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    logger.info("Root endpoint called - Health Check")
    return {"status": "MCD AI Copilot Backend is running - ZERO TORCH V1.1"}

@app.post("/api/ingest")
async def api_ingest(file: UploadFile = File(...)):
    """ Endpoint to upload and ingest an MCD PDF policy document """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    # Save file temporarily with absolute path
    file_location = os.path.join(os.getcwd(), f"temp_{file.filename}")
    try:
        with open(file_location, "wb+") as file_object:
            file_object.write(await file.read())
        logger.info(f"Temporary file saved at: {file_location}")
    except Exception as e:
        logger.error(f"Failed to save temp file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File system error: {str(e)}")
    
    # Ingest document into ChromaDB
    try:
        logger.info(f"Starting ingestion for {file.filename}")
        result = ingest_document(file_location)
        os.remove(file_location)
        logger.info(f"Successfully ingested {file.filename}")
        return {"status": "success", "message": f"Ingested {file.filename}", "chunks": result}
    except Exception as e:
        logger.error(f"Ingestion failed: {str(e)}")
        logger.error(traceback.format_exc())
        if os.path.exists(file_location):
            os.remove(file_location)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/draft")
async def api_draft(prompt: str = Form(...), audio: UploadFile = File(None)):
    """ Endpoint to handle Hinglish voice/text and generate a traceability draft """
    final_prompt = prompt
    
    if audio:
        # Save audio temporarily
        audio_location = f"temp_{audio.filename}"
        with open(audio_location, "wb+") as file_object:
            file_object.write(await audio.read())
            
        try:
            # Transcribe Hinglish audio to English text
            logger.info("Starting audio transcription fallback check...")
            transcription = transcribe_audio(audio_location)
            final_prompt = f"{prompt} {transcription}".strip()
            if os.path.exists(audio_location):
                os.remove(audio_location)
        except Exception as e:
            logger.warning(f"Audio processing warning: {str(e)}")
            if os.path.exists(audio_location):
                os.remove(audio_location)
            # We don't raise 500 here, we just use the text prompt if available
            if not prompt:
                raise HTTPException(status_code=500, detail=f"Audio dictation failed: {str(e)}")
            
    if not final_prompt:
        raise HTTPException(status_code=400, detail="No valid prompt or audio provided.")
        
    # Generate draft with RAG
    try:
        logger.info(f"Generating draft for prompt: {str(final_prompt)[:20]}...")
        draft_response = generate_draft(final_prompt)
        logger.info("Successfully generated draft")
        return draft_response
    except Exception as e:
        logger.error(f"Draft generation failed: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
