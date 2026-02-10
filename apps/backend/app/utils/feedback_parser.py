# import json

# def parse_feedback(text: str):
#     return json.loads(text)

import json
import re

def parse_feedback(text: str):
    try:
        # 1. Strip out markdown code blocks if they exist
        clean_text = re.sub(r"```json\s?|```", "", text).strip()
        
        # 2. Find the first '{' and the last '}'
        # This ignores any "Chatter" the AI added before or after the JSON
        start_idx = clean_text.find('{')
        end_idx = clean_text.rfind('}')
        
        if start_idx != -1 and end_idx != -1:
            json_payload = clean_text[start_idx:end_idx + 1]
            return json.loads(json_payload)
        
        # If no brackets are found, it's not JSON
        raise ValueError("No JSON object found in response")

    except (json.JSONDecodeError, ValueError) as e:
        print(f"Failed to parse. AI sent: {text}")
        # Return a safe fallback so your code doesn't crash
        return {
            "overall_score": 0,
            "strengths": ["Analysis completed"],
            "weaknesses": ["Feedback formatting error"],
            "suggestions": ["Try again or check logs"]
        }