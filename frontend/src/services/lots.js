import api from '../utils/api'

export async function fetchAllLots() {
  const res = await api.get('/lots/')
  return res.data
}

export async function fetchMyLots() {
  const res = await api.get('/lots/mine/')
  return res.data
}

export async function createLot(payload) {
  const res = await api.post('/lots/', payload)
  return res.data
}

export async function updateLot(id, payload) {
  const res = await api.put(`/lots/${id}/`, payload)
  return res.data
}