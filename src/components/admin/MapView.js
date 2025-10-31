"use client";

import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({
  geoJson,
  properties = {},
  height = "400px",
}) {
  if (!geoJson || !geoJson.coordinates) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
        style={{ height }}
      >
        <p>Tidak ada data koordinat</p>
      </div>
    );
  }

  // Convert GeoJSON [[[lng, lat], ...]] to Leaflet [[lat, lng], ...]
  const toLatLngRing = (ring) => ring.map(([lng, lat]) => [lat, lng]);

  let polygonPositions = [];
  let centerPoint = [-7.315, 110.425]; // default

  if (geoJson.type === "Polygon") {
    polygonPositions = geoJson.coordinates.map(toLatLngRing);

    // Calculate center from first ring
    if (polygonPositions[0] && polygonPositions[0].length > 0) {
      const avgLat =
        polygonPositions[0].reduce((sum, p) => sum + p[0], 0) /
        polygonPositions[0].length;
      const avgLng =
        polygonPositions[0].reduce((sum, p) => sum + p[1], 0) /
        polygonPositions[0].length;
      centerPoint = [avgLat, avgLng];
    }
  } else if (geoJson.type === "MultiPolygon") {
    // Handle MultiPolygon (just show first polygon for simplicity)
    polygonPositions = geoJson.coordinates[0].map(toLatLngRing);

    if (polygonPositions[0] && polygonPositions[0].length > 0) {
      const avgLat =
        polygonPositions[0].reduce((sum, p) => sum + p[0], 0) /
        polygonPositions[0].length;
      const avgLng =
        polygonPositions[0].reduce((sum, p) => sum + p[1], 0) /
        polygonPositions[0].length;
      centerPoint = [avgLat, avgLng];
    }
  }

  return (
    <div
      className="border border-gray-300 rounded-lg overflow-hidden"
      style={{ height }}
    >
      <MapContainer
        center={centerPoint}
        zoom={17}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {polygonPositions.length > 0 && (
          <Polygon
            positions={polygonPositions}
            pathOptions={{
              color: "#10b981",
              fillColor: "#10b981",
              fillOpacity: 0.4,
              weight: 3,
            }}
          >
            {Object.keys(properties).length > 0 && (
              <Popup>
                <div className="text-sm">
                  {properties.nama && (
                    <div className="font-semibold mb-1">{properties.nama}</div>
                  )}
                  {properties.luas_m2 && (
                    <div>Luas: {properties.luas_m2} m²</div>
                  )}
                  {properties.status_hak && (
                    <div>Status: {properties.status_hak}</div>
                  )}
                  {properties.penggunaan && (
                    <div>Penggunaan: {properties.penggunaan}</div>
                  )}
                  {properties.keterangan && (
                    <div>Keterangan: {properties.keterangan}</div>
                  )}
                </div>
              </Popup>
            )}
          </Polygon>
        )}
      </MapContainer>
    </div>
  );
}
