import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import { getTokenPayload } from '../utils/auth'

export default function Profile() {
  const [me, setMe] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const users = await api.get('/users/')
        const payload = getTokenPayload()
        const found = users.data.find(u => u.username === payload?.username)
        setMe(found)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  if (!me) return <div>Loading...</div>

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <div><strong>Username:</strong> {me.username}</div>
        <div><strong>Email:</strong> {me.email || '-'}</div>
        <div><strong>Phone:</strong> {me.phone || '-'}</div>
        <div className="mt-3"><strong>Role:</strong> {me.role}</div>
      </div>
    </div>
  )
}