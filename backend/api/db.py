# db.py — CRUD operations for users, query history, and repos via Supabase (with in-memory fallback)

import logging
from datetime import datetime, timezone
from typing import Optional, Dict, List
from supabase import create_client, Client
import os

logger = logging.getLogger(__name__)

_supabase: Optional[Client] = None

# In-memory fallback store (used when Supabase is not connected)
_user_store: Dict[str, dict] = {}
_query_history: Dict[str, list] = {}
_user_repos: Dict[str, list] = {}


# Lazy-init Supabase client (non-admin, for data operations)
def _get_client() -> Optional[Client]:
    global _supabase
    if _supabase is None:
        url = os.environ.get("SUPABASE_URL", "")
        key = os.environ.get("SUPABASE_SERVICE_KEY", "")
        if url and key and "placeholder" not in url and "placeholder" not in key:
            try:
                _supabase = create_client(url, key)
            except Exception as e:
                logger.warning(f"Failed to create Supabase client: {e}")
    return _supabase


# Create or update a user record (falls back to in-memory store)
def upsert_user(user_id: str, email: str, name: str, avatar_url: str) -> dict:
    client = _get_client()
    if client:
        try:
            data = {
                "id": user_id,
                "email": email,
                "name": name,
                "avatar_url": avatar_url,
                "bio": "",
            }
            result = client.table("users").upsert(data, on_conflict="id").execute()
            if result.data:
                return result.data[0]
        except Exception as e:
            logger.warning(f"Supabase upsert_user failed: {e}")

    profile = {
        "id": user_id,
        "email": email,
        "name": name,
        "avatar_url": avatar_url,
        "bio": "",
    }
    _user_store[user_id] = profile
    return profile


# Fetch a user by ID (falls back to in-memory store)
def get_user(user_id: str) -> Optional[dict]:
    client = _get_client()
    if client:
        try:
            result = client.table("users").select("*").eq("id", user_id).execute()
            if result.data:
                return result.data[0]
        except Exception as e:
            logger.warning(f"Supabase get_user failed: {e}")
    return _user_store.get(user_id)


# Update name/bio for a user (falls back to in-memory store)
def update_user_profile(user_id: str, name: Optional[str] = None, bio: Optional[str] = None) -> Optional[dict]:
    client = _get_client()
    if client:
        try:
            updates = {}
            if name is not None:
                updates["name"] = name
            if bio is not None:
                updates["bio"] = bio
            if not updates:
                return get_user(user_id)
            result = client.table("users").update(updates).eq("id", user_id).execute()
            if result.data:
                return result.data[0]
        except Exception as e:
            logger.warning(f"Supabase update_user_profile failed: {e}")

    profile = _user_store.get(user_id)
    if not profile:
        return None
    if name is not None:
        profile["name"] = name
    if bio is not None:
        profile["bio"] = bio
    return profile


# Save a query/answer pair to history (falls back to in-memory store)
def save_query_history(user_id: str, query: str, answer: str, sources: list, latency_ms: float):
    client = _get_client()
    if client:
        try:
            data = {
                "user_id": user_id,
                "query": query,
                "answer": answer,
                "sources": sources,
                "latency_ms": latency_ms,
            }
            client.table("query_history").insert(data).execute()
            return
        except Exception as e:
            logger.warning(f"Supabase save_query_history failed: {e}")

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
    if len(_query_history[user_id]) > 200:
        _query_history[user_id] = _query_history[user_id][-200:]


# Retrieve recent query history for a user (falls back to in-memory store)
def get_query_history(user_id: str, limit: int = 50) -> list:
    client = _get_client()
    if client:
        try:
            result = (
                client.table("query_history")
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            if result.data:
                return result.data
        except Exception as e:
            logger.warning(f"Supabase get_query_history failed: {e}")
    return _query_history.get(user_id, [])[-limit:]


# Record a repository ingested by a user (falls back to in-memory store)
def save_user_repo(user_id: str, repo_url: str):
    client = _get_client()
    if client:
        try:
            data = {
                "user_id": user_id,
                "repo_url": repo_url,
            }
            client.table("user_repos").upsert(data, on_conflict="user_id,repo_url").execute()
            return
        except Exception as e:
            logger.warning(f"Supabase save_user_repo failed: {e}")

    if user_id not in _user_repos:
        _user_repos[user_id] = []
    repo_entry = {
        "repo_url": repo_url,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    if repo_entry not in _user_repos[user_id]:
        _user_repos[user_id].append(repo_entry)


# List repos ingested by a user (falls back to in-memory store)
def get_user_repos(user_id: str) -> list:
    client = _get_client()
    if client:
        try:
            result = (
                client.table("user_repos")
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .execute()
            )
            if result.data:
                return result.data
        except Exception as e:
            logger.warning(f"Supabase get_user_repos failed: {e}")
    return _user_repos.get(user_id, [])


# Aggregate query and repo counts for a user (falls back to in-memory store)
def get_user_stats(user_id: str) -> dict:
    client = _get_client()
    if client:
        try:
            q_count = (
                client.table("query_history")
                .select("*", count="exact")
                .eq("user_id", user_id)
                .execute()
            )
            r_count = (
                client.table("user_repos")
                .select("*", count="exact")
                .eq("user_id", user_id)
                .execute()
            )
            return {
                "query_count": q_count.count if hasattr(q_count, 'count') else 0,
                "repo_count": r_count.count if hasattr(r_count, 'count') else 0,
            }
        except Exception as e:
            logger.warning(f"Supabase get_user_stats failed: {e}")

    return {
        "query_count": len(_query_history.get(user_id, [])),
        "repo_count": len(_user_repos.get(user_id, [])),
    }
