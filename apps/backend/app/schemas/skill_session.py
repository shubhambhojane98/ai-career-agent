from typing import Optional, Literal
from pydantic import BaseModel, Field

DifficultyLevel = Literal["beginner", "intermediate", "advanced"]
TotalQuestions = Literal[5, 10, 15]
InterviewType = Literal["technical", "scenario", "mixed"]
ExperienceLevel = Literal["fresher", "1-2 years", "3-5 years", "5+ years"]


class SkillSessionCreateRequest(BaseModel):
    skill_id: str = Field(
        ...,
        description="ID of the target skill (e.g., 'react', 'javascript', 'typescript', 'python', 'sql', 'fastapi')",
        examples=["react"]
    )
    topic_id: Optional[str] = Field(
        None,
        description="Optional topic ID under the selected skill. Null or omitted means all topics.",
        examples=["hooks-lifecycle"]
    )
    difficulty: DifficultyLevel = Field(
        ...,
        description="Interview difficulty level ('beginner', 'intermediate', 'advanced')",
        examples=["intermediate"]
    )
    total_questions: TotalQuestions = Field(
        ...,
        description="Number of questions in the interview session (5, 10, or 15)",
        examples=[10]
    )
    interview_type: InterviewType = Field(
        ...,
        description="Type of interview ('technical', 'scenario', 'mixed')",
        examples=["technical"]
    )
    experience_level: ExperienceLevel = Field(
        ...,
        description="Candidate's experience level ('fresher', '1-2 years', '3-5 years', '5+ years')",
        examples=["3-5 years"]
    )
    user_id: Optional[str] = Field(
        None,
        description="Optional Clerk user ID in request body (can also be provided via 'user-id' header)"
    )


class SkillSessionResponse(BaseModel):
    session_id: str = Field(..., description="Unique interview session ID (UUID)")
    user_id: str = Field(..., description="Authenticated user ID")
    skill_id: str = Field(..., description="Selected skill ID")
    skill_name: str = Field(..., description="Display name of the skill")
    topic_id: Optional[str] = Field(None, description="Selected topic ID or null for all topics")
    topic_name: str = Field(..., description="Display name of the topic or 'All Topics'")
    difficulty: DifficultyLevel = Field(..., description="Difficulty level")
    total_questions: int = Field(..., description="Total questions for the session")
    interview_type: InterviewType = Field(..., description="Interview type")
    experience_level: ExperienceLevel = Field(..., description="Candidate experience level")
    status: str = Field(default="in_progress", description="Initial session status")
    created_at: str = Field(..., description="ISO 8601 creation timestamp")
