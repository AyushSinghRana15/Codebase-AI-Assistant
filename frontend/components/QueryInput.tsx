"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { VoiceButton } from "./VoiceButton";
import { VoiceState } from "@/hooks/useVoiceAssistant";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  voiceState: VoiceState;
  isVoiceMode: boolean;
  voiceSupported: boolean;
  onVoiceToggle: () => void;
  interimTranscript: string;
}

export function QueryInput({
  value,
  onChange,
  onSubmit,
  disabled,
  voiceState,
  isVoiceMode,
  voiceSupported,
  onVoiceToggle,
  interimTranscript,
}: Props) {
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      if (value.trim()) onSubmit();
    }
  };

  const placeholder = voiceState === "listening"
    ? "Listening..."
    : isVoiceMode
    ? "Voice mode active — speak your query"
    : "Ask anything about your codebase...";

  return (
    <div className="relative w-full">
      <div
        className={`w-full rounded-xl overflow-hidden transition-all duration-200 focus-within:border-[#3b82f6]/40 ${
          voiceState === "listening" ? "ring-2 ring-[#3b82f6]/30" : ""
        }`}
        style={{
          border: `1px solid ${
            voiceState === "listening" ? "rgba(59,130,246,0.4)" : "var(--border-subtle)"
          }`,
          background: "var(--bg-card)",
        }}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={placeholder}
          disabled={disabled || voiceState === "listening"}
          rows={2}
          maxLength={1000}
          className="w-full bg-transparent text-sm px-5 pt-4 pb-12 pr-20 resize-none focus:outline-none font-sans leading-relaxed disabled:opacity-50 placeholder:opacity-50"
          style={{ color: "var(--text-primary)" }}
        />
        {interimTranscript && voiceState === "listening" && (
          <div
            className="absolute left-5 top-3 text-xs italic opacity-60 pointer-events-none truncate max-w-[calc(100%-6rem)]"
            style={{ color: "var(--text-primary)" }}
          >
            {interimTranscript}
          </div>
        )}
        <div className="absolute right-3 bottom-3 flex items-center gap-1">
          {voiceSupported && (
            <VoiceButton
              voiceState={voiceState}
              isVoiceMode={isVoiceMode}
              supported={voiceSupported}
              onToggle={onVoiceToggle}
            />
          )}
          <button
            onClick={onSubmit}
            disabled={disabled || !value.trim()}
            className="h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_16px_rgba(59,130,246,0.3)]"
            style={{
              background: value.trim() ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "var(--muted)",
            }}
          >
            <ArrowUp className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
      {value.length > 800 && (
        <span className="absolute right-14 bottom-3 text-xs" style={{ color: "var(--text-muted)" }}>
          {value.length}/1000
        </span>
      )}
    </div>
  );
}
