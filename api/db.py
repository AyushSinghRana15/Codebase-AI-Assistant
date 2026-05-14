import logging
from datetime import datetime, timezone
from typing import Optional

logger = logging.getLogger(__name__)


def upsert_user(user_id: str, email: str, name: str, avatar_url: str) -> dict:
    return {"id": user_id, "email": email, "name": name, "avatar_url": avatar_url}


def get_user(user_id: str) -> Optional[dict]:
    return None


def update_user_profile(user_id: str, name: Optional[str] = None, bio: Optional[str] = None) -> Optional[dict]:
    return None


def save_query_history(user_id: str, query: str, answer: str, sources: list, latency_ms: float):
    pass


def get_query_history(user_id: str, limit: int = 50) -> list:
    return []


def get_user_repos(user_id: str) -> list:
    return []


def save_user_repo(user_id: str, repo_url: str):
    pass


def get_user_stats(user_id: str) -> dict:
    return {"query_count": 0, "repo_count": 0}
