// QueryInput — textarea for user queries with voice mode and send button

"use client";

import { useState } from "react";
import { ArrowUp, AudioLines } from "lucide-react";
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

  // Submit on Enter (without Shift) when not composing IME text
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      if (value.trim()) onSubmit();
    }
  };

  // Dynamic placeholder based on voice state
  const placeholder = voiceState === "listening"
    ? "Listening..."
    : isVoiceMode
    ? "Voice is ready"
    : "Message RepoSplit";

  // Show interim transcript when listening
  const displayValue = voiceState === "listening"
    ? interimTranscript || value
    : value;

  return (
    <div className="relative w-full">
      {/* Input container with border highlight during voice */}
      <div
        className={`w-full overflow-hidden rounded-[1.6rem] transition-all duration-200 focus-within:border-[#10a37f]/50 ${
          voiceState === "listening" ? "ring-2 ring-[#10a37f]/25" : ""
        }`}
        style={{
          border: `1px solid ${
            voiceState === "listening" ? "rgba(16,163,127,0.45)" : "var(--border-subtle)"
          }`,
          background: "color-mix(in srgb, var(--bg-card) 94%, white 6%)",
        }}
      >
        <textarea
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={placeholder}
          disabled={disabled || voiceState === "listening"}
          rows={2}
          maxLength={1000}
          className="max-h-44 min-h-[5rem] w-full resize-none bg-transparent px-5 pb-12 pt-4 pr-24 font-sans text-[15px] leading-relaxed focus:outline-none disabled:opacity-70 placeholder:opacity-50"
          style={{ color: "var(--text-primary)" }}
        />
        {/* Live transcript indicator during voice input */}
        {voiceState === "listening" && (
          <div
            className="pointer-events-none absolute bottom-4 left-5 flex max-w-[calc(100%-7.5rem)] items-center gap-2 truncate text-xs"
            style={{ color: "#10a37f" }}
          >
            <AudioLines className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{interimTranscript || "Listening"}</span>
          </div>
        )}
        {/* Action buttons: voice toggle and send */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
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
            disabled={disabled || voiceState === "listening" || !value.trim()}
            aria-label="Send message"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30 hover:shadow-[0_0_16px_rgba(16,163,127,0.28)]"
            style={{
              background: value.trim() ? "#f4f4f5" : "var(--muted)",
            }}
          >
            <ArrowUp className="h-4 w-4 text-black" />
          </button>
        </div>
      </div>
      {/* Character count warning near limit */}
      {value.length > 800 && (
        <span className="absolute bottom-3 right-24 text-xs" style={{ color: "var(--text-muted)" }}>
          {value.length}/1000
        </span>
      )}
    </div>
  );
}
