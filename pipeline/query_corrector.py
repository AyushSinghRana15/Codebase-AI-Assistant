from spellchecker import SpellChecker
import re
from typing import Set

# Initialize spell checker
spell = SpellChecker()

# Technical terms that shouldn't be corrected
TECH_TERMS: Set[str] = {
    'py', 'js', 'ts', 'jsx', 'tsx', 'python', 'javascript', 'typescript',
    'api', 'url', 'http', 'https', 'json', 'yaml', 'xml', 'csv',
    'github', 'git', 'docker', 'kubernetes', 'aws', 'gcp', 'azure',
    'fastapi', 'nextjs', 'react', 'vue', 'angular', 'node', 'express',
    'chunker', 'chunkier', 'retriever', 'embedder', 'ingestion', 'rag', 'llm', 'embedding',
    'faiss', 'bm25', 'reranker', 'hybrid', 'ast', 'parser',
}

def correct_query(query: str) -> tuple[str, bool]:
    """
    Correct spelling mistakes in the query.
    Returns: (corrected_query, was_corrected)
    """
    words = query.split()
    corrected_words = []
    was_corrected = False
    
    for word in words:
        # Skip technical terms, file extensions, and code snippets
        if (word.lower() in TECH_TERMS or 
            re.match(r'^\w+\.\w+$', word) or  # file.py
            re.match(r'^[._\-\w]+$', word) and len(word) < 3):
            corrected_words.append(word)
            continue
        
        # Check if word is misspelled
        if word.lower() not in TECH_TERMS and len(word) > 2:
            corrected = spell.correction(word)
            if corrected and corrected != word.lower():
                corrected_words.append(corrected)
                was_corrected = True
            else:
                corrected_words.append(word)
        else:
            corrected_words.append(word)
    
    return ' '.join(corrected_words), was_corrected

def get_query_suggestions(query: str) -> list[str]:
    """
    Get spelling suggestions for query words.
    """
    words = query.split()
    suggestions = []
    
    for word in words:
        if word.lower() not in TECH_TERMS and len(word) > 2:
            candidates = spell.candidates(word)
            if candidates and word.lower() not in candidates:
                suggestions.extend(list(candidates)[:3])
    
    return suggestions
