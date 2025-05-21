import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import L from 'leaflet'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'leaflet/dist/leaflet.css'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || '' // use .env.local file

export default function CountryMap({ lat, lng, useMapbox = false }) {
  const mapRef = useRef(null)
  const leafletRef = useRef(null)

  useEffect(() => {
    if (!lat || !lng) return

    if (useMapbox && mapboxgl.accessToken) {
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: 3,
        pitch: 30,
        bearing: -10
      })

      new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map)
      map.flyTo({ center: [lng, lat], zoom: 5, essential: true })

      return () => map.remove()
    } else {
      const map = L.map(leafletRef.current).setView([lat, lng], 4)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map)
      L.marker([lat, lng]).addTo(map).bindPopup('Your Guess').openPopup()
      return () => map.remove()
    }
  }, [lat, lng, useMapbox])

  return useMapbox ? (
    <div ref={mapRef} className="h-64 w-full rounded shadow-md" />
  ) : (
    <div ref={leafletRef} className="h-64 w-full rounded shadow-md" />
  )
}
