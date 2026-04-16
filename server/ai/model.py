"""Optional Python AI layer for future production model serving.

This mirrors the JS heuristics used in the prototype and can be upgraded to
spaCy/transformer pipelines for extraction and ranking.
"""

from math import radians, sin, cos, atan2, sqrt

KEYWORDS = {
    "food": "Food & Nutrition",
    "medical": "Medical",
    "shelter": "Shelter & Family Support",
    "water": "Water & Sanitation",
    "logistics": "Logistics",
}


def extract_keywords(text: str) -> list[str]:
    tokens = [t.strip(".,!?;:").lower() for t in text.split()]
    return sorted({t for t in tokens if any(k in t for k in KEYWORDS)})


def urgency_score(text: str, signals: list[str]) -> tuple[str, int]:
    severity_terms = ["urgent", "immediate", "overcrowded", "evacuation"]
    lower = text.lower()
    score = sum(30 for s in severity_terms if s in lower) + 20 * len(signals)
    if score >= 90:
        return "High", score
    if score >= 45:
        return "Medium", score
    return "Low", score


def distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return 2 * radius * atan2(sqrt(a), sqrt(1 - a))
