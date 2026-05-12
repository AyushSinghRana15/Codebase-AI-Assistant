# Ingestion — Code Ingestion Pipeline

Extracts and chunks code from repositories for embedding.

| File | Description |
|------|-------------|
| `loader.py` | Filesystem walker, file reader with encoding detection |
| `chunker.py` | AST-aware code chunking — splits at function/class boundaries |
| `ast_parser.py` | Python AST parser for extracting functions, classes, docstrings |
| `github_ingestor.py` | GitHub repo cloning and cleanup |
| `utils.py` | File filtering (excludes binaries, node_modules, etc.) |
