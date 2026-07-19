from pydantic_settings import BaseSettings
from pydantic import model_validator
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "FinPilot AI"
    debug: bool = False

    # Database
    database_url: str = "sqlite+aiosqlite:///./finpilot.db"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # AI / LLM (Google Gemini)
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"

    # Pinch Payments
    pinch_api_key: str = ""
    pinch_secret_key: str = ""
    pinch_base_url: str = "https://api.getpinch.com.au"
    pinch_sandbox: bool = True

    # JWT
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    @model_validator(mode="after")
    def fix_database_url(self):
        # Render provides postgres:// but SQLAlchemy async needs postgresql+asyncpg://
        if self.database_url.startswith("postgres://"):
            self.database_url = self.database_url.replace(
                "postgres://", "postgresql+asyncpg://", 1
            )
        elif self.database_url.startswith("postgresql://"):
            self.database_url = self.database_url.replace(
                "postgresql://", "postgresql+asyncpg://", 1
            )
        return self

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
