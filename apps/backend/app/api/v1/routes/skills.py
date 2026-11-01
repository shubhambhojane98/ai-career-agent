from fastapi import APIRouter
from app.schemas.skill import SkillCatalogResponse
from app.services.skill_service import SkillService

router = APIRouter()


@router.get(
    "/skills",
    response_model=SkillCatalogResponse,
    summary="Get available technical skills and topics",
    description="Retrieve the catalog of supported skills (React, JavaScript, TypeScript, Python, SQL, FastAPI) and their curated interview topics."
)
async def get_skills():
    return SkillService.get_catalog()
