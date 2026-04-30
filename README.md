# CodeBase AI Assistant

## Overview

CodeBase AI Assistant is a Retrieval-Augmented Generation (RAG) system that enables developers to understand and navigate codebases through natural language queries. It transforms repositories into an interactive, queryable knowledge system.

## How It Works

1. **Ingestion** — Code files are parsed and chunked into functions/classes (`ingestion/`)
2. **Embedding** — Each chunk is converted into vector representations (`embeddings/`)
3. **Storage** — Vectors stored in FAISS index (`vector_store/`)
4. **Retrieval** — Relevant chunks fetched based on user query
5. **Generation** — LLM generates answers grounded in retrieved context

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Step 1: Ingest a repository
python3 main.py --repo /path/to/repo --output output/chunks.json

# Step 2: Generate embeddings
python3 main.py --embed

# Test retrieval
python3 main.py --query "Where is file loading implemented?"
```

## Project Structure

```
CodeBase AI Assistant/
├── ingestion/          # Step 1: Code chunking
│   ├── loader.py       # File traversal + reader
│   ├── chunker.py      # Code-aware chunking logic
│   └── utils.py        # Language detection, path helpers
├── embeddings/         # Step 2: Vector embeddings
│   ├── embedder.py     # Generates embeddings + FAISS index
│   └── retriever.py    # Search function
├── tests/              # Testing (4 layers)
│   ├── test_chunking.py
│   ├── test_retrieval.py
│   ├── test_llm.py
│   └── test_e2e.py
├── output/             # Generated artifacts
│   └── chunks.json
├── vector_store/       # FAISS index (gitignored)
├── main.py             # CLI entrypoint
└── requirements.txt
```

## Features

- Code-aware chunking (function/class boundaries)
- Semantic search with sentence-transformers
- Fast FAISS vector retrieval
- Multi-layer testing (chunking, retrieval, LLM, e2e)

## Tech Stack

- **Embeddings:** sentence-transformers (all-MiniLM-L6-v2)
- **Vector DB:** FAISS
- **Chunking:** Regex-based code parsing
- **Language Support:** Python, JavaScript, TypeScript, Java, Go, Ruby, C/C++

## Testing

```bash
# Run Layer 1 tests (chunking quality)
pytest tests/test_chunking.py -v

# Test retrieval (requires embeddings)
python3 main.py --query "your query here"
```
