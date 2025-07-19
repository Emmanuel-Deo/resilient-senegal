import React, { createContext, useContext, useState, useMemo } from "react";

const MapContext = createContext();


export const MapProvider = ({ children }) => {
  const [selectedAdm0, setSelectedAdm0] = useState("Senegal");
  const [selectedAdm1, setSelectedAdm1] = useState(null);
  const [selectedAdm2, setSelectedAdm2] = useState(null);
  const [selectedAdm3, setSelectedAdm3] = useState(null);

  const [filteredGeoJson, setFilteredGeoJson] = useState(null);
  const [customClassification, setCustomClassification] = useState(null);


  const [selectedBasemap, setSelectedBasemap] = useState("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
  const [dataset, setDataset] = useState("NDVI");
  const [aoi, setAoi] = useState("Senegal");
  const [month, setMonth] = useState("04");
  const [year, setYear] = useState("2000");
  const [zoomLevel, setZoomLevel] = useState("7");
  
  const sanitize = (str) =>
    str?.trim().replace(/\s+/g, "-").replace(/\//g, "-") || null;

  const layerName = useMemo(() => {
    const paddedMonth = String(month).padStart(2, "0");
    const hierarchy = [sanitize(selectedAdm0)];
    if (selectedAdm1) hierarchy.push(sanitize(selectedAdm1));
    if (selectedAdm2) hierarchy.push(sanitize(selectedAdm2));
    if (selectedAdm3) hierarchy.push(sanitize(selectedAdm3));

    const safeParts = hierarchy.filter(Boolean);

    const name = `resilientsenegal:${dataset}_${year}${paddedMonth}_${safeParts.join("_")}`;
    return name;
  }, [dataset, year, month, selectedAdm0, selectedAdm1, selectedAdm2, selectedAdm3]);

  const layerKey = layerName;

  console.log(layerName)

  return (
    <MapContext.Provider
      value={{
        selectedBasemap,
        setSelectedBasemap,
        dataset,
        setDataset,
        aoi,
        setAoi,
        month,
        setMonth,
        year,
        setYear,
        zoomLevel,
        setZoomLevel,
        setSelectedAdm0,
        selectedAdm1,
        setSelectedAdm1,
        selectedAdm2,
        setSelectedAdm2,
        selectedAdm3,
        setSelectedAdm3,
        filteredGeoJson, 
        setFilteredGeoJson,
        customClassification, setCustomClassification,
        layerName,
        layerKey,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);
