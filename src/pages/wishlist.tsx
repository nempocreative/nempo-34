import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import {
  Heart, MapPin, Utensils, Hotel, Calendar,
  Compass, ChevronRight, BookmarkX, Loader2, Search, X,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { type WishlistItem } from "@/lib/wishlist";
import { useWishlist } from "@/lib/use-wishlist";
import { useAuth } from "@/contexts/auth-context";

/* ─── Config ────────────────────────────────────────────────── */
const typeConfig: Record<string, {
  label: string; icon: React.ElementType;
  color: string; bg: string; href: string;
}> = {
  wisata:     { label: "Wisata",     icon: MapPin,     color: "#0194f3", bg: "#EBF3FF", href: "/wisata"     },
  kuliner:    { label: "Kuliner",    icon: Utensils,   color: "#f97316", bg: "#fff7ed", href: "/kuliner"    },
  penginapan: { label: "Penginapan", icon: Hotel,      color: "#8b5cf6", bg: "#f5f3ff", href: "/penginapan" },
  event:      { label: "Event",      icon: Calendar,   color: "#10b981", bg: "#ecfdf5", href: "/event"      },
};

const TABS = [
  { key: "semua",      label: "Semua"       },
  { key: "wisata",     label: "Wisata"      },
  { key: "kuliner",    label: "Kuliner"     },
  { key: "penginapan", label: "Penginapan"  },
  { key: "event",      label: "Event"       },
];

/* ─── Animated card ─────────────────────────────────────────── */
function WishlistCard({
  item, idx, onRemove,
}: { item: WishlistItem; idx: number; onRemove: () => void }) {
  const cfg  = typeConfig[item.type];
  const Icon = cfg?.icon ?? MapPin;
  const [removing, setRemoving] = useState(false);
  const [visible,  setVisible]  = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), idx * 60);
    return () => clearTimeout(t);
  }, [idx]);

  function handleRemove() {
    setRemoving(true);
    setTimeout(onRemove, 320);
  }

  const saved = new Date(item.savedAt);
  const dateStr = saved.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div
      style={{
        opacity:    removing ? 0 : visible ? 1 : 0,
        transform:  removing ? "translateX(40px) scale(0.95)"
                  : visible  ? "translateY(0) scale(1)"
                             : "translateY(18px) scale(0.97)",
        transition: removing
          ? "opacity .3s ease, transform .3s ease"
          : "opacity .4s ease, transform .4s ease",
      }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <Link href={`${cfg?.href}/${item.id}`} className="flex gap-0 min-w-0">
        {/* Image */}
        <div className="w-[88px] shrink-0 relative overflow-hidden">
          <img
            src={item.image} alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
          <div>
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5"
              style={{ background: cfg?.bg, color: cfg?.color }}
            >
              <Icon className="w-2.5 h-2.5" />
              {cfg?.label}
              {item.category && item.category !== cfg?.label && (
                <span className="opacity-60">· {item.category}</span>
              )}
            </span>
            <p className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug">
              {item.name}
            </p>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            {item.location ? (
              <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                <MapPin className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate max-w-[120px]">{item.location}</span>
              </div>
            ) : (
              <span className="text-[10px] text-gray-300">{dateStr}</span>
            )}
            <span className="text-[#0194f3] text-[10px] font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Lihat <ChevronRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </Link>

      {/* Remove */}
      <button
        onClick={handleRemove}
        title="Hapus dari wishlist"
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm flex items-center justify-center text-gray-300 hover:text-red-400 hover:border-red-100 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        <BookmarkX className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ─── Empty state ───────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Animated heart illustration */}
      <div className="relative mb-8">
        <div
          className="w-28 h-28 rounded-[2rem] flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #fff0f3 0%, #ffe4ec 100%)", border: "2px solid #fecdd3" }}
        >
          <Heart
            className="w-14 h-14"
            style={{
              color: "#fb7185",
              animation: "heartbeat 2s ease-in-out infinite",
            }}
          />
        </div>
        {/* Floating dots */}
        {[
          { top: "0%",  left: "80%",  size: 10, delay: "0s",    color: "#93c5fd" },
          { top: "75%", left: "90%",  size: 7,  delay: "0.6s",  color: "#fca5a5" },
          { top: "85%", left: "5%",   size: 8,  delay: "1.1s",  color: "#86efac" },
          { top: "10%", left: "5%",   size: 6,  delay: "1.6s",  color: "#fcd34d" },
        ].map((dot, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              top: dot.top, left: dot.left,
              width: dot.size, height: dot.size,
              background: dot.color,
              animation: `floatDot 3s ease-in-out infinite`,
              animationDelay: dot.delay,
            }} />
        ))}
      </div>

      <h2 className="text-gray-800 font-black text-xl mb-2 tracking-tight">
        Belum Ada Favorit
      </h2>
      <p className="text-gray-400 text-sm leading-relaxed max-w-[260px] mb-1">
        Simpan destinasi impianmu dan rencanakan perjalanan terbaik bersama Nempo.
      </p>
      <p className="text-gray-300 text-xs mb-8">
        Tekan ikon <span className="text-red-300">♥</span> di halaman mana pun untuk mulai menyimpan.
      </p>

      <div className="flex flex-col gap-2.5 w-full max-w-[280px]">
        <Link href="/wisata"
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #0194f3 0%, #0172B1 100%)" }}>
          <Compass className="w-4 h-4" /> Jelajahi Destinasi Wisata
        </Link>
        <Link href="/kuliner"
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-colors hover:bg-gray-100"
          style={{ background: "#f8fafc", color: "#374151", border: "1.5px solid #e2e8f0" }}>
          <Utensils className="w-4 h-4" /> Temukan Kuliner Khas
        </Link>
        <Link href="/penginapan"
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-colors hover:bg-gray-100"
          style={{ background: "#f8fafc", color: "#374151", border: "1.5px solid #e2e8f0" }}>
          <Hotel className="w-4 h-4" /> Cari Penginapan
        </Link>
      </div>

      <style>{`
        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          14%      { transform: scale(1.15); }
          28%      { transform: scale(1); }
          42%      { transform: scale(1.1); }
          70%      { transform: scale(1); }
        }
        @keyframes floatDot {
          0%,100% { transform: translateY(0); opacity: .7; }
          50%     { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function WishlistPage() {
  const { user }                = useAuth();
  const { items, toggle, loading: wLoading } = useWishlist();
  const [activeTab,    setActiveTab]    = useState("semua");
  const [mounted,      setMounted]      = useState(false);
  const [wishSearch,   setWishSearch]   = useState("");

  useEffect(() => { setMounted(true); }, []);

  const filtered = items
    .filter(i => activeTab === "semua" || i.type === activeTab)
    .filter(i => !wishSearch || i.name.toLowerCase().includes(wishSearch.toLowerCase()) || (i.location ?? "").toLowerCase().includes(wishSearch.toLowerCase()));

  async function remove(id: string, type: string) {
    const item = items.find(i => i.id === id && i.type === type);
    if (item) await toggle(item);
  }

  return (
    <Layout>
      <SEO title="Wishlist Saya" noIndex />
      {/* ── Hero banner ── */}
      <div
        className="relative overflow-hidden px-4 pt-7 pb-6"
        style={{ background: "linear-gradient(135deg, #fff0f3 0%, #fff7f0 50%, #f0f7ff 100%)" }}
      >
        {/* Background decorations */}
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #fda4af, transparent)" }} />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #93c5fd, transparent)" }} />

        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity .5s ease, transform .5s ease",
          }}
        >
          {/* Icon + title */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)",
                boxShadow: "0 4px 16px rgba(244,63,94,.35)",
              }}
            >
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900 leading-none tracking-tight">
                  Wishlist Saya
                </h1>
                {items.length > 0 && (
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                    style={{ background: "#f43f5e" }}
                  >
                    {items.length}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                {wLoading ? "Memuat wishlist…"
                 : items.length > 0 ? "Destinasi impian yang telah kamu kurasi"
                 : "Simpan destinasi favoritmu di sini"}
              </p>
            </div>
          </div>

          {/* Summary chips */}
          {items.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {Object.entries(typeConfig).map(([key, cfg]) => {
                const count = items.filter(i => i.type === key).length;
                if (!count) return null;
                const Icon = cfg.icon;
                return (
                  <div key={key}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    <Icon className="w-3 h-3" />
                    {count} {cfg.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bird search */}
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-1">
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
              value={wishSearch}
              onChange={e => setWishSearch(e.target.value)}
              placeholder="Cari nama destinasi atau lokasi…"
              className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 font-medium bg-transparent py-3 px-1"
            />
            {wishSearch && (
              <button onClick={() => setWishSearch("")} className="text-gray-400 hover:text-gray-600 mr-1">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              className="shrink-0 active:scale-95 transition-all rounded-xl flex items-center justify-center gap-1.5"
              style={{ background:"linear-gradient(135deg,#fb7185,#f43f5e)", color:"#fff", boxShadow:"0 4px 12px rgba(244,63,94,0.35)", padding:"10px 12px" }}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline text-sm font-bold">Cari</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 pb-32">

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* ── Category tabs ── */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5 -mx-4 px-4">
              {TABS.map(t => {
                const count  = t.key === "semua" ? items.length : items.filter(i => i.type === t.key).length;
                const active = activeTab === t.key;
                if (t.key !== "semua" && count === 0) return null;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200"
                    style={active
                      ? { background: "#0194f3", color: "#fff", boxShadow: "0 4px 12px rgba(1,148,243,.3)" }
                      : { background: "#f1f5f9", color: "#64748b" }
                    }
                  >
                    {t.label}
                    <span
                      className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                      style={active
                        ? { background: "rgba(255,255,255,.25)", color: "#fff" }
                        : { background: "#e2e8f0", color: "#94a3b8" }
                      }
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── Items ── */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-14 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                  <Heart className="w-7 h-7 text-gray-200" />
                </div>
                <p className="text-gray-500 font-semibold text-sm">
                  Belum ada {TABS.find(t => t.key === activeTab)?.label} tersimpan
                </p>
                <p className="text-gray-300 text-xs mt-1 max-w-[200px]">
                  Tekan ikon ♥ di halaman detail untuk menyimpan
                </p>
              </div>
            ) : (
               <div className="mobile-card-slider relative gap-3">
                {filtered.map((item, idx) => (
                  <div key={`${item.type}-${item.id}`} className="relative">
                    <WishlistCard
                      item={item}
                      idx={idx}
                      onRemove={() => remove(item.id, item.type)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ── Footer hint ── */}
            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-gray-300 text-[11px]">
                <Compass className="w-3 h-3" />
                <span>Dikurasi khusus untuk perjalanan terbaikmu</span>
                <Compass className="w-3 h-3" />
              </div>
              <p className="text-gray-200 text-[10px]">
                Tekan ♥ di halaman detail untuk menambah atau menghapus
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
