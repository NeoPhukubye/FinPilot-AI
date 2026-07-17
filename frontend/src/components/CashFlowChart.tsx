import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const data = [
  { date: 'Week 1', actual: 284500, predicted: 284500 },
  { date: 'Week 2', actual: null, predicted: 291000 },
  { date: 'Week 3', actual: null, predicted: 278000 },
  { date: 'Week 4', actual: null, predicted: 295000 },
  { date: 'Month 2', actual: null, predicted: 312000 },
  { date: 'Month 3', actual: null, predicted: 335000 },
]

export default function CashFlowChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value: number) => [`R${value.toLocaleString()}`, '']} />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#22c55e"
            fill="url(#cashGradient)"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Line type="monotone" dataKey="actual" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
