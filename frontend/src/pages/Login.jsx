import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveTokens } from '../utils/auth'
import api from '../utils/api'
import Navbar from '../components/Navbar'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/token/', { username, password })
      saveTokens({ access: res.data.access, refresh: res.data.refresh })
      navigate('/dashboard')
      window.location.reload()
    } catch (err) {
      alert('Login failed')
      console.error(err)
    }
  }

  return (
    <section className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={username} onChange={e => setUsername(e.target.value)} required placeholder="Username" className="w-full border p-2 rounded" />
        <input value={password} onChange={e => setPassword(e.target.value)} required type="password" placeholder="Password" className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded">Login</button>
      </form>
    </section>
  )
}