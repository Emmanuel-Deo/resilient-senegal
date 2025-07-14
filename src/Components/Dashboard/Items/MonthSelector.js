import React from "react";
import { useMapContext } from "./MapContext";

export default function MonthSelector() {
  const { year, setYear, month, setMonth } = useMapContext();

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="controls-container">
      {/* Year Selector with Increment/Decrement Buttons */}
      <div className="year-selector">
        <button onClick={() => setYear((prev) => Number(prev) - 1)}>«</button>
        <span className="selected-year">{year}</span>
        <button onClick={() => setYear((prev) => Number(prev) + 1)}>»</button>
      </div>

      {/* Clickable Month Slider */}
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
  );
}


