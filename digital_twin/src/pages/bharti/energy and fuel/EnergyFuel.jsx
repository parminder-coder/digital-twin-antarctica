import React from 'react';
import StationModulePage from '../../../components/common/StationModulePage';

export default function BhartiEnergyFuel() {
  return (
    <StationModulePage
      stationKey="bharti"
      stationCode="BHR"
      moduleKey="energy_fuel"
      pageTitle="Bharati Station — Energy & Fuel Microgrid"
      moduleDescription="Power generation metrics (diesel gensets, solar, wind, battery bank) and fuel storage level monitoring."
    />
  );
}
