"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      {/* Background Image */}
      <Image
        src="/images/hero.jpeg"
        alt="Hero Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="absolute object-cover inset-0 opacity-75 -z-10 blur-xs"
        priority
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-teal-950 opacity-50 -z-10"></div>

      {/* Konten */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Selamat Datang di <span className="text-teal-300">SIDATA DESA</span>
        </h1>
        <p className="text-lg md:text-xl font-medium mb-6">
            Website resmi Desa Pongangan yang menyediakan informasi dan data desa secara transparan dan akurat
        </p>
      </div>
      
    </section>
  );
}