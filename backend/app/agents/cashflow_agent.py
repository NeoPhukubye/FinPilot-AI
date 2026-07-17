import json
from typing import Any
from app.agents.base import BaseAgent

SYSTEM_PROMPT = """You are a cash flow prediction specialist for small businesses. Analyze transaction 
patterns to forecast cash position. Be precise with numbers and confidence levels.

Response format (JSON):
{
  "current_balance": 0,
  "forecast_7_days": {"balance": 0, "confidence": 0.85},
  "forecast_30_days": {"balance": 0, "confidence": 0.72},
  "forecast_90_days": {"balance": 0, "confidence": 0.55},
  "risk_of_negative": {"probability": 0.0, "estimated_date": null},
  "key_inflows": [{"source": "...", "amount": 0, "expected_date": "..."}],
  "key_outflows": [{"destination": "...", "amount": 0, "expected_date": "..."}],
  "recommendation": "..."
}"""


class CashFlowAgent(BaseAgent):
    @property
    def name(self) -> str:
        return "Cash Flow Agent"

    async def analyze(self, data: dict[str, Any]) -> dict[str, Any]:
        user_message = f"""Predict cash flow based on:

Current Balance: R{data.get('current_balance', 0):,.2f}
Average Daily Income: R{data.get('avg_daily_income', 0):,.2f}
Average Daily Expenses: R{data.get('avg_daily_expenses', 0):,.2f}
Recurring Income (monthly): {json.dumps(data.get('recurring_income', []))}
Recurring Expenses (monthly): {json.dumps(data.get('recurring_expenses', []))}
Pending Invoices: {json.dumps(data.get('pending_invoices', []))}
Upcoming Bills: {json.dumps(data.get('upcoming_bills', []))}
Seasonal Patterns: {data.get('seasonal_notes', 'none identified')}
Last 30 days net: R{data.get('last_30_net', 0):,.2f}"""

        response = await self._call_llm(SYSTEM_PROMPT, user_message)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {"summary": response, "forecast_7_days": {}, "forecast_30_days": {}, "forecast_90_days": {}}
