import { Layout } from "@/components/layout";
import { PageLoader } from "@/components/page-loader";
import { SEO } from "@/components/seo";
import { CityUnavailable } from "@/components/city-unavailable";
import { PlacePhoto } from "@/components/place-photo";
import { Link } from "@/lib/wouter";
import { useState, useEffect } from "react";
import { useCityFilter } from "@/contexts/city-filter-context";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import {
  Search, Star, MapPin, Clock, X, Coffee, ChevronRight, Eye,
} from "lucide-react";

interface CafeItem {
  id: number;
  name: string;
  category: string;
  image: string;
  location: string;
  description: string;
  featured: boolean;
  hours: string | null;
  price_range: string | null;
  phone: string | null;
  google_maps_url: string | null;
  instagram: string | null;
  rating: number | string | null;
  computed_rating: number | null;
  review_count: number;
}

function getGoogleRating(item: CafeItem) {
  const rating = Number(item.rating);
  return Number.isFinite(rating) && rating > 0 ? rating : null;
}

function getCityLabel(location: string) {
  const normalized = location.toLowerCase();
  if (normalized.includes("banjar")) return "Banjar";
  if (normalized.includes("bandung")) return "Bandung";
  if (normalized.includes("bekasi")) return "Bekasi";
  if (normalized.includes("bogor")) return "Bogor";
  if (normalized.includes("cianjur")) return "Cianjur";
  if (normalized.includes("cimahi")) return "Cimahi";
  if (normalized.includes("cirebon")) return "Cirebon";
  if (normalized.includes("depok")) return "Depok";
  if (normalized.includes("garut")) return "Garut";
  if (normalized.includes("indramayu")) return "Indramayu";
  if (normalized.includes("karawang")) return "Karawang";
  if (normalized.includes("kuningan")) return "Kuningan";
  if (normalized.includes("majalengka")) return "Majalengka";
  if (normalized.includes("pangandaran")) return "Pangandaran";
  if (normalized.includes("purwakarta")) return "Purwakarta";
  if (normalized.includes("subang")) return "Subang";
  if (normalized.includes("sukabumi")) return "Sukabumi";
  if (normalized.includes("sumedang")) return "Sumedang";
  if (normalized.includes("tasikmalaya")) return "Tasikmalaya";
  return "Jawa Barat";
}

export default function CafePage() {
  const [allList, setAllList]     = useState<CafeItem[]>([]);
  const [loadingData, setLoading] = useState(true);
  const [search, setSearch]       = useState("");
  const [activeFeat, setActiveFeat] = useState(0);
  const { matchesCity } = useCityFilter();

  useEffect(() => {
    import("../lib/apicache").then(({ cachedFetch }) =>
      cachedFetch<CafeItem[]>("/api/cafe")
        .then((data) => {
          setAllList(Array.isArray(data) ? data : []);
        })
        .catch(() => setAllList([]))
        .finally(() => setLoading(false))
    );
  }, []);

  const cityList = allList.filter((k) => matchesCity(k.location, "Garut"));
  const filtered = cityList.filter(
    (k) =>
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.location.toLowerCase().includes(search.toLowerCase())
  );

  const featuredList   = cityList.filter((k) => k.featured);
  const carouselItems  = featuredList.length > 0 ? featuredList : cityList.slice(0, 5);

  useEffect(() => {
    if (!carouselItems.length) return;
    const iv = setInterval(
      () => setActiveFeat((p) => (p + 1) % carouselItems.length),
      3000
    );
    return () => clearInterval(iv);
  }, [carouselItems.length]);

  return (
    <Layout>
      <SEO
        title="Cafe Jawa Barat — Tempat Nongkrong & Kopi Terbaik"
        description="Temukan cafe aesthetic, kopi lokal, dan tempat nongkrong terbaik di Jawa Barat. Pemandangan alam, suasana nyaman, dan kopi khas Sunda."
        keywords="cafe jawa barat, kopi jawa barat, tempat nongkrong jawa barat, cafe aesthetic jawa barat, coffee shop jawa barat"
        path="/cafe"
      />

      {/* HERO */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-6">
          <div className="mb-5">
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-[#7c3aed]">
              Cafe Jawa Barat
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Kopi, view, &amp; vibes ·{" "}
               {loadingData ? "Memuat..." : `${cityList.length} cafe tersedia`}
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-white rounded-2xl shadow-xl border border-gray-100 pr-1.5 overflow-visible transition-all">
              <div className="flex items-center justify-center shrink-0" style={{ marginLeft: 2, marginTop: 2 }}>
                <DotLottieReact
                  src={`${import.meta.env.BASE_URL}animations/bird.json`}
                  loop autoplay
                  style={{ width: 36, height: 36 }}
                />
              </div>
              <div className="w-px self-stretch my-2 mx-1.5 shrink-0 bg-gray-200" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari cafe atau lokasi…"
                className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 font-medium bg-transparent py-3 px-1"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 mr-1">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                className="shrink-0 active:scale-95 transition-all rounded-xl flex items-center justify-center gap-1.5"
                style={{ background: "#7c3aed", color: "#fff", boxShadow: "0 4px 12px rgba(124,58,237,0.35)", padding: "10px 12px" }}
              >
                <Search className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-sm font-bold">Cari</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-10 space-y-8">

        {/* CAROUSEL */}
        {!search && carouselItems.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-extrabold text-gray-900 text-base">
                  {featuredList.length > 0 ? "Cafe Favorit" : "Cafe Pilihan"}
                </h2>
                <p className="text-gray-400 text-xs">
                  {featuredList.length > 0 ? "Pilihan cafe terpopuler wisatawan" : "Cafe unggulan Jawa Barat"}
                </p>
              </div>
            </div>

            <div className="relative" style={{ height: 360 }}>
              {carouselItems.map((k, idx) => {
                const total  = carouselItems.length;
                const off    = (idx - activeFeat + total) % total;
                const absOff = off > total / 2 ? off - total : off;
                const abs    = Math.abs(absOff);
                if (abs > 2) return null;
                const tx      = absOff * 148;
                const scale   = abs === 0 ? 1 : abs === 1 ? 0.83 : 0.68;
                const opacity = abs === 0 ? 1 : abs === 1 ? 0.80 : 0.50;
                const rotateY = absOff * -12;
                const googleRating = getGoogleRating(k);
                return (
                  <Link
                    key={k.id}
                    href={abs === 0 ? `/cafe/${(k as any).slug || k.id}` : "#"}
                    className="absolute left-1/2 top-0"
                    style={{
                      transform: `translateX(calc(-50% + ${tx}px)) scale(${scale}) rotateY(${rotateY}deg)`,
                      opacity, zIndex: 10 - abs,
                      transition: "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease",
                      willChange: "transform",
                      width: 200,
                    }}
                    onClick={(e) => { if (abs !== 0) { e.preventDefault(); setActiveFeat(idx); } }}
                  >
                    <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(145deg,#3b0764,#7c3aed)" }}>
                      <div className="relative overflow-hidden" style={{ height: 164 }}>
                        <PlacePhoto kind="cafe" src={k.image} alt={k.name} className="w-full h-full" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <span className="absolute top-2 left-0 text-[10px] font-bold text-white" style={{ background: "#7c3aed", borderRadius: "0 6px 6px 0", padding: "4px 10px", boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }}>
                          {getCityLabel(k.location)}
                        </span>
                        {googleRating != null && (
                          <span className="absolute top-2 right-2 inline-flex items-center gap-0.5 rounded-full bg-white/90 px-1.5 py-1 text-[10px] font-bold text-yellow-600 shadow-sm" title="Rating Google Maps">
                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                            <span>{googleRating.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                          </span>
                        )}
                        {googleRating == null && k.computed_rating != null && (
                          <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-lg">
                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-white font-bold text-[10px]">{k.computed_rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="px-4 pt-3 pb-4">
                        <p className="font-extrabold text-white text-sm line-clamp-1 mb-1">{k.name}</p>
                        <p className="text-white/70 text-[11px] flex items-center gap-1 mb-0.5 min-w-0">
                          <MapPin className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate min-w-0">{k.location}</span>
                        </p>
                        <p className="text-white/70 text-[11px] flex items-center gap-1 mb-3 min-w-0">
                          <Clock className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate min-w-0">{k.hours ?? "09.00–22.00"}</span>
                        </p>
                        <div className="bg-white rounded-xl py-2 text-center text-xs font-extrabold text-[#7c3aed]">
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
                  className={`rounded-full transition-all duration-300 ${i === activeFeat ? "w-5 h-2 bg-[#7c3aed]" : "w-2 h-2 bg-[#DDD6FE]"}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* LIST */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-gray-900 text-base">Semua Cafe</h2>
            <span className="text-gray-400 text-xs">{filtered.length} cafe</span>
          </div>

          {loadingData ? (
            <PageLoader text="Memuat cafe…" />
          ) : allList.length > 0 && cityList.length === 0 ? (
            <CityUnavailable accent="#7c3aed" category="Cafe" />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-16 w-16 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Coffee className="h-8 w-8 text-gray-300" />
              </div>
              <p className="font-semibold text-gray-400">Tidak ditemukan</p>
              <p className="text-xs text-gray-300 mt-1">Coba kata kunci lain</p>
            </div>
          ) : (
            <>
            <style>{`
              .cafe-list-card {
                box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12), 0 2px 5px rgba(15, 23, 42, 0.06);
              }
              .cafe-list-card:hover {
                box-shadow: 0 14px 30px rgba(15, 23, 42, 0.16), 0 4px 9px rgba(15, 23, 42, 0.08);
              }
            `}</style>
             <div className="mobile-card-slider sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
              {filtered.map((k) => {
                const googleRating = getGoogleRating(k);
                return (
                <Link key={k.id} href={`/cafe/${(k as any).slug || k.id}`} className="block sm:contents">
                  <div className="cafe-list-card flex gap-3 bg-white rounded-2xl border border-gray-100 overflow-hidden p-0 hover:shadow-md transition-shadow duration-200 cursor-pointer group sm:hidden">
                    <div className="w-28 h-28 shrink-0 relative overflow-hidden rounded-l-2xl">
                      <PlacePhoto
                        kind="cafe"
                        src={k.image}
                        alt={k.name}
                        className="w-full h-full"
                        imageClassName="group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white bg-purple-600/90 backdrop-blur-md px-1.5 py-0.5 rounded-full">
                        Cafe
                      </span>
                    </div>
                    <div className="flex-1 py-3 pr-3 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{k.name}</h3>
                          {googleRating != null ? (
                            <span className="flex items-center gap-0.5 shrink-0 text-[10px] font-bold text-yellow-600" title="Rating Google Maps">
                              <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
                              {googleRating.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            </span>
                          ) : k.computed_rating != null && (
                            <span className="flex items-center gap-0.5 shrink-0 text-[10px] font-bold text-gray-700" title="Rating Nempo">
                              <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />Nempo {k.computed_rating}
                            </span>
                          )}
                        </div>
                        <span className="inline-block text-[10px] font-bold text-white bg-purple-600 rounded px-2 py-0.5 mb-1">
                          Cafe
                        </span>
                        <p className="text-gray-400 text-[11px] flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5 shrink-0 text-red-400" />
                          <span className="truncate">{k.location}</span>
                        </p>
                        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2 mt-1">{k.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <span className="flex items-center gap-1 text-gray-400 text-[10px] min-w-0 overflow-hidden">
                          <Clock className="h-2.5 w-2.5 shrink-0" /><span className="truncate">{k.hours ?? "09.00–22.00"}</span>
                        </span>
                        <span className="text-[#7c3aed] text-[11px] font-bold flex items-center gap-0.5 shrink-0">
                          Detail <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop: vertical card */}
                  <div className="cafe-list-card hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
                    <div className="h-44 relative overflow-hidden">
                      <PlacePhoto
                        kind="cafe"
                        src={k.image}
                        alt={k.name}
                        className="w-full h-full"
                        imageClassName="group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-2 left-0 text-[10px] font-bold text-white" style={{ background: "#7c3aed", borderRadius: "0 6px 6px 0", padding: "4px 10px", boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }}>
                        {getCityLabel(k.location)}
                      </span>
                      {googleRating != null && (
                        <span className="absolute top-3 right-3 inline-flex items-center gap-0.5 rounded-xl bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-yellow-600 shadow-sm" title="Rating Google Maps">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          {googleRating.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        </span>
                      )}
                      {googleRating == null && k.computed_rating != null && (
                        <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl text-xs font-bold text-gray-900 shadow-sm" title="Rating Nempo">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />Nempo {k.computed_rating}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#7c3aed] transition-colors">{k.name}</h3>
                      <p className="text-gray-400 text-xs flex items-center gap-1 mb-2">
                        <MapPin className="h-3 w-3 shrink-0 text-red-400" />{k.location}
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{k.description}</p>
                      <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                        <span className="flex items-center gap-1 text-gray-400 text-[10px] min-w-0 overflow-hidden">
                          <Clock className="h-3 w-3 shrink-0" /><span className="truncate">{k.hours ?? "09.00–22.00"}</span>
                        </span>
                        {k.instagram ? (
                          <span
                            role="link"
                            tabIndex={0}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(`https://instagram.com/${k.instagram!.replace(/^@/, "")}`, "_blank", "noopener,noreferrer");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                window.open(`https://instagram.com/${k.instagram!.replace(/^@/, "")}`, "_blank", "noopener,noreferrer");
                              }
                            }}
                            className="flex items-center gap-1 text-[10px] font-semibold text-pink-500 hover:text-pink-600 transition-colors min-w-0 overflow-hidden"
                          >
                            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current shrink-0"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            <span className="truncate">{k.instagram.startsWith("@") ? k.instagram : `@${k.instagram}`}</span>
                          </span>
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

        {/* CTA */}
        <section className="bg-[linear-gradient(135deg,#3b0764_0%,#7c3aed_100%)] border border-[#7c3aed] rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-lg shadow-black/10">
            <Coffee className="h-6 w-6 text-[#7c3aed]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-white text-sm mb-0.5">Punya Cafe di Jawa Barat?</p>
            <p className="text-white/75 text-xs">Daftarkan cafemu dan jangkau lebih banyak pengunjung bersama Nempo Organizer.</p>
          </div>
          <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <button className="bg-white hover:bg-purple-50 text-[#7c3aed] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap shadow-md shadow-black/10">
              Daftar Mitra
            </button>
          </a>
        </section>

      </div>
    </Layout>
  );
}
