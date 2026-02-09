from langchain_openai import ChatOpenAI
from app.prompts.feedback_prompt import FEEDBACK_PROMPT

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

    async def save(self, session_id: str, feedback: dict,user_id):
        # Now self.supabase is defined and can be called
        return self.supabase.table("interview_feedback").insert({
            "session_id": session_id,
            "user_id": user_id,
            "feedback": feedback
        }).execute()