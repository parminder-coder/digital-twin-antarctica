import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Dashboard from './dashboard/dashboard';

// Maitri pages
import MaitriInfra from './pages/maitri/infrastructure/Infra';
import MaitriWeather from './pages/maitri/weather/Weather';
import MaitriEnergyFuel from './pages/maitri/energy and fuel/EnergyFuel';
import MaitriInventory from './pages/maitri/inventory/Inventory';
import MaitriAlertLog from './pages/maitri/alerts/AlertLog';

// Bharti pages
import BhartiInfra from './pages/bharti/infrastructure/Infra';
import BhartiWeather from './pages/bharti/weather/Weather';
import BhartiEnergyFuel from './pages/bharti/energy and fuel/EnergyFuel';
import BhartiInventory from './pages/bharti/inventory/Inventory';
import BhartiAlertLog from './pages/bharti/alerts/AlertLog';

import Welcome from './components/welcome/Welcome';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      Component: Dashboard,
      children: [
        {
          path: 'maitri',
          children: [
            { path: 'infra', Component: MaitriInfra },
            { path: 'weather', Component: MaitriWeather },
            { path: 'energy_fuel', Component: MaitriEnergyFuel },
            { path: 'energy&fuel', Component: MaitriEnergyFuel },
            { path: 'inventory', Component: MaitriInventory },
            { path: 'alert_log', Component: MaitriAlertLog },
          ],
        },

        {
          path: 'bharti',
          children: [
            { path: 'infra', Component: BhartiInfra },
            { path: 'weather', Component: BhartiWeather },
            { path: 'energy_fuel', Component: BhartiEnergyFuel },
            { path: 'energy&fuel', Component: BhartiEnergyFuel },
            { path: 'inventory', Component: BhartiInventory },
            { path: 'alert_log', Component: BhartiAlertLog },
          ],
        },

        { index: true, Component: Welcome },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
