import os
from pathlib import Path
from typing import List

from dotenv import load_dotenv
from pydantic import BaseModel, ConfigDict, Field, field_validator

config_directory = Path(__file__).resolve().parent.parent
dotenv_path = config_directory / ".env"
load_dotenv(dotenv_path=dotenv_path, override=False)


class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")

    APP_NAME: str = Field("MemoryMind AI")
    APP_VERSION: str = Field("0.1.0")
    DEBUG: bool = Field(False)
    HOST: str = Field("127.0.0.1")
    PORT: int = Field(8000)
    API_PREFIX: str = Field("/api/v1")
    SECRET_KEY: str = Field(...)

    JWT_SECRET: str = Field(...)
    JWT_ACCESS_EXPIRE_MINUTES: int = Field(15)
    JWT_REFRESH_EXPIRE_DAYS: int = Field(30)

    DATABASE_URL: str = Field(...)

    SUPABASE_URL: str = Field(...)
    SUPABASE_ANON_KEY: str = Field(...)
    SUPABASE_SERVICE_ROLE_KEY: str = Field("not-set")
    SUPABASE_STORAGE_BUCKET: str = Field("documents")

    ALLOWED_ORIGINS: List[str] = Field(default=["http://localhost:5173", "http://localhost:3000"])

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v):
        """Allow ALLOWED_ORIGINS to be a comma-separated string from .env"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v


settings = Settings.model_validate(os.environ)
