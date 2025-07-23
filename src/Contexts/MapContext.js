import React, { createContext, useContext, useState, useMemo } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [selectedAdm0, setSelectedAdm0] = useState("Senegal");
  const [selectedAdm1, setSelectedAdm1] = useState("");
  const [selectedAdm2, setSelectedAdm2] = useState("");
  const [selectedAdm3, setSelectedAdm3] = useState("");

  const [filteredGeoJson, setFilteredGeoJson] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [customObsClassification, setCustomObsClassification] = useState(null);
  const [customLtmClassification, setCustomLtmClassification] = useState(null);
    const [activeLayerName, setActiveLayerName] = useState(null);
  const [activeLtmLayerName, setActiveLtmLayerName] = useState(null);

  const [serverResponse, setServerResponse] = useState(null)

  const [selectedBasemap, setSelectedBasemap] = useState(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  );
  const [dataset, setDataset] = useState("NDVI");
  const [aoi, setAoi] = useState("Senegal");
  const [month, setMonth] = useState(4);
   const [year, setYear] = useState(new Date().getFullYear());
  const [frequency, setFrequency] = useState("monthly");

  const sanitize = (str) =>
    str?.trim().replace(/\s+/g, "-").replace(/\//g, "-") || null;

  const layerName = useMemo(() => {
    const paddedMonth = String(month).padStart(2, "0");
    const hierarchy = [sanitize(selectedAdm0)];
    if (selectedAdm1) hierarchy.push(sanitize(selectedAdm1));
    if (selectedAdm2) hierarchy.push(sanitize(selectedAdm2));
    if (selectedAdm3) hierarchy.push(sanitize(selectedAdm3));

    const safeParts = hierarchy.filter(Boolean);
    return `resilientsenegal:${dataset}_${year}${paddedMonth}_${safeParts.join("_")}`;
  }, [dataset, year, month, selectedAdm0, selectedAdm1, selectedAdm2, selectedAdm3]);

  const ltmLayerName = useMemo(() => {
    const paddedMonth = String(month).padStart(2, "0");
    const hierarchy = [sanitize(selectedAdm0)];
    if (selectedAdm1) hierarchy.push(sanitize(selectedAdm1));
    if (selectedAdm2) hierarchy.push(sanitize(selectedAdm2));
    if (selectedAdm3) hierarchy.push(sanitize(selectedAdm3));

    const safeParts = hierarchy.filter(Boolean);
    return `resilientsenegal:${dataset}_LTM_${paddedMonth}_${safeParts.join("_")}`;
  }, [dataset, month, selectedAdm0, selectedAdm1, selectedAdm2, selectedAdm3]);

  const layerKey = layerName;

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
       
        frequency,
        setFrequency,
        selectedAdm0,
        setSelectedAdm0,
        selectedAdm1,
        setSelectedAdm1,
        selectedAdm2,
        setSelectedAdm2,
        selectedAdm3,
        setSelectedAdm3,
        filteredGeoJson,
        setFilteredGeoJson,
        customObsClassification, setCustomObsClassification,
        customLtmClassification, setCustomLtmClassification,
        layerName,
        ltmLayerName,
        layerKey,isComparing, setIsComparing,
        serverResponse, setServerResponse,


        activeLayerName,
        setActiveLayerName,
        activeLtmLayerName,
        setActiveLtmLayerName,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);