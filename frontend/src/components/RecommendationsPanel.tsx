import { motion } from 'framer-motion'

const recommendations = [
  { priority: 1, action: 'Follow up Invoice #204', reason: '14 days overdue, R18,500 at risk', impact: 'Recover R18,500' },
  { priority: 2, action: 'Delay equipment purchase', reason: 'Cash reserve is below target', impact: 'Save R35,000 this month' },
  { priority: 3, action: 'Reduce paid advertising', reason: 'ROI declined 40% in last 2 weeks', impact: 'Save R8,000/month' },
  { priority: 4, action: 'Invoice Client B for completed project', reason: 'Project delivered 5 days ago', impact: 'Add R42,000 receivable' },
  { priority: 5, action: 'Cancel unused Figma licenses', reason: '3 seats unused for 60+ days', impact: 'Save R2,400/month' },
]

export default function RecommendationsPanel() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">Today's Priorities</h3>
        <span className="text-xs text-gray-400">Updated just now</span>
      </div>
      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {rec.priority}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{rec.action}</p>
              <p className="text-xs text-gray-500 mt-0.5">{rec.reason}</p>
            </div>
            <span className="text-xs text-green-600 font-medium whitespace-nowrap">{rec.impact}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
