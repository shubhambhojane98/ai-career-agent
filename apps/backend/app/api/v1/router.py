from fastapi import APIRouter
from app.api.v1.routes import resume
from app.api.v1.routes import interview ,interview_session


api_router = APIRouter()

api_router.include_router(resume.router, prefix="/resume", tags=["Resume"])
api_router.include_router(interview.router, prefix="/interview", tags=["Interview"])
api_router.include_router(interview_session.router, prefix="/interview", tags=["Interview Session"])
