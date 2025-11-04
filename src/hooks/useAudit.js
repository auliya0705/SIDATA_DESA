// src/hooks/useAudit.js
"use client";

import { useState, useCallback } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";

/** util: ringkas item untuk UI */
function normalizeItemKepala(it) {
  const submittedAt = it.submitted_at || it.created_at || it.reviewed_at || null;
  return {
    id: it.id,
    module: it.module,             // "warga" | "tanah" | "bidang"
    action: it.action,             // "create" | "update" | "delete"
    status: it.status,             // "approved" | "rejected" | "pending"
    submitted_at: submittedAt,
    created_at: it.created_at ?? null,
    reviewed_at: it.reviewed_at ?? null,
    submitted_by: it.submitted_by || (it.submitted_by_name ? { name: it.submitted_by_name } : null),
  };
}

function normalizeItemStaff(it) {
  const payload = it?.payload || {};
  const pv = payload?.preview_pemilik || {};
  const submittedAt = it.submitted_at || it.created_at || it.reviewed_at || null;
  return {
    id: it.id,
    module: it.module,
    action: it.action,
    status: it.status,
    submitted_at: submittedAt,
    created_at: it.created_at ?? null,
    reviewed_at: it.reviewed_at ?? null,
    // nama tampil
    pemilik_name: pv?.nama || it.submitted_by?.name || it.submitted_by_name || "-",
  };
}

function computeStats(items = []) {
  const by_action = { create: 0, update: 0, delete: 0 };
  for (const it of items) {
    if (by_action[it.action] != null) by_action[it.action] += 1;
  }
  return { total: items.length, by_action };
}

/** Untuk KEPALA: audit seluruh staf */
export function useAuditKepala() {
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(null);
  const [result,  setResult]    = useState(null);

  const fetchAudit = useCallback(
    async ({ page = 1, perPage = 12, filters = {} } = {}) => {
      setLoading(true);
      setError(null);

      try {
        // ========= panggilan halaman aktif =========
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        qs.set("per_page", String(perPage));
        if (filters.q)       qs.set("q", filters.q);
        if (filters.status)  qs.set("status", filters.status);
        if (filters.action)  qs.set("action", filters.action);
        if (filters.module)  qs.set("module", filters.module);
        if (filters.month)   qs.set("month", filters.month);
        if (filters.year)    qs.set("year",  filters.year);

        const urlPage = `${API_ENDPOINTS.PROPOSAL.AUDIT}?${qs.toString()}`;
        const resPage = await apiGet(urlPage);

        const itemsPage = (resPage?.data || []).map(normalizeItemKepala);
        const pagination = {
          current_page: resPage?.current_page ?? page,
          per_page:     resPage?.per_page ?? perPage,
          total:        resPage?.total ?? itemsPage.length,
          last_page:    resPage?.last_page ?? Math.max(1, Math.ceil((resPage?.total ?? itemsPage.length) / (resPage?.per_page ?? perPage))),
          from:         resPage?.from ?? 1,
          to:           resPage?.to ?? itemsPage.length,
        };

        // ========= summary total dari server kalau ada (prefer) =========
        let stats = null;
        const summary = resPage?.summary || resPage?.stats;
        if (summary && typeof summary === "object") {
          stats = {
            total: summary.total ?? (summary.create + summary.update + summary.delete),
            by_action: {
              create: summary.create ?? 0,
              update: summary.update ?? 0,
              delete: summary.delete ?? 0,
            },
          };
        } else {
          // kalau server tidak kirim summary → tarik semua (hard cap) lalu hitung
          try {
            const perAll = Math.min(2000, pagination.total || 2000);
            const qsAll  = new URLSearchParams(qs);
            qsAll.set("page", "1");
            qsAll.set("per_page", String(perAll));
            const resAll = await apiGet(`${API_ENDPOINTS.PROPOSAL.AUDIT}?${qsAll.toString()}`);
            const itemsAll = (resAll?.data || []).map(normalizeItemKepala);
            stats = computeStats(itemsAll);
          } catch {
            stats = computeStats(itemsPage); // fallback
          }
        }

        const packed = { data: itemsPage, pagination, stats, raw: resPage };
        setResult(packed);
        return packed;
      } catch (err) {
        const msg = err?.message || "Gagal memuat riwayat";
        setError(msg);
        const empty = {
          data: [],
          pagination: { current_page: 1, per_page: 12, total: 0, last_page: 1, from: 0, to: 0 },
          stats: { total: 0, by_action: { create: 0, update: 0, delete: 0 } },
          raw: null
        };
        setResult(empty);
        return empty;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, result, fetchAudit };
}

/** Untuk STAFF: hanya riwayat milik dirinya */
export function useAuditStaff() {
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(null);
  const [result,  setResult]    = useState(null);

  const fetchAudit = useCallback(
    async ({ page = 1, perPage = 12, filters = {} } = {}) => {
      setLoading(true);
      setError(null);
      try {
        // halaman aktif
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        qs.set("per_page", String(perPage));
        if (filters.q)       qs.set("q", filters.q);
        if (filters.status)  qs.set("status", filters.status);
        if (filters.action)  qs.set("action", filters.action);
        if (filters.module)  qs.set("module", filters.module);
        if (filters.month)   qs.set("month", filters.month);
        if (filters.year)    qs.set("year",  filters.year);

        const urlPage = `${API_ENDPOINTS.STAFF.PROPOSALS.MY}?${qs.toString()}`;
        const resPage = await apiGet(urlPage);

        const itemsPage = (resPage?.data || []).map(normalizeItemStaff);
        const pagination = {
          current_page: resPage?.current_page ?? page,
          per_page:     resPage?.per_page ?? perPage,
          total:        resPage?.total ?? itemsPage.length,
          last_page:    resPage?.last_page ?? Math.max(1, Math.ceil((resPage?.total ?? itemsPage.length) / (resPage?.per_page ?? perPage))),
          from:         resPage?.from ?? 1,
          to:           resPage?.to ?? itemsPage.length,
        };

        // hitung total berdasar semua filtered (kalau server tidak sediakan summary)
        let stats = null;
        try {
          const perAll = Math.min(2000, pagination.total || 2000);
          const qsAll  = new URLSearchParams(qs);
          qsAll.set("page", "1");
          qsAll.set("per_page", String(perAll));
          const resAll = await apiGet(`${API_ENDPOINTS.STAFF.PROPOSALS.MY}?${qsAll.toString()}`);
          const itemsAll = (resAll?.data || []).map(normalizeItemStaff);
          stats = computeStats(itemsAll);
        } catch {
          stats = computeStats(itemsPage);
        }

        const packed = { data: itemsPage, pagination, stats, raw: resPage };
        setResult(packed);
        return packed;
      } catch (err) {
        const msg = err?.message || "Gagal memuat riwayat";
        setError(msg);
        const empty = {
          data: [],
          pagination: { current_page: 1, per_page: 12, total: 0, last_page: 1, from: 0, to: 0 },
          stats: { total: 0, by_action: { create: 0, update: 0, delete: 0 } },
          raw: null
        };
        setResult(empty);
        return empty;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, result, fetchAudit };
}
