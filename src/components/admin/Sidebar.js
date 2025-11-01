"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  History,
  Menu,
  X,
  CheckCircle,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    title: "Management Warga",
    icon: Users,
    href: "/admin/management-warga",
  },
  {
    title: "Management Tanah",
    icon: FileText,
    href: "/admin/management-tanah",
  },
  {
    title: "Riwayat Buku Tanah",
    icon: History,
    href: "/admin/riwayat-buku-tanah",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isKepalaDesa, setIsKepalaDesa] = useState(false);

  useEffect(() => {
    // Check if user is Kepala Desa
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        //Support both "kepala_desa" and "kepala"
        setIsKepalaDesa(user.role === "kepala_desa" || user.role === "kepala");
      }
    }
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-teal-700 text-white rounded-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-teal-700 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 flex items-center space-x-3 border-b border-teal-600">
          <Image
            src="/images/logobb.png"
            alt="Logo"
            width={40}
            height={40}
            className="bg-white rounded-full p-1"
          />
          <div>
            <h1 className="font-bold text-lg">SIDATA</h1>
            <p className="text-sm text-teal-200">DESA</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${
                        isActive
                          ? "bg-teal-800 text-white"
                          : "text-teal-100 hover:bg-teal-600"
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </li>
              );
            })}

            {/* Approval Menu - Kepala Desa Only */}
            {isKepalaDesa && (
              <li>
                <Link
                  href="/admin/approval"
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${
                      pathname === "/admin/approval"
                        ? "bg-teal-800 text-white"
                        : "text-teal-100 hover:bg-teal-600"
                    }
                  `}
                >
                  <CheckCircle size={20} />
                  <span className="font-medium">Approval</span>

                  {/* Badge untuk pending count (opsional) */}
                  <span className="ml-auto bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    5
                  </span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-teal-600 text-center text-sm text-teal-200">
          <p>© 2025 SIDATA DESA</p>
        </div>
      </aside>
    </>
  );
}
