from app.db.supabase import supabase

def save_ats_analysis(
    *,
    user_id: str,
    similarity: float,
    analysis: dict,
    job_description:str,
    resume_path: str | None = None
):
    return supabase.table("ats_analyses").insert({
        "user_id": user_id,
        "similarity_score": similarity,
        "analysis": analysis,
        "job_description": job_description,
        "resume_path": resume_path
    }).execute()


def delete_existing_resume_and_analysis(user_id: str):

      # 1️⃣ Get existing ATS record (to find resume_path)
    existing = (
        supabase.table("ats_analyses")
        .select("resume_path")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    if existing.data:
        resume_path = existing.data[0]["resume_path"]

        # 2️⃣ Delete resume file from STORAGE
        supabase.storage \
            .from_("resumes") \
            .remove([resume_path])
        
    # 1️⃣ Delete ATS analysis first (FK safe)
    supabase.table("ats_analyses") \
        .delete() \
        .eq("user_id", user_id) \
        .execute()

