// utils/handlePolygonDraw.js
export const handlePolygonDraw = async ({ drawnGeoJSON, backendURL, year, month, dataset }) => {
  try {
    const res = await fetch(`${backendURL}/process-polygon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        geometry: drawnGeoJSON,
        year,
        month,
        dataset,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return { error: data.error || "An unknown error occurred." };
    }

    return {
      layer: data.geoserver_layer,
      classification: data.classification,
    };
  } catch (err) {
    return { error: err.message || "Network error" };
  }
};
