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
import { useWarga } from "@/hooks/useWarga";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import AlertDialog from "@/components/ui/AlertDialog";
import PromptDialog from "@/components/ui/PromptDialog";
import ApprovalDetailModal from "@/components/admin/ApprovalDetailModal";

export default function ApprovalPage() {
  const router = useRouter();
  const { loading, error, getProposalList, approveProposal, rejectProposal } =
    useProposal();
  const { checkNikUnique, getWargaById } = useWarga();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
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

  // Dialog states - FIXED: Using function setState
  const [dialogs, setDialogs] = useState({
    unauthorized: false,
    approveConfirm: false,
    rejectPrompt: false,
    nikConflict: false,
    approveSuccess: false,
    approveError: false,
    rejectSuccess: false,
    rejectError: false,
    loadError: false,
  });
  const [dialogMessage, setDialogMessage] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  // ---- helpers
  const parseMaybeJson = (v) => {
    if (typeof v !== "string") return v;
    try {
      return JSON.parse(v);
    } catch {
      return null;
    }
  };

  const pickNikAndIgnoreId = (row) => {
    const payload = parseMaybeJson(row?.payload) ?? row?.payload ?? {};
    const action = String(row?.action || "").toLowerCase();

    const before = payload?.before ?? null;
    const after = payload?.after ?? null;
    const snapshot = payload?.snapshot ?? null;

    let nikProposed = null;
    let ignoreId = null;

    if (action === "update") {
      nikProposed =
        after?.nik ?? payload?.nik ?? before?.nik ?? row?.nik ?? null;
      ignoreId = before?.id ?? payload?.id ?? row?.target_id ?? row?.id ?? null;
    } else if (action === "create") {
      nikProposed = payload?.nik ?? row?.nik ?? null;
      ignoreId = null;
    } else if (action === "delete") {
      nikProposed = snapshot?.nik ?? row?.nik ?? null;
      ignoreId = snapshot?.id ?? row?.target_id ?? row?.id ?? null;
    } else {
      nikProposed = payload?.nik ?? row?.nik ?? null;
      ignoreId = row?.target_id ?? row?.id ?? null;
    }

    return { nikProposed, ignoreId };
  };

  async function fetchBidangPreview(bidangId) {
    try {
      const d = await apiGet(API_ENDPOINTS.BIDANG.SHOW(bidangId));
      const nik = d?.tanah?.pemilik?.nik ?? null;
      const nama =
        d?.tanah?.pemilik?.nama ?? d?.tanah?.pemilik?.nama_lengkap ?? null;
      const tanah_id = d?.tanah?.id ?? null;
      const nomor_urut = d?.tanah?.nomor_urut ?? null;
      return { nik, nama, tanah_id, nomor_urut };
    } catch {
      return null;
    }
  }

  async function fetchTanahPreview(tanahId) {
    try {
      const d = await apiGet(API_ENDPOINTS.TANAH.SHOW(tanahId));
      const nik = d?.pemilik?.nik ?? null;
      const nama = d?.pemilik?.nama_lengkap ?? d?.pemilik_nama ?? null;
      const nomor_urut = d?.nomor_urut ?? null;
      return { nik, nama, nomor_urut };
    } catch {
      return null;
    }
  }

  // FIXED: Use function setState to prevent stale state
  const closeDialog = (dialogName) => {
    setDialogs((prev) => ({ ...prev, [dialogName]: false }));
  };

  const handleUnauthorizedClose = () => {
    closeDialog("unauthorized");
    router.push("/admin/dashboard");
  };

  // Check role Kepala
  useEffect(() => {
    const user = getCurrentUser();
    if (!user || (user.role !== "kepala_desa" && user.role !== "kepala")) {
      setDialogs((prev) => ({ ...prev, unauthorized: true }));
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
      if (selectedModule) params.module = selectedModule;
      if (selectedStatus) params.status = selectedStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await getProposalList(params);
      const rows = response?.data ?? [];

      const wargaUpdateRows = rows.filter(
        (r) => r.module === "warga" && r.action === "update" && r.target_id
      );
      const beforeMap = {};
      await Promise.all(
        wargaUpdateRows.map(async (r) => {
          try {
            const before = await getWargaById(r.target_id);
            beforeMap[r.target_id] = before || null;
          } catch {
            beforeMap[r.target_id] = null;
          }
        })
      );

      const bidangNeeding = rows.filter((r) => {
        if (r.module !== "bidang" || !r.target_id) return false;
        const payload = parseMaybeJson(r.payload) ?? r.payload ?? {};
        return !payload?.preview_pemilik;
      });

      const tanahNeeding = rows.filter((r) => {
        if (r.module !== "tanah" || !r.target_id) return false;
        const payload = parseMaybeJson(r.payload) ?? r.payload ?? {};
        return !(payload?.preview_pemilik || payload?.snapshot);
      });

      const bidangPreviewMap = {};
      const tanahPreviewMap = {};

      await Promise.all([
        ...bidangNeeding.map(async (r) => {
          const prev = await fetchBidangPreview(r.target_id);
          if (prev) bidangPreviewMap[r.target_id] = prev;
        }),
        ...tanahNeeding.map(async (r) => {
          const prev = await fetchTanahPreview(r.target_id);
          if (prev) tanahPreviewMap[r.target_id] = prev;
        }),
      ]);

      const proposalRowsNormalized = rows.map((row) => {
        const payload = parseMaybeJson(row.payload) ?? row.payload ?? {};
        const snap = payload?.snapshot ?? null;

        let pv = null;
        if (row.module === "bidang") {
          pv =
            payload?.preview_pemilik ?? bidangPreviewMap[row.target_id] ?? null;
        } else if (row.module === "tanah") {
          pv =
            payload?.preview_pemilik ??
            snap ??
            tanahPreviewMap[row.target_id] ??
            null;
        }

        let nik = row.nik ?? null;
        let nama = row.nama_lengkap ?? payload?.nama_lengkap ?? null;
        if (pv) {
          if (pv.nik || pv.nama || pv.nama_lengkap) {
            nik = pv.nik ?? nik;
            nama = pv.nama ?? pv.nama_lengkap ?? nama;
          } else if (pv.pemilik) {
            nik = pv.pemilik.nik ?? nik;
            nama = pv.pemilik.nama ?? pv.pemilik.nama_lengkap ?? nama;
          }
        }

        if (row.module === "warga" && row.action === "update") {
          const before = beforeMap[row.target_id] || {};
          const newNik = payload?.nik ?? null;
          const newNama = payload?.nama_lengkap ?? null;

          const oldNik = before?.nik ?? null;
          const oldNama = before?.nama_lengkap ?? null;

          const display_nik =
            newNik && oldNik && String(newNik) !== String(oldNik)
              ? `${oldNik} → ${newNik}`
              : newNik ?? oldNik ?? "-";

          const display_nama =
            newNama && oldNama && String(newNama) !== String(oldNama)
              ? `${oldNama} → ${newNama}`
              : newNama ?? oldNama ?? "-";

          return {
            ...row,
            _before: before,
            _after: payload || {},
            nik: display_nik ?? "-",
            nama_lengkap: display_nama ?? "-",
            display_nik: display_nik ?? "-",
            display_nama: display_nama ?? "-",
            id: row.id,
          };
        }

        switch (row.action) {
          case "create":
            nik = nik ?? payload?.nik ?? null;
            nama = nama ?? payload?.nama_lengkap ?? null;
            break;
          case "update":
            nik =
              nik ??
              payload?.after?.nik ??
              payload?.before?.nik ??
              payload?.nik ??
              null;
            nama =
              nama ??
              payload?.after?.nama_lengkap ??
              payload?.before?.nama_lengkap ??
              payload?.nama_lengkap ??
              null;
            break;
          case "delete":
            nik = nik ?? snap?.nik ?? snap?.pemilik?.nik ?? null;
            nama =
              nama ??
              snap?.nama_lengkap ??
              snap?.pemilik?.nama_lengkap ??
              snap?.pemilik?.nama ??
              null;
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

      setProposals(proposalRowsNormalized);
      setPagination({
        total: response?.total || 0,
        per_page: response?.per_page || rowsPerPage,
        current_page: response?.current_page || currentPage,
        last_page: response?.last_page || 1,
      });

      if (response?.stats) {
        setStats({
          pending: response.stats.pending ?? 0,
          approved: response.stats.approved ?? 0,
          rejected: response.stats.rejected ?? 0,
        });
      } else {
        calculateStats(proposalRowsNormalized);
      }
    } catch (err) {
      console.error("Error fetching proposals:", err);
      setDialogMessage("Gagal memuat data proposal: " + err.message);
      setDialogs((prev) => ({ ...prev, loadError: true }));
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
    setCurrentPage(1);
  };

  // FIXED: All setDialogs use function setState
  const handleApproveClick = async (row) => {
    setPendingAction(row);

    if (
      row?.module === "warga" &&
      (row?.action === "create" || row?.action === "update")
    ) {
      const { nikProposed, ignoreId } = pickNikAndIgnoreId(row);
      if (nikProposed) {
        try {
          const { exists, conflictId } = await checkNikUnique(
            nikProposed,
            ignoreId
          );
          if (exists) {
            setDialogMessage(
              `Tidak bisa approve: NIK sudah terpakai di database.\n\n` +
                `• NIK: ${nikProposed}\n` +
                (conflictId ? `• ID konflik: ${conflictId}\n` : "") +
                `\nSilakan minta pengusul mengganti NIK atau lakukan EDIT data yang benar.`
            );
            setDialogs((prev) => ({ ...prev, nikConflict: true }));
            return;
          }
        } catch (err) {
          console.error("NIK check error:", err);
        }
      }
    }

    setDialogs((prev) => ({ ...prev, approveConfirm: true }));
  };

  const handleApprove = async () => {
    if (!pendingAction) return;

    closeDialog("approveConfirm");

    try {
      const res = await approveProposal(pendingAction);
      setDialogMessage(res?.message || "Proposal berhasil disetujui!");
      setDialogs((prev) => ({ ...prev, approveSuccess: true }));
      await fetchProposals();
    } catch (err) {
      setDialogMessage(err.message || "Gagal menyetujui proposal");
      setDialogs((prev) => ({ ...prev, approveError: true }));
    } finally {
      setPendingAction(null);
    }
  };

  const handleRejectClick = (row) => {
    setPendingAction(row);
    setDialogs((prev) => ({ ...prev, rejectPrompt: true }));
  };

  const handleReject = async (reason) => {
    if (!pendingAction) return;

    closeDialog("rejectPrompt");

    try {
      const res = await rejectProposal(pendingAction, reason);
      setDialogMessage(res?.message || "Proposal berhasil ditolak!");
      setDialogs((prev) => ({ ...prev, rejectSuccess: true }));
      await fetchProposals();
    } catch (err) {
      if (err.message.includes("404")) {
        setDialogMessage(
          "Fitur reject sedang dalam pengembangan. Silakan hubungi admin."
        );
      } else {
        setDialogMessage(err.message || "Gagal menolak proposal");
      }
      setDialogs((prev) => ({ ...prev, rejectError: true }));
    } finally {
      setPendingAction(null);
    }
  };

  const handleViewDetail = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

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

  const getModuleName = (module) => {
    const moduleMap = {
      warga: "Data Warga",
      tanah: "Data Tanah",
      bidang: "Data Bidang",
    };
    return moduleMap[module] || module;
  };

  const getActionName = (action) => {
    const actionMap = {
      create: "Tambah Data",
      update: "Edit Data",
      delete: "Hapus Data",
    };
    return actionMap[action] || action;
  };

  const user = getCurrentUser();
  if (!user || (user.role !== "kepala_desa" && user.role !== "kepala")) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-2">⛔</div>
            <p className="text-gray-700 font-semibold">Akses Ditolak</p>
            <p className="text-gray-500 text-sm">
              Halaman ini hanya untuk Kepala Desa
            </p>
          </div>
        </div>

        <AlertDialog
          isOpen={dialogs.unauthorized}
          onClose={handleUnauthorizedClose}
          title="Akses Ditolak"
          message="Halaman ini hanya untuk Kepala Desa"
          type="error"
        />
      </>
    );
  }

  const renderWargaDiff = (row) => {
    if (row?.module !== "warga" || row?.action !== "update") return null;
    const before = row?._before || {};
    const delta = row?._after || {};

    const fields = [
      "nik",
      "nama_lengkap",
      "jenis_kelamin",
      "alamat_lengkap",
      "pekerjaan",
      "agama",
      "status_perkawinan",
      "pendidikan_terakhir",
      "kewarganegaraan",
      "tanggal_lahir",
      "tempat_lahir",
      "keterangan",
    ];

    const changed = fields
      .map((k) => {
        const oldV = before?.[k] ?? null;
        const newV = k in delta ? delta[k] : undefined;
        if (typeof newV === "undefined") return null;
        const isChanged = String(oldV ?? "") !== String(newV ?? "");
        return { k, oldV, newV, isChanged };
      })
      .filter(Boolean);

    if (!changed.length) return null;

    return (
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2 font-semibold">
          Perubahan (before → after):
        </p>
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
                  <td className="text-sm px-3 py-2 border-b whitespace-nowrap">
                    {k}
                  </td>
                  <td className="text-sm px-3 py-2 border-b">
                    {String(oldV ?? "-")}
                  </td>
                  <td className="text-sm px-3 py-2 border-b">
                    {String(newV ?? "-")}
                  </td>
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
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle
            className="text-red-600 flex-shrink-0 mt-0.5"
            size={20}
          />
          <div>
            <p className="text-red-800 font-medium">Terjadi Kesalahan</p>
            <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Menunggu Persetujuan</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending}
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
                {stats.approved}
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
              <p className="text-3xl font-bold text-red-600">
                {stats.rejected}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Approval Data
            </h2>
            {isRefreshing && (
              <Loader2 className="animate-spin text-teal-600" size={20} />
            )}
          </div>

          <div className="flex flex-wrap gap-3">
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, NIK, atau ID..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

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
            <p className="text-gray-500 text-sm mt-1">
              Belum ada pengajuan yang perlu disetujui
            </p>
          </div>
        </div>
      ) : (
        <ApprovalTable
          data={proposals}
          onApprove={handleApproveClick}
          onReject={handleRejectClick}
          onViewDetail={handleViewDetail}
          getModuleName={getModuleName}
          getActionName={getActionName}
          showId={false}
        />
      )}

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
              <span className="text-sm text-gray-600">
                | Total: {pagination.total} data
              </span>
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
                  onClick={() =>
                    typeof page === "number" && setCurrentPage(page)
                  }
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
                onClick={() =>
                  setCurrentPage(
                    Math.min(pagination.last_page, currentPage + 1)
                  )
                }
                disabled={currentPage === pagination.last_page}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Kembali
        </button>
      </div>

      <ApprovalDetailModal
        isOpen={showDetailModal}
        selectedItem={selectedItem}
        onClose={() => setShowDetailModal(false)}
        onApprove={handleApproveClick}
        onReject={handleRejectClick}
        getModuleName={getModuleName}
        getActionName={getActionName}
        parseMaybeJson={parseMaybeJson}
        renderWargaDiff={renderWargaDiff}
      />

      <AlertDialog
        isOpen={dialogs.unauthorized}
        onClose={handleUnauthorizedClose}
        title="Akses Ditolak"
        message="Halaman ini hanya untuk Kepala Desa"
        type="error"
      />

      <AlertDialog
        isOpen={dialogs.nikConflict}
        onClose={() => closeDialog("nikConflict")}
        title="NIK Sudah Terdaftar"
        message={dialogMessage}
        type="error"
      />

      <ConfirmDialog
        isOpen={dialogs.approveConfirm}
        onClose={() => closeDialog("approveConfirm")}
        onConfirm={handleApprove}
        title="Konfirmasi Persetujuan"
        message="Yakin ingin menyetujui proposal ini? Data akan langsung masuk ke sistem."
        confirmText="Ya, Setujui"
        cancelText="Batal"
        type="success"
      />

      <PromptDialog
        isOpen={dialogs.rejectPrompt}
        onClose={() => closeDialog("rejectPrompt")}
        onSubmit={handleReject}
        title="Alasan Penolakan"
        message="Masukkan alasan mengapa proposal ditolak"
        placeholder="Tulis alasan penolakan di sini..."
        required={true}
        inputType="textarea"
        confirmText="Tolak Proposal"
        cancelText="Batal"
      />

      <AlertDialog
        isOpen={dialogs.approveSuccess}
        onClose={() => closeDialog("approveSuccess")}
        title="Berhasil!"
        message={dialogMessage}
        type="success"
      />

      <AlertDialog
        isOpen={dialogs.approveError}
        onClose={() => closeDialog("approveError")}
        title="Gagal Menyetujui"
        message={dialogMessage}
        type="error"
      />

      <AlertDialog
        isOpen={dialogs.rejectSuccess}
        onClose={() => closeDialog("rejectSuccess")}
        title="Proposal Ditolak"
        message={dialogMessage}
        type="success"
      />

      <AlertDialog
        isOpen={dialogs.rejectError}
        onClose={() => closeDialog("rejectError")}
        title="Gagal Menolak"
        message={dialogMessage}
        type="error"
      />

      <AlertDialog
        isOpen={dialogs.loadError}
        onClose={() => closeDialog("loadError")}
        title="Error"
        message={dialogMessage}
        type="error"
      />
    </div>
  );
}