"use client";

import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { AskResponse } from "@/lib/types";
import { useState } from "react";

const CONFIDENCE_STYLE: Record<string, string> = {
  high: "text-[#16a34a] bg-[#16a34a]/10 border-[#16a34a]/20",
  medium: "text-[#ca8a04] bg-[#ca8a04]/10 border-[#ca8a04]/20",
  low: "text-[#ea580c] bg-[#ea580c]/10 border-[#ea580c]/20",
  none: "text-[#dc2626] bg-[#dc2626]/10 border-[#dc2626]/20",
};

interface Props {
  result: AskResponse;
}

export function ResultCard({ result }: Props) {
  const [copied, setCopied] = useState(false);

  // Get confidence level from either top-level or validation object
  const confidenceLevel = result.confidence ?? (() => {
    const conf = result.validation?.confidence;
    if (conf === undefined) return "medium";
    if (conf >= 0.75) return "high";
    if (conf >= 0.45) return "medium";
    if (conf > 0) return "low";
    return "none";
  })();

  const latencyMs = result.latency_ms ?? 0;
  const latencySec = (latencyMs / 1000).toFixed(1);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
      }}
    >
      <div className="h-1 bg-gradient-to-r from-[#3b82f6] to-transparent" />

      <div className="p-6">
        {(result.corrected_query || result.original_query) && (
          <div className="mb-4 text-xs px-3 py-2 rounded-lg border"
            style={{ color: "var(--text-secondary)", borderColor: "var(--border-subtle)", background: "var(--muted)" }}
          >
            {result.original_query && result.corrected_query ? (
              <span>
                Query corrected:{" "}
                <span className="line-through opacity-50">{result.original_query}</span>{" "}
                → <span className="font-medium">{result.corrected_query}</span>
              </span>
            ) : result.corrected_query ? (
              <span>Query corrected to: {result.corrected_query}</span>
            ) : null}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Answer</span>
            <span
              className={`px-2 py-0.5 text-xs font-mono rounded-md border ${CONFIDENCE_STYLE[confidenceLevel]}`}
            >
              {confidenceLevel}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="h-8 w-8 rounded-md flex items-center justify-center transition-colors hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            {copied ? (
              <Check className="h-4 w-4 text-[#16a34a]" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        <div
          className="rounded-lg p-5 mb-4 text-sm leading-relaxed"
          style={{ background: "var(--muted)" }}
        >
          <div className="prose prose-sm max-w-none" style={{ color: "var(--text-primary)" }}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {result.answer}
            </ReactMarkdown>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          <span>{latencySec}s</span>
          <span>{result.retrieved_count} chunks</span>
          {result.validation && (
            <span>
              {result.validation.is_grounded ? "✓ Grounded" : "⚠ May not be grounded"}
            </span>
          )}
          {result.rewritten_query && (
            <span>Rewritten: {result.rewritten_query}</span>
          )}
        </div>
      </div>
    </div>
  );
}
