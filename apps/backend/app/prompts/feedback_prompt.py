from langchain_core.prompts import ChatPromptTemplate

FEEDBACK_PROMPT = ChatPromptTemplate.from_template("""
You are an AI interview evaluator.

Analyze the candidate interview and return feedback strictly in the following JSON format:

{{
  "overall_score": number,
  "strengths": [string],
  "weaknesses": [string],
  "suggestions": [string]
}}

Resume:
{resume_text}

Job Description:
{job_description}

Interview Transcript:
{transcript}
""")
