"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { User, LogOut, Settings } from "lucide-react";
import Link from "next/link";

export default function Topbar() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [user, setUser] = useState(null);

  // Get page title and breadcrumb based on pathname
  const getPageInfo = () => {
    // Dashboard
    if (pathname === "/admin/dashboard") {
      return { title: "Dashboard", breadcrumb: "Dashboard" };
    }

    // Management Warga
    if (pathname === "/admin/management-warga") {
      return { title: "Management Warga", breadcrumb: "Management Warga" };
    }
    if (pathname === "/admin/management-warga/create") {
      return {
        title: "Management Warga",
        breadcrumb: "Management Warga / Tambah Penduduk",
      };
    }
    if (pathname.match(/\/admin\/management-warga\/detail\/\d+/)) {
      return {
        title: "Management Warga",
        breadcrumb: "Management Warga / Detail Penduduk",
      };
    }
    if (pathname.match(/\/admin\/management-warga\/edit\/\d+/)) {
      return {
        title: "Management Warga",
        breadcrumb: "Management Warga / Edit Data Penduduk",
      };
    }

    // Management Tanah
    if (pathname === "/admin/management-tanah") {
      return { title: "Management Tanah", breadcrumb: "Management Tanah" };
    }
    if (pathname === "/admin/management-tanah/create") {
      return {
        title: "Management Tanah",
        breadcrumb: "Management Tanah / Input Data Tanah",
      };
    }
    if (pathname.match(/\/admin\/management-tanah\/detail\/\d+/)) {
      return {
        title: "Management Tanah",
        breadcrumb: "Management Tanah / Detail Data Tanah",
      };
    }
    if (pathname.match(/\/admin\/management-tanah\/tambah-bidang\/.+/)) {
      return {
        title: "Management Tanah",
        breadcrumb: "Management Tanah / Tambah Bidang Tanah",
      };
    }
    if (pathname.match(/\/admin\/management-tanah\/edit-bidang\/.+\/.+/)) {
      return {
        title: "Management Tanah",
        breadcrumb: "Management Tanah / Edit Bidang Tanah",
      };
    }

    // Riwayat Buku Tanah
    if (pathname === "/admin/riwayat-buku-tanah") {
      return { title: "Riwayat Buku Tanah", breadcrumb: "Riwayat Buku Tanah" };
    }
    if (pathname.match(/\/admin\/riwayat-buku-tanah\/detail\/.+/)) {
      return {
        title: "Riwayat Buku Tanah",
        breadcrumb: "Riwayat Buku Tanah / Detail",
      };
    }

    // Approval
    if (pathname === "/admin/approval") {
      return { title: "Approval", breadcrumb: "Approval" };
    }

    // Default
    return { title: "Dashboard", breadcrumb: null };
  };

  const { title, breadcrumb } = getPageInfo();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser({
          name: userData.name,
          role: `Admin - ${
            userData.role === "kepala_desa" ? "Kepala Desa" : "Sekretaris Desa"
          }`,
        });
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Left: Title & Breadcrumb */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {breadcrumb && <p className="text-sm text-gray-500">{breadcrumb}</p>}
        </div>

        {/* Right: User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div className="text-left hidden md:block">
              <p className="font-semibold text-gray-800 text-sm">
                {user?.name || "Loading..."}
              </p>
              <p className="text-xs text-gray-500">{user?.role || ""}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800">
                  {user?.name || "Loading..."}
                </p>
                <p className="text-sm text-gray-500">{user?.role || ""}</p>
              </div>

              <Link
                href="/admin/profile"
                className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <User size={18} className="text-gray-600" />
                <span className="text-gray-700">Profile</span>
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <Settings size={18} className="text-gray-600" />
                <span className="text-gray-700">Settings</span>
              </Link>

              <hr className="my-2 border-gray-100" />

              <button
                onClick={() => {
                  if (confirm("Yakin ingin logout?")) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
