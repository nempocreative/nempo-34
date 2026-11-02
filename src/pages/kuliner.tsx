import { Layout } from "@/components/layout";
import { PlacePhoto } from "@/components/place-photo";
import { PageLoader } from "@/components/page-loader";
import { SEO } from "@/components/seo";
import { SedangDipersiapkan } from "@/components/sedang-dipersiapkan";
import { CityUnavailable } from "@/components/city-unavailable";
import { Link } from "@/lib/wouter";
import { useState, useEffect } from "react";
import { useCityFilter } from "@/contexts/city-filter-context";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import {
  Search, Star, MapPin, UtensilsCrossed, Coffee, IceCream2,
  Cookie, ChevronRight, Clock,
  X, Store, ShoppingBag,
} from "lucide-react";
interface KulinerItem {
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

const categories = [
  { label: "Semua",        icon: UtensilsCrossed },
  { label: "Makanan Berat",icon: UtensilsCrossed },
  { label: "Snack",        icon: Cookie          },
  { label: "Minuman",      icon: Coffee          },
  { label: "Dessert",      icon: IceCream2       },
  { label: "Oleh-oleh",   icon: ShoppingBag     },
];

const catChip: Record<string, string> = {
  "Makanan Berat": "#f97316",
  Snack:           "#64748b",
  Minuman:         "#0194f3",
  Dessert:         "#ec4899",
  "Oleh-oleh":    "#0172B1",
  "Makanan Ringan":"#16a34a",
  "Street Food":  "#ea580c",
};

function normalizeCategory(value: string): string {
  return value.trim().toLowerCase().replace(/\s*-\s*/g, "-");
}

function getGoogleRating(item: KulinerItem) {
  const rating = Number(item.rating);
  return Number.isFinite(rating) && rating > 0 ? rating : null;
}

export default function KulinerPage() {
  const [kulinerList, setKulinerList] = useState<KulinerItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [active, setActive]           = useState("Semua");
  const [search, setSearch]           = useState("");
  const [filterOpen, setFilterOpen]   = useState(false);
  const { matchesCity, selectedCity } = useCityFilter();

  useEffect(() => {
    import("../lib/apicache").then(({ cachedFetch }) =>
      cachedFetch<KulinerItem[]>("/api/kuliner")
        .then((data) => setKulinerList(Array.isArray(data) ? data : []))
        .catch(() => setKulinerList([]))
        .finally(() => setLoadingData(false))
    );
  }, []);

  const cityList = kulinerList.filter((k) => matchesCity(k.location, "Garut"));
  const filtered = cityList
    .filter((k) => {
      const matchCat    = active === "Semua" || normalizeCategory(k.category) === normalizeCategory(active);
      const matchSearch = k.name.toLowerCase().includes(search.toLowerCase()) ||
                          k.location.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  const featuredList = cityList.filter(k => k.featured);
  const carouselItems = featuredList.length > 0 ? featuredList : cityList.slice(0, 5);

  const [activeFeat, setActiveFeat] = useState(0);
  useEffect(() => {
    if (!carouselItems.length) return;
    const iv = setInterval(() => setActiveFeat(p => (p + 1) % carouselItems.length), 3000);
    return () => clearInterval(iv);
  }, [carouselItems.length]);

  return (
    <Layout>
      <SEO
        title={`Kuliner ${selectedCity} — Makanan Khas & Restoran Terbaik`}
        description={`Temukan rekomendasi kuliner khas dan tempat makan terbaik di ${selectedCity}.`}
        keywords={`kuliner ${selectedCity.toLowerCase()}, makanan khas ${selectedCity.toLowerCase()}, restoran ${selectedCity.toLowerCase()}`}
        path="/kuliner"
      />
      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-6">

          <div className="mb-5">
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-[#0194f3]">
              Kuliner {selectedCity}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
               {selectedCity === "Garut" ? "Swiss van Java" : `Pilihan tempat makan ${selectedCity}`} · {loadingData ? "Memuat..." : `${cityList.length} tempat makan tersedia`}
            </p>
          </div>

          {/* Search + Filter */}
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
                placeholder="Cari makanan atau lokasi…"
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
                    ? "text-white border-[#0194f3] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#0194f3] hover:text-[#0194f3]"
                }`}
                style={active === label ? { background: "#0194f3", boxShadow: "0 2px 8px rgba(1,148,243,0.3)" } : undefined}
              >
                <Icon className="h-3 w-3 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-10 space-y-8">

        {/* ══ CAROUSEL ════════════════════════════════════════════ */}
        {!search && active === "Semua" && carouselItems.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-extrabold text-gray-900 text-base">
                  {featuredList.length > 0 ? "Kuliner Favorit" : "Kuliner Pilihan"}
                </h2>
                <p className="text-gray-400 text-xs">
                  {featuredList.length > 0 ? "Pilihan kuliner terpopuler wisatawan" : "Kuliner unggulan Garut"}
                </p>
              </div>
              <Link href="/kuliner" className="text-[#0194f3] text-xs font-bold flex items-center gap-0.5">
                Lihat semua <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="relative" style={{ height: 360 }}>
              {carouselItems.map((k, idx) => {
                const total   = carouselItems.length;
                const off     = (idx - activeFeat + total) % total;
                const absOff  = off > total / 2 ? off - total : off;
                const abs     = Math.abs(absOff);
                if (abs > 2) return null;
                const tx      = absOff * 148;
                const scale   = abs === 0 ? 1 : abs === 1 ? 0.83 : 0.68;
                const opacity = abs === 0 ? 1 : abs === 1 ? 0.80 : 0.50;
                const rotateY = absOff * -12;
                return (
                  <Link
                    key={k.id}
                    href={abs === 0 ? `/kuliner/${(k as any).slug || k.id}` : "#"}
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
                    <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(145deg,#001E6E,#0194f3)" }}>
                      <div className="relative overflow-hidden" style={{ height: 164 }}>
                        <PlacePhoto kind="culinary" src={k.image} alt={k.name} className="h-full w-full" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <span className="absolute text-[10px] font-bold text-white" style={{ background: catChip[k.category] ?? catChip[Object.keys(catChip).find(key => normalizeCategory(key) === normalizeCategory(k.category)) ?? ""] ?? "#475569", top: 10, left: 0, borderRadius: "0 6px 6px 0", padding: "4px 10px", boxShadow: "1px 2px 6px rgba(0,0,0,0.25)" }}>{k.category}</span>
                        {getGoogleRating(k) != null ? (
                          <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-lg text-yellow-600 shadow-sm" title="Rating Google Maps">
                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-[10px]">{getGoogleRating(k)!.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                          </div>
                        ) : k.computed_rating != null && (
                          <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-lg" title="Rating Nempo">
                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-white font-bold text-[10px]">Nempo {k.computed_rating}</span>
                          </div>
                        )}
                        {featuredList.length > 0 && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#0194f3]/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                            <Store className="h-2.5 w-2.5" /> Favorit
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
                          <span className="truncate min-w-0">{k.hours ?? "09.00–21.00"}</span>
                        </p>
                        <div className="bg-white rounded-xl py-2 text-center text-xs font-extrabold text-[#0194f3]">
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
                  className={`rounded-full transition-all duration-300 ${i === activeFeat ? "w-5 h-2 bg-[#0194f3]" : "w-2 h-2 bg-[#CCE0FF]"}`}
                />
              ))}
            </div>
          </section>
        )}


        {/* ══ KULINER LIST ════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-gray-900 text-base">
              {active === "Semua" ? "Semua Kuliner" : active}
            </h2>
            <span className="text-gray-400 text-xs">{filtered.length} tempat</span>
          </div>

          {loadingData ? (
            <PageLoader text="Memuat tempat makan…" />
          ) : kulinerList.length === 0 ? (
            <SedangDipersiapkan
              icon={UtensilsCrossed}
              iconGradient="linear-gradient(135deg, #f97316 0%, #fb923c 100%)"
              dotColor1="#f97316"
              dotColor2="#fb923c"
              title="Kuliner Garut"
              titleHighlight="Sedang Dipersiapkan"
              description="Rekomendasi kuliner khas Garut sedang kami kurasi untukmu. Pantau terus untuk update terbaru!"
              btn1Label="Jelajahi Wisata"
              btn1Href="/wisata"
              btn2Label="Lihat Event"
              btn2Href="/event"
            />
          ) : cityList.length === 0 ? (
            <CityUnavailable accent="#f97316" category="Kuliner" />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-16 w-16 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="h-8 w-8 text-gray-300" />
              </div>
              <p className="font-semibold text-gray-400">Tidak ditemukan</p>
              <p className="text-xs text-gray-300 mt-1">Coba kata kunci lain</p>
            </div>
          ) : (
            <>
            <style>{`
              .kuliner-list-card {
                box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12), 0 2px 5px rgba(15, 23, 42, 0.06);
              }
              .kuliner-list-card:hover {
                box-shadow: 0 14px 30px rgba(15, 23, 42, 0.16), 0 4px 9px rgba(15, 23, 42, 0.08);
              }
            `}</style>
             <div className="mobile-card-slider sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
              {filtered.map((k) => (
                <Link key={k.id} href={`/kuliner/${(k as any).slug || k.id}`} className="block sm:contents">
                  <div className="kuliner-list-card bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group h-full flex flex-col mb-4 sm:mb-0">
                    <div className="relative overflow-hidden" style={{ paddingBottom: "63%" }}>
                      <PlacePhoto
                        kind="culinary"
                        src={k.image}
                        alt={k.name}
                        className="absolute inset-0 w-full"
                        imageClassName="group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className="absolute text-[10px] font-bold text-white" style={{ background: catChip[k.category] ?? catChip[Object.keys(catChip).find(key => normalizeCategory(key) === normalizeCategory(k.category)) ?? ""] ?? "#475569", top: 10, left: 0, borderRadius: "0 6px 6px 0", padding: "4px 10px", boxShadow: "1px 2px 6px rgba(0,0,0,0.25)" }}>
                        {k.category}
                      </span>
                      {getGoogleRating(k) != null ? (
                        <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl text-[10px] font-bold text-yellow-600 shadow-sm" title="Rating Google Maps">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />{getGoogleRating(k)!.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        </div>
                      ) : k.computed_rating != null && (
                        <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl text-xs font-bold text-gray-900 shadow-sm" title="Rating Nempo">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />Nempo {k.computed_rating}
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#0194f3] transition-colors line-clamp-2">{k.name}</h3>
                      <p className="text-gray-400 text-xs flex items-start gap-1 mb-1 min-w-0">
                        <MapPin className="h-3 w-3 shrink-0 mt-0.5 text-red-400" />
                        <span className="break-words min-w-0">{k.location}</span>
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">{k.description}</p>
                      <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                        <span className="flex items-center gap-1 text-gray-400 text-[10px] min-w-0 overflow-hidden">
                          <Clock className="h-3 w-3 shrink-0" /><span className="truncate">{k.hours ?? "09.00–21.00"}</span>
                        </span>
                        {k.instagram && (
                          <a
                            href={`https://instagram.com/${k.instagram.replace(/^@/, "")}`}
                            target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1 text-[10px] font-semibold text-pink-500 hover:text-pink-600 transition-colors"
                          >
                            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current shrink-0"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            <span className="truncate">{k.instagram.startsWith("@") ? k.instagram : `@${k.instagram}`}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            </>
          )}
        </section>

        {/* ══ CTA BANNER ════════════════════════════════════════ */}
        <section className="bg-[linear-gradient(135deg,#001553_0%,#003BAF_100%)] border border-[#003BAF] rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-lg shadow-black/10">
            <Store className="h-6 w-6 text-[#0194f3]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-white text-sm mb-0.5">Punya Rumah Makan atau Kuliner Khas?</p>
            <p className="text-white/75 text-xs">Daftarkan tempat makanmu dan jangkau lebih banyak wisatawan bersama Nempo Organizer.</p>
          </div>
          <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <button className="bg-white hover:bg-blue-50 text-[#0194f3] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap shadow-md shadow-black/10">
              Daftar Mitra
            </button>
          </a>
        </section>

      </div>
    </Layout>
  );
}
