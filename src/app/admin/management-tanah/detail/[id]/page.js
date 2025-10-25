"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Edit, Trash2, Download } from "lucide-react";
import Link from "next/link";

export default function DetailTanahOwnerPage() {
  const params = useParams();
  const router = useRouter();
  const [ownerData, setOwnerData] = useState(null);
  const [bidangList, setBidangList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch data from API
    setTimeout(() => {
      setOwnerData({
        id: params.id,
        nama_pemilik: "Muhammad Vendra Hastagiyan",
        total_luas: 360,
        jumlah_bidang: 3,
      });

      setBidangList([
        {
          id: 1,
          nomor_urut: 1,
          luas: 120,
          status_hak: "HM",
          penggunaan: "Sawah",
          keterangan: "-",
        },
        {
          id: 2,
          nomor_urut: 5,
          luas: 120,
          status_hak: "HM",
          penggunaan: "Tegalan",
          keterangan: "-",
        },
        {
          id: 3,
          nomor_urut: 6,
          luas: 120,
          status_hak: "HGB",
          penggunaan: "Perumahan",
          keterangan: "Rumah tinggal",
        },
      ]);

      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleDeleteBidang = (bidangId) => {
    if (confirm("Yakin ingin menghapus bidang tanah ini?")) {
      // TODO: Implement delete API
      setBidangList(bidangList.filter((b) => b.id !== bidangId));
      alert("Bidang tanah berhasil dihapus!");
    }
  };

  const handleExport = () => {
    alert("Fitur ekspor data akan segera tersedia");
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Management Tanah</h1>
          <p className="text-sm text-gray-500">
            Dashboard / Management Tanah / Detail
          </p>
        </div>
        <Link
          href="/admin/management-tanah"
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Owner Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {ownerData.nama_pemilik}
            </h2>
            <div className="flex gap-6 text-sm text-gray-600">
              <div>
                <span className="font-medium">Total Luas:</span>{" "}
                <span className="text-gray-900">{ownerData.total_luas} m²</span>
              </div>
              <div>
                <span className="font-medium">Jumlah Bidang:</span>{" "}
                <span className="text-gray-900">
                  {ownerData.jumlah_bidang} bidang
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

      {/* Add Bidang Button */}
      <div className="flex justify-end">
        <Link
          href={`/admin/management-tanah/tambah-bidang/${params.id}`}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Bidang Tanah</span>
        </Link>
      </div>

      {/* Title */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Data Bidang Tanah {ownerData.nama_pemilik}
        </h3>
      </div>

      {/* Bidang Table */}
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
                Luas (m²)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Status Hak Tanah
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Penggunaan Tanah
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Keterangan
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bidangList.map((bidang, index) => (
              <tr key={bidang.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {bidang.nomor_urut}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {bidang.luas} m²
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold">
                    {bidang.status_hak}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {bidang.penggunaan}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {bidang.keterangan}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/management-tanah/edit-bidang/${params.id}/${bidang.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteBidang(bidang.id)}
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

      {/* Empty State */}
      {bidangList.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">Belum ada data bidang tanah</p>
          <Link
            href={`/admin/management-tanah/tambah-bidang/${params.id}`}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
          >
            <Plus size={18} />
            <span>Tambah Bidang Pertama</span>
          </Link>
        </div>
      )}
    </div>
  );
}
