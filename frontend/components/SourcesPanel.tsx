"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileCode } from "lucide-react";
import { SourceReference } from "@/lib/types";

interface Props {
  sources: SourceReference[];
}

function getScoreColor(score: number): string {
  if (score < 0.5) return "text-[#16a34a]";
  if (score < 1.0) return "text-[#ca8a04]";
  return "text-[#ea580c]";
}

export function SourcesPanel({ sources }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="w-full">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg transition-colors hover:opacity-80"
        style={{ background: "transparent" }}
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
        ) : (
          <ChevronRight className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
        )}
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Sources ({sources.length} chunks)
        </span>
      </button>

      {expanded && (
        <div className="mt-2 space-y-2 pl-1">
          {sources.map((source, idx) => (
            <div
              key={`${source.file_path}-${idx}`}
              className="rounded-lg p-4 text-sm transition-all duration-200 hover:opacity-80"
              style={{ border: "1px solid var(--border-subtle)", background: "var(--bg-secondary)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FileCode className="h-3.5 w-3.5 text-[#3b82f6]" />
                <span className="font-mono text-xs" style={{ color: "var(--text-primary)" }}>{source.file_path}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span style={{ color: "var(--text-secondary)" }}>{source.name}</span>
                <span className={getScoreColor(source.score)}>
                  L2: {source.score.toFixed(2)}
                </span>
                {source.rerank_score !== undefined && (
                  <span className="text-[#8b5cf6]">
                    rerank: {source.rerank_score.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
