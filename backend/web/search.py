# search.py — Web search via DuckDuckGo for fallback when no code index is available

from typing import List, Dict

WEB_SEARCH_AVAILABLE = False
_DDGS = None

# Try importing duckduckgo_search (multiple import paths)
try:
    import ddgs
    _DDGS = ddgs.DDGS
    WEB_SEARCH_AVAILABLE = True
except ImportError:
    try:
        from duckduckgo_search import DDGS
        _DDGS = DDGS
        WEB_SEARCH_AVAILABLE = True
    except ImportError:
        pass


# Search the web via DuckDuckGo, return list of {title, snippet, url}
def search_web(query: str, max_results: int = 5) -> List[Dict[str, str]]:
    """Search the web. Returns list of {title, snippet, url}."""
    if not WEB_SEARCH_AVAILABLE or _DDGS is None:
        return []

    try:
        with _DDGS() as s:
            results = []
            for r in s.text(query, max_results=max_results):
                results.append({
                    "title": r.get("title", ""),
                    "snippet": r.get("body", ""),
                    "url": r.get("href", ""),
                })
            return results
    except Exception:
        return []


# Format web search results into a numbered context string for the LLM
def format_web_context(results: List[Dict[str, str]]) -> str:
    """Format web search results into a context string for the LLM."""
    if not results:
        return ""

    import re
    parts = ["Web search results:\n"]
    for i, r in enumerate(results, 1):
        snippet = re.sub(r"\s+", " ", r.get("snippet", "")).strip()
        if snippet:
            parts.append(f"{i}. {snippet}")
            if r.get("url"):
                parts.append(f"   Source: {r['url']}")
            parts.append("")

    return "\n".join(parts).strip()
