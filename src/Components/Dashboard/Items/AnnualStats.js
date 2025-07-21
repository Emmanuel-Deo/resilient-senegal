import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useMapContext } from "../../../Contexts/MapContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// Supabase setup
const supabaseUrl = "https://gyjbkzxtsxbpwjmbvilm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5amJrenh0c3hicHdqbWJ2aWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDgzMzYsImV4cCI6MjA1NTgyNDMzNn0.7leWFkGhmI8Wo71P87K7xsNGJAmTRQ7mIeL_FO6wzx0";// Use env variable in real apps
const supabase = createClient(supabaseUrl, supabaseKey);

const AnnualStats = () => {

  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {selectedAdm1,selectedAdm2,selectedAdm3, dataset, year} = useMapContext();
  

 useEffect(() => {
  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    // Dynamic table and column names
    let dynamicTableName = `ADM0_FR_${dataset}_OBSERVATION`;
    let dynamicColumnName = "Senegal";

    if (selectedAdm3) {
      dynamicTableName = `ADM3_FR_${dataset}_OBSERVATION`;
      dynamicColumnName = selectedAdm3;
    } else if (selectedAdm2) {
      dynamicTableName = `ADM2_FR_${dataset}_OBSERVATION`;
      dynamicColumnName = selectedAdm2;
    } else if (selectedAdm1) {
      dynamicTableName = `ADM1_FR_${dataset}_OBSERVATION`;
      dynamicColumnName = selectedAdm1;
    }

    try {
      const { data, error } = await supabase
        .from(dynamicTableName)
        .select(`year, month, "${dynamicColumnName}"`)
        .eq("year", year)
        .order("month", { ascending: true });

      if (error) throw error;
      setStatsData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, [selectedAdm1, selectedAdm2, selectedAdm3, dataset, year]);


  if (loading) return <p>Loading stats...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!statsData || statsData.length === 0) return <p>No data available.</p>;

  console.log("Annual Stats", statsData)

  return (
    
//  <div style={{ width: "500px", height: "300px" }}>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
      data={statsData}
      margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
      <YAxis tick={{ fontSize: 10 }} />
      <Tooltip contentStyle={{ fontSize: 10 }} />
      <Legend wrapperStyle={{ fontSize: 10 }} />
      <Line type="monotone" dataKey={selectedAdm3 || selectedAdm2 || selectedAdm1 || "Senegal" } stroke="#82ca9d" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
// </div>

  );
};

export default AnnualStats;



