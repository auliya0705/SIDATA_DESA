"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function DetailWargaPage() {
  const params = useParams();
  const router = useRouter();
  const [wargaData, setWargaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch data from API based on params.id
    // Simulate API call
    setTimeout(() => {
      setWargaData({
        id: params.id,
        nama_lengkap: "Muhammad Vendra Hastagiyan",
        jenis_kelamin: "Laki-laki",
        status_perkawinan: "Menikah",
        tempat_lahir: "Semarang",
        tanggal_lahir: "11-02-2005",
        agama: "Islam",
        pendidikan_terakhir: "S1",
        pekerjaan: "Mahasiswa",
        kewarganegaraan: "WNI",
        kedudukan_keluarga: "Kepala Keluarga",
        alamat_lengkap:
          "Jl. Sains kali ya, RT 04/RW 02, Desa Banyubiru, Kec. Banyubiru, Kab. Semarang",
        nomor_ktp: "3300000070000000",
        catatan: "Tidak ada catatan khusus",
      });
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleDelete = () => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      // TODO: Implement delete API call
      alert("Data berhasil dihapus!");
      router.push("/admin/management-warga");
    }
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

  const DetailRow = ({ label, value }) => (
    <div className="grid grid-cols-3 py-3 border-b border-gray-100">
      <dt className="font-medium text-gray-700">{label}</dt>
      <dd className="col-span-2 text-gray-900">{value || "-"}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Detail Penduduk</h1>
        </div>
        <Link
          href="/admin/management-warga"
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          href={`/admin/management-warga/edit/${params.id}`}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          <Edit size={18} />
          <span>Edit Data</span>
        </Link>
        <button
          onClick={handleDelete}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 size={18} />
          <span>Hapus Data</span>
        </button>
      </div>

      {/* Detail Card - Identitas Dasar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-teal-700 text-white px-6 py-4">
          <h3 className="text-lg font-semibold">Identitas Dasar</h3>
        </div>
        <dl className="px-6">
          <DetailRow label="Nama Lengkap" value={wargaData.nama_lengkap} />
          <DetailRow label="Jenis Kelamin" value={wargaData.jenis_kelamin} />
          <DetailRow
            label="Status Perkawinan"
            value={wargaData.status_perkawinan}
          />
          <DetailRow
            label="Tempat, Tanggal Lahir"
            value={`${wargaData.tempat_lahir}, ${wargaData.tanggal_lahir}`}
          />
        </dl>
      </div>

      {/* Detail Card - Agama, Pendidikan, Pekerjaan */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-teal-700 text-white px-6 py-4">
          <h3 className="text-lg font-semibold">
            Agama, Pendidikan & Pekerjaan
          </h3>
        </div>
        <dl className="px-6">
          <DetailRow label="Agama" value={wargaData.agama} />
          <DetailRow
            label="Pendidikan Terakhir"
            value={wargaData.pendidikan_terakhir}
          />
          <DetailRow label="Pekerjaan" value={wargaData.pekerjaan} />
        </dl>
      </div>

      {/* Detail Card - Kependudukan dan Alamat */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-teal-700 text-white px-6 py-4">
          <h3 className="text-lg font-semibold">Kependudukan dan Alamat</h3>
        </div>
        <dl className="px-6">
          <DetailRow
            label="Kewarganegaraan"
            value={wargaData.kewarganegaraan}
          />
          <DetailRow
            label="Kedudukan dalam Keluarga"
            value={wargaData.kedudukan_keluarga}
          />
          <DetailRow label="Nomor KTP (NIK)" value={wargaData.nomor_ktp} />
          <DetailRow label="Alamat Lengkap" value={wargaData.alamat_lengkap} />
        </dl>
      </div>

      {/* Detail Card - Catatan */}
      {wargaData.catatan && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">Catatan</h3>
          </div>
          <div className="px-6 py-4">
            <p className="text-gray-900 whitespace-pre-wrap">
              {wargaData.catatan}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
