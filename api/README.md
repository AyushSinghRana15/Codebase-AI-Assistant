# API — FastAPI Backend

REST API server for the CodeBase AI Assistant.

| File | Description |
|------|-------------|
| `app.py` | FastAPI app with routes: `/ask`, `/health`, `/stats`, `/ingest/github`, `/auth/*` |
| `schemas.py` | Pydantic models for request/response validation |
| `auth.py` | Supabase JWT verification, optional user dependency injection |
| `db.py` | Supabase admin client for user/profile/history/repo CRUD |
| `middleware.py` | Rate limiting via slowapi |
