"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BidangForm from "@/components/admin/BidangForm";

export default function TambahBidangTanahPage() {
  const params = useParams();
  const router = useRouter();
  const tanahIdRaw = params?.tanahId;
  const tanahId = Number(tanahIdRaw);

  const [ownerName, setOwnerName] = useState("");
  const [loading, setLoading] = useState(true);

  // Safety guard: param wajib angka valid
  useEffect(() => {
    if (!tanahId || Number.isNaN(tanahId) || tanahId <= 0) {
      alert("Parameter id tanah tidak valid.");
      router.push("/admin/management-tanah");
    }
  }, [tanahId, router]);

  // Ambil nama pemilik untuk header
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/tanah/${tanahId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            Accept: "application/json",
          },
        });
        const ct = res.headers.get("content-type") || "";
        const raw = await res.text();
        if (!res.ok) throw new Error(raw || `HTTP ${res.status}`);
        const data = ct.includes("application/json") ? JSON.parse(raw) : null;
        if (alive) {
          setOwnerName(data?.pemilik?.nama_lengkap || data?.pemilik_nama || "(Tanpa nama)");
        }
      } catch (e) {
        console.error("Gagal fetch detail tanah:", e);
        if (alive) setOwnerName("(Tanpa nama)");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [tanahId]);

  // Submit payload bidang → selalu kirim ke /staff/proposals/tanah/{tanahId}/bidang
  const handleSubmit = async (payload) => {
    try {
      const res = await fetch(`/api/staff/proposals/tanah/${tanahId}/bidang`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get("content-type") || "";
      const raw = await res.text();

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        if (ct.includes("application/json")) {
          try {
            const data = JSON.parse(raw);
            msg = data?.message || data?.error || msg;
          } catch {}
        } else if (raw?.trim()) {
          msg = raw.slice(0, 300);
        }
        throw new Error(msg);
      }

      alert("Pengajuan bidang berhasil dibuat. Menunggu persetujuan Kepala Desa.");
      // balik ke detail tanah
      router.push(`/admin/management-tanah/detail/${tanahId}`);
    } catch (e) {
      console.error("Pengajuan bidang gagal:", e);
      alert(`Gagal mengajukan bidang: ${e.message}`);
    }
  };

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
      {/* Title */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Tambah Bidang Tanah — {ownerName}
        </h2>
      </div>

      {/* Form bidang (tanpa identitas dasar) */}
      <BidangForm onSubmit={handleSubmit} />
    </div>
  );
}
