import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useSearch } from "@/lib/wouter";
import { Search, X, MapPin, Utensils, Compass, Home, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";

const API = (path: string) => `/api${path}`;

type Category = "Semua" | "Wisata" | "Kuliner" | "Penginapan" | "Event";

interface Result {
  id: number;
  title: string;
  subtitle?: string;
  image?: string;
  href: string;
  category: string;
  type: Category;
}

const TYPE_META: Record<Exclude<Category, "Semua">, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  Wisata:     { icon: Compass,   color: "#0194f3", bg: "#EFF6FF", label: "Wisata" },
  Kuliner:    { icon: Utensils,  color: "#EF4444", bg: "#FEF2F2", label: "Kuliner" },
  Penginapan: { icon: Home,      color: "#8B5CF6", bg: "#F5F3FF", label: "Penginapan" },
  Event:      { icon: Calendar,  color: "#F59E0B", bg: "#FFFBEB", label: "Event" },
};

export default function CariPage() {
  const [, navigate] = useLocation();
  const searchStr = useSearch();
  const urlQuery = new URLSearchParams(searchStr).get("q") ?? "";

  const [inputVal, setInputVal] = useState(urlQuery);
  const [activeTab, setActiveTab] = useState<Category>("Semua");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputVal(urlQuery);
    setActiveTab("Semua");
  }, [urlQuery]);

  useEffect(() => {
    if (!urlQuery.trim()) { setResults([]); return; }
    const q = urlQuery.trim().toLowerCase();
    setLoading(true);

    Promise.allSettled([
      fetch(API("/wisata")).then(r => r.json()),
      fetch(API("/kuliner")).then(r => r.json()),
      fetch(API("/penginapan")).then(r => r.json()),
      fetch(API("/events")).then(r => r.json()),
    ]).then(([wisata, kuliner, penginapan, events]) => {
      const all: Result[] = [];

      if (wisata.status === "fulfilled") {
        (Array.isArray(wisata.value) ? wisata.value : []).forEach((w: any) => {
          if (
            w.name?.toLowerCase().includes(q) ||
            w.location?.toLowerCase().includes(q) ||
            w.category?.toLowerCase().includes(q) ||
            w.description?.toLowerCase().includes(q)
          ) {
            all.push({ id: w.id, title: w.name, subtitle: w.location, image: w.image, href: `/wisata/${w.slug || w.id}`, category: w.category, type: "Wisata" });
          }
        });
      }

      if (kuliner.status === "fulfilled") {
        (Array.isArray(kuliner.value) ? kuliner.value : []).forEach((k: any) => {
          if (
            k.name?.toLowerCase().includes(q) ||
            k.location?.toLowerCase().includes(q) ||
            k.category?.toLowerCase().includes(q) ||
            k.description?.toLowerCase().includes(q)
          ) {
            all.push({ id: k.id, title: k.name, subtitle: k.location, image: k.image, href: `/kuliner/${k.slug || k.id}`, category: k.category, type: "Kuliner" });
          }
        });
      }

      if (penginapan.status === "fulfilled") {
        (Array.isArray(penginapan.value) ? penginapan.value : []).forEach((p: any) => {
          if (
            p.name?.toLowerCase().includes(q) ||
            p.location?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
          ) {
            all.push({ id: p.id, title: p.name, subtitle: p.location, image: p.image, href: `/penginapan/${p.slug || p.id}`, category: p.category, type: "Penginapan" });
          }
        });
      }

      if (events.status === "fulfilled") {
        (Array.isArray(events.value) ? events.value : []).forEach((e: any) => {
          if (
            e.name?.toLowerCase().includes(q) ||
            e.location?.toLowerCase().includes(q) ||
            e.category?.toLowerCase().includes(q) ||
            e.description?.toLowerCase().includes(q)
          ) {
            all.push({ id: e.id, title: e.name, subtitle: e.location, image: e.image, href: `/event/${(e as any).slug || e.id}`, category: e.category, type: "Event" });
          }
        });
      }

      setResults(all);
      setLoading(false);
    });
  }, [urlQuery]);

  function submitSearch(val: string) {
    const trimmed = val.trim();
    if (!trimmed) return;
    navigate(`/cari?q=${encodeURIComponent(trimmed)}`);
    setInputVal(trimmed);
    setActiveTab("Semua");
    inputRef.current?.blur();
  }

  const tabs: Category[] = ["Semua", "Wisata", "Kuliner", "Penginapan", "Event"];

  const filtered = activeTab === "Semua" ? results : results.filter(r => r.type === activeTab);

  const countFor = (tab: Category) => tab === "Semua" ? results.length : results.filter(r => r.type === tab).length;

  function ResultCard({ r }: { r: Result }) {
    const meta = TYPE_META[r.type as Exclude<Category, "Semua">];
    const Icon = meta.icon;
    const imgSrc = r.image
      ? (r.image.startsWith("http") ? r.image : `/api/uploads/${r.image}`)
      : null;

    return (
      <Link href={r.href}>
        <div className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 active:scale-[0.98] transition-all cursor-pointer">
          <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
            {imgSrc ? (
              <img src={imgSrc} alt={r.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: meta.bg }}>
                <Icon className="h-6 w-6" style={{ color: meta.color }} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{r.title}</p>
            {r.subtitle && (
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                <p className="text-xs text-gray-500 truncate">{r.subtitle}</p>
              </div>
            )}
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: meta.bg, color: meta.color }}>
              <Icon className="h-2.5 w-2.5" />
              {meta.label}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Layout>
      <SEO title="Cari di Nempo Organizer" description="Cari destinasi wisata, kuliner khas, penginapan, dan event terbaik di Jawa Barat dalam satu platform." path="/cari" />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => history.back()} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="font-black text-gray-900 text-[15px]">Pencarian</h1>
          </div>

          {/* Search input */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-blue-400 focus-within:bg-white transition-all">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submitSearch(inputVal)}
              placeholder="Cari destinasi, kuliner, event…"
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              autoFocus
            />
            {inputVal && (
              <button onClick={() => { setInputVal(""); inputRef.current?.focus(); }} className="text-gray-400 hover:text-gray-600">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => submitSearch(inputVal)}
              className="shrink-0 px-3 py-1 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
              style={{ background: "#0194f3" }}
            >
              Cari
            </button>
          </div>
        </div>

        {/* Tabs */}
        {urlQuery && !loading && results.length > 0 && (
          <div className="px-4 pt-3 pb-1">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {tabs.map(tab => {
                const count = countFor(tab);
                if (tab !== "Semua" && count === 0) return null;
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                      active ? "text-white shadow-md" : "bg-white border border-gray-200 text-gray-500"
                    }`}
                    style={active ? { background: "#0194f3" } : undefined}
                  >
                    {tab}
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      active ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                    }`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-4 py-4 pb-28 space-y-3">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin mb-3" style={{ color: "#0194f3" }} />
              <p className="text-sm text-gray-500 font-medium">Mencari "{urlQuery}"…</p>
            </div>
          )}

          {/* No query yet */}
          {!loading && !urlQuery && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-4">
                <Search className="h-9 w-9" style={{ color: "#0194f3" }} />
              </div>
              <p className="font-bold text-gray-700 text-base">Cari apa hari ini?</p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">Ketik nama destinasi, kuliner, penginapan, event, atau berita di Jawa Barat</p>

              {/* Quick suggestion tags */}
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {["Kawah Papandayan", "Soto Garut", "Hotel", "Festival", "Berita terbaru"].map(s => (
                  <button
                    key={s}
                    onClick={() => { setInputVal(s); submitSearch(s); }}
                    className="px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {!loading && urlQuery && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-4">
                <Search className="h-9 w-9 text-gray-300" />
              </div>
              <p className="font-bold text-gray-700 text-base">Tidak ada hasil</p>
              <p className="text-sm text-gray-400 mt-1">untuk "<span className="font-semibold text-gray-600">{urlQuery}</span>"</p>
              <p className="text-xs text-gray-400 mt-3">Coba kata kunci lain atau telusuri kategori langsung</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {["Wisata", "Kuliner", "Penginapan"].map(cat => (
                  <Link key={cat} href={`/${cat.toLowerCase()}`}>
                    <span className="px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors inline-block">
                      Lihat {cat}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && filtered.length > 0 && (
            <div className="mobile-card-slider sm:grid sm:grid-cols-1 gap-3">
              {filtered.map(r => (
                <ResultCard key={`${r.type}-${r.id}`} r={r} />
              ))}
            </div>
          )}

          {/* Tab empty state */}
          {!loading && urlQuery && results.length > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-gray-400">Tidak ada hasil <strong>{activeTab}</strong> untuk "{urlQuery}"</p>
              <button onClick={() => setActiveTab("Semua")} className="mt-3 text-xs font-bold px-4 py-2 rounded-xl" style={{ color: "#0194f3" }}>
                Lihat semua hasil
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
