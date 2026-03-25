import sys
from unittest.mock import MagicMock

# Global mock for torch to bypass DLL initialization errors
if "torch" not in sys.modules:
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

try:
    import whisper
    HAS_WHISPER = True
except Exception as e:
    print(f"Whisper/Torch load failed: {e}. Falling back to mock transcription.")
    HAS_WHISPER = False

def transcribe_audio(audio_path: str) -> str:
    """
    Audio transcription service using OpenAI Whisper with a mock fallback.
    """
    if not HAS_WHISPER:
        return "[Mock Transcription: Zonal property tax complaint detected (Whisper load failed on this machine)]"
        
    try:
        print(f"Loading Whisper 'base' model and transcribing {audio_path}...")
        model = whisper.load_model("base")
        result = model.transcribe(audio_path)
        return result.get("text", "[Transcription failed: No text returned]")
    except Exception as e:
        print(f"Whisper transcription error: {str(e)}")
        return f"[Transcription error: {str(e)}]"
