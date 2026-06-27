# schemas.py — Pydantic models for request/response data validation

from pydantic import BaseModel
from typing import List, Optional, Dict


# Incoming query from the user
class QueryRequest(BaseModel):
    query: str
    top_k: int = 10


# A single code reference returned as a source
class SourceReference(BaseModel):
    file_path: str
    name: str
    score: float
    rerank_score: Optional[float] = None


# Validation metadata: whether the answer is grounded in retrieved context
class ValidationInfo(BaseModel):
    is_grounded: bool
    confidence: Optional[float] = None
    warning: Optional[str] = None


# Confidence level and score for the generated answer
class ConfidenceInfo(BaseModel):
    level: str
    score: float
    message: Optional[str] = None


# Detected natural and programming languages in the query
class LanguageInfo(BaseModel):
    natural_language: str
    programming_language: Optional[str] = None


# Full response returned by the /ask endpoint
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


# User profile stored in the database
class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None


# Request body for updating user profile fields
class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None


# A single entry in the user's query history
class QueryHistoryItem(BaseModel):
    id: int
    query: str
    answer: str
    sources: list
    latency_ms: float
    created_at: str


# A repository ingested by the user
class UserRepo(BaseModel):
    repo_url: str
    created_at: str


# Aggregated user statistics
class UserStats(BaseModel):
    query_count: int
    repo_count: int
