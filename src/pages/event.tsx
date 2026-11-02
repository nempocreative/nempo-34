import React, { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { CityUnavailable } from "@/components/city-unavailable";
import { Link } from "@/lib/wouter";
import { useCityFilter } from "@/contexts/city-filter-context";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Calendar, MapPin, Search, X, ChevronRight,
  Music, Dumbbell, BookOpen, UtensilsCrossed, Palette,
  LayoutGrid, Ticket, Megaphone, Loader2, Trophy,
  XCircle, Clock, RefreshCw, Copy, Check, CalendarDays, CheckCircle2,
  Instagram, Users,
} from "lucide-react";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import { toSnake } from "@/lib/api-keys";


const API = "/api";

interface Event {
  id: number;
  name: string;
  title: string;
  category: string;
  date: string;
  date_end: string;
  location: string;
  image: string;
  description: string;
  price: number;
  organizer: string;
  organizer_ig: string;
  featured: boolean;
  active: boolean;
  visitors: number;
}

const categories = [
  { label: "Semua",      icon: LayoutGrid      },
  { label: "Perlombaan", icon: Trophy          },
  { label: "Budaya",     icon: Palette         },
  { label: "Musik",      icon: Music           },
  { label: "Olahraga",   icon: Dumbbell        },
  { label: "Edukasi",    icon: BookOpen        },
  { label: "Kuliner",    icon: UtensilsCrossed },
];

const catMeta: Record<string, { from: string; to: string; text: string; bg: string }> = {
  Budaya:      { from: "#7c3aed", to: "#a78bfa", text: "#c4b5fd", bg: "rgba(124,58,237,0.15)" },
  Musik:       { from: "#db2777", to: "#f472b6", text: "#f9a8d4", bg: "rgba(219,39,119,0.15)" },
  Olahraga:   { from: "#059669", to: "#34d399", text: "#6ee7b7", bg: "rgba(5,150,105,0.15)"  },
  Edukasi:    { from: "#2563eb", to: "#60a5fa", text: "#93c5fd", bg: "rgba(37,99,235,0.15)"  },
  Kuliner:    { from: "#d97706", to: "#fbbf24", text: "#fde68a", bg: "rgba(217,119,6,0.15)"  },
  Perlombaan: { from: "#dc2626", to: "#f87171", text: "#fca5a5", bg: "rgba(220,38,38,0.15)"  },
  Workshop:   { from: "#0891b2", to: "#22d3ee", text: "#a5f3fc", bg: "rgba(8,145,178,0.15)"  },
};
const DEFAULT_META = { from: "#6b7280", to: "#9ca3af", text: "#d1d5db", bg: "rgba(107,114,128,0.15)" };

function fmtDate(d: string, dEnd?: string) {
  const fmt = (s: string) => new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const fmtDay = (s: string) => new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  if (!dEnd || dEnd === d) return fmt(d);
  const startD = new Date(d), endD = new Date(dEnd);
  if (startD.getMonth() === endD.getMonth() && startD.getFullYear() === endD.getFullYear())
    return `${startD.getDate()}–${fmt(dEnd)}`;
  return `${fmtDay(d)} – ${fmt(dEnd)}`;
}
function fmtPrice(p: number) {
  return p === 0 ? "GRATIS" : `Rp ${p.toLocaleString("id")}`;
}
function getStatus(d: string, dEnd?: string): "upcoming" | "today" | "past" {
  const t = new Date().toISOString().slice(0, 10);
  const end = dEnd && dEnd > d ? dEnd : d;
  if (t >= d && t <= end) return "today";
  return end < t ? "past" : "upcoming";
}

/* ─── Featured Banner (horizontal snap scroll) ─── */
function FeaturedBanner({ events, meta }: { events: Event[]; meta: typeof catMeta }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(a => {
        const next = (a + 1) % events.length;
        const el = scrollRef.current;
        if (el) {
          el.scrollTo({ left: next * el.offsetWidth, behavior: "smooth" });
        }
        return next;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [events.length]);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setActive(idx);
  }

  return (
    <div className="space-y-3">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex overflow-x-auto gap-3 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:-mx-6 sm:px-6"
      >
        {events.map((ev, i) => {
          const g = meta[ev.category] ?? DEFAULT_META;
          const st = getStatus(ev.date, ev.date_end);
          return (
            <Link key={ev.id} href={`/event/${(ev as any).slug || ev.id}`} className="shrink-0 snap-center w-[88vw] sm:w-[520px]">
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer" style={{ height: 200 }}>
                {ev.image
                  ? <img src={ev.image} alt={ev.title || ev.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }} />
                }
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.1) 100%)" }} />

                <span className="absolute text-[10px] font-bold text-white" style={{ top: 10, left: 0, background: g.from, borderRadius: "0 6px 6px 0", padding: "4px 10px", boxShadow: "1px 2px 6px rgba(0,0,0,0.25)" }}>
                  {ev.category}
                </span>
                {st === "today" && (
                  <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-red-500 text-white animate-pulse">HARI INI</span>
                )}

                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                  <h3 className="font-extrabold text-white text-base leading-tight line-clamp-2 mb-2">{ev.title || ev.name}</h3>
                  <div className="flex items-end justify-between gap-2">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <p className="text-white/70 text-xs flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span className="truncate">{fmtDate(ev.date, ev.date_end)}</span>
                      </p>
                      <p className="text-white/60 text-xs flex items-start gap-1.5">
                        <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-tight">{ev.location}</span>
                      </p>
                    </div>
                    <span className={`font-extrabold text-sm shrink-0 ${ev.price === 0 ? "text-emerald-400" : "text-yellow-400"}`}>
                      {fmtPrice(ev.price)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {events.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {events.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActive(i);
                const el = scrollRef.current;
                if (el) el.scrollTo({ left: i * el.offsetWidth, behavior: "smooth" });
              }}
              className="rounded-full transition-all duration-300"
              style={{ width: i === active ? 20 : 5, height: 5, background: i === active ? "#fff" : "rgba(255,255,255,0.25)" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Past Event Card (grid card style) ─── */
function PastEventCard({ ev }: { ev: Event }) {
  const g = catMeta[ev.category] ?? DEFAULT_META;
  function fmtVisitors(v: number) {
    if (!v) return null;
    if (v >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
    return `${v}`;
  }
  const ig = ev.organizer_ig ? (ev.organizer_ig.startsWith("@") ? ev.organizer_ig : `@${ev.organizer_ig}`) : null;
  const visitors = fmtVisitors(ev.visitors);

  const igHandle = ig ? ig.replace("@", "") : null;
  const visitorsLabel = ev.visitors > 0
    ? (ev.visitors >= 1000 ? `${(ev.visitors / 1000).toFixed(ev.visitors % 1000 === 0 ? 0 : 1)}k` : `${ev.visitors}`)
    : "–";

  return (
    <div className="event-white-card bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Image — tidak bisa diklik */}
      <div className="relative overflow-hidden" style={{ paddingBottom: "60%" }}>
        {ev.image
          ? <img src={ev.image} alt={ev.title || ev.name} className="absolute inset-0 w-full h-full object-cover grayscale-[30%]" />
          : <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }} />
        }
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />

        <span className="absolute text-[9px] font-bold text-white top-0 left-0 px-2.5 py-1"
          style={{ background: g.from, borderRadius: "0 0 8px 0" }}>
          {ev.category}
        </span>

        <span className="absolute top-2 right-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-black/50 text-white/80 backdrop-blur-sm">
          SELESAI
        </span>

        {/* Jumlah pengunjung — selalu tampil */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
          <Users className="h-2.5 w-2.5" />{visitorsLabel} pengunjung
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="font-extrabold text-gray-800 text-sm leading-snug line-clamp-2 flex-1">
          {ev.title || ev.name}
        </h3>

        <div className="space-y-1.5">
          {ev.organizer && (
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}>
                <Users className="h-2 w-2 text-white" />
              </div>
              <span className="text-[11px] text-gray-500 font-semibold truncate">{ev.organizer}</span>
            </div>
          )}

          {/* Instagram — klik ke profil IG, satu-satunya elemen interaktif */}
          {ig && igHandle && (
            <a
              href={`https://instagram.com/${igHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 w-fit"
            >
              <Instagram className="h-3 w-3 text-pink-400 shrink-0" />
              <span className="text-[11px] text-pink-500 font-semibold truncate hover:underline">{ig}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Event Card ─── */
function EventCard({ ev, plain = false }: { ev: Event; plain?: boolean }) {
  const g  = catMeta[ev.category] ?? DEFAULT_META;
  const st = getStatus(ev.date, ev.date_end);

  return (
    <Link href={`/event/${(ev as any).slug || ev.id}`}>
      <div className="event-white-card group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ paddingBottom: "62%" }}>
          {ev.image
            ? <img src={ev.image} alt={ev.title || ev.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            : <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }} />
          }
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)" }} />

          <span className="absolute text-[10px] font-bold text-white" style={{ top: 10, left: 0, background: g.from, borderRadius: "0 6px 6px 0", padding: "4px 10px", boxShadow: "1px 2px 6px rgba(0,0,0,0.25)" }}>
            {ev.category}
          </span>
          {!plain && st === "today" && (
            <span className="absolute top-2.5 right-2.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-red-500 text-white shrink-0">HARI INI</span>
          )}

          <div className="absolute bottom-2.5 right-2.5">
            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-sm ${ev.price === 0 ? "bg-emerald-500/90 text-white" : "bg-black/60 text-yellow-400"}`}>
              {fmtPrice(ev.price)}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-extrabold text-gray-900 text-sm leading-tight line-clamp-2 mb-2 flex-1">
            {ev.title || ev.name}
          </h3>
          <div className="space-y-1 mb-3">
            <p className="text-gray-400 text-[11px] flex items-center gap-1.5">
              <Calendar className="h-3 w-3 shrink-0 text-gray-300" />
              <span className="truncate">{fmtDate(ev.date, ev.date_end)}</span>
            </p>
            <p className="text-gray-400 text-[11px] flex items-start gap-1.5">
              <MapPin className="h-3 w-3 shrink-0 text-gray-300 mt-0.5" />
              <span className="line-clamp-2 leading-tight">{ev.location}</span>
            </p>
          </div>
          <button
            className="w-full py-2 rounded-xl text-[11px] font-extrabold text-white flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
          >
            <><Ticket className="h-3 w-3" />Detail & Tiket</>
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ─── Main Page ─── */
export default function EventPage() {
  const [events, setEvents]   = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [catActive, setCat]   = useState("Semua");
  const [search, setSearch]   = useState("");
  const { matchesCity } = useCityFilter();

  const [ticketCode, setTicketCode]       = useState("");
  const [ticketResult, setTicketResult]   = useState<null | "not_found" | {
    order_code: string; event_name: string; ticket_name: string;
    qty: number; total_amount: number; status: "pending" | "confirmed" | "rejected";
    created_at: string; confirmed_at: string | null; buyer_name: string;
  }>(null);
  const [ticketSearching, setTicketSearching] = useState(false);
  const [codeCopied, setCodeCopied]       = useState(false);

  async function handleTicketSearch() {
    const code = ticketCode.trim().toUpperCase();
    if (!code) return;
    setTicketSearching(true);
    setTicketResult(null);
    try {
      const r = await fetch(`${API}/event-orders/status/${code}`);
      setTicketResult(r.ok ? await r.json() : "not_found");
    } catch { setTicketResult("not_found"); }
    setTicketSearching(false);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        const eventResponse = await fetch(`${API}/events`, { cache: "no-store" });
        const eventData = eventResponse.ok ? await eventResponse.json() : [];
        if (!cancelled) setEvents(Array.isArray(eventData) ? toSnake<Event[]>(eventData) : []);
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  const cityEvents = events.filter(e => matchesCity(e.location, "Garut"));
  const featured   = cityEvents.filter(e => e.featured && getStatus(e.date, e.date_end) !== "past");
  const todayCount = cityEvents.filter(e => getStatus(e.date, e.date_end) === "today").length;

  function matchesFilter(e: Event) {
    const matchCat    = catActive === "Semua" || e.category === catActive;
    const matchSearch = (e.title || e.name).toLowerCase().includes(search.toLowerCase()) ||
                        e.location.toLowerCase().includes(search.toLowerCase()) ||
                        e.organizer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }

  const activeEvents = cityEvents
    .filter(e => matchesFilter(e) && getStatus(e.date, e.date_end) !== "past")
    .sort((a, b) => {
      const stA = getStatus(a.date, a.date_end);
      const stB = getStatus(b.date, b.date_end);
      if (stA === "today" && stB !== "today") return -1;
      if (stB === "today" && stA !== "today") return 1;
      return a.date.localeCompare(b.date);
    });

  const pastEvents = cityEvents
    .filter(e => matchesFilter(e) && getStatus(e.date, e.date_end) === "past")
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Layout>
      <SEO
        title="Event & Festival Jawa Barat — Agenda Wisata Terkini"
        description="Jadwal lengkap event, festival budaya, konser, perlombaan, dan acara wisata di Jawa Barat."
        keywords="event jawa barat, festival jawa barat, agenda wisata jawa barat"
        path="/event"
      />
      <style>{`
        .event-white-card {
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12), 0 2px 5px rgba(15, 23, 42, 0.06);
        }
        .event-white-card:hover {
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.16), 0 4px 9px rgba(15, 23, 42, 0.08);
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">Event Jawa Barat</h1>
          <p className="text-gray-400 text-sm mt-0.5 mb-4">
            Swiss van Java · {events.length > 0 ? `${cityEvents.length} event tersedia` : "Jadwal acara terkini"}
          </p>

          {/* Search bar */}
          <div className="flex gap-2 mb-4">
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
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari event atau lokasi…"
                className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 font-medium bg-transparent py-3 px-1"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 mr-1">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                className="shrink-0 active:scale-95 transition-all rounded-xl flex items-center justify-center gap-1.5"
                style={{ background: "#0194f3", color: "#fff", boxShadow: "0 4px 12px rgba(1,148,243,0.35)", padding: "10px 12px" }}
              >
                <Search className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline text-sm font-bold">Cari</span>
              </button>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {categories.map(cat => {
              const Icon = cat.icon;
              const g    = catMeta[cat.label] ?? DEFAULT_META;
              const on   = catActive === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setCat(cat.label)}
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
                  style={on
                    ? { background: g.from, color: "#fff", boxShadow: `0 4px 12px -4px ${g.from}60` }
                    : { background: "#f3f4f6", color: "#6b7280" }
                  }
                >
                  <Icon className="h-3.5 w-3.5" />{cat.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ background: "#f8f9fc" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-28 md:pb-10 space-y-8">

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
            </div>
          )}

          {/* Featured */}
          {!loading && !search && catActive === "Semua" && featured.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full block" style={{ background: "linear-gradient(to bottom, #a855f7, #6d28d9)" }} />
                  <h2 className="font-extrabold text-gray-900 text-base">Event Unggulan</h2>
                </div>
                <span className="text-gray-400 text-xs font-semibold">{featured.length} event</span>
              </div>
              <FeaturedBanner events={featured} meta={catMeta} />
            </section>
          )}

          {/* Active Events Grid */}
          {!loading && (
            <section>
              {events.length === 0 ? (
                <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                    <Calendar className="h-8 w-8 text-[#0194f3]" strokeWidth={1.75} />
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900">Belum Ada Event</h2>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                    Belum ada event yang diinput saat ini. Halaman Event sudah terbuka dan siap menampilkan acara baru.
                  </p>
                </div>
              ) : cityEvents.length === 0 ? (
                <CityUnavailable accent="#0194f3" category="Event dan festival" />
              ) : activeEvents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Ticket className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="font-bold text-gray-500 text-sm">Belum ada event mendatang</p>
                  <p className="text-gray-400 text-xs mt-1">Pantau terus untuk info acara terbaru</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full block" style={{ background: "linear-gradient(to bottom, #0194f3, #0162a8)" }} />
                      <h2 className="font-extrabold text-gray-900 text-base">
                        Event Mendatang
                      </h2>
                      {todayCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">{todayCount} Hari Ini</span>
                      )}
                    </div>
                    <span className="text-gray-400 text-xs font-semibold">{activeEvents.length} event</span>
                  </div>
                   <div className="mobile-card-slider grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {activeEvents.map(ev => <EventCard key={ev.id} ev={ev} />)}
                  </div>
                </>
              )}
            </section>
          )}

          {/* ── Cek Status Tiket ── */}
          {!loading && (
            <section>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-4 border-b border-gray-50 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Search className="h-3.5 w-3.5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm">Cek Status Tiket</p>
                    <p className="text-gray-400 text-[11px]">Masukkan kode pesanan untuk melihat status tiketmu</p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ticketCode}
                      onChange={e => { setTicketCode(e.target.value.toUpperCase()); setTicketResult(null); }}
                      onKeyDown={e => e.key === "Enter" && handleTicketSearch()}
                      placeholder="Kode pesanan (NGT-...)"
                      className="flex-1 border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder-gray-300 font-mono uppercase tracking-wider"
                    />
                    <button
                      onClick={handleTicketSearch}
                      disabled={!ticketCode.trim() || ticketSearching}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                    >
                      {ticketSearching
                        ? <RefreshCw className="h-4 w-4 animate-spin" />
                        : <Search className="h-4 w-4" />
                      }
                    </button>
                  </div>

                  {ticketResult === "not_found" && (
                    <p className="text-red-500 text-xs flex items-center gap-1.5 font-semibold">
                      <XCircle className="h-3.5 w-3.5 shrink-0" /> Kode pesanan tidak ditemukan
                    </p>
                  )}

                  {ticketResult && ticketResult !== "not_found" && (
                    <div className={`rounded-xl border overflow-hidden ${
                      ticketResult.status === "confirmed" ? "border-emerald-200"
                      : ticketResult.status === "rejected" ? "border-red-200"
                      : "border-amber-200"
                    }`}>
                      <div className={`h-1 w-full ${
                        ticketResult.status === "confirmed" ? "bg-emerald-500"
                        : ticketResult.status === "rejected" ? "bg-red-400"
                        : "bg-amber-400"
                      }`} />
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-extrabold text-gray-900 text-sm line-clamp-1">{ticketResult.event_name}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{ticketResult.ticket_name} · {ticketResult.qty} orang</p>
                          </div>
                          {ticketResult.status === "confirmed" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 shrink-0">
                              <CheckCircle2 className="h-3 w-3" /> Dikonfirmasi
                            </span>
                          ) : ticketResult.status === "rejected" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 shrink-0">
                              <XCircle className="h-3 w-3" /> Ditolak
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 shrink-0">
                              <Clock className="h-3 w-3" /> Menunggu
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                          <div>
                            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide">Kode Pesanan</p>
                            <p className="font-mono font-extrabold text-gray-900 text-sm tracking-widest">{ticketResult.order_code}</p>
                          </div>
                          <button onClick={() => copyCode(ticketResult.order_code)}
                            className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${codeCopied ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
                            {codeCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            {codeCopied ? "Tersalin" : "Salin"}
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {new Date(ticketResult.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                          <span className="font-bold text-indigo-700">
                            {ticketResult.total_amount === 0 ? "Gratis" : `Rp${Number(ticketResult.total_amount).toLocaleString("id")}`}
                          </span>
                        </div>

                        {ticketResult.status === "pending" && (
                          <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
                            <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-amber-700 text-[11px] leading-relaxed">
                              Tim Nempo Organizer sedang memeriksa bukti pembayaranmu. Tiket akan dikirim ke WhatsApp/email setelah dikonfirmasi.
                            </p>
                          </div>
                        )}
                        {ticketResult.status === "confirmed" && (
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-emerald-700 text-[11px] leading-relaxed">
                              Tiket sudah dikirimkan ke WhatsApp/email kamu.
                              {ticketResult.confirmed_at && ` Dikonfirmasi ${new Date(ticketResult.confirmed_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}.`}
                            </p>
                          </div>
                        )}
                        {ticketResult.status === "rejected" && (
                          <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-red-700 text-[11px] leading-relaxed">
                              Pesananmu tidak dapat dikonfirmasi.{" "}
                              <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="font-bold underline">
                                Hubungi admin Nempo Organizer via DM Instagram
                              </a>{" "}
                              untuk info lebih lanjut.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* CTA */}
          {!loading && (
            <section>
              <div className="rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)" }}>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-2xl" style={{ background: "#818cf8", transform: "translate(30%, -30%)" }} />
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-5 relative z-10">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", boxShadow: "0 8px 20px -4px rgba(245,158,11,0.5)" }}>
                    <Megaphone className="h-6 w-6 text-amber-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-white text-sm">Ingin Mengadakan Event?</p>
                    <p className="text-white/45 text-xs mt-0.5 leading-relaxed">Kami siap bantu wujudkan acara impianmu bersama Nempo Organizer.</p>
                  </div>
                  <Link href="/price-list" className="shrink-0">
                    <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-extrabold text-xs text-amber-900 transition-all hover:brightness-95 active:scale-95"
                      style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", boxShadow: "0 4px 12px -2px rgba(245,158,11,0.4)" }}>
                      Lihat Pricelist <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Past Events */}
          {!loading && pastEvents.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-5 rounded-full block bg-gray-300" />
                <h2 className="font-extrabold text-gray-500 text-base">Event Selesai</h2>
                <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">{pastEvents.length}</span>
              </div>
               <div className="mobile-card-slider grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {pastEvents.map(ev => <PastEventCard key={ev.id} ev={ev} />)}
              </div>
            </section>
          )}

        </div>
      </div>
    </Layout>
  );
}
