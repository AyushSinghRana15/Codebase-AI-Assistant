from typing import Dict, List, Optional
from collections import deque
import time


# In-memory chat history store (used when db.py stubs are not connected)
_chat_history: Dict[str, deque] = {}
_user_profiles: Dict[str, dict] = {}


def set_user_profile(user_id: str, profile: dict):
    _user_profiles[user_id] = profile


def get_user_profile(user_id: str) -> Optional[dict]:
    return _user_profiles.get(user_id)


def add_to_history(user_id: str, query: str, answer: str, maxlen: int = 5):
    if user_id not in _chat_history:
        _chat_history[user_id] = deque(maxlen=maxlen)
    _chat_history[user_id].append({
        "query": query,
        "answer": answer,
        "timestamp": time.time(),
    })


def get_history(user_id: str, max_count: int = 5) -> List[dict]:
    history = _chat_history.get(user_id, deque())
    return list(history)[-max_count:]


def build_context_profile(user_id: Optional[str], config: dict) -> dict:
    context = {
        "user_id": user_id,
        "profile": {},
        "recent_queries": [],
    }

    if not user_id:
        return context

    profile = get_user_profile(user_id)
    if profile:
        fields = config.get("CONTEXT_PROFILE_FIELDS", ["name", "bio"])
        context["profile"] = {k: v for k, v in profile.items() if k in fields and v}

    history = get_history(user_id, config.get("CONTEXT_HISTORY_MAX", 5))
    context["recent_queries"] = [
        {"query": h["query"], "answer": h["answer"][:200]}
        for h in history
    ]

    return context


def enrich_query_with_context(query: str, context: dict) -> str:
    if not context.get("recent_queries"):
        return query

    recent = context["recent_queries"]
    last_query = recent[-1]["query"]

    if query.lower().startswith(("it", "they", "that", "this", "those", "these")):
        return f"{last_query} {query}"

    if any(rel in query.lower() for rel in ["also", "additionally", "moreover", "further"]):
        return f"{last_query} {query}"

    return query
