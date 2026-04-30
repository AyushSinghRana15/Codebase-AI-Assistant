from typing import List, Dict, Set


def expand_context(results: List[dict], graph, max_additions: int = 3) -> List[dict]:
    """
    For each retrieved chunk, find related chunks via:
    1. Same file (likely part of the same logical unit)
    2. Called functions (dependency graph traversal)
    3. Functions that call this chunk (reverse deps)
    """
    seen_names: Set[str] = {r["metadata"].get("name") for r in results if r["metadata"].get("name")}
    additions = []

    for r in results:
        name = r["metadata"].get("name")
        if not name:
            continue

        # 1-hop dependency expansion
        if graph:
            deps = graph.get_dependencies(name, depth=1)
            for dep in deps:
                dep_name = dep["metadata"].get("name")
                if dep_name and dep_name not in seen_names:
                    additions.append(dep)
                    seen_names.add(dep_name)
                    if len(additions) >= max_additions:
                        return results + additions

    return results + additions
