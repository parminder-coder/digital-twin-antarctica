import React from 'react';
import StationModulePage from '../../../components/common/StationModulePage';

export default function BhartiInventory() {
  return (
    <StationModulePage
      stationKey="bharti"
      stationCode="BHR"
      moduleKey="inventory"
      pageTitle="Bharati Station — Inventory & Stock Levels"
      moduleDescription="Tracking station supplies, food rations, spare parts, and minimum low-stock threshold triggers."
    />
  );
}
