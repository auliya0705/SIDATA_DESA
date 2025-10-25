"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, Eye, Trash2 } from "lucide-react";

export default function RiwayatTable({ data = [], onDelete }) {
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Mock data
  const riwayatData =
    data.length > 0
      ? data
      : [
          {
            id: 1,
            nama: "Muhammad Vendra Hastagiyan",
            tanggal: "2 September 2025 || 14:58:01",
            jenis_perubahan: "Tambah",
          },
          {
            id: 5,
            nama: "Muhammad Vendra Hastagiyan",
            tanggal: "2 September 2025 || 14:58:01",
            jenis_perubahan: "Edit",
          },
          {
            id: 6,
            nama: "Muhammad Vendra Hastagiyan",
            tanggal: "2 September 2025 || 14:58:01",
            jenis_perubahan: "Edit",
          },
          {
            id: 7,
            nama: "Muhammad Vendra Hastagiyan",
            tanggal: "2 September 2025 || 14:58:01",
            jenis_perubahan: "Edit",
          },
          {
            id: 10,
            nama: "Muhammad Vendra Hastagiyan",
            tanggal: "2 September 2025 || 14:58:01",
            jenis_perubahan: "Tambah",
          },
          {
            id: 11,
            nama: "Muhammad Vendra Hastagiyan",
            tanggal: "2 September 2025 || 14:58:01",
            jenis_perubahan: "Tambah",
          },
          {
            id: 12,
            nama: "Muhammad Vendra Hastagiyan",
            tanggal: "2 September 2025 || 14:58:01",
            jenis_perubahan: "Hapus",
          },
          {
            id: 13,
            nama: "Muhammad Vendra Hastagiyan",
            tanggal: "2 September 2025 || 14:58:01",
            jenis_perubahan: "Edit",
          },
        ];

  const getJenisBadgeColor = (jenis) => {
    switch (jenis) {
      case "Tambah":
        return "bg-green-100 text-green-800";
      case "Edit":
        return "bg-blue-100 text-blue-800";
      case "Hapus":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-teal-700 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              #
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Nama
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Tanggal & Waktu
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Jenis Perubahan
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {riwayatData.map((riwayat, index) => (
            <tr key={riwayat.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{riwayat.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                {riwayat.nama}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {riwayat.tanggal}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getJenisBadgeColor(
                    riwayat.jenis_perubahan
                  )}`}
                >
                  {riwayat.jenis_perubahan}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 relative">
                <button
                  onClick={() =>
                    setShowActionMenu(
                      showActionMenu === riwayat.id ? null : riwayat.id
                    )
                  }
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical size={18} />
                </button>

                {/* Action Menu Dropdown */}
                {showActionMenu === riwayat.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <Link
                      href={`/admin/riwayat-buku-tanah/detail/${riwayat.id}`}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      <Eye size={16} />
                      <span>Lihat Detail</span>
                    </Link>
                    {riwayat.jenis_perubahan !== "Hapus" && (
                      <button
                        onClick={() => {
                          if (confirm("Yakin ingin menghapus riwayat ini?")) {
                            onDelete && onDelete(riwayat.id);
                          }
                          setShowActionMenu(null);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600"
                      >
                        <Trash2 size={16} />
                        <span>Hapus Riwayat</span>
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
