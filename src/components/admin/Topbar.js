"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogOut, User } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function Topbar({ toggleSidebar, isSidebarOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = getCurrentUser();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Get dynamic title and breadcrumb based on current path
  const getPageInfo = () => {
    // Dashboard
    if (pathname === "/admin/dashboard") {
      return { title: "Dashboard", breadcrumb: null };
    }

    // Management Warga
    if (pathname === "/admin/management-warga") {
      return {
        title: "Management Warga",
        breadcrumb: "Dashboard / Management Warga",
      };
    }
    if (pathname === "/admin/management-warga/create") {
      return {
        title: "Management Warga",
        breadcrumb: "Dashboard / Management Warga / Tambah Penduduk",
      };
    }
    if (pathname.match(/\/admin\/management-warga\/detail\/\d+/)) {
      return {
        title: "Management Warga",
        breadcrumb: "Dashboard / Management Warga / Detail Penduduk",
      };
    }
    if (pathname.match(/\/admin\/management-warga\/edit\/\d+/)) {
      return {
        title: "Management Warga",
        breadcrumb: "Dashboard / Management Warga / Edit Penduduk",
      };
    }

    // Management Tanah
    if (pathname === "/admin/management-tanah") {
      return {
        title: "Management Tanah",
        breadcrumb: "Dashboard / Management Tanah",
      };
    }
    if (pathname === "/admin/management-tanah/create") {
      return {
        title: "Management Tanah",
        breadcrumb: "Dashboard / Management Tanah / Input Data Tanah",
      };
    }
    if (pathname.match(/\/admin\/management-tanah\/detail\/\d+/)) {
      return {
        title: "Management Tanah",
        breadcrumb: "Dashboard / Management Tanah / Detail Data Tanah",
      };
    }
    if (pathname.match(/\/admin\/management-tanah\/tambah-bidang\/.+/)) {
      return {
        title: "Management Tanah",
        breadcrumb: "Dashboard / Management Tanah / Tambah Bidang Tanah",
      };
    }
    if (pathname.match(/\/admin\/management-tanah\/edit-bidang\/.+\/.+/)) {
      return {
        title: "Management Tanah",
        breadcrumb: "Dashboard / Management Tanah / Edit Bidang Tanah",
      };
    }

    // Riwayat Buku Tanah
    if (pathname === "/admin/riwayat-buku-tanah") {
      return {
        title: "Riwayat Buku Tanah",
        breadcrumb: "Dashboard / Riwayat Buku Tanah",
      };
    }
    if (pathname.match(/\/admin\/riwayat-buku-tanah\/detail\/.+/)) {
      return {
        title: "Riwayat Buku Tanah",
        breadcrumb: "Dashboard / Riwayat Buku Tanah / Detail",
      };
    }

    // Riwayat Proposal
    if (pathname === "/admin/riwayat-proposal") {
      return {
        title: "Riwayat Proposal",
        breadcrumb: "Dashboard / Riwayat Proposal",
      };
    }
    if (pathname.match(/\/admin\/riwayat-proposal\/detail\/.+/)) {
      return {
        title: "Riwayat Proposal",
        breadcrumb: "Dashboard / Riwayat Proposal / Detail",
      };
    }

    // Approval
    if (pathname === "/admin/approval") {
      return { title: "Approval", breadcrumb: "Dashboard / Approval" };
    }

    // Default
    return { title: "Dashboard", breadcrumb: null };
  };

  const { title, breadcrumb } = getPageInfo();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Left: Toggle Sidebar + Title & Breadcrumb */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div>
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
              {breadcrumb && (
                <p className="text-sm text-gray-500 mt-0.5">{breadcrumb}</p>
              )}
            </div>
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
                    : "Staff Desa"}
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
