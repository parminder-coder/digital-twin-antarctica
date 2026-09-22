import React from 'react';
import StationModulePage from '../../../components/common/StationModulePage';

export default function MaitriInventory() {
  return (
    <StationModulePage
      stationKey="maitri"
      stationCode="MTR"
      moduleKey="inventory"
      pageTitle="Maitri Station — Inventory & Stock Levels"
      moduleDescription="Tracking station supplies, food rations, spare parts, and minimum low-stock threshold triggers."
    />
  );
}
