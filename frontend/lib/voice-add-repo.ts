const OWN_GITHUB_URL = "https://github.com/AyushSinghRana15/Codebase-AI-Assistant";

const ADD_REPO_PATTERNS = [
  /add\s+(?:the\s+)?(?:repo(?:sitory)?|project|codebase)\s+(?:of\s+)?(?:this\s+)?(?:project|repo(?:sitory)?)?/i,
  /add\s+(?:a\s+|this\s+)?(?:repo(?:sitory|s))\s+(?:called\s+|named\s+)?/i,
  /ingest\s+(?:a\s+|the\s+)?(?:repo(?:sitory)|project)/i,
  /(?:repo(?:sitory)|project)\s+(?:to\s+)?(?:add|ingest)/i,
  /start\s+(?:ingesting|indexing)\s+(?:a\s+)?(?:repo(?:sitory)|project)/i,
];

const URL_PATTERN = /https?:\/\/github\.com\/[\w.-]+\/[\w.-]+/i;

const OWNER_REPO_PATTERN = /([\w.-]+)\/([\w.-]+)/;

export interface VoiceAddRepoResult {
  detected: boolean;
  repoUrl: string | null;
  label: string | null;
  needsLogin: boolean;
}

export function parseVoiceAddRepo(transcript: string): VoiceAddRepoResult {
  const trimmed = transcript.trim().toLowerCase();

  const matchesAdd = ADD_REPO_PATTERNS.some((p) => p.test(trimmed));
  if (!matchesAdd) {
    return { detected: false, repoUrl: null, label: null, needsLogin: false };
  }

  const urlMatch = trimmed.match(URL_PATTERN);
  if (urlMatch) {
    return {
      detected: true,
      repoUrl: urlMatch[0].replace(/\.git\/?$/, ""),
      label: urlMatch[0].split("/").slice(-2).join("/"),
      needsLogin: false,
    };
  }

  if (/\bthis\b/.test(trimmed)) {
    return {
      detected: true,
      repoUrl: OWN_GITHUB_URL,
      label: OWN_GITHUB_URL.split("/").slice(-2).join("/"),
      needsLogin: false,
    };
  }

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
