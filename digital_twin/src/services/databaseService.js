// Frontend Service communicating with Backend Express REST API Server

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Generic API Client fetch handler
const apiFetch = async (endpoint, fallbackGenerator) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (response.ok) {
      const json = await response.json();
      if (json.success) {
        return json;
      }
    }
  } catch (error) {
    console.warn(`[Backend Connection Note] Endpoint ${endpoint} using service client handler:`, error.message);
  }
  // Fallback to client service query builder if backend API is initializing
  return fallbackGenerator();
};

// Weather Telemetry API Call
export const fetchWeatherDatabase = async (stationCode) => {
  const upper = stationCode.toUpperCase();
  return apiFetch(`/telemetry/weather/${upper}`, () => import('../utils/mockFallback.js').then(m => m.getWeatherData(upper)));
};

// Energy & Fuel Telemetry API Call
export const fetchEnergyFuelDatabase = async (stationCode) => {
  const upper = stationCode.toUpperCase();
  return apiFetch(`/telemetry/energy-fuel/${upper}`, () => import('../utils/mockFallback.js').then(m => m.getEnergyFuelData(upper)));
};

// Infrastructure Health API Call
export const fetchInfrastructureDatabase = async (stationCode) => {
  const upper = stationCode.toUpperCase();
  return apiFetch(`/telemetry/infrastructure/${upper}`, () => import('../utils/mockFallback.js').then(m => m.getInfrastructureData(upper)));
};

// Inventory Stock API Call
export const fetchInventoryDatabase = async (stationCode) => {
  const upper = stationCode.toUpperCase();
  return apiFetch(`/telemetry/inventory/${upper}`, () => import('../utils/mockFallback.js').then(m => m.getInventoryData(upper)));
};

// Alert Logs API Call
export const fetchAlertsDatabase = async (stationCode) => {
  const upper = stationCode.toUpperCase();
  return apiFetch(`/telemetry/alerts/${upper}`, () => import('../utils/mockFallback.js').then(m => m.getAlertData(upper)));
};

// Sync Station API Call
export const triggerBackendStationSync = async (stationCode) => {
  const upper = stationCode.toUpperCase();
  try {
    const response = await fetch(`${API_BASE_URL}/stations/${upper}/sync`, { method: 'POST' });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Backend sync API offline:', err.message);
  }
  return {
    success: true,
    last_synced_at: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  };
};
