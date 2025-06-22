import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { GeoJSON } from 'geojson'

interface MapComponentProps {
  reviers?: Array<{
    id: string
    geojson: GeoJSON
  }>
  markers?: Array<{
    id: string
    coordinates: [number, number]
    color?: string
    popup?: string
  }>
  center?: [number, number]
  zoom?: number
  className?: string
  onMapLoad?: (map: maplibregl.Map) => void
}

export function MapComponent({
  reviers = [],
  markers = [],
  center = [8.6821, 50.1109],
  zoom = 6,
  className,
  onMapLoad,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      // Use MapTiler if API key is available, otherwise fallback to OpenStreetMap
      const mapTilerKey = import.meta.env.VITE_MAPTILER_KEY;
      const mapStyle = mapTilerKey && mapTilerKey !== 'undefined' 
        ? `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerKey}`
        : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'; // Free alternative

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center,
        zoom,
      });

      map.on('load', () => {
        mapInstance.current = map
        onMapLoad?.(map)
      })
    }
  }, [center, zoom, onMapLoad])

  // Update reviers layer
  useEffect(() => {
    const map = mapInstance.current
    if (!map || !reviers) return

    reviers.forEach(({ id, geojson }) => {
      const source = map.getSource(id) as maplibregl.GeoJSONSource | undefined

      if (source) {
        // Source exists, just update data
        source.setData(geojson)
      } else {
        // Source doesn't exist, add it and the layers
        map.addSource(id, {
          type: 'geojson',
          data: geojson,
        })
        map.addLayer({
          id: `${id}-fill`,
          type: 'fill',
          source: id,
          paint: {
            'fill-color': '#3b82f6',
            'fill-opacity': 0.2,
          },
        })
        map.addLayer({
          id: `${id}-outline`,
          type: 'line',
          source: id,
          paint: {
            'line-color': '#1e40af',
            'line-width': 2,
          },
        })
      }
    })

    // Clean up old sources and layers that are no longer in props
    const currentRevierIds = reviers.map(r => r.id)
    map.getStyle().layers.forEach(layer => {
        const layerId = layer.id;
        if (layerId.endsWith('-fill') || layerId.endsWith('-outline')) {
            const revierId = layerId.replace(/-fill|-outline/, '');
            if (!currentRevierIds.includes(revierId)) {
                map.removeLayer(layerId);
                if(layerId.endsWith('-fill')) { // remove source only once
                    map.removeSource(revierId);
                }
            }
        }
    });

  }, [reviers])

  // Handle markers
  useEffect(() => {
    const map = mapInstance.current
    if (!map || !markers) return

    // Simple way to manage markers: remove all and add new ones
    // For high-performance scenarios, a more sophisticated diffing would be needed
    const existingMarkers = document.querySelectorAll('.maplibre-marker')
    existingMarkers.forEach(marker => marker.remove())

    markers.forEach(({ coordinates, color, popup }) => {
      const marker = new maplibregl.Marker({ color })
        .setLngLat(coordinates)
      
      if (popup) {
        marker.setPopup(new maplibregl.Popup().setHTML(popup))
      }
      
      marker.addTo(map)
    })
  }, [markers])

  return <div ref={mapContainer} className={className || 'w-full h-full'} />
} 