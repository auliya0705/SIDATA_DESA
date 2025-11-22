// src/app/admin/management-tanah/edit-bidang/[tanahId]/[bidangId]/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BidangForm from "@/components/admin/BidangForm";
import AlertDialog from "@/components/ui/AlertDialog";
import { API_ENDPOINTS, getApiUrl } from "@/lib/config";
import { apiGet } from "@/lib/api";

export default function EditBidangTanahPage() {
  const router = useRouter();
  const { tanahId, bidangId } = useParams();

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [detail, setDetail] = useState(null);

  // Dialog states
  const [dialogs, setDialogs] = useState({
    fetchError: false,
    success: false,
    error: false,
  });
  const [dialogMessage, setDialogMessage] = useState("");

  const closeDialog = (dialogName) => {
    setDialogs({ ...dialogs, [dialogName]: false });
  };

  const handleFetchErrorClose = () => {
    closeDialog("fetchError");
    router.push(`/admin/management-tanah/detail/${tanahId}`);
  };

  const handleSuccessClose = () => {
    closeDialog("success");
    router.push(`/admin/management-tanah/detail/${tanahId}`);
  };

  // Fetch detail bidang
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setFetchError("");
      try {
        const data = await apiGet(
          API_ENDPOINTS.STAFF.PROPOSALS.TANAH.BIDANG.SHOW(bidangId)
        );
        if (!alive) return;
        setDetail(data);
      } catch (e) {
        console.error("Fetch detail bidang gagal:", e);
        const errorMsg = e?.message || "Gagal mengambil data bidang";
        setFetchError(errorMsg);
        setDialogMessage(errorMsg);
        setDialogs((prev) => ({ ...prev, fetchError: true }));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [bidangId]);

  // Mapping untuk initialData
  const initialData = useMemo(() => {
    if (!detail) return null;
    return {
      luas_m2: detail?.luas_m2 ?? "",
      status_hak: detail?.status_hak ?? "",
      penggunaan: detail?.penggunaan ?? "",
      keterangan: detail?.keterangan ?? "",
      geojson_nama: detail?.geojson?.nama ?? "",
      geojson: detail?.geojson?.geometry ?? null,
    };
  }, [detail]);

  // Submit proposal UPDATE bidang
  const handleSubmit = async (payload) => {
    try {
      const fields = {
        ...(payload.luas_m2 != null
          ? { luas_m2: Number(payload.luas_m2) }
          : {}),
        ...(payload.status_hak
          ? { status_hak: String(payload.status_hak).toUpperCase() }
          : {}),
        ...(payload.penggunaan
          ? { penggunaan: String(payload.penggunaan).toUpperCase() }
          : {}),
        ...(payload.keterangan ? { keterangan: payload.keterangan } : {}),
      };

      const jsonBody = {
        ...(Object.keys(fields).length ? { fields } : {}),
        ...(payload.geometry
          ? {
              geometry: payload.geometry,
              empat_titik: !!(payload.empat_titik ?? true),
            }
          : {}),
        ...(payload.geojson_nama ? { geojson_nama: payload.geojson_nama } : {}),
        ...(payload.srid ? { srid: payload.srid } : {}),
      };

      const res = await fetch(
        getApiUrl(
          API_ENDPOINTS.STAFF.PROPOSALS.TANAH.BIDANG.UPDATE(bidangId)
        ),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonBody),
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
        "Proposal update bidang berhasil dibuat. Menunggu persetujuan Kepala Desa."
      );
      setDialogs({ ...dialogs, success: true });
    } catch (e) {
      console.error("❌ Update bidang error:", e);
      setDialogMessage(
        "Gagal mengajukan update bidang: " + (e?.message || e)
      );
      setDialogs({ ...dialogs, error: true });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data bidang…</p>
        </div>
      </div>
    );
  }

  if (fetchError || !detail) {
    return (
      <>
        <div className="p-6 bg-white rounded-lg border">
          <p className="text-red-600 font-medium">
            Gagal memuat: {fetchError || "Data kosong"}
          </p>
        </div>

        <AlertDialog
          isOpen={dialogs.fetchError}
          onClose={handleFetchErrorClose}
          title="Gagal Memuat Data"
          message={dialogMessage}
          type="error"
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Edit Data Bidang Tanah — #{detail?.id}
        </h2>
      </div>

      <BidangForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={false}
      />

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
        title="Gagal Update Bidang"
        message={dialogMessage}
        type="error"
      />
    </div>
  );
}
