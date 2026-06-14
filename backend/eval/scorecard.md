# Evaluation Scorecard
| # | Query | Correctness (1–5) | Relevance (1–5) | Clarity (1–5) | Hallucination (✅/❌) | Notes |
|---|-------|-------------------|-----------------|---------------|----------------------|-------|
| 1 | Where is file loading implemented? | | | | | |
| 2 | Explain the ingestion flow step by step | | | | | |
| 3 | Which file handles chunking? | | | | | |
| 4 | Where is hybrid retrieval implemented? | | | | | |
| 5 | Which file has the generate_answer function? | | | | | |
| 6 | Where is the BM25Index class defined? | | | | | |
| 7 | How does query classification work? | | | | | |
| 8 | How is context built from retrieved chunks? | | | | | |
| 9 | What API endpoints does the server expose? | | | | | |
| 10 | Where is answer validation implemented? | | | | | |
| 11 | What is the QueryRequest schema? | | | | | |
| 12 | How does AST parsing extract Python code? | | | | | |
| 13 | Where is the payment gateway? | — | — | — | ✅ said not found | |
| 14 | Where is the AI recommendation module? | — | — | — | ✅ said not found | |
| 15 | Stripe payment integration code | — | — | — | ✅ said not found | |
| 16 | Redis caching layer implementation | — | — | — | ✅ said not found | |

**Overall Score:** __ / 48
**System Verdict:**
- Score 41–48 → ✅ Ready for demo
- Score 29–40 → ⚠️ Fix weakest layer
- Score < 29  → ❌ Stop and fix retrieval
