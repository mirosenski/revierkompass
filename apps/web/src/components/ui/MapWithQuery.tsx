import { useEffect } from 'react'
import { Map } from 'maplibre-gl'
import { useViewport, useMapConfig, useMapInstance, useLayerVisibility, usePrefetchMapData } from '@/stores/mapQuery'

interface MapWithQueryProps {
  containerId: string
}

export function MapWithQuery({ containerId }: MapWithQueryProps) {
  const { viewport, updateViewport } = useViewport()
  const { data: config } = useMapConfig()
  const { map, setMap } = useMapInstance()
  const { layers, toggleLayer } = useLayerVisibility()
  const prefetchMapData = usePrefetchMapData()

  // Prefetch data on mount
  useEffect(() => {
    prefetchMapData()
  }, [prefetchMapData])

  // Initialize map
  useEffect(() => {
    if (!config || map) return

    const newMap = new Map({
      container: containerId,
      style: config.style,
      center: viewport.center,
      zoom: viewport.zoom,
      bearing: viewport.bearing,
      pitch: viewport.pitch,
      maxZoom: config.maxZoom,
      minZoom: config.minZoom,
      bounds: config.bounds,
    })

    // Set up event listeners
    newMap.on('moveend', () => {
      const center = newMap.getCenter()
      const zoom = newMap.getZoom()
      const bearing = newMap.getBearing()
      const pitch = newMap.getPitch()

      updateViewport({
        center: [center.lng, center.lat],
        zoom,
        bearing,
        pitch,
      })
    })

    // Store map instance
    setMap(newMap)

    // Cleanup
    return () => {
      newMap.remove()
      setMap(null)
    }
  }, [config, containerId, viewport, map, setMap, updateViewport])

  // Apply viewport changes to map
  useEffect(() => {
    if (!map) return

    const currentCenter = map.getCenter()
    const currentZoom = map.getZoom()
    const currentBearing = map.getBearing()
    const currentPitch = map.getPitch()

    // Only update if values have actually changed
    if (
      currentCenter.lng !== viewport.center[0] ||
      currentCenter.lat !== viewport.center[1] ||
      currentZoom !== viewport.zoom ||
      currentBearing !== viewport.bearing ||
      currentPitch !== viewport.pitch
    ) {
      map.setCenter(viewport.center)
      map.setZoom(viewport.zoom)
      map.setBearing(viewport.bearing)
      map.setPitch(viewport.pitch)
    }
  }, [map, viewport])

  return (
    <div className="relative">
      <div id={containerId} className="w-full h-96" />
      
      {/* Layer Controls */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-2">Layer Controls</h3>
        {Object.entries(layers).map(([layer, visible]) => (
          <label key={layer} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={visible}
              onChange={() => toggleLayer(layer as keyof typeof layers)}
              className="rounded"
            />
            <span className="capitalize">{layer}</span>
          </label>
        ))}
      </div>

      {/* Viewport Info */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg text-sm">
        <div>Center: {viewport.center[0].toFixed(4)}, {viewport.center[1].toFixed(4)}</div>
        <div>Zoom: {viewport.zoom.toFixed(2)}</div>
        <div>Bearing: {viewport.bearing.toFixed(1)}°</div>
        <div>Pitch: {viewport.pitch.toFixed(1)}°</div>
      </div>
    </div>
  )
} 