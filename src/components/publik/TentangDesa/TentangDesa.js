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
            src="/images/pemkot.png"
            alt="Logo Desa Pongangan"
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
            <div className="h-48 overflow-y-auto pr-4">
              {/* Tinggi tetap & scroll */}
              <p className="text-gray-600 leading-relaxed">
                Kelurahan Pongangan, yang terletak di Kecamatan Gunungpati, Kota
                Semarang, menampilkan diri sebagai wilayah yang berjarak sekitar
                13 km dari pusat kota dengan slogan &quot;CERIA&quot; (Cepat,
                Empati, Ramah, Ikhlas, Amanah). Dengan luas wilayah lebih dari
                340 hektar yang mencakup 5 RW dan 28 RT, Kelurahan Pongangan
                berupaya mewujudkan masyarakat yang sejahtera melalui
                pengembangan berbagai potensi lokal. Sektor pariwisata menjadi
                salah satu unggulan utama, menawarkan beragam destinasi menarik
                mulai dari wisata alam seperti Sungai Kali Patat dan Agro Gua
                Lima, wisata keluarga seperti The Pongo&apos;s, hingga wisata
                religi di Makam Simbah Badrotin. Potensi ini didukung oleh
                pengembangan Usaha Mikro, Kecil, dan Menengah (UMKM) yang aktif
                dibina, seperti kerajinan daur ulang sampah dan pembuatan
                bonsai. Di samping itu, Kelurahan Pongangan juga berkomitmen
                menjaga kearifan lokal dan adat budaya, yang diwujudkan melalui
                penyelenggaraan Kirab Budaya tahunan, serta menyediakan
                fasilitas olahraga lengkap bagi warganya sebagai bagian dari
                harapan untuk membangun wilayah secara rukun dan produktif.
              </p>
            </div>
          </div>

          {/* Tombol Visi & Misi (di luar kotak) */}
          <div className="flex space-x-7">
            <button
              onClick={() => setShowVisi(true)}
              className="flex-1 text-black font-semibold py-3 px-6 rounded-lg hover:border-teal-800 hover:bg-teal-800 hover:text-white transition-colors shadow-xl"
            >
              Visi Desa
            </button>
            <button
              onClick={() => setShowMisi(true)}
              className="flex-1 text-black font-semibold py-3 px-6 rounded-lg hover:border-teal-800 hover:bg-teal-800 hover:text-white transition-colors shadow-xl"
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
        title="Visi Desa Pongangan"
      >
        <p className="text-gray-700">
          Terwujudnya Kota Semarang yang semakin hemat berlandaskan Pancasila
          dalam bingkai NKRI Yang ber-Bhineka Tunggal Ika.
        </p>
      </Modal>

      <Modal
        show={showMisi}
        onClose={() => setShowMisi(false)}
        title="Misi Desa Pongangan"
      >
        <ol className="list-decimal list-inside space-y-2 text-gray-700 text-justify pl-2">
          <li>
            Meningkatkan kualitas dan kapasitas Sumber Daya Manusia (SDM) yang
            unggul dan produktif untuk mencapai kesejahteraan dan keadilan
            sosial.
          </li>
          <li>
            Meningkatkan potensi ekonomi lokal yang berdaya saing dan stimulasi
            pembangunan industri, berlandaskan riset dan dan inovasi berdasar
            prinsip demokrasi ekonomi pancasila.
          </li>
          <li>
            Menjamin kemerdekaan masyarakat menjalankan ibadah, pemenuhan hak
            dasar dan perlindungan kesejahteraan sosial serta hak asasi manusia
            bagi masyarakat secara berkeadilan.
          </li>
          <li>
            Mewujudkan infrastruktur berkualitas yang berwawasan lingkungan
            untuk mendukung kemajuan kota.
          </li>
          <li>
            Menjalankan reformasi birokrasi pemerintahan secara dinamis dan
            menyusun produk hukum yang sesuai nilai-nilai Pancasila dalam
            kerangka NKRI.
          </li>
        </ol>
      </Modal>
    </section>
  );
}
