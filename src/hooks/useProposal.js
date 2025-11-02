// src/hooks/useProposal.js
"use client";

import { useState, useCallback } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";

/** Normalisasi status agar konsisten di UI (opsional) */
export function normalizeStatus(s) {
  if (!s) return "PENDING";
  const up = String(s).trim().toUpperCase();
  if (["APPROVED", "DISETUJUI"].includes(up)) return "DISETUJUI";
  if (["REJECTED", "DITOLAK"].includes(up)) return "DITOLAK";
  if (["PENDING", "MENUNGGU", "DRAFT"].includes(up)) return "PENDING";
  return up;
}

// Helper id (boleh kirim row atau id)
function getProposalId(rowOrId) {
  if (rowOrId == null) return null;
  if (typeof rowOrId === "number" || typeof rowOrId === "string") return rowOrId;
  return rowOrId.approval_id ?? rowOrId.id ?? rowOrId.target_id ?? null;
}

export function useProposal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProposalList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams(params).toString();
      const endpoint = qs
        ? `${API_ENDPOINTS.PROPOSAL.LIST}?${qs}`
        : API_ENDPOINTS.PROPOSAL.LIST;
      return await apiGet(endpoint);
    } catch (err) {
      setError(err.message || "Gagal memuat daftar proposal");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProposalById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      // panggil SHOW kalau ada di backend
      return await apiGet(API_ENDPOINTS.PROPOSAL.SHOW(id));
    } catch (err) {
      setError(err.message || "Gagal memuat detail proposal");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveProposal = useCallback(async (rowOrId, note) => {
    setLoading(true);
    setError(null);
    const id = getProposalId(rowOrId);
    console.log(
      "🟢 Approve → id:",
      id,
      "endpoint:",
      API_ENDPOINTS.PROPOSAL.APPROVE(id),
      "row:",
      rowOrId
    );
    try {
      const payload = note ? { note } : null; // body opsional
      return await apiPost(API_ENDPOINTS.PROPOSAL.APPROVE(id), payload);
    } catch (err) {
      // Gabungkan pesan FE + payload error dari backend
      const d = err?.data || {};
      const pieces = [
        err?.message,
        d?.friendly,
        d?.error,
        d?.apply_error &&
          (typeof d.apply_error === "string"
            ? d.apply_error
            : JSON.stringify(d.apply_error)),
        d?.errors &&
          (typeof d.errors === "string"
            ? d.errors
            : JSON.stringify(d.errors)),
      ].filter(Boolean);
      const msg = pieces.join("\n— ");
      setError(msg || "Gagal menyetujui proposal");
      throw new Error(msg || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectProposal = useCallback(async (rowOrId, reason) => {
    setLoading(true);
    setError(null);
    const id = getProposalId(rowOrId);
    try {
      const payload = reason ? { reason } : null;
      return await apiPost(API_ENDPOINTS.PROPOSAL.REJECT(id), payload);
    } catch (err) {
      const d = err?.data || {};
      const pieces = [
        err?.message,
        d?.friendly,
        d?.error,
        d?.errors &&
          (typeof d.errors === "string"
            ? d.errors
            : JSON.stringify(d.errors)),
      ].filter(Boolean);
      const msg = pieces.join("\n— ");
      setError(msg || "Gagal menolak proposal");
      throw new Error(msg || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getProposalList,
    getProposalById,
    approveProposal,
    rejectProposal,
    normalizeStatus,
  };
}
