import json
from typing import Any
from app.agents.base import BaseAgent

SYSTEM_PROMPT = """You are a financial risk analyst for small businesses. Identify risks, unusual 
patterns, and potential fraud. Flag anything concerning with severity levels.

Response format (JSON):
{
  "risk_level": "low|medium|high|critical",
  "anomalies": [{"type": "...", "description": "...", "amount": 0, "severity": "..."}],
  "duplicate_payments": [{"vendor": "...", "amount": 0, "dates": ["..."]}],
  "unusual_patterns": ["..."],
  "forgotten_subscriptions": [{"vendor": "...", "amount": 0, "last_used": "..."}],
  "recommendations": ["..."]
}"""


class RiskAgent(BaseAgent):
    @property
    def name(self) -> str:
        return "Risk Agent"

    async def analyze(self, data: dict[str, Any]) -> dict[str, Any]:
        user_message = f"""Analyze these transactions for risks and anomalies:

Recent Transactions (last 30 days): {json.dumps(data.get('recent_transactions', [])[:50])}
Recurring Payments: {json.dumps(data.get('recurring_payments', []))}
Average Transaction by Category: {json.dumps(data.get('category_averages', {}))}
Vendor Payment History: {json.dumps(data.get('vendor_history', [])[:30])}"""

        response = await self._call_llm(SYSTEM_PROMPT, user_message)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {"risk_level": "unknown", "anomalies": [], "recommendations": [response]}
