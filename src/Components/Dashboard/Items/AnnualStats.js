import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useMapContext } from "../../../Contexts/MapContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';

// Supabase setup
const supabaseUrl = "https://gyjbkzxtsxbpwjmbvilm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5amJrenh0c3hicHdqbWJ2aWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDgzMzYsImV4cCI6MjA1NTgyNDMzNn0.7leWFkGhmI8Wo71P87K7xsNGJAmTRQ7mIeL_FO6wzx0";// Use env variable in real apps
const supabase = createClient(supabaseUrl, supabaseKey);

const AnnualStats = () => {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { selectedAdm1, selectedAdm2, selectedAdm3, dataset, year, month, serverResponse } = useMapContext();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      // Use serverResponse if available
      if (serverResponse && serverResponse.annualCombined) {
        const combinedData = serverResponse.annualCombined.map(item => ({
          month: item.month,
          observed: parseFloat(item.observed),
          ltm: parseFloat(item.ltm),
        }));
        setStatsData(combinedData);
        setLoading(false); // Set loading to false since data is already available
        return;
      }

      // If serverResponse is not available, fetch from Supabase
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
        // Fetch observed data
        const { data: observedData, error: obsError } = await supabase
          .from(dynamicTableName)
          .select(`year, month, "${dynamicColumnName}"`)
          .eq("year", year)
          .order("month", { ascending: true });

        if (obsError) throw obsError;

        // Fetch LTM data
        let ltmTableName = dynamicTableName.replace("OBSERVATION", "LTM");
        const { data: ltmData, error: ltmError } = await supabase
          .from(ltmTableName)
          .select(`month, "${dynamicColumnName}"`)
          .order("month", { ascending: true });

        if (ltmError) throw ltmError;

        // Merge observed and LTM data
        const mergedData = observedData.map(obs => {
          const ltmValue = ltmData.find(ltm => ltm.month === obs.month);
          return {
            month: obs.month,
            observed: obs[dynamicColumnName] || 0,
            ltm: ltmValue ? ltmValue[dynamicColumnName] : 0,
          };
        });

        setStatsData(mergedData);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedAdm1, selectedAdm2, selectedAdm3, dataset, year, serverResponse]);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!statsData || statsData.length === 0) return <p>No data available.</p>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={statsData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ fontSize: 10 }} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
         <ReferenceLine x={month} label="Selected Month" stroke="red" strokeDasharray="3 3" strokeWidth={3}/>
      
        <Line type="monotone" dataKey="observed" stroke="#82ca9d" strokeWidth={2} name="Observed" />
        <Line type="monotone" dataKey="ltm" stroke="#ff7300" strokeWidth={2} name="LTM" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AnnualStats;