import React from 'react';

const datasetTitles = {
  PPT: "Precipitation (PPT)",
  LST: "Land Surface Temperature (LST)",
  NDVI: "Normalized Difference Vegetation Index (NDVI)",
  PDI: "Precipitation Drought Index (PDI)",
  VDI: "Vegetation Drought Index (VDI)",
  TDI: "Temperature Drought Index (TDI)",
  CDI: "Combined Drought Index (CDI)"
};

export default function ChartDescription({
  year,
  dataset,
  selectedAdm0,
  selectedAdm1,
  selectedAdm2,
  selectedAdm3
}) {
  const title = datasetTitles[dataset] || dataset;
  
  // Build the location string based on available levels
  const locationParts = [selectedAdm3, selectedAdm2, selectedAdm1, selectedAdm0].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(', ') : 'the selected area';

  return (
    <div   >
      <p style={{ fontSize: 15, lineHeight: '1.6', color: '#444'}}>
        This chart displays the <strong>monthly mean values</strong> for <strong>{title}</strong> in <strong>{year}</strong>,
        compared against the <strong>Long-Term Mean (LTM)</strong> from <strong>2001 to 2020</strong> for <strong>{location}</strong>.
        It provides insight into how the selected year’s monthly behavior compares with the historical baseline.
      </p>
    </div>
  );
}
