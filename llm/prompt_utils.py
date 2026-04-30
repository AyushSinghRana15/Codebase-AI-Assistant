import os
from typing import List, Dict

_SYSTEM_PROMPT = None
_SYSTEM_PROMPT_PATH = os.path.join(os.path.dirname(__file__), "..", "AGENT.md")


def load_system_prompt() -> str:
    global _SYSTEM_PROMPT
    if _SYSTEM_PROMPT is not None:
        return _SYSTEM_PROMPT

    try:
        with open(_SYSTEM_PROMPT_PATH, "r", encoding="utf-8") as f:
            base = f.read()
    except FileNotFoundError:
        base = "You are a helpful code assistant."

    additional = """
ADDITIONAL RULES:
- You MUST cite the file path and function name for every claim.
- If the answer is not in the context, respond: "I could not find this in the provided codebase."
- Do NOT use any knowledge outside the provided context.
- Temperature is set to 0.2 — prioritize factual, code-grounded answers.
"""
    _SYSTEM_PROMPT = base + "\n" + additional
    return _SYSTEM_PROMPT


def approx_tokens(text: str) -> int:
    return len(text) // 4


def build_user_message(query: str, context: str) -> str:
    return f"Query: {query}\n\nContext:\n{context}"


def assemble_messages(query: str, context: str) -> List[Dict]:
    system_prompt = load_system_prompt()
    user_message = build_user_message(query, context)
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]
