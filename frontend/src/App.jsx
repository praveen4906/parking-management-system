import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import BookingDetail from './pages/BookingDetail'
import Profile from './pages/Profile'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import OwnerLots from './pages/owner/OwnerLots'
import NewLot from './pages/owner/NewLot'
import EditLot from './pages/owner/EditLot'
import OwnerBookings from './pages/owner/OwnerBookings'
import { isAuthenticated, getTokenPayload } from './utils/auth'

export default function App() {
  const requireAuth = (Component, role = null) => {
    return (props) => {
      if (!isAuthenticated()) return <Navigate to="/login" replace />
      if (role) {
        const payload = getTokenPayload()
        if (!payload || payload.role !== role) return <Navigate to="/login" replace />
      }
      return <Component {...props} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={requireAuth(Dashboard)()} />
          <Route path="/bookings" element={requireAuth(Bookings)()} />
          <Route path="/booking/:id" element={requireAuth(BookingDetail)()} />
          <Route path="/profile" element={requireAuth(Profile)()} />

          <Route path="/owner/dashboard" element={requireAuth(OwnerDashboard, 'owner')()} />
          <Route path="/owner/lots" element={requireAuth(OwnerLots, 'owner')()} />
          <Route path="/owner/lots/new" element={requireAuth(NewLot, 'owner')()} />
          <Route path="/owner/lots/:id/edit" element={requireAuth(EditLot, 'owner')()} />
          <Route path="/owner/bookings" element={requireAuth(OwnerBookings, 'owner')()} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}