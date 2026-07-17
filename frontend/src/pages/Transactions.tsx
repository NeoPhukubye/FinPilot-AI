import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  date: string
  counterparty: string
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'income', amount: 42000, description: 'Web development project', category: 'Development', date: '2026-07-17', counterparty: 'Acme Corp' },
  { id: '2', type: 'expense', amount: 8500, description: 'Google Ads campaign', category: 'Marketing', date: '2026-07-16', counterparty: 'Google' },
  { id: '3', type: 'income', amount: 18500, description: 'Monthly retainer', category: 'Consulting', date: '2026-07-15', counterparty: 'TechStart' },
  { id: '4', type: 'expense', amount: 45200, description: 'Staff salaries', category: 'Salaries', date: '2026-07-15', counterparty: 'Payroll' },
  { id: '5', type: 'expense', amount: 2400, description: 'Figma subscription', category: 'Software', date: '2026-07-14', counterparty: 'Figma' },
  { id: '6', type: 'income', amount: 65000, description: 'App development milestone', category: 'Development', date: '2026-07-13', counterparty: 'CloudNine Solutions' },
  { id: '7', type: 'expense', amount: 3200, description: 'Office supplies', category: 'Office', date: '2026-07-12', counterparty: 'Makro' },
  { id: '8', type: 'income', amount: 12000, description: 'Training workshop', category: 'Training', date: '2026-07-11', counterparty: 'Urban Design Co' },
  { id: '9', type: 'expense', amount: 1800, description: 'Uber for meetings', category: 'Travel', date: '2026-07-10', counterparty: 'Uber' },
  { id: '10', type: 'expense', amount: 15000, description: 'AWS hosting', category: 'Software', date: '2026-07-10', counterparty: 'AWS' },
]

const incomeCategories = ['Development', 'Consulting', 'Training', 'Design', 'Maintenance', 'Sales', 'Other']
const expenseCategories = ['Marketing', 'Salaries', 'Software', 'Office', 'Travel', 'Equipment', 'Insurance', 'Utilities', 'Other']

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [newTx, setNewTx] = useState({
    type: 'income' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
    counterparty: '',
    date: new Date().toISOString().split('T')[0],
  })

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter)
  const totalIn = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalOut = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const tx: Transaction = {
      id: Date.now().toString(),
      type: newTx.type,
      amount: parseFloat(newTx.amount),
      description: newTx.description,
      category: newTx.category,
      counterparty: newTx.counterparty,
      date: newTx.date,
    }
    setTransactions([tx, ...transactions])
    setShowForm(false)
    setNewTx({ type: 'income', amount: '', description: '', category: '', counterparty: '', date: new Date().toISOString().split('T')[0] })
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Money In (This Month)</p>
          <p className="text-2xl font-bold text-green-600 mt-1">R{totalIn.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Money Out (This Month)</p>
          <p className="text-2xl font-bold text-red-600 mt-1">R{totalOut.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Net Flow</p>
          <p className={`text-2xl font-bold mt-1 ${totalIn - totalOut >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalIn - totalOut >= 0 ? '+' : ''}R{(totalIn - totalOut).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'income', 'expense'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All' : f === 'income' ? 'Money In' : 'Money Out'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Transaction
        </button>
      </div>

      {/* Add Transaction Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAdd} className="card border-2 border-primary-200">
              <h3 className="font-semibold text-gray-900 mb-4">Record Transaction</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setNewTx(p => ({ ...p, type: 'income', category: '' }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium ${newTx.type === 'income' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-100 text-gray-600'}`}>
                      Money In
                    </button>
                    <button type="button" onClick={() => setNewTx(p => ({ ...p, type: 'expense', category: '' }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium ${newTx.type === 'expense' ? 'bg-red-100 text-red-700 ring-2 ring-red-500' : 'bg-gray-100 text-gray-600'}`}>
                      Money Out
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (R)</label>
                  <input type="number" required value={newTx.amount} onChange={e => setNewTx(p => ({ ...p, amount: e.target.value }))}
                    placeholder="0.00" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input type="text" required value={newTx.description} onChange={e => setNewTx(p => ({ ...p, description: e.target.value }))}
                    placeholder="What is this for?" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select required value={newTx.category} onChange={e => setNewTx(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select category</option>
                    {(newTx.type === 'income' ? incomeCategories : expenseCategories).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From / To</label>
                  <input type="text" value={newTx.counterparty} onChange={e => setNewTx(p => ({ ...p, counterparty: e.target.value }))}
                    placeholder="Client or vendor name" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" required value={newTx.date} onChange={e => setNewTx(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction List */}
      <div className="card">
        <div className="divide-y divide-gray-100">
          {filtered.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <svg className={`w-5 h-5 ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d={tx.type === 'income' ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M17 13l-5 5m0 0l-5-5m5 5V6'} />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                  <p className="text-xs text-gray-500">{tx.counterparty} &middot; {tx.category} &middot; {tx.date}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'income' ? '+' : '-'}R{tx.amount.toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
