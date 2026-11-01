from datetime import datetime, timezone
from typing import Dict, Any, Optional
from fastapi import HTTPException, status
from app.db.supabase import supabase
from app.schemas.skill_session import SkillSessionCreateRequest, SkillSessionResponse
from app.services.skill_service import SKILLS_CATALOG

# In-memory session metadata cache for fast retrieval & fallback persistence
_SKILL_SESSION_CACHE: Dict[str, Dict[str, Any]] = {}


class SkillSessionService:
    @staticmethod
    def create_session(
        data: SkillSessionCreateRequest,
        user_id: str
    ) -> SkillSessionResponse:
        """
        Validates the requested skill configuration, generates an interview session,
        persists the session in Supabase, and returns the initialized session response.
        """
        clean_user_id = user_id.strip() if user_id else ""
        if not clean_user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required. Please provide a valid user-id."
            )

        # 1. Validate skill_id
        target_skill_id = data.skill_id.strip().lower()
        skill = next((s for s in SKILLS_CATALOG if s.id == target_skill_id), None)
        if not skill:
            valid_skills = ", ".join(s.id for s in SKILLS_CATALOG)
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid skill_id '{data.skill_id}'. Supported skills are: {valid_skills}"
            )

        # 2. Validate topic_id (optional)
        topic_id: Optional[str] = None
        topic_name: str = "All Topics"

        if data.topic_id is not None and data.topic_id.strip():
            target_topic_id = data.topic_id.strip().lower()
            topic = next((t for t in skill.topics if t.id == target_topic_id), None)
            if not topic:
                valid_topics = ", ".join(t.id for t in skill.topics)
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        f"Invalid topic_id '{data.topic_id}' for skill '{skill.name}'. "
                        f"Valid topics are: {valid_topics}"
                    )
                )
            topic_id = topic.id
            topic_name = topic.name

        # 3. Persist session to Supabase
        # Attempt full schema insert first, with safe fallback if optional columns
        # have not yet been migrated in the live Supabase database.
        full_payload = {
            "user_id": clean_user_id,
            "session_type": "skill",
            "skill_id": skill.id,
            "topic_id": topic_id,
            "difficulty": data.difficulty,
            "target_question_count": data.total_questions,
            "interview_type": data.interview_type,
            "experience_level": data.experience_level,
            "status": "in_progress",
            "ats_analysis_id": None
        }

        created_at_str = datetime.now(timezone.utc).isoformat()
        session_id: str

        try:
            res = supabase.table("interview_sessions").insert(full_payload).execute()
            session_id = res.data[0]["id"]
            created_at_str = res.data[0].get("created_at") or created_at_str
        except Exception as err:
            err_str = str(err)
            # If the database does not yet have the new columns (PGRST204), fall back to base insert
            if "PGRST204" in err_str or "Could not find" in err_str:
                base_payload = {
                    "user_id": clean_user_id,
                    "ats_analysis_id": None
                }
                res = supabase.table("interview_sessions").insert(base_payload).execute()
                session_id = res.data[0]["id"]
                created_at_str = res.data[0].get("created_at") or created_at_str
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to create interview session in database: {err_str}"
                )

        # 4. Cache metadata
        session_data = {
            "session_id": session_id,
            "user_id": clean_user_id,
            "skill_id": skill.id,
            "skill_name": skill.name,
            "topic_id": topic_id,
            "topic_name": topic_name,
            "difficulty": data.difficulty,
            "total_questions": data.total_questions,
            "interview_type": data.interview_type,
            "experience_level": data.experience_level,
            "status": "in_progress",
            "created_at": created_at_str
        }
        _SKILL_SESSION_CACHE[session_id] = session_data

        return SkillSessionResponse(**session_data)

    @staticmethod
    def get_session(session_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve cached or persisted skill session metadata.
        """
        return _SKILL_SESSION_CACHE.get(session_id)
