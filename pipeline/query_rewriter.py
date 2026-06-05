from typing import Optional
from llm.generator import generate_answer


TEMPLATES = {
    "where":   "Find the code that implements: {query}",
    "how":     "Find the code that explains how: {query}",
    "what":    "Find the code definition and logic for: {query}",
    "explain": "Find all code related to: {query}",
    "default": "Find code related to: {query}",
}


def rewrite_template(query: str) -> str:
    q_lower = query.lower().strip()
    for keyword, template in TEMPLATES.items():
        if q_lower.startswith(keyword):
            return template.format(query=query)
    return TEMPLATES["default"].format(query=query)


def rewrite_llm(query: str) -> Optional[str]:
    prompt = f"""Rewrite the following user query into an effective search query for a codebase RAG system.

Original query: {query}

Rules:
- Focus on technical terms and code concepts
- Remove conversational filler
- Keep it concise (under 20 words)
- Use terminology likely to appear in code

Return only the rewritten query, no explanation."""

    try:
        response = generate_answer(query, [{"content": prompt, "metadata": {}}])
        if response and len(response) > 3:
            return response.strip()
    except Exception:
        pass
    return None


def rewrite_query(query: str, use_llm: bool = False) -> str:
    if use_llm:
        llm_result = rewrite_llm(query)
        if llm_result:
            return llm_result
    return rewrite_template(query)
