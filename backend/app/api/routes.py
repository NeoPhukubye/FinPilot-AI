from fastapi import APIRouter
from pydantic import BaseModel
import httpx
import asyncio

from app.core.config import get_settings
from app.services import pinch

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
    if not settings.azure_openai_api_key or not settings.azure_openai_endpoint:
        return ChatResponse(reply="AI service is not configured yet. Please set AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT environment variables.")

    url = (
        f"{settings.azure_openai_endpoint}/openai/deployments/{settings.azure_openai_deployment}"
        f"/chat/completions?api-version={settings.azure_openai_api_version}"
    )

    max_retries = 3
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    url,
                    headers={"api-key": settings.azure_openai_api_key},
                    json={
                        "messages": [
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": request.message},
                        ],
                        "temperature": 0.4,
                        "max_tokens": 512,
                    },
                )
                response.raise_for_status()
                data = response.json()
                reply = data["choices"][0]["message"]["content"]
                return ChatResponse(reply=reply)
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429 and attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)
                continue
            if e.response.status_code == 429:
                return ChatResponse(reply="I'm getting a lot of questions right now. Please wait a few seconds and try again.")
            detail = e.response.text[:200] if e.response.text else ""
            return ChatResponse(reply=f"AI error ({e.response.status_code}): {detail}")
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


# --- Pinch Payments Endpoints ---


class CollectPaymentRequest(BaseModel):
    payer_id: str
    amount: int
    description: str


class PaymentLinkRequest(BaseModel):
    payer_id: str
    amount: int
    description: str


class PaymentPlanRequest(BaseModel):
    payer_id: str
    total_amount: int
    instalments: int
    description: str


@router.get("/payments")
async def get_payments():
    payments = await pinch.list_payments()
    return {"payments": payments, "live_mode": pinch._is_live()}


@router.get("/payments/summary")
async def get_payment_summary():
    return await pinch.get_payment_summary()


@router.get("/payers")
async def get_payers():
    payers = await pinch.list_payers()
    return {"payers": payers, "live_mode": pinch._is_live()}


@router.post("/payments/collect")
async def collect_payment(request: CollectPaymentRequest):
    result = await pinch.collect_payment(request.payer_id, request.amount, request.description)
    return result


@router.post("/payments/link")
async def create_payment_link(request: PaymentLinkRequest):
    result = await pinch.create_payment_link(request.payer_id, request.amount, request.description)
    return result


@router.post("/payments/plan")
async def create_payment_plan(request: PaymentPlanRequest):
    result = await pinch.create_payment_plan(
        request.payer_id, request.total_amount, request.instalments, request.description
    )
    return result
