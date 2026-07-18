import { useState, useEffect } from 'react'
import { fetchPayments, fetchPaymentSummary, collectPayment, createPaymentLink } from '../services/api'

interface Payment {
  id: string
  payerId: string
  amount: number
  currency: string
  status: string
  description: string
  dueDate?: string
  scheduledDate?: string
}

interface PaymentSummary {
  total_collected_cents: number
  total_overdue_cents: number
  total_scheduled_cents: number
  overdue_count: number
  upcoming_count: number
  live_mode: boolean
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [summary, setSummary] = useState<PaymentSummary | null>(null)
  const [liveMode, setLiveMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [paymentsRes, summaryRes] = await Promise.all([fetchPayments(), fetchPaymentSummary()])
      setPayments(paymentsRes.payments)
      setLiveMode(paymentsRes.live_mode)
      setSummary(summaryRes)
    } catch {
      // fallback
    }
    setLoading(false)
  }

  async function handleCollect(payment: Payment) {
    setActionLoading(payment.id)
    try {
      await collectPayment(payment.payerId, payment.amount, payment.description)
      setSuccessMsg(`Payment collection scheduled for ${payment.description}`)
      await loadData()
    } catch {
      setSuccessMsg('Failed to schedule collection')
    }
    setActionLoading(null)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  async function handleSendLink(payment: Payment) {
    setActionLoading(payment.id + '-link')
    try {
      const result = await createPaymentLink(payment.payerId, payment.amount, payment.description)
      setSuccessMsg(`Payment link created: ${result.url}`)
      await loadData()
    } catch {
      setSuccessMsg('Failed to create payment link')
    }
    setActionLoading(null)
    setTimeout(() => setSuccessMsg(''), 6000)
  }

  function formatAmount(cents: number) {
    return `R${(cents / 100).toLocaleString()}`
  }

  function statusBadge(status: string) {
    const styles: Record<string, string> = {
      overdue: 'bg-red-100 text-red-700',
      scheduled: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
    }
    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading payments...</div>
  }

  return (
    <div className="space-y-6">
      {!liveMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          Running in demo mode — connect your Pinch Payments API key for live payment collection.
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800">
          {successMsg}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <p className="text-sm text-gray-500">Collected</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatAmount(summary.total_collected_cents)}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Overdue</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatAmount(summary.total_overdue_cents)}</p>
            <p className="text-xs text-gray-500 mt-1">{summary.overdue_count} payment{summary.overdue_count !== 1 ? 's' : ''} outstanding</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Scheduled</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{formatAmount(summary.total_scheduled_cents)}</p>
            <p className="text-xs text-gray-500 mt-1">{summary.upcoming_count} upcoming</p>
          </div>
        </div>
      )}

      {/* Payments List */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Payments</h3>
        <div className="divide-y divide-gray-100">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  payment.status === 'completed' ? 'bg-green-100' : payment.status === 'overdue' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <svg className={`w-5 h-5 ${
                    payment.status === 'completed' ? 'text-green-600' : payment.status === 'overdue' ? 'text-red-600' : 'text-blue-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d={payment.status === 'completed' ? 'M5 13l4 4L19 7' : payment.status === 'overdue' ? 'M12 8v4m0 4h.01' : 'M12 8v4l3 3'} />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{payment.description}</p>
                  <p className="text-xs text-gray-500">
                    {payment.dueDate && `Due: ${new Date(payment.dueDate).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(payment.status)}`}>
                  {payment.status}
                </span>
                <span className="text-sm font-semibold text-gray-900">{formatAmount(payment.amount)}</span>
                {payment.status === 'overdue' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCollect(payment)}
                      disabled={actionLoading === payment.id}
                      className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 disabled:opacity-50"
                    >
                      {actionLoading === payment.id ? 'Collecting...' : 'Collect Now'}
                    </button>
                    <button
                      onClick={() => handleSendLink(payment)}
                      disabled={actionLoading === payment.id + '-link'}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 disabled:opacity-50"
                    >
                      {actionLoading === payment.id + '-link' ? 'Creating...' : 'Send Link'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Powered by Pinch */}
      <div className="text-center text-xs text-gray-400">
        Payments powered by Pinch Payments — Australian payment infrastructure
      </div>
    </div>
  )
}
