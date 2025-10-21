import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getTokenPayload, clearTokens } from '../utils/auth'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('access_token')
  const payload = token ? getTokenPayload() : null
  const role = payload?.role

  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = (e) => {
    e.preventDefault()
    clearTokens()
    navigate('/')
    window.location.reload()
  }

  const handleLinkClick = () => {
    setMenuOpen(false) // close menu when any link is clicked
  }

  return (
    <header className="bg-white shadow relative z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-bold text-lg">ParkEase</Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 text-sm">
          <Link to="/" className="text-slate-600">Home</Link>
          {token ? (
            <>
              <Link to="/dashboard" className="text-slate-600">Dashboard</Link>
              {role === 'owner' && <Link to="/owner/dashboard" className="text-slate-600">LotOwner</Link>}
              <Link to="/bookings" className="text-slate-600">Bookings</Link>
              <Link to="/profile" className="text-slate-600">Profile</Link>
              <a href="#" onClick={handleLogout} className="text-slate-600">Logout</a>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600">Login</Link>
              <Link to="/register" className="text-slate-600">Register</Link>
            </>
          )}
        </nav>

        {/* Hamburger Button */}
        <button
          className="md:hidden flex items-center text-slate-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md w-full">
          <nav className="flex flex-col px-6 py-4 space-y-4 text-base">
            <Link to="/" onClick={handleLinkClick} className="text-slate-700 hover:text-indigo-600">Home</Link>
            {token ? (
              <>
                <Link to="/dashboard" onClick={handleLinkClick} className="text-slate-700 hover:text-indigo-600">Dashboard</Link>
                {role === 'owner' && <Link to="/owner/dashboard" onClick={handleLinkClick} className="text-slate-700 hover:text-indigo-600">LotOwner</Link>}
                <Link to="/bookings" onClick={handleLinkClick} className="text-slate-700 hover:text-indigo-600">Bookings</Link>
                <Link to="/profile" onClick={handleLinkClick} className="text-slate-700 hover:text-indigo-600">Profile</Link>
                <a href="#" onClick={(e) => { handleLogout(e); handleLinkClick() }} className="text-slate-700 hover:text-indigo-600">Logout</a>
              </>
            ) : (
              <>
                <Link to="/login" onClick={handleLinkClick} className="text-slate-700 hover:text-indigo-600">Login</Link>
                <Link to="/register" onClick={handleLinkClick} className="text-slate-700 hover:text-indigo-600">Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
