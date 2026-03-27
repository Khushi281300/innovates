import sys
import os
import requests

# The torch mock is removed as per instructions.
# The whisper import and HAS_WHISPER variable are removed as per instructions.

def transcribe_audio(audio_path: str) -> str:
    """
    Cloud transcription using Groq API (High Performance).
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return "[Audio Processing Skipped: No GROQ_API_KEY set on Render]"

    try:
        url = "https://api.groq.com/openai/v1/audio/transcriptions"
        headers = {"Authorization": f"Bearer {api_key}"}
        
        with open(audio_path, "rb") as f:
            files = {
                "file": (os.path.basename(audio_path), f),
                "model": (None, "whisper-large-v3"),
                "language": (None, "en"),
                "response_format": (None, "json"),
            }
            response = requests.post(url, headers=headers, files=files)
            
        if response.status_code == 200:
            return response.json().get("text", "")
        else:
            return f"[Transcription API Error: {response.text}]"
            
    except Exception as e:
        return f"[Cloud Transcription failed: {str(e)}]"
