import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Plane, Map, LogOut, LogIn, UserPlus, Menu, X, Compass } from 'lucide-react'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      position:        'fixed',
      top:             0,
      left:            0,
      right:           0,
      zIndex:          1000,
      padding:         '0 24px',
      height:          '70px',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'space-between',
      background:      scrolled ? 'rgba(15,12,41,0.85)' : 'rgba(15,12,41,0.4)',
      backdropFilter:  'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom:    scrolled ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
      transition:      'all 0.3s ease',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
          boxShadow: '0 0 20px rgba(124,58,237,0.5)',
        }}>
          ✈️
        </div>
        <span style={{
          fontSize: 20, fontWeight: 800, color: 'white',
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #a78bfa, #67e8f9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Trippy
        </span>
      </Link>

      {/* Desktop nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
        {isAuthenticated ? (
          <>
            <Link
              to="/planner"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 10,
                textDecoration: 'none',
                fontSize: 14, fontWeight: 500,
                color: isActive('/planner') ? 'white' : 'rgba(255,255,255,0.7)',
                background: isActive('/planner') ? 'rgba(124,58,237,0.25)' : 'transparent',
                border: isActive('/planner') ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <Compass size={16} /> My Trips
            </Link>

            {/* User avatar & name */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 14px', borderRadius: 30,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: 'white',
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'white' }}>
                {user?.name?.split(' ')[0] || 'Traveler'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 10,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#fca5a5', fontSize: 14, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.2)'
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'
              }}
            >
              <LogOut size={15} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 10,
              textDecoration: 'none',
              fontSize: 14, fontWeight: 500,
              color: 'rgba(255,255,255,0.8)',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              transition: 'all 0.2s ease',
            }}>
              <LogIn size={15} /> Login
            </Link>
            <Link to="/register" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 10,
              textDecoration: 'none',
              fontSize: 14, fontWeight: 600,
              color: 'white',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              border: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(124,58,237,0.35)',
            }}>
              <UserPlus size={15} /> Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="mobile-menu-btn"
        style={{
          display: 'none',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10,
          padding: '8px',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: 70, left: 0, right: 0,
          background: 'rgba(15,12,41,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '16px 24px',
          display: 'flex', flexDirection: 'column', gap: 8,
          animation: 'slideUp 0.2s ease',
        }}>
          {isAuthenticated ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.06)',
                marginBottom: 4,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: 'white',
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{user?.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{user?.email}</div>
                </div>
              </div>

              <Link to="/planner" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 16px', borderRadius: 12,
                textDecoration: 'none',
                color: 'white', fontSize: 15, fontWeight: 500,
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.25)',
              }}>
                <Compass size={17} /> My Trips
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 16px', borderRadius: 12,
                  color: '#fca5a5', fontSize: 15, fontWeight: 500,
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  cursor: 'pointer',
                }}
              >
                <LogOut size={17} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 16px', borderRadius: 12,
                textDecoration: 'none', color: 'white', fontSize: 15,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}>
                <LogIn size={17} /> Login
              </Link>
              <Link to="/register" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 16px', borderRadius: 12,
                textDecoration: 'none', color: 'white', fontSize: 15, fontWeight: 600,
                background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
              }}>
                <UserPlus size={17} /> Get Started
              </Link>
            </>
          )}
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}

export default Navbar
