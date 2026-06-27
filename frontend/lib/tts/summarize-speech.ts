// summarizeForSpeech — strips markdown, expands contractions, and extracts key sentences for TTS

export function summarizeForSpeech(text: string): string {
  // Remove markdown syntax
  let clean = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~>|-]{2,}/g, " ")
    .replace(/#{1,6}\s/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Expand contractions for clearer speech
  clean = clean
    .replace(/\bI'm\b/gi, "I am")
    .replace(/\bIt's\b/gi, "it is")
    .replace(/\bDon't\b/gi, "do not")
    .replace(/\bDoesn't\b/gi, "does not")
    .replace(/\bCan't\b/gi, "cannot")
    .replace(/\bWon't\b/gi, "will not")
    .replace(/\bIsn't\b/gi, "is not")
    .replace(/\bAren't\b/gi, "are not")
    .replace(/\bThere's\b/gi, "there is")
    .replace(/\bHere's\b/gi, "here is")
    .replace(/\bThat's\b/gi, "that is")
    .replace(/\bWhat's\b/gi, "what is")
    .replace(/\bLet's\b/gi, "let us")
    .replace(/\bYou're\b/gi, "you are")
    .replace(/\bWe're\b/gi, "we are")
    .replace(/\bThey're\b/gi, "they are")
    .replace(/\bWouldn't\b/gi, "would not")
    .replace(/\bCouldn't\b/gi, "could not")
    .replace(/\bShouldn't\b/gi, "should not")
    .replace(/\bHasn't\b/gi, "has not")
    .replace(/\bHaven't\b/gi, "have not")
    .replace(/\bHadn't\b/gi, "had not")
    .replace(/\bDidn't\b/gi, "did not")
    .replace(/\bWasn't\b/gi, "was not")
    .replace(/\bWeren't\b/gi, "were not");

  // Replace common symbols and abbreviations
  clean = clean
    .replace(/(\d+)\.(\d+)/g, "$1 point $2")
    .replace(/\b(\d+)x\b/g, "$1 times")
    .replace(/\baka\b/gi, "also known as")
    .replace(/\betc\.?\b/gi, "etcetera")
    .replace(/\be\.g\.\b/gi, "for example")
    .replace(/\bi\.e\.\b/gi, "that is")
    .replace(/\bvs\.?\b/gi, "versus")
    .replace(/\bw\/\b/gi, "with")
    .replace(/\bw\/o\b/gi, "without");

  // Remove code keywords and punctuation
  clean = clean
    .replace(/\b(?:const|let|var|function|class|import|export|return|if|else|for|while|async|await)\b/gi, "")
    .replace(/[{}[\]();:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Extract and filter sentences — keep only meaningful ones
  const sentences = clean.match(/[^.!?\n]+[.!?]+/g) || [clean];
  const cleaned = sentences
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  if (cleaned.length <= 2) {
    return cleaned.join(" ") || "I found the information, but could not summarize it briefly.";
  }

  // Skip introductory sentence if present
  if (cleaned[0].toLowerCase().includes("based on") || cleaned[0].toLowerCase().includes("here")) {
    return cleaned.slice(1, 3).join(" ");
  }

  return cleaned.slice(0, 2).join(" ");
}
