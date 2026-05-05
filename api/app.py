from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time
import logging
import json
from typing import Optional

from api.schemas import QueryRequest, QueryResponse, SourceReference
from pipeline.ask import ask
from ingestion.github_ingestor import ingest_github_repo, cleanup_repo

logging.basicConfig(level=logging.INFO, format='{"time": "%(asctime)s", "level": "%(levelname)s", "msg": "%(message)s", "module": "%(module)s"}')

app = FastAPI(
    title="CodeBase AI Assistant",
    description="Natural language Q&A over code repositories",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}


@app.post("/ask", response_model=QueryResponse)
def ask_endpoint(request: QueryRequest):
    start = time.time()
    try:
        result = ask(request.query, top_k=request.top_k)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    result["latency_ms"] = round((time.time() - start) * 1000, 1)

    logging.info(json.dumps({
        "event": "query",
        "query": request.query,
        "rewritten": result.get("rewritten_query"),
        "retrieved": result.get("retrieved_count"),
        "latency_ms": result["latency_ms"],
        "is_grounded": result.get("validation", {}).get("is_grounded") if result.get("validation") else None
    }))

    return result


@app.get("/stats")
def stats():
    from embeddings.retriever import _index
    return {
        "total_chunks": _index.ntotal if _index else 0,
        "index_loaded": _index is not None
    }


@app.post("/ingest/github")
def ingest_github(repo_url: str, branch: Optional[str] = None):
    """Clone and ingest a GitHub repository."""
    try:
        import json
        import os
        from ingestion.chunker import parse_chunks
        from embeddings.embedder import build_embed_text, EMBED_MODEL, BATCH_SIZE, VECTOR_STORE_DIR
        from sentence_transformers import SentenceTransformer
        import faiss
        import numpy as np
        import pickle
        import time

        CHUNKS_PATH = os.path.join(os.path.dirname(__file__), "..", "output", "chunks.json")

        lang_map = {
            ".py": "python", ".js": "javascript", ".ts": "typescript",
            ".jsx": "javascript", ".tsx": "typescript", ".java": "java",
            ".cpp": "cpp", ".c": "c", ".go": "go", ".rs": "rust",
            ".rb": "ruby", ".php": "php", ".swift": "swift", ".kt": "kotlin",
            ".md": "markdown", ".txt": "text",
        }

        files = ingest_github_repo(repo_url, branch)
        if not files:
            raise HTTPException(status_code=400, detail="No supported files found in repository")

        all_chunks = []
        for file_path in files:
            ext = os.path.splitext(file_path)[1]
            language = lang_map.get(ext, "text")
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            chunks = parse_chunks(file_content=content, file_path=file_path, language=language)
            all_chunks.extend(chunks)

        if not all_chunks:
            raise HTTPException(status_code=400, detail="No chunks generated from repository")

        os.makedirs(os.path.dirname(CHUNKS_PATH), exist_ok=True)
        with open(CHUNKS_PATH, "w", encoding="utf-8") as f:
            json.dump(all_chunks, f)

        os.makedirs(VECTOR_STORE_DIR, exist_ok=True)

        logging.info(f"Loading model: {EMBED_MODEL}")
        model = SentenceTransformer(EMBED_MODEL)
        texts = [build_embed_text(c) for c in all_chunks]

        logging.info(f"Generating embeddings for {len(texts)} chunks...")
        start = time.time()
        embeddings = model.encode(texts, batch_size=BATCH_SIZE, show_progress_bar=False)
        elapsed = round(time.time() - start, 2)

        embeddings = np.array(embeddings).astype("float32")
        dim = embeddings.shape[1]

        logging.info(f"Building FAISS index (dim={dim})...")
        index = faiss.IndexFlatL2(dim)
        index.add(embeddings)

        faiss_path = os.path.join(VECTOR_STORE_DIR, "code_index.faiss")
        metadata_path = os.path.join(VECTOR_STORE_DIR, "metadata.pkl")

        faiss.write_index(index, faiss_path)
        with open(metadata_path, "wb") as f:
            pickle.dump(all_chunks, f)

        logging.info(f"Indexing complete: {len(all_chunks)} chunks in {elapsed}s")

        return {
            "status": "success",
            "files_processed": len(files),
            "chunks_created": len(all_chunks),
            "indexing_time_s": elapsed,
            "repo_url": repo_url
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
