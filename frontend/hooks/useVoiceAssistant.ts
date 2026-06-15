"use client";

import { useState, useRef, useCallback, useEffect } from "react";

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

function normalizeTranscript(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function speechTextFromMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " code block ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_~>|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function useVoiceAssistant(): UseVoiceAssistantReturn {
  const [voiceStateValue, setVoiceStateValue] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [supported, setSupported] = useState(true);

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

  const setVoiceState = useCallback((nextState: VoiceState) => {
    voiceStateRef.current = nextState;
    setVoiceStateValue(nextState);
  }, []);

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

  const scheduleListeningRestart = useCallback((delay: number) => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
    }

    restartTimerRef.current = setTimeout(() => {
      startListeningRef.current?.();
    }, delay);
  }, []);

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

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      silenceTimerRef.current = setTimeout(submitTranscript, finalText ? 700 : 1400);
    };

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

  useEffect(() => {
    startListeningRef.current = startListening;
  }, [startListening]);

  useEffect(() => {
    scheduleListeningRestartRef.current = scheduleListeningRestart;
  }, [scheduleListeningRestart]);

  const stopListening = useCallback(() => {
    cleanupTimers();
    stopRecognition(true);
    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";
    setTranscript("");
    setInterimTranscript("");
    setVoiceState("idle");
  }, [cleanupTimers, setVoiceState, stopRecognition]);

  const stopVoiceMode = useCallback(() => {
    voiceModeRef.current = false;
    setIsVoiceMode(false);
    cleanupTimers();
    stopRecognition(true);
    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";
    setTranscript("");
    setInterimTranscript("");
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceState("idle");
  }, [cleanupTimers, setVoiceState, stopRecognition]);

  const startVoiceMode = useCallback(() => {
    if (!supported) return;
    voiceModeRef.current = true;
    setIsVoiceMode(true);
    startListening();
  }, [startListening, supported]);

  const toggleVoiceMode = useCallback(() => {
    if (voiceModeRef.current) {
      stopVoiceMode();
    } else {
      startVoiceMode();
    }
  }, [startVoiceMode, stopVoiceMode]);

  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      cleanupTimers();
      stopRecognition(true);

      if (!("speechSynthesis" in window)) {
        if (voiceModeRef.current) {
          setVoiceState("listening");
          scheduleListeningRestartRef.current?.(250);
        } else {
          setVoiceState("idle");
        }
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      setVoiceState("speaking");

      const utterance = new SpeechSynthesisUtterance(speechTextFromMarkdown(text));
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      const complete = () => {
        if (voiceModeRef.current) {
          setVoiceState("listening");
          scheduleListeningRestartRef.current?.(300);
        } else {
          setVoiceState("idle");
        }
        resolve();
      };

      utterance.onend = complete;
      utterance.onerror = complete;

      window.speechSynthesis.speak(utterance);
    });
  }, [cleanupTimers, setVoiceState, stopRecognition]);

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (voiceModeRef.current) {
      setVoiceState("listening");
      scheduleListeningRestartRef.current?.(250);
    } else {
      setVoiceState("idle");
    }
  }, [setVoiceState]);

  const setOnQueryReady = useCallback((fn: ((query: string) => void) | null) => {
    onQueryReadyRef.current = fn;
  }, []);

  useEffect(() => {
    return () => {
      voiceModeRef.current = false;
      cleanupTimers();
      stopRecognition(true);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
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
