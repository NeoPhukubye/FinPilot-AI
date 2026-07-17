from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "FinPilot AI"
    debug: bool = False

    # Database
    database_url: str = "postgresql+asyncpg://finpilot:finpilot@localhost:5432/finpilot"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # AI / LLM
    llm_api_key: str = ""
    llm_base_url: str = "https://api.fireworks.ai/inference/v1"
    llm_model: str = "accounts/fireworks/models/llama-v3p1-70b-instruct"

    # JWT
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
