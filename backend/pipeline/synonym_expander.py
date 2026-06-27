# synonym_expander.py — Expand queries with synonyms for broader code search coverage

from typing import List, Dict, Set

# Verb synonyms mapping for query expansion
SYNONYM_MAP: Dict[str, Set[str]] = {
    "find": {"search", "locate", "lookup", "discover", "get", "fetch"},
    "create": {"make", "build", "generate", "construct", "initialize", "new"},
    "change": {"modify", "update", "edit", "alter", "transform", "mutate"},
    "delete": {"remove", "drop", "erase", "destroy", "cleanup", "purge"},
    "show": {"display", "list", "print", "output", "return", "reveal"},
    "explain": {"describe", "elaborate", "clarify", "walk through", "break down"},
    "error": {"bug", "issue", "problem", "crash", "exception", "failure", "fault"},
    "fix": {"repair", "resolve", "correct", "patch", "remediate", "solve"},
    "implement": {"write", "code", "develop", "program", "build", "realize"},
    "test": {"verify", "validate", "check", "assert", "inspect", "examine"},
    "connect": {"link", "join", "attach", "bind", "associate", "relate"},
    "split": {"divide", "separate", "partition", "break", "segment"},
    "convert": {"transform", "translate", "parse", "cast", "coerce"},
    "sort": {"order", "arrange", "organize", "rank", "categorize"},
    "filter": {"select", "pick", "choose", "refine", "narrow"},
}


# Generate alternative query variants by replacing verbs with synonyms
def expand_synonyms(query: str) -> List[str]:
    q_lower = query.lower()
    expanded = {query}

    for word, synonyms in SYNONYM_MAP.items():
        if word in q_lower.split():
            for syn in synonyms:
                expanded.add(query.replace(word, syn, 1))

    return list(expanded)
