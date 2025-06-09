# 🌱 EcoRoute 2026 - Logística Sostenible

Una plataforma SaaS de optimización logística sostenible construida con Next.js 14, TypeScript y arquitectura hexagonal.

## 🚀 Características

- **Optimización de Rutas Inteligente**: Algoritmos avanzados para encontrar las rutas más eficientes
- **Análisis de Huella de Carbono**: Cálculo y reducción de emisiones CO₂
- **Visualización de Contaminación**: Capa de datos ambientales en tiempo real
- **Multi-Vehículo**: Soporte para eléctricos, híbridos, diesel y gasolina
- **Dashboard Interactivo**: Interface moderna y responsive

## 🛠 Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático y desarrollo robusto
- **Tailwind CSS** - Diseño moderno y responsive
- **Zustand** - Gestión de estado simple y efectiva
- **Framer Motion** - Animaciones fluidas

### Desarrollo
- **MSW** - Mock Service Worker para desarrollo
- **ESLint** - Linting y mejores prácticas
- **PostCSS** - Procesamiento de CSS

### Arquitectura
- **Hexagonal Architecture** - Separación clara entre dominio e infraestructura
- **Clean Code** - Principios SOLID y DRY
- **Mobile-First** - Diseño responsivo desde el inicio

## 📁 Estructura del Proyecto

```
src/
├── @types/              # Tipos globales TypeScript
├── app/
│   ├── (dashboard)/     # Rutas protegidas del dashboard
│   ├── api/            # API Routes de Next.js
│   └── lib/
│       ├── domain/     # Lógica de negocio pura
│       └── infrastructure/  # Adaptadores e integraciones
├── components/
│   ├── maps/           # Componentes de mapas
│   └── ui/             # Componentes de interfaz
├── providers/          # Context providers
├── stores/             # Estados globales (Zustand)
├── mocks/              # Mock Service Worker
└── tests/              # Tests unitarios e integración
```

## 🚦 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- npm o pnpm

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/ecoroute-2026.git
   cd ecoroute-2026
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🔧 Comandos Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 🏗 Arquitectura

### Principios de Diseño

1. **Arquitectura Hexagonal**: Separación entre lógica de negocio e infraestructura
2. **Domain-Driven Design**: Modelado basado en el dominio logístico
3. **SOLID Principles**: Código mantenible y extensible
4. **Mobile-First**: Diseño responsive desde móviles

### Capas de la Aplicación

```
┌─────────────────────────────────────┐
│           UI Components             │ ← Presentación
├─────────────────────────────────────┤
│         Application Layer           │ ← Coordinación
├─────────────────────────────────────┤
│           Domain Layer              │ ← Lógica de Negocio
├─────────────────────────────────────┤
│        Infrastructure Layer         │ ← APIs, DB, Servicios
└─────────────────────────────────────┘
```

## 🧪 Desarrollo con Mocks

El proyecto utiliza **Mock Service Worker (MSW)** para simular APIs durante el desarrollo:

- Rutas de optimización con datos realistas
- Simulación de latencia de red
- Diferentes escenarios de respuesta
- Datos de contaminación generados

## 🌍 Backend Integration

### APIs Preparadas

```typescript
// Configuración para desarrollo vs producción
const apiClient = getApiClient(); // Automático según NODE_ENV

// Rutas disponibles
POST /api/routes/optimize  // Optimización de rutas
GET  /api/pollution/data   // Datos de contaminación  
GET  /api/health          // Health check
```

### Variables de Entorno

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=https://api.ecoroute.com
NEXT_PUBLIC_API_KEY=your-api-key
```

## 📊 Features Implementadas

### ✅ Fase 1 - Foundation (Actual)
- [x] Setup inicial con Next.js 14 + TypeScript
- [x] Configuración de Tailwind CSS
- [x] Arquitectura hexagonal básica
- [x] Mock Service Worker configurado
- [x] Dashboard con interfaz base
- [x] Tipos TypeScript completos

### 🚧 Fase 2 - Mapas Interactivos (Próximo)
- [ ] Integración con Mapbox/Google Maps
- [ ] Visualización de rutas optimizadas
- [ ] Capa de contaminación en tiempo real
- [ ] Marcadores interactivos

### 🔮 Fase 3 - State Management
- [ ] Store de Zustand para rutas
- [ ] Caché inteligente con SWR
- [ ] Optimización de performance
- [ ] Error boundaries

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/amazing-feature`)
3. Commit con conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

### Conventional Commits

```bash
feat:     Nueva funcionalidad
fix:      Corrección de bug
docs:     Documentación
style:    Formato de código
refactor: Refactoring
test:     Tests
chore:    Tareas de mantenimiento
```

## 📝 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo [LICENSE](./LICENSE) para más detalles.

## 👥 Equipo

- **EcoRoute Team** - Desarrollo y arquitectura

---

**¿Listo para construir el futuro de la logística sostenible?** 🚛💚

Para más información, contacta con el equipo o revisa la [documentación técnica](./docs/). 