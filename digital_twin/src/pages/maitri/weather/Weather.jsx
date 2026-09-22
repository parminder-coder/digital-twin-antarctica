import React from 'react';
import StationModulePage from '../../../components/common/StationModulePage';

export default function MaitriWeather() {
  return (
    <StationModulePage
      stationKey="maitri"
      stationCode="MTR"
      moduleKey="weather"
      pageTitle="Maitri Station — Weather Telemetry"
      moduleDescription="Real-time meteorological observations from Schirmacher Oasis IoT sensor network."
    />
  );
}
