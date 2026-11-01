# app/services/session_service.py
import asyncio
from app.db.supabase import supabase
from app.services.interview_context_service import ATSService

def run_sync(fn):
    loop = asyncio.get_running_loop()
    return loop.run_in_executor(None, fn)

class SessionService:
    def __init__(self):
        self.supabase = supabase
        self.ats_service = ATSService()

    async def create_session(self, ats_analysis_id: str, user_id: str):
        def _insert():
            return self.supabase.table("interview_sessions").insert({
                "user_id": user_id,
                "ats_analysis_id": ats_analysis_id,
            }).execute()

        result = await run_sync(_insert)
        return result.data[0]["id"]

    async def get_session(self, session_id: str):
        def _query():
            return self.supabase.table("interview_sessions") \
                .select("*") \
                .eq("id", session_id) \
                .single() \
                .execute()

        result = await run_sync(_query)
        return result.data

    async def get_context(self, session_id: str):
        session = await self.get_session(session_id)
        ats = self.ats_service.get_ats_data(session["ats_analysis_id"])
        resume_text = self.ats_service.get_resume_text(ats["resume_path"])

        return {
            "job_description": ats["job_description"],
            "resume_text": resume_text
        }

    async def add_message(self, session_id, role, content):
        def _insert():
            return self.supabase.table("interview_messages").insert({
                "session_id": session_id,
                "role": role,
                "content": content
            }).execute()

        await run_sync(_insert)

    async def get_messages(self, session_id, limit=6):
        def _query():
            return self.supabase.table("interview_messages") \
                .select("role, content") \
                .eq("session_id", session_id) \
                .order("created_at", desc=True) \
                .limit(limit) \
                .execute()

        res = await run_sync(_query)
        return list(reversed(res.data))

    async def get_user_sessions(self, user_id: str, limit: int = 5):
        def _query():
            sessions = self.supabase.table("interview_sessions") \
                .select("id, created_at") \
                .eq("user_id", user_id) \
                .order("created_at", desc=True) \
                .limit(limit) \
                .execute().data or []

            session_ids = [s["id"] for s in sessions]
            feedback_map = {}
            if session_ids:
                feedbacks = self.supabase.table("interview_feedback") \
                    .select("session_id, feedback") \
                    .in_("session_id", session_ids) \
                    .execute().data or []
                for f in feedbacks:
                    feedback_map[f["session_id"]] = f["feedback"]

            for s in sessions:
                fb = feedback_map.get(s["id"])
                s["interview_feedback"] = [{"feedback": fb}] if fb else []

            return sessions

        return await run_sync(_query)
