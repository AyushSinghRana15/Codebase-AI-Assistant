from sentence_transformers import CrossEncoder
from sentence_transformers import SentenceTransformer
from config import RERANK_MODEL, EMBED_MODEL
import numpy as np

_reranker = None
_embedder = None


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


def mmr_diversify(
    results: list,
    query: str,
    top_n: int = 5,
    lambda_: float = 0.5,
) -> list:
    """Maximal Marginal Relevance: balance relevance with diversity.
    Higher lambda_ = more weight on relevance (less diversity).
    """
    if len(results) <= top_n:
        return results

    global _embedder
    if _embedder is None:
        _embedder = SentenceTransformer(EMBED_MODEL)

    texts = [r["content"] for r in results]
    emb = _embedder.encode(texts)
    query_vec = _embedder.encode([query])[0]

    query_sim = np.dot(emb, query_vec) / (
        np.linalg.norm(emb, axis=1) * np.linalg.norm(query_vec) + 1e-10
    )

    selected = [0]
    candidates = list(range(1, len(results)))

    while len(selected) < min(top_n, len(results)):
        best_score = -1
        best_idx = -1
        for c in candidates:
            relevance = query_sim[c]
            max_sim = max(
                np.dot(emb[c], emb[s]) / (
                    np.linalg.norm(emb[c]) * np.linalg.norm(emb[s]) + 1e-10
                )
                for s in selected
            )
            mmr_score = lambda_ * relevance - (1 - lambda_) * max_sim
            if mmr_score > best_score:
                best_score = mmr_score
                best_idx = c
        if best_idx >= 0:
            selected.append(best_idx)
            candidates.remove(best_idx)
        else:
            break

    return [results[i] for i in selected]
