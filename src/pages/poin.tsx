import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import {
  Zap, ChevronLeft, Flame, Shield, Award, Crown, Gem,
  TrendingUp, ArrowUpRight, CheckCircle2, Lock, Loader2,
  Gift, Star, Calendar,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useUserPoints } from "@/lib/use-user-points";

const MILESTONES = [
  { pts: 50,   label: "Pendaftaran",  reward: "+50 poin bonus",           done: true },
  { pts: 100,  label: "Poin 100",     reward: "Voucher 5% off",           icon: Gift },
  { pts: 300,  label: "Poin 300",     reward: "Voucher 10% off",          icon: Gift },
  { pts: 500,  label: "Tier Silver",  reward: "Voucher Silver 15% off",   icon: Award },
  { pts: 1500, label: "Tier Gold",    reward: "Voucher Gold 20% off",     icon: Crown },
  { pts: 3000, label: "Tier Platinum",reward: "Akses VIP Event",          icon: Gem },
];

const TIER_META: Record<string, { icon: typeof Shield; bg: string; color: string; ring: string }> = {
  Bronze:   { icon: Shield, bg: "from-[#0172B1] to-[#0194f3]", color: "text-[#0194f3]",  ring: "ring-[#0194f3]/30" },
  Silver:   { icon: Award,  bg: "from-slate-400 to-slate-500",  color: "text-slate-500",  ring: "ring-slate-300" },
  Gold:     { icon: Crown,  bg: "from-yellow-400 to-amber-500", color: "text-yellow-500", ring: "ring-yellow-300" },
  Platinum: { icon: Gem,    bg: "from-violet-500 to-purple-600",color: "text-violet-500", ring: "ring-violet-300" },
};

const HOW_TO = [
  { icon: Calendar,    label: "Login Harian",          desc: "+10 poin per hari" },
  { icon: Flame,       label: "Streak 7 Hari",         desc: "+40 poin bonus" },
  { icon: Star,        label: "Tulis Ulasan",           desc: "+5 poin (segera hadir)" },
  { icon: TrendingUp,  label: "Referral Teman",         desc: "+30 poin (segera hadir)" },
];

export default function PoinPage() {
  const { user } = useAuth();
  const { points: data, loading } = useUserPoints();

  const total = data?.total_points ?? 0;
  const streak = data?.login_streak ?? 0;
  const tier = data?.tier ?? "Bronze";
  const nextPts = data?.nextPts ?? 500;
  const pct = data?.pct ?? 0;
  const meta = TIER_META[tier] ?? TIER_META.Bronze;
  const TierIcon = meta.icon;

  if (!user) {
    return (
      <Layout>
        <div className="p-6 text-center pt-16">
          <Zap className="w-16 h-16 text-[#0194f3] mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="font-black text-gray-900 text-lg mb-2">Login untuk Lihat Poin</h2>
          <p className="text-gray-500 text-sm mb-6">Kumpulkan poin setiap kali login dan tukar dengan voucher diskon.</p>
          <Link href="/auth/login">
            <button className="bg-[#0194f3] text-white font-bold text-sm px-6 py-3 rounded-2xl">Masuk Sekarang</button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Poin & Reward" description="Lihat poin dan reward kamu di Nempo Organizer." noIndex />
      <div className="pb-24 md:pb-8">
        {/* Header */}
        <div className={`bg-gradient-to-br ${meta.bg} pt-12 pb-20 px-5 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 60%)" }} />
          <Link href="/profile">
            <button className="absolute top-5 left-4 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          </Link>
          <div className="flex items-start gap-4 mt-2">
            <div className={`w-16 h-16 rounded-3xl bg-white/20 ring-4 ${meta.ring} flex items-center justify-center shrink-0`}>
              <TierIcon className="w-8 h-8 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest mb-0.5">Tier Kamu</p>
              <h1 className="text-white font-black text-2xl leading-none">{tier}</h1>
              {loading
                ? <p className="text-white/60 text-sm mt-1">Memuat...</p>
                : <p className="text-white/80 text-sm mt-1 font-bold">{total.toLocaleString("id")} poin</p>
              }
            </div>
          </div>

          {streak > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-300" strokeWidth={2} />
                <span className="text-white text-xs font-bold">{streak} hari login berturut-turut</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress card */}
        <div className="px-4 -mt-10 relative z-10 mb-5">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Progress ke {data?.next === "—" ? "Puncak" : data?.next}</p>
              <p className="text-xs text-gray-400">
                {data?.next === "—" ? "Tier Tertinggi!" : `${Math.max(0, nextPts - total)} poin lagi`}
              </p>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full bg-gradient-to-r ${meta.bg} rounded-full transition-all duration-700`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400">
              <span className="font-bold text-gray-700">{total.toLocaleString("id")} poin</span>
              {data?.next !== "—" && <span>Target: {nextPts.toLocaleString("id")} poin</span>}
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="px-4 mb-5">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Pencapaian & Hadiah</p>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {MILESTONES.map(m => {
              const done = total >= m.pts;
              const MIcon = m.icon;
              return (
                <div key={m.pts} className={`flex items-center gap-3 px-4 py-3 ${done ? "" : "opacity-60"}`}>
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                    done ? "bg-emerald-50" : "bg-gray-50"
                  }`}>
                    {done
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500" strokeWidth={2} />
                      : MIcon
                        ? <MIcon className="w-5 h-5 text-gray-300" strokeWidth={1.8} />
                        : <Lock className="w-5 h-5 text-gray-300" strokeWidth={2} />
                    }
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${done ? "text-gray-800" : "text-gray-400"}`}>{m.label}</p>
                    <p className={`text-[11px] ${done ? "text-emerald-600" : "text-gray-400"}`}>{m.reward}</p>
                  </div>
                  <div className={`text-xs font-black px-2.5 py-1 rounded-full ${
                    done ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"
                  }`}>
                    {m.pts.toLocaleString("id")} poin
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Riwayat transaksi */}
        {data?.transactions && data.transactions.length > 0 && (
          <div className="px-4 mb-5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Riwayat Poin</p>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {data.transactions.map(t => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                    t.points > 0 ? "bg-emerald-50" : "bg-red-50"
                  }`}>
                    {t.points > 0
                      ? <ArrowUpRight className="w-5 h-5 text-emerald-500" strokeWidth={2} />
                      : <Zap className="w-5 h-5 text-red-400" strokeWidth={2} />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 font-medium leading-tight">{t.description}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(t.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className={`text-sm font-black ${t.points > 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {t.points > 0 ? "+" : ""}{t.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How to earn */}
        <div className="px-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Cara Kumpulkan Poin</p>
          <div className="mobile-card-slider sm:grid sm:grid-cols-2 gap-3">
            {HOW_TO.map(h => (
              <div key={h.label} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-3.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center mb-2">
                  <h.icon className="w-5 h-5 text-[#0194f3]" strokeWidth={1.8} />
                </div>
                <p className="font-black text-gray-800 text-sm leading-tight">{h.label}</p>
                <p className="text-[11px] text-emerald-600 font-bold mt-0.5">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
