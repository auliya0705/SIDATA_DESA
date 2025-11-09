"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = [
  "/images/g1.jpeg",
  "/images/g2.jpeg",
  "/images/g3.jpg",
  "/images/g4.jpg",
  "/images/g5.jpg",
  "/images/g6.jpeg",
  "/images/g7.jpg",
  "/images/g8.jpg",
  "/images/g9.jpg",
  "/images/g10.jpg",
  "/images/g11.jpg",
  "/images/g12.jpg",
  "/images/g13.jpg",
];

export default function Gallery() {
  const videoId = "xStPkvQCeP0";
  const [images, setImages] = useState(IMAGES.slice(0, 6));

  // Ganti gambar otomatis setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      IMAGES.forEach((_, index) => {
        setTimeout(() => {
          setImages((prev) => {
            const newImages = [...prev];
            const shuffled = [...IMAGES].sort(() => 0.5 - Math.random());
            newImages[index] = shuffled[0];
            return newImages;
          });
        }, index * 600); // delay antar gambar 0.6 detik
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center space-y-6">
      {/* ===== VIDEO ===== */}
      <div className="w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`}
          title="Video Profil Desa"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* ===== GRID FOTO ===== */}
      <div className="grid grid-cols-4 grid-rows-2 gap-3 max-w-6xl w-full">
        <GalleryImage
          src={images[0]}
          className="col-span-1 row-span-2 h-[400px]"
        />
        <GalleryImage
          src={images[1]}
          className="col-span-1 row-span-1 h-[195px]"
        />
        <GalleryImage
          src={images[5]}
          className="col-span-1 row-span-1 h-[195px]"
        />
        <GalleryImage
          src={images[3]}
          className="col-span-1 row-span-2 h-[400px]"
        />
        <GalleryImage
          src={images[4]}
          className="col-span-1 row-span-1 h-[195px]"
        />
        <GalleryImage
          src={images[2]}
          className="col-span-1 row-span-1 h-[195px]"
        />
      </div>
    </div>
  );
}

// Komponen gambar dengan animasi halus
function GalleryImage({ src, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-md ${className} w-full`}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={src}
          src={src}
          alt="Galeri Desa"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="object-cover w-full h-full"
        />
      </AnimatePresence>
    </div>
  );
}

// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import Image from "next/image";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// export default function Gallery() {
//     const images = [
//         "/images/hero.jpeg",
//         "/images/banyubiru.jpeg",
//         "/images/hero.jpeg",
//         "/images/banyubiru.jpeg",
//     ];

//     return (
//         <section id="galerry" className="bg-white py-16 sm:py-24">
//             <div className="container mx-auto px-4">
//                 <h2 className="text-3xl font-bold text-center text-teal-800 mb-12">
//                     Galeri Desa
//                 </h2>

//                 <Swiper
//                     modules={[Navigation, Pagination]}
//                     spaceBetween={30}
//                     slidesPerView={1}
//                     navigation
//                     pagination={{ clickable: true }}
//                     loop={true}
//                     breakpoints={{
//                         640: {
//                             slidesPerView: 2,
//                             spaceBetween: 20,
//                         },
//                         1024: {
//                             slidesPerView: 3,
//                             spaceBetween: 30,
//                         },
//                     }}
//                     className="mySwiper"
//                 >
//                     {images.map((src, index) => (
//                         <SwiperSlide key={index}>
//                             <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
//                                 <Image
//                                     src={src}
//                                     alt={`Gallery Image ${index + 1}`}
//                                     layout="fill"
//                                     objectFit="cover"
//                                     className="transform hover:scale-110 transition-transform duration-300 ease-in-out"
//                                 />
//                             </div>
//                         </SwiperSlide>
//                     ))}
//                 </Swiper>
//             </div>
//         </section>
//     );
// }
