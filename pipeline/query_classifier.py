from typing import Dict


INTENT_RULES = [
    (["where is", "which file", "find", "locate"],        "location"),
    (["how does", "explain the flow", "walk me through"],  "flow"),
    (["what does", "what is", "describe"],                 "explanation"),
    (["why does", "why is", "what causes", "error"],       "debug"),
    (["summarize", "overview", "architecture"],            "general"),
]


def classify_query(query: str) -> str:
    q = query.lower()
    for patterns, intent in INTENT_RULES:
        if any(p in q for p in patterns):
            return intent
    return "general"


def get_pipeline_config(intent: str) -> Dict:
    return {
        "location":    {"top_k": 15, "bm25_weight": 0.7, "max_additions": 1},
        "flow":        {"top_k": 15, "bm25_weight": 0.3, "max_additions": 5},
        "explanation": {"top_k": 10, "bm25_weight": 0.4, "max_additions": 3},
        "debug":       {"top_k": 15, "bm25_weight": 0.6, "max_additions": 4},
        "general":     {"top_k": 8,  "bm25_weight": 0.3, "max_additions": 2},
    }[intent]
