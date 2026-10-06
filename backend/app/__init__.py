import sys
from pathlib import Path

# Add the parent directory (MemoryMind-AI) to sys.path so 'backend' module is resolvable
parent_dir = str(Path(__file__).resolve().parent.parent.parent)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from contextlib import asynccontextmanager

from fastapi import FastAPI
from loguru import logger

from backend.api import health_router
from backend.api.v1 import router as api_v1_router
from backend.config.settings import settings
from backend.core.database import engine
from backend.core.logger import setup_logging
from backend.middleware import register_exception_handlers, register_middlewares


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Connecting to database...")
    try:
        async with engine.connect() as conn:
            await conn.execute(__import__('sqlalchemy').text("SELECT 1"))
        logger.info("Database connection: OK")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
    yield
    logger.info("Shutting down...")
    await engine.dispose()


def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Backend API for MemoryMind AI — Intelligent Document Learning Platform",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    app.include_router(health_router)
    app.include_router(api_v1_router, prefix=settings.API_PREFIX)

    register_exception_handlers(app)
    register_middlewares(app)

    return app


app = create_application()
