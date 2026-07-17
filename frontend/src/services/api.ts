import axios from 'axios'
import type { DashboardData, CashFlowForecast, HealthScore, ScenarioResult } from '../types'

const api = axios.create({
  baseURL: '/api/v1',
})

export async function fetchDashboard(): Promise<DashboardData> {
  const { data } = await api.get('/dashboard')
  return data
}

export async function fetchCashFlowForecast(): Promise<CashFlowForecast> {
  const { data } = await api.get('/cash-flow/forecast')
  return data
}

export async function fetchHealthScore(): Promise<HealthScore> {
  const { data } = await api.get('/health-score')
  return data
}

export async function simulateScenario(scenario: string, params: Record<string, unknown> = {}): Promise<ScenarioResult> {
  const { data } = await api.post('/forecast/simulate', { scenario, params })
  return data
}

export async function askAI(question: string): Promise<{ answer: string; data: unknown }> {
  const { data } = await api.post('/ai/ask', { question })
  return data
}

export async function fetchMorningBriefing() {
  const { data } = await api.get('/ai/morning-briefing')
  return data
}

export async function fetchRecommendations() {
  const { data } = await api.get('/recommendations')
  return data
}
