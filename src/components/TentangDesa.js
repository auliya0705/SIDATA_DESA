"use client"; // Diperlukan karena ada state untuk modal

import { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";

export default function TentangDesa() {
  const [showVisi, setShowVisi] = useState(false);
  const [showMisi, setShowMisi] = useState(false);

  return (
    <section id="tentang" className="bg-white py-16 sm:py-24 p-5">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            {/* Kolom Logo */}
            <div className="flex justify-center">
                <Image
                    src="/images/logobb.png"
                    alt="Logo Desa Banyubiru"
                    width={300}
                    height={300}
                    className="object-contain"
                />
            </div>

            {/* Kolom Kanan (Deskripsi & Tombol) */}
            <div className="flex flex-col space-y-6">
            {/* Kotak Deskripsi */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold text-teal-800 mb-4">
                        Tentang Desa
                    </h2>

                    {/* Kontainer Scroll */}
                    <div className="h-48 overflow-y-auto pr-4"> {/* Tinggi tetap & scroll */}
                        <p className="text-gray-600 leading-relaxed">
                            Desa Banyubiru merupakan salah satu dari 10 desa di wilayah Kecamatan Banyubiru, Kabupaten Semarang, 
                            yang memiliki luas wilayah 677.087 Ha dan populasi 8.746 jiwa yang tersebar di 9 dusun. Dengan semangat 
                            "Swarga Binuka luhuring budi", potensi utama desa ini terletak pada sektor pertanian, di mana 192.087 Ha 
                            dari total wilayahnya adalah tanah sawah yang subur. Hal ini menjadikan Desa Banyubiru sebagai salah 
                            satu penyangga pangan (padi) strategis untuk Kabupaten Semarang dan desa yang berpotensi mendukung 
                            pembangunan di tingkat kecamatan. Kemajuan desa terus diupayakan melalui kerja sama antara pemerintah 
                            dan masyarakat, terutama dalam pengembangan infrastruktur untuk memaksimalkan potensi yang ada.
                        </p>
                    </div>
                </div>

                {/* Tombol Visi & Misi (di luar kotak) */}
                <div className="flex space-x-7">
                    <button
                        onClick={() => setShowVisi(true)}
                        className="flex-1 bg-gray-300 text-black font-semibold py-3 px-6 rounded-lg hover:border-teal-800 hover:bg-teal-800 hover:text-white transition-colors shadow-xl"
                    >
                        Visi Desa
                    </button>
                    <button
                        onClick={() => setShowMisi(true)}
                        className="flex-1 bg-white text-gray-400 font-semibold py-3 px-6 rounded-lg hover:border-teal-800 hover:bg-teal-800 hover:text-white transition-colors shadow-xl"
                    >
                        Misi Desa
                    </button>
                </div>
            </div>
        </div>

        {/* Modal untuk Visi & Misi */}
        <Modal 
            show={showVisi} 
            onClose={() => setShowVisi(false)} 
            title="Visi Desa Banyu Biru"
        >
            <p className="text-gray-700">Ini adalah konten Visi Desa...</p>
        </Modal>

        <Modal 
            show={showMisi} 
            onClose={() => setShowMisi(false)} 
            title="Misi Desa Banyu Biru"
        >
            <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Misi pertama...</li>
            <li>Misi kedua...</li>
            </ul>
        </Modal>
    </section>
  );
}
