// Shared type definitions for the frontend application

// A single source chunk retrieved from the codebase
export interface SourceReference {
  file_path: string;
  name: string;
  score: number;
  rerank_score?: number;
}

// Validation metadata about the answer
export interface ValidationInfo {
  is_grounded: boolean;
  confidence: number;
  warning: string | null;
}

// Complete response from the ask API
export interface AskResponse {
  answer: string;
  sources: SourceReference[];
  retrieved_count: number;
  rewritten_query?: string;
  original_query?: string;
  corrected_query?: string;
  validation?: ValidationInfo;
  confidence?: "high" | "medium" | "low" | "none";
  latency_ms?: number;
}

// Request payload for the ask API
export interface AskRequest {
  query: string;
  top_k?: number;
}

// UI state machine for the ask flow
export type AppState = "idle" | "loading" | "success" | "error";
