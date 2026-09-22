import React from 'react';
import StationModulePage from '../../../components/common/StationModulePage';

export default function BhartiInfra() {
  return (
    <StationModulePage
      stationKey="bharti"
      stationCode="BHR"
      moduleKey="infra"
      pageTitle="Bharati Station — Infrastructure Health"
      moduleDescription="Life support, station heating, satellite communications, and hardware unit status monitoring."
    />
  );
}
