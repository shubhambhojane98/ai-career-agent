from typing import Optional
from fastapi import APIRouter, Header, HTTPException, status
from app.schemas.skill_session import SkillSessionCreateRequest, SkillSessionResponse
from app.services.skill_session_service import SkillSessionService

router = APIRouter()


@router.post(
    "/skill-sessions",
    response_model=SkillSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a skill-based interview session",
    description="Validate requested skill and topic configuration, initialize a technical interview session for the authenticated user, and return session metadata."
)
async def create_skill_session(
    data: SkillSessionCreateRequest,
    user_id_header: Optional[str] = Header(default=None, alias="user-id")
):
    authenticated_user_id = user_id_header or data.user_id
    if not authenticated_user_id or not authenticated_user_id.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please provide a user-id header or user_id in request body."
        )

    return SkillSessionService.create_session(data=data, user_id=authenticated_user_id)
