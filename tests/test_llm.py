import os
from typing import List, Dict

CHUNKS_PATH = os.path.join(os.path.dirname(__file__), "..", "output", "chunks.json")


def load_chunks():
    import json
    with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def build_context(retrieved_chunks: List[Dict]) -> str:
    """Build context string from retrieved chunks."""
    context_parts = []
    for r in retrieved_chunks:
        chunk = r["chunk"]
        m = chunk["metadata"]
        part = f"[File: {m['file_path']}] — {m['chunk_type']}: {m['name']}\n{chunk['content']}"
        context_parts.append(part)
    return "\n\n".join(context_parts)


def call_llm(query: str, context: str) -> str:
    """
    Placeholder LLM call.
    TODO: Replace with actual LLM integration (OpenAI, Gemini, Ollama).
    """
    return f"[LLM Response] Based on the context provided, I found information about: {query}"


def run_llm_tests():
    """
    Test LLM integration with retrieved context.
    Tests: simple query, flow query, location query, hallucination check, missing file.
    """
    from test_retrieval import retriever

    test_cases = [
        {"prompt": "What does walk_repo do?", "type": "simple", "should_find": True},
        {"prompt": "Explain the ingestion flow step by step", "type": "flow", "should_find": True},
        {"prompt": "Where is file loading implemented?", "type": "location", "should_find": True},
        {"prompt": "What does the process_payment function do?", "type": "hallucination", "should_find": False},
        {"prompt": "Explain the AI recommendation module", "type": "missing", "should_find": False},
    ]

    print("=== Layer 3: LLM Integration Tests ===\n")

    for tc in test_cases:
        print(f"Type: {tc['type']}")
        print(f"Prompt: \"{tc['prompt']}\"")
        print("-" * 50)

        results = retriever(tc["prompt"], top_k=3)
        context = build_context(results) if results else ""

        if not tc["should_find"]:
            if not results or results[0]["score"] < 0.60:
                print("✅ PASS (correctly says not found)\n")
            else:
                print("❌ FAIL (should not find results but did)\n")
            continue

        response = call_llm(tc["prompt"], context)
        print(f"Response: {response[:200]}...")
        print("✅ Check: Verify response uses context, not hallucinated\n")


if __name__ == "__main__":
    run_llm_tests()
