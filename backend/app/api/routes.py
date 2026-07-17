from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.financial_service import FinancialService
from app.schemas import (
    DashboardResponse,
    CashFlowForecastResponse,
    ScenarioRequest,
    NaturalLanguageQuery,
    HealthScoreResponse,
)

router = APIRouter()


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    service = FinancialService(db)
    return await service.get_dashboard()


@router.get("/cash-flow/forecast", response_model=CashFlowForecastResponse)
async def get_cash_flow_forecast(db: AsyncSession = Depends(get_db)):
    service = FinancialService(db)
    return await service.get_cash_flow_forecast()


@router.get("/health-score", response_model=HealthScoreResponse)
async def get_health_score(db: AsyncSession = Depends(get_db)):
    service = FinancialService(db)
    return await service.get_health_score()


@router.get("/invoices")
async def get_invoices(db: AsyncSession = Depends(get_db)):
    service = FinancialService(db)
    return await service.get_invoices()


@router.get("/expenses/analysis")
async def get_expense_analysis(db: AsyncSession = Depends(get_db)):
    service = FinancialService(db)
    return await service.get_expense_analysis()


@router.get("/risk/assessment")
async def get_risk_assessment(db: AsyncSession = Depends(get_db)):
    service = FinancialService(db)
    return await service.get_risk_assessment()


@router.post("/forecast/simulate")
async def simulate_scenario(request: ScenarioRequest, db: AsyncSession = Depends(get_db)):
    service = FinancialService(db)
    return await service.simulate_scenario(request.scenario, request.params)


@router.post("/ai/ask")
async def ask_ai(query: NaturalLanguageQuery, db: AsyncSession = Depends(get_db)):
    service = FinancialService(db)
    return await service.ask_question(query.question)


@router.get("/ai/morning-briefing")
async def morning_briefing(db: AsyncSession = Depends(get_db)):
    service = FinancialService(db)
    return await service.get_morning_briefing()


@router.get("/recommendations")
async def get_recommendations(db: AsyncSession = Depends(get_db)):
    service = FinancialService(db)
    return await service.get_recommendations()
