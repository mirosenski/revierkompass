import { useState, useEffect, useCallback } from 'react'
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
  Loader2,
  Navigation,
  Zap,
  Target,
  Users
} from 'lucide-react'
import type { Map as MapInstance } from 'maplibre-gl'
import { 
  calculateRoute, 
  routeToNearestStation,
  calculateOptimizedStationRoute,
  getDistanceMatrix,
  formatDistance, 
  formatDuration,
  type RoutePoint,
  type RouteResult 
} from '../../services/routing'

interface AdvancedMapProps {
  className?: string
  stations: Array<{
    id: string
    name: string
    coordinates: [number, number]
    address: string
  }>
  userLocation?: [number, number]
}

export function AdvancedMap({ 
  className = '', 
  stations,
  userLocation 
}: AdvancedMapProps) {
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null)
  const [selectedStations, setSelectedStations] = useState<string[]>([])
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null)
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredStations, setFilteredStations] = useState(stations)
  const [routeMode, setRouteMode] = useState<'nearest' | 'optimized' | 'custom'>('nearest')
  const [distanceMatrix, setDistanceMatrix] = useState<{
    distances: number[][]
    durations: number[][]
    nearestIndices: number[]
  } | null>(null)

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

  const handleStationToggle = (stationId: string) => {
    setSelectedStations(prev => 
      prev.includes(stationId) 
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId]
    )
  }

  const handleCalculateRoute = useCallback(async () => {
    if (!userLocation) {
      alert('Bitte aktivieren Sie zuerst Ihren Standort')
      return
    }

    setIsCalculatingRoute(true)

    try {
      let result: RouteResult | null = null

      if (routeMode === 'nearest') {
        // Route to nearest station
        result = await routeToNearestStation(
          { lng: userLocation[0], lat: userLocation[1] },
          stations.map(s => ({ lng: s.coordinates[0], lat: s.coordinates[1], name: s.name }))
        )
      } else if (routeMode === 'optimized') {
        // Optimized route through all stations
        const stationPoints = stations.map(s => ({ 
          lng: s.coordinates[0], 
          lat: s.coordinates[1], 
          name: s.name 
        }))
        result = await calculateOptimizedStationRoute(
          { lng: userLocation[0], lat: userLocation[1] },
          stationPoints
        )
      } else if (routeMode === 'custom' && selectedStations.length > 0) {
        // Custom route through selected stations
        const selectedStationPoints = selectedStations.map(id => {
          const station = stations.find(s => s.id === id)!
          return { lng: station.coordinates[0], lat: station.coordinates[1], name: station.name }
        })
        
        if (selectedStationPoints.length === 1) {
          result = await calculateRoute(
            { lng: userLocation[0], lat: userLocation[1] },
            selectedStationPoints[0]
          )
        } else {
          // Multiple stations - calculate optimized route
          result = await calculateOptimizedStationRoute(
            { lng: userLocation[0], lat: userLocation[1] },
            selectedStationPoints
          )
        }
      }

      if (result) {
        setRouteResult(result)
        
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
                coordinates: result.coordinates
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
              'line-color': routeMode === 'optimized' ? '#10b981' : '#3b82f6',
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
              'line-color': routeMode === 'optimized' ? '#059669' : '#1e40af',
              'line-width': 6,
              'line-opacity': 0.4
            }
          }, 'route-line')

          // Fit map to route bounds
          const bounds = new (window as any).maplibregl.LngLatBounds()
          result.coordinates.forEach(coord => {
            bounds.extend(coord)
          })
          mapInstance.fitBounds(bounds, { padding: 50, duration: 1000 })
        }
      }
    } catch (error) {
      console.error('Route calculation failed:', error)
      alert('Routenberechnung fehlgeschlagen')
    } finally {
      setIsCalculatingRoute(false)
    }
  }, [userLocation, stations, selectedStations, routeMode, mapInstance])

  const handleCalculateDistanceMatrix = async () => {
    if (stations.length === 0) return

    setIsCalculatingRoute(true)

    try {
      const stationPoints = stations.map(s => ({ 
        lng: s.coordinates[0], 
        lat: s.coordinates[1], 
        name: s.name 
      }))
      
      const matrix = await getDistanceMatrix(stationPoints)
      setDistanceMatrix(matrix)
    } catch (error) {
      console.error('Distance matrix calculation failed:', error)
      alert('Distanzmatrix-Berechnung fehlgeschlagen')
    } finally {
      setIsCalculatingRoute(false)
    }
  }

  const handleClearRoute = () => {
    setSelectedStations([])
    setRouteResult(null)
    setDistanceMatrix(null)
    
    if (mapInstance) {
      if (mapInstance.getLayer('route-line')) {
        mapInstance.removeLayer('route-line')
        mapInstance.removeLayer('route-outline')
        mapInstance.removeSource('route')
      }
    }
  }

  // Create markers for the map
  const markers = filteredStations.map(station => {
    const isSelected = selectedStations.includes(station.id)
    return {
      id: station.id,
      coordinates: station.coordinates,
      color: isSelected ? '#ef4444' : '#3b82f6',
      popup: `<strong>${station.name}</strong><br/>${station.address}`,
    }
  })

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

            {/* Route Mode Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Routen-Modus:
              </label>
              <div className="flex gap-2">
                <Button
                  variant={routeMode === 'nearest' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRouteMode('nearest')}
                >
                  <Target className="h-4 w-4 mr-1" />
                  Nächstes
                </Button>
                <Button
                  variant={routeMode === 'optimized' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRouteMode('optimized')}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Optimiert
                </Button>
                <Button
                  variant={routeMode === 'custom' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRouteMode('custom')}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Auswahl
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {filteredStations.map(station => (
                <div
                  key={station.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedStations.includes(station.id)
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleStationToggle(station.id)}
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
                    {selectedStations.includes(station.id) && (
                      <Badge variant="destructive" className="ml-2">
                        Ausgewählt
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {userLocation && (
                <Button
                  onClick={handleCalculateRoute}
                  disabled={isCalculatingRoute || (routeMode === 'custom' && selectedStations.length === 0)}
                  className="w-full"
                >
                  {isCalculatingRoute ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Navigation className="h-4 w-4 mr-2" />
                  )}
                  Route berechnen
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={handleCalculateDistanceMatrix}
                disabled={isCalculatingRoute}
                className="w-full"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Distanzmatrix
              </Button>
            </div>
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

              {/* Route Steps */}
              {routeResult.steps && routeResult.steps.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Wegbeschreibung:
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {routeResult.steps.map((step, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                        {step.instruction}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Distance Matrix Panel */}
      {distanceMatrix && (
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Distanzmatrix
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDistanceMatrix(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left p-1">Revier</th>
                    <th className="text-left p-1">Nächstes</th>
                    <th className="text-left p-1">Entfernung</th>
                  </tr>
                </thead>
                <tbody>
                  {stations.map((station, index) => {
                    const nearestIndex = distanceMatrix.nearestIndices[index]
                    const nearestStation = stations[nearestIndex]
                    const distance = distanceMatrix.distances[index][nearestIndex]
                    
                    return (
                      <tr key={station.id} className="border-t">
                        <td className="p-1 font-medium">{station.name}</td>
                        <td className="p-1">{nearestStation.name}</td>
                        <td className="p-1">{formatDistance(distance)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Global function for marker popup buttons */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.toggleStation = function(stationId) {
              window.dispatchEvent(new CustomEvent('toggleStation', { detail: stationId }));
            };
          `
        }}
      />
    </div>
  )
} 