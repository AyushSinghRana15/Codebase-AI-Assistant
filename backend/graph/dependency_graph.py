from typing import Dict, List, Optional
from collections import defaultdict


class DependencyGraph:
    def __init__(self, chunks: List[dict]):
        self.by_name: Dict[str, dict] = {}
        self.call_graph: Dict[str, List[str]] = defaultdict(list)
        self.reverse_graph: Dict[str, List[str]] = defaultdict(list)

        for c in chunks:
            name = c["metadata"].get("name")
            if name:
                self.by_name[name] = c
                calls = c["metadata"].get("calls", [])
                self.call_graph[name] = calls
                for called in calls:
                    self.reverse_graph[called].append(name)

    def get_chunk(self, name: str) -> Optional[dict]:
        return self.by_name.get(name)

    def get_dependencies(self, chunk_name: str, depth: int = 1) -> List[dict]:
        """Return chunks that chunk_name depends on, up to `depth` hops."""
        visited = set()
        result = []
        self._dfs_deps(chunk_name, depth, 0, visited, result)
        return result

    def _dfs_deps(self, name: str, max_depth: int, current_depth: int, visited: set, result: list):
        if current_depth >= max_depth or name in visited:
            return
        visited.add(name)
        for called in self.call_graph.get(name, []):
            chunk = self.get_chunk(called)
            if chunk and chunk not in result:
                result.append(chunk)
                self._dfs_deps(called, max_depth, current_depth + 1, visited, result)

    def get_callers(self, chunk_name: str) -> List[dict]:
        """Return chunks that call chunk_name (reverse lookup)."""
        callers = []
        for caller_name in self.reverse_graph.get(chunk_name, []):
            chunk = self.get_chunk(caller_name)
            if chunk:
                callers.append(chunk)
        return callers
