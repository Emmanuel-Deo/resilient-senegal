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
    <div style={{ paddingTop: '32px', }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* Left: Monthly Trend Title */}
        <div style={{ fontSize: '1rem', fontWeight: '600', color: 'green', textAlign: 'center' }}> 
          {selectedDataset} Monthly Trend for the Year {year} 
        </div>
       
        {/* Right: Dataset Title */}
        {/* <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'blue', alignItems: 'center' }}>
          {year}
        </span> */}
        <YearSelector year={year} setYear={setYear} />
      </div>
    </div>
  );
}
