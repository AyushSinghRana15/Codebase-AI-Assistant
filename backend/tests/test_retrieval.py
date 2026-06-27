# test_retrieval.py — FAISS retrieval accuracy tests against known queries

import os
import sys

_TEST_ROOT = os.path.dirname(os.path.abspath(__file__))
_BACKEND_ROOT = os.path.dirname(_TEST_ROOT)
_PROJECT_ROOT = os.path.dirname(_BACKEND_ROOT)

sys.path.insert(0, _BACKEND_ROOT)  # backend/ on path for package imports

from typing import List, Dict
CHUNKS_PATH = os.path.join(_PROJECT_ROOT, "output", "chunks.json")
QUERIES_PATH = os.path.join(_BACKEND_ROOT, "eval", "test_queries.json")
SCORE_THRESHOLD = 1.4


# Load chunks from the JSON file
def load_chunks():
    import json
    with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


# Load test queries from JSON
def load_queries():
    import json
    with open(QUERIES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data if isinstance(data, list) else data["queries"]


# Run FAISS retrieval and filter results by score threshold
def retriever(query: str, top_k: int = 5) -> List[Dict]:
    """
    Retriever using FAISS vector search.
    Returns list of dicts with 'chunk' and 'score' keys.
    """
    from embeddings.retriever import retrieve
    results = retrieve(query, top_k=top_k, score_threshold=SCORE_THRESHOLD)
    filtered = [r for r in results if r["score"] <= SCORE_THRESHOLD]
    return [{"chunk": r, "score": r["score"]} for r in filtered]


# Run all test queries and report pass/fail for each
def run_retrieval_tests():
    queries = load_queries()
    print(f"Loaded {len(queries)} test queries\n")

    for q in queries:
        query = q["query"]
        expected_file = q.get("expected_file_hint")
        expected_name = q.get("expected_name_hint")
        expect_empty = q.get("expect_empty", False)

        print(f'Query: "{query}"')
        print("-" * 50)

        results = retriever(query, top_k=5)

        if expect_empty:
            if not results:
                print("Result: ✅ PASS (no relevant results as expected)\n")
                continue
            else:
                print("Result: ❌ FAIL (expected empty but got results)\n")
                continue

        for i, r in enumerate(results[:3], 1):
            chunk = r["chunk"]
            meta = chunk["metadata"]
            print(f"  #{i}  {meta['file_path']} :: {meta['name']}  [L2: {r['score']:.4f}]")

        passed = False
        if expected_file:
            for r in results:
                if expected_file.lower() in r["chunk"]["metadata"]["file_path"].lower():
                    passed = True
                    break
        if expected_name and not passed:
            for r in results:
                if expected_name.lower() in r["chunk"]["metadata"]["name"].lower():
                    passed = True
                    break
        if not expected_file and not expected_name:
            passed = len(results) > 0

        print(f"Result: {'✅ PASS' if passed else '❌ FAIL'}")
        print()


if __name__ == "__main__":
    run_retrieval_tests()
