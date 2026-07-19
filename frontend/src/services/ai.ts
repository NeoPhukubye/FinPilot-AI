const API_BASE = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? 'https://finpilot-ai-1-s60w.onrender.com/api/v1' : '/api/v1')

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

  if (data.reply && data.reply.includes('AI service is not configured')) {
    throw new Error('not_configured')
  }

  return data.reply
}

export function isAIConfigured(): boolean {
  return true
}
