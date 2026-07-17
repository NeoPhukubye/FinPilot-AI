const API_BASE = import.meta.env.PROD
  ? 'https://finpilot-api.onrender.com/api/v1'
  : '/api/v1'

export async function callAI(message: string): Promise<string> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    throw new Error('AI service is temporarily unavailable. Please try again.')
  }

  const data = await response.json()
  return data.reply
}

export function isAIConfigured(): boolean {
  return true
}
