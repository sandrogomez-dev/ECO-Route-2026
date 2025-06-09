// RouteMap Logic - Hook personalizado para manejo de estado del mapa
// Separación clara entre lógica y presentación (Arquitectura Hexagonal)

import { useState, useCallback, useEffect, useMemo } from 'react'
import type { ViewportState, PollutionDataPoint } from '@/@types/global'

// Datos mock de contaminación (coordenadas españolas)
export const MOCK_POLLUTION_DATA: PollutionDataPoint[] = [
  { lat: 40.4168, long: -3.7038, value: 0.8, timestamp: new Date() }, // Madrid - Alta contaminación
  { lat: 41.3851, long: 2.1734, value: 0.6, timestamp: new Date() },  // Barcelona - Media-alta
  { lat: 39.4699, long: -0.3763, value: 0.4, timestamp: new Date() }, // Valencia - Media
  { lat: 37.3891, long: -5.9845, value: 0.7, timestamp: new Date() }, // Sevilla - Alta
  { lat: 43.2627, long: -2.9253, value: 0.3, timestamp: new Date() }, // Bilbao - Baja
  { lat: 36.7213, long: -4.4214, value: 0.5, timestamp: new Date() }, // Málaga - Media
  { lat: 39.8628, long: -4.0273, value: 0.2, timestamp: new Date() }, // Toledo - Baja
  { lat: 42.8782, long: -8.5448, value: 0.3, timestamp: new Date() }, // Santiago - Baja
  { lat: 38.9445, long: -1.8580, value: 0.4, timestamp: new Date() }, // Albacete - Media
  { lat: 40.9701, long: -5.6635, value: 0.2, timestamp: new Date() }, // Salamanca - Baja
]

interface UseRouteMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address?: string }) => void;
  onRouteCalculated?: (route: any) => void;
}

interface UseRouteMapReturn {
  viewport: ViewportState;
  setViewport: (viewport: ViewportState) => void;
  pollutionData: PollutionDataPoint[];
  selectedOrigin: { lat: number; lng: number } | null;
  selectedDestination: { lat: number; lng: number } | null;
  currentRoute: any | null;
  isLoading: boolean;
  mapStyle: string;
  handleMapClick: (event: any) => void;
  handleLocationSelect: (type: 'origin' | 'destination', location: { lat: number; lng: number }) => void;
  clearRoute: () => void;
  toggleMapStyle: () => void;
}

export const useRouteMap = ({ 
  onLocationSelect, 
  onRouteCalculated 
}: UseRouteMapProps = {}): UseRouteMapReturn => {
  // Estado del viewport del mapa (centrado en España)
  const [viewport, setViewport] = useState<ViewportState>({
    latitude: 40.4168, // Madrid como centro
    longitude: -3.7038,
    zoom: 6,
    bearing: 0,
    pitch: 0,
  })

  // Estado para ubicaciones seleccionadas
  const [selectedOrigin, setSelectedOrigin] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<{ lat: number; lng: number } | null>(null)
  
  // Estado de la ruta actual
  const [currentRoute, setCurrentRoute] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Estado del estilo del mapa
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v11')

  // Datos de contaminación memorizados
  const pollutionData = useMemo(() => MOCK_POLLUTION_DATA, [])

  // Handler para clicks en el mapa
  const handleMapClick = useCallback((event: any) => {
    const { lng, lat } = event.lngLat
    
    // Si no hay origen, establecer como origen
    if (!selectedOrigin) {
      setSelectedOrigin({ lat, lng })
      onLocationSelect?.({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
    } 
    // Si hay origen pero no destino, establecer como destino
    else if (!selectedDestination) {
      setSelectedDestination({ lat, lng })
      onLocationSelect?.({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
    }
    // Si ambos están establecidos, reiniciar con nuevo origen
    else {
      setSelectedOrigin({ lat, lng })
      setSelectedDestination(null)
      setCurrentRoute(null)
      onLocationSelect?.({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
    }
  }, [selectedOrigin, selectedDestination, onLocationSelect])

  // Handler para selección manual de ubicaciones
  const handleLocationSelect = useCallback((
    type: 'origin' | 'destination', 
    location: { lat: number; lng: number }
  ) => {
    if (type === 'origin') {
      setSelectedOrigin(location)
    } else {
      setSelectedDestination(location)
    }
    onLocationSelect?.(location)
  }, [onLocationSelect])

  // Limpiar ruta
  const clearRoute = useCallback(() => {
    setSelectedOrigin(null)
    setSelectedDestination(null)
    setCurrentRoute(null)
  }, [])

  // Cambiar estilo del mapa
  const toggleMapStyle = useCallback(() => {
    setMapStyle(prevStyle => 
      prevStyle === 'mapbox://styles/mapbox/streets-v11' 
        ? 'mapbox://styles/mapbox/satellite-streets-v11'
        : 'mapbox://styles/mapbox/streets-v11'
    )
  }, [])

  // Efecto para calcular ruta cuando se tienen origen y destino
  useEffect(() => {
    if (selectedOrigin && selectedDestination && !currentRoute) {
      setIsLoading(true)
      
      // Simular cálculo de ruta (en producción sería una llamada real a la API)
      const mockRoute = {
        id: `route_${Date.now()}`,
        origin: selectedOrigin,
        destination: selectedDestination,
        coordinates: [
          [selectedOrigin.lng, selectedOrigin.lat],
          [selectedDestination.lng, selectedDestination.lat]
        ],
        distance: calculateDistance(selectedOrigin, selectedDestination),
        co2Savings: Math.random() * 20 + 5 // Mock CO2 savings
      }

      // Simular latencia de red
      setTimeout(() => {
        setCurrentRoute(mockRoute)
        setIsLoading(false)
        onRouteCalculated?.(mockRoute)
      }, 1000)
    }
  }, [selectedOrigin, selectedDestination, currentRoute, onRouteCalculated])

  return {
    viewport,
    setViewport,
    pollutionData,
    selectedOrigin,
    selectedDestination,
    currentRoute,
    isLoading,
    mapStyle,
    handleMapClick,
    handleLocationSelect,
    clearRoute,
    toggleMapStyle,
  }
}

// Función auxiliar para calcular distancia
function calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = toRadians(point2.lat - point1.lat)
  const dLng = toRadians(point2.lng - point1.lng)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * 
    Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
} 