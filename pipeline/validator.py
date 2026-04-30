import re


def validate_answer(answer: str, results: list) -> dict:
    """
    Checks if the answer's key claims appear in the retrieved chunks.
    Returns: {"is_grounded": bool, "confidence": float, "warning": str | None}
    """
    if not results:
        return {"is_grounded": True, "confidence": 1.0, "warning": None}

    known_names = set()
    for r in results:
        known_names.add(r["metadata"].get("name", "").lower())
        known_names.add(r["metadata"]["file_path"].lower())

    mentioned = re.findall(r'`(\w+)`', answer.lower())

    hallucinated = [m for m in mentioned if m not in known_names and len(m) > 3]

    if hallucinated:
        return {
            "is_grounded": False,
            "confidence": 0.4,
            "warning": f"Answer may reference unknown symbols: {hallucinated[:3]}"
        }
    return {"is_grounded": True, "confidence": 0.9, "warning": None}
