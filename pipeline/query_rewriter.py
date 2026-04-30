TEMPLATES = {
    "where":   "Find the code that implements: {query}",
    "how":     "Find the code that explains how: {query}",
    "what":    "Find the code definition and logic for: {query}",
    "explain": "Find all code related to: {query}",
    "default": "Find code related to: {query}",
}


def rewrite_query(query: str) -> str:
    q_lower = query.lower().strip()
    for keyword, template in TEMPLATES.items():
        if q_lower.startswith(keyword):
            return template.format(query=query)
    return TEMPLATES["default"].format(query=query)
