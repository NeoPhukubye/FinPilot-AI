import json
from typing import Any
from app.agents.base import BaseAgent

SYSTEM_PROMPT = """You are the AI CFO for a small business. Analyze the financial data provided and give 
actionable, specific recommendations. Be direct, mention exact numbers, and prioritize by urgency.

Response format (JSON):
{
  "summary": "One sentence overview of financial health",
  "priorities": ["priority 1", "priority 2", "priority 3"],
  "alerts": [{"severity": "high|medium|low", "message": "..."}],
  "recommendations": [{"action": "...", "reason": "...", "impact": "..."}],
  "morning_briefing": "A friendly paragraph briefing for the business owner"
}"""


class CFOAgent(BaseAgent):
    @property
    def name(self) -> str:
        return "CFO Agent"

    async def analyze(self, data: dict[str, Any]) -> dict[str, Any]:
        user_message = f"""Analyze this financial snapshot:
        
Cash Balance: R{data.get('cash_balance', 0):,.2f}
Monthly Revenue: R{data.get('monthly_revenue', 0):,.2f}
Monthly Expenses: R{data.get('monthly_expenses', 0):,.2f}
Profit Margin: {data.get('profit_margin', 0):.1f}%
Outstanding Invoices: R{data.get('outstanding_invoices', 0):,.2f}
Overdue Invoices: {data.get('overdue_count', 0)}
Days Cash Remaining: {data.get('days_cash_remaining', 0)}
Upcoming Payroll: R{data.get('upcoming_payroll', 0):,.2f} in {data.get('days_to_payroll', 0)} days
Top Expense Categories: {json.dumps(data.get('top_expenses', {}))}
Revenue Trend: {data.get('revenue_trend', 'stable')}"""

        response = await self._call_llm(SYSTEM_PROMPT, user_message)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "summary": response,
                "priorities": [],
                "alerts": [],
                "recommendations": [],
                "morning_briefing": response,
            }
