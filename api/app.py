from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time
import logging
import json

from api.schemas import QueryRequest, QueryResponse, SourceReference
from pipeline.ask import ask

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
