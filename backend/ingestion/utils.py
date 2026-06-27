# utils.py — Shared helpers for ingestion: language detection, exclusion rules, path utilities

import os
import re
from pathlib import Path

# Map file extensions to language identifiers
LANGUAGE_MAP = {
    ".py": "python",
    ".js": "javascript",
    ".ts": "typescript",
    ".jsx": "javascript",
    ".tsx": "typescript",
    ".java": "java",
    ".cpp": "cpp",
    ".c": "c",
    ".go": "go",
    ".rs": "rust",
    ".rb": "ruby",
    ".php": "php",
    ".swift": "swift",
    ".kt": "kotlin",
}

# Directories always skipped during repo walking
EXCLUDED_DIRS = {
    "node_modules", ".git", "venv", "__pycache__",
    "dist", "build", ".next", "output", "vector_store",
}

# Specific files always skipped
EXCLUDED_FILES = {
    ".env",
}

# File extensions always skipped
EXCLUDED_EXTENSIONS = {
    ".lock", ".min.js", ".pyc", ".class", ".o", ".so",
}

# Files larger than this (bytes) are skipped
MAX_FILE_SIZE = 500 * 1024


# Return language string for a file path, or None if unsupported
def detect_language(file_path: str) -> str | None:
    ext = Path(file_path).suffix.lower()
    return LANGUAGE_MAP.get(ext)


# Check whether a path should be skipped based on exclusion rules
def is_excluded(path: str) -> bool:
    parts = Path(path).parts
    for part in parts:
        if part in EXCLUDED_DIRS:
            return True
    name = os.path.basename(path)
    if name in EXCLUDED_FILES:
        return True
    ext = Path(path).suffix.lower()
    if ext in EXCLUDED_EXTENSIONS:
        return True
    return False


# Convert an absolute path to a repo-relative path
def relative_path(full_path: str, repo_root: str) -> str:
    return os.path.relpath(full_path, repo_root)
