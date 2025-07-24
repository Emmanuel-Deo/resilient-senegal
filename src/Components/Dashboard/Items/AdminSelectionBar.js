import React, { useState, useEffect } from "react";
import "./AdminSelectionBar.css";
import { useMapContext } from "../../../Contexts/MapContext";
import YearSelector from "./YearSelector";

export default function AdminSelectionBar({ onGeoJsonChange }) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [adm1Options, setAdm1Options] = useState([]);
  const [adm2Options, setAdm2Options] = useState([]);
  const [adm3Options, setAdm3Options] = useState([]);

  const {
    selectedAdm1, setSelectedAdm1,
    selectedAdm2, setSelectedAdm2,
    selectedAdm3, setSelectedAdm3,
    setAoi,
  } = useMapContext();

  // Load GeoJSON once
  useEffect(() => {
    fetch("/level_03.geojson")
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });
  }, []);

  // Populate ADM1 options
  useEffect(() => {
    if (!geoJsonData) return;
    const adm1 = new Set(geoJsonData.features.map(f => f.properties.ADM1_FR).filter(Boolean));
    setAdm1Options([...adm1].sort());
  }, [geoJsonData]);

  // Populate ADM2 options
  useEffect(() => {
    if (!geoJsonData || !selectedAdm1) {
      setAdm2Options([]);
      setSelectedAdm2("");
      setAdm3Options([]);
      setSelectedAdm3("");
      return;
    }
    const adm2 = new Set(
      geoJsonData.features
        .filter(f => f.properties.ADM1_FR === selectedAdm1)
        .map(f => f.properties.ADM2_FR)
        .filter(Boolean)
    );
    setAdm2Options([...adm2].sort());
    setAdm3Options([]);
    setSelectedAdm3("");
  }, [geoJsonData, selectedAdm1, setSelectedAdm2, setSelectedAdm3]);

  // Populate ADM3 options
  useEffect(() => {
    if (!geoJsonData || !selectedAdm1 || !selectedAdm2) {
      setAdm3Options([]);
      setSelectedAdm3("");
      return;
    }
    const adm3 = new Set(
      geoJsonData.features
        .filter(
          f =>
            f.properties.ADM1_FR === selectedAdm1 &&
            f.properties.ADM2_FR === selectedAdm2
        )
        .map(f => f.properties.ADM3_FR)
        .filter(Boolean)
    );
    setAdm3Options([...adm3].sort());
    setSelectedAdm3("");
  }, [geoJsonData, selectedAdm1, selectedAdm2, setSelectedAdm3]);

  // Build AOI name and update filtered GeoJSON
  useEffect(() => {
    let parts = [];

    if (selectedAdm1) {
      parts.push(selectedAdm1);
      if (selectedAdm2) {
        parts.push(selectedAdm2);
        if (selectedAdm3) {
          parts.push(selectedAdm3);
        }
      }
    }

    const aoiName = parts.join("_");
    const formattedAoi = aoiName.replace(/\s+/g, "-");
    setAoi(formattedAoi);

    if (geoJsonData) {
      const filteredFeatures = geoJsonData.features.filter(f => {
        return (
          (!selectedAdm1 || f.properties.ADM1_FR === selectedAdm1) &&
          (!selectedAdm2 || f.properties.ADM2_FR === selectedAdm2) &&
          (!selectedAdm3 || f.properties.ADM3_FR === selectedAdm3)
        );
      });

      const filteredGeoJson = {
        type: "FeatureCollection",
        features: filteredFeatures,
      };

      if (onGeoJsonChange) {
        onGeoJsonChange(filteredGeoJson);
      }
    }
  }, [selectedAdm1, selectedAdm2, selectedAdm3, geoJsonData, setAoi, onGeoJsonChange]);

  return (
   <div>
      <div style={{display:"flex", justifyContent:"space-between", }}> 
         <div style={{  fontSize: '1rem', fontWeight: '600',  color: '#1a4f8b', display:"flex", alignItems : "center",}}> 
            Area of Interest
          </div>

          <YearSelector/>
      </div>
     
 
   
   <div className="admin-selection-bar">
  <select
        value={selectedAdm1}
        onChange={e => setSelectedAdm1(e.target.value)}
      >
        <option value="">Region (ADM1)</option>
        {adm1Options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <select
        value={selectedAdm2}
        onChange={e => setSelectedAdm2(e.target.value)}
        disabled={!adm2Options.length}
      >
        <option value="">District (ADM2)</option>
        {adm2Options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <select
        value={selectedAdm3}
        onChange={e => setSelectedAdm3(e.target.value)}
        disabled={!adm3Options.length}
      >
        <option value="">Local (ADM3)</option>
        {adm3Options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

   </div>
    
   </div>
  
  );
}
