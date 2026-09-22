import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeStation: 'maitri',
  stations: {
    maitri: {
      id: 1,
      name: 'Maitri Station',
      code: 'MTR',
      region: 'Queen Maud Land',
      latitude: -70.766667,
      longitude: 11.733333,
      elevation_m: 130.00,
      capacity: 25,
      status: 'operational',
      lastSyncedAt: '2026-09-22 18:30:15 UTC',
      isSyncing: false,
    },
    bharti: {
      id: 2,
      name: 'Bharati Station',
      code: 'BHR',
      region: 'Larsemann Hills',
      latitude: -69.408333,
      longitude: 76.195833,
      elevation_m: 35.00,
      capacity: 47,
      status: 'operational',
      lastSyncedAt: '2026-09-22 18:28:40 UTC',
      isSyncing: false,
    }
  }
};

const stationSlice = createSlice({
  name: 'station',
  initialState,
  reducers: {
    setActiveStation: (state, action) => {
      state.activeStation = action.payload;
    },
    triggerSync: (state, action) => {
      const stationKey = action.payload;
      if (state.stations[stationKey]) {
        state.stations[stationKey].isSyncing = true;
      }
    },
    syncSuccess: (state, action) => {
      const { stationKey, timestamp } = action.payload;
      if (state.stations[stationKey]) {
        state.stations[stationKey].lastSyncedAt = timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        state.stations[stationKey].isSyncing = false;
      }
    }
  }
});

export const { setActiveStation, triggerSync, syncSuccess } = stationSlice.actions;
export default stationSlice.reducer;
