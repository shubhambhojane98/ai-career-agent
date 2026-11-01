from pydantic import BaseModel, Field


class SessionRequest(BaseModel):
    ats_analysis_id: str = Field(..., description="Foreign key reference to ATS analysis record")
    user_id: str = Field(..., description="Clerk user ID")
