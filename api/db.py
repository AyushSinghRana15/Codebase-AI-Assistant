import os
import logging
from datetime import datetime, timezone
from typing import Optional
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

_supabase_admin: Optional[Client] = None
logger = logging.getLogger(__name__)


def get_admin_client() -> Client:
    global _supabase_admin
    if _supabase_admin is None:
        if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
            raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env")
        _supabase_admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    return _supabase_admin


def upsert_user(user_id: str, email: str, name: str, avatar_url: str) -> dict:
    client = get_admin_client()
    now = datetime.now(timezone.utc).isoformat()
    data = {
        "id": user_id,
        "email": email,
        "name": name,
        "avatar_url": avatar_url,
        "updated_at": now,
    }
    result = client.table("users").upsert(data, on_conflict="id").execute()
    return result.data[0] if result.data else data


def get_user(user_id: str) -> Optional[dict]:
    client = get_admin_client()
    result = client.table("users").select("*").eq("id", user_id).execute()
    return result.data[0] if result.data else None


def update_user_profile(user_id: str, name: Optional[str] = None, bio: Optional[str] = None) -> Optional[dict]:
    client = get_admin_client()
    updates = {"updated_at": datetime.now(timezone.utc).isoformat()}
    if name is not None:
        updates["name"] = name
    if bio is not None:
        updates["bio"] = bio
    result = client.table("users").update(updates).eq("id", user_id).execute()
    return result.data[0] if result.data else None


def save_query_history(user_id: str, query: str, answer: str, sources: list, latency_ms: float):
    client = get_admin_client()
    data = {
        "user_id": user_id,
        "query": query,
        "answer": answer,
        "sources": sources,
        "latency_ms": latency_ms,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    client.table("query_history").insert(data).execute()


def get_query_history(user_id: str, limit: int = 50) -> list:
    client = get_admin_client()
    result = (
        client.table("query_history")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data


def get_user_repos(user_id: str) -> list:
    client = get_admin_client()
    result = (
        client.table("user_repos")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


def save_user_repo(user_id: str, repo_url: str):
    client = get_admin_client()
    data = {
        "user_id": user_id,
        "repo_url": repo_url,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    client.table("user_repos").upsert(data, on_conflict="user_id,repo_url").execute()


def get_user_stats(user_id: str) -> dict:
    client = get_admin_client()
    hist = (
        client.table("query_history")
        .select("id", count="exact")
        .eq("user_id", user_id)
        .execute()
    )
    repos = (
        client.table("user_repos")
        .select("id", count="exact")
        .eq("user_id", user_id)
        .execute()
    )
    return {
        "query_count": hist.count if hasattr(hist, "count") else len(hist.data),
        "repo_count": repos.count if hasattr(repos, "count") else len(repos.data),
    }
