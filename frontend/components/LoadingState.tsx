"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Searching codebase...",
  "Retrieving relevant chunks...",
  "Reranking results...",
  "Expanding context...",
  "Generating answer...",
  "Validating response...",
];

export function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full rounded-xl p-6"
      style={{
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-2 h-2">
          <span className="absolute inset-0 rounded-full bg-[#3b82f6] animate-ping opacity-40" />
          <span className="relative w-2 h-2 rounded-full bg-[#3b82f6]" />
        </div>
        <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
          {MESSAGES[messageIndex]}
        </span>
      </div>
      <div className="space-y-3">
        <div className="h-3 rounded-full w-full animate-pulse" style={{ background: "var(--border-subtle)" }} />
        <div className="h-3 rounded-full w-[90%] animate-pulse" style={{ background: "var(--border-subtle)" }} />
        <div className="h-3 rounded-full w-[95%] animate-pulse" style={{ background: "var(--border-subtle)" }} />
        <div className="h-3 rounded-full w-[70%] animate-pulse" style={{ background: "var(--border-subtle)" }} />
      </div>
    </div>
  );
}
