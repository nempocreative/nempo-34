import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link, useLocation } from "@/lib/wouter";
import {
  User, Settings, Package, Heart, Star, Ticket, LogOut,
  ChevronRight, Phone, Crown, Shield, Award, Zap, Flame,
  Camera, Bell, HelpCircle, FileText, Gift, TrendingUp,
  CheckCircle, Edit3, Trees, Loader2, Lock, Trash2,
  ArrowRight, CalendarCheck, CheckCheck, Gem,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useUserPoints } from "@/lib/use-user-points";
import { useState, useEffect } from "react";

const BASE_STATS = [
  { key: "pesanan", val: "–", label: "Pesanan",  icon: Package, color: "text-blue-500",    bg: "bg-blue-50" },
  { key: "ulasan",  val: "–", label: "Ulasan",   icon: Star,    color: "text-yellow-500",  bg: "bg-yellow-50" },
  { key: "favorit", val: "–", label: "Favorit",  icon: Heart,   color: "text-rose-500",    bg: "bg-rose-50" },
  { key: "voucher", val: "–", label: "Voucher",  icon: Ticket,  color: "text-emerald-500", bg: "bg-emerald-50" },
];

const MENU_GROUPS = [
  {
    title: "Aktivitas Saya",
    items: [
      { icon: Package,    label: "Pesanan Saya",        sub: "Riwayat & pesanan aktif",       path: "/pesanan-saya",  color: "text-blue-600",    bg: "bg-blue-50" },
      { icon: Heart,      label: "Favorit",              sub: "Tempat yang disimpan",          path: "/favorit",       color: "text-rose-500",    bg: "bg-rose-50" },
      { icon: Star,       label: "Ulasan Saya",          sub: "Ulasan yang ditulis",           path: "/ulasan",        color: "text-yellow-500",  bg: "bg-yellow-50" },
      { icon: Ticket,     label: "Voucher Saya",         sub: "Voucher yang dimiliki",         path: "/voucherlist",   color: "text-emerald-600", bg: "bg-emerald-50" },
    ],
  },
  {
    title: "Program & Komunitas",
    items: [
      // { icon: Trees,      label: "Donasi Bibit",         sub: "Program penghijauan Garut",     path: "/donasi-bibit",  color: "text-green-600",   bg: "bg-green-50" },
      { icon: Gift,       label: "Referral Teman",       sub: "Dapatkan poin ekstra",          path: "/referral",      color: "text-violet-600",  bg: "bg-violet-50" },
      { icon: TrendingUp, label: "Poin Reward",          sub: "Lihat & tukar poin",            path: "/poin",          color: "text-[#0194f3]",  bg: "bg-blue-50" },
    ],
  },
  {
    title: "Pengaturan",
    items: [
      { icon: Edit3,      label: "Edit Profil",          sub: "Ubah foto & data diri",         path: "/edit-profil",   color: "text-gray-600",    bg: "bg-gray-100" },
      { icon: Lock,       label: "Ganti Password",       sub: "Ajukan perubahan password",     path: "/profil/ganti-password", color: "text-[#0172B1]", bg: "bg-blue-50" },
      { icon: Bell,       label: "Notifikasi",           sub: "Kelola pemberitahuan",          path: "/notifikasi",    color: "text-sky-600",     bg: "bg-sky-50" },
      { icon: Settings,   label: "Pengaturan",           sub: "Privasi & keamanan akun",       path: "/settings",      color: "text-slate-600",   bg: "bg-slate-50" },
      { icon: Trash2,     label: "Hapus Akun",           sub: "Ajukan penghapusan akun",       path: "/profil/hapus-akun", color: "text-red-500",  bg: "bg-red-50" },
      { icon: HelpCircle, label: "Bantuan",              sub: "FAQ & hubungi support",         path: "/bantuan",       color: "text-teal-600",    bg: "bg-teal-50" },
      { icon: FileText,   label: "Syarat & Ketentuan",   sub: "Kebijakan pengguna",            path: "/tos",           color: "text-gray-500",    bg: "bg-gray-50" },
    ],
  },
];

const TIER_CONFIG: Record<string, { icon: typeof Crown; color: string; bg: string; next: string; perks: string[] }> = {
  Bronze: {
    icon: Shield,
    color: "text-[#0172B1]",
    bg: "from-[#0172B1] to-[#0194f3]",
    next: "Silver (500 poin lagi)",
    perks: ["Akses voucher dasar", "Notifikasi event"],
  },
  Silver: {
    icon: Award,
    color: "text-slate-500",
    bg: "from-slate-500 to-slate-600",
    next: "Gold (1.260 poin lagi)",
    perks: ["Diskon 5% tiket wisata", "Early access event", "Voucher bulanan"],
  },
  Gold: {
    icon: Crown,
    color: "text-yellow-500",
    bg: "from-yellow-500 to-amber-500",
    next: "Platinum (3.000 poin lagi)",
    perks: ["Diskon 10% semua layanan", "Priority customer service", "Voucher eksklusif", "Undangan event VIP"],
  },
  Platinum: {
    icon: Gem,
    color: "text-purple-500",
    bg: "from-purple-600 to-indigo-600",
    next: "—",
    perks: ["Diskon 20% semua layanan", "Concierge travel pribadi", "Akses event eksklusif", "Voucher premium bulanan", "Priority fast-track support"],
  },
};

function formatJoinDate(dateStr: string | null) {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

const API = "/api";

export default function ProfilePage() {
  const { user, mitra, logout, loading } = useAuth();
  const { points: pointsData, refetch: refetchPoints } = useUserPoints();
  const [, setLocation] = useLocation();

  const [checkin, setCheckin] = useState<{
    already_checked_in: boolean;
    streak: number;
    points_today: number;
    total_points: number;
  } | null>(null);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState<{ pts: number; streak: number } | null>(null);

  const [userStats, setUserStats] = useState<{
    review_count: number;
    favorite_count: number;
    voucher_count: number;
    order_count: number;
  } | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("nempo_user_token") : null;

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/user/checkin/status`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setCheckin(d)).catch(() => {});
    fetch(`${API}/user/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setUserStats(d)).catch(() => {});
  }, [token]);

  async function handleCheckin() {
    if (!token || checkin?.already_checked_in || checkinLoading) return;
    setCheckinLoading(true);
    try {
      const r = await fetch(`${API}/user/checkin`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      setCheckin({ already_checked_in: true, streak: d.streak, points_today: 0, total_points: d.total_points });
      if (!d.already_checked_in) {
        setCheckinSuccess({ pts: d.points_earned, streak: d.streak });
        setTimeout(() => setCheckinSuccess(null), 4000);
        refetchPoints?.();
      }
    } catch {}
    setCheckinLoading(false);
  }

  const statsLoading = !userStats && !!token;
  const STATS = BASE_STATS.map(s => {
    if (s.key === "pesanan") return { ...s, val: statsLoading ? "–" : String(userStats?.order_count ?? 0) };
    if (s.key === "ulasan")  return { ...s, val: statsLoading ? "–" : String(userStats?.review_count ?? 0) };
    if (s.key === "favorit") return { ...s, val: statsLoading ? "–" : String(userStats?.favorite_count ?? 0) };
    if (s.key === "voucher") return { ...s, val: statsLoading ? "–" : String(userStats?.voucher_count ?? 0) };
    return s;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  useEffect(() => { if (!user && mitra) setLocation("/mitra-dashboard"); }, [user, mitra]);

  if (!user) {
    const features = [
      { icon: Heart,   color: "text-rose-500",    bg: "bg-rose-50",    label: "Simpan Favorit",      desc: "Bookmark destinasi & kuliner" },
      { icon: Ticket,  color: "text-emerald-600",  bg: "bg-emerald-50", label: "Voucher Eksklusif",   desc: "Diskon spesial member" },
      { icon: Star,    color: "text-amber-500",    bg: "bg-amber-50",   label: "Tulis Ulasan",        desc: "Bagikan pengalaman Anda" },
    ];
    return (
      <Layout>
        <style>{`
          @keyframes pingRingA { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2.4);opacity:0} }
          @keyframes pingRingB { 0%{transform:scale(1);opacity:.35} 100%{transform:scale(2.1);opacity:0} }
          @keyframes floatBob  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          @keyframes fadeSlideUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
          .ping-a { animation: pingRingA 2.8s ease-out infinite; }
          .ping-b { animation: pingRingB 2.8s ease-out infinite 0.9s; }
          .float-bob { animation: floatBob 3.6s ease-in-out infinite; }
          .fsu-1 { animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
          .fsu-2 { animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.22s both; }
          .fsu-3 { animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
          .fsu-4 { animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.48s both; }
          .fsu-5 { animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.6s both; }
        `}</style>

        {/* ── Hero gradient ── */}
        <div className="relative bg-gradient-to-br from-[#001E6E] via-[#0046B8] to-[#0194f3] pt-14 pb-28 px-6 overflow-hidden flex flex-col items-center text-center">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -mr-24 -mt-24 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#1BA0E2]/20 -ml-20 -mb-20 pointer-events-none" />
          <div className="absolute top-1/3 left-8 w-3 h-3 rounded-full bg-white/20 pointer-events-none" />
          <div className="absolute top-1/4 right-12 w-2 h-2 rounded-full bg-white/30 pointer-events-none" />
          <div className="absolute bottom-16 right-6 w-4 h-4 rounded-full bg-white/10 pointer-events-none" />

          {/* Floating avatar + rings */}
          <div className="relative mb-5 float-bob">
            <span className="ping-a absolute inset-0 rounded-full border-2 border-white/30" />
            <span className="ping-b absolute inset-0 rounded-full border-2 border-white/20" />
            <div className="relative w-28 h-28 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/35 flex items-center justify-center overflow-hidden shadow-2xl">
              <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
                <circle cx="40" cy="30" r="18" fill="rgba(255,255,255,0.88)"/>
                <circle cx="40" cy="29" r="10" fill="rgba(1,148,243,0.55)"/>
                <circle cx="40" cy="27" r="6" fill="rgba(255,255,255,0.7)"/>
                <path d="M12 76 Q12 56 40 56 Q68 56 68 76" fill="rgba(255,255,255,0.82)"/>
              </svg>
            </div>
            {/* Profile status badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg border-2 border-white">
              <Award className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
          </div>

          <h2 className="text-white font-black text-2xl mb-2 fsu-1">Selamat Datang!</h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs fsu-2">
            Masuk untuk mengakses fitur eksklusif &amp; mulai petualangan seru di Garut
          </p>
        </div>

        {/* ── White card section ── */}
        <div className="bg-gray-50 -mt-10 rounded-t-[2rem] px-5 pt-6 pb-28 md:pb-10 flex flex-col gap-5">

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-3 fsu-3">
            {features.map(f => (
              <div key={f.label} className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col items-center text-center shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-2`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} strokeWidth={1.8} />
                </div>
                <p className="font-bold text-gray-800 text-[11px] leading-tight mb-0.5">{f.label}</p>
                <p className="text-gray-400 text-[10px] leading-tight">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 fsu-4">
            <Link href="/auth/login">
              <button className="w-full py-4 bg-gradient-to-r from-[#0172B1] via-[#0194f3] to-[#1BA0E2] text-white font-black text-base rounded-2xl shadow-lg shadow-[#0194f3]/30 hover:opacity-90 active:scale-[.98] transition-all flex items-center justify-center gap-2">
                Masuk ke Akun
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="w-full py-4 border-2 border-[#0194f3] text-[#0194f3] font-bold text-base rounded-2xl hover:bg-[#0194f3]/5 active:scale-[.98] transition-all">
                Daftar Gratis
              </button>
            </Link>
          </div>

          {/* Bottom hint */}
          <p className="fsu-5 text-center text-gray-400 text-[11px] leading-relaxed">
            Dengan mendaftar, Anda menyetujui{" "}
            <Link href="/tos"><span className="text-[#0194f3] font-semibold">Syarat &amp; Ketentuan</span></Link>{" "}
            Nempo Organizer
          </p>
        </div>
      </Layout>
    );
  }

  const tierKey = (pointsData?.tier ?? "Bronze") as keyof typeof TIER_CONFIG;
  const tier = TIER_CONFIG[tierKey] ?? TIER_CONFIG["Bronze"];
  const TierIcon = tier.icon;
  const points = pointsData?.total_points ?? 0;
  const pointsToNext = pointsData?.nextPts ?? 500;
  const pointsPct = pointsData?.pct ?? 0;
  const loginStreak = pointsData?.login_streak ?? 0;

  function handleLogout() {
    logout();
    setLocation("/");
  }

  return (
    <Layout>
      <SEO title="Profil Saya" noIndex />
      <div className="pb-24 lg:pb-8">

        {/* ── Hero Header ── */}
        <div className="relative bg-gradient-to-br from-[#001E6E] via-[#0046B8] to-[#0194f3] pt-8 pb-24 px-5">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #FFC300 0%, transparent 60%)" }} />
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -mr-16 -mt-16" />

          <div className="relative flex justify-between items-center mb-6">
            <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">Profil Saya</span>
            <Link href="/settings">
              <button className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" strokeWidth={2} />
              </button>
            </Link>
          </div>

          <div className="relative flex items-end gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                {user.avatar_url
                  ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                  : <User className="w-9 h-9 text-white/80" strokeWidth={1.5} />}
              </div>
              <Link href="/edit-profil">
                <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-[#0194f3] flex items-center justify-center shadow-lg">
                  <Camera className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </button>
              </Link>
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-white font-black text-xl leading-tight">{user.name}</h1>
              </div>
              <p className="text-white/60 text-xs mb-2">{user.email}</p>
              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r ${tier.bg} text-white shadow`}>
                  <TierIcon className="w-3 h-3" strokeWidth={2} /> Member {tierKey}
                </div>
                {user.phone && (
                  <div className="inline-flex items-center gap-1 text-[10px] text-white/60">
                    <Phone className="w-3 h-3" strokeWidth={2} /> {user.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Float Card ── */}
        <div className="px-4 -mt-14 relative z-10 mb-5">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 grid grid-cols-4 gap-1">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center mx-auto mb-1.5`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} strokeWidth={1.8} />
                </div>
                <p className="font-black text-gray-900 text-lg leading-none">{s.val}</p>
                <p className="text-gray-400 text-[10px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Poin & Progress ── */}
        <div className="px-4 mb-5">
          <div className="bg-gradient-to-r from-[#001E6E] to-[#0194f3] rounded-3xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Poin Reward</p>
                <p className="font-black text-2xl mt-0.5">
                  {points.toLocaleString("id")}
                  <span className="text-white/50 font-normal text-sm ml-1">poin</span>
                </p>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tier.bg} flex items-center justify-center shadow-lg`}>
                <TierIcon className="w-6 h-6 text-white" strokeWidth={1.8} />
              </div>
            </div>
            <div className="mb-1.5">
              <div className="flex justify-between text-[10px] text-white/50 mb-1">
                <span>{tierKey}</span>
                <span>Target: {pointsToNext.toLocaleString("id")} poin</span>
              </div>
              <div className="h-2 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pointsPct}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-white/50 text-[10px]">
                <Zap className="w-3 h-3 inline mr-0.5" strokeWidth={2} />
                {pointsData?.next === "—"
                  ? "Tier tertinggi! 🏆"
                  : `Naik ke ${pointsData?.next ?? tier.next} (${Math.max(0, pointsToNext - points)} poin lagi)`}
              </p>
              {loginStreak > 0 && (
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-0.5">
                  <Flame className="w-3 h-3 text-orange-300" strokeWidth={2} />
                  <span className="text-[10px] text-white/80 font-bold">{loginStreak} hari</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Member Benefits ── */}
        <div className="px-4 mb-5">
          <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Keuntungan Member {tierKey}</p>
            <div className="space-y-2">
              {tier.perks.map(perk => (
                <div key={perk} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={2} />
                  {perk}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Check In Harian ── */}
        {user && (
          <div className="px-4 mb-5">
            {/* Success toast */}
            {checkinSuccess && (
              <div className="mb-3 flex items-center gap-3 bg-emerald-500 text-white rounded-2xl px-4 py-3 shadow-lg animate-bounce-once">
                <CheckCheck className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                <div>
                  <p className="font-black text-sm">+{checkinSuccess.pts} poin diterima!</p>
                  <p className="text-emerald-100 text-[11px]">Streak {checkinSuccess.streak} hari berturut-turut 🔥</p>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-[#0194f3] to-[#0172B1] rounded-3xl p-4 shadow-lg relative overflow-hidden">
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/8 -mr-8 -mt-8 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 -ml-6 -mb-6 pointer-events-none" />

              <div className="relative flex items-center gap-4">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all duration-300 ${
                  checkin?.already_checked_in
                    ? "bg-emerald-400"
                    : "bg-white/20 border border-white/30"
                }`}>
                  {checkin?.already_checked_in
                    ? <CheckCheck className="w-7 h-7 text-white" strokeWidth={2.5} />
                    : <CalendarCheck className="w-7 h-7 text-white" strokeWidth={1.8} />
                  }
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-sm leading-tight">
                    {checkin?.already_checked_in ? "Sudah Check In Hari Ini ✓" : "Check In Harian"}
                  </p>
                  <p className="text-white/60 text-[11px] mt-0.5">
                    {checkin?.already_checked_in
                      ? `Streak ${checkin.streak} hari · Besok +${((checkin.streak + 1) % 7 === 0) ? 40 : 10} poin`
                      : checkin
                        ? `Klaim +${checkin.points_today} poin hari ini · Streak ${checkin.streak} hari`
                        : "Klaim poin harian kamu sekarang"
                    }
                  </p>
                  {/* 7-day streak progress dots */}
                  {checkin && (
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const done = i < (checkin.streak % 7 === 0 && checkin.streak > 0 ? 7 : checkin.streak % 7);
                        return (
                          <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${
                              done ? "bg-white w-4" : "bg-white/25 w-3"
                            }`}
                          />
                        );
                      })}
                      <span className="text-white/40 text-[9px] ml-1 font-bold">7 hari</span>
                    </div>
                  )}
                </div>

                {/* Button */}
                <button
                  onClick={handleCheckin}
                  disabled={checkin?.already_checked_in || checkinLoading || !checkin}
                  className={`shrink-0 px-4 py-2.5 rounded-xl font-black text-xs transition-all duration-200 ${
                    checkin?.already_checked_in
                      ? "bg-white/15 text-white/40 cursor-default"
                      : checkinLoading
                        ? "bg-white/20 text-white/60 cursor-wait"
                        : "bg-white text-[#0172B1] shadow-md active:scale-95 hover:shadow-lg"
                  }`}
                >
                  {checkinLoading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : checkin?.already_checked_in
                      ? "Selesai"
                      : "Check In"
                  }
                </button>
              </div>

              {/* Bonus info */}
              {!checkin?.already_checked_in && checkin && checkin.streak > 0 && (
                <div className="relative mt-3 bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-orange-300 shrink-0" strokeWidth={2} />
                  <p className="text-white/70 text-[11px]">
                    {7 - (checkin.streak % 7)} hari lagi bonus streak +30 poin ekstra!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Menu Groups ── */}
        <div className="px-4 space-y-3 mb-5">
          {MENU_GROUPS.map(group => (
            <div key={group.title}>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">{group.title}</p>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {group.items.filter(item =>
                  !(item.path === "/profil/ganti-password" && user.is_google)
                ).map((item, idx, arr) => (
                  <Link key={item.label} href={item.path}>
                    <div className={`flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer ${idx !== arr.length - 1 ? "border-b border-gray-50" : ""}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}>
                          <item.icon className={`w-5 h-5 ${item.color}`} strokeWidth={1.8} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm leading-tight">{item.label}</p>
                          <p className="text-gray-400 text-[11px] mt-0.5">{item.sub}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" strokeWidth={2} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Logout ── */}
        <div className="px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={2} />
            Keluar dari Akun
          </button>
          <p className="text-center text-gray-300 text-[10px] mt-3">
            Bergabung sejak {formatJoinDate(user.created_at)} · v2.1.0
          </p>
        </div>

      </div>
    </Layout>
  );
}
