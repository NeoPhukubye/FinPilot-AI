from decimal import Decimal
from datetime import date, timedelta
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.financial import Transaction, Invoice, Expense, InvoiceStatus, TransactionType
from app.agents import CFOAgent, CashFlowAgent, RiskAgent, ExpenseAgent, ForecastAgent


class FinancialService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.cfo = CFOAgent()
        self.cashflow = CashFlowAgent()
        self.risk = RiskAgent()
        self.expense = ExpenseAgent()
        self.forecast = ForecastAgent()

    async def _get_financial_snapshot(self) -> dict[str, Any]:
        today = date.today()
        month_start = today.replace(day=1)

        revenue_result = await self.db.execute(
            select(func.coalesce(func.sum(Transaction.amount), 0)).where(
                Transaction.type == TransactionType.INCOME,
                Transaction.date >= month_start,
            )
        )
        revenue = revenue_result.scalar() or Decimal(0)

        expense_result = await self.db.execute(
            select(func.coalesce(func.sum(Transaction.amount), 0)).where(
                Transaction.type == TransactionType.EXPENSE,
                Transaction.date >= month_start,
            )
        )
        expenses = expense_result.scalar() or Decimal(0)

        income_total = await self.db.execute(
            select(func.coalesce(func.sum(Transaction.amount), 0)).where(
                Transaction.type == TransactionType.INCOME
            )
        )
        expense_total = await self.db.execute(
            select(func.coalesce(func.sum(Transaction.amount), 0)).where(
                Transaction.type == TransactionType.EXPENSE
            )
        )
        cash_balance = (income_total.scalar() or Decimal(0)) - (expense_total.scalar() or Decimal(0))

        outstanding = await self.db.execute(
            select(func.coalesce(func.sum(Invoice.amount), 0)).where(
                Invoice.status.in_([InvoiceStatus.SENT, InvoiceStatus.OVERDUE])
            )
        )
        overdue = await self.db.execute(
            select(func.count()).where(Invoice.status == InvoiceStatus.OVERDUE)
        )

        return {
            "cash_balance": float(cash_balance),
            "monthly_revenue": float(revenue),
            "monthly_expenses": float(expenses),
            "profit_margin": float((revenue - expenses) / revenue * 100) if revenue > 0 else 0,
            "outstanding_invoices": float(outstanding.scalar() or 0),
            "overdue_count": overdue.scalar() or 0,
            "days_cash_remaining": int(float(cash_balance) / (float(expenses) / 30)) if expenses > 0 else 999,
        }

    async def get_dashboard(self) -> dict[str, Any]:
        snapshot = await self._get_financial_snapshot()
        cfo_analysis = await self.cfo.analyze(snapshot)

        return {
            "cash_balance": Decimal(str(snapshot["cash_balance"])),
            "revenue_this_month": Decimal(str(snapshot["monthly_revenue"])),
            "expenses_this_month": Decimal(str(snapshot["monthly_expenses"])),
            "profit_this_month": Decimal(str(snapshot["monthly_revenue"] - snapshot["monthly_expenses"])),
            "health_score": 75,
            "upcoming_bills": [],
            "upcoming_payroll": {"amount": 0, "days_until": 0},
            "invoice_status": {
                "outstanding": snapshot["outstanding_invoices"],
                "overdue": snapshot["overdue_count"],
            },
            "ai_insights": cfo_analysis.get("alerts", []),
            "forecast": {},
        }

    async def get_cash_flow_forecast(self) -> dict[str, Any]:
        snapshot = await self._get_financial_snapshot()
        return await self.cashflow.analyze({
            "current_balance": snapshot["cash_balance"],
            "avg_daily_income": snapshot["monthly_revenue"] / 30,
            "avg_daily_expenses": snapshot["monthly_expenses"] / 30,
            "last_30_net": snapshot["monthly_revenue"] - snapshot["monthly_expenses"],
        })

    async def get_health_score(self) -> dict[str, Any]:
        return {
            "overall": 75,
            "cash_flow": 80,
            "debt": 90,
            "savings": 60,
            "growth": 70,
            "collection": 65,
            "expenses": 75,
        }

    async def get_invoices(self) -> list[dict]:
        result = await self.db.execute(select(Invoice).order_by(Invoice.due_date.desc()).limit(50))
        invoices = result.scalars().all()
        return [
            {
                "id": str(inv.id),
                "invoice_number": inv.invoice_number,
                "client_name": inv.client_name,
                "amount": float(inv.amount),
                "status": inv.status.value,
                "issue_date": inv.issue_date.isoformat(),
                "due_date": inv.due_date.isoformat(),
                "days_overdue": inv.days_overdue,
            }
            for inv in invoices
        ]

    async def get_expense_analysis(self) -> dict[str, Any]:
        return await self.expense.analyze({
            "expenses_by_category": {},
            "previous_month": {},
            "subscriptions": [],
            "largest_expenses": [],
            "benchmarks": {},
        })

    async def get_risk_assessment(self) -> dict[str, Any]:
        return await self.risk.analyze({
            "recent_transactions": [],
            "recurring_payments": [],
            "category_averages": {},
            "vendor_history": [],
        })

    async def simulate_scenario(self, scenario: str, params: dict) -> dict[str, Any]:
        snapshot = await self._get_financial_snapshot()
        return await self.forecast.analyze({
            "scenario": scenario,
            "scenario_params": params,
            "monthly_revenue": snapshot["monthly_revenue"],
            "monthly_expenses": snapshot["monthly_expenses"],
            "cash_balance": snapshot["cash_balance"],
        })

    async def ask_question(self, question: str) -> dict[str, Any]:
        snapshot = await self._get_financial_snapshot()
        snapshot["question"] = question
        result = await self.cfo.analyze(snapshot)
        return {"answer": result.get("morning_briefing", result.get("summary", "")), "data": result}

    async def get_morning_briefing(self) -> dict[str, Any]:
        snapshot = await self._get_financial_snapshot()
        return await self.cfo.analyze(snapshot)

    async def get_recommendations(self) -> list[dict]:
        snapshot = await self._get_financial_snapshot()
        cfo_result = await self.cfo.analyze(snapshot)
        return cfo_result.get("recommendations", [])
