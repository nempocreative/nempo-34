import { useState, useCallback } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import {
  MapPin, Clock, Wallet, Calendar, ChevronRight, RotateCcw,
  Mountain, Utensils, Hotel, Car, Sun, Sunset, Moon, Star, Download,
  Check, Info, Users, Heart, Camera, Leaf, Landmark, Waves, Ticket,
  Share2, ChevronDown, ChevronUp, Navigation,
} from "lucide-react";
import { mockWisata } from "@/data/mockWisata";
import { mockKuliner } from "@/data/mockKuliner";
import { mockPenginapan } from "@/data/mockPenginapan";

// ── Types ────────────────────────────────────────────────────────────────────
type TravelStyle = "budget" | "menengah" | "premium";
type Interest = "alam" | "budaya" | "sejarah" | "kuliner" | "buatan";

interface FormState {
  budget: string;
  days: number;
  style: TravelStyle;
  interests: Interest[];
  people: number;
}

interface DayActivity {
  time: string;
  timeIcon: "morning" | "afternoon" | "evening" | "night";
  type: "wisata" | "kuliner" | "hotel" | "transport";
  name: string;
  location: string;
  description: string;
  cost: number;
  image?: string;
  link?: string;
  duration?: string;
  tips?: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  theme: string;
  activities: DayActivity[];
  dayTotal: number;
}

interface GeneratedItinerary {
  days: ItineraryDay[];
  hotel: { name: string; location: string; pricePerNight: number; image?: string; rating: number };
  totalCost: number;
  budgetLeft: number;
  summary: string;
}

// ── Interest options ─────────────────────────────────────────────────────────
const interestOptions: { key: Interest; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { key: "alam",    label: "Alam & Petualangan", icon: Mountain,  color: "#16a34a", bg: "#dcfce7" },
  { key: "budaya",  label: "Budaya & Tradisi",   icon: Landmark,  color: "#7c3aed", bg: "#ede9fe" },
  { key: "sejarah", label: "Sejarah",             icon: Landmark,  color: "#b45309", bg: "#fef3c7" },
  { key: "kuliner", label: "Kuliner Khas",        icon: Utensils,  color: "#dc2626", bg: "#fee2e2" },
  { key: "buatan",  label: "Wahana & Taman",      icon: Camera,    color: "#0284c7", bg: "#e0f2fe" },
];

// ── Time icon component ───────────────────────────────────────────────────────
function TimeIcon({ type, size = 16 }: { type: DayActivity["timeIcon"]; size?: number }) {
  const map = {
    morning:   { icon: Sun,    color: "#0194f3" },
    afternoon: { icon: Sun,    color: "#f97316" },
    evening:   { icon: Sunset, color: "#8b5cf6" },
    night:     { icon: Moon,   color: "#3b82f6" },
  };
  const { icon: Icon, color } = map[type];
  return <Icon size={size} style={{ color }} />;
}

// ── Itinerary engine ─────────────────────────────────────────────────────────
function generateItinerary(form: FormState): GeneratedItinerary {
  const budgetNum   = parseInt(form.budget.replace(/\D/g, ""), 10) || 0;
  const perDayBudget = budgetNum / form.days;

  // Filter wisata by interest
  let filteredWisata = [...mockWisata];
  if (form.interests.length > 0) {
    const cats: Record<Interest, string[]> = {
      alam:    ["Alam"],
      budaya:  ["Budaya"],
      sejarah: ["Sejarah"],
      kuliner: ["Alam", "Budaya"],
      buatan:  ["Buatan"],
    };
    const wanted = form.interests.flatMap(i => cats[i]);
    const primary = filteredWisata.filter(w => wanted.includes(w.category));
    filteredWisata = primary.length >= 2 ? primary : filteredWisata;
  }
  filteredWisata.sort((a, b) => b.rating - a.rating);

  // Pick hotel based on style / per-day budget
  let sortedHotels = [...mockPenginapan].sort((a, b) => a.pricePerNight - b.pricePerNight);
  let hotel = sortedHotels[0];
  if (form.style === "premium") {
    hotel = sortedHotels[sortedHotels.length - 1];
  } else if (form.style === "menengah") {
    hotel = sortedHotels[Math.floor(sortedHotels.length / 2)];
  } else {
    hotel = sortedHotels.find(h => h.pricePerNight <= 400000) ?? sortedHotels[0];
  }

  // Kuliner picks
  const kuliners = [...mockKuliner].sort((a, b) => b.rating - a.rating);

  // Destination themes per day
  const dayThemes = [
    "Alam & Pemandangan",
    "Budaya & Sejarah",
    "Petualangan & Santai",
    "Kuliner & Oleh-oleh",
    "Pantai & Air",
  ];

  // Daily tips bank
  const tipBank = [
    "Bawa sunscreen dan topi, cuaca Garut bisa terik di siang hari.",
    "Siapkan uang tunai, banyak tempat wisata belum menerima pembayaran digital.",
    "Beli tiket wisata online lebih hemat hingga 15% via Nempo.",
    "Waktu terbaik berkunjung: pagi hari sebelum jam 10 untuk menghindari keramaian.",
    "Bawa jaket di malam hari — Garut sejuk terutama di kawasan pegunungan.",
    "Coba angkot lokal untuk pengalaman transportasi khas Garut.",
  ];

  const days: ItineraryDay[] = [];
  let usedWisataIdx = 0;
  let totalActivitiesCost = 0;

  for (let d = 1; d <= form.days; d++) {
    const w1 = filteredWisata[usedWisataIdx % filteredWisata.length];
    const w2 = filteredWisata[(usedWisataIdx + 1) % filteredWisata.length];
    usedWisataIdx += 2;

    const lunch  = kuliners[(d * 2 - 2) % kuliners.length];
    const dinner = kuliners[(d * 2 - 1) % kuliners.length];

    // Estimate food cost per person
    const mealCostPerPerson = form.style === "premium" ? 80000 : form.style === "menengah" ? 45000 : 25000;
    const transportPerDay   = form.style === "premium" ? 200000 : form.style === "menengah" ? 100000 : 50000;

    const activities: DayActivity[] = [
      {
        time: "07.00",
        timeIcon: "morning",
        type: "transport",
        name: d === 1 ? "Tiba di Garut & Check-in" : "Sarapan Pagi",
        location: d === 1 ? hotel.location : "Sekitar Penginapan",
        description: d === 1
          ? `Check-in di ${hotel.name}. Nikmati sarapan dan istirahat sejenak sebelum mulai petualangan.`
          : "Mulai hari dengan sarapan khas Sunda — nasi tutug oncom atau karedok.",
        cost: d === 1 ? 0 : mealCostPerPerson * form.people,
        duration: "1 jam",
        tips: tipBank[(d - 1) % tipBank.length],
      },
      {
        time: "09.00",
        timeIcon: "morning",
        type: "wisata",
        name: w1.name,
        location: w1.location,
        description: w1.description,
        cost: w1.entryFee * form.people,
        image: w1.image,
        link: `/wisata/${w1.id}`,
        duration: "2–3 jam",
        tips: `Rating: ⭐ ${w1.rating} — Tiket masuk Rp${w1.entryFee.toLocaleString("id-ID")}/orang`,
      },
      {
        time: "12.00",
        timeIcon: "afternoon",
        type: "kuliner",
        name: lunch.name,
        location: lunch.location,
        description: `Makan siang dengan ${lunch.description.substring(0, 80)}...`,
        cost: mealCostPerPerson * form.people,
        image: lunch.image,
        link: `/kuliner/${lunch.id}`,
        duration: "1 jam",
        tips: `Buka: ${lunch.hours ?? "10.00–20.00"}`,
      },
      {
        time: "14.00",
        timeIcon: "afternoon",
        type: "wisata",
        name: w2.name,
        location: w2.location,
        description: w2.description,
        cost: w2.entryFee * form.people,
        image: w2.image,
        link: `/wisata/${w2.id}`,
        duration: "2–3 jam",
        tips: `Rating: ⭐ ${w2.rating} — Spot foto terbaik ada di sini!`,
      },
      {
        time: "18.00",
        timeIcon: "evening",
        type: "kuliner",
        name: dinner.name,
        location: dinner.location,
        description: `Makan malam dengan cita rasa khas. ${dinner.description.substring(0, 70)}...`,
        cost: mealCostPerPerson * form.people,
        image: dinner.image,
        link: `/kuliner/${dinner.id}`,
        duration: "1 jam",
        tips: `Buka: ${dinner.hours ?? "17.00–22.00"}`,
      },
      {
        time: "20.00",
        timeIcon: "night",
        type: "hotel",
        name: `Kembali ke ${hotel.name}`,
        location: hotel.location,
        description: "Istirahat dan nikmati fasilitas penginapan sebelum petualangan hari berikutnya.",
        cost: 0,
        duration: "—",
      },
    ];

    const dayWisataCost = (w1.entryFee + w2.entryFee) * form.people;
    const dayFoodCost   = mealCostPerPerson * 3 * form.people;
    const dayTotal      = dayWisataCost + dayFoodCost + transportPerDay;
    totalActivitiesCost += dayTotal;

    days.push({
      day: d,
      title: `Hari ${d}`,
      theme: dayThemes[(d - 1) % dayThemes.length],
      activities,
      dayTotal,
    });
  }

  const hotelTotal  = hotel.pricePerNight * form.days;
  const totalCost   = totalActivitiesCost + hotelTotal;
  const budgetLeft  = Math.max(0, budgetNum - totalCost);

  const summaryMap: Record<TravelStyle, string> = {
    budget:   "Itinerary hemat cocok untuk backpacker dan wisatawan mandiri.",
    menengah: "Itinerary seimbang antara kenyamanan dan efisiensi budget.",
    premium:  "Itinerary premium dengan fasilitas terbaik dan pengalaman tak terlupakan.",
  };

  return {
    days,
    hotel: {
      name: hotel.name,
      location: hotel.location,
      pricePerNight: hotel.pricePerNight,
      image: hotel.image,
      rating: hotel.rating,
    },
    totalCost,
    budgetLeft,
    summary: summaryMap[form.style],
  };
}

// ── Number formatter ─────────────────────────────────────────────────────────
function fmtRp(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}

// ── Budget input formatter ────────────────────────────────────────────────────
function formatBudgetInput(raw: string): string {
  const num = raw.replace(/\D/g, "");
  if (!num) return "";
  return parseInt(num, 10).toLocaleString("id-ID");
}

// ── Main page component ───────────────────────────────────────────────────────
export default function ItineraryPage() {
  const [step, setStep] = useState<"form" | "result">("form");
  const [form, setForm] = useState<FormState>({
    budget: "",
    days: 2,
    style: "menengah",
    interests: ["alam", "kuliner"],
    people: 2,
  });
  const [result, setResult] = useState<GeneratedItinerary | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [generating, setGenerating] = useState(false);

  const toggleInterest = (key: Interest) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(key)
        ? f.interests.filter(i => i !== key)
        : [...f.interests, key],
    }));
  };

  const handleGenerate = useCallback(() => {
    const budgetNum = parseInt(form.budget.replace(/\D/g, ""), 10);
    if (!budgetNum || budgetNum < 100000) return;

    setGenerating(true);
    setTimeout(() => {
      const itinerary = generateItinerary(form);
      setResult(itinerary);
      setStep("result");
      setExpandedDay(1);
      setGenerating(false);
    }, 1400);
  }, [form]);

  const handleReset = () => {
    setStep("form");
    setResult(null);
    setForm({ budget: "", days: 2, style: "menengah", interests: ["alam", "kuliner"], people: 2 });
  };

  const budgetNum = parseInt(form.budget.replace(/\D/g, ""), 10) || 0;
  const isValid   = budgetNum >= 100000;

  // ── Activity card ────────────────────────────────────────────────────────
  function ActivityCard({ act }: { act: DayActivity }) {
    const typeColors: Record<DayActivity["type"], { bg: string; border: string; label: string }> = {
      wisata:    { bg: "#eff6ff", border: "#bfdbfe", label: "Destinasi" },
      kuliner:   { bg: "#fff7ed", border: "#fed7aa", label: "Kuliner" },
      hotel:     { bg: "#f5f3ff", border: "#ddd6fe", label: "Penginapan" },
      transport: { bg: "#f0fdf4", border: "#bbf7d0", label: "Aktivitas" },
    };
    const { bg, border, label } = typeColors[act.type];
    const TypeIcon = act.type === "wisata" ? Mountain : act.type === "kuliner" ? Utensils : act.type === "hotel" ? Hotel : Car;

    return (
      <div className="flex gap-3 group" style={{ paddingBottom: 16 }}>
        {/* Timeline stem */}
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm border"
               style={{ background: bg, borderColor: border }}>
            <TypeIcon size={16} style={{ color: border.replace("fe", "80").replace("aa", "60").replace("d0", "60").replace("fe", "90") }} />
          </div>
          <div className="flex-1 w-0.5 mt-1" style={{ background: "#e5e7eb", minHeight: 20 }} />
        </div>

        {/* Card */}
        <div className="flex-1 rounded-xl overflow-hidden border mb-1 shadow-sm hover:shadow-md transition-shadow"
             style={{ borderColor: border, background: "white" }}>
          {act.image && (
            <div className="h-28 overflow-hidden">
              <img src={act.image} alt={act.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <TimeIcon type={act.timeIcon} size={13} />
                  <span className="text-xs text-gray-400 font-medium">{act.time}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: bg, color: "#374151", fontSize: 10 }}>{label}</span>
                </div>
                <p className="font-semibold text-gray-800 text-sm leading-tight">{act.name}</p>
              </div>
              {act.cost > 0 && (
                <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg"
                      style={{ background: "#fef9c3", color: "#92400e" }}>
                  {fmtRp(act.cost)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <MapPin size={11} />
              <span>{act.location}</span>
              {act.duration && <><span className="text-gray-300 mx-1">•</span><Clock size={11} /><span>{act.duration}</span></>}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-2">{act.description}</p>

            {act.tips && (
              <div className="flex items-start gap-1.5 text-xs text-blue-700 bg-blue-50 rounded-lg px-2.5 py-1.5">
                <Info size={11} className="mt-0.5 shrink-0" />
                <span>{act.tips}</span>
              </div>
            )}

            {act.link && (
              <Link href={act.link}
                className="inline-flex items-center gap-1 mt-2 text-xs font-medium"
                style={{ color: "#0194f3" }}>
                Lihat Detail <ChevronRight size={11} />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── FORM STEP ────────────────────────────────────────────────────────────────
  if (step === "form") {
    return (
      <Layout>
        {/* Hero */}
        <div className="relative overflow-hidden" style={{
          background: "linear-gradient(135deg, #001553 0%, #0194f3 55%, #0EA5E9 100%)",
          paddingTop: 48, paddingBottom: 48,
        }}>
          {/* decorative circles */}
          {[260, 180, 110].map((s, i) => (
            <div key={i} style={{
              position: "absolute", bottom: -s / 2, right: -s / 2.5,
              width: s, height: s, borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.1)",
              pointerEvents: "none",
            }} />
          ))}
          <div className="max-w-2xl mx-auto px-4 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                 style={{ background: "rgba(255,195,0,0.18)", border: "1px solid rgba(255,195,0,0.4)" }}>
              <Navigation size={13} style={{ color: "#FFC300" }} />
              <span className="text-xs font-semibold" style={{ color: "#FFC300" }}>Perencana perjalanan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
              Biar Kami yang<br />Susunkan Jadwal Liburanmu
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Masukkan budget dan durasi, kami akan otomatis merekomendasikan destinasi, kuliner, dan penginapan terbaik di Garut.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-4 pb-20" style={{ marginTop: -24 }}>
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 border border-gray-100">

            {/* Budget */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Wallet size={14} className="inline mr-1.5" style={{ color: "#0194f3" }} />
                Total Budget Perjalanan
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="500.000"
                  value={form.budget}
                  onChange={e => setForm(f => ({ ...f, budget: formatBudgetInput(e.target.value) }))}
                  className="w-full pl-9 pr-4 py-3 text-sm font-semibold rounded-xl border-2 outline-none transition-colors"
                  style={{
                    borderColor: form.budget ? "#0194f3" : "#e5e7eb",
                    background: form.budget ? "#eff6ff" : "white",
                  }}
                />
              </div>
              {form.budget && !isValid && (
                <p className="text-xs text-red-500 mt-1">Budget minimal Rp 100.000</p>
              )}
              {isValid && form.days > 0 && (
                <p className="text-xs mt-1" style={{ color: "#16a34a" }}>
                  ≈ {fmtRp(Math.floor(budgetNum / form.days))} / hari per rombongan
                </p>
              )}
            </div>

            {/* Duration + People */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <Calendar size={14} className="inline mr-1.5" style={{ color: "#0194f3" }} />
                  Durasi (Hari)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(d => (
                    <button key={d} onClick={() => setForm(f => ({ ...f, days: d }))}
                      className="flex-1 py-2 rounded-lg text-sm font-bold transition-all border-2"
                      style={{
                        borderColor: form.days === d ? "#0194f3" : "#e5e7eb",
                        background: form.days === d ? "#0194f3" : "white",
                        color: form.days === d ? "white" : "#374151",
                      }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <Users size={14} className="inline mr-1.5" style={{ color: "#0194f3" }} />
                  Jumlah Orang
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map(p => (
                    <button key={p} onClick={() => setForm(f => ({ ...f, people: p }))}
                      className="flex-1 py-2 rounded-lg text-sm font-bold transition-all border-2"
                      style={{
                        borderColor: form.people === p ? "#0194f3" : "#e5e7eb",
                        background: form.people === p ? "#0194f3" : "white",
                        color: form.people === p ? "white" : "#374151",
                      }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Travel style */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Heart size={14} className="inline mr-1.5" style={{ color: "#0194f3" }} />
                Gaya Perjalanan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: "budget",   emoji: "🎒", label: "Budget",   desc: "Hemat & Mandiri" },
                  { key: "menengah", emoji: "🏡", label: "Menengah", desc: "Nyaman & Seimbang" },
                  { key: "premium",  emoji: "🏨", label: "Premium",  desc: "Mewah & Eksklusif" },
                ] as { key: TravelStyle; emoji: string; label: string; desc: string }[]).map(s => (
                  <button key={s.key} onClick={() => setForm(f => ({ ...f, style: s.key }))}
                    className="py-3 px-2 rounded-xl text-center border-2 transition-all"
                    style={{
                      borderColor: form.style === s.key ? "#0194f3" : "#e5e7eb",
                      background: form.style === s.key ? "#eff6ff" : "white",
                    }}>
                    <div className="text-xl mb-0.5">{s.emoji}</div>
                    <div className="text-xs font-bold" style={{ color: form.style === s.key ? "#0194f3" : "#374151" }}>
                      {s.label}
                    </div>
                    <div className="text-[10px] text-gray-400">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Leaf size={14} className="inline mr-1.5" style={{ color: "#0194f3" }} />
                Minat Wisata <span className="font-normal text-gray-400">(pilih semua yang sesuai)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(opt => {
                  const active = form.interests.includes(opt.key);
                  return (
                    <button key={opt.key} onClick={() => toggleInterest(opt.key)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                      style={{
                        borderColor: active ? opt.color : "#e5e7eb",
                        background: active ? opt.bg : "white",
                        color: active ? opt.color : "#6b7280",
                      }}>
                      <opt.icon size={12} />
                      {opt.label}
                      {active && <Check size={11} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleGenerate}
              disabled={!isValid || generating}
              className="w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: isValid ? "linear-gradient(135deg, #0194f3 0%, #0EA5E9 100%)" : "#e5e7eb",
                color: isValid ? "white" : "#9ca3af",
                boxShadow: isValid ? "0 4px 14px rgba(0,100,210,0.4)" : "none",
                transform: isValid ? "scale(1)" : "scale(0.98)",
              }}>
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menyusun itinerary terbaik...
                </>
              ) : (
                <>
                  <Calendar size={16} />
                  Buat Itinerary Sekarang
                </>
              )}
            </button>

            {!isValid && (
              <p className="text-center text-xs text-gray-400 mt-2">
                Masukkan budget terlebih dahulu untuk melanjutkan
              </p>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // ── RESULT STEP ──────────────────────────────────────────────────────────────
  if (!result) return null;

  const budgetOk = result.budgetLeft >= 0;
  const overBudget = !budgetOk;

  return (
    <Layout>
      <SEO title="Buat Rencana Perjalanan ke Garut" description="Rencanakan perjalanan wisata ke Garut dengan mudah. Pilih destinasi, kuliner, dan penginapan sesuai budget dan minat." path="/itinerary" />
      {/* Hero result */}
      <div className="relative" style={{
        background: "linear-gradient(135deg, #001553 0%, #0194f3 60%, #0EA5E9 100%)",
        paddingTop: 32, paddingBottom: 56,
      }}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <button onClick={handleReset}
              className="flex items-center gap-1 text-xs font-medium text-blue-200 hover:text-white transition-colors">
              <RotateCcw size={13} /> Buat Ulang
            </button>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                   style={{ background: "rgba(255,195,0,0.2)", border: "1px solid rgba(255,195,0,0.4)" }}>
                <Check size={12} style={{ color: "#FFC300" }} />
                <span className="text-xs font-bold" style={{ color: "#FFC300" }}>Itinerary Siap!</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1">
                Liburan Garut {form.days} Hari
              </h1>
              <p className="text-blue-100 text-xs">{result.summary}</p>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-xs text-blue-200 mb-0.5">Estimasi Total</div>
              <div className="text-lg font-black text-white">{fmtRp(result.totalCost)}</div>
              <div className={`text-xs font-semibold mt-0.5 ${overBudget ? "text-red-300" : "text-green-300"}`}>
                {overBudget ? `Melebihi budget ${fmtRp(Math.abs(result.budgetLeft))}` : `Sisa ${fmtRp(result.budgetLeft)}`}
              </div>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { icon: Calendar,  label: `${form.days} Hari` },
              { icon: Users,     label: `${form.people} Orang` },
              { icon: MapPin,    label: `${result.days.reduce((s, d) => s + d.activities.filter(a => a.type === "wisata").length, 0)} Destinasi` },
              { icon: Utensils,  label: `${result.days.reduce((s, d) => s + d.activities.filter(a => a.type === "kuliner").length, 0)} Kuliner` },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                   style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
                <p.icon size={11} />
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-24" style={{ marginTop: -24 }}>

        {/* Hotel card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100 mb-4">
          <div className="flex items-center gap-3 p-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
              {result.hotel.image
                ? <img src={result.hotel.image} alt={result.hotel.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-purple-100 flex items-center justify-center"><Hotel size={24} style={{ color: "#7c3aed" }} /></div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <Hotel size={11} style={{ color: "#7c3aed" }} />
                <span className="text-xs text-purple-600 font-semibold">Penginapan Rekomendasi</span>
              </div>
              <p className="font-bold text-gray-800 text-sm truncate">{result.hotel.name}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={10} /><span>{result.hotel.location}</span>
                <Star size={10} style={{ color: "#0194f3" }} /><span>{result.hotel.rating}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-gray-400">Per malam</div>
              <div className="font-black text-sm" style={{ color: "#7c3aed" }}>{fmtRp(result.hotel.pricePerNight)}</div>
              <div className="text-xs text-gray-400">{form.days} malam = {fmtRp(result.hotel.pricePerNight * form.days)}</div>
            </div>
          </div>
        </div>

        {/* Budget overview */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            <Wallet size={14} style={{ color: "#0194f3" }} /> Ringkasan Budget
          </h3>
          <div className="space-y-2">
            {[
              { label: "Penginapan",   amount: result.hotel.pricePerNight * form.days, color: "#7c3aed" },
              { label: "Wisata & Tiket", amount: result.days.reduce((s, d) => s + d.activities.filter(a => a.type === "wisata").reduce((ss, a) => ss + a.cost, 0), 0), color: "#0194f3" },
              { label: "Kuliner",      amount: result.days.reduce((s, d) => s + d.activities.filter(a => a.type === "kuliner").reduce((ss, a) => ss + a.cost, 0), 0), color: "#dc2626" },
              { label: "Transportasi & Lain-lain", amount: result.totalCost - result.hotel.pricePerNight * form.days - result.days.reduce((s, d) => s + d.activities.filter(a => a.type !== "hotel" && a.type !== "transport").reduce((ss, a) => ss + a.cost, 0), 0), color: "#16a34a" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-gray-600">{item.label}</span>
                </div>
                <span className="font-semibold text-gray-800">{fmtRp(Math.max(0, item.amount))}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-gray-200 my-2" />
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800 text-sm">Total Estimasi</span>
              <span className="font-black text-base" style={{ color: "#0194f3" }}>{fmtRp(result.totalCost)}</span>
            </div>
            {budgetOk && (
              <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl text-xs font-semibold"
                   style={{ background: "#dcfce7", color: "#16a34a" }}>
                <Check size={13} /> Budget mencukupi! Masih ada sisa {fmtRp(result.budgetLeft)}
              </div>
            )}
            {overBudget && (
              <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl text-xs font-semibold"
                   style={{ background: "#fee2e2", color: "#dc2626" }}>
                <Info size={13} /> Budget kurang {fmtRp(Math.abs(result.budgetLeft))} — pertimbangkan mengurangi 1 destinasi
              </div>
            )}
          </div>
        </div>

        {/* Day-by-day */}
        <h3 className="text-base font-black text-gray-800 mb-3 flex items-center gap-2">
          <Navigation size={16} style={{ color: "#0194f3" }} />
          Rencana Perjalanan Hari per Hari
        </h3>

        {result.days.map(day => (
          <div key={day.day} className="bg-white rounded-2xl shadow-md border border-gray-100 mb-3 overflow-hidden">
            {/* Day header */}
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left"
              onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
              style={{ background: expandedDay === day.day ? "#eff6ff" : "white" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0"
                     style={{ background: "linear-gradient(135deg, #0194f3, #0EA5E9)" }}>
                  {day.day}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">{day.title}</p>
                  <p className="text-xs text-gray-500">{day.theme}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#fef9c3", color: "#92400e" }}>
                  ~{fmtRp(day.dayTotal)}
                </span>
                {expandedDay === day.day
                  ? <ChevronUp size={16} className="text-gray-400" />
                  : <ChevronDown size={16} className="text-gray-400" />
                }
              </div>
            </button>

            {/* Day activities */}
            {expandedDay === day.day && (
              <div className="px-4 pt-3 pb-1">
                {day.activities.map((act, i) => (
                  <ActivityCard key={i} act={act} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            onClick={handleReset}
            className="py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all hover:bg-gray-50"
            style={{ borderColor: "#0194f3", color: "#0194f3" }}>
            <RotateCcw size={14} /> Buat Ulang
          </button>
          <button
            onClick={() => window.print()}
            className="py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white transition-all"
            style={{ background: "linear-gradient(135deg, #0194f3, #0EA5E9)" }}>
            <Download size={14} /> Simpan / Cetak
          </button>
        </div>

        {/* Tips banner */}
        <div className="mt-4 rounded-2xl p-4 border"
             style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)", borderColor: "#fcd34d" }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                 style={{ background: "#1BA0E2" }}>
              <Ticket size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-800 mb-0.5">Hemat lebih banyak!</p>
              <p className="text-xs text-[#0172B1] leading-relaxed">
                Beli tiket wisata dan paket kuliner lewat Nempo untuk dapat diskon hingga 20% dan bonus voucher menarik.
              </p>
              <Link href="/tiket"
                className="inline-flex items-center gap-1 mt-2 text-xs font-bold"
                style={{ color: "#b45309" }}>
                Lihat Tiket Tersedia <ChevronRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
