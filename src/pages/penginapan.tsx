import { Layout } from "@/components/layout";
import { PageLoader } from "@/components/page-loader";
import { SEO } from "@/components/seo";
import { SedangDipersiapkan } from "@/components/sedang-dipersiapkan";
import { CityUnavailable } from "@/components/city-unavailable";
import { Link } from "@/lib/wouter";
import { useState, useEffect, useRef } from "react";
import { useCityFilter } from "@/contexts/city-filter-context";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import {
  Search, Star, MapPin, ChevronRight, SlidersHorizontal,
  CheckCircle2, X, Hotel, Trees, Home,
  Building2, Coffee, Wifi, Users, BadgeCheck,
} from "lucide-react";
interface PenginapanItem {
  id: number;
  name: string;
  category: string;
  image: string;
  location: string;
  description: string;
  amenities: string[] | null;
  featured: boolean;
  instagram: string | null;
  rating: number | string | null;
  computed_rating: number | null;
  review_count: number;
}

const typeChip: Record<string, string> = {
  Hotel:    "#0194f3",
  Resort:   "#16a34a",
  Villa:    "#7c3aed",
  Homestay: "#0172B1",
};

function getGoogleRating(item: PenginapanItem) {
  const rating = Number(item.rating);
  return Number.isFinite(rating) && rating > 0 ? rating : null;
}

export default function PenginapanPage() {
  const [penginapanList, setPenginapanList] = useState<PenginapanItem[]>([]);
  const [loadingData, setLoadingData]       = useState(true);
  const [search, setSearch]                 = useState("");
  const [filterOpen, setFilterOpen]         = useState(false);
  const [breakfastOnly, setBreakfastOnly]   = useState(false);
  const [activeType, setActiveType]         = useState("Semua");
  const filterRef = useRef<HTMLDivElement>(null);
  const { matchesCity } = useCityFilter();

  useEffect(() => {
    import("../lib/apicache").then(({ cachedFetch }) =>
      cachedFetch<PenginapanItem[]>("/api/penginapan")
        .then((data) => setPenginapanList(Array.isArray(data) ? data : []))
        .catch(() => setPenginapanList([]))
        .finally(() => setLoadingData(false))
    );
  }, []);

  /* Close filter panel when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen]);

  const cityList = penginapanList.filter((p) => matchesCity(p.location, "Garut"));
  const filtered = cityList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.location.toLowerCase().includes(search.toLowerCase());
    const matchBreakfast = !breakfastOnly || (p.amenities ?? []).some(a => a.toLowerCase().includes("sarapan"));
    const matchType = activeType === "Semua" || p.category === activeType;
    return matchSearch && matchBreakfast && matchType;
  });

  const penginapanCategories = [
    { label: "Semua",    icon: Hotel     },
    { label: "Hotel",    icon: Building2 },
    { label: "Resort",   icon: Trees     },
    { label: "Villa",    icon: Home      },
    { label: "Homestay", icon: Users     },
  ];

  const featured    = cityList.filter(p => p.featured).slice(0, 5);
  const [activeFeat, setActiveFeat] = useState(0);
  useEffect(() => {
    if (!featured.length) return;
    const iv = setInterval(() => setActiveFeat(p => (p + 1) % featured.length), 3200);
    return () => clearInterval(iv);
  }, [featured.length]);

  const hasFilter   = breakfastOnly;
  const filterCount = breakfastOnly ? 1 : 0;
  const chip        = (type: string) => typeChip[type] ?? "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <Layout>
      <SEO
        title="Penginapan Garut — Hotel, Villa & Resort Terbaik"
        description="Temukan hotel, villa, resort, dan homestay terbaik di Garut mulai dari kawasan Cipanas, Tarogong, Cikajang, hingga sekitar Gunung Papandayan. Penginapan nyaman untuk semua budget."
        keywords="hotel garut, penginapan garut, villa garut, resort garut, hotel cipanas garut, homestay garut, resort papandayan"
        path="/penginapan"
      />

      {/* ══ HEADER ════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-5">
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              Penginapan Garut
            </h1>
            <p className="text-gray-400 text-sm mt-1">
               Swiss van Java · {loadingData ? "Memuat..." : `${cityList.length} penginapan tersedia`}
            </p>
          </div>

          {/* Trust bar */}
          <div className="flex gap-3 mb-4 overflow-x-auto scrollbar-hide pb-1">
            {[
              { icon: Coffee, text: "Sarapan Tersedia",  color: "text-[#0194f3]"  },
              { icon: Wifi,   text: "WiFi Gratis",       color: "text-blue-500"   },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-1.5 shrink-0 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                <Icon className={`h-3.5 w-3.5 ${color}`} />
                <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">{text}</span>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div ref={filterRef}>
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
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Cari hotel, villa, resort…"
                  className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 font-medium bg-transparent py-3 px-1" />
                {search && (
                  <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 mr-1">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setFilterOpen(false)}
                  className="shrink-0 active:scale-95 transition-all rounded-xl flex items-center justify-center gap-1.5"
                  style={{ background:"#22c55e", color:"#fff", boxShadow:"0 4px 12px rgba(34,197,94,0.35)", padding:"10px 12px" }}
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span className="hidden md:inline text-sm font-bold">Cari</span>
                </button>
              </div>
              <button onClick={() => setFilterOpen(v => !v)}
                className={`relative h-12 w-12 rounded-2xl flex items-center justify-center shadow-md shrink-0 transition-all ${
                  filterOpen || hasFilter ? "bg-gray-900 shadow-gray-900/25" : "shadow-[#0194f3]/25 hover:opacity-90"
                }`}
                style={!(filterOpen || hasFilter) ? { background: "#0194f3" } : undefined}>
                <SlidersHorizontal className="h-4 w-4 text-white" />
                {hasFilter && !filterOpen && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-[9px] font-black flex items-center justify-center">{filterCount}</span>
                )}
              </button>
            </div>

            {/* Filter panel */}
            {filterOpen && (
              <div className="mt-3 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Fasilitas</p>
                  <button onClick={() => setBreakfastOnly(v => !v)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      breakfastOnly ? "bg-[#0194f3] text-white border-[#0194f3]" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}>
                    {breakfastOnly && <CheckCircle2 className="h-3 w-3" />}
                    <Coffee className="h-3 w-3" /> Sarapan Termasuk
                  </button>
                </div>
                <div className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setBreakfastOnly(false); setFilterOpen(false); }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
                    Reset
                  </button>
                  <button onClick={() => setFilterOpen(false)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-[#0194f3] hover:bg-[#0172B1] transition-colors">
                    Terapkan
                  </button>
                </div>
              </div>
            )}

          {/* ── Category Chips ── */}
          <div className="-mx-4 sm:mx-0 px-4 sm:px-0 flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-2">
            {penginapanCategories.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveType(label)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${
                  activeType === label
                    ? "text-white border-[#0194f3] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#0194f3] hover:text-[#0194f3]"
                }`}
                style={activeType === label ? { background: "#0194f3", boxShadow: "0 2px 8px rgba(1,148,243,0.3)" } : undefined}
              >
                <Icon className="h-3 w-3 shrink-0" />
                {label}
              </button>
            ))}
          </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-10 space-y-8">

        {/* ══ CAROUSEL ══════════════════════════════════════════ */}
        {!loadingData && !search && featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-extrabold text-gray-900 text-base">Pilihan Terbaik</h2>
                <p className="text-gray-400 text-xs">Paling disukai tamu Garut</p>
              </div>
            </div>
            <div className="relative" style={{ height: 300 }}>
              {featured.map((p, idx) => {
                const total   = featured.length;
                const off     = (idx - activeFeat + total) % total;
                const absOff  = off > total / 2 ? off - total : off;
                const abs     = Math.abs(absOff);
                if (abs > 2) return null;
                const tx      = absOff * 148;
                const scale   = abs === 0 ? 1 : abs === 1 ? 0.83 : 0.68;
                const opacity = abs === 0 ? 1 : abs === 1 ? 0.80 : 0.50;
                const rotateY = absOff * -12;
                return (
                  <Link key={p.id} href={abs === 0 ? `/penginapan/${(p as any).slug || p.id}` : "#"}
                    className="absolute left-1/2 top-0"
                    style={{
                      transform: `translateX(calc(-50% + ${tx}px)) scale(${scale}) rotateY(${rotateY}deg)`,
                      opacity, zIndex: 10 - abs,
                      transition: "transform 0.75s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease",
                      willChange: "transform", width: 200,
                    }}
                    onClick={e => { if (abs !== 0) { e.preventDefault(); setActiveFeat(idx); } }}>
                    <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(145deg,#001E6E,#0194f3)" }}>
                      <div className="relative overflow-hidden" style={{ height: 160 }}>
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                        <span className="absolute text-[10px] font-bold text-white" style={{ background: chip(p.category), top: 10, left: 0, borderRadius: "0 6px 6px 0", padding: "4px 10px", boxShadow: "1px 2px 6px rgba(0,0,0,0.25)" }}>{p.category}</span>
                        {getGoogleRating(p) != null ? (
                          <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-lg text-yellow-600 shadow-sm"
                            title="Rating Google Maps">
                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-[10px]">{getGoogleRating(p)!.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                          </div>
                        ) : p.computed_rating != null && (
                          <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-lg" title="Rating Nempo">
                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-white font-bold text-[10px]">{p.computed_rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="px-4 pt-3 pb-4">
                        <p className="font-extrabold text-white text-sm line-clamp-1 mb-1">{p.name}</p>
                        <p className="text-white/70 text-[11px] flex items-center gap-1 mb-3">
                          <MapPin className="h-2.5 w-2.5 shrink-0" />{p.location}
                        </p>
                        <div className="bg-white rounded-xl py-2 text-center text-xs font-extrabold text-[#0194f3]">
                          Lihat Detail
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="flex justify-center gap-1.5 -mt-1 mb-1">
              {featured.map((_, i) => (
                <button key={i} onClick={() => setActiveFeat(i)}
                  className={`rounded-full transition-all duration-300 ${i === activeFeat ? "w-5 h-2 bg-[#0194f3]" : "w-2 h-2 bg-[#CCE0FF]"}`} />
              ))}
            </div>
          </section>
        )}

        {/* ══ LIST ═══════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-gray-900 text-base">
              {search ? `Hasil "${search}"` : activeType === "Semua" ? "Semua Penginapan" : activeType}
            </h2>
            <span className="text-gray-400 text-xs">{filtered.length} properti</span>
          </div>

          {loadingData ? (
            <PageLoader text="Memuat penginapan…" />
          ) : penginapanList.length === 0 ? (
            <SedangDipersiapkan
              icon={Hotel}
              iconGradient="linear-gradient(135deg, #0194f3 0%, #0172B1 100%)"
              dotColor1="#0194f3"
              dotColor2="#0172B1"
              title="Penginapan Garut"
              titleHighlight="Sedang Dipersiapkan"
              description="Daftar hotel, villa, dan homestay di Garut sedang kami kurasi untukmu. Pantau terus untuk update terbaru!"
              btn1Label="Jelajahi Wisata"
              btn1Href="/wisata"
              btn2Label="Lihat Kuliner"
              btn2Href="/kuliner"
            />
          ) : penginapanList.length > 0 && cityList.length === 0 ? (
            <CityUnavailable accent="#0194f3" category="Penginapan" />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-16 w-16 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Hotel className="h-8 w-8 text-gray-300" />
              </div>
              <p className="font-semibold text-gray-400">Tidak ditemukan</p>
              <p className="text-xs text-gray-300 mt-1">Coba kata kunci atau filter lain</p>
            </div>
          ) : (
            <>
            <style>{`
              .penginapan-list-card {
                box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12), 0 2px 5px rgba(15, 23, 42, 0.06);
              }
              .penginapan-list-card:hover {
                box-shadow: 0 14px 30px rgba(15, 23, 42, 0.16), 0 4px 9px rgba(15, 23, 42, 0.08);
              }
            `}</style>
             <div className="mobile-card-slider sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
              {filtered.map((p) => (
                <Link key={p.id} href={`/penginapan/${(p as any).slug || p.id}`} className="block sm:contents">

                  {/* Mobile: horizontal card */}
                  <div className="penginapan-list-card flex gap-0 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group sm:hidden mb-4">
                    <div className="w-32 h-[120px] shrink-0 relative overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                      <span className="absolute text-[9px] font-bold text-white" style={{ background: chip(p.category), top: 8, left: 0, borderRadius: "0 5px 5px 0", padding: "3px 8px", boxShadow: "1px 2px 6px rgba(0,0,0,0.25)" }}>{p.category}</span>
                    </div>
                    <div className="flex-1 px-3 py-3 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{p.name}</h3>
                          {getGoogleRating(p) != null ? (
                            <span className="flex items-center gap-0.5 shrink-0 text-[10px] font-bold text-yellow-600 ml-1 mt-0.5" title="Rating Google Maps">
                              <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />{getGoogleRating(p)!.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            </span>
                          ) : p.computed_rating != null && (
                            <span className="flex items-center gap-0.5 shrink-0 text-[10px] font-bold text-gray-700 ml-1 mt-0.5" title="Rating Nempo">
                              <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />Nempo {p.computed_rating}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-[11px] flex items-center gap-0.5 mb-2">
                          <MapPin className="h-2.5 w-2.5 shrink-0 text-red-400" />
                          <span className="truncate">{p.location}</span>
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {(p.amenities ?? []).slice(0, 2).map((f, i) => (
                            <span key={i} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{f}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {p.instagram ? (
                          <a href={`https://instagram.com/${p.instagram.replace(/^@/, "")}`}
                             target="_blank" rel="noopener noreferrer"
                             onClick={e => e.stopPropagation()}
                             className="flex items-center gap-1 text-pink-500 text-[10px] font-semibold min-w-0 overflow-hidden">
                            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current shrink-0"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            <span className="truncate">{p.instagram.startsWith("@") ? p.instagram : `@${p.instagram}`}</span>
                          </a>
                        ) : <span />}
                        <span className="text-[#0194f3] font-bold text-[11px] flex items-center gap-0.5 shrink-0 whitespace-nowrap">
                          Lihat Detail <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop: vertical card */}
                  <div className="penginapan-list-card hidden sm:flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
                    <div className="h-44 relative overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {getGoogleRating(p) != null ? (
                        <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl text-[10px] font-bold text-yellow-600 shadow-sm" title="Rating Google Maps">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />{getGoogleRating(p)!.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        </div>
                      ) : p.computed_rating != null && (
                        <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl text-xs font-bold text-gray-900 shadow-sm" title="Rating Nempo">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />{p.computed_rating}
                          <span className="text-gray-400 font-normal ml-0.5 text-[10px]">({p.review_count})</span>
                        </div>
                      )}
                      <span className="absolute text-[10px] font-bold text-white" style={{ background: chip(p.category), top: 10, left: 0, borderRadius: "0 6px 6px 0", padding: "4px 10px", boxShadow: "1px 2px 6px rgba(0,0,0,0.25)" }}>{p.category}</span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#0194f3] transition-colors line-clamp-1">{p.name}</h3>
                      <p className="text-gray-400 text-xs flex items-center gap-1 mb-2">
                        <MapPin className="h-3 w-3 shrink-0 text-red-400" />{p.location}
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{p.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(p.amenities ?? []).slice(0, 3).map((f, i) => (
                          <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg">{f}</span>
                        ))}
                        {(p.amenities ?? []).length > 3 && (
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg">+{(p.amenities ?? []).length - 3}</span>
                        )}
                      </div>
                      <div className="mt-auto border-t border-gray-50 pt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs">
                            {getGoogleRating(p) != null
                              ? "Rating Google Maps"
                              : p.computed_rating != null
                                ? `${p.review_count} ulasan Nempo`
                                : "Belum ada ulasan Nempo"}
                          </span>
                          {p.instagram && (
                            <a href={`https://instagram.com/${p.instagram.replace(/^@/, "")}`}
                               target="_blank" rel="noopener noreferrer"
                               onClick={e => e.stopPropagation()}
                               className="flex items-center gap-1 text-[10px] font-semibold text-pink-500 hover:text-pink-600 transition-colors min-w-0 overflow-hidden">
                              <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current shrink-0"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                              <span className="truncate">{p.instagram.startsWith("@") ? p.instagram : `@${p.instagram}`}</span>
                            </a>
                          )}
                        </div>
                        <button className="bg-[#0194f3] hover:bg-[#0172B1] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1">
                          Detail <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                </Link>
              ))}
            </div>
            </>
          )}
        </section>

        {/* ══ CTA ══════════════════════════════════════════════ */}
        <section className="bg-[linear-gradient(135deg,#001553_0%,#003BAF_100%)] border border-[#003BAF] rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-lg shadow-black/10">
            <BadgeCheck className="h-6 w-6 text-[#0194f3]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-white text-sm mb-0.5">Punya Properti di Garut?</p>
            <p className="text-white/75 text-xs">Daftarkan hotel, villa, atau homestay-mu dan jangkau ribuan wisatawan bersama Nempo Organizer.</p>
          </div>
          <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <button className="bg-white hover:bg-blue-50 text-[#0194f3] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap shadow-md shadow-black/10">
              Daftar Properti
            </button>
          </a>
        </section>

      </div>
    </Layout>
  );
}
