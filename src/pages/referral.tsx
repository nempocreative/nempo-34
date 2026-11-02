import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { SedangDipersiapkan } from "@/components/sedang-dipersiapkan";
import { Gift } from "lucide-react";

export default function ReferralPage() {
  return (
    <Layout>
      <SEO title="Referral Teman" noIndex />
      <SedangDipersiapkan
        icon={Gift}
        iconGradient="linear-gradient(135deg,#8B5CF6 0%,#7C3AED 100%)"
        dotColor1="#8B5CF6"
        dotColor2="#C4B5FD"
        title="Referral Teman"
        titleHighlight="Segera Hadir"
        description="Ajak temanmu bergabung ke Nempo Organizer dan dapatkan poin bonus ekstra untuk setiap referral yang berhasil."
        btn1Label="Jelajahi Wisata"
        btn1Href="/wisata"
        btn2Label="Lihat Voucher Saya"
        btn2Href="/voucherlist"
      />
    </Layout>
  );
}
