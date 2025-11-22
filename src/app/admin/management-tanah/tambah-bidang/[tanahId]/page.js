// src/app/admin/management-tanah/tambah-bidang/[tanahId]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BidangForm from "@/components/admin/BidangForm";
import AlertDialog from "@/components/ui/AlertDialog";
import { API_ENDPOINTS, getApiUrl } from "@/lib/config";

export default function TambahBidangTanahPage() {
  const params = useParams();
  const router = useRouter();
  const tanahIdRaw = params?.tanahId;
  const tanahId = Number(tanahIdRaw);

  const [ownerName, setOwnerName] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [dialogs, setDialogs] = useState({
    invalidId: false,
    success: false,
    error: false,
  });
  const [dialogMessage, setDialogMessage] = useState("");

  const closeDialog = (dialogName) => {
    setDialogs({ ...dialogs, [dialogName]: false });
  };

  const handleInvalidIdClose = () => {
    closeDialog("invalidId");
    router.push("/admin/management-tanah");
  };

  const handleSuccessClose = () => {
    closeDialog("success");
    router.push(`/admin/management-tanah/detail/${tanahId}`);
  };

  // Safety guard
  useEffect(() => {
    if (!tanahId || Number.isNaN(tanahId) || tanahId <= 0) {
      setDialogMessage("Parameter id tanah tidak valid.");
      setDialogs((prev) => ({ ...prev, invalidId: true }));
    }
  }, [tanahId]);

  // Fetch owner name
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(
          getApiUrl(API_ENDPOINTS.TANAH.SHOW(tanahId)),
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
              Accept: "application/json",
            },
          }
        );
        const ct = res.headers.get("content-type") || "";
        const raw = await res.text();
        if (!res.ok) throw new Error(raw || `HTTP ${res.status}`);
        const data = ct.includes("application/json") ? JSON.parse(raw) : null;
        if (alive) {
          setOwnerName(
            data?.pemilik?.nama_lengkap ||
              data?.pemilik_nama ||
              "(Tanpa nama)"
          );
        }
      } catch (e) {
        console.error("Gagal fetch detail tanah:", e);
        if (alive) setOwnerName("(Tanpa nama)");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [tanahId]);

  const handleSubmit = async (payload) => {
    try {
      const res = await fetch(
        getApiUrl(
          API_ENDPOINTS.STAFF.PROPOSALS.TANAH.BIDANG.CREATE(tanahId)
        ),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

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

      setDialogMessage(
        "Pengajuan bidang berhasil dibuat. Menunggu persetujuan Kepala Desa."
      );
      setDialogs({ ...dialogs, success: true });
    } catch (e) {
      console.error("Pengajuan bidang gagal:", e);
      setDialogMessage("Gagal mengajukan bidang: " + e.message);
      setDialogs({ ...dialogs, error: true });
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

      {/* Form */}
      <BidangForm onSubmit={handleSubmit} />

      {/* Custom Dialogs */}
      <AlertDialog
        isOpen={dialogs.invalidId}
        onClose={handleInvalidIdClose}
        title="Error"
        message={dialogMessage}
        type="error"
      />

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
        title="Gagal Mengajukan Bidang"
        message={dialogMessage}
        type="error"
      />
    </div>
  );
}
