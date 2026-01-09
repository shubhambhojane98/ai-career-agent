from langchain_core.prompts import ChatPromptTemplate

ATS_PROMPT = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an advanced ATS (Applicant Tracking System) evaluator used by recruiters."
    ),
    (
        "human",
        """
Evaluate the candidate resume against the job description using ATS-style analysis.

### Inputs:
- Resume text
- Job Description text
- Semantic similarity score (0.0 to 1.0)

### Tasks:
1. Evaluate overall resume–job fit.
2. Analyze skill alignment and gaps.
3. Identify missing keywords required by ATS systems.
4. Assess experience relevance and seniority match.
5. Provide prioritized, actionable improvement suggestions.
6. Generate recruiter-style recommendations.
7. Calculate an ATS score from 0 to 100.

### Output format (STRICT JSON — no markdown, no extra text):
{{
  "ats_score": number,
  "overall_fit": string,

  "semantic_similarity": number,

  "matched_skills": [string],
  "missing_skills": [string],
  "keyword_gaps": [string],

  "experience_match": string,

  "improvements": [
    {{
      "title": string,
      "description": string,
      "priority": "high" | "medium" | "low"
    }}
  ],

  "summary": string,
  "recommendations": [string]
}}

### Rules:
- ATS score must reflect skills, keywords, and experience match
- overall_fit must be one short sentence (e.g., "Strong match", "Moderate match", "Weak match")
- experience_match must describe alignment (e.g., "Meets required experience level")
- Provide 3–7 improvement items
- Recommendations should be concise, recruiter-oriented actions

### Resume:
{resume}

### Job Description:
{jd}

### Semantic Similarity Score:
{similarity}
"""
    )
])