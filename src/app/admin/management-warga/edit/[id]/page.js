// src/app/admin/management-warga/edit/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import WargaForm from "@/components/admin/WargaForm";
import { useWarga } from "@/hooks/useWarga";
import { API_ENDPOINTS, getApiUrl } from "@/lib/config";

export default function EditWargaPage() {
  const params = useParams();
  const router = useRouter();
  const { loading: hookLoading, getWargaById, checkNikUnique } = useWarga();

  const [wargaData, setWargaData] = useState(null);
  const [originalNik, setOriginalNik] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadWargaData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const loadWargaData = async () => {
    try {
      const data = await getWargaById(params.id);
      const tanggal = data.tanggal_lahir ? String(data.tanggal_lahir).split("T")[0] : "";

      setWargaData({
        nama_lengkap: data.nama_lengkap ?? "",
        jenis_kelamin: data.jenis_kelamin ?? "",
        nik: data.nik ?? "",
        tempat_lahir: data.tempat_lahir ?? "",
        tanggal_lahir: tanggal,
        agama: data.agama ?? "",
        status_perkawinan: data.status_perkawinan ?? "",
        pendidikan_terakhir: data.pendidikan_terakhir ?? "",
        pekerjaan: data.pekerjaan ?? "",
        kewarganegaraan: data.kewarganegaraan ?? "WNI",
        alamat_lengkap: data.alamat_lengkap ?? "",
        keterangan: data.keterangan ?? "",
        foto_ktp_existing: data.foto_ktp ?? null,
      });
      setOriginalNik(data.nik ?? "");
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
      // Pre-check NIK jika berubah
      const nikNow = String(formData.nik || "").trim();
      if (nikNow && nikNow !== String(originalNik || "").trim()) {
        const { exists, conflictId } = await checkNikUnique(nikNow, params.id);
        if (exists) {
          alert(
            `NIK ${nikNow} sudah dipakai oleh warga lain` +
              (conflictId ? ` (ID ${conflictId})` : "") +
              `. Gunakan NIK lain atau batalkan perubahan NIK.`
          );
          return;
        }
      }

      // Build FormData + _method=PATCH
      const fd = new FormData();
      fd.append("_method", "PATCH");

      Object.keys(formData).forEach((key) => {
        if (key === "foto_ktp" && formData[key]) {
          fd.append("foto_ktp", formData[key]);
        } else if (key !== "foto_ktp_existing" && formData[key] !== null && formData[key] !== undefined) {
          fd.append(key, formData[key]);
        }
      });

      // Endpoint UPDATE proposal (mengandung {id})
      const endpoint = API_ENDPOINTS.STAFF.PROPOSALS.WARGA.UPDATE(params.id);
      const url = getApiUrl(endpoint);

      const res = await fetch(url, {
        method: "POST", // POST + _method=PATCH → Laravel routes:patch(...)
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          Accept: "application/json",
          // (Jangan set Content-Type supaya boundary FormData otomatis)
        },
        body: fd,
      });

      const ctype = res.headers.get("content-type") || "";
      const text = await res.text();

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        if (ctype.includes("application/json")) {
          try {
            const j = JSON.parse(text);
            msg = j.message || j.error || msg;
          } catch {}
        } else {
          msg = `${res.status}: ${res.statusText}`;
        }
        throw new Error(msg);
      }

      if (!ctype.includes("application/json")) {
        throw new Error("Server mengembalikan non-JSON (kemungkinan redirect/HTML).");
      }

      alert("Proposal perubahan berhasil dibuat! Menunggu persetujuan Kepala Desa.");
      router.push("/admin/management-warga");
    } catch (err) {
      console.error("Edit error:", err);
      alert("Gagal membuat proposal: " + err.message);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Data Warga</h1>
          <p className="text-sm text-gray-600 mt-1">
            Perubahan akan dikirim sebagai proposal dan menunggu persetujuan Kepala Desa
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

      <WargaForm mode="edit" initialData={wargaData} onSubmit={handleSubmit} loading={submitting} />
    </div>
  );
}
