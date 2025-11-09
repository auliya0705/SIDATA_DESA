// src/app/admin/management-tanah/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import TanahTable from "@/components/admin/TanahTable";
import { apiGet, apiDelete } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import AlertDialog from "@/components/ui/AlertDialog";

export default function ManagementTanahPage() {
  // UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Data states
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  // Dialog states - FIXED: Use function setState
  const [dialogs, setDialogs] = useState({
    deleteConfirm: false,
    deleteSuccess: false,
    deleteError: false,
    exportInfo: false,
  });
  const [dialogMessage, setDialogMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState({ id: null, name: "" });

  // FIXED: Use function setState
  const closeDialog = (dialogName) => {
    setDialogs((prev) => ({ ...prev, [dialogName]: false }));
  };

  // Build query string for backend
  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("page", String(currentPage));
    qs.set("per_page", String(rowsPerPage));
    if (searchQuery?.trim()) qs.set("q", searchQuery.trim());
    if (selectedMonth) qs.set("month", selectedMonth);
    return `?${qs.toString()}`;
  }, [currentPage, rowsPerPage, searchQuery, selectedMonth]);

  // Loader
  const loadList = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiGet(`${API_ENDPOINTS.TANAH.LIST}${queryString}`);
      const mapped = (res?.data ?? []).map((d) => ({
        id: d.id,
        nama_pemilik: d.pemilik_nama ?? d?.pemilik?.nama_lengkap ?? "-",
        total_luas: Number(d.total_luas_m2 ?? d.jumlah_m2_computed ?? 0),
        jumlah_bidang: d.bidang_count ?? 0,
        _raw: d,
      }));

      setRows(mapped);
      setPagination({
        current_page: res.current_page ?? 1,
        last_page: res.last_page ?? 1,
        total: res.total ?? mapped.length,
        per_page: res.per_page ?? rowsPerPage,
      });
    } catch (e) {
      setError(e?.message || "Gagal memuat data");
      setRows([]);
      setPagination({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: rowsPerPage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch list when query changes
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!ignore) await loadList();
    })();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString, rowsPerPage]);

  // Handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleExport = () => {
    setDialogMessage("Fitur ekspor data akan segera tersedia");
    setDialogs((prev) => ({ ...prev, exportInfo: true }));
  };

  const handleDeleteClick = (id) => {
    if (!id) return;
    const row = rows.find((r) => r.id === id);
    setPendingDelete({
      id,
      name: row?.nama_pemilik || "tanah ini",
    });
    setDialogs((prev) => ({ ...prev, deleteConfirm: true }));
  };

  const handleDelete = async () => {
    if (!pendingDelete.id) return;

    try {
      setDeletingId(pendingDelete.id);
      closeDialog("deleteConfirm");

      await apiDelete(`/staff/proposals/tanah/${pendingDelete.id}`);

      setDialogMessage(
        "Proposal hapus tanah berhasil dibuat. Menunggu persetujuan Kepala Desa."
      );
      setDialogs((prev) => ({ ...prev, deleteSuccess: true }));

      await loadList();
    } catch (e) {
      setDialogMessage(e?.message || "Gagal mengajukan hapus tanah.");
      setDialogs((prev) => ({ ...prev, deleteError: true }));
    } finally {
      setDeletingId(null);
      setPendingDelete({ id: null, name: "" });
    }
  };

  const handleMonthFilter = (e) => {
    setSelectedMonth(e.target.value);
    setCurrentPage(1);
  };

  // Render page number chips
  const renderPagination = () => {
    const totalPages = pagination.last_page || 1;
    const cur = pagination.current_page || 1;
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (cur > 3) pages.push("...");
    for (
      let i = Math.max(2, cur - 1);
      i <= Math.min(totalPages - 1, cur + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (cur < totalPages - 2) pages.push("...");
    pages.push(totalPages);
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

  const totalPages = pagination.last_page || 1;

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Data Tanah Desa
            </h2>
            {selectedMonth && (
              <p className="text-sm text-gray-500 mt-1">
                Bulan: {months.find((m) => m.value === selectedMonth)?.label}
              </p>
            )}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>

          {/* Month Filter */}
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-500" />
            <select
              value={selectedMonth}
              onChange={handleMonthFilter}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="search"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleExport}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex-1 md:flex-none"
            >
              <Download size={18} />
              <span>Ekspor Data</span>
            </button>

            <Link
              href="/admin/management-tanah/create"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors flex-1 md:flex-none"
            >
              <Plus size={18} />
              <span>Input Data Tanah</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Memuat data…</div>
        ) : (
          <TanahTable
            data={rows}
            onDelete={handleDeleteClick}
            deletingId={deletingId}
            showIdColumn={false}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Rows per page */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
            </select>
          </div>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={pagination.current_page <= 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>

            {renderPagination().map((page, idx) => (
              <button
                key={`${page}-${idx}`}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={page === "..."}
                className={`px-3 py-1 rounded text-sm ${
                  page === pagination.current_page
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
              disabled={pagination.current_page >= totalPages}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Dialogs */}
      <ConfirmDialog
        isOpen={dialogs.deleteConfirm}
        onClose={() => closeDialog("deleteConfirm")}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus Tanah"
        message={`Yakin ingin mengajukan penghapusan tanah milik ${pendingDelete.name}? Ini akan membuat proposal yang perlu disetujui Kepala Desa.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
      />

      <AlertDialog
        isOpen={dialogs.deleteSuccess}
        onClose={() => closeDialog("deleteSuccess")}
        title="Berhasil!"
        message={dialogMessage}
        type="success"
      />

      <AlertDialog
        isOpen={dialogs.deleteError}
        onClose={() => closeDialog("deleteError")}
        title="Gagal Menghapus"
        message={dialogMessage}
        type="error"
      />

      <AlertDialog
        isOpen={dialogs.exportInfo}
        onClose={() => closeDialog("exportInfo")}
        title="Info"
        message={dialogMessage}
        type="info"
      />
    </div>
  );
}