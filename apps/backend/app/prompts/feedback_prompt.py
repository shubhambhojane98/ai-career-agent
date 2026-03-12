from langchain_core.prompts import ChatPromptTemplate

FEEDBACK_PROMPT = ChatPromptTemplate.from_template("""
You are an AI interview evaluator.
overall_score should be out of 5.
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
