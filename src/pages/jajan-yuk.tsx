import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/wouter";
import {
  ArrowRight,
  Check,
  ChefHat,
  ChevronRight,
  Clock3,
  Coffee,
  Cookie,
  IceCream2,
  MapPin,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { PageLoader } from "@/components/page-loader";
import { CityUnavailable } from "@/components/city-unavailable";
import { SedangDipersiapkan } from "@/components/sedang-dipersiapkan";
import { useCityFilter } from "@/contexts/city-filter-context";

interface JajanItem {
  id: number;
  slug?: string;
  name: string;
  category: string;
  image: string;
  location: string;
  description: string;
  featured: boolean;
  hours: string | null;
  price_range: string | null;
  rating: number | string | null;
  computed_rating: number | null;
}

type Category = {
  label: string;
  icon: typeof UtensilsCrossed;
  tone: string;
};

const categories: Category[] = [
  { label: "Semua", icon: UtensilsCrossed, tone: "orange" },
  { label: "Makanan Berat", icon: UtensilsCrossed, tone: "orange" },
  { label: "Snack", icon: Cookie, tone: "slate" },
  { label: "Minuman", icon: Coffee, tone: "sky" },
  { label: "Dessert", icon: IceCream2, tone: "rose" },
  { label: "Oleh-oleh", icon: ShoppingBag, tone: "teal" },
];

const categoryStyles: Record<string, { color: string; bg: string }> = {
  "Makanan Berat": { color: "#c2410c", bg: "#fff1e8" },
  Snack: { color: "#475569", bg: "#f1f5f9" },
  Minuman: { color: "#0369a1", bg: "#e0f2fe" },
  Dessert: { color: "#be185d", bg: "#fce7f3" },
  "Oleh-oleh": { color: "#0f766e", bg: "#ccfbf1" },
  "Makanan Ringan": { color: "#15803d", bg: "#dcfce7" },
  "Street Food": { color: "#c2410c", bg: "#fff1e8" },
};

function normalizeCategory(value: string) {
  return value.trim().toLowerCase().replace(/\s*-\s*/g, "-");
}

function getCategoryStyle(category: string) {
  const exact = categoryStyles[category];
  if (exact) return exact;
  const key = Object.keys(categoryStyles).find(
    (value) => normalizeCategory(value) === normalizeCategory(category),
  );
  return (key && categoryStyles[key]) || { color: "#c2410c", bg: "#fff1e8" };
}

function getRating(item: JajanItem) {
  const googleRating = Number(item.rating);
  if (Number.isFinite(googleRating) && googleRating > 0) return googleRating;
  return item.computed_rating;
}

function formatRating(rating: number) {
  return rating.toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function MerchantCard({
  item,
  featured = false,
}: {
  item: JajanItem;
  featured?: boolean;
}) {
  const categoryStyle = getCategoryStyle(item.category);
  const rating = getRating(item);

  return (
    <Link
      href={`/jajan-yuk/${item.slug || item.id}`}
      className={`group block overflow-hidden rounded-[1.35rem] border border-[#eadfd5] bg-[#fffdfa] shadow-[0_10px_28px_rgba(102,50,18,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_16px_34px_rgba(102,50,18,0.12)] ${
        featured ? "min-w-[274px] sm:min-w-[306px]" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? "h-44" : "h-40 sm:h-44"}`}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#f9dfc8] text-orange-700">
            <ChefHat className="h-10 w-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#32170d]/75 via-transparent to-[#32170d]/5" />
        <span
          className="absolute left-0 top-3 rounded-r-lg px-3 py-1 text-[10px] font-black text-white"
          style={{ background: categoryStyle.color }}
        >
          {item.category}
        </span>
        {rating != null && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#fffdfa]/95 px-2.5 py-1 text-[10px] font-black text-[#9a5d18] shadow-sm">
            <Star className="h-3 w-3 fill-[#f5b33f] text-[#f5b33f]" />
            {formatRating(Number(rating))}
          </span>
        )}
        {item.featured && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#fffdfa]/95 px-2.5 py-1 text-[9px] font-black text-orange-700 shadow-sm">
            <Sparkles className="h-3 w-3" />
            Pilihan Nempo
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-[15px] font-black tracking-[-0.02em] text-[#2e211b] transition-colors group-hover:text-orange-700">
            {item.name}
          </h3>
          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#d8c7bb] transition-transform group-hover:translate-x-0.5 group-hover:text-orange-500" />
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#8c7a6d]">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
          <span className="line-clamp-1">{item.location || "Lokasi belum ditambahkan"}</span>
        </div>
        <p className="mt-2 line-clamp-2 min-h-8 text-xs leading-relaxed text-[#806f63]">
          {item.description || "Temukan rasa lokal pilihan bersama Nempo Organizer."}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[#f0e6de] pt-3 text-[10px] font-bold text-[#8c7a6d]">
          {item.price_range && <span>{item.price_range}</span>}
          {item.hours && (
            <span className="inline-flex min-w-0 items-center gap-1">
              <Clock3 className="h-3 w-3 shrink-0 text-[#bf8a5a]" />
              <span className="truncate">{item.hours}</span>
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[10px] font-semibold text-[#a08e82]">Detail tempat & cara pesan</span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-orange-500 px-2.5 py-1.5 text-[10px] font-black text-white shadow-sm shadow-orange-200 transition group-hover:bg-orange-600">
            Lihat & pesan
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function MerchantSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-[1.35rem] border border-[#eadfd5] bg-[#fffdfa] ${
        featured ? "min-w-[274px] sm:min-w-[306px]" : ""
      }`}
      aria-hidden="true"
    >
      <div className="h-40 animate-pulse bg-[#f3e9e0] sm:h-44" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-[#f3e9e0]" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-[#f3e9e0]" />
        <div className="h-8 animate-pulse rounded-xl bg-[#f3e9e0]" />
        <div className="h-3 w-full animate-pulse rounded-full bg-[#f3e9e0]" />
      </div>
    </div>
  );
}

export default function JajanYukPage() {
  const [items, setItems] = useState<JajanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const { matchesCity, selectedCity } = useCityFilter();

  const loadItems = useCallback(() => {
    setLoading(true);
    setError(false);
    import("../lib/apicache")
      .then(({ cachedFetch }) => cachedFetch<JajanItem[]>("/api/kuliner"))
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {
        setItems([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const cityItems = useMemo(
    () => items.filter((item) => matchesCity(item.location, "Garut")),
    [items, matchesCity],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return cityItems.filter((item) => {
      const categoryMatches =
        activeCategory === "Semua" ||
        normalizeCategory(item.category) === normalizeCategory(activeCategory);
      const searchMatches =
        !query ||
        [item.name, item.location, item.category, item.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      return categoryMatches && searchMatches;
    });
  }, [activeCategory, cityItems, search]);

  const featuredItems = useMemo(
    () => cityItems.filter((item) => item.featured).slice(0, 8),
    [cityItems],
  );
  const categoryCount = new Set(cityItems.map((item) => item.category)).size;
  const isBrowsing = !search.trim() && activeCategory === "Semua";

  return (
    <Layout>
      <SEO
        title={`Jajan YUK ${selectedCity} — Cari Kuliner Lokal`}
        description={`Cari makanan, jajanan, minuman, dessert, dan oleh-oleh lokal terbaik di ${selectedCity}. Jelajahi tempat makan pilihan bersama Jajan YUK Nempo Organizer.`}
        keywords={`jajan ${selectedCity.toLowerCase()}, kuliner lokal, makanan khas, jajanan ${selectedCity.toLowerCase()}, oleh-oleh`}
        path="/jajan-yuk"
      />

      <section className="relative overflow-hidden border-b border-[#eadfd5] bg-[#fff8f0]">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#f6c08b]/35 blur-3xl" />
        <div className="absolute -bottom-40 left-[-5rem] h-80 w-80 rounded-full bg-[#f8e2c8]/75 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 pb-7 pt-5 sm:px-6 sm:pb-10 sm:pt-8 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-orange-700">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm shadow-orange-200">
                <ChefHat className="h-3.5 w-3.5" />
              </span>
              Jajan YUK
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead4c1] bg-[#fffdfa]/80 px-3 py-1.5 text-[11px] font-bold text-[#765f51]">
              <MapPin className="h-3.5 w-3.5 text-orange-500" />
              {selectedCity}
            </div>
          </div>

          <div className="mt-7 grid items-end gap-7 lg:grid-cols-[1fr_0.72fr]">
            <div>
              <h1 className="max-w-2xl text-[2.7rem] font-black leading-[0.98] tracking-[-0.065em] text-[#2e211b] sm:text-6xl">
                Lagi cari yang{" "}
                <span className="text-orange-500">enak?</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#806f63] sm:text-base">
                Temukan tempat makan lokal di {selectedCity}, cek detailnya, lalu
                kirim permintaan pesanan langsung ke merchant pilihanmu.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-bold text-[#725d50]">
                <div className="rounded-xl border border-[#eadfd5] bg-[#fffdfa] px-3 py-2 shadow-sm">
                  <span className="mr-1 text-base font-black text-orange-500">
                    {loading ? "…" : cityItems.length}
                  </span>
                  tempat terdaftar
                </div>
                <div className="rounded-xl border border-[#eadfd5] bg-[#fffdfa] px-3 py-2 shadow-sm">
                  <span className="mr-1 text-base font-black text-orange-500">
                    {loading ? "…" : categoryCount}
                  </span>
                  kategori rasa
                </div>
              </div>
            </div>

            <div className="relative hidden min-h-[206px] overflow-hidden rounded-[1.75rem] bg-[#b84a1c] p-6 shadow-[0_18px_40px_rgba(143,57,19,0.18)] sm:block">
              <div className="absolute -right-7 -top-8 h-32 w-32 rounded-full border-[16px] border-[#ffd7a8]/30" />
              <div className="absolute -bottom-16 left-20 h-40 w-40 rounded-full border-[20px] border-[#7f2c16]/25" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#fff3e5]/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#ffe8ce]">
                    <Sparkles className="h-3 w-3" />
                    Pilihan lokal
                  </span>
                  <UtensilsCrossed className="h-7 w-7 text-[#ffd7a8]" />
                </div>
                <div>
                  <p className="text-2xl font-black tracking-tight text-[#fff8f0]">
                    Rasa Garut, dekat di hati.
                  </p>
                  <p className="mt-1 max-w-xs text-xs leading-relaxed text-[#ffe1c4]">
                    Pilih tempatnya. Baca infonya. Pesan dengan tenang.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-[#ead4c1] bg-[#fffdfa] p-1.5 shadow-[0_12px_30px_rgba(102,50,18,0.08)] focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100">
            <div className="flex items-center gap-2">
              <Search className="ml-3 h-4 w-4 shrink-0 text-orange-500" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari tempat, makanan, atau lokasi"
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm font-medium text-[#3c2b22] outline-none placeholder:text-[#aa988c]"
                aria-label="Cari tempat jajan"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Hapus pencarian"
                  className="rounded-full p-1.5 text-[#aa988c] hover:bg-orange-50 hover:text-orange-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <span className="hidden rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black text-white sm:inline-flex">
                Cari
              </span>
            </div>
          </div>

          <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.map(({ label, icon: Icon }) => {
              const active = activeCategory === label;
              const count =
                label === "Semua"
                  ? cityItems.length
                  : cityItems.filter(
                      (item) =>
                        normalizeCategory(item.category) === normalizeCategory(label),
                    ).length;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveCategory(label)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-black transition active:scale-95 ${
                    active
                      ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-200"
                      : "border-[#eadfd5] bg-[#fffdfa] text-[#725d50] hover:border-orange-300 hover:text-orange-700"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  {!loading && <span className={active ? "text-orange-100" : "text-[#b7a398]"}>{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-10 px-4 pb-24 pt-7 sm:px-6 lg:px-8 lg:pb-12">
        {isBrowsing && (loading || featuredItems.length > 0) && (
          <section aria-labelledby="featured-heading">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
                  Biar cepat pilihnya
                </p>
                <h2 id="featured-heading" className="mt-1 text-xl font-black tracking-tight text-[#2e211b]">
                  Pilihan Nempo hari ini
                </h2>
                <p className="mt-1 text-xs text-[#9b887b]">
                  Merchant lokal yang sedang kami sorot untukmu.
                </p>
              </div>
              <span className="hidden items-center gap-1 text-xs font-bold text-orange-600 sm:inline-flex">
                <Sparkles className="h-3.5 w-3.5" />
                Jelajah rasa
              </span>
            </div>
             <div className="touch-card-row scrollbar-hide flex gap-4 overflow-x-auto pb-3">
              {loading
                ? [1, 2, 3].map((value) => <MerchantSkeleton key={value} featured />)
                : featuredItems.map((item) => (
                    <MerchantCard key={item.id} item={item} featured />
                  ))}
            </div>
          </section>
        )}

        <section aria-labelledby="merchant-list-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#a08e82]">
                {activeCategory === "Semua" ? "Jelajahi sekitar" : "Kategori pilihanmu"}
              </p>
              <h2 id="merchant-list-heading" className="mt-1 text-xl font-black tracking-tight text-[#2e211b]">
                {activeCategory === "Semua"
                  ? `Semua jajan di ${selectedCity}`
                  : activeCategory}
              </h2>
            </div>
            {!loading && !error && <span className="text-xs font-bold text-[#a08e82]">{filteredItems.length} tempat</span>}
          </div>

          {loading ? (
             <div className="mobile-card-slider sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((value) => <MerchantSkeleton key={value} />)}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-dashed border-[#e4b99c] bg-[#fff6ed] px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe5cc] text-orange-600">
                <Search className="h-5 w-5" />
              </div>
              <p className="mt-4 font-black text-[#4a3021]">Data jajan belum bisa dimuat</p>
              <p className="mt-1 text-xs text-[#94776a]">Coba lagi sebentar. Kami akan mengambil daftar merchant terbaru.</p>
              <button
                type="button"
                onClick={loadItems}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-orange-200 hover:bg-orange-600"
              >
                <ArrowRight className="h-3.5 w-3.5 -rotate-45" />
                Coba lagi
              </button>
            </div>
          ) : items.length === 0 ? (
            <SedangDipersiapkan
              icon={ChefHat}
              iconGradient="linear-gradient(135deg, #f97316 0%, #c2410c 100%)"
              dotColor1="#f97316"
              dotColor2="#fbbf24"
              title="Jajan YUK"
              titleHighlight="Segera Hadir"
              description="Tempat jajan lokal sedang kami kurasi untukmu. Pantau terus dan siap-siap menemukan rasa baru!"
              btn1Label="Jelajahi Wisata"
              btn1Href="/wisata"
              btn2Label="Lihat Kuliner"
              btn2Href="/kuliner"
            />
          ) : cityItems.length === 0 ? (
            <CityUnavailable accent="#f97316" category="Jajan" />
          ) : filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#e4b99c] bg-[#fff8f0] px-6 py-16 text-center">
              <Search className="mx-auto h-10 w-10 text-[#efbd91]" />
              <p className="mt-4 font-black text-[#4a3021]">Jajan yang kamu cari belum ketemu</p>
              <p className="mt-1 text-xs text-[#94776a]">Coba kata kunci atau kategori lain.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("Semua");
                }}
                className="mt-5 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-orange-200 hover:bg-orange-600"
              >
                Tampilkan semua
              </button>
            </div>
          ) : (
             <div className="mobile-card-slider sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <MerchantCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className="relative overflow-hidden rounded-[1.75rem] bg-[#3e2117] p-5 text-[#fff8f0] shadow-[0_18px_42px_rgba(102,50,18,0.16)] sm:p-7">
          <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full border-[20px] border-orange-300/10" />
          <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-400/20 text-orange-200">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-black">Punya tempat jajan favorit?</p>
                <p className="mt-1 max-w-lg text-xs leading-relaxed text-[#e8cdb8]">
                  Bantu lebih banyak orang menemukan kuliner lokal. Daftarkan tempat makanmu di Nempo Organizer.
                </p>
              </div>
            </div>
            <a
              href="https://ig.me/m/nempo.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#fff8f0] px-4 py-3 text-xs font-black text-[#a33c16] shadow-lg transition hover:-translate-y-0.5"
            >
              Daftarkan sekarang
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        <div className="flex items-center justify-center gap-2 text-center text-[11px] font-medium text-[#a08e82]">
          <Check className="h-3.5 w-3.5 text-orange-500" />
          Informasi merchant ditampilkan dari data kuliner Nempo Organizer
        </div>
      </main>
    </Layout>
  );
}