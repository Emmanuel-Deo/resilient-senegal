import React from "react";
import { useMapContext } from "../../../Contexts/MapContext";

// Define color stops for NDVI, LST, and PPT
const ndviColorStops = [
  { color: "#1a9641", label: "0.8557" },
  { color: "#52b151", label: "0.7270" },
  { color: "#95d165", label: "0.5726" },
  { color: "#cae88c", label: "0.4053" },
  { color: "#f8fcb9", label: "0.2380" },
  { color: "#fedb96", label: "0.0708" },
  { color: "#fdb165", label: "-0.0965" },
  { color: "#eb6640", label: "-0.2638" },
  { color: "#d7191c", label: "-0.4311" },
];

const lstColorStops = [
  { color: "#ca0020", label: "296.3250" },
  { color: "#f4a582", label: "303.8413" },
  { color: "#f7f7f7", label: "311.3575" },
  { color: "#92c5de", label: "318.8737" },
  { color: "#0571b0", label: "326.3900" },
];

const pptColorStops = [
  { color: "#f7fbff", label: "0.0000" },
  { color: "#deebf7", label: "0.2630" },
  { color: "#c6dbef", label: "0.5260" },
  { color: "#9ecae1", label: "0.7889" },
  { color: "#6baed6", label: "1.0519" },
  { color: "#4292c6", label: "1.3149" },
  { color: "#2171b5", label: "1.5779" },
  { color: "#08519c", label: "1.8206" },
  { color: "#08306b", label: "2.0229" },
];

// Utility function to get legend colors based on dataset
const getColorStops = (dataset) => {
  switch (dataset) {
    case "LST":
      return lstColorStops;
    case "PPT":
      return pptColorStops;
    case "NDVI":
    default:
      return ndviColorStops;
  }
};

export default function Legend() {
  const { dataset } = useMapContext();
  const colorStops = getColorStops(dataset);

  const gradient = `linear-gradient(to bottom, ${colorStops.map(s => s.color).join(", ")})`;

  return (
    <div style={{
      background: "#fff",
      padding: "12px",
      borderRadius: "8px",
      fontSize: "14px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "10px",
      width: "fit-content"
    }}>
      <div style={{
        width: "20px",
        height: "200px",
        background: gradient,
        borderRadius: "4px",
        border: "1px solid #ccc"
      }} />
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "200px",
        fontSize: "12px",
        color: "#333"
      }}>
        {colorStops.map((stop, idx) => (
          <span key={idx}>{stop.label}</span>
        ))}
      </div>
    </div>
  );
}
