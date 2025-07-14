import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";


export default function AOIPreview({
  selectedAdm1,
  selectedAdm2,
  selectedAdm3,
  geoJsonData,
}) {
  const center = [14.6081, -14.6040];
  const zoom = 5;

  function AOIZoom({ data }) {
    const map = useMap();
    const geoJsonLayerRef = useRef();

    useEffect(() => {
      if (data && data.features && data.features.length > 0) {
        // Fit bounds to new GeoJSON
        const layer = geoJsonLayerRef.current;
        if (layer) {
          const bounds = layer.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds);
          }
        }
      }
    }, [data, map]);

    return data ? (
      <GeoJSON
        data={data}
        style={{
          color: "#1976d2",
          weight: 2,
          fillOpacity: 0.2,
        }}
        ref={geoJsonLayerRef}
      />
    ) : null;
  }

  return (
    <div className="aoi-preview">
      {/* <h4>Selected Area of Interest (AOI)</h4>
      <ul>
        <li><strong>Region (ADM1):</strong> {selectedAdm1 || "None selected"}</li>
        <li><strong>District (ADM2):</strong> {selectedAdm2 || "None selected"}</li>
        <li><strong>Local (ADM3):</strong> {selectedAdm3 || "None selected"}</li>
      </ul> */}

      {geoJsonData && geoJsonData.features.length > 0 ? (
        <MapContainer center={center} zoom={zoom} style={{ height: "300px", marginTop: "10px" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <AOIZoom data={geoJsonData} />
        </MapContainer>
      ) : (
        <p style={{ marginTop: "10px" }}>No AOI selected or no geometry available.</p>
      )}
    </div>
  );
}
