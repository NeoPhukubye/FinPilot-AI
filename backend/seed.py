"""Seed script to populate the database with demo data for hackathon presentation."""
import asyncio
import uuid
from datetime import date, timedelta, datetime
from decimal import Decimal
from random import choice, uniform, randint

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from app.core.database import Base
from app.models.financial import (
    Business, Transaction, Invoice, Expense,
    TransactionType, InvoiceStatus, FinancialHealthScore
)

DATABASE_URL = "postgresql+asyncpg://finpilot:finpilot@localhost:5432/finpilot"

CLIENTS = ["Acme Corp", "TechStart", "GreenLeaf Ventures", "Urban Design Co", "CloudNine Solutions", "Apex Trading"]
CATEGORIES_INCOME = ["Consulting", "Development", "Design", "Training", "Maintenance"]
CATEGORIES_EXPENSE = ["Marketing", "Salaries", "Software", "Office", "Travel", "Equipment", "Insurance", "Utilities"]
VENDORS = ["Google Ads", "AWS", "Figma", "Slack", "Adobe", "WeWork", "FNB", "Telkom", "Uber", "Engen"]


async def seed():
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with session_factory() as session:
        biz = Business(
            id=uuid.uuid4(),
            name="NeoTech Solutions",
            owner_name="Neo",
            industry="Technology Consulting",
            monthly_revenue_target=Decimal("100000"),
            cash_reserve_target=Decimal("200000"),
        )
        session.add(biz)

        today = date.today()
        # Generate 6 months of transactions
        for days_ago in range(180):
            tx_date = today - timedelta(days=days_ago)

            # Income (1-3 per day)
            for _ in range(randint(0, 3)):
                session.add(Transaction(
                    business_id=biz.id,
                    type=TransactionType.INCOME,
                    amount=Decimal(str(round(uniform(2000, 25000), 2))),
                    description=f"{choice(CATEGORIES_INCOME)} - {choice(CLIENTS)}",
                    category=choice(CATEGORIES_INCOME),
                    date=tx_date,
                    counterparty=choice(CLIENTS),
                    is_recurring=uniform(0, 1) > 0.7,
                ))

            # Expenses (2-5 per day)
            for _ in range(randint(1, 5)):
                session.add(Transaction(
                    business_id=biz.id,
                    type=TransactionType.EXPENSE,
                    amount=Decimal(str(round(uniform(200, 15000), 2))),
                    description=f"{choice(CATEGORIES_EXPENSE)} - {choice(VENDORS)}",
                    category=choice(CATEGORIES_EXPENSE),
                    date=tx_date,
                    counterparty=choice(VENDORS),
                    is_recurring=uniform(0, 1) > 0.6,
                ))

        # Invoices
        for i in range(20):
            days_back = randint(0, 60)
            issue = today - timedelta(days=days_back)
            due = issue + timedelta(days=30)
            status = choice([InvoiceStatus.PAID, InvoiceStatus.SENT, InvoiceStatus.OVERDUE, InvoiceStatus.PAID, InvoiceStatus.PAID])
            paid = due - timedelta(days=randint(0, 10)) if status == InvoiceStatus.PAID else None
            overdue_days = (today - due).days if status == InvoiceStatus.OVERDUE and today > due else 0

            session.add(Invoice(
                business_id=biz.id,
                invoice_number=f"INV-{2024}{i+1:03d}",
                client_name=choice(CLIENTS),
                client_email=f"accounts@{choice(CLIENTS).lower().replace(' ', '')}.co.za",
                amount=Decimal(str(round(uniform(5000, 85000), 2))),
                status=status,
                issue_date=issue,
                due_date=due,
                paid_date=paid,
                days_overdue=max(0, overdue_days),
            ))

        # Expenses table
        for i in range(50):
            session.add(Expense(
                business_id=biz.id,
                category=choice(CATEGORIES_EXPENSE),
                vendor=choice(VENDORS),
                amount=Decimal(str(round(uniform(200, 12000), 2))),
                date=today - timedelta(days=randint(0, 90)),
                is_subscription=uniform(0, 1) > 0.6,
                is_flagged=uniform(0, 1) > 0.9,
                flag_reason="Unusual amount" if uniform(0, 1) > 0.9 else None,
            ))

        # Health score
        session.add(FinancialHealthScore(
            business_id=biz.id,
            overall_score=78,
            cash_flow_score=80,
            debt_score=90,
            savings_score=60,
            growth_score=70,
            collection_score=65,
            expense_score=75,
        ))

        await session.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
