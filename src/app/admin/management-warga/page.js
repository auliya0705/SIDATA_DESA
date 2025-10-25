"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import WargaTable from "@/components/admin/WargaTable";

export default function ManagementWargaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data - nanti ganti dengan data dari API
  const mockData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    nama: "Muhammad Vendra Hastagiyan",
    gender: "L",
    status: "Menikah",
    tempat_lahir: "Semarang",
    tanggal_lahir: "11-02-2005",
    agama: "Islam",
    pendidikan: "S1",
    pekerjaan: "Mahasiswa",
    wni: "Ya",
    kedudukan: "Kepala Keluarga",
    nomor_ktp: "3300000070000000",
  }));

  const totalPages = Math.ceil(mockData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = mockData.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search functionality
  };

  const handleExport = () => {
    // TODO: Implement export to Excel
    alert("Fitur ekspor data akan segera tersedia");
  };

  const handleDelete = (id) => {
    // TODO: Implement delete functionality
    console.log("Delete ID:", id);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Management Warga</h1>
        <p className="text-sm text-gray-500">Dashboard / Management Warga</p>
      </div>

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
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search"
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
              href="/admin/management-warga/create"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors flex-1 md:flex-none"
            >
              <Plus size={18} />
              <span>Tambah Penduduk</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <WargaTable data={currentData} onDelete={handleDelete} />

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
    </div>
  );
}
