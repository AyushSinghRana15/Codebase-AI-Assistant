"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onIngestComplete?: () => void;
}

export function GitHubIngestor({ onIngestComplete }: Props) {
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ files: number; chunks: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIngest = async () => {
    if (!repoUrl.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({ repo_url: repoUrl });
      if (branch) params.append("branch", branch);

      const res = await fetch(`/api/ingest/github?${params}`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Ingestion failed");
      }

      setResult({
        files: data.files_processed,
        chunks: data.chunks_created,
      });
      onIngestComplete?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border overflow-hidden" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-card)" }}>
      <div className="h-1 bg-gradient-to-r from-[#8b5cf6] to-transparent" />

      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="h-4 w-4 text-[#8b5cf6]" />
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Add GitHub Repository
          </span>
        </div>

        <div className="space-y-3">
          <Input
            placeholder="https://github.com/username/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            disabled={loading}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Branch (optional, default: main)"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleIngest}
              disabled={loading || !repoUrl.trim()}
              style={{
                background: loading || !repoUrl.trim()
                  ? undefined
                  : "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cloning...
                </>
              ) : (
                "Ingest"
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {result && (
            <div className="flex items-center gap-2 text-sm text-[#16a34a]">
              <CheckCircle className="h-4 w-4" />
              Processed {result.files} files, created {result.chunks} chunks
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
