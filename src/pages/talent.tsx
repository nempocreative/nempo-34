import { useState, useEffect, useRef, useCallback } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import {
  Mic2, Music, Landmark, Volume2, Camera,
  Star, ChevronRight, Instagram, Users, Zap, Trophy, Heart,
  ArrowRight, CheckCircle2, Play, MessageCircle, X, ChevronLeft, Search,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { SedangDipersiapkan } from "@/components/sedang-dipersiapkan";
import { NEMPO_CONSULT_URL } from "@/lib/contact";

/* ─────────────────────────────────────────────────────────────── */
/* CSS                                                             */
/* ─────────────────────────────────────────────────────────────── */
const TALENT_CSS = `
@keyframes tFadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes tFloat {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-9px); }
}
@keyframes tGlow {
  0%,100% { box-shadow: 0 0 22px rgba(192,38,211,.45); }
  50%      { box-shadow: 0 0 44px rgba(192,38,211,.75), 0 0 72px rgba(192,38,211,.2); }
}
@keyframes tShimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes tPulse {
  0%,100% { transform: scale(1);   opacity: .5; }
  50%      { transform: scale(1.7); opacity: 0; }
}
@keyframes tMarquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes tCardIn {
  from { opacity: 0; transform: translateY(20px) scale(.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes tVideoIn {
  from { opacity: 0; transform: scale(.96); }
  to   { opacity: 1; transform: scale(1); }
}
.t-video-card { animation: tVideoIn .45s ease both; }
@keyframes tProgress {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
.t-progress { animation: tProgress 5s linear forwards; }
.t-shimmer {
  background: linear-gradient(90deg, #f0abfc, #e879f9, #c026d3, #a855f7, #f0abfc);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: tShimmer 3s linear infinite;
}
.t-card    { animation: tCardIn  .4s ease both; }
.t-marquee { animation: tMarquee 32s linear infinite; }
.t-float   { animation: tFloat   4s  ease-in-out infinite; }
.t-glow    { animation: tGlow    2.5s ease-in-out infinite; }
`;

/* ─────────────────────────────────────────────────────────────── */
/* Data                                                            */
/* ─────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "semua",   label: "Semua",   icon: Users     },
  { id: "mc",      label: "MC",      icon: Mic2      },
  { id: "band",    label: "Band",    icon: Music     },
  { id: "budaya",  label: "Budaya",  icon: Landmark  },
  { id: "vokalis", label: "Vokalis", icon: Volume2   },
];

type Talent = {
  id: number; name: string; role: string; category: string;
  photo: string; instagram: string; tagline: string;
  tags: string[]; verified: boolean; featured: boolean;
  bio: string; wa: string; active: boolean;
};

const STEPS = [
  { num:"01", title:"Pendaftaran",    desc:"Isi formulir & upload portofolio. Tim kami menghubungi dalam 3 hari kerja.", icon:MessageCircle, color:"#c026d3" },
  { num:"02", title:"Seleksi",        desc:"Audisi langsung dengan tim kreatif Nempo untuk menilai potensi bidangmu.",  icon:Star,          color:"#a855f7" },
  { num:"03", title:"Pembinaan",      desc:"Workshop intensif, mentoring, dan produksi portfolio profesional 4–8 minggu.", icon:Zap,        color:"#7c3aed" },
  { num:"04", title:"Debut",          desc:"Tampil di event Nempo, masuk direktori talent, mulai terima job klien.",    icon:Trophy,        color:"#4f46e5" },
];

const BENEFITS = [
  { icon:Camera,   title:"Produksi Portofolio",  desc:"Foto & video profesional gratis untuk kartu namamu.",           color:"#c026d3" },
  { icon:Users,    title:"Jaringan Klien",        desc:"Terhubung langsung dengan ratusan bisnis & EO di Garut.",       color:"#a855f7" },
  { icon:Zap,      title:"Workshop Intensif",     desc:"Pelatihan skill dari mentor berpengalaman di bidangmu.",        color:"#7c3aed" },
  { icon:Trophy,   title:"Exposure Event",        desc:"Tampil di event-event besar yang dikelola Nempo Organizer.",        color:"#4f46e5" },
  { icon:Heart,    title:"Komunitas Suportif",    desc:"Sesama talent saling support, collab, dan berkembang bersama.", color:"#db2777" },
  { icon:Star,     title:"Sertifikat Resmi",      desc:"Sertifikat inkubasi Nempo yang diakui mitra kami.",            color:"#0891b2" },
];

/* floating pills — only on md+ so they never clash with text */
const FLOATS = [
  { label:"9 Talent Aktif",    icon:"🎭", top:"18%", right:"8%" },
  { label:"Inkubasi Berjalan", icon:"🚀", top:"52%", right:"4%" },
  { label:"8+ Kategori",       icon:"✨", top:"33%", right:"20%" },
];

const TALENT_CONTACT_URL = NEMPO_CONSULT_URL;
const TALENT_IS_PREPARING = true;

/* ─────────────────────────────────────────────────────────────── */
/* Portfolio Data  (video + foto)                                  */
/* ─────────────────────────────────────────────────────────────── */
type PortfolioItem = {
  id: number; type: "video" | "photo";
  title: string; talent_name: string; role: string;
  thumb: string; category: string;
  youtube_id?: string; duration?: string;
};

/* ─────────────────────────────────────────────────────────────── */
/* Karya Cards — auto-advance card carousel (API-driven)           */
/* ─────────────────────────────────────────────────────────────── */
function KaryaSlider() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const total = items.length;

  useEffect(() => {
    fetch("/api/talent-portfolio")
      .then(r => r.json())
      .then((d: PortfolioItem[]) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]));
  }, []);

  /* auto-advance every 3.5 s */
  useEffect(() => {
    if (total === 0) return;
    const id = setInterval(() => setCurrent(c => (c + 1) % total), 3500);
    return () => clearInterval(id);
  }, [total]);

  /* scroll active card horizontally */
  useEffect(() => {
    const track = trackRef.current;
    const card = track?.children[current] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, [current]);

  if (items.length === 0) return null;

  return (
    <section className="pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* heading */}
        <div className="mb-5">
          <h2 className="font-extrabold text-gray-900 text-xl sm:text-2xl">Karya Talent Kami</h2>
          <p className="text-gray-400 text-sm mt-0.5">Foto & video hasil karya talent Nempo Studio</p>
        </div>

        {/* card track — outer clips the scrollbar out of view */}
        <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: "20px", marginBottom: "-20px" } as React.CSSProperties}
        >
          {items.map((it) => (
            <div
              key={it.id}
              className="shrink-0 relative rounded-2xl overflow-hidden group"
              style={{
                width: "clamp(220px, 68vw, 300px)",
                aspectRatio: "3/4",
                scrollSnapAlign: "start",
              }}
            >
              <img
                src={it.thumb} alt={it.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* gradient overlay */}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(8,2,18,.92) 0%, rgba(8,2,18,.35) 55%, transparent 100%)" }} />

              {/* play icon for videos */}
              {it.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(192,38,211,.82)", boxShadow: "0 4px 24px rgba(192,38,211,.55)" }}>
                    <Play className="h-4.5 w-4.5 text-white fill-current ml-0.5" />
                  </div>
                </div>
              )}

              {/* info */}
              <div className="absolute bottom-0 inset-x-0 p-4">
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: "rgba(192,38,211,.82)", backdropFilter: "blur(6px)" }}>
                    {it.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(6px)" }}>
                    {it.type === "video"
                      ? <><Play className="h-2.5 w-2.5 fill-current" /> Video</>
                      : <><Camera className="h-2.5 w-2.5" /> Foto</>}
                  </span>
                </div>
                <p className="text-white font-bold text-sm leading-snug line-clamp-2">{it.title}</p>
                <p className="text-fuchsia-300 text-xs font-semibold mt-1">{it.talent_name} · {it.role}</p>
              </div>
            </div>
          ))}
        </div>
        </div>{/* /overflow-hidden wrapper */}

        {/* dot indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                background: i === current ? "#c026d3" : "#e5e7eb",
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Hero — full-width video background, no text                    */
/* ─────────────────────────────────────────────────────────────── */
type TalentBanner = { video_url: string; poster_url: string };

function Hero() {
  const vidRef = useRef<HTMLVideoElement>(null);
  const [banner, setBanner] = useState<TalentBanner>({ video_url: "/banner-talent.mp4", poster_url: "/banner-talent-poster.webp" });

  useEffect(() => {
    fetch("/api/talent-banner")
      .then(r => r.json())
      .then((d: TalentBanner) => {
        if (d) setBanner(prev => ({
          video_url: d.video_url || prev.video_url,
          poster_url: d.poster_url || prev.poster_url,
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      const resume = () => { v.play().catch(() => {}); document.removeEventListener("click", resume); };
      document.addEventListener("click", resume, { once: true });
    });
  }, [banner.video_url]);

  return (
    <div className="relative overflow-hidden w-full" style={{ aspectRatio:"16/7", minHeight:260, maxHeight:600, background:"#0f0520" }}>
      <video
        key={banner.video_url}
        ref={vidRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={banner.video_url}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={banner.poster_url}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background:"linear-gradient(to bottom,rgba(0,0,0,.10) 0%,rgba(0,0,0,.30) 100%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
        style={{ background:"linear-gradient(to bottom,transparent,#f8f9fc)" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Talent Card                                                     */
/* ─────────────────────────────────────────────────────────────── */
function TalentCard({ t, idx }: { t: Talent; idx: number }) {
  return (
    <div
      className="t-card group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
      style={{ animationDelay:`${idx * 0.06}s` }}
    >
      {/* photo — 4:5 portrait, clean across all sizes */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio:"4/5" }}>
        <img
          src={t.photo} alt={t.name}
          className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* scrim — deeper at bottom for text legibility */}
        <div className="absolute inset-0"
          style={{ background:"linear-gradient(to top,rgba(10,2,20,.95) 0%,rgba(10,2,20,.5) 38%,rgba(10,2,20,.1) 65%,transparent 100%)" }} />

        {/* badges row */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2">
          {t.featured ? (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white leading-none"
              style={{ background:"linear-gradient(135deg,#c026d3,#7c3aed)", boxShadow:"0 2px 10px rgba(192,38,211,.55)" }}>
              <Star className="h-3 w-3 fill-current shrink-0" /> Featured
            </div>
          ) : <span />}
          {t.verified && (
            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-fuchsia-400 shrink-0"
              style={{ filter:"drop-shadow(0 0 6px rgba(192,38,211,.9))" }} />
          )}
        </div>

        {/* name + role + tags overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4">
          <p className="font-extrabold text-white text-sm sm:text-base leading-tight truncate drop-shadow">{t.name}</p>
          <p className="text-fuchsia-300 text-xs sm:text-[13px] font-semibold mt-0.5">{t.role}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {t.tags.slice(0,2).map(tag => (
              <span key={tag}
                className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full text-white/90 leading-none"
                style={{ background:"rgba(255,255,255,.15)", backdropFilter:"blur(8px)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* card body */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2.5">
        <p className="text-gray-500 text-xs sm:text-[13px] leading-relaxed line-clamp-2 flex-1">{t.tagline}</p>
        <div className="flex items-center justify-between gap-2 min-w-0">
          <a
            href={`https://instagram.com/${t.instagram.replace("@","")}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs sm:text-[13px] font-semibold text-pink-500 hover:text-pink-600 transition-colors min-w-0"
            onClick={e => e.stopPropagation()}>
            <Instagram className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{t.instagram}</span>
          </a>
          <button
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-[13px] font-bold text-white active:scale-95 transition-transform"
            style={{ background:"linear-gradient(135deg,#c026d3,#7c3aed)", boxShadow:"0 2px 10px rgba(192,38,211,.35)" }}>
            Profil <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Page                                                            */
/* ─────────────────────────────────────────────────────────────── */
export default function TalentPage() {
  const [activeCat,    setActiveCat]    = useState("semua");
  const [catKey,       setCatKey]       = useState(0);
  const [talentSearch, setTalentSearch] = useState("");
  const [talents,      setTalents]      = useState<Talent[]>([]);
  const [loading,      setLoading]      = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/talents")
      .then(r => r.ok ? r.json() : [])
      .then((d: Talent[]) => setTalents(Array.isArray(d) ? d : []))
      .catch(() => setTalents([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!TALENT_IS_PREPARING) load();
  }, [load]);

  const filtered = talents
    .filter(t => activeCat === "semua" || t.category === activeCat)
    .filter(t => !talentSearch || t.name.toLowerCase().includes(talentSearch.toLowerCase()) || t.role.toLowerCase().includes(talentSearch.toLowerCase()) || t.tagline.toLowerCase().includes(talentSearch.toLowerCase()));

  function switchCat(id: string) {
    setActiveCat(id);
    setCatKey(k => k + 1);
  }

  if (TALENT_IS_PREPARING) {
    return (
      <Layout>
        <style>{TALENT_CSS}</style>
        <SEO
          title="Nempo Talent — Sedang Dipersiapkan"
          description="Halaman Nempo Talent sedang dipersiapkan untuk menampilkan talenta dan peluang kolaborasi lokal Garut."
          keywords="talent garut, talent lokal, kolaborasi garut"
          path="/talent"
        />
        <SedangDipersiapkan
          icon={Mic2}
          iconGradient="linear-gradient(135deg, #0194f3 0%, #7C3AED 100%)"
          dotColor1="#0194f3"
          dotColor2="#7C3AED"
          title="Nempo Talent"
          titleHighlight="Sedang Dipersiapkan"
          description="Ruang untuk menemukan talenta lokal Garut sedang kami siapkan agar lebih lengkap, nyaman, dan layak untuk dikolaborasikan."
          btn1Label="Jelajahi Wisata"
          btn1Href="/wisata"
          btn2Label="Lihat Event"
          btn2Href="/event"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{TALENT_CSS}</style>
      <SEO
        title="Nempo Talent Studio — Inkubasi Talent Lokal Garut"
        description="Program inkubasi eksklusif: MC, fotografer, videografer, content creator, musisi & kreator Garut. Tampil profesional bersama Nempo."
        keywords="talent garut, mc garut, fotografer garut, content creator garut, inkubasi talent"
        path="/talent"
      />

      <Hero />

      <div style={{ background:"#f8f9fc" }}>
        <KaryaSlider />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 pb-28 md:pb-14 space-y-14">

          {/* ── Talent Grid ─────────────────────────────────── */}
          <section id="talent-grid" className="scroll-mt-4">
            {/* header */}
            <div className="mb-5">
              <h2 className="font-extrabold text-gray-900 text-xl sm:text-2xl">Talent Kami</h2>
              <p className="text-gray-400 text-sm sm:text-base mt-1">{filtered.length} talent siap beraksi</p>
            </div>

            {/* bird search */}
            <div className="flex gap-2 mb-5">
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
                  value={talentSearch}
                  onChange={e => setTalentSearch(e.target.value)}
                  placeholder="Cari talent, peran, atau keahlian…"
                  className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 font-medium bg-transparent py-3 px-1"
                />
                {talentSearch && (
                  <button onClick={() => setTalentSearch("")} className="text-gray-400 hover:text-gray-600 mr-1">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  className="shrink-0 active:scale-95 transition-all rounded-xl flex items-center justify-center gap-1.5"
                  style={{ background:"linear-gradient(135deg,#c026d3,#7c3aed)", color:"#fff", boxShadow:"0 4px 12px rgba(192,38,211,0.35)", padding:"10px 12px" }}
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span className="hidden md:inline text-sm font-bold">Cari</span>
                </button>
              </div>
            </div>

            {/* filter pills */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-3 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              {CATEGORIES.map(c => {
                const Icon = c.icon;
                const on   = activeCat === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => switchCat(c.id)}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all active:scale-95"
                    style={on
                      ? { background:"linear-gradient(135deg,#c026d3,#7c3aed)", color:"#fff", boxShadow:"0 4px 14px -4px rgba(192,38,211,.55)" }
                      : { background:"#f3f4f6", color:"#6b7280" }}
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>

            {/* grid — 2 col mobile → 3 sm → 4 lg → 5 xl */}
            {loading ? (
               <div className="mobile-card-slider grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm animate-pulse">
                    <div className="bg-gray-200" style={{ aspectRatio:"4/5" }} />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div
                key={catKey}
                 className="mobile-card-slider grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5"
              >
                {filtered.map((t, i) => <TalentCard key={t.id} t={t} idx={i} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Mic2 className="h-8 w-8 text-gray-300" />
                </div>
                <p className="font-bold text-gray-400 text-sm sm:text-base">Belum ada talent di kategori ini</p>
              </div>
            )}
          </section>

          {/* ── Benefits ─────────────────────────────────────── */}
          <section>
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-fuchsia-700 mb-3"
                style={{ background:"linear-gradient(135deg,#fae8ff,#f5d0fe)" }}>
                Kenapa Bergabung?
              </span>
              <h2 className="font-extrabold text-gray-900 text-xl">Yang Kamu Dapatkan</h2>
              <p className="text-gray-400 text-sm mt-1.5 max-w-sm mx-auto">
                Inkubasi bukan sekadar pelatihan — tapi ekosistem penuh untuk tumbuh jadi talent profesional.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              {BENEFITS.map(b => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.title}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-3 shrink-0"
                      style={{ background:`${b.color}18` }}>
                      <Icon style={{ color:b.color, width:20, height:20 }} />
                    </div>
                    <p className="font-extrabold text-gray-900 text-sm sm:text-base mb-1 leading-snug">{b.title}</p>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{b.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Proses Inkubasi ──────────────────────────────── */}
          <section>
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-fuchsia-700 mb-3"
                style={{ background:"linear-gradient(135deg,#fae8ff,#f5d0fe)" }}>
                Cara Bergabung
              </span>
              <h2 className="font-extrabold text-gray-900 text-xl">Proses Inkubasi</h2>
              <p className="text-gray-400 text-sm mt-1.5">4 langkah menuju karier talent profesional.</p>
            </div>

            {/* Desktop: horizontal 4-col */}
            <div className="hidden sm:grid sm:grid-cols-4 gap-0 relative">
              {/* connecting line behind icons */}
              <div
                aria-hidden
                className="absolute top-[22px] left-[calc(12.5%+1px)] right-[calc(12.5%+1px)] h-0.5 -translate-y-1/2"
                style={{ background:"linear-gradient(to right,#c026d3,#7c3aed,#4f46e5)", zIndex:0 }}
              />
              {STEPS.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.num} className="flex flex-col items-center text-center px-3 relative z-10">
                    <div
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 shadow-lg"
                      style={{ background:`linear-gradient(135deg,${s.color},#4f46e5)` }}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <p className="text-xs font-bold text-fuchsia-500 mb-0.5 uppercase tracking-wider">Step {s.num}</p>
                    <p className="font-extrabold text-gray-900 text-sm sm:text-base mb-1">{s.title}</p>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Mobile: vertical timeline */}
            <div className="sm:hidden space-y-0">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.num} className="relative flex gap-4">
                    {/* left column: icon + connector */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md z-10"
                        style={{ background:`linear-gradient(135deg,${s.color},#4f46e5)` }}>
                        <Icon className="h-4.5 w-4.5 text-white" style={{ width:18, height:18 }} />
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="w-0.5 flex-1 mt-1" style={{ background:"linear-gradient(to bottom,#c026d3,#4f46e5)", minHeight:40 }} />
                      )}
                    </div>
                    {/* right: text */}
                    <div className="pb-8 flex-1 min-w-0 pt-1.5">
                      <p className="text-xs font-bold text-fuchsia-500 mb-0.5 uppercase tracking-wider">Step {s.num}</p>
                      <p className="font-extrabold text-gray-900 text-sm mb-1">{s.title}</p>
                      <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── CTA Banner ───────────────────────────────────── */}
          <section>
            <div
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
              style={{ background:"linear-gradient(135deg,#0f0520,#2d0a55,#1a0533)" }}
            >
              {/* glows */}
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute rounded-full opacity-30"
                  style={{ width:280, height:280, background:"radial-gradient(circle,#c026d3,transparent 70%)", top:-80, right:-40 }} />
                <div className="absolute rounded-full opacity-20"
                  style={{ width:180, height:180, background:"radial-gradient(circle,#7c3aed,transparent 70%)", bottom:-50, left:-30 }} />
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 p-6 sm:p-8 md:p-10">
                {/* icon */}
                <div
                  className="t-glow w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background:"linear-gradient(135deg,#c026d3,#7c3aed)" }}>
                  <Mic2 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>

                {/* text */}
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-white text-base sm:text-lg leading-snug">Siap Jadi Talent Nempo?</p>
                  <p className="text-white/50 text-sm mt-1 leading-relaxed max-w-md">
                    Pendaftaran inkubasi terbuka untuk semua anak muda berbakat dari Garut dan sekitarnya. Gratis, tanpa syarat tersembunyi.
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                    {["Gratis ikut","Mentoring langsung","Portfolio profesional","Job placement"].map(f => (
                      <span key={f} className="flex items-center gap-1.5 text-white/70 text-xs font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5 text-fuchsia-400 shrink-0" />{f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA button — full-width on mobile, auto on sm+ */}
                <a href={TALENT_CONTACT_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto shrink-0">
                  <button
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-extrabold text-sm text-white hover:brightness-110 active:scale-95 transition-all"
                    style={{ background:"linear-gradient(135deg,#c026d3,#7c3aed)", boxShadow:"0 4px 18px rgba(192,38,211,.5)" }}>
                    Daftar via WhatsApp <ArrowRight className="h-4 w-4" />
                  </button>
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}
