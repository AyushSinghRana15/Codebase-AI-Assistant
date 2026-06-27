// TTS type definitions

// Interface for any TTS provider
export interface TTSProvider {
  name: string;
  speak(text: string): Promise<void>;
  stop(): void;
  isSpeaking(): boolean;
}

// Voice metadata
export interface TTSVoice {
  name: string;
  lang: string;
  isDefault: boolean;
  localService: boolean;
}

// Supported TTS provider kinds
export type TTSProviderKind = "browser";
