import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import api from '../utils/api'

// center India by default
const INDIA_CENTER = [20.5937, 78.9629]

export default function Map({
  center = INDIA_CENTER,
  zoom = 5,
  onMarkerClick = () => {},
  markers = [],
  showRoute = null // { from: [lat,lng], to: [lat,lng] }
}) {
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const leafletMarkersRef = useRef([])
  const routeRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    mapRef.current = L.map(containerRef.current).setView(center, zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current)

    return () => {
      mapRef.current.remove()
      leafletMarkersRef.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    // clear existing markers
    leafletMarkersRef.current.forEach(m => m.remove())
    leafletMarkersRef.current = []

    markers.forEach(lot => {
      const available = lot.available_slots ?? 0
      const total = lot.total_slots ?? 1
      const ratio = available / total
      const color = ratio > 0.6 ? 'green' : (ratio > 0.3 ? 'orange' : 'red')
      const marker = L.circleMarker([lot.lat, lot.lng], {
        radius: 8,
        color,
        fillColor: color,
        fillOpacity: 0.85
      }).addTo(mapRef.current)

      const popup = L.popup().setContent(`
        <div style="min-width:160px">
          <strong>${lot.name}</strong><br/>
          <small>${lot.address || ''}</small><br/>
          <div style="margin-top:6px">Available: ${available}/${total}</div>
        </div>
      `)
      marker.bindPopup(popup)
      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`view_${lot.id}`)
          if (btn) btn.onclick = () => onMarkerClick(lot)
        }, 50)
      })
      leafletMarkersRef.current.push(marker)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers])

  useEffect(() => {
    if (!mapRef.current) return
    if (routeRef.current) {
      routeRef.current.remove()
      routeRef.current = null
    }
    if (showRoute && showRoute.from && showRoute.to) {
      routeRef.current = L.polyline([showRoute.from, showRoute.to], { color: 'blue', weight: 4 }).addTo(mapRef.current)
      mapRef.current.fitBounds(routeRef.current.getBounds(), { padding: [40, 40] })
    }
  }, [showRoute])

  return <div id="map" ref={containerRef} className="rounded shadow" />
}