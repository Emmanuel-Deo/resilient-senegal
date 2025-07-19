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
    filteredGeoJson
    ,isComparing, setIsComparing,
     setCustomObsClassification, setCustomLtmClassification,
  } = useMapContext();

  const [customObsLayer, setCustomObsLayer] = useState(null);
  const [customLtmLayer, setCustomLtmLayer] = useState(null);
  const [customZoomGeoJSON, setcustomZoomGeoJSON] = useState(null);
  const [showWMS, setShowWMS] = useState(true);
  const [enableDraw, setEnableDraw] = useState(false);
  const [hasStartedDraw, setHasStartedDraw] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [opacity, setOpacity] = useState(1);

  const featureGroupRef = useRef(null);
  const drawControlRef = useRef(null);
  const drawRef = useRef(null);
  const sideBySideRef = useRef(null);
  const leftCompareLayerRef = useRef(null);
  const rightCompareLayerRef = useRef(null);

  const activeLayerName = customObsLayer || defaultLayerName;
  const activeLtmLayerName = customLtmLayer || ltmLayerName;

  const showErrorToast = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 4000);
  };

  const startPolygonDraw = () => {
    if (customObsLayer || hasStartedDraw) {
      setCustomObsLayer(null);
      setCustomLtmLayer(null);
      setShowWMS(true);
      setEnableDraw(false);
      setHasStartedDraw(false);
      setCustomObsClassification(null);
      setcustomZoomGeoJSON(null);
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

    if (result?.observation?.layer && result?.ltm?.layer) {
      setCustomObsLayer(result.observation.layer);
      setCustomLtmLayer(result.ltm.layer);
      setCustomObsClassification(result.observation.classification);
      setCustomLtmClassification(result.ltm.classification);    
      setShowWMS(true);
      setEnableDraw(false);
      setHasStartedDraw(false);
    }

    drawRef.current?.clearLayers();
    drawRef.current?.addLayer(layer);
  };

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
  }, [activeLayerName, activeLtmLayerName, dataset, opacity, isComparing]);

  return (
    <>
      {errorMessage && (
        <div style={{
          position: "absolute", top: "60px", left: "10px", zIndex: 10000,
          backgroundColor: "#d32f2f", color: "#fff", padding: "10px 16px",
          borderRadius: "6px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          maxWidth: "320px", fontSize: "14px", lineHeight: "1.4",
        }}>
          ⚠️ {errorMessage}
        </div>
      )}

      {isComparing && (
        <div style={{
          position: "absolute", top: "10px", left: "550px", zIndex: 10000,
          backgroundColor: "#ffffff", border: "1px solid #ccc", borderRadius: "6px",
          padding: "6px 12px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          display: "flex", gap: "12px", fontWeight: 600, fontSize: "13px",
        }}>
          <span style={{ color: "#2196f3" }}>
            ⬅️ {dataset} - {year}/{String(month).padStart(2, "0")}
          </span>
          <span style={{ color: "#7d7d7dff", fontSize: "18px" }}>|</span>
          <span style={{ color: "#f44336" }}>{dataset} - LTM ➡️ </span>
        </div>
      )}

      <button onClick={startPolygonDraw} style={{
        position: "absolute", zIndex: 10000, top: "10px", left: "10px",
        padding: "6px 12px", backgroundColor: "#ffffff", color: "#000000",
        border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}>
        {(customObsLayer || hasStartedDraw) ? "Clear Polygon" : "Draw Polygon"}
      </button>

      <button onClick={isComparing ? stopCompare : startCompare} style={{
        position: "absolute", zIndex: 10000, top: "10px", left: "124px",
        padding: "6px 12px", backgroundColor: "#ffffff", color: "#000000",
        border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}>
        {isComparing ? "Exit Compare" : "Start Compare"}
      </button>

      <div style={{
        position: "absolute", zIndex: 10000, top: "10px", right: "224px",
        backgroundColor: "#fff", padding: "6px 8px", borderRadius: "6px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)", display: "flex",
        alignItems: "center", gap: "8px", fontSize: "14px",
      }}>
        <label htmlFor="opacityRange" style={{ fontWeight: 500 }}>Opacity</label>
        <input
          id="opacityRange"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => {
            const newOpacity = parseFloat(e.target.value);
            setOpacity(newOpacity);
            leftCompareLayerRef.current?.setOpacity(newOpacity);
            rightCompareLayerRef.current?.setOpacity(newOpacity);
          }}
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
                    // opacity: 0.7,
                    // fillOpacity: 0.3,
                    // fillColor: "#2196f3",
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
