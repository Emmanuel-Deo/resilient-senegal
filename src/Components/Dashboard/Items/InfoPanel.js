import React, { useState } from "react";
import { useMapContext } from "../../../Contexts/MapContext";
import AOIPreview from "./AOIPreview";

import AdminSelectionBar from "./AdminSelectionBar";
import AnnualStats from "./AnnualStats";
import DatasetIndicator from "./DatasetIndicator";
import DatasetOverview from "./DatasetOverview";
import ChartDescription from "./ChartDescription";
import YearSelector from "./YearSelector";
import GeoJSONUploadDropzone from "./GeoJSONUploadDropzone";




export default function InfoPanel() {

  function handleGeoJSONUpload(data) {
  console.log("Parsed GeoJSON:", data);
  // Call processGeoJSONPolygon(data) here
}
  
  const {  year,
    setYear,dataset,selectedAdm0,selectedAdm1, selectedAdm2, selectedAdm3 , zoomLevel, setZoomLevel, filteredGeoJson, setFilteredGeoJson} = useMapContext();
 

  
  return (
    
    <div className="info-panel">
      <DatasetIndicator selectedDataset = {dataset}
      />
      <div className = "dataset-container">
          <AdminSelectionBar onGeoJsonChange={setFilteredGeoJson} />

          <AOIPreview
            selectedAdm1={selectedAdm1}
            selectedAdm2={selectedAdm2}
            selectedAdm3={selectedAdm3}
            geoJsonData={filteredGeoJson}
          />
      </div >
    
      <div className = "dataset-container">
        <DatasetOverview selectedDataset={dataset} year={year} />

          <div style={{ width: "380px", height: "300px" , marginTop:'16px'}}>
          <AnnualStats />
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

   
      {/* <GeoJSONUploadDropzone onUpload={handleGeoJSONUpload} /> */}
    


    </div>
  );
}
