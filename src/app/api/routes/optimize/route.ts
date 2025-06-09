import { NextRequest, NextResponse } from 'next/server'
import type { OptimizedRouteResponse } from '@/@types/global'

// Este endpoint por ahora devuelve datos mock, pero está preparado para conectar con backend real
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validación básica
    if (!body.origin || !body.destination || !body.vehicleType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Faltan campos requeridos: origin, destination, vehicleType' 
        },
        { status: 400 }
      )
    }

    // TODO: En producción, aquí se conectará con el microservicio de optimización
    // const optimizedData = await backendService.optimizeRoute(body)
    
    // Por ahora, simulamos el procesamiento y devolvemos datos mock
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock route geometry (Madrid to Barcelona)
    const mockGeometry: GeoJSON.LineString = {
      type: 'LineString',
      coordinates: [
        [-3.7038, 40.4168], // Madrid
        [-3.5, 40.8],       // Guadalajara
        [-2.0, 41.0],       // Zaragoza
        [1.5, 41.2],        // Lleida  
        [2.1734, 41.3851],  // Barcelona
      ]
    }

    // Calcular ahorros de CO2 basado en tipo de vehículo
    const co2SavingsMap = {
      electric: 15.2,
      hybrid: 8.7,
      diesel: 3.1,
      gas: 2.4
    }
    
    const co2Savings = co2SavingsMap[body.vehicleType as keyof typeof co2SavingsMap] || 5.0

    const response: OptimizedRouteResponse = {
      success: true,
      data: {
        optimizedRoute: {
          id: `route_${Date.now()}`,
          geometry: mockGeometry,
          distance: 621.5, // km
          duration: 375, // minutes  
          co2Emissions: 45.3,
          co2Savings,
          vehicleType: body.vehicleType,
        },
        alternatives: [
          {
            id: `alt_route_${Date.now()}_1`,
            geometry: mockGeometry,
            distance: 635.2,
            duration: 395,
            co2Emissions: 52.1,
            co2Savings: co2Savings * 0.8,
            vehicleType: body.vehicleType,
          }
        ],
        stats: {
          totalCo2Savings: co2Savings,
          totalDistance: 621.5,
          totalTime: '6h 15min',
        }
      }
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error en /api/routes/optimize:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}

// Health check para la API
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'EcoRoute Optimization API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
} 