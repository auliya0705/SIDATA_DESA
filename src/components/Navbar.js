"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Map } from "lucide-react";

export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      // Jika posisi scroll saat ini > posisi scroll sebelumnya (sedang scroll ke bawah)
      if (window.scrollY > lastScrollY) {
        setShow(false); // Sembunyikan navbar
      } else {
        // Jika sedang scroll ke atas
        setShow(true); // Tampilkan navbar
      }
      // Simpan posisi scroll saat ini untuk perbandingan berikutnya
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    // Cleanup function untuk menghapus event listener
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 w-full bg-white shadow-md z-50 transition-transform duration-300 ease-in-out ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/images/logobb.png"
              alt="Logo"
              width={60}
              height={60}
              priority
            />
            <span className="text-teal-800 font-bold text-sm">SIDATA DESA</span>
          </div>

          {/* Navigasi peta */}
          <div className="flex items-center space-x-6">
            <Link
              href="/peta"
              className="flex items-center space-x-2 text-teal-700 font-medium hover:text-teal-900 transition"
            >
              <Map className="w-5 h-5" />
              <span>Peta Interaktif</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
