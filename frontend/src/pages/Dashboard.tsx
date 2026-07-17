import { motion } from 'framer-motion'
import MetricCard from '../components/MetricCard'
import HealthScoreRing from '../components/HealthScoreRing'
import CashFlowChart from '../components/CashFlowChart'
import AIInsightsPanel from '../components/AIInsightsPanel'
import RecommendationsPanel from '../components/RecommendationsPanel'

const mockData = {
  cash_balance: 284500,
  revenue: 89200,
  expenses: 62800,
  profit: 26400,
  health_score: 78,
  days_cash: 42,
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Cash Balance"
          value={`R${mockData.cash_balance.toLocaleString()}`}
          trend={+5.2}
          icon="cash"
        />
        <MetricCard
          title="Revenue (MTD)"
          value={`R${mockData.revenue.toLocaleString()}`}
          trend={+12.4}
          icon="revenue"
        />
        <MetricCard
          title="Expenses (MTD)"
          value={`R${mockData.expenses.toLocaleString()}`}
          trend={-3.1}
          icon="expense"
        />
        <MetricCard
          title="Profit (MTD)"
          value={`R${mockData.profit.toLocaleString()}`}
          trend={+8.7}
          icon="profit"
        />
      </div>

      {/* Health Score + Cash Flow Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-4">Financial Health Score</h3>
          <HealthScoreRing score={mockData.health_score} />
          <div className="mt-4 space-y-2">
            <ScoreBar label="Cash Flow" value={80} />
            <ScoreBar label="Debt" value={90} />
            <ScoreBar label="Savings" value={60} />
            <ScoreBar label="Growth" value={70} />
            <ScoreBar label="Collections" value={65} />
            <ScoreBar label="Expenses" value={75} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card lg:col-span-2"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-4">Cash Flow Forecast</h3>
          <CashFlowChart />
        </motion.div>
      </div>

      {/* AI Insights + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AIInsightsPanel />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RecommendationsPanel />
        </motion.div>
      </div>
    </div>
  )
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-20">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 w-8">{value}</span>
    </div>
  )
}
