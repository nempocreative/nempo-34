import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { SedangDipersiapkan } from "@/components/sedang-dipersiapkan";
import { Instagram, BadgeCheck, MapPin, Star, Phone, Camera, Users, TrendingUp, Megaphone, Shuffle, Palette, Shirt, LayoutGrid, BarChart3, CheckCircle2, Send } from "lucide-react";
import { NEMPO_CONSULT_URL } from "@/lib/contact";

/* ── Keyframe CSS injected once ─────────────────────────────── */
const BANNER_CSS = `
@keyframes kenBurns {
  0%   { transform: scale(1)    translateX(0%)    translateY(0%); }
  33%  { transform: scale(1.12) translateX(-1.5%) translateY(-1%); }
  66%  { transform: scale(1.08) translateX(1%)    translateY(-2%); }
  100% { transform: scale(1)    translateX(0%)    translateY(0%); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes float {
  0%,100% { transform: translateY(0px) rotate(-2deg); }
  50%      { transform: translateY(-10px) rotate(-2deg); }
}
@keyframes float2 {
  0%,100% { transform: translateY(0px) rotate(3deg); }
  50%      { transform: translateY(-14px) rotate(3deg); }
}
@keyframes float3 {
  0%,100% { transform: translateY(0px) rotate(-1deg); }
  50%      { transform: translateY(-8px) rotate(-1deg); }
}
@keyframes marqueeLeft {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes marqueeRight {
  0%   { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
@keyframes pulseRing {
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(1.7); opacity: 0; }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes benefitIn {
  from { opacity: 0; transform: translateY(28px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes lineGrow {
  from { width: 0; }
  to   { width: 100%; }
}
@keyframes scrollUp {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .banner-photo, .float-1, .float-2, .float-3, .marquee-left, .marquee-right, .scroll-up {
    animation: none !important;
  }
}
.reels-hero {
  height: clamp(340px, 55vw, 520px);
}
.reels-hero-gallery {
  width: 42%;
}
.reels-hero-copy {
  width: 58%;
  max-width: 58%;
}
.reels-hero-title {
  font-size: clamp(1.2rem, 5vw, 3.2rem);
}
.reels-creators-grid {
  align-items: start;
}
.reels-creator-card {
  min-width: 0;
}
.reels-creator-photo {
  touch-action: pan-y;
}
@media (max-width: 639px) {
  .reels-hero {
    height: clamp(360px, 108vw, 470px) !important;
  }
  .reels-hero-gallery {
    width: 34% !important;
    opacity: .72;
  }
  .reels-hero-copy {
    width: 69%;
    max-width: 69%;
    padding-left: 1rem;
    padding-right: .25rem;
  }
  .reels-hero-title {
    font-size: clamp(1.65rem, 8.7vw, 2.65rem);
    letter-spacing: -.045em;
  }
}
@media (max-width: 380px) {
  .reels-hero {
    height: 390px !important;
  }
  .reels-hero-gallery {
    width: 29% !important;
    opacity: .58;
  }
  .reels-hero-copy {
    width: 76%;
    max-width: 76%;
  }
  .reels-hero-title {
    font-size: 1.7rem;
  }
  .reels-creators-grid {
    grid-template-columns: 1fr !important;
  }
}
@media (min-width: 640px) and (max-width: 1023px) {
  .reels-hero {
    height: clamp(390px, 58vw, 500px) !important;
  }
}
.banner-photo  { animation: kenBurns 8s ease-in-out infinite; }
.float-1 { animation: float  3.8s ease-in-out infinite; }
.float-2 { animation: float2 4.5s ease-in-out infinite 0.6s; }
.float-3 { animation: float3 3.2s ease-in-out infinite 1.2s; }
.marquee-left  { animation: marqueeLeft  22s linear infinite; }
.marquee-right { animation: marqueeRight 18s linear infinite; }
.scroll-up     { animation: scrollUp 22s linear infinite; }
@media (min-width: 640px) { .bento-wide { grid-column: span 2 / span 2; } }
.strip-img { height: 72px; width: 54px; object-fit: cover; border-radius: 8px; flex-shrink: 0; opacity: 0.88; }
@media (min-width: 640px) { .strip-img { height: 110px; width: 82px; border-radius: 10px; } }
`;

/* ── TikTok icon ─────────────────────────────────────────────── */
const TikTokIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5
      2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28
      0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0
      006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.84 4.84 0 01-1.01-.1z"/>
  </svg>
);

/* ── Photo data — fetched from API ──────────────────────────── */
type BannerPhoto = { id: number; url: string; use_as_hero: boolean };

const SAFE_FALLBACK_PHOTOS = [
  "/images/hero/kolaborasi.webp",
  "/images/hero/karnaval.webp",
  "/images/hero/sate-maranggi.webp",
  "/images/hero/papandayan.webp",
  "/images/hero/dpakar.webp",
  "/images/hero/gunung-guntur.webp",
];

function resolveUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/api/")) return url;
  // legacy relative paths like "images/jmlc-vol1-1.jpg"
  return `/${url.replace(/^\//, "")}`;
}

const FALLBACK_PHOTOS: BannerPhoto[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  url: SAFE_FALLBACK_PHOTOS[i % SAFE_FALLBACK_PHOTOS.length],
  use_as_hero: [1, 3, 6, 9, 11, 14].includes(i + 1),
}));

function SafeImage({
  src,
  fallbackIndex = 0,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; fallbackIndex?: number }) {
  const fallback = SAFE_FALLBACK_PHOTOS[fallbackIndex % SAFE_FALLBACK_PHOTOS.length];
  const [currentSrc, setCurrentSrc] = useState(() => resolveUrl(src));

  useEffect(() => {
    setCurrentSrc(resolveUrl(src));
  }, [src]);

  return (
    <img
      {...props}
      src={currentSrc}
      onError={(event) => {
        if (currentSrc !== fallback) setCurrentSrc(fallback);
        props.onError?.(event);
      }}
    />
  );
}

/* ── Hero Banner ─────────────────────────────────────────────── */
function HeroBanner() {
  const [photos, setPhotos]   = useState<BannerPhoto[]>([]);
  const [active, setActive]   = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/influencer-banner-photos")
      .then(r => r.json())
      .then((d: BannerPhoto[]) => setPhotos(Array.isArray(d) && d.length > 0 ? d : FALLBACK_PHOTOS))
      .catch(() => setPhotos(FALLBACK_PHOTOS));
  }, []);

  const heroPhotos = photos.filter(p => p.use_as_hero);
  const allPhotos  = photos;

  useEffect(() => {
    if (heroPhotos.length === 0) return;
    timerRef.current = setInterval(() => {
      setActive(a => {
        setAnimKey(k => k + 1);
        return (a + 1) % heroPhotos.length;
      });
    }, 5500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [heroPhotos.length]);

  const half = Math.ceil(allPhotos.length / 2);
  const colA = allPhotos;
  const colB = [...allPhotos.slice(half), ...allPhotos.slice(0, half)];

  return (
    <div className="reels-hero relative w-full overflow-hidden">
      {/* Background photos — crossfade */}
      {heroPhotos.map((p, i) => (
        <div key={p.id} className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === active ? 1 : 0, zIndex: i === active ? 2 : 1 }}>
          <SafeImage src={p.url} fallbackIndex={i} alt="" className="w-full h-full object-cover banner-photo"
            style={{ animationDelay: `${i * -1.3}s` }} />
        </div>
      ))}

      {/* Dark gradient — stronger on mobile so text is always readable */}
      <div className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(110deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.2) 100%)" }} />
      <div className="absolute inset-0 z-10"
        style={{ background: "radial-gradient(ellipse at 80% 50%, transparent 35%, rgba(0,0,0,0.55) 100%)" }} />

      {/* ── MOBILE: single vertical scroll column ── */}
        <div className="reels-hero-gallery absolute right-0 top-0 bottom-0 z-20 flex sm:hidden flex-col overflow-hidden"
        style={{
          width: "42%",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}>
        <div style={{ display: "flex", gap: 6, height: "100%", padding: "0 6px" }}>
          {/* Col A — scroll up */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div className="scroll-up" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[...colA, ...colA].map((p, i) => (
                <SafeImage key={i} src={p.url} fallbackIndex={i} alt=""
                  style={{ width: "100%", height: 72, objectFit: "cover", borderRadius: 8, opacity: 0.88, flexShrink: 0 }} />
              ))}
            </div>
          </div>
          {/* Col B — scroll up slower, offset start */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ animation: "scrollUp 28s linear infinite", display: "flex", flexDirection: "column", gap: 6, marginTop: -36 }}>
              {[...colB, ...colB].map((p, i) => (
                <SafeImage key={i} src={p.url} fallbackIndex={i + 2} alt=""
                  style={{ width: "100%", height: 72, objectFit: "cover", borderRadius: 8, opacity: 0.82, flexShrink: 0 }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP: diagonal 2-row marquee ── */}
      <div className="reels-hero-gallery absolute right-0 top-0 bottom-0 z-20 hidden sm:flex flex-col justify-center overflow-hidden"
        style={{
          width: "42%",
          gap: 8,
          maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}>
        <div style={{ transform: "rotate(-12deg) translateY(-6px)", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, overflow: "hidden" }}>
            <div className="marquee-left" style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {[...colA, ...colA].map((p, i) => (
                <SafeImage key={i} src={p.url} fallbackIndex={i} alt="" className="strip-img" />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, overflow: "hidden" }}>
            <div className="marquee-right" style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {[...colB, ...colB].map((p, i) => (
                <SafeImage key={i} src={p.url} fallbackIndex={i + 2} alt="" className="strip-img" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Text content */}
      <div className="reels-hero-copy absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-4 sm:px-10">
        {/* Tag */}
        <div key={`tag-${animKey}`} className="inline-flex items-center gap-2 mb-2 sm:mb-3 w-fit"
          style={{ animation: "fadeUp 0.5s ease both" }}>
          <div className="relative flex items-center justify-center">
            <div className="absolute w-4 h-4 rounded-full bg-pink-400 opacity-60"
              style={{ animation: "pulseRing 1.5s ease-out infinite" }} />
            <div className="w-2.5 h-2.5 rounded-full bg-pink-400" />
          </div>
          <span className="text-pink-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
            Galeri Kreator Jawa Barat
          </span>
        </div>

        {/* Headline */}
        <h1 key={`h1-${animKey}`} className="reels-hero-title text-white font-black leading-tight mb-2 sm:mb-3"
          style={{
            animation: "fadeUp 0.55s ease 0.08s both",
            textShadow: "0 2px 20px rgba(0,0,0,0.6)",
          }}>
          Abadikan Momen{" "}
          <span style={{
            background: "linear-gradient(90deg, #f9a8d4, #c084fc, #818cf8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Kreator Terbaik</span>
        </h1>

        {/* Sub — hide on very small screens to save space */}
        <p key={`sub-${animKey}`}
           className="hidden sm:block text-white/70 text-sm sm:text-base leading-relaxed mb-3 sm:mb-5 max-w-xs"
          style={{ animation: "fadeUp 0.6s ease 0.16s both" }}>
          Temukan kreator konten Jawa Barat untuk kolaborasi brand & promosi bisnismu.
        </p>

        {/* Stats row */}
        <div key={`stats-${animKey}`} className="flex items-center gap-3 sm:gap-5 flex-wrap"
          style={{ animation: "fadeUp 0.65s ease 0.24s both" }}>
          {[
            { icon: <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />, val: "8+",   label: "Kreator" },
            { icon: <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />, val: "1.3M", label: "Reach" },
            { icon: <Camera className="h-3 w-3 sm:h-3.5 sm:w-3.5" />, val: "15+",  label: "Kegiatan" },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/15 text-pink-300">
                {s.icon}
              </div>
              <div>
                <div className="text-white font-black text-xs sm:text-sm leading-none">{s.val}</div>
                <div className="text-white/50 text-[8px] sm:text-[9px] font-semibold uppercase tracking-wide">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-4 sm:left-10 z-20 flex items-center gap-2">
        {heroPhotos.map((_, i) => (
          <button key={i} onClick={() => { setAnimKey(k => k + 1); setActive(i); }}
            className="transition-all duration-300 rounded-full"
            style={{
              width:  i === active ? 20 : 6,
              height: 6,
              background: i === active ? "#f9a8d4" : "rgba(255,255,255,0.4)",
            }} />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 z-20"
        style={{ background: "linear-gradient(to bottom, transparent, #F7F8FA)" }} />
    </div>
  );
}



/* ── Benefits section ───────────────────────────────────────── */
const BENEFITS = [
  {
    icon: <Megaphone className="h-7 w-7" />,
    ghostIcon: <Megaphone className="h-full w-full" />,
    title: "Jangkauan Lebih Luas",
    desc: "Konten kreator kami menjangkau ratusan ribu audiens nyata — bukan follower bot.",
    bullets: ["Reach audiens lokal Jawa Barat", "Demografi tersegmentasi per niche", "Algoritma organik, bukan berbayar"],
    accent: "#0194f3", accent2: "#0053a8",
    stat: "1.3M+", statLabel: "Total Reach", wide: true,
  },
  {
    icon: <Shuffle className="h-7 w-7" />,
    ghostIcon: <Shuffle className="h-full w-full" />,
    title: "Kolaborasi Posting",
    desc: "Double exposure satu konten, dua akun sekaligus.",
    bullets: ["Collab post IG & TikTok", "Tag bisnis & produkmu", "Story + feed + Reels"],
    accent: "#EC4899", accent2: "#be185d",
    stat: "2×", statLabel: "Exposure", wide: false,
  },
  {
    icon: <Palette className="h-7 w-7" />,
    ghostIcon: <Palette className="h-full w-full" />,
    title: "Tema Fleksibel",
    desc: "Kasual, cinematic, formal, outdoor — semua bisa disesuaikan brief-mu.",
    bullets: ["Mood board & referensi bebas", "Revisi konsep unlimited", "Gaya konten per segmen"],
    accent: "#A855F7", accent2: "#6b21a8",
    stat: "∞", statLabel: "Konsep", wide: false,
  },
  {
    icon: <Shirt className="h-7 w-7" />,
    ghostIcon: <Shirt className="h-full w-full" />,
    title: "Kostum & Properti",
    desc: "Kreator siap tampil sesuai brief — dari street style hingga corporate look.",
    bullets: ["Kostum disesuaikan brand", "Properti & set styling", "OOTD & product placement"],
    accent: "#F59E0B", accent2: "#b45309",
    stat: "100%", statLabel: "Custom", wide: true,
  },
  {
    icon: <LayoutGrid className="h-7 w-7" />,
    ghostIcon: <LayoutGrid className="h-full w-full" />,
    title: "Multi-Platform",
    desc: "Satu brief, konten hadir di semua platform sekaligus.",
    bullets: ["Instagram Reels & Feed", "TikTok & YouTube Shorts", "WhatsApp Story & Broadcast"],
    accent: "#10B981", accent2: "#065f46",
    stat: "4+", statLabel: "Platform", wide: true,
  },
  {
    icon: <BarChart3 className="h-7 w-7" />,
    ghostIcon: <BarChart3 className="h-full w-full" />,
    title: "Laporan Performa",
    desc: "Insight nyata, bukan estimasi — screenshot langsung dari akun kreator.",
    bullets: ["Reach & impresi aktual", "Engagement rate per post", "Laporan PDF siap presentasi"],
    accent: "#F43F5E", accent2: "#9f1239",
    stat: "Real", statLabel: "Insight", wide: false,
  },
];

/* Stats ticker shown above the bento */
const STATS_TICKER = [
  { val: "1.3M+", label: "Total Reach" },
  { val: "8",     label: "Kreator Aktif" },
  { val: "100%",  label: "Brief Custom" },
  { val: "4+",    label: "Platform" },
  { val: "∞",     label: "Konsep Tema" },
];

function BenefitsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const [sectionVis, setSectionVis] = useState(false);
  const [visible, setVisible]       = useState<boolean[]>(Array(BENEFITS.length).fill(false));

  useEffect(() => {
    const sObs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSectionVis(true); sObs.disconnect(); } }, { threshold: 0.1 });
    if (sectionRef.current) sObs.observe(sectionRef.current);

    const cardObs = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setVisible(v => { const n = [...v]; n[i] = true; return n; }); obs.disconnect(); }
      }, { threshold: 0.12 });
      obs.observe(el);
      return obs;
    });
    return () => { sObs.disconnect(); cardObs.forEach(o => o?.disconnect()); };
  }, []);

  return (
    <section ref={sectionRef} className="bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-10 sm:pb-16">

        {/* ── Section header ── */}
        <div className="mb-6 sm:mb-8"
          style={{ opacity: sectionVis ? 1 : 0, transform: sectionVis ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
          <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 rounded-full px-3 py-1.5 mb-2.5">
            <CheckCircle2 className="h-3 w-3 text-pink-500" />
            <span className="text-pink-500 text-[10px] font-black tracking-widest uppercase">Kenapa Pilih Kami</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-6">
            <h2 className="font-black text-gray-900 leading-tight"
              style={{ fontSize: "clamp(1.4rem, 4vw, 2.6rem)" }}>
              Keuntungan Pakai{" "}
              <span style={{
                background: "linear-gradient(90deg, #EC4899, #A855F7, #0194f3)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Influencer Nempo</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed sm:text-right sm:shrink-0 sm:max-w-[220px]">
              Bukan sekadar endorse — konten yang benar-benar berdampak untuk bisnis & event-mu.
            </p>
          </div>
        </div>

        {/* ── Stats ticker — horizontal scroll on mobile ── */}
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 mb-6 sm:mb-8 -mx-3 sm:mx-0 px-3 sm:px-0 scrollbar-hide"
          style={{ opacity: sectionVis ? 1 : 0, transition: "opacity 0.7s ease 0.15s" }}>
          {STATS_TICKER.map((s, i) => (
            <div key={s.label}
              className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl py-3 px-4 border border-gray-100 shrink-0 sm:flex-1"
              style={{ minWidth: 90, animation: sectionVis ? `benefitIn 0.45s ease ${i * 0.06}s both` : "none" }}>
              <div className="font-black text-gray-900 leading-none mb-0.5 text-lg sm:text-xl">{s.val}</div>
              <div className="text-gray-400 text-[9px] sm:text-[10px] font-bold text-center leading-tight uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {BENEFITS.map((b, i) => (
            <div
              key={b.title}
              ref={el => { cardRefs.current[i] = el; }}
              className={`group relative overflow-hidden rounded-2xl border border-gray-100 cursor-default${b.wide ? " bento-wide" : ""}`}
              style={{
                background: `linear-gradient(135deg, white 0%, ${b.accent}08 100%)`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                opacity:   visible[i] ? 1 : 0,
                transform: visible[i] ? "none" : "translateY(20px) scale(0.98)",
                transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s, box-shadow 0.3s`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${b.accent}20, 0 1px 3px rgba(0,0,0,0.06)`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
            >
              {/* Ghost icon */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 pointer-events-none select-none opacity-[0.07] transition-all duration-500 group-hover:opacity-[0.12] group-hover:scale-110"
                style={{ color: b.accent }}>
                {b.ghostIcon}
              </div>

              {/* Top accent bar */}
              <div className="h-1 w-full overflow-hidden">
                <div className="h-full w-0 group-hover:w-full transition-all duration-500 ease-out"
                  style={{ background: `linear-gradient(90deg, ${b.accent}, ${b.accent2})` }} />
              </div>

              <div className="p-4 sm:p-5 flex flex-col relative z-10">
                {/* Icon + stat */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center justify-center rounded-xl text-white"
                    style={{
                      width: 40, height: 40,
                      background: `linear-gradient(135deg, ${b.accent}, ${b.accent2})`,
                      boxShadow: `0 4px 14px ${b.accent}35`,
                    }}>
                    <div className="scale-[0.7]">{b.icon}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black leading-none text-xl sm:text-2xl" style={{ color: b.accent }}>{b.stat}</div>
                    <div className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">{b.statLabel}</div>
                  </div>
                </div>

                {/* Text */}
                <h3 className="font-black text-gray-900 text-sm sm:text-base leading-tight mb-1">{b.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3">{b.desc}</p>

                {/* Bullets */}
                <div className="flex flex-col gap-1.5">
                  {b.bullets.map(bullet => (
                    <div key={bullet} className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `${b.accent}18` }}>
                        <CheckCircle2 className="h-2 w-2" style={{ color: b.accent }} />
                      </div>
                      <span className="text-gray-500 text-[11px] sm:text-xs font-medium">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
          style={{ opacity: sectionVis ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}>
          <a
            href={NEMPO_CONSULT_URL}
            target="_blank" rel="noopener noreferrer"
            className="text-center px-8 py-3.5 rounded-xl text-white font-black text-sm hover:opacity-90 active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #EC4899, #A855F7)", boxShadow: "0 8px 28px rgba(168,85,247,0.3)" }}>
            Mulai Kolaborasi Sekarang
          </a>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
            Konsultasi gratis · Tanpa commitment
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Influencer card ─────────────────────────────────────────── */
interface Influencer {
  id: number; name: string; handle: string;
  instagram: string; tiktok: string; verified: boolean;
  color: string; color2: string;
  niches: string[]; location: string; rating: number; rate: string; bio: string; photos: string[];
}

function normalizeInfluencer(raw: any): Influencer {
  return {
    id: raw.id,
    name: raw.name ?? "",
    handle: raw.handle ?? "",
    instagram: raw.instagram ?? "",
    tiktok: raw.tiktok ?? "",
    verified: Boolean(raw.verified),
    color: raw.color || "#EC4899",
    color2: raw.color2 || "#be185d",
    niches: Array.isArray(raw.niches) ? raw.niches : [],
    location: raw.location ?? "",
    rating: Number(raw.rating) || 0,
    rate: raw.rate ?? "",
    bio: raw.bio ?? "",
    photos: Array.isArray(raw.photos) && raw.photos.length > 0
      ? raw.photos
      : [SAFE_FALLBACK_PHOTOS[Number(raw.id || 0) % SAFE_FALLBACK_PHOTOS.length]],
  };
}

type CardStyle = "stats" | "niche";
const STYLES: { key: CardStyle; label: string; icon: React.ReactNode }[] = [
  { key: "stats",  label: "Statistik",  icon: <BarChart3 className="h-3 w-3" /> },
  { key: "niche",  label: "Konten",     icon: <Camera className="h-3 w-3" /> },
];

function InfluencerCard({ inf }: { inf: Influencer }) {
  const [style, setStyle]       = useState<CardStyle>("stats");
  const [photoIdx, setPhotoIdx] = useState(0);
  const [hovered, setHovered]   = useState(false);
  const total = inf.photos.length;

  const prev = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setPhotoIdx(i => (i - 1 + total) % total);
  };
  const next = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setPhotoIdx(i => (i + 1) % total);
  };

  /* swipe support */
  const touchStartX = useRef<number>(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 10) { next(e); return; }   // tap = next
    if (dx < -30) next(e);
    else if (dx > 30) prev(e);
  };

  return (
    <div className="reels-creator-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Photo 4:5 */}
      <div className="reels-creator-photo relative w-full select-none" style={{ paddingBottom: "125%" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}>
          <div className="absolute inset-0">
          {inf.photos.map((src, i) => (
            <SafeImage key={src} src={src} fallbackIndex={inf.id + i} alt={inf.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{ opacity: i === photoIdx ? 1 : 0 }} />
          ))}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)" }} />

          {/* Prev arrow — always visible on touch, fade-in on hover for desktop */}
          <button onClick={prev} aria-label={`Foto sebelumnya untuk ${inf.name}`}
             className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
              opacity: hovered ? 1 : 0.55,
              transform: `translateY(-50%) scale(${hovered ? 1 : 0.85})`,
            }}>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-none stroke-current stroke-2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          {/* Next arrow */}
          <button onClick={next} aria-label={`Foto berikutnya untuk ${inf.name}`}
             className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
              opacity: hovered ? 1 : 0.55,
              transform: `translateY(-50%) scale(${hovered ? 1 : 0.85})`,
            }}>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-none stroke-current stroke-2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* Dot indicators — always visible */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {inf.photos.map((_, i) => (
              <button key={i} aria-label={`Lihat foto ${i + 1} dari ${inf.name}`} onClick={e => { e.stopPropagation(); setPhotoIdx(i); }}
                className="rounded-full transition-all duration-300"
                style={{ width: i === photoIdx ? 18 : 8, height: 8, background: i === photoIdx ? "#fff" : "rgba(255,255,255,0.55)" }} />
            ))}
          </div>

          {/* Name plate */}
          <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 z-10">
            <div className="bg-black/35 backdrop-blur-md rounded-lg px-2 py-1">
              <div className="flex items-center gap-1">
                <p className="text-white font-bold text-[10px] leading-tight">{inf.name}</p>
                {inf.verified && <BadgeCheck className="h-3 w-3 text-sky-300 shrink-0" />}
              </div>
              <p className="text-white/60 text-[9px] truncate">{inf.handle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Style tabs */}
      <div className="flex gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-2 bg-gray-50 border-t border-gray-100">
        {STYLES.map(s => (
          <button key={s.key} onClick={() => setStyle(s.key)}
            className="min-h-10 flex-1 flex items-center justify-center gap-1 py-2 sm:py-1.5 rounded-lg text-[10px] font-black transition-all duration-200 active:scale-95"
            style={style === s.key
              ? { background: `linear-gradient(135deg, ${inf.color}, ${inf.color2})`, color: "#fff", boxShadow: `0 2px 8px ${inf.color}40` }
              : { background: "#fff", color: "#9ca3af", border: "1px solid #e5e7eb" }}>
            <span className="flex items-center justify-center [&>svg]:h-3.5 [&>svg]:w-3.5 sm:[&>svg]:h-3 sm:[&>svg]:w-3">{s.icon}</span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-3.5 flex-1">
        {style === "stats" && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex-1 flex flex-col items-center bg-pink-50 rounded-lg py-1.5 gap-0.5">
                <Instagram className="h-3 w-3 text-pink-400" />
                <span className="font-black text-pink-600 text-xs">{inf.instagram}</span>
                <span className="text-[8px] text-pink-400 font-bold tracking-wide uppercase">Instagram</span>
              </div>
              <div className="flex-1 flex flex-col items-center bg-gray-100 rounded-lg py-1.5 gap-0.5">
                <TikTokIcon className="h-3 w-3 text-gray-700" />
                <span className="font-black text-gray-800 text-xs">{inf.tiktok}</span>
                <span className="text-[8px] text-gray-400 font-bold tracking-wide uppercase">TikTok</span>
              </div>
            </div>
          </div>
        )}
        {style === "niche" && (
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-[11px] leading-relaxed">{inf.bio}</p>
            <div className="flex flex-wrap gap-1.5">
              {inf.niches.map(n => (
                <span key={n} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${inf.color}, ${inf.color2})` }}>
                  {n}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
              <span className="text-[10px] text-gray-400 font-semibold">{inf.location}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Join Section ───────────────────────────────────────────── */
const NICHES = ["Travel & Lifestyle","Kuliner & Food","Fashion & OOTD","Otomotif","Fotografi & Seni","Tech & Gadget","Hiking & Outdoor","Unboxing & Review","Lainnya"];
const FOLLOWERS = ["< 1.000","1K – 10K","10K – 50K","50K – 100K","100K – 500K","> 500K"];

const JOIN_STEPS = [
  { n: "01", title: "Isi Formulir", desc: "Lengkapi data dirimu dan informasi akun sosial mediamu." },
  { n: "02", title: "Verifikasi Tim", desc: "Tim Nempo menghubungimu dalam 1×24 jam via WhatsApp." },
  { n: "03", title: "Mulai Kolaborasi", desc: "Terima brief, buat konten, dan dapatkan fee kompetitif." },
];

const JOIN_STATS = [
  { val: "8+",   label: "Kreator Aktif" },
  { val: "1.3M", label: "Total Reach" },
  { val: "15+",  label: "Event Sukses" },
];

function JoinSection() {
  const [form, setForm] = useState({
    nama: "", wa: "", niche: "",
    igHandle: "", igFollowers: "",
    ttHandle: "", ttFollowers: "",
  });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = [
      "Halo Nempo Organizer! Saya ingin bergabung sebagai Kreator/Influencer. Berikut data saya:",
      `• Nama       : ${form.nama}`,
      `• Nomor kontak: ${form.wa}`,
      `• Kategori   : ${form.niche}`,
      `• Instagram  : ${form.igHandle} (${form.igFollowers} followers)`,
      `• TikTok     : ${form.ttHandle} (${form.ttFollowers} followers)`,
    ].join("\n");
    void navigator.clipboard?.writeText(msg);
    window.open(NEMPO_CONSULT_URL, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const fieldCls = (name: string) =>
    `w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 bg-white/[0.07] border transition-all duration-200 focus:outline-none appearance-none ${
      focused === name
        ? "border-pink-400/80 bg-white/[0.11] shadow-[0_0_0_3px_rgba(236,72,153,0.15)]"
        : "border-white/10 hover:border-white/20"
    }`;

  const labelCls = "block text-[10px] font-bold uppercase tracking-[0.12em] mb-2 transition-colors duration-200 " +
    "text-white/40";

  return (
    <section className="relative overflow-hidden py-14 sm:py-28"
      style={{ background: "linear-gradient(160deg,#07071a 0%,#110a22 40%,#080f1e 100%)" }}>

      {/* ── Background layer ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large glow orbs */}
        <div className="absolute -top-20 left-0 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle,#EC4899 0%,transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle,#7C3AED 0%,transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle,#818cf8 0%,transparent 70%)", filter: "blur(60px)" }} />
        {/* Fine dot grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
        {/* Diagonal accent lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 60px)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Mobile header ── */}
        <div className="lg:hidden text-center mb-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border rounded-full px-3.5 py-1.5 mb-4"
            style={{ borderColor: "rgba(236,72,153,0.35)", background: "rgba(236,72,153,0.1)" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-400" />
            </span>
            <span className="text-pink-300 text-[9px] font-black tracking-[0.18em] uppercase">Open Recruitment 2025</span>
          </div>

          <h2 className="text-white font-black leading-[1.1] mb-3" style={{ fontSize: "clamp(1.6rem,8vw,2.2rem)" }}>
            Jadi Kreator{" "}
            <span className="block" style={{ background: "linear-gradient(90deg,#f9a8d4,#c084fc,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Pilihan Nempo
            </span>
          </h2>
          <p className="text-white/40 text-xs leading-relaxed mb-6 max-w-xs mx-auto">
            Monetisasi kontenmu, terima job brand & event, dan berkembang bersama komunitas kreator Jawa Barat.
          </p>

          {/* Stat cards row */}
          <div className="flex justify-center gap-3 mb-6">
            {JOIN_STATS.map(s => (
              <div key={s.label} className="flex-1 max-w-[90px] rounded-xl border border-white/10 py-2.5 text-center"
                style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}>
                <div className="font-black text-xl leading-none mb-0.5"
                  style={{ background: "linear-gradient(135deg,#f9a8d4,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {s.val}
                </div>
                <div className="text-white/35 text-[8px] font-bold uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Steps chips */}
          <div className="flex justify-center gap-2 flex-wrap">
            {JOIN_STEPS.map((step, i) => (
              <div key={step.n} className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border border-white/10"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  <span className="w-4 h-4 rounded-full text-[8px] font-black text-white flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg,#EC4899,#A855F7)" }}>{step.n}</span>
                  <span className="text-white/60 text-[10px] font-semibold whitespace-nowrap">{step.title}</span>
                </div>
                {i < JOIN_STEPS.length - 1 && <div className="w-4 h-px" style={{ background: "linear-gradient(90deg,rgba(236,72,153,0.5),rgba(168,85,247,0.5))" }} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 lg:gap-20 items-center">

          {/* ── Left: copy (desktop only) ── */}
          <div className="hidden lg:flex flex-col">
            {/* Badge */}
            <div className="inline-flex self-start items-center gap-2 border rounded-full px-4 py-2 mb-7"
              style={{ borderColor: "rgba(236,72,153,0.4)", background: "rgba(236,72,153,0.1)" }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-400" />
              </span>
              <span className="text-pink-300 text-[10px] font-black tracking-[0.18em] uppercase">Open Recruitment 2025</span>
            </div>

            <h2 className="text-white font-black leading-[1.08] mb-5" style={{ fontSize: "clamp(2rem,3.5vw,3.5rem)" }}>
              Jadi Kreator<br />
              <span style={{ background: "linear-gradient(90deg,#f9a8d4,#c084fc,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Pilihan Nempo
              </span>
            </h2>
            <p className="text-white/45 text-base leading-relaxed mb-10 max-w-[360px]">
              Monetisasi kontenmu, terima job kolaborasi brand & event, dan berkembang bersama komunitas kreator Jawa Barat terbaik.
            </p>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {JOIN_STATS.map(s => (
                <div key={s.label} className="rounded-2xl border border-white/10 p-4 group hover:border-pink-500/30 transition-colors duration-300"
                  style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" }}>
                  <div className="font-black text-3xl leading-none mb-1.5"
                    style={{ background: "linear-gradient(135deg,#f9a8d4,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {s.val}
                  </div>
                  <div className="text-white/35 text-[10px] font-bold uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Steps */}
            <div className="relative flex flex-col gap-0">
              {/* Vertical connector line */}
              <div className="absolute left-[15px] top-8 bottom-8 w-px"
                style={{ background: "linear-gradient(to bottom,rgba(236,72,153,0.5),rgba(168,85,247,0.5),transparent)" }} />
              {JOIN_STEPS.map((step, i) => (
                <div key={step.n} className="flex gap-5 group py-4">
                  <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white z-10 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg,#EC4899,#A855F7)", boxShadow: "0 4px 16px rgba(168,85,247,0.5)" }}>
                    {step.n}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight mb-1">{step.title}</p>
                    <p className="text-white/35 text-[13px] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Form card (gradient border wrapper) ── */}
          <div className="rounded-2xl p-px"
            style={{ background: "linear-gradient(135deg,rgba(236,72,153,0.5) 0%,rgba(168,85,247,0.4) 50%,rgba(129,140,248,0.3) 100%)" }}>
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(160deg,#100820 0%,#0c0f1e 100%)", backdropFilter: "blur(24px)" }}>

              {/* Card header */}
              <div className="relative px-6 py-5 overflow-hidden"
                style={{ background: "linear-gradient(135deg,rgba(236,72,153,0.18) 0%,rgba(168,85,247,0.12) 100%)" }}>
                {/* Header glow */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30"
                  style={{ background: "radial-gradient(circle,#EC4899,transparent)", filter: "blur(20px)" }} />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-black text-base sm:text-lg tracking-tight">Formulir Pendaftaran</p>
                    <p className="text-white/45 text-[11px] mt-0.5">Isi data dengan benar — tim kami menghubungimu segera.</p>
                  </div>
                  <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,rgba(236,72,153,0.3),rgba(168,85,247,0.3))", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <Send className="h-4 w-4 text-pink-300" />
                  </div>
                </div>
              </div>

              {sent ? (
                <div className="flex flex-col items-center py-16 px-6 gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#EC4899,#A855F7)", boxShadow: "0 16px 48px rgba(168,85,247,0.45)" }}>
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-black text-xl mb-1.5">Berhasil Dikirim! 🎉</p>
                    <p className="text-white/40 text-sm max-w-xs leading-relaxed">Tim Nempo akan menghubungimu dalam 1×24 jam via WhatsApp.</p>
                  </div>
                  <button onClick={() => setSent(false)}
                    className="mt-2 text-pink-300 text-xs font-bold border border-pink-400/30 rounded-xl px-5 py-2.5 hover:bg-pink-400/10 transition-all">
                    Daftar Akun Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-4">

                  {/* Nama + WA */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Nama</label>
                      <input required value={form.nama} onChange={set("nama")}
                        onFocus={() => setFocused("nama")} onBlur={() => setFocused(null)}
                        placeholder="Nama lengkap" className={fieldCls("nama")} />
                    </div>
                    <div>
                      <label className={labelCls}>Nomor kontak</label>
                      <input required type="tel" value={form.wa} onChange={set("wa")}
                        onFocus={() => setFocused("wa")} onBlur={() => setFocused(null)}
                        placeholder="08xxxxxxxxxx" className={fieldCls("wa")} />
                    </div>
                  </div>

                  {/* Kategori */}
                  <div>
                    <label className={labelCls}>Kategori Konten</label>
                    <select required value={form.niche} onChange={set("niche")}
                      onFocus={() => setFocused("niche")} onBlur={() => setFocused(null)}
                      className={fieldCls("niche")}
                      style={{ color: form.niche ? "#fff" : "rgba(255,255,255,0.25)" }}>
                      <option value="" disabled>Pilih kategori</option>
                      {NICHES.map(n => <option key={n} style={{ background: "#1a1a2e", color: "#fff" }}>{n}</option>)}
                    </select>
                  </div>

                  {/* Divider with label */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/[0.08]" />
                    <span className="text-white/25 text-[9px] font-bold uppercase tracking-widest">Akun Sosial Media</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                  </div>

                  {/* Instagram */}
                  <div className="rounded-xl border border-white/[0.08] p-3.5"
                    style={{ background: "rgba(255,255,255,0.025)" }}>
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg,#f9a8d4,#EC4899)" }}>
                        <Instagram className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.12em]">Instagram</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className={labelCls}>Username</label>
                        <input required value={form.igHandle} onChange={set("igHandle")}
                          onFocus={() => setFocused("igHandle")} onBlur={() => setFocused(null)}
                          placeholder="@username" className={fieldCls("igHandle")} />
                      </div>
                      <div>
                        <label className={labelCls}>Followers</label>
                        <select required value={form.igFollowers} onChange={set("igFollowers")}
                          onFocus={() => setFocused("igFollowers")} onBlur={() => setFocused(null)}
                          className={fieldCls("igFollowers")}
                          style={{ color: form.igFollowers ? "#fff" : "rgba(255,255,255,0.25)" }}>
                          <option value="" disabled>Pilih</option>
                          {FOLLOWERS.map(f => <option key={f} style={{ background: "#1a1a2e", color: "#fff" }}>{f}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* TikTok */}
                  <div className="rounded-xl border border-white/[0.08] p-3.5"
                    style={{ background: "rgba(255,255,255,0.025)" }}>
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center bg-black">
                        <TikTokIcon className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.12em]">TikTok</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className={labelCls}>Username</label>
                        <input required value={form.ttHandle} onChange={set("ttHandle")}
                          onFocus={() => setFocused("ttHandle")} onBlur={() => setFocused(null)}
                          placeholder="@username" className={fieldCls("ttHandle")} />
                      </div>
                      <div>
                        <label className={labelCls}>Followers</label>
                        <select required value={form.ttFollowers} onChange={set("ttFollowers")}
                          onFocus={() => setFocused("ttFollowers")} onBlur={() => setFocused(null)}
                          className={fieldCls("ttFollowers")}
                          style={{ color: form.ttFollowers ? "#fff" : "rgba(255,255,255,0.25)" }}>
                          <option value="" disabled>Pilih</option>
                          {FOLLOWERS.map(f => <option key={f} style={{ background: "#1a1a2e", color: "#fff" }}>{f}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button type="submit"
                    className="w-full py-4 rounded-xl text-white font-black text-sm flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg,#EC4899,#A855F7)", boxShadow: "0 8px 32px rgba(168,85,247,0.45)" }}>
                    <Instagram className="h-4 w-4" />
                    Lanjut ke WhatsApp
                  </button>

                  <p className="text-center text-white/20 text-[9px] leading-relaxed">
                    🔒 Data aman · Tidak dipublikasikan · Hanya untuk seleksi internal
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function InfluencerHubPage() {
  return (
    <Layout>
      <SEO title="Influencer & Kreator" noIndex />
      <SedangDipersiapkan
        icon={Camera}
        iconGradient="linear-gradient(135deg, #DB2777, #A855F7)"
        dotColor1="#F9A8D4"
        dotColor2="#C084FC"
        title="Influencer & Kreator"
        titleHighlight="Segera Hadir"
        description="Temukan kreator lokal dan bangun kolaborasi untuk mempromosikan wisata, kuliner, dan budaya Garut. Kami sedang menyiapkannya."
        btn1Label="Jelajahi Wisata Garut"
        btn1Href="/wisata"
        btn2Label="Lihat Event Garut"
        btn2Href="/event"
      />
    </Layout>
  );
}

/* KODE HALAMAN ASLI – AKAN DIAKTIFKAN SAAT DATA SIAP */
function _InfluencerHubPageFull() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loadingInf, setLoadingInf] = useState(true);

  /* Inject keyframes once */
  useEffect(() => {
    const id = "influencer-banner-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = BANNER_CSS;
      document.head.appendChild(el);
    }
    return () => {};
  }, []);

  useEffect(() => {
    import("../lib/apicache").then(({ cachedFetch }) =>
      cachedFetch<any[]>("/api/influencers")
    )
      .then(rows => setInfluencers(rows.map(normalizeInfluencer)))
      .catch(() => setInfluencers([]))
      .finally(() => setLoadingInf(false));
  }, []);

  return (
    <Layout>
      <SEO title="Influencer & Kreator Konten Jawa Barat" description="Temukan influencer dan kreator konten terbaik Jawa Barat untuk kolaborasi promosi wisata, kuliner, dan budaya." path="/influencer" />
      <div className="reels-page bg-[#F7F8FA] min-h-screen">
        {/* ── Animated hero banner ── */}
        <HeroBanner />

        {/* ── Cards grid ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 pb-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1 h-5 rounded-full bg-[#EC4899]" />
            <h2 className="font-extrabold text-gray-900 text-base sm:text-lg">Influencer &amp; Kreator</h2>
          </div>
           <div className="mobile-card-slider reels-creators-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {loadingInf
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-gray-100 animate-pulse" style={{ paddingBottom: "150%" }} />
                ))
              : influencers.map(inf => <InfluencerCard key={inf.id} inf={inf} />)}
          </div>
          {!loadingInf && influencers.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-8">Halaman Influencer sedang dipersiapkan.</p>
          )}
        </div>

        {/* ── Benefits ── */}
        <BenefitsSection />

        {/* ── Join / Recruitment ── */}
        <JoinSection />
      </div>
    </Layout>
  );
}
