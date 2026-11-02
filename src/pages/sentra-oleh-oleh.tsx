import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { SedangDipersiapkan } from "@/components/sedang-dipersiapkan";
import { Gift } from "lucide-react";

export default function SentraOlehOlehPage() {
  return (
    <Layout>
      <SEO title="Sentra Oleh-Oleh Garut" description="Temukan oleh-oleh khas Garut — dodol, jaket kulit, kerajinan tangan, dan camilan favorit. Segera hadir." noIndex path="/sentra-oleh-oleh" />
      <SedangDipersiapkan
        icon={Gift}
        iconGradient="linear-gradient(135deg, #EA580C, #FDBA74)"
        dotColor1="#FB923C"
        dotColor2="#FDE68A"
        title="Sedang Dipersiapkan"
        titleHighlight="Penuh Semangat"
        description="Sentra oleh-oleh khas Garut — dodol, jaket kulit, kerajinan tangan, dan camilan favorit. Segera hadir."
        btn1Label="Jelajahi Kuliner Garut"
        btn1Href="/kuliner"
        btn2Label="Cek Merchandise"
        btn2Href="/merchandise"
      />
    </Layout>
  );
}
