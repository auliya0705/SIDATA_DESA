"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";

export default function WargaTable({ data = [], onDelete }) {
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Mock data jika tidak ada data
  const wargaData =
    data.length > 0
      ? data
      : [
          {
            id: 1,
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
          },
          // Add more mock data sesuai kebutuhan
        ];

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-teal-700 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Nama
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Gender
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Tempat, Tanggal Lahir
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Agama
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Pend.
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Pekerjaan
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              WNI
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Kedudukan
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
              Nomor KTP
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {wargaData.map((warga, index) => (
            <tr key={warga.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{warga.id}</td>
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                {warga.nama}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {warga.gender}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {warga.status}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {warga.tempat_lahir}, {warga.tanggal_lahir}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{warga.agama}</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {warga.pendidikan}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {warga.pekerjaan}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{warga.wni}</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {warga.kedudukan}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                {warga.nomor_ktp}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 relative">
                <button
                  onClick={() =>
                    setShowActionMenu(
                      showActionMenu === warga.id ? null : warga.id
                    )
                  }
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical size={18} />
                </button>

                {/* Action Menu Dropdown */}
                {showActionMenu === warga.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <Link
                      href={`/admin/management-warga/detail/${warga.id}`}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      <Eye size={16} />
                      <span>Lihat Detail</span>
                    </Link>
                    <Link
                      href={`/admin/management-warga/edit/${warga.id}`}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      <Edit size={16} />
                      <span>Edit Data</span>
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm("Yakin ingin menghapus data ini?")) {
                          onDelete && onDelete(warga.id);
                        }
                        setShowActionMenu(null);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600"
                    >
                      <Trash2 size={16} />
                      <span>Hapus</span>
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
