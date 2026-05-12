from pydantic import BaseModel
from typing import List, Optional


class QueryRequest(BaseModel):
    query: str
    top_k: int = 5


class SourceReference(BaseModel):
    file_path: str
    name: str
    score: float
    rerank_score: Optional[float] = None


class QueryResponse(BaseModel):
    answer: str
    sources: List[SourceReference]
    retrieved_count: int
    rewritten_query: Optional[str] = None
    validation: Optional[dict] = None
    latency_ms: float


class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None


class QueryHistoryItem(BaseModel):
    id: int
    query: str
    answer: str
    sources: list
    latency_ms: float
    created_at: str


class UserRepo(BaseModel):
    repo_url: str
    created_at: str


class UserStats(BaseModel):
    query_count: int
    repo_count: int
