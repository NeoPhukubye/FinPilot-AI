from fastapi import APIRouter
from pydantic import BaseModel
import httpx

from app.core.config import get_settings

router = APIRouter()
settings = get_settings()

SYSTEM_PROMPT = """You are FinPilot AI, an expert financial copilot for small businesses and banks in South Africa.

You help users:
- Understand their cash flow and financial health
- Predict future cash positions
- Identify risky spending patterns
- Find ways to grow their money
- Make informed decisions about hiring, investing, and spending
- Track money coming in and going out
- Give actionable tips to grow revenue and reduce costs

Be concise, specific with numbers (use Rands with R prefix), and always end with an actionable recommendation.
Keep responses under 200 words unless asked for detail. Be friendly and professional."""


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not settings.gemini_api_key:
        return ChatResponse(reply="AI service is not configured yet. Please set the GEMINI_API_KEY environment variable.")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent?key={settings.gemini_api_key}"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                url,
                json={
                    "contents": [
                        {"role": "user", "parts": [{"text": f"{SYSTEM_PROMPT}\n\nUser question: {request.message}"}]}
                    ],
                    "generationConfig": {
                        "temperature": 0.4,
                        "maxOutputTokens": 512,
                    },
                },
            )
            response.raise_for_status()
            data = response.json()
            reply = data["candidates"][0]["content"]["parts"][0]["text"]
            return ChatResponse(reply=reply)
    except httpx.HTTPStatusError as e:
        return ChatResponse(reply=f"AI error: {e.response.status_code}. Check that your Gemini API key is valid.")
    except Exception:
        return ChatResponse(reply="Something went wrong connecting to the AI. Please try again.")


@router.get("/health-score")
async def get_health_score():
    return {
        "overall": 78,
        "cash_flow": 80,
        "debt": 90,
        "savings": 60,
        "growth": 70,
        "collection": 65,
        "expenses": 75,
    }


@router.get("/recommendations")
async def get_recommendations():
    return [
        {"action": "Follow up Invoice #204", "reason": "14 days overdue, R18,500 at risk", "impact": "Recover R18,500"},
        {"action": "Delay equipment purchase", "reason": "Cash reserve below target", "impact": "Save R35,000"},
        {"action": "Reduce paid advertising", "reason": "ROI declined 40% in 2 weeks", "impact": "Save R8,000/month"},
        {"action": "Invoice Client B", "reason": "Project delivered 5 days ago", "impact": "Add R42,000"},
        {"action": "Cancel unused Figma licenses", "reason": "3 seats unused for 60+ days", "impact": "Save R2,400/month"},
    ]
