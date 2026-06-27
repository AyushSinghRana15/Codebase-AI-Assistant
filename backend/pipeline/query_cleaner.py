# query_cleaner.py — Strip conversational fluff and redundant phrasing from queries

import re
from typing import Tuple


# Patterns for polite phrases and conversational clutter to remove
REDUNDANT_PATTERNS = [
    r'\b(can you|could you|please|kindly|would you|i want to|i need to|help me)\b',
    r'^\s*(?:tell me|show me|give me|find me)\s+',
    r'\b(?:regarding|concerning|related to|pertaining to)\b',
    r'\s{2,}',
]


# Remove redundant phrases, trailing punctuation, and leading "about" from query
def clean_query(query: str) -> Tuple[str, bool]:
    q = query.strip()
    was_cleaned = False

    q = q.strip('"').strip("'").strip()

    for pattern in REDUNDANT_PATTERNS:
        cleaned = re.sub(pattern, '', q, flags=re.IGNORECASE)
        if cleaned != q:
            was_cleaned = True
            q = cleaned

    q = re.sub(r'\s+', ' ', q).strip()

    if q.endswith(('?', '.', '!', ':')):
        q = q[:-1]
        was_cleaned = True

    if q.lower().startswith("about "):
        q = q[6:]
        was_cleaned = True

    return q, was_cleaned
