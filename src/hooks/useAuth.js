// hooks/useAuth.js

"use client";

import { useState } from "react";
import { apiPost, apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";
import {
  setUserSession,
  logout as authLogout,
  getCurrentUser,
} from "@/lib/auth";

/**
 * Custom hook for authentication
 */
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Login user
   */
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      // Call login API
      const response = await apiPost(API_ENDPOINTS.AUTH.LOGIN, credentials);

      // Expected response format:
      // {
      //   token: "...",
      //   user: {
      //     id: 1,
      //     name: "...",
      //     email: "...",
      //     role: "kepala_desa" | "staff"
      //   }
      // }

      // Save to localStorage
      setUserSession(response.token, response.user);

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Optional: Call logout API endpoint
      try {
        await apiPost(API_ENDPOINTS.AUTH.LOGOUT);
      } catch (err) {
        // Ignore logout API errors
        console.warn("Logout API error:", err);
      }

      // Clear localStorage and redirect
      authLogout();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check authentication status
   */
  const checkAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiGet(API_ENDPOINTS.AUTH.CHECK);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get current user profile
   */
  const getProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiGet(API_ENDPOINTS.AUTH.PROFILE);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get current user from localStorage (no API call)
   */
  const getCurrentUserLocal = () => {
    return getCurrentUser();
  };

  return {
    loading,
    error,
    login,
    logout,
    checkAuth,
    getProfile,
    getCurrentUserLocal,
  };
}
