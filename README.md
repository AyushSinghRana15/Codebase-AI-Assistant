# CodeBase AI Assistant

> Ask natural language questions about any codebase. Get code-grounded answers with file citations.

## Architecture

```
User Query → Spell Check → Query Classification → Hybrid Retrieval (FAISS + BM25) → Rerank → Context Expansion → LLM Generate → Self-Reflection → Validate → API Response
                                        ↓
                            FAISS Vector Store + Dependency Graph + BM25 Index
```

### Frontend (New!)
```
Browser → Next.js Frontend (localhost:3000) → API Proxy → FastAPI Backend (localhost:8000) → RAG Pipeline → Answer + Sources
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| **Ingestion** | Python, AST parser, code-aware chunker |
| **Embeddings** | sentence-transformers (all-MiniLM-L6-v2) |
| **Vector Store** | FAISS (IndexFlatL2) + BM25 |
| **Hybrid Retrieval** | FAISS semantics + BM25 exact match |
| **Reranking** | CrossEncoder (ms-marco-MiniLM-L-6-v2) |
| **Context Expansion** | Multi-hop via Dependency Graph |
| **LLM** | OpenRouter gpt-oss-120b (free) |
| **Self-Reflection** | Two-pass LLM verification |
| **API** | FastAPI + uvicorn |
| **Validation** | Confidence scoring + keyword grounding |
| **Evaluation** | RAGAS metrics |
| **Spell-Check** | pyspellchecker |

## Features

### Backend (Elite RAG Pipeline)
- **Spell-Check** — automatic query correction (e.g., "chunkier" → "chunker")
- **Code-Aware Chunking** — AST parser splits at function/class boundaries
- **Hybrid Retrieval** — FAISS semantics + BM25 exact match
- **Query Classification** — intent-aware pipeline configuration
- **Context Expansion** — multi-hop reasoning via dependency graph
- **Self-Reflection** — two-pass LLM verification loop
- **Confidence Scoring** — high/medium/low/none with response shaping
- **RAGAS Evaluation** — automated scoring (80% achieved)
- **GitHub Ingestion** — clone and process any GitHub repository
- **Anti-Hallucination** — score threshold + validation checks

### Frontend (Next.js)
- **Chat Interface** — clean, dark-themed UI inspired by ChatGPT
- **Markdown Rendering** — syntax-highlighted code blocks
- **Source References** — collapsible panel with file paths and scores
- **GitHub Integration** — ingest repos via URL
- **Loading States** — animated skeleton with rotating status messages
- **Error Handling** — retry functionality with user-friendly messages

## Demo Queries

1. "Where is file loading implemented?"
2. "Explain the ingestion flow step by step"
3. "Which file handles chunking?"
4. "How does the embedding pipeline work?"
5. "What does walk_repo do?"

## Quick Start

### 1. Install Backend Dependencies
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Set API Key
Create `.env` and add your OpenRouter API key:
```
OPENAI_API_KEY=sk-or-v1-...
```
Get a free key at https://openrouter.ai

### 3. Ingest a Repository (Local)
```bash
python3 main.py --repo /path/to/repo --output output/chunks.json
python3 main.py --embed
```

### 4. Start Backend API
```bash
uvicorn api.app:app --reload --port 8000
```

### 5. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

### 6. Ingest GitHub Repository (via Frontend)
1. Open http://localhost:3000
2. Navigate to the AI Assistant at `/agent`
3. Paste GitHub repo URL (e.g., `https://github.com/pallets/flask`)
4. Click "Ingest" — automatically clones and processes the repo
5. Start asking questions!

### 7. Test the API
- Swagger docs: http://localhost:8000/docs
- Example query:
```bash
curl -X POST "http://localhost:8000/ask" \
  -H "Content-Type: application/json" \
  -d '{"query": "Which file handles chunking?"}'
```

## Evaluation

Run the evaluation harness to score the system:
```bash
python3 eval/run_eval.py
```

Target: ≥ 80% score before public demo.

## API Endpoints

### Backend (FastAPI - localhost:8000)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/stats` | GET | Index statistics |
| `/ask` | POST | Ask a question (returns answer + sources) |
| `/ingest/github` | POST | Clone and ingest GitHub repo |
| `/docs` | GET | Swagger UI |

### Frontend (Next.js - localhost:3000)
| Route | Method | Description |
|-------|--------|-------------|
| `/api/ask` | POST | Proxy to backend /ask |
| `/api/ingest/github` | POST | Proxy to backend /ingest/github |

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
│   ├── app.py            # Routes: /ask, /health, /stats, /ingest/github
│   └── schemas.py        # Pydantic request/response models
├── pipeline/              # Core RAG pipeline
│   ├── ask.py            # Full pipeline with spell-check
│   ├── query_corrector.py # Spell-checking for queries
│   ├── query_classifier.py # Intent classification
│   ├── hybrid_retriever.py # FAISS + BM25 hybrid search
│   ├── context_expander.py # Multi-hop context expansion
│   ├── reflector.py      # Self-reflection loop
│   ├── reranker.py       # CrossEncoder reranking
│   └── validator.py      # Confidence scoring + validation
├── ingestion/            # Code ingestion
│   ├── chunker.py       # AST-based code chunking
│   ├── ast_parser.py    # Python AST parsing
│   └── github_ingestor.py # GitHub repo cloning
├── graph/                 # Dependency graph
│   └── dependency_graph.py # Multi-hop reasoning
├── embeddings/           # Vector store
├── llm/                  # LLM integration
├── eval/                 # Evaluation
│   └── ragas_eval.py    # RAGAS metrics
├── frontend/             # Next.js frontend
│   ├── app/             # App router pages + API routes
│   ├── components/       # UI components
│   └── lib/             # Types + utilities
├── config.py             # All tunable parameters
└── documentation.md      # Detailed development log
```

## Documentation

The project maintains a comprehensive development log in [`documentation.md`](documentation.md). It tracks every implementation decision, code change, and bug fix chronologically.

### What's Inside `documentation.md`

| Section | Content |
|---------|---------|
| **Chronological Action Log** | Every action taken with timestamps, files affected, and reasoning |
| **Step 1: Ingestion + Chunking** | Folder structure, functions, regex patterns, chunk schema |
| **Step 2: Embeddings + Vector DB** | Model selection, FAISS index design, retrieval strategy |
| **Step 3: LLM Integration** | Context builder, prompt engineering, generator setup |
| **Step 4: Elite Upgrade** | AST parser, hybrid retrieval, multi-hop, self-reflection |
| **Step 5: Marketing Website** | Next.js landing page, 12-section layout, design system |
| **Step 6: UI Fixes** | TypeScript fixes, spell-checker corrections, ingestion improvements |

### How to Use the Documentation

- **Understanding architecture:** Read the Step sections in order
- **Debugging a module:** Search for the filename in the Action Log
- **Reproducing a decision:** Each entry includes the "why" behind changes
- **Onboarding:** Start with the Project Overview, then follow Steps 1→6
