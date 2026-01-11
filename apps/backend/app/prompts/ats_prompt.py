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
  "ats_score": integer,
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

### Example Output:

{{
  "ats_score": 82,
  "overall_fit": "Moderate match",
  "semantic_similarity": 0.74,
  "matched_skills": ["Python", "Django", "REST APIs", "SQL"],
  "missing_skills": ["AWS", "Docker", "CI/CD pipelines"],
  "keyword_gaps": ["Cloud infrastructure", "Containerization", "DevOps"],
  "experience_match": "Meets required experience level but lacks senior-level leadership examples",
  "improvements": [
    {{
      "title": "Add Cloud Experience",
      "description": "Include projects or work experience involving AWS or cloud platforms",
      "priority": "high"
    }},
    {{
      "title": "Include DevOps Skills",
      "description": "List Docker, CI/CD, and related tools in technical skills section",
      "priority": "high"
    }},
    {{
      "title": "Highlight Leadership Experience",
      "description": "Showcase any team lead or mentoring experience to strengthen seniority alignment",
      "priority": "medium"
    }}
  ],
  "summary": "The resume demonstrates strong backend development skills but lacks cloud and DevOps expertise. Soft skills and leadership experience are not highlighted.",
  "recommendations": [
    "Add AWS and cloud projects",
    "Include Docker and CI/CD experience",
    "Emphasize leadership or mentoring roles"
  ]
}}

### Resume:
{resume}

### Job Description:
{jd}

### Semantic Similarity Score:
{similarity}
"""
    )
])