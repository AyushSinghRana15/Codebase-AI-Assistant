"use client";

import { Header } from "@/components/Header";
import { QueryInput } from "@/components/QueryInput";
import { LoadingState } from "@/components/LoadingState";
import { ResultCard } from "@/components/ResultCard";
import { SourcesPanel } from "@/components/SourcesPanel";
import { ErrorBanner } from "@/components/ErrorBanner";
import { GitHubIngestor } from "@/components/GitHubIngestor";
import { useAsk } from "@/hooks/useAsk";

export default function Home() {
  const { query, setQuery, result, state, error, submit, reset } = useAsk();

  return (
    <main className="min-h-screen flex flex-col items-center" style={{ background: "var(--bg-primary)" }}>
      <Header />
      <div className="w-full max-w-3xl px-6 py-10 flex flex-col gap-5">
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            <span className="gradient-text">CodeBaseAI</span>{" "}
            <span style={{ color: "var(--text-muted)" }}>Assistant</span>
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Ask natural language questions about any codebase. Get code-grounded answers with file citations.
          </p>
        </div>

        <GitHubIngestor />

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
            className="text-xs transition-colors self-center py-2 hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            New query
          </button>
        )}
      </div>
    </main>
  );
}
