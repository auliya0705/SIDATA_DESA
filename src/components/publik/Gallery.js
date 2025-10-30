"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Gallery() {
    const images = [
        "/images/hero.jpeg",
        "/images/banyubiru.jpeg",
        "/images/hero.jpeg",
        "/images/banyubiru.jpeg",
    ];

    return (
        <section id="galerry" className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-teal-800 mb-12">
                    Galeri Desa
                </h2>

                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    loop={true}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                    }}
                    className="mySwiper"
                >
                    {images.map((src, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                                <Image
                                    src={src}
                                    alt={`Gallery Image ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transform hover:scale-110 transition-transform duration-300 ease-in-out"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
