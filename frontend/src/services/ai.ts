const STORAGE_KEY = 'finpilot_ai_config'

export interface AIConfig {
  apiKey: string
  baseUrl: string
  model: string
}

const DEFAULT_CONFIG: AIConfig = {
  apiKey: '',
  baseUrl: 'https://api.fireworks.ai/inference/v1',
  model: 'accounts/fireworks/models/llama-v3p1-70b-instruct',
}

export function getAIConfig(): AIConfig {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return { ...DEFAULT_CONFIG, ...JSON.parse(stored) }
  }
  return DEFAULT_CONFIG
}

export function saveAIConfig(config: AIConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export function isAIConfigured(): boolean {
  return getAIConfig().apiKey.length > 0
}

const SYSTEM_PROMPT = `You are FinPilot AI, an expert financial copilot for small businesses and banks in South Africa. 

You help users:
- Understand their cash flow and financial health
- Predict future cash positions
- Identify risky spending patterns
- Find ways to grow their money
- Make informed decisions about hiring, investing, and spending

Be concise, specific with numbers (use Rands with R prefix), and always end with an actionable recommendation.
If asked about specific data you don't have, give general best-practice advice relevant to small South African businesses.
Keep responses under 200 words unless asked for detail.`

export async function callAI(userMessage: string): Promise<string> {
  const config = getAIConfig()

  if (!config.apiKey) {
    throw new Error('API key not configured. Go to Settings to add your API key.')
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: 512,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    if (response.status === 401) {
      throw new Error('Invalid API key. Check your key in Settings.')
    }
    throw new Error(`AI request failed: ${err}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}
