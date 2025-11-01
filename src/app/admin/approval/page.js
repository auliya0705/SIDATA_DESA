"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ApprovalTable from "@/components/admin/ApprovalTable";
import { getCurrentUser } from "@/lib/auth";

export default function ApprovalPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDataType, setSelectedDataType] = useState("tanah"); // "tanah" or "warga"
  const [selectedStatus, setSelectedStatus] = useState(""); // "", "Pending", "Approved", "Ditolak"
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Check if user is Kepala Desa
  useEffect(() => {
    const user = getCurrentUser();
    //
    if (!user || (user.role !== "kepala_desa" && user.role !== "kepala")) {
      alert("Halaman ini hanya untuk Kepala Desa");
      router.push("/admin/dashboard");
    }
  }, [router]);

  // Mock data - Tanah
  const mockDataTanah = Array.from({ length: 30 }, (_, i) => ({
    id: `T${i + 1}`,
    id_bidang: "T0023",
    jenis_perubahan: ["Edit luas tanah", "Tambah Data"][i % 2],
    pengaju: `Staff Admin ${(i % 2) + 1}`,
    tanggal_pengajuan: "9 Juli 2025",
    status: ["Pending", "Approved", "Ditolak"][i % 3],
  }));

  // Mock data - Warga
  const mockDataWarga = Array.from({ length: 30 }, (_, i) => ({
    id: `W${i + 1}`,
    nik: "5298372037037",
    nama: "Rafiq Susetya Nugraha",
    jenis_perubahan: ["Tambah Data", "Edit Data"][i % 2],
    pengaju: `Staff Admin ${(i % 2) + 1}`,
    tanggal_pengajuan: "9 Juli 2025",
    status: ["Pending", "Approved", "Ditolak"][i % 3],
  }));

  const currentData =
    selectedDataType === "tanah" ? mockDataTanah : mockDataWarga;

  // Filter by status
  const filteredData = selectedStatus
    ? currentData.filter((item) => item.status === selectedStatus)
    : currentData;

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Calculate stats
  const countPending = currentData.filter((d) => d.status === "Pending").length;
  const countApproved = currentData.filter(
    (d) => d.status === "Approved"
  ).length;
  const countDitolak = currentData.filter((d) => d.status === "Ditolak").length;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search functionality
  };

  const handleApprove = (id) => {
    if (confirm("Yakin ingin menyetujui pengajuan ini?")) {
      // TODO: Implement approve API call
      console.log("Approve ID:", id);
      alert("Data berhasil disetujui!");
    }
  };

  const handleReject = (id) => {
    const reason = prompt("Alasan penolakan:");
    if (reason) {
      // TODO: Implement reject API call
      console.log("Reject ID:", id, "Reason:", reason);
      alert("Data berhasil ditolak!");
    }
  };

  const handleViewDetail = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
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

  // Prevent access if not Kepala Desa
  const user = getCurrentUser();
  if (!user || (user.role !== "kepala_desa" && user.role !== "kepala")) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⛔</div>
          <p className="text-gray-700 font-semibold">Akses Ditolak</p>
          <p className="text-gray-500 text-sm">
            Halaman ini hanya untuk Kepala Desa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Menunggu Persetujuan</p>
              <p className="text-3xl font-bold text-yellow-600">
                {countPending}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Disetujui</p>
              <p className="text-3xl font-bold text-green-600">
                {countApproved}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ditolak</p>
              <p className="text-3xl font-bold text-red-600">{countDitolak}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Title Section with Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Approval Data</h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Data Type Filter */}
            <select
              value={selectedDataType}
              onChange={(e) => {
                setSelectedDataType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            >
              <option value="tanah">Data Tanah</option>
              <option value="warga">Data Warga</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            >
              <option value="">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Ditolak">Ditolak</option>
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
        </div>
      </div>

      {/* Table */}
      <ApprovalTable
        data={paginatedData}
        dataType={selectedDataType}
        onApprove={handleApprove}
        onReject={handleReject}
        onViewDetail={handleViewDetail}
      />

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
            >
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
            </select>
          </div>

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
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Kembali
        </button>
      </div>

      {/* Detail Modal - Simple for now */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Detail Pengajuan
            </h3>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(selectedItem, null, 2)}
            </pre>
            <div className="mt-6 flex justify-end space-x-3">
              {selectedItem.status === "Pending" && (
                <>
                  <button
                    onClick={() => {
                      handleReject(selectedItem.id);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedItem.id);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
