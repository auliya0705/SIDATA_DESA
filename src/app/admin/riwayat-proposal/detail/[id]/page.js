// src/app/admin/riwayat-proposal/detail/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, User } from "lucide-react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";

/* ========== Helpers UI ========== */
const jenisFromAction = (action = "") => {
  const v = action.toLowerCase();
  if (v === "create") return "Tambah";
  if (v === "update") return "Edit";
  if (v === "delete") return "Hapus";
  return action || "-";
};

const badgeJenis = (j) =>
  j === "Tambah" ? "bg-emerald-50 text-emerald-700"
  : j === "Edit" ? "bg-blue-50 text-blue-700"
  : j === "Hapus" ? "bg-rose-50 text-rose-700"
  : "bg-gray-50 text-gray-700";

const badgeStatus = (s = "") => {
  const v = s.toLowerCase();
  if (v === "approved") return "bg-emerald-50 text-emerald-700";
  if (v === "rejected") return "bg-rose-50 text-rose-700";
  if (v === "pending")  return "bg-amber-50 text-amber-800";
  return "bg-gray-50 text-gray-700";
};

const formatTanggalWaktu = (iso) => {
  if (!iso) return { tanggal: "-", waktu: "-" };
  const d = new Date(iso);
  return {
    tanggal: d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    waktu: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/:/g, "."),
  };
};

const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)));

/* ========== Normalisasi payload → {before, after} yang datar ========== */
function normalizePayloadForUI(res) {
  const p = res?.payload || {};
  const mod = (res?.module || "").toLowerCase();
  const act = (res?.action || "").toLowerCase();

  const mapWarga = (raw = {}) => ({
    nama_pemilik: raw.nama_lengkap ?? raw.nama ?? null,
    nomor_urut: null,
    jumlah_luas: null,
    status_hak_tanah: null,
    penggunaan_tanah: [],
    keterangan: raw.keterangan ?? null,
  });

  const mapBidang = (raw = {}) => ({
    nama_pemilik: raw.preview_pemilik?.nama ?? raw.nama_pemilik ?? raw.warga_nama ?? null,
    nomor_urut:   raw.preview_pemilik?.nomor_urut ?? raw.nomor_urut ?? null,
    jumlah_luas:  raw.luas_m2 != null ? String(raw.luas_m2) : (raw.luas != null ? String(raw.luas) : null),
    status_hak_tanah: raw.status_hak ?? null,
    penggunaan_tanah: Array.isArray(raw.penggunaan_tanah) ? raw.penggunaan_tanah : (raw.penggunaan ? [raw.penggunaan] : []),
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
      jumlah_luas:
        totalLuas || raw.luas_total || raw.jumlah_luas || raw.jumlah_m2
          ? String(totalLuas || raw.luas_total || raw.jumlah_luas || raw.jumlah_m2)
          : null,
      status_hak_tanah:
        statuses.length === 1 ? statuses[0] : (statuses.length > 1 ? "CAMPURAN" : (raw.status_hak_tanah ?? null)),
      penggunaan_tanah:
        uses.length ? uses : (Array.isArray(raw.penggunaan_tanah) ? raw.penggunaan_tanah : (raw.penggunaan ? [raw.penggunaan] : [])),
      keterangan: raw.keterangan ?? null,
    };
  };

  const applyMap = (x) =>
    !x ? null :
    mod === "tanah"  ? mapTanah(x)  :
    mod === "bidang" ? mapBidang(x) :
    mod === "warga"  ? mapWarga(x)  : x;

  // banyak backend pakai berbagai nama kunci
  let before = p.payload_before ?? p.before ?? p.old ?? p.previous ?? p.prev ?? null;
  let after  = p.payload_after  ?? p.after  ?? p.new ?? p.current  ?? p.next ?? null;

  // DELETE kadang hanya mengirim snapshot di after
  if (act === "delete" && after && !before) {
    before = after;
    after = null;
  }

  if (before || after) {
    return { before: applyMap(before), after: applyMap(after) };
  }

  // snapshot polos
  const snapshot =
    mod === "tanah"  ? mapTanah(p)  :
    mod === "bidang" ? mapBidang(p) :
    mod === "warga"  ? mapWarga(p)  : p;

  if (act === "create") return { before: null, after: snapshot };
  if (act === "delete") return { before: snapshot, after: null };
  // update tanpa before
  return { before: null, after: snapshot };
}

/* ========== Compare Row (merah/hijau bila beda) ========== */
function CompareRow({ label, before, after }) {
  const left  = Array.isArray(before) ? before.join(", ") : (before ?? "-");
  const right = Array.isArray(after)  ? after.join(", ")  : (after  ?? "-");
  const isDifferent = JSON.stringify(left) !== JSON.stringify(right);
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
      <div className="font-medium text-gray-700">{label}</div>
      <div className={isDifferent ? "bg-rose-50 p-2 rounded" : ""}>
        <p className="text-sm text-gray-900">{left}</p>
      </div>
      <div className={isDifferent ? "bg-emerald-50 p-2 rounded" : ""}>
        <p className="text-sm text-gray-900">{right}</p>
      </div>
    </div>
  );
}

/* ========== Page ========== */
export default function DetailRiwayatProposalPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // field yang ditampilkan/dibandingkan
  const FIELDS = [
    { key: "nama_pemilik",     label: "Nama Pemilik" },
    { key: "nomor_urut",       label: "Nomor Urut" },
    { key: "jumlah_luas",      label: "Jumlah Luas (m²)" },
    { key: "status_hak_tanah", label: "Status Hak Tanah" },
    { key: "penggunaan_tanah", label: "Penggunaan Tanah" },
    { key: "keterangan",       label: "Keterangan" },
  ];

  useEffect(() => {
  let alive = true;

  const getCurrentRole = () => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw)?.role || null : null;
    } catch {
      return null;
    }
  };

  (async () => {
    setLoading(true);
    try {
      const role = getCurrentRole();
      const isKepala = role === "kepala_desa";

      // Pilih endpoint sesuai role (kepala ↔︎ staff)
      const base1 = isKepala
        ? API_ENDPOINTS.PROPOSAL.SHOW(id)              // /kepala/approvals/{id}
        : API_ENDPOINTS.STAFF.PROPOSALS.SHOW(id);      // /staff/proposals/{id}

      const base2 = isKepala
        ? API_ENDPOINTS.STAFF.PROPOSALS.SHOW(id)       // fallback kalau 401/403
        : API_ENDPOINTS.PROPOSAL.SHOW(id);

      const urlWithQuery = (base) => `${base}?include_payload=1`;

      let res;
      try {
        res = await apiGet(urlWithQuery(base1));
      } catch (err) {
        // Jika unauthorized/forbidden di endpoint pertama, coba endpoint alternatif
        if (err?.status === 401 || err?.status === 403) {
          res = await apiGet(urlWithQuery(base2));
        } else {
          throw err;
        }
      }

      // ====== lanjut mapping persis seperti sebelumnya ======
      const submittedAt = res?.submitted_at || res?.created_at || res?.reviewed_at;
      const d = submittedAt ? new Date(submittedAt) : null;
      const tanggal = d
        ? d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
        : "-";
      const waktu = d
        ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/:/g, ".")
        : "-";

      const { before, after } = normalizePayloadForUI(res);

      const mapped = {
        id: res?.id ?? id,
        module: res?.module,
        jenis_perubahan: jenisFromAction(res?.action),
        status: res?.status ?? "",
        tanggal,
        waktu,
        admin: res?.reviewed_by?.name ?? res?.submitted_by?.name ?? "-",
        role_admin: res?.reviewed_by?.name ? "Kepala Desa" : "Pengaju",
        keterangan: res?.review_note || "",
        data_sebelum: before,
        data_sesudah: after,
        title: res?.submitted_by?.name ?? `${res?.module ?? "-"} (${res?.action ?? "-"})`,
      };

      if (alive) setData(mapped);
    } catch (e) {
      console.error("❌ API Error:", e?.message || String(e), e);
      if (alive) setData(null);
    } finally {
      if (alive) setLoading(false);
    }
  })();

  return () => {
    alive = false;
  };
}, [id]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Detail Proposal</h1>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600">Data tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  const isEdit = data.jenis_perubahan === "Edit";
  const hasBefore = !!data.data_sebelum && Object.values(data.data_sebelum).some(v => (Array.isArray(v) ? v.length : (v ?? "") !== ""));
  const hasAfter  = !!data.data_sesudah && Object.values(data.data_sesudah).some(v => (Array.isArray(v) ? v.length : (v ?? "") !== ""));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Detail Proposal</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-800 mr-2">{data.title}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeJenis(data.jenis_perubahan)}`}>
                {data.jenis_perubahan}
              </span>
              {!!data.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStatus(data.status)}`}>
                  {data.status}
                </span>
              )}
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{data.tanggal} || {data.waktu}</span>
              </div>
              {data.admin && (
                <div className="flex items-center gap-2">
                 
                </div>
              )}
              {!!data.keterangan && (
                <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-3 text-rose-800">
                  <div className="text-xs font-semibold mb-1">Catatan Review</div>
                  <pre className="whitespace-pre-wrap text-xs">{data.keterangan}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === MODE EDIT === */}
      {isEdit && (
        <>
          {/* B1. Before & After → tabel pembanding seperti di Riwayat Buku Tanah */}
          {hasBefore && hasAfter && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-teal-700 text-white px-6 py-3">
                <h3 className="text-lg font-semibold">Perbandingan Data</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 pb-3 border-b-2 border-gray-200 mb-3">
                  <div className="font-bold text-gray-700">Field</div>
                  <div className="font-bold text-rose-700">Data Sebelum</div>
                  <div className="font-bold text-emerald-700">Data Sesudah</div>
                </div>

                {FIELDS.map(({ key, label }) => (
                  <CompareRow
                    key={key}
                    label={label}
                    before={data.data_sebelum?.[key]}
                    after={data.data_sesudah?.[key]}
                  />
                ))}
              </div>
              <div className="bg-gray-50 px-6 py-3 text-sm text-gray-600">
                💡 <strong>Tip:</strong> sel yang berubah di-highlight merah (sebelum) & hijau (sesudah).
              </div>
            </div>
          )}

          {/* B2. Hanya AFTER (backend tak simpan before) → panel ringkasan sesudah */}
          {!hasBefore && hasAfter && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-teal-700 text-white px-6 py-3">
                <h3 className="text-lg font-semibold">Perubahan (Sesudah)</h3>
              </div>
              <dl className="px-6">
                {FIELDS.map(({ key, label }) => (
                  <div key={key} className="grid grid-cols-3 py-3 border-b border-gray-100">
                    <dt className="font-medium text-gray-700">{label}</dt>
                    <dd className="col-span-2 text-gray-900">
                      {Array.isArray(data.data_sesudah?.[key])
                        ? (data.data_sesudah?.[key]?.length ? data.data_sesudah[key].join(", ") : "-")
                        : (data.data_sesudah?.[key] ?? "-")}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* B3. Tidak ada AFTER → tidak ada perubahan berarti */}
          {!hasAfter && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-700">Tidak ada yang diubah pada riwayat ini.</p>
            </div>
          )}
        </>
      )}

      {/* === MODE TAMBAH / HAPUS === */}
      {data.jenis_perubahan !== "Edit" && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-3">
            <h3 className="text-lg font-semibold">
              {data.jenis_perubahan === "Tambah" ? "Data yang Ditambahkan" : "Data yang Dihapus"}
            </h3>
          </div>
          <dl className="px-6">
            {FIELDS.map(({ key, label }) => {
              const val = data.jenis_perubahan === "Tambah"
                ? (data.data_sesudah?.[key] ?? data.data_sebelum?.[key])
                : (data.data_sebelum?.[key] ?? data.data_sesudah?.[key]);
              const rendered = Array.isArray(val) ? (val.length ? val.join(", ") : "-") : (val ?? "-");
              return (
                <div key={key} className="grid grid-cols-3 py-3 border-b border-gray-100">
                  <dt className="font-medium text-gray-700">{label}</dt>
                  <dd className="col-span-2 text-gray-900">
                    {key === "status_hak_tanah"
                      ? <span className="px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-sm font-semibold">{rendered}</span>
                      : rendered}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
