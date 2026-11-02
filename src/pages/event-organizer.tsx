import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout";
import { Link } from "@/lib/wouter";
import { Button } from "@/components/ui/button";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import {
  PartyPopper, Building2, Music, GraduationCap, Trophy,
  MessageCircle, ClipboardList, Palette, Wrench, FileCheck,
  Check, MapPin, ArrowRight, Plus, Minus, Users,
} from "lucide-react";
import { eoTestimonials as testimonials } from "@/data/eo-testimonials";
import { LO_ADDONS, LO_EXCLUSION_NOTE, LO_TARIFFS, loRupiah } from "@/data/liaison-officer";

const hand = "font-[family-name:var(--font-wed-hand)]";

const services = [
  { icon: MapPin, title: "Outing & Tour", color: "#6366F1", desc: "Perjalanan wisata rombongan, outing kantor, dan tur komunitas dengan transportasi lengkap." },
  { icon: Building2, title: "Corporate Event", color: "#0EA5E9", desc: "Gathering, launching produk, seminar, rapat kerja, dan family day perusahaan." },
  { icon: Music, title: "Konser & Festival", color: "#DB2777", desc: "Produksi panggung, sound, lighting, tiketing digital, dan manajemen talent." },
  { icon: GraduationCap, title: "Event Sekolah & Kampus", color: "#14B8A6", desc: "Pensi, wisuda, perpisahan, seminar, dan buku tahunan digital." },
  { icon: Trophy, title: "Lomba & Turnamen", color: "#0F766E", desc: "Registrasi online, penjurian, bracket, hingga penyerahan hadiah." },
  { icon: PartyPopper, title: "Ulang Tahun & Private Party", color: "#8B5CF6", desc: "Pesta keluarga, sweet seventeen, dan acara komunitas yang berkesan." },
];

const steps = [
  { icon: MessageCircle, title: "Konsultasi Gratis", color: "#6366F1", desc: "Ceritakan kebutuhan, tanggal, jumlah tamu, dan budget kamu." },
  { icon: ClipboardList, title: "Konsep & Penawaran", color: "#0EA5E9", desc: "Kami susun konsep, rundown awal, dan rincian biaya transparan." },
  { icon: Palette, title: "Persiapan & Desain", color: "#DB2777", desc: "Desain visual, vendor, venue, talent, dan technical meeting." },
  { icon: Wrench, title: "Eksekusi Hari H", color: "#14B8A6", desc: "Tim lapangan mengatur semua agar acara berjalan sesuai rundown." },
  { icon: FileCheck, title: "Laporan & Dokumentasi", color: "#0F766E", desc: "Foto, video highlight, dan evaluasi acara diserahkan ke kamu." },
];

const packages = [
  { name: "Basic", price: "Mulai Rp 3,5 jt", note: "Acara intim hingga 100 tamu", items: ["Konsultasi & rundown", "Koordinator hari H (3 crew)", "MC profesional", "Dekor sederhana", "Dokumentasi foto"] },
  { name: "Premium", price: "Mulai Rp 12 jt", note: "Hingga 500 tamu", popular: true, items: ["Semua fitur Basic", "Tim lapangan 8 crew", "Dekor & backdrop custom", "Sound system & lighting", "Foto + video highlight", "Undangan & tiket digital"] },
  { name: "Exclusive", price: "Custom", note: "Festival, konser, corporate besar", items: ["Semua fitur Premium", "Produksi panggung penuh", "Manajemen talent & artis", "Tiketing & scan QR", "Sosmed & publikasi", "Laporan pasca acara"] },
];

const stats = [
  { value: "150+", label: "Event terlaksana" },
  { value: "50rb+", label: "Peserta dilayani" },
  { value: "Jabar", label: "Area layanan" },
];

const faqs = [
  { q: "Berapa lama sebelum acara sebaiknya booking?", a: "Idealnya 1–3 bulan untuk acara besar dan 2–4 minggu untuk acara kecil. Jadwal mendadak tetap bisa kami bantu bila tersedia." },
  { q: "Apakah bisa menyesuaikan budget?", a: "Bisa. Semua paket fleksibel; kami bantu menyusun prioritas sesuai anggaran kamu." },
  { q: "Apakah melayani di luar Garut?", a: "Ya, kami melayani seluruh Jawa Barat. Biaya transport tim menyesuaikan lokasi." },
  { q: "Bagaimana sistem pembayarannya?", a: "DP 30% untuk mengunci tanggal, 50% saat persiapan, dan pelunasan H-3 acara." },
];

const marqueeItems = ["Konser & Festival", "Corporate Event", "Outing & Tour", "Pensi & Wisuda", "Lomba & Turnamen", "Private Party", "Garut • Jawa Barat"];

const eoIconCss = `
@keyframes eo-ring-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes eo-ring-glow { 0%,100% { opacity: .3; } 50% { opacity: .75; } }
@keyframes eo-tile-shine { 0%, 72% { transform: translateX(-130%) skewX(-18deg); } 100% { transform: translateX(230%) skewX(-18deg); } }
.eo-ring { position: absolute; inset: -3px -3px -5px; border-radius: 20px; overflow: hidden; padding: 2px; -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; filter: drop-shadow(0 0 5px var(--ring-color)) saturate(1.2); }
.eo-ring::before { content: ""; position: absolute; left: 50%; top: 50%; width: 180%; height: 180%; transform: translate(-50%, -50%);
  background: conic-gradient(from 0deg, transparent 0deg 190deg, var(--ring-tail) 250deg, var(--ring-color) 320deg, #fff 352deg, transparent 360deg);
  animation: eo-ring-spin 2.6s linear infinite; animation-delay: var(--ring-delay); }
.eo-glow { position: absolute; inset: -2px; border-radius: 20px; z-index: -1; pointer-events: none; background: radial-gradient(circle, var(--ring-color) 0%, transparent 70%); filter: blur(4px); animation: eo-ring-glow 3.2s ease-in-out infinite; animation-delay: var(--ring-delay); }
.eo-shine { position: absolute; inset: 0; width: 45%; pointer-events: none; background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent); animation: eo-tile-shine 4.8s ease-in-out infinite; animation-delay: var(--ring-delay); }
.wed-card-pop:hover .eo-ring::before { animation-duration: 1.4s; }

@keyframes eo-hero-in { from { opacity: 0; transform: translateY(26px) scale(.98); } to { opacity: 1; transform: none; } }
.eo-hero { animation: eo-hero-in .7s cubic-bezier(.22,1,.36,1) both; }

.eo-reveal { opacity: 0; transform: translateY(24px) scale(.985); will-change: opacity, transform; }
.eo-reveal.eo-in { opacity: 1; transform: none; transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1); }

@keyframes eo-glow-pulse { 0%,100% { box-shadow: 0 18px 42px -20px rgba(6,95,125,.5); } 50% { box-shadow: 0 26px 60px -16px rgba(6,95,125,.75); } }
.eo-glow-pulse { animation: eo-glow-pulse 2.8s ease-in-out infinite; }

@keyframes eo-shine-sweep { 0% { transform: translateX(-170%) skewX(-18deg); } 100% { transform: translateX(330%) skewX(-18deg); } }
.eo-btn-shine { position: relative; overflow: hidden; }
.eo-btn-shine::after { content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: 40%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent); transform: translateX(-170%) skewX(-18deg); pointer-events: none; }
.eo-btn-shine:hover::after { animation: eo-shine-sweep .8s ease; }

.wed-marquee:hover { animation-play-state: paused; }

@media (prefers-reduced-motion: reduce) {
  .eo-ring::before, .eo-glow, .eo-shine, .eo-glow-pulse { animation: none; }
  .eo-shine { display: none; }
  .eo-hero, .eo-reveal { opacity: 1 !important; transform: none !important; animation: none !important; transition: none !important; }
}
`;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("eo-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("eo-in");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`eo-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* Angka stats berjalan naik saat masuk layar — teks non-angka ditampilkan apa adanya */
function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const m = value.match(/^(\d[\d.,]*)(.*)$/);
  useEffect(() => {
    const el = ref.current;
    if (!el || !m) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = parseFloat(m[1].replace(",", "."));
    if (!Number.isFinite(target)) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const dur = 1200;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = `${Math.round(target * eased)}${m[2]}`;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <p ref={ref} className={className}>
      {value}
    </p>
  );
}

function StickerIcon({ icon: Icon, color, size = "md", className = "", delay = 0 }: { icon: React.ElementType; color: string; size?: "sm" | "md"; className?: string; delay?: number }) {
  const box = size === "sm" ? "h-11 w-11 rounded-[14px]" : "h-[54px] w-[54px] rounded-[17px]";
  return (
    <span
      className={`relative isolate m-1.5 inline-flex w-fit shrink-0 ${className}`}
      style={{ "--ring-color": color, "--ring-tail": `color-mix(in srgb, ${color} 35%, transparent)`, "--ring-delay": `${-delay * 0.4}s` } as React.CSSProperties}
    >
      <span aria-hidden className="eo-glow" />
      <span aria-hidden className="eo-ring" />
      <span
        className={`relative flex items-center justify-center overflow-hidden ${box}`}
        style={{
          background: `linear-gradient(148deg, color-mix(in srgb, ${color} 55%, white) 0%, ${color} 58%, color-mix(in srgb, ${color} 72%, black) 100%)`,
          boxShadow: `0 4px 0 color-mix(in srgb, ${color} 82%, black), 0 8px 13px -9px ${color}88, inset 0 1px 0 rgba(255,255,255,.54)`,
        }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_at_27%_17%,rgba(255,255,255,.42),transparent_56%)]" />
        <span aria-hidden className="pointer-events-none absolute inset-[1px] rounded-[inherit] border border-white/20" />
        <span aria-hidden className="eo-shine" />
        <Icon className={`relative z-10 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,.25)] ${size === "sm" ? "h-5 w-5" : "h-6 w-6"}`} strokeWidth={2.2} />
      </span>
    </span>
  );
}

/* Coretan tangan — pengganti ikon dekorasi biar tidak kaku */
function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 20" fill="none" className={className} aria-hidden>
      <path d="M3 13 C 11 3, 19 19, 27 10 S 43 3, 51 12 S 57 15, 57 8" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

function Burst({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <path d="M20 4v8M20 28v8M4 20h8M28 20h8M9 9l5.5 5.5M25.5 25.5L31 31M31 9l-5.5 5.5M14.5 25.5L9 31" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

function Ring({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <path d="M20 5 C 30 4, 36 12, 35 21 C 34 31, 24 37, 15 34 C 7 31, 3 22, 7 14 C 10 8, 15 6, 19 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function EventOrganizerPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [pkg, setPkg] = useState(1);
  const selected = packages[pkg] ?? packages[0];

  return (
    <Layout>
      <div className="bg-background pb-14 text-foreground">
        <style>{eoIconCss}</style>

        {/* ── HERO ── */}
        <section className="relative isolate overflow-hidden bg-brand px-6 pb-20 pt-14 text-primary-foreground sm:pt-20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-foreground/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-primary-foreground/20 blur-3xl" />
          <Burst className="wed-float pointer-events-none absolute left-[7%] top-16 h-8 w-8 text-primary-foreground/50" />
          <Burst className="wed-float-slow pointer-events-none absolute right-[9%] top-24 h-10 w-10 text-primary-foreground/30" />
          <Ring className="wed-wiggle pointer-events-none absolute left-[15%] bottom-24 h-6 w-6 text-brand-sky/70" />
          <Ring className="wed-float pointer-events-none absolute right-[16%] bottom-28 h-8 w-8 text-primary-foreground/40" />

          <div className="mx-auto max-w-5xl text-center">
            <p className={`${hand} eo-hero text-2xl text-brand-sky sm:text-3xl`}>punya rencana acara?</p>
            <h1 className="eo-hero mt-3 text-[38px] font-extrabold leading-[1.08] tracking-tight sm:text-6xl" style={{ animationDelay: "80ms" }}>
              Nempo
              <span className="mt-1 block text-brand-sky">Event Organizer</span>
            </h1>
            <p className="eo-hero mx-auto mt-6 max-w-xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base" style={{ animationDelay: "160ms" }}>
              Acara impianmu, kami yang urus dari awal sampai akhir — konsep kreatif, vendor terpercaya, dan tim lapangan berpengalaman di seluruh Jawa Barat.
            </p>
            <div className="eo-hero mt-8 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "240ms" }}>
              <Button asChild size="lg" className="wed-sticker eo-btn-shine rounded-full bg-card px-7 text-brand hover:bg-card/90">
                <a href="#paket">Lihat Paket EO <ArrowRight /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/40 bg-primary-foreground/10 px-7 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground">
                <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Konsultasi Dulu</a>
              </Button>
            </div>
            <div className="eo-hero mt-8 flex flex-wrap items-center justify-center gap-2" style={{ animationDelay: "320ms" }}>
              {packages.map((p, i) => (
                <span key={p.name} className="wed-sticker inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold backdrop-blur">
                  <Burst className={`h-3 w-3 ${i === 1 ? "text-brand-sky" : "text-primary-foreground/60"}`} />
                  {p.name}
                </span>
              ))}
            </div>
          </div>

          <svg className="absolute bottom-0 left-0 w-full text-brand-sky" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
            <path d="M0,32 C240,60 480,4 720,28 C960,52 1200,8 1440,32 L1440,60 L0,60 Z" fill="currentColor" />
          </svg>
        </section>

        {/* ── MARQUEE ── */}
        <div className="overflow-hidden bg-brand-sky py-3 text-brand" aria-hidden>
          <div className="wed-marquee flex w-max items-center gap-8">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-8 text-sm font-semibold tracking-wide">
                {item}
                <Burst className="h-3.5 w-3.5" />
              </span>
            ))}
          </div>
        </div>

        {/* ── STATS ── */}
        <section className="mx-auto max-w-5xl px-6 pt-10">
          <Reveal>
            <div className="grid grid-cols-3 divide-x divide-border rounded-3xl border-2 border-dashed border-brand/25 bg-card py-5 shadow-xl shadow-brand-navy/10">
              {stats.map((s) => (
                <div key={s.label} className="px-1 text-center">
                  <CountUp value={s.value} className="text-xl font-extrabold text-brand sm:text-2xl" />
                  <p className="mt-0.5 text-[11px] font-medium leading-tight text-muted-foreground sm:text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── LAYANAN ── */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <Reveal><SectionHead eyebrow="Layanan" title="Satu tim untuk semua acara" note="apapun acaranya, gas!" /></Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 60} className="h-full">
                <div className="wed-card-pop flex h-full flex-col items-center rounded-3xl border-2 border-dashed border-border bg-card p-4 text-center hover:border-brand/40 sm:p-5">
                  <StickerIcon icon={s.icon} color={s.color} delay={i} className="mb-3" />
                  <h3 className="text-[13px] font-bold leading-snug text-brand-navy sm:text-sm">{s.title}</h3>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PAKET ── */}
        <section id="paket" className="scroll-mt-24 bg-brand-sky/60 px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <SectionHead eyebrow="Pilihan Paket" title="Pilih sesuai kebutuhanmu" note="ada yang pas buat semua" />
            <div className="grid grid-cols-3 gap-2 sm:gap-3" role="group" aria-label="Pilihan paket EO">
              {packages.map((p, i) => (
                <Button
                  key={p.name}
                  variant="outline"
                  aria-pressed={pkg === i}
                  onClick={() => setPkg(i)}
                  className={`wed-sticker h-auto rounded-2xl px-1 py-3 text-xs sm:text-sm ${
                    pkg === i ? "border-brand bg-brand text-primary-foreground hover:bg-brand hover:text-primary-foreground" : "border-dashed border-brand/30 bg-card text-brand-navy hover:border-brand/60"
                  }`}
                >
                  {p.name}
                </Button>
              ))}
            </div>

            <article className="wed-card-pop relative mt-6 rounded-3xl border-2 border-dashed border-brand/30 bg-card p-6 sm:p-8" aria-label={`Paket ${selected.name}`}>
              {selected.popular && (
                <span className="wed-sticker wed-wiggle absolute -top-4 right-6 rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-primary-foreground">
                  Paling Diminati
                </span>
              )}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className={`${hand} text-xl text-brand`}>paket</p>
                  <h3 className="-mt-1 text-3xl font-extrabold text-brand-navy">{selected.name}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4 text-brand" />{selected.note}</p>
                </div>
                <div className="rounded-2xl bg-brand-sky px-5 py-4 text-center">
                  <p className="text-2xl font-extrabold text-brand sm:text-3xl">{selected.price}</p>
                  <p className="mt-1 text-xs text-muted-foreground">harga indikatif</p>
                </div>
              </div>
              <ul className="mt-6 grid gap-3 border-t border-dashed border-border pt-6 sm:grid-cols-2">
                {selected.items.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-sky">
                      <Check className="h-3 w-3 text-brand" strokeWidth={3} />
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="wed-sticker eo-btn-shine mt-6 rounded-full bg-brand-navy px-7 text-primary-foreground hover:bg-brand-navy/90">
                <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Konsultasi {selected.name} <ArrowRight /></a>
              </Button>
            </article>
            <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
              Harga bisa disesuaikan dengan budget. Lihat semua rincian di <Link href="/price-list" className="font-semibold text-brand underline underline-offset-2">Daftar Harga</Link>.
            </p>
          </div>
        </section>

        {/* ── EVENT LIAISON OFFICER SERVICE ── */}
        <section id="liaison-officer" className="scroll-mt-24 px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <Reveal><SectionHead eyebrow="Event Liaison Officer Service" title="Pendamping acara yang sigap" note="harga per orang" /></Reveal>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              {LO_TARIFFS.map((t, i) => (
                <Reveal key={t.id} delay={i * 60} className="h-full">
                  <article data-lo={t.id} className={`wed-card-pop relative flex h-full flex-col rounded-3xl border-2 p-6 ${t.id === "half-day" ? "border-brand bg-brand-sky" : "border-dashed border-brand/30 bg-card"}`}>
                    {t.id === "half-day" && (
                      <span className="wed-sticker wed-wiggle absolute -top-3.5 right-5 rounded-full bg-brand px-3.5 py-1 text-xs font-bold text-primary-foreground">Mulai di sini</span>
                    )}
                    <p className="text-xs font-bold uppercase tracking-wider text-brand">{t.name}</p>
                    <p className="mt-2 text-3xl font-extrabold text-brand-navy">{loRupiah(t.price)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t.duration}</p>
                    <ul className="mt-5 flex-1 space-y-2.5 border-t border-dashed border-border pt-5">
                      {t.items.map((it) => (
                        <li key={it} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{it}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="mt-6 rounded-full bg-brand-navy text-primary-foreground hover:bg-brand-navy/90">
                      <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Pilih {t.name} <ArrowRight /></a>
                    </Button>
                  </article>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 rounded-3xl border-2 border-dashed border-border bg-card p-5 sm:p-6">
              <p className="text-sm font-bold text-brand-navy">Harga tambahan</p>
              <dl className="mt-3 divide-y divide-dashed divide-border">
                {LO_ADDONS.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <dt className="text-brand-navy">{a.name}</dt>
                    <dd className="font-bold text-brand">{a.startingFrom ? <span className="mr-1 text-xs font-normal text-muted-foreground">Mulai</span> : null}{loRupiah(a.price)}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{LO_EXCLUSION_NOTE}</p>
            </div>
          </div>
        </section>

        {/* ── CARA KERJA ── */}

        <section className="mx-auto max-w-5xl px-6 py-12">
          <Reveal><SectionHead eyebrow="Cara Kerja" title="5 langkah, tanpa ribet" note="kamu santai, kami yang gerak" /></Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 60} className="h-full">
                <div className="wed-card-pop flex h-full gap-4 rounded-3xl border-2 border-dashed border-border bg-card p-4 hover:border-brand/40 lg:flex-col lg:items-center lg:text-center">
                  <StickerIcon icon={s.icon} color={s.color} size="sm" className="self-start lg:self-center" />
                  <div>
                    <p className="text-[11px] font-extrabold text-brand">LANGKAH {String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-0.5 text-sm font-bold text-brand-navy">{s.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── TESTIMONI ── */}
        <section className="bg-card py-12">
          <div className="mx-auto max-w-5xl">
            <div className="px-6"><SectionHead eyebrow="Testimoni" title="Kata klien kami" note="mereka puas, kamu kapan?" /></div>
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {testimonials.map((t) => (
                <div key={t.name} className="flex w-[85%] shrink-0 snap-center flex-col rounded-3xl border-2 border-dashed border-brand/25 bg-background p-5 sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)]">
                  <p className={`${hand} mb-1 text-3xl leading-none text-brand`} aria-hidden>”</p>
                  <p className="flex-1 text-[13px] leading-relaxed">“{t.text}”</p>
                  <div className="mt-4 flex items-center gap-3 border-t border-dashed border-border pt-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-sky text-sm font-bold text-brand">{t.name.charAt(0)}</div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-brand-navy">{t.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <SectionHead eyebrow="Tanya Jawab" title="Detail sebelum pemesanan" note="biar gak penasaran" />
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className={`rounded-2xl border-2 transition-colors ${open === i ? "border-brand/40 bg-card" : "border-dashed border-border bg-card/60"}`}>
                <Button
                  variant="ghost"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`eo-answer-${i}`}
                  className="h-auto w-full justify-between gap-3 whitespace-normal rounded-2xl px-5 py-4 text-left text-sm font-semibold text-brand-navy hover:bg-transparent"
                >
                  {f.q}
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${open === i ? "bg-brand text-primary-foreground" : "bg-brand-sky text-brand"}`}>
                    {open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </Button>
                {open === i && <p id={`eo-answer-${i}`} className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative isolate overflow-hidden bg-brand px-6 py-14 text-center text-primary-foreground">
          <Burst className="wed-float pointer-events-none absolute left-[10%] top-10 h-8 w-8 text-primary-foreground/30" />
          <Ring className="wed-float-slow pointer-events-none absolute right-[12%] bottom-12 h-10 w-10 text-primary-foreground/25" />
          <Squiggle className="wed-wiggle pointer-events-none absolute right-[22%] top-8 h-5 w-12 text-brand-sky" />
          <Burst className="wed-pulse-heart mx-auto h-9 w-9 text-brand-sky" />
          <p className={`${hand} mt-4 text-2xl text-brand-sky`}>jangan cuma jadi wacana</p>
          <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">Siap Bikin Acara Berkesan?</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/90">Konsultasi gratis — ceritakan rencana acaramu, kami bantu wujudkan.</p>
          <Button asChild size="lg" variant="secondary" className="wed-sticker eo-btn-shine mt-7 rounded-full bg-card px-8 text-brand hover:bg-card/90">
            <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Mulai Konsultasi <ArrowRight /></a>
          </Button>
        </section>
      </div>
    </Layout>
  );
}

function SectionHead({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div className="mb-7 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
      <h2 className="mt-2 text-[26px] font-extrabold leading-tight text-brand-navy sm:text-4xl">{title}</h2>
      {note && <p className={`${hand} mt-1 text-xl text-brand`}>{note}</p>}
    </div>
  );
}
