import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import LandingPage        from './pages/LandingPage'
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import TripPlannerPage    from './pages/TripPlannerPage'
import TripDashboardPage  from './pages/TripDashboardPage'
import ItineraryPage      from './pages/ItineraryPage'
import ExpenseTrackerPage from './pages/ExpenseTrackerPage'
import ChatPage           from './pages/ChatPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/planner" element={
            <ProtectedRoute><TripPlannerPage /></ProtectedRoute>
          } />
          <Route path="/trips/:id" element={
            <ProtectedRoute><TripDashboardPage /></ProtectedRoute>
          } />
          <Route path="/trips/:id/itinerary" element={
            <ProtectedRoute><ItineraryPage /></ProtectedRoute>
          } />
          <Route path="/trips/:id/expenses" element={
            <ProtectedRoute><ExpenseTrackerPage /></ProtectedRoute>
          } />
          <Route path="/trips/:id/chat" element={
            <ProtectedRoute><ChatPage /></ProtectedRoute>
          } />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(30, 27, 75, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#7c3aed', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
