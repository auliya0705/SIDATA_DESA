"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

/** Leaflet Map anti-SSR */
const MapInput = dynamic(() => import("@/components/admin/MapInput"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default function TanahForm({
  initialData = null,
  mode = "create",
  isIdentitasReadOnly = false,
  onSubmit,               // ← CreateTanahPage akan inject ini
  loading = false,
}) {
  const defaultFormData = {
    // identitas
    nama_pemilik: "",
    warga_id: "",
    nomor_urut: "",           // opsional
    // bidang
    luas_m2: "",
    status_hak_tanah: "",
    penggunaan_tanah: [],
    keterangan: "",
    // peta
    geojson: null,            // geometry Polygon (bukan Feature)
  };

  const [formData, setFormData] = useState({
    ...defaultFormData,
    ...initialData,
    penggunaan_tanah: initialData?.penggunaan_tanah || [],
    geojson: initialData?.geojson || null,
  });

  /** ================= Autocomplete Warga (tanpa tanah) ================= */
  const [wargaQuery, setWargaQuery] = useState("");
  const [wargaOptions, setWargaOptions] = useState([]);
  const [wargaOpen, setWargaOpen] = useState(false);
  const searchTimer = useRef(null);

  const fetchWarga = async (q = "") => {
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      params.set("per_page", "10");
      // kalau backend mendukung:
      params.set("without_tanah", "1");

      const res = await fetch(`/api/warga?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          Accept: "application/json",
        },
      });

      const ct = res.headers.get("content-type") || "";
      const raw = await res.text();
      if (!res.ok) throw new Error(raw || `HTTP ${res.status}`);

      const data = ct.includes("application/json") ? JSON.parse(raw) : null;

      let items = (data?.data || []).map((w) => ({
        id: w.id,
        nama: w.nama_lengkap,
        nik: w.nik,
        tanah_count: typeof w.tanah_count === "number" ? w.tanah_count : undefined,
      }));

      // fallback filter FE: hanya yang belum punya tanah
      items = items.filter((it) =>
        it.tanah_count === undefined ? true : it.tanah_count === 0
      );

      // saran berdasarkan query
      if (q) {
        const qq = q.toLowerCase();
        items = items
          .filter(
            (it) =>
              (it.nama || "").toLowerCase().includes(qq) ||
              (it.nik || "").includes(q)
          )
          .slice(0, 10);
      }

      setWargaOptions(items);
    } catch (e) {
      console.error("fetch warga gagal:", e);
      setWargaOptions([]);
    }
  };

  useEffect(() => {
    fetchWarga().catch(() => {});
  }, []);

  const handlePickWarga = (opt) => {
    setFormData((prev) => ({
      ...prev,
      warga_id: opt.id,
      nama_pemilik: opt.nama || prev.nama_pemilik,
    }));
    setWargaQuery(`${opt.nama}${opt.nik ? ` (${opt.nik})` : ""}`);
    setWargaOpen(false);
  };

  const onChangeWargaQuery = (val) => {
    setWargaQuery(val);
    setWargaOpen(true);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchWarga(val).catch(() => {});
    }, 300);
  };

  /** ================= Options ================= */
  const statusHakOptions = [
    { value: "HM", label: "HM" },
    { value: "HGB", label: "HGB" },
    { value: "HP", label: "HP" },
    { value: "HGU", label: "HGU" },
    { value: "HPL", label: "HPL" },
    { value: "MA", label: "MA" },
    { value: "VI", label: "VI" },
    { value: "TN", label: "TN" },
  ];

  const penggunaanMap = {
    perumahan: "PERUMAHAN",
    perdagangan_jasa: "PERDAGANGAN_JASA",
    perkantoran: "PERKANTORAN",
    industri: "INDUSTRI",
    fasilitas_umum: "FASILITAS_UMUM",
    sawah: "SAWAH",
    tegalan: "TEGALAN",
    perkebunan: "PERKEBUNAN",
    peternakan_perikanan: "PETERNAKAN_PERIKANAN",
    hutan_belukar: "HUTAN_BELUKAR",
    hutan_lindung: "HUTAN_LINDUNG",
    tanah_kosong: "TANAH_KOSONG",
    mutasi_tanah: "MUTASI_TANAH",
    lain_lain: "LAIN_LAIN",
  };

  const penggunaanTanahOptions = Object.entries(penggunaanMap).map(
    ([value, label]) => ({ value, label: label.replaceAll("_", " ") })
  );

  /** ================= Handlers ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleStatusHakChange = (value) => {
    setFormData((p) => ({ ...p, status_hak_tanah: value }));
  };

  const handlePenggunaanChange = (value) => {
    setFormData((p) => {
      const curr = p.penggunaan_tanah || [];
      const next = curr.includes(value) ? curr.filter((v) => v !== value) : [...curr, value];
      return { ...p, penggunaan_tanah: next };
    });
  };

  const handleMapSave = (geoJsonGeometry) => {
    setFormData((p) => ({ ...p, geojson: geoJsonGeometry }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi minimum sebelum lempar ke onSubmit
    if (!formData.warga_id) return alert("Pilih Warga terlebih dahulu!");
    if (!formData.status_hak_tanah) return alert("Pilih Status Hak Tanah!");
    if (!formData.luas_m2) return alert("Isi Luas Bidang (m²)!");
    if (!formData.penggunaan_tanah?.length)
      return alert("Pilih minimal 1 Penggunaan Tanah!");

    if (typeof onSubmit === "function") {
      await onSubmit(formData);
    }
  };

  // initial coordinates (untuk edit)
  const initialCoordinates = initialData?.geojson?.coordinates?.[0]
    ? initialData.geojson.coordinates[0].map(([lng, lat]) => [lat, lng])
    : null;

  /** ================= Render ================= */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Identitas Dasar */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Identitas Dasar
        </h3>

        <div className="space-y-4">
          {/* Autocomplete Warga */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Warga 
            </label>
            <input
              type="text"
              value={wargaQuery}
              onChange={(e) => onChangeWargaQuery(e.target.value)}
              onFocus={() => setWargaOpen(true)}
              placeholder="ketik nama / NIK…"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              readOnly={isIdentitasReadOnly}
            />
            {wargaOpen && !isIdentitasReadOnly && (
              <div
                className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow max-h-56 overflow-auto"
                onMouseLeave={() => setWargaOpen(false)}
              >
                {wargaOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">Tidak ada hasil</div>
                ) : (
                  wargaOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => handlePickWarga(opt)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-800">{opt.nama}</div>
                        {typeof opt.tanah_count === "number" && opt.tanah_count === 0 && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-700">
                            tanpa tanah
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500">NIK: {opt.nik || "-"}</div>
                    </button>
                  ))
                )}
              </div>
            )}
            <input type="hidden" name="warga_id" value={formData.warga_id} />
          </div>

          {/* Nomor Urut (opsional) */}
          
        </div>
      </div>

      {/* Peta */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Lokasi Tanah (Peta)
        </h3>

        <MapInput
          initialCoordinates={initialCoordinates}
          onSave={handleMapSave}
          height="500px"
        />

        {formData.geojson && (
          <input type="hidden" name="geojson" value={JSON.stringify(formData.geojson)} />
        )}
      </div>

      {/* Status & Luas Bidang */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Status & Luas Bidang
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Hak */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statusHakOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status_hak_tanah"
                    value={option.value}
                    checked={formData.status_hak_tanah === option.value}
                    onChange={() => handleStatusHakChange(option.value)}
                    className="w-4 h-4 text-teal-700 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Luas Bidang */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Luas Bidang (m²)
            </label>
            <input
              type="number"
              name="luas_m2"
              value={formData.luas_m2}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="contoh: 1200"
              required
            />
          </div>
        </div>
      </div>

      {/* Penggunaan Tanah */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Penggunaan Tanah
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {penggunaanTanahOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                value={option.value}
                checked={(formData.penggunaan_tanah || []).includes(option.value)}
                onChange={() => handlePenggunaanChange(option.value)}
                className="w-4 h-4 text-teal-700 focus:ring-teal-500 rounded"
              />
              <span className="text-sm text-gray-700">
                {option.label.replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          *Saat ini pengajuan membuat 1 bidang; sistem memakai penggunaan pertama yang dipilih.
        </p>
      </div>

      {/* Keterangan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Keterangan
        </h3>
        <textarea
          name="keterangan"
          value={formData.keterangan}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="Catatan lain (opsional)"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-60"
        >
          {loading ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </form>
  );
}
