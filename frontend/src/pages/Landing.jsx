import React, { useEffect, useState } from 'react'
import Map from '../components/Map'
import api from '../utils/api'
export default function Landing() {
  const [lots, setLots] = useState([])

  useEffect(() => {
    let mounted = true
    api.get('/lots/').then(res => {
      if (mounted) setLots(res.data)
    }).catch(() => {})
    return () => { mounted = false }
  }, [])

  const handleView = (lot) => {
    // direct to dashboard
    if (confirm(`Open ${lot.name} in dashboard?`)) {
      window.location.hash = '#/dashboard'
      window.location.href = '/#/dashboard'
    }
  }

  return (
    <section className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl font-bold">Find Parking Near You</h1>
          <p className="mt-3 text-slate-600">A smart parking platform connecting drivers and lot owners for seamless booking, management, and navigation.</p>
          <div className="mt-6 flex gap-3">
            <a className="bg-indigo-600 text-white px-4 py-2 rounded" href="/register">Get Started</a>
            <a className="bg-white border px-4 py-2 rounded" href="/login">Login</a>
          </div>
        </div>
        <div>
          <Map markers={lots} onMarkerClick={handleView} />
        </div>
      </div>
    </section>
  )
}