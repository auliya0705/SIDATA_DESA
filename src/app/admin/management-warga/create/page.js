// src/app/admin/management-warga/create/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import WargaForm from "@/components/admin/WargaForm";
import AlertDialog from "@/components/ui/AlertDialog";
import { API_ENDPOINTS, getApiUrl } from "@/lib/config";

export default function CreateWargaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Dialog states - FIXED: Use function setState
  const [dialogs, setDialogs] = useState({
    success: false,
    error: false,
  });
  const [dialogMessage, setDialogMessage] = useState("");

  // FIXED: Use function setState
  const closeDialog = (dialogName) => {
    setDialogs((prev) => ({ ...prev, [dialogName]: false }));
  };

  const handleSuccessClose = () => {
    closeDialog("success");
    router.push("/admin/management-warga");
  };

  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      // Build FormData for upload
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

      // POST request without manual Content-Type (let browser set boundary)
      const response = await fetch(
        getApiUrl(API_ENDPOINTS.STAFF.PROPOSALS.WARGA.CREATE),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            Accept: "application/json",
          },
          body: submitData,
        }
      );

      // Detect response type
      const contentType = response.headers.get("content-type") || "";
      const responseText = await response.text();

      if (!response.ok) {
        // Error: parse JSON if possible
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

      // Only parse JSON if it's actually JSON
      let result;
      if (contentType.includes("application/json")) {
        result = JSON.parse(responseText);
      } else {
        throw new Error(
          "Server mengembalikan non-JSON (kemungkinan halaman HTML redirect atau error)."
        );
      }

      // Success - FIXED: Use function setState
      setDialogMessage(
        "Proposal warga berhasil dibuat! Menunggu persetujuan Kepala Desa."
      );
      setDialogs((prev) => ({ ...prev, success: true }));
    } catch (error) {
      console.error("❌ Create error:", error);
      setDialogMessage("Gagal membuat proposal: " + error.message);
      setDialogs((prev) => ({ ...prev, error: true }));
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

      {/* Custom Dialogs */}
      <AlertDialog
        isOpen={dialogs.success}
        onClose={handleSuccessClose}
        title="Berhasil!"
        message={dialogMessage}
        type="success"
      />

      <AlertDialog
        isOpen={dialogs.error}
        onClose={() => closeDialog("error")}
        title="Gagal Membuat Proposal"
        message={dialogMessage}
        type="error"
      />
    </div>
  );
}
