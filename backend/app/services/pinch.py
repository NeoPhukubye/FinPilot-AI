"""Pinch Payments integration with mock fallback for development."""
import uuid
from datetime import datetime, timedelta
from typing import Any

import httpx

from app.core.config import get_settings

settings = get_settings()


MOCK_PAYERS = [
    {"id": "pyr_001", "firstName": "Client", "lastName": "A", "emailAddress": "clienta@example.com", "companyName": "Client A Pty Ltd"},
    {"id": "pyr_002", "firstName": "Client", "lastName": "B", "emailAddress": "clientb@example.com", "companyName": "Client B Holdings"},
    {"id": "pyr_003", "firstName": "Client", "lastName": "C", "emailAddress": "clientc@example.com", "companyName": "Client C Services"},
]

MOCK_PAYMENTS = [
    {"id": "pmt_001", "payerId": "pyr_001", "amount": 18500_00, "currency": "AUD", "status": "overdue", "description": "Invoice #204", "dueDate": (datetime.now() - timedelta(days=14)).isoformat()},
    {"id": "pmt_002", "payerId": "pyr_002", "amount": 42000_00, "currency": "AUD", "status": "scheduled", "description": "Invoice #210", "dueDate": (datetime.now() + timedelta(days=3)).isoformat()},
    {"id": "pmt_003", "payerId": "pyr_003", "amount": 7500_00, "currency": "AUD", "status": "completed", "description": "Invoice #198", "dueDate": (datetime.now() - timedelta(days=30)).isoformat()},
    {"id": "pmt_004", "payerId": "pyr_001", "amount": 12000_00, "currency": "AUD", "status": "completed", "description": "Invoice #195", "dueDate": (datetime.now() - timedelta(days=45)).isoformat()},
]


def _is_live() -> bool:
    return bool(settings.pinch_api_key and settings.pinch_secret_key)


async def _get_token() -> str:
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            f"{settings.pinch_base_url}/auth/token",
            json={"client_id": settings.pinch_api_key, "secret_key": settings.pinch_secret_key},
        )
        response.raise_for_status()
        return response.json()["access_token"]


async def _pinch_request(method: str, path: str, json: dict | None = None) -> dict:
    token = await _get_token()
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.request(
            method,
            f"{settings.pinch_base_url}{path}",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json=json,
        )
        response.raise_for_status()
        return response.json()


async def list_payers() -> list[dict[str, Any]]:
    if not _is_live():
        return MOCK_PAYERS
    data = await _pinch_request("GET", "/payers")
    return data.get("data", [])


async def list_payments() -> list[dict[str, Any]]:
    if not _is_live():
        return MOCK_PAYMENTS
    scheduled = await _pinch_request("GET", "/payments/scheduled")
    processed = await _pinch_request("GET", "/payments/processed")
    return scheduled.get("data", []) + processed.get("data", [])


async def collect_payment(payer_id: str, amount: int, description: str) -> dict[str, Any]:
    """Schedule a payment collection via Pinch (amount in cents)."""
    if not _is_live():
        return {
            "id": f"pmt_{uuid.uuid4().hex[:8]}",
            "payerId": payer_id,
            "amount": amount,
            "currency": "AUD",
            "status": "scheduled",
            "description": description,
            "scheduledDate": datetime.now().isoformat(),
            "mock": True,
        }
    return await _pinch_request("POST", "/payments", json={
        "payerId": payer_id,
        "amount": amount,
        "description": description,
    })


async def create_payment_link(payer_id: str, amount: int, description: str) -> dict[str, Any]:
    """Create a payment link the customer can use to pay."""
    if not _is_live():
        link_id = uuid.uuid4().hex[:8]
        return {
            "id": f"pl_{link_id}",
            "payerId": payer_id,
            "amount": amount,
            "currency": "AUD",
            "description": description,
            "url": f"https://pay.getpinch.com.au/link/mock-{link_id}",
            "status": "active",
            "mock": True,
        }
    return await _pinch_request("POST", "/payment-links", json={
        "payerId": payer_id,
        "amount": amount,
        "description": description,
    })


async def create_payment_plan(payer_id: str, total_amount: int, instalments: int, description: str) -> dict[str, Any]:
    """Create a payment plan splitting the total into equal instalments."""
    if not _is_live():
        plan_id = uuid.uuid4().hex[:8]
        instalment_amount = total_amount // instalments
        return {
            "id": f"plan_{plan_id}",
            "payerId": payer_id,
            "totalAmount": total_amount,
            "instalments": instalments,
            "instalmentAmount": instalment_amount,
            "currency": "AUD",
            "description": description,
            "status": "active",
            "startDate": datetime.now().isoformat(),
            "mock": True,
        }
    return await _pinch_request("POST", "/plans", json={
        "payerId": payer_id,
        "amount": total_amount,
        "instalments": instalments,
        "description": description,
    })


async def get_payment_summary() -> dict[str, Any]:
    """Get a summary of payment status for AI analysis."""
    payments = await list_payments()
    total_collected = sum(p["amount"] for p in payments if p["status"] == "completed")
    total_overdue = sum(p["amount"] for p in payments if p["status"] == "overdue")
    total_scheduled = sum(p["amount"] for p in payments if p["status"] == "scheduled")

    return {
        "total_collected_cents": total_collected,
        "total_overdue_cents": total_overdue,
        "total_scheduled_cents": total_scheduled,
        "overdue_count": sum(1 for p in payments if p["status"] == "overdue"),
        "upcoming_count": sum(1 for p in payments if p["status"] == "scheduled"),
        "live_mode": _is_live(),
    }
