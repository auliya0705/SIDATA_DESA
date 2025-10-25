"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, Edit, Trash2, Eye, Plus } from "lucide-react";

export default function TanahTable({ data = [], onDelete }) {
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Mock data
  const tanahData =
    data.length > 0
      ? data
      : [
          {
            id: 1,
            nama_pemilik: "Muhammad Vendra Hastagiyan",
            total_luas: 120,
            jumlah_bidang: 3,
          },
          {
            id: 5,
            nama_pemilik: "Muhammad Vendra Hastagiyan",
            total_luas: 120,
            jumlah_bidang: 2,
          },
          // Add more mock data
        ];

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
              Nama Pemilik
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Jumlah Luas (m²)
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Jumlah Bidang
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tanahData.map((tanah, index) => (
            <tr key={tanah.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{tanah.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                <Link
                  href={`/admin/management-tanah/detail/${tanah.id}`}
                  className="text-teal-700 hover:text-teal-900 hover:underline"
                >
                  {tanah.nama_pemilik}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {tanah.total_luas} m²
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {tanah.jumlah_bidang} bidang
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 relative">
                <button
                  onClick={() =>
                    setShowActionMenu(
                      showActionMenu === tanah.id ? null : tanah.id
                    )
                  }
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical size={18} />
                </button>

                {/* Action Menu Dropdown */}
                {showActionMenu === tanah.id && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <Link
                      href={`/admin/management-tanah/detail/${tanah.id}`}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      <Eye size={16} />
                      <span>Lihat Detail</span>
                    </Link>
                    <Link
                      href={`/admin/management-tanah/tambah-bidang/${tanah.id}`}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      <Plus size={16} />
                      <span>Tambah Bidang</span>
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Yakin ingin menghapus semua data tanah pemilik ini?"
                          )
                        ) {
                          onDelete && onDelete(tanah.id);
                        }
                        setShowActionMenu(null);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600"
                    >
                      <Trash2 size={16} />
                      <span>Hapus Semua</span>
                    </button>
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
