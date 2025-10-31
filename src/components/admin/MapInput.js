"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  CircleMarker,
  useMapEvents,
} from "react-leaflet";
import { Trash2, Save, RotateCcw } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Component untuk handle click events
function MapClickHandler({ isDrawing, onAddPoint }) {
  useMapEvents({
    click(e) {
      if (isDrawing) {
        onAddPoint([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
}

export default function MapInput({
  initialCoordinates = null,
  onSave,
  height = "500px",
}) {
  const [points, setPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [saved, setSaved] = useState(false);
  const mapRef = useRef();

  // Load initial coordinates if provided
  useEffect(() => {
    if (
      initialCoordinates &&
      Array.isArray(initialCoordinates) &&
      initialCoordinates.length > 0
    ) {
      // Assume initialCoordinates is [[lat, lng], ...]
      setPoints(initialCoordinates);
      setSaved(true);
    }
  }, [initialCoordinates]);

  const handleAddPoint = (point) => {
    setPoints((prev) => [...prev, point]);
    setSaved(false);
  };

  const handleStartDrawing = () => {
    if (points.length > 0) {
      if (
        !confirm("Menggambar polygon baru akan menghapus yang lama. Lanjutkan?")
      ) {
        return;
      }
    }
    setPoints([]);
    setIsDrawing(true);
    setSaved(false);
  };

  const handleFinishDrawing = () => {
    if (points.length < 3) {
      alert("Polygon harus memiliki minimal 3 titik!");
      return;
    }
    setIsDrawing(false);
  };

  const handleSave = () => {
    if (points.length < 3) {
      alert("Polygon harus memiliki minimal 3 titik!");
      return;
    }

    // Convert to GeoJSON format: [[[lng, lat], ...]]
    // Leaflet uses [lat, lng], but GeoJSON uses [lng, lat]
    const geoJsonCoordinates = points.map(([lat, lng]) => [lng, lat]);

    // Close the ring (first point === last point)
    if (
      geoJsonCoordinates[0][0] !==
        geoJsonCoordinates[geoJsonCoordinates.length - 1][0] ||
      geoJsonCoordinates[0][1] !==
        geoJsonCoordinates[geoJsonCoordinates.length - 1][1]
    ) {
      geoJsonCoordinates.push(geoJsonCoordinates[0]);
    }

    const geoJson = {
      type: "Polygon",
      coordinates: [geoJsonCoordinates],
    };

    onSave && onSave(geoJson);
    setSaved(true);
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (confirm("Yakin ingin menghapus polygon?")) {
      setPoints([]);
      setIsDrawing(false);
      setSaved(false);
    }
  };

  const handleReset = () => {
    if (confirm("Yakin ingin reset ke koordinat awal?")) {
      if (initialCoordinates) {
        setPoints(initialCoordinates);
        setSaved(true);
      } else {
        setPoints([]);
        setSaved(false);
      }
      setIsDrawing(false);
    }
  };

  // Default center (Banyubiru area)
  const defaultCenter = [-7.315, 110.425];

  return (
    <div className="space-y-3">
      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2">
        {!isDrawing ? (
          <button
            type="button"
            onClick={handleStartDrawing}
            className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium"
          >
            {points.length > 0 ? "Gambar Ulang Polygon" : "Mulai Menggambar"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinishDrawing}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Selesai Menggambar ({points.length} titik)
          </button>
        )}

        {points.length > 0 && !isDrawing && (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={saved}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium
                ${
                  saved
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
              `}
            >
              <Save size={16} />
              <span>{saved ? "Tersimpan" : "Simpan Koordinat"}</span>
            </button>

            {initialCoordinates && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              <span>Hapus</span>
            </button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        {isDrawing ? (
          <p>
            <strong>Mode Menggambar:</strong> Klik pada peta untuk menambah
            titik polygon. Minimal 3 titik. Klik "Selesai Menggambar" jika
            sudah.
          </p>
        ) : points.length > 0 ? (
          <p>
            <strong>Polygon Tergambar:</strong> {points.length} titik.
            {saved
              ? " ✓ Koordinat sudah tersimpan."
              : " Klik 'Simpan Koordinat' untuk menyimpan."}
          </p>
        ) : (
          <p>
            <strong>Petunjuk:</strong> Klik tombol "Mulai Menggambar" lalu klik
            pada peta untuk membuat polygon lokasi tanah.
          </p>
        )}
      </div>

      {/* Map */}
      <div
        className="border border-gray-300 rounded-lg overflow-hidden"
        style={{ height }}
      >
        <MapContainer
          center={points.length > 0 ? points[0] : defaultCenter}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler isDrawing={isDrawing} onAddPoint={handleAddPoint} />

          {/* Draw Polygon */}
          {points.length > 2 && (
            <Polygon
              positions={points}
              pathOptions={{
                color: saved ? "#10b981" : "#ef4444",
                fillColor: saved ? "#10b981" : "#ef4444",
                fillOpacity: 0.3,
                weight: 2,
              }}
            />
          )}

          {/* Draw Points - FIXED: Use CircleMarker instead of <circle> */}
          {points.length > 0 &&
            points.map((point, idx) => (
              <CircleMarker
                key={idx}
                center={point}
                radius={5}
                pathOptions={{
                  color: "darkred",
                  fillColor: "red",
                  fillOpacity: 0.8,
                  weight: 2,
                }}
              />
            ))}
        </MapContainer>
      </div>

      {/* Coordinate Summary */}
      {points.length > 0 && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
          <p className="font-semibold text-gray-700 mb-1">
            Koordinat Polygon ({points.length} titik):
          </p>
          <div className="max-h-32 overflow-y-auto text-gray-600 font-mono">
            {points.map((p, i) => (
              <div key={i}>
                {i + 1}. [{p[0].toFixed(6)}, {p[1].toFixed(6)}]
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
