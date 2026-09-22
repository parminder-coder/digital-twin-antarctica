import { configureStore } from '@reduxjs/toolkit';
import stationReducer from './stationSlice';
import telemetryReducer from './telemetrySlice';

export const store = configureStore({
  reducer: {
    station: stationReducer,
    telemetry: telemetryReducer,
  },
});

export default store;
