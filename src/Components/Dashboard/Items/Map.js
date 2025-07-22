import React, { useRef, useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  FeatureGroup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-side-by-side";
import L from "leaflet";
import "./map.css";
import { useMapContext } from "../../../Contexts/MapContext";
import ZoomToGeoJSONBounds from "./ZoomToGeoJSONBounds";
import { handlePolygonDraw } from "../utils/handlePolygonDraw";

export default function Map() {
  const {
    layerName: defaultLayerName,
    ltmLayerName,
    selectedBasemap,
    zoomLevel,
    year,
    month,
    dataset,
    filteredGeoJson,
    isComparing, 
    setIsComparing,
    customObsClassification, 
    setCustomObsClassification,
    customLtmClassification, 
    setCustomLtmClassification,
    setServerResponse,
  } = useMapContext();

  const [customObsLayers, setCustomObsLayers] = useState([]);
  const [customLtmLayers, setCustomLtmLayers] = useState([]);
  const [customZoomGeoJSON, setcustomZoomGeoJSON] = useState(null);
  const [showWMS, setShowWMS] = useState(true);
  const [enableDraw, setEnableDraw] = useState(false);
  const [hasStartedDraw, setHasStartedDraw] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [opacity, setOpacity] = useState(1);





  useEffect(() => {
  // Clear previous results and polygon data when year changes
  setServerResponse(null);
  setCustomObsLayers([]);
  setCustomLtmLayers([]);
  setcustomZoomGeoJSON(null);
  drawRef.current?.clearLayers();
}, [year]);

  const featureGroupRef = useRef(null);
  const drawControlRef = useRef(null);
  const drawRef = useRef(null);
  const sideBySideRef = useRef(null);
  const leftCompareLayerRef = useRef(null);
  const rightCompareLayerRef = useRef(null);

  // Get active layer based on month
  const getActiveLayerName = () => {
    const layer = customObsLayers.find((l) => l.month === month);
    return (
      layer?.layer ||
      customObsLayers[0]?.layer ||
      defaultLayerName
    );
  };

  const getActiveLtmLayerName = () => {
    const layer = customLtmLayers.find((l) => l.month === month);
    return (
      layer?.layer ||
      customLtmLayers[0]?.layer ||
      ltmLayerName
    );
  };

  const activeLayerName = getActiveLayerName();
  const activeLtmLayerName = getActiveLtmLayerName();

  // Error handling
  const showErrorToast = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 4000);
  };

  const startPolygonDraw = () => {
    if (customObsLayers.length || hasStartedDraw) {
      setCustomObsLayers([]);
      setCustomLtmLayers([]);
      setShowWMS(true);
      setEnableDraw(false);
      setHasStartedDraw(false);
      drawRef.current?.clearLayers();
    } else {
      if (isComparing) stopCompare();
      setShowWMS(false);
      setEnableDraw(true);
      setHasStartedDraw(true);
      setTimeout(() => {
        drawControlRef.current?._toolbars?.draw?._modes?.polygon?.handler?.enable();
      }, 300);
    }
  };


  const handleDrawCreate = async (e) => {
    const layer = e.layer;
    const drawnGeoJSON = layer.toGeoJSON();
    const customZoomGeoJSON = {
      type: "FeatureCollection",
      features: [drawnGeoJSON],
    };
    setcustomZoomGeoJSON(customZoomGeoJSON);

    try {
      const result = await handlePolygonDraw({
        drawnGeoJSON,
        backendURL: "http://127.0.0.1:8000",
        year,
        dataset,
      });

      if (result?.error) {
        showErrorToast(result.error);
        startPolygonDraw();
        return;
      }

      setServerResponse(result)

      if (result?.observationResults.length > 0 && result?.ltmResults.length > 0) {
        setCustomObsLayers(result.observationResults);
        setCustomLtmLayers(result.ltmResults);

        // Set active custom classifications based on the current month
        updateCustomStats(result.observationResults, result.ltmResults);
        
        setShowWMS(true);
        setEnableDraw(false);
        setHasStartedDraw(false);
      }

      drawRef.current?.clearLayers();
      drawRef.current?.addLayer(layer);
    } catch (error) {
      console.error("Error during polygon draw:", error);
      showErrorToast("An error occurred while processing the polygon.");
      startPolygonDraw();
    }
  };

  // Function to update custom statistics when month changes
  const updateCustomStats = (obsResults, ltmResults) => {
    const obs = obsResults.find((l) => l.month === month);
    const ltm = ltmResults.find((l) => l.month === month);
    
    setCustomObsClassification(obs?.classification || obsResults[0]?.classification || null);
    setCustomLtmClassification(ltm?.classification || ltmResults[0]?.classification || null);
  };

  // Watch for month changes and update stats accordingly
  useEffect(() => {
    if (customObsLayers.length > 0 && customLtmLayers.length > 0) {
      updateCustomStats(customObsLayers, customLtmLayers);
    }
  }, [month, customObsLayers, customLtmLayers]);

  // Fallback for default layers if no polygon drawn
  useEffect(() => {
    if (!customObsLayers.length) {
      setCustomObsClassification(null);
    }
    if (!customLtmLayers.length) {
      setCustomLtmClassification(null);
    }
  }, [customObsLayers, customLtmLayers]);

  const startCompare = () => {
    setIsComparing(true);
    setShowWMS(false);
  };

  const stopCompare = () => {
    setIsComparing(false);
    setShowWMS(true);
    const map = featureGroupRef.current._map;

    if (sideBySideRef.current) {
      sideBySideRef.current.remove();
      sideBySideRef.current = null;
    }

    if (leftCompareLayerRef.current) {
      map.removeLayer(leftCompareLayerRef.current);
      leftCompareLayerRef.current = null;
    }

    if (rightCompareLayerRef.current) {
      map.removeLayer(rightCompareLayerRef.current);
      rightCompareLayerRef.current = null;
    }
  };

  // Compare mode: update WMS layers
  useEffect(() => {
    if (!isComparing || !featureGroupRef.current?._map) return;

    const map = featureGroupRef.current._map;

    if (leftCompareLayerRef.current) map.removeLayer(leftCompareLayerRef.current);
    if (rightCompareLayerRef.current) map.removeLayer(rightCompareLayerRef.current);
    if (sideBySideRef.current) sideBySideRef.current.remove();

    const left = L.tileLayer.wms("http://127.0.0.1:8080/geoserver/resilientsenegal/wms?", {
      layers: activeLayerName,
      format: "image/png",
      transparent: true,
      version: "1.1.0",
      styles: dataset,
      opacity,
    });

    const right = L.tileLayer.wms("http://127.0.0.1:8080/geoserver/resilientsenegal/wms?", {
      layers: activeLtmLayerName,
      format: "image/png",
      transparent: true,
      version: "1.1.0",
      styles: dataset,
      opacity,
    });

    leftCompareLayerRef.current = left;
    rightCompareLayerRef.current = right;

    left.addTo(map);
    right.addTo(map);

    sideBySideRef.current = L.control.sideBySide(left, right).addTo(map);
  }, [activeLayerName, activeLtmLayerName, dataset, opacity, isComparing, year,  month]);

  return (
    <>
      {/* Toast */}
      {errorMessage && (
        <div style={{ position: "absolute", top: "60px", left: "10px", zIndex: 10000, backgroundColor: "#d32f2f", color: "#fff", padding: "10px 16px", borderRadius: "6px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)", maxWidth: "320px", fontSize: "14px", lineHeight: "1.4" }}>
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Compare Legend */}
      {isComparing && (
        <div style={{ position: "absolute", top: "10px", left: "550px", zIndex: 10000, backgroundColor: "#ffffff", border: "1px solid #ccc", borderRadius: "6px", padding: "6px 12px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", display: "flex", gap: "12px", fontWeight: 600, fontSize: "13px" }}>
          <span style={{ color: "#2196f3" }}>⬅️ {dataset} - {year}</span>
          <span style={{ color: "#7d7d7dff", fontSize: "18px" }}>|</span>
          <span style={{ color: "#f44336" }}>{dataset} - LTM ➡️</span>
        </div>
      )}

      {/* Draw & Compare Buttons */}
      <button onClick={startPolygonDraw} style={{ position: "absolute", zIndex: 10000, top: "10px", left: "10px", padding: "6px 12px", backgroundColor: "#ffffff", color: "#000000", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
        {(customObsLayers.length || hasStartedDraw) ? "Clear Polygon" : "Draw Polygon"}
      </button>

      <button onClick={isComparing ? stopCompare : startCompare} style={{ position: "absolute", zIndex: 10000, top: "10px", left: "124px", padding: "6px 12px", backgroundColor: "#ffffff", color: "#000000", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
        {isComparing ? "Exit Compare" : "Start Compare"}
      </button>

      {/* Opacity Control */}
      <div style={{ position: "absolute", zIndex: 10000, top: "10px", right: "224px", backgroundColor: "#fff", padding: "6px 8px", borderRadius: "6px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
        <label htmlFor="opacityRange" style={{ fontWeight: 500 }}>Opacity</label>
        <input id="opacityRange" type="range" min="0" max="1" step="0.05" value={opacity} onChange={(e) => {
          const newOpacity = parseFloat(e.target.value);
          setOpacity(newOpacity);
          leftCompareLayerRef.current?.setOpacity(newOpacity);
          rightCompareLayerRef.current?.setOpacity(newOpacity);
        }} />
      </div>

      {/* Map */}
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
            transparent
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
                    fill: false,
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