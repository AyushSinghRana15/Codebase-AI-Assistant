"use client";

import { Header } from "@/components/Header";
import { QueryInput } from "@/components/QueryInput";
import { LoadingState } from "@/components/LoadingState";
import { ResultCard } from "@/components/ResultCard";
import { SourcesPanel } from "@/components/SourcesPanel";
import { ErrorBanner } from "@/components/ErrorBanner";
import { useAsk } from "@/hooks/useAsk";

export default function Home() {
  const { query, setQuery, result, state, error, submit, reset } = useAsk();

  return (
    <main className="min-h-screen bg-background flex flex-col items-center">
      <Header />
      <div className="w-full max-w-3xl px-4 py-8 flex flex-col gap-6">
        <QueryInput
          value={query}
          onChange={setQuery}
          onSubmit={submit}
          disabled={state === "loading"}
        />

        {state === "loading" && <LoadingState />}
        {state === "error" && (
          <ErrorBanner message={error!} onRetry={submit} />
        )}

        {state === "success" && result && (
          <>
            <ResultCard result={result} />
            <SourcesPanel sources={result.sources} />
          </>
        )}

        {state !== "idle" && (
          <button
            onClick={reset}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors self-center"
          >
            New query
          </button>
        )}
      </div>
    </main>
  );
}
