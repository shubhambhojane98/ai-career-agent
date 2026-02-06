from langchain_openai import ChatOpenAI
from app.prompts.feedback_prompt import FEEDBACK_PROMPT

llm = ChatOpenAI(model="gpt-4o-mini")

class FeedbackService:
    async def generate(self, job_description, resume_text, transcript):
        chain = FEEDBACK_PROMPT | llm
        res = await chain.ainvoke({
            "job_description": job_description,
            "resume_text": resume_text,
            "transcript": transcript
        })
        return res.content
