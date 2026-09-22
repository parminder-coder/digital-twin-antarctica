import React from 'react';
import StationModulePage from '../../../components/common/StationModulePage';

export default function MaitriAlertLog() {
  return (
    <StationModulePage
      stationKey="maitri"
      stationCode="MTR"
      moduleKey="alert_log"
      pageTitle="Maitri Station — Anomaly & Incident Alerts"
      moduleDescription="Log of system anomalies, active threshold breaches, and emergency alerts recorded by station sensors."
    />
  );
}
