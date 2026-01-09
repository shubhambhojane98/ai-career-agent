from pydantic import BaseModel
from typing import List, Literal


class Improvement(BaseModel):
    title: str
    description: str
    priority: Literal["high", "medium", "low"]


class ATSResponse(BaseModel):
    ats_score: int
    overall_fit: str

    semantic_similarity: float

    matched_skills: List[str]
    missing_skills: List[str]
    keyword_gaps: List[str]

    experience_match: str

    improvements: List[Improvement]
    summary: str

    recommendations: List[str]
