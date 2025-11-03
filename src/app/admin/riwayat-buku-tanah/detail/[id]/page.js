"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, User, FileText } from "lucide-react";
// ⬇️ pakai lib yang sudah kamu punya
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";

export default function DetailRiwayatPage() {
  const params = useParams();
  const router = useRouter();
  const [riwayatData, setRiwayatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)));

  // helper: map action → label
  const jenisFromAction = (action) => {
    switch ((action || "").toLowerCase()) {
      case "create":
        return "Tambah";
      case "update":
        return "Edit";
      case "delete":
        return "Hapus";
      default:
        return action || "-";
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Normalisasi payload supaya selalu { before, after }
  // Normalisasi payload supaya selalu { before, after }
function normalizePayloadForUI(res) {
  const p = res?.payload;
  if (!p) return { before: null, after: null };

  const mod = (res?.module || "").toLowerCase();
  const act = (res?.action || "").toLowerCase();

  const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)));

  // --- mapper snapshot -> field datar yang UI baca ---
  const mapWarga = (raw = {}) => ({
    nama_pemilik: raw.nama_lengkap ?? raw.nama ?? null,
    nomor_urut: null,
    jumlah_luas: null,
    status_hak_tanah: null,
    penggunaan_tanah: [],
    keterangan: raw.keterangan ?? null,
  });

  const mapTanah = (raw = {}) => {
    const bidang = Array.isArray(raw.bidang) ? raw.bidang : [];
    const totalLuas = bidang.reduce((s, b) => s + (Number(b?.luas_m2) || 0), 0);
    const statuses  = uniq(bidang.map((b) => b?.status_hak));
    const uses      = uniq(bidang.map((b) => b?.penggunaan));
    return {
      nama_pemilik: raw.preview_pemilik?.nama ?? raw.nama_pemilik ?? raw.warga_nama ?? null,
      nomor_urut:   raw.preview_pemilik?.nomor_urut ?? raw.nomor_urut ?? null,
      jumlah_luas:  totalLuas || raw.luas_total || raw.jumlah_luas || raw.jumlah_m2
        ? String(totalLuas || raw.luas_total || raw.jumlah_luas || raw.jumlah_m2) : null,
      status_hak_tanah:
        statuses.length === 1 ? statuses[0] : (statuses.length > 1 ? "CAMPURAN" : (raw.status_hak_tanah ?? null)),
      penggunaan_tanah:
        uses.length ? uses : (Array.isArray(raw.penggunaan_tanah) ? raw.penggunaan_tanah : (raw.penggunaan ? [raw.penggunaan] : [])),
      keterangan: raw.keterangan ?? null,
    };
  };

  const mapBidang = (raw = {}) => ({
    nama_pemilik: raw.preview_pemilik?.nama ?? raw.nama_pemilik ?? raw.warga_nama ?? null,
    nomor_urut:   raw.preview_pemilik?.nomor_urut ?? raw.nomor_urut ?? null,
    jumlah_luas:  raw.luas_m2 != null ? String(raw.luas_m2) : (raw.luas != null ? String(raw.luas) : null),
    status_hak_tanah: raw.status_hak ?? null,
    penggunaan_tanah: Array.isArray(raw.penggunaan_tanah) ? raw.penggunaan_tanah : (raw.penggunaan ? [raw.penggunaan] : []),
    keterangan: raw.keterangan ?? null,
  });

  // --- jika payload sudah punya before/after ---
  if (p.before || p.after) {
    let before = p.before ?? null;
    let after  = p.after ?? null;

    // ⬇️ penting: beberapa backend taruh snapshot DELETE di "after"
    if (act === "delete" && after && !before) {
      before = after;   // anggap after = snapshot sebelum dihapus
      after = null;
    }

    // flatten sesuai module
    const applyMap = (x) =>
      !x ? null :
      mod === "tanah"  ? mapTanah(x)  :
      mod === "bidang" ? mapBidang(x) :
      mod === "warga"  ? mapWarga(x)  : x;

    return { before: applyMap(before), after: applyMap(after) };
  }

  // --- payload flat (fallback lama) ---
  const snapshot =
    mod === "warga"  ? mapWarga(p)  :
    mod === "tanah"  ? mapTanah(p)  :
    mod === "bidang" ? mapBidang(p) : p;

  if (act === "create") return { before: null,   after: snapshot };
  if (act === "delete") return { before: snapshot, after: null };
  // update tanpa before → tampilkan after saja
  return { before: p.before ?? null, after: p.after ?? snapshot };
}


  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        // fetch detail dari /kepala/approvals/{id}?include_payload=1
        const res = await apiGet(
          `${API_ENDPOINTS.PROPOSAL.SHOW(params.id)}?include_payload=1`
        );

        // format tanggal & waktu dari submitted_at
        const submittedAt = res?.submitted_at ? new Date(res.submitted_at) : null;
        const tanggal = submittedAt
          ? submittedAt.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "-";
        const waktu = submittedAt
          ? submittedAt.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "-";

        // payload diff (bisa {before,after} atau null)
        const { before: data_sebelum, after: data_sesudah } =
          normalizePayloadForUI(res);

        const mapped = {
          id: res?.id ?? params.id,
          jenis_perubahan: res?.jenis_perubahan || jenisFromAction(res?.action),
          nama:
            res?.submitted_by?.name ??
            `${res?.module ?? "-"} (${res?.action ?? "-"})`,
          tanggal,
          waktu,
          admin: res?.reviewed_by?.name ?? res?.submitted_by?.name ?? "-",
          role_admin: res?.reviewed_by?.name ? "Kepala Desa" : "Pengaju",
          keterangan: res?.review_note || "", // tampilkan alasan ditolak
          status: res?.status || "", // badge status
          data_sebelum,
          data_sesudah,
          _raw: res,
        };

        if (mounted) setRiwayatData(mapped);
      } catch (e) {
        console.error("Gagal memuat detail:", e);
        if (mounted) setRiwayatData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!riwayatData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Detail Riwayat Perubahan
          </h1>
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">Data tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  const getJenisBadgeColor = (jenis) => {
    switch (jenis) {
      case "Tambah":
        return "bg-green-100 text-green-800";
      case "Edit":
        return "bg-blue-100 text-blue-800";
      case "Hapus":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const CompareRow = ({ label, before, after }) => {
    const isDifferent = JSON.stringify(before) !== JSON.stringify(after);

    return (
      <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
        <div className="font-medium text-gray-700">{label}</div>
        <div className={`${isDifferent ? "bg-red-50 p-2 rounded" : ""}`}>
          <p className="text-sm text-gray-900">
            {Array.isArray(before) ? before.join(", ") : before ?? "-"}
          </p>
        </div>
        <div className={`${isDifferent ? "bg-green-50 p-2 rounded" : ""}`}>
          <p className="text-sm text-gray-900">
            {Array.isArray(after) ? after.join(", ") : after ?? "-"}
          </p>
        </div>
      </div>
    );
  };

  // ---------- Tambahan helper untuk mode Edit ----------
  const FIELDS = [
    { key: "nama_pemilik", label: "Nama Pemilik" },
    { key: "nomor_urut", label: "Nomor Urut" },
    { key: "jumlah_luas", label: "Jumlah Luas (m²)" },
    { key: "status_hak_tanah", label: "Status Hak Tanah" },
    { key: "penggunaan_tanah", label: "Penggunaan Tanah" },
    { key: "keterangan", label: "Keterangan" },
  ];

  const hasAnyValue = (snap) => {
    if (!snap) return false;
    return FIELDS.some(({ key }) => {
      const v = snap[key];
      if (Array.isArray(v)) return v.length > 0;
      return v !== null && v !== undefined && String(v).trim() !== "";
    });
  };

  const renderValue = (v) => {
    if (Array.isArray(v)) return v.length ? v.join(", ") : "-";
    return v ?? "-";
  };
  // -----------------------------------------------------

  // diff hanya untuk Edit
  const isEdit = riwayatData.jenis_perubahan === "Edit";
  const hasBefore = hasAnyValue(riwayatData.data_sebelum);
  const hasAfter = hasAnyValue(riwayatData.data_sesudah);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Detail Riwayat Perubahan
          </h1>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <h2 className="text-2xl font-bold text-gray-800 mr-2">
                {riwayatData.nama}
              </h2>
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${getJenisBadgeColor(
                  riwayatData.jenis_perubahan
                )}`}
              >
                {riwayatData.jenis_perubahan}
              </span>
              {/* Badge status */}
              {riwayatData.status && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                    riwayatData.status
                  )}`}
                >
                  {riwayatData.status}
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>
                  {riwayatData.tanggal} || {riwayatData.waktu}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>
                  Diubah oleh: <strong>{riwayatData.admin}</strong> (
                  {riwayatData.role_admin})
                </span>
              </div>

              {/* Catatan review / alasan ditolak */}
              {riwayatData.keterangan && (
                <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
                  <div className="text-xs font-semibold mb-1">Catatan Review</div>
                  <pre className="whitespace-pre-wrap text-xs">
                    {riwayatData.keterangan}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==== MODE EDIT ==== */}
      {isEdit && (
        <>
          {/* (A) Tidak ada AFTER → tidak ada perubahan */}
          {!hasAfter && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-700">Tidak ada yang diubah pada riwayat ini.</p>
            </div>
          )}

          {/* (B) Hanya AFTER (backend tidak simpan before) → satu kolom ringkasan sesudah */}
          {!hasBefore && hasAfter && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-teal-700 text-white px-6 py-4">
                <h3 className="text-lg font-semibold">Perubahan (Sesudah)</h3>
              </div>
              <dl className="px-6">
                {FIELDS.map(({ key, label }) => (
                  <div
                    key={key}
                    className="grid grid-cols-3 py-3 border-b border-gray-100"
                  >
                    <dt className="font-medium text-gray-700">{label}</dt>
                    <dd className="col-span-2 text-gray-900">
                      {renderValue(riwayatData.data_sesudah?.[key])}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* (C) before & after ada → tabel perbandingan seperti semula */}
          {hasBefore && hasAfter && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-teal-700 text-white px-6 py-4">
                <h3 className="text-lg font-semibold">Perbandingan Data</h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 pb-3 border-b-2 border-gray-200 mb-3">
                  <div className="font-bold text-gray-700">Field</div>
                  <div className="font-bold text-red-700">Data Sebelum</div>
                  <div className="font-bold text-green-700">Data Sesudah</div>
                </div>

                <CompareRow
                  label="Nama Pemilik"
                  before={riwayatData.data_sebelum?.nama_pemilik}
                  after={riwayatData.data_sesudah?.nama_pemilik}
                />
                <CompareRow
                  label="Nomor Urut"
                  before={riwayatData.data_sebelum?.nomor_urut}
                  after={riwayatData.data_sesudah?.nomor_urut}
                />
                <CompareRow
                  label="Jumlah Luas (m²)"
                  before={riwayatData.data_sebelum?.jumlah_luas}
                  after={riwayatData.data_sesudah?.jumlah_luas}
                />
                <CompareRow
                  label="Status Hak Tanah"
                  before={riwayatData.data_sebelum?.status_hak_tanah}
                  after={riwayatData.data_sesudah?.status_hak_tanah}
                />
                <CompareRow
                  label="Penggunaan Tanah"
                  before={riwayatData.data_sebelum?.penggunaan_tanah}
                  after={riwayatData.data_sesudah?.penggunaan_tanah}
                />
                <CompareRow
                  label="Keterangan"
                  before={riwayatData.data_sebelum?.keterangan}
                  after={riwayatData.data_sesudah?.keterangan}
                />
              </div>

              <div className="bg-gray-50 px-6 py-3 text-sm text-gray-600">
                <p>
                  💡 <strong>Tip:</strong> Field yang berubah ditandai dengan warna
                  merah (sebelum) dan hijau (sesudah)
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Data Detail - For Tambah/Hapus */}
      {riwayatData.jenis_perubahan === "Tambah" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">Data yang Ditambahkan</h3>
          </div>
          <dl className="px-6">
            {/* gunakan data_sesudah lebih dulu, fallback sebelum */}
            {/* ... baris-baris field sama seperti punyamu ... */}
          </dl>
        </div>
      )}

      {riwayatData.jenis_perubahan === "Hapus" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">Data yang Dihapus</h3>
          </div>

          {/* Jika backend menyimpan snapshot sebelum, tampilkan.
              Kalau tidak ada snapshot → tampilkan pesan info */}
          {(() => {
            const b = riwayatData.data_sebelum;
            const hasAny =
              b &&
              (b.nama_pemilik || b.nomor_urut || b.jumlah_luas || b.status_hak_tanah || (b.penggunaan_tanah || []).length || b.keterangan);

            if (!hasAny) {
              return (
                <div className="p-6 text-gray-700">
                  Tidak tersedia snapshot data saat penghapusan.
                </div>
              );
            }

            return (
              <dl className="px-6">
                <div className="grid grid-cols-3 py-3 border-b border-gray-100">
                  <dt className="font-medium text-gray-700">Nama Pemilik</dt>
                  <dd className="col-span-2 text-gray-900">{b?.nama_pemilik ?? "-"}</dd>
                </div>
                <div className="grid grid-cols-3 py-3 border-b border-gray-100">
                  <dt className="font-medium text-gray-700">Nomor Urut</dt>
                  <dd className="col-span-2 text-gray-900">{b?.nomor_urut ?? "-"}</dd>
                </div>
                <div className="grid grid-cols-3 py-3 border-b border-gray-100">
                  <dt className="font-medium text-gray-700">Jumlah Luas (m²)</dt>
                  <dd className="col-span-2 text-gray-900">{b?.jumlah_luas ?? "-"}</dd>
                </div>
                <div className="grid grid-cols-3 py-3 border-b border-gray-100">
                  <dt className="font-medium text-gray-700">Status Hak Tanah</dt>
                  <dd className="col-span-2 text-gray-900">
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold">
                      {b?.status_hak_tanah ?? "-"}
                    </span>
                  </dd>
                </div>
                <div className="grid grid-cols-3 py-3 border-b border-gray-100">
                  <dt className="font-medium text-gray-700">Penggunaan Tanah</dt>
                  <dd className="col-span-2 text-gray-900">
                    {(b?.penggunaan_tanah || []).join(", ") || "-"}
                  </dd>
                </div>
                <div className="grid grid-cols-3 py-3 border-b border-gray-100">
                  <dt className="font-medium text-gray-700">Keterangan</dt>
                  <dd className="col-span-2 text-gray-900">{b?.keterangan ?? "-"}</dd>
                </div>
              </dl>
            );
          })()}
        </div>
      )}


      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
