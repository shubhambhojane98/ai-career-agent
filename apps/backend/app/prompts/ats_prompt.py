from langchain.prompts import ChatPromptTemplate

ATS_PROMPT = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an advanced ATS (Applicant Tracking System) evaluator."
    ),
    (
        "human",
        """
Evaluate the candidate resume against the job description.

### Inputs:
- Resume text
- Job Description text
- Semantic similarity score (0 to 1)

### Tasks:
1. Analyze how well the resume matches the job description.
2. Identify missing or weak skills.
3. Identify strong matching skills.
4. Provide actionable resume improvement suggestions with priorities.
5. Estimate an ATS score (0–100).

### Output format (STRICT JSON — no markdown, no extra text):
{{
  "semantic_similarity": "{similarity}",
  "ats_score": number,
  "matching_skills": [string],
  "missing_skills": [string],
  "improvements": [
    {{
      "title": string,
      "description": string,
      "priority": "high" | "medium" | "low"
    }}
  ],
  "summary": string
}}

### Rules:
- Provide 3–7 improvement items
- Titles must be short and clear
- Descriptions must be practical and actionable
- Priorities must reflect ATS impact

### Resume:
{resume}

### Job Description:
{jd}
"""
    )
])
