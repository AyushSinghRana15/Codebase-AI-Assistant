// stripMarkdown — removes markdown formatting for plain-text output (TTS)

export function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, " code block ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_~>|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
