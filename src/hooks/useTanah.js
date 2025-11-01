// hooks/useTanah.js

"use client";

import { useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";

/**
 * Custom hook for Tanah CRUD operations
 */
export function useTanah() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Get all tanah
   */
  const getTanahList = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Build query string
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString
        ? `${API_ENDPOINTS.TANAH.LIST}?${queryString}`
        : API_ENDPOINTS.TANAH.LIST;

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
   * Get single tanah by ID
   */
  const getTanahById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiGet(API_ENDPOINTS.TANAH.SHOW(id));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create new tanah
   */
  const createTanah = async (tanahData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiPost(API_ENDPOINTS.TANAH.CREATE, tanahData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update existing tanah
   */
  const updateTanah = async (id, tanahData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiPut(API_ENDPOINTS.TANAH.UPDATE(id), tanahData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete tanah
   */
  const deleteTanah = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiDelete(API_ENDPOINTS.TANAH.DELETE(id));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getTanahList,
    getTanahById,
    createTanah,
    updateTanah,
    deleteTanah,
  };
}
