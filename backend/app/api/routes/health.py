from fastapi import APIRouter

from app.core.settings import settings

router = APIRouter()


@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "model": settings.MODEL_NAME,
    }