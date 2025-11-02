"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TanahForm from "@/components/admin/TanahForm";

export default function CreateTanahPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      // --- Bentuk payload sesuai backend proposal Tanah ---
      // Ambil penggunaan pertama (sementara 1 bidang)
      const penggunaanSelected =
        (formData.penggunaan_tanah?.[0] || "").toUpperCase().replaceAll(" ", "_") || "LAIN_LAIN";

      // Bungkus geometry → Feature (opsional)
      const feature =
        formData.geojson && formData.geojson.type === "Polygon"
          ? { type: "Feature", properties: {}, geometry: formData.geojson }
          : null;

      const payload = {
        ...(formData.nomor_urut ? { nomor_urut: String(formData.nomor_urut) } : {}),
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

      // --- POST JSON via Next rewrite proxy (/api → Laravel) ---
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
            // Flatten validation errors jika ada
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
          msg = raw?.trim() ? raw.slice(0, 300) : `${res.status}: ${res.statusText}`;
        }
        throw new Error(msg);
      }

      // Sukses (optional parse)
      if (contentType.includes("application/json")) {
        // const result = JSON.parse(raw);
      }

      alert("Proposal tanah berhasil dibuat! Menunggu persetujuan Kepala Desa.");
      router.push("/admin/management-tanah");
    } catch (err) {
      console.error("❌ Create tanah error:", err);
      alert("Gagal membuat proposal tanah: " + (err?.message || String(err)));
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
            Data akan dikirim sebagai proposal dan menunggu persetujuan Kepala Desa
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
    </div>
  );
}
