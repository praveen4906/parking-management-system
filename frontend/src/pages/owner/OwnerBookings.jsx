import React, { useEffect, useState } from 'react'
import api from '../../utils/api'

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([])

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await api.get('/bookings/')
      setBookings(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load bookings')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold">Bookings for Your Lots</h2>
      <div className="mt-4 space-y-3">
        {bookings.map(b => (
          <div key={b.id} className="bg-white p-3 rounded shadow">
            <div className="font-semibold">Booking #{b.id} — {b.status}</div>
            <div className="text-sm text-slate-600">Driver: {b.driver}</div>
            <div className="text-sm text-slate-600">Slot: {b.slot_detail?.number ?? b.slot} — Lot {b.lot_id}</div>
          </div>
        ))}
      </div>
    </div>
  )
}