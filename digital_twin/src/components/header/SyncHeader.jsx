import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { triggerSync, syncSuccess } from '../../store/stationSlice';
import './syncHeader.css';

export default function SyncHeader({ stationKey, pageTitle, moduleDescription }) {
  const dispatch = useDispatch();
  const stationInfo = useSelector((state) => state.station.stations[stationKey]) || {
    name: 'Antarctic Station',
    code: 'ANT',
    lastSyncedAt: '2026-09-22 18:00:00 UTC',
    isSyncing: false,
    status: 'operational',
    latitude: -70.0,
    longitude: 12.0
  };

  const handleManualSync = () => {
    dispatch(triggerSync(stationKey));
    setTimeout(() => {
      const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      dispatch(syncSuccess({ stationKey, timestamp: nowFormatted }));
    }, 800);
  };

  return (
    <header className="sync-header-container">
      <div className="sync-header-left">
        <div className="station-pill">
          <span className="station-flag">🇦🇳</span>
          <span className="station-pill-name">{stationInfo.name}</span>
          <span className={`station-pill-status ${stationInfo.status}`}>
            {stationInfo.status.replace('_', ' ')}
          </span>
        </div>
        <h1 className="page-main-title">{pageTitle}</h1>
        {moduleDescription && <p className="page-main-desc">{moduleDescription}</p>}
      </div>

      <div className="sync-header-right">
        <div className="sync-card">
          <div className="sync-indicator">
            <span className={`sync-pulse ${stationInfo.isSyncing ? 'syncing' : ''}`}></span>
            <span className="sync-label">DATABASE SYNC STATUS</span>
          </div>

          <div className="sync-timestamp-box">
            <span className="sync-clock-icon">🕒</span>
            <span className="sync-timestamp-text">
              Last Synced: <strong>{stationInfo.lastSyncedAt}</strong>
            </span>
          </div>

          <button 
            className={`sync-refresh-btn ${stationInfo.isSyncing ? 'btn-spin' : ''}`}
            onClick={handleManualSync}
            disabled={stationInfo.isSyncing}
            title="Fetch latest IoT sensor telemetry from antarctic_station_db"
          >
            <span className="btn-icon">🔄</span>
            <span>{stationInfo.isSyncing ? 'Syncing...' : 'Sync Station'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
