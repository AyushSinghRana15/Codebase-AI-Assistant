---
title: CodeBase AI Assistant Backend
emoji: 🧠
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# CodeBase AI Assistant — Backend

FastAPI backend for the CodeBase AI Assistant. Provides the RAG pipeline: ingest repos, ask questions, get code-grounded answers.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenRouter API key (get at https://openrouter.ai) |
| `SUPABASE_URL` | No | Supabase project URL (for auth) |
| `SUPABASE_ANON_KEY` | No | Supabase anon key |
| `SUPABASE_SERVICE_KEY` | No | Supabase service role key |

Set these in the Space settings → Repository Secrets.
