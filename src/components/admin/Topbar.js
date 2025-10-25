"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings } from "lucide-react";
import Link from "next/link";

export default function Topbar({
  title = "Dashboard",
  breadcrumb = "Dashboard",
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mock user data - nanti ganti dengan data dari API/auth
  const user = {
    name: "Auliya Shadrina",
    role: "Admin - Kepala Desa",
  };

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
          <p className="text-sm text-gray-500">{breadcrumb}</p>
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
              <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
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
                  // Handle logout - nanti implement dengan auth
                  console.log("Logout clicked");
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
