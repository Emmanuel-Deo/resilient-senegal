import React from "react";
import { useMapContext } from "../../../Contexts/MapContext";

const ndviColorStops = [
  { className: "Class 9", color: "#1a9641", label: "0.8557" },
  { className: "Class 8", color: "#52b151", label: "0.7270" },
  { className: "Class 7", color: "#95d165", label: "0.5726" },
  { className: "Class 6", color: "#cae88c", label: "0.4053" },
  { className: "Class 5", color: "#f8fcb9", label: "0.2380" },
  { className: "Class 4", color: "#fedb96", label: "0.0708" },
  { className: "Class 3", color: "#fdb165", label: "-0.0965" },
  { className: "Class 2", color: "#eb6640", label: "-0.2638" },
  { className: "Class 1", color: "#d7191c", label: "-0.4311" },
];

const lstColorStops = [
  { className: "Class 5", color: "#ca0020", label: "296.3" },
  { className: "Class 4", color: "#f4a582", label: "303.8" },
  { className: "Class 3", color: "#f7f7f7", label: "311.4" },
  { className: "Class 2", color: "#92c5de", label: "318.9" },
  { className: "Class 1", color: "#0571b0", label: "326.4" },
];

const pptColorStops = [
  { className: "Class 9", color: "#f7fbff", label: "0.00" },
  { className: "Class 8", color: "#deebf7", label: "0.26" },
  { className: "Class 7", color: "#c6dbef", label: "0.53" },
  { className: "Class 6", color: "#9ecae1", label: "0.79" },
  { className: "Class 5", color: "#6baed6", label: "1.05" },
  { className: "Class 4", color: "#4292c6", label: "1.31" },
  { className: "Class 3", color: "#2171b5", label: "1.58" },
  { className: "Class 2", color: "#08519c", label: "1.82" },
  { className: "Class 1", color: "#08306b", label: "2.02" },
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

  return (
    <div style={{ paddingLeft: 10 ,backgroundColor: "#fff",  padding: "6px", borderRadius: "8px",}}>
      <h4 style={{ marginBottom: 4, marginTop: 0 }}>Legend</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 , }}>
        {colorStops.map(({ className, color, label }, idx) => (
          <li
            key={className || idx}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 6,
              
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: color,
                marginRight: 8,
                borderRadius: 3,
              }}
            ></div>
            <span>
              {/* {className ? `${className}: ` : ""}{label} */}
              {className}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
