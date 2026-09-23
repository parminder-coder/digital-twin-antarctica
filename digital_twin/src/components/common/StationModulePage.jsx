import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTelemetryDataAsync } from '../../store/telemetrySlice';
import { setActiveStation } from '../../store/stationSlice';
import SyncHeader from '../header/SyncHeader';
import ApacheEChart from '../charts/ApacheEChart';
import DataTable from '../table/DataTable';
import './stationModulePage.css';

export default function StationModulePage({ 
  stationKey,    // 'maitri' | 'bharti'
  stationCode,   // 'MTR' | 'BHR'
  moduleKey,     // 'weather' | 'energy_fuel' | 'infra' | 'inventory' | 'alert_log'
  pageTitle, 
  moduleDescription 
}) {
  const dispatch = useDispatch();
  const { dataset, loading } = useSelector((state) => state.telemetry);

  useEffect(() => {
    dispatch(setActiveStation(stationKey));
    dispatch(fetchTelemetryDataAsync({ module: moduleKey, stationCode: stationCode }));
  }, [dispatch, stationKey, stationCode, moduleKey]);

  const isAlertLog = moduleKey === 'alert_log';

  return (
    <div className="station-page-wrapper">
      {/* Top Sync Header showing station metadata and Last Synced timestamp */}
      <SyncHeader 
        stationKey={stationKey} 
        pageTitle={pageTitle} 
        moduleDescription={moduleDescription} 
      />

      {loading ? (
        <div className="chart-card-container empty-state">
          <p>⏳ Fetching telemetry records from antarctic_station_db...</p>
        </div>
      ) : (
        <>
          {/* Render Apache ECharts Plot ONLY for non-alert telemetry modules */}
          {!isAlertLog && <ApacheEChart dataset={dataset} />}

          {/* Data Table / List format view below header or plot */}
          <DataTable dataset={dataset} isAlertLog={isAlertLog} />
        </>
      )}
    </div>
  );
}
