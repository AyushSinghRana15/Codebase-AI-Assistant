# Pipeline — Core RAG Pipeline

End-to-end Retrieval-Augmented Generation pipeline modules.

| File | Description |
|------|-------------|
| `ask.py` | Main entry point — orchestrates the full pipeline (spell-check → retrieve → rerank → generate → validate) |
| `query_corrector.py` | Spell-checking with pyspellchecker, retains technical terms |
| `query_classifier.py` | Rule-based intent detection (location, flow, explanation, debug, general) |
| `hybrid_retriever.py` | FAISS + BM25 retrieval fused via Reciprocal Rank Fusion (RRF) |
| `reranker.py` | CrossEncoder (ms-marco-MiniLM-L-6-v2) for query-chunk relevance scoring |
| `context_expander.py` | Multi-hop dependency graph traversal for enriched context |
| `reflector.py` | Two-pass LLM verification — checks draft answers against context |
| `validator.py` | Grounding check, confidence scoring (high/medium/low/none), response shaping |
