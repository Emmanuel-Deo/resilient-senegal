// utils/handlePolygonDraw.js
export async function handlePolygonDraw({ drawnGeoJSON, year, month, dataset, backendURL }) {
  try {
    const response = await fetch(`${backendURL}/process-polygon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        geometry: drawnGeoJSON,
        year,
        month,
        dataset,
      }),
    });

    const result = await response.json();
    console.log("Server response:", result);

    if (result.geoserver_layer && result.classification) {
      return {
        layer: result.geoserver_layer,
        classification: result.classification,
      };
    }

    throw new Error("Incomplete response from server");
  } catch (error) {
    console.error("Error sending polygon:", error);
    return null;
  }
}
