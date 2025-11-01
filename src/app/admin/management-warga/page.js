"use client";

import { useState, useEffect } from "react";
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

export default function ManagementWargaPage() {
  const router = useRouter();
  const { loading, error, getWargaList, deleteWarga } = useWarga();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [wargaData, setWargaData] = useState([]);
  const [pagination, setPagination] = useState(null);

  // Fetch data on mount and when page changes
  useEffect(() => {
    loadWargaData();
  }, [currentPage, rowsPerPage]);

  const loadWargaData = async () => {
    try {
      const params = {
        page: currentPage,
        per_page: rowsPerPage,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await getWargaList(params);

      // Laravel pagination structure
      setWargaData(response.data || []);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total,
        per_page: response.per_page,
      });
    } catch (err) {
      console.error("Failed to load warga data:", err);
      alert("Gagal memuat data warga: " + err.message);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Reset to page 1 when searching
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadWargaData();
  };

  const handleExport = () => {
    // TODO: Implement export to Excel
    alert("Fitur ekspor data akan segera tersedia");
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data warga ini?")) {
      return;
    }

    try {
      await deleteWarga(id);
      alert("Data warga berhasil dihapus!");
      loadWargaData(); // Reload data
    } catch (err) {
      console.error("Delete error:", err);
      alert("Gagal menghapus data: " + err.message);
    }
  };

  const totalPages = pagination?.last_page || 1;

  const renderPagination = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={loadWargaData}
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
        {pagination && (
          <p className="text-sm text-gray-600 mt-1">
            Total: {pagination.total} warga
          </p>
        )}
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
              onClick={handleExport}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex-1 md:flex-none"
            >
              <Download size={18} />
              <span>Ekspor Data</span>
            </button>

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
      {!loading && <WargaTable data={wargaData} onDelete={handleDelete} />}

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
    </div>
  );
}
