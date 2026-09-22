import React from 'react';
import StationModulePage from '../../../components/common/StationModulePage';

export default function BhartiWeather() {
  return (
    <StationModulePage
      stationKey="bharti"
      stationCode="BHR"
      moduleKey="weather"
      pageTitle="Bharati Station — Weather Telemetry"
      moduleDescription="Real-time meteorological observations from Larsemann Hills IoT sensor network."
    />
  );
}
