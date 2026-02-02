import os
from supabase import create_client
from app.utils.pdf_extractor import extract_pdf_text

class ATSService:
    def __init__(self):
        self.supabase = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_ANON_KEY")
        )

    def get_ats_data(self, ats_id: str):
        res = self.supabase.table("ats_analyses") \
            .select("job_description, resume_path") \
            .eq("id", ats_id) \
            .single() \
            .execute()

        return res.data

    def get_resume_text(self, resume_path: str) -> str:
        pdf_bytes = self.supabase.storage \
            .from_("resumes") \
            .download(resume_path)

        return extract_pdf_text(pdf_bytes)
