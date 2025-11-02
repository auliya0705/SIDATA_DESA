// src/app/admin/approval/page.js
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
  AlertCircle,
  Loader2,
} from "lucide-react";
import ApprovalTable from "@/components/admin/ApprovalTable";
import { getCurrentUser } from "@/lib/auth";
import { useProposal } from "@/hooks/useProposal";
import { useWarga } from "@/hooks/useWarga"; // preflight NIK + ambil BEFORE warga

export default function ApprovalPage() {
  const router = useRouter();
  const { loading, error, getProposalList, approveProposal, rejectProposal } = useProposal();
  const { checkNikUnique, getWargaById } = useWarga();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedModule, setSelectedModule] = useState(""); // "", "warga", "tanah", "bidang"
  const [selectedStatus, setSelectedStatus] = useState(""); // "", "pending", "approved", "rejected"
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data from API
  const [proposals, setProposals] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // ---- helper: parse payload kalau bentuknya string
  const parseMaybeJson = (v) => {
    if (typeof v !== "string") return v;
    try {
      return JSON.parse(v);
    } catch {
      return null;
    }
  };

  // Ambil NIK & ignoreId dari row proposal (versi robust)
  const pickNikAndIgnoreId = (row) => {
    const payload = parseMaybeJson(row?.payload) ?? row?.payload ?? {};
    const action = String(row?.action || "").toLowerCase();

    const before   = payload?.before ?? null;
    const after    = payload?.after ?? null;
    const snapshot = payload?.snapshot ?? null;

    let nikProposed = null;
    let ignoreId    = null;

    if (action === "update") {
      // NIK yang akan dipakai setelah update (fallback ke before/payload/row)
      nikProposed = after?.nik ?? payload?.nik ?? before?.nik ?? row?.nik ?? null;
      // ID record yang sedang diubah → PRIORITAS ke before.id
      ignoreId    = before?.id ?? payload?.id ?? row?.target_id ?? row?.id ?? null;
    } else if (action === "create") {
      nikProposed = payload?.nik ?? row?.nik ?? null;
      ignoreId    = null;
    } else if (action === "delete") {
      nikProposed = snapshot?.nik ?? row?.nik ?? null;
      ignoreId    = snapshot?.id ?? row?.target_id ?? row?.id ?? null;
    } else {
      nikProposed = payload?.nik ?? row?.nik ?? null;
      ignoreId    = row?.target_id ?? row?.id ?? null;
    }

    return { nikProposed, ignoreId };
  };

  // Check if user is Kepala Desa
  useEffect(() => {
    const user = getCurrentUser();
    if (!user || (user.role !== "kepala_desa" && user.role !== "kepala")) {
      alert("Halaman ini hanya untuk Kepala Desa");
      router.push("/admin/dashboard");
    }
  }, [router]);

  // Fetch proposals when filters change
  useEffect(() => {
    fetchProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage, selectedModule, selectedStatus, searchQuery]);

  const fetchProposals = async () => {
    try {
      setIsRefreshing(true);

      const params = {
        page: currentPage,
        per_page: rowsPerPage,
      };

      // Add filters
      if (selectedModule) params.module = selectedModule;
      if (selectedStatus) params.status = selectedStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await getProposalList(params);
      const rows = response?.data ?? [];

      // 1) Siapkan "before map" untuk warga/update
      const wargaUpdateRows = rows.filter(
        (r) => r.module === "warga" && r.action === "update" && r.target_id
      );

      const beforeMap = {};
      await Promise.all(
        wargaUpdateRows.map(async (r) => {
          try {
            const before = await getWargaById(r.target_id);
            beforeMap[r.target_id] = before || null;
          } catch (_) {
            beforeMap[r.target_id] = null;
          }
        })
      );

      // 2) Normalisasi + bentuk display untuk nik/nama
      const normalized = rows.map((row) => {
        const payload = parseMaybeJson(row.payload) ?? row.payload ?? {};
        const snap = payload?.snapshot ?? null;

        let nik = row.nik ?? null;
        let nama = row.nama_lengkap ?? null;

        // Base new values (sesudah apply) dari payload — khusus warga/update payload = delta fields
        const newNik = payload?.nik ?? null;
        const newNama = payload?.nama_lengkap ?? null;

        if (row.module === "warga" && row.action === "update") {
          const before = beforeMap[row.target_id] || {};
          const oldNik = before?.nik ?? null;
          const oldNama = before?.nama_lengkap ?? null;

          // Tentukan display "old → new" jika berubah; fallback kalau tidak ada perubahan
          const display_nik =
            newNik && oldNik && String(newNik) !== String(oldNik)
              ? `${oldNik} → ${newNik}`
              : (newNik ?? oldNik ?? "-");

          const display_nama =
            newNama && oldNama && String(newNama) !== String(oldNama)
              ? `${oldNama} → ${newNama}`
              : (newNama ?? oldNama ?? "-");

          // isi nik/nama standar untuk tabel juga (biar konsisten)
          nik = display_nik;
          nama = display_nama;

          return {
            ...row,
            _before: before,          // simpan untuk modal detail
            _after: payload || {},    // delta
            nik: nik ?? "-",
            nama_lengkap: nama ?? "-",
            display_nik: nik ?? "-",
            display_nama: nama ?? "-",
            id: row.id,
          };
        }

        // Default behavior (create/delete/others)
        switch (row.action) {
          case "create":
            nik = nik ?? payload?.nik ?? null;
            nama = nama ?? payload?.nama_lengkap ?? null;
            break;
          case "update":
            // kalau bukan warga (mis. tanah/bidang) masih pakai after/before jika ada
            nik = nik ?? payload?.after?.nik ?? payload?.before?.nik ?? newNik ?? null;
            nama =
              nama ??
              payload?.after?.nama_lengkap ??
              payload?.before?.nama_lengkap ??
              newNama ??
              null;
            break;
          case "delete":
            nik = nik ?? snap?.nik ?? null;
            nama = nama ?? snap?.nama_lengkap ?? null;
            break;
        }

        return {
          ...row,
          nik: nik ?? "-",
          nama_lengkap: nama ?? "-",
          display_nik: nik ?? "-",
          display_nama: nama ?? "-",
          id: row.id,
        };
      });

      setProposals(normalized);
      setPagination({
        total: response?.total || 0,
        per_page: response?.per_page || rowsPerPage,
        current_page: response?.current_page || currentPage,
        last_page: response?.last_page || 1,
      });

      calculateStats(normalized);
    } catch (err) {
      console.error("Error fetching proposals:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const calculateStats = (data) => {
    const pending = data.filter((item) => item.status === "pending").length;
    const approved = data.filter((item) => item.status === "approved").length;
    const rejected = data.filter((item) => item.status === "rejected").length;

    setStats({ pending, approved, rejected });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  };

  // ========= APPROVE with preflight NIK duplicate check =========
  const handleApprove = async (row) => {
    if (!confirm("Yakin ingin menyetujui pengajuan ini?")) return;
    try {
      if (row?.module === "warga" && (row?.action === "create" || row?.action === "update")) {
        const { nikProposed, ignoreId } = pickNikAndIgnoreId(row);
        if (nikProposed) {
          const { exists, conflictId } = await checkNikUnique(nikProposed, ignoreId);
          if (exists) {
            alert(
              [
                "Tidak bisa approve: NIK sudah terpakai di database.",
                `• NIK: ${nikProposed}`,
                conflictId ? `• ID konflik: ${conflictId}` : null,
                "",
                "Silakan minta pengusul mengganti NIK atau lakukan EDIT data yang benar.",
              ]
                .filter(Boolean)
                .join("\n")
            );
            return;
          }
        }
      }

      const res = await approveProposal(row);
      alert(res?.message || "Data berhasil disetujui!");
      await fetchProposals();
    } catch (err) {
      alert(err.message || "Gagal menyetujui data");
      await fetchProposals();
    }
  };

  const handleReject = async (row) => {
    const reason = prompt("Alasan penolakan:");
    if (!reason || !reason.trim()) return;
    try {
      const res = await rejectProposal(row, reason); // ← kirim row
      alert(res?.message || "Data berhasil ditolak!");
      await fetchProposals();
    } catch (err) {
      if (err.message.includes("404")) {
        alert("Fitur reject belum tersedia di backend. Silakan hubungi administrator.");
      } else {
        alert(err.message || "Gagal menolak data");
      }
    }
  };

  const handleViewDetail = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  // ---- Pagination helper TANPA hooks (aman untuk JSX kondisi)
  const renderPagination = () => {
    const pages = [];
    const totalPages = pagination.last_page;

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

  // Format module name for display
  const getModuleName = (module) => {
    const moduleMap = {
      warga: "Data Warga",
      tanah: "Data Tanah",
      bidang: "Data Bidang",
    };
    return moduleMap[module] || module;
  };

  // Format action name for display
  const getActionName = (action) => {
    const actionMap = {
      create: "Tambah Data",
      update: "Edit Data",
      delete: "Hapus Data",
    };
    return actionMap[action] || action;
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

  // helper untuk render diff di modal (khusus warga/update)
  const renderWargaDiff = (row) => {
    if (row?.module !== "warga" || row?.action !== "update") return null;
    const before = row?._before || {};
    const delta  = row?._after  || {};

    const fields = ["nik", "nama_lengkap", "jenis_kelamin", "alamat_lengkap", "pekerjaan", "agama", "status_perkawinan", "pendidikan_terakhir", "kewarganegaraan", "tanggal_lahir", "tempat_lahir", "keterangan"];

    const changed = fields
      .map((k) => {
        const oldV = before?.[k] ?? null;
        const newV = k in delta ? delta[k] : undefined; // hanya tampilkan kalau memang dikirim
        if (typeof newV === "undefined") return null; // tidak ada perubahan untuk field ini
        const isChanged = String(oldV ?? "") !== String(newV ?? "");
        return { k, oldV, newV, isChanged };
      })
      .filter(Boolean);

    if (!changed.length) return null;

    return (
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2 font-semibold">Perubahan (before → after):</p>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left text-xs px-3 py-2 border-b">Field</th>
                <th className="text-left text-xs px-3 py-2 border-b">Before</th>
                <th className="text-left text-xs px-3 py-2 border-b">After</th>
              </tr>
            </thead>
            <tbody>
              {changed.map(({ k, oldV, newV, isChanged }) => (
                <tr key={k} className={isChanged ? "bg-yellow-50" : ""}>
                  <td className="text-sm px-3 py-2 border-b whitespace-nowrap">{k}</td>
                  <td className="text-sm px-3 py-2 border-b">{String(oldV ?? "-")}</td>
                  <td className="text-sm px-3 py-2 border-b">{String(newV ?? "-")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-800 font-medium">Terjadi Kesalahan</p>
            <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Menunggu Persetujuan</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
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
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
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
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
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
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-800">Approval Data</h2>
            {isRefreshing && <Loader2 className="animate-spin text-teal-600" size={20} />}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Module Filter */}
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            >
              <option value="">Semua Modul</option>
              <option value="warga">Data Warga</option>
              <option value="tanah">Data Tanah</option>
              <option value="bidang">Data Bidang</option>
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, NIK, atau ID..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchProposals}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Loader2 className={isRefreshing ? "animate-spin" : ""} size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {loading && proposals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-teal-600 mb-4" size={40} />
            <p className="text-gray-600">Memuat data...</p>
          </div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 font-medium">Tidak ada data</p>
            <p className="text-gray-500 text-sm mt-1">Belum ada pengajuan yang perlu disetujui</p>
          </div>
        </div>
      ) : (
        <ApprovalTable
          data={proposals}
          onApprove={handleApprove}
          onReject={handleReject}
          onViewDetail={handleViewDetail}
          getModuleName={getModuleName}
          getActionName={getActionName}
        />
      )}

      {/* Pagination */}
      {proposals.length > 0 && (
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
              <span className="text-sm text-gray-600">| Total: {pagination.total} data</span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>

              {renderPagination().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof page === "number" && setCurrentPage(page)}
                  disabled={page === "..."}
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
                onClick={() => setCurrentPage(Math.min(pagination.last_page, currentPage + 1))}
                disabled={currentPage === pagination.last_page}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Button Kembali */}
      <div className="flex justify-end">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Kembali
        </button>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-gray-800">Detail Pengajuan</h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ID Proposal</p>
                  <p className="font-medium text-gray-900">#{selectedItem.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Modul</p>
                  <p className="font-medium text-gray-900">
                    {getModuleName(selectedItem.module)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jenis Perubahan</p>
                  <p className="font-medium text-gray-900">
                    {getActionName(selectedItem.action)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedItem.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedItem.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedItem.status === "pending"
                      ? "Pending"
                      : selectedItem.status === "approved"
                      ? "Approved"
                      : "Ditolak"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Pengajuan</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedItem.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Diajukan Oleh</p>
                  <p className="font-medium text-gray-900">
                    User ID: {selectedItem.submitted_by}
                  </p>
                </div>
              </div>

              {/* Payload Data (raw) */}
              <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">Data yang Diajukan (raw):</p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <pre className="text-sm overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(selectedItem.payload, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Diff khusus warga/update */}
              {renderWargaDiff(selectedItem)}

              {/* Target ID if exists */}
              {selectedItem.target_id && (
                <div>
                  <p className="text-sm text-gray-600">Target ID</p>
                  <p className="font-medium text-gray-900">{selectedItem.target_id}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
              {selectedItem.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleReject(selectedItem); // ← kirim row
                      setShowDetailModal(false);
                    }}
                    className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Tolak
                  </button>

                  <button
                    onClick={() => {
                      handleApprove(selectedItem); // ← kirim row
                      setShowDetailModal(false);
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
