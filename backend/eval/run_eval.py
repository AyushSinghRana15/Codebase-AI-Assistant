import json
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pipeline.ask import ask

EVAL_QUERIES = [
    {
        "query": "Where is file loading implemented?",
        "expected_file_hint": "loader",
        "expected_keywords": ["walk_repo", "read_file"],
        "should_find": True
    },
    {
        "query": "Explain the ingestion flow step by step",
        "expected_file_hint": "main",
        "expected_keywords": ["ingestion", "chunks"],
        "should_find": True
    },
    {
        "query": "Which file handles chunking?",
        "expected_file_hint": "chunker",
        "expected_keywords": ["parse_chunks", "create_chunk"],
        "should_find": True
    },
    {
        "query": "Where is hybrid retrieval implemented?",
        "expected_file_hint": "hybrid_retriever",
        "expected_keywords": ["hybrid", "bm25", "faiss"],
        "should_find": True
    },
    {
        "query": "Which file has the generate_answer function?",
        "expected_file_hint": "generator",
        "expected_keywords": ["openai", "llm"],
        "should_find": True
    },
    {
        "query": "Where is the BM25Index class defined?",
        "expected_file_hint": "hybrid_retriever",
        "expected_keywords": ["bm25", "index"],
        "should_find": True
    },
    {
        "query": "How does query classification work?",
        "expected_file_hint": "query_classifier",
        "expected_keywords": ["classif", "intent"],
        "should_find": True
    },
    {
        "query": "How is context built from retrieved chunks?",
        "expected_file_hint": "context_builder",
        "expected_keywords": ["context", "token"],
        "should_find": True
    },
    {
        "query": "ask_endpoint health_check endpoint functions",
        "expected_file_hint": "app.py",
        "expected_keywords": ["ask", "ingest", "health"],
        "should_find": True
    },
    {
        "query": "Where is answer validation implemented?",
        "expected_file_hint": "validator",
        "expected_keywords": ["valid", "ground"],
        "should_find": True
    },
    {
        "query": "What is the QueryRequest schema?",
        "expected_file_hint": "schemas",
        "expected_keywords": ["pydantic", "model"],
        "should_find": True
    },
    {
        "query": "How does AST parsing extract Python code?",
        "expected_file_hint": "ast_parser",
        "expected_keywords": ["ast", "parse"],
        "should_find": True
    },
    {
        "query": "Where is the payment gateway?",
        "expected_file_hint": None,
        "should_find": False
    },
    {
        "query": "Where is the AI recommendation module?",
        "expected_file_hint": None,
        "should_find": False
    },
    {
        "query": "Stripe payment integration code",
        "expected_file_hint": None,
        "should_find": False
    },
    {
        "query": "Redis caching layer implementation",
        "expected_file_hint": None,
        "should_find": False
    }
]


def run_eval():
    total_score = 0
    max_score = len(EVAL_QUERIES) * 4

    print("# Evaluation Results\n")

    for i, eq in enumerate(EVAL_QUERIES, 1):
        print(f"## Query {i}: \"{eq['query']}\"")
        result = ask(eq["query"])

        score = 0

        if eq["should_find"]:
            found_file = any(
                eq["expected_file_hint"] in s["file_path"].lower()
                for s in result["sources"]
            )
            if found_file:
                score += 1
                print(f"✅ File hint found")
            else:
                print(f"❌ File hint NOT found")

            keywords_found = [k for k in eq["expected_keywords"] if k in result["answer"].lower()]
            if keywords_found:
                score += 1
                print(f"✅ Keywords found: {keywords_found}")
            else:
                print(f"❌ Keywords NOT found")

        else:
            if "could not find" in result["answer"].lower() or not result["sources"]:
                score += 2
                print(f"✅ Correctly returned 'not found'")
            else:
                print(f"❌ Incorrectly found results for non-existent feature")

        if result["validation"] and result["validation"]["is_grounded"]:
            score += 1
            print(f"✅ Answer is grounded")
        else:
            print(f"❌ Answer may not be grounded")

        if result["sources"]:
            score += 1
            print(f"✅ Sources provided")

        print(f"Score: {score}/4\n")
        total_score += score

    percentage = (total_score / max_score) * 100
    print(f"## Final Score: {total_score}/{max_score} ({percentage:.1f}%)")

    if percentage >= 80:
        print("✅ PASSED — Ready for demo")
    else:
        print("⚠️ NEEDS IMPROVEMENT")


if __name__ == "__main__":
    run_eval()
