# language_detector.py — Detect programming language and natural language from user queries

import re
from typing import Dict

# Regex patterns identifying each programming language
LANG_PATTERNS: Dict[str, list] = {
    "python": [r"\bdef \w+\(", r"\bimport \w+", r"\bclass \w+", r"\breturn\b", r"\bif __name__"],
    "javascript": [r"\bfunction\b", r"\bconst \w+ =", r"\blet \w+ =", r"\bvar \w+ =", r"=>"],
    "typescript": [r":\s*(string|number|boolean|void|any)\b", r"\binterface \w+", r"\btype \w+ ="],
    "java": [r"\bpublic\b", r"\bprivate\b", r"\bclass \w+", r"\bvoid main\b", r"\bSystem\.out\b"],
    "go": [r"\bfunc \w+", r"\bpackage \w+", r"\bimport \(", r"\bdefer\b"],
    "rust": [r"\bfn \w+", r"\blet mut\b", r"\bimpl \w+", r"\bpub \w+"],
}

# Words that strongly indicate a natural-language (non-code) query
NATURAL_LANG_TRIGGERS = [
    "how", "what", "why", "where", "when", "which", "who",
    "explain", "describe", "find", "show", "tell", "is", "are", "does", "do",
    "can you", "could you", "write", "create", "implement", "fix", "debug",
]

# Common English stop words filtered before language detection
STOP_LANG_WORDS = {
    "the", "a", "an", "is", "are", "was", "were", "be", "been",
    "have", "has", "had", "do", "does", "did", "will", "would",
    "can", "could", "shall", "should", "may", "might",
    "this", "that", "these", "those", "i", "you", "we", "they",
    "in", "on", "at", "to", "for", "with", "by", "about",
    "and", "or", "but", "if", "because", "so", "than", "as",
    "it", "its", "my", "our", "your", "their", "his", "her",
    "what", "which", "who", "whom", "where", "why", "how",
    "not", "no", "nor", "never", "also", "very", "just",
    "code", "function", "file", "class", "method", "variable",
}


# Detect a programming language referenced in the query via code patterns
def detect_programming_language(query: str) -> str | None:
    q = query.strip()
    for lang, patterns in LANG_PATTERNS.items():
        if any(re.search(p, q) for p in patterns):
            return lang
    return None


# Detect the natural language of the query (currently returns "en" for all)
def detect_natural_language(query: str) -> str:
    q = query.strip().lower()
    q_clean = re.sub(r'[^\w\s]', '', q)
    words = q_clean.split()

    code_sigils = sum(1 for w in words if re.match(r'^[._\-\w]+\.[a-z]+$', w))
    if code_sigils > 1:
        return "en"

    for trigger in NATURAL_LANG_TRIGGERS:
        if q.startswith(trigger) or q.startswith(trigger + " "):
            return "en"

    non_stop = [w for w in words if w not in STOP_LANG_WORDS]
    if len(non_stop) >= 2:
        # Likely English if we have enough meaningful words
        return "en"

    return "en"


# Combined language detection — returns both natural and programming language info
def detect_language(query: str) -> dict:
    return {
        "query": query,
        "natural_language": detect_natural_language(query),
        "programming_language": detect_programming_language(query),
    }
