from abc import ABC, abstractmethod
from typing import Any
import httpx
from app.core.config import get_settings


class BaseAgent(ABC):
    def __init__(self):
        self.settings = get_settings()
        self.client = httpx.AsyncClient(timeout=30.0)

    async def _call_llm(self, system_prompt: str, user_message: str) -> str:
        response = await self.client.post(
            f"{self.settings.llm_base_url}/chat/completions",
            headers={"Authorization": f"Bearer {self.settings.llm_api_key}"},
            json={
                "model": self.settings.llm_model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message},
                ],
                "temperature": 0.3,
                "max_tokens": 1024,
            },
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    @abstractmethod
    async def analyze(self, data: dict[str, Any]) -> dict[str, Any]:
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        pass
