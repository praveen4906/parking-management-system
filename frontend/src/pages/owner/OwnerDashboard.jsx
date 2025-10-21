import React from 'react'
import OwnerLots from './OwnerLots'
export default function OwnerDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Lot Owner Dashboard</h2>
        <a href="/owner/lots/new" className="bg-green-600 text-white px-3 py-1 rounded">New Lot</a>
      </div>
      <div className="mt-4">
        <OwnerLots />
      </div>
    </div>
  )
}