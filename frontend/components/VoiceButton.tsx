// VoiceButton — microphone toggle button that reflects voice state

"use client";

import { Loader2, Mic, MicOff, Volume2 } from "lucide-react";
import { VoiceState } from "@/hooks/useVoiceAssistant";

interface Props {
  voiceState: VoiceState;
  isVoiceMode: boolean;
  supported: boolean;
  onToggle: () => void;
}

export function VoiceButton({ voiceState, isVoiceMode, supported, onToggle }: Props) {
  if (!supported) return null;

  // Return icon, label, color, animation based on current voice state
  const getState = () => {
    switch (voiceState) {
      case "listening":
        return { icon: Mic, label: "Listening", color: "#10a37f", className: "animate-pulse" };
      case "processing":
        return { icon: Loader2, label: "Thinking", color: "#8b5cf6", className: "animate-spin" };
      case "speaking":
        return { icon: Volume2, label: "Speaking", color: "#10a37f", className: "" };
      default:
        return {
          icon: isVoiceMode ? MicOff : Mic,
          label: isVoiceMode ? "Stop voice mode" : "Start voice mode",
          color: isVoiceMode ? "#ea580c" : "var(--text-muted)",
          className: "",
        };
    }
  };

  const { icon: Icon, label, color, className } = getState();

  return (
    <button
      onClick={onToggle}
      title={label}
      aria-label={label}
      aria-pressed={isVoiceMode}
      className="relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 disabled:opacity-50"
      style={{ background: isVoiceMode ? "rgba(16,163,127,0.12)" : "transparent" }}
    >
      <Icon className={`h-4 w-4 ${className}`} style={{ color }} />
      {/* Animated dot indicator when listening */}
      {voiceState === "listening" && (
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5">
          <span className="absolute inset-0 rounded-full bg-[#10a37f] animate-ping" />
          <span className="absolute inset-0 rounded-full bg-[#10a37f]" />
        </span>
      )}
    </button>
  );
}
