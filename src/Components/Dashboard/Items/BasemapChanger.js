import React from "react";
import { useMapContext } from "../../../Contexts/MapContext";

const basemaps = [
  {
    name: "ESRI Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    thumbnail: "https://gyjbkzxtsxbpwjmbvilm.supabase.co/storage/v1/object/public/geo-portfolio-resources//imagery-thumbnail.png",
  },
  {
    name: "OpenStreetMap",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    thumbnail: "https://gyjbkzxtsxbpwjmbvilm.supabase.co/storage/v1/object/public/geo-portfolio-resources//osm-thumbnail.png",
  },
  {
    name: "OpenTopoMap",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    thumbnail: "https://gyjbkzxtsxbpwjmbvilm.supabase.co/storage/v1/object/public/geo-portfolio-resources//elevation-thumbnail.png",
  },
];

export default function BasemapChanger() {
  const { selectedBasemap, setSelectedBasemap } = useMapContext();

  return (
    <div style={{ display: "flex", gap: "4px" ,position: 'relative' ,  borderRadius: "8px",}}>
      {basemaps.map((base) => (
        <img
          key={base.name}
          src={base.thumbnail}
          alt={base.name}
          title={base.name}
          onClick={() => setSelectedBasemap(base.url)}
          style={{
            width: 56,
            height: 56,
            cursor: "pointer",
            border: selectedBasemap === base.url ? "2px solid #1976d2" : "2px solid transparent",
            borderRadius: 8,
            transition: "border 0.2s",
          }}
        />
      ))}
    </div>
  );
}
