import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import {
  Ticket, Percent, Clock, ChevronLeft, Copy, CheckCircle2,
  Gift, Zap, Info, Tag, Calendar, Flame, AlertCircle, Loader2,
  QrCode, X, Star, Coffee, Compass, Award,
} from "lucide-react";
import QRCode from "react-qr-code";
import { useAuth } from "@/contexts/auth-context";
import { useUserPoints } from "@/lib/use-user-points";
import type { UserVoucher } from "@/lib/use-user-points";

const API = "/api";

/* ── helpers ─────────────────────────────────────────────────────────── */
const SOURCE_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  register_bonus: { label: "Selamat Datang", color: "text-emerald-600", bg: "bg-emerald-50" },
  milestone:      { label: "Pencapaian",     color: "text-violet-600",  bg: "bg-violet-50"  },
  login_milestone:{ label: "Login Setia",    color: "text-blue-600",    bg: "bg-blue-50"    },
  claim:          { label: "Diklaim",         color: "text-sky-600",     bg: "bg-sky-50"     },
  manual:         { label: "Spesial",         color: "text-amber-600",   bg: "bg-amber-50"   },
};

interface PublicVoucher {
  id: number;
  title: string;
  code: string;
  type: string;
  discount_type: string;
  discount_value: number;
  min_purchase: number;
  applicable_type: string | null;
  description: string | null;
  expiry_date: string | null;
  required_points?: number;
}

const APPLICABLE_META: Record<string, { grad: string; icon: React.ReactNode; label: string }> = {
  kuliner:      { grad: "from-orange-400 to-amber-500",  icon: <Coffee  className="w-5 h-5 text-white" strokeWidth={2.5}/>, label: "Kuliner & Cafe" },
  wisata:       { grad: "from-emerald-500 to-teal-500",  icon: <Compass className="w-5 h-5 text-white" strokeWidth={2.5}/>, label: "Wisata"         },
  event:        { grad: "from-[#0172B1] to-[#0194f3]",  icon: <Star    className="w-5 h-5 text-white" strokeWidth={2.5}/>, label: "Event"          },
  new_user:     { grad: "from-violet-500 to-purple-600", icon: <Gift    className="w-5 h-5 text-white" strokeWidth={2.5}/>, label: "Pengguna Baru"  },
  point_reward: { grad: "from-amber-400 to-orange-500",  icon: <Award   className="w-5 h-5 text-white" strokeWidth={2.5}/>, label: "Reward Poin"    },
};
const DEFAULT_META = { grad: "from-violet-500 to-purple-600", icon: <Gift className="w-5 h-5 text-white" strokeWidth={2.5}/>, label: "Semua Layanan" };

function getVoucherMeta(v: PublicVoucher) {
  return APPLICABLE_META[v.applicable_type ?? ""] ?? APPLICABLE_META[v.type] ?? DEFAULT_META;
}

const TYPE_GRAD: Record<string, string> = {
  event:   "from-[#0172B1] to-[#0194f3]",
  wisata:  "from-emerald-500 to-teal-500",
  kuliner: "from-orange-400 to-amber-500",
  all:     "from-violet-500 to-purple-600",
};

const TYPE_LABEL: Record<string, string> = {
  event: "Untuk Event", wisata: "Untuk Wisata",
  kuliner: "Untuk Kuliner", penginapan: "Untuk Penginapan", all: "Semua Layanan",
};

/* ── VoucherCard (owned) ─────────────────────────────────────────────── */
function VoucherCard({ v }: { v: UserVoucher }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const src = SOURCE_LABEL[v.source] ?? SOURCE_LABEL.manual;
  const typeGrad = TYPE_GRAD[v.applicable_type] ?? TYPE_GRAD.all;

  const isExpiringSoon = v.expires_at
    ? (new Date(v.expires_at).getTime() - Date.now()) < 3 * 86400000
    : false;

  function handleCopy() {
    navigator.clipboard.writeText(v.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`bg-gradient-to-r ${typeGrad} px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Percent className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white font-black text-xl leading-none">
                {v.discount_type === "reward"
                  ? "Hadiah Eksklusif"
                  : v.discount_type === "fixed"
                  ? `Rp${Number(v.discount_value).toLocaleString("id-ID")}`
                  : `${parseFloat(String(v.discount_value))}%`}
              </p>
              <p className="text-white/70 text-[10px]">{TYPE_LABEL[v.applicable_type] ?? "Semua Layanan"}</p>
            </div>
          </div>
          <div className={`${src.bg} px-2.5 py-1 rounded-full`}>
            <span className={`text-[10px] font-black ${src.color}`}>{src.label}</span>
          </div>
        </div>

        <div className="flex items-center mx-4">
          <div className="hidden sm:block w-4 h-4 rounded-full bg-gray-50 border border-gray-100 -ml-6 shrink-0" />
          <div className="flex-1 border-t border-dashed border-gray-200 mx-2" />
          <div className="hidden sm:block w-4 h-4 rounded-full bg-gray-50 border border-gray-100 -mr-6 shrink-0" />
        </div>

        <div className="px-4 py-3">
          <h3 className="font-black text-gray-900 text-sm mb-1 leading-tight">{v.title}</h3>
          {v.description && (
            <p className="text-gray-500 text-[11px] mb-3 leading-relaxed">{v.description}</p>
          )}
          <div className="bg-gray-50 rounded-2xl px-3 py-2.5 border border-dashed border-gray-200 mb-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Tag className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={2} />
                <span className="font-black text-gray-700 tracking-widest text-xs truncate">{v.code}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setShowQR(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  <QrCode className="w-3 h-3" strokeWidth={2.5} />
                  QR
                </button>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                    copied ? "bg-emerald-500 text-white" : "bg-[#0194f3] text-white"
                  }`}
                >
                  {copied ? <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} /> : <Copy className="w-3 h-3" strokeWidth={2.5} />}
                  {copied ? "Tersalin!" : "Salin"}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {isExpiringSoon
                ? <><AlertCircle className="w-3 h-3 text-orange-500 shrink-0" strokeWidth={2} /><span className="text-[11px] text-orange-600 font-bold">Segera gunakan!</span></>
                : <><Calendar className="w-3 h-3 text-gray-400 shrink-0" strokeWidth={2} /><span className="text-[11px] text-gray-400">{v.expires_at ? `Exp: ${new Date(v.expires_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}` : "Tidak ada batas waktu"}</span></>
              }
            </div>
            <span className="text-[10px] text-gray-300 italic">Tunjukkan QR ke kasir</span>
          </div>
        </div>
      </div>

      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                <p className="font-black text-gray-900 text-sm leading-tight">{v.title}</p>
                <p className="text-[11px] text-gray-400">{TYPE_LABEL[v.applicable_type] ?? "Semua Layanan"}</p>
              </div>
              <button onClick={() => setShowQR(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center justify-center bg-white border-4 border-gray-100 rounded-2xl p-4 mb-4">
              <QRCode value={v.code} size={180} />
            </div>
            <div className={`bg-gradient-to-r ${typeGrad} rounded-2xl px-4 py-2.5 mb-3`}>
              <p className="text-white font-black text-2xl leading-none">
                {v.discount_type === "reward"
                  ? "Hadiah Eksklusif"
                  : v.discount_type === "fixed"
                  ? `Rp${Number(v.discount_value).toLocaleString("id-ID")}`
                  : `${parseFloat(String(v.discount_value))}% OFF`}
              </p>
            </div>
            <p className="font-mono text-xs tracking-widest text-gray-500 mb-1">{v.code}</p>
            <p className="text-[10px] text-gray-400">Tunjukkan QR ini ke kasir atau mitra untuk scan</p>
          </div>
        </div>
      )}
    </>
  );
}

/* ── PublicVoucherCard ───────────────────────────────────────────────── */
function PublicVoucherCard({
  v,
  claimState,
  onClaim,
  pointsTotal,
}: {
  v: PublicVoucher;
  claimState: "idle" | "loading" | "done" | "error";
  onClaim: (id: number) => void;
  pointsTotal: number | null;
}) {
  const meta = getVoucherMeta(v);
  const requiredPoints = Number(v.required_points ?? 0);
  const canClaim = requiredPoints <= 0 || (pointsTotal ?? 0) >= requiredPoints;

  const discountLabel =
    v.discount_type === "reward"
      ? "Hadiah Eksklusif"
      : v.discount_type === "nominal"
      ? `Rp ${Number(v.discount_value).toLocaleString("id-ID")}`
      : `${parseFloat(String(v.discount_value))}%`;

  const expiryStr = v.expiry_date
    ? new Date(v.expiry_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "Tidak terbatas";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${meta.grad} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            {meta.icon}
          </div>
          <div>
            <p className="text-white font-black text-2xl leading-none">{discountLabel}</p>
            <p className="text-white/70 text-[11px] mt-0.5">{meta.label}</p>
          </div>
        </div>
        <div className="bg-white/15 px-2.5 py-1 rounded-full">
          <span className="text-white text-[10px] font-black uppercase tracking-wide">Promo</span>
        </div>
      </div>

      <div className="flex items-center mx-4">
        <div className="hidden sm:block w-4 h-4 rounded-full bg-gray-50 border border-gray-100 -ml-6 shrink-0" />
        <div className="flex-1 border-t border-dashed border-gray-200 mx-2" />
        <div className="hidden sm:block w-4 h-4 rounded-full bg-gray-50 border border-gray-100 -mr-6 shrink-0" />
      </div>

      <div className="px-4 py-3">
        <h3 className="font-black text-gray-900 text-sm mb-1">{v.title}</h3>
        {v.description && (
          <p className="text-gray-500 text-[11px] leading-relaxed mb-3">{v.description}</p>
        )}
        <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2 mb-3">
          <Tag className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span className="font-mono text-xs font-black text-gray-700 tracking-widest">{v.code}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <Clock className="h-3 w-3 shrink-0" />
              <span>s.d. {expiryStr}</span>
            </div>
            {v.min_purchase > 0 && (
              <span className="text-[10px] text-gray-400">Min. Rp {Number(v.min_purchase).toLocaleString("id-ID")}</span>
            )}
              {requiredPoints > 0 && (
                <span className="text-[10px] text-amber-600 font-bold">
                  Butuh {requiredPoints.toLocaleString("id-ID")} poin
                </span>
              )}
          </div>
          {claimState === "done" ? (
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-black">
              <CheckCircle2 className="h-4 w-4" />
              <span>Diklaim!</span>
            </div>
          ) : claimState === "loading" ? (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Proses…</span>
            </div>
          ) : claimState === "error" ? (
            <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
              <CheckCircle2 className="h-4 w-4 text-gray-300" />
              <span>Sudah diklaim</span>
            </div>
            ) : !canClaim ? (
              <div className="text-right text-[10px] font-bold text-gray-400">
                Belum cukup poin
              </div>
            ) : (
            <button
              onClick={() => onClaim(v.id)}
              className={`px-4 py-1.5 text-white text-xs font-black rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 bg-gradient-to-r ${meta.grad}`}
            >
              Klaim
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────── */
export default function VoucherListPage() {
  const { user } = useAuth();
  const { vouchers, points, loading, refetch } = useUserPoints();

  const [tab, setTab]           = useState<"mine" | "available">("mine");
  const [innerTab, setInnerTab] = useState<"active" | "used">("active");

  const [publicVouchers, setPublicVouchers] = useState<PublicVoucher[]>([]);
  const [publicLoading, setPublicLoading]   = useState(true);
  const [claimStates, setClaimStates]       = useState<Record<number, "idle" | "loading" | "done" | "error">>({});

  const activeVouchers = vouchers.filter(v => v.status === "active");
  const usedVouchers   = vouchers.filter(v => v.status !== "active");

  useEffect(() => {
    fetch(`${API}/vouchers`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setPublicVouchers(Array.isArray(data) ? data : []))
      .catch(() => setPublicVouchers([]))
      .finally(() => setPublicLoading(false));
  }, []);

  const handleClaim = useCallback(async (id: number) => {
    const token = localStorage.getItem("nempo_user_token");
    if (!token || !user) return;
    setClaimStates(s => ({ ...s, [id]: "loading" }));
    try {
      const res = await fetch(`${API}/user/vouchers/claim/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setClaimStates(s => ({ ...s, [id]: "done" }));
        refetch();
      } else if (res.status === 409) {
        setClaimStates(s => ({ ...s, [id]: "error" }));
      } else {
        setClaimStates(s => ({ ...s, [id]: "idle" }));
      }
    } catch {
      setClaimStates(s => ({ ...s, [id]: "idle" }));
    }
  }, [user, refetch]);

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center min-h-[60vh]">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-10 h-10 text-[#0194f3]" strokeWidth={1.5} />
          </div>
          <h2 className="font-black text-gray-900 text-lg mb-2">Login untuk Lihat Voucher</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">Masuk ke akun untuk melihat dan menggunakan voucher milikmu.</p>
          <Link href="/auth/login" className="w-full max-w-xs">
            <button className="w-full bg-[#0194f3] text-white font-bold text-sm py-3 rounded-2xl">Masuk Sekarang</button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Voucher & Diskon" noIndex />
      <div className="pb-24 md:pb-8">

        {/* Header */}
        <div className="bg-gradient-to-br from-[#001E6E] via-[#0046B8] to-[#0194f3] pt-12 pb-16 px-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #FFC300 0%, transparent 60%)" }} />
          <Link href="/profile">
            <button className="absolute top-5 left-4 w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          </Link>
          <h1 className="text-white font-black text-xl mt-2 mb-0.5">Voucher & Diskon</h1>
          <p className="text-white/60 text-sm">Klaim promo gratis & hemat belanja</p>

          {points && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-300" strokeWidth={2} />
                <span className="text-white font-bold text-xs">{points.total_points.toLocaleString("id")} poin</span>
              </div>
              {points.login_streak > 0 && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-300" strokeWidth={2} />
                  <span className="text-white font-bold text-xs">{points.login_streak} hari streak</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main tabs */}
        <div className="px-4 -mt-8 mb-4 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-1 flex gap-1">
            <button
              onClick={() => setTab("mine")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === "mine" ? "bg-[#0194f3] text-white shadow" : "text-gray-500"
              }`}
            >
              Voucher Saya ({activeVouchers.length})
            </button>
            <button
              onClick={() => setTab("available")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === "available" ? "bg-[#0194f3] text-white shadow" : "text-gray-500"
              }`}
            >
              Tersedia ({publicVouchers.length})
            </button>
          </div>
        </div>

        <div className="px-4 space-y-3">
          {tab === "mine" ? (
            <>
              {/* Sub-tabs: Aktif / Digunakan */}
              <div className="flex gap-2">
                {[
                  { key: "active" as const, label: `Aktif (${activeVouchers.length})` },
                  { key: "used"   as const, label: `Digunakan (${usedVouchers.length})` },
                ].map(t => (
                  <button key={t.key}
                    onClick={() => setInnerTab(t.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      innerTab === t.key
                        ? "bg-gray-800 text-white border-gray-800"
                        : "bg-white text-gray-500 border-gray-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0194f3]" />
                </div>
              ) : innerTab === "active" ? (
                activeVouchers.length > 0
                  ? (
                    <div className="mobile-card-slider sm:grid sm:grid-cols-1 gap-3">
                      {activeVouchers.map(v => <VoucherCard key={v.id} v={v} />)}
                    </div>
                  )
                  : (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                        <Gift className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                      </div>
                      <p className="font-bold text-gray-600 mb-1">Belum ada voucher aktif</p>
                      <p className="text-gray-400 text-sm mb-4">Klaim voucher dari tab "Tersedia" di atas!</p>
                      <button
                        onClick={() => setTab("available")}
                        className="px-5 py-2 bg-[#0194f3] text-white text-sm font-bold rounded-xl"
                      >
                        Lihat Voucher Tersedia
                      </button>
                    </div>
                  )
              ) : (
                usedVouchers.length > 0
                  ? (
                    <div className="mobile-card-slider sm:grid sm:grid-cols-1 gap-3">
                      {usedVouchers.map(v => (
                        <div key={v.id} className="opacity-50">
                          <VoucherCard v={v} />
                        </div>
                      ))}
                    </div>
                  )
                  : (
                    <div className="text-center py-12">
                      <Info className="w-10 h-10 text-gray-200 mx-auto mb-3" strokeWidth={1.5} />
                      <p className="text-gray-400 text-sm">Belum ada voucher yang digunakan</p>
                    </div>
                  )
              )}

              {!loading && (
                <div className="mt-2">
                  <div className="bg-gradient-to-r from-[#001E6E] to-[#0194f3] rounded-3xl p-4 text-white">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5 text-yellow-300" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="font-black text-sm mb-0.5">Cara Dapat Voucher Lebih Banyak</p>
                        <ul className="text-white/70 text-[11px] space-y-1">
                          <li>• Login setiap hari → +10 poin</li>
                          <li>• 7 hari berturut-turut → +40 poin bonus</li>
                          <li>• Capai 100 poin → voucher 5% off</li>
                          <li>• Capai 300 poin → voucher 10% off</li>
                          <li>• Capai 500 poin → voucher Silver 15% off</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ── Available vouchers ── */
            <>
              <p className="text-[11px] text-gray-400 px-1">
                Klaim voucher gratis — langsung muncul di "Voucher Saya" setelah diklaim.
              </p>
              {publicLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0194f3]" />
                </div>
              ) : publicVouchers.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="h-12 w-12 text-gray-200 mx-auto mb-3" strokeWidth={1.5} />
                  <p className="font-bold text-gray-500">Belum ada voucher tersedia</p>
                  <p className="text-gray-400 text-xs mt-1">Pantau terus untuk promo terbaru!</p>
                </div>
              ) : (
                <div className="mobile-card-slider sm:grid sm:grid-cols-1 gap-3">
                  {publicVouchers.map(v => (
                    <PublicVoucherCard
                      key={v.id}
                      v={v}
                      claimState={claimStates[v.id] ?? "idle"}
                      onClaim={handleClaim}
                      pointsTotal={points?.total_points ?? null}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
