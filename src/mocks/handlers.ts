import { http, HttpResponse } from 'msw'
import type { OptimizedRouteResponse } from '@/@types/global'

// Mock data para capa de contaminación
export const MOCK_POLLUTION_DATA = [
  { lat: 40.4168, long: -3.7038, value: 0.8, timestamp: new Date() }, // Madrid
  { lat: 41.3851, long: 2.1734, value: 0.6, timestamp: new Date() },  // Barcelona
  { lat: 39.4699, long: -0.3763, value: 0.4, timestamp: new Date() }, // Valencia
  { lat: 37.3891, long: -5.9845, value: 0.7, timestamp: new Date() }, // Sevilla
  { lat: 43.2627, long: -2.9253, value: 0.3, timestamp: new Date() }, // Bilbao
]

// Mock route geometry (simple line from Madrid to Barcelona)
const MOCK_ROUTE_GEOMETRY: GeoJSON.LineString = {
  type: 'LineString',
  coordinates: [
    [-3.7038, 40.4168], // Madrid
    [-3.5, 40.8],       // Guadalajara
    [-2.0, 41.0],       // Zaragoza
    [1.5, 41.2],        // Lleida  
    [2.1734, 41.3851],  // Barcelona
  ]
}

export const handlers = [
  // POST /api/routes/optimize - Optimizar ruta
  http.post('/api/routes/optimize', async ({ request }) => {
    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const requestBody = await request.json() as {
      origin: { latitude: number; longitude: number; address?: string }
      destination: { latitude: number; longitude: number; address?: string }
      vehicleType: 'electric' | 'hybrid' | 'diesel' | 'gas'
    }

    // Calcular ahorros de CO2 basado en tipo de vehículo
    const co2Savings = {
      electric: 15.2,
      hybrid: 8.7,
      diesel: 3.1,
      gas: 2.4
    }[requestBody.vehicleType] || 5.0

    const response: OptimizedRouteResponse = {
      success: true,
      data: {
        optimizedRoute: {
          id: `route_${Date.now()}`,
          geometry: MOCK_ROUTE_GEOMETRY,
          distance: 621.5, // km
          duration: 375, // minutes
          co2Emissions: 45.3,
          co2Savings,
          vehicleType: requestBody.vehicleType,
        },
        alternatives: [
          {
            id: `alt_route_${Date.now()}_1`,
            geometry: MOCK_ROUTE_GEOMETRY,
            distance: 635.2,
            duration: 395,
            co2Emissions: 52.1,
            co2Savings: co2Savings * 0.8,
            vehicleType: requestBody.vehicleType,
          }
        ],
        stats: {
          totalCo2Savings: co2Savings,
          totalDistance: 621.5,
          totalTime: '6h 15min',
        }
      }
    }

    return HttpResponse.json(response)
  }),

  // GET /api/pollution/data - Obtener datos de contaminación
  http.get('/api/pollution/data', () => {
    return HttpResponse.json({
      success: true,
      data: MOCK_POLLUTION_DATA,
      timestamp: new Date().toISOString()
    })
  }),

  // GET /api/health - Health check
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      service: 'EcoRoute API Mock',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    })
  })
] 