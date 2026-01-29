from fastapi import APIRouter, UploadFile, File, Form, Header

# from app.schemas.resume import ResumeRequest
# from app.graphs.resume_flow import run_resume_flow
from app.models.ats_response import ATSResponse
from app.services.ats_service import run_ats_pipeline

router = APIRouter()

@router.post("/ats-check", response_model=ATSResponse)
async def ats_check(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    user_id: str | None = Header(default=None, alias="user-id")

):
    return await run_ats_pipeline(resume_file=resume,
    job_description=job_description,
    user_id=user_id)
