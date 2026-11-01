from fastapi import APIRouter, UploadFile, File, Form, Header

# from app.schemas.resume import ResumeRequest
# from app.graphs.resume_flow import run_resume_flow
from app.models.ats_response import ATSResponse
from app.services.ats_service import run_ats_pipeline
from app.services.analysis_service import get_latest_ats_analysis

router = APIRouter()

@router.post("/ats-check", response_model=ATSResponse)
async def ats_check(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    user_id: str | None = Header(default=None, alias="user-id")
):
    return await run_ats_pipeline(
        resume_file=resume,
        job_description=job_description,
        user_id=user_id
    )

@router.get("/latest")
async def get_latest_resume_analysis(
    user_id: str | None = Header(default=None, alias="user-id")
):
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    record = get_latest_ats_analysis(user_id)
    if not record:
        return {"id": None, "analysis": None}
    return record

