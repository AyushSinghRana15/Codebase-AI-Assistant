from typing import Dict, Optional


def personalize_response(
    answer: str,
    profile: Optional[Dict] = None,
    intent: str = "general",
) -> str:
    if not profile:
        return answer

    name = profile.get("name")
    pref_lang = profile.get("preferred_language")
    bio = profile.get("bio")

    personalization = ""

    if name:
        if intent == "debug":
            personalization = f"{name}, here's the analysis:\n\n"
        elif intent == "explanation":
            personalization = f"Here you go, {name}:\n\n"
        elif intent in ("flow", "location"):
            personalization = ""

    if pref_lang and bio:
        if pref_lang.lower() in bio.lower():
            wrapper = f"\n\n[Tip: this answer emphasizes {pref_lang} since it's in your area of interest.]"
            answer += wrapper

    if personalization:
        answer = personalization + answer

    return answer
