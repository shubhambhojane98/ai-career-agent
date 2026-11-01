"""
Backward-compatibility alias.
Pydantic schemas have been standardized under app.schemas.
Please import from app.schemas.ats instead.
"""
from app.schemas.ats import ATSResponse, Improvement

__all__ = ["ATSResponse", "Improvement"]
