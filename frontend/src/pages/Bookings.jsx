import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

export default function Bookings() {
  const [bookings, setBookings] = useState([])

  useEffect(() => { loadBookings() }, [])

  async function loadBookings() {
    try {
      const res = await api.get('/bookings/')
      setBookings(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load bookings')
    }
  }

  async function cancel(id) {
    if (!confirm('Cancel booking?')) return
    try {
      await api.post(`/bookings/${id}/cancel/`)
      alert('Cancelled')
      loadBookings()
    } catch (err) {
      console.error(err)
      alert('Cancel failed')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold">Bookings</h2>
      <div className="mt-4 space-y-3">
        {bookings.length === 0 && <div>No bookings yet.</div>}
        {bookings.map(b => (
          <div key={b.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">Booking #{b.id} — {b.status}</div>
              <div className="text-sm text-slate-600">Slot: {b.slot_detail?.number ?? b.slot} — Lot {b.lot_id}</div>
            </div>
            <div className="flex gap-2">
              <Link to={`/booking/${b.id}`} className="px-2 py-1 bg-indigo-600 text-white rounded">View</Link>
              <button onClick={() => cancel(b.id)} className="px-2 py-1 bg-red-600 text-white rounded">Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}