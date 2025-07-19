import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

export default function ZoomToGeoJSONBounds({ data }) {
  const map = useMap();

  useEffect(() => {
    if (!data || !data.features || data.features.length === 0) return;

    const geoJsonLayer = L.geoJSON(data);
    const bounds = geoJsonLayer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [data, map]);

  return null;
}
