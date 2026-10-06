import traceback
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from loguru import logger


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "detail": exc.detail,
                "error": {"type": "http_exception", "detail": exc.detail},
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        tb = traceback.format_exc()
        logger.error(f"Unhandled exception on {request.method} {request.url}:\n{tb}")
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "type": "server_error",
                    "detail": str(exc),  # expose real message for debug
                }
            },
        )
