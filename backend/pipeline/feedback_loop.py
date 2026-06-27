# feedback_loop.py — Record user feedback and compute aggregate stats

from typing import Dict, List, Optional, Callable
from collections import deque
import time
import json
import os


_feedback_store: List[Dict] = []
_max_size = 500


# Record a single feedback entry (query, answer, rating, user)
def record_feedback(
    query: str,
    answer: str,
    sources: List[Dict],
    user_rating: Optional[int] = None,
    user_id: Optional[str] = None,
    pipeline_steps: Optional[Dict] = None,
):
    entry = {
        "query": query,
        "answer": answer,
        "sources": sources,
        "user_rating": user_rating,
        "user_id": user_id,
        "pipeline_steps": pipeline_steps or {},
        "timestamp": time.time(),
    }
    _feedback_store.append(entry)
    if len(_feedback_store) > _max_size:
        _feedback_store.pop(0)


# Return the N most recent feedback entries
def get_recent_feedback(n: int = 10) -> List[Dict]:
    return list(_feedback_store)[-n:]


# Aggregate feedback stats: total entries, average rating, rated count
def get_feedback_stats() -> Dict:
    if not _feedback_store:
        return {"total": 0, "avg_rating": None}

    ratings = [f["user_rating"] for f in _feedback_store if f["user_rating"] is not None]
    return {
        "total": len(_feedback_store),
        "avg_rating": round(sum(ratings) / len(ratings), 2) if ratings else None,
        "rated_count": len(ratings),
    }


# Export all feedback to a JSON file
def export_feedback(path: str = "feedback_log.json"):
    with open(path, "w") as f:
        json.dump(_feedback_store, f, indent=2, default=str)


# Load feedback from a JSON file into the in-memory store
def load_feedback(path: str = "feedback_log.json"):
    global _feedback_store
    if os.path.exists(path):
        with open(path) as f:
            _feedback_store = json.load(f)
