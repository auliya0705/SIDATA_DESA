"use client";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent({ filter }) {
  // contoh data bidang (dummy) — ganti dengan data riilmu
  const bidang = [
    {
      id: 1,
      nama: "Bidang A",
      posisi: [
        [-7.7712, 110.3772],
        [-7.7712, 110.3782],
        [-7.7722, 110.3782],
        [-7.7722, 110.3772],
      ],
      status: "HM",
      penggunaan: "Perumahan",
    },
    {
      id: 2,
      nama: "Bidang B",
      posisi: [
        [-7.7698, 110.3788],
        [-7.7698, 110.3798],
        [-7.7708, 110.3798],
        [-7.7708, 110.3788],
      ],
      status: "HGB",
      penggunaan: "Pertanian",
    },
    // tambah data bidang sesuai kebutuhan
  ];

  // jika belum ada filter yang diterapkan, jangan render polygon
  const shouldRender = filter && filter.kategori && filter.bidang;

  const filtered = shouldRender
    ? bidang.filter((b) =>
        filter.kategori === "status"
          ? b.status === filter.bidang
          : b.penggunaan === filter.bidang
      )
    : [];

  return (
    <MapContainer
      center={[-7.7712, 110.378]}
      zoom={16}
      style={{ height: "100vh", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {filtered.map((b) => (
        <Polygon
          key={b.id}
          positions={b.posisi}
          pathOptions={{ color: "rgba(194, 64, 64, 0.9)" }}
        >
          <Popup>
            <div className="text-sm">
              <strong>{b.nama}</strong>
              <div>Status: {b.status}</div>
              <div>Penggunaan: {b.penggunaan}</div>
            </div>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
}