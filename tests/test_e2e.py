import os
from typing import List, Dict

QUERIES = [
    "Where is authentication implemented?",
    "Explain the login flow step by step",
    "How is data stored in this project?",
    "Which file handles API routes?",
    "What does the walk_repo function do?",
    "Where is error handling done?",
    "Where is AI module?",
    "Explain the payment gateway",
]


def run_e2e_tests():
    """
    End-to-end simulation: run all 8 standard queries against full system.
    Fill eval/scorecard.md manually after reviewing results.
    """
    from test_retrieval import retriever
    from test_llm import call_llm, build_context

    print("=== Layer 4: End-to-End Tests ===\n")

    for i, query in enumerate(QUERIES, 1):
        print(f"#{i}. \"{query}\"")
        print("-" * 50)

        results = retriever(query, top_k=5)
        context = build_context(results) if results else ""

        if not results or results[0]["score"] < 0.60:
            print("Response: No relevant results found.\n")
        else:
            response = call_llm(query, context)
            print(f"Response preview: {response[:150]}...\n")
            print(">>> Fill in eval/scorecard.md with scores (1-5) for this query\n")


if __name__ == "__main__":
    run_e2e_tests()
