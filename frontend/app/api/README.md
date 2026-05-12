# API — Frontend API Proxy Routes

Next.js API routes that proxy requests to the FastAPI backend.

| Route | Method | Backend Target |
|-------|--------|----------------|
| `ask/route.ts` | POST | `/ask` |
| `ingest/github/route.ts` | POST | `/ingest/github` |
| `auth/[...path]/route.ts` | GET, PUT | `/auth/*` |
