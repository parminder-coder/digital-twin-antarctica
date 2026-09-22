import React from 'react';
import StationModulePage from '../../../components/common/StationModulePage';

export default function MaitriEnergyFuel() {
  return (
    <StationModulePage
      stationKey="maitri"
      stationCode="MTR"
      moduleKey="energy_fuel"
      pageTitle="Maitri Station — Energy & Fuel Microgrid"
      moduleDescription="Power generation metrics (diesel gensets, solar, wind, battery bank) and fuel storage level monitoring."
    />
  );
}
