import { useState, useCallback } from "react";
import { AskResponse, AppState } from "@/lib/types";
import { askAPI } from "@/lib/api";

export function useAsk() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AskResponse | null>(null);
  const [state, setState] = useState<AppState>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async () => {
    if (!query.trim()) return;
    setState("loading");
    setError(null);
    setResult(null);

    try {
      const data = await askAPI({ query });
      setResult(data);
      setState("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setState("error");
    }
  }, [query]);

  const reset = useCallback(() => {
    setQuery("");
    setResult(null);
    setState("idle");
    setError(null);
  }, []);

  return { query, setQuery, result, state, error, submit, reset };
}
