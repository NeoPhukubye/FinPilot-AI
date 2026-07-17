# FinPilot AI
## AI Financial Copilot for Small Businesses

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
- **Expense Monitor** — Unusual spending, duplicate payments, forgotten subscriptions
- **Financial Health Score** — Composite score out of 100 across 6 dimensions
- **Morning Briefing** — Daily AI-generated priority list
- **Natural Language Finance** — Ask questions in plain English
- **Forecast Simulator** — "What if I hire 2 employees?" predictions

### Tech Stack
**Frontend:** React, TypeScript, Tailwind CSS, Recharts, Framer Motion
**Backend:** FastAPI, Python, PostgreSQL, Redis
**AI:** OpenAI-compatible LLM (Fireworks AI), Multi-agent architecture

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
LLM_API_KEY=your-api-key
LLM_BASE_URL=https://api.fireworks.ai/inference/v1
LLM_MODEL=accounts/fireworks/models/llama-v3p1-70b-instruct
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
