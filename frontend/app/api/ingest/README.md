# Ingest — GitHub Ingestion API Proxy

Proxies POST requests to the backend `/ingest/github` endpoint.

- `/ingest/github/route.ts` — Clones and ingests a GitHub repo. Passes auth header if present. 4-minute timeout for large repos.
