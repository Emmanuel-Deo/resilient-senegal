import React, { useState } from "react";
import { useMapContext } from "../../../Contexts/MapContext";
import AOIPreview from "./AOIPreview";

import AdminSelectionBar from "./AdminSelectionBar";

export default function InfoPanel() {
  const [filteredGeoJson, setFilteredGeoJson] = useState(null);
  const { selectedAdm1, selectedAdm2, selectedAdm3 } = useMapContext();
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

    </div>
  );
}
