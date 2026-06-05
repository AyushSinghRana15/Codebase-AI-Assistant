from spellchecker import SpellChecker
import re
from typing import Set, Tuple, List

spell = SpellChecker()

TECH_TERMS: Set[str] = {
    'py', 'js', 'ts', 'jsx', 'tsx', 'python', 'javascript', 'typescript',
    'api', 'url', 'http', 'https', 'json', 'yaml', 'xml', 'csv',
    'github', 'git', 'docker', 'kubernetes', 'aws', 'gcp', 'azure',
    'fastapi', 'nextjs', 'react', 'vue', 'angular', 'node', 'express',
    'chunker', 'chunking', 'chunkier', 'retriever', 'embedder', 'ingestion', 'rag', 'llm', 'embedding',
    'faiss', 'bm25', 'reranker', 'hybrid', 'ast', 'parser',
    'pydantic', 'uvicorn', 'slowapi', 'supabase', 'httpx',
    'middleware', 'endpoint', 'schema', 'serializer', 'deserializer',
    'lru_cache', 'functools', 'fastapi', 'openai', 'openrouter',
    'sentence', 'transformers', 'numpy', 'pickle', 'dotenv',
    'tailwind', 'nextjs', 'shadcn', 'radix', 'lucide', 'react',
    'preprocessor', 'postprocessor', 'tokenizer', 'tokenizer',
}

CODE_PATTERNS = [
    re.compile(r'^\w+\.\w+$'),
    re.compile(r'^[._\-\w]+$'),
    re.compile(r'^[A-Z][a-z]+(?:[A-Z][a-z]+)+$'),
    re.compile(r'^[a-z]+_[a-z_]+$'),
    re.compile(r'^[a-z]+\.[a-z]+$'),
]


def _is_code_term(word: str) -> bool:
    clean = re.sub(r'[^\w]', '', word)
    if not clean:
        return True
    if clean.lower() in TECH_TERMS:
        return True
    if any(p.match(clean) for p in CODE_PATTERNS):
        return True
    if re.match(r'^[A-Z_]{2,}$', clean):
        return True
    if re.match(r'^[a-z]{1,2}$', clean):
        return True
    return False


def correct_query(query: str) -> Tuple[str, bool]:
    words = query.split()
    corrected_words = []
    was_corrected = False

    for word in words:
        clean_word = re.sub(r'[^\w]', '', word)

        if _is_code_term(word):
            corrected_words.append(word)
            continue

        if len(clean_word) <= 2:
            corrected_words.append(word)
            continue

        try:
            corrected = spell.correction(clean_word)
            if corrected and corrected.lower() != clean_word.lower():
                suffix = word[len(clean_word):]
                corrected_words.append(corrected + suffix)
                was_corrected = True
            else:
                corrected_words.append(word)
        except Exception:
            corrected_words.append(word)

    return ' '.join(corrected_words), was_corrected


def get_query_suggestions(query: str) -> List[str]:
    words = query.split()
    suggestions = []

    for word in words:
        clean = re.sub(r'[^\w]', '', word)
        if not _is_code_term(clean) and len(clean) > 2:
            try:
                candidates = spell.candidates(clean)
                if candidates and clean.lower() not in candidates:
                    suggestions.extend(list(candidates)[:3])
            except Exception:
                pass

    return suggestions
