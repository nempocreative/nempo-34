import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { SedangDipersiapkan } from "@/components/sedang-dipersiapkan";
import { Link } from "@/lib/wouter";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import {
  Trophy, Search, X, MapPin, Calendar, Users,
  ChevronRight, Loader2, Filter, LayoutGrid,
  Camera, UtensilsCrossed, Dumbbell, Palette, Music, Pencil,
  Megaphone, ArrowRight, Clock, Zap,
} from "lucide-react";

const API = "/api";

interface Perlombaan {
  id: number;
  name: string;
  category: string;
  date: string;
  location: string;
  image: string;
  description: string;
  prize: number | string;
  organizer: string;
  fee: number;
  max_peserta: number;
  featured: boolean;
  active: boolean;
}

const categories = [
  { label: "Semua",       icon: LayoutGrid      },
  { label: "Fotografi",   icon: Camera          },
  { label: "Kuliner",     icon: UtensilsCrossed },
  { label: "Olahraga",    icon: Dumbbell        },
  { label: "Seni Budaya", icon: Palette         },
  { label: "Musik",       icon: Music           },
  { label: "Desain",      icon: Pencil          },
];

const catGrad: Record<string, { bg: string; text: string; badge: string; pill: string }> = {
  Fotografi:    { bg: "from-violet-600 to-purple-500",  text: "text-violet-600",  badge: "bg-violet-100 text-violet-700", pill: "bg-violet-600" },
  Kuliner:      { bg: "from-orange-500 to-amber-400",   text: "text-orange-500",  badge: "bg-orange-100 text-orange-700", pill: "bg-orange-500" },
  Olahraga:     { bg: "from-emerald-600 to-green-400",  text: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700", pill: "bg-emerald-600" },
  "Seni Budaya":{ bg: "from-pink-600 to-rose-400",      text: "text-pink-600",    badge: "bg-pink-100 text-pink-700", pill: "bg-pink-600" },
  Musik:        { bg: "from-blue-600 to-cyan-400",      text: "text-blue-600",    badge: "bg-blue-100 text-blue-700", pill: "bg-blue-600" },
  Desain:       { bg: "from-indigo-600 to-blue-400",    text: "text-indigo-600",  badge: "bg-indigo-100 text-indigo-700", pill: "bg-indigo-600" },
};

function defaultCat() {
  return { bg: "from-[#0194f3] to-[#1BA0E2]", text: "text-[#0194f3]", badge: "bg-blue-100 text-blue-700", pill: "bg-[#0194f3]" };
}

function formatPrize(p: number) {
  if (p >= 1_000_000) return `Rp ${(p / 1_000_000).toFixed(0)} Jt`;
  if (p >= 1_000)     return `Rp ${(p / 1_000).toFixed(0)} Rb`;
  return `Rp ${p.toLocaleString("id")}`;
}

function formatFee(f: number) {
  return f === 0 ? "GRATIS" : `Rp ${f.toLocaleString("id")}`;
}

function getStatus(dateStr: string): "open" | "upcoming" | "closed" {
  const today   = new Date().toISOString().slice(0, 10);
  const weekOut = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  if (dateStr < today)   return "closed";
  if (dateStr <= weekOut) return "open";
  return "upcoming";
}

const statusBadge: Record<string, string> = {
  open:     "bg-emerald-500 text-white",
  upcoming: "bg-blue-500 text-white",
  closed:   "bg-gray-400/80 text-white",
};
const statusLabel: Record<string, string> = {
  open:     "✦ Dibuka",
  upcoming: "Segera",
  closed:   "Selesai",
};

export default function PerlombaanPage() {
  const [items, setItems]     = useState<Perlombaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive]   = useState("Semua");
  const [search, setSearch]   = useState("");

  useEffect(() => {
    fetch(`${API}/perlombaan`)
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = items.filter(p => {
    const matchCat    = active === "Semua" || p.category === active;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.location.toLowerCase().includes(search.toLowerCase()) ||
                        p.organizer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured    = items.filter(p => p.featured).slice(0, 5);
  const totalPrize  = items.reduce((s, p) => s + (Number(p.prize) || 0), 0);
  const activeCount = items.filter(p => getStatus(p.date) !== "closed").length;

  return (
    <Layout>
      <SEO
        title="Perlombaan & Kompetisi Garut — Adu Bakat, Raih Hadiah"
        description="Daftar perlombaan dan kompetisi seru di Garut dengan hadiah menarik. Fotografi, kuliner, olahraga, seni budaya, dan banyak lagi."
        keywords="perlombaan garut, lomba garut, kompetisi garut, hadiah garut, event garut"
        path="/perlombaan"
      />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0533 0%, #2d0860 50%, #4B0082 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #a855f7 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%)" }} />
        <div className="relative z-10 px-4 pt-6 pb-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-400/30">
              <Trophy className="h-6 w-6 text-yellow-900" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Perlombaan</h1>
              <p className="text-purple-200/70 text-xs">Adu bakat, raih hadiah bergengsi</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { val: items.length,            label: "Total Lomba"  },
              { val: activeCount,             label: "Aktif"        },
              { val: formatPrize(totalPrize), label: "Total Hadiah" },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-white/10 border border-white/10 py-2.5 text-center">
                <p className="text-white font-extrabold text-base leading-none">{s.val}</p>
                <p className="text-purple-200/50 text-[10px] font-semibold mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center bg-white rounded-2xl shadow-xl border border-white/20 pr-1.5 mb-4 overflow-visible">
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
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari lomba, lokasi, penyelenggara…"
              className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 font-medium bg-transparent py-3 px-1"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 mr-1">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              className="shrink-0 active:scale-95 transition-all rounded-xl flex items-center justify-center gap-1.5"
              style={{ background: "#22c55e", color: "#fff", boxShadow: "0 4px 12px rgba(34,197,94,0.35)", padding: "10px 12px" }}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline text-sm font-bold">Cari</span>
            </button>
          </div>

          {/* Category pills — hidden on mobile */}
          <div className="hidden sm:flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
            {categories.map(cat => {
              const Icon     = cat.icon;
              const isActive = active === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActive(cat.label)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all active:scale-95 ${
                    isActive
                      ? "bg-white text-purple-800 border-white shadow-lg shadow-white/20"
                      : "bg-white/10 text-white/70 border-white/15 hover:bg-white/20"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />{cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-4 pt-5 pb-24 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Featured */}
            {!search && active === "Semua" && featured.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 rounded-full bg-yellow-400" />
                  <h2 className="font-extrabold text-gray-900 text-base">Lomba Unggulan</h2>
                </div>
                <div className="space-y-4">
                  {featured.map(p => {
                    const g  = catGrad[p.category] ?? defaultCat();
                    const st = getStatus(p.date);
                    return (
                      <Link key={p.id} href={`/perlombaan/${p.id}`}>
                        <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]">
                          <div className="relative w-32 shrink-0">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 bg-gradient-to-r ${g.bg} opacity-20`} />
                          </div>
                          <div className="flex-1 p-3.5 min-w-0">
                            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${g.pill}`}>{p.category}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusBadge[st]}`}>{statusLabel[st]}</span>
                            </div>
                            <h3 className="font-extrabold text-gray-900 text-sm line-clamp-2 leading-tight mb-2.5">{p.name}</h3>
                            <div className="flex items-end gap-4 mb-2">
                              <div>
                                <p className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold">Total Hadiah</p>
                                <p className={`text-sm font-extrabold ${g.text}`}>{formatPrize(Number(p.prize))}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold">Biaya Daftar</p>
                                <p className="text-xs font-bold text-gray-700">{formatFee(p.fee)}</p>
                              </div>
                            </div>
                            <p className="text-gray-400 text-[9px] flex items-center gap-0.5 truncate">
                              <MapPin className="h-2.5 w-2.5 shrink-0" />{p.location}
                            </p>
                          </div>
                          <div className="flex items-center pr-3 shrink-0">
                            <ChevronRight className="h-4 w-4 text-gray-300" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All list */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-purple-500" />
                <h2 className="font-extrabold text-gray-900 text-base">
                  {active === "Semua" ? "Semua Lomba" : `Lomba ${active}`}
                </h2>
              </div>
              <span className="text-gray-400 text-xs">{filtered.length} lomba</span>
            </div>

            {items.length === 0 ? (
              <SedangDipersiapkan
                icon={Trophy}
                iconGradient="linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)"
                dotColor1="#dc2626"
                dotColor2="#f59e0b"
                title="Perlombaan & Kompetisi"
                titleHighlight="Sedang Dipersiapkan"
                description="Daftar lomba dan kompetisi seru di Garut sedang kami siapkan. Pantau terus untuk update terbaru!"
                btn1Label="Lihat Event"
                btn1Href="/event"
                btn2Label="Jelajahi Wisata"
                btn2Href="/wisata"
              />
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-16 w-16 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-gray-300" />
                </div>
                <p className="font-semibold text-gray-500">Tidak ada lomba ditemukan</p>
                <p className="text-xs text-gray-400 mt-1">Coba kata kunci atau kategori lain</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filtered.map(p => {
                  const g  = catGrad[p.category] ?? defaultCat();
                  const st = getStatus(p.date);
                  return (
                    <Link key={p.id} href={`/perlombaan/${p.id}`}>
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] group">
                        {/* Image with gradient overlay */}
                        <div className="relative h-36 overflow-hidden">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                          {/* Status badge */}
                          <span className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${statusBadge[st]}`}>
                            {statusLabel[st]}
                          </span>
                          {/* Prize chip at bottom of image */}
                          <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${g.pill}`}>
                              {p.category}
                            </span>
                            <div className="bg-black/55 backdrop-blur-sm rounded-lg px-2 py-1 text-right">
                              <p className="text-[8px] text-white/60 leading-none mb-0.5">Hadiah</p>
                              <p className="text-xs font-extrabold text-yellow-300 leading-tight">{formatPrize(Number(p.prize))}</p>
                            </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-3">
                          <h3 className="font-extrabold text-gray-900 text-xs leading-snug line-clamp-2 mb-2">{p.name}</h3>

                          {/* Fee pill */}
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.fee === 0 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                              {p.fee === 0 ? "✓ Gratis" : formatFee(p.fee)}
                            </span>
                            {p.max_peserta > 0 && (
                              <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                                <Users className="h-2.5 w-2.5" />{p.max_peserta}
                              </span>
                            )}
                          </div>

                          {/* Date & location */}
                          <div className="space-y-1">
                            <p className="text-gray-400 text-[9px] flex items-center gap-1">
                              <Calendar className="h-2.5 w-2.5 shrink-0" />
                              {new Date(p.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                            <p className="text-gray-400 text-[9px] flex items-center gap-1 truncate">
                              <MapPin className="h-2.5 w-2.5 shrink-0" />{p.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* CTA — Daftarkan Lombamu */}
            <div className="mt-8 relative overflow-hidden rounded-3xl" style={{ background: "linear-gradient(135deg, #1a0533 0%, #3b0764 60%, #4B0082 100%)" }}>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 55%), radial-gradient(circle at 10% 80%, #6366f1 0%, transparent 50%)" }} />

              {/* Decorative trophies */}
              <div className="absolute top-3 right-4 opacity-10">
                <Trophy className="h-20 w-20 text-yellow-300" />
              </div>

              <div className="relative z-10 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-400/30 shrink-0">
                    <Megaphone className="h-4 w-4 text-yellow-900" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-300">Untuk Penyelenggara</span>
                </div>

                <h2 className="text-xl font-extrabold text-white leading-tight mb-1">
                  Punya lomba seru<br />di Garut?
                </h2>
                <p className="text-purple-200/80 text-xs leading-relaxed mb-4">
                  Daftarkan kompetisimu ke Nempo dan jangkau ribuan peserta potensial dari seluruh Garut. <span className="text-yellow-300 font-semibold">Gratis, mudah, dan langsung viral!</span>
                </p>

                {/* Benefits */}
                <div className="space-y-1.5 mb-5">
                  {[
                    { icon: Zap,      text: "Pendaftaran lomba gratis & cepat"             },
                    { icon: Users,    text: "Jangkau ribuan calon peserta aktif"           },
                    { icon: Clock,    text: "Kelola pendaftaran & peserta secara real-time" },
                  ].map(b => {
                    const Icon = b.icon;
                    return (
                      <div key={b.text} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <Icon className="h-2.5 w-2.5 text-yellow-300" />
                        </div>
                        <p className="text-white/80 text-[10px]">{b.text}</p>
                      </div>
                    );
                  })}
                </div>

                <a
                  href={NEMPO_CONSULT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 font-extrabold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-yellow-500/30 hover:from-yellow-300 hover:to-amber-400 transition-all active:scale-95"
                >
                  Daftarkan Lombamu Sekarang
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
