'use client'

// RouteMap Component - Interface pública con arquitectura modular
// Separación entre lógica (logic.ts) y presentación (UI)

import React, { useRef, useState } from 'react'
import Map, { Marker, Source, Layer, NavigationControl, ScaleControl, ViewStateChangeEvent } from 'react-map-gl'
import { motion } from 'framer-motion'
import { useRouteMap } from './logic'
import styles from './styles.module.css'
import 'mapbox-gl/dist/mapbox-gl.css'

// Mapbox token público - Token demo que no funciona, necesita reemplazarse
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.demo_token_replace_me'

interface RouteMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address?: string }) => void
  onRouteCalculated?: (route: any) => void
  className?: string
  showPollutionLayer?: boolean
  interactive?: boolean
}

export const RouteMap: React.FC<RouteMapProps> = ({
  onLocationSelect,
  onRouteCalculated,
  className = '',
  showPollutionLayer = true,
  interactive = true,
}) => {
  const mapRef = useRef<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [hoveredPollution, setHoveredPollution] = useState<any>(null)

  // Hook personalizado con toda la lógica del mapa
  const {
    viewport,
    setViewport,
    pollutionData,
    selectedOrigin,
    selectedDestination,
    currentRoute,
    isLoading,
    mapStyle,
    handleMapClick,
    clearRoute,
    toggleMapStyle,
  } = useRouteMap({ onLocationSelect, onRouteCalculated })

  // Configuración de la capa de contaminación
  const pollutionSourceData = {
    type: 'FeatureCollection' as const,
    features: pollutionData.map((point, index) => ({
      type: 'Feature' as const,
      id: index,
      properties: {
        value: point.value,
        intensity: point.value > 0.6 ? 'high' : point.value > 0.3 ? 'medium' : 'low'
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [point.long, point.lat]
      }
    }))
  }

  // Configuración de la ruta
  const routeSourceData = currentRoute ? {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: currentRoute.coordinates
    }
  } : null

  const handleMapLoad = () => {
    setIsMapLoaded(true)
  }

  const handlePollutionHover = (event: any) => {
    if (event.features && event.features.length > 0) {
      const feature = event.features[0]
      setHoveredPollution({
        ...feature.properties,
        coordinates: event.lngLat
      })
    } else {
      setHoveredPollution(null)
    }
  }

  // Fallback si no hay token de Mapbox válido
  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'pk.demo_token_replace_me') {
    return (
      <div className={`${styles.mapContainer} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Mapa Interactivo Demo
            </h3>
            <p className="text-gray-600 mb-4">
              Para usar el mapa completo, necesitas configurar un token de Mapbox válido.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>📍 Simulando: Madrid → Barcelona</p>
              <p>🛣️ Distancia: ~620 km</p>
              <p>🌱 CO₂ Ahorrado: ~15.2 kg</p>
            </div>
            <div className="mt-6">
              <motion.button
                onClick={() => {
                  const mockRoute = {
                    id: 'demo_route',
                    distance: 620,
                    co2Savings: 15.2
                  }
                  onRouteCalculated?.(mockRoute)
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Simular Ruta Demo
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.mapContainer} ${className}`}>
      <div className={styles.mapWrapper}>
        {/* Mapa principal */}
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          {...viewport}
          onMove={(evt: ViewStateChangeEvent) => setViewport(evt.viewState)}
          onClick={interactive ? handleMapClick : undefined}
          onLoad={handleMapLoad}
          mapStyle={mapStyle}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
          onMouseMove={showPollutionLayer ? handlePollutionHover : undefined}
        >
          {/* Controles de navegación */}
          <NavigationControl position="top-left" />
          <ScaleControl position="bottom-left" />

          {/* Capa de contaminación */}
          {showPollutionLayer && isMapLoaded && (
            <Source id="pollution" type="geojson" data={pollutionSourceData}>
              <Layer
                id="pollution-circles"
                type="circle"
                paint={{
                  'circle-radius': [
                    'case',
                    ['==', ['get', 'intensity'], 'high'], 25,
                    ['==', ['get', 'intensity'], 'medium'], 20,
                    15
                  ],
                  'circle-color': [
                    'case',
                    ['==', ['get', 'intensity'], 'high'], '#ef4444',
                    ['==', ['get', 'intensity'], 'medium'], '#f59e0b',
                    '#10b981'
                  ],
                  'circle-opacity': 0.6,
                  'circle-stroke-width': 2,
                  'circle-stroke-color': '#ffffff',
                  'circle-stroke-opacity': 0.8
                }}
              />
            </Source>
          )}

          {/* Ruta trazada */}
          {currentRoute && routeSourceData && (
            <Source id="route" type="geojson" data={routeSourceData}>
              <Layer
                id="route-line"
                type="line"
                paint={{
                  'line-color': '#10b981',
                  'line-width': 4,
                  'line-opacity': 0.8
                }}
                layout={{
                  'line-cap': 'round',
                  'line-join': 'round'
                }}
              />
            </Source>
          )}

          {/* Marcador de origen */}
          {selectedOrigin && (
            <Marker
              longitude={selectedOrigin.lng}
              latitude={selectedOrigin.lat}
              anchor="bottom"
            >
              <div className={`${styles.locationMarker} ${styles.originMarker}`}>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    Origen
                  </div>
                </div>
              </div>
            </Marker>
          )}

          {/* Marcador de destino */}
          {selectedDestination && (
            <Marker
              longitude={selectedDestination.lng}
              latitude={selectedDestination.lat}
              anchor="bottom"
            >
              <div className={`${styles.locationMarker} ${styles.destinationMarker}`}>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    Destino
                  </div>
                </div>
              </div>
            </Marker>
          )}
        </Map>

        {/* Controles del mapa */}
        <div className={styles.mapControls}>
          <button
            onClick={toggleMapStyle}
            className={styles.controlButton}
            title="Cambiar estilo de mapa"
          >
            🛰️
          </button>
          {(selectedOrigin || selectedDestination) && (
            <button
              onClick={clearRoute}
              className={styles.controlButton}
              title="Limpiar ruta"
            >
              🗑️
            </button>
          )}
        </div>

        {/* Overlay de información de ruta */}
        {currentRoute && (
          <div className={styles.mapOverlay}>
            <div className={styles.overlayContent}>
              <div className={styles.routeInfo}>
                <div className={styles.routeMetric}>
                  <div className={styles.routeMetricValue}>
                    {currentRoute.distance.toFixed(1)} km
                  </div>
                  <div className={styles.routeMetricLabel}>Distancia</div>
                </div>
                <div className={styles.routeMetric}>
                  <div className={styles.routeMetricValue}>
                    {currentRoute.co2Savings.toFixed(1)} kg
                  </div>
                  <div className={styles.routeMetricLabel}>CO₂ Ahorrado</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tooltip de contaminación */}
        {hoveredPollution && (
          <div
            className={styles.tooltip}
            style={{
              left: hoveredPollution.coordinates.lng,
              top: hoveredPollution.coordinates.lat
            }}
          >
            Contaminación: {(hoveredPollution.value * 100).toFixed(0)}%
          </div>
        )}

        {/* Overlay de carga */}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className="text-center">
              <div className={styles.loadingSpinner}></div>
              <div className={styles.loadingText}>
                Calculando ruta óptima...
              </div>
            </div>
          </div>
        )}

        {/* Instrucciones */}
        {!selectedOrigin && !selectedDestination && (
          <div className={styles.mapOverlay}>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                🗺️ Haz clic en el mapa para seleccionar origen y destino
              </div>
              <div className="text-xs text-gray-500">
                Primero selecciona el origen, luego el destino
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RouteMap 