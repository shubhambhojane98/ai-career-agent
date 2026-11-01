from typing import List, Optional
from pydantic import BaseModel, Field


class Topic(BaseModel):
    id: str = Field(..., description="Unique identifier/slug for the topic")
    name: str = Field(..., description="Display name of the topic")
    description: Optional[str] = Field(None, description="Detailed explanation of the topic scope")


class Skill(BaseModel):
    id: str = Field(..., description="Unique identifier/slug for the skill")
    name: str = Field(..., description="Display name of the skill")
    description: str = Field(..., description="Summary of the skill domain")
    icon: Optional[str] = Field(None, description="Suggested UI icon name for frontend rendering")
    topics: List[Topic] = Field(default_factory=list, description="Curated topics under this skill")


class SkillCatalogResponse(BaseModel):
    total_skills: int = Field(..., description="Total count of available skills")
    skills: List[Skill] = Field(..., description="List of available skills and their topics")
