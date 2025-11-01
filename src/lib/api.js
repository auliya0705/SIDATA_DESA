// lib/api.js

import { getToken, logout } from "./auth";
import { getApiUrl } from "./config";

/**
 * Enhanced API client with authentication
 * Uses Bearer token from localStorage
 */
export async function apiClient(endpoint, options = {}) {
  const token = getToken();
  const url = getApiUrl(endpoint);

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add Bearer token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - auto logout
    if (res.status === 401) {
      console.warn("🔒 Unauthorized - logging out");
      logout();
      throw new Error("Session expired. Please login again.");
    }

    // Handle other error status codes
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData.message || errorData.error || `HTTP ${res.status}`;
      throw new Error(errorMessage);
    }

    // Return JSON response
    return await res.json();
  } catch (err) {
    console.error("❌ API Error:", err);
    throw err;
  }
}

/**
 * GET request
 */
export async function apiGet(endpoint) {
  return apiClient(endpoint, {
    method: "GET",
  });
}

/**
 * POST request
 */
export async function apiPost(endpoint, data) {
  return apiClient(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function apiPut(endpoint, data) {
  return apiClient(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function apiDelete(endpoint) {
  return apiClient(endpoint, {
    method: "DELETE",
  });
}

/**
 * PATCH request
 */
export async function apiPatch(endpoint, data) {
  return apiClient(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
