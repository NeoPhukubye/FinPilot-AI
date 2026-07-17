export interface DashboardData {
  cash_balance: number
  revenue_this_month: number
  expenses_this_month: number
  profit_this_month: number
  health_score: number
  upcoming_bills: Bill[]
  upcoming_payroll: { amount: number; days_until: number }
  invoice_status: { outstanding: number; overdue: number }
  ai_insights: AIInsight[]
  forecast: Record<string, unknown>
}

export interface Bill {
  vendor: string
  amount: number
  due_date: string
}

export interface AIInsight {
  severity: 'high' | 'medium' | 'low'
  message: string
  type?: string
  action?: string
}

export interface CashFlowForecast {
  forecast_7_days: { balance: number; confidence: number }
  forecast_30_days: { balance: number; confidence: number }
  forecast_90_days: { balance: number; confidence: number }
  risk_of_negative: { probability: number; estimated_date: string | null }
  recommendation: string
}

export interface HealthScore {
  overall: number
  cash_flow: number
  debt: number
  savings: number
  growth: number
  collection: number
  expenses: number
}

export interface ScenarioResult {
  scenario: string
  impact_3_months: FinancialImpact
  impact_6_months: FinancialImpact
  impact_12_months: FinancialImpact
  risks: string[]
  benefits: string[]
  recommendation: string
  explanation: string
}

export interface FinancialImpact {
  revenue: number
  expenses: number
  cash_position: number
  profit: number
}
