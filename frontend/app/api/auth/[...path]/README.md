# Auth — Authentication API Proxy

Catch-all route (`/api/auth/[...path]`) that proxies GET and PUT requests to the FastAPI backend `/auth/*` endpoints. Passes the `Authorization: Bearer` header through for authenticated requests.
