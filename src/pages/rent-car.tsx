import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Car } from "lucide-react";
import { SedangDipersiapkan } from "@/components/sedang-dipersiapkan";

export default function RentCarPage() {
  return (
    <Layout>
      <SEO
        title="Travel & Transportasi Jawa Barat — Angkot, Bus, Ojek Online, Sewa Kendaraan"
        description="Informasi lengkap transportasi di Jawa Barat: angkot, bus, travel bandara, ojek online, dan sewa kendaraan. Mudah bepergian ke berbagai penjuru Jawa Barat."
      />
      <SedangDipersiapkan
        icon={Car}
        iconGradient="linear-gradient(135deg, #10B981 0%, #059669 100%)"
        dotColor1="#10B981"
        dotColor2="#34D399"
        title="Layanan Travel & Transportasi"
        titleHighlight="Sedang Dipersiapkan"
        description="Kami sedang menyiapkan layanan transportasi terbaik untuk memudahkan perjalananmu di Jawa Barat — sewa kendaraan, angkot, travel, dan lebih banyak lagi."
        btn1Label="Jelajahi Wisata"
        btn1Href="/wisata"
        btn2Label="Cari Penginapan"
        btn2Href="/penginapan"
      />
    </Layout>
  );
}
