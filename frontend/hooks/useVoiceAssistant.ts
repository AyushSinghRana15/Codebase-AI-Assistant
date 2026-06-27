// useVoiceAssistant — speech recognition, TTS, and voice mode management

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createTTSProvider } from "@/lib/tts";
import type { TTSProvider } from "@/lib/tts";
import { summarizeForSpeech } from "@/lib/tts/summarize-speech";

export type VoiceState = "idle" | "listening" | "processing" | "speaking";

interface UseVoiceAssistantReturn {
  voiceState: VoiceState;
  transcript: string;
  interimTranscript: string;
  supported: boolean;
  isVoiceMode: boolean;
  toggleVoiceMode: () => void;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  setOnQueryReady: (fn: ((query: string) => void) | null) => void;
}

// Singleton TTS provider
let _tts: TTSProvider | null = null;
function getTTS(): TTSProvider {
  if (!_tts) {
    _tts = createTTSProvider();
  }
  return _tts;
}

// Normalize whitespace in transcript
function normalizeTranscript(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

// Hook managing speech recognition, voice mode toggle, and TTS
export function useVoiceAssistant(): UseVoiceAssistantReturn {
  const [voiceStateValue, setVoiceStateValue] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [supported, setSupported] = useState(true);

  // Refs to avoid stale closures and hold mutable state
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startListeningRef = useRef<(() => void) | null>(null);
  const scheduleListeningRestartRef = useRef<((delay: number) => void) | null>(null);
  const onQueryReadyRef = useRef<((query: string) => void) | null>(null);
  const voiceStateRef = useRef<VoiceState>("idle");
  const voiceModeRef = useRef(false);
  const finalTranscriptRef = useRef("");
  const interimTranscriptRef = useRef("");
  const isRecognizingRef = useRef(false);

  // Sync state value with ref to allow access from callbacks
  const setVoiceState = useCallback((nextState: VoiceState) => {
    voiceStateRef.current = nextState;
    setVoiceStateValue(nextState);
  }, []);

  // Clear all timers
  const cleanupTimers = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  // Schedule restart of listening after a delay
  const scheduleListeningRestart = useCallback((delay: number) => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
    }

    restartTimerRef.current = setTimeout(() => {
      startListeningRef.current?.();
    }, delay);
  }, []);

  // Stop recognition and detach handlers
  const stopRecognition = useCallback((abort = false) => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;

    try {
      if (abort) {
        recognition.abort();
      } else {
        recognition.stop();
      }
    } catch {
      // The browser may already have stopped recognition.
    }

    recognitionRef.current = null;
    isRecognizingRef.current = false;
  }, []);

  // Submit accumulated transcript after silence
  const submitTranscript = useCallback(() => {
    cleanupTimers();

    const readyQuery = normalizeTranscript(
      `${finalTranscriptRef.current} ${interimTranscriptRef.current}`
    );

    if (!readyQuery) return;

    stopRecognition(true);
    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";
    setTranscript(readyQuery);
    setInterimTranscript("");
    setVoiceState("processing");
    onQueryReadyRef.current?.(readyQuery);
  }, [cleanupTimers, stopRecognition, setVoiceState]);

  // Start the speech recognition engine
  const startListening = useCallback(() => {
    if (!supported || isRecognizingRef.current) return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSupported(false);
      return;
    }

    cleanupTimers();
    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";
    setTranscript("");
    setInterimTranscript("");

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // Handle recognition results — separate final and interim text
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += ` ${result[0].transcript}`;
        } else {
          interimText += ` ${result[0].transcript}`;
        }
      }

      if (finalText) {
        finalTranscriptRef.current = normalizeTranscript(
          `${finalTranscriptRef.current} ${finalText}`
        );
        setTranscript(finalTranscriptRef.current);
      }

      interimTranscriptRef.current = normalizeTranscript(interimText);
      setInterimTranscript(interimTranscriptRef.current);

      // Reset silence timer — submit after pause in speech
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      silenceTimerRef.current = setTimeout(submitTranscript, finalText ? 700 : 1400);
    };

    // Handle recognition errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        cleanupTimers();
        voiceModeRef.current = false;
        setIsVoiceMode(false);
        setVoiceState("idle");
        stopRecognition(true);
        return;
      }

      if (event.error === "no-speech" || event.error === "aborted") return;

      isRecognizingRef.current = false;
      if (voiceModeRef.current && voiceStateRef.current === "listening") {
        scheduleListeningRestartRef.current?.(500);
      }
    };

    // Restart listening if voice mode is still active
    recognition.onend = () => {
      isRecognizingRef.current = false;
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }

      if (voiceModeRef.current && voiceStateRef.current === "listening") {
        scheduleListeningRestartRef.current?.(180);
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      isRecognizingRef.current = true;
      setVoiceState("listening");
    } catch {
      recognitionRef.current = null;
      isRecognizingRef.current = false;
    }
  }, [
    cleanupTimers,
    setVoiceState,
    stopRecognition,
    submitTranscript,
    supported,
  ]);

  // Keep refs in sync
  useEffect(() => {
    startListeningRef.current = startListening;
  }, [startListening]);

  useEffect(() => {
    scheduleListeningRestartRef.current = scheduleListeningRestart;
  }, [scheduleListeningRestart]);

  // Stop listening and reset
  const stopListening = useCallback(() => {
    cleanupTimers();
    stopRecognition(true);
    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";
    setTranscript("");
    setInterimTranscript("");
    setVoiceState("idle");
  }, [cleanupTimers, setVoiceState, stopRecognition]);

  // Stop voice mode entirely
  const stopVoiceMode = useCallback(() => {
    voiceModeRef.current = false;
    setIsVoiceMode(false);
    cleanupTimers();
    stopRecognition(true);
    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";
    setTranscript("");
    setInterimTranscript("");
    getTTS().stop();
    setVoiceState("idle");
  }, [cleanupTimers, setVoiceState, stopRecognition]);

  // Start continuous voice mode
  const startVoiceMode = useCallback(() => {
    if (!supported) return;
    voiceModeRef.current = true;
    setIsVoiceMode(true);
    startListening();
  }, [startListening, supported]);

  // Toggle voice mode on/off
  const toggleVoiceMode = useCallback(() => {
    if (voiceModeRef.current) {
      stopVoiceMode();
    } else {
      startVoiceMode();
    }
  }, [startVoiceMode, stopVoiceMode]);

  // Speak text using TTS, then resume listening if in voice mode
  const speak = useCallback(async (text: string): Promise<void> => {
    cleanupTimers();
    stopRecognition(true);

    const tts = getTTS();

    if (!("speechSynthesis" in window)) {
      if (voiceModeRef.current) {
        setVoiceState("listening");
        scheduleListeningRestartRef.current?.(250);
      } else {
        setVoiceState("idle");
      }
      return;
    }

    setVoiceState("speaking");

    try {
      const speechText = summarizeForSpeech(text);
      await tts.speak(speechText);
    } catch {
      // TTS error — continue silently
    }

    if (voiceModeRef.current) {
      setVoiceState("listening");
      scheduleListeningRestartRef.current?.(300);
    } else {
      setVoiceState("idle");
    }
  }, [cleanupTimers, setVoiceState, stopRecognition]);

  // Stop TTS and return to listening/idle
  const stopSpeaking = useCallback(() => {
    getTTS().stop();

    if (voiceModeRef.current) {
      setVoiceState("listening");
      scheduleListeningRestartRef.current?.(250);
    } else {
      setVoiceState("idle");
    }
  }, [setVoiceState]);

  // Set callback for when a voice query is ready to submit
  const setOnQueryReady = useCallback((fn: ((query: string) => void) | null) => {
    onQueryReadyRef.current = fn;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      voiceModeRef.current = false;
      cleanupTimers();
      stopRecognition(true);
      getTTS().stop();
    };
  }, [cleanupTimers, stopRecognition]);

  return {
    voiceState: voiceStateValue,
    transcript,
    interimTranscript,
    supported,
    isVoiceMode,
    toggleVoiceMode,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    setOnQueryReady,
  };
}
