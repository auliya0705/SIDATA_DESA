"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

export default function RiwayatTable({ data = [], loading = false }) {
  const riwayatData =
    data.length > 0
      ? data
      : [
          // contoh mock (opsional)
          { id: 1, module: "warga", nama: "Sekretaris Desa", tanggal: "2 September 2025 || 14:58:01", jenis_perubahan: "Tambah" },
          { id: 5, module: "tanah",  nama: "Sekretaris Desa", tanggal: "2 September 2025 || 14:58:01", jenis_perubahan: "Edit" },
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

  const labelModule = (m) => {
    const x = (m || "").toLowerCase();
    if (x === "warga") return "Warga";
    if (x === "tanah") return "Tanah";
    if (x === "bidang") return "Bidang";
    return "-";
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-teal-700 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">#</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Jenis Data</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Nama</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Tanggal & Waktu</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Jenis Perubahan</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Aksi</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {riwayatData.map((riwayat, index) => (
            <tr key={riwayat.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{labelModule(riwayat.module)}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{riwayat.nama}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{riwayat.tanggal}</td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getJenisBadgeColor(
                    riwayat.jenis_perubahan
                  )}`}
                >
                  {riwayat.jenis_perubahan}
                </span>
              </td>

              {/* Aksi: hanya tombol Lihat Detail (ikon mata) */}
              <td className="px-6 py-4 text-sm text-gray-700">
                <Link
                  href={`/admin/riwayat-buku-tanah/detail/${riwayat.id}`}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Eye size={16} />
                  <span>Lihat</span>
                </Link>
              </td>
            </tr>
          ))}

          {(!riwayatData || riwayatData.length === 0) && !loading && (
            <tr>
              <td className="px-6 py-6 text-center text-sm text-gray-500" colSpan={6}>
                Tidak ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
