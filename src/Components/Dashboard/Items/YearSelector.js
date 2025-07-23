import React from 'react';


import { useMapContext } from "../../../Contexts/MapContext";

import './YearSelector.css';
const YearSelector = () => {
  const { year, setYear } = useMapContext();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);

  const handleSelectChange = (e) => {
    setYear(Number(e.target.value));
  };

  return (
    <div className="year-selector">
      <button
        onClick={() => setYear((prev) => Math.max(2000, Number(prev) - 1))}
        className="arrow-button"
      >
        «
      </button>

      <select value={Number(year)} onChange={handleSelectChange}>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <button
        onClick={() => setYear((prev) => Math.min(currentYear, Number(prev) + 1))}
        className="arrow-button"
      >
        »
      </button>
    </div>
  );
};

export default YearSelector;
