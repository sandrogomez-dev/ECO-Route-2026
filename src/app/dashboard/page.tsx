'use client'

import RouteMap from '@/components/maps/RouteMap'

export default function DashboardPage() {
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
                    placeholder="Ingresa dirección de origen..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destino
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa dirección de destino..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="vehicle-type" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Vehículo
                  </label>
                  <select 
                    id="vehicle-type"
                    title="Selecciona el tipo de vehículo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="electric">Eléctrico</option>
                    <option value="hybrid">Híbrido</option>
                    <option value="diesel">Diesel</option>
                    <option value="gas">Gasolina</option>
                  </select>
                </div>
                
                <button className="w-full eco-gradient text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity font-medium">
                  Optimizar Ruta
                </button>
              </div>
            </div>
            
            {/* Stats Preview */}
            <div className="border-t pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Estadísticas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CO₂ Ahorrado:</span>
                  <span className="text-sm font-semibold text-primary-600">-- kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Distancia:</span>
                  <span className="text-sm font-semibold text-gray-900">-- km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tiempo est.:</span>
                  <span className="text-sm font-semibold text-gray-900">-- min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map Container - Interactive Map */}
        <div className="flex-1 relative">
          <RouteMap
            onLocationSelect={(location: any) => {
              console.log('Location selected:', location)
            }}
            onRouteCalculated={(route: any) => {
              console.log('Route calculated:', route)
            }}
            showPollutionLayer={true}
            interactive={true}
          />
        </div>
      </div>
    </div>
  )
} 