// TTS entry point — creates and exports the browser-based TTS provider

import { createBrowserTTSProvider } from "./providers/browser";

export type { TTSProvider, TTSVoice, TTSProviderKind } from "./types";
export { stripMarkdown } from "./strip-markdown";
export { createBrowserTTSProvider } from "./providers/browser";

// Default TTS provider factory
export function createTTSProvider() {
  return createBrowserTTSProvider();
}
