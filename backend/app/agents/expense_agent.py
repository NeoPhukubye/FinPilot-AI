import json
from typing import Any
from app.agents.base import BaseAgent

SYSTEM_PROMPT = """You are an expense optimization specialist for small businesses. Analyze spending 
patterns and find ways to reduce costs without harming operations.

Response format (JSON):
{
  "total_monthly_expenses": 0,
  "month_over_month_change": 0,
  "top_categories": [{"name": "...", "amount": 0, "trend": "up|down|stable", "percentage": 0}],
  "savings_opportunities": [{"category": "...", "current": 0, "suggested": 0, "action": "..."}],
  "unusual_expenses": [{"description": "...", "amount": 0, "reason": "..."}],
  "subscription_audit": [{"vendor": "...", "amount": 0, "recommendation": "keep|cancel|review"}],
  "total_potential_savings": 0
}"""


class ExpenseAgent(BaseAgent):
    @property
    def name(self) -> str:
        return "Expense Agent"

    async def analyze(self, data: dict[str, Any]) -> dict[str, Any]:
        user_message = f"""Analyze expenses and find optimization opportunities:

Monthly Expenses by Category: {json.dumps(data.get('expenses_by_category', {}))}
Previous Month Comparison: {json.dumps(data.get('previous_month', {}))}
Subscriptions: {json.dumps(data.get('subscriptions', []))}
Largest Expenses (this month): {json.dumps(data.get('largest_expenses', []))}
Industry Benchmarks: {json.dumps(data.get('benchmarks', {}))}"""

        response = await self._call_llm(SYSTEM_PROMPT, user_message)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {"summary": response, "savings_opportunities": [], "total_potential_savings": 0}
