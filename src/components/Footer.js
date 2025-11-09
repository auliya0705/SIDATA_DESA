import Link from "next/link";
import Image from "next/image";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="kontak" className="bg-teal-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kolom 1 Logo */}
          <div className="flex justify-center lg:justify-start">
            <Link href="/" className="flex items-center space-x-1.5">
              <Image
                src="/images/LOGO-SIDATA-DESA2.png"
                alt="Logo Desa Banyubiru"
                width={200}
                height={200}
                // className="rounded-full"
              />
            </Link>
          </div>

          {/* Kolom 2 Alamat */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-semibold mb-4">DESA PONGANGAN</h3>
            <p className="text-gray-300">
              Jl. Pongangan Raya RT 003 RW 002 Kelurahan Pongangan Kecamatan
              Gunungpati, Kota Semarang, 50224
            </p>
          </div>

          {/* Kolom 3 Link Navigasi */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-semibold mb-4">KONTAK KAMI</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center justify-center lg:justify-start space-x-3">
                <FaPhoneAlt className="inline-block" />
                <a
                  href="tel:+621234567890"
                  className="hover:text-white transition-colors"
                >
                  +62 123-4567-890
                </a>
              </li>
              <li className="flex items-center justify-center lg:justify-start space-x-3">
                <FaEnvelope className="inline-block" />
                <a
                  href="mailto:kontak@banyubiru.desa.id"
                  className="hover:text-white transition-colors"
                >
                  kontak@pongangan.desa.id
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4 Media Sosial */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-semibold mb-4">IKUTI KAMI</h3>
            <div className="flex justify-center lg:justify-start space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaFacebook size={24} />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaInstagram size={24} />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaYoutube size={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-teal-700">
        <div className="container mx-auto px-4 py-4 text-center text-gray-50 text-sm">
          &copy; {new Date().getFullYear()} SIDATA DESA. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
