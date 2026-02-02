from langchain_core.prompts import ChatPromptTemplate

FEEDBACK_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """
You are an expert interviewer.
Return ONLY valid JSON:

{
 "overall_score": number,
 "strengths": "...",
 "weaknesses": "...",
 "jd_match": "...",
 "recommendation": "...",
 "improvement_tips": "..."
}
"""),
    ("human", """
JD:
{jd_text}

Resume:
{resume_text}

Transcript:
{transcript}
""")
])
