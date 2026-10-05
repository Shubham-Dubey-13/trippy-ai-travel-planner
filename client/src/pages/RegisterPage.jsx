import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

/* ── InputField defined OUTSIDE the component so React never remounts it ── */
const InputField = ({ label, name, type, placeholder, icon: Icon, showToggle, show, onToggle, value, onChange, error }) => (
  <div style={{ marginBottom: 18 }}>
    <label className="input-label">{label}</label>
    <div style={{ position: 'relative' }}>
      <Icon size={16} style={{
        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
        color: 'rgba(255,255,255,0.4)', pointerEvents: 'none',
      }} />
      <input
        type={showToggle ? (show ? 'text' : 'password') : (type || 'text')}
        name={name}
        className="input-field"
        style={{ paddingLeft: 42, paddingRight: showToggle ? 44 : 16, borderColor: error ? '#ef4444' : '' }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={name === 'confirm' ? 'new-password' : name === 'password' ? 'new-password' : name}
      />
      {showToggle && (
        <button type="button" onClick={onToggle} style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.4)', padding: 0,
        }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
    {error && <p style={{ color: '#f87171', fontSize: 12, marginTop: 6 }}>{error}</p>}
  </div>
)

const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass]   = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [errors, setErrors]       = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())      e.name    = 'Name is required'
    if (!form.email)            e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!form.password)         e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (!form.confirm)          e.confirm  = 'Please confirm your password'
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name.trim(),
        email: form.email,
        password: form.password,
      })
      login(data)
      toast.success('Account created! Welcome to Trippy 🎉')
      navigate('/planner')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const strengthLevel = () => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 6)  s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }
  const strength = strengthLevel()
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4']
  const strengthLabels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 24px 40px',
      position: 'relative',
    }}>
      <div style={{ position: 'fixed', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: '#4f46e5', filter: 'blur(130px)', opacity: 0.2, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: '#06b6d4', filter: 'blur(120px)', opacity: 0.2, pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 460, animation: 'slideUp 0.6s ease both' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 16px',
            boxShadow: '0 0 40px rgba(124,58,237,0.5)',
          }}>
            ✈️
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.5px' }}>
            Create your account
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
            Start planning your dream trips today — it's free!
          </p>
        </div>

        <div className="glass-card" style={{ padding: '36px 32px' }}>
          <form onSubmit={handleSubmit} noValidate>
            <InputField
              label="Full Name" name="name" icon={User} placeholder="John Doe"
              value={form.name} onChange={handleChange} error={errors.name}
            />
            <InputField
              label="Email Address" name="email" type="email" icon={Mail} placeholder="you@example.com"
              value={form.email} onChange={handleChange} error={errors.email}
            />
            <InputField
              label="Password" name="password" icon={Lock}
              placeholder="Min. 6 characters"
              showToggle show={showPass} onToggle={() => setShowPass(!showPass)}
              value={form.password} onChange={handleChange} error={errors.password}
            />

            {/* Password strength */}
            {form.password && (
              <div style={{ marginTop: -10, marginBottom: 18 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)',
                      transition: 'background 0.3s ease',
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: 11, color: strengthColors[strength] }}>{strengthLabels[strength]}</p>
              </div>
            )}

            <InputField
              label="Confirm Password" name="confirm" icon={Lock}
              placeholder="Repeat your password"
              showToggle show={showConf} onToggle={() => setShowConf(!showConf)}
              value={form.confirm} onChange={handleChange} error={errors.confirm}
            />

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: '100%', justifyContent: 'center', padding: '14px',
                fontSize: 15, marginTop: 8,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Creating account...
                </>
              ) : (
                <><UserPlus size={17} /> Create Account</>
              )}
            </button>
          </form>

          <div className="divider" style={{ margin: '24px 0' }} />

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>
              Sign in →
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
