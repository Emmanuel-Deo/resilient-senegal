import React from "react";
import { useMapContext } from "../../../Contexts/MapContext";

const basemaps = [
  {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    thumbnail: "https://gyjbkzxtsxbpwjmbvilm.supabase.co/storage/v1/object/public/geo-portfolio-resources//imagery-thumbnail.png",
  },
  {
    name: "Street",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    thumbnail: "https://gyjbkzxtsxbpwjmbvilm.supabase.co/storage/v1/object/public/geo-portfolio-resources//osm-thumbnail.png",
  },
  {
    name: "Topo",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    thumbnail: "https://gyjbkzxtsxbpwjmbvilm.supabase.co/storage/v1/object/public/geo-portfolio-resources//elevation-thumbnail.png",
  },
];

export default function BasemapChanger() {
  const { selectedBasemap, setSelectedBasemap } = useMapContext();

  return (
    <div
      
      style={{
        display: "flex",
        gap: "6px",
        position: "relative",
        padding: "6px",
        borderRadius: "8px",
        background: "rgba(255,255,255)",
        
      }}
    >
      {basemaps.map((base) => (
        <div key={base.name} style={{ textAlign: "center" }}>
          <img
            src={base.thumbnail}
            alt={base.name}
            title={base.name}
            onClick={() => setSelectedBasemap(base.url)}
            style={{
              width: 56,
              height: 56,
              cursor: "pointer",
              border:
                selectedBasemap === base.url
                  ? "2px solid #1976d2"
                  : "2px solid transparent",
              borderRadius: 8,
              transition: "border 0.2s",
            }}
          />
          <p
            style={{
              marginTop: 3,
              fontSize: 12,
              fontWeight: 500,
              color: "#333",
              padding: 0,
              marginBottom: 0,
            }}
          >
            {base.name}
          </p>
        </div>
      ))}
    </div>
  );
}
