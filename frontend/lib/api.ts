import { AskResponse, AskRequest } from "./types";

export async function askAPI(request: AskRequest): Promise<AskResponse> {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: request.query, top_k: request.top_k ?? 5 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}
