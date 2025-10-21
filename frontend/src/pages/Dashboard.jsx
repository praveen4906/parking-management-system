import React, { useEffect, useState } from 'react'
import Map from '../components/Map'
import api from '../utils/api'
import { getCurrentPosition } from '../utils/geolocation'

export default function Dashboard() {
  const [lots, setLots] = useState([])
  const [route, setRoute] = useState(null)

  useEffect(() => {
    loadLots()
  }, [])

  async function loadLots() {
    try {
      const res = await api.get('/lots/')
      setLots(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load lots')
    }
  }

  const handleMarkerClick = async (lot) => {
    if (!confirm(`Book a slot at ${lot.name}? Available: ${lot.available_slots}/${lot.total_slots}`)) return
    try {
      const slotsRes = await api.get(`/slots/?lot=${lot.id}`)
      const slot = slotsRes.data.find(s => s.is_active && !s.is_booked)
      if (!slot) { alert('No available slots'); return }
      const bookingRes = await api.post('/bookings/', { slot: slot.id })
      alert('Booked! Booking ID: ' + bookingRes.data.id)
      try {
        const position = await getCurrentPosition()
        setRoute({ from: [position.coords.latitude, position.coords.longitude], to: [lot.lat, lot.lng] })
      } catch (e) {
        // fallback: fly to lot by setting route with same from/to to center map
        setRoute({ from: [lot.lat, lot.lng], to: [lot.lat, lot.lng] })
      }
      loadLots()
    } catch (err) {
      console.error(err)
      alert('Booking failed')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button onClick={loadLots} className="bg-indigo-600 text-white px-3 py-1 rounded">Refresh</button>
      </div>
      <div className="mt-4">
        <Map markers={lots} onMarkerClick={handleMarkerClick} showRoute={route} />
      </div>
    </div>
  )
}