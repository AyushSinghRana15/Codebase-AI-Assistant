# prompt_utils.py — Load system prompts and assemble message lists for the LLM

import os
from typing import List, Dict

from config import PROJECT_ROOT

_SYSTEM_PROMPT = None
_GENERAL_SYSTEM_PROMPT = None
_SYSTEM_PROMPT_PATH = os.path.join(PROJECT_ROOT, "AGENT.md")


# Load and cache the code-specific system prompt from AGENT.md (with additional rules)
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
- If the answer is not in the context, say what you CAN find related to the query rather than just "I could not find this."
- If you have partial information, provide it and note what's missing.
- Do NOT use any knowledge outside the provided context.
- Temperature is set to 0.2 — prioritize factual, code-grounded answers.
- Always try to be helpful — even with limited context, share what you know about the codebase.
"""
    _SYSTEM_PROMPT = base + "\n" + additional
    return _SYSTEM_PROMPT


# Load and cache the general-purpose system prompt (for non-code questions)
def load_general_system_prompt() -> str:
    global _GENERAL_SYSTEM_PROMPT
    if _GENERAL_SYSTEM_PROMPT is not None:
        return _GENERAL_SYSTEM_PROMPT

    _GENERAL_SYSTEM_PROMPT = """You are CodeBase AI, a helpful voice-enabled assistant that answers questions using both code context and web search results.

When answering:
- If web search results are provided, use them as your primary source and cite them.
- If you have prior knowledge about the topic, combine it with any provided web results.
- Keep your answers concise and natural — this will be read aloud by text-to-speech.
- Avoid markdown formatting, code blocks, or anything that doesn't sound natural when spoken.
- If you don't know the answer, say so honestly.
- Be conversational but informative.

Rules:
1. Prioritize provided context (code or web) over your own knowledge.
2. When citing sources, mention them naturally (e.g., "according to...").
3. Do NOT invent facts. If you're unsure, say you're not sure.
4. Keep answers brief — 2-4 sentences when possible (spoken aloud)."""
    return _GENERAL_SYSTEM_PROMPT


# Build a user message string from query and context
def build_user_message(query: str, context: str) -> str:
    return f"Query: {query}\n\nContext:\n{context}"


# Assemble system + user messages for code-specific Q&A
def assemble_messages(query: str, context: str) -> List[Dict]:
    system_prompt = load_system_prompt()
    user_message = build_user_message(query, context)
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]


# Assemble system + user messages for general-purpose Q&A (no code context)
def assemble_general_messages(query: str, context: str) -> List[Dict]:
    system_prompt = load_general_system_prompt()
    user_message = build_user_message(query, context)
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]
