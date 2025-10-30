"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Cek apakah di halaman admin atau login
  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/login";

  // Hide footer di halaman peta (untuk public)
  const hideFooter = pathname === "/peta";

  return (
    <>
      {/* Navbar hanya muncul kalau BUKAN halaman admin DAN bukan login */}
      {!isAdminPage && !isLoginPage && <Navbar />}

      <main>{children}</main>

      {/* Footer hanya muncul kalau BUKAN halaman admin, bukan login, DAN bukan halaman peta */}
      {!isAdminPage && !isLoginPage && !hideFooter && <Footer />}
    </>
  );
}
