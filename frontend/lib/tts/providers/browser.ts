// Browser TTS provider — uses the Web Speech API for speech synthesis

import type { TTSProvider } from "../types";
import { stripMarkdown } from "../strip-markdown";

// Load available voices from the browser
function loadVoices(): SpeechSynthesisVoice[] {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) return voices;

  return [];
}

// Pick the best English voice (prefer non-Microsoft for quality)
function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null;

  const pref = voices.find(
    (v) => v.lang.startsWith("en") && !v.name.startsWith("Microsoft")
  );
  if (pref) return pref;

  const anyEn = voices.find((v) => v.lang.startsWith("en"));
  if (anyEn) return anyEn;

  return voices[0];
}

let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

// Ensure voices are loaded, with a 2s fallback timeout
function ensureVoices(): Promise<SpeechSynthesisVoice[]> {
  if (voicesPromise) return voicesPromise;

  voicesPromise = new Promise((resolve) => {
    const immediate = loadVoices();
    if (immediate.length) {
      resolve(immediate);
      return;
    }

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(loadVoices());
      }
    }, 2000);

    window.speechSynthesis.onvoiceschanged = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve(loadVoices());
      }
    };
  });

  return voicesPromise;
}

// Factory that creates a browser-based TTS provider
export function createBrowserTTSProvider(): TTSProvider {
  let speaking = false;

  function stop() {
    window.speechSynthesis.cancel();
    speaking = false;
  }

  async function speak(text: string): Promise<void> {
    stop();

    if (!("speechSynthesis" in window)) return;

    const voices = await ensureVoices();
    const voice = pickBestVoice(voices);
    const clean = stripMarkdown(text);

    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    if (voice) utterance.voice = voice;
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    return new Promise((resolve) => {
      speaking = true;

      const done = () => {
        speaking = false;
        resolve();
      };

      utterance.onend = done;
      utterance.onerror = done;

      window.speechSynthesis.speak(utterance);
    });
  }

  return {
    name: "browser",
    speak,
    stop,
    isSpeaking: () => speaking,
  };
}
