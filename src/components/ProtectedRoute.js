"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, hasRole } from "@/lib/auth";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check if authenticated
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      // Check role if required
      if (requiredRole && !hasRole(requiredRole)) {
        router.push("/admin/dashboard");
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [router, requiredRole]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
