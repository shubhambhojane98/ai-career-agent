from langchain_openai import ChatOpenAI
from app.prompts.feedback_prompt import FEEDBACK_PROMPT

llm = ChatOpenAI(model="gpt-4o-mini")

class FeedbackService:
    async def generate(self, jd, resume, transcript):
        chain = FEEDBACK_PROMPT | llm
        res = await chain.ainvoke({
            "jd_text": jd,
            "resume_text": resume,
            "transcript": transcript
        })
        return res.content
