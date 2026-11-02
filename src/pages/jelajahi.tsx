import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import { Search, X, MapPin, Star, Utensils, Calendar, Map } from "lucide-react";
import { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface AnyItem {
  id: number | string;
  name: string;
  image: string;
  location?: string;
  category?: string;
  date?: string;
  entry_fee?: number;
  price_range?: string;
  price?: number;
  computed_rating?: number | null;
  rating?: number | string | null;
}

const sections = [
  { id: "wisata",  label: "Wisata",  icon: Map,      color: "text-blue-500"   },
  { id: "kuliner", label: "Kuliner", icon: Utensils, color: "text-[#0194f3]"  },
  { id: "event",   label: "Event",   icon: Calendar, color: "text-purple-500" },
];

function getGoogleRating(item: AnyItem) {
  const rating = Number(item.rating);
  return Number.isFinite(rating) && rating > 0 ? rating : null;
}

export default function Jelajahi() {
  const [activeSection, setActiveSection] = useState("wisata");
  const [query, setQuery] = useState("");

  const [wisata,  setWisata]  = useState<AnyItem[]>([]);
  const [kuliner, setKuliner] = useState<AnyItem[]>([]);
  const [events,  setEvents]  = useState<AnyItem[]>([]);

  useEffect(() => {
    const load = (path: string, setter: (d: AnyItem[]) => void) =>
      fetch(`/api${path}`)
        .then(r => r.ok ? r.json() : [])
        .then((d: AnyItem[]) => setter(Array.isArray(d) ? d : []))
        .catch(() => setter([]));
    load("/wisata",  setWisata);
    load("/kuliner", setKuliner);
    load("/events",  setEvents);
  }, []);

  const q = query.toLowerCase();
  const filteredWisata  = wisata.filter(w => !q || w.name.toLowerCase().includes(q) || (w.location ?? "").toLowerCase().includes(q));
  const filteredKuliner = kuliner.filter(k => !q || k.name.toLowerCase().includes(q));
  const filteredEvents  = events.filter(e => !q || e.name.toLowerCase().includes(q));

  return (
    <Layout>
      <SEO title="Jelajahi Garut" description="Jelajahi semua destinasi wisata, kuliner, penginapan, dan event terbaik di Kabupaten Garut." path="/jelajahi" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Jelajahi</h1>
        <p className="text-gray-500 text-sm mb-5">Temukan semua yang ada di Garut</p>

        {/* Bird search */}
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
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cari apa saja di Garut…"
              className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 font-medium bg-transparent py-3 px-1"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 mr-1">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              className="shrink-0 active:scale-95 transition-all rounded-xl flex items-center justify-center gap-1.5"
              style={{ background:"#0194f3", color:"#fff", boxShadow:"0 4px 12px rgba(1,148,243,0.35)", padding:"10px 12px" }}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline text-sm font-bold">Cari</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activeSection === s.id ? "bg-primary text-white border-primary" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className={`h-4 w-4 ${activeSection === s.id ? "text-white" : s.color}`} />
                {s.label}
              </button>
            );
          })}
        </div>

        {activeSection === "wisata" && (
          <div className="mobile-card-slider grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredWisata.map(w => (
              <Link key={w.id} href={`/wisata/${(w as any).slug || w.id}`}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative h-40 overflow-hidden">
                    <img src={w.image} alt={w.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {getGoogleRating(w) != null ? (
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold text-yellow-600 flex items-center gap-1 shadow-sm" title="Rating Google Maps">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />{getGoogleRating(w)!.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      </div>
                    ) : w.computed_rating != null && (
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1 shadow-sm" title="Rating Nempo">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />Nempo {w.computed_rating}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{w.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 shrink-0" />{w.location}
                    </div>
                    <p className="text-primary text-xs font-bold mt-2">
                      {(w.entry_fee ?? 0) === 0 ? "Gratis" : `Rp ${Number(w.entry_fee).toLocaleString("id")}`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeSection === "kuliner" && (
          <div className="mobile-card-slider grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredKuliner.map(k => (
              <Link key={k.id} href={`/kuliner/${(k as any).slug || k.id}`}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative h-32 overflow-hidden">
                    <img src={k.image} alt={k.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {getGoogleRating(k) != null ? (
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold text-yellow-600 flex items-center gap-1 shadow-sm" title="Rating Google Maps">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />{getGoogleRating(k)!.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      </div>
                    ) : k.computed_rating != null && (
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1 shadow-sm" title="Rating Nempo">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />Nempo {k.computed_rating}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{k.name}</h3>
                    {k.price_range && <p className="text-xs text-[#0172B1] font-semibold mt-1">{k.price_range}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeSection === "event" && (
          <div className="mobile-card-slider grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map(e => (
              <Link key={e.id} href={`/event/${(e as any).slug || e.id}`}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative h-44 overflow-hidden">
                    <img src={e.image} alt={e.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-bold text-white text-sm line-clamp-2">{e.name}</h3>
                      <p className="text-white/80 text-xs">{e.date} · {e.location}</p>
                    </div>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{e.category}</span>
                    <span className="text-primary text-sm font-bold">
                      {(e.price ?? 0) === 0 ? "Gratis" : `Rp ${Number(e.price).toLocaleString("id")}`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
