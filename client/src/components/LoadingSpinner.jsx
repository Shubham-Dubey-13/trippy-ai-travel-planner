import React from 'react'

const LoadingSpinner = ({ fullscreen = true, size = 48, message = 'Loading...' }) => {
  const containerStyle = fullscreen ? {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: '40px',
  }

  return (
    <div style={containerStyle}>
      {/* Animated ring */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: `3px solid rgba(124,58,237,0.2)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: `3px solid transparent`,
          borderTopColor: '#7c3aed',
          borderRightColor: '#06b6d4',
          animation: 'spin 0.8s linear infinite',
        }} />
        {/* Center plane */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.4,
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          ✈️
        </div>
      </div>

      {/* Brand */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 22, fontWeight: 800,
          background: 'linear-gradient(135deg, #a78bfa, #67e8f9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 4,
          fontFamily: 'Inter, sans-serif',
        }}>
          Trippy
        </div>
        <div style={{
          fontSize: 13, color: 'rgba(255,255,255,0.5)',
          fontFamily: 'Inter, sans-serif',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          {message}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default LoadingSpinner
