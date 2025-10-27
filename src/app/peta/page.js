"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import FilterPopup from "@/components/FilterPopup";
import InfoPopup from "@/components/InfoPopup";
import { Sliders, Info } from "lucide-react";

// Muat Map secara dinamis agar tidak error di SSR
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

export default function PetaPage() {
  const [kategori, setKategori] = useState("status");
  const [filter, setFilter] = useState({ kategori: "", bidang: "" });
  const [appliedFilter, setAppliedFilter] = useState(null);
  const [openPopup, setOpenPopup] = useState(null); // 'filter' | 'info' | null

  const togglePopup = (type) => {
    setOpenPopup((prev) => (prev === type ? null : type));
  };

  return (
    <div className="relative h-screen w-full">
      <MapComponent filter={appliedFilter} />

      {/* Tombol ikon */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col top-28 gap-2">
        {/* Filter Button */}
        <button
          onClick={() => togglePopup("filter")}
          className={`bg-white shadow-md rounded-lg p-3 hover:bg-gray-100 transition ${
            openPopup === "filter" ? "ring-2 ring-emerald-600" : ""
          }`}
        >
          <Sliders className="w-5 h-5 text-gray-700" />
        </button>

        {/* Info Button */}
        <button
          onClick={() => togglePopup("info")}
          className={`bg-white shadow-md rounded-lg p-3 hover:bg-gray-100 transition ${
            openPopup === "info" ? "ring-2 ring-emerald-600" : ""
          }`}
        >
          <Info className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Popup Filter */}
      {openPopup === "filter" && (
        <div className="absolute top-56 left-4 z-[1000]">
          <FilterPopup
            kategori={kategori}
            setKategori={setKategori}
            filter={filter}
            setFilter={setFilter}
            setAppliedFilter={setAppliedFilter}
          />
        </div>
      )}

      {/* Popup Info */}
      {openPopup === "info" && (
        <div className="absolute top-56 left-4 z-[1000]">
          <InfoPopup />
        </div>
      )}
    </div>
  );
}