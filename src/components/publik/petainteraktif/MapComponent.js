"use client";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// mapping singkatan → enum backend
const PENGGUNAAN_MAP = {
  PRM: "PERUMAHAN",
  PDJ: "PERDAGANGAN_JASA",
  PKO: "PERKANTORAN",
  IND: "INDUSTRI",
  FUM: "FASILITAS_UMUM",
  SWH: "SAWAH",
  TGL: "TEGALAN",
  PKB: "PERKEBUNAN",
  PTR: "PETERNAKAN_PERIKANAN",
  HBL: "HUTAN_BELUKAR",
  HLL: "HUTAN_LINDUNG",
  MTD: "MUTASI_TANAH",
  TKS: "TANAH_KOSONG",
};

// helper: ubah ring [ [lng,lat], ... ] → [ [lat,lng], ... ]
const toLatLngRing = (ring) => ring.map(([lng, lat]) => [lat, lng]);

export default function MapComponent({ filter }) {
  const [data, setData] = useState(null); // FeatureCollection
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // build URL dari filter
  const url = useMemo(() => {
    const params = new URLSearchParams();

    if (filter?.kategori && filter?.bidang) {
      if (filter.kategori === "status") {
        params.set("status_hak", String(filter.bidang).toUpperCase());
      } else if (filter.kategori === "penggunaan") {
        const val =
          PENGGUNAAN_MAP[String(filter.bidang).toUpperCase()] || filter.bidang;
        params.set("penggunaan", val);
      }
    }

    params.set("include_props", "true");

    // ✅ perbaikan bagian ini (hilangkan “??”)
    return `/api/public/map${params.toString() ? `?${params.toString()}` : ""}`;
  }, [filter]);

  useEffect(() => {
    if (!filter || !filter.kategori || !filter.bidang) {
      setData(null);
      setLoading(false);
      return;
    }
    
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { cache: "no-store", signal: ac.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => setData(json))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e);
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [url]);

  const defaultCenter = [-6.90035, 107.6004];
  const features = data?.type === "FeatureCollection" ? data.features : [];

  if (error) {
    return (
      <div className="p-3 text-red-600">
        Gagal memuat peta: {String(error.message)}
      </div>
    );
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={16}
      style={{ height: "100vh", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {!loading &&
        features.map((f, idx) => {
          const geom = f?.geometry;
          const props = f?.properties || {};
          if (!geom) return null;

          // Polygon
          if (geom.type === "Polygon") {
            const rings = geom.coordinates.map(toLatLngRing);
            return (
              <Polygon
                key={props.bidang_id ?? idx}
                positions={rings}
                pathOptions={{ color: "rgba(194, 64, 64, 0.9)" }}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>
                      {props.nama ?? `Bidang ${props.bidang_id ?? ""}`}
                    </strong>
                    <div>Status: {props.status_hak}</div>
                    <div>Penggunaan: {props.penggunaan}</div>
                    <div>Luas: {props.luas_m2 ?? "-"} m²</div>
                    {props.keterangan && (
                      <div>Keterangan: {props.keterangan}</div>
                    )}
                    {Array.isArray(props.centroid) &&
                      props.centroid.length === 2 && (
                        <div>
                          Centroid: {props.centroid[1].toFixed(6)},{" "}
                          {props.centroid[0].toFixed(6)}
                        </div>
                      )}
                    {props.updated_at && <div>Update: {props.updated_at}</div>}
                  </div>
                </Popup>
              </Polygon>
            );
          }

          // MultiPolygon
          if (geom.type === "MultiPolygon") {
            return geom.coordinates.map((poly, j) => {
              const rings = poly.map(toLatLngRing);
              return (
                <Polygon
                  key={`${props.bidang_id ?? idx}-${j}`}
                  positions={rings}
                  pathOptions={{ color: "rgba(194, 64, 64, 0.9)" }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>
                        {props.nama ?? `Bidang ${props.bidang_id ?? ""}`}
                      </strong>
                      <div>Status: {props.status_hak}</div>
                      <div>Penggunaan: {props.penggunaan}</div>
                      <div>Luas: {props.luas_m2 ?? "-"} m²</div>
                      {props.keterangan && (
                        <div>Keterangan: {props.keterangan}</div>
                      )}
                      {props.updated_at && (
                        <div>Update: {props.updated_at}</div>
                      )}
                    </div>
                  </Popup>
                </Polygon>
              );
            });
          }

          return null;
        })}
    </MapContainer>
  );
}
