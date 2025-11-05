// src/lib/api.js

import { getToken, logout } from "./auth";
import { getApiUrl } from "./config";

/**
 * Authenticated fetch with robust error handling:
 * - Always sends Accept: application/json
 * - Sets Content-Type only when needed (not for FormData / no body)
 * - Parses JSON safely (fallback to text)
 * - Flattens Laravel validation errors
 * - HARD GUARD: blocks any call to "/apply" since backend doesn't have it
 * - 🔧 NEW: Silent 404 for deleted resources (normal in approval system)
 */
export async function apiClient(endpoint, options = {}) {
  // HARD GUARD: stop accidental /apply hits anywhere in FE
  if (typeof endpoint === "string" && endpoint.includes("/apply")) {
    const msg =
      "Endpoint /apply tidak tersedia di backend. Hentikan pemanggilan ini di FE.";
    console.error("❌ API Blocked:", msg, {
      endpoint,
      method: options?.method || "GET",
    });
    throw new Error(msg);
  }

  const token = getToken();
  const url = getApiUrl(endpoint);

  // Base headers
  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  // Body handling
  const hasBody =
    "body" in options && options.body !== undefined && options.body !== null;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (hasBody && !isFormData) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  // Bearer token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = res.headers.get("content-type") || "";
    const raw = await res.text(); // read once

    // 401 → auto logout
    if (res.status === 401) {
      console.warn("🔒 Unauthorized - logging out");
      logout();
      const e = new Error("Session expired. Please login again.");
      e.status = 401;
      throw e;
    }

    // Non-OK → build best error message
    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      let data = null;

      if (contentType.includes("application/json")) {
        try {
          data = JSON.parse(raw);

          // Ambil pesan dasar
          const base =
            data?.message ||
            data?.error ||
            data?.friendly ||
            data?.errors ||
            data;

          // Ratakan laravel validation errors jika ada
          let flatValidation = "";
          if (data?.errors && typeof data.errors === "object") {
            flatValidation = Object.entries(data.errors)
              .map(([k, v]) =>
                Array.isArray(v) ? `${k}: ${v.join(", ")}` : `${k}: ${v}`
              )
              .join("; ");
          }

          // Kumpulkan potongan pesan yang mungkin muncul
          const parts = [
            typeof base === "string" ? base : JSON.stringify(base),
            data?.apply_error &&
              (typeof data.apply_error === "string"
                ? data.apply_error
                : JSON.stringify(data.apply_error)),
            flatValidation,
          ].filter(Boolean);

          msg = parts.length ? parts.join(" — ") : msg;
        } catch {
          msg = `${res.status}: ${res.statusText}`;
        }
      } else {
        // Non-JSON (HTML/text)
        msg = raw?.trim()
          ? raw.slice(0, 500)
          : `${res.status}: ${res.statusText}`;
      }

      const hint =
        typeof endpoint === "string" ? ` [endpoint: ${endpoint}]` : "";
      const error = new Error(`${msg}${hint}`);
      error.status = res.status;
      if (contentType.includes("application/json")) {
        try {
          error.data = data ?? JSON.parse(raw);
        } catch {
          // ignore
        }
      } else {
        error.raw = raw;
      }
      throw error;
    }

    // OK → parse if JSON
    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(raw);
      } catch {
        // malformed json, tetap kembalikan raw
        return raw;
      }
    }
    return raw;
  } catch (err) {
    // 🔧 FIX: Don't log 404 errors (normal for deleted resources in approval system)
    // Only log if NOT 404, or if it's an important endpoint
    const is404 = err?.status === 404;
    const isPreviewFetch =
      typeof endpoint === "string" &&
      (endpoint.includes("/tanah/") ||
        endpoint.includes("/bidang/") ||
        endpoint.includes("/warga/"));

    // Skip logging for 404 on preview fetches (deleted data is expected)
    if (!is404 || !isPreviewFetch) {
      const message = err?.message || String(err);
      console.error("❌ API Error:", message, {
        endpoint,
        method: options?.method || "GET",
        status: err?.status,
        data: err?.data,
      });
    }

    throw err;
  }
}

/** GET */
export async function apiGet(endpoint) {
  return apiClient(endpoint, { method: "GET" });
}

/** POST
 * - data = null/undefined → POST tanpa body (no Content-Type forced)
 * - data = FormData → kirim FormData (no Content-Type)
 * - else → JSON.stringify
 */
export async function apiPost(endpoint, data) {
  const opts = { method: "POST" };

  if (data === undefined || data === null) {
    // no body
  } else if (typeof FormData !== "undefined" && data instanceof FormData) {
    opts.body = data;
  } else {
    opts.body = JSON.stringify(data);
  }

  return apiClient(endpoint, opts);
}

/** PUT (JSON only) */
export async function apiPut(endpoint, data) {
  return apiClient(endpoint, {
    method: "PUT",
    body: JSON.stringify(data ?? {}),
  });
}

/** DELETE */
export async function apiDelete(endpoint) {
  return apiClient(endpoint, { method: "DELETE" });
}

/** PATCH (JSON only) */
export async function apiPatch(endpoint, data) {
  return apiClient(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data ?? {}),
  });
}
