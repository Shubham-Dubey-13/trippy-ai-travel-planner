import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, MapPin, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

const CATEGORIES = ['transportation', 'accommodation', 'food', 'activities', 'shopping', 'other']
const CAT_DISPLAY = {
  transportation: 'Transportation', accommodation: 'Accommodation',
  food: 'Food', activities: 'Activities', shopping: 'Shopping', other: 'Other',
}
const CAT_META = {
  transportation: { icon: '🚗', color: '#7c3aed' },
  accommodation:  { icon: '🏨', color: '#06b6d4' },
  food:           { icon: '🍽️', color: '#10b981' },
  activities:     { icon: '🎯', color: '#ec4899' },
  shopping:       { icon: '🛍️', color: '#f59e0b' },
  other:          { icon: '💰', color: '#6b7280' },
}

const ExpenseTrackerPage = () => {
  const { id }  = useParams()
  const navigate = useNavigate()

  const [trip, setTrip]         = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading]   = useState(true)
  const [adding, setAdding]     = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    category:    'food',
    description: '',
    amount:      '',
    date:        new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    Promise.all([
      api.get(`/trips/${id}`),
      api.get(`/expenses/trip/${id}`).catch(() => ({ data: [] })),
    ]).then(([tripRes, expRes]) => {
      setTrip(tripRes.data?.trip || tripRes.data)
      setExpenses(expRes.data?.expenses || expRes.data || [])
    }).catch(() => toast.error('Failed to load expenses'))
      .finally(() => setLoading(false))
  }, [id])

  const validate = () => {
    const e = {}
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setAdding(true)
    try {
      const payload = { ...form, amount: Number(form.amount), tripId: id }
      const { data } = await api.post('/expenses', payload)
      setExpenses(prev => [data?.expense || data, ...prev])
      setForm({ category: 'food', description: '', amount: '', date: new Date().toISOString().split('T')[0] })
      setShowForm(false)
      toast.success('Expense added!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add expense')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (expId) => {
    if (!window.confirm('Delete this expense?')) return
    try {
      await api.delete(`/expenses/${expId}`)
      setExpenses(prev => prev.filter(e => e._id !== expId))
      toast.success('Expense deleted')
    } catch {
      toast.error('Could not delete expense')
    }
  }

  if (loading) return <LoadingSpinner message="Loading expenses..." />

  const budget  = Number(trip?.budget || 0)
  const spent   = expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
  const remaining = budget - spent
  const spentPct  = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0
  const spentColor = spentPct >= 90 ? '#ef4444' : spentPct >= 70 ? '#eab308' : '#22c55e'

  // Category breakdown
  const catTotals = CATEGORIES.map(cat => ({
    cat,
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount || 0), 0),
    count: expenses.filter(e => e.category === cat).length,
  })).filter(c => c.total > 0)

  // Group expenses by category
  const byCategory = CATEGORIES.reduce((acc, cat) => {
    const items = expenses.filter(e => e.category === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})

  return (
    <div style={{ minHeight: '100vh', paddingTop: 86, paddingBottom: 60 }}>
      <div style={{ position: 'fixed', bottom: -100, left: -100, width: 500, height: 500, borderRadius: '50%', background: '#7c3aed', filter: 'blur(150px)', opacity: 0.1, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>

        {/* Back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <button onClick={() => navigate(`/trips/${id}`)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
            <ArrowLeft size={15} /> Dashboard
          </button>
          <Link to={`/trips/${id}/itinerary`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
            View Itinerary
          </Link>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
              💸 Expense Tracker
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
              {trip?.destination || trip?.to || 'Your Trip'}
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
            style={{ padding: '11px 22px', fontSize: 14 }}
          >
            <Plus size={16} /> {showForm ? 'Cancel' : 'Add Expense'}
          </button>
        </div>

        {/* ── ADD EXPENSE FORM ── */}
        {showForm && (
          <div className="glass-card" style={{ padding: 28, marginBottom: 24, animation: 'slideUp 0.3s ease both' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>New Expense</h3>
            <form onSubmit={handleAdd} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 16 }}>
                {/* Category */}
                <div>
                  <label className="input-label">Category</label>
                  <select
                    className="input-field"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{CAT_META[c].icon} {CAT_DISPLAY[c]}</option>)}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="input-label">Amount (₹)</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                    <input
                      type="number" min="0" step="0.01"
                      className="input-field" style={{ paddingLeft: 36, borderColor: errors.amount ? '#ef4444' : '' }}
                      placeholder="0.00"
                      value={form.amount}
                      onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    />
                  </div>
                  {errors.amount && <p style={{ color: '#f87171', fontSize: 12, marginTop: 5 }}>{errors.amount}</p>}
                </div>

                {/* Date */}
                <div>
                  <label className="input-label">Date</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                    <input
                      type="date" className="input-field" style={{ paddingLeft: 36, colorScheme: 'dark' }}
                      value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 18 }}>
                <label className="input-label">Description</label>
                <input
                  className="input-field" style={{ borderColor: errors.description ? '#ef4444' : '' }}
                  placeholder="e.g. Hotel night, Lunch at restaurant..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
                {errors.description && <p style={{ color: '#f87171', fontSize: 12, marginTop: 5 }}>{errors.description}</p>}
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={adding}
                style={{ padding: '11px 28px', fontSize: 14, opacity: adding ? 0.7 : 1 }}
              >
                {adding ? (
                  <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Adding...</>
                ) : (
                  <><Plus size={15} /> Add Expense</>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ── SUMMARY CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Budget', value: `₹${budget.toLocaleString('en-IN')}`, color: '#a78bfa', icon: '💳' },
            { label: 'Total Spent',  value: `₹${spent.toLocaleString('en-IN')}`,  color: spentColor, icon: '💸' },
            { label: 'Remaining',    value: `₹${Math.abs(remaining).toLocaleString('en-IN')}`, color: remaining >= 0 ? '#86efac' : '#fca5a5', icon: remaining >= 0 ? '✅' : '⚠️' },
            { label: 'Expenses',     value: expenses.length, color: '#67e8f9', icon: '📋' },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="glass-card" style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Budget progress bar */}
        {budget > 0 && (
          <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Budget Usage</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: spentColor }}>{Math.round(spentPct)}%</span>
            </div>
            <div className="progress-bar" style={{ height: 12 }}>
              <div className="progress-fill" style={{ width: `${spentPct}%`, background: `linear-gradient(90deg,#7c3aed,${spentColor})` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Spent: ₹{spent.toLocaleString('en-IN')}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Budget: ₹{budget.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* ── CATEGORY BREAKDOWN ── */}
        {catTotals.length > 0 && (
          <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={16} color="#a78bfa" /> Category Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {catTotals.sort((a,b) => b.total - a.total).map(({ cat, total, count }) => {
                const pct = spent > 0 ? (total / spent) * 100 : 0
                const meta = CAT_META[cat]
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{meta.icon}</span>
                        <span style={{ fontWeight: 500 }}>{cat}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>({count} item{count > 1 ? 's' : ''})</span>
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: meta.color }}>
                        ₹{total.toLocaleString('en-IN')} <span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>({Math.round(pct)}%)</span>
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: 6 }}>
                      <div className="progress-fill" style={{ width: `${pct}%`, background: meta.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── EXPENSE LIST ── */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            All Expenses
            {expenses.length > 0 && <span className="badge badge-violet">{expenses.length}</span>}
          </h3>

          {expenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💸</div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15 }}>No expenses yet</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 4 }}>Add your first expense to start tracking</p>
              <button className="btn-primary" onClick={() => setShowForm(true)} style={{ marginTop: 20, padding: '10px 22px', fontSize: 13 }}>
                <Plus size={15} /> Add Expense
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(byCategory).map(([cat, items]) => (
                <div key={cat}>
                  {/* Category header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 0', marginBottom: 4,
                  }}>
                    <span style={{ fontSize: 14 }}>{CAT_META[cat].icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: CAT_META[cat]?.color || '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {CAT_DISPLAY[cat] || cat}
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: CAT_META[cat].color }}>
                      ₹{items.reduce((s, e) => s + Number(e.amount || 0), 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {items.map((exp, i) => (
                    <div key={exp._id || i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
                      padding: '12px 14px', borderRadius: 12,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      marginBottom: 6,
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{exp.description}</div>
                        {exp.date && (
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Calendar size={11} />
                            {new Date(exp.date).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#fca5a5' }}>
                          −₹{Number(exp.amount).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => handleDelete(exp._id)}
                          style={{
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: 8, padding: '6px', cursor: 'pointer',
                            color: '#fca5a5', display: 'flex', alignItems: 'center',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExpenseTrackerPage
