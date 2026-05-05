import os
import pickle
import time

from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
VECTOR_STORE_DIR = os.path.join(os.path.dirname(__file__), "..", "vector_store")

_model = None
_index = None
_metadata = None
_chunks = None


def _load():
    global _model, _index, _metadata, _chunks
    if _model is not None:
        return

    faiss_path = os.path.join(VECTOR_STORE_DIR, "code_index.faiss")
    metadata_path = os.path.join(VECTOR_STORE_DIR, "metadata.pkl")

    _model = SentenceTransformer(EMBED_MODEL)
    _index = faiss.read_index(faiss_path)
    with open(metadata_path, "rb") as f:
        _metadata = pickle.load(f)
    _chunks = _metadata


def retrieve(query: str, top_k: int = 10, score_threshold: float = 2.5) -> list:
    """Retrieve chunks by semantic similarity. Returns top results even if above threshold."""
    _load()
    start = time.time()

    query_vec = _model.encode([query]).astype("float32")
    # Search more candidates than requested to have buffer
    search_k = max(top_k * 2, 20)
    distances, indices = _index.search(query_vec, search_k)

    all_results = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx < 0:
            continue
        chunk = _metadata[idx]
        all_results.append({
            "content": chunk["content"],
            "metadata": chunk["metadata"],
            "score": round(float(dist), 4),
        })

    # Filter by threshold but keep at least top_k results
    threshold_results = [r for r in all_results if r["score"] <= score_threshold]
    if len(threshold_results) >= top_k:
        results = threshold_results[:top_k]
    else:
        # Fallback: return the top results even if above threshold
        results = all_results[:top_k]

    elapsed = round((time.time() - start) * 1000, 2)
    print(f"Retrieved {len(results)} chunks in {elapsed}ms (threshold={score_threshold})")
    return results


def retrieve_with_threshold(query: str, top_k: int = 5, max_l2: float = 2.5) -> list:
    results = retrieve(query, top_k=top_k)
    # Only return empty if truly no results
    if not results:
        return []
    return results


def get_all_chunks() -> list:
    """Return all indexed chunks for BM25 indexing."""
    _load()
    return _chunks
