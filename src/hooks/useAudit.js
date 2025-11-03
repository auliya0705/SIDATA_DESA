// src/hooks/useAudit.js
"use client";

import { useCallback, useState } from "react";
import { API_ENDPOINTS } from "@/lib/config";
import { apiGet } from "@/lib/api"; // pastikan lib/api.js ada dan menambahkan Bearer token

export function useAudit() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [result, setResult]   = useState(null);

  const fetchAudit = useCallback(async ({
    page = 1,
    perPage = 12,
    filters = {},
  } = {}) => {
    setLoading(true);
    setError("");

    try {
      const qs = new URLSearchParams();
      qs.set("page", String(page));
      qs.set("per_page", String(perPage));

      // dukung: module, action, status, month, year, date_from, date_to, q
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
      });

      const path = `${API_ENDPOINTS.PROPOSAL.AUDIT}?${qs.toString()}`;
      const data = await apiGet(path);
      setResult(data);
      return data;
    } catch (e) {
      setError(e?.message || "Gagal memuat audit");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, result, fetchAudit };
}
