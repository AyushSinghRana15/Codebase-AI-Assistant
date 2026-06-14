import os
from typing import List, Dict

from config import MAX_CONTEXT_TOKENS, PER_CHUNK_MAX_TOKENS
from llm.tokenizer import count_tokens, truncate_to_tokens


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

        chunk_tokens = count_tokens(chunk_text)

        if chunk_tokens > PER_CHUNK_MAX_TOKENS:
            chunk_text = f"{header}\n{divider}\n{truncate_to_tokens(content, PER_CHUNK_MAX_TOKENS)}\n# ... truncated ..."
            chunk_tokens = count_tokens(chunk_text)

        if total_tokens + chunk_tokens > max_tokens:
            break

        parts.append(chunk_text)
        total_tokens += chunk_tokens

    return "\n\n".join(parts)
