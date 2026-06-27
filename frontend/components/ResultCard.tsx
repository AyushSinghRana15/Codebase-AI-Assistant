// ResultCard — renders the assistant's answer with markdown, metadata, and actions

"use client";

import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { AskResponse } from "@/lib/types";
import { useState } from "react";
import { SpeakButton } from "./SpeakButton";
import { VoiceState } from "@/hooks/useVoiceAssistant";

// Confidence level color styles
const CONFIDENCE_STYLE: Record<string, string> = {
  high: "text-[#16a34a] bg-[#16a34a]/10 border-[#16a34a]/20",
  medium: "text-[#ca8a04] bg-[#ca8a04]/10 border-[#ca8a04]/20",
  low: "text-[#ea580c] bg-[#ea580c]/10 border-[#ea580c]/20",
  none: "text-[#dc2626] bg-[#dc2626]/10 border-[#dc2626]/20",
};

interface Props {
  result: AskResponse;
  voiceState: VoiceState;
  onSpeak: () => void;
  onStopSpeaking: () => void;
}

export function ResultCard({ result, voiceState, onSpeak, onStopSpeaking }: Props) {
  const [copied, setCopied] = useState(false);

  // Determine confidence level from result or validation data
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

  // Copy answer to clipboard with visual feedback
  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      {/* Query correction banner */}
      {(result.corrected_query || result.original_query) && (
        <div
          className="mb-4 rounded-lg border px-3 py-2 text-xs"
          style={{
            color: "var(--text-secondary)",
            borderColor: "var(--border-subtle)",
            background: "var(--bg-card)",
          }}
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

      {/* Answer rendered as markdown */}
      <div className="prose prose-sm max-w-none text-sm leading-7" style={{ color: "var(--text-primary)" }}>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {result.answer}
        </ReactMarkdown>
      </div>

      {/* Footer: speak, copy, confidence, latency, chunks, validation */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SpeakButton
          voiceState={voiceState}
          onSpeak={onSpeak}
          onStop={onStopSpeaking}
        />
        <button
          onClick={handleCopy}
          aria-label="Copy answer"
          title="Copy answer"
          className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/10"
          style={{ color: "var(--text-muted)" }}
        >
          {copied ? (
            <Check className="h-4 w-4 text-[#16a34a]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>

        {/* Confidence badge */}
        <span
          className={`ml-1 rounded-md border px-2 py-1 font-mono text-xs ${CONFIDENCE_STYLE[confidenceLevel]}`}
        >
          {confidenceLevel}
        </span>
        <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>{latencySec}s</span>
        <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
          {result.retrieved_count} chunks
        </span>
        {result.validation && (
          <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
            {result.validation.is_grounded ? "✓ Grounded" : "⚠ May not be grounded"}
          </span>
        )}
        {result.rewritten_query && (
          <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
            Rewritten: {result.rewritten_query}
          </span>
        )}
      </div>
    </div>
  );
}
