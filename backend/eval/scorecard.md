# Evaluation Scorecard
| # | Query | Correctness (1–5) | Relevance (1–5) | Clarity (1–5) | Hallucination (✅/❌) | Notes |
|---|-------|-------------------|-----------------|---------------|----------------------|-------|
| 1 | Where is auth implemented? | | | | | |
| 2 | Explain login flow | | | | | |
| 3 | How is data stored? | | | | | |
| 4 | Which file handles routes? | | | | | |
| 5 | What does [func] do? | | | | | |
| 6 | Where is error handling? | | | | | |
| 7 | Where is AI module? | — | — | — | ✅ said not found | |
| 8 | Payment gateway? | — | — | — | ✅ said not found | |

**Overall Score:** __ / 20
**System Verdict:**
- Score 17–20 → ✅ Ready to move to Step 3
- Score 12–16 → ⚠️ Fix weakest layer before Step 3
- Score < 12  → ❌ Stop. Return to Layer 2 and fix retrieval.
