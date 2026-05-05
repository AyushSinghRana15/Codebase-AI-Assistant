from functools import lru_cache
from typing import Dict, List
import time

from config import *
from embeddings.retriever import retrieve
from pipeline.reranker import rerank
from pipeline.query_classifier import classify_query, get_pipeline_config
from pipeline.hybrid_retriever import hybrid_retrieve
from pipeline.context_expander import expand_context
from llm.generator import generate_answer
from pipeline.reflector import reflect
from pipeline.validator import validate_answer, score_confidence, shape_response
from pipeline.query_corrector import correct_query, get_query_suggestions


def normalize_query(q: str) -> str:
    return q.lower().strip().rstrip("?")


@lru_cache(maxsize=CACHE_MAX_SIZE)
def cached_ask(query: str) -> Dict:
    return _ask_impl(query)


def build_context(results: List[dict]) -> str:
    """Build context string from retrieved results."""
    parts = []
    for r in results:
        meta = r["metadata"]
        header = f"[{meta.get('file_path', 'unknown')}] {meta.get('chunk_type', 'unknown')}: {meta.get('name', 'unknown')}"
        content = r["content"][:PER_CHUNK_MAX_TOKENS]
        parts.append(f"--- {header} ---\n{content}")
    return "\n\n".join(parts)


def _ask_impl(query: str) -> Dict:
    start = time.time()

    # 1. Classify intent
    intent = classify_query(query) if ENABLE_CLASSIFIER else "general"
    cfg = get_pipeline_config(intent) if ENABLE_CLASSIFIER else {"top_k": TOP_K_RETRIEVE, "bm25_weight": 0.5, "max_additions": CONTEXT_MAX_ADDITIONS}

    # 2. Retrieve (hybrid FAISS + BM25)
    results = hybrid_retrieve(query, top_k=cfg["top_k"])

    # 3. Rerank
    if ENABLE_RERANKING and len(results) > TOP_K_RERANK:
        results = rerank(query, results, top_n=TOP_K_RERANK)
    else:
        results = results[:TOP_K_RERANK]

    # 4. Build context and generate answer
    context = build_context(results)
    answer = generate_answer(query, results)

    # 5. Validate
    validation = validate_answer(answer, results)

    # 6. Build sources
    sources = [
        {
            "file_path": r["metadata"]["file_path"],
            "name": r["metadata"].get("name", ""),
            "score": round(r.get("score", 0), 3),
            "rerank_score": round(r.get("rerank_score", 0), 3) if r.get("rerank_score") else None
        }
        for r in results[:5]
    ]

    response = {
        "answer": answer,
        "sources": sources,
        "retrieved_count": len(results),
        "validation": validation
    }
    response["latency_ms"] = round((time.time() - start) * 1000, 1)
    return response


def ask(query: str, top_k: int = 10) -> Dict:
    """
    Full RAG pipeline: query → spell-check → classify → hybrid retrieve → rerank → generate → validate.
    """
    # Spell-check the query
    try:
        corrected_query, was_corrected = correct_query(query)
    except Exception:
        corrected_query, was_corrected = query, False

    original_query = query if was_corrected else None

    if was_corrected:
        print(f"[Query Correction] '{query}' → '{corrected_query}'")
        query = corrected_query

    # Hybrid retrieval (FAISS + BM25)
    results = hybrid_retrieve(query, top_k=top_k)

    if ENABLE_RERANKING and len(results) > TOP_K_RERANK:
        results = rerank(query, results, top_n=TOP_K_RERANK)
    else:
        results = results[:TOP_K_RERANK]

    # Generate answer (always generate, even with low-confidence results)
    answer = generate_answer(query, results)

    # Validate
    try:
        validation = validate_answer(answer, results)
    except Exception:
        validation = {"is_grounded": len(results) > 0, "reason": ""}

    # Build sources
    sources = [
        {
            "file_path": r["metadata"]["file_path"],
            "name": r["metadata"].get("name", ""),
            "score": round(r.get("score", 0), 3),
            "rerank_score": round(r.get("rerank_score", 0), 3) if r.get("rerank_score") else None
        }
        for r in results[:5]
    ]

    return {
        "answer": answer,
        "sources": sources,
        "retrieved_count": len(results),
        "rewritten_query": None,
        "corrected_query": corrected_query if was_corrected else None,
        "original_query": original_query,
        "validation": validation
    }
