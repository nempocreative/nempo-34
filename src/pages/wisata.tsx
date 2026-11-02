import { Layout } from "@/components/layout";
import { PageLoader } from "@/components/page-loader";
import { SEO } from "@/components/seo";
import { SedangDipersiapkan } from "@/components/sedang-dipersiapkan";
import { CityUnavailable } from "@/components/city-unavailable";
import { Link } from "@/lib/wouter";
import { useState, useEffect } from "react";
import { useCityFilter } from "@/contexts/city-filter-context";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Search, Star, MapPin, Mountain, Landmark, Palette,
  Building2, Clock, BadgeCheck, ChevronRight,
  TreePine, Waves, Eye, X, Church,
} from "lucide-react";
interface WisataItem {
  id: number;
  name: string;
  category: string;
  entry_fee: number;
  image: string;
  location: string;
  description: string;
  rating: number | string | null;
  partner: boolean;
  opening_hours: string;
  phone: string | null;
  website: string | null;
  facilities: string | null;
  google_maps_url: string | null;
  instagram: string | null;
  computed_rating: number | null;
  review_count: number;
}

const categories = [
  { label: "Semua",   icon: TreePine  },
  { label: "Alam",   icon: Mountain  },
  { label: "Sejarah",icon: Landmark  },
  { label: "Budaya", icon: Palette   },
  { label: "Buatan", icon: Building2 },
  { label: "Religi", icon: Church    },
];

const catChip: Record<string, string> = {
  Alam:    "#16a34a",
  Sejarah: "#0172B1",
  Budaya:  "#7c3aed",
  Buatan:  "#0194f3",
  Religi:  "#e11d48",
};

function getGoogleRating(item: WisataItem) {
  const rating = Number(item.rating);
  return Number.isFinite(rating) && rating > 0 ? rating : null;
}

export default function WisataPage() {
  const [wisataList, setWisataList] = useState<WisataItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [active, setActive]         = useState("Semua");
  const [search, setSearch]         = useState("");
  const [partnerOnly, setPartnerOnly] = useState(false);
  const { matchesCity, selectedCity } = useCityFilter();
  const cityLabel = selectedCity === "Semua Jawa Barat" ? "Jawa Barat" : selectedCity;

  useEffect(() => {
    import("../lib/apicache").then(({ cachedFetch }) =>
      cachedFetch<WisataItem[]>("/api/wisata")
        .then((data) => setWisataList(Array.isArray(data) ? data : []))
        .catch(() => setWisataList([]))
        .finally(() => setLoadingData(false))
    );
  }, []);

  const cityList = wisataList.filter((w) => matchesCity(w.location, "Garut"));
  const filtered = cityList
    .filter((w) => {
      const matchCat    = active === "Semua" || w.category === active;
      const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
                          w.location.toLowerCase().includes(search.toLowerCase());
      const matchPartner = !partnerOnly || (w.partner && w.entry_fee > 0);
      return matchCat && matchSearch && matchPartner;
    });

  const mitraList = cityList.filter(w => w.partner && w.entry_fee > 0);
  const hasMitra = mitraList.length > 0;
  const carouselItems = hasMitra ? mitraList : cityList.slice(0, 5);
  const [activeFeat, setActiveFeat] = useState(0);
  useEffect(() => {
    if (!carouselItems.length) return;
    const iv = setInterval(() => setActiveFeat(p => (p + 1) % carouselItems.length), 3000);
    return () => clearInterval(iv);
  }, [carouselItems.length]);

  return (
    <Layout>
      <SEO
        title={`Wisata ${cityLabel} — Destinasi Alam & Budaya Terbaik`}
        description={`Jelajahi destinasi wisata terbaik ${cityLabel} — dari wisata alam, budaya, sejarah, hingga rekreasi keluarga. Temukan petualangan Anda di ${cityLabel}.`}
        keywords={`wisata ${cityLabel.toLowerCase()}, wisata alam ${cityLabel.toLowerCase()}, wisata budaya ${cityLabel.toLowerCase()}, objek wisata ${cityLabel.toLowerCase()}`}
        path="/wisata"
      />
      {/* ══ HERO ══════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-6">

          {/* Title */}
          <div className="mb-5">
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight" style={{ color: "#16a34a" }}>
              Destinasi {cityLabel}
            </h1>
            <p className="text-gray-400 text-sm mt-1">Swiss van Java · {loadingData ? "..." : cityList.length} destinasi tersedia</p>
          </div>

          {/* Search */}
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
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari destinasi atau lokasi…"
                className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 font-medium bg-transparent py-3 px-1"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 mr-1">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                className="shrink-0 active:scale-95 transition-all rounded-xl flex items-center justify-center gap-1.5"
                style={{ background:"#22c55e", color:"#fff", boxShadow:"0 4px 12px rgba(34,197,94,0.35)", padding:"10px 12px" }}
              >
                <Search className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-sm font-bold">Cari</span>
              </button>
            </div>
          </div>

          {/* ── Category Chips ── */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-1 -mb-1">
            {categories.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${
                  active === label
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30"
                    : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-700"
                }`}
              >
                <Icon className="h-3 w-3 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-10 space-y-8">

        {/* ══ PILIHAN TERBAIK (horizontal scroll) ══════════════ */}
        {!search && active === "Semua" && carouselItems.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-extrabold text-gray-900 text-base">
                  {hasMitra ? "Mitra Resmi" : "Destinasi Pilihan"}
                </h2>
                <p className="text-gray-400 text-xs">
                  {hasMitra ? "Destinasi mitra resmi Nempo Organizer" : `Wisata unggulan di ${cityLabel}`}
                </p>
              </div>
              <Link href="/wisata" className="text-emerald-600 text-xs font-bold flex items-center gap-0.5">
                Lihat semua <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Fan Carousel */}
            <div className="relative" style={{ height: 360 }}>
              {carouselItems.map((w, idx) => {
                const total  = carouselItems.length;
                const off    = (idx - activeFeat + total) % total;
                const absOff = off > total / 2 ? off - total : off;
                const abs    = Math.abs(absOff);
                if (abs > 2) return null;
                const tx     = absOff * 148;
                const scale  = abs === 0 ? 1 : abs === 1 ? 0.83 : 0.68;
                const opacity = abs === 0 ? 1 : abs === 1 ? 0.80 : 0.50;
                const rotateY = absOff * -12;
                const googleRating = getGoogleRating(w);
                return (
                  <Link
                    key={w.id}
                    href={abs === 0 ? `/wisata/${(w as any).slug || w.id}` : "#"}
                    className="absolute left-1/2 top-0"
                    style={{
                      transform: `translateX(calc(-50% + ${tx}px)) scale(${scale}) rotateY(${rotateY}deg)`,
                      opacity, zIndex: 10 - abs,
                      transition: "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease",
                      willChange: "transform",
                      width: 200,
                    }}
                    onClick={e => { if (abs !== 0) { e.preventDefault(); setActiveFeat(idx); } }}
                  >
                    <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(160deg,#0f766e,#14b8a6)" }}>
                      <div className="relative overflow-hidden" style={{ height: 164 }}>
                        <img src={w.image} alt={w.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                        <span className="absolute text-[10px] font-bold text-white" style={{ background: catChip[w.category] ?? "#475569", top: 10, left: 0, borderRadius: "0 6px 6px 0", padding: "4px 10px", boxShadow: "1px 2px 6px rgba(0,0,0,0.25)" }}>{cityLabel}</span>
                        {googleRating != null ? (
                          <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-lg text-yellow-600 shadow-sm">
                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-[10px]">{googleRating.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                          </div>
                        ) : w.computed_rating != null && (
                          <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-lg" title="Rating Nempo">
                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-white font-bold text-[10px]">Nempo {w.computed_rating}</span>
                          </div>
                        )}
                        {hasMitra && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-teal-600/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                            <BadgeCheck className="h-2.5 w-2.5" /> Mitra Resmi
                          </div>
                        )}
                      </div>
                      <div className="px-4 pt-3 pb-4">
                        <p className="font-extrabold text-white text-sm line-clamp-1 mb-1">{w.name}</p>
                        <p className="text-white/70 text-[11px] flex items-center gap-1 mb-0.5 overflow-hidden">
                          <MapPin className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate">{w.location}</span>
                        </p>
                        <p className="text-white/70 text-[11px] flex items-center gap-1 mb-3 overflow-hidden">
                          <Clock className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate">{w.opening_hours ?? "08.00–17.00"}</span>
                        </p>
                        <div className="bg-white rounded-xl py-2 text-center text-xs font-extrabold text-teal-700">
                          Kunjungi
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="flex justify-center gap-1.5 mt-2 mb-4">
              {carouselItems.map((_, i) => (
                <button key={i} onClick={() => setActiveFeat(i)}
                  className={`rounded-full transition-all duration-300 ${i === activeFeat ? "w-5 h-2 bg-teal-600" : "w-2 h-2 bg-teal-200"}`}
                />
              ))}
            </div>
          </section>
        )}


        {/* ══ DESTINATION LIST ═══════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-gray-900 text-base">
              {active === "Semua" ? "Semua Destinasi" : `Wisata ${active}`}
            </h2>
            <span className="text-gray-400 text-xs">{filtered.length} tempat</span>
          </div>

          {loadingData ? (
            <PageLoader text="Memuat destinasi wisata…" />
          ) : wisataList.length === 0 ? (
            <SedangDipersiapkan
              icon={Mountain}
              iconGradient="linear-gradient(135deg, #16a34a 0%, #22c55e 100%)"
              dotColor1="#16a34a"
              dotColor2="#22c55e"
              title="Destinasi Wisata"
              titleHighlight="Sedang Dipersiapkan"
              description={`Daftar destinasi wisata ${cityLabel} sedang kami kurasi untukmu. Pantau terus untuk update terbaru!`}
              btn1Label="Jelajahi Kuliner"
              btn1Href="/kuliner"
              btn2Label="Lihat Event"
              btn2Href="/event"
            />
          ) : cityList.length === 0 ? (
            <CityUnavailable accent="#16a34a" category="Destinasi wisata" />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-16 w-16 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Mountain className="h-8 w-8 text-gray-300" />
              </div>
              <p className="font-semibold text-gray-400">Tidak ditemukan</p>
              <p className="text-xs text-gray-300 mt-1">Coba kata kunci lain</p>
            </div>
          ) : (
            /* Mobile: vertical card list | Desktop: grid */
            <>
            <style>{`
              .wisata-list-card {
                box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12), 0 2px 5px rgba(15, 23, 42, 0.06);
              }
              .wisata-list-card:hover {
                box-shadow: 0 14px 30px rgba(15, 23, 42, 0.16), 0 4px 9px rgba(15, 23, 42, 0.08);
              }
            `}</style>
             <div className="mobile-card-slider sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
              {filtered.map((w) => {
                const googleRating = getGoogleRating(w);
                return (
                <Link key={w.id} href={`/wisata/${(w as any).slug || w.id}`} className="block sm:contents">

                  {/* ── Mobile: horizontal card ── */}
                   <div className="wisata-list-card flex gap-3 bg-white rounded-2xl border border-gray-100 overflow-hidden p-0 hover:shadow-md transition-shadow duration-200 cursor-pointer group sm:hidden">
                    <div className="w-28 h-28 shrink-0 relative overflow-hidden rounded-l-2xl">
                      <img src={w.image} alt={w.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {w.partner && w.entry_fee > 0 && (
                        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-blue-600/90 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white">
                          <BadgeCheck className="h-2.5 w-2.5" /> Mitra
                        </div>
                      )}
                    </div>
                    <div className="flex-1 py-3 pr-3 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{w.name}</h3>
                          {googleRating != null ? (
                            <span className="flex items-center gap-0.5 shrink-0 text-[10px] font-bold text-yellow-600" title="Rating Google Maps">
                              <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />{googleRating.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            </span>
                          ) : w.computed_rating != null && (
                            <span className="flex items-center gap-0.5 shrink-0 text-[10px] font-bold text-gray-700" title="Rating Nempo">
                              <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />Nempo {w.computed_rating}
                            </span>
                          )}
                        </div>
                        <span className="inline-block text-[10px] font-bold text-white" style={{ background: catChip[w.category] ?? "#475569", borderRadius: "0 6px 6px 0", padding: "4px 10px", boxShadow: "1px 2px 6px rgba(0,0,0,0.25)" }}>
                          {cityLabel}
                        </span>
                        <p className="text-gray-400 text-[11px] flex items-center gap-0.5 mt-1">
                          <MapPin className="h-2.5 w-2.5 shrink-0 text-red-400" />
                          <span className="truncate">{w.location}</span>
                        </p>
                        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2 mt-1">{w.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <span className="flex items-center gap-1 text-gray-400 text-[10px] min-w-0 overflow-hidden">
                          <Clock className="h-2.5 w-2.5 shrink-0" /><span className="truncate">{w.opening_hours ?? "08.00 - 17.00"}</span>
                        </span>
                        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                          {w.instagram && (
                            <a href={`https://instagram.com/${w.instagram.replace(/^@/, "")}`}
                               target="_blank" rel="noopener noreferrer"
                               onClick={e => e.stopPropagation()}
                               className="flex items-center gap-1 text-pink-500 text-[10px] font-semibold min-w-0 overflow-hidden">
                              <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current shrink-0"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                              <span className="truncate">{w.instagram.startsWith("@") ? w.instagram : `@${w.instagram}`}</span>
                            </a>
                          )}
                          <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-0.5 shrink-0 whitespace-nowrap">
                            Detail <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Desktop: vertical card ── */}
                  <div className="wisata-list-card hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
                    <div className="h-44 relative overflow-hidden">
                      <img src={w.image} alt={w.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {googleRating != null ? (
                          <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl text-[10px] font-bold text-yellow-600 shadow-sm" title="Rating Google Maps">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />{googleRating.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        </div>
                      ) : w.computed_rating != null && (
                        <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl text-xs font-bold text-gray-900 shadow-sm" title="Rating Nempo">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />Nempo {w.computed_rating}
                        </div>
                      )}
                      <span className="absolute text-[10px] font-bold text-white" style={{ background: catChip[w.category] ?? "#475569", top: 10, left: 0, borderRadius: "0 6px 6px 0", padding: "4px 10px", boxShadow: "1px 2px 6px rgba(0,0,0,0.25)" }}>
                        {cityLabel}
                      </span>
                      {w.partner && w.entry_fee > 0 && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-blue-600/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-white">
                          <BadgeCheck className="h-3 w-3" /> Mitra Resmi
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-emerald-700 transition-colors">{w.name}</h3>
                      <p className="text-gray-400 text-xs flex items-center gap-1 mb-2">
                        <MapPin className="h-3 w-3 shrink-0 text-red-400" />{w.location}
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{w.description}</p>
                      <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                        <span className="flex items-center gap-1 text-gray-400 text-[10px]">
                          <Clock className="h-3 w-3" />{w.opening_hours ?? "08.00 - 17.00"}
                        </span>
                        {w.instagram ? (
                          <a href={`https://instagram.com/${w.instagram.replace(/^@/, "")}`}
                             target="_blank" rel="noopener noreferrer"
                             onClick={e => e.stopPropagation()}
                             className="flex items-center gap-1 text-[10px] font-semibold text-pink-500 hover:text-pink-600 transition-colors min-w-0 overflow-hidden">
                            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current shrink-0"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            <span className="truncate">{w.instagram.startsWith("@") ? w.instagram : `@${w.instagram}`}</span>
                          </a>
                        ) : (
                          <span className="flex items-center gap-0.5 text-gray-400 text-[10px]">
                            <Eye className="h-3 w-3" /> Info
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </Link>
                );
              })}
            </div>
            </>
          )}
        </section>

        {/* ══ INFO FOOTER ═══════════════════════════════════════ */}
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30">
            <Waves className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-gray-900 text-sm mb-0.5">Ingin Tambahkan Destinasi?</p>
            <p className="text-gray-500 text-xs">Daftarkan tempat wisatamu dan jangkau lebih banyak wisatawan bersama Nempo Organizer.</p>
          </div>
          <Link href="/sponsorship" className="shrink-0">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap shadow-md shadow-emerald-600/20">
              Daftar Mitra
            </button>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
