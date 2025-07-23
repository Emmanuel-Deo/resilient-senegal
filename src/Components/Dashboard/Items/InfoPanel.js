import React, { useState } from "react";
import { useMapContext } from "../../../Contexts/MapContext";
import AOIPreview from "./AOIPreview";

import AdminSelectionBar from "./AdminSelectionBar";
import AnnualStats from "./AnnualStats";
import DatasetIndicator from "./DatasetIndicator";
import DatasetOverview from "./DatasetOverview";
import ChartDescription from "./ChartDescription";
import YearSelector from "./YearSelector";

export default function InfoPanel() {
  
  const {  year,
    setYear,dataset,selectedAdm0,selectedAdm1, selectedAdm2, selectedAdm3 , zoomLevel, setZoomLevel, filteredGeoJson, setFilteredGeoJson} = useMapContext();
 

  
  return (
    
    <div className="info-panel">
      <DatasetIndicator selectedDataset = {dataset}/>

      <AdminSelectionBar onGeoJsonChange={setFilteredGeoJson} />

      <AOIPreview
        selectedAdm1={selectedAdm1}
        selectedAdm2={selectedAdm2}
        selectedAdm3={selectedAdm3}
        geoJsonData={filteredGeoJson}
      />

          <div>
      {/* <YearSelector /> */}
    </div>


      <DatasetOverview selectedDataset={dataset} year={year} />

      <div style={{ width: "380px", height: "300px" , marginTop:'32px'}}>
        <AnnualStats />
        {/* <TaskProgress/> */}
      </div>

      <ChartDescription
        year={year}
        dataset={dataset}
        selectedAdm0={selectedAdm0}
        selectedAdm1={selectedAdm1}
        selectedAdm2={selectedAdm2}
        selectedAdm3={selectedAdm3}
      />


    </div>
  );
}
