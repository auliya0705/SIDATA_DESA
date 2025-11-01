// lib/config.js

/**
 * API Configuration
 * Central place for all API endpoints
 */

export const API_CONFIG = {
  BASE_URL: "http://127.0.0.1:8000/api",
  TIMEOUT: 30000, // 30 seconds
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
    CHECK: "/cek-login",
    PROFILE: "/profile",
  },

  // Tanah (Admin)
  TANAH: {
    LIST: "/tanah",
    CREATE: "/tanah",
    SHOW: (id) => `/tanah/${id}`,
    UPDATE: (id) => `/tanah/${id}`,
    DELETE: (id) => `/tanah/${id}`,
  },

  // Warga (Admin)
  WARGA: {
    LIST: "/warga",
    CREATE: "/warga",
    SHOW: (id) => `/warga/${id}`,
    UPDATE: (id) => `/warga/${id}`,
    DELETE: (id) => `/warga/${id}`,
  },

  // Bidang (Admin)
  BIDANG: {
    LIST: "/bidang",
    CREATE: "/bidang",
    SHOW: (id) => `/bidang/${id}`,
    UPDATE: (id) => `/bidang/${id}`,
    DELETE: (id) => `/bidang/${id}`,
  },

  // 🔥 FIX: Update endpoint sesuai backend Laravel
  // Proposal/Approval (Kepala Desa only)
  PROPOSAL: {
    LIST: "/kepala/approvals", // ✅ Fix dari /proposal ke /kepala/approvals
    SHOW: (id) => `/kepala/approvals/${id}`,
    APPROVE: (id) => `/kepala/approvals/${id}/approve`,
    REJECT: (id) => `/kepala/approvals/${id}/reject`,
  },

  // Audit (Kepala Desa only)
  AUDIT: {
    LIST: "/audit/riwayat",
    SHOW: (id) => `/audit/${id}`,
  },
};

/**
 * Get full URL for endpoint
 */
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
