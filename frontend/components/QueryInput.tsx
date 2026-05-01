"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export function QueryInput({ value, onChange, onSubmit, disabled }: Props) {
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      if (value.trim()) onSubmit();
    }
  };

  return (
    <div className="relative w-full">
      <div
        className="w-full rounded-xl overflow-hidden transition-all duration-200 focus-within:border-[#3b82f6]/40"
        style={{
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
        }}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="Ask anything about your codebase..."
          disabled={disabled}
          rows={2}
          maxLength={1000}
          className="w-full bg-transparent text-sm px-5 pt-4 pb-12 pr-14 resize-none focus:outline-none font-sans leading-relaxed disabled:opacity-50 placeholder:opacity-50"
          style={{ color: "var(--text-primary)" }}
        />
        <button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="absolute right-3 bottom-3 h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_16px_rgba(59,130,246,0.3)]"
          style={{
            background: value.trim() ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "var(--muted)",
          }}
        >
          <ArrowUp className="h-4 w-4 text-white" />
        </button>
      </div>
      {value.length > 800 && (
        <span className="absolute right-14 bottom-3 text-xs" style={{ color: "var(--text-muted)" }}>
          {value.length}/1000
        </span>
      )}
    </div>
  );
}
