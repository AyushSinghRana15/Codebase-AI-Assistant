// SpeakButton — toggles TTS read-aloud for assistant answers

"use client";

import { Volume2, VolumeX } from "lucide-react";
import { VoiceState } from "@/hooks/useVoiceAssistant";

interface Props {
  voiceState: VoiceState;
  onSpeak: () => void;
  onStop: () => void;
}

export function SpeakButton({ voiceState, onSpeak, onStop }: Props) {
  const isSpeaking = voiceState === "speaking";

  return (
    <button
      onClick={isSpeaking ? onStop : onSpeak}
      title={isSpeaking ? "Stop speaking" : "Read aloud"}
      className="h-8 w-8 rounded-md flex items-center justify-center transition-colors hover:opacity-80"
      style={{ color: isSpeaking ? "#16a34a" : "var(--text-muted)" }}
    >
      {isSpeaking ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </button>
  );
}
