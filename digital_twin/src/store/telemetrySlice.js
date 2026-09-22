import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchWeatherDatabase, 
  fetchEnergyFuelDatabase, 
  fetchInfrastructureDatabase, 
  fetchInventoryDatabase, 
  fetchAlertsDatabase 
} from '../services/databaseService';

// Async Thunk for database fetching
export const fetchTelemetryDataAsync = createAsyncThunk(
  'telemetry/fetchData',
  async ({ module, stationCode }) => {
    let rawData = null;
    if (module === 'weather') {
      rawData = await fetchWeatherDatabase(stationCode);
    } else if (module === 'energy_fuel') {
      rawData = await fetchEnergyFuelDatabase(stationCode);
    } else if (module === 'infra') {
      rawData = await fetchInfrastructureDatabase(stationCode);
    } else if (module === 'inventory') {
      rawData = await fetchInventoryDatabase(stationCode);
    } else if (module === 'alert_log') {
      rawData = await fetchAlertsDatabase(stationCode);
    }
    return { module, stationCode, dataset: rawData };
  }
);

const initialState = {
  currentModule: 'weather',
  stationCode: 'MTR',
  dataset: null,
  visibleElements: {},
  loading: false,
  error: null
};

const telemetrySlice = createSlice({
  name: 'telemetry',
  initialState,
  reducers: {
    toggleElementVisibility: (state, action) => {
      const key = action.payload;
      if (state.visibleElements[key] !== undefined) {
        state.visibleElements[key] = !state.visibleElements[key];
      }
    },
    setAllElementsVisibility: (state, action) => {
      const enable = action.payload;
      Object.keys(state.visibleElements).forEach(key => {
        state.visibleElements[key] = enable;
      });
    },
    selectSingleElementOnly: (state, action) => {
      const targetKey = action.payload;
      Object.keys(state.visibleElements).forEach(key => {
        state.visibleElements[key] = key === targetKey;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTelemetryDataAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTelemetryDataAsync.fulfilled, (state, action) => {
        const { module, stationCode, dataset } = action.payload;
        state.loading = false;
        state.currentModule = module;
        state.stationCode = stationCode;
        state.dataset = dataset;

        const elementMap = {};
        if (dataset && dataset.columns) {
          dataset.columns.forEach(col => {
            if (col.key !== 'recorded_at' && col.key !== 'item_name' && col.key !== 'category') {
              elementMap[col.key] = true;
            }
          });
        }
        state.visibleElements = elementMap;
      })
      .addCase(fetchTelemetryDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { 
  toggleElementVisibility, 
  setAllElementsVisibility, 
  selectSingleElementOnly 
} = telemetrySlice.actions;

export default telemetrySlice.reducer;
