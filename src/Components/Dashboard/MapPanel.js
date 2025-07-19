import React from "react";
import "./MapPanel.css";
import Map from "./Items/Map";
import BasemapChanger from "./Items/BasemapChanger";
import Legend from "./Items/Legend";
import MapInfoCard from "./Items/MapInfoCard";
import ZoomControl from "./Items/ZoomControl";

export default function MapPanel() {
  return (
    <div className="map-panel">
      <Map />
      <div className="overlay-item bamaps-overlay"><BasemapChanger /></div>
      <div className="overlay-item legend-overlay"><Legend /></div>
      <div className="overlay-item infocard-overlay">
        <MapInfoCard />
      </div>
    </div>
  );
}
