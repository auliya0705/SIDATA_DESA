"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, User } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function Topbar({ toggleSidebar, isSidebarOpen }) {
  const router = useRouter();
  const user = getCurrentUser();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        {/* Left: Toggle Sidebar + Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
            Dashboard Admin
          </h1>
        </div>

        {/* Right: User Info + Logout */}
        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="flex items-center space-x-3 px-4 py-2 bg-teal-50 rounded-lg">
            <div className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center">
              <User className="text-white" size={18} />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-600 capitalize">
                {user?.role === "kepala_desa" || user?.role === "kepala"
                  ? "Kepala Desa"
                  : "Staff"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Konfirmasi Logout"
        message="Yakin ingin keluar dari sistem? Anda harus login kembali untuk mengakses dashboard."
        confirmText="Ya, Logout"
        cancelText="Batal"
        type="warning"
      />
    </>
  );
}
