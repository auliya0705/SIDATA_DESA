"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash,
} from "lucide-react";
import RiwayatTable from "@/components/admin/RiwayatTable";

export default function RiwayatBukuTanahPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMonth, setSelectedMonth] = useState("09"); // September
  const [selectedJenis, setSelectedJenis] = useState(""); // Filter jenis perubahan

  // Mock data
  const mockData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    nama: "Muhammad Vendra Hastagiyan",
    tanggal: "2 September 2025 || 14:58:01",
    jenis_perubahan: ["Tambah", "Edit", "Hapus"][i % 3],
  }));

  const totalPages = Math.ceil(mockData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = mockData.slice(startIndex, endIndex);

  // Calculate stats
  const countTambah = mockData.filter(
    (d) => d.jenis_perubahan === "Tambah"
  ).length;
  const countEdit = mockData.filter((d) => d.jenis_perubahan === "Edit").length;
  const countHapus = mockData.filter(
    (d) => d.jenis_perubahan === "Hapus"
  ).length;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search functionality
  };

  const handleExport = () => {
    // TODO: Implement export to Excel
    alert("Fitur ekspor riwayat akan segera tersedia");
  };

  const handleDelete = (id) => {
    // TODO: Implement delete functionality
    console.log("Delete ID:", id);
  };

  const handleMonthFilter = (e) => {
    setSelectedMonth(e.target.value);
    // TODO: Implement month filter
  };

  const handleJenisFilter = (e) => {
    setSelectedJenis(e.target.value);
    // TODO: Implement jenis filter
  };

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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
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

      {/* Title Section with Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Riwayat
            </h2>
            <p className="text-sm text-gray-600">
              *Total {mockData.length} perubahan pada bulan{" "}
              {months.find((m) => m.value === selectedMonth)?.label || "Semua"}{" "}
              ({countTambah} Tambah, {countEdit} Edit, {countHapus} Hapus)
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Month Filter */}
            <div className="flex items-center space-x-2 min-w-[180px]">
              <Calendar size={20} className="text-gray-500" />
              <select
                value={selectedMonth}
                onChange={handleMonthFilter}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Jenis Filter */}
            <select
              value={selectedJenis}
              onChange={handleJenisFilter}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            >
              <option value="">Semua Jenis</option>
              <option value="Tambah">Tambah</option>
              <option value="Edit">Edit</option>
              <option value="Hapus">Hapus</option>
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

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full md:w-auto"
          >
            <Download size={18} />
            <span>Ekspor Riwayat</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <RiwayatTable data={currentData} onDelete={handleDelete} />

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
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>

            {renderPagination().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
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

      {/* Button Kembali */}
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
