import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Calendar, Users, DollarSign, MessageCircle, CreditCard,
  MapPin, Clock, ChevronDown, ChevronUp, Lightbulb,
  Package, Star, ArrowLeft, Edit3, X, Send, Utensils, Navigation,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

/* ─── Activity bubble ─── */
const Activity = ({ activity, timeLabel, colorAccent }) => (
  <div style={{
    display: 'flex', gap: 14, padding: '14px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  }}>
    {/* Timeline dot */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: colorAccent, marginTop: 5, flexShrink: 0,
        boxShadow: `0 0 10px ${colorAccent}`,
      }} />
      <div style={{ flex: 1, width: 2, background: 'rgba(255,255,255,0.07)', marginTop: 4 }} />
    </div>

    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
        <span style={{
          padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
          background: `${colorAccent}22`, color: colorAccent,
          border: `1px solid ${colorAccent}44`, textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          {timeLabel}
        </span>
        {(activity.estimatedCost != null || activity.cost != null) && (
          <span style={{
            padding: '2px 10px', borderRadius: 20, fontSize: 11,
            background: 'rgba(34,197,94,0.12)', color: '#86efac',
            border: '1px solid rgba(34,197,94,0.25)',
          }}>
            ₹{Number(activity.estimatedCost ?? activity.cost).toLocaleString('en-IN')}
          </span>
        )}
      </div>
      <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{activity.place || activity.name || activity.activity}</h4>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, marginBottom: 6 }}>
        {activity.description}
      </p>
      {activity.tips && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 6,
          padding: '8px 12px', borderRadius: 8,
          background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)',
        }}>
          <Lightbulb size={13} color="#fde047" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12, color: '#fde047', lineHeight: 1.5 }}>{activity.tips}</span>
        </div>
      )}
    </div>
  </div>
)

/* ─── Day card ─── */
const DayCard = ({ day, index }) => {
  const [open, setOpen] = useState(index === 0)
  const colors = ['#7c3aed', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6']
  const color  = colors[index % colors.length]

  return (
    <div className="glass-card" style={{ overflow: 'hidden', marginBottom: 16 }}>
      {/* Day header */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: open ? '1px solid rgba(255,255,255,0.07)' : 'none',
          transition: 'background 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `linear-gradient(135deg,${color}33,${color}11)`,
            border: `1px solid ${color}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color,
          }}>
            D{index + 1}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>
              Day {day.day || index + 1}
              {day.theme && <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.5)', marginLeft: 10 }}>— {day.theme}</span>}
            </div>
            {day.date && (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            )}
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.4)' }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div style={{ padding: '20px 24px', animation: 'fadeIn 0.25s ease' }}>
          {/* Activities — rendered in order, time badge from data */}
          {(day.activities || []).map((act, ai) => {
            const timeVal = act.time || act.timeOfDay || `Stop ${ai + 1}`
            const timeColors = {
              morning: '#f59e0b', afternoon: '#7c3aed',
              evening: '#ec4899', night: '#06b6d4',
            }
            const tc = timeColors[timeVal.toLowerCase()] || color
            return <Activity key={ai} activity={act} timeLabel={timeVal} colorAccent={tc} />
          })}

          {/* Meals */}
          {day.meals && day.meals.length > 0 && (
            <div style={{
              marginTop: 16, padding: '14px 16px', borderRadius: 12,
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Utensils size={14} color="#6ee7b7" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Meals</span>
              </div>
              {Array.isArray(day.meals) ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {day.meals.map((meal, mi) => (
                    <div key={mi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                        {meal.type === 'Breakfast' ? '🌅' : meal.type === 'Lunch' ? '🌞' : '🌙'}{' '}
                        <strong>{meal.type}</strong>{meal.place ? ` at ${meal.place}` : ''}{meal.cuisine ? ` · ${meal.cuisine}` : ''}
                      </span>
                      {meal.estimatedCost > 0 && (
                        <span style={{ fontSize: 12, color: '#6ee7b7', fontWeight: 600 }}>₹{Number(meal.estimatedCost).toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                  {typeof day.meals === 'string'
                    ? day.meals
                    : [day.meals.breakfast && `🌅 ${day.meals.breakfast}`, day.meals.lunch && `🌞 ${day.meals.lunch}`, day.meals.dinner && `🌙 ${day.meals.dinner}`].filter(Boolean).join('  ·  ')}
                </div>
              )}
            </div>
          )}

          {/* Daily cost */}
          {(day.dailyEstimatedCost != null || day.estimatedCost != null) && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              gap: 8, marginTop: 14, paddingTop: 12,
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Day estimate:</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#a78bfa' }}>
                ₹{Number(day.dailyEstimatedCost ?? day.estimatedCost).toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
const ItineraryPage = () => {
  const { id }  = useParams()
  const navigate = useNavigate()
  const [trip, setTrip]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [modifyOpen, setModifyOpen] = useState(false)
  const [modifyText, setModifyText] = useState('')
  const [modifying, setModifying]   = useState(false)

  useEffect(() => {
    api.get(`/trips/${id}`)
      .then(r => setTrip(r.data?.trip || r.data))
      .catch(() => toast.error('Failed to load itinerary'))
      .finally(() => setLoading(false))
  }, [id])

  const handleModify = async () => {
    if (!modifyText.trim()) return
    setModifying(true)
    try {
      const { data } = await api.post(`/ai/modify-itinerary/${id}`, { modifications: modifyText })
      setTrip(prev => ({ ...prev, itinerary: data?.itinerary || prev.itinerary }))
      setModifyOpen(false)
      setModifyText('')
      toast.success('Itinerary updated!')
    } catch {
      toast.error('Could not modify itinerary')
    } finally {
      setModifying(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading your itinerary..." />

  if (!trip) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🗺️</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Itinerary not found</h2>
        <button className="btn-primary" onClick={() => navigate('/planner')} style={{ marginTop: 16 }}>
          Back to Planner
        </button>
      </div>
    </div>
  )

  const itinerary = trip.itinerary || {}
  const days      = itinerary.days || []
  const budget    = trip.budget || itinerary.totalBudget || 0
  const estimated = itinerary.estimatedBudget || itinerary.estimatedTotal || itinerary.totalEstimatedCost || 0
  const highlights   = itinerary.highlights || []
  const packingList  = itinerary.packingList  || []
  const travelTips   = itinerary.travelTips   || []

  const budgetPct = budget > 0 ? Math.min(100, (estimated / budget) * 100) : 0
  const budgetColor = budgetPct >= 90 ? '#ef4444' : budgetPct >= 70 ? '#eab308' : '#22c55e'

  return (
    <div style={{ minHeight: '100vh', paddingTop: 86, paddingBottom: 60 }}>
      <div style={{ position: 'fixed', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: '#7c3aed', filter: 'blur(150px)', opacity: 0.12, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>

        {/* Back */}
        <button
          onClick={() => navigate('/planner')}
          className="btn-secondary"
          style={{ padding: '8px 18px', fontSize: 13, marginBottom: 24 }}
        >
          <ArrowLeft size={15} /> Back to Planner
        </button>

        {/* ── TRIP HEADER ── */}
        <div className="glass-card" style={{
          padding: 'clamp(24px,4vw,40px)',
          marginBottom: 28,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Gradient bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#7c3aed,#06b6d4,#ec4899)' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 40 }}>✈️</span>
                <div>
                  <h1 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                    {trip.destination || trip.to || itinerary.destination || 'Your Trip'}
                  </h1>
                  {(trip.source || trip.from) && (
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>
                      From {trip.source || trip.from}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 12 }}>
                {trip.startDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="rgba(255,255,255,0.45)" />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                      {new Date(trip.startDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                      {' – '}
                      {new Date(trip.endDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </span>
                  </div>
                )}
                {trip.travelers && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Users size={14} color="rgba(255,255,255,0.45)" />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {/* Highlights */}
              {highlights.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                  {highlights.map((h, i) => (
                    <span key={i} className="badge badge-violet">⭐ {h}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Budget badge */}
            {budget > 0 && (
              <div style={{
                padding: '20px 24px', borderRadius: 16,
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.25)',
                textAlign: 'center', minWidth: 160,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Budget</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#a78bfa' }}>
                  ₹{Number(budget).toLocaleString('en-IN')}
                </div>
                {estimated > 0 && (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>
                    ~₹{Number(estimated).toLocaleString('en-IN')} estimated
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Budget progress */}
          {budget > 0 && estimated > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Budget utilization</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: budgetColor }}>{Math.round(budgetPct)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${budgetPct}%`, background: `linear-gradient(90deg,#7c3aed,${budgetColor})` }} />
              </div>
            </div>
          )}
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
          <Link to={`/trips/${id}/chat`} className="btn-primary" style={{ padding: '10px 22px', fontSize: 14 }}>
            <MessageCircle size={16} /> Chat with AI
          </Link>
          <Link to={`/trips/${id}/expenses`} className="btn-secondary" style={{ padding: '10px 22px', fontSize: 14 }}>
            <CreditCard size={16} /> Track Expenses
          </Link>
          <button
            className="btn-secondary"
            style={{ padding: '10px 22px', fontSize: 14 }}
            onClick={() => setModifyOpen(true)}
          >
            <Edit3 size={16} /> Modify Itinerary
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 24, alignItems: 'start' }}>

          {/* ── LEFT: DAY CARDS ── */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Navigation size={18} color="#a78bfa" /> Day-by-Day Itinerary
              {days.length > 0 && <span className="badge badge-violet">{days.length} days</span>}
            </h2>

            {days.length > 0 ? (
              days.map((day, i) => <DayCard key={i} day={day} index={i} />)
            ) : (
              <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 50, marginBottom: 14 }}>📋</div>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>No itinerary days found. Try modifying the trip.</p>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Budget summary */}
            {(budget > 0 || estimated > 0) && (
              <div className="glass-card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <DollarSign size={15} color="#a78bfa" /> Budget Summary
                </h3>
                {[
                  { label: 'Total Budget', value: budget, color: '#a78bfa' },
                  { label: 'Estimated Cost', value: estimated, color: '#67e8f9' },
                  { label: 'Remaining', value: budget - estimated, color: budget - estimated >= 0 ? '#86efac' : '#fca5a5' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color }}>{value !== 0 ? `₹${Math.abs(Number(value)).toLocaleString('en-IN')}` : '₹0'}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Packing list */}
            {packingList.length > 0 && (
              <div className="glass-card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Package size={15} color="#f9a8d4" /> Packing List
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {packingList.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Travel tips */}
            {travelTips.length > 0 && (
              <div className="glass-card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lightbulb size={15} color="#fde047" /> Travel Tips
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {travelTips.map((tip, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 10,
                      background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)',
                    }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MODIFY MODAL ── */}
      {modifyOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
          animation: 'fadeIn 0.2s ease',
        }}>
          <div className="glass-card" style={{ padding: 36, maxWidth: 480, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Edit3 size={17} color="#a78bfa" /> Modify Itinerary
              </h3>
              <button onClick={() => setModifyOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 16, lineHeight: 1.6 }}>
              Describe what you'd like to change. Our AI will update your itinerary accordingly.
            </p>
            <textarea
              className="input-field"
              style={{ minHeight: 100, resize: 'vertical' }}
              placeholder="e.g. Add more beach activities on Day 2, suggest cheaper restaurants..."
              value={modifyText}
              onChange={e => setModifyText(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className="btn-secondary" onClick={() => setModifyOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleModify}
                disabled={modifying || !modifyText.trim()}
                style={{ flex: 1, justifyContent: 'center', opacity: modifying ? 0.7 : 1 }}
              >
                {modifying ? (
                  <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Modifying...</>
                ) : (
                  <><Send size={15} /> Apply Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: minmax(0,1fr) 280px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default ItineraryPage
