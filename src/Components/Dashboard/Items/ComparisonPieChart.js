import React from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { useMapContext } from "../../../Contexts/MapContext";

// NDVI Color Mapping
const colorMap = [
  { className: "Class 9", color: "#1a9641" },
  { className: "Class 8", color: "#52b151" },
  { className: "Class 7", color: "#95d165" },
  { className: "Class 6", color: "#cae88c" },
  { className: "Class 5", color: "#f8fcb9" },
  { className: "Class 4", color: "#fedb96" },
  { className: "Class 3", color: "#fdb165" },
  { className: "Class 2", color: "#eb6640" },
  { className: "Class 1", color: "#d7191c" },
];

const prepareData = (dataObj) =>
  colorMap.map(({ className, color }) => ({
    name: className,
    value: dataObj?.[className] || 0,
    color,
  })).filter((entry) => entry.value > 0); // Only show filled classes

export default function ComparisonPieChart() {
  const { customObsClassification, customLtmClassification } = useMapContext();

  const isDataAvailable = customObsClassification && customLtmClassification;
  if (!isDataAvailable) {
    return (
      <div style={{ textAlign: "center", padding: "1rem", fontSize: 13 }}>
        No classification data available for comparison.
      </div>
    );
  }

  const ltmData = prepareData(customLtmClassification);
  const observationData = prepareData(customObsClassification);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={ltmData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}
            isAnimationActive={false}
          >
            {ltmData.map((entry, index) => (
              <Cell key={`ltm-${index}`} fill={entry.color} />
            ))}
          </Pie>

          <Pie
            data={observationData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            isAnimationActive={false}
          >
            {observationData.map((entry, index) => (
              <Cell key={`obs-${index}`} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name) => [`${value}`, `${name}`]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
