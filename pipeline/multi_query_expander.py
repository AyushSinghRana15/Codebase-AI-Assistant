from typing import List
from llm.generator import generate_answer


TEMPLATE_VARIATIONS = {
    "what": [
        "What is the purpose of {query}",
        "Explain {query} in detail",
        "Describe how {query} works",
    ],
    "how": [
        "How is {query} implemented",
        "Show the implementation of {query}",
        "What is the mechanism behind {query}",
    ],
    "where": [
        "Where is {query} defined",
        "Find the location of {query}",
        "Which file contains {query}",
    ],
    "why": [
        "What is the reason for {query}",
        "Explain the purpose of {query}",
        "What causes {query}",
    ],
}


def _template_expand(query: str) -> List[str]:
    q_lower = query.lower().strip()
    for keyword, templates in TEMPLATE_VARIATIONS.items():
        if q_lower.startswith(keyword):
            return [t.format(query=query) for t in templates]
    return [
        query,
        f"Find code related to {query}",
        f"Explain {query} in the codebase",
    ]


def llm_expand(query: str, num_variations: int = 3) -> List[str]:
    prompt = f"""Generate {num_variations} different search queries for a codebase RAG system based on the original query below.

Original query: {query}

Requirements:
- Each variation should rephrase the same intent differently
- Add specific technical terms or synonyms where appropriate
- Keep each query concise (under 15 words)
- Return one query per line, no numbering

Return exactly {num_variations} queries:"""

    try:
        response = generate_answer(query, [{"content": prompt, "metadata": {}}])
        if response:
            lines = [l.strip().strip('"').strip("'") for l in response.split('\n') if l.strip()]
            valid = [l for l in lines if len(l) > 5 and l.lower() != query.lower()][:num_variations]
            if valid:
                return [query] + valid
    except Exception:
        pass

    return _template_expand(query)


def expand_queries(query: str, use_llm: bool = False, num_variations: int = 3) -> List[str]:
    if use_llm:
        return llm_expand(query, num_variations)
    return _template_expand(query)
