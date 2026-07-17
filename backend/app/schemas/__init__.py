from pydantic import BaseModel
from datetime import date, datetime
from decimal import Decimal
from uuid import UUID
from typing import Optional


class DashboardResponse(BaseModel):
    cash_balance: Decimal
    revenue_this_month: Decimal
    expenses_this_month: Decimal
    profit_this_month: Decimal
    health_score: int
    upcoming_bills: list[dict]
    upcoming_payroll: dict
    invoice_status: dict
    ai_insights: list[dict]
    forecast: dict


class CashFlowForecastResponse(BaseModel):
    forecast_7_days: dict
    forecast_30_days: dict
    forecast_90_days: dict
    risk_of_negative: dict
    recommendation: str


class InvoiceResponse(BaseModel):
    id: UUID
    invoice_number: str
    client_name: str
    amount: Decimal
    status: str
    issue_date: date
    due_date: date
    days_overdue: int


class AIInsight(BaseModel):
    type: str
    severity: str
    message: str
    action: Optional[str] = None


class ScenarioRequest(BaseModel):
    scenario: str
    params: dict = {}


class NaturalLanguageQuery(BaseModel):
    question: str


class HealthScoreResponse(BaseModel):
    overall: int
    cash_flow: int
    debt: int
    savings: int
    growth: int
    collection: int
    expenses: int
