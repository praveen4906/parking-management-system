import React, { useState } from 'react'
import Map from '../../components/Map'
import { createLot } from '../../services/lots'

export default function NewLot() {
  const [placed, setPlaced] = useState(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [totalSlots, setTotalSlots] = useState(6)

  const handleMapClick = ({ lat, lng }) => {
    setPlaced({ lat, lng })
  }

  // simple enableClickToPlaceMarker by clicking map via a temporary overlay using Leaflet directly:
  // For simplicity, we instruct the user to click the map; Map component currently does not expose click event,
  // so we'll allow them to input coords manually if not placed.
  const save = async () => {
    if (!name || !placed) { alert('Provide name and place marker by clicking the map (or fill coords)'); return }
    try {
      await createLot({ name, address, total_slots: totalSlots, lat: placed.lat, lng: placed.lng })
      alert('Lot created')
      window.location.href = '/#/owner/dashboard'
    } catch (err) {
      console.error(err)
      alert('Create failed')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Create New Lot</h2>
      <div className="bg-white p-4 rounded shadow mt-4">
        <label className="block">Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2 rounded" />
        <label className="block mt-2">Address</label>
        <input value={address} onChange={e=>setAddress(e.target.value)} className="w-full border p-2 rounded" />
        <label className="block mt-2">Total Slots</label>
        <input value={totalSlots} onChange={e=>setTotalSlots(Number(e.target.value))} type="number" className="w-full border p-2 rounded" />
        <div className="mt-4">Enter Coordinates</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input placeholder="Latitude" value={placed?.lat||''} onChange={e=>setPlaced({...placed, lat: Number(e.target.value)})} className="border p-2 rounded" />
          <input placeholder="Longitude" value={placed?.lng||''} onChange={e=>setPlaced({...placed, lng: Number(e.target.value)})} className="border p-2 rounded" />
        </div>
        <div className="mt-4">
          <button onClick={save} id="saveLot" className="bg-green-600 text-white px-3 py-1 rounded">Save Lot</button>
          <a className="ml-3 text-slate-600" href="/owner/dashboard">Cancel</a>
        </div>
      </div>
    </div>
  )
}