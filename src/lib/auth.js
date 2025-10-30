// lib/auth.js or utils/auth.js

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

/**
 * Get auth token
 */
export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Check if user has specific role
 */
export const hasRole = (role) => {
  const user = getCurrentUser();
  if (!user) return false;

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }

  return user.role === role;
};

/**
 * Check if user is Kepala Desa (has approval rights)
 */
export const isKepalaDesa = () => {
  return hasRole("kepala_desa");
};

/**
 * Logout user
 */
export const logout = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Redirect to login
  window.location.href = "/login";
};

/**
 * Set user session
 */
export const setUserSession = (token, user) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * API request with authentication
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, logout
  if (response.status === 401) {
    logout();
    throw new Error("Unauthorized");
  }

  return response;
};

/**
 * Get user display info
 */
export const getUserDisplayInfo = () => {
  const user = getCurrentUser();
  if (!user) return null;

  return {
    name: user.name,
    email: user.email,
    role: user.role,
    roleDisplay:
      user.role === "kepala_desa" ? "Kepala Desa" : "Sekretaris Desa",
  };
};
