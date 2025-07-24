import React, { useState } from "react";
import { processPolygon } from "../utils/processPolygon";

export default function UploadPolygonButton({ geojson, backendURL, year, dataset, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!geojson) return alert("No uploaded polygon to process");

    setLoading(true);

    const result = await processPolygon({ geojson, backendURL, year, dataset });

    setLoading(false);

    if (result.error) {
      alert(`Upload failed: ${result.error}`);
    } else {
      onSuccess(result); // Call parent callback to update map
    }
  };

  return (
    <button onClick={handleUpload} disabled={loading}>
      {loading ? "Processing..." : "Upload Polygon"}
    </button>
  );
}
