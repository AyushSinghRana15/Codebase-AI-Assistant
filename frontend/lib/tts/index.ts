import { createBrowserTTSProvider } from "./providers/browser";

export type { TTSProvider, TTSVoice, TTSProviderKind } from "./types";
export { stripMarkdown } from "./strip-markdown";
export { createBrowserTTSProvider } from "./providers/browser";

export function createTTSProvider() {
  return createBrowserTTSProvider();
}
