# FinPilot AI
## AI Financial Copilot for Small Businesses

> Built by **Neo Phukubye** (Software Engineer) for the [Pinch Hackathon](https://www.thefoundersunion.com) — a national build sprint by **The Founders Union** (Australia) in partnership with **Pinch Payments**, competing for $50,000. July–August 2026.

FinPilot AI is an intelligent financial assistant that goes beyond displaying numbers — it explains what your financial data means and tells you what to do next.

### The Problem
Small businesses don't need another dashboard. They need someone who says:
- "You're going to run out of cash in 18 days"
- "Invoice Client A today — they're 14 days overdue"
- "Marketing spend is up 34% with no revenue increase"

### AI Agents Architecture
| Agent | Purpose |
|-------|---------|
| CFO Agent | Strategic financial advice, morning briefings |
| Cash Flow Agent | 7/30/90 day cash predictions with confidence scores |
| Risk Agent | Fraud detection, duplicate payments, anomalies |
| Expense Agent | Spending optimization, subscription audit |
| Forecast Agent | "What if" scenario simulation |

### Features
- **Cash Flow Prediction** — AI predicts cash position 7, 30, 90 days out with confidence
- **AI CFO** — Natural language explanations, not just numbers
- **Invoice Intelligence** — Who to invoice, overdue alerts, late payer prediction
- **Automated Payment Collection** — Collect overdue payments via Pinch Payments with one click
- **Payment Links** — Send payment links to clients for instant collection
- **Smart Payment Plans** — AI recommends splitting large debts into manageable instalments
- **Expense Monitor** — Unusual spending, duplicate payments, forgotten subscriptions
- **Financial Health Score** — Composite score out of 100 across 6 dimensions
- **Morning Briefing** — Daily AI-generated priority list
- **Natural Language Finance** — Ask questions in plain English
- **Forecast Simulator** — "What if I hire 2 employees?" predictions

### Pinch Payments Integration
FinPilot uses [Pinch Payments](https://getpinch.com.au) infrastructure to go beyond advice — it takes action:

| Capability | How It Works |
|-----------|--------------|
| **Collect Now** | AI flags overdue invoices, one-click triggers Pinch direct debit collection |
| **Payment Links** | Generate shareable payment links for clients to pay instantly |
| **Payment Plans** | Split large outstanding amounts into automated instalment plans |
| **Real-time Data** | Pull live payment data from Pinch to improve AI cash flow predictions |

The integration runs in **demo mode** by default with realistic mock data. Connect your Pinch API credentials to enable live payment collection.

### Tech Stack
**Frontend:** React, TypeScript, Tailwind CSS, Recharts, Framer Motion
**Backend:** FastAPI, Python, PostgreSQL, Redis
**AI:** Google Gemini, Multi-agent architecture
**Payments:** Pinch Payments API (direct debit, cards, payment links)

### Quick Start

```bash
# Clone
git clone https://github.com/your-username/finpilot-ai.git
cd finpilot-ai

# Set your LLM API key
cp .env.example .env
# Edit .env and add your LLM_API_KEY

# Run with Docker
docker-compose up -d

# Seed demo data
docker-compose exec backend python seed.py

# Open http://localhost:5173
```

### Manual Setup

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Environment Variables
```
DATABASE_URL=postgresql+asyncpg://finpilot:finpilot@localhost:5432/finpilot
REDIS_URL=redis://localhost:6379/0
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash
PINCH_API_KEY=your-pinch-api-key
PINCH_SECRET_KEY=your-pinch-secret-key
PINCH_SANDBOX=true
```

### API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/dashboard` | Full dashboard data |
| GET | `/api/v1/cash-flow/forecast` | AI cash flow predictions |
| GET | `/api/v1/health-score` | Financial health score |
| GET | `/api/v1/invoices` | Invoice list + intelligence |
| GET | `/api/v1/expenses/analysis` | AI expense analysis |
| GET | `/api/v1/risk/assessment` | Risk + fraud detection |
| POST | `/api/v1/forecast/simulate` | "What if" scenarios |
| POST | `/api/v1/ai/ask` | Natural language questions |
| GET | `/api/v1/ai/morning-briefing` | Daily AI briefing |
| GET | `/api/v1/recommendations` | Prioritized action items |
| GET | `/api/v1/payments` | List all payments (Pinch) |
| GET | `/api/v1/payments/summary` | Payment collection summary |
| GET | `/api/v1/payers` | List payers/clients |
| POST | `/api/v1/payments/collect` | Trigger payment collection |
| POST | `/api/v1/payments/link` | Create a payment link |
| POST | `/api/v1/payments/plan` | Create a payment plan |

### Architecture
```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│       React + Tailwind + Recharts           │
└────────────────────┬────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────┐
│                FastAPI Backend               │
├─────────────────────────────────────────────┤
│  ┌─────────┐ ┌──────────┐ ┌─────────────┐  │
│  │CFO Agent│ │CashFlow  │ │Risk Agent   │  │
│  │         │ │Agent     │ │             │  │
│  └─────────┘ └──────────┘ └─────────────┘  │
│  ┌─────────────┐ ┌───────────────────────┐  │
│  │Expense Agent│ │Forecast Agent         │  │
│  └─────────────┘ └───────────────────────┘  │
├─────────────────────────────────────────────┤
│  PostgreSQL  │  Redis  │  LLM API           │
└─────────────────────────────────────────────┘
```

### License
MIT
