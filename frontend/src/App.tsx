import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Transactions from './pages/Transactions'
import GrowthTips from './pages/GrowthTips'
import Settings from './pages/Settings'
import AIChatPanel from './components/AIChatPanel'
import Sidebar from './components/Sidebar'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [chatOpen, setChatOpen] = useState(false)

  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    transactions: 'Money In & Out',
    growth: 'Grow Your Money',
    register: 'Register',
    settings: 'Settings',
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{titles[activeTab] || 'Dashboard'}</h1>
            <p className="text-sm text-gray-500">AI-powered financial insights</p>
          </div>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Ask FinPilot
          </button>
        </header>
        <div className="p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'transactions' && <Transactions />}
          {activeTab === 'growth' && <GrowthTips />}
          {activeTab === 'register' && <Register />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>
      {chatOpen && <AIChatPanel onClose={() => setChatOpen(false)} onOpenSettings={() => { setChatOpen(false); setActiveTab('settings') }} />}
    </div>
  )
}
