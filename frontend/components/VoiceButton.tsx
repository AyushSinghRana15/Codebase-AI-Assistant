"use client";

import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import { VoiceState } from "@/hooks/useVoiceAssistant";

interface Props {
  voiceState: VoiceState;
  isVoiceMode: boolean;
  supported: boolean;
  onToggle: () => void;
}

export function VoiceButton({ voiceState, isVoiceMode, supported, onToggle }: Props) {
  if (!supported) return null;

  const getState = () => {
    switch (voiceState) {
      case "listening":
        return { icon: Mic, label: "Listening...", className: "text-[#3b82f6] animate-pulse" };
      case "processing":
        return { icon: Loader2, label: "Thinking...", className: "text-[#8b5cf6] animate-spin" };
      case "speaking":
        return { icon: Volume2, label: "Speaking...", className: "text-[#16a34a]" };
      default:
        return {
          icon: isVoiceMode ? MicOff : Mic,
          label: isVoiceMode ? "Voice on (idle)" : "Voice mode",
          className: isVoiceMode ? "text-[#ea580c]" : "var(--text-muted)",
        };
    }
  };

  const { icon: Icon, label, className } = getState();

  return (
    <button
      onClick={onToggle}
      title={label}
      className={`relative h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
        isVoiceMode ? "bg-[#3b82f6]/10" : ""
      }`}
      style={{ color: typeof className === "string" && className.startsWith("text-") ? undefined : "var(--text-muted)" }}
    >
      <Icon className={`h-4 w-4 ${className}`} />
      {voiceState === "listening" && (
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5">
          <span className="absolute inset-0 rounded-full bg-[#3b82f6] animate-ping" />
          <span className="absolute inset-0 rounded-full bg-[#3b82f6]" />
        </span>
      )}
    </button>
  );
}
