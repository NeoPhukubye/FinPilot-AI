import json
from typing import Any
from app.agents.base import BaseAgent

SYSTEM_PROMPT = """You are a financial forecast simulator for small businesses. Given a scenario, 
predict the financial impact over 3, 6, and 12 months. Be realistic and specific.

Response format (JSON):
{
  "scenario": "...",
  "impact_3_months": {"revenue": 0, "expenses": 0, "cash_position": 0, "profit": 0},
  "impact_6_months": {"revenue": 0, "expenses": 0, "cash_position": 0, "profit": 0},
  "impact_12_months": {"revenue": 0, "expenses": 0, "cash_position": 0, "profit": 0},
  "risks": ["..."],
  "benefits": ["..."],
  "recommendation": "proceed|cautious|delay|avoid",
  "explanation": "..."
}"""


class ForecastAgent(BaseAgent):
    @property
    def name(self) -> str:
        return "Forecast Agent"

    async def analyze(self, data: dict[str, Any]) -> dict[str, Any]:
        user_message = f"""Simulate this financial scenario:

Scenario: {data.get('scenario', '')}
Current Financials:
  - Monthly Revenue: R{data.get('monthly_revenue', 0):,.2f}
  - Monthly Expenses: R{data.get('monthly_expenses', 0):,.2f}
  - Cash Balance: R{data.get('cash_balance', 0):,.2f}
  - Monthly Growth Rate: {data.get('growth_rate', 0):.1f}%
  - Employees: {data.get('employee_count', 0)}
  - Average Salary: R{data.get('avg_salary', 0):,.2f}

Scenario Parameters: {json.dumps(data.get('scenario_params', {}))}"""

        response = await self._call_llm(SYSTEM_PROMPT, user_message)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {"scenario": data.get("scenario", ""), "explanation": response}
