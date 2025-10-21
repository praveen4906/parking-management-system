import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'
import Map from '../components/Map'
import { getCurrentPosition } from '../utils/geolocation'

export default function BookingDetail() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [route, setRoute] = useState(null)

  useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [id])

  async function load() {
    try {
      const res = await api.get(`/bookings/${id}/`)
      setBooking(res.data)
      // try fetch slot to get lot coordinates
      const slotId = res.data.slot
      try {
        const s = await api.get(`/slots/${slotId}/`)
        if (s.data.lot) {
          const lot = await api.get(`/lots/${s.data.lot}/`)
          try {
            const pos = await getCurrentPosition()
            setRoute({ from: [pos.coords.latitude, pos.coords.longitude], to: [lot.data.lat, lot.data.lng] })
          } catch (_) {
            // just focus map on lot
            setRoute({ from: [lot.data.lat, lot.data.lng], to: [lot.data.lat, lot.data.lng] })
          }
        }
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error(err)
      alert('Failed to load booking')
    }
  }

  if (!booking) return <div>Loading...</div>

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold">Booking #{booking.id}</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <div><strong>Status:</strong> {booking.status}</div>
        <div className="mt-2"><strong>Slot:</strong> {booking.slot_detail?.number ?? booking.slot}</div>
        <div className="mt-2"><strong>Booked at:</strong> {new Date(booking.start_time).toLocaleString()}</div>
      </div>
      <div className="mt-4">
        <Map showRoute={route} />
      </div>
    </div>
  )
}