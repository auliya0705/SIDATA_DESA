// src/app/admin/riwayat-buku-tanah/page.js
"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Layers,
  Eye,
  Plus,
  Pencil,
  Trash,
} from "lucide-react";
import { useAuditKepala } from "@/hooks/useAudit";

// ⬇️ Tambah: Poppins lokal hanya untuk halaman ini
import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const jenisFromAction = (a = "") =>
  a === "create"
    ? "Tambah"
    : a === "update"
    ? "Edit"
    : a === "delete"
    ? "Hapus"
    : a || "-";

const formatTanggal = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const tgl = d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const jam = d
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(/:/g, ".");
  return `${tgl} || ${jam}`;
};

export default function RiwayatBukuTanahKepalaPage() {
  // === filters ===
  const [qInput, setQInput] = useState(""); // ketik di input
  const [query, setQuery] = useState(""); // dipakai fetch
  const [module, setModule] = useState("");
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));

  // === paging ===
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { loading, error, result, fetchAudit } = useAuditKepala();

  // rakit filters (pakai query, bukan qInput)
  const buildFilters = useCallback(() => {
    const f = { q: query, module, status };
    if (month) {
      f.month = month;
      f.year = year;
    }
    return f;
  }, [query, module, status, month, year]);

  const runFetch = useCallback(() => {
    fetchAudit({ page, perPage, filters: buildFilters() }).catch(() => {});
  }, [fetchAudit, page, perPage, buildFilters]);

  // initial + saat filter (kecuali qInput) berubah
  useEffect(() => {
    runFetch();
  }, [runFetch]);

  // search button / Enter: commit qInput -> query
  const onSearch = () => {
    setPage(1);
    setQuery(qInput.trim());
  };

  // ===== stat dari summary server (bukan pagination) =====
  const totalAll = result?.stats?.total ?? 0;
  const countTambah = result?.stats?.by_action?.create ?? 0;
  const countEdit = result?.stats?.by_action?.update ?? 0;
  const countHapus = result?.stats?.by_action?.delete ?? 0;
  const totalPages = result?.pagination?.last_page ?? 1;
  const fromIndex = result?.pagination?.from ?? 1;

  const rows = useMemo(() => {
    const items = result?.data ?? [];
    return items.map((it, idx) => ({
      no: fromIndex + idx,
      id: it.id,
      module: it.module,
      nama: it.submitted_by?.name ?? it.pemilik_name ?? "-",
      tanggal: formatTanggal(it.submitted_at ?? it.created_at),
      jenis: jenisFromAction(it.action),
      status: it.status,
    }));
  }, [result, fromIndex]);

  const months = [
    { value: "", label: "Semua Bulan" },
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];
  const thisYear = new Date().getFullYear();
  const years = [thisYear - 1, thisYear, thisYear + 1].map(String);

  const badgeJenis = (j) =>
    j === "Tambah"
      ? "bg-emerald-50 text-emerald-700"
      : j === "Edit"
      ? "bg-blue-50 text-blue-700"
      : j === "Hapus"
      ? "bg-rose-50 text-rose-700"
      : "bg-gray-50 text-gray-700";
  const badgeStatus = (s) =>
    s === "approved"
      ? "bg-emerald-50 text-emerald-700"
      : s === "rejected"
      ? "bg-rose-50 text-rose-700"
      : "bg-amber-50 text-amber-800";

  return (
    // ⬇️ Wrapper Poppins + aturan global untuk form controls
    <div className={`${poppins.variable} space-y-6`}>
      <style jsx global>{`
        select,
        option,
        input,
        textarea,
        button {
          font-family: var(--font-poppins), ui-sans-serif, system-ui,
            -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial,
            "Noto Sans", "Liberation Sans", sans-serif !important;
        }
      `}</style>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tambah</p>
              <p className="text-4xl font-bold text-emerald-600 mt-1">
                {countTambah}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Plus className="text-emerald-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Edit</p>
              <p className="text-4xl font-bold text-blue-600 mt-1">
                {countEdit}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Pencil className="text-blue-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hapus</p>
              <p className="text-4xl font-bold text-rose-600 mt-1">
                {countHapus}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
              <Trash className="text-rose-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Card: Riwayat Data (filters kanan) */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-gray-800">Filter Data</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:ml-auto md:justify-end">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-gray-500" />
              <select
                value={module}
                onChange={(e) => {
                  setModule(e.target.value);
                  setPage(1);
                }}
                className="min-w-[160px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                disabled={loading}
                title="Modul"
              >
                <option value="">Semua Modul</option>
                <option value="warga">Data Warga</option>
                <option value="tanah">Data Tanah</option>
                <option value="bidang">Data Bidang</option>
              </select>
            </div>

            {/* FIXED: No Pending - only Approved & Rejected */}
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="min-w-[160px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
              disabled={loading}
              title="Status"
            >
              <option value="">Semua Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <select
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setPage(1);
                }}
                className="min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                disabled={loading}
                title="Bulan"
              >
                {months.map((m, idx) => (
                  <option key={`${m.value || "all"}-${idx}`} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setPage(1);
              }}
              className="min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100"
              disabled={loading || !month}
              title="Tahun"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Card: Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, keterangan…"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSearch}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              disabled={loading}
              title="Search"
            >
              <Search size={16} />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
        <table className="min-w-full">
          <thead className="bg-teal-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Modul
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Nama/Keterangan
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Jenis Perubahan
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Tanggal Pengajuan
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm">{r.no}</td>
                <td className="px-6 py-3 text-sm">Data {r.module}</td>
                <td className="px-6 py-3 text-sm">{r.nama}</td>
                <td className="px-6 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeJenis(
                      r.jenis
                    )}`}
                  >
                    {r.jenis}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">{r.tanggal}</td>
                <td className="px-6 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeStatus(
                      r.status
                    )}`}
                  >
                    {r.status === "approved"
                      ? "Approved"
                      : r.status === "rejected"
                      ? "Rejected"
                      : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">
                  <Link
                    href={`/admin/riwayat-buku-tanah/detail/${r.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Eye size={16} />
                    <span>Lihat</span>
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-6 text-center text-sm text-gray-500"
                >
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer + Pagination */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Show:{" "}
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="ml-1 px-2 py-1 border border-gray-300 rounded"
              disabled={loading}
            >
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
            </select>
            <span className="ml-2">| Total: {totalAll} data</span>
            {error && (
              <span className="ml-3 text-rose-600">Error: {String(error)}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={loading || page === 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
              title="Prev"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-gray-600">
              Halaman {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={loading || page === totalPages}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
              title="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
