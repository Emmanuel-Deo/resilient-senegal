import React, { useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  FeatureGroup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./map.css";
import { useMapContext } from "../../../Contexts/MapContext";
import ZoomToGeoJSONBounds from "./ZoomToGeoJSONBounds";
import { handlePolygonDraw } from "../utils/handlePolygonDraw";

export default function Map() {
  const {
    layerName: defaultLayerName,
    selectedBasemap,
    zoomLevel,
    year,
    month,
    dataset,
    filteredGeoJson,
    setCustomClassification,
  } = useMapContext();

  const [customLayerName, setCustomLayerName] = useState(null);
  const [customZoomGeoJSON, setcustomZoomGeoJSON] = useState(null);
  const [showWMS, setShowWMS] = useState(true);
  const [enableDraw, setEnableDraw] = useState(false);
  const [hasStartedDraw, setHasStartedDraw] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [opacity, setOpacity] = useState(1);

  const featureGroupRef = useRef(null);
  const drawControlRef = useRef(null);
  const drawRef = useRef(null);

  const startPolygonDraw = () => {
    if (customLayerName || hasStartedDraw) {
      setCustomLayerName(null);
      setShowWMS(true);
      setEnableDraw(false);
      setHasStartedDraw(false);
      setCustomClassification(null);
      setcustomZoomGeoJSON(null);

      if (drawRef.current) {
        drawRef.current.clearLayers();
      }
    } else {
      setShowWMS(false);
      setEnableDraw(true);
      setHasStartedDraw(true);

      setTimeout(() => {
        drawControlRef.current?._toolbars?.draw?._modes?.polygon?.handler?.enable();
      }, 300);
    }
  };

  const showErrorToast = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
  };

  const handleDrawCreate = async (e) => {
    const layer = e.layer;
    const drawnGeoJSON = layer.toGeoJSON();

    const customZoomGeoJSON = {
      type: "FeatureCollection",
      features: [drawnGeoJSON],
    };
    setcustomZoomGeoJSON(customZoomGeoJSON);

    const result = await handlePolygonDraw({
      drawnGeoJSON,
      backendURL: "http://127.0.0.1:8000",
      year,
      month,
      dataset,
    });

    if (result?.error) {
      showErrorToast(result.error);
      startPolygonDraw();
      return;
    }

    if (result?.layer && result?.classification) {
      setCustomLayerName(result.layer);
      setCustomClassification(result.classification);
      setShowWMS(true);
      setEnableDraw(false);
      setHasStartedDraw(false);
    }

    if (drawRef.current) {
      drawRef.current.clearLayers();
      drawRef.current.addLayer(layer);
    }
  };

  const activeLayerName = customLayerName || defaultLayerName;

  return (
    <>
      {/* Error Toast */}
      {errorMessage && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "10px",
            zIndex: 10000,
            backgroundColor: "#d32f2f",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "6px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
            maxWidth: "320px",
            fontSize: "14px",
            lineHeight: "1.4",
          }}
        >
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Draw Button */}
      <button
        onClick={startPolygonDraw}
        style={{
          position: "absolute",
          zIndex: 10000,
          top: "10px",
          left: "10px",
          padding: "6px 12px",
          backgroundColor: "#ffffff",
          color: "#000000",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "500",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        {(customLayerName || hasStartedDraw)
          ? "Reset to Original Layer"
          : "Draw Polygon"}
      </button>

      {/* Opacity Slider */}
      <div
        style={{
          position: "absolute",
          zIndex: 10000,
          top: "10px",
          right: "224px",
          backgroundColor: "#fff",
          padding: "6px 8px",
          borderRadius: "6px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
        }}
      >
        <label htmlFor="opacityRange" style={{ fontWeight: 500 }}>
          Opacity
        </label>
        <input
          id="opacityRange"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
        />
      </div>

      <MapContainer
        zoomControl={false}
        center={[13.795625802430228, -14.556901049379832]}
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
        className="custom-map"
      >
        <ZoomToGeoJSONBounds data={customZoomGeoJSON || filteredGeoJson} />
        <TileLayer url={selectedBasemap} />

        {showWMS && activeLayerName && (
          <WMSTileLayer
            key={activeLayerName}
            url="http://127.0.0.1:8080/geoserver/resilientsenegal/wms?"
            layers={activeLayerName}
            format="image/png"
            transparent={true}
            version="1.1.0"
            styles={dataset}
            srs="EPSG:4326"
            opacity={opacity}
          />
        )}

        <FeatureGroup
          ref={(ref) => {
            featureGroupRef.current = ref;
            drawRef.current = ref;
          }}
        >
          {enableDraw && (
            <EditControl
              ref={(ref) => {
                if (ref) drawControlRef.current = ref;
              }}
              position="topleft"
              onCreated={handleDrawCreate}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: {
                  allowIntersection: false,
                  showArea: true,
                  showLength: true,
                  metric: ["km", "m"],
                  shapeOptions: {
                    color: "#2196f3",
                    weight: 2,
                    opacity: 0.7,
                    fillOpacity: 0.3,
                    fillColor: "#2196f3",
                    dashArray: "3",
                    lineCap: "round",
                    lineJoin: "round",
                  },
                },
              }}
            />
          )}
        </FeatureGroup>
      </MapContainer>
    </>
  );
}
