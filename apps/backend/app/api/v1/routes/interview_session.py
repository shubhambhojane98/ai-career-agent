from fastapi import APIRouter
from app.schemas.interview import SessionRequest
from app.services.session_service import SessionService

router = APIRouter()
session_service = SessionService()


@router.post("/session")
async def create_interview_session(data: SessionRequest):
    session_id = await session_service.create_session(
        ats_analysis_id=data.ats_analysis_id,
        user_id=data.user_id,
    )
    return {"session_id": session_id}
