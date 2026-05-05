import re
from typing import List, Dict


class BM25Index:
    def __init__(self, chunks: List[dict]):
        try:
            from rank_bm25 import BM25Okapi
            tokenized = [self._tokenize(c["content"]) for c in chunks]
            self.bm25 = BM25Okapi(tokenized)
            self.chunks = chunks
            self.available = True
        except ImportError:
            self.available = False

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'[a-zA-Z0-9_]+', text.lower())

    def search(self, query: str, top_k: int = 10) -> List[dict]:
        if not self.available:
            return []
        tokens = self._tokenize(query)
        scores = self.bm25.get_scores(tokens)
        top_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:top_k]
        results = []
        for i in top_indices:
            if scores[i] <= 0:
                continue
            chunk = self.chunks[i].copy()
            chunk["bm25_score"] = float(scores[i])
            results.append(chunk)
        return results


_bm25_index = None


def get_bm25_index() -> BM25Index:
    global _bm25_index
    if _bm25_index is None:
        from embeddings.retriever import get_all_chunks
        chunks = get_all_chunks()
        _bm25_index = BM25Index(chunks)
    return _bm25_index


def reciprocal_rank_fusion(faiss_results: List[dict], bm25_results: List[dict], k: int = 60) -> List[dict]:
    scores = {}
    chunk_map = {}

    for rank, result in enumerate(faiss_results):
        name = result["metadata"].get("name", result["metadata"]["file_path"])
        scores[name] = scores.get(name, 0) + 1 / (k + rank + 1)
        chunk_map[name] = result

    for rank, result in enumerate(bm25_results):
        name = result["metadata"].get("name", result["metadata"]["file_path"])
        scores[name] = scores.get(name, 0) + 1 / (k + rank + 1)
        chunk_map[name] = result

    sorted_names = sorted(scores.keys(), key=lambda n: scores[n], reverse=True)
    return [chunk_map[n] for n in sorted_names]


def hybrid_retrieve(query: str, top_k: int = 15) -> List[dict]:
    """Hybrid retrieval: FAISS + BM25 fused via RRF."""
    from embeddings.retriever import retrieve
    faiss_results = retrieve(query, top_k=top_k)

    bm25 = get_bm25_index()
    if not bm25.available:
        return faiss_results[:top_k]

    bm25_results = bm25.search(query, top_k=top_k)

    if not bm25_results:
        return faiss_results[:top_k]

    fused = reciprocal_rank_fusion(faiss_results, bm25_results)
    return fused[:top_k]
