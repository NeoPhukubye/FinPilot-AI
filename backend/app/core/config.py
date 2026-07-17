from pydantic_settings import BaseSettings
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
    gemini_model: str = "gemini-1.5-flash-latest"

    # JWT
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
