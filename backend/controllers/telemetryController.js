import pool from '../config/db.js';
import { 
  getWeatherData, 
  getEnergyFuelData, 
  getInfrastructureData, 
  getInventoryData, 
  getAlertData 
} from '../utils/mockGenerator.js';

// GET /api/telemetry/weather/:stationCode
export const getWeatherTelemetry = async (req, res) => {
  const { stationCode } = req.params;
  const upperCode = stationCode.toUpperCase();

  try {
    const [rows] = await pool.query(
      `SELECT w.* FROM weather_data w 
       JOIN stations s ON w.station_id = s.station_id 
       WHERE s.station_code = ? 
       ORDER BY w.recorded_at DESC LIMIT 25`,
      [upperCode]
    );

    if (rows && rows.length > 0) {
      return res.json({
        success: true,
        table: 'weather_data',
        station_code: upperCode,
        columns: [
          { key: 'recorded_at', name: 'Recorded At (UTC)', type: 'datetime' },
          { key: 'temperature_c', name: 'Temperature (°C)', unit: '°C', color: '#ef4444', axis: 0 },
          { key: 'relative_humidity_pct', name: 'Humidity (%)', unit: '%', color: '#3b82f6', axis: 0 },
          { key: 'wind_speed_mps', name: 'Wind Speed (m/s)', unit: 'm/s', color: '#10b981', axis: 0 },
          { key: 'air_pressure_hpa', name: 'Air Pressure (hPa)', unit: 'hPa', color: '#8b5cf6', axis: 1 },
          { key: 'wind_direction_deg', name: 'Wind Direction (°)', unit: '°', color: '#f59e0b', axis: 1 }
        ],
        rows: rows.reverse()
      });
    }
  } catch (error) {
    console.warn(`Fallback to SQL telemetry generator for Weather (${upperCode}):`, error.message);
  }

  res.json({ success: true, ...getWeatherData(upperCode) });
};

// GET /api/telemetry/energy-fuel/:stationCode
export const getEnergyFuelTelemetry = async (req, res) => {
  const { stationCode } = req.params;
  const upperCode = stationCode.toUpperCase();
  res.json({ success: true, ...getEnergyFuelData(upperCode) });
};

// GET /api/telemetry/infrastructure/:stationCode
export const getInfrastructureTelemetry = async (req, res) => {
  const { stationCode } = req.params;
  const upperCode = stationCode.toUpperCase();
  res.json({ success: true, ...getInfrastructureData(upperCode) });
};

// GET /api/telemetry/inventory/:stationCode
export const getInventoryTelemetry = async (req, res) => {
  const { stationCode } = req.params;
  const upperCode = stationCode.toUpperCase();
  res.json({ success: true, ...getInventoryData(upperCode) });
};

// GET /api/telemetry/alerts/:stationCode
export const getAlertsTelemetry = async (req, res) => {
  const { stationCode } = req.params;
  const upperCode = stationCode.toUpperCase();
  res.json({ success: true, ...getAlertData(upperCode) });
};
