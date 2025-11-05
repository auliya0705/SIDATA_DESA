"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TanahForm from "@/components/admin/TanahForm";
import AlertDialog from "@/components/ui/AlertDialog";

export default function CreateTanahPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [dialogs, setDialogs] = useState({
    success: false,
    error: false,
  });
  const [dialogMessage, setDialogMessage] = useState("");

  const closeDialog = (dialogName) => {
    setDialogs({ ...dialogs, [dialogName]: false });
  };

  const handleSuccessClose = () => {
    closeDialog("success");
    router.push("/admin/management-tanah");
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      // Bentuk payload sesuai backend proposal Tanah
      const penggunaanSelected =
        (formData.penggunaan_tanah?.[0] || "")
          .toUpperCase()
          .replaceAll(" ", "_") || "LAIN_LAIN";

      const feature =
        formData.geojson && formData.geojson.type === "Polygon"
          ? { type: "Feature", properties: {}, geometry: formData.geojson }
          : null;

      const payload = {
        ...(formData.nomor_urut
          ? { nomor_urut: String(formData.nomor_urut) }
          : {}),
        warga_id: Number(formData.warga_id),
        keterangan: formData.keterangan || "",
        bidang: [
          {
            luas_m2: Number(formData.luas_m2),
            status_hak: formData.status_hak_tanah,
            penggunaan: penggunaanSelected,
            keterangan: "bidang utama",
            ...(feature ? { geojson_feature: feature } : {}),
          },
        ],
      };

      const res = await fetch("/api/staff/proposals/tanah", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";
      const raw = await res.text();

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        if (contentType.includes("application/json")) {
          try {
            const data = JSON.parse(raw);
            if (data?.errors) {
              const flat = Object.entries(data.errors)
                .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
                .join("; ");
              msg = data.message ? `${data.message} — ${flat}` : flat || msg;
            } else {
              msg = data.message || data.error || msg;
            }
          } catch {
            msg = `${res.status}: ${res.statusText}`;
          }
        } else {
          msg = raw?.trim()
            ? raw.slice(0, 300)
            : `${res.status}: ${res.statusText}`;
        }
        throw new Error(msg);
      }

      setDialogMessage(
        "Proposal tanah berhasil dibuat! Menunggu persetujuan Kepala Desa."
      );
      setDialogs({ ...dialogs, success: true });
    } catch (err) {
      console.error("❌ Create tanah error:", err);
      setDialogMessage(
        "Gagal membuat proposal tanah: " + (err?.message || String(err))
      );
      setDialogs({ ...dialogs, error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Input Data Tanah</h1>
          <p className="text-sm text-gray-600 mt-1">
            Data akan dikirim sebagai proposal dan menunggu persetujuan Kepala
            Desa
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

      {/* Form */}
      <TanahForm mode="create" onSubmit={handleSubmit} loading={loading} />

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
