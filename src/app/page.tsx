export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌱 EcoRoute 2026
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Logística Sostenible del Futuro
          </p>
          <a 
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white eco-gradient hover:opacity-90 transition-opacity"
          >
            Acceder al Dashboard
          </a>
        </div>
      </div>
    </div>
  )
} 