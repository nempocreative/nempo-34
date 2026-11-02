import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import {
  NEMPO_WA_NUMBER,
  NEMPO_WA_URL,
  NEMPO_INSTAGRAM_HANDLE,
  NEMPO_INSTAGRAM_URL,
  NEMPO_INSTAGRAM_DM_URL,
} from "@/lib/contact";
import { ArrowUpRight, Clock, Instagram, MapPin, MessageCircle, Music2 } from "lucide-react";

const channels = [
  {
    name: "WhatsApp",
    value: NEMPO_WA_NUMBER,
    description: "Konsultasi acara, harga, dan pemesanan. Balasan paling cepat di sini.",
    href: NEMPO_WA_URL,
    icon: MessageCircle,
    iconBg: "#25D366",
  },
  {
    name: "Instagram",
    value: NEMPO_INSTAGRAM_HANDLE,
    description: "Lihat karya terbaru dan kirim pesan lewat DM Instagram.",
    href: NEMPO_INSTAGRAM_DM_URL,
    icon: Instagram,
    iconBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
  },
  {
    name: "TikTok",
    value: "@nempo.id",
    description: "Potret keseruan acara dan behind the scene tim Nempo.",
    href: "https://tiktok.com/@nempo.id",
    icon: Music2,
    iconBg: "#000000",
  },
];

export default function ContactPage() {
  return (
    <Layout>
      <SEO
        title="Contact — Nempo Organizer"
        description="Hubungi Nempo Organizer lewat WhatsApp, Instagram, atau TikTok untuk konsultasi acara, konten, dan layanan kreatif."
        keywords="kontak Nempo, WhatsApp Nempo Organizer, Instagram nempo.id, konsultasi event Jawa Barat"
        path="/contact"
      />

      <main className="min-h-screen overflow-hidden bg-white text-[#17233a]">
        {/* ===== HEADER ===== */}
        <section className="relative overflow-hidden text-white" style={{ background: "linear-gradient(145deg, #0172B1 0%, #0194f3 55%, #1BA0E2 100%)" }}>
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/55">
              Nempo Organizer
            </p>
            <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Contact
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              Ceritakan kebutuhanmu — acara, konten, undangan, atau website.
              Semua percakapan dimulai dari satu pesan singkat.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5"><Clock className="h-3.5 w-3.5" /> Respons cepat di jam kerja</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5"><MapPin className="h-3.5 w-3.5" /> Garut · Jawa Barat</span>
            </div>
          </div>
        </section>

        {/* ===== CHANNELS ===== */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <a
                    key={channel.name}
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-2xl text-white"
                        style={{ background: channel.iconBg }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0194f3]" />
                    </div>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      {channel.name}
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-slate-800">
                      {channel.value}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {channel.description}
                    </p>
                  </a>
                );
              })}
            </div>

            <div className="mt-10">
              <h2 className="text-center text-lg font-black tracking-[-0.03em] text-slate-800 sm:text-xl">Cara mulai bareng Nempo</h2>
              <ol className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { t: "Kirim pesan", d: "Sapa kami di WhatsApp, sebutkan layanan yang kamu butuhkan." },
                  { t: "Konsultasi konsep", d: "Kami bantu susun ide, kebutuhan, dan estimasi biaya." },
                  { t: "Eksekusi", d: "Setelah sepakat, tim Nempo langsung jalan sampai selesai." },
                ].map((step, i) => (
                  <li key={step.t} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0194f3]/10 text-sm font-black text-[#0194f3]">{i + 1}</span>
                    <p className="mt-3 text-sm font-extrabold text-slate-800">{step.t}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{step.d}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
              <h2 className="text-lg font-black tracking-[-0.03em] text-slate-800 sm:text-xl">
                Mau ngobrol langsung?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Klik WhatsApp di atas dan sapa kami. Tim kreatif Nempo siap
                bantu susun konsep, bentuk, sampai pelaksanaannya.
              </p>
              <a
                href={NEMPO_WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0194f3] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0194f3]/30 transition hover:-translate-y-0.5 hover:bg-[#0172B1]"
              >
                <MessageCircle className="h-4 w-4" />
                Chat WhatsApp Nempo
              </a>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
