import { Link, useLocation } from "@/lib/wouter";
import { useState, useEffect, useRef } from "react";
import { Home, Compass, Calendar, Newspaper, Ticket, User, Bell, Search, X, ChevronDown, MapPin, LockKeyhole, Utensils, Trophy, Car, Backpack, BookOpen, Globe, MessageCircle, Phone, Mail, Instagram, ChevronRight as ChevronRightIcon, ChevronLeft, Leaf, Route, Send, Bot, AlertTriangle, Wallet, Music, ArrowLeft, Heart, Crown, Coffee, Mountain, Users, Zap, Lightbulb, Shield, Flame, HeartPulse, Anchor, Building2, Handshake, Stethoscope, Play, Pause, Volume2, Award, Droplet, ClipboardList, Shirt, Gift, ChefHat } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import { useJingle, JINGLE_TRACK } from "@/contexts/jingle-context";
import { useAuth } from "@/contexts/auth-context";
import { ALL_CITIES, CITY_OPTIONS, useCityFilter, type CityName } from "@/contexts/city-filter-context";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import { mainNavItems } from "@/data/main-nav-items";
import { bottomNavItems } from "@/data/bottom-nav-items";
import { GREET_MSG, botReply, type ChatMsg } from "@/data/buddy-chat";
import {
  NavAdventureIcon,
  NavBeritaIcon,
  NavCafeIcon,
  NavCeritaIcon,
  NavDigiIcon,
  NavEventIcon,
  NavHomeIcon,
  NavHotelIcon,
  NavInfluencerIcon,
  NavJajanIcon,
  NavKerjaSamaIcon,
  NavKulinerIcon,
  NavKomunitasIcon,
  NavMerchandiseIcon,
  NavSponsorshipIcon,
  NavTalentIcon,
  NavTicketIcon,
  NavTravelIcon,
  NavWisataIcon,
} from "@/components/navigation-glyphs";

import { BookOpenText } from "lucide-react";

const megaMendungLineMotif = `${import.meta.env.BASE_URL}images/mega-mendung-line-motif.png`;
const APP_FRAME_SESSION_KEY = "nempo_app_frame";

function getAppFrameMode() {
  if (typeof window === "undefined") return false;

  const appParam = new URLSearchParams(window.location.search).get("app");
  try {
    if (appParam === "1") {
      window.sessionStorage.setItem(APP_FRAME_SESSION_KEY, "1");
      return true;
    }
    if (appParam !== null) {
      window.sessionStorage.removeItem(APP_FRAME_SESSION_KEY);
      return false;
    }
    return window.sessionStorage.getItem(APP_FRAME_SESSION_KEY) === "1";
  } catch {
    return appParam === "1";
  }
}


function CityPicker({ mobile = false, compact = false }: { mobile?: boolean; compact?: boolean }) {
  const { selectedCity, setSelectedCity, isCityAvailable } = useCityFilter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  const label = selectedCity === ALL_CITIES ? "Jawa Barat" : selectedCity;
  const filteredCities = CITY_OPTIONS
    .filter((city) => {
      if (!search.trim()) return true;
      const query = search.trim().toLowerCase();
      return city.toLowerCase().includes(query) || (city === ALL_CITIES && "semua area".includes(query));
    })
    .sort((a, b) => {
      const aAvailable = a === ALL_CITIES || isCityAvailable(a);
      const bAvailable = b === ALL_CITIES || isCityAvailable(b);
      return Number(bAvailable) - Number(aAvailable);
    });

  const chooseCity = (city: CityName) => {
    setSelectedCity(city);
    setSearch("");
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={pickerRef} className={
      compact
        ? "relative block shrink-0 md:hidden"
        : mobile
          ? "w-full"
          : "relative hidden md:block shrink-0 ml-5"
    }>
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? "city-picker-options" : undefined}
        aria-label={`Lokasi saat ini: ${label}. Pilih kota`}
         style={compact || !mobile ? { background: "rgba(255,255,255,0.15)" } : undefined}
        className={compact
          ? "group flex h-9 max-w-[132px] items-center gap-1.5 rounded-xl border border-white/20 bg-white/12 px-2 text-left text-white transition-all hover:border-white/35 hover:bg-white/20"
          : mobile
          ? "group w-full flex items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 px-3.5 py-3 text-left transition-all hover:border-blue-200 hover:shadow-sm"
          : "group flex h-11 items-center gap-2.5 rounded-2xl border border-white/20 bg-white/12 px-3.5 text-left text-white transition-all hover:border-white/35 hover:bg-white/20"
        }
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className={compact
            ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white"
            : mobile
            ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#0194f3] shadow-sm"
            : "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white transition-colors group-hover:bg-white/25"
          }>
            <MapPin className={compact ? "h-3.5 w-3.5" : mobile ? "h-4 w-4" : "h-3.5 w-3.5"} />
          </span>
          {compact ? (
            <span className="min-w-0 truncate whitespace-nowrap text-[11px] font-extrabold leading-tight text-white">{label}</span>
          ) : (
            <span className="min-w-0">
              <span className={mobile
              ? "block text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-500"
              : "block text-[9px] font-bold uppercase tracking-[0.14em] text-white/65"
              }>
                Lokasi kamu
              </span>
              <span className={mobile
              ? "block max-w-[220px] whitespace-normal break-words text-sm font-extrabold leading-tight text-gray-800"
              : "block max-w-[145px] truncate text-xs font-extrabold text-white"
              }>
                {label}
              </span>
            </span>
          )}
        </span>
        <ChevronDown className={`shrink-0 transition-transform duration-200 ${compact ? "h-3.5 w-3.5 text-white/75" : "h-4 w-4"} ${open ? "rotate-180" : ""} ${mobile ? "text-blue-400" : "text-white/75"}`} />
      </button>

      {open && (
        <div
          id="city-picker-options"
          role="listbox"
          aria-label="Daftar kota dan area Jawa Barat"
          className={compact
            ? "fixed left-3 right-3 top-[calc(4rem+env(safe-area-inset-top))] z-[60] max-h-[calc(100dvh-84px)] overflow-hidden rounded-2xl border border-gray-100 bg-white text-gray-700 shadow-2xl shadow-blue-950/15"
            : mobile
            ? "mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg"
            : "absolute left-0 top-full z-[60] mt-2 w-[304px] overflow-hidden rounded-2xl border border-gray-100 bg-white text-gray-700 shadow-2xl shadow-blue-950/15"
          }
        >
          <div className="border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-white px-3.5 pb-3 pt-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-extrabold text-gray-800">Jelajahi Jawa Barat</p>
                <p className="mt-0.5 text-[11px] font-medium text-gray-400">Pilih area untuk menyesuaikan rekomendasi</p>
              </div>
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-2 transition-colors focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
              <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari kota atau kabupaten..."
                aria-label="Cari kota"
                className="min-w-0 flex-1 bg-transparent text-xs font-medium text-gray-700 outline-none placeholder:text-gray-400"
                autoFocus={!mobile}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Hapus pencarian kota"
                  className="rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          <div className={compact ? "max-h-[calc(100dvh-300px)] overflow-y-auto p-2" : "max-h-64 overflow-y-auto p-2"} style={{ scrollbarWidth: "thin" }}>
            {filteredCities.length > 0 ? filteredCities.map((city) => {
              const selected = selectedCity === city;
              const isAll = city === ALL_CITIES;
              const available = isAll || isCityAvailable(city);
              return (
                <button
                  key={city}
                  type="button"
                  disabled={!available}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={!available}
                  onClick={() => chooseCity(city)}
                  className={`group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-all ${
                    !available
                      ? "cursor-not-allowed bg-gray-50/70 text-gray-400 opacity-70"
                      : selected
                        ? "bg-blue-50 text-[#0172B1]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    !available
                      ? "bg-gray-100 text-gray-400"
                      : selected
                        ? "bg-blue-100 text-[#0194f3]"
                        : isAll
                          ? "bg-gray-100 text-gray-400"
                          : "bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-400"
                  }`}>
                    {available ? <MapPin className="h-3.5 w-3.5" /> : <LockKeyhole className="h-3.5 w-3.5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block whitespace-normal break-words text-xs leading-snug ${selected ? "font-extrabold" : "font-semibold"}`}>
                      {isAll ? "Semua Jawa Barat" : city}
                    </span>
                    <span className={`block whitespace-normal break-words text-[10px] leading-snug font-medium ${
                      available ? "text-gray-400" : "text-amber-600"
                    }`}>
                      {isAll ? "Tampilkan semua rekomendasi" : available ? "Kota / kabupaten" : "Segera hadir"}
                    </span>
                  </span>
                  {!available ? (
                    <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-600">
                      Belum ada data
                    </span>
                  ) : selected && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0194f3] text-[11px] font-black text-white">✓</span>
                  )}
                </button>
              );
            }) : (
              <div className="px-3 py-7 text-center">
                <Search className="mx-auto h-5 w-5 text-gray-300" />
                <p className="mt-2 text-xs font-bold text-gray-600">Area tidak ditemukan</p>
                <p className="mt-0.5 text-[10px] text-gray-400">Coba kata kunci lain</p>
              </div>
            )}
          </div>
          <div className="border-t border-gray-100 bg-gray-50/70 px-3.5 py-2">
            <p className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
              <LockKeyhole className="h-3 w-3 text-amber-500" />
              Kota bertanda <span className="font-bold text-amber-600">Belum ada data</span> belum bisa dipilih
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

type BuddyMode = "home" | "chat" | "budget" | "jingle" | "sos";

function fmtTime(sec: number) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const SOS_GROUPS = [
  {
    id: "kepolisian", label: "Kepolisian", icon: Car, col: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE",
    contacts: [
      { name: "Polres Garut", number: "110" },
      { name: "Taros Kapolres Garut", number: "0811-1340-4040" },
      { name: "Polsek Kadungora", number: "(0262) 455110" },
      { name: "Polsek Pasirwangi", number: "(0262) 233027" },
      { name: "Polsek Karangpawitan", number: "(0262) 442666" },
      { name: "Polsek Leles", number: "(0262) 456110" },
      { name: "Polsek Wanaraja", number: "(0262) 44110" },
      { name: "Polsek Tarogong Kidul", number: "(0262) 232198" },
      { name: "Polsek Malangbong", number: "(0262) 421110" },
      { name: "Polsek Cilawu", number: "(0262) 233739" },
      { name: "Polsek Samarang", number: "(0262) 542266" },
      { name: "Polsek Pameungpeuk", number: "(0262) 521110" },
      { name: "Polsek Bayongbong", number: "(0262) 233181" },
      { name: "Polsek Garut Kota", number: "(0262) 232198" },
      { name: "Polsek Limbangan", number: "(0262) 431110" },
      { name: "Polsek Cibatu", number: "(0264) 202241" },
      { name: "Polsek Cisompet", number: "(0262) 513110" },
    ],
  },
  {
    id: "tni", label: "TNI", icon: Award, col: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0",
    contacts: [
      { name: "Korem 062/Tarumanagara", number: "(0262) 832302" },
      { name: "Kodim 0611/Garut", number: "(0262) 2800119" },
    ],
  },
  {
    id: "pmi", label: "PMI", icon: Droplet, col: "#DC2626", bg: "#FEF2F2", border: "#FECACA",
    contacts: [
      { name: "Markas PMI Garut", number: "(0262) 235118" },
      { name: "UPTD PMI Garut", number: "0262-233672" },
      { name: "WA Donor Darah", number: "081223089447" },
      { name: "Kantor Markas PMI Kab Garut", number: "(0262) 235118" },
    ],
  },
  {
    id: "psc119", label: "PSC 119", icon: Stethoscope, col: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE",
    contacts: [
      { name: "Hotline PSC 119", number: "082118117119" },
    ],
  },
  {
    id: "bpjs", label: "Layanan Informasi & Pengaduan BPJS", icon: ClipboardList, col: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE",
    contacts: [
      { name: "Whatsapp", number: "+628118165165" },
      { name: "Phone", number: "165" },
    ],
  },
  {
    id: "satpolpp", label: "Satpol PP", icon: Shield, col: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE",
    contacts: [
      { name: "Tim Reaksi Cepat Satpol PP", number: "+6285223688500" },
    ],
  },
  {
    id: "ppa", label: "Perlindungan Perempuan dan Anak", icon: Users, col: "#DB2777", bg: "#FDF2F8", border: "#FBCFE8",
    contacts: [
      { name: "Hotline Perlindungan Perempuan dan Anak", number: "+62821-3018-2192" },
    ],
  },
  {
    id: "bpbd", label: "BPBD", icon: AlertTriangle, col: "#EA580C", bg: "#FFF7ED", border: "#FED7AA",
    contacts: [
      { name: "Call Center BPBD Garut", number: "0852 2061 1117" },
    ],
  },
  {
    id: "damkar", label: "Pemadam Kebakaran", icon: Flame, col: "#1E3A8A", bg: "#EFF6FF", border: "#BFDBFE",
    contacts: [
      { name: "Call center Damkar Garut", number: "113" },
      { name: "Whatsapp", number: "+628112331113" },
      { name: "Kantor Damkar Garut (Mako)", number: "(0262) 232113" },
      { name: "Limbangan", number: "(0262) 431113" },
      { name: "Bungbulang", number: "(0262) 2816175" },
      { name: "Pameungpeuk", number: "(0262) 521113" },
      { name: "Leles", number: "(0262) 2851291" },
      { name: "Malangbong", number: "(0262) 2820803" },
      { name: "Cikajang", number: "(0262) 2810606" },
    ],
  },
];

export function Layout({ children, hideBottomNav, minimalChrome }: { children: React.ReactNode; hideBottomNav?: boolean; minimalChrome?: boolean }) {
  const [location, navigate] = useLocation();
  const isAppFrame = getAppFrameMode();
  const { user, mitra } = useAuth();
  const { selectedCity } = useCityFilter();
  const [mobileSearch, setMobileSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState<{ id: number; title: string; message: string; type: string; href: string; created_at: string }[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifRead, setNotifRead] = useState(false);
  const [csOpen, setCsOpen] = useState(false);
  const [csVisible, setCsVisible] = useState(false);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([GREET_MSG]);
  const [chatInput, setChatInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [buddyMode, setBuddyMode] = useState<BuddyMode>("home");
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [sosOpenGroup, setSosOpenGroup] = useState<string | null>(null);
  const jingle = useJingle();
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (href: string) => {
    const [path, hash] = href.split("#", 2);
    const currentPath = location.split(/[?#]/, 1)[0];
    const pathIsActive = path === "/"
      ? currentPath === "/"
      : currentPath === path || currentPath.startsWith(`${path}/`);

    if (!pathIsActive || !hash) return pathIsActive;
    return typeof window !== "undefined" && window.location.hash === `#${hash}`;
  };
  const scrollToMenuSection = (href: string) => {
    const [path, hash] = href.split("#", 2);
    const currentPath = location.split(/[?#]/, 1)[0];
    if (!hash || path !== currentPath) return;

    window.setTimeout(() => {
      document.getElementById(decodeURIComponent(hash))?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const readDate = localStorage.getItem("notif_read_date");
    if (readDate === today) setNotifRead(true);
    let cancelled = false;
    fetch("/api/notifications")
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (!cancelled) setNotifications(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [location]);

  const hasNotif = notifications.length > 0 && !notifRead;

  function openNotifPanel() {
    setNotifOpen(true);
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem("notif_read_date", today);
    setNotifRead(true);
  }

  const notifTypeStyle: Record<string, { bg: string; dot: string; border: string; label: string; text: string }> = {
    info:    { bg: "bg-blue-50",   dot: "bg-blue-500",   border: "#3b82f6", label: "Informasi", text: "text-blue-600" },
    update:  { bg: "bg-violet-50", dot: "bg-violet-500", border: "#8b5cf6", label: "Update", text: "text-violet-600" },
    promo:   { bg: "bg-blue-50",  dot: "bg-blue-500",  border: "#0194f3", label: "Promo", text: "text-[#0194f3]" },
    event:   { bg: "bg-teal-50",   dot: "bg-teal-500",   border: "#14b8a6", label: "Event", text: "text-teal-600" },
    warning: { bg: "bg-red-50",    dot: "bg-red-500",    border: "#ef4444", label: "Peringatan", text: "text-red-600" },
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setCsVisible(false);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setCsVisible(true), 1500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMsgs]);

  const sendChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMsg = { from: "user", text: trimmed };
    const reply = botReply(trimmed);
    setChatMsgs((prev) => [...prev, userMsg]);
    setChatInput("");
    setBotTyping(true);
    setTimeout(() => {
      setBotTyping(false);
      setChatMsgs((prev) => [...prev, reply]);
    }, 900);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#f8fafc] flex flex-col">
      {/* ── Desktop Top Navigation ── */}
      {!minimalChrome && <header className={`relative w-full z-50 md:sticky md:top-0 transition-all duration-300 ${scrolled ? "shadow-lg" : "shadow-none"}`}
        style={{
          paddingTop: isAppFrame ? 0 : "env(safe-area-inset-top)",
          background: "linear-gradient(135deg, #0172B1 0%, #0194f3 80%, #1BA0E2 100%)",
        }}>
        {/* Top bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className={`flex items-center justify-between ${isAppFrame ? "h-12 sm:h-16" : "h-16"}`}>
            {/* Logo */}
            <Link href="/" aria-label="NEMPO" className="flex items-center gap-2.5 shrink-0 group">
              <img
                src={`${import.meta.env.BASE_URL}Assets/Logo/nempo-new.webp`}
                alt="NEMPO"
                style={{ height: isAppFrame ? 28 : 36, width: isAppFrame ? 28 : 36, objectFit: "contain", filter: "brightness(0) invert(1)", flexShrink: 0 }}
              />
              <div className="flex" style={{ flexDirection: "column", lineHeight: 1 }}>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
                  fontWeight: 900, fontSize: 16,
                  color: "#ffffff",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                }}>
                  NEMPO
                </span>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
                  fontWeight: 600, fontSize: 9,
                  color: "rgba(255,255,255,0.65)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginTop: 1,
                  whiteSpace: "nowrap",
                }}>
                  ORGANIZER
                </span>
              </div>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Kala Muda Community badge */}
              <Link
                href="/komunitas"
                aria-label="Kala Muda Community"
                title="Kala Muda Community"
                className={`hidden sm:inline-flex items-center gap-1.5 rounded-full transition-colors hover:bg-white/25 ${
                  isAppFrame ? "h-7 px-2.5" : "h-8 px-3"
                }`}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
                  fontWeight: 800,
                  fontSize: isAppFrame ? 10 : 11,
                  letterSpacing: "-0.01em",
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                }}
              >
                <Users className={isAppFrame ? "h-3 w-3" : "h-3.5 w-3.5"} />
                Kala Muda Community
              </Link>
              <div className="relative">
                <button
                   className={`relative ${isAppFrame ? "h-8 w-8" : "h-9 w-9"} rounded-2xl flex items-center justify-center transition-colors overflow-visible hover:bg-white/20`}
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
                  onClick={openNotifPanel}
                >
                   <Bell className={`${isAppFrame ? "h-4 w-4" : "h-[18px] w-[18px]"} text-white ${hasNotif ? "animate-bounce" : ""}`} />
                  {hasNotif && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-400 rounded-full animate-pulse"
                      style={{ boxShadow: `0 0 0 2px #0194f3` }}
                    />
                  )}
                </button>

                {/* ── Notification Panel ── */}
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-[68px] sm:top-11 z-50 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mx-auto sm:mx-0"
                      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
                        style={{ background: "linear-gradient(135deg, #001E6E 0%, #0194f3 100%)" }}>
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-white" />
                          <span className="text-white font-bold text-sm">Notifikasi</span>
                          {notifications.length > 0 && (
                            <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {notifications.length}
                            </span>
                          )}
                        </div>
                        <button onClick={() => setNotifOpen(false)} className="text-white/70 hover:text-white">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="max-h-[60vh] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                            <Bell className="h-10 w-10 mb-2 opacity-30" />
                            <p className="text-sm font-medium">Tidak ada notifikasi</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-50">
                            {notifications.map(n => {
                              const style = notifTypeStyle[n.type] ?? notifTypeStyle.info;
                              return (
                                <Link key={n.id} href={n.href} onClick={() => setNotifOpen(false)}
                                  className={`block px-4 py-3 border-l-4 ${style.bg} transition hover:brightness-[0.985]`}
                                  style={{ borderLeftColor: style.border }}>
                                  <div className="flex items-start gap-2">
                                    <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${style.dot}`} />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <span className="font-bold text-gray-800 text-xs leading-tight">{n.title}</span>
                                        <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                                          {new Date(n.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                                        </span>
                                      </div>
                                      <p className="text-gray-600 text-xs leading-relaxed">{n.message}</p>
                                      <span className={`mt-1.5 inline-flex items-center gap-0.5 text-[10px] font-bold ${style.text}`}>
                                        {style.label}
                                        <ChevronRightIcon className="h-3 w-3" />
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                        <Link href="/notifikasi" onClick={() => setNotifOpen(false)}
                          className="flex items-center justify-center gap-0.5 text-[10px] font-bold text-[#0194f3] hover:underline">
                          Buka halaman notifikasi
                          <ChevronRightIcon className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Donasi Bibit icon button — hidden */}
              {/* <Link href="/donasi-bibit">
                <div className="relative group cursor-pointer">
                  <button className="relative flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-2xl transition-all hover:scale-105 active:scale-95" style={{ background: "#fff", color: "#166534", boxShadow:"0 2px 8px rgba(0,0,0,0.12)", border: "1.5px solid #dcfce7" }}>
                    <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center justify-center">
                      <DotLottieReact
                        src={`${import.meta.env.BASE_URL}animations/tree-green.json`}
                        loop
                        autoplay
                        style={{ width: 28, height: 28 }}
                      />
                    </span>
                    <span className="hidden sm:block text-xs font-bold tracking-tight whitespace-nowrap text-green-700">Donasi Bibit</span>
                  </button>
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 flex items-center justify-center" style={{ boxShadow: `0 0 0 2px #ffffff` }}>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                  </span>
                  <div className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                    🌳 Donasi Bibit untuk Jawa Barat Hijau
                    <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 rotate-45" />
                  </div>
                </div>
              </Link> */}

              {(mitra || user) && (
                <Link href={mitra ? "/mitra-dashboard" : "/profile"}>
                  <button className="hidden sm:flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-2xl transition-all hover:bg-white/90"
                    style={{ background: "white", color: "#0172B1", boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
                    <User className="h-3.5 w-3.5" />
                    {mitra ? (mitra.business_name || mitra.username) : user ? user.name.split(" ")[0] : ""}
                  </button>
                </Link>
              )}
              <button className={`md:hidden ${isAppFrame ? "h-8 w-8" : "h-9 w-9"} rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors`}
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <div className="flex flex-col gap-[5px] items-center w-5">
                  <span className={`h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${mobileMenuOpen ? "w-5 rotate-45 translate-y-[7px]" : "w-5"}`} />
                  <span className={`h-[2px] bg-white rounded-full transition-all duration-200 ${mobileMenuOpen ? "w-0 opacity-0" : "w-3.5"}`} />
                  <span className={`h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${mobileMenuOpen ? "w-5 -rotate-45 -translate-y-[7px]" : "w-5"}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop secondary nav */}
        <div className="hidden md:block" style={{ background: "linear-gradient(to bottom, #f8faff 0%, #f0f4ff 100%)", borderTop: "1px solid rgba(0,100,210,0.08)" }}>
          <div className="max-w-7xl mx-auto px-3 lg:px-8">
            <div className="flex items-center h-12">
              {/* Scrollable nav pills */}
              <div className="flex items-center gap-0.5 lg:gap-1 flex-1 min-w-0 overflow-x-auto h-full" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>

                {/* Category pills */}
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => scrollToMenuSection(item.href)} className="shrink-0">
                      <div
                        className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer select-none whitespace-nowrap"
                        style={active
                          ? { background: item.color, color: "#fff", boxShadow: `0 3px 10px ${item.color}50` }
                          : { color: "#64748b" }
                        }
                        onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = item.bg; (e.currentTarget as HTMLElement).style.color = item.color; } }}
                        onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "#64748b"; } }}
                      >
                        <div
                          className="h-5 w-5 rounded-md flex items-center justify-center shrink-0"
                          style={{ background: active ? "rgba(255,255,255,0.25)" : item.bg }}
                        >
                          <Icon className="h-3.5 w-3.5" style={{ color: active ? "#fff" : item.color }} />
                        </div>
                        {item.label}
                      </div>
                    </Link>
                  );
                })}

              </div>

            </div>
          </div>
        </div>

        {/* Mobile menu slide-down */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white shadow-lg animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 mb-3 focus-within:border-blue-400 focus-within:bg-white transition-all">
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={mobileSearch}
                  onChange={e => setMobileSearch(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && mobileSearch.trim()) {
                      navigate(`/cari?q=${encodeURIComponent(mobileSearch.trim())}`);
                      setMobileMenuOpen(false);
                    }
                  }}
                  placeholder="Cari destinasi, kuliner, event..."
                  className="bg-transparent flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
                />
                {mobileSearch ? (
                  <button
                    onClick={() => {
                      if (mobileSearch.trim()) {
                        navigate(`/cari?q=${encodeURIComponent(mobileSearch.trim())}`);
                        setMobileMenuOpen(false);
                      }
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white"
                    style={{ background: "#0194f3" }}
                  >
                    Cari
                  </button>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      scrollToMenuSection(item.href);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(item.href) ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              {(mitra || user) && (
                <Link href={mitra ? "/mitra-dashboard" : "/profile"} onClick={() => setMobileMenuOpen(false)}>
                  <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors">
                    {mitra ? (mitra.business_name || mitra.username) : user ? user.name.split(" ")[0] : ""}
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>}

      {/* ── Page Content ── */}
      <main key={location} className={`flex-1 w-full ${minimalChrome || isAppFrame ? "pb-20 md:pb-0" : "pb-0"} animate-in fade-in duration-300 overflow-x-clip`}>
        {children}
      </main>

      {/* ── Footer ── */}
      {!minimalChrome && <footer className="relative overflow-hidden text-white" style={{ background: "linear-gradient(145deg, #0172B1 0%, #0194f3 55%, #1BA0E2 100%)" }}>
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="nempo-footer-shell max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pt-12 md:pb-8">
          <div className="grid grid-cols-1 gap-8 mb-8 md:mb-10 md:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] md:items-stretch md:gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/Assets/Logo/nempo-new.webp" alt="Nempo Garut" className="h-10 w-10 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
                <div className="flex flex-col leading-none gap-[1px]">
                  <span className="font-black text-[17px]" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
                    Nempo Garut
                  </span>
                  <span className="font-bold text-[9.5px] tracking-[0.22em] uppercase" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: "rgba(255,255,255,0.7)" }}>
                    ORGANIZER
                  </span>
                </div>
              </div>
              <p className="text-white/55 text-sm leading-relaxed mb-5 max-w-md">
                Tim kreatif yang menggarap acara, konten, dan brand lewat karya serta kolaborasi yang berdampak.
                Ceritakan kebutuhanmu, kami bantu susun konsep, bentuk, sampai pelaksanaannya.
              </p>
              {/* Mobile: 4 icon-only buttons | Desktop: 2-col cards with text */}
              <div className="flex gap-2 md:hidden mt-1">
                <a href="https://instagram.com/nempo.id" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </div>
                </a>
                <a href="https://tiktok.com/@nempo.id" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                  <div className="h-8 w-8 rounded-xl bg-black flex items-center justify-center border border-white/10">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/></svg>
                  </div>
                </a>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-2.5 mt-1">
                {/* Instagram */}
                <a href="https://instagram.com/nempo.id" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
                  <div className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
                    <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-white/40 leading-none mb-0.5">Instagram</p>
                    <p className="text-xs font-bold text-white/80 truncate">@nempo.id</p>
                  </div>
                </a>
                {/* TikTok */}
                <a href="https://tiktok.com/@nempo.id" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
                  <div className="h-7 w-7 rounded-xl bg-black flex items-center justify-center shrink-0 border border-white/10">
                    <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-white/40 leading-none mb-0.5">TikTok</p>
                    <p className="text-xs font-bold text-white/80 truncate">@nempo.id</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="hidden min-h-[220px] flex-col justify-between rounded-[2rem] border border-white/15 bg-white/[0.08] p-6 shadow-[0_18px_50px_rgba(0,40,100,0.12)] md:flex">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Bikin bareng Nempo</p>
                <h3 className="mt-3 max-w-sm text-2xl font-black leading-tight tracking-[-0.04em] text-white">
                  Wujudkan acara dan kontenmu bareng Nempo.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                  Wedding, event, konten sosmed, website, dan desain — kami kerjakan dari konsep sampai hari-H.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {["Wedding", "Event", "Konten", "Website"].map((label) => (
                  <span key={label} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white/75">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div
            className="border-t border-white/20 pt-5 text-center"
          >
            <span className="text-white/50 text-xs">&copy; 2025 Nempo Organizer. Hak Cipta Dilindungi.</span>
          </div>
        </div>
      </footer>}

      {/* ── Mobile Bottom Navigation ── */}
      {!minimalChrome && !hideBottomNav && (() => {
        const navActiveColor = "#0194f3";
        return (
          <nav
            className={`md:hidden fixed bottom-0 left-0 right-0 z-50 ${isAppFrame ? "nempo-app-frame-bottom-nav" : ""}`}
            style={{
              background: "linear-gradient(to top, rgba(244,248,252,0.92), rgba(244,248,252,0))",
              padding: `8px 12px ${isAppFrame ? "max(8px, env(safe-area-inset-bottom))" : "max(10px, env(safe-area-inset-bottom))"}`,
            }}
          >
            <div className="mx-auto flex max-w-md items-center justify-around gap-1 rounded-[22px] border border-[#e5edf4] bg-white/95 px-1.5 py-1.5 shadow-[0_10px_28px_rgba(21,48,74,0.14)] backdrop-blur-xl">
              {bottomNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                    className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-0.5 py-1 select-none transition-transform duration-200 active:scale-[0.96]"
                    style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation", gap: 4 }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 38,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "transparent",
                        transform: active ? "scale(1.08)" : "none",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <Icon
                        style={{
                          width: active ? 32 : 30,
                          height: active ? 32 : 30,
                          color: active ? navActiveColor : "#29465f",
                          strokeWidth: 2.2,
                          transition: "color 0.2s ease, width 0.2s ease, height 0.2s ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: active ? 700 : 500,
                        color: active ? navActiveColor : "#44586d",
                        letterSpacing: "0.01em",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        transition: "color 0.2s ease, font-weight 0.2s ease",
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        );
      })()}

      {/* Overlay for dropdowns */}
      {!minimalChrome && mobileMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ── Floating CS Button (side-mounted) ── */}
      {!minimalChrome && <div className="fixed right-0 bottom-32 md:bottom-20 z-50 flex flex-col items-end">
        {/* Popup panel */}
        {csOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => { setCsOpen(false); setBuddyMode("home"); setSelectedBudget(null); }} />
            <div className="relative z-50 mr-3 mb-3 w-80 max-w-[calc(100vw-1.5rem)] bg-white rounded-3xl shadow-2xl shadow-black/20 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-200 flex flex-col max-h-[calc(100dvh-16rem)] md:max-h-[calc(100dvh-9rem)]">

              {/* ── Header ── */}
              <div className={`px-4 py-3.5 flex items-center justify-between relative overflow-hidden shrink-0 ${
                buddyMode === "sos"
                  ? "bg-gradient-to-r from-red-700 to-rose-500"
                  : buddyMode === "jingle"
                  ? "bg-gradient-to-r from-pink-600 to-orange-400"
                     : buddyMode === "budget"
                  ? "bg-gradient-to-r from-blue-500 to-[#1BA0E2]"
                   : buddyMode === "home"
                   ? "bg-gradient-to-r from-[#075985] via-[#0284c7] to-[#0f766e]"
                   : buddyMode === "chat"
                   ? "bg-gradient-to-r from-[#075985] via-[#0284c7] to-[#0f766e]"
                   : "bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-500"
               }`}
               style={buddyMode === "home" ? {
                 backgroundImage: `url(${megaMendungLineMotif}), linear-gradient(135deg, #075985 0%, #0284c7 55%, #0f766e 100%)`,
                 backgroundSize: "auto, auto",
               } : undefined}
              >
                {/* decorative circles */}
                <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -right-1 top-4 h-8 w-8 rounded-full bg-white/10 pointer-events-none" />
                <div className="flex items-center gap-2.5">
                  {buddyMode !== "home" && (
                    <button onClick={() => { setBuddyMode("home"); setSelectedBudget(null); }} className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0">
                      <ArrowLeft className="h-3.5 w-3.5 text-white" />
                    </button>
                  )}
                  {buddyMode === "home" && (
                    <div className="h-8 w-8 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                      <Compass className="h-4.5 w-4.5 text-white" style={{ height: 18, width: 18 }} />
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-sm leading-none">
                      {buddyMode === "home" ? "Nempo Buddy" : buddyMode === "chat" ? "Panduan & FAQ" : buddyMode === "budget" ? "Spill Budget" : buddyMode === "jingle" ? "Jingle Nempo" : "Darurat SOS"}
                    </p>
                    {buddyMode === "home" && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        <p className="text-white/80 text-[10px]">Online · siap bantu acara & kreatif</p>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => { setCsOpen(false); setBuddyMode("home"); setSelectedBudget(null); }} className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0">
                  <X className="h-3.5 w-3.5 text-white" />
                </button>
              </div>

              {/* ── HOME ── */}
              {buddyMode === "home" && (
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {/* Hero banner */}
                  <div
                    className="relative overflow-hidden px-4 pt-4 pb-4 border-b border-cyan-100/80"
                    style={{
                      backgroundImage: `url(${megaMendungLineMotif}), linear-gradient(145deg, #e0f7ff 0%, #effcf9 64%, #ffffff 100%)`,
                      backgroundSize: "auto, auto",
                    }}
                  >
                    <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-cyan-200/40 blur-2xl" />
                    <div className="relative flex items-start gap-3 mb-2">
                      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#0f766e] flex items-center justify-center shadow-md shadow-cyan-200/70 shrink-0 rotate-[-4deg]">
                        <Compass className="text-white" style={{ height: 23, width: 23 }} />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-[15px] leading-tight">Sampurasun! Rék bikin acara atau konten?</p>
                        <p className="font-extrabold text-[15px] leading-tight text-[#087f8c]">Wedding, event, desain, website — Buddy siap bantu.</p>
                      </div>
                    </div>
                    <div className="relative flex items-center gap-1.5 w-fit rounded-full border border-cyan-200/80 bg-white/75 px-2.5 py-1 text-[10px] font-bold text-cyan-800 shadow-sm">
                      <MapPin className="h-3 w-3 text-cyan-600" />
                      <span>Nempo {selectedCity === ALL_CITIES ? "Jawa Barat" : selectedCity}</span>
                    </div>
                    <p className="relative mt-2 text-[11px] text-slate-500 leading-relaxed">Pilih menu di bawah buat tanya layanan, cek paket, atau cerita soal kebutuhanmu.</p>
                  </div>

                  {/* Feature cards */}
                  <div className="p-3 grid grid-cols-2 gap-2">
                    {/* Chat FAQ */}
                    <button onClick={() => setBuddyMode("chat")} className="flex flex-col gap-2.5 p-3.5 rounded-2xl border-2 border-cyan-100 bg-gradient-to-br from-cyan-50 to-sky-50 hover:border-cyan-300 hover:shadow-md hover:shadow-cyan-100 transition-all text-left group">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#0f766e] flex items-center justify-center shadow-sm shadow-cyan-200 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <MessageCircle className="h-4.5 w-4.5 text-white" style={{ height: 18, width: 18 }} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">Tanya Buddy</p>
                        <p className="text-cyan-700/70 text-[10px] leading-tight mt-0.5">Info layanan Nempo</p>
                      </div>
                    </button>
                    {/* Jingle Nempo */}
                    <button onClick={() => setBuddyMode("jingle")} className="flex flex-col gap-2.5 p-3.5 rounded-2xl border-2 border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100 transition-all text-left group">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center shadow-sm shadow-pink-200 group-hover:scale-110 transition-transform">
                        <Music className="h-4.5 w-4.5 text-white" style={{ height: 18, width: 18 }} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">Jingle Nempo</p>
                        <p className="text-orange-600/70 text-[10px] leading-tight mt-0.5">Lagu sapaan dari Nempo</p>
                      </div>
                    </button>
                  </div>

                  {/* Quick prompts */}
                  <div className="px-3 pb-2">
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Mulai dari sini</p>
                      <span className="text-[9px] font-semibold text-slate-300">pilih satu</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "Wedding Organizer", query: "Wedding Organizer" },
                        { label: "Bikin undangan digital", query: "Bikin undangan digital" },
                        { label: "Konten sosmed", query: "Konten sosmed" },
                        { label: "Bikin website", query: "Bikin website" },
                      ].map((prompt) => (
                        <button
                          key={prompt.label}
                          onClick={() => { setBuddyMode("chat"); sendChat(prompt.query); }}
                          className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700"
                        >
                          {prompt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mx-3 mb-3 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
                    <p className="text-[10.5px] leading-tight text-emerald-800"><span className="font-bold">Catatan kecil:</span> ceritakan tanggal, lokasi, dan kebutuhan acaramu supaya Buddy bisa arahin ke layanan yang paling pas.</p>
                  </div>
                  <p className="text-center text-slate-300 text-[10px] pb-3">Buddy online 08.00 – 21.00 WIB</p>
                </div>
              )}

              {/* ── CHAT MODE ── */}
              {buddyMode === "chat" && (
                <div className="flex flex-col flex-1 min-h-0">
                  <div className="shrink-0 border-b border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-emerald-50 px-3 py-3">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0284c7] to-[#0f766e] shadow-sm shadow-cyan-200">
                        <Compass className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-extrabold leading-tight text-slate-800">Tanya tentang layanan Nempo</p>
                        <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">Acara, wedding, konten, website, desain, talent, dan sistem usaha.</p>
                      </div>
                    </div>
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                      {[
                        { label: "Acara & wedding", query: "Event Organizer" },
                        { label: "Konten & desain", query: "Sosmed Management" },
                        { label: "Website & sistem", query: "Web Development" },
                        { label: "Talent & model", query: "Talent Management" },
                      ].map((topic) => (
                        <button
                          key={topic.label}
                          onClick={() => sendChat(topic.query)}
                          className="flex items-center justify-between rounded-xl border border-cyan-100 bg-white/85 px-2.5 py-2 text-left text-[10px] font-bold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700"
                        >
                          <span>{topic.label}</span>
                          <ChevronRightIcon className="h-3 w-3 shrink-0 text-cyan-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div ref={chatBodyRef} className="flex flex-col gap-3 px-3 py-3 overflow-y-auto bg-gray-50/50 flex-1 min-h-0">
                    {chatMsgs.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.from === "user" ? "items-end" : "items-start"} gap-1.5`}>
                        {msg.from === "bot" && (
                          <div className="flex items-end gap-2">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#0284c7] to-[#0f766e] flex items-center justify-center shrink-0 shadow-sm shadow-cyan-200">
                              <Compass className="text-white" style={{ height: 14, width: 14 }} />
                            </div>
                            <div className="bg-white text-gray-800 text-[12.5px] leading-relaxed rounded-2xl rounded-bl-sm px-3.5 py-2.5 max-w-[82%] shadow-sm border border-gray-100">
                              {msg.text}
                            </div>
                          </div>
                        )}
                        {msg.from === "user" && (
                          <div className="bg-gradient-to-br from-[#0284c7] to-[#0f766e] text-white text-[12.5px] leading-relaxed rounded-2xl rounded-br-sm px-3.5 py-2.5 max-w-[82%] shadow-sm shadow-cyan-200">
                            {msg.text}
                          </div>
                        )}
                        {msg.from === "bot" && msg.chips && msg.chips.length > 0 && (
                          <div className="ml-9 mt-1">
                            {i === 0 && (
                              <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400">
                                Pertanyaan populer
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1.5">
                              {msg.chips.map((chip) =>
                                chip === "Hubungi Admin CS" ? (
                                  <a key={chip} href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 text-white hover:opacity-90 transition-colors shadow-sm shadow-pink-200">
                                    <Instagram className="h-3 w-3" /> DM Admin Instagram
                                  </a>
                                ) : chip === "Instagram @nempo.id" ? (
                                  <a key={chip} href="https://instagram.com/nempo.id" target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-violet-200 text-violet-600 bg-white hover:bg-violet-50 transition-colors shadow-sm">
                                    {chip}
                                  </a>
                                ) : (
                                    <button key={chip} onClick={() => sendChat(chip)} className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border border-cyan-200 text-cyan-700 bg-white hover:border-cyan-300 hover:bg-cyan-50 transition-colors shadow-sm">
                                    {chip}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )}
                        {msg.from === "bot" && msg.wa && (
                          <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="ml-9 mt-0.5 flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-pink-50 border border-pink-200 transition-colors group w-fit shadow-sm">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm shadow-pink-200"><Instagram className="h-4 w-4 text-white" /></div>
                            <div><p className="font-bold text-gray-900 text-xs">Chat via WhatsApp</p><p className="text-gray-400 text-[10px]">Konsultasi kebutuhanmu dengan admin</p></div>
                            <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:text-pink-500 transition-colors" />
                          </a>
                        )}
                      </div>
                    ))}
                    {/* Typing indicator */}
                    {botTyping && (
                      <div className="flex items-end gap-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#0284c7] to-[#0f766e] flex items-center justify-center shrink-0 shadow-sm shadow-cyan-200">
                          <Compass className="text-white" style={{ height: 14, width: 14 }} />
                        </div>
                        <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100 flex gap-1 items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 px-3 py-2.5 flex items-center gap-2 bg-white shrink-0">
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat(chatInput)} placeholder="Tanyakan layanan Nempo…" className="flex-1 text-[12.5px] bg-gray-50 rounded-2xl px-3.5 py-2 outline-none border border-gray-200 focus:border-cyan-400 transition-colors" />
                    <button onClick={() => sendChat(chatInput)} disabled={!chatInput.trim() || botTyping} className="h-9 w-9 rounded-full bg-gradient-to-br from-[#0284c7] to-[#0f766e] hover:from-[#0369a1] hover:to-[#115e59] disabled:opacity-40 flex items-center justify-center transition-all shadow-sm shadow-cyan-200 shrink-0">
                      <Send className="text-white" style={{ height: 14, width: 14 }} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── SPILL BUDGET ── */}
              {buddyMode === "budget" && (
                <div className="px-3 py-3 flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
                  {!selectedBudget ? (
                    <>
                      {/* Hero — stacked layout, full width */}
                      <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg, #0172B1 0%, #0194f3 60%, #1BA0E2 100%)" }}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Wallet className="h-5 w-5 text-white opacity-90 shrink-0" />
                          <p className="font-extrabold text-[14px] leading-tight text-white">Spill Budget Tripmu!</p>
                        </div>
                        <p className="text-white/75 text-[11px] leading-relaxed">Pilih range budget atau gaya trip, kita langsung kasih rekomendasinya!</p>
                      </div>

                      {/* Budget tier cards — 3 columns */}
                      <div className="flex gap-2">
                        {[
                          { label: "Hemat",  range: "< 300rb",    col: "#16A34A", bg: "#F0FDF4", border: "#86EFAC", iconBg: "#DCFCE7", Icon: Leaf },
                          { label: "Santai", range: "300–700rb",  col: "#B45309", bg: "#FFFBEB", border: "#FCD34D", iconBg: "#FEF3C7", Icon: Coffee },
                          { label: "Sultan", range: "> 700rb",    col: "#7C3AED", bg: "#F5F3FF", border: "#C4B5FD", iconBg: "#EDE9FE", Icon: Crown },
                        ].map((t) => (
                          <button key={t.label} onClick={() => setSelectedBudget(t.label)} style={{ background: t.bg, borderColor: t.border, flex: 1 }}
                            className="flex flex-col items-center py-3 rounded-xl border-2 transition-all hover:scale-[1.03] active:scale-100 cursor-pointer gap-1.5 shadow-sm">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: t.iconBg }}>
                              <t.Icon className="h-[18px] w-[18px]" style={{ color: t.col }} />
                            </div>
                            <span className="font-extrabold text-[13px]" style={{ color: t.col }}>{t.label}</span>
                            <span className="text-[9.5px] font-semibold" style={{ color: t.col, opacity: 0.65 }}>{t.range}</span>
                          </button>
                        ))}
                      </div>

                      {/* Trip types — icon rows */}
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trip Populer</p>
                        {[
                          { label: "Solo trip alam & hiking", sub: "Papandayan · Guntur · Curug",    Icon: Mountain, iconBg: "#F0FDF4", iconCol: "#15803D", key: "Solo trip alam & hiking" },
                          { label: "Trip keluarga 2H1M",      sub: "Cikembulan · Cipanas · Situ",   Icon: Users,    iconBg: "#EFF6FF", iconCol: "#1D4ED8", key: "Trip keluarga 2H1M" },
                          { label: "Honeymoon di Jawa Barat", sub: "Villa · Sunset · Cafe romantis", Icon: Heart, iconBg: "#FFF1F2", iconCol: "#E11D48", key: "Honeymoon romantic Jawa Barat" },
                          { label: "Weekend budget tipis",    sub: "Hutan pinus · Curug · Warung",   Icon: Zap,      iconBg: "#FFFBEB", iconCol: "#B45309", key: "Weekend getaway budget tipis" },
                        ].map((t) => (
                          <button key={t.key} onClick={() => setSelectedBudget(t.key)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all shadow-sm group text-left w-full">
                            <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: t.iconBg }}>
                              <t.Icon className="h-[18px] w-[18px]" style={{ color: t.iconCol }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-bold text-gray-800 leading-snug">{t.label}</p>
                              <p className="text-[10px] text-gray-400 leading-none truncate">{t.sub}</p>
                            </div>
                            <ChevronRightIcon className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-400 transition-colors shrink-0" />
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Back button */}
                      <button onClick={() => setSelectedBudget(null)} className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#0194f3] hover:text-[#0172B1] transition-colors self-start">
                        <ChevronLeft className="h-4 w-4" /> Kembali ke pilihan
                      </button>

                      {/* Result header */}
                      <div className="rounded-2xl bg-gradient-to-br from-[#0172B1] to-[#0194f3] p-3.5 text-white relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
                        <p className="font-extrabold text-[13px] leading-snug mb-0.5">Rekomendasi — {selectedBudget}</p>
                        <p className="text-white/70 text-[10.5px]">Disesuaikan untuk kamu, selamat jalan-jalan!</p>
                      </div>

                      {/* Inline recommendations based on selected budget/trip */}
                      {(() => {
                        const recs: Record<string, { wisata: string[]; kuliner: string[]; tips: string }> = {
                          "Hemat": {
                            wisata: ["Curug Orok (HTM Rp 10rb)", "Situ Bagendit (Rp 5rb)", "Kawah Kamojang (Rp 10rb)"],
                            kuliner: ["Nasi Tutug Oncom (~Rp 15rb)", "Jajanan khas Jawa Barat (Rp 5rb)", "Kopi warung pinggir jalan"],
                            tips: "Bawa bekal & pakai transportasi umum untuk hemat lebih!",
                          },
                          "Santai": {
                            wisata: ["Wisata alam Jawa Barat (HTM mulai Rp 25rb)", "Pemandian air panas (Rp 50rb)", "Wisata budaya (Rp 15rb)"],
                            kuliner: ["Sate Maranggi (Rp 40-70rb)", "RM Sunda (Rp 30-60rb)", "Es Cincau khas Jawa Barat"],
                            tips: "Idealnya menginap 1 malam di homestay sekitar Rp 200-350rb.",
                          },
                          "Sultan": {
                            wisata: ["Private trekking Papandayan", "Private villa Cisurupan", "Tour premium Cangkuang"],
                            kuliner: ["Resto premium di Jawa Barat", "Cafe instagramable", "Fine dining Sate Maranggi"],
                            tips: "Booking resort berbintang dari jauh hari — Jawa Barat makin hits!",
                          },
                          "Solo trip alam & hiking": {
                            wisata: ["Gunung Papandayan (2665 mdpl)", "Gunung Guntur (2249 mdpl)", "Curug Orok & Curug Sanghyang"],
                            kuliner: ["Nasi bungkus bekal hiking", "Warung puncak Papandayan", "Makanan sehat di basecamp"],
                            tips: "Wajib cek cuaca & bawa P3K. Hiking Papandayan aman untuk pemula!",
                          },
                          "Trip keluarga 2H1M": {
                            wisata: ["Taman Satwa Cikembulan", "Situ Bagendit (danau keluarga)", "Pemandian air panas Cipanas"],
                            kuliner: ["RM keluarga di Jawa Barat", "Oleh-oleh khas Jawa Barat", "Cafe ramah anak"],
                            tips: "Pastikan akomodasi punya kamar keluarga. Jawa Barat sangat aman & nyaman!",
                          },
                          "Honeymoon romantic Jawa Barat": {
                            wisata: ["Curug Orok nuansa romantis", "Sunset view Papandayan", "Private villa Cipanas"],
                            kuliner: ["Dinner romantis view gunung", "Cafe estetik", "Bakery & dessert cafe Jawa Barat"],
                            tips: "Pilih villa dengan private pool. Jawa Barat punya banyak destinasi romantis dan intim!",
                          },
                          "Weekend getaway budget tipis": {
                            wisata: ["Hutan pinus Jawa Barat (gratis)", "Danau wisata (Rp 5rb)", "Curug terdekat dari kota"],
                            kuliner: ["Warung nasi Sunda murah meriah", "Jajanan pinggir jalan Jawa Barat", "Kopi & gorengan warung lokal"],
                            tips: "Weekend Sabtu-Minggu cukup budget Rp 150-250rb sudah bisa puas!",
                          },
                        };
                        const r = recs[selectedBudget] || recs["Hemat"];
                        return (
                          <div className="flex flex-col gap-2">
                            {/* Wisata card */}
                            <div className="rounded-xl border border-green-200 overflow-hidden">
                              <div className="flex items-center gap-2 px-3 py-2 bg-green-500">
                                <div className="h-5 w-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                                  <MapPin className="h-3 w-3 text-white" />
                                </div>
                                <p className="text-[10.5px] font-bold text-white uppercase tracking-wide">Wisata Rekomendasi</p>
                              </div>
                              <div className="bg-green-50 px-3 py-2 flex flex-col gap-1.5">
                                {r.wisata.map((w, i) => (
                                  <div key={i} className="flex items-start gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                    <p className="text-[11.5px] text-gray-700 leading-snug">{w}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Kuliner card */}
                            <div className="rounded-xl border border-orange-200 overflow-hidden">
                              <div className="flex items-center gap-2 px-3 py-2 bg-orange-500">
                                <div className="h-5 w-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                                  <Utensils className="h-3 w-3 text-white" />
                                </div>
                                <p className="text-[10.5px] font-bold text-white uppercase tracking-wide">Kuliner Wajib Coba</p>
                              </div>
                              <div className="bg-orange-50 px-3 py-2 flex flex-col gap-1.5">
                                {r.kuliner.map((k, i) => (
                                  <div key={i} className="flex items-start gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                    <p className="text-[11.5px] text-gray-700 leading-snug">{k}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Tips card */}
                            <div className="rounded-xl border border-blue-200 overflow-hidden">
                              <div className="flex items-center gap-2 px-3 py-2" style={{ background: "#0194f3" }}>
                                <div className="h-5 w-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                                  <Lightbulb className="h-3 w-3 text-white" />
                                </div>
                                <p className="text-[10.5px] font-bold text-white uppercase tracking-wide">Tips dari Buddy</p>
                              </div>
                              <div className="bg-blue-50 px-3 py-2">
                                <p className="text-[11.5px] text-gray-700 leading-relaxed">{r.tips}</p>
                              </div>
                            </div>
                            <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full text-center text-[12px] font-bold py-2.5 rounded-xl text-white shadow-sm shadow-pink-200 transition-all active:scale-95 bg-gradient-to-r from-pink-500 to-violet-600">
                              <Instagram className="h-3.5 w-3.5" /> Chat Admin via WhatsApp
                            </a>
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              )}

              {/* ── JINGLE NEMPO ── */}
              {buddyMode === "jingle" && (
                <div className="flex flex-col flex-1 min-h-0 px-4 pt-4 pb-4">
                  {/* Album art */}
                  <div className="relative mx-auto mb-5 h-40 w-40 rounded-3xl bg-gradient-to-br from-pink-500 via-fuchsia-500 to-orange-400 flex items-center justify-center shadow-lg shadow-pink-200 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                    <Music className={`h-14 w-14 text-white drop-shadow ${jingle.isPlaying ? "animate-pulse" : ""}`} />
                  </div>

                  <div className="text-center mb-4">
                    <p className="font-extrabold text-gray-900 text-sm">{JINGLE_TRACK.title}</p>
                    <p className="text-gray-400 text-[11px] mt-0.5">{JINGLE_TRACK.artist}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-2">
                    <input
                      type="range"
                      min={0}
                      max={jingle.duration || 0}
                      step={0.1}
                      value={jingle.progress}
                      onChange={(e) => jingle.seek(Number(e.target.value))}
                      className="w-full h-1.5 rounded-full accent-pink-500 cursor-pointer"
                    />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-400 tabular-nums">{fmtTime(jingle.progress)}</span>
                      <span className="text-[10px] text-gray-400 tabular-nums">{fmtTime(jingle.duration)}</span>
                    </div>
                  </div>

                  {/* Play control */}
                  <div className="flex items-center justify-center gap-4 mt-2 mb-5">
                    <button
                      onClick={jingle.toggle}
                      className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center shadow-lg shadow-pink-200 hover:scale-105 active:scale-95 transition-transform"
                    >
                      {jingle.isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white ml-0.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-pink-50 border border-pink-100">
                    <Volume2 className="h-4 w-4 text-pink-400 shrink-0" />
                    <p className="text-[10.5px] text-pink-600 leading-tight">Menemani liburan kalian menjelajah pesona Jawa Barat, dari awal sampai pulang!</p>
                  </div>
                </div>
              )}

              {/* ── DARURAT SOS ── */}
              {buddyMode === "sos" && (
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Alert banner */}
                  <div className="mx-3 mt-3 mb-2 flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-red-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500" />
                    <div className="relative shrink-0 flex items-center justify-center h-7 w-7 rounded-lg bg-white/20">
                      <div className="absolute inset-0 rounded-lg bg-white/10 animate-pulse" />
                      <AlertTriangle className="h-4 w-4 text-white relative" />
                    </div>
                    <div className="relative">
                      <p className="text-[11.5px] font-bold text-white leading-tight">Mode Darurat SOS</p>
                      <p className="text-[10px] text-white/75 leading-none mt-0.5">Tekan kartu untuk langsung menelepon</p>
                    </div>
                  </div>

                  {/* Contact groups (accordion) */}
                  <div className="flex-1 overflow-y-auto px-3 flex flex-col gap-1.5 pb-2">
                    {SOS_GROUPS.map((g) => {
                      const isOpen = sosOpenGroup === g.id;
                      return (
                        <div key={g.id} className="rounded-2xl border-[1.5px] shadow-sm" style={{ background: g.bg, borderColor: g.border }}>
                          <button
                            onClick={() => setSosOpenGroup(isOpen ? null : g.id)}
                            className={`w-full flex items-start gap-3 px-3 py-3 text-left ${isOpen ? "rounded-t-2xl" : "rounded-2xl"}`}
                          >
                            <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: g.col }}>
                              <g.icon className="text-white" style={{ height: 18, width: 18 }} />
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                              <p className="font-bold text-gray-800 text-[12px] leading-snug">{g.label}</p>
                              <p className="text-[10px] text-gray-400 leading-none mt-1.5">{g.contacts.length} kontak</p>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 mt-1 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                          </button>

                          {isOpen && (
                            <div className="border-t rounded-b-2xl overflow-hidden bg-white/70" style={{ borderColor: g.border }}>
                              {g.contacts.map((c) => (
                                <div
                                  key={c.name + c.number}
                                  className="flex items-center justify-between gap-2 px-3 py-2.5 border-b last:border-b-0"
                                  style={{ borderColor: g.border }}
                                >
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-semibold text-gray-700 leading-tight truncate">{c.name}</p>
                                    <p className="text-[11.5px] font-extrabold leading-tight tracking-wide" style={{ color: g.col }}>{c.number}</p>
                                  </div>
                                  <a
                                    href={`tel:${c.number.replace(/[^\d+]/g, "")}`}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white text-[10.5px] font-bold shrink-0 shadow-sm hover:scale-105 active:scale-95 transition-transform"
                                    style={{ background: g.col }}
                                  >
                                    <Phone className="h-3 w-3" /> Hubungi
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-center text-gray-300 text-[10px] pb-2.5 px-3">Pastikan sinyal HP aktif · Pilih kontak layanan sesuai wilayah Jawa Barat</p>
                </div>
              )}

            </div>
          </>
        )}

        {/* Toggle button — slides in/out from right */}
        <div
          className="relative flex items-center transition-transform duration-500 ease-in-out"
          style={{ transform: csVisible || csOpen ? "translateX(0)" : "translateX(calc(100% - 20px))" }}
        >
          {/* Arrow tab — visible when hidden */}
          {!csVisible && !csOpen && (
            <div
              onClick={() => { setCsOpen(true); setCsVisible(true); }}
              role="button"
              aria-label="Buka Nempo Buddy"
              className="flex items-center justify-center shrink-0 cursor-pointer"
              style={{
                width: "20px",
                height: "48px",
                background: "linear-gradient(135deg, #075985, #0284c7)",
                borderRadius: "12px 0 0 12px",
              }}
            >
              <ChevronLeft className="h-3.5 w-3.5 text-white" />
            </div>
          )}
          <button
            onClick={() => { setCsOpen(!csOpen); setCsVisible(true); }}
            className="relative flex items-center overflow-hidden shadow-xl shadow-violet-500/40 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #075985, #0f766e)",
              borderRadius: "20px 0 0 20px",
              height: "48px",
              paddingLeft: "14px",
              paddingRight: "16px",
            }}
          >
            {/* Red dot */}
            {!csOpen && <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />}
            <Compass className="h-5 w-5 text-white shrink-0" />
            <span className="hidden sm:inline ml-2 text-white font-bold text-sm whitespace-nowrap">
              {csOpen ? "Tutup" : "Nempo Buddy"}
            </span>
          </button>
        </div>
      </div>}
    </div>
  );
}
