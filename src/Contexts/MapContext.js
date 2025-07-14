import React, { createContext, useContext, useState } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [selectedAdm1, setSelectedAdm1] = useState("Diourbel");
  const [selectedAdm2, setSelectedAdm2] = useState("");
  const [selectedAdm3, setSelectedAdm3] = useState("");

  const [selectedBasemap, setSelectedBasemap] = useState("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
  const [dataset, setDataset] = useState("PPT");
  const [aoi, setAoi] = useState("Senegal");
  const [month, setMonth] = useState("3");
  const [year, setYear] = useState("2002");
  const [frequency, setFrequency] = useState("monthly");

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
        selectedAdm1,
        setSelectedAdm1,
        selectedAdm2,
        setSelectedAdm2,
        selectedAdm3,
        setSelectedAdm3,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);
