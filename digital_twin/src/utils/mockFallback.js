// Client-side fallback utility for seamless telemetry rendering

const generateTimeseries = (hours = 24, stepMinutes = 60) => {
  const points = [];
  const now = new Date('2026-09-22T18:00:00Z');
  const count = Math.floor((hours * 60) / stepMinutes);
  
  for (let i = count; i >= 0; i--) {
    const time = new Date(now.getTime() - i * stepMinutes * 60 * 1000);
    points.push(time.toISOString().replace('T', ' ').substring(0, 16));
  }
  return points;
};

export const getWeatherData = (stationCode) => {
  const timestamps = generateTimeseries(24, 60);
  const isMaitri = stationCode === 'MTR';
  const isBharti = stationCode === 'BHR';

  const baseTemp = isMaitri ? -22.5 : isBharti ? -18.0 : -28.4;
  const basePressure = isMaitri ? 985.2 : isBharti ? 992.5 : 975.0;

  const rows = timestamps.map((time, idx) => ({
    recorded_at: time,
    temperature_c: parseFloat((baseTemp + Math.sin(idx / 3) * 4 + (Math.random() * 1.5 - 0.75)).toFixed(1)),
    relative_humidity_pct: parseFloat(Math.min(100, Math.max(0, Math.cos(idx / 4) * 8 + 65 + (Math.random() * 3 - 1.5))).toFixed(1)),
    air_pressure_hpa: parseFloat((basePressure + Math.sin(idx / 5) * 12).toFixed(1)),
    wind_speed_mps: parseFloat(Math.abs(Math.sin(idx / 2) * 15 + 8 + (Math.random() * 4 - 2)).toFixed(1)),
    wind_direction_deg: parseFloat(((210 + idx * 5 + Math.random() * 20) % 360).toFixed(1))
  }));

  return {
    table: 'weather_data',
    station_code: stationCode,
    columns: [
      { key: 'recorded_at', name: 'Recorded At (UTC)', type: 'datetime' },
      { key: 'temperature_c', name: 'Temperature (°C)', unit: '°C', color: '#ef4444', axis: 0 },
      { key: 'relative_humidity_pct', name: 'Humidity (%)', unit: '%', color: '#3b82f6', axis: 0 },
      { key: 'wind_speed_mps', name: 'Wind Speed (m/s)', unit: 'm/s', color: '#10b981', axis: 0 },
      { key: 'air_pressure_hpa', name: 'Air Pressure (hPa)', unit: 'hPa', color: '#8b5cf6', axis: 1 },
      { key: 'wind_direction_deg', name: 'Wind Direction (°)', unit: '°', color: '#f59e0b', axis: 1 }
    ],
    rows
  };
};

export const getEnergyFuelData = (stationCode) => {
  const timestamps = generateTimeseries(24, 60);
  const isMaitri = stationCode === 'MTR';
  const isBharti = stationCode === 'BHR';

  const baseDieselPower = isMaitri ? 120.0 : isBharti ? 180.0 : 45.0;
  const baseSolarPower = isBharti ? 65.0 : isMaitri ? 40.0 : 10.0;
  const baseWindPower = isMaitri ? 85.0 : isBharti ? 50.0 : 95.0;
  const baseFuelQty = isMaitri ? 45000.0 : isBharti ? 72000.0 : 18000.0;

  const rows = timestamps.map((time, idx) => {
    const solarFactor = idx >= 6 && idx <= 18 ? Math.sin(((idx - 6) / 12) * Math.PI) : 0;
    const dieselGen = baseDieselPower + Math.random() * 15 - 7.5;
    const solarGen = baseSolarPower * solarFactor + Math.random() * 5;
    const windGen = baseWindPower * (0.6 + 0.4 * Math.sin(idx / 2.5)) + Math.random() * 8;
    const batteryState = Math.min(100, Math.max(40, 75 + Math.sin(idx / 3) * 20));
    const fuelRemaining = Math.max(0, baseFuelQty - (idx * (isMaitri ? 35 : 42)));
    const burnRate = 28.5 + (dieselGen / 10) + Math.random() * 3;

    return {
      recorded_at: time,
      diesel_gen_kw: parseFloat(dieselGen.toFixed(2)),
      solar_power_kw: parseFloat(solarGen.toFixed(2)),
      wind_turbine_kw: parseFloat(windGen.toFixed(2)),
      battery_soc_pct: parseFloat(batteryState.toFixed(1)),
      fuel_quantity_l: parseFloat(fuelRemaining.toFixed(2)),
      burn_rate_lph: parseFloat(burnRate.toFixed(2))
    };
  });

  return {
    table: 'energy_data & fuel_data',
    station_code: stationCode,
    columns: [
      { key: 'recorded_at', name: 'Recorded At (UTC)', type: 'datetime' },
      { key: 'diesel_gen_kw', name: 'Diesel Generator (kW)', unit: 'kW', color: '#f97316', axis: 0 },
      { key: 'solar_power_kw', name: 'Solar Output (kW)', unit: 'kW', color: '#eab308', axis: 0 },
      { key: 'wind_turbine_kw', name: 'Wind Turbine (kW)', unit: 'kW', color: '#06b6d4', axis: 0 },
      { key: 'battery_soc_pct', name: 'Battery State of Charge (%)', unit: '%', color: '#22c55e', axis: 1 },
      { key: 'fuel_quantity_l', name: 'Fuel Reserves (Liters)', unit: 'L', color: '#ec4899', axis: 1 },
      { key: 'burn_rate_lph', name: 'Burn Rate (L/h)', unit: 'L/h', color: '#6366f1', axis: 0 }
    ],
    rows
  };
};

export const getInfrastructureData = (stationCode) => {
  const timestamps = generateTimeseries(12, 120);

  const rows = timestamps.map((time, idx) => ({
    recorded_at: time,
    online_components: 5 - (idx % 3 === 0 ? 1 : 0),
    degraded_components: idx % 3 === 0 ? 1 : 0,
    offline_components: 5 - (5 - (idx % 3 === 0 ? 1 : 0)) - (idx % 3 === 0 ? 1 : 0),
    system_efficiency_pct: parseFloat((92.5 - (idx * 0.4) + (Math.random() * 2 - 1)).toFixed(1)),
    active_loads_kw: parseFloat((140 + Math.sin(idx) * 20).toFixed(1))
  }));

  return {
    table: 'infrastructure',
    station_code: stationCode,
    columns: [
      { key: 'recorded_at', name: 'Timestamp (UTC)', type: 'datetime' },
      { key: 'online_components', name: 'Online Units', unit: 'units', color: '#10b981', axis: 0 },
      { key: 'degraded_components', name: 'Degraded Units', unit: 'units', color: '#f59e0b', axis: 0 },
      { key: 'offline_components', name: 'Offline Units', unit: 'units', color: '#ef4444', axis: 0 },
      { key: 'system_efficiency_pct', name: 'Efficiency (%)', unit: '%', color: '#3b82f6', axis: 1 },
      { key: 'active_loads_kw', name: 'Active Load (kW)', unit: 'kW', color: '#8b5cf6', axis: 0 }
    ],
    rows
  };
};

export const getInventoryData = (stationCode) => {
  const isMaitri = stationCode === 'MTR';

  const items = [
    { name: 'Jet A-1 Fuel Tanks', category: 'Fuel', qty: isMaitri ? 45000 : 72000, minQty: 25000, unit: 'L' },
    { name: 'Ration Pack Type-A (Medical)', category: 'Medical', qty: isMaitri ? 120 : 350, minQty: 150, unit: 'Boxes' },
    { name: 'Thermal Insulation Suits', category: 'Safety', qty: isMaitri ? 45 : 80, minQty: 30, unit: 'Sets' },
    { name: 'Generator Spare Air Filters', category: 'Hardware', qty: isMaitri ? 12 : 28, minQty: 20, unit: 'Units' },
    { name: 'Freeze-Dried Rations', category: 'Food', qty: isMaitri ? 1800 : 3200, minQty: 1000, unit: 'Kg' },
    { name: 'Oxygen Cylinders', category: 'Life Support', qty: isMaitri ? 38 : 95, minQty: 40, unit: 'Cylinders' },
    { name: 'Lubricating Engine Oil', category: 'Maintenance', qty: isMaitri ? 450 : 800, minQty: 500, unit: 'L' }
  ];

  const rows = items.map((item, idx) => ({
    inventory_id: idx + 1,
    item_name: item.name,
    category: item.category,
    quantity: item.qty,
    minimum_quantity: item.minQty,
    unit: item.unit,
    low_stock_flag: item.qty <= item.minQty ? 1 : 0,
    stock_percentage: parseFloat(((item.qty / (item.minQty * 2)) * 100).toFixed(1))
  }));

  return {
    table: 'inventory',
    station_code: stationCode,
    columns: [
      { key: 'item_name', name: 'Item Name', type: 'string' },
      { key: 'category', name: 'Category', type: 'string' },
      { key: 'quantity', name: 'Current Stock', unit: '', color: '#3b82f6', axis: 0 },
      { key: 'minimum_quantity', name: 'Min Required Stock', unit: '', color: '#ef4444', axis: 0 },
      { key: 'stock_percentage', name: 'Stock Level (%)', unit: '%', color: '#10b981', axis: 1 }
    ],
    rows
  };
};

export const getAlertData = (stationCode) => {
  const timestamps = generateTimeseries(24, 60);

  const rows = timestamps.map((time, idx) => ({
    alert_id: idx + 1,
    recorded_at: time,
    active_alerts: Math.floor(Math.abs(Math.sin(idx / 2) * 5)),
    acknowledged_alerts: Math.floor(Math.abs(Math.cos(idx / 3) * 8)),
    resolved_alerts: Math.floor(10 + Math.sin(idx / 4) * 6),
    critical_severity: idx % 5 === 0 ? 1 : 0
  }));

  return {
    table: 'alerts',
    station_code: stationCode,
    columns: [
      { key: 'recorded_at', name: 'Timestamp (UTC)', type: 'datetime' },
      { key: 'active_alerts', name: 'Active Alerts', unit: 'alerts', color: '#ef4444', axis: 0 },
      { key: 'acknowledged_alerts', name: 'Acknowledged', unit: 'alerts', color: '#f59e0b', axis: 0 },
      { key: 'resolved_alerts', name: 'Resolved Alerts', unit: 'alerts', color: '#10b981', axis: 0 },
      { key: 'critical_severity', name: 'Critical Emergency Flags', unit: 'flags', color: '#8b5cf6', axis: 1 }
    ],
    rows
  };
};
