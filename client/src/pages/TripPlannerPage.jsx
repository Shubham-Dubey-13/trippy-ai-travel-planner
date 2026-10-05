import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Calendar, Users, ChevronRight, ChevronLeft,
  Sparkles, Plane, Search, Star, Clock, ArrowRight, Check, X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'

/* ══════════════════════════════════════════════
   CITY DATA
══════════════════════════════════════════════ */
const CITIES = [
  // India
  { name: 'Mumbai', country: 'India', flag: '🇮🇳', code: 'BOM' },
  { name: 'Delhi', country: 'India', flag: '🇮🇳', code: 'DEL' },
  { name: 'Bengaluru', country: 'India', flag: '🇮🇳', code: 'BLR' },
  { name: 'Goa', country: 'India', flag: '🇮🇳', code: 'GOI' },
  { name: 'Hyderabad', country: 'India', flag: '🇮🇳', code: 'HYD' },
  { name: 'Chennai', country: 'India', flag: '🇮🇳', code: 'MAA' },
  { name: 'Kolkata', country: 'India', flag: '🇮🇳', code: 'CCU' },
  { name: 'Pune', country: 'India', flag: '🇮🇳', code: 'PNQ' },
  { name: 'Jaipur', country: 'India', flag: '🇮🇳', code: 'JAI' },
  { name: 'Ahmedabad', country: 'India', flag: '🇮🇳', code: 'AMD' },
  { name: 'Kochi', country: 'India', flag: '🇮🇳', code: 'COK' },
  { name: 'Udaipur', country: 'India', flag: '🇮🇳', code: 'UDR' },
  { name: 'Varanasi', country: 'India', flag: '🇮🇳', code: 'VNS' },
  { name: 'Agra', country: 'India', flag: '🇮🇳', code: 'AGR' },
  { name: 'Shimla', country: 'India', flag: '🇮🇳', code: 'SLV' },
  { name: 'Manali', country: 'India', flag: '🇮🇳', code: 'KUU' },
  { name: 'Rishikesh', country: 'India', flag: '🇮🇳', code: 'DED' },
  { name: 'Amritsar', country: 'India', flag: '🇮🇳', code: 'ATQ' },
  { name: 'Mysuru', country: 'India', flag: '🇮🇳', code: 'MYQ' },
  { name: 'Srinagar', country: 'India', flag: '🇮🇳', code: 'SXR' },
  { name: 'Leh', country: 'India', flag: '🇮🇳', code: 'IXL' },
  { name: 'Darjeeling', country: 'India', flag: '🇮🇳', code: 'DAR' },
  // International
  { name: 'Dubai', country: 'UAE', flag: '🇦🇪', code: 'DXB' },
  { name: 'Singapore', country: 'Singapore', flag: '🇸🇬', code: 'SIN' },
  { name: 'Bangkok', country: 'Thailand', flag: '🇹🇭', code: 'BKK' },
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵', code: 'TYO' },
  { name: 'Paris', country: 'France', flag: '🇫🇷', code: 'CDG' },
  { name: 'London', country: 'UK', flag: '🇬🇧', code: 'LHR' },
  { name: 'New York', country: 'USA', flag: '🇺🇸', code: 'JFK' },
  { name: 'Bali', country: 'Indonesia', flag: '🇮🇩', code: 'DPS' },
  { name: 'Sydney', country: 'Australia', flag: '🇦🇺', code: 'SYD' },
  { name: 'Rome', country: 'Italy', flag: '🇮🇹', code: 'FCO' },
  { name: 'Barcelona', country: 'Spain', flag: '🇪🇸', code: 'BCN' },
  { name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', code: 'AMS' },
  { name: 'Istanbul', country: 'Turkey', flag: '🇹🇷', code: 'IST' },
  { name: 'Maldives', country: 'Maldives', flag: '🇲🇻', code: 'MLE' },
  { name: 'Phuket', country: 'Thailand', flag: '🇹🇭', code: 'HKT' },
  { name: 'Colombo', country: 'Sri Lanka', flag: '🇱🇰', code: 'CMB' },
  { name: 'Kathmandu', country: 'Nepal', flag: '🇳🇵', code: 'KTM' },
  { name: 'Kuala Lumpur', country: 'Malaysia', flag: '🇲🇾', code: 'KUL' },
  { name: 'Hong Kong', country: 'Hong Kong', flag: '🇭🇰', code: 'HKG' },
  { name: 'Seoul', country: 'South Korea', flag: '🇰🇷', code: 'ICN' },
  { name: 'Zurich', country: 'Switzerland', flag: '🇨🇭', code: 'ZRH' },
  { name: 'Vienna', country: 'Austria', flag: '🇦🇹', code: 'VIE' },
  { name: 'Prague', country: 'Czech Republic', flag: '🇨🇿', code: 'PRG' },
]

/* ══════════════════════════════════════════════
   CITY SEARCH COMPONENT (defined outside to prevent focus loss)
══════════════════════════════════════════════ */
const CitySearch = ({ label, value, onChange, placeholder, icon: Icon }) => {
  const [query, setQuery]       = useState(value || '')
  const [open, setOpen]         = useState(false)
  const [focused, setFocused]   = useState(false)
  const wrapRef = useRef(null)

  // Keep local query in sync when parent clears value
  useEffect(() => { if (!value) setQuery('') }, [value])

  const filtered = query.trim().length === 0
    ? CITIES.slice(0, 8)
    : CITIES.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.country.toLowerCase().includes(query.toLowerCase()) ||
        c.code.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)

  const select = (city) => {
    setQuery(city.name)
    onChange(city.name)
    setOpen(false)
  }

  const clear = () => {
    setQuery('')
    onChange('')
    setOpen(false)
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <label className="input-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <Icon size={15} style={{
          position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
          color: focused ? '#a78bfa' : 'rgba(255,255,255,0.4)', transition: 'color 0.2s',
          pointerEvents: 'none', zIndex: 1,
        }} />
        <input
          className="input-field"
          style={{
            paddingLeft: 38, paddingRight: query ? 36 : 16,
            borderColor: focused ? 'rgba(124,58,237,0.6)' : '',
            boxShadow: focused ? '0 0 0 3px rgba(124,58,237,0.15)' : '',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          placeholder={placeholder}
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true) }}
          onFocus={() => { setFocused(true); setOpen(true) }}
          onBlur={() => setFocused(false)}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); clear() }}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
              width: 20, height: 20, cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
            }}
          >
            <X size={11} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 999,
          background: 'rgba(20, 16, 50, 0.97)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(124,58,237,0.35)',
          borderRadius: 14,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease',
          maxHeight: 280,
          overflowY: 'auto',
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center' }}>
              No cities found
            </div>
          ) : (
            <>
              {query.trim().length === 0 && (
                <div style={{ padding: '8px 14px 4px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Popular Destinations
                </div>
              )}
              {filtered.map((city, i) => (
                <div
                  key={city.code}
                  onMouseDown={e => { e.preventDefault(); select(city) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', cursor: 'pointer',
                    borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: 20, lineHeight: 1 }}>{city.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{city.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{city.country}</div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: 'rgba(124,58,237,0.8)',
                    background: 'rgba(124,58,237,0.12)', borderRadius: 6,
                    padding: '2px 6px', letterSpacing: '0.05em',
                  }}>{city.code}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════
   CALENDAR COMPONENT (defined outside)
══════════════════════════════════════════════ */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

const CalendarPicker = ({ label, value, onChange, minDate }) => {
  const [open, setOpen]   = useState(false)
  const [viewYear, setViewYear]   = useState(() => value ? new Date(value).getFullYear() : new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => value ? new Date(value).getMonth() : new Date().getMonth())
  const wrapRef = useRef(null)

  const selected = value ? new Date(value + 'T00:00:00') : null
  const today    = new Date(); today.setHours(0,0,0,0)
  const minD     = minDate ? new Date(minDate + 'T00:00:00') : today

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const getDays = () => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDays()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const selectDay = (day) => {
    const d = new Date(viewYear, viewMonth, day)
    if (d < minD) return
    const str = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    onChange(str)
    setOpen(false)
  }

  const displayValue = selected
    ? selected.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <label className="input-label">{label}</label>
      <div
        className="input-field"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer', userSelect: 'none',
          borderColor: open ? 'rgba(124,58,237,0.6)' : '',
          boxShadow: open ? '0 0 0 3px rgba(124,58,237,0.15)' : '',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        <Calendar size={15} style={{ color: open ? '#a78bfa' : 'rgba(255,255,255,0.4)', flexShrink: 0, transition: 'color 0.2s' }} />
        <span style={{ fontSize: 14, color: selected ? 'white' : 'rgba(255,255,255,0.35)', flex: 1 }}>
          {displayValue || 'Select date'}
        </span>
        {selected && (
          <button
            type="button"
            onMouseDown={e => { e.stopPropagation(); onChange(''); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0, display: 'flex' }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 1000,
          background: 'rgba(15, 12, 41, 0.98)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 18,
          padding: '20px',
          boxShadow: '0 25px 70px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.1)',
          width: 310,
          animation: 'fadeIn 0.15s ease',
        }}>
          {/* Month/Year header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <button type="button" onClick={prevMonth} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const thisDate = new Date(viewYear, viewMonth, day)
              const isSelected = selected &&
                selected.getDate() === day &&
                selected.getMonth() === viewMonth &&
                selected.getFullYear() === viewYear
              const isToday = thisDate.toDateString() === today.toDateString()
              const isPast  = thisDate < minD

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  disabled={isPast}
                  style={{
                    height: 36, borderRadius: 9, border: 'none', cursor: isPast ? 'not-allowed' : 'pointer',
                    fontSize: 13, fontWeight: isSelected ? 700 : 400, transition: 'all 0.15s',
                    background: isSelected
                      ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                      : isToday
                      ? 'rgba(124,58,237,0.18)'
                      : 'transparent',
                    color: isPast ? 'rgba(255,255,255,0.2)' : isSelected ? 'white' : isToday ? '#a78bfa' : 'rgba(255,255,255,0.85)',
                    boxShadow: isSelected ? '0 4px 15px rgba(124,58,237,0.5)' : 'none',
                    border: isToday && !isSelected ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent',
                  }}
                  onMouseEnter={e => { if (!isPast && !isSelected) e.currentTarget.style.background = 'rgba(124,58,237,0.2)' }}
                  onMouseLeave={e => { if (!isPast && !isSelected) e.currentTarget.style.background = 'transparent' }}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════
   INTERESTS + STYLES CONFIG
══════════════════════════════════════════════ */
const INTERESTS = [
  { id: 'beach',       label: '🏖️ Beach' },
  { id: 'mountains',   label: '🏔️ Mountains' },
  { id: 'history',     label: '🏛️ History' },
  { id: 'culture',     label: '🎭 Culture' },
  { id: 'food',        label: '🍜 Food' },
  { id: 'adventure',   label: '🧗 Adventure' },
  { id: 'shopping',    label: '🛍️ Shopping' },
  { id: 'nightlife',   label: '🎵 Nightlife' },
  { id: 'nature',      label: '🌿 Nature' },
  { id: 'photography', label: '📷 Photography' },
]
const STYLES = ['Budget', 'Mid-range', 'Luxury']
const ACCOMMS = ['Hotel', 'Hostel', 'Resort', 'Airbnb', 'Camping']

/* ══════════════════════════════════════════════
   STEP INDICATOR
══════════════════════════════════════════════ */
const StepIndicator = ({ current, steps }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 36 }}>
    {steps.map((s, i) => (
      <React.Fragment key={i}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: i < current
              ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
              : i === current
              ? 'linear-gradient(135deg,#7c3aed,#06b6d4)'
              : 'rgba(255,255,255,0.08)',
            border: i === current ? '2px solid #7c3aed' : '2px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: 'white',
            boxShadow: i <= current ? '0 0 20px rgba(124,58,237,0.4)' : 'none',
            transition: 'all 0.3s ease',
          }}>
            {i < current ? <Check size={16} /> : i + 1}
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: i <= current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
            whiteSpace: 'nowrap',
          }}>
            {s}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div style={{
            height: 2, width: 80, margin: '0 0 20px',
            background: i < current ? 'linear-gradient(90deg,#7c3aed,#4f46e5)' : 'rgba(255,255,255,0.1)',
            transition: 'background 0.4s ease',
          }} />
        )}
      </React.Fragment>
    ))}
  </div>
)

/* ══════════════════════════════════════════════
   TRIP CARD
══════════════════════════════════════════════ */
const TripCard = ({ trip, onClick }) => {
  const days = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000)
    : null
  return (
    <div className="glass-card" onClick={onClick}
      style={{ padding: 24, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#7c3aed,#06b6d4)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(79,70,229,0.2))',
          border: '1px solid rgba(124,58,237,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>
          {CITIES.find(c => (trip.destination || '').toLowerCase().includes(c.name.toLowerCase()))?.flag || '🌍'}
        </div>
        <span className="badge badge-violet">{days ? `${days} days` : 'Trip'}</span>
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{trip.destination || 'Unknown Destination'}</h3>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>From {trip.source || 'Home'}</p>
      <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
        {trip.startDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Calendar size={13} color="rgba(255,255,255,0.4)" />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
              {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        )}
        {trip.travelers && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Users size={13} color="rgba(255,255,255,0.4)" />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{trip.travelers} travelers</span>
          </div>
        )}
      </div>
      {trip.budget && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Budget</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#a78bfa' }}>₹{Number(trip.budget).toLocaleString('en-IN')}</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, color: '#a78bfa', fontSize: 13, fontWeight: 600 }}>
        <span>View Itinerary</span><ArrowRight size={14} />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const TripPlannerPage = () => {
  const navigate = useNavigate()
  const [step, setStep]             = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [trips, setTrips]           = useState([])
  const [tripsLoading, setTripsLoading] = useState(true)
  const [flights, setFlights]       = useState([])
  const [flightsLoading, setFlightsLoading] = useState(false)

  const [form, setForm] = useState({
    from: '', to: '',
    startDate: '', endDate: '',
    travelers: 2,
    budget: 50000,
    interests: [],
    travelStyle: 'Mid-range',
    accommodation: 'Hotel',
  })

  useEffect(() => {
    api.get('/trips')
      .then(r => setTrips(r.data?.trips || r.data || []))
      .catch(() => {})
      .finally(() => setTripsLoading(false))
  }, [])

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const toggleInterest = (id) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter(i => i !== id)
        : [...f.interests, id],
    }))
  }

  const searchFlights = async () => {
    if (!form.from || !form.to || !form.startDate) return
    setFlightsLoading(true)
    try {
      const { data } = await api.get('/flights/search', {
        params: { from: form.from, to: form.to, date: form.startDate, travelers: form.travelers },
      })
      setFlights(data?.flights || data || [])
    } catch { setFlights([]) }
    finally { setFlightsLoading(false) }
  }

  const validateStep1 = () => {
    if (!form.from.trim())  { toast.error('Please select your origin city'); return false }
    if (!form.to.trim())    { toast.error('Please select your destination'); return false }
    if (!form.startDate)    { toast.error('Please select a start date'); return false }
    if (!form.endDate)      { toast.error('Please select an end date'); return false }
    if (new Date(form.endDate) <= new Date(form.startDate)) { toast.error('End date must be after start date'); return false }
    return true
  }

  const nextStep = () => {
    if (step === 0 && !validateStep1()) return
    setStep(s => s + 1)
    if (step === 0) searchFlights()
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const { data } = await api.post('/ai/generate-itinerary', {
        source: form.from, destination: form.to,
        startDate: form.startDate, endDate: form.endDate,
        travelers: form.travelers, budget: form.budget,
        interests: form.interests, travelStyle: form.travelStyle,
        accommodationPreference: form.accommodation,
      })
      toast.success('Itinerary crafted! ✨')
      navigate(`/trips/${data?.trip?._id || data?._id || data?.id}/itinerary`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate itinerary. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const tripDays = form.startDate && form.endDate
    ? Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000)
    : 0

  return (
    <div style={{ minHeight: '100vh', paddingTop: 90, paddingBottom: 60 }}>
      <div style={{ position: 'fixed', top: -150, left: -150, width: 600, height: 600, borderRadius: '50%', background: '#7c3aed', filter: 'blur(150px)', opacity: 0.15, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: '#06b6d4', filter: 'blur(150px)', opacity: 0.1, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40, animation: 'slideUp 0.5s ease both' }}>
          <h1 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 10 }}>
            Plan Your Next <span className="gradient-text">Adventure ✈️</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15 }}>
            Fill in the details and our AI will craft the perfect itinerary for you
          </p>
        </div>

        {/* PLANNER CARD */}
        <div className="glass-card" style={{ padding: 'clamp(24px,5vw,44px)', marginBottom: 40, animation: 'slideUp 0.5s ease 0.1s both' }}>
          <StepIndicator current={step} steps={['Destination & Dates', 'Preferences', 'Review & Generate']} />

          {/* ── STEP 0 ── */}
          {step === 0 && (
            <div style={{ animation: 'fadeIn 0.4s ease both' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={20} color="#a78bfa" /> Where are you headed?
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
                <CitySearch
                  label="FROM (ORIGIN CITY)"
                  value={form.from}
                  onChange={v => handleChange('from', v)}
                  placeholder="e.g. Mumbai"
                  icon={Plane}
                />
                <CitySearch
                  label="TO (DESTINATION)"
                  value={form.to}
                  onChange={v => handleChange('to', v)}
                  placeholder="e.g. Goa, Tokyo, Paris"
                  icon={MapPin}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
                <CalendarPicker
                  label="START DATE"
                  value={form.startDate}
                  onChange={v => handleChange('startDate', v)}
                  minDate={new Date().toISOString().split('T')[0]}
                />
                <CalendarPicker
                  label="END DATE"
                  value={form.endDate}
                  onChange={v => handleChange('endDate', v)}
                  minDate={form.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Trip duration pill */}
              {tripDays > 0 && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', borderRadius: 20,
                  background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  marginBottom: 20, animation: 'fadeIn 0.3s ease',
                }}>
                  <Clock size={14} color="#a78bfa" />
                  <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>
                    {tripDays} day{tripDays > 1 ? 's' : ''} trip
                  </span>
                </div>
              )}

              {/* Travelers */}
              <div>
                <label className="input-label">NUMBER OF TRAVELERS</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button type="button"
                    onClick={() => handleChange('travelers', Math.max(1, form.travelers - 1))}
                    style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    −
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 24px', borderRadius: 12, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}>
                    <Users size={16} color="#a78bfa" />
                    <span style={{ fontSize: 18, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{form.travelers}</span>
                  </div>
                  <button type="button"
                    onClick={() => handleChange('travelers', Math.min(20, form.travelers + 1))}
                    style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    +
                  </button>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    {form.travelers === 1 ? 'Solo trip! 🎒' : form.travelers <= 2 ? 'Couple trip 💑' : form.travelers <= 4 ? 'Small group 👫' : 'Group trip 🎉'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.4s ease both' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Star size={20} color="#a78bfa" /> Your preferences
              </h2>

              {/* Budget */}
              <div style={{ marginBottom: 28 }}>
                <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>TOTAL BUDGET (INR)</span>
                  <span style={{ color: '#a78bfa', fontSize: 16, fontWeight: 700 }}>₹{Number(form.budget).toLocaleString('en-IN')}</span>
                </label>
                <input type="range" min={5000} max={500000} step={5000} value={form.budget}
                  onChange={e => handleChange('budget', Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer', marginBottom: 8, height: 6 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>₹5,000</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>₹5,00,000</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                  {[15000, 30000, 60000, 100000, 200000].map(b => (
                    <button key={b} type="button" onClick={() => handleChange('budget', b)}
                      style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', background: form.budget === b ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.06)', border: form.budget === b ? '1px solid rgba(124,58,237,0.6)' : '1px solid rgba(255,255,255,0.1)', color: form.budget === b ? '#a78bfa' : 'rgba(255,255,255,0.6)', transition: 'all 0.2s' }}>
                      ₹{(b/1000).toFixed(0)}K
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div style={{ marginBottom: 28 }}>
                <label className="input-label">INTERESTS (SELECT ALL THAT APPLY)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {INTERESTS.map(({ id, label }) => {
                    const selected = form.interests.includes(id)
                    return (
                      <button key={id} type="button" onClick={() => toggleInterest(id)}
                        style={{ padding: '8px 16px', borderRadius: 22, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s ease', background: selected ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)', border: selected ? '1px solid rgba(124,58,237,0.6)' : '1px solid rgba(255,255,255,0.1)', color: selected ? 'white' : 'rgba(255,255,255,0.65)', fontWeight: selected ? 600 : 400, transform: selected ? 'scale(1.03)' : 'scale(1)', boxShadow: selected ? '0 0 15px rgba(124,58,237,0.3)' : 'none' }}>
                        {selected && <Check size={12} style={{ display: 'inline', marginRight: 5 }} />}
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Travel Style */}
              <div style={{ marginBottom: 24 }}>
                <label className="input-label">TRAVEL STYLE</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {STYLES.map(s => (
                    <button key={s} type="button" onClick={() => handleChange('travelStyle', s)}
                      style={{ padding: '10px 22px', borderRadius: 12, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s ease', background: form.travelStyle === s ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(255,255,255,0.06)', border: form.travelStyle === s ? '1px solid #7c3aed' : '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: form.travelStyle === s ? 600 : 400, boxShadow: form.travelStyle === s ? '0 4px 20px rgba(124,58,237,0.4)' : 'none' }}>
                      {s === 'Budget' ? '🎒 ' : s === 'Mid-range' ? '✨ ' : '💎 '}{s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accommodation */}
              <div>
                <label className="input-label">ACCOMMODATION PREFERENCE</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {ACCOMMS.map(a => {
                    const icons = { Hotel: '🏨', Hostel: '🛏️', Resort: '🌴', Airbnb: '🏠', Camping: '⛺' }
                    return (
                      <button key={a} type="button" onClick={() => handleChange('accommodation', a)}
                        style={{ padding: '10px 18px', borderRadius: 12, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s ease', background: form.accommodation === a ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.06)', border: form.accommodation === a ? '1px solid rgba(6,182,212,0.5)' : '1px solid rgba(255,255,255,0.1)', color: form.accommodation === a ? '#67e8f9' : 'rgba(255,255,255,0.65)', fontWeight: form.accommodation === a ? 600 : 400 }}>
                        {icons[a]} {a}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.4s ease both' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={20} color="#a78bfa" /> Review & Generate
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'From', value: form.from || '—', icon: '🛫' },
                  { label: 'Destination', value: form.to || '—', icon: '📍' },
                  { label: 'Duration', value: tripDays ? `${tripDays} days` : '—', icon: '📅' },
                  { label: 'Travelers', value: `${form.travelers} person${form.travelers > 1 ? 's' : ''}`, icon: '👥' },
                  { label: 'Budget', value: `₹${Number(form.budget).toLocaleString('en-IN')}`, icon: '💰' },
                  { label: 'Style', value: form.travelStyle, icon: '✨' },
                  { label: 'Stay', value: form.accommodation, icon: '🏨' },
                  { label: 'Dates', value: form.startDate ? `${new Date(form.startDate + 'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})} – ${new Date(form.endDate + 'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}` : '—', icon: '🗓️' },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{ padding: '16px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{value}</div>
                  </div>
                ))}
              </div>

              {form.interests.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Interests</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {form.interests.map(id => {
                      const interest = INTERESTS.find(i => i.id === id)
                      return <span key={id} className="badge badge-violet">{interest?.label}</span>
                    })}
                  </div>
                </div>
              )}

              <button onClick={handleSubmit} disabled={submitting} className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '18px', fontSize: 16, opacity: submitting ? 0.85 : 1, cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 10px 35px rgba(124,58,237,0.55)' }}>
                {submitting ? (
                  <>
                    <div style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Crafting your perfect trip... ✨
                  </>
                ) : (
                  <><Sparkles size={18} /> Generate AI Itinerary</>
                )}
              </button>

              {submitting && (
                <p style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'rgba(255,255,255,0.45)', animation: 'pulse 2s ease infinite' }}>
                  Our AI is analyzing thousands of options to build your perfect itinerary...
                </p>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            {step > 0 ? (
              <button type="button" className="btn-secondary" onClick={() => setStep(s => s - 1)} style={{ padding: '11px 24px', fontSize: 14 }}>
                <ChevronLeft size={16} /> Back
              </button>
            ) : <div />}
            {step < 2 && (
              <button type="button" className="btn-primary" onClick={nextStep} style={{ padding: '11px 28px', fontSize: 14, marginLeft: 'auto' }}>
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* FLIGHT RESULTS */}
        {(flights.length > 0 || flightsLoading) && (
          <div className="glass-card" style={{ padding: 28, marginBottom: 32, animation: 'slideUp 0.4s ease both' }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Search size={17} color="#67e8f9" /> Available Flights
            </h3>
            {flightsLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#67e8f9', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Searching best flights...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {flights.slice(0, 3).map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ fontSize: 22 }}>✈️</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{f.airline || 'IndiGo'}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{f.duration || '2h 30m'} • {f.stops === 0 ? 'Non-stop' : `${f.stops} stop`}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#a78bfa' }}>₹{Number(f.price || 4500 + i * 800).toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>per person</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SAVED TRIPS */}
        <div style={{ animation: 'slideUp 0.5s ease 0.2s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>🗺️ Your Trips</h2>
            {trips.length > 0 && <span className="badge badge-violet">{trips.length} trip{trips.length > 1 ? 's' : ''}</span>}
          </div>

          {tripsLoading ? (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ width: 28, height: 28, border: '3px solid rgba(124,58,237,0.3)', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading your trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="glass-card" style={{ padding: '50px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🌍</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No trips yet</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Fill in the form above and generate your first AI-powered itinerary!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {trips.map((trip, i) => (
                <TripCard key={trip._id || i} trip={trip} onClick={() => navigate(`/trips/${trip._id}/itinerary`)} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default TripPlannerPage
