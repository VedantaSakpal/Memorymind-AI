from fastapi import APIRouter
from sqlalchemy import text

from backend.config.settings import settings
from backend.core.database import async_session_maker

router = APIRouter()


@router.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": settings.APP_NAME, "version": settings.APP_VERSION}


@router.get("/health/ready", tags=["Health"])
async def health_ready():
    """Readiness probe — verifies DB is reachable."""
    try:
        async with async_session_maker() as session:
            await session.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as e:
        db_status = f"error: {e}"

    all_ok = db_status == "ok"
    return {
        "status": "ready" if all_ok else "not_ready",
        "checks": {"database": db_status},
    }


@router.get("/health/live", tags=["Health"])
async def health_live():
    """Liveness probe — always returns 200 if the process is running."""
    return {"status": "alive"}
