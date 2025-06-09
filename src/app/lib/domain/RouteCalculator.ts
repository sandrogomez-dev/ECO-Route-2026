// Domain logic para cálculo de rutas - Arquitectura Hexagonal
// Esta clase contiene la lógica de negocio pura, independiente de la infraestructura

import type { 
  GeoPoint, 
  VehicleType, 
  OptimizedRoute,
  PollutionDataPoint 
} from '@/@types/global'

export interface RouteCalculationParams {
  origin: GeoPoint;
  destination: GeoPoint;
  vehicleType: VehicleType;
  avoidHighPollution?: boolean;
  maxDetourPercentage?: number;
}

export interface RouteCalculationResult {
  optimizedRoute: OptimizedRoute;
  alternatives: OptimizedRoute[];
  carbonFootprintReduction: number;
  efficiencyScore: number;
}

// Constantes del dominio
const CO2_EMISSIONS_PER_KM = {
  electric: 0.0, // g CO2/km
  hybrid: 65.0,
  diesel: 120.0,
  gas: 95.0,
} as const;

// Constante para futuras funcionalidades de cálculo de combustible
// const FUEL_EFFICIENCY = {
//   electric: 0.2, // kWh/km
//   hybrid: 4.5,   // L/100km
//   diesel: 6.0,   // L/100km  
//   gas: 7.0,      // L/100km
// } as const;

export class RouteCalculator {
  /**
   * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
   */
  private calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.latitude)) * 
      Math.cos(this.toRadians(point2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calcula las emisiones de CO2 basado en la distancia y tipo de vehículo
   */
  calculateCO2Emissions(distance: number, vehicleType: VehicleType): number {
    const emissionFactor = CO2_EMISSIONS_PER_KM[vehicleType];
    return (distance * emissionFactor) / 1000; // Convertir de gramos a kg
  }

  /**
   * Calcula el ahorro de CO2 comparado con un vehículo diesel estándar
   */
  calculateCO2Savings(distance: number, vehicleType: VehicleType): number {
    const standardEmissions = this.calculateCO2Emissions(distance, 'diesel');
    const vehicleEmissions = this.calculateCO2Emissions(distance, vehicleType);
    
    return Math.max(0, standardEmissions - vehicleEmissions);
  }

  /**
   * Estima el tiempo de viaje basado en la distancia y condiciones de tráfico
   */
  estimateTravelTime(distance: number, trafficFactor: number = 1.0): number {
    // Velocidad promedio asumida: 60 km/h en ciudad, 90 km/h en carretera
    const avgSpeed = distance > 50 ? 75 : 45; // km/h
    const baseTime = (distance / avgSpeed) * 60; // minutos
    
    return Math.round(baseTime * trafficFactor);
  }

  /**
   * Calcula el score de eficiencia de una ruta (0-100)
   */
  calculateEfficiencyScore(
    distance: number,
    co2Savings: number,
    travelTime: number,
    pollutionExposure: number = 0.5
  ): number {
    // Factores de peso para el score
    const distanceScore = Math.max(0, 100 - (distance / 10)); // Penalizar distancias largas
    const co2Score = Math.min(100, co2Savings * 5); // Premiar ahorros de CO2
    const timeScore = Math.max(0, 100 - (travelTime / 5)); // Penalizar tiempos largos
    const pollutionScore = Math.max(0, 100 - (pollutionExposure * 100)); // Penalizar alta contaminación
    
    // Promedio ponderado
    const totalScore = (
      distanceScore * 0.3 +
      co2Score * 0.4 +
      timeScore * 0.2 +
      pollutionScore * 0.1
    );
    
    return Math.round(Math.max(0, Math.min(100, totalScore)));
  }

  /**
   * Evalúa el nivel de exposición a contaminación en una ruta
   */
  evaluatePollutionExposure(
    routeGeometry: GeoJSON.LineString,
    pollutionData: PollutionDataPoint[]
  ): number {
    if (!pollutionData.length) return 0.5; // Valor neutral sin datos
    
    // Simplificado: evaluar contaminación en puntos de la ruta
    const routePoints = routeGeometry.coordinates;
    let totalPollution = 0;
    let validPoints = 0;
    
    routePoints.forEach(([lon, lat]) => {
      // Encontrar el punto de contaminación más cercano
      const nearestPollution = pollutionData.reduce((nearest, point) => {
        const distance = this.calculateDistance(
          { latitude: lat, longitude: lon },
          { latitude: point.lat, longitude: point.long }
        );
        
        return distance < nearest.distance 
          ? { point, distance }
          : nearest;
      }, { point: pollutionData[0], distance: Infinity });
      
      if (nearestPollution.distance < 10) { // Dentro de 10km
        totalPollution += nearestPollution.point.value;
        validPoints++;
      }
    });
    
    return validPoints > 0 ? totalPollution / validPoints : 0.5;
  }

  /**
   * Método principal para calcular rutas optimizadas
   */
  async calculateOptimizedRoute(
    params: RouteCalculationParams,
    pollutionData?: PollutionDataPoint[]
  ): Promise<RouteCalculationResult> {
    // En un entorno real, aquí se llamaría a un servicio de routing
    // Por ahora, generamos datos calculados
    
    const straightLineDistance = this.calculateDistance(params.origin, params.destination);
    const actualDistance = straightLineDistance * 1.3; // Factor de corrección por carreteras
    
    const co2Emissions = this.calculateCO2Emissions(actualDistance, params.vehicleType);
    const co2Savings = this.calculateCO2Savings(actualDistance, params.vehicleType);
    const travelTime = this.estimateTravelTime(actualDistance);
    
    // Mock geometry - en producción vendría del servicio de routing
    const mockGeometry: GeoJSON.LineString = {
      type: 'LineString',
      coordinates: [
        [params.origin.longitude, params.origin.latitude],
        [params.destination.longitude, params.destination.latitude]
      ]
    };
    
    const pollutionExposure = pollutionData 
      ? this.evaluatePollutionExposure(mockGeometry, pollutionData)
      : 0.5;
    
    const efficiencyScore = this.calculateEfficiencyScore(
      actualDistance,
      co2Savings,
      travelTime,
      pollutionExposure
    );
    
    const optimizedRoute: OptimizedRoute = {
      id: `route_${Date.now()}`,
      geometry: mockGeometry,
      distance: actualDistance,
      duration: travelTime,
      co2Emissions,
      co2Savings,
      vehicleType: params.vehicleType,
    };
    
    return {
      optimizedRoute,
      alternatives: [], // Se calcularían rutas alternativas
      carbonFootprintReduction: co2Savings,
      efficiencyScore,
    };
  }
} 