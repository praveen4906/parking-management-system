import api from './api'

export function saveTokens({ access, refresh }) {
  localStorage.setItem('access_token', access)
  if (refresh) localStorage.setItem('refresh_token', refresh)
}

export function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export function isAuthenticated() {
  return !!localStorage.getItem('access_token')
}

export function getTokenPayload() {
  const token = localStorage.getItem('access_token')
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

export async function ensureAuth() {
  const token = localStorage.getItem('access_token')
  if (!token) return false
  const payload = getTokenPayload()
  if (!payload) { clearTokens(); return false }
  if (payload.exp && Date.now() / 1000 > payload.exp) {
    // try refresh
    const refresh = localStorage.getItem('refresh_token')
    if (!refresh) { clearTokens(); return false }
    try {
      const res = await api.post('/token/refresh/', { refresh })
      saveTokens({ access: res.data.access, refresh })
      return true
    } catch (err) {
      clearTokens()
      return false
    }
  }
  return true
}