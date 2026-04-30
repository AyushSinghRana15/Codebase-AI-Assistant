"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileCode } from "lucide-react";
import { SourceReference } from "@/lib/types";

interface Props {
  sources: SourceReference[];
}

function getScoreColor(score: number): string {
  if (score < 0.5) return "text-green-400";
  if (score < 1.0) return "text-yellow-400";
  return "text-orange-400";
}

export function SourcesPanel({ sources }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="w-full">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left hover:bg-muted/50 px-2 py-2 rounded-md transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          Sources ({sources.length} chunks)
        </span>
      </button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {sources.map((source, idx) => (
            <div
              key={`${source.file_path}-${idx}`}
              className="border border-border rounded-lg p-3 text-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <FileCode className="h-3 w-3 text-muted-foreground" />
                <span className="font-mono text-xs">{source.file_path}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{source.name}</span>
                <span className={getScoreColor(source.score)}>
                  score: {source.score.toFixed(2)}
                </span>
                {source.rerank_score !== undefined && (
                  <span>rerank: {source.rerank_score.toFixed(2)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
