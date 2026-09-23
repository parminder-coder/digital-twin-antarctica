import React from 'react';
import { Link } from 'react-router';
import maitriImg from '../../assets/images/maitri.png';
import bhartiImg from '../../assets/images/bharti.png';
import './welcome.css';

export default function Welcome() {
  const stations = [
    {
      code: 'maitri',
      name: 'Maitri Research Station',
      image: maitriImg,
      coords: "70°46'S, 11°44'E • Schirmacher Oasis",
      syncTime: '2026-09-22 18:30:15 UTC',
      link: '/maitri/weather'
    },
    {
      code: 'bharti',
      name: 'Bharati Research Station',
      image: bhartiImg,
      coords: "69°24'S, 76°11'E • Larsemann Hills",
      syncTime: '2026-09-22 18:28:40 UTC',
      link: '/bharti/weather'
    }
  ];

  return (
    <div className="welcome-container">
      {/* Hero Welcome Banner */}
      <div className="welcome-hero-banner">        
        <h1 className="hero-title">
          Indian Antarctic Remote Management
        </h1>
        <div className="hero-tag">
          <span className="hero-flag">🇮🇳</span>
          <span className="hero-tag-text">
            NCPOR • National Centre for Polar and Ocean Research
          </span>
        </div>
        <p className="hero-description">
          Real-time telemetry monitoring, weather observations, microgrid energy generation, fuel storage reserves, and automated alert logs
        </p>
      </div>

      {/* Station Selector Cards */}
      <h2 className="section-heading">Select Antarctic Research Station</h2>
      <div className="stations-card-grid">
        {stations.map((s) => (
          <div key={s.code} className="welcome-station-card">
            <div className="station-card-image-wrapper">
              <img src={s.image} alt={s.name} className="station-card-image" />
            </div>

            <div className="station-card-content">
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
          </div>
        ))}
      </div>
    </div>
  );
}