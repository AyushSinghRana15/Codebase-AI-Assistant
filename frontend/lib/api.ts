// API client — askAPI for submitting queries, getAccessToken for auth

import { AskResponse, AskRequest } from "./types";
import { getSupabase } from "./supabase";

// Retrieve Supabase access token for authenticated requests
async function getAccessToken(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

// Submit a query to the /api/ask endpoint with optional auth
export async function askAPI(request: AskRequest): Promise<AskResponse> {
  const token = await getAccessToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch("/api/ask", {
    method: "POST",
    headers,
    body: JSON.stringify({ query: request.query, top_k: request.top_k ?? 5 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}
