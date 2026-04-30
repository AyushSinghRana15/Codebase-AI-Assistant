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


def normalize_query(q: str) -> str:
    return q.lower().strip().rstrip("?")


@lru_cache(maxsize=CACHE_MAX_SIZE)
def cached_ask(query: str) -> Dict:
    return _ask_impl(query)


def _ask_impl(query: str) -> Dict:
    start = time.time()

    # 1. Classify intent
    intent = classify_query(query) if ENABLE_CLASSIFIER else "general"
    cfg = get_pipeline_config(intent) if ENABLE_CLASSIFIER else {"top_k": TOP_K_RETRIEVE, "bm25_weight": 0.5, "max_additions": CONTEXT_MAX_ADDITIONS}

    # 2. Retrieve (hybrid)
    if ENABLE_HYBRID_RETRIEVAL:
        results = hybrid_retrieve(query, top_k=cfg["top_k"])
    else:
        results = retrieve(query, top_k=cfg["top_k"])

    # 3. Rerank
    if ENABLE_RERANKING and len(results) > TOP_K_RERANK:
        results = rerank(query, results, top_n=TOP_K_RERANK)
    else:
        results = results[:TOP_K_RERANK]

    # 4. Confidence check (pre-LLM firewall)
    confidence = score_confidence(results, answer="", intent=intent) if ENABLE_CONFIDENCE_SCORING else {"level": "high", "score": 1.0}

    if confidence["level"] == "none":
        response = shape_response("", confidence, results)
        response["latency_ms"] = round((time.time() - start) * 1000, 1)
        return response

    # 5. Context expansion (multi-hop)
    if CONTEXT_EXPANSION_ENABLED and 'dependency_graph' in globals():
        results = expand_context(results, dependency_graph, max_additions=cfg["max_additions"])

    # 6. Generate answer
    context = build_context(results)
    draft_answer = generate_answer(query, results)

    # 7. Self-reflection
    if ENABLE_REFLECTION and confidence["level"] != "high":
        final_answer = reflect(query, draft_answer, context[:1500])
    else:
        final_answer = draft_answer

    # 8. Shape response with confidence
    response = shape_response(final_answer, confidence, results)
    response["latency_ms"] = round((time.time() - start) * 1000, 1)
    return response


def ask(query: str, top_k: int = 5, score_threshold: float = 1.4) -> Dict:
    """
    Full RAG pipeline: query → classify → retrieve → rerank → expand → generate → reflect.
    """
    rewritten = rewrite_query(query) if 'rewrite_query' in globals() else query

    results = retrieve(rewritten, top_k=TOP_K_RETRIEVE)

    if ENABLE_RERANKING:
        results = rerank(rewritten, results, top_n=TOP_K_RERANK)

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
