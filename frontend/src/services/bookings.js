import api from '../utils/api'

export async function createBooking(slotId) {
  const res = await api.post('/bookings/', { slot: slotId })
  return res.data
}

export async function listBookings() {
  const res = await api.get('/bookings/')
  return res.data
}

export async function getBooking(id) {
  const res = await api.get(`/bookings/${id}/`)
  return res.data
}