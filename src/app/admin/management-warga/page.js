// src/app/admin/management-warga/page.js
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import WargaTable from "@/components/admin/WargaTable";
import { useWarga } from "@/hooks/useWarga";
import AlertDialog from "@/components/ui/AlertDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { API_ENDPOINTS, getApiUrl } from "@/lib/config";
import { getToken } from "@/lib/auth";

export default function ManagementWargaPage() {
  const router = useRouter();
  const { loading, error, getWargaList, deleteWarga } = useWarga();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [wargaData, setWargaData] = useState([]);
  const [pagination, setPagination] = useState(null);

  // Dialog states - FIXED: Use function setState
  const [dialogs, setDialogs] = useState({
    loadError: false,
    deleteConfirm: false,
    deleteSuccess: false,
    deleteError: false,
    exportInfo: false, // dipakai juga untuk info import
  });
  const [dialogMessage, setDialogMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const didMountRef = useRef(false);
  const importInputRef = useRef(null);

  // FIXED: Use function setState
  const closeDialog = (dialogName) => {
    setDialogs((prev) => ({ ...prev, [dialogName]: false }));
  };

  const loadWargaData = useCallback(
    async ({ page = currentPage, perPage = rowsPerPage, search } = {}) => {
      try {
        const params = {
          page,
          per_page: perPage,
        };
        if (typeof search === "string" && search.trim() !== "") {
          params.search = search.trim();
        }

        const response = await getWargaList(params);

        const rows = (response.data || []).map((row) => {
          const payload =
            typeof row.payload === "string"
              ? (() => {
                  try {
                    return JSON.parse(row.payload);
                  } catch {
                    return null;
                  }
                })()
              : row.payload || null;

          const snap = payload?.snapshot || null;
          const action = row.action || "";

          let nama = row.nama_lengkap ?? "-";
          let nik = row.nik ?? "-";

          if (action === "create") {
            nama = row.nama_lengkap ?? payload?.nama_lengkap ?? "-";
            nik = row.nik ?? payload?.nik ?? "-";
          } else if (action === "delete") {
            nama = row.nama_lengkap ?? snap?.nama_lengkap ?? "-";
            nik = row.nik ?? snap?.nik ?? "-";
          } else if (action === "update") {
            nama =
              row.nama_lengkap ??
              payload?.after?.nama_lengkap ??
              payload?.before?.nama_lengkap ??
              "-";
            nik = row.nik ?? payload?.after?.nik ?? payload?.before?.nik ?? "-";
          } else {
            nama = row.nama_lengkap ?? "-";
            nik = row.nik ?? "-";
          }

          const idForAction = row.target_id ?? row.id;

          return {
            ...row,
            id: idForAction,
            nama_lengkap: nama,
            nik: nik,
          };
        });

        setWargaData(rows);
        setPagination({
          current_page: response.current_page,
          last_page: response.last_page,
          total: response.total,
          per_page: response.per_page,
        });
      } catch (err) {
        console.error("Failed to load warga data:", err);
        setDialogMessage("Gagal memuat data warga: " + err.message);
        setDialogs((prev) => ({ ...prev, loadError: true }));
      }
    },
    [currentPage, rowsPerPage, getWargaList]
  );

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    }
    loadWargaData({
      page: currentPage,
      perPage: rowsPerPage,
      search: searchQuery,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadWargaData({ page: 1, perPage: rowsPerPage, search: searchQuery });
  };

  const handleExport = () => {
    setDialogMessage("Fitur ekspor data akan segera tersedia");
    setDialogs((prev) => ({ ...prev, exportInfo: true }));
  };

  // 🔹 Import CSV Warga (POST /staff/management-warga/import/csv)
  const handleImportClick = () => {
    if (importInputRef.current) {
      importInputRef.current.click();
    }
  };

  const handleImportFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const token = getToken();

      const url = getApiUrl(API_ENDPOINTS.STAFF.PROPOSALS.WARGA.IMPORT);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // jangan set Content-Type, biar browser yang set boundary multipart
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Gagal mengimpor data warga (${res.status}) ${text}`);
      }

      let message = "Impor data warga berhasil.";
      try {
        const json = await res.json();
        if (json?.message) message = json.message;
      } catch {
        // abaikan kalau bukan JSON
      }

      setDialogMessage(message);
      setDialogs((prev) => ({ ...prev, exportInfo: true }));

      // reload list setelah impor
      await loadWargaData({
        page: currentPage,
        perPage: rowsPerPage,
        search: searchQuery,
      });
    } catch (err) {
      console.error("Import Warga error:", err);
      setDialogMessage(err?.message || "Gagal mengimpor data warga.");
      setDialogs((prev) => ({ ...prev, exportInfo: true }));
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = "";
      }
    }
  };

  const handleDeleteClick = (id) => {
    if (!id) {
      setDialogMessage("ID tidak valid.");
      setDialogs((prev) => ({ ...prev, deleteError: true }));
      return;
    }
    setPendingDeleteId(id);
    setDialogs((prev) => ({ ...prev, deleteConfirm: true }));
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;

    closeDialog("deleteConfirm");

    try {
      await deleteWarga(pendingDeleteId);
      setDialogMessage(
        "Proposal hapus berhasil dibuat. Menunggu persetujuan Kepala Desa."
      );
      setDialogs((prev) => ({ ...prev, deleteSuccess: true }));

      // Reload data
      if (wargaData.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        loadWargaData({
          page: currentPage,
          perPage: rowsPerPage,
          search: searchQuery,
        });
      }
    } catch (err) {
      console.error("Delete error:", err);
      setDialogMessage("Gagal menghapus data: " + err.message);
      setDialogs((prev) => ({ ...prev, deleteError: true }));
    } finally {
      setPendingDeleteId(null);
    }
  };

  const totalPages = pagination?.last_page || 1;

  const renderPagination = () => {
    const pages = [];
    pages.push(1);

    if (currentPage > 3) pages.push("...");

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages);

    return pages;
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={() =>
            loadWargaData({
              page: currentPage,
              perPage: rowsPerPage,
              search: searchQuery,
            })
          }
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Data Penduduk Desa
        </h2>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full md:w-96"
          >
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari nama atau NIK..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </form>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleImportClick}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-teal-600 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors flex-1 md:flex-none"
            >
              <Download size={18} />
              <span>Impor CSV</span>
            </button>

            {/* Hidden file input untuk impor warga */}
            <input
              type="file"
              accept=".csv"
              ref={importInputRef}
              onChange={handleImportFileChange}
              className="hidden"
            />

            <Link
              href="/admin/management-warga/create"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors flex-1 md:flex-none"
            >
              <Plus size={18} />
              <span>Tambah Penduduk</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
            <span className="ml-3 text-gray-600">Memuat data...</span>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && <WargaTable data={wargaData} onDelete={handleDeleteClick} />}

      {/* Empty State */}
      {!loading && wargaData.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">Tidak ada data warga</p>
            <p className="text-sm mt-1">
              {searchQuery
                ? "Tidak ditemukan hasil untuk pencarian Anda"
                : "Mulai tambahkan data warga baru"}
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && wargaData.length > 0 && (
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
                <option value={20}>20 rows</option>
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
              </select>
            </div>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>

              {renderPagination().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" && setCurrentPage(page)
                  }
                  disabled={page === "..."}
                  className={`
                    px-3 py-1 rounded text-sm
                    ${
                      page === currentPage
                        ? "bg-teal-700 text-white"
                        : page === "..."
                        ? "cursor-default"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Dialogs */}
      <AlertDialog
        isOpen={dialogs.loadError}
        onClose={() => closeDialog("loadError")}
        title="Error"
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

      <ConfirmDialog
        isOpen={dialogs.deleteConfirm}
        onClose={() => closeDialog("deleteConfirm")}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus"
        message="Yakin ingin menghapus data warga ini? Ini akan membuat proposal penghapusan yang perlu disetujui Kepala Desa."
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
    </div>
  );
}
