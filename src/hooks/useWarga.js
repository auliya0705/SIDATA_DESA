// hooks/useWarga.js

"use client";

import { useState, useCallback } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";

/**
 * Custom hook for Warga CRUD operations
 */
export function useWarga() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Get all warga
   */
  const getWargaList = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString
        ? `${API_ENDPOINTS.WARGA.LIST}?${queryString}`
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

  /**
   * Get single warga by ID
   */
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

  /**
   * Create new warga
   */
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

  /**
   * Update existing warga
   */
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
   * Delete warga (buat proposal hapus via POST + _method=DELETE)
   */
  const deleteWarga = useCallback(async (id, reason = "") => {
    if (!id) throw new Error("ID tidak valid.");

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || "";

      const fd = new FormData();
      fd.append("_method", "DELETE"); // spoof method
      if (reason) fd.append("reason", reason);

      const res = await fetch(`/api/staff/proposals/warga/${id}`, {
        method: "POST", // kirim POST
        headers: { Authorization: `Bearer ${token}` },
        body: fd, // biarkan browser set boundary
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

      return text ? JSON.parse(text) : true; // 202/204/200
    } finally {
      setLoading(false);
    }
  }, []);

  // >>> RETURN agar hook tidak undefined
  return {
    loading,
    error,
    getWargaList,
    getWargaById,
    createWarga,
    updateWarga,
    deleteWarga,
  };
}
