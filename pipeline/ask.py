from typing import Dict, List

from embeddings.retriever import retrieve
from llm.generator import generate_answer


def ask(query: str, top_k: int = 5, score_threshold: float = 1.4) -> Dict:
    """
    Full RAG pipeline: query → retrieve → generate → return.

    Returns:
    {
        "answer": str,
        "sources": [{"file_path": ..., "name": ..., "score": ...}],
        "retrieved_count": int
    }
    """
    # 1. Retrieve
    results = retrieve(query, top_k=top_k)

    # 2. Filter by score threshold (hallucination firewall)
    relevant = [r for r in results if r["score"] < score_threshold]

    # 3. Generate
    answer = generate_answer(query, relevant)

    # 4. Return structured result
    sources = [
        {
            "file_path": r["metadata"]["file_path"],
            "name": r["metadata"].get("name", ""),
            "score": round(r["score"], 3)
        }
        for r in relevant
    ]

    return {
        "answer": answer,
        "sources": sources,
        "retrieved_count": len(relevant)
    }
