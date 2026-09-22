import React from 'react';
import { Link } from 'react-router';
import './welcome.css';

export default function Welcome() {
  const stations = [
    {
      name: 'Maitri Research Station',
      code: 'MTR',
      coords: "70°46'S, 11°44'E • Schirmacher Oasis",
      status: 'Operational',
      syncTime: '2026-09-22 18:30:15 UTC',
      link: '/maitri/weather'
    },
    {
      name: 'Bharati Research Station',
      code: 'BHR',
      coords: "69°24'S, 76°11'E • Larsemann Hills",
      status: 'Operational',
      syncTime: '2026-09-22 18:28:40 UTC',
      link: '/bharti/weather'
    }
  ];

  return (
    <div className="welcome-container">
      {/* Hero Welcome Banner */}
      <div className="welcome-hero-banner">
        <div className="hero-tag">
          <span className="hero-flag">🇮🇳</span>
          <span className="hero-tag-text">
            NCPOR • National Centre for Polar and Ocean Research
          </span>
        </div>
        <h1 className="hero-title">
          Indian Antarctic Remote IoT Dashboard
        </h1>
        <p className="hero-description">
          Real-time telemetry monitoring, weather observations, microgrid energy generation, fuel storage reserves, and automated alert logs powered by MySQL 8.4 database engine (<code className="db-badge-code">antarctic_station_db</code>).
        </p>

        <div className="tech-specs-grid">
          <div className="spec-card">
            <div className="spec-label label-blue">Database Engine</div>
            <div className="spec-value">MySQL 8.4 InnoDB</div>
            <div className="spec-sub">utf8mb4_0900_ai_ci</div>
          </div>
          <div className="spec-card">
            <div className="spec-label label-green">Chart Engine</div>
            <div className="spec-value">Apache ECharts</div>
            <div className="spec-sub">Single plot per page with metric toggles</div>
          </div>
          <div className="spec-card">
            <div className="spec-label label-amber">State Management</div>
            <div className="spec-value">React Redux Toolkit</div>
            <div className="spec-sub">Dynamic telemetry sync & filters</div>
          </div>
        </div>
      </div>

      {/* Station Selector Cards */}
      <h2 className="section-heading">Select Antarctic Research Station</h2>
      <div className="stations-card-grid">
        {stations.map((s) => (
          <div key={s.code} className="welcome-station-card">
            <div className="station-card-top">
              <span className="station-code-badge">{s.code}</span>
              <span className="station-status-pill">{s.status}</span>
            </div>

            <h3 className="station-card-title">{s.name}</h3>
            <p className="station-card-coords">{s.coords}</p>

            <div className="station-sync-info">
              <span>Last Synced:</span>
              <span className="sync-time-val">{s.syncTime}</span>
            </div>

            <Link to={s.link} className="open-dashboard-btn">
              Open {s.name.split(' ')[0]} Dashboard →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}