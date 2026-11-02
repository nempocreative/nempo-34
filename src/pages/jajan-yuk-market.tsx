import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/wouter";
import {
  ArrowRight,
  Check,
  ChefHat,
  ChevronRight,
  Flame,
  MapPin,
  SlidersHorizontal,
  Search,
  Utensils,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { CityUnavailable } from "@/components/city-unavailable";
import { useCityFilter } from "@/contexts/city-filter-context";
import streetFoodBannerImage from "@/assets/generated_images/jajan-yuk-street-food-banner.png";

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
  menu_count: number;
  min_price: number;
}

const subcategoriesByGroup: Record<string, string[]> = {
  "Jajanan & Street Food": [
    "Bakso",
    "Bakso Aci",
    "Baso Cuanki",
    "Cilok",
    "Cilor",
    "Cimol",
    "Cireng",
    "Cipak Koceak",
    "Pentol",
    "Telur Gulung",
    "Sosis Bakar",
    "Bakso Bakar",
    "Otak-Otak",
    "Tempura",
    "Corndog",
    "Kentang Goreng",
    "Tahu Crispy",
    "Tahu Gejrot",
    "Tahu Bulat",
    "Batagor",
    "Siomay",
    "Pempek",
    "Lumpia Basah",
    "Martabak Mini",
    "Kebab",
  ],
  "Pedas & Berkuah": [
    "Seblak",
    "Seblak Ceker",
    "Seblak Seafood",
    "Seblak Tulang",
    "Mie Jebew",
    "Mie Dower",
    "Mie Nyemek",
    "Pangsit",
    "Ceker Mercon",
    "Baso Mercon",
    "Pentol Mercon",
    "Tulang Mercon",
  ],
  "Gorengan & Cemilan": [
    "Gorengan",
    "Bala-Bala",
    "Gehu",
    "Combro",
    "Misro",
    "Pisang Goreng",
    "Pisang Aroma",
    "Pisang Crispy",
    "Cireng Isi",
    "Makaroni",
    "Basreng",
    "Kerupuk",
    "Keripik",
    "Moring",
    "Emplod",
  ],
  "Makanan Berat Pinggir Jalan": [
    "Nasi Goreng",
    "Mie Goreng",
    "Kwetiau",
    "Nasi Kucing",
    "Nasi Tutug Oncom",
    "Ayam Goreng",
    "Ayam Bakar",
    "Ayam Geprek",
    "Sate",
    "Sate Taichan",
    "Pecel Lele",
    "Karedok",
    "Lotek",
    "Kupat Tahu",
  ],
  "Jajanan Manis & Minuman": [
    "Es Teh",
    "Es Jeruk",
    "Es Campur",
    "Es Buah",
    "Es Cendol",
    "Es Doger",
    "Es Kepal",
    "Cincau",
    "Thai Tea",
    "Milkshake",
    "Donat",
    "Pukis",
    "Kue Cubit",
    "Terang Bulan",
    "Martabak",
    "Dessert",
  ],
  "Kategori Khas Garut": [
    "Baso Aci",
    "Cipak Koceak",
    "Moring",
    "Emplod",
    "Burayot",
    "Dodog/Gemblong",
    "Dorokdok",
    "Simping",
    "Ladu",
    "Ceplak",
  ],
};

const categoryGroups = [
  {
    label: "Jajanan & Street Food",
    art: "street",
    keywords: subcategoriesByGroup["Jajanan & Street Food"],
    legacyCategories: ["Snack", "Street Food"],
  },
  {
    label: "Pedas & Berkuah",
    art: "spicy",
    keywords: subcategoriesByGroup["Pedas & Berkuah"],
    legacyCategories: [],
  },
  {
    label: "Gorengan & Cemilan",
    art: "fried",
    keywords: subcategoriesByGroup["Gorengan & Cemilan"],
    legacyCategories: ["Snack", "Makanan Ringan"],
  },
  {
    label: "Makanan Berat Pinggir Jalan",
    art: "heavy",
    keywords: subcategoriesByGroup["Makanan Berat Pinggir Jalan"],
    legacyCategories: ["Makanan Berat"],
  },
  {
    label: "Jajanan Manis & Minuman",
    art: "sweet",
    keywords: subcategoriesByGroup["Jajanan Manis & Minuman"],
    legacyCategories: ["Minuman", "Dessert"],
  },
  {
    label: "Kategori Khas Garut",
    art: "garut",
    keywords: subcategoriesByGroup["Kategori Khas Garut"],
    legacyCategories: [],
  },
];

const subcategoryAliases: Record<string, string[]> = {
  "Baso Aci": ["Baso Aci", "Bakso Aci"],
  "Dodog/Gemblong": ["Dodog", "Gemblong"],
  "Baso Mercon": ["Baso Mercon", "Bakso Mercon"],
};

const categoryIconPalettes: Record<string, { color: string; shadow: string; label: string }> = {
  "Jajanan & Street Food": { color: "#f97316", shadow: "#c2410c", label: "Street food" },
  "Pedas & Berkuah": { color: "#ef4444", shadow: "#991b1b", label: "Pedas & berkuah" },
  "Gorengan & Cemilan": { color: "#16a34a", shadow: "#166534", label: "Gorengan" },
  "Makanan Berat Pinggir Jalan": { color: "#d97706", shadow: "#92400e", label: "Makanan berat" },
  "Jajanan Manis & Minuman": { color: "#ec4899", shadow: "#9d174d", label: "Manis & minuman" },
  "Kategori Khas Garut": { color: "#b45309", shadow: "#78350f", label: "Khas Garut" },
};

const culinarySpots = [
  { label: "Semua spot", keywords: [] },
  { label: "Pasar Ceplak", keywords: ["pasar ceplak"] },
  { label: "Kerkof", keywords: ["kerkof", "kerkhof"] },
  { label: "Simpang Lima", keywords: ["simpang lima"] },
  { label: "Pemda", keywords: ["pemda"] },
  { label: "Pengkolan", keywords: ["pengkolan"] },
  { label: "Alun-Alun Garut", keywords: ["alun-alun", "alun alun"] },
  { label: "KNPI", keywords: ["knpi"] },
  { label: "Sukaregang", keywords: ["sukaregang"] },
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

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getItemSearchText(item: JajanItem) {
  return normalizeSearchText([item.name, item.category, item.description].filter(Boolean).join(" "));
}

function matchesSubcategory(item: JajanItem, subcategory: string) {
  const itemText = ` ${getItemSearchText(item)} `;
  const terms = subcategoryAliases[subcategory] || [subcategory];
  return terms.some((term) => itemText.includes(` ${normalizeSearchText(term)} `));
}

function matchesCategoryGroup(
  item: JajanItem,
  group: (typeof categoryGroups)[number],
) {
  const matchesLegacyCategory = group.legacyCategories.some(
    (category) => normalizeCategory(item.category) === normalizeCategory(category),
  );
  return matchesLegacyCategory || group.keywords.some((keyword) => matchesSubcategory(item, keyword));
}

function matchesSpot(location: string, spot: (typeof culinarySpots)[number]) {
  if (spot.keywords.length === 0) return true;
  const normalizedLocation = location.toLowerCase();
  return spot.keywords.some((keyword) => normalizedLocation.includes(keyword));
}

function getCategoryStyle(category: string) {
  const exact = categoryStyles[category];
  if (exact) return exact;
  const key = Object.keys(categoryStyles).find(
    (value) => normalizeCategory(value) === normalizeCategory(category),
  );
  return (key && categoryStyles[key]) || { color: "#c2410c", bg: "#fff1e8" };
}

function getMerchantFallbackImage(item: JajanItem) {
  const searchText = getItemSearchText(item);
  if (/\b(baso|bakso|cuanki|seblak|mie|kuah|ceker)\b/.test(searchText)) {
    return "/images/jajan-yuk-garut-food-banner.jpg";
  }
  if (/\b(cireng|cilok|cilor|gorengan|goreng|snack|cemilan|basreng|moring)\b/.test(searchText)) {
    return "/images/jajan-yuk-market-spots-banner.jpg";
  }
  return "/images/jajan-yuk-merchant-banner.jpg";
}

function formatCount(count: number) {
  return new Intl.NumberFormat("id-ID").format(count);
}

function JajanCategoryIllustration({
  kind,
}: {
  kind: "street" | "spicy" | "fried" | "heavy" | "sweet" | "garut";
}) {
  const stroke = "#6d3925";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 72 72"
      className="h-[62px] w-[62px] drop-shadow-[0_4px_2px_rgba(92,48,24,0.18)] lg:h-[76px] lg:w-[76px]"
    >
      {kind === "street" && (
        <>
          <ellipse cx="36" cy="61" rx="22" ry="5" fill="#d76d28" opacity=".3" />
          <path d="M18 15 30 52M34 11l2 42M50 15 40 52" stroke="#8b4a26" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M18 15 30 52M34 11l2 42M50 15 40 52" stroke="#f8c66b" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="20" cy="21" r="7" fill="#f8e3b7" stroke={stroke} strokeWidth="1.5" />
          <circle cx="23" cy="35" r="7.2" fill="#f29c45" stroke={stroke} strokeWidth="1.5" />
          <circle cx="35" cy="20" r="7" fill="#f6b84f" stroke={stroke} strokeWidth="1.5" />
          <circle cx="37" cy="35" r="7.2" fill="#e86c43" stroke={stroke} strokeWidth="1.5" />
          <circle cx="49" cy="21" r="7" fill="#f5dfae" stroke={stroke} strokeWidth="1.5" />
          <circle cx="48" cy="35" r="7.2" fill="#ef8b52" stroke={stroke} strokeWidth="1.5" />
          <path d="M14 49c5-5 39-5 44 0v6c-6 5-38 5-44 0Z" fill="#fff4dd" stroke={stroke} strokeWidth="1.5" />
          <path d="M18 51c10 4 26 4 36 0" fill="none" stroke="#f2a249" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="19" r="1.7" fill="#fff" opacity=".8" />
          <circle cx="34" cy="18" r="1.7" fill="#fff" opacity=".8" />
        </>
      )}
      {kind === "spicy" && (
        <>
          <path d="M25 16c-3-5 2-8 1-12M39 16c-3-5 2-8 1-12" fill="none" stroke="#f59e72" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M13 32c2 19 12 27 23 27s21-8 23-27Z" fill="#f5c06e" stroke={stroke} strokeWidth="1.8" />
          <ellipse cx="36" cy="31" rx="23" ry="8" fill="#d94b2b" stroke={stroke} strokeWidth="1.8" />
          <ellipse cx="36" cy="31" rx="18" ry="5" fill="#f26b32" />
          <path d="M19 29c4-3 7 4 11 0s7 3 11 0 7 2 11-1" fill="none" stroke="#ffd485" strokeWidth="2" strokeLinecap="round" />
          <path d="M48 20c5-7 12-5 10 2-1 4-5 7-10 8 2-4 2-7 0-10Z" fill="#48a447" stroke={stroke} strokeWidth="1.5" />
          <path d="M51 21c2 2 4 3 6 2" fill="none" stroke="#d9ef9a" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="27" cy="34" r="2" fill="#fff1bd" />
          <circle cx="42" cy="34" r="2" fill="#fff1bd" />
        </>
      )}
      {kind === "fried" && (
        <>
          <ellipse cx="36" cy="58" rx="25" ry="5" fill="#d38b3b" opacity=".25" />
          <path d="M12 43c4-5 44-5 48 0l-4 14c-9 5-31 5-40 0Z" fill="#fff3d9" stroke={stroke} strokeWidth="1.5" />
          <path d="M18 43c5-4 31-4 36 0" fill="none" stroke="#ed9f40" strokeWidth="2" />
          <path d="m19 39 7-17 9 19Z" fill="#e7a04c" stroke={stroke} strokeWidth="1.5" />
          <path d="m31 40 7-20 10 21Z" fill="#f1b25c" stroke={stroke} strokeWidth="1.5" />
          <path d="m42 41 4-15 10 17Z" fill="#dc793b" stroke={stroke} strokeWidth="1.5" />
          <path d="M23 28 28 36M35 28l7 10M48 31l4 8" stroke="#ffd27b" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="17" cy="37" r="4.5" fill="#d95d35" stroke={stroke} strokeWidth="1.4" />
          <circle cx="17" cy="37" r="1.3" fill="#f9bc6a" />
          <path d="M13 16c4-4 9-4 12 0" fill="none" stroke="#f3b56a" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {kind === "heavy" && (
        <>
          <ellipse cx="36" cy="59" rx="26" ry="5" fill="#a96f39" opacity=".26" />
          <ellipse cx="36" cy="46" rx="26" ry="12" fill="#fff2d3" stroke={stroke} strokeWidth="1.8" />
          <ellipse cx="36" cy="43" rx="20" ry="9" fill="#e9b85f" />
          <path d="M19 43c4-8 10-13 16-13 4 0 9 3 14 9-5 5-10 7-15 7-6 0-10-1-15-3Z" fill="#f7f0c5" stroke="#bd762f" strokeWidth="1.2" />
          <ellipse cx="45" cy="39" rx="7" ry="5.3" fill="#fff8dc" stroke="#bd762f" strokeWidth="1.2" />
          <circle cx="45" cy="39" r="2.8" fill="#f6b841" />
          <path d="M15 29c7-6 13-8 20-6M44 22c5 1 9 4 12 9" fill="none" stroke="#68a755" strokeWidth="3" strokeLinecap="round" />
          <path d="M18 24c-2-7 4-10 8-5 2 3 1 6-2 9-1-3-3-4-6-4Z" fill="#62a853" stroke={stroke} strokeWidth="1.2" />
          <path d="M51 21c2-5 8-4 8 1 0 3-3 5-7 6 1-3 1-5-1-7Z" fill="#e66d42" stroke={stroke} strokeWidth="1.2" />
        </>
      )}
      {kind === "sweet" && (
        <>
          <path d="M22 18h28l-3 39H25Z" fill="#f7d4ba" stroke={stroke} strokeWidth="1.6" />
          <path d="M23 25h26" stroke="#fff0d6" strokeWidth="3" opacity=".8" />
          <path d="M24 18c2-4 5-5 7-1 2-5 6-4 7 0 3-4 7-2 8 1Z" fill="#f17894" stroke={stroke} strokeWidth="1.5" />
          <circle cx="29" cy="38" r="2.6" fill="#6c4a3c" />
          <circle cx="39" cy="44" r="2.6" fill="#6c4a3c" />
          <circle cx="46" cy="35" r="2.6" fill="#6c4a3c" />
          <path d="M20 11c5 3 9 4 14 3M50 12c-4 3-7 4-11 3" fill="none" stroke="#e1a049" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M35 8v14" stroke="#8b4a26" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M18 59h34" stroke="#8b4a26" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {kind === "garut" && (
        <>
          <ellipse cx="36" cy="60" rx="25" ry="5" fill="#9d6c36" opacity=".28" />
          <path d="M13 39c4-6 42-6 46 0v14c-7 7-39 7-46 0Z" fill="#d79b4d" stroke={stroke} strokeWidth="1.8" />
          <path d="M14 42c12 5 32 5 44 0M15 49c11 4 31 4 42 0M18 56c8 2 27 2 36-1" fill="none" stroke="#f2c976" strokeWidth="1.6" />
          <path d="M12 39c6-7 42-7 48 0-6 7-42 7-48 0Z" fill="#edbd67" stroke={stroke} strokeWidth="1.8" />
          <path d="M22 37c0-8 8-12 14-7 5-5 14-1 13 7Z" fill="#d98238" stroke={stroke} strokeWidth="1.5" />
          <path d="M27 35c3-5 7-5 10 0M38 35c2-4 5-4 7 0" fill="none" stroke="#f5cf7a" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M19 27c-3-6 3-10 7-5 2 3 1 6-2 8-1-3-3-4-5-3ZM51 27c3-6-3-10-7-5-2 3-1 6 2 8 1-3 3-4 5-3Z" fill="#67a354" stroke={stroke} strokeWidth="1.3" />
        </>
      )}
    </svg>
  );
}

function MerchantImage({
  item,
  className = "",
}: {
  item: JajanItem;
  className?: string;
}) {
  const fallbackImage = getMerchantFallbackImage(item);
  const [usingFallback, setUsingFallback] = useState(!item.image);
  const [fallbackUnavailable, setFallbackUnavailable] = useState(false);

  if (fallbackUnavailable) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#fed7aa,#f97316_58%,#c2410c)] text-white ${className}`}
      >
        <UtensilsCrossed className="h-10 w-10 opacity-70" />
      </div>
    );
  }

  return (
    <img
      src={usingFallback ? fallbackImage : item.image!}
      alt={`Foto ${item.name}`}
      loading="lazy"
      onError={() => {
        if (usingFallback) setFallbackUnavailable(true);
        else setUsingFallback(true);
      }}
      className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${className}`}
    />
  );
}

function MerchantCard({
  item,
}: {
  item: JajanItem;
}) {
  const categoryStyle = getCategoryStyle(item.category);

  return (
    <article className="group flex gap-3 overflow-hidden rounded-[1.35rem] border border-[#eadfd5] bg-white p-2.5 shadow-[0_8px_22px_rgba(74,46,29,0.07)] transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_14px_28px_rgba(74,46,29,0.11)] xl:flex-col xl:gap-0 xl:p-2">
      <Link href={`/jajan-yuk/menu/${item.slug || item.id}`} className="block shrink-0 xl:w-full">
        <div className="relative h-[7rem] w-[6.75rem] overflow-hidden rounded-[1rem] bg-[#f7e9de] sm:h-32 sm:w-32 xl:h-44 xl:w-full xl:rounded-[1.15rem]">
          <MerchantImage item={item} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />
          <span
            className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-md px-2 py-1 text-[9px] font-black text-white shadow-sm"
            style={{ backgroundColor: categoryStyle.color }}
          >
            {item.category}
          </span>
          {item.featured && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[8px] font-black text-orange-700 shadow-sm">
              <Flame className="h-2.5 w-2.5 fill-orange-500 text-orange-500" />
              Pilihan
            </span>
          )}
          <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[8px] font-black uppercase tracking-wide text-orange-700 shadow-sm">
            Tersedia
          </span>
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col px-0 sm:px-1 xl:px-3 xl:py-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/jajan-yuk/menu/${item.slug || item.id}`} className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-black leading-tight tracking-[-0.02em] text-[#2e211b] transition-colors group-hover:text-orange-700 sm:text-base">
              {item.name}
            </h3>
          </Link>
        </div>
        <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-[#8c7a6d]">
          <span className="truncate">
            {item.min_price > 0
              ? `Mulai ${formatRupiah(item.min_price)}`
              : "Harga belum tersedia"}
          </span>
        </div>
        <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-[#8c7a6d]">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
          <span className="truncate">{item.location || "Lokasi belum ditambahkan"}</span>
        </div>
        <div className="mt-3 flex items-center gap-2 xl:mt-auto xl:pt-3">
          <Link
            href={`/jajan-yuk/menu/${item.slug || item.id}`}
            className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#ee7a26] px-3 py-2 text-[10px] font-black text-white shadow-[0_4px_10px_rgba(238,122,38,0.2)] transition hover:bg-[#d96816] sm:text-[11px]"
          >
            <Utensils className="h-3.5 w-3.5" />
            Pilih menu
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function JajanYukMarketPage() {
  const [items, setItems] = useState<JajanItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [subcategorySearch, setSubcategorySearch] = useState("");
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);
  const [activeSpot, setActiveSpot] = useState("Semua spot");
  const [search, setSearch] = useState("");
  const { matchesCity, selectedCity } = useCityFilter();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/jajan-yuk/merchants")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "Gagal memuat merchant.");
        }
        return payload as JajanItem[];
      })
      .then((result) => {
        if (!cancelled) setItems(result);
      })
      .catch((error: Error) => {
        if (!cancelled) setItemsError(error.message);
      })
      .finally(() => {
        if (!cancelled) setItemsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cityItems = useMemo(
    () => items.filter((item) => matchesCity(item.location, "Garut")),
    [items, matchesCity],
  );

  const activeGroup = categoryGroups.find((group) => group.label === activeCategory);
  const filteredSubcategories = (activeGroup?.keywords || []).filter((subcategory) =>
    normalizeSearchText(subcategory).includes(normalizeSearchText(subcategorySearch)),
  );
  const visibleSubcategories =
    showAllSubcategories || subcategorySearch.trim()
      ? filteredSubcategories
      : filteredSubcategories.slice(0, 8);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const selectedSpot =
      culinarySpots.find((spot) => spot.label === activeSpot) || culinarySpots[0];
    return cityItems.filter((item) => {
      const categoryMatches =
        activeCategory === "Semua" ||
        (activeGroup ? matchesCategoryGroup(item, activeGroup) : false);
      const subcategoryMatches =
        !activeSubcategory || matchesSubcategory(item, activeSubcategory);
      const spotMatches = matchesSpot(item.location, selectedSpot);
      const searchMatches =
        !query ||
        [item.name, item.location, item.category, item.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      return categoryMatches && subcategoryMatches && spotMatches && searchMatches;
    });
  }, [activeCategory, activeGroup, activeSpot, activeSubcategory, cityItems, search]);

  const displayItems = filteredItems;

  const recommendedItems = useMemo(() => {
    const featured = cityItems.filter((item) => item.featured);
    return (featured.length > 0 ? featured : cityItems).slice(0, 5);
  }, [cityItems]);
  const availableSpotCount = culinarySpots.filter(
    (spot) =>
      spot.keywords.length > 0 &&
      items.some((merchant) => matchesSpot(merchant.location, spot)),
  ).length;

  return (
    <Layout>
      <SEO
        title={`Jajan YUK ${selectedCity} — Pesan Kuliner Lokal`}
        description={`Pilih merchant Jajan YUK di ${selectedCity}, pesan menu yang tersedia, dan lacak status pengantarannya.`}
        keywords={`jajan ${selectedCity.toLowerCase()}, kuliner lokal, pesan makanan, jajanan ${selectedCity.toLowerCase()}`}
        path="/jajan-yuk"
      />

      <div className="min-h-[calc(100dvh-4rem)] bg-[#f8f7f5]">
        <section className="overflow-hidden border-b border-[#f0e6dd] bg-[#fffaf5]">
          <div className="mx-auto max-w-7xl px-4 pb-5 pt-5 sm:px-6 sm:pb-7 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm shadow-orange-200">
                  <ChefHat className="h-4.5 w-4.5" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-orange-600">Jajan YUK</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-[#eadfd5] bg-[#fffaf5] px-3 py-2 text-[11px] font-black text-[#6f594b]">
                <MapPin className="h-3.5 w-3.5 text-orange-500" />
                {selectedCity}
                <ChevronRight className="h-3.5 w-3.5 text-[#b9a79b]" />
              </div>
            </div>
            <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_0.75fr] lg:mt-6 lg:grid-cols-[1fr_0.55fr]">
              <div className="relative z-10 py-1">
                <h1 className="max-w-xl text-[2.5rem] font-black leading-[0.94] tracking-[-0.07em] text-[#2e211b] sm:text-5xl">
                  Lagi pengen
                  <br />
                  <span className="text-orange-500">jajan?</span>
                </h1>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#806f63]">
                  Pilih merchant dan menu favoritmu.
                </p>
              </div>
              <div className="relative h-36 overflow-hidden rounded-[1.5rem] bg-[#3c2118] shadow-[0_16px_30px_rgba(102,50,18,0.16)] lg:h-40">
                <img
                  src={streetFoodBannerImage}
                  alt="Ilustrasi orang-orang menikmati jajanan di kaki lima"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2e170f]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 max-w-[75%] text-white">
                  <p className="line-clamp-1 text-sm font-black">Jajanan kaki lima</p>
                </div>
                <div className="absolute -right-7 -top-8 h-24 w-24 rounded-full border-[14px] border-orange-300/20" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#e9e2dc] bg-white p-1.5 shadow-sm focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100">
              <Search className="ml-3 h-4 w-4 shrink-0 text-orange-500" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari makanan, merchant, atau area"
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm font-medium text-[#3c2b22] outline-none placeholder:text-[#aa988c]"
                aria-label="Cari makanan, merchant, atau area"
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

            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("Semua");
                  setActiveSubcategory(null);
                  setSubcategorySearch("");
                  setShowAllSubcategories(false);
                  setActiveSpot("Semua spot");
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] font-black transition ${
                  activeCategory === "Semua" && activeSpot === "Semua spot"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-[#e9e2dc] bg-white text-[#806f63] hover:border-orange-300"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Semua merchant
              </button>
              {search && (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-orange-500 px-3.5 py-2 text-[11px] font-black text-white">
                  <Search className="h-3.5 w-3.5" />
                  Hasil pencarian
                </span>
              )}
            </div>

          </div>
        </section>

        <main className="mx-auto max-w-7xl space-y-8 px-4 pb-8 pt-5 sm:px-6 sm:pb-10 lg:px-8 lg:pb-14">
          <section aria-labelledby="jajan-category-heading">
            <style>{`
              @keyframes jajanCategoryFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
              }
              @keyframes jajanCategoryBounce {
                0%, 100% { transform: scale(1) translateY(0); }
                30% { transform: scale(1.12) translateY(-4px); }
                60% { transform: scale(1.06) translateY(-2px); }
              }
              .jajan-category-icon { animation: jajanCategoryFloat 3.5s ease-in-out infinite; }
              .jajan-category-button:hover .jajan-category-icon {
                animation: jajanCategoryBounce 0.4s ease-in-out forwards;
              }
              @media (prefers-reduced-motion: reduce) {
                .jajan-category-icon, .jajan-category-button:hover .jajan-category-icon {
                  animation: none;
                }
              }
            `}</style>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-600">
                  {selectedCity}
                </p>
                <h2 id="jajan-category-heading" className="mt-1 text-xl font-black tracking-tight text-[#2e211b]">
                  Pilih kategori
                </h2>
              </div>
              <span className="rounded-full bg-[#fff0e2] px-3 py-1.5 text-[10px] font-black text-[#a84c19]">
                {categoryGroups.length} kategori
              </span>
            </div>
              <div className="grid grid-cols-3 items-stretch gap-2 sm:grid-cols-6 sm:gap-3">
               {categoryGroups.map(({ label, art }, index) => {
                const active = activeCategory === label;
                const isGarutSpecialty = label === "Kategori Khas Garut";
                const palette = categoryIconPalettes[label];
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setActiveCategory(label);
                      setActiveSubcategory(null);
                      setSubcategorySearch("");
                      setShowAllSubcategories(false);
                    }}
                      className={`jajan-category-button group relative flex min-w-0 flex-col items-center gap-2 rounded-[1.15rem] border border-transparent px-2 py-3 text-center transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 active:scale-95 ${
                        active
                          ? "border-orange-300 bg-[#fff2e5] shadow-[0_6px_18px_rgba(238,122,38,0.12)]"
                          : "hover:bg-orange-50/60"
                      }`}
                  >
                    <span
                        className={`jajan-category-icon relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[19px] transition-shadow ${
                        active
                          ? "ring-2 ring-orange-500 ring-offset-2"
                          : isGarutSpecialty
                            ? "ring-2 ring-amber-300 ring-offset-2"
                            : ""
                      }`}
                       style={{ background: `linear-gradient(160deg, color-mix(in srgb, ${palette.color} 20%, white), color-mix(in srgb, ${palette.color} 6%, white))`, animationDelay: `${index * 0.15}s` }}
                    >
                       <span className="pointer-events-none absolute inset-0 rounded-[22px] bg-[radial-gradient(ellipse_at_28%_18%,rgba(255,255,255,0.72)_0%,transparent_58%)]" />
                       <JajanCategoryIllustration kind={art as "street" | "spicy" | "fried" | "heavy" | "sweet" | "garut"} />
                    </span>
                    <span
                      className={`w-full text-[10px] font-bold leading-tight ${
                        active
                          ? "text-orange-700"
                          : isGarutSpecialty
                            ? "text-amber-800"
                            : "text-gray-600"
                      }`}
                    >
                       {palette.label}
                    </span>
                     {active && <Check className="absolute right-2 top-2 h-3.5 w-3.5 text-orange-600" />}
                  </button>
                );
              })}
            </div>
          </section>

          {activeGroup && (
            <section
              aria-labelledby="jajan-subcategory-heading"
              className="rounded-2xl border border-[#eadfd5] bg-white p-3.5 shadow-sm sm:p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2
                  id="jajan-subcategory-heading"
                  className="text-base font-black tracking-tight text-[#2e211b]"
                >
                  {activeCategory}
                </h2>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory("Semua");
                      setActiveSubcategory(null);
                      setSubcategorySearch("");
                      setShowAllSubcategories(false);
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[10px] font-black text-orange-800 transition hover:border-orange-400"
                    aria-label={`Hapus filter ${activeCategory}`}
                  >
                    {activeCategory}
                    <X className="h-3 w-3" />
                  </button>
                  {activeSubcategory && (
                    <button
                      type="button"
                      onClick={() => setActiveSubcategory(null)}
                      className="inline-flex items-center gap-1 rounded-full border border-[#e9e2dc] bg-[#faf9f7] px-2.5 py-1 text-[10px] font-black text-[#6f594b] transition hover:border-orange-300"
                      aria-label={`Hapus filter ${activeSubcategory}`}
                    >
                      {activeSubcategory}
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              <label className="mt-4 flex items-center gap-2 rounded-xl border border-[#eee6df] bg-[#faf9f7] px-3 py-2.5 focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100">
                <Search className="h-4 w-4 shrink-0 text-orange-500" />
                <input
                  type="search"
                  value={subcategorySearch}
                  onChange={(event) => setSubcategorySearch(event.target.value)}
                  placeholder="Cari jenis, mis. Cipak Koceak"
                  aria-label={`Cari jenis dalam ${activeCategory}`}
                  className="min-w-0 flex-1 bg-transparent text-xs font-medium text-[#3c2b22] outline-none placeholder:text-[#aa988c]"
                />
                {subcategorySearch && (
                  <button
                    type="button"
                    onClick={() => setSubcategorySearch("")}
                    aria-label="Hapus pencarian jenis"
                    className="rounded-full p-1 text-[#aa988c] hover:bg-orange-50 hover:text-orange-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </label>

              {visibleSubcategories.length > 0 ? (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {visibleSubcategories.map((subcategory) => {
                    const selected = activeSubcategory === subcategory;
                    return (
                      <button
                        key={subcategory}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setActiveSubcategory(selected ? null : subcategory)
                        }
                        className={`inline-flex min-h-10 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-[11px] font-bold transition ${
                          selected
                            ? "border-orange-500 bg-orange-500 text-white shadow-sm shadow-orange-200"
                            : "border-[#eee6df] bg-white text-[#6f594b] hover:border-orange-300 hover:bg-orange-50"
                        }`}
                      >
                        <span className="min-w-0">{subcategory}</span>
                        {selected ? (
                          <Check className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#c4b4a9]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-[#faf9f7] px-3 py-4 text-center text-xs font-semibold text-[#8c7a6d]">
                  Jenis yang kamu cari belum ada di kategori ini.
                </p>
              )}

              {!subcategorySearch.trim() && filteredSubcategories.length > 8 && (
                <button
                  type="button"
                  onClick={() => setShowAllSubcategories((value) => !value)}
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-black text-orange-700 transition hover:text-orange-800"
                >
                  {showAllSubcategories
                    ? "Tampilkan lebih sedikit"
                    : `Lihat semua jenis (${filteredSubcategories.length})`}
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform ${
                      showAllSubcategories ? "-rotate-90" : "rotate-90"
                    }`}
                  />
                </button>
              )}
            </section>
          )}

          <section aria-labelledby="culinary-spots-heading">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 id="culinary-spots-heading" className="text-lg font-black tracking-tight text-[#2e211b]">
                Pilih area
              </h2>
              <span className="text-[10px] font-bold text-[#a08e82]">{availableSpotCount} area</span>
            </div>
            <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              {culinarySpots.map((spot) => {
                const active = activeSpot === spot.label;
                const count = cityItems.filter((item) => matchesSpot(item.location, spot)).length;
                return (
                  <button
                    key={spot.label}
                    type="button"
                    onClick={() => setActiveSpot(spot.label)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2.5 text-xs font-black transition active:scale-95 ${
                      active
                        ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-200"
                        : "border-[#e9e2dc] bg-white text-[#6f594b] hover:border-orange-300 hover:text-orange-700"
                    }`}
                  >
                    <MapPin className={`h-3.5 w-3.5 ${active ? "text-orange-100" : "text-orange-500"}`} />
                    {spot.label}
                    <span className={active ? "text-orange-100" : "text-[#b7a398]"}>{count}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="merchant-list-heading">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 id="merchant-list-heading" className="text-xl font-black tracking-tight text-[#2e211b]">
                {activeSpot !== "Semua spot"
                  ? `${activeSubcategory || (activeCategory === "Semua" ? "Jajan" : activeCategory)} di ${activeSpot}`
                  : activeSubcategory
                    ? activeSubcategory
                    : activeCategory === "Semua"
                      ? `Merchant ${selectedCity}`
                      : activeCategory}
              </h2>
              <span className="shrink-0 rounded-full bg-[#fff0e2] px-3 py-1.5 text-[10px] font-black text-[#a84c19]">
                {formatCount(filteredItems.length)}
              </span>
            </div>

            {items.length === 0 ? (
              <CityUnavailable accent="#f97316" category="Jajan" />
            ) : cityItems.length === 0 ? (
              <CityUnavailable accent="#f97316" category="Jajan" />
            ) : filteredItems.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#e4b99c] bg-[#fff8f0] px-6 py-16 text-center">
                <Search className="mx-auto h-10 w-10 text-[#efbd91]" />
                <p className="mt-4 font-black text-[#4a3021]">
                  {activeSpot !== "Semua spot"
                    ? `Merchant di area ${activeSpot} belum terdaftar`
                    : "Jajan yang kamu cari belum ketemu"}
                </p>
                <p className="mt-1 text-xs text-[#94776a]">
                  {activeSpot !== "Semua spot"
                    ? "Area coverage ini tetap aktif dan siap menampung merchant baru."
                    : "Coba kata kunci atau kategori lain."}
                </p>
                <button type="button" onClick={() => { setSearch(""); setActiveCategory("Semua"); setActiveSubcategory(null); setSubcategorySearch(""); setShowAllSubcategories(false); setActiveSpot("Semua spot"); }} className="mt-5 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-orange-200 hover:bg-orange-600">
                  {activeSpot !== "Semua spot" ? "Lihat semua area" : "Tampilkan semua"}
                </button>
              </div>
            ) : (
               <div className="mobile-card-slider grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
                {displayItems.map((item) => (
                  <MerchantCard
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="relative overflow-hidden rounded-[1.5rem] bg-[#3e2117] p-5 text-[#fff8f0] shadow-[0_18px_42px_rgba(102,50,18,0.14)] sm:p-7">
            <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full border-[20px] border-orange-300/10" />
            <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-400/20 text-orange-200"><ChefHat className="h-5 w-5" /></div>
                <div>
                  <p className="text-base font-black">Punya usaha kuliner?</p>
                  <p className="mt-1 max-w-lg text-xs leading-relaxed text-[#e8cdb8]">Daftarkan usahamu di Jajan YUK.</p>
                </div>
              </div>
              <a href="https://ig.me/m/nempo.id" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#fff8f0] px-4 py-3 text-xs font-black text-[#a33c16] shadow-lg transition hover:-translate-y-0.5">
                Daftarkan usaha <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}