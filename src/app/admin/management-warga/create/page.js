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
      // --- Build FormData for upload ---
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "foto_ktp" && formData[key]) {
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

      // --- POST request tanpa Content-Type manual (biar browser set boundary otomatis) ---
      const response = await fetch("/api/staff/proposals/warga", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          Accept: "application/json", // <- penting agar Laravel balas JSON
        },
        body: submitData,
      });

      // --- Deteksi tipe response ---
      const contentType = response.headers.get("content-type") || "";
      const responseText = await response.text();

      if (!response.ok) {
        // Error: parse JSON kalau bisa
        let msg = `HTTP ${response.status}`;
        if (contentType.includes("application/json")) {
          try {
            const data = JSON.parse(responseText);
            msg = data.message || data.error || msg;
          } catch (_) {
            msg = `${response.status}: ${response.statusText}`;
          }
        } else {
          msg = `${response.status}: ${response.statusText}`;
        }
        throw new Error(msg);
      }

      // --- Hanya parse JSON jika benar-benar JSON ---
      let result;
      if (contentType.includes("application/json")) {
        result = JSON.parse(responseText);
      } else {
        throw new Error(
          "Server mengembalikan non-JSON (kemungkinan halaman HTML redirect atau error)."
        );
      }

      // --- Success ---
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
