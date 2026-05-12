# Components — React UI Components

Reusable UI components organized by domain.

| Directory | Description |
|-----------|-------------|
| `ui/` | shadcn/ui primitives (button, input, card, separator) |
| `website/` | Landing page components (Navbar, Hero, Features, etc.) |
| Top-level | App-specific components (Header, QueryInput, ResultCard, etc.) |

## Key Components

| Component | Description |
|-----------|-------------|
| `Header.tsx` | App header with auth state (sign in/out, user avatar) |
| `QueryInput.tsx` | Chat query input with submit |
| `ResultCard.tsx` | Render LLM answer with markdown |
| `SourcesPanel.tsx` | Collapsible source references panel |
| `GitHubIngestor.tsx` | Repo URL input and ingestion trigger |
| `ErrorBanner.tsx` | Error display with retry |
| `LoadingState.tsx` | Animated loading skeleton |
