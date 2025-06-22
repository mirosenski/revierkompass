import { useState, useEffect } from 'react'
import { MapComponent as Map } from './Map'
import { Button } from './button'
import { Card } from './card'
import { Input } from './input'
import { Badge } from './badge'
import { 
  MapPin, 
  Clock, 
  Route, 
  Search,
  X,
  Loader2
} from 'lucide-react'
import type { Map as MapInstance } from 'maplibre-gl'
import { 
  calculateRoute, 
  routeToNearestStation, 
  formatDistance, 
  formatDuration,
  type RouteResult 
} from '../../services/routing'

interface MapWithRoutingProps {
  className?: string
  stations: Array<{
    id: string
    name: string
    coordinates: [number, number]
    address: string
  }>
  userLocation?: [number, number]
}

export function MapWithRouting({ 
  className = '', 
  stations,
  userLocation 
}: MapWithRoutingProps) {
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null)
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null)
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredStations, setFilteredStations] = useState(stations)

  // Filter stations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStations(stations)
    } else {
      const filtered = stations.filter(station =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredStations(filtered)
    }
  }, [searchQuery, stations])

  const reviersForMap = filteredStations.map(station => ({
    id: station.id,
    geojson: {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: station.coordinates,
      },
      properties: {
        name: station.name,
      },
    },
  }))

  const handleMapLoad = (map: MapInstance) => {
    setMapInstance(map)
  }

  const handleStationSelect = async (stationId: string) => {
    setSelectedStation(stationId)
    
    if (!userLocation) {
      alert('Bitte aktivieren Sie zuerst Ihren Standort')
      return
    }

    const station = stations.find(s => s.id === stationId)
    if (!station) return

    setIsCalculatingRoute(true)

    try {
      const route = await calculateRoute(
        { lng: userLocation[0], lat: userLocation[1] },
        { lng: station.coordinates[0], lat: station.coordinates[1] }
      )
      
      setRouteResult(route)
      
      // Update map with route
      if (mapInstance) {
        // Remove existing route
        if (mapInstance.getLayer('route-line')) {
          mapInstance.removeLayer('route-line')
          mapInstance.removeLayer('route-outline')
          mapInstance.removeSource('route')
        }

        // Add new route
        mapInstance.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route.coordinates
            }
          }
        })

        mapInstance.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
            'line-opacity': 0.8
          }
        })

        mapInstance.addLayer({
          id: 'route-outline',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#1e40af',
            'line-width': 6,
            'line-opacity': 0.4
          }
        }, 'route-line')

        // Fit map to route bounds
        const bounds = new (window as any).maplibregl.LngLatBounds()
        route.coordinates.forEach(coord => {
          bounds.extend(coord)
        })
        mapInstance.fitBounds(bounds, { padding: 50, duration: 1000 })
      }
    } catch (error) {
      console.error('Route calculation failed:', error)
      alert('Routenberechnung fehlgeschlagen')
    } finally {
      setIsCalculatingRoute(false)
    }
  }

  const handleClearRoute = () => {
    setSelectedStation(null)
    setRouteResult(null)
    
    if (mapInstance) {
      if (mapInstance.getLayer('route-line')) {
        mapInstance.removeLayer('route-line')
        mapInstance.removeLayer('route-outline')
        mapInstance.removeSource('route')
      }
    }
  }

  const handleFindNearest = async () => {
    if (!userLocation) {
      alert('Bitte aktivieren Sie zuerst Ihren Standort')
      return
    }

    setIsCalculatingRoute(true)

    try {
      const route = await routeToNearestStation(
        { lng: userLocation[0], lat: userLocation[1] },
        stations.map(s => ({ lng: s.coordinates[0], lat: s.coordinates[1], name: s.name }))
      )

      if (route) {
        setRouteResult(route)
        // Find the nearest station
        const nearestStation = stations.find(s => {
          const stationPoint = { lng: s.coordinates[0], lat: s.coordinates[1] }
          const userPoint = { lng: userLocation[0], lat: userLocation[1] }
          const distance = Math.sqrt(
            Math.pow(stationPoint.lng - userPoint.lng, 2) + 
            Math.pow(stationPoint.lat - userPoint.lat, 2)
          )
          return distance < 0.01 // Rough approximation
        })
        
        if (nearestStation) {
          setSelectedStation(nearestStation.id)
        }
      }
    } catch (error) {
      console.error('Nearest station calculation failed:', error)
      alert('Berechnung des nächsten Reviers fehlgeschlagen')
    } finally {
      setIsCalculatingRoute(false)
    }
  }

  const markers = filteredStations.map(station => ({
    id: station.id,
    coordinates: station.coordinates,
    color: selectedStation === station.id ? '#ef4444' : '#3b82f6',
    popup: `
      <strong>${station.name}</strong><br/>
      ${station.address}<br/>
      <button onclick="window.selectStation('${station.id}')" 
              style="background: #3b82f6; color: white; padding: 4px 8px; border: none; border-radius: 4px; margin-top: 4px; cursor: pointer;">
        Route berechnen
      </button>
    `
  }))

  // Add user location marker
  if (userLocation) {
    markers.push({
      id: 'user-location',
      coordinates: userLocation,
      color: '#10b981',
      popup: '<strong>Ihr Standort</strong>'
    })
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex-grow relative">
        <Map
          className="w-full h-full"
          onMapLoad={handleMapLoad}
          reviers={reviersForMap}
        />
        {isCalculatingRoute && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin" />
          </div>
        )}
      </div>

      {/* Station List Panel */}
      <div className="absolute top-4 left-4 w-80 max-h-96 overflow-y-auto">
        <Card className="p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Revier suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="space-y-2">
              {filteredStations.map(station => (
                <div
                  key={station.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedStation === station.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleStationSelect(station.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {station.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {station.address}
                      </p>
                    </div>
                    {selectedStation === station.id && (
                      <Badge variant="secondary" className="ml-2">
                        Ausgewählt
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {userLocation && (
              <Button
                onClick={handleFindNearest}
                disabled={isCalculatingRoute}
                className="w-full"
              >
                {isCalculatingRoute ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <MapPin className="h-4 w-4 mr-2" />
                )}
                Nächstes Revier finden
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Route Information Panel */}
      {routeResult && (
        <div className="absolute top-4 right-4 w-80">
          <Card className="p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Route Information
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearRoute}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Route className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {routeResult.summary}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDistance(routeResult.distance)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDuration(routeResult.duration)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Global function for marker popup buttons */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.selectStation = function(stationId) {
              window.dispatchEvent(new CustomEvent('selectStation', { detail: stationId }));
            };
          `
        }}
      />
    </div>
  )
} 