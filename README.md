# CodeBase AI Assistant

> Ask natural language questions about any codebase. Get code-grounded answers with file citations.

## Architecture

```
User Query → Query Rewrite → Retrieve(k=10) → Rerank(k=5) → LLM Generate → Validate → API Response
                                   ↓
                            FAISS Vector Store (all-MiniLM-L6-v2)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Ingestion | Python, regex-based chunker |
| Embeddings | sentence-transformers (all-MiniLM-L6-v2) |
| Vector Store | FAISS (IndexFlatL2) |
| Reranking | CrossEncoder (ms-marco-MiniLM-L-6-v2) |
| LLM | OpenRouter gpt-oss-120b (free) |
| API | FastAPI + uvicorn |
| Validation | Keyword-grounding checks |

## Features

- **Code-Aware Chunking** — splits at function/class boundaries, not arbitrary lines
- **Semantic Search** — FAISS vector search with 384-dim embeddings
- **Reranking** — CrossEncoder improves relevance over pure vector similarity
- **LLM-Powered Answers** — grounded in retrieved code, with file citations
- **Anti-Hallucination** — score threshold + validation check before/after LLM
- **FastAPI Layer** — `/ask` endpoint with Pydantic schemas, rate limiting, CORS
- **Structured Logging** — JSON logs for query traces and debugging
- **Caching** — `lru_cache` for identical queries

## Demo Queries

1. "Where is file loading implemented?"
2. "Explain the ingestion flow step by step"
3. "Which file handles chunking?"
4. "How does the embedding pipeline work?"
5. "What does walk_repo do?"

## Quick Start

### 1. Install Dependencies
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Set API Key
Edit `.env` and add your OpenRouter API key:
```
OPENAI_API_KEY=sk-or-v1-...
```

Get a free key at https://openrouter.ai

### 3. Ingest a Repository
```bash
python3 main.py --repo /path/to/repo --output output/chunks.json
```

### 4. Generate Embeddings
```bash
python3 main.py --embed
```

### 5. Start the API
```bash
uvicorn api.app:app --reload --port 8000
```

### 6. Test the API
- Swagger docs: http://localhost:8000/docs
- Example query:
```bash
curl -X POST "http://localhost:8000/ask" \
  -H "Content-Type: application/json" \
  -d '{"query": "Where is file loading implemented?"}'
```

## Evaluation

Run the evaluation harness to score the system:
```bash
python3 eval/run_eval.py
```

Target: ≥ 80% score before public demo.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/stats` | GET | Index statistics |
| `/ask` | POST | Ask a question (returns answer + sources) |
| `/docs` | GET | Swagger UI |

## Example Response

```json
{
  "answer": "File loading is implemented in `ingestion/loader.py` via the `walk_repo` function (lines 6-25), which traverses the repository and yields valid file paths. The `read_file` function (lines 28-36) reads file content as a string.",
  "sources": [
    {"file_path": "ingestion/loader.py", "name": "walk_repo", "score": 0.31, "rerank_score": 0.92},
    {"file_path": "ingestion/loader.py", "name": "read_file", "score": 0.77, "rerank_score": 0.85}
  ],
  "retrieved_count": 2,
  "rewritten_query": "Find the code that implements: Where is file loading implemented?",
  "validation": {"is_grounded": true, "confidence": 0.9, "warning": null},
  "latency_ms": 1234.5
}
```

## Project Structure

```
CodeBase AI Assistant/
├── api/                    # FastAPI layer
│   ├── app.py            # Routes: /ask, /health, /stats
│   ├── schemas.py        # Pydantic request/response models
│   └── middleware.py     # Rate limiting, CORS
├── pipeline/              # Core RAG pipeline
│   ├── ask.py            # Full pipeline: rewrite → retrieve → rerank → generate → validate
│   ├── reranker.py       # CrossEncoder reranking
│   ├── query_rewriter.py  # Query expansion/rewriting
│   └── validator.py      # Response grounding check
├── ingestion/            # Step 1: Chunking
├── embeddings/           # Step 2: Vector store
├── llm/                  # Step 3: LLM integration
├── eval/                 # Evaluation harness
├── config.py             # All tunable parameters
├── main.py               # CLI entrypoint
└── README.md
```

## Resume Bullet

> Built a production-ready RAG system for code understanding with code-aware chunking, FAISS vector search, CrossEncoder reranking, and FastAPI layer with anti-hallucination checks. Achieved 80%+ evaluation score on test queries.
