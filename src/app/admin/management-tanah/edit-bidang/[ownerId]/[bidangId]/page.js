"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TanahForm from "@/components/admin/TanahForm";

export default function EditBidangTanahPage() {
  const params = useParams();
  const [bidangData, setBidangData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch data from API
    setTimeout(() => {
      setBidangData({
        nama_pemilik: "Muhammad Vendra Hastagiyan",
        nomor_urut: "1",
        jumlah_luas: "120",
        status_hak_tanah: "HM",
        penggunaan_tanah: ["sawah"],
        keterangan: "",
      });
      setLoading(false);
    }, 500);
  }, [params.bidangId]);

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
        <h2 className="text-xl font-semibold text-gray-800">
          Edit Data Bidang Tanah
        </h2>
      </div>

      {/* Form */}
      <TanahForm
        mode="edit"
        isIdentitasReadOnly={true}
        initialData={bidangData}
      />
    </div>
  );
}
