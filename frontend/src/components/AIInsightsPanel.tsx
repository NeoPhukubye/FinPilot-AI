import { motion } from 'framer-motion'

const insights = [
  { severity: 'high' as const, message: 'Cash reserve below recommended level. You have 42 days of runway.', action: 'Review expenses' },
  { severity: 'high' as const, message: 'Invoice #204 is 14 days overdue (R18,500). Client A typically pays late.', action: 'Send reminder' },
  { severity: 'medium' as const, message: 'Marketing spend increased 34% while revenue stayed flat.', action: 'Review ROI' },
  { severity: 'low' as const, message: 'Payroll in 4 days: R45,200. Cash position sufficient.', action: null },
  { severity: 'medium' as const, message: 'Duplicate payment detected: Adobe Creative Cloud billed twice this month.', action: 'Request refund' },
]

const severityStyles = {
  high: 'border-l-red-500 bg-red-50',
  medium: 'border-l-yellow-500 bg-yellow-50',
  low: 'border-l-blue-500 bg-blue-50',
}

const severityDots = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
}

export default function AIInsightsPanel() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">AI Insights</h3>
        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
          {insights.filter(i => i.severity === 'high').length} urgent
        </span>
      </div>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`border-l-4 rounded-r-lg p-3 ${severityStyles[insight.severity]}`}
          >
            <div className="flex items-start gap-2">
              <div className={`w-2 h-2 rounded-full mt-1.5 ${severityDots[insight.severity]}`} />
              <div className="flex-1">
                <p className="text-sm text-gray-800">{insight.message}</p>
                {insight.action && (
                  <button className="text-xs text-primary-600 font-medium mt-1 hover:text-primary-700">
                    {insight.action} &rarr;
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
