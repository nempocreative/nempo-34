import { Link } from "@/lib/wouter";
import { useEffect, useMemo, useState } from "react";
import {
  ChefHat,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  ShoppingBag,
  Star,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { PageLoader } from "@/components/page-loader";
import { SEO } from "@/components/seo";
import { CityUnavailable } from "@/components/city-unavailable";
import { useCityFilter } from "@/contexts/city-filter-context";

type WarungItem = {
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
};

const categories = [
  { label: "Semua", icon: UtensilsCrossed },
  { label: "Makanan Berat", icon: ChefHat },
  { label: "Snack", icon: ShoppingBag },
  { label: "Minuman", icon: UtensilsCrossed },
  { label: "Oleh-oleh", icon: ShoppingBag },
];

const categoryColors: Record<string, { text: string; background: string }> = {
  "Makanan Berat": { text: "#b45309", background: "#fef3c7" },
  Snack: { text: "#475569", background: "#f1f5f9" },
  Minuman: { text: "#0369a1", background: "#e0f2fe" },
  Dessert: { text: "#be185d", background: "#fce7f3" },
  "Oleh-oleh": { text: "#0f766e", background: "#ccfbf1" },
  "Makanan Ringan": { text: "#15803d", background: "#dcfce7" },
  "Street Food": { text: "#c2410c", background: "#ffedd5" },
};

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s*-\s*/g, "-");
}

function getCategoryColor(category: string) {
  const direct = categoryColors[category];
  if (direct) return direct;
  const key = Object.keys(categoryColors).find((item) => normalize(item) === normalize(category));
  return (key && categoryColors[key]) || { text: "#b45309", background: "#fef3c7" };
}

function getRating(item: WarungItem) {
  const rating = Number(item.rating);
  if (Number.isFinite(rating) && rating > 0) return rating;
  return item.computed_rating;
}

function formatRating(rating: number) {
  return rating.toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function WarungCard({ item }: { item: WarungItem }) {
  const categoryColor = getCategoryColor(item.category);
  const rating = getRating(item);

  return (
    <Link
      href={`/kuliner/${item.slug || item.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#eadfd5] bg-[#fffdfa] shadow-[0_10px_28px_rgba(102,50,18,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_16px_34px_rgba(102,50,18,0.12)]"
    >
      <div className="relative h-44 overflow-hidden bg-[#f7dfbd]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#f8e5c7] to-[#e8b77b] text-amber-800">
            <ChefHat className="h-12 w-12 opacity-70" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#32170d]/70 via-transparent to-[#32170d]/5" />
        <span
          className="absolute left-0 top-3 rounded-r-lg px-3 py-1 text-[10px] font-black"
          style={{ color: categoryColor.text, background: categoryColor.background }}
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
          <span className="absolute bottom-3 left-3 rounded-full bg-[#fffdfa]/95 px-2.5 py-1 text-[9px] font-black text-amber-800 shadow-sm">
            Pilihan Nempo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-[15px] font-black tracking-[-0.02em] text-[#2e211b] transition-colors group-hover:text-amber-700">
            {item.name}
          </h2>
          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#d8c7bb] transition-transform group-hover:translate-x-0.5 group-hover:text-amber-500" />
        </div>
        <div className="mt-2 flex items-start gap-1.5 text-[11px] font-medium text-[#8c7a6d]">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span className="line-clamp-1">{item.location || "Lokasi belum ditambahkan"}</span>
        </div>
        <p className="mt-2 line-clamp-2 min-h-8 text-xs leading-relaxed text-[#806f63]">
          {item.description || "Temukan rasa lokal pilihan bersama Nempo Organizer."}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[#f0e6de] pt-3 text-[10px] font-bold text-[#8c7a6d]">
          {item.price_range && <span>{item.price_range}</span>}
          {item.hours && (
            <span className="inline-flex min-w-0 items-center gap-1">
              <Clock3 className="h-3 w-3 shrink-0 text-[#bf8a5a]" />
              <span className="truncate">{item.hours}</span>
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[10px] font-semibold text-[#a08e82]">Detail tempat</span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1.5 text-[10px] font-black text-white shadow-sm shadow-amber-200 transition group-hover:bg-amber-700">
            Lihat warung
            <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function WarungPage() {
  const [items, setItems] = useState<WarungItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const { matchesCity, selectedCity } = useCityFilter();

  useEffect(() => {
    import("../lib/apicache")
      .then(({ cachedFetch }) => cachedFetch<WarungItem[]>("/api/kuliner"))
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const cityItems = useMemo(
    () => items.filter((item) => matchesCity(item.location, "Garut")),
    [items, matchesCity],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return cityItems.filter((item) => {
      const matchesCategory =
        activeCategory === "Semua" || normalize(item.category) === normalize(activeCategory);
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, cityItems, search]);

  const featuredItems = cityItems.filter((item) => item.featured).slice(0, 3);

  return (
    <Layout>
      <SEO
        title={`Warung Lokal ${selectedCity} — Rasa Dekat, Cerita Hangat`}
        description={`Temukan warung lokal, makanan rumahan, jajanan, dan oleh-oleh pilihan di ${selectedCity}.`}
        keywords={`warung ${selectedCity.toLowerCase()}, makanan lokal ${selectedCity.toLowerCase()}, jajanan ${selectedCity.toLowerCase()}`}
        path="/warung"
      />

      <section className="overflow-hidden border-b border-amber-100 bg-gradient-to-br from-[#fffaf2] via-[#fff7ed] to-[#fef3c7]">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-10">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">
                <ChefHat className="h-3.5 w-3.5" />
                Warung lokal
              </span>
              <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[0.98] tracking-[-0.05em] text-[#3a2417] sm:text-5xl">
                Rasa dekat,
                <br />
                <span className="text-amber-600">cerita hangat.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#806f63] sm:text-base">
                Dari nasi hangat sampai jajanan sore, temukan tempat makan lokal yang
                dekat dengan perjalananmu di {selectedCity}.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold text-amber-900">
                <span className="rounded-full bg-white/80 px-3 py-2 shadow-sm">Menu lokal</span>
                <span className="rounded-full bg-white/80 px-3 py-2 shadow-sm">Harga bersahabat</span>
                <span className="rounded-full bg-white/80 px-3 py-2 shadow-sm">Cerita warga</span>
              </div>
            </div>
            <div className="hidden justify-self-end lg:block">
              <div className="relative flex h-48 w-64 items-end justify-center overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-[#f6c56f] to-[#b45309] shadow-[0_22px_50px_rgba(146,64,14,0.18)]">
                <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/20" />
                <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[#7c2d12]/20" />
                <ChefHat className="relative mb-8 h-20 w-20 text-white/90" strokeWidth={1.2} />
                <span className="absolute bottom-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-amber-800">
                  Jelajah rasa lokal
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex max-w-3xl items-center rounded-2xl border border-amber-100 bg-white p-1.5 shadow-[0_12px_30px_rgba(146,64,14,0.08)]">
            <Search className="ml-3 h-4 w-4 shrink-0 text-amber-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari warung, makanan, atau lokasi…"
              aria-label="Cari warung"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Hapus pencarian"
                className="mr-1 rounded-full p-1.5 text-gray-400 transition hover:bg-amber-50 hover:text-amber-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <span className="hidden rounded-xl bg-amber-600 px-3 py-2 text-[11px] font-black text-white sm:block">
              {loading ? "Memuat…" : `${filteredItems.length} pilihan`}
            </span>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map(({ label, icon: Icon }) => {
              const active = activeCategory === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveCategory(label)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold transition ${
                    active
                      ? "border-amber-600 bg-amber-600 text-white shadow-sm"
                      : "border-amber-100 bg-white/80 text-[#806f63] hover:border-amber-300 hover:text-amber-700"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-24 pt-8 sm:px-6 md:pb-10 lg:px-8">
        {!search && activeCategory === "Semua" && featuredItems.length > 0 && (
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-600">
                  Pilihan Nempo
                </p>
                <h2 className="mt-1 text-xl font-black tracking-tight text-[#2e211b]">
                  Warung yang layak disinggahi
                </h2>
              </div>
              <span className="hidden text-xs font-semibold text-[#a08e82] sm:block">
                {featuredItems.length} pilihan lokal
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {featuredItems.map((item) => (
                <WarungCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#a08e82]">
                {selectedCity}
              </p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-[#2e211b]">
                {activeCategory === "Semua" ? "Semua warung pilihan" : activeCategory}
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#a08e82]">
              {loading ? "Memuat…" : `${filteredItems.length} tempat`}
            </span>
          </div>

          {loading ? (
            <PageLoader text="Memuat warung lokal…" />
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-amber-100 bg-[#fffaf2] p-8 text-center">
              <ChefHat className="mx-auto h-10 w-10 text-amber-400" />
              <h3 className="mt-3 text-lg font-black text-[#3a2417]">Warung sedang dikurasi</h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-[#806f63]">
                Rekomendasi warung lokal sedang kami siapkan. Sementara itu, jelajahi pilihan wisata dan event di Nempo.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <Link href="/wisata" className="rounded-xl bg-[#0194f3] px-4 py-2 text-xs font-black text-white">
                  Jelajahi wisata
                </Link>
                <Link href="/event" className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-xs font-black text-amber-800">
                  Lihat event
                </Link>
              </div>
            </div>
          ) : cityItems.length === 0 ? (
            <CityUnavailable accent="#b45309" category="Warung" />
          ) : filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-amber-200 bg-[#fffaf2] px-6 py-16 text-center">
              <Search className="mx-auto h-9 w-9 text-amber-300" />
              <p className="mt-3 font-bold text-[#806f63]">Warung tidak ditemukan</p>
              <p className="mt-1 text-xs text-[#a08e82]">Coba kata kunci atau kategori lain.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <WarungCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}