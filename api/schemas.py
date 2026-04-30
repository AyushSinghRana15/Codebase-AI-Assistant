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
