import React from "react";
import "./MapInfoCard.css";
import { useMapContext } from "../../../Contexts/MapContext";
import {
  Download,
  Printer,
  ChartPie,
  LineChart
} from "lucide-react";
import MonthlyStats from "./MonthlyStats";
import ComparisonPieChart from "./ComparisonPieChart";

const MapInfoCard = () => {
  const {
    aoi,
    year,
    setYear,
    month,
    setMonth,
    dataset,
    isComparing, // ← added from context
  } = useMapContext();

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="map-info-card">
      <div className="map-info-left">
        {/* <div className="map-info-title">{aoi} {dataset} {year} {month}</div> */}
        <div className="map-info-chart">
          {isComparing ? <ComparisonPieChart/> : <MonthlyStats />}
        </div>
      </div>

      <div className="map-info-center">
        <div className="controls-container">
          <div className="year-selector">
            <button onClick={() => setYear((prev) => Number(prev) - 1)}>«</button>
            <span className="selected-year">{year}</span>
            <button onClick={() => setYear((prev) => Number(prev) + 1)}>»</button>
          </div>

          <div className="month-slider">
            {months.map((m, index) => (
              <span
                key={index}
                className={`month ${Number(month) === index + 1 ? "selected" : ""}`}
                onClick={() => setMonth(index + 1)}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        <p className="map-info-text">
          The 2022 trend closely follows the long-term mean (2001–2020) but remains below historical maximum values (2017–2021), showing moderate deviations in April and November, while overall variability aligns with past fluctuations.
        </p>
      </div>

      <div className="map-info-right">
        <div className="map-info-actions-title">Actions</div>
        <ul className="map-info-actions">
          <li><Download size={16} /> </li>
          <li><Printer size={16} /> </li>
          <li><LineChart size={16} /> </li>
          <li><ChartPie size={16} /> </li>
        </ul>
      </div>
    </div>
  );
};

export default MapInfoCard;
