"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import WargaForm from "@/components/admin/WargaForm";

export default function CreateWargaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Append all form fields (skip empty values)
      Object.keys(formData).forEach((key) => {
        if (key === "foto_ktp" && formData[key]) {
          // File upload
          submitData.append(key, formData[key]);
        } else if (
          key !== "foto_ktp_existing" &&
          formData[key] !== null &&
          formData[key] !== undefined &&
          formData[key] !== ""
        ) {
          submitData.append(key, formData[key]);
        }
      });

      // Call API - This creates a PROPOSAL
      // Don't set Content-Type header - browser will auto-set with boundary
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

      // Get response as text first to handle HTML error pages
      const responseText = await response.text();

      if (!response.ok) {
        // Try to parse as JSON for error message
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If not JSON (HTML error page), show status
          errorMessage = `${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Parse successful response
      const result = JSON.parse(responseText);

      alert(
        "Proposal warga berhasil dibuat! Menunggu persetujuan Kepala Desa."
      );
      router.push("/admin/management-warga");
    } catch (error) {
      console.error("❌ Create error:", error);
      alert("Gagal membuat proposal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Tambah Penduduk Baru
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Data akan dikirim sebagai proposal dan menunggu persetujuan Kepala
            Desa
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
      <WargaForm mode="create" onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
