"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import WargaForm from "@/components/admin/WargaForm";
import { useWarga } from "@/hooks/useWarga";

export default function EditWargaPage() {
  const params = useParams();
  const router = useRouter();
  const { loading: hookLoading, getWargaById } = useWarga();

  const [wargaData, setWargaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadWargaData();
  }, [params.id]);

  const loadWargaData = async () => {
    try {
      const data = await getWargaById(params.id);

      // Format data for form
      const formattedData = {
        nama_lengkap: data.nama_lengkap,
        jenis_kelamin: data.jenis_kelamin,
        nik: data.nik,
        tempat_lahir: data.tempat_lahir,
        tanggal_lahir: data.tanggal_lahir?.split("T")[0], // Convert ISO to YYYY-MM-DD
        agama: data.agama,
        status_perkawinan: data.status_perkawinan,
        pendidikan_terakhir: data.pendidikan_terakhir,
        pekerjaan: data.pekerjaan,
        kewarganegaraan: data.kewarganegaraan,
        alamat_lengkap: data.alamat_lengkap,
        keterangan: data.keterangan,
        foto_ktp_existing: data.foto_ktp, // Existing photo path
      };

      setWargaData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load warga data:", err);
      alert("Gagal memuat data warga: " + err.message);
      router.push("/admin/management-warga");
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Add warga_id for edit proposal
      submitData.append("warga_id", params.id);

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "foto_ktp" && formData[key]) {
          // New file upload
          submitData.append(key, formData[key]);
        } else if (
          key !== "foto_ktp_existing" &&
          formData[key] !== null &&
          formData[key] !== undefined
        ) {
          submitData.append(key, formData[key]);
        }
      });

      // Call API - This creates an EDIT PROPOSAL
      const response = await fetch(
        "http://127.0.0.1:8000/api/staff/proposals/warga",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: submitData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat proposal");
      }

      const result = await response.json();

      alert(
        "Proposal perubahan berhasil dibuat! Menunggu persetujuan Kepala Desa."
      );
      router.push("/admin/management-warga");
    } catch (error) {
      console.error("Edit error:", error);
      alert("Gagal membuat proposal: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || hookLoading) {
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
          <h1 className="text-2xl font-bold text-gray-800">Edit Data Warga</h1>
          <p className="text-sm text-gray-600 mt-1">
            Perubahan akan dikirim sebagai proposal dan menunggu persetujuan
            Kepala Desa
          </p>
        </div>
        <Link
          href="/admin/management-warga"
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Form */}
      <WargaForm
        mode="edit"
        initialData={wargaData}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </div>
  );
}
