from pydantic import BaseModel
from typing import List, Optional, Dict


class QueryRequest(BaseModel):
    query: str
    top_k: int = 10


class SourceReference(BaseModel):
    file_path: str
    name: str
    score: float
    rerank_score: Optional[float] = None


class ValidationInfo(BaseModel):
    is_grounded: bool
    confidence: Optional[float] = None
    warning: Optional[str] = None


class ConfidenceInfo(BaseModel):
    level: str
    score: float
    message: Optional[str] = None


class LanguageInfo(BaseModel):
    natural_language: str
    programming_language: Optional[str] = None


class QueryResponse(BaseModel):
    answer: str
    sources: List[SourceReference]
    retrieved_count: int
    rewritten_query: Optional[str] = None
    corrected_query: Optional[str] = None
    original_query: Optional[str] = None
    entities: Optional[Dict] = None
    language: Optional[LanguageInfo] = None
    intent: Optional[str] = None
    validation: Optional[ValidationInfo] = None
    confidence: Optional[ConfidenceInfo] = None
    pipeline_steps: Optional[Dict[str, float]] = None
    latency_ms: float = 0


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
