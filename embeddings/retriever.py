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


def _load():
    global _model, _index, _metadata
    if _model is not None:
        return

    faiss_path = os.path.join(VECTOR_STORE_DIR, "code_index.faiss")
    metadata_path = os.path.join(VECTOR_STORE_DIR, "metadata.pkl")

    _model = SentenceTransformer(EMBED_MODEL)
    _index = faiss.read_index(faiss_path)
    with open(metadata_path, "rb") as f:
        _metadata = pickle.load(f)


def retrieve(query: str, top_k: int = 5, score_threshold: float = 1.5) -> list:
    _load()
    start = time.time()

    query_vec = _model.encode([query]).astype("float32")
    distances, indices = _index.search(query_vec, top_k)

    results = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx < 0:
            continue
        if score_threshold > 0 and dist > score_threshold:
            continue
        chunk = _metadata[idx]
        results.append({
            "content": chunk["content"],
            "metadata": chunk["metadata"],
            "score": round(float(dist), 4),
        })

    elapsed = round((time.time() - start) * 1000, 2)
    print(f"Retrieved {len(results)} chunks in {elapsed}ms")
    return results


def retrieve_with_threshold(query: str, top_k: int = 5, max_l2: float = 1.4) -> list:
    results = retrieve(query, top_k=top_k)
    if results and results[0]["score"] > max_l2:
        return []
    return results
