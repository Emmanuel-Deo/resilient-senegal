import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function GeoJSONUploadDropzone({ onUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];

    file.text().then((text) => {
      try {
        const json = JSON.parse(text);

        if (!json.type || json.type !== "FeatureCollection") {
          alert("Invalid GeoJSON format. Must be a FeatureCollection.");
          return;
        }

        if (onUpload && typeof onUpload === "function") {
          onUpload(json);
        }
      } catch (err) {
        alert("Error reading file. Ensure it is valid GeoJSON.");
      }
    });
  }, [onUpload]);

  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    fileRejections,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: { "application/geo+json": [".geojson"] },
    maxFiles: 1,
    onDrop,
  });

  return (
    <section className="geojson-upload-container">
      <div
        {...getRootProps({
          className: `upload-zone ${
            isDragAccept ? "upload-accept" : ""
          } ${isDragReject ? "upload-reject" : ""}`,
        })}
      >
        <input {...getInputProps()} />
        <p className="upload-text">
          Drag & drop a <strong>.geojson</strong> file here,
          <br /> or <span className="upload-browse">browse</span> to select
        </p>
        <p className="upload-subtext">(Only one .geojson file accepted)</p>
      </div>

      {acceptedFiles.length > 0 && (
        <div className="upload-feedback success">
          ✅ <strong>{acceptedFiles[0].name}</strong> uploaded successfully
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className="upload-feedback error">
          ❌ File rejected. Please upload a valid .geojson file.
        </div>
      )}
    </section>
  );
}
