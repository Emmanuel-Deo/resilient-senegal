import React from "react";
import { useMapContext } from "../../../Contexts/MapContext";
import { Plus, Minus } from "lucide-react"; // Optional icons

export default function ZoomControl() {
  const { zoomLevel, setZoomLevel } = useMapContext();

  const handleZoomIn = () => {
    const next = Math.min(Number(zoomLevel) + 1, 18);
    setZoomLevel(next.toString());
  };

  const handleZoomOut = () => {
    const next = Math.max(Number(zoomLevel) - 1, 1);
    setZoomLevel(next.toString());
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      borderRadius: "8px",
      background: "#fff",
      padding: "6px",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)"
    }}>
      <button
        onClick={handleZoomIn}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#1976d2",
          color: "#fff",
          cursor: "pointer",
        }}
        title="Zoom In"
      >
        <Plus size={16} />
      </button>

      <button
        onClick={handleZoomOut}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#1976d2",
          color: "#fff",
          cursor: "pointer",
        }}
        title="Zoom Out"
      >
        <Minus size={16} />
      </button>
    </div>
  );
}
