export interface TTSProvider {
  name: string;
  speak(text: string): Promise<void>;
  stop(): void;
  isSpeaking(): boolean;
}

export interface TTSVoice {
  name: string;
  lang: string;
  isDefault: boolean;
  localService: boolean;
}

export type TTSProviderKind = "browser";
