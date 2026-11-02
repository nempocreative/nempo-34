import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import {
  Leaf, Award, TreePine, Heart, CheckCircle, ChevronRight,
  ArrowLeft, Users, MapPin, Download, Share2, Camera,
  Sprout, Wind, Droplets, Sun, Star, BadgeCheck, Info,
  Lock, Eye, EyeOff, AlertCircle, ChevronDown, Globe,
  Landmark, GraduationCap, Store, Truck, UserCheck, UserX, MessageCircle,
} from "lucide-react";

/* ─── Password Gate ─────────────────────────────────────── */
const GATE_PASSWORD = "khairilnst16";

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState("");
  const [show,  setShow]  = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function attempt() {
    if (input === GATE_PASSWORD) { onUnlock(); }
    else { setError(true); setShake(true); setTimeout(() => setShake(false), 600); }
  }

  return (
    <div className="min-h-[100dvh] w-full relative overflow-hidden flex flex-col">
      {/* Full-screen bg */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=85" alt="hutan" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/92 via-emerald-950/88 to-slate-950/95" />
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" style={{ animationDelay: "1s" }} />
      </div>

      {/* Floating leaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["🍃","🌿","🌱","🍂","🍀","🌳"].map((e, i) => (
          <span key={i} className="absolute opacity-15 animate-bounce text-2xl"
            style={{ left: `${8 + i * 15}%`, top: `${5 + i * 13}%`, animationDelay: `${i * 0.8}s`, animationDuration: `${3.5 + i * 0.5}s` }}
          >{e}</span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-[100dvh]">

        {/* LEFT — impact stats (visible on desktop) */}
        <div className="hidden lg:flex flex-col justify-center flex-1 px-12 xl:px-20">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white/50 hover:text-white mb-10 text-sm transition-colors group self-start">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Kembali
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img src="/Assets/Logo/nempo-new.webp" alt="Nempo Organizer" className="h-10 w-10 object-contain rounded-xl bg-white p-1" onError={e => (e.currentTarget.style.display = "none")} />
            <div className="h-6 w-px bg-white/20" />
            <span className="text-white/70 text-sm font-semibold">Program Donasi Bibit</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
            Tanam Bibit,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-400">
              Hijauken Garut
            </span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-10 max-w-md">
            Platform donasi bibit pohon resmi bersama Dinas Lingkungan Hidup Kabupaten Garut.
            Setiap bibit ditanam, difoto, dan dilaporkan langsung kepada Anda.
          </p>

          {/* Impact numbers */}
          <div className="grid grid-cols-3 gap-4 max-w-md mb-10">
            {[
              { val: "12.4K", label: "Bibit Terkumpul", Icon: Sprout,   iconColor: "text-emerald-300", color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30" },
              { val: "847",   label: "Donatur Aktif",    Icon: Users,    iconColor: "text-rose-300",    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30" },
              { val: "8.2K",  label: "Pohon Tumbuh",    Icon: TreePine, iconColor: "text-teal-300",    color: "from-teal-500/20 to-cyan-500/20 border-teal-500/30" },
            ].map(s => (
              <div key={s.label} className={`bg-gradient-to-br ${s.color} border backdrop-blur-sm rounded-2xl p-4 text-center`}>
                <div className="flex justify-center mb-2">
                  <s.Icon className={`w-6 h-6 ${s.iconColor}`} strokeWidth={1.8} />
                </div>
                <p className="font-extrabold text-white text-xl leading-none">{s.val}</p>
                <p className="text-white/50 text-[10px] mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { Icon: BadgeCheck, t: "Mitra Resmi Pemkab Garut", c: "text-emerald-300" },
              { Icon: Award,      t: "Sertifikat Resmi Dinas LH", c: "text-yellow-300" },
              { Icon: Lock,       t: "Transaksi 100% Aman",       c: "text-blue-300" },
            ].map(b => (
              <div key={b.t} className="flex items-center gap-2 bg-white/8 border border-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-white/70 text-[11px] font-semibold">
                <b.Icon className={`w-3.5 h-3.5 shrink-0 ${b.c}`} strokeWidth={2} /> {b.t}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Login card */}
        <div className="flex flex-col justify-center px-4 lg:px-12 py-10 lg:w-[420px] xl:w-[460px] shrink-0">
          {/* Mobile: back button */}
          <button onClick={() => window.history.back()} className="lg:hidden flex items-center gap-2 text-white/50 hover:text-white mb-6 text-sm transition-colors group">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </button>

          <div className={`bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-7 shadow-2xl shadow-black/40 ${shake ? "animate-[wiggle_0.1s_ease-in-out_6]" : ""}`}
               style={shake ? { animation: "wiggle 0.6s ease-in-out" } : {}}>

            {/* Icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-xl shadow-emerald-500/30 shrink-0">
                <TreePine className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white font-extrabold text-base leading-tight">Donasi Bibit Garut</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1BA0E2] animate-pulse" />
                  <span className="text-blue-300 text-[10px] font-bold uppercase tracking-wider">Akses Terbatas</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-300" strokeWidth={2} /> Sedang Dipersiapkan
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Fitur <span className="text-emerald-300 font-semibold">Donasi Bibit</span> sedang dalam persiapan akhir agar setiap rupiah tersalurkan tepat dan transparan.
            </p>

            {/* Features preview */}
            <div className="grid grid-cols-1 gap-2 mb-6">
              {[
                { Icon: BadgeCheck, c: "text-emerald-300 bg-emerald-500/15", t: "Mitra Resmi Pemkab Garut",  d: "MoU dalam proses penandatanganan" },
                { Icon: Award,      c: "text-yellow-300 bg-yellow-500/15",   t: "Sertifikat Digital Resmi",   d: "Bersama Dinas LH Kab. Garut" },
                { Icon: Camera,     c: "text-blue-300 bg-blue-500/15",       t: "Laporan Foto Penanaman",     d: "Bukti nyata kontribusi Anda" },
              ].map(({ Icon, c, t, d }) => (
                <div key={t} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c}`}>
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-xs">{t}</p>
                    <p className="text-white/40 text-[10px]">{d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Password */}
            <div className="space-y-3">
              <label className="text-white/50 text-[10px] font-bold uppercase tracking-widest block">Kode Akses Tim Internal</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type={show ? "text" : "password"}
                  value={input}
                  onChange={e => { setInput(e.target.value); setError(false); }}
                  onKeyDown={e => e.key === "Enter" && attempt()}
                  placeholder="Masukkan kode akses..."
                  className={`w-full bg-white/10 backdrop-blur border-2 ${error ? "border-red-400/70" : "border-white/20 focus:border-emerald-400/70"} rounded-2xl pl-10 pr-12 py-3.5 text-white placeholder-white/30 text-sm outline-none transition-all`}
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-semibold">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Kode akses tidak valid. Coba lagi.
                </div>
              )}
              <button onClick={attempt}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-xl shadow-emerald-700/30 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <Leaf className="h-4 w-4" /> Buka Akses
              </button>
            </div>
          </div>

          <p className="text-white/25 text-[10px] text-center mt-4 leading-relaxed">
            Akses hanya untuk tim internal Nempo Organizer.<br />
            Info lebih lanjut: hubungi tim kami via DM Instagram.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Data ─────────────────────────────────────────────── */
const BIBIT_TYPES = [
  {
    id: "mahoni", name: "Pohon Mahoni", price: 25000, emoji: "🌳",
    color: "from-[#0194f3] to-[#0172B1]", bg: "bg-blue-50", border: "border-blue-300",
    tag: "Terpopuler", tagColor: "bg-blue-500",
    desc: "Pohon keras bernilai tinggi",
    co2: "2.4 ton/tahun", umur: "25–50 tahun",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80",
  },
  {
    id: "sengon", name: "Pohon Sengon", price: 20000, emoji: "🌲",
    color: "from-emerald-500 to-green-600", bg: "bg-emerald-50", border: "border-emerald-300",
    tag: "Cepat Tumbuh", tagColor: "bg-emerald-500",
    desc: "Ideal untuk reboisasi cepat",
    co2: "1.8 ton/tahun", umur: "7–15 tahun",
    img: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&q=80",
  },
  {
    id: "bambu", name: "Bambu Betung", price: 15000, emoji: "🎋",
    color: "from-teal-500 to-cyan-600", bg: "bg-teal-50", border: "border-teal-300",
    tag: "Cegah Longsor", tagColor: "bg-teal-500",
    desc: "Penahan longsor & sumber air",
    co2: "3.5 ton/tahun", umur: "3–5 tahun",
    img: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=80",
  },
  {
    id: "durian", name: "Pohon Durian", price: 35000, emoji: "🌱",
    color: "from-yellow-500 to-lime-600", bg: "bg-yellow-50", border: "border-yellow-300",
    tag: "Buah Lokal", tagColor: "bg-yellow-500",
    desc: "Buah khas & nilai ekonomi",
    co2: "1.5 ton/tahun", umur: "5–10 tahun (panen)",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
  },
  {
    id: "alpukat", name: "Pohon Alpukat", price: 30000, emoji: "🥑",
    color: "from-green-500 to-teal-600", bg: "bg-green-50", border: "border-green-300",
    tag: "Produktif", tagColor: "bg-green-600",
    desc: "Buah bernilai ekonomi tinggi",
    co2: "1.2 ton/tahun", umur: "3–5 tahun (panen)",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
  },
  {
    id: "pinus", name: "Pohon Pinus", price: 22000, emoji: "🌲",
    color: "from-slate-500 to-green-700", bg: "bg-slate-50", border: "border-slate-300",
    tag: "Pemandangan", tagColor: "bg-slate-600",
    desc: "Resin & panorama indah",
    co2: "2.8 ton/tahun", umur: "20–40 tahun",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  },
  {
    id: "lainnya", name: "Pilihan Lainnya", price: 0, emoji: "✏️",
    color: "from-violet-500 to-purple-700", bg: "bg-violet-50", border: "border-violet-300",
    tag: "Bebas Pilih", tagColor: "bg-violet-500",
    desc: "Tulis nama pohon pilihanmu",
    co2: "–", umur: "–",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80",
  },
];

const LOCATIONS = [
  { id: "papandayan",  name: "Lereng Gunung Papandayan", kec: "Cisurupan",  trees: 3240, img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=70" },
  { id: "cikuray",    name: "Lereng Gunung Cikuray",    kec: "Bayongbong", trees: 2100, img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=70" },
  { id: "limbangan",  name: "Kawasan Limbangan",        kec: "Limbangan",  trees: 1580, img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200&q=70" },
  { id: "cisompet",   name: "Kawasan Cisompet",         kec: "Cisompet",   trees: 1280, img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&q=70" },
];

const DONORS = [
  { name: "Andi Saputra",  bibit: 10, type: "Pohon Mahoni",  time: "2 jam lalu",  avatar: "https://i.pravatar.cc/48?img=11", loc: "Papandayan" },
  { name: "Siti Rahayu",   bibit: 5,  type: "Bambu Betung",  time: "5 jam lalu",  avatar: "https://i.pravatar.cc/48?img=5",  loc: "Cikuray" },
  { name: "Budi Hartono",  bibit: 20, type: "Pohon Sengon",  time: "1 hari lalu", avatar: "https://i.pravatar.cc/48?img=7",  loc: "Limbangan" },
  { name: "Dewi Kusuma",   bibit: 8,  type: "Pohon Durian",  time: "2 hari lalu", avatar: "https://i.pravatar.cc/48?img=9",  loc: "Papandayan" },
  { name: "Reza Maulana",  bibit: 15, type: "Pohon Alpukat", time: "3 hari lalu", avatar: "https://i.pravatar.cc/48?img=3",  loc: "Cikuray" },
  { name: "Yuni Pratiwi",  bibit: 30, type: "Pohon Pinus",   time: "4 hari lalu", avatar: "https://i.pravatar.cc/48?img=15", loc: "Papandayan" },
];

const STEPS = [
  { n: "01", icon: Heart,     color: "bg-rose-500",    title: "Pilih & Donasi",    desc: "Pilih jenis bibit, jumlah, dan lokasi tanam. Selesaikan donasi dengan mudah." },
  { n: "02", icon: Sprout,    color: "bg-emerald-500", title: "Bibit Ditanam",     desc: "Tim Dinas LH Kab. Garut menanam bibit di area yang sudah dipilih." },
  { n: "03", icon: Camera,    color: "bg-blue-500",    title: "Laporan Foto",      desc: "Anda menerima foto penanaman sebagai bukti nyata donasi Anda." },
  { n: "04", icon: Award,     color: "bg-blue-500",   title: "Sertifikat Resmi",  desc: "Sertifikat penghargaan dari Pemkab Garut dikirim ke email Anda." },
];

const IMPACTS = [
  { icon: Wind,     label: "CO₂ terserap",  value: (qty: number) => `${(qty * 1.8).toFixed(0)} kg/thn`, color: "text-blue-600",     bg: "bg-blue-50" },
  { icon: Droplets, label: "Air tersimpan", value: (qty: number) => `${(qty * 3.2).toFixed(0)} L/thn`,  color: "text-blue-600",   bg: "bg-blue-50" },
  { icon: Sun,      label: "O₂ dihasilkan", value: (qty: number) => `${(qty * 0.9).toFixed(0)} kg/thn`, color: "text-[#0172B1]",  bg: "bg-blue-50" },
  { icon: Users,    label: "Manfaat jiwa",  value: (qty: number) => `${qty * 2} orang`,                color: "text-emerald-600", bg: "bg-emerald-50" },
];

const TARGET_BIBIT = 50000;
const API_BASE = "/api";

interface DonationStats {
  total_bibit: number; total_donors: number;
  pohon_tumbuh: number; pending: number;
  confirmed: number; planted: number; completed: number;
}
interface ActivityItem {
  id: number; donor_name: string; bibit_type: string;
  bibit_custom_name?: string; quantity: number;
  location_name: string; status: string; created_at: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 2) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

/* ─── Component ─────────────────────────────────────────── */
export default function DonasiBibitPage() {
  const [unlocked,     setUnlocked]     = useState(false);
  const [selectedType, setSelectedType] = useState(BIBIT_TYPES[0]);
  const [qty,          setQty]          = useState(5);
  const [selectedLoc,  setSelectedLoc]  = useState(LOCATIONS[0]);
  const [delivery,      setDelivery]      = useState<"pickup" | "antar">("pickup");
  const [showInProfile, setShowInProfile] = useState(true);
  const [donorName,     setDonorName]     = useState("");
  const [donorEmail,   setDonorEmail]   = useState("");
  const [submitted,       setSubmitted]       = useState(false);
  const [activeTab,       setActiveTab]       = useState<"donasi" | "sertifikat" | "aktivitas">("donasi");
  const [customBibitName, setCustomBibitName] = useState("");
  const [submitting,      setSubmitting]      = useState(false);

  // Real data from API
  const [stats,    setStats]    = useState<DonationStats>({ total_bibit: 0, total_donors: 0, pohon_tumbuh: 0, pending: 0, confirmed: 0, planted: 0, completed: 0 });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [shareCopied, setShareCopied] = useState(false);

  async function doShare(title: string) {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title, url }); return; } catch {} }
    try { await navigator.clipboard.writeText(url); } catch {
      const el = document.createElement("textarea"); el.value = url;
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setShareCopied(true); setTimeout(() => setShareCopied(false), 2000);
  }

  useEffect(() => {
    fetch(`${API_BASE}/donations/stats`).then(r => r.ok ? r.json() : null).then(d => { if (d) setStats(d); }).catch(() => {});
    fetch(`${API_BASE}/donations/activity`).then(r => r.ok ? r.json() : null).then(d => { if (d) setActivity(d); }).catch(() => {});
  }, [submitted]);

  const displayBibitName = selectedType.id === "lainnya"
    ? (customBibitName.trim() || "Pohon Pilihan Anda")
    : selectedType.name;

  const total = selectedType.price * qty;
  const pct   = Math.round(((stats.total_bibit || 0) / TARGET_BIBIT) * 100);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  return (
    <Layout>
      <SEO title="Donasi Bibit — Program Penghijauan Garut" description="Ikut serta dalam program donasi bibit pohon untuk penghijauan Kabupaten Garut bersama Nempo Organizer." path="/donasi-bibit" />
      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=85"
               alt="hutan" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-green-950/85 via-emerald-900/80 to-green-950/95" />
        </div>
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 md:pb-14">
          {/* Back */}
          <button onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-7 text-sm transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Kembali
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left copy */}
            <div>
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/25 backdrop-blur border border-emerald-400/30 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full">
                  <Leaf className="h-3.5 w-3.5" /> Program Penghijauan Garut
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#1BA0E2]/20 border border-[#1BA0E2]/30 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full">
                  <BadgeCheck className="h-3.5 w-3.5" /> Bermitra Resmi Pemkab Garut
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                Tanam Bibit,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-400">
                  Hijauken Garut
                </span>
              </h1>
              <p className="text-white/75 text-sm md:text-base leading-relaxed mb-6 max-w-lg">
                Setiap bibit yang Anda donasikan ditanam langsung oleh
                <strong className="text-white"> Dinas Lingkungan Hidup Kabupaten Garut</strong>.
                Dapatkan <strong className="text-blue-300">sertifikat penghargaan resmi</strong> sebagai bukti kepedulian Anda.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6 max-w-sm">
                {[
                  { icon: Leaf,     val: stats.total_bibit > 0 ? stats.total_bibit >= 1000 ? `${(stats.total_bibit/1000).toFixed(1)}K` : String(stats.total_bibit) : "0", lbl: "Bibit Terkumpul", c: "text-emerald-400" },
                  { icon: Users,    val: String(stats.total_donors),   lbl: "Donatur",       c: "text-rose-400"    },
                  { icon: TreePine, val: stats.pohon_tumbuh >= 1000 ? `${(stats.pohon_tumbuh/1000).toFixed(1)}K` : String(stats.pohon_tumbuh), lbl: "Pohon Tumbuh", c: "text-teal-300" },
                ].map(({ icon: Ic, val, lbl, c }) => (
                  <div key={lbl} className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
                    <Ic className={`h-4 w-4 mx-auto mb-1 ${c}`} />
                    <p className="text-white font-extrabold text-lg leading-none">{val}</p>
                    <p className="text-white/50 text-[9px] mt-0.5 leading-tight">{lbl}</p>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="max-w-sm">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-emerald-300 font-bold">{stats.total_bibit.toLocaleString("id")} bibit terkumpul</span>
                  <span className="text-white/50">Target 50.000</span>
                </div>
                <div className="h-2.5 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-300 relative"
                       style={{ width: `${pct}%` }}>
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-full" />
                  </div>
                </div>
                <p className="text-white/40 text-[10px] mt-1">{pct}% tercapai · Diperbarui hari ini</p>
              </div>
            </div>

            {/* Right — "quick donate" teaser card (desktop) */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-white">
                <p className="font-bold text-sm mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Donatur terbaru bergabung
                </p>
                <div className="space-y-3 mb-5">
                  {DONORS.slice(0, 4).map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={d.avatar} alt={d.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-white leading-tight">{d.name}</p>
                        <p className="text-white/50 text-xs">{d.bibit} bibit · {d.loc}</p>
                      </div>
                      <span className="text-white/30 text-[10px]">{d.time}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/50">
                  <Leaf className="h-4 w-4" /> Donasi Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          TRUST BAND
      ══════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bermitra resmi dengan</p>
            <div className="flex flex-wrap items-center gap-5">
              {[
                { Icon: Landmark,       ic: "text-blue-600 bg-blue-50 border-blue-100",    name: "Pemkab Garut",           sub: "Pemerintah Kabupaten" },
                { Icon: Leaf,           ic: "text-emerald-600 bg-emerald-50 border-emerald-100", name: "Dinas Lingkungan Hidup", sub: "Kab. Garut" },
                { Icon: GraduationCap,  ic: "text-purple-600 bg-purple-50 border-purple-100",   name: "Univ. Garut",            sub: "Mitra Riset" },
                { Icon: TreePine,       ic: "text-green-600 bg-green-50 border-green-100",       name: "Komunitas Garut Hijau",  sub: "LSM Lingkungan" },
              ].map(m => (
                <div key={m.name} className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 ${m.ic}`}>
                    <m.Icon className="w-4 h-4" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 leading-tight">{m.name}</p>
                    <p className="text-[9px] text-gray-400">{m.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5 text-[10px] font-bold">
              <Globe className="h-3 w-3" /> Terverifikasi Resmi
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Bagaimana Cara Kerjanya</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <div key={i} className="relative flex flex-col items-center text-center p-4">
                <div className={`h-12 w-12 rounded-2xl ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-[9px] font-black text-gray-300 tracking-widest mb-0.5">{s.n}</p>
                <p className="font-extrabold text-gray-900 text-sm mb-1">{s.title}</p>
                <p className="text-gray-400 text-[11px] leading-snug">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="absolute right-0 top-6 h-4 w-4 text-gray-200 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div className="sticky top-[60px] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {([
              { id: "donasi",     Icon: Sprout,  label: "Form Donasi"  },
              { id: "sertifikat", Icon: Award,   label: "Sertifikat"   },
              { id: "aktivitas",  Icon: Users,   label: "Aktivitas"    },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}>
                <tab.Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          TAB: FORM DONASI
      ══════════════════════════════════════════════════ */}
      {activeTab === "donasi" && !submitted && (
        <div id="form-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-36 lg:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Main form ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* STEP 1: Pilih Bibit */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-gray-50">
                  <span className="h-7 w-7 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center">1</span>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-sm">Pilih Jenis Bibit</h3>
                    <p className="text-gray-400 text-[11px]">Pilih pohon yang ingin Anda tanam untuk Garut</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BIBIT_TYPES.map(b => (
                    <button key={b.id} onClick={() => setSelectedType(b)}
                      className={`relative rounded-2xl border-2 overflow-hidden text-left transition-all duration-200 hover:shadow-md ${
                        selectedType.id === b.id ? `${b.border} shadow-md scale-[1.02]` : "border-gray-100 hover:border-gray-200"
                      }`}>
                      {/* Image top */}
                      <div className="relative h-20 overflow-hidden">
                        <img src={b.img} alt={b.name} className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${b.color} opacity-60`} />
                        <span className="absolute top-2 left-2 text-2xl drop-shadow-lg">{b.emoji}</span>
                        {b.tag && (
                          <span className={`absolute top-2 right-2 ${b.tagColor} text-white text-[8px] font-black px-1.5 py-0.5 rounded-full`}>
                            {b.tag}
                          </span>
                        )}
                        {selectedType.id === b.id && (
                          <div className="absolute bottom-2 right-2">
                            <CheckCircle className="h-4 w-4 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className={`p-2.5 ${b.bg}`}>
                        <p className="font-extrabold text-gray-900 text-[11px] leading-tight">{b.name}</p>
                        <p className="text-gray-400 text-[9px] mt-0.5 leading-tight">{b.desc}</p>
                        {b.id !== "lainnya" && (
                          <p className={`font-extrabold text-sm mt-1.5 ${selectedType.id === b.id ? "text-emerald-700" : "text-gray-700"}`}>
                            Rp {b.price.toLocaleString("id")}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {/* Custom bibit input — appears when "Lainnya" selected */}
                {selectedType.id === "lainnya" && (
                  <div className="px-4 pb-2">
                    <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
                      <label className="flex items-center gap-2 text-violet-700 text-xs font-bold mb-2">
                        <Sprout className="w-3.5 h-3.5" strokeWidth={2} />
                        Tulis nama pohon yang ingin Anda donasikan
                      </label>
                      <input
                        type="text"
                        value={customBibitName}
                        onChange={e => setCustomBibitName(e.target.value)}
                        placeholder="Contoh: Pohon Rambutan, Pohon Jati, Pohon Mangga..."
                        maxLength={60}
                        className="w-full bg-white border border-violet-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                      />
                      <p className="text-violet-400 text-[10px] mt-1.5">Tim kami akan memastikan ketersediaan bibit sebelum penanaman.</p>
                    </div>
                  </div>
                )}

                {/* Selected info bar */}
                {selectedType.id !== "lainnya" && (
                <div className={`mx-4 mb-4 p-3 rounded-2xl ${selectedType.bg} border ${selectedType.border} flex flex-wrap gap-3`}>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Wind className="h-3 w-3 text-blue-600" />
                    <span className="text-gray-600">CO₂: <strong className="text-gray-900">{selectedType.co2}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Sun className="h-3 w-3 text-blue-500" />
                    <span className="text-gray-600">Umur: <strong className="text-gray-900">{selectedType.umur}</strong></span>
                  </div>
                </div>
                )}
              </div>

              {/* STEP 2: Jumlah */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-gray-50">
                  <span className="h-7 w-7 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center">2</span>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-sm">Jumlah Bibit</h3>
                    <p className="text-gray-400 text-[11px]">Semakin banyak, semakin hijau Garut</p>
                  </div>
                </div>
                <div className="p-6">
                  {/* Counter */}
                  <div className="flex items-center justify-center gap-6 mb-5">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="h-12 w-12 rounded-2xl border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-700 font-bold text-2xl transition-all hover:bg-gray-50 active:scale-95">
                      −
                    </button>
                    <div className="text-center w-32">
                      <p className="text-6xl font-extrabold text-gray-900 tabular-nums leading-none">{qty}</p>
                      <p className="text-gray-400 text-sm mt-1">bibit pohon</p>
                    </div>
                    <button onClick={() => setQty(q => q + 1)}
                      className="h-12 w-12 rounded-2xl border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl transition-all active:scale-95">
                      +
                    </button>
                  </div>

                  {/* Quick picks */}
                  <div className="grid grid-cols-5 gap-2 mb-5">
                    {[
                      { n: 5,   lbl: "5"    },
                      { n: 10,  lbl: "10"   },
                      { n: 25,  lbl: "25",  hot: true },
                      { n: 50,  lbl: "50",  medal: true },
                      { n: 100, lbl: "100"  },
                    ].map(({ n, lbl, hot, medal }) => (
                      <button key={n} onClick={() => setQty(n)}
                        className={`relative flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                          qty === n
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                            : "border-gray-200 text-gray-700 hover:border-emerald-300 hover:text-emerald-700 bg-white"
                        }`}>
                        {hot && qty !== n && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full leading-none">HOT</span>
                        )}
                        <span className="text-sm font-extrabold">{lbl}</span>
                        {medal && <span className="inline-flex items-center gap-0.5 text-[9px] mt-0.5 opacity-70"><Award className="w-2.5 h-2.5" /> plakat</span>}
                      </button>
                    ))}
                  </div>

                  {/* Impact preview */}
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" /> Dampak {qty} bibit Anda per tahun
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {IMPACTS.map(({ icon: Ic, label, value, color, bg }) => (
                        <div key={label} className={`${bg} rounded-xl p-2.5 text-center`}>
                          <Ic className={`h-4 w-4 mx-auto mb-1 ${color}`} />
                          <p className={`font-extrabold text-sm ${color}`}>{value(qty)}</p>
                          <p className="text-gray-500 text-[9px] mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3: Lokasi */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-gray-50">
                  <span className="h-7 w-7 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center">3</span>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-sm">Lokasi Penanaman</h3>
                    <p className="text-gray-400 text-[11px]">Pilih area penghijauan prioritas di Garut</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LOCATIONS.map(loc => (
                    <button key={loc.id} onClick={() => setSelectedLoc(loc)}
                      className={`relative rounded-2xl border-2 overflow-hidden text-left transition-all hover:shadow-md ${
                        selectedLoc.id === loc.id ? "border-emerald-500 shadow-md" : "border-gray-100 hover:border-gray-200"
                      }`}>
                      <div className="relative h-24 overflow-hidden">
                        <img src={loc.img} alt={loc.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white font-bold text-sm leading-tight">{loc.name}</p>
                          <p className="text-white/70 text-[10px]">Kec. {loc.kec}</p>
                        </div>
                        {selectedLoc.id === loc.id && (
                          <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="px-3 py-2 bg-gray-50 flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <TreePine className="h-3 w-3 text-emerald-600" />
                          {loc.trees.toLocaleString("id")} pohon tertanam
                        </span>
                        {selectedLoc.id === loc.id && (
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Dipilih</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 4: Metode Pengambilan */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-gray-50">
                  <span className="h-7 w-7 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center">4</span>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-sm">Metode Pengambilan Bibit</h3>
                    <p className="text-gray-400 text-[11px]">Pilih cara Anda mendapatkan bibit setelah donasi dikonfirmasi</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Opsi Pickup */}
                  <button onClick={() => setDelivery("pickup")}
                    className={`relative flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
                      delivery === "pickup" ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}>
                    {delivery === "pickup" && (
                      <span className="absolute top-3 right-3">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </span>
                    )}
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${delivery === "pickup" ? "bg-emerald-100" : "bg-gray-100"}`}>
                      <Store className={`w-5 h-5 ${delivery === "pickup" ? "text-emerald-600" : "text-gray-500"}`} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className={`font-extrabold text-sm ${delivery === "pickup" ? "text-emerald-800" : "text-gray-900"}`}>Ambil Sendiri</p>
                      <p className="text-gray-400 text-[11px] leading-snug mt-0.5">Ambil bibit di Pusat Pemberian Bibit Nempo Organizer, Jl. Otista No. 12, Garut Kota</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Gratis</span>
                      <span className="text-[9px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Senin–Sabtu 08.00–16.00</span>
                    </div>
                  </button>

                  {/* Opsi Antar */}
                  <button onClick={() => setDelivery("antar")}
                    className={`relative flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
                      delivery === "antar" ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}>
                    {delivery === "antar" && (
                      <span className="absolute top-3 right-3">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </span>
                    )}
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${delivery === "antar" ? "bg-emerald-100" : "bg-gray-100"}`}>
                      <Truck className={`w-5 h-5 ${delivery === "antar" ? "text-emerald-600" : "text-gray-500"}`} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className={`font-extrabold text-sm ${delivery === "antar" ? "text-emerald-800" : "text-gray-900"}`}>Diantar ke Lokasi Tanam</p>
                      <p className="text-gray-400 text-[11px] leading-snug mt-0.5">Tim kami mengantarkan & menanam bibit langsung di lokasi yang Anda pilih</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[9px] font-bold bg-blue-100 text-[#0172B1] px-2 py-0.5 rounded-full">Direkomendasikan</span>
                      <span className="text-[9px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Jadwal dihubungi WA</span>
                    </div>
                  </button>
                </div>

                {/* Info note */}
                <div className="mx-4 mb-4 flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                  <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-blue-700 text-[11px] leading-relaxed">
                    {delivery === "pickup"
                      ? <>Setelah donasi dikonfirmasi, Anda akan mendapat <strong>kode pengambilan</strong> via email. Tunjukkan kode ke petugas kami di Pusat Bibit.</>
                      : <>Tim Dinas LH Kab. Garut akan <strong>menghubungi via WhatsApp</strong> untuk koordinasi jadwal dan titik penanaman di lokasi pilihan Anda.</>
                    }
                  </p>
                </div>
              </div>

              {/* STEP 5: Data donatur */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-gray-50">
                  <span className="h-7 w-7 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center">5</span>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-sm">Data Donatur</h3>
                    <p className="text-gray-400 text-[11px]">Nama akan tertera di sertifikat penghargaan resmi</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">Nama Lengkap *</label>
                    <input type="text" value={donorName} onChange={e => setDonorName(e.target.value)}
                      placeholder="Nama sesuai KTP — akan tercetak di sertifikat"
                      className="w-full border-2 border-gray-100 focus:border-emerald-400 rounded-2xl px-4 py-3.5 text-sm outline-none transition-colors bg-gray-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">Alamat Email *</label>
                    <input type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)}
                      placeholder="Sertifikat PDF dikirim ke email ini"
                      className="w-full border-2 border-gray-100 focus:border-emerald-400 rounded-2xl px-4 py-3.5 text-sm outline-none transition-colors bg-gray-50 focus:bg-white" />
                  </div>
                  {/* Tampil di profil toggle */}
                  <div className="border-2 rounded-2xl overflow-hidden transition-all">
                    <button
                      type="button"
                      onClick={() => setShowInProfile(v => !v)}
                      className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left">
                      <div className={`relative h-6 w-11 rounded-full transition-colors ${showInProfile ? "bg-emerald-500" : "bg-gray-200"}`}>
                        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${showInProfile ? "translate-x-5" : "translate-x-0.5"}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">
                          <span className="inline-flex items-center gap-1.5">
                            {showInProfile
                              ? <><UserCheck className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2}/> Tampilkan nama di papan donatur</>
                              : <><UserX className="w-3.5 h-3.5 text-gray-400" strokeWidth={2}/> Sembunyikan nama (Anonim)</>}
                          </span>
                        </p>
                        <p className="text-gray-400 text-[11px] leading-snug">
                          {showInProfile
                            ? "Nama Anda akan muncul di halaman Aktivitas Donatur"
                            : "Nama Anda tidak akan ditampilkan secara publik"}
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-2xl p-3">
                    <Award className="h-4 w-4 text-[#0172B1] shrink-0 mt-0.5" />
                    <p className="text-[#0172B1] text-xs leading-relaxed">
                      Sertifikat digital berformat PDF akan dikirim dalam <strong>1–2 hari kerja</strong> dan dapat diverifikasi di portal resmi Pemkab Garut.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Sticky Sidebar ── */}
            <div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm sticky top-36 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-emerald-600 to-green-700 p-5 text-white">
                  <h3 className="font-extrabold text-base mb-1">Ringkasan Donasi</h3>
                  <p className="text-emerald-200 text-xs">Transparansi 100% — tercatat oleh Pemkab Garut</p>
                </div>

                <div className="p-5 space-y-4">
                  {/* Summary items */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">Jenis bibit</span>
                      <span className="inline-flex items-center gap-1 font-bold text-gray-900 text-xs"><TreePine className="w-3.5 h-3.5 text-green-600" strokeWidth={2}/> {displayBibitName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">Lokasi tanam</span>
                      <span className="font-bold text-gray-900 text-xs text-right max-w-[130px] leading-tight">{selectedLoc.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">Pengambilan</span>
                      <span className={`font-bold text-xs ${delivery === "pickup" ? "text-emerald-700" : "text-blue-700"}`}>
                        <span className="inline-flex items-center gap-1">
                          {delivery === "pickup"
                            ? <><Store className="w-3 h-3" strokeWidth={2}/> Ambil Sendiri</>
                            : <><Truck className="w-3 h-3" strokeWidth={2}/> Diantar ke Lokasi</>}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">Tampil di profil</span>
                      <span className={`font-bold text-xs ${showInProfile ? "text-emerald-700" : "text-gray-500"}`}>
                        <span className="inline-flex items-center gap-1">
                          {showInProfile
                            ? <><UserCheck className="w-3 h-3" strokeWidth={2}/> Ditampilkan</>
                            : <><UserX className="w-3 h-3" strokeWidth={2}/> Anonim</>}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Total pohon — no price */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700 text-sm">Total Pohon</span>
                      <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-700 text-3xl">
                        {qty} <TreePine className="w-7 h-7" strokeWidth={1.8}/>
                      </span>
                    </div>
                    <p className="text-emerald-600 text-[10px] mt-1">Donasi {qty} {displayBibitName} untuk Garut</p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-600">Yang Anda dapatkan:</p>
                    {[
                      { t: "Sertifikat resmi Pemkab Garut",         always: true },
                      { t: "Laporan foto penanaman",                always: true },
                      { t: "Badge donatur di profil",               always: true },
                      { t: "Plakat nama di lokasi tanam",           always: qty >= 50, note: "min. 50 bibit" },
                    ].map(({ t, always, note }) => (
                      <div key={t} className={`flex items-start gap-2 ${!always ? "opacity-50" : ""}`}>
                        <CheckCircle className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${always ? "text-emerald-600" : "text-gray-300"}`} />
                        <span className="text-xs text-gray-600 leading-relaxed">
                          {t} {note && !always && <span className="text-gray-400">({note})</span>}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={async () => {
                      if (!donorName || !donorEmail || submitting) return;
                      setSubmitting(true);
                      try {
                        await fetch(`${API_BASE}/donations`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            donor_name: donorName,
                            donor_email: donorEmail,
                            bibit_type: selectedType.id,
                            bibit_custom_name: selectedType.id === "lainnya" ? customBibitName : undefined,
                            quantity: qty,
                            location_id: selectedLoc.id,
                            location_name: selectedLoc.name,
                            delivery_type: delivery,
                            show_in_profile: showInProfile,
                          }),
                        });
                        setSubmitted(true);
                      } catch { setSubmitted(true); }
                      finally { setSubmitting(false); }
                    }}
                    disabled={!donorName || !donorEmail || submitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-extrabold py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0">
                    <Heart className="h-4 w-4" /> {submitting ? "Mengirim..." : "Donasi Sekarang"}
                  </button>
                  {(!donorName || !donorEmail) && (
                    <p className="text-center text-[#0172B1] text-[10px]">⚠ Lengkapi nama & email untuk melanjutkan</p>
                  )}
                  <p className="flex items-center justify-center gap-1 text-gray-400 text-[10px]">
                    <Lock className="w-3 h-3 shrink-0" strokeWidth={2} /> 100% tersalurkan ke program penghijauan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile sticky bar */}
          <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 px-3 pb-2">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400">Total pohon donasimu</p>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-emerald-700 text-xl leading-none">{qty}</span>
                  <span className="text-xl leading-none">🌳</span>
                  <span className="text-gray-500 text-xs">{displayBibitName}</span>
                </div>
              </div>
              <button
                onClick={async () => {
                  if (!donorName || !donorEmail || submitting) return;
                  setSubmitting(true);
                  try {
                    await fetch(`${API_BASE}/donations`, {
                      method: "POST", headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ donor_name: donorName, donor_email: donorEmail, bibit_type: selectedType.id, bibit_custom_name: selectedType.id === "lainnya" ? customBibitName : undefined, quantity: qty, location_id: selectedLoc.id, location_name: selectedLoc.name, delivery_type: delivery, show_in_profile: showInProfile }),
                    });
                    setSubmitted(true);
                  } catch { setSubmitted(true); } finally { setSubmitting(false); }
                }}
                disabled={!donorName || !donorEmail || submitting}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all whitespace-nowrap">
                <Leaf className="h-4 w-4" /> {submitting ? "..." : "Donasi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SUCCESS STATE
      ══════════════════════════════════════════════════ */}
      {activeTab === "donasi" && submitted && (
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Terima Kasih, {donorName}! 🌳</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Donasi <strong className="text-emerald-700">{qty} bibit {displayBibitName}</strong> untuk <strong>{selectedLoc.name}</strong> telah tercatat.
            Sertifikat akan dikirim ke <strong>{donorEmail}</strong> dalam 1–2 hari kerja.
          </p>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total donasi</span>
              <span className="font-extrabold text-emerald-700">Rp {total.toLocaleString("id")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">No. referensi</span>
              <span className="font-bold text-gray-900">NMP/DON/2025/0{stats.total_donors + 1}</span>
            </div>
            <div className="border-t border-emerald-100 pt-3 text-xs text-gray-500">
              🌿 Anda telah berkontribusi menyerap ±{(qty * 1.8).toFixed(0)} kg CO₂ per tahun
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => setActiveTab("sertifikat")}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              <Award className="h-4 w-4" /> Lihat Sertifikat
            </button>
            <button onClick={() => { setSubmitted(false); setDonorName(""); setDonorEmail(""); }}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl transition-colors">
              Donasi Lagi
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB: SERTIFIKAT
      ══════════════════════════════════════════════════ */}
      {activeTab === "sertifikat" && (
        <div id="sertifikat" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Certificate preview */}
            <div>
              <div className="text-center mb-5">
                <h2 className="text-xl font-extrabold text-gray-900 mb-1">Sertifikat Penghargaan</h2>
                <p className="text-gray-400 text-sm">Contoh sertifikat resmi yang Anda terima</p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400/20 rounded-3xl blur-3xl scale-95" />
                <div className="relative bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-50 rounded-3xl border-[3px] border-blue-300 shadow-2xl overflow-hidden">
                  <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                    <TreePine className="w-[320px] h-[320px] text-emerald-900" />
                  </div>

                  <div className="relative p-8 text-center">
                    {/* Logos */}
                    <div className="flex items-center justify-center gap-5 mb-6">
                      <img src="/Assets/Logo/nempo-new.webp" alt="Nempo" className="h-12 w-12 object-contain rounded-xl bg-white p-1" />
                      <div className="h-12 w-px bg-blue-200" />
                      <div className="text-left">
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Pemerintah Kabupaten</p>
                        <p className="font-extrabold text-gray-800">Garut</p>
                        <p className="text-[8px] text-gray-400">Dinas Lingkungan Hidup</p>
                      </div>
                    </div>

                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.25em] mb-2">Sertifikat Penghargaan</p>
                    <h2 className="text-2xl font-black text-[#0172B1] mb-0.5" style={{ fontFamily: "Georgia, serif" }}>DONASI PENGHIJAUAN</h2>
                    <p className="text-gray-400 text-[10px] mb-5">Program Garut Hijau 2025</p>

                    <div className="border-t-2 border-b-2 border-blue-200 py-5 mb-5">
                      <p className="text-[9px] text-gray-400 mb-1.5 uppercase tracking-wider">Diberikan kepada</p>
                      <p className="font-black text-gray-900 text-xl mb-1" style={{ fontFamily: "Georgia, serif" }}>
                        {submitted && donorName ? donorName : "Nama Donatur"}
                      </p>
                      <p className="text-[10px] text-gray-500 mb-3">Atas kontribusi nyata dalam program penghijauan Garut</p>
                      <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full">
                        <Leaf className="h-3.5 w-3.5" />
                        {submitted ? qty : 5} {submitted ? displayBibitName : "Pohon Mahoni"} · {submitted ? selectedLoc.name : "Lereng Gunung Papandayan"}
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="text-left">
                        <div className="h-px w-28 bg-gray-300 mb-1" />
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Kepala Dinas LH</p>
                        <p className="text-[10px] font-bold text-gray-600">Kab. Garut</p>
                      </div>
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-xl ring-4 ring-emerald-100">
                        <Award className="h-7 w-7 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">No. Sertifikat</p>
                        <p className="text-[10px] font-bold text-gray-600">NMP/2025/0{stats.total_donors + 1}</p>
                        <div className="h-px w-28 bg-gray-300 mt-3 ml-auto" />
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Direktur Nempo</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gradient-to-r from-teal-500 via-green-400 to-emerald-500" />
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors">
                  <Download className="h-4 w-4" /> Unduh PDF
                </button>
                <button onClick={() => doShare("Donasi Bibit Garut Hijau")}
                  className="flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all"
                  style={shareCopied ? { background: "#22c55e", color: "white" } : { background: "#f3f4f6", color: "#374151" }}>
                  <Share2 className="h-4 w-4" /> {shareCopied ? "Link Disalin!" : "Bagikan"}
                </button>
              </div>
            </div>

            {/* Info panel */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-500" /> Keistimewaan Sertifikat
                </h3>
                {[
                  { icon: BadgeCheck, c: "text-emerald-600", t: "Resmi & Terverifikasi",      d: "Diterbitkan bersama Pemerintah Kabupaten Garut dan dapat diverifikasi online." },
                  { icon: Award,      c: "text-[#0172B1]",   t: "Penghargaan Pemerintah",     d: "Ditandatangani Kepala Dinas Lingkungan Hidup Kabupaten Garut." },
                  { icon: Download,   c: "text-blue-600",    t: "Format PDF Beresolusi Tinggi",d: "Bisa dicetak, dibingkai, atau dibagikan di media sosial." },
                  { icon: MapPin,     c: "text-rose-600",    t: "Koordinat GPS Lokasi Tanam", d: "Sertifikat memuat lokasi tepat penanaman bibit Anda di Garut." },
                ].map(({ icon: Ic, c, t, d }) => (
                  <div key={t} className="flex gap-3 mb-4 last:mb-0">
                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <Ic className={`h-4 w-4 ${c}`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{t}</p>
                      <p className="text-gray-400 text-xs leading-snug mt-0.5">{d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <p className="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4" /> Cara Mendapatkan Sertifikat
                </p>
                <ol className="space-y-2">
                  {[
                    "Isi form donasi dengan lengkap",
                    "Selesaikan pembayaran donasi",
                    "Tunggu 1–2 hari kerja",
                    "Cek email — sertifikat PDF terkirim",
                    "Verifikasi di portal Pemkab Garut",
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#0172B1]">
                      <span className="h-4 w-4 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>

              <button onClick={() => setActiveTab("donasi")}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors">
                <Leaf className="h-4 w-4" /> Donasi & Dapatkan Sertifikat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB: AKTIVITAS
      ══════════════════════════════════════════════════ */}
      {activeTab === "aktivitas" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donor feed */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-extrabold text-gray-900">Donatur Terbaru</h3>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="divide-y divide-gray-50">
                {activity.length === 0 && (
                  <div className="px-5 py-8 text-center text-gray-400 text-sm">Belum ada aktivitas donasi.</div>
                )}
                {activity.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className="relative shrink-0">
                      <div className="h-11 w-11 rounded-full bg-emerald-100 ring-2 ring-white shadow flex items-center justify-center text-emerald-700 font-bold text-base">
                        {d.donor_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                        <Leaf className="h-2.5 w-2.5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm">{d.donor_name}</p>
                      <p className="text-gray-500 text-xs">
                        Donasi <span className="font-semibold text-emerald-700">{d.quantity} {d.bibit_type === "lainnya" ? (d.bibit_custom_name || "bibit") : d.bibit_type}</span> · {d.location_name}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-gray-300 text-[10px]">{timeAgo(d.created_at)}</span>
                      <div className="flex justify-end mt-0.5">
                        {Array.from({ length: Math.min(d.quantity, 5) }).map((_, j) => (
                          <span key={j} className="text-[8px]">🌳</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats + CTA */}
            <div className="space-y-4">
              {/* Progress card */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white">
                <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-4">Progress Penghijauan 2025</p>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {[
                    { val: stats.total_bibit >= 1000 ? `${(stats.total_bibit/1000).toFixed(1)}K` : String(stats.total_bibit), lbl: "Bibit Terkumpul" },
                    { val: String(stats.total_donors), lbl: "Total Donatur" },
                    { val: stats.pohon_tumbuh >= 1000 ? `${(stats.pohon_tumbuh/1000).toFixed(1)}K` : String(stats.pohon_tumbuh), lbl: "Pohon Tumbuh" },
                    { val: "4", lbl: "Lokasi Aktif" },
                  ].map(({ val, lbl }) => (
                    <div key={lbl} className="bg-white/10 rounded-2xl p-3">
                      <p className="font-extrabold text-2xl text-white">{val}</p>
                      <p className="text-emerald-200 text-xs">{lbl}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-emerald-300 font-bold">{pct}% tercapai</span>
                  <span className="text-white/50">Target 50.000 bibit</span>
                </div>
                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-green-200" style={{ width: `${pct}%` }} />
                </div>
              </div>

              {/* Locations summary */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-extrabold text-gray-900 mb-4 text-sm">Lokasi Penanaman Aktif</h3>
                <div className="space-y-3">
                  {LOCATIONS.map(loc => (
                    <div key={loc.id} className="flex items-center gap-3">
                      <img src={loc.img} alt={loc.name} className="h-10 w-10 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-xs truncate">{loc.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(loc.trees / 4000) * 100}%` }} />
                          </div>
                          <span className="text-emerald-700 font-bold text-[10px] shrink-0">{loc.trees.toLocaleString("id")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button onClick={() => setActiveTab("donasi")}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 hover:-translate-y-0.5">
                <Leaf className="h-4 w-4" /> Ikut Berdonasi Sekarang <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ══════════════════════════════════════════════════
          ENV IMPACT COUNTER BAND
      ══════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-teal-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest text-center mb-6">Dampak Nyata Program Penghijauan Garut</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
            {[
              { val: "22.4 ton", label: "CO₂ terserap/tahun",    icon: Wind,     color: "text-sky-400",     bg: "bg-sky-400/10 border-sky-400/20" },
              { val: "39.8 ribu", label: "Liter air tersimpan",   icon: Droplets, color: "text-blue-400",    bg: "bg-blue-400/10 border-blue-400/20" },
              { val: "7.4 ton",  label: "O₂ dihasilkan/tahun",   icon: Sun,      color: "text-yellow-400",  bg: "bg-yellow-400/10 border-yellow-400/20" },
              { val: "1.6 ribu", label: "Jiwa terbantu",          icon: Users,    color: "text-rose-400",    bg: "bg-rose-400/10 border-rose-400/20" },
            ].map(({ val, label, icon: Ic, color, bg }) => (
              <div key={label} className={`${bg} border rounded-2xl p-4 text-center backdrop-blur-sm`}>
                <Ic className={`h-6 w-6 mx-auto mb-2 ${color}`} />
                <p className={`font-black text-2xl ${color} leading-none`}>{val}</p>
                <p className="text-white/50 text-xs mt-1.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════ */}
      <FaqSection />
    </Layout>
  );
}

/* ─── FAQ Component ──────────────────────────────────────── */
const FAQS = [
  {
    q: "Apakah donasi bibit ini resmi dan terpercaya?",
    a: "Ya, program Donasi Bibit Nempo Organizer dijalankan bersama Dinas Lingkungan Hidup Kabupaten Garut. Setiap donasi dicatat, bibit ditanam oleh tim resmi DLH, dan Anda mendapat laporan foto beserta sertifikat penghargaan resmi."
  },
  {
    q: "Berapa minimal donasi yang bisa saya berikan?",
    a: "Anda bisa mendonasikan minimal 1 bibit pohon. Harga bervariasi mulai dari Rp 15.000 (Bambu Betung) hingga Rp 35.000 (Pohon Durian) per bibit, tergantung jenis pohon yang dipilih."
  },
  {
    q: "Bagaimana saya tahu bibit saya benar-benar ditanam?",
    a: "Tim Dinas LH Kab. Garut akan mengirimkan foto dokumentasi penanaman ke email Anda dalam 7-14 hari setelah donasi dikonfirmasi. Sertifikat juga memuat koordinat GPS lokasi tepat penanaman."
  },
  {
    q: "Apakah saya bisa memilih lokasi penanaman?",
    a: "Ya! Anda bisa memilih dari 4 lokasi penanaman prioritas: Lereng Gunung Papandayan, Lereng Gunung Cikuray, Kawasan Limbangan, dan Kawasan Cisompet."
  },
  {
    q: "Apa itu sertifikat penghargaan dan bagaimana cara mendapatkannya?",
    a: "Sertifikat penghargaan adalah dokumen resmi dari Pemkab Garut yang menyatakan kontribusi Anda dalam program penghijauan. Sertifikat dikirim dalam format PDF ke email Anda dalam 1-2 hari kerja setelah donasi dikonfirmasi."
  },
  {
    q: "Apakah donasi bisa atas nama perusahaan atau kelompok?",
    a: "Tentu! Masukkan nama perusahaan, komunitas, atau kelompok di kolom nama donatur. Sertifikat akan diterbitkan atas nama tersebut dan cocok untuk keperluan CSR perusahaan Anda."
  },
];

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="bg-gray-50 border-t border-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <Info className="h-3.5 w-3.5" /> Pertanyaan Umum
          </span>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Ada Pertanyaan?</h2>
          <p className="text-gray-500 text-sm">Temukan jawaban dari pertanyaan yang paling sering ditanyakan</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                <span className="font-bold text-gray-900 text-sm leading-snug">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-4">
                  <div className="border-t border-gray-50 pt-3">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-3">Masih ada pertanyaan?</p>
          <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
            <MessageCircle className="w-4 h-4 shrink-0" strokeWidth={2} /> Hubungi Kami via DM Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
