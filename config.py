# config.py — single source of truth for all tunable parameters

# Embedding
EMBED_MODEL      = "sentence-transformers/all-MiniLM-L6-v2"
EMBED_BATCH_SIZE = 64

# Retrieval
TOP_K_RETRIEVE   = 10    # wider net for reranker
TOP_K_RERANK     = 5     # final chunks sent to LLM
SCORE_THRESHOLD  = 1.4   # L2 distance cutoff ("not found" if all above this)

# Reranking
RERANK_MODEL     = "cross-encoder/ms-marco-MiniLM-L-6-v2"
ENABLE_RERANKING = True

# Query rewriting
ENABLE_LLM_REWRITE = False   # set True to enable LLM-based rewriting

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
