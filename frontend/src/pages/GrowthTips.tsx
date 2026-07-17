import { useState } from 'react'
import { motion } from 'framer-motion'

interface Tip {
  id: string
  category: 'savings' | 'revenue' | 'investing' | 'efficiency' | 'risk'
  title: string
  description: string
  impact: string
  actionable: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const tips: Tip[] = [
  {
    id: '1', category: 'savings', title: 'Automate your savings',
    description: 'Set up automatic transfers of 10-20% of revenue into a separate high-interest business savings account before paying any expenses.',
    impact: 'Build 3-6 months emergency fund',
    actionable: 'Open a 32-day notice deposit and set auto-transfer on payday.',
    difficulty: 'easy',
  },
  {
    id: '2', category: 'revenue', title: 'Invoice immediately on delivery',
    description: 'Send invoices within 24 hours of project delivery. Businesses that invoice same-day get paid 2x faster on average.',
    impact: 'Reduce payment time by 15 days',
    actionable: 'Set up automated invoicing triggered by project status change.',
    difficulty: 'easy',
  },
  {
    id: '3', category: 'efficiency', title: 'Audit subscriptions quarterly',
    description: 'Review all recurring payments every 3 months. Most businesses have 2-5 unused subscriptions costing R2,000-R10,000/month.',
    impact: 'Save R5,000-R15,000/month',
    actionable: 'List all recurring charges, cancel what you haven\'t used in 30+ days.',
    difficulty: 'easy',
  },
  {
    id: '4', category: 'revenue', title: 'Offer early payment discounts',
    description: 'Give clients 2-3% discount for paying within 7 days. You lose a small margin but gain cash flow predictability.',
    impact: 'Improve cash flow timing by 20+ days',
    actionable: 'Add "2% discount if paid within 7 days" to your next 5 invoices.',
    difficulty: 'medium',
  },
  {
    id: '5', category: 'investing', title: 'Put idle cash in money market',
    description: 'Cash sitting in your business account earns nothing. A money market fund earns 8-10% annually with daily access.',
    impact: 'Earn R2,000-R5,000/month on R500k balance',
    actionable: 'Open a money market account and sweep excess cash weekly.',
    difficulty: 'medium',
  },
  {
    id: '6', category: 'risk', title: 'Diversify your client base',
    description: 'If one client represents more than 30% of revenue, you\'re at risk. Losing them could be catastrophic.',
    impact: 'Reduce business risk significantly',
    actionable: 'Identify your top client concentration and target 2 new clients this quarter.',
    difficulty: 'hard',
  },
  {
    id: '7', category: 'efficiency', title: 'Negotiate annual payment discounts',
    description: 'Most SaaS tools offer 20-40% off for annual billing. If you\'re confident you\'ll use it, pay upfront.',
    impact: 'Save 20-40% on software costs',
    actionable: 'Switch your top 3 tools to annual billing this month.',
    difficulty: 'easy',
  },
  {
    id: '8', category: 'revenue', title: 'Implement tiered pricing',
    description: 'Offer basic, standard, and premium packages. Most clients choose the middle option, increasing average deal size by 30%.',
    impact: 'Increase average revenue per client by 30%',
    actionable: 'Restructure your top service into 3 tiers with clear value progression.',
    difficulty: 'medium',
  },
  {
    id: '9', category: 'savings', title: 'Separate tax money immediately',
    description: 'Move 25-30% of every payment received to a tax savings account. Never touch it. Tax season becomes stress-free.',
    impact: 'Avoid tax debt and penalties',
    actionable: 'Create a "Tax Reserve" account and auto-transfer 28% of income.',
    difficulty: 'easy',
  },
  {
    id: '10', category: 'investing', title: 'Reinvest in automation',
    description: 'Every R1,000 spent on automating repetitive tasks saves R5,000+ in labour costs over 12 months.',
    impact: '5x return on automation investment',
    actionable: 'Identify your 3 most time-consuming manual processes and find tools to automate them.',
    difficulty: 'medium',
  },
  {
    id: '11', category: 'risk', title: 'Build a cash buffer of 3 months expenses',
    description: 'Businesses with 3+ months of expenses saved survive downturns. Without it, one bad month can be fatal.',
    impact: 'Survive 3 months with zero income',
    actionable: 'Calculate monthly expenses x 3, set a savings target, contribute monthly.',
    difficulty: 'hard',
  },
  {
    id: '12', category: 'revenue', title: 'Follow up overdue invoices on day 1',
    description: 'Don\'t wait 30 days to chase. A friendly reminder on day 1 past due recovers 60% more than waiting.',
    impact: 'Recover payments 2x faster',
    actionable: 'Set automated reminders for the day after an invoice is due.',
    difficulty: 'easy',
  },
]

const categoryLabels: Record<string, { label: string; color: string; bg: string }> = {
  savings: { label: 'Savings', color: 'text-blue-700', bg: 'bg-blue-100' },
  revenue: { label: 'Revenue', color: 'text-green-700', bg: 'bg-green-100' },
  investing: { label: 'Investing', color: 'text-purple-700', bg: 'bg-purple-100' },
  efficiency: { label: 'Efficiency', color: 'text-orange-700', bg: 'bg-orange-100' },
  risk: { label: 'Risk Mgmt', color: 'text-red-700', bg: 'bg-red-100' },
}

const difficultyColors = {
  easy: 'text-green-600 bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  hard: 'text-red-600 bg-red-50',
}

export default function GrowthTips() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expandedTip, setExpandedTip] = useState<string | null>(null)

  const filtered = activeCategory === 'all' ? tips : tips.filter(t => t.category === activeCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-primary-600 to-accent-600 text-white border-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Grow Your Money</h2>
            <p className="text-white/80 text-sm">AI-powered tips tailored for small businesses and banks. Take action today.</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-primary-600">R23,400</p>
          <p className="text-xs text-gray-500 mt-1">Potential monthly savings</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">+30%</p>
          <p className="text-xs text-gray-500 mt-1">Revenue growth possible</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-600">R5,000</p>
          <p className="text-xs text-gray-500 mt-1">Passive income potential</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-orange-600">5</p>
          <p className="text-xs text-gray-500 mt-1">Quick wins available</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          All Tips
        </button>
        {Object.entries(categoryLabels).map(([key, { label }]) => (
          <button key={key} onClick={() => setActiveCategory(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((tip, i) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-hover cursor-pointer"
            onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryLabels[tip.category].bg} ${categoryLabels[tip.category].color}`}>
                {categoryLabels[tip.category].label}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColors[tip.difficulty]}`}>
                {tip.difficulty}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
            <div className="flex items-center gap-2 text-xs">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-green-700 font-medium">{tip.impact}</span>
            </div>

            {expandedTip === tip.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <p className="text-sm font-medium text-gray-700 mb-1">What to do:</p>
                <p className="text-sm text-gray-600 bg-primary-50 p-3 rounded-lg">{tip.actionable}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
