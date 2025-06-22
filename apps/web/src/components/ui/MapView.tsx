import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Navigation, ZoomIn, ZoomOut, Home, Layers } from 'lucide-react'
import { useMapStore } from '@/stores/map'
import { calculateRoute, decodePolyline, formatDistance, formatDuration } from '@/services/osrm'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'

interface MapViewProps {
  startCoordinates?: [number, number]
  destinations: Array<{
    id: string
    name: string
    coordinates: [number, number]
    address?: string
  }>
  className?: string
  onRouteCalculated?: (route: {
    distance: number
    duration: number
    geometry: number[][]
  }) => void
}

export function MapView({
  startCoordinates,
  destinations,
  className,
  onRouteCalculated,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [routeInfo, setRouteInfo] = useState<{
    distance: number
    duration: number
  } | null>(null)
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  
  const { setMap, layersVisibility, toggleLayer } = useMapStore()
  
  // Debounce props to avoid flickering/re-calc on rapid user input
  const debouncedStartCoordinates = useDebounce(startCoordinates, 500)
  const debouncedDestinations = useDebounce(destinations, 500)

  // Create a single, stable key from ALL data points to robustly detect real changes.
  // This is the definitive fix for the re-render loop.
  const dataKey = useMemo(() => {
    const startKey = debouncedStartCoordinates ? debouncedStartCoordinates.join(',') : 'no-start'
    const destsKey = debouncedDestinations?.map(d => d.id).sort().join(',') || 'no-dests'
    return `${startKey}|${destsKey}`
  }, [debouncedStartCoordinates, debouncedDestinations])

  // Keep a stable reference to the callback to prevent effect re-runs
  const onRouteCalculatedRef = useRef(onRouteCalculated)
  useEffect(() => {
    onRouteCalculatedRef.current = onRouteCalculated
  }, [onRouteCalculated])
  
  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return
    
    // Create map with preserveDrawingBuffer to prevent flickering
    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [8.6821, 50.1109], // Frankfurt
      zoom: 6,
      minZoom: 5,
      maxZoom: 18,
      // Important: Prevent flickering
      fadeDuration: 0,
    })
    
    // Add controls
    mapInstance.current.addControl(new maplibregl.NavigationControl(), 'top-right')
    mapInstance.current.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 200,
        unit: 'metric',
      }),
      'bottom-left'
    )
    
    // Set bounds to Germany
    const bounds = new maplibregl.LngLatBounds(
      [5.9, 47.3], // SW
      [15.0, 55.0]  // NE
    )
    mapInstance.current.setMaxBounds(bounds)
    
    // Store map instance
    setMap(mapInstance.current)
    
    // Map ready event
    mapInstance.current.on('load', () => {
      setIsMapReady(true)
      
      // Add layers after map is loaded
      if (mapInstance.current) {
        // Route layer
        mapInstance.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [],
            },
          },
        })
        
        mapInstance.current.addLayer({
          id: 'route-outline',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#1e40af',
            'line-width': 6,
            'line-opacity': 0.4,
          },
        })
        
        mapInstance.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
            'line-opacity': 0.8,
          },
        })
      }
    })
    
    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
        setMap(null)
      }
    }
  }, [setMap])
  
  // Master effect for all map updates (markers, route, bounds)
  // This is the core of the optimization, preventing re-renders from prop reference changes.
  useEffect(() => {
    if (!mapInstance.current || !isMapReady) return

    const map = mapInstance.current

    // --- 1. Update Markers & Bounds ---
    const markers = document.querySelectorAll('.maplibregl-marker')
    markers.forEach(marker => marker.remove())
    
    const allCoords: Array<[number, number]> = []
    
    if (debouncedStartCoordinates) {
      new maplibregl.Marker({ color: '#10b981' })
        .setLngLat(debouncedStartCoordinates)
        .setPopup(new maplibregl.Popup().setHTML('<strong>Startpunkt</strong>'))
        .addTo(map)
      allCoords.push(debouncedStartCoordinates)
    }

    debouncedDestinations.forEach((dest, index) => {
      const marker = new maplibregl.Marker({ color: '#3b82f6' })
        .setLngLat(dest.coordinates)
        .setPopup(
          new maplibregl.Popup().setHTML(
            `<div class="p-2"><strong>${dest.name}</strong>${
              dest.address ? `<br><small>${dest.address}</small>` : ''
            }</div>`,
          ),
        )
        .addTo(map)

      const el = marker.getElement()
      if (el) {
        const label = document.createElement('div')
        label.className = 'absolute -top-2 -right-2 bg-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-blue-500 shadow-sm'
        label.textContent = (index + 1).toString()
        el.appendChild(label)
      }
      allCoords.push(dest.coordinates)
    })

    if (allCoords.length > 0) {
      const bounds = new maplibregl.LngLatBounds()
      allCoords.forEach(coord => bounds.extend(coord))
      map.fitBounds(bounds, {
        padding: 100,
        duration: 500, // Shorter animation
      })
    }

    // --- 2. Calculate and Display Route ---
    const calculateAndDisplayRoute = async () => {
      if (!debouncedStartCoordinates || debouncedDestinations.length === 0) {
        return
      }

      setIsCalculatingRoute(true)
      setRouteError(null)

      try {
        const waypoints: Array<[number, number]> = [
          debouncedStartCoordinates,
          ...debouncedDestinations.map(d => d.coordinates),
        ]
        
        const response = await calculateRoute(waypoints, {
          overview: 'full',
          steps: true,
        })

        if (response.code !== 'Ok' || response.routes.length === 0) {
          throw new Error('Keine Route gefunden')
        }

        const route = response.routes[0]
        const geometry = decodePolyline(route.geometry)

        const source = map.getSource('route') as maplibregl.GeoJSONSource
        if (source) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: geometry,
            },
          })
        }
        
        const routeData = {
          distance: route.distance,
          duration: route.duration,
        }
        setRouteInfo(routeData)
        onRouteCalculatedRef.current?.({ ...routeData, geometry })

      } catch (err) {
        console.error('Route calculation error:', err)
        setRouteError('Routenberechnung fehlgeschlagen.')
        const source = map.getSource('route') as maplibregl.GeoJSONSource
        if (source) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: [] },
          })
        }
        setRouteInfo(null)
      } finally {
        setIsCalculatingRoute(false)
      }
    }

    if (layersVisibility.route) {
      calculateAndDisplayRoute()
    } else {
      // Clear route if visibility is off
      const source = map.getSource('route') as maplibregl.GeoJSONSource
      if (source) {
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [] },
        })
      }
      setRouteInfo(null)
    }
  }, [dataKey, isMapReady, layersVisibility.route])
  
  // Toggle route visibility
  useEffect(() => {
    if (!mapInstance.current || !isMapReady) return
    
    const visibility = layersVisibility.route ? 'visible' : 'none'
    mapInstance.current.setLayoutProperty('route', 'visibility', visibility)
    mapInstance.current.setLayoutProperty('route-outline', 'visibility', visibility)
  }, [layersVisibility.route, isMapReady])
  
  // Control handlers
  const handleZoomIn = useCallback(() => {
    mapInstance.current?.zoomIn()
  }, [])
  
  const handleZoomOut = useCallback(() => {
    mapInstance.current?.zoomOut()
  }, [])
  
  const handleResetView = useCallback(() => {
    if (!mapInstance.current || (!startCoordinates && destinations.length === 0)) return
    
    const coords: number[][] = []
    if (startCoordinates) coords.push(startCoordinates)
    coords.push(...destinations.map(d => d.coordinates))
    
    const bounds = new maplibregl.LngLatBounds()
    coords.forEach(coord => bounds.extend(coord as [number, number]))
    
    mapInstance.current.fitBounds(bounds, {
      padding: 100,
      duration: 1000,
    })
  }, [startCoordinates, destinations])
  
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div 
        ref={mapContainer} 
        className="h-full w-full"
        style={{ 
          // Prevent flickering with CSS
          backfaceVisibility: 'hidden',
          perspective: 1000,
          transform: 'translateZ(0)',
        }}
      />
      
      {/* Loading overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Karte wird geladen...</p>
          </div>
        </div>
      )}
      
      {/* Custom controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          className="h-8 w-8 shadow-lg"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          className="h-8 w-8 shadow-lg"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleResetView}
          className="h-8 w-8 shadow-lg"
        >
          <Home className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={layersVisibility.route ? 'default' : 'secondary'}
          onClick={() => toggleLayer('route')}
          className="h-8 w-8 shadow-lg"
          disabled={isCalculatingRoute}
        >
          <Layers className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Route info */}
      {routeInfo && layersVisibility.route && (
        <Card className="absolute bottom-4 left-4 p-4 shadow-lg">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatDistance(routeInfo.distance)}</span>
            </div>
            <div className="text-muted-foreground">•</div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{formatDuration(routeInfo.duration)}</span>
            </div>
          </div>
        </Card>
      )}
      
      {/* Route calculation loading */}
      {isCalculatingRoute && layersVisibility.route && (
        <Card className="absolute bottom-4 right-4 p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-muted-foreground">Route wird berechnet...</span>
          </div>
        </Card>
      )}
      
      {/* Route error */}
      {routeError && (
        <div className="absolute top-4 right-4 max-w-sm">
          <Card className="border-destructive bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{routeError}</p>
          </Card>
        </div>
      )}
    </Card>
  )
} 