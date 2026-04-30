from typing import Dict, List
from llm.generator import generate_answer


SKIP_REFLECTION_IF = [
    lambda draft, results: "not found" in draft.lower(),
    lambda draft, results: len(results) == 0,
]


def reflect(query: str, draft_answer: str, context: str) -> str:
    """Second-pass LLM call to verify and correct the draft answer."""
    if any(check(draft_answer, []) for check in SKIP_REFLECTION_IF):
        return draft_answer

    prompt = f"""You are verifying an AI answer about a codebase.

QUERY: {query}
CONTEXT (retrieved code):
{context[:1500]}   
DRAFT ANSWER: {draft_answer}

Your task:
1. Check each claim in the draft answer against the context.
2. If a claim is NOT supported by the context → remove or correct it.
3. If the answer is fully correct → return it unchanged.
4. If you remove claims → add: "(Note: limited to provided context)"

Return ONLY the corrected answer. No explanation."""

    try:
        response = generate_answer(query, [{"content": prompt, "metadata": {}}])
        return response if response else draft_answer
    except Exception:
        return draft_answer
