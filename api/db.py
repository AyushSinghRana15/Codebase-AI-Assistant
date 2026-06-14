import logging
from datetime import datetime, timezone
from typing import Optional, Dict, List

logger = logging.getLogger(__name__)

# In-memory fallback store (used when Supabase is not connected)
_user_store: Dict[str, dict] = {}
_query_history: Dict[str, list] = {}
_user_repos: Dict[str, list] = {}


def upsert_user(user_id: str, email: str, name: str, avatar_url: str) -> dict:
    profile = {
        "id": user_id,
        "email": email,
        "name": name,
        "avatar_url": avatar_url,
        "bio": "",
    }
    _user_store[user_id] = profile
    return profile


def get_user(user_id: str) -> Optional[dict]:
    return _user_store.get(user_id)


def update_user_profile(user_id: str, name: Optional[str] = None, bio: Optional[str] = None) -> Optional[dict]:
    profile = _user_store.get(user_id)
    if not profile:
        return None
    if name is not None:
        profile["name"] = name
    if bio is not None:
        profile["bio"] = bio
    return profile


def save_query_history(user_id: str, query: str, answer: str, sources: list, latency_ms: float):
    if user_id not in _query_history:
        _query_history[user_id] = []
    _query_history[user_id].append({
        "id": len(_query_history[user_id]) + 1,
        "query": query,
        "answer": answer,
        "sources": sources,
        "latency_ms": latency_ms,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    # Keep last 200 entries
    if len(_query_history[user_id]) > 200:
        _query_history[user_id] = _query_history[user_id][-200:]


def get_query_history(user_id: str, limit: int = 50) -> list:
    history = _query_history.get(user_id, [])
    return history[-limit:]


def get_user_repos(user_id: str) -> list:
    return _user_repos.get(user_id, [])


def save_user_repo(user_id: str, repo_url: str):
    if user_id not in _user_repos:
        _user_repos[user_id] = []
    repo_entry = {
        "repo_url": repo_url,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    if repo_entry not in _user_repos[user_id]:
        _user_repos[user_id].append(repo_entry)


def get_user_stats(user_id: str) -> dict:
    query_count = len(_query_history.get(user_id, []))
    repo_count = len(_user_repos.get(user_id, []))
    return {"query_count": query_count, "repo_count": repo_count}
