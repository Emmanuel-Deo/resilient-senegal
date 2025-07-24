import React from 'react';
import YearSelector from "./YearSelector";


const datasetDescriptions = {
  // PPT: { title: "Precipitation (PPT)" },
  // LST: { title: "Land Surface Temperature (LST)" },
  // NDVI: { title: "Normalized Difference Vegetation Index (NDVI)" },
  // PDI: { title: "Precipitation Drought Index (PDI)" },
  // VDI: { title: "Vegetation Drought Index (VDI)" },
  // TDI: { title: "Temperature Drought Index (TDI)" },
  // CDI: { title: "Combined Drought Index (CDI)" }
};

export default function DatasetOverview({ selectedDataset, year, setYear }) {
  const data = datasetDescriptions[selectedDataset];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        {/* Left: Monthly Trend Title */}
        <div style={{ fontSize: '1rem', fontWeight: '600',  color: '#1a4f8b', textAlign: 'center' }}> 
          {selectedDataset} Monthly Trend for the Year {year} 
        </div>
      
      </div>
    </div>
  );
}
