# entity_extractor.py — Extract code entities (files, functions, classes, etc.) from user queries

import re
from typing import List, Dict


# Regex patterns for each entity type
ENTITY_PATTERNS = {
    "file_path": [
        r'`([\w/\\\-\.]+)`',
        r'\b(\w+\.\w+)\b',
    ],
    "function_name": [
        r'\b(\w+)\s*\([^)]*\)',
        r'`(\w+)\(\)`',
        r'\bfunction\s+(\w+)',
        r'\bdef\s+(\w+)',
        r'\bfunc\s+(\w+)',
        r'\bfn\s+(\w+)',
    ],
    "class_name": [
        r'\bclass\s+(\w+)',
        r'\bstruct\s+(\w+)',
        r'\binterface\s+(\w+)',
        r'\btype\s+(\w+)',
    ],
    "variable_name": [
        r'\b(var|let|const)\s+(\w+)',
        r'\b\w+\s*=\s*(?:new\s+)?\w+',
    ],
    "import_name": [
        r'\b(?:import|from)\s+([\w\.]+)',
        r'\brequire\s*\(\s*[\'"]([\w\.\-/]+)',
    ],
}

TECH_ENTITY_KEYWORDS = [
    "api", "endpoint", "route", "middleware", "hook", "component",
    "database", "query", "schema", "model", "controller", "service",
    "config", "test", "deploy", "build", "docker", "ci", "cd",
]


# Extract file paths, function names, class names, variables, imports, and tech concepts from query
def extract_entities(query: str) -> Dict[str, List[str]]:
    entities: Dict[str, List[str]] = {k: [] for k in ENTITY_PATTERNS}
    entities["tech_concept"] = []

    for entity_type, patterns in ENTITY_PATTERNS.items():
        seen = set()
        for pattern in patterns:
            matches = re.findall(pattern, query, re.IGNORECASE)
            for m in matches:
                if isinstance(m, tuple):
                    m = m[-1]
                m = m.strip().strip('"').strip("'")
                if m and m not in seen and len(m) > 1:
                    seen.add(m)
                    entities[entity_type].append(m)

    q_lower = query.lower()
    for kw in TECH_ENTITY_KEYWORDS:
        if kw in q_lower:
            entities["tech_concept"].append(kw)

    return entities
