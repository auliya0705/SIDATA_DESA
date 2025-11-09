// src/hooks/useProposal.js
"use client";

import { useState, useCallback } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";

/** (opsional) normalisasi status ke label UI */
export function normalizeStatus(s) {
  if (!s) return "PENDING";
  const up = String(s).trim().toUpperCase();
  if (["APPROVED", "DISETUJUI"].includes(up)) return "DISETUJUI";
  if (["REJECTED", "DITOLAK"].includes(up)) return "DITOLAK";
  if (["PENDING", "MENUNGGU", "DRAFT"].includes(up)) return "PENDING";
  return up;
}

function getProposalId(rowOrId) {
  if (rowOrId == null) return null;
  if (typeof rowOrId === "number" || typeof rowOrId === "string")
    return rowOrId;
  return rowOrId.approval_id ?? rowOrId.id ?? rowOrId.target_id ?? null;
}

export function useProposal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Staff: daftar proposal milik saya */
  const getMyProposals = useCallback(
    async ({ page = 1, perPage = 12, filters = {} } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        qs.set("per_page", String(perPage));
        if (filters.q) qs.set("q", filters.q);
        if (filters.status) qs.set("status", filters.status); // approved|rejected|pending
        if (filters.action) qs.set("action", filters.action); // create|update|delete
        if (filters.module) qs.set("module", filters.module); // warga|tanah|bidang
        if (filters.month) qs.set("month", filters.month); // "01".."12"
        if (filters.year) qs.set("year", filters.year); // "2025"

        const url = `${API_ENDPOINTS.STAFF.PROPOSALS.MY}?${qs.toString()}`;
        const res = await apiGet(url);

        return {
          data: res?.data ?? [],
          pagination: {
            current_page: res?.current_page ?? page,
            per_page: res?.per_page ?? perPage,
            total: res?.total ?? 0,
            last_page: res?.last_page ?? 1,
            from: res?.from ?? 0,
            to: res?.to ?? 0,
          },
          raw: res,
        };
      } catch (err) {
        setError(err?.message || "Gagal memuat riwayat proposal saya");
        return { data: [], pagination: null, raw: null };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /** Staff: detail 1 proposal milik saya */
  const getMyProposalById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_ENDPOINTS.STAFF.PROPOSALS.SHOW(id)}?include_payload=1`;
      return await apiGet(url);
    } catch (err) {
      setError(err?.message || "Gagal memuat detail proposal");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Kepala: daftar approval (opsional, untuk page lain) */
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
    try {
      const payload = note ? { note } : null;
      const result = await apiPost(API_ENDPOINTS.PROPOSAL.APPROVE(id), payload);
      return result;
    } catch (err) {
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
          (typeof d.errors === "string" ? d.errors : JSON.stringify(d.errors)),
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
      const result = await apiPost(API_ENDPOINTS.PROPOSAL.REJECT(id), payload);
      return result;
    } catch (err) {
      const d = err?.data || {};
      const pieces = [
        err?.message,
        d?.friendly,
        d?.error,
        d?.errors &&
          (typeof d.errors === "string" ? d.errors : JSON.stringify(d.errors)),
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
    // Kepala (opsional)
    getProposalList,
    getProposalById,
    approveProposal,
    rejectProposal,
    // Staf
    getMyProposals,
    getMyProposalById,
    normalizeStatus,
  };
}