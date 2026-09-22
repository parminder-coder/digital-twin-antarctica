# Indian Antarctic Research Stations IoT Digital Twin

A modular full-stack architecture for remote IoT telemetry monitoring of Indian Antarctic Research Stations (**Bharati** and **Maitri**).

---

## 🏗️ Project Architecture

```
sih digital twin/
├── antarctic_station_db.sql    # Production MySQL 8.4 DDL Schema
├── backend/                    # Node.js + Express REST API Server
│   ├── config/                 # MySQL 8.4 connection pool (antarctic_station_db)
│   ├── controllers/            # Station & Telemetry controller handlers
│   ├── routes/                 # Express API routes (/api/stations, /api/telemetry)
│   ├── seed/                   # Database seeder script (seedData.js)
│   ├── utils/                  # Telemetry dataset generator logic
│   ├── server.js               # Express API entry point (Port 5000)
│   └── package.json
└── digital_twin/               # React + Vite Frontend Application
    ├── src/
    │   ├── components/         # Sidebar, SyncHeader, ApacheEChart, DataTable
    │   ├── pages/              # Maitri and Bharati module pages
    │   ├── store/              # Redux Toolkit store & thunks
    │   └── services/           # API fetch client service connecting to backend
    └── package.json
```

---

## 🚀 How to Run the Application

### 1. Database Setup (MySQL 8.4)
Import the schema into MySQL:
```bash
mysql -u root -p < antarctic_station_db.sql
```

### 2. Backend REST API Server (`backend/`)
```bash
cd backend
npm install
npm run seed      # Populates antarctic_station_db
npm start         # Runs Express server at http://localhost:5000
```

### 3. Frontend Web Application (`digital_twin/`)
```bash
cd digital_twin
npm install
npm run dev       # Runs Vite frontend server
```

---

## 📊 Key Features
- **Express REST API Backend**: Decoupled Node.js Express server handling SQL queries against `antarctic_station_db`.
- **Apache ECharts Single Plot**: Single interactive graph per page with toggle pills to view metrics together or separately.
- **Data Table below Plot**: Complete dataset display with pagination, search, and CSV export.
- **Station Sync Metadata Header**: Shows last synced date per active station (Maitri & Bharati).
- **Dark Blue Sidebar**: Distinct navy sidebar for station navigation matching the wireframe layout.
