"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function WargaTable({ data = [], onDelete }) {
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState({ id: null, name: "" });

  // Format helpers
  const formatGender = (gender) => {
    return gender === "L" ? "L" : gender === "P" ? "P" : gender;
  };

  const formatStatusPerkawinan = (status) => {
    const statusMap = {
      BELUM_KAWIN: "Belum Kawin",
      KAWIN: "Kawin",
      CERAI_HIDUP: "Cerai Hidup",
      CERAI_MATI: "Cerai Mati",
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatKewarganegaraan = (kewarganegaraan) => {
    return kewarganegaraan === "WNI" ? "Ya" : "Tidak";
  };

  const handleDeleteClick = (id, name) => {
    setPendingDelete({ id, name });
    setShowDeleteConfirm(true);
    setShowActionMenu(null);
  };

  const handleDeleteConfirm = () => {
    if (pendingDelete.id) {
      onDelete && onDelete(pendingDelete.id);
    }
    setShowDeleteConfirm(false);
    setPendingDelete({ id: null, name: "" });
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Belum ada data warga</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-teal-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Nama Lengkap
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                NIK
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                JK
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                TTL
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Agama
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Status Kawin
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Pendidikan
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Pekerjaan
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                WNI
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((warga, index) => (
              <tr key={warga.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  <div className="flex flex-col">
                    <span>{warga.nama_lengkap}</span>
                    {warga.tanah_count > 0 && (
                      <span className="text-xs text-teal-600">
                        {warga.tanah_count} tanah
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 font-mono whitespace-nowrap">
                  {warga.nik}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {formatGender(warga.jenis_kelamin)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="flex flex-col">
                    <span>{warga.tempat_lahir}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(warga.tanggal_lahir)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {warga.agama}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {formatStatusPerkawinan(warga.status_perkawinan)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {warga.pendidikan_terakhir || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {warga.pekerjaan || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {formatKewarganegaraan(warga.kewarganegaraan)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 relative">
                  <button
                    onClick={() =>
                      setShowActionMenu(
                        showActionMenu === warga.id ? null : warga.id
                      )
                    }
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* Action Menu Dropdown */}
                  {showActionMenu === warga.id && (
                    <>
                      {/* Backdrop to close menu */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowActionMenu(null)}
                      />

                      {/* Menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <Link
                          href={`/admin/management-warga/detail/${warga.id}`}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-t-lg transition-colors"
                          onClick={() => setShowActionMenu(null)}
                        >
                          <Eye size={16} />
                          <span>Lihat Detail</span>
                        </Link>
                        <Link
                          href={`/admin/management-warga/edit/${warga.id}`}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
                          onClick={() => setShowActionMenu(null)}
                        >
                          <Edit size={16} />
                          <span>Edit Data</span>
                        </Link>
                        <button
                          onClick={() =>
                            handleDeleteClick(warga.id, warga.nama_lengkap)
                          }
                          className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-lg transition-colors"
                        >
                          <Trash2 size={16} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus"
        message={`Yakin ingin menghapus data ${pendingDelete.name}? Ini akan membuat proposal penghapusan yang perlu disetujui Kepala Desa.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
      />
    </>
  );
}
