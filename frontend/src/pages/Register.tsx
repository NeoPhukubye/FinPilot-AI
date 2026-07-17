import { useState } from 'react'
import { motion } from 'framer-motion'

type AccountType = 'business' | 'bank' | null
type Step = 'type' | 'details' | 'done'

interface FormData {
  accountType: AccountType
  businessName: string
  ownerName: string
  email: string
  phone: string
  industry: string
  monthlyRevenue: string
  bankName: string
  registrationNumber: string
  country: string
}

const industries = ['Technology', 'Retail', 'Healthcare', 'Construction', 'Food & Beverage', 'Professional Services', 'Transport', 'Agriculture', 'Manufacturing', 'Other']

export default function Register() {
  const [step, setStep] = useState<Step>('type')
  const [form, setForm] = useState<FormData>({
    accountType: null,
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    industry: '',
    monthlyRevenue: '',
    bankName: '',
    registrationNumber: '',
    country: 'South Africa',
  })

  function update(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function selectType(type: AccountType) {
    setForm(prev => ({ ...prev, accountType: type }))
    setStep('details')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep('done')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {step === 'type' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started with FinPilot</h2>
            <p className="text-gray-500 mb-8">Choose your account type to begin managing your finances with AI.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => selectType('business')}
                className="card-hover text-left group"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Small Business</h3>
                <p className="text-sm text-gray-500">Track income, expenses, invoices, and get AI advice to grow.</p>
              </button>

              <button
                onClick={() => selectType('bank')}
                className="card-hover text-left group"
              >
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent-200 transition-colors">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Bank / Financial Institution</h3>
                <p className="text-sm text-gray-500">Manage client portfolios, monitor flows, and provide AI insights.</p>
              </button>
            </div>
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={handleSubmit}>
            <button type="button" onClick={() => setStep('type')} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {form.accountType === 'business' ? 'Register Your Business' : 'Register Your Bank'}
            </h2>
            <p className="text-gray-500 mb-6">Fill in your details to start managing your money smarter.</p>

            <div className="space-y-4">
              {form.accountType === 'business' ? (
                <>
                  <Input label="Business Name" value={form.businessName} onChange={v => update('businessName', v)} placeholder="e.g. NeoTech Solutions" required />
                  <Input label="Owner / Manager Name" value={form.ownerName} onChange={v => update('ownerName', v)} placeholder="e.g. Neo Phukubye" required />
                  <Input label="Email" type="email" value={form.email} onChange={v => update('email', v)} placeholder="neo@neotech.co.za" required />
                  <Input label="Phone" type="tel" value={form.phone} onChange={v => update('phone', v)} placeholder="+27 82 000 0000" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <select
                      value={form.industry}
                      onChange={e => update('industry', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select industry</option>
                      {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>
                  <Input label="Estimated Monthly Revenue (R)" value={form.monthlyRevenue} onChange={v => update('monthlyRevenue', v)} placeholder="e.g. 85000" />
                </>
              ) : (
                <>
                  <Input label="Bank / Institution Name" value={form.bankName} onChange={v => update('bankName', v)} placeholder="e.g. First National Bank" required />
                  <Input label="Registration Number" value={form.registrationNumber} onChange={v => update('registrationNumber', v)} placeholder="e.g. 2024/123456/07" required />
                  <Input label="Contact Email" type="email" value={form.email} onChange={v => update('email', v)} placeholder="admin@bank.co.za" required />
                  <Input label="Phone" type="tel" value={form.phone} onChange={v => update('phone', v)} placeholder="+27 11 000 0000" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={form.country}
                      onChange={e => update('country', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option>South Africa</option>
                      <option>Nigeria</option>
                      <option>Kenya</option>
                      <option>Ghana</option>
                      <option>Other</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Create Account
            </button>
          </form>
        )}

        {step === 'done' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to FinPilot!</h2>
            <p className="text-gray-500 mb-6">
              Your {form.accountType === 'business' ? 'business' : 'bank'} account is set up. Start tracking your money and get AI-powered tips to grow.
            </p>
            <button
              onClick={() => { setStep('type'); setForm(prev => ({ ...prev, accountType: null })) }}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

function Input({ label, value, onChange, placeholder, type = 'text', required = false }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
  )
}
