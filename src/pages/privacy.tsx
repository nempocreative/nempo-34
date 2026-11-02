import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useLocation } from "@/lib/wouter";
import {
  ArrowLeft, Shield, Eye, Database, Lock, UserCheck,
  RefreshCw, Globe, Mail, ChevronDown, ChevronUp,
} from "lucide-react";
import { useState } from "react";

const SECTIONS = [
  {
    icon: Database,
    color: "text-[#0194f3] bg-blue-50",
    title: "Data yang Kami Kumpulkan",
    content: [
      "**Informasi Akun**: Nama, alamat email, nomor telepon, dan foto profil yang Anda berikan saat mendaftar atau memperbarui profil.",
      "**Data Aktivitas**: Destinasi yang Anda kunjungi, ulasan yang ditulis, dan riwayat pencarian dalam aplikasi untuk personalisasi rekomendasi.",
      "**Data Perangkat**: Jenis perangkat, sistem operasi, browser, dan alamat IP untuk keamanan akun dan analitik penggunaan.",
      "**Preferensi**: Pengaturan notifikasi, bahasa, mata uang, dan preferensi konten yang Anda pilih dalam aplikasi.",
    ],
  },
  {
    icon: Eye,
    color: "text-violet-500 bg-violet-50",
    title: "Cara Kami Menggunakan Data",
    content: [
      "**Personalisasi**: Menampilkan rekomendasi destinasi, kuliner, dan penginapan yang relevan berdasarkan preferensi dan riwayat aktivitas Anda.",
      "**Keamanan**: Mendeteksi dan mencegah akses tidak sah ke akun Anda, serta memantau aktivitas mencurigakan.",
      "**Peningkatan Layanan**: Menganalisis pola penggunaan secara agregat untuk memperbaiki fitur dan pengalaman aplikasi.",
      "**Komunikasi**: Mengirimkan notifikasi transaksi, update fitur, dan informasi event lokal Jawa Barat sesuai preferensi Anda.",
    ],
  },
  {
    icon: Lock,
    color: "text-emerald-500 bg-emerald-50",
    title: "Keamanan Data",
    content: [
      "**Enkripsi**: Semua data sensitif (password, token) dienkripsi menggunakan standar industri bcrypt dan JWT sebelum disimpan.",
      "**HTTPS**: Seluruh komunikasi antara aplikasi dan server menggunakan protokol HTTPS/TLS untuk mencegah penyadapan.",
      "**Autentikasi Berlapis**: Tersedia Two-Factor Authentication (2FA) dan pemantauan sesi aktif untuk keamanan ekstra.",
      "**Akses Terbatas**: Hanya staf yang berwenang yang dapat mengakses data pengguna, dengan log audit untuk setiap akses.",
    ],
  },
  {
    icon: Globe,
    color: "text-orange-500 bg-orange-50",
    title: "Berbagi Data dengan Pihak Ketiga",
    content: [
      "**Tidak Dijual**: Kami tidak menjual, menyewakan, atau memperdagangkan data pribadi Anda kepada pihak ketiga manapun.",
      "**Mitra Terpercaya**: Data dapat dibagikan kepada mitra teknologi (hosting, analitik) yang terikat perjanjian kerahasiaan data.",
      "**Kewajiban Hukum**: Kami dapat mengungkapkan data jika diwajibkan oleh hukum yang berlaku di Indonesia.",
      "**Destinasi Lokal**: Informasi ulasan dapat ditampilkan secara publik di platform sesuai pengaturan privasi akun Anda.",
    ],
  },
  {
    icon: UserCheck,
    color: "text-rose-500 bg-rose-50",
    title: "Hak-Hak Anda",
    content: [
      "**Akses Data**: Anda berhak mengunduh salinan data pribadi Anda kapan saja melalui menu Pengaturan → Unduh Data.",
      "**Koreksi**: Anda dapat memperbarui informasi profil kapan saja melalui halaman Pengaturan → Profil Saya.",
      "**Penghapusan**: Anda berhak meminta penghapusan akun dan seluruh data terkait melalui menu Pengaturan → Hapus Akun.",
      "**Portabilitas**: Data Anda tersedia dalam format JSON yang dapat digunakan lintas platform.",
    ],
  },
  {
    icon: RefreshCw,
    color: "text-amber-500 bg-amber-50",
    title: "Pembaruan Kebijakan",
    content: [
      "Kebijakan privasi ini dapat diperbarui sewaktu-waktu untuk mencerminkan perubahan praktik atau persyaratan hukum.",
      "Perubahan signifikan akan dinotifikasikan melalui email atau notifikasi dalam aplikasi minimal 7 hari sebelum berlaku.",
      "Dengan terus menggunakan aplikasi setelah perubahan, Anda dianggap menyetujui kebijakan yang diperbarui.",
    ],
  },
];

function AccordionItem({ section, idx }: { section: typeof SECTIONS[0]; idx: number }) {
  const [open, setOpen] = useState(idx === 0);
  const Icon = section.icon;
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${open ? "border-gray-200 shadow-sm" : "border-gray-100"}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${section.color}`}>
          <Icon className="w-4 h-4" strokeWidth={2} />
        </div>
        <p className="flex-1 text-sm font-bold text-gray-800">{section.title}</p>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 bg-white border-t border-gray-50 space-y-2.5 pt-3">
          {section.content.map((text, i) => {
            const [bold, ...rest] = text.split(": ");
            const isBold = text.startsWith("**") && text.includes("**:");
            const cleanBold = bold.replace(/\*\*/g, "");
            const restText = rest.join(": ");
            return (
              <div key={i} className="flex gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  {isBold ? (
                    <><span className="font-bold text-gray-800">{cleanBold}:</span> {restText}</>
                  ) : text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PrivacyPage() {
  const [, navigate] = useLocation();

  return (
    <Layout>
      <SEO title="Kebijakan Privasi" description="Pelajari bagaimana Nempo Organizer mengumpulkan, menggunakan, dan melindungi data pribadi Anda." path="/privasi" />
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div
          className="relative pt-safe"
          style={{ background: "linear-gradient(135deg, #001E6E 0%, #0046B8 60%, #0194f3 100%)" }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 80% 30%, #FFC300 0%, transparent 55%)" }} />
          <div className="relative px-4 pt-5 pb-6">
            <button
              onClick={() => navigate("/settings")}
              className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center mb-4"
            >
              <ArrowLeft className="w-4 h-4 text-white" strokeWidth={2} />
            </button>
            <div className="flex items-end gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
                <Shield className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-white font-black text-xl leading-none">Kebijakan Privasi</h1>
                <p className="text-white/50 text-xs mt-1">Terakhir diperbarui: April 2025</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-white/60 text-[11px]">Berlaku untuk semua pengguna</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-3">
          {/* Intro */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Nempo Organizer berkomitmen melindungi privasi dan data pribadi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
            </p>
            <div className="flex items-center gap-2 mt-3 bg-blue-50 rounded-xl px-3 py-2">
              <Mail className="w-4 h-4 text-[#0194f3] shrink-0" strokeWidth={2} />
              <p className="text-xs text-blue-700">
                Pertanyaan: <span className="font-bold">privacy@nempo.id</span>
              </p>
            </div>
          </div>

          {/* Accordion sections */}
          <div className="space-y-2">
            {SECTIONS.map((s, i) => <AccordionItem key={i} section={s} idx={i} />)}
          </div>

          {/* Version */}
          <div className="text-center py-2">
            <p className="text-[11px] text-gray-300 font-medium">Versi Kebijakan 2.1 · April 2025</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
