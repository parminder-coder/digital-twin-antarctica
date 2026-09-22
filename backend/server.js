import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkDatabaseConnection } from './config/db.js';
import stationRoutes from './routes/stationRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Antarctic Research Station IoT Server',
    database: 'antarctic_station_db (MySQL 8.4)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/stations', stationRoutes);
app.use('/api/telemetry', telemetryRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Start Express Server
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(` 🚀 Antarctic IoT Backend Server running on port ${PORT}`);
  console.log(` 📡 Base URL: http://localhost:${PORT}/api`);
  console.log(`=======================================================`);

  // Verify MySQL Database Connection
  await checkDatabaseConnection();
});
