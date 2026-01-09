from fastapi import APIRouter, UploadFile, File
# from app.schemas.resume import ResumeRequest
# from app.graphs.resume_flow import run_resume_flow

router = APIRouter()

# @router.post("/ats-check")
# async def ats_check(
#     resume: UploadFile = File(...),
#     job_description: UploadFile = File(...)
# ):
#     return await run_ats_pipeline(resume, job_description)
