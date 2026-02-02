from fastapi import APIRouter
from pydantic import BaseModel
from app.services.session_service import SessionService

router = APIRouter()
session_service = SessionService()

class SessionRequest(BaseModel):
    ats_analysis_id: str
    user_id: str


@router.post("/session")
async def create_interview_session(data: SessionRequest):
    session_id = await session_service.create_session(
        ats_analysis_id=data.ats_analysis_id,
        user_id=data.user_id,
    )
    return {"session_id": session_id}
