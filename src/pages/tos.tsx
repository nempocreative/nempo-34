import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import { ArrowLeft, FileText, ShieldCheck, Scale, AlertTriangle } from "lucide-react";

const SECTIONS = [
  {
    icon: FileText,
    title: "Ketentuan Penggunaan",
    color: "text-[#0194f3] bg-blue-50",
    content: `Dengan menggunakan aplikasi Nempo Organizer, Anda menyetujui untuk mematuhi ketentuan ini. Layanan ini ditujukan untuk membantu pengguna menemukan, menjelajahi, dan menikmati pariwisata, kuliner, penginapan, dan event di Jawa Barat.`,
  },
  {
    icon: ShieldCheck,
    title: "Privasi & Data",
    color: "text-emerald-500 bg-emerald-50",
    content: `Kami mengumpulkan data dasar (nama, email, aktivitas) untuk meningkatkan pengalaman pengguna. Data tidak dijual ke pihak ketiga. Anda dapat meminta penghapusan akun kapan saja melalui menu Pengaturan → Hapus Akun.`,
  },
  {
    icon: Scale,
    title: "Hak & Kewajiban",
    color: "text-violet-500 bg-violet-50",
    content: `Pengguna bertanggung jawab atas kebenaran data yang diberikan. Ulasan, komentar, dan konten yang diunggah tidak boleh mengandung unsur SARA, kebencian, atau melanggar hukum. Nempo Organizer berhak menghapus konten yang melanggar ketentuan.`,
  },
  {
    icon: AlertTriangle,
    title: "Batasan Tanggung Jawab",
    color: "text-orange-500 bg-orange-50",
    content: `Informasi yang tersedia merupakan upaya terbaik kami namun tidak menjamin akurasi penuh. Harga, jam operasional, dan ketersediaan destinasi dapat berubah. Nempo Organizer tidak bertanggung jawab atas kerugian akibat informasi yang tidak akurat.`,
  },
];

export default function TosPage() {
  return (
    <Layout>
      <SEO title="Syarat & Ketentuan" description="Baca syarat dan ketentuan penggunaan platform digital pariwisata Nempo Organizer." path="/syarat-ketentuan" />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <Link href="/profil">
            <button className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
          </Link>
          <h1 className="font-bold text-gray-900 text-[15px]">Syarat & Ketentuan</h1>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5 space-y-3">
          <p className="text-xs text-gray-400 text-center">Terakhir diperbarui: Januari 2025</p>

          {SECTIONS.map(s => (
            <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                  <s.icon className="h-4.5 w-4.5" />
                </div>
                <h2 className="font-bold text-gray-900 text-sm">{s.title}</h2>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{s.content}</p>
            </div>
          ))}

          <div className="bg-[#f0f8ff] border border-blue-100 rounded-2xl p-4 text-center">
            <p className="text-xs text-[#0172B1] font-semibold">Pertanyaan seputar kebijakan?</p>
            <p className="text-xs text-gray-400 mt-0.5">Hubungi kami melalui Instagram <strong>@nempo.id</strong></p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
