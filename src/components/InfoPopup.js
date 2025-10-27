"use client";

export default function InfoPopup() {
  return (
    <div className="w-80 bg-white shadow-xl rounded-2xl p-5 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Informasi</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        Peta interaktif ini menampilkan status hak dan penggunaan tanah di
        wilayah Banyubiru. Gunakan ikon filter untuk menampilkan bidang tanah
        berdasarkan kategori tertentu.
      </p>
    </div>
  );
}
