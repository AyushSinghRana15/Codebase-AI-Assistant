from sentence_transformers import CrossEncoder
from config import RERANK_MODEL

_reranker = None


def get_reranker():
    global _reranker
    if _reranker is None:
        _reranker = CrossEncoder(RERANK_MODEL)
    return _reranker


def rerank(query: str, results: list, top_n: int = 5) -> list:
    if not results:
        return []

    model = get_reranker()
    pairs = [[query, r["content"]] for r in results]
    scores = model.predict(pairs)

    for r, s in zip(results, scores):
        r["rerank_score"] = float(s)

    ranked = sorted(results, key=lambda x: x["rerank_score"], reverse=True)
    return ranked[:top_n]
