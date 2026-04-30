import os
from typing import List, Dict

MAX_CONTEXT_TOKENS = 6000
PER_CHUNK_MAX_TOKENS = 1500


def approx_tokens(text: str) -> int:
    return len(text) // 4


def build_context(results: List[Dict], max_tokens: int = MAX_CONTEXT_TOKENS) -> str:
    if not results:
        return ""

    parts = []
    total_tokens = 0

    for r in results:
        metadata = r["metadata"]
        content = r["content"]

        header = f"[File: {metadata['file_path']}] — {metadata['chunk_type']}: {metadata['name']} (lines {metadata['start_line']}–{metadata['end_line']})"
        divider = "─" * 40
        chunk_text = f"{header}\n{divider}\n{content}"

        chunk_tokens = approx_tokens(chunk_text)

        if chunk_tokens > PER_CHUNK_MAX_TOKENS:
            chunk_tokens = PER_CHUNK_MAX_TOKENS
            lines = content.split('\n')
            truncated = '\n'.join(lines[:int(len(lines) * 0.8)])
            chunk_text = f"{header}\n{divider}\n{truncated}\n# ... truncated ..."

        if total_tokens + chunk_tokens > max_tokens:
            break

        parts.append(chunk_text)
        total_tokens += chunk_tokens

    return "\n\n".join(parts)
