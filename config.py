# config.py — single source of truth for all tunable parameters
# Built with ❤️ by Ayush Singh

# Embedding
EMBED_MODEL      = "sentence-transformers/all-MiniLM-L6-v2"
EMBED_BATCH_SIZE = 64

# Retrieval
TOP_K_RETRIEVE   = 15    # wider net for hybrid retrieval
TOP_K_RERANK     = 5     # final chunks sent to LLM
SCORE_THRESHOLD  = 2.5   # L2 distance cutoff (relaxed for all-MiniLM-L6-v2)

# Reranking
RERANK_MODEL     = "cross-encoder/ms-marco-MiniLM-L-6-v2"
ENABLE_RERANKING = True

# Query rewriting
ENABLE_LLM_REWRITE = True   # set True to enable LLM-based rewriting

# LLM
LLM_MODEL        = "openai/gpt-oss-120b:free"   # OpenRouter free model
LLM_TEMPERATURE  = 0.2
LLM_MAX_TOKENS   = 800
LLM_TOP_P        = 0.9

# Context builder
MAX_CONTEXT_TOKENS = 6000
PER_CHUNK_MAX_TOKENS = 1500

# Caching
CACHE_MAX_SIZE   = 200

# API
API_HOST         = "0.0.0.0"
API_PORT         = 8000
RATE_LIMIT       = "20/minute"

# Paths
CHUNKS_PATH      = "output/chunks.json"
FAISS_INDEX_PATH = "vector_store/code_index.faiss"
METADATA_PATH    = "vector_store/metadata.pkl"
AGENT_MD_PATH    = "AGENT.md"

# AST Parsing
USE_AST_PYTHON  = True    # use ast module for .py files
USE_AST_JS      = False   # set True after tree-sitter installed
EXTRACT_CALLS   = True    # extract function call dependencies
EXTRACT_DOCS    = True    # extract docstrings into metadata

# Hybrid Retrieval
ENABLE_HYBRID_RETRIEVAL = True
BM25_TOP_K              = 15
HYBRID_RRF_K            = 60   # RRF damping constant

# Query Classification
ENABLE_CLASSIFIER = True

# Context Expansion
CONTEXT_EXPANSION_ENABLED = True
CONTEXT_EXPANSION_DEPTH   = 1       # hops to follow in call graph
CONTEXT_MAX_ADDITIONS     = 3       # max extra chunks to add

# Self-Reflection
ENABLE_REFLECTION      = True
REFLECTION_MODEL       = "openai/gpt-oss-120b:free"   # same model, cheap
REFLECTION_MAX_TOKENS  = 600
REFLECTION_TEMPERATURE = 0.1

# Confidence Scoring
ENABLE_CONFIDENCE_SCORING = True

# ──────────────────────────────────────────────
# Query Processing Pipeline — new stage toggles
# ──────────────────────────────────────────────

# 1. Language Detection
ENABLE_LANGUAGE_DETECTION = True

# 2. Spell Correction (always enabled)
# 3. Intent Detection (uses ENABLE_CLASSIFIER)

# 4. Entity Extraction
ENABLE_ENTITY_EXTRACTION = True

# 5. Context Awareness (chat history / user profile)
ENABLE_CONTEXT_AWARENESS = True
CONTEXT_HISTORY_MAX      = 5       # recent queries to consider
CONTEXT_PROFILE_FIELDS   = ["name", "bio", "preferred_language"]

# 6. Synonym Expansion
ENABLE_SYNONYM_EXPANSION = True

# 7. Query Cleaning
ENABLE_QUERY_CLEANING    = True

# 8. LLM Rewrite (uses ENABLE_LLM_REWRITE)

# 9. Multi Query Expansion
ENABLE_MULTI_QUERY       = True
MULTI_QUERY_VARIATIONS   = 3       # number of query variations to generate

# 10. Hybrid Search (uses ENABLE_HYBRID_RETRIEVAL)

# 11. Reranking (uses ENABLE_RERANKING)

# 12. Context Compression
ENABLE_CONTEXT_COMPRESSION = True
COMPRESSED_MAX_CHUNKS      = 8      # cap after compression

# 13. Response Personalization
ENABLE_RESPONSE_PERSONALIZATION = True

# 14. Fact Checking / Hallucination Guard (uses ENABLE_REFLECTION + validator)

# 15. Feedback Loop
ENABLE_FEEDBACK_LOOP = True
FEEDBACK_STORE_SIZE  = 500    # max stored feedback entries
