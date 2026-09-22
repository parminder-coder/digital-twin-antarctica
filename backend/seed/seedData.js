import pool from '../config/db.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding for antarctic_station_db...');

    // 1. Seed Stations (Maitri & Bharati)
    await pool.query(`
      INSERT INTO stations (station_id, station_name, station_code, latitude, longitude, elevation_m, capacity, status)
      VALUES 
        (1, 'Maitri Research Station', 'MTR', -70.766667, 11.733333, 130.00, 25, 'operational'),
        (2, 'Bharati Research Station', 'BHR', -69.408333, 76.195833, 35.00, 47, 'operational')
      ON DUPLICATE KEY UPDATE station_name=VALUES(station_name);
    `);

    // 2. Seed Infrastructure
    await pool.query(`
      INSERT INTO infrastructure (station_id, component_name, component_type, status)
      VALUES
        (1, 'Main Power Plant #1', 'Power Generation', 'online'),
        (1, 'Life Support HVAC Unit', 'HVAC', 'online'),
        (1, 'Satellite Uplink Array', 'Communications', 'online'),
        (2, 'Solar Array System', 'Renewable Energy', 'online'),
        (2, 'Microgrid Central Inverter', 'Power Distribution', 'online')
      ON DUPLICATE KEY UPDATE component_name=VALUES(component_name);
    `);

    // 3. Seed Weather Data
    const now = new Date();
    for (let i = 0; i < 20; i++) {
      const recordedAt = new Date(now.getTime() - i * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
      await pool.query(`
        INSERT INTO weather_data (station_id, recorded_at, temperature_c, relative_humidity_pct, air_pressure_hpa, wind_speed_mps, wind_direction_deg)
        VALUES 
          (1, '${recordedAt}', -22.5, 68.4, 985.2, 12.4, 215.0),
          (2, '${recordedAt}', -18.2, 72.1, 992.5, 9.8, 180.0)
      `);
    }

    console.log('✅ Database seeding complete!');
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
};

if (process.argv[1].endsWith('seedData.js')) {
  seedDatabase().then(() => process.exit(0));
}
