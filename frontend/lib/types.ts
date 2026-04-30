export interface SourceReference {
  file_path: string;
  name: string;
  score: number;
  rerank_score?: number;
}

export interface AskResponse {
  answer: string;
  sources: SourceReference[];
  retrieved_count: number;
  rewritten_query?: string;
  confidence: "high" | "medium" | "low" | "none";
  latency_ms: number;
}

export interface AskRequest {
  query: string;
  top_k?: number;
}

export type AppState = "idle" | "loading" | "success" | "error";
