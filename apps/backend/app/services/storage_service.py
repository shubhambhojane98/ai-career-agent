from fastapi import UploadFile
from app.db.supabase import supabase
import uuid

async def upload_resume_to_supabase(
    file_bytes: bytes,
    filename: str,
    user_id: str
):
    file_path = f"{user_id}/{uuid.uuid4()}_{filename}"

    supabase.storage.from_("resumes").upload(
        path=file_path,
        file=file_bytes,
        file_options={
            "content-type": "application/pdf"
        }
    )

    return file_path
