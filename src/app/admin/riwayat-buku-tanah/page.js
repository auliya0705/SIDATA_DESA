"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash,
  Layers,
} from "lucide-react";
import RiwayatTable from "@/components/admin/RiwayatTable";
import { useAudit } from "@/hooks/useAudit";

export default function RiwayatBukuTanahPage() {
  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [selectedMonth, setSelectedMonth] = useState("");   // "01".."12" | ""
  const [selectedYear, setSelectedYear] = useState(         // ← NEW: kirim bareng month
    String(new Date().getFullYear())
  );
  const [selectedJenis, setSelectedJenis] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedModule, setSelectedModule] = useState(""); // warga|tanah|bidang|""

  const { loading, error, result, fetchAudit } = useAudit();

  const actionMap = {
    "": "",
    Tambah: "create",
    Edit: "update",
    Hapus: "delete",
  };

  // Fetch ke API setiap filter berubah
  useEffect(() => {
    const action = actionMap[selectedJenis] || "";

    const filters = {
      q: searchQuery || "",
      action,
      status: selectedStatus || "",
      module: selectedModule || "",
    };

    // Kirim month+year hanya bila month dipilih
    if (selectedMonth) {
      filters.month = selectedMonth;
      filters.year = selectedYear; // penting
    }

    fetchAudit({ page: currentPage, perPage: rowsPerPage, filters }).catch(() => {});
  }, [
    searchQuery,
    selectedMonth,
    selectedYear,  // ← NEW
    selectedJenis,
    selectedStatus,
    selectedModule,
    currentPage,
    rowsPerPage,
  ]); // eslint-disable-line

  const countTambah = result?.stats?.by_action?.create ?? 0;
  const countEdit   = result?.stats?.by_action?.update ?? 0;
  const countHapus  = result?.stats?.by_action?.delete ?? 0;
  const totalItems  = result?.pagination?.total ?? 0;
  const totalPages  = result?.pagination?.last_page ?? 1;

  // Data untuk tabel (tambah column module)
  const tableData = useMemo(() => {
    const items = result?.data ?? [];
    return items.map((it) => ({
      id: it.id,
      module: it.module,
      nama: it.submitted_by?.name ?? "-",
      tanggal: new Date(it.submitted_at).toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "medium",
      }),
      jenis_perubahan: it.jenis_perubahan,
      _raw: it,
    }));
  }, [result]);

  // Handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handleExport = () => {
    alert("Fitur ekspor riwayat akan segera tersedia");
  };
  const handleDelete = (id) => {
    console.log("Delete ID:", id);
  };
  const handleMonthFilter = (e) => {
    setSelectedMonth(e.target.value);
    setCurrentPage(1);
  };
  const handleYearFilter = (e) => {   // ← NEW
    setSelectedYear(e.target.value);
    setCurrentPage(1);
  };
  const handleJenisFilter = (e) => {
    setSelectedJenis(e.target.value);
    setCurrentPage(1);
  };
  const handleStatusFilter = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };
  const handleModuleFilter = (e) => {
    setSelectedModule(e.target.value);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const pages = [];
    const cp = currentPage;
    pages.push(1);
    if (cp > 3) pages.push("...");
    for (let i = Math.max(2, cp - 1); i <= Math.min(totalPages - 1, cp + 1); i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (cp < totalPages - 2) pages.push("...");
    if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages);
    return pages;
  };

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

  // Tahun: range (currentYear-3 .. currentYear+1)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 3 + i);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tambah</p>
              <p className="text-3xl font-bold text-green-600">{countTambah}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Plus className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Edit</p>
              <p className="text-3xl font-bold text-blue-600">{countEdit}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Pencil className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Hapus</p>
              <p className="text-3xl font-bold text-red-600">{countHapus}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Trash className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Title & Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Riwayat</h2>
            <p className="text-sm text-gray-600">
              *Total {totalItems} perubahan ({countTambah} Tambah, {countEdit} Edit, {countHapus} Hapus)
            </p>
            {error && <p className="text-sm text-red-600 mt-1">Error: {error}</p>}
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Month + Year */}
            <div className="flex items-center gap-2 min-w-[180px]">
              <Calendar size={20} className="text-gray-500" />
              <select
                value={selectedMonth}
                onChange={handleMonthFilter}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                disabled={loading}
                title="Bulan"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              {/* Tahun hanya aktif saat bulan dipilih */}
              <select
                value={selectedYear}
                onChange={handleYearFilter}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm disabled:bg-gray-100"
                disabled={loading || !selectedMonth}
                title="Tahun"
              >
                {years.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Jenis */}
            <select
              value={selectedJenis}
              onChange={handleJenisFilter}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              disabled={loading}
            >
              <option value="">Semua Jenis</option>
              <option value="Tambah">Tambah</option>
              <option value="Edit">Edit</option>
              <option value="Hapus">Hapus</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={handleStatusFilter}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              disabled={loading}
            >
              <option value="">Semua Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>

            {/* Modul */}
            <div className="flex items-center gap-2">
              <Layers size={20} className="text-gray-500" />
              <select
                value={selectedModule}
                onChange={handleModuleFilter}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                disabled={loading}
              >
                <option value="">Semua Jenis Data</option>
                <option value="warga">Warga</option>
                <option value="tanah">Tanah</option>
                <option value="bidang">Bidang</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="search"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleExport}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full md:w-auto"
            disabled={loading}
          >
            <Download size={18} />
            <span>Ekspor Riwayat</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <RiwayatTable data={tableData} loading={loading} />

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={loading}
            >
              <option value={12}>12 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={loading || currentPage === 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>

            {renderPagination().map((page, idx) => (
              <button
                key={idx}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={loading || page === "..."}
                className={`px-3 py-1 rounded text-sm ${
                  page === currentPage
                    ? "bg-teal-700 text-white"
                    : page === "..."
                    ? "cursor-default"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={loading || currentPage === totalPages}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="flex justify-end">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
