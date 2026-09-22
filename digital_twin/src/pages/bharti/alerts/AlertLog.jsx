import React from 'react';
import StationModulePage from '../../../components/common/StationModulePage';

export default function BhartiAlertLog() {
  return (
    <StationModulePage
      stationKey="bharti"
      stationCode="BHR"
      moduleKey="alert_log"
      pageTitle="Bharati Station — Anomaly & Incident Alerts"
      moduleDescription="Log of system anomalies, active threshold breaches, and emergency alerts recorded by station sensors."
    />
  );
}
