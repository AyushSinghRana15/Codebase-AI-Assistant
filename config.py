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
