// Global type definitions for EcoRoute 2026

declare global {
  interface Window {
    google?: typeof google;
    mapboxgl?: unknown;
  }
}

// Core domain types
export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface ViewportState {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export type VehicleType = 'electric' | 'hybrid' | 'diesel' | 'gas';

export interface RoutePoint extends GeoPoint {
  address?: string;
  name?: string;
}

export interface OptimizedRoute {
  id: string;
  geometry: GeoJSON.LineString;
  distance: number; // in kilometers
  duration: number; // in minutes
  co2Emissions: number; // in kg
  co2Savings: number; // in kg compared to standard route
  vehicleType: VehicleType;
}

export interface PollutionDataPoint {
  lat: number;
  long: number;
  value: number; // pollution index
  timestamp: Date;
}

// API Response types
export interface OptimizedRouteResponse {
  success: boolean;
  data: {
    optimizedRoute: OptimizedRoute;
    alternatives: OptimizedRoute[];
    stats: {
      totalCo2Savings: number;
      totalDistance: number;
      totalTime: string;
    };
  };
  error?: string;
}

// Backend-ready types
export interface BackendApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

export {}; 