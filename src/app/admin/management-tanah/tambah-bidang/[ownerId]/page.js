"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TanahForm from "@/components/admin/TanahForm";

export default function TambahBidangTanahPage() {
  const params = useParams();
  const [ownerName, setOwnerName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch owner name from API
    setTimeout(() => {
      setOwnerName("Muhammad Vendra Hastagiyan");
      setLoading(false);
    }, 500);
  }, [params.ownerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Management Tanah</h1>
        <p className="text-sm text-gray-500">
          Dashboard / Management Tanah / Tambah Bidang
        </p>
      </div>

      {/* Title */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Tambah Bidang Tanah - {ownerName}
        </h2>
      </div>

      {/* Form */}
      <TanahForm
        mode="create"
        initialData={{
          nama_pemilik: ownerName,
          nomor_urut: "",
          jumlah_luas: "",
          status_hak_tanah: "",
          penggunaan_tanah: [],
          keterangan: "",
        }}
      />
    </div>
  );
}
