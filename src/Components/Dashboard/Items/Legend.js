import React from "react";
import { useMapContext } from "../../../Contexts/MapContext";

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
  { color: "#ca0020", label: "296.3" },
  { color: "#f4a582", label: "303.8" },
  { color: "#f7f7f7", label: "311.4" },
  { color: "#92c5de", label: "318.9" },
  { color: "#0571b0", label: "326.4" },
];

const pptColorStops = [
  { color: "#f7fbff", label: "0.00" },
  { color: "#deebf7", label: "0.26" },
  { color: "#c6dbef", label: "0.53" },
  { color: "#9ecae1", label: "0.79" },
  { color: "#6baed6", label: "1.05" },
  { color: "#4292c6", label: "1.31" },
  { color: "#2171b5", label: "1.58" },
  { color: "#08519c", label: "1.82" },
  { color: "#08306b", label: "2.02" },
];

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
  const gradient = `linear-gradient(to bottom, ${colorStops.map((s) => s.color).join(", ")})`;

  return (
    <div style={{
      background: "rgba(255,255,255)",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      fontSize: "12px",
      fontFamily: "system-ui, sans-serif",
      color: "#333",
      width: "fit-content"
    }}>
      <div style={{
        fontWeight: 600,
        marginBottom: "8px",
        fontSize: "14px",
        textAlign: "center"
      }}>
        Legend
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "12px",
          height: "160px",
          background: gradient,
          borderRadius: "2px",
          border: "1px solid #ccc"
        }} />
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "160px",
          color: "#444",
          fontWeight: 400,
          letterSpacing: "-0.2px"
        }}>
          {colorStops.map((stop, idx) => (
            <span key={idx} style={{ lineHeight: "1", marginBottom: "2px" }}>
              {stop.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
