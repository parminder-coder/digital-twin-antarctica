import React from 'react';
import { NavLink } from 'react-router';
import './sidebar.css';

export default function Sidebar() {
  const stationModules = [
    { key: 'infra', label: 'Infrastructure', path: 'infra', icon: '⚡' },
    { key: 'weather', label: 'Weather Telemetry', path: 'weather', icon: '🌡️' },
    { key: 'energy_fuel', label: 'Energy & Fuel', path: 'energy_fuel', icon: '🔋' },
    { key: 'inventory', label: 'Inventory Stock', path: 'inventory', icon: '📦' },
    { key: 'alert_log', label: 'Alert Logs', path: 'alert_log', icon: '🚨' },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <span className="logo-icon">❄️</span>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">INDIAN ANTARCTIC</h1>
            <p className="brand-subtitle">IoT Remote Digital Twin</p>
          </div>
        </div>
      </div>

      <div className="sidebar-content">
        {/* MAITRI STATION CARD */}
        <div className="station-card">
          <div className="station-card-header">
            <div className="station-title-group">
              <span className="station-flag">🇮🇳</span>
              <h2 className="station-name">Maitri Station</h2>
            </div>
            <span className="station-badge badge-online">Operational</span>
          </div>
          <p className="station-coords">70°46'S, 11°44'E • Schirmacher Oasis</p>

          <nav className="station-nav">
            {stationModules.map((module) => (
              <NavLink
                key={`maitri-${module.key}`}
                to={`/maitri/${module.path}`}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
              >
                <span className="nav-icon">{module.icon}</span>
                <span className="nav-label">{module.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* BHARATI STATION CARD */}
        <div className="station-card">
          <div className="station-card-header">
            <div className="station-title-group">
              <span className="station-flag">🇮🇳</span>
              <h2 className="station-name">Bharati Station</h2>
            </div>
            <span className="station-badge badge-online">Operational</span>
          </div>
          <p className="station-coords">69°24'S, 76°11'E • Larsemann Hills</p>

          <nav className="station-nav">
            {stationModules.map((module) => (
              <NavLink
                key={`bharti-${module.key}`}
                to={`/bharti/${module.path}`}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
              >
                <span className="nav-icon">{module.icon}</span>
                <span className="nav-label">{module.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="db-indicator">
          <span className="db-dot"></span>
          <span className="db-text">antarctic_station_db (MySQL 8.4)</span>
        </div>
      </div>
    </aside>
  );
}