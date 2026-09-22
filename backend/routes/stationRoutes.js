import express from 'express';
import { getStations, syncStation } from '../controllers/stationController.js';

const router = express.Router();

router.get('/', getStations);
router.post('/:stationCode/sync', syncStation);

export default router;
