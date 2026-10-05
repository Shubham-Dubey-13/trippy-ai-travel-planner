import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Calendar, DollarSign, MessageCircle,
  Map, CreditCard, Clock, TrendingUp, Users,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="glass-card" style={{ padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{
      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
      background: `${color}22`,
      border: `1px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {React.cloneElement(icon, { size: 22, color })}
    </div>
    <div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
)

const NavTab = ({ to, icon, label, active }) => (
  <Link to={to} style={{
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '11px 22px', borderRadius: 12,
    textDecoration: 'none', fontSize: 14, fontWeight: 600,
    background: active ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(255,255,255,0.06)',
    border: active ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.1)',
    color: active ? 'white' : 'rgba(255,255,255,0.6)',
    boxShadow: active ? '0 4px 20px rgba(124,58,237,0.4)' : 'none',
    transition: 'all 0.2s ease',
  }}>
    {React.cloneElement(icon, { size: 16 })} {label}
  </Link>
)

const TripDashboardPage = () => {
  const { id }  = useParams()
  const navigate = useNavigate()
  const [trip, setTrip]         = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get(`/trips/${id}`),
      api.get(`/expenses/trip/${id}`).catch(() => ({ data: [] })),
    ]).then(([tripRes, expRes]) => {
      setTrip(tripRes.data?.trip || tripRes.data)
      setExpenses(expRes.data?.expenses || expRes.data || [])
    }).catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner message="Loading dashboard..." />

  if (!trip) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🗺️</div>
        <h2>Trip not found</h2>
        <button className="btn-primary" onClick={() => navigate('/planner')} style={{ marginTop: 16 }}>
          Back to Planner
        </button>
      </div>
    </div>
  )

  const budget  = Number(trip.budget || 0)
  const spent   = expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
  const remaining = budget - spent
  const days = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000)
    : null
  const spentPct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0
  const spentColor = spentPct >= 90 ? '#ef4444' : spentPct >= 70 ? '#eab308' : '#22c55e'

  const CATS = ['Transportation','Accommodation','Food','Activities','Shopping','Other']
  const catColors = { Transportation:'#7c3aed', Accommodation:'#06b6d4', Food:'#10b981', Activities:'#ec4899', Shopping:'#f59e0b', Other:'#6b7280' }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 86, paddingBottom: 60 }}>
      <div style={{ position: 'fixed', top: -100, left: -100, width: 500, height: 500, borderRadius: '50%', background: '#4f46e5', filter: 'blur(150px)', opacity: 0.12, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>

        {/* Back */}
        <button onClick={() => navigate('/planner')} className="btn-secondary" style={{ padding: '8px 18px', fontSize: 13, marginBottom: 24 }}>
          <ArrowLeft size={15} /> All Trips
        </button>

        {/* Trip header */}
        <div className="glass-card" style={{ padding: 'clamp(24px,4vw,36px)', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#7c3aed,#06b6d4,#ec4899)' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
                {trip.destination || trip.to || 'Your Trip'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 12 }}>
                {trip.source && `From ${trip.source}`}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {trip.startDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Calendar size={13} color="rgba(255,255,255,0.4)" />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                      {new Date(trip.startDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </span>
                  </div>
                )}
                {trip.travelers && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Users size={13} color="rgba(255,255,255,0.4)" />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {trip.travelStyle && <span className="badge badge-violet">{trip.travelStyle}</span>}
              {trip.accommodationPreference && <span className="badge badge-cyan">{trip.accommodationPreference}</span>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16, marginBottom: 24,
        }}>
          <StatCard icon={<DollarSign />} label="Total Budget" value={`₹${budget.toLocaleString('en-IN')}`} color="#a78bfa" />
          <StatCard icon={<TrendingUp />} label="Spent" value={`₹${spent.toLocaleString('en-IN')}`} sub={`${Math.round(spentPct)}% of budget`} color={spentColor} />
          <StatCard icon={<CreditCard />} label="Remaining" value={`₹${Math.abs(remaining).toLocaleString('en-IN')}`} sub={remaining < 0 ? 'Over budget!' : 'Available'} color={remaining >= 0 ? '#86efac' : '#fca5a5'} />
          {days && <StatCard icon={<Clock />} label="Duration" value={`${days} Days`} color="#67e8f9" />}
        </div>

        {/* Budget bar */}
        {budget > 0 && (
          <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Budget Usage</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: spentColor }}>{Math.round(spentPct)}%</span>
            </div>
            <div className="progress-bar" style={{ height: 10 }}>
              <div className="progress-fill" style={{ width: `${spentPct}%`, background: `linear-gradient(90deg,#7c3aed,${spentColor})` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>₹0</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>₹{budget.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Nav tabs */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
          <NavTab to={`/trips/${id}/itinerary`} icon={<Map />} label="Itinerary" active={false} />
          <NavTab to={`/trips/${id}/expenses`}  icon={<CreditCard />} label="Expenses" active={false} />
          <NavTab to={`/trips/${id}/chat`}      icon={<MessageCircle />} label="AI Chat" active={false} />
        </div>

        {/* Recent expenses */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={17} color="#a78bfa" /> Recent Expenses
            </h3>
            <Link to={`/trips/${id}/expenses`} style={{ fontSize: 13, color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>
              View all →
            </Link>
          </div>

          {expenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>💸</div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>No expenses logged yet</p>
              <Link to={`/trips/${id}/expenses`} className="btn-primary" style={{ display: 'inline-flex', marginTop: 16, padding: '10px 22px', fontSize: 13 }}>
                Add First Expense
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {expenses.slice(0, 5).map((exp, i) => (
                <div key={exp._id || i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
                  padding: '12px 16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${catColors[exp.category] || '#6b7280'}22`,
                      border: `1px solid ${catColors[exp.category] || '#6b7280'}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16,
                    }}>
                      {(() => {
                        const cat = (exp.category || '').toLowerCase()
                        return cat === 'transportation' ? '🚗' : cat === 'accommodation' ? '🏨' : cat === 'food' ? '🍽️' : cat === 'activities' ? '🎯' : cat === 'shopping' ? '🛍️' : '💰'
                      })()}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{exp.description}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                        {exp.category} · {exp.date ? new Date(exp.date).toLocaleDateString('en-IN', { day:'numeric', month:'short' }) : ''}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#fca5a5' }}>
                    −₹{Number(exp.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TripDashboardPage
