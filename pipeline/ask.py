from functools import lru_cache
from typing import Dict, List
import time

from config import TOP_K_RETRIEVE, TOP_K_RERANK, SCORE_THRESHOLD, ENABLE_RERANKING
from embeddings.retriever import retrieve
from pipeline.reranker import rerank
from pipeline.query_rewriter import rewrite_query
from llm.generator import generate_answer
from pipeline.validator import validate_answer


def normalize_query(q: str) -> str:
    return q.lower().strip().rstrip("?")


@lru_cache(maxsize=200)
def cached_ask(query: str) -> Dict:
    return _ask_impl(query)


def ask(query: str, top_k: int = 5, score_threshold: float = 1.4) -> Dict:
    """
    Full RAG pipeline: query → rewrite → retrieve → rerank → generate → validate.
    """
    rewritten = rewrite_query(query)
    
    results = retrieve(rewritten, top_k=TOP_K_RETRIEVE)
    
    if ENABLE_RERANKING and len(results) > top_k:
        results = rerank(rewritten, results, top_n=TOP_K_RERANK)
    else:
        results = results[:top_k]
    
    relevant = [r for r in results if r["score"] < score_threshold]
    
    answer = generate_answer(query, relevant)
    
    validation = validate_answer(answer, relevant)
    
    sources = [
        {
            "file_path": r["metadata"]["file_path"],
            "name": r["metadata"].get("name", ""),
            "score": round(r["score"], 3),
            "rerank_score": round(r.get("rerank_score", 0), 3) if r.get("rerank_score") else None
        }
        for r in relevant
    ]
    
    return {
        "answer": answer,
        "sources": sources,
        "retrieved_count": len(relevant),
        "rewritten_query": rewritten if rewritten != query else None,
        "validation": validation
    }


def _ask_impl(query: str) -> Dict:
    return ask(query)