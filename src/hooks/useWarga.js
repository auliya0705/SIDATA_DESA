// src/hooks/useWarga.js
"use client";

import { useState, useCallback } from "react";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";

/**
 * Custom hook for Warga CRUD operations
 */
export function useWarga() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Get all warga */
  const getWargaList = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams(params).toString();
      const endpoint = qs
        ? `${API_ENDPOINTS.WARGA.LIST}?${qs}`
        : API_ENDPOINTS.WARGA.LIST;
      const data = await apiGet(endpoint);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /** Get single warga by ID */
  const getWargaById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet(API_ENDPOINTS.WARGA.SHOW(id));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /** Create warga */
  const createWarga = async (wargaData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiPost(API_ENDPOINTS.WARGA.CREATE, wargaData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /** Update warga */
  const updateWarga = async (id, wargaData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiPut(API_ENDPOINTS.WARGA.UPDATE(id), wargaData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete warga via proposal (POST + _method=DELETE) — tetap dipertahankan
   * NOTE: kalau kamu sudah pakai endpoint proposal delete khusus, sesuaikan di sini.
   */
  const deleteWarga = async (id, reason = "") => {
    if (!id) throw new Error("ID tidak valid.");
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token") || "";
      const fd = new FormData();
      fd.append("_method", "DELETE");
      if (reason) fd.append("reason", reason);

      const res = await fetch(`/api/staff/proposals/warga/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const text = await res.text();
      if (!res.ok) {
        try {
          const j = JSON.parse(text);
          throw new Error(j.message || `HTTP ${res.status}`);
        } catch {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
      }
      return text ? JSON.parse(text) : true;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cek apakah NIK sudah ada di DB (tanpa /warga/check-nik).
   * - FE hanya memanggil: GET /warga?nik=... lalu cari yang nik-nya sama persis
   * - ignoreId: ID warga yang sedang diubah → kalau match, tidak dianggap konflik
   */
    const checkNikUnique = useCallback(async (nik, ignoreId = null) => {
  if (!nik) return { exists: false };

  // helper untuk normalisasi array data dari berbagai bentuk response
  const pickList = (res) => Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);

  try {
    // 1) Coba endpoint ?nik=... jika backend mendukung
    const res1 = await apiGet(`${API_ENDPOINTS.WARGA.LIST}?nik=${encodeURIComponent(nik)}`);
    let list = pickList(res1);
    if (!list.length) {
      // 2) Fallback: coba ?search=...
      const res2 = await apiGet(`${API_ENDPOINTS.WARGA.LIST}?search=${encodeURIComponent(nik)}`);
      list = pickList(res2);
      if (!list.length) {
        // 3) Fallback terakhir: ambil default list lalu filter di FE
        const res3 = await apiGet(API_ENDPOINTS.WARGA.LIST);
        list = pickList(res3);
      }
    }

    const hit = list.find(r => String(r.nik) === String(nik));
    if (!hit) return { exists: false };

    // jika yang ketemu adalah record yang sedang di-update → bukan konflik
    const same = ignoreId != null && String(hit.id) === String(ignoreId);
    return { exists: !same, conflictId: hit.id };
  } catch {
    // kalau semua gagal, jangan menghalangi approve
    return { exists: false };
  }
}, []);



  return {
    loading,
    error,
    getWargaList,
    getWargaById,
    createWarga,
    updateWarga,
    deleteWarga,
    checkNikUnique,
  };
}
