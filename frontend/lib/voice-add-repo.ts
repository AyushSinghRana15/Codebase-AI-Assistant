// Voice-add-repo — parses spoken commands to detect GitHub repo ingestion requests

const OWN_GITHUB_URL = "https://github.com/AyushSinghRana15/Codebase-AI-Assistant";

// Patterns to detect "add repo" intent in voice transcripts
const ADD_REPO_PATTERNS = [
  /add\s+(?:the\s+)?(?:repo(?:sitory)?|project|codebase)\s+(?:of\s+)?(?:this\s+)?(?:project|repo(?:sitory)?)?/i,
  /add\s+(?:a\s+|this\s+)?(?:repo(?:sitory|s))\s+(?:called\s+|named\s+)?/i,
  /ingest\s+(?:a\s+|the\s+)?(?:repo(?:sitory)|project)/i,
  /(?:repo(?:sitory)|project)\s+(?:to\s+)?(?:add|ingest)/i,
  /start\s+(?:ingesting|indexing)\s+(?:a\s+)?(?:repo(?:sitory)|project)/i,
];

// Match full GitHub URLs
const URL_PATTERN = /https?:\/\/github\.com\/[\w.-]+\/[\w.-]+/i;

// Match owner/repo pattern
const OWNER_REPO_PATTERN = /([\w.-]+)\/([\w.-]+)/;

export interface VoiceAddRepoResult {
  detected: boolean;
  repoUrl: string | null;
  label: string | null;
  needsLogin: boolean;
}

// Parse a voice transcript to determine if the user wants to add a repo
export function parseVoiceAddRepo(transcript: string): VoiceAddRepoResult {
  const trimmed = transcript.trim().toLowerCase();

  // Check if transcript matches any add-repo pattern
  const matchesAdd = ADD_REPO_PATTERNS.some((p) => p.test(trimmed));
  if (!matchesAdd) {
    return { detected: false, repoUrl: null, label: null, needsLogin: false };
  }

  // Try to extract a full GitHub URL
  const urlMatch = trimmed.match(URL_PATTERN);
  if (urlMatch) {
    return {
      detected: true,
      repoUrl: urlMatch[0].replace(/\.git\/?$/, ""),
      label: urlMatch[0].split("/").slice(-2).join("/"),
      needsLogin: false,
    };
  }

  // "this" refers to the project's own repo
  if (/\bthis\b/.test(trimmed)) {
    return {
      detected: true,
      repoUrl: OWN_GITHUB_URL,
      label: OWN_GITHUB_URL.split("/").slice(-2).join("/"),
      needsLogin: false,
    };
  }

  // Try to infer owner/repo from remaining text
  const afterAdd = trimmed.replace(/add\s+(?:the\s+)?(?:repo(?:sitory)?|project|codebase)\s+(?:of\s+)?/i, "").trim();
  if (afterAdd) {
    const ownerRepoMatch = afterAdd.match(OWNER_REPO_PATTERN);
    if (ownerRepoMatch) {
      const url = `https://github.com/${ownerRepoMatch[1]}/${ownerRepoMatch[2]}`;
      return {
        detected: true,
        repoUrl: url,
        label: `${ownerRepoMatch[1]}/${ownerRepoMatch[2]}`,
        needsLogin: false,
      };
    }

    // Fall back to interpreting words as owner/repo
    const words = afterAdd.replace(/[^a-zA-Z0-9\s-]/g, "").split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      const owner = words[0].toLowerCase();
      const repo = words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("-");
      return {
        detected: true,
        repoUrl: `https://github.com/${owner}/${repo}`,
        label: `${owner}/${repo}`,
        needsLogin: false,
      };
    }

    if (words.length === 1) {
      const repoName = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      return {
        detected: true,
        repoUrl: `https://github.com/unknown/${repoName}`,
        label: `unknown/${repoName}`,
        needsLogin: false,
      };
    }
  }

  return {
    detected: true,
    repoUrl: null,
    label: null,
    needsLogin: false,
  };
}
