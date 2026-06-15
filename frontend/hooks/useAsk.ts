import { useState, useCallback } from "react";
import { AskResponse, AppState } from "@/lib/types";
import { askAPI } from "@/lib/api";

export function useAsk() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [result, setResult] = useState<AskResponse | null>(null);
  const [state, setState] = useState<AppState>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (nextQuery?: string) => {
    const activeQuery = (nextQuery ?? (query || submittedQuery)).trim();
    if (!activeQuery) return;

    setSubmittedQuery(activeQuery);
    setQuery("");
    setState("loading");
    setError(null);
    setResult(null);

    try {
      const data = await askAPI({ query: activeQuery });
      setResult(data);
      setState("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setState("error");
    }
  }, [query, submittedQuery]);

  const reset = useCallback(() => {
    setQuery("");
    setSubmittedQuery("");
    setResult(null);
    setState("idle");
    setError(null);
  }, []);

  return { query, setQuery, submittedQuery, result, state, error, submit, reset };
}
