'use client'

import { useState, useCallback } from 'react'
import RouteMap from '@/components/maps/RouteMap'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  // Estado del dashboard
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [vehicleType, setVehicleType] = useState('electric')
  const [currentRoute, setCurrentRoute] = useState<any>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  
  // Estadísticas calculadas
  const [stats, setStats] = useState({
    co2Saved: 0,
    distance: 0,
    estimatedTime: 0
  })

  const handleLocationSelect = useCallback((location: { lat: number; lng: number; address?: string }) => {
    // Si no hay origen, establecer como origen
    if (!origin) {
      setOrigin(location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`)
    }
    // Si hay origen pero no destino, establecer como destino
    else if (!destination) {
      setDestination(location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`)
    }
    // Si ambos existen, reemplazar origen
    else {
      setOrigin(location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`)
      setDestination('')
    }
  }, [origin, destination])

  const handleRouteCalculated = useCallback((route: any) => {
    setCurrentRoute(route)
    
    // Actualizar estadísticas
    const co2Factor = vehicleType === 'electric' ? 0.05 : 
                     vehicleType === 'hybrid' ? 0.08 : 
                     vehicleType === 'diesel' ? 0.15 : 0.12
    
    const estimatedTime = Math.round(route.distance * 1.2) // Aproximación: 1.2 min por km
    
    setStats({
      co2Saved: route.co2Savings || (route.distance * co2Factor),
      distance: route.distance,
      estimatedTime
    })
    
    setIsOptimizing(false)
  }, [vehicleType])

  const handleOptimizeRoute = async () => {
    if (!origin || !destination) {
      alert('Por favor, ingresa tanto el origen como el destino')
      return
    }
    
    setIsOptimizing(true)
    
    // Simular optimización de ruta
    setTimeout(() => {
      // En una aplicación real, aquí harías la llamada a la API
      console.log('Optimizando ruta...', { origin, destination, vehicleType })
    }, 500)
  }

  const handleClearAll = () => {
    setOrigin('')
    setDestination('')
    setCurrentRoute(null)
    setStats({ co2Saved: 0, distance: 0, estimatedTime: 0 })
  }

  return (
    <div className="h-full">
      {/* Dashboard Content Container */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar - Control Panel */}
        <div className="w-80 bg-white shadow-lg border-r border-gray-200 p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Optimizador de Rutas
              </h2>
              
              {/* Origin Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origen
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Ingresa dirección de origen..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destino
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ingresa dirección de destino..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="vehicle-type" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Vehículo
                  </label>
                  <select 
                    id="vehicle-type"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    title="Selecciona el tipo de vehículo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="electric">Eléctrico</option>
                    <option value="hybrid">Híbrido</option>
                    <option value="diesel">Diesel</option>
                    <option value="gas">Gasolina</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <motion.button 
                    onClick={handleOptimizeRoute}
                    disabled={isOptimizing || !origin || !destination}
                    className="w-full eco-gradient text-white py-2 px-4 rounded-md hover:opacity-90 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isOptimizing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Optimizando...
                      </div>
                    ) : (
                      'Optimizar Ruta'
                    )}
                  </motion.button>
                  
                  {(origin || destination || currentRoute) && (
                    <motion.button 
                      onClick={handleClearAll}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      🗑️ Limpiar Todo
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Stats Preview */}
            <div className="border-t pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Estadísticas
              </h3>
              <div className="space-y-3">
                <motion.div 
                  className="flex justify-between items-center"
                  animate={{ opacity: stats.co2Saved > 0 ? 1 : 0.5 }}
                >
                  <span className="text-sm text-gray-600">CO₂ Ahorrado:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {stats.co2Saved > 0 ? `${stats.co2Saved.toFixed(1)} kg` : '-- kg'}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center"
                  animate={{ opacity: stats.distance > 0 ? 1 : 0.5 }}
                >
                  <span className="text-sm text-gray-600">Distancia:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats.distance > 0 ? `${stats.distance.toFixed(1)} km` : '-- km'}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center"
                  animate={{ opacity: stats.estimatedTime > 0 ? 1 : 0.5 }}
                >
                  <span className="text-sm text-gray-600">Tiempo est.:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats.estimatedTime > 0 ? `${stats.estimatedTime} min` : '-- min'}
                  </span>
                </motion.div>
                
                {/* Indicador de tipo de vehículo */}
                <motion.div 
                  className="mt-4 p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vehículo:</span>
                    <div className="flex items-center">
                      <span className="text-lg mr-1">
                        {vehicleType === 'electric' ? '⚡' : 
                         vehicleType === 'hybrid' ? '🔋' : 
                         vehicleType === 'diesel' ? '⛽' : '⛽'}
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {vehicleType === 'electric' ? 'Eléctrico' :
                         vehicleType === 'hybrid' ? 'Híbrido' :
                         vehicleType === 'diesel' ? 'Diesel' : 'Gasolina'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map Container - Interactive Map */}
        <div className="flex-1 relative">
          <RouteMap
            onLocationSelect={handleLocationSelect}
            onRouteCalculated={handleRouteCalculated}
            showPollutionLayer={true}
            interactive={true}
          />
        </div>
      </div>
    </div>
  )
} 