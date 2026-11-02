import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Map } from "lucide-react";
import { SedangDipersiapkan } from "@/components/sedang-dipersiapkan";

export default function ItineraryComingSoonPage() {
  return (
    <Layout>
      <SEO
        title="Travel Planner Jawa Barat — Rencanakan Perjalananmu"
        description="Rencanakan perjalanan wisata ke Jawa Barat dengan mudah — rekomendasi rute, destinasi, kuliner, dan penginapan terbaik."
      />
      <SedangDipersiapkan
        icon={Map}
        iconGradient="linear-gradient(135deg, #0194f3 0%, #7C3AED 100%)"
        dotColor1="#0194f3"
        dotColor2="#7C3AED"
        title="Travel Planner Jawa Barat"
        titleHighlight="Sedang Dipersiapkan"
        description="Kami sedang menyiapkan fitur perencanaan perjalanan terbaik — rute wisata, rekomendasi kuliner, penginapan, dan itinerary otomatis khusus Jawa Barat."
        btn1Label="Jelajahi Wisata"
        btn1Href="/wisata"
        btn2Label="Cari Penginapan"
        btn2Href="/penginapan"
      />
    </Layout>
  );
}
