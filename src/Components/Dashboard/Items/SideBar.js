import React from "react";
import { useMapContext } from "../../../Contexts/MapContext";
import { WiRaindrops, WiThermometer } from "react-icons/wi";
import { FaLeaf, FaFire, FaChartLine, FaMountain, FaSignal, FaBullseye } from "react-icons/fa";
import "./SideBar.css";

const groups = [
  {
    id: "core",
    title: "Core Variables",
    items: [
      { key: "PPT", icon: <WiRaindrops /> },
      { key: "LST", icon: <WiThermometer /> },
      { key: "NDVI", icon: <FaLeaf /> },
    ],
  },
  {
    id: "drought",
    title: "Drought Indices",
    items: [
      { key: "PDI", icon: <FaFire /> },
      { key: "VDI", icon: <FaChartLine /> },
      { key: "TDI", icon: <FaSignal /> },
      { key: "CDI", icon: <FaBullseye /> },
    ],
  },
  {
    id: "land",
    title: "Land Productivity",
    items: [
      { key: "State", icon: <FaMountain /> },
      { key: "Trend", icon: <FaChartLine /> },
      { key: "Performance", icon: <FaBullseye /> },
    ],
  },
];

export default function Sidebar() {
  const { dataset, setDataset, month, year, frequency, aoi } = useMapContext();

  return (
    <div className="sidebar">
      {groups.map((group) => (
        <div className="accordion-group" key={group.id}>
          <div className="accordion-header">{group.title}</div>
          <div className="accordion-body">
            {group.items.map((item) => {
              const key = item.key;
              const icon = item.icon;
              return (
                <button
                  key={key}
                  className={`item-btn ${dataset === key ? "active" : ""}`}
                  onClick={() => setDataset(key)}
                >
                  {icon && <span className="btn-icon">{icon}</span>}
                  {key}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="summary">
        {dataset}_{year}{month}_{aoi}
      </div>
    </div>
  );
}

