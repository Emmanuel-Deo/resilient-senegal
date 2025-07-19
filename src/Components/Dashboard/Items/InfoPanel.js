import React, { useState } from "react";
import { useMapContext } from "../../../Contexts/MapContext";
import AOIPreview from "./AOIPreview";

import AdminSelectionBar from "./AdminSelectionBar";
import ZoomControl from "./ZoomControl";
import AnnualStats from "./AnnualStats";
import MonthlyStats from "./MonthlyStats";
import ComparisonPieChart from "./ComparisonPieChart";

export default function InfoPanel() {
  
  const { selectedAdm1, selectedAdm2, selectedAdm3 , zoomLevel, setZoomLevel, filteredGeoJson, setFilteredGeoJson} = useMapContext();
  const {
    year,
    setYear,

  } = useMapContext();

  
  return (
    <div className="info-panel">
      <AdminSelectionBar onGeoJsonChange={setFilteredGeoJson} />

    
      {/* <h3>{aoi} {dataset} {year}</h3> */}

      <AOIPreview
  selectedAdm1={selectedAdm1}
  selectedAdm2={selectedAdm2}
  selectedAdm3={selectedAdm3}
  geoJsonData={filteredGeoJson}
/>
      <div className="year-selector">
        <button onClick={() => setYear((prev) => Number(prev) - 1)}>«</button>
        <span className="selected-year">{year}</span>
        <button onClick={() => setYear((prev) => Number(prev) + 1)}>»</button>
      </div>

<div style={{ width: "380px", height: "300px" , marginTop:'32px'}}>
  <AnnualStats />
  <ComparisonPieChart/>
</div>

    </div>
  );
}
