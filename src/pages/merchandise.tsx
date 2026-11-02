import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { SedangDipersiapkan } from "@/components/sedang-dipersiapkan";
import { Shirt } from "lucide-react";

export default function MerchandisePage() {
  return (
    <Layout>
      <SEO title="Merchandise Nempo Organizer" noIndex />
      <SedangDipersiapkan
        icon={Shirt}
        iconGradient="linear-gradient(135deg, #0172B1, #1BA0E2)"
        dotColor1="#0194f3"
        dotColor2="#7DD3FC"
        title="Sedang Dipersiapkan"
        titleHighlight="Penuh Semangat"
        description="Merchandise resmi Nempo Organizer — kaos, topi, tumbler, dan aksesoris kece lainnya. Segera hadir."
        btn1Label="Jelajahi Wisata Alam"
        btn1Href="/wisata"
        btn2Label="Cek Oleh-oleh"
        btn2Href="/sentra-oleh-oleh"
      />
    </Layout>
  );
}
