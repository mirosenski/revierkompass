// Routing service for calculating routes between points
import { 
  calculateRoute as osrmCalculateRoute, 
  decodePolyline, 
  formatDuration as osrmFormatDuration, 
  formatDistance as osrmFormatDistance,
  calculateHaversineDistance,
  type OSRMResponse,
  type OSRMRoute
} from './osrm'

export interface RoutePoint {
  lng: number
  lat: number
  name?: string
}

export interface RouteResult {
  coordinates: number[][]
  distance: number // in meters
  duration: number // in seconds
  summary: string
  steps?: Array<{
    distance: number
    duration: number
    instruction: string
    location: [number, number]
  }>
}

// Enhanced route calculation with OSRM integration
export async function calculateRoute(
  start: RoutePoint,
  end: RoutePoint,
  via?: RoutePoint[]
): Promise<RouteResult> {
  const points = [start, ...(via || []), end]
  const waypoints = points.map(p => [p.lng, p.lat])
  
  try {
    // Try OSRM first
    const osrmResponse = await osrmCalculateRoute(waypoints, {
      steps: true,
      geometries: 'polyline6',
      overview: 'full'
    })
    
    if (osrmResponse.routes && osrmResponse.routes.length > 0) {
      const route = osrmResponse.routes[0]
      const coordinates = decodePolyline(route.geometry)
      
      // Extract step-by-step instructions
      const steps = route.legs.flatMap(leg => 
        leg.steps.map(step => ({
          distance: step.distance,
          duration: step.duration,
          instruction: step.maneuver.type === 'depart' ? 
            `Start bei ${step.name}` : 
            step.maneuver.type === 'arrive' ? 
            `Ankunft bei ${step.name}` : 
            `${step.maneuver.modifier || ''} ${step.maneuver.type} auf ${step.name}`.trim(),
          location: step.maneuver.location as [number, number]
        }))
      )
      
      return {
        coordinates,
        distance: route.distance,
        duration: route.duration,
        summary: `${osrmFormatDistance(route.distance)}, ${osrmFormatDuration(route.duration)}`,
        steps
      }
    }
    
    throw new Error('No route found in OSRM response')
  } catch (error) {
    console.error('OSRM routing failed, using fallback:', error)
    
    // Fallback: straight line route with Haversine calculation
    const coordinates = waypoints
    const distance = calculateTotalDistance(waypoints)
    const estimatedDuration = distance / 13.89 // Assume 50 km/h average
    
    return {
      coordinates,
      distance,
      duration: estimatedDuration,
      summary: `Direkte Route: ${osrmFormatDistance(distance)}, ~${osrmFormatDuration(estimatedDuration)}`,
      steps: [{
        distance,
        duration: estimatedDuration,
        instruction: `Direkte Route von ${start.name || 'Start'} nach ${end.name || 'Ziel'}`,
        location: [start.lng, start.lat]
      }]
    }
  }
}

// Calculate total distance for multiple waypoints
function calculateTotalDistance(waypoints: number[][]): number {
  let totalDistance = 0
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistance += calculateHaversineDistance(waypoints[i], waypoints[i + 1])
  }
  
  return totalDistance
}

// Find nearest point from a list of points
export function findNearestPoint(
  target: RoutePoint,
  points: RoutePoint[]
): { point: RoutePoint; distance: number } {
  if (points.length === 0) {
    throw new Error('No points provided')
  }
  
  let nearest = points[0]
  let minDistance = calculateHaversineDistance([target.lng, target.lat], [nearest.lng, nearest.lat])
  
  for (const point of points.slice(1)) {
    const distance = calculateHaversineDistance([target.lng, target.lat], [point.lng, point.lat])
    if (distance < minDistance) {
      minDistance = distance
      nearest = point
    }
  }
  
  return { point: nearest, distance: minDistance }
}

// Calculate route to nearest police station
export async function routeToNearestStation(
  userLocation: RoutePoint,
  stations: RoutePoint[]
): Promise<RouteResult | null> {
  if (stations.length === 0) return null
  
  const nearest = findNearestPoint(userLocation, stations)
  
  return await calculateRoute(userLocation, nearest.point)
}

// Calculate optimized route for multiple stations (TSP)
export async function calculateOptimizedStationRoute(
  userLocation: RoutePoint,
  stations: RoutePoint[]
): Promise<RouteResult | null> {
  if (stations.length === 0) return null
  
  try {
    const { calculateOptimizedRoute } = await import('./osrm')
    const waypoints = [userLocation, ...stations].map(p => [p.lng, p.lat])
    
    const result = await calculateOptimizedRoute(waypoints, {
      source: 'first',
      destination: 'first',
      roundtrip: true
    })
    
    if (result.routes && result.routes.length > 0) {
      const route = result.routes[0]
      const coordinates = decodePolyline(route.geometry)
      
      return {
        coordinates,
        distance: route.distance,
        duration: route.duration,
        summary: `Optimierte Route: ${osrmFormatDistance(route.distance)}, ${osrmFormatDuration(route.duration)}`
      }
    }
  } catch (error) {
    console.error('Optimized route calculation failed:', error)
  }
  
  // Fallback to nearest station
  return routeToNearestStation(userLocation, stations)
}

// Get distance matrix for multiple points
export async function getDistanceMatrix(
  points: RoutePoint[]
): Promise<{
  distances: number[][]
  durations: number[][]
  nearestIndices: number[]
}> {
  try {
    const { getDistanceMatrix } = await import('./osrm')
    const waypoints = points.map(p => [p.lng, p.lat])
    
    const result = await getDistanceMatrix(waypoints)
    
    // Find nearest points for each point
    const nearestIndices = result.distances.map(distances => 
      distances.indexOf(Math.min(...distances.filter(d => d > 0)))
    )
    
    return {
      distances: result.distances,
      durations: result.durations,
      nearestIndices
    }
  } catch (error) {
    console.error('Distance matrix calculation failed:', error)
    
    // Fallback: calculate using Haversine
    const distances: number[][] = []
    const durations: number[][] = []
    const nearestIndices: number[] = []
    
    for (let i = 0; i < points.length; i++) {
      const rowDistances: number[] = []
      const rowDurations: number[] = []
      
      for (let j = 0; j < points.length; j++) {
        if (i === j) {
          rowDistances.push(0)
          rowDurations.push(0)
        } else {
          const distance = calculateHaversineDistance(
            [points[i].lng, points[i].lat],
            [points[j].lng, points[j].lat]
          )
          rowDistances.push(distance)
          rowDurations.push(distance / 13.89) // Assume 50 km/h
        }
      }
      
      distances.push(rowDistances)
      durations.push(rowDurations)
      
      // Find nearest (excluding self)
      const minDistance = Math.min(...rowDistances.filter(d => d > 0))
      nearestIndices.push(rowDistances.indexOf(minDistance))
    }
    
    return { distances, durations, nearestIndices }
  }
}

// Format distance for display (re-export from OSRM service)
export const formatDistance = osrmFormatDistance

// Format duration for display (re-export from OSRM service)
export const formatDuration = osrmFormatDuration

// Calculate distance between two points (re-export from OSRM service)
export const calculateDistance = calculateHaversineDistance 