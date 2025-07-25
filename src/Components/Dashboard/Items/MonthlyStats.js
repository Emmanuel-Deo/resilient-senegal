import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useMapContext } from "../../../Contexts/MapContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "./LoadingSpinner";

// Supabase setup
const supabaseUrl = "https://gyjbkzxtsxbpwjmbvilm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5amJrenh0c3hicHdqbWJ2aWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDgzMzYsImV4cCI6MjA1NTgyNDMzNn0.7leWFkGhmI8Wo71P87K7xsNGJAmTRQ7mIeL_FO6wzx0";
const supabase = createClient(supabaseUrl, supabaseKey);


// NDVI color map
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

const MonthlyStats = () => {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    selectedAdm1,
    dataset,
    year,
    month,
    customObsClassification,
  } = useMapContext();

  const tableName = `ADM1_FR_CLASS_${dataset}`;

  useEffect(() => {
    const fetchStats = async () => {
      // Skip fetching if using custom polygon data
      if (customObsClassification) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from(tableName)
          .select(`year, month, "${selectedAdm1}"`)
          .eq("year", year)
          .eq("month", month);

        if (error) throw error;
        setStatsData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedAdm1, dataset, year, month, customObsClassification]);

  // Use custom classification if available
  const classData = customObsClassification || statsData[0]?.[selectedAdm1] || {};

  const pieData = colorMap
    .map((item) => ({
      name: item.className,
      value: classData[item.className] || 0,
      fill: item.color,
    }))
    .filter((item) => item.value > 0);

  if (!customObsClassification && loading) return <LoadingSpinner />;
  if (!customObsClassification && error) return <p>Error: {error}</p>;
  if (!customObsClassification && (!statsData || statsData.length === 0))
    return <p>No data available.</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            isAnimationActive={false}
            label={false}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyStats;