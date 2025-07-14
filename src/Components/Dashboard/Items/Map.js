import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { useMapContext } from "../../../Contexts/MapContext";

export default function Map() {
  const { selectedBasemap } = useMapContext();

  return (
    <MapContainer center={[1, 19.9]} zoom={4} style={{ height: "100%", width: "100%" }}>
      <TileLayer url={selectedBasemap} />
      <Marker position={[51.505, -0.09]}>
        <Popup>Example marker popup.</Popup>
      </Marker>
    </MapContainer>
  );
}
