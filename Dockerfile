# Use the official Python 3.10 slim image
FROM python:3.10-slim
LABEL build_version="1.1.2-zero-torch"
LABEL build_date="2026-03-27T13:30:00Z"

# Set working directory to the backend directory
WORKDIR /app

# Install system dependencies required for Pytorch/Whisper and other packages
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first to leverage Docker cache
COPY mcd-backend/requirements.txt .

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend files
COPY mcd-backend/ .

# Expose port 10000 (Render's default port, though it dynamically maps it)
EXPOSE 10000

# Command to run the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
