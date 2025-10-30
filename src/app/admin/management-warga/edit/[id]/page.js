"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WargaForm from "@/components/admin/WargaForm";

export default function EditWargaPage() {
  const params = useParams();
  const [wargaData, setWargaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch data from API based on params.id
    // Simulate API call
    setTimeout(() => {
      setWargaData({
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
        alamat_lengkap: "Jl. Sains kali ya",
        nomor_ktp: "3300000007000000",
        catatan: "",
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

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800">Edit Data</h2>
      </div>

      {/* Form */}
      <WargaForm mode="edit" initialData={wargaData} />
    </div>
  );
}
