FROM python:3.11-slim

WORKDIR /app
ENV PYTHONPATH=/app/src

# Install system dependencies required for faiss and sentence-transformers
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code and prompts
COPY src/ ./src/
COPY prompts/ ./prompts/

# ChromaDB persistent storage volume mount point
VOLUME ["/app/chroma_db"]

EXPOSE 8000

# Run the FastAPI app
CMD ["uvicorn", "service.api:app", "--host", "0.0.0.0", "--port", "8000"]
