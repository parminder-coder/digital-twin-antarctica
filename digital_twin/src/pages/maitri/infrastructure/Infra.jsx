import React from 'react';
import StationModulePage from '../../../components/common/StationModulePage';

export default function MaitriInfra() {
  return (
    <StationModulePage
      stationKey="maitri"
      stationCode="MTR"
      moduleKey="infra"
      pageTitle="Maitri Station — Infrastructure Health"
      moduleDescription="Life support, station heating, satellite communications, and hardware unit status monitoring."
    />
  );
}
