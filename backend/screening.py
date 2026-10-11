"""Transparent, stateless logic for MindCare's *unvalidated* reflection check-in.

This is intentionally NOT a clinical screening instrument. Do not map these values
onto PHQ-9, GAD-7, diagnostic categories, or clinical risk levels.
"""

DOMAINS = {
    "mood": "Low mood",
    "stress": "Feeling overwhelmed",
    "sleep": "Sleep difficulties",
    "energy": "Low energy",
    "connection": "Feeling disconnected",
}

SUGGESTIONS = {
    "mood": "Try a short mood journal: note one thing that affected your mood and one thing that helped.",
    "stress": "Try a two-minute slow-breathing exercise, then identify one small task you can postpone or ask help with.",
    "sleep": "Consider a consistent wind-down routine and reducing stimulating activities close to bedtime.",
    "energy": "Choose one manageable activity, take a short break, and consider whether rest or professional advice may help.",
    "connection": "Consider messaging someone you trust or arranging a low-pressure conversation.",
}


def score_check_in(answers: dict) -> dict:
    """Validate a five-domain 0..3 check-in and return reflection-only feedback."""
    if not isinstance(answers, dict):
        raise ValueError("answers must be a JSON object")

    expected = set(DOMAINS)
    received = set(answers)
    if received != expected:
        missing = sorted(expected - received)
        extra = sorted(received - expected)
        parts = []
        if missing:
            parts.append(f"missing answers: {', '.join(missing)}")
        if extra:
            parts.append(f"unexpected answers: {', '.join(extra)}")
        raise ValueError("; ".join(parts))

    clean = {}
    for key in DOMAINS:
        value = answers[key]
        # bool is a subclass of int in Python, so reject it explicitly.
        if isinstance(value, bool) or not isinstance(value, int) or value not in (0, 1, 2, 3):
            raise ValueError(f"{key} must be an integer from 0 to 3")
        clean[key] = value

    total = sum(clean.values())
    # Suggestions are based on the user's highest self-reported response only.
    highest = max(clean.values())
    focus_areas = [key for key, value in clean.items() if value == highest and highest > 0]
    suggestions = [SUGGESTIONS[key] for key in focus_areas[:2]]
    if not suggestions:
        suggestions = ["Take a moment to notice what is helping you feel well, and keep doing what supports you."]

    return {
        "total": total,
        "max_total": 15,
        "responses": clean,
        "focus_areas": [DOMAINS[key] for key in focus_areas],
        "suggestions": suggestions,
        "notice": (
            "This is a custom, unvalidated reflection check-in. The total has no validated clinical cut-offs; "
            "it is not a diagnosis, medical advice, or a prediction of mental-health risk."
        ),
    }
