import time
from typing import List, Dict

from openai import OpenAI
from dotenv import load_dotenv
import os

from llm.context_builder import build_context
from llm.prompt_utils import assemble_messages

load_dotenv()

_client = None
_MODEL = "openai/gpt-oss-120b:free"  # OpenRouter free model


def _get_client():
    global _client
    if _client is not None:
        return _client

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not found in .env")

    _client = OpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1"
    )
    return _client


def generate_answer(query: str, results: List[Dict]) -> str:
    if not results:
        return "I could not find this in the provided codebase."

    context = build_context(results)
    messages = assemble_messages(query, context)

    client = _get_client()

    max_retries = 2
    for attempt in range(max_retries + 1):
        try:
            response = client.chat.completions.create(
                model=_MODEL,
                temperature=0.2,
                max_tokens=800,
                top_p=0.9,
                frequency_penalty=0.0,
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            if attempt < max_retries:
                time.sleep(5)
                continue
            return f"Service temporarily unavailable: {str(e)}"
