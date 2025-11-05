"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Map anti-SSR
const MapInput = dynamic(() => import("@/components/admin/MapInput"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map…</p>
    </div>
  ),
});

const STATUS_HAK = ["HM", "HGB", "HP", "HGU", "HPL", "MA", "VI", "TN"];
const PENGGUNAAN = [
  "PERUMAHAN",
  "PERDAGANGAN_JASA",
  "PERKANTORAN",
  "INDUSTRI",
  "FASILITAS_UMUM",
  "SAWAH",
  "TEGALAN",
  "PERKEBUNAN",
  "PETERNAKAN_PERIKANAN",
  "HUTAN_BELUKAR",
  "HUTAN_LINDUNG",
  "MUTASI_TANAH",
  "TANAH_KOSONG",
  "LAIN_LAIN",
];

export default function BidangForm({
  initialData = null,   // { luas_m2, status_hak, penggunaan, keterangan, geojson, geojson_nama }
  mode = "create",      // "create" | "edit"
  onSubmit,
  loading = false,
}) {
  const mapRef = useRef(null);

  const [form, setForm] = useState({
    luas_m2: "",
    status_hak: "",
    penggunaan: "",     // single-select (LOCK 1)
    keterangan: "",
    geojson_nama: "",
    geojson: null,      // Polygon { type:"Polygon", coordinates:[ [ [lng,lat], ...] ] }
  });

  // Prefill dari initialData
  useEffect(() => {
    if (initialData) {
      setForm((p) => ({
        ...p,
        luas_m2: initialData.luas_m2 ?? "",
        status_hak: initialData.status_hak ?? "",
        penggunaan: initialData.penggunaan ?? "",
        keterangan: initialData.keterangan ?? "",
        geojson_nama: initialData.geojson_nama ?? "",
        geojson: initialData.geojson ?? null,
      }));
    }
  }, [initialData]);

  // Bagi opsi penggunaan jadi 2 kolom agar rapi
  const penggunaanCols = useMemo(() => {
    const mid = Math.ceil(PENGGUNAAN.length / 2);
    return [PENGGUNAAN.slice(0, mid), PENGGUNAAN.slice(mid)];
  }, []);

  // empat_titik = true bila ring tertutup punya 4 titik unik (5 termasuk penutup)
  const isFourPoint = useMemo(() => {
    const ring = form.geojson?.coordinates?.[0] || [];
    return ring.length === 5;
  }, [form.geojson]);

  const handleMapSave = (polygon) => {
    setForm((p) => ({ ...p, geojson: polygon }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Checkbox lock-1
  const togglePenggunaan = (valUpper) => {
    setForm((p) => ({
      ...p,
      penggunaan: p.penggunaan === valUpper ? "" : valUpper,
    }));
  };

  const startDraw = () => {
    // Jika MapInput expose method via ref, bisa dipanggil di sini:
    // mapRef.current?.startDraw?.();
    document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.luas_m2 || Number(form.luas_m2) <= 0) {
      alert("Isi luas bidang dengan benar.");
      return;
    }
    if (!form.status_hak) {
      alert("Pilih status hak.");
      return;
    }
    if (!form.penggunaan) {
      alert("Pilih penggunaan (maksimal 1).");
      return;
    }

    if (mode === "create" && !form.geojson) {
      alert("Gambar polygon pada peta lalu klik Simpan Koordinat.");
      return;
    }
    // mode=edit: geojson opsional (kalau tidak diubah, backend akan update field lain saja)

    const payload = {
      luas_m2: Number(form.luas_m2),
      status_hak: String(form.status_hak).toUpperCase(),
      penggunaan: String(form.penggunaan).toUpperCase(), // single
      keterangan: form.keterangan || null,
      geometry: form.geojson || undefined,               // hanya kirim jika ada geometry
      geojson_nama: form.geojson_nama || null,
      srid: 4326,
      empat_titik: isFourPoint,
    };

    await onSubmit?.(payload);
  };

  const selectedPenggunaan = form.penggunaan || "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Peta */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Lokasi Bidang (Peta)
        </h3>

        <div id="map-section">
          <MapInput ref={mapRef} onSave={handleMapSave} height="420px" initialGeometry={form.geojson} />
        </div>

        {form.geojson ? (
          <p className="text-xs text-gray-600 mt-3">
            Koordinat tersimpan. Titik unik:{" "}
            {(form.geojson.coordinates?.[0]?.length || 0) - 1} —{" "}
            {isFourPoint ? "empat_titik = true" : "empat_titik = false"}
          </p>
        ) : (
          <button
            type="button"
            onClick={startDraw}
            className="mt-3 text-sm text-teal-700 hover:underline"
          >
            + Gambar polygon di peta
          </button>
        )}
      </div>

      {/* Status & Luas Bidang */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Status &amp; Luas Bidang
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Radio status hak: 2 kolom x 4 item */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3">
              {STATUS_HAK.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status_hak"
                    value={s}
                    checked={form.status_hak === s}
                    onChange={handleChange}
                    className="w-4 h-4 text-teal-700 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Luas di kanan */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Luas Bidang (m²)
            </label>
            <input
              type="number"
              name="luas_m2"
              value={form.luas_m2}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="contoh: 700"
              required
            />
          </div>
        </div>
      </div>

      {/* Penggunaan Tanah (checkbox lock-1, dua kolom) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Penggunaan Tanah
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {penggunaanCols.map((col, idx) => (
            <div key={idx} className="space-y-2">
              {col.map((p) => {
                const selected = selectedPenggunaan === p;
                const locked = !!selectedPenggunaan && !selected;
                return (
                  <label
                    key={p}
                    className="flex items-center gap-2 cursor-pointer"
                    title={locked ? "Hanya boleh pilih satu" : ""}
                  >
                    <input
                      type="checkbox"
                      value={p}
                      checked={selected}
                      disabled={locked}
                      onChange={() => togglePenggunaan(p)}
                      className="w-4 h-4 text-teal-700 focus:ring-teal-500 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-gray-700">
                      {p.replaceAll("_", " ")}
                    </span>
                  </label>
                );
              })}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-3">
          *Maksimal satu pilihan. Klik lagi untuk membatalkan, lalu pilih yang lain.
        </p>
      </div>

      {/* Keterangan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Keterangan
        </h3>
        <input
          type="text"
          name="keterangan"
          value={form.keterangan}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="mis. koreksi nomor / catatan lain"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-60"
        >
          {loading ? "Menyimpan…" : (mode === "edit" ? "Ajukan Perubahan" : "Simpan Bidang")}
        </button>
      </div>
    </form>
  );
}
