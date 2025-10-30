"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, User, FileText } from "lucide-react";

export default function DetailRiwayatPage() {
  const params = useParams();
  const router = useRouter();
  const [riwayatData, setRiwayatData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch data from API
    setTimeout(() => {
      setRiwayatData({
        id: params.id,
        jenis_perubahan: "Edit",
        nama: "Annisa Salsa",
        tanggal: "2 September 2025",
        waktu: "14:58:01",
        admin: "Muhammad Vendra Hastagiyan",
        role_admin: "Kepala Desa",
        keterangan: "Mengubah data luas tanah dari 100m² menjadi 120m²",
        data_sebelum: {
          nama_pemilik: "Auliya Shad",
          nomor_urut: "1",
          jumlah_luas: "100",
          status_hak_tanah: "HM",
          penggunaan_tanah: ["sawah"],
          keterangan: "Lahan pertanian",
        },
        data_sesudah: {
          nama_pemilik: "Rafiq Susetya Nugraha",
          nomor_urut: "1",
          jumlah_luas: "120",
          status_hak_tanah: "HM",
          penggunaan_tanah: ["sawah", "tegalan"],
          keterangan: "Lahan pertanian diperluas",
        },
      });
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

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

  const CompareRow = ({ label, before, after }) => {
    const isDifferent = JSON.stringify(before) !== JSON.stringify(after);

    return (
      <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
        <div className="font-medium text-gray-700">{label}</div>
        <div className={`${isDifferent ? "bg-red-50 p-2 rounded" : ""}`}>
          <p className="text-sm text-gray-900">
            {Array.isArray(before) ? before.join(", ") : before || "-"}
          </p>
        </div>
        <div className={`${isDifferent ? "bg-green-50 p-2 rounded" : ""}`}>
          <p className="text-sm text-gray-900">
            {Array.isArray(after) ? after.join(", ") : after || "-"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Detail Riwayat Perubahan
          </h1>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {riwayatData.nama}
              </h2>
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${getJenisBadgeColor(
                  riwayatData.jenis_perubahan
                )}`}
              >
                {riwayatData.jenis_perubahan}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>
                  {riwayatData.tanggal} || {riwayatData.waktu}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>
                  Diubah oleh: <strong>{riwayatData.admin}</strong> (
                  {riwayatData.role_admin})
                </span>
              </div>
              {riwayatData.keterangan && (
                <div className="flex items-start space-x-2">
                  <FileText size={16} className="mt-0.5" />
                  <span className="italic">{riwayatData.keterangan}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table - Only for Edit */}
      {riwayatData.jenis_perubahan === "Edit" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">Perbandingan Data</h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 pb-3 border-b-2 border-gray-200 mb-3">
              <div className="font-bold text-gray-700">Field</div>
              <div className="font-bold text-red-700">Data Sebelum</div>
              <div className="font-bold text-green-700">Data Sesudah</div>
            </div>

            <CompareRow
              label="Nama Pemilik"
              before={riwayatData.data_sebelum.nama_pemilik}
              after={riwayatData.data_sesudah.nama_pemilik}
            />
            <CompareRow
              label="Nomor Urut"
              before={riwayatData.data_sebelum.nomor_urut}
              after={riwayatData.data_sesudah.nomor_urut}
            />
            <CompareRow
              label="Jumlah Luas (m²)"
              before={riwayatData.data_sebelum.jumlah_luas}
              after={riwayatData.data_sesudah.jumlah_luas}
            />
            <CompareRow
              label="Status Hak Tanah"
              before={riwayatData.data_sebelum.status_hak_tanah}
              after={riwayatData.data_sesudah.status_hak_tanah}
            />
            <CompareRow
              label="Penggunaan Tanah"
              before={riwayatData.data_sebelum.penggunaan_tanah}
              after={riwayatData.data_sesudah.penggunaan_tanah}
            />
            <CompareRow
              label="Keterangan"
              before={riwayatData.data_sebelum.keterangan}
              after={riwayatData.data_sesudah.keterangan}
            />
          </div>

          <div className="bg-gray-50 px-6 py-3 text-sm text-gray-600">
            <p>
              💡 <strong>Tip:</strong> Field yang berubah ditandai dengan warna
              merah (sebelum) dan hijau (sesudah)
            </p>
          </div>
        </div>
      )}

      {/* Data Detail - For Tambah/Hapus */}
      {(riwayatData.jenis_perubahan === "Tambah" ||
        riwayatData.jenis_perubahan === "Hapus") && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">
              Data yang{" "}
              {riwayatData.jenis_perubahan === "Tambah"
                ? "Ditambahkan"
                : "Dihapus"}
            </h3>
          </div>

          <dl className="px-6">
            <div className="grid grid-cols-3 py-3 border-b border-gray-100">
              <dt className="font-medium text-gray-700">Nama Pemilik</dt>
              <dd className="col-span-2 text-gray-900">
                {riwayatData.data_sesudah?.nama_pemilik ||
                  riwayatData.data_sebelum?.nama_pemilik}
              </dd>
            </div>
            <div className="grid grid-cols-3 py-3 border-b border-gray-100">
              <dt className="font-medium text-gray-700">Nomor Urut</dt>
              <dd className="col-span-2 text-gray-900">
                {riwayatData.data_sesudah?.nomor_urut ||
                  riwayatData.data_sebelum?.nomor_urut}
              </dd>
            </div>
            <div className="grid grid-cols-3 py-3 border-b border-gray-100">
              <dt className="font-medium text-gray-700">Jumlah Luas (m²)</dt>
              <dd className="col-span-2 text-gray-900">
                {riwayatData.data_sesudah?.jumlah_luas ||
                  riwayatData.data_sebelum?.jumlah_luas}
              </dd>
            </div>
            <div className="grid grid-cols-3 py-3 border-b border-gray-100">
              <dt className="font-medium text-gray-700">Status Hak Tanah</dt>
              <dd className="col-span-2 text-gray-900">
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold">
                  {riwayatData.data_sesudah?.status_hak_tanah ||
                    riwayatData.data_sebelum?.status_hak_tanah}
                </span>
              </dd>
            </div>
            <div className="grid grid-cols-3 py-3 border-b border-gray-100">
              <dt className="font-medium text-gray-700">Penggunaan Tanah</dt>
              <dd className="col-span-2 text-gray-900">
                {(
                  riwayatData.data_sesudah?.penggunaan_tanah ||
                  riwayatData.data_sebelum?.penggunaan_tanah
                )?.join(", ")}
              </dd>
            </div>
            <div className="grid grid-cols-3 py-3 border-b border-gray-100">
              <dt className="font-medium text-gray-700">Keterangan</dt>
              <dd className="col-span-2 text-gray-900">
                {riwayatData.data_sesudah?.keterangan ||
                  riwayatData.data_sebelum?.keterangan ||
                  "-"}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
