"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Users, Shield, MapPin, ChevronRight } from "lucide-react";

// Dynamic import Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
);

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

export default function LandingPage() {
  const router = useRouter();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [boundaryData, setBoundaryData] = useState(null);

  useEffect(() => {
    setMapLoaded(true);

    // Load Pongangan boundary
    fetch("/geojson/pongangan_boundary.geojson")
      .then((res) => res.json())
      .then((data) => setBoundaryData(data))
      .catch((err) => console.error("Error loading boundary:", err));
  }, []);

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg2.jpeg"
          alt="Desa Pongangan"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900/80 via-teal-800/70 to-teal-900/90"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-7xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Hero Text & Buttons */}
              <div className="space-y-8 text-center lg:text-left">
                {/* Hero Text */}
                <div className="space-y-4">
                  {/* Logo - Better Position */}
                  <div className="flex items-center space-x-3 justify-center lg:justify-start mb-6">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                      <Image
                        src="/images/logo2.png"
                        alt="Logo Desa"
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">
                        SIDATA DESA
                      </h1>
                      <p className="text-sm text-teal-100">Desa Pongangan</p>
                    </div>
                  </div>

                  <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Sistem Informasi
                    <br />
                    <span className="text-teal-200">Data Tanah Desa</span>
                  </h2>

                  <p className="text-xl text-teal-100 max-w-lg mx-auto lg:mx-0">
                    Data Terpadu untuk Desa Maju
                  </p>

                  <p className="text-teal-200/80 max-w-md mx-auto lg:mx-0">
                    Transparansi data warga, tanah, dan bidang untuk pelayanan
                    yang lebih baik
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                  {/* Portal Warga Button */}
                  <button
                    onClick={() => handleNavigate("/public")}
                    className="group w-full px-8 py-5 bg-white hover:bg-teal-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                          <Users className="text-teal-700" size={24} />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-gray-800">
                            Portal Warga
                          </h3>
                          <p className="text-sm text-gray-600">
                            Lihat data publik desa
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className="text-teal-700 group-hover:translate-x-1 transition-transform"
                        size={24}
                      />
                    </div>
                  </button>

                  {/* Portal Admin Button */}
                  <button
                    onClick={() => handleNavigate("/login")}
                    className="group w-full px-8 py-5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <Shield className="text-white" size={24} />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-white">
                            Portal Admin
                          </h3>
                          <p className="text-sm text-teal-100">
                            Login perangkat desa
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className="text-white group-hover:translate-x-1 transition-transform"
                        size={24}
                      />
                    </div>
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0">
                  <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="text-2xl font-bold text-white">100+</div>
                    <div className="text-xs text-teal-200 mt-1">Warga</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-xs text-teal-200 mt-1">Tanah</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="text-2xl font-bold text-white">75+</div>
                    <div className="text-xs text-teal-200 mt-1">Bidang</div>
                  </div>
                </div>
              </div>

              {/* Right Side - Map */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      Wilayah Desa Pongangan
                    </h3>
                    <p className="text-sm text-teal-200">
                      Kecamatan Gunung Pati, Kota Semarang
                    </p>
                  </div>

                  {/* Map Container */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xl h-[400px] lg:h-[500px] bg-gray-100">
                    {mapLoaded && boundaryData ? (
                      <MapContainer
                        center={[-7.052, 110.362]}
                        zoom={14}
                        style={{ height: "100%", width: "100%" }}
                        zoomControl={true}
                        scrollWheelZoom={false}
                        className="z-0"
                        markerZoomAnimation={false}
                      >
                        <TileLayer
                          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        <GeoJSON
                          data={boundaryData}
                          style={{
                            fillColor: "#14b8a6",
                            fillOpacity: 0.3,
                            color: "#0f766e",
                            weight: 3,
                          }}
                        />
                      </MapContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Memuat peta...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Map Legend */}
                  <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-teal-500/50 border-2 border-teal-700 rounded"></div>
                      <span className="text-teal-100">
                        Wilayah Desa Pongangan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-6 text-center text-teal-200 text-sm border-t border-white/10">
          <p>
            © 2025 Desa Pongangan. Sistem Informasi Data Tanah Desa -
            Transparansi untuk Pelayanan Lebih Baik
          </p>
        </footer>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-300/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Hide Leaflet Default Marker */}
      <style jsx global>{`
        .leaflet-marker-icon,
        .leaflet-marker-shadow {
          display: none !important;
        }

        .leaflet-default-icon-path {
          display: none !important;
        }

        /* Hide any marker with "Mark" label */
        .leaflet-popup-content {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
