import express from 'express';
import {
  getWeatherTelemetry,
  getEnergyFuelTelemetry,
  getInfrastructureTelemetry,
  getInventoryTelemetry,
  getAlertsTelemetry
} from '../controllers/telemetryController.js';

const router = express.Router();

router.get('/weather/:stationCode', getWeatherTelemetry);
router.get('/energy-fuel/:stationCode', getEnergyFuelTelemetry);
router.get('/infrastructure/:stationCode', getInfrastructureTelemetry);
router.get('/inventory/:stationCode', getInventoryTelemetry);
router.get('/alerts/:stationCode', getAlertsTelemetry);

export default router;
