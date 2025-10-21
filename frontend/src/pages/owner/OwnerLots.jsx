import React, { useEffect, useState } from 'react'
import { fetchMyLots } from '../../services/lots'

export default function OwnerLots() {
  const [lots, setLots] = useState([])

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetchMyLots()
      setLots(res)
    } catch (err) {
      console.error(err)
      alert('Failed to load lots')
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Your Lots</h3>
      <div className="space-y-3">
        {lots.map(l => (
          <div key={l.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{l.name}</div>
              <div className="text-sm text-slate-600">{l.address}</div>
              <div className="text-sm text-slate-500">Available: {l.available_slots}/{l.total_slots}</div>
            </div>
            <div className="flex gap-2">
              <a href={`/owner/lots/${l.id}/edit`} className="px-2 py-1 bg-indigo-600 text-white rounded">Edit</a>
              <a href={`/owner/bookings`} className="px-2 py-1 bg-slate-600 text-white rounded">Bookings</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}