import { useState } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, MessageCircle, Phone, Search, X } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { NEMPO_CONSULT_URL } from "@/lib/contact";

const FAQS = [
  { q: "Bagaimana cara mendapatkan voucher?", a: "Voucher bisa didapatkan dengan mendaftar akun baru (NEWBIE10), melakukan login harian, mencapai milestone poin, atau dari program event khusus. Cek halaman Voucher Saya untuk melihat semua voucher aktif." },
  { q: "Poin saya berkurang, kenapa?", a: "Poin dapat berkurang jika ditukar dengan voucher diskon. Setiap penukaran akan tercatat di riwayat transaksi poin kamu." },
  { q: "Apakah bisa ubah email akun?", a: "Saat ini email tidak dapat diubah karena digunakan sebagai identitas utama akun. Jika ada masalah, hubungi kami melalui Instagram @nempo.id." },
  { q: "Bagaimana cara menulis ulasan?", a: "Kunjungi halaman detail wisata, kuliner, atau penginapan yang ingin kamu ulas, scroll ke bawah ke bagian Ulasan, lalu klik 'Tulis Ulasan'. Kamu harus login terlebih dahulu." },
  // { q: "Donasi bibit apa yang bisa dilakukan?", a: "Program Donasi Bibit adalah program penghijauan bersama Dinas Lingkungan Hidup Kab. Garut. Kamu bisa mendonasikan berbagai jenis bibit pohon untuk ditanam di lokasi-lokasi yang sudah ditentukan." },
  { q: "Bagaimana cara menghapus akun?", a: "Pergi ke Profil → Pengaturan → Hapus Akun. Permintaan akan direview dalam 1-3 hari kerja. Data kamu akan dihapus permanen setelah disetujui." },
];

export default function BantuanPage() {
  const [open,        setOpen]       = useState<number | null>(null);
  const [faqSearch,   setFaqSearch]  = useState("");

  const filteredFaqs = faqSearch
    ? FAQS.filter(f => f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase()))
    : FAQS;

  return (
    <Layout>
      <SEO title="Bantuan & FAQ" description="Temukan jawaban atas pertanyaan umum tentang Nempo Organizer, voucher, poin, ulasan, dan fitur lainnya." path="/bantuan" />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <Link href="/profil">
            <button className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
          </Link>
          <h1 className="font-bold text-gray-900 text-[15px]">Bantuan & FAQ</h1>
        </div>

        <div className="max-w-2xl mx-auto px-4 pt-5 pb-24 md:pb-10 space-y-6">

          {/* Bird search */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-white rounded-2xl shadow-xl border border-gray-100 pr-1.5 overflow-visible transition-all">
              <div className="flex items-center justify-center shrink-0" style={{ marginLeft:2, marginTop:2 }}>
                <DotLottieReact
                  src={`${import.meta.env.BASE_URL}animations/bird.json`}
                  loop autoplay
                  style={{ width:36, height:36 }}
                />
              </div>
              <div className="w-px self-stretch my-2 mx-1.5 shrink-0 bg-gray-200" />
              <input
                type="text"
                value={faqSearch}
                onChange={e => setFaqSearch(e.target.value)}
                placeholder="Cari pertanyaan atau topik bantuan…"
                className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 font-medium bg-transparent py-3 px-1"
              />
              {faqSearch && (
                <button onClick={() => setFaqSearch("")} className="text-gray-400 hover:text-gray-600 mr-1">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                className="shrink-0 active:scale-95 transition-all rounded-xl flex items-center justify-center gap-1.5"
                style={{ background:"#0194f3", color:"#fff", boxShadow:"0 4px 12px rgba(1,148,243,0.35)", padding:"10px 12px" }}
              >
                <Search className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-sm font-bold">Cari</span>
              </button>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Pertanyaan Umum</p>
            <div className="space-y-2">
              {filteredFaqs.map((f, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                    onClick={() => setOpen(open === i ? null : i)}>
                    <span className="font-semibold text-gray-800 text-sm">{f.q}</span>
                    {open === i
                      ? <ChevronUp className="h-4 w-4 text-[#0194f3] shrink-0" />
                      : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                  </button>
                  {open === i && (
                    <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Hubungi Kami</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: MessageCircle, label: "Instagram", val: "@nempo.id", href: "https://instagram.com/nempo.id", color: "text-pink-500 bg-pink-50" },
                { icon: MessageCircle, label: "DM Instagram", val: "@nempo.id", href: NEMPO_CONSULT_URL, color: "text-pink-500 bg-pink-50" },
              ].map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-2 hover:border-gray-200 hover:shadow-md transition-all">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${c.color}`}>
                    <c.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">{c.label}</span>
                  <span className="text-[10px] text-gray-400 text-center">{c.val}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
