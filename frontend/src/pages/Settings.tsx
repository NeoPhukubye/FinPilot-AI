import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAIConfig, saveAIConfig, type AIConfig } from '../services/ai'

export default function Settings() {
  const [config, setConfig] = useState<AIConfig>(getAIConfig())
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    setConfig(getAIConfig())
  }, [])

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    saveAIConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Settings</h2>
        <p className="text-gray-500">Connect FinPilot to an AI provider. Your key is stored locally in your browser only.</p>
      </div>

      <form onSubmit={handleSave} className="card space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={config.apiKey}
              onChange={e => setConfig(c => ({ ...c, apiKey: e.target.value }))}
              placeholder="Enter your API key"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-20"
            />
            <button type="button" onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700">
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Stored in localStorage. Never sent anywhere except the AI provider.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Base URL</label>
          <input
            type="url"
            value={config.baseUrl}
            onChange={e => setConfig(c => ({ ...c, baseUrl: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <input
            type="text"
            value={config.model}
            onChange={e => setConfig(c => ({ ...c, model: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            Save Settings
          </button>
          {saved && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-600 font-medium">
              Saved!
            </motion.span>
          )}
        </div>
      </form>

      <div className="card bg-gray-50 border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Supported Providers</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-gray-700">Fireworks AI (default)</p>
            <p className="text-gray-500">URL: https://api.fireworks.ai/inference/v1</p>
            <p className="text-gray-500">Model: accounts/fireworks/models/llama-v3p1-70b-instruct</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">OpenAI</p>
            <p className="text-gray-500">URL: https://api.openai.com/v1</p>
            <p className="text-gray-500">Model: gpt-4o-mini</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Groq</p>
            <p className="text-gray-500">URL: https://api.groq.com/openai/v1</p>
            <p className="text-gray-500">Model: llama-3.1-70b-versatile</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Together AI</p>
            <p className="text-gray-500">URL: https://api.together.xyz/v1</p>
            <p className="text-gray-500">Model: meta-llama/Llama-3.1-70B-Instruct-Turbo</p>
          </div>
        </div>
      </div>
    </div>
  )
}
