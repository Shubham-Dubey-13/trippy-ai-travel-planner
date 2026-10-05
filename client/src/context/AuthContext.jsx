import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]           = useState(null)
  const [token, setToken]         = useState(null)
  const [loading, setLoading]     = useState(true)

  // On mount: hydrate from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('trippy_token')
    const storedUser  = localStorage.getItem('trippy_user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('trippy_token')
        localStorage.removeItem('trippy_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (data) => {
    const { token: newToken, user: newUser } = data
    localStorage.setItem('trippy_token', newToken)
    localStorage.setItem('trippy_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('trippy_token')
    localStorage.removeItem('trippy_user')
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthContext
