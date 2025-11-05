// src/app/admin/management-tanah/detail/[id]/page.js
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Edit, Trash2, Download } from "lucide-react";
import { apiGet, apiDelete } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import AlertDialog from "@/components/ui/AlertDialog";

export default function DetailTanahOwnerPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tanah, setTanah] = useState(null);
  const SHOW_ID_COL = false;

  // Dialog states
  const [dialogs, setDialogs] = useState({
    deleteConfirm: false,
    deleteSuccess: false,
    deleteError: false,
    exportInfo: false,
  });
  const [dialogMessage, setDialogMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState({ id: null, name: "" });

  const closeDialog = (dialogName) => {
    setDialogs({ ...dialogs, [dialogName]: false });
  };

  // Load detail tanah
  const loadDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet(API_ENDPOINTS.TANAH.SHOW(id));
      setTanah(data);
    } catch (err) {
      setError(err?.message || "Gagal memuat detail tanah.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // View models
  const ownerVM = useMemo(() => {
    if (!tanah) return null;
    return {
      nama_pemilik: tanah?.pemilik?.nama_lengkap ?? tanah?.pemilik_nama ?? "-",
      total_luas: Number(
        tanah?.jumlah_m2_computed ?? tanah?.total_luas_m2 ?? 0
      ),
      jumlah_bidang: tanah?.bidang_count ?? tanah?.bidang?.length ?? 0,
    };
  }, [tanah]);

  const bidangList = useMemo(() => {
    if (!tanah?.bidang) return [];
    return tanah.bidang.map((b) => ({
      id: b.id,
      luas: Number(b.luas_m2 ?? 0),
      status_hak: b.status_hak,
      penggunaan: b.penggunaan,
      keterangan: b.keterangan ?? "-",
      geojson_nama: b.geojson?.nama ?? null,
    }));
  }, [tanah]);

  // Actions
  const handleDeleteBidangClick = (bidangId, keterangan) => {
    setPendingDelete({
      id: bidangId,
      name: keterangan || "bidang ini",
    });
    setDialogs({ ...dialogs, deleteConfirm: true });
  };

  const handleDeleteBidang = async () => {
    if (!pendingDelete.id) return;

    try {
      closeDialog("deleteConfirm");

      const delEndpoint = API_ENDPOINTS?.STAFF?.PROPOSALS?.TANAH?.BIDANG?.DELETE
        ? API_ENDPOINTS.STAFF.PROPOSALS.TANAH.BIDANG.DELETE(pendingDelete.id)
        : `/staff/proposals/bidang/${pendingDelete.id}`;

      await apiDelete(delEndpoint);

      setDialogMessage(
        "Proposal hapus bidang berhasil dibuat. Menunggu persetujuan Kepala Desa."
      );
      setDialogs({ ...dialogs, deleteSuccess: true });

      await loadDetail();
    } catch (err) {
      console.error("Hapus bidang gagal:", err);
      setDialogMessage(err?.message || "Gagal mengajukan hapus bidang.");
      setDialogs({ ...dialogs, deleteError: true });
    } finally {
      setPendingDelete({ id: null, name: "" });
    }
  };

  const handleExport = () => {
    setDialogMessage("Fitur ekspor data akan segera tersedia");
    setDialogs({ ...dialogs, exportInfo: true });
  };

  // UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto" />
          <p className="mt-4 text-gray-600">Memuat detail tanah…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Detail Data Tanah
          </h1>
          <Link
            href="/admin/management-tanah"
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Detail Data Tanah</h1>
        <Link
          href="/admin/management-tanah"
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Owner Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {ownerVM?.nama_pemilik}
            </h2>
            <div className="flex gap-6 text-sm text-gray-600">
              <div>
                <span className="font-medium">Total Luas:</span>{" "}
                <span className="text-gray-900">
                  {ownerVM?.total_luas?.toLocaleString("id-ID")} m²
                </span>
              </div>
              <div>
                <span className="font-medium">Jumlah Bidang:</span>{" "}
                <span className="text-gray-900">
                  {ownerVM?.jumlah_bidang} bidang
                </span>
              </div>
              <div className="hidden md:block">
                <span className="font-medium">Nomor Urut Tanah:</span>{" "}
                <span className="text-gray-900">
                  {tanah?.nomor_urut ?? "-"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            <span>Ekspor Data</span>
          </button>
        </div>
      </div>

      {/* Add Bidang */}
      <div className="flex justify-end">
        <Link
          href={`/admin/management-tanah/tambah-bidang/${id}`}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Bidang Tanah</span>
        </Link>
      </div>

      {/* Title */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Data Bidang Tanah — {ownerVM?.nama_pemilik}
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-teal-700 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                No
              </th>

              {SHOW_ID_COL && (
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                  ID Bidang
                </th>
              )}

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Luas (m²)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Status Hak
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Penggunaan
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Keterangan
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase"></th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {bidangList.map((b, idx) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">{idx + 1}</td>

                {SHOW_ID_COL && (
                  <td className="px-6 py-4 text-sm text-gray-700">{b.id}</td>
                )}

                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {b.luas.toLocaleString("id-ID")} m²
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold">
                    {b.status_hak}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {b.penggunaan?.replaceAll("_", " ")}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {b.keterangan}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/management-tanah/edit-bidang/${id}/${b.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() =>
                        handleDeleteBidangClick(b.id, b.keterangan)
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {bidangList.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">Belum ada data bidang tanah</p>
          <Link
            href={`/admin/management-tanah/tambah-bidang/${id}`}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
          >
            <Plus size={18} />
            <span>Tambah Bidang Pertama</span>
          </Link>
        </div>
      )}

      {/* Custom Dialogs */}
      <ConfirmDialog
        isOpen={dialogs.deleteConfirm}
        onClose={() => closeDialog("deleteConfirm")}
        onConfirm={handleDeleteBidang}
        title="Konfirmasi Hapus Bidang"
        message={`Yakin ingin mengajukan penghapusan bidang "${pendingDelete.name}"? Ini akan membuat proposal yang perlu disetujui Kepala Desa.`}
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
