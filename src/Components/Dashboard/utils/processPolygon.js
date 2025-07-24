// utils/processPolygon.js (shared for both draw + upload)
export const processPolygon = async ({ geojson, backendURL, year, dataset }) => {
  try {
    const res = await fetch(`${backendURL}/process-polygon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        geometry: geojson,
        year,
        dataset,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return { error: data.error || "An unknown error occurred." };
    }

    return {
      observationResults: data.observation_results.map(result => ({
        month: result.month,
        layer: result.geoserver_layer,
        classification: result.classification,
      })),
      ltmResults: data.ltm_results.map(result => ({
        month: result.month,
        layer: result.geoserver_layer,
        classification: result.classification,
      })),
      annualCombined: data.annual_combined_means,
    };
  } catch (err) {
    return { error: err.message || "Network error" };
  }
};
