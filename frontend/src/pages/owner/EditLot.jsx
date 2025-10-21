import React, { useEffect, useState } from 'react'
import api from '../../utils/api'
import { useParams } from 'react-router-dom'

export default function EditLot() {
  const { id } = useParams()
  const [lot, setLot] = useState(null)

  useEffect(() => {
    api.get(`/lots/${id}/`).then(res => setLot(res.data)).catch(()=>alert('Failed to load'))
  }, [id])

  const save = async () => {
    try {
      await api.put(`/lots/${id}/`, lot)
      alert('Saved')
      window.location.href = '/#/owner/lots'
    } catch (err) {
      console.error(err)
      alert('Save failed')
    }
  }

  if (!lot) return <div>Loading...</div>

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Edit Lot</h2>
      <div className="bg-white p-4 rounded shadow mt-4">
        <label className="block">Name</label>
        <input value={lot.name} onChange={e=>setLot({...lot, name: e.target.value})} className="w-full border p-2 rounded" />
        <label className="block mt-2">Address</label>
        <input value={lot.address} onChange={e=>setLot({...lot, address: e.target.value})} className="w-full border p-2 rounded" />
        <label className="block mt-2">Total Slots</label>
        <input type="number" value={lot.total_slots} onChange={e=>setLot({...lot, total_slots: Number(e.target.value)})} className="w-full border p-2 rounded" />
        <label className="block mt-2">Latitude</label>
        <input value={lot.lat} onChange={e=>setLot({...lot, lat: Number(e.target.value)})} className="w-full border p-2 rounded" />
        <label className="block mt-2">Longitude</label>
        <input value={lot.lng} onChange={e=>setLot({...lot, lng: Number(e.target.value)})} className="w-full border p-2 rounded" />
        <div className="mt-4 flex gap-2">
          <button onClick={save} className="bg-indigo-600 text-white px-3 py-1 rounded">Save</button>
          <a className="text-slate-600" href="/owner/lots">Cancel</a>
        </div>
      </div>
    </div>
  )
}