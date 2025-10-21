import React, { useState } from 'react'
import api from '../utils/api'

export default function Register() {
  const [role, setRole] = useState('driver')
  const [form, setForm] = useState({ username:'', email:'', phone:'', password:'' })

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/users/', { ...form, role })
      alert('Registered. Please login.')
      window.location.href = '/#/login'
    } catch (err) {
      console.error(err)
      alert('Registration failed')
    }
  }

  return (
    <section className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setRole('driver')} className={`px-3 py-1 rounded ${role==='driver'?'bg-indigo-50':''}`}>Driver</button>
        <button onClick={() => setRole('owner')} className={`px-3 py-1 rounded ${role==='owner'?'bg-indigo-50':''}`}>Parking Owner</button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input name="username" value={form.username} onChange={handle} required placeholder="Username" className="w-full border p-2 rounded" />
        <input name="email" value={form.email} onChange={handle} placeholder="Email" className="w-full border p-2 rounded" />
        <input name="phone" value={form.phone} onChange={handle} placeholder="Phone" className="w-full border p-2 rounded" />
        <input name="password" value={form.password} onChange={handle} type="password" required placeholder="Password" className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </section>
  )
}