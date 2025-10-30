import Image from "next/image";
import Hero from "@/components/publik/Hero";
import TentangDesa from "@/components/publik/TentangDesa/TentangDesa";
import DataSection from "@/components/publik/DataSection";
import Gallery from "@/components/publik/Gallery";

export default function Home() {
  return (
    <main>
      <Hero />
      <TentangDesa />
      <DataSection />
      <Gallery />
    </main>
  );
}
