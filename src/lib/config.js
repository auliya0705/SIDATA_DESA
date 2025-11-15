// src/lib/config.js

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
 * NOTE:
 * - Gunakan getApiUrl(endpoint) saat fetch agar BASE_URL otomatis terpasang
 * - Endpoint di sini adalah PATH (diawali "/")
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
    CHECK: "/cek-login",
    PROFILE: "/profile",
  },
  DASHBOARD: "/dashboard",
  // Tanah (read-only publik/admin)
  TANAH: {
    LIST: "/tanah",
    SHOW: (id) => `/tanah/${id}`,
    CREATE: "/tanah",
    UPDATE: (id) => `/tanah/${id}`,
    DELETE: (id) => `/tanah/${id}`,
  },

  // Warga (read-only publik/admin)
  WARGA: {
    LIST: "/warga",
    SHOW: (id) => `/warga/${id}`,
    CREATE: "/warga",
    UPDATE: (id) => `/warga/${id}`,
    DELETE: (id) => `/warga/${id}`,
  },

  // Bidang (read-only publik/admin)
  BIDANG: {
    LIST: "/bidang",
    SHOW: (id) => `/bidang/${id}`,
    CREATE: "/bidang",
    UPDATE: (id) => `/bidang/${id}`,
    DELETE: (id) => `/bidang/${id}`,
  },

  // Kepala Desa — approvals
  PROPOSAL: {
    LIST: "/kepala/approvals",
    SHOW: (id) => `/kepala/approvals/${id}`,
    APPROVE: (id) => `/kepala/approvals/${id}/approve`,
    REJECT: (id) => `/kepala/approvals/${id}/reject`,
    AUDIT: "/kepala/approvals/audit", 
  },

  // Audit
  AUDIT: {
    LIST: "/audit/riwayat",
    SHOW: (id) => `/audit/${id}`,
  },

  // 🔹 Staff — endpoints proposal (sesuai routes di Laravel)
  STAFF: {
    PROPOSALS: {
      MY: "/staff/proposals/my",
      SHOW: (id) => `/staff/proposals/${id}`,
      TANAH: {
        CREATE: "/staff/proposals/tanah",
        UPDATE: (id) => `/staff/proposals/tanah/${id}`,     // PATCH (atau POST + _method=PATCH)
        DELETE: (id) => `/staff/proposals/tanah/${id}`,     // DELETE (atau POST + _method=DELETE)
        BIDANG: {
          CREATE: (tanahId) => `/staff/proposals/tanah/${tanahId}/bidang`,
          UPDATE: (id) => `/staff/proposals/bidang/${id}`,  // PUT
          DELETE: (id) => `/staff/proposals/bidang/${id}`,  // DELETE
          SHOW: (id) => `/bidang/${id}`,
        },
        EXPORTS: {
          BUKU_TANAH: "/staff/management-tanah/export/pdf",
          BUKU_TANAH: "/staff/management-tanah/export/csv",
        },
      },
      WARGA: {
        CREATE: "/staff/proposals/warga",
        UPDATE: (id) => `/staff/proposals/warga/${id}`,     // PATCH (atau POST + _method=PATCH)
        DELETE: (id) => `/staff/proposals/warga/${id}`,     // DELETE (atau POST + _method=DELETE)
      },
    },
  },
};

/** Get full URL for endpoint */
export const getApiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;
