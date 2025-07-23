import React from 'react';
import './DatasetIndicator.css'; // Add this CSS file for custom styles

const datasetDescriptions = {
  PPT: {
    title: "Precipitation (PPT)",
    description:
      "Shows rainfall patterns. Useful for understanding drought and vegetation health over time."
  },
  LST: {
    title: "Land Surface Temperature (LST)",
    description:
      "Tracks land heating. Helps assess vegetation stress and long-term climate impacts."
  },
  NDVI: {
    title: "Vegetation Index (NDVI)",
    description:
      "Measures greenness and plant density. Indicates vegetation health and land recovery."
  },
  PDI: {
    title: "Precipitation Drought Index (PDI)",
    description:
      "Shows drought due to low rainfall. Useful for water stress monitoring and planning."
  },
  VDI: {
    title: "Vegetation Drought Index (VDI)",
    description:
      "Reflects plant stress from drought. Tracks degradation or recovery in vegetation."
  },
  TDI: {
    title: "Temperature Drought Index (TDI)",
    description:
      "Shows heat-driven drought. Helps monitor extreme temperature effects on land."
  },
  CDI: {
    title: "Combined Drought Index (CDI)",
    description:
      "Combines PDI, VDI, and TDI for a full picture of drought impact on land."
  },
  State: {
    title: "Land State",
    description:
      "Indicates current land condition vs. baseline (e.g. year 2000)."
  },
  Trend: {
    title: "Land Trend",
    description:
      "Shows direction of land change—improving, stable, or degrading."
  },
  Performance: {
    title: "Performance",
    description:
      "Compares trends to SDG targets. Highlights progress toward restoration goals."
  }
};

export default function DatasetIndicator({ selectedDataset }) {
  const data = datasetDescriptions[selectedDataset];

  if (!data) {
    return (
      <div className="dataset-container error">
        <p>Dataset not recognized or not provided.</p>
      </div>
    );
  }

  return (
    <div className="dataset-container">
      <h2 className="dataset-title">{data.title}</h2>
      <p className="dataset-description">{data.description}</p>
    </div>
  );
}
