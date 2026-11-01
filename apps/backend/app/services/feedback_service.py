import asyncio
from langchain_openai import ChatOpenAI
from app.prompts.feedback_prompt import FEEDBACK_PROMPT

def run_sync(fn):
    loop = asyncio.get_running_loop()
    return loop.run_in_executor(None, fn)

llm = ChatOpenAI(model="gpt-4o-mini")

class FeedbackService:
    def __init__(self, supabase_client):
        # This line fixes the AttributeError
        self.supabase = supabase_client

    async def generate(self, job_description, resume_text, transcript):
        chain = FEEDBACK_PROMPT | llm
        res = await chain.ainvoke({
            "job_description": job_description,
            "resume_text": resume_text,
            "transcript": transcript
        })
        return res.content

    async def save(self, session_id: str, feedback: dict, user_id):
        # Now self.supabase is defined and can be called
        return self.supabase.table("interview_feedback").insert({
            "session_id": session_id,
            "user_id": user_id,
            "feedback": feedback
        }).execute()

    async def get_latest_feedback(self, user_id: str):
        def _query():
            return self.supabase.table("interview_feedback") \
                .select("id, session_id, feedback, created_at") \
                .eq("user_id", user_id) \
                .order("created_at", desc=True) \
                .limit(1) \
                .execute()
        res = await run_sync(_query)
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None
