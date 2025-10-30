import Image from "next/image";
import Hero from "@/components/Hero";
import TentangDesa from "@/components/TentangDesa/TentangDesa";
import DataSection from "@/components/DataSection";
import Gallery from "@/components/Gallery";

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
