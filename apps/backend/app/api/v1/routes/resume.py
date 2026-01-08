from fastapi import APIRouter
# from app.schemas.resume import ResumeRequest
# from app.graphs.resume_flow import run_resume_flow

router = APIRouter()

@router.post("/analyze")
def analyze_resume():
    pass
