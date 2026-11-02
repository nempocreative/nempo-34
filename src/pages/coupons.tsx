import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import {
  Ticket, Clock, ChevronLeft, CheckCircle2, AlertCircle,
  Loader2, Gift, Compass, Coffee, UtensilsCrossed, Tag,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const API = "/api";

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
  active: boolean;
}

const TYPE_COLOR: Record<string, { grad: string; icon: React.ReactNode }> = {
  kuliner: {
    grad: "from-orange-400 to-amber-500",
    icon: <Coffee className="w-5 h-5 text-white" strokeWidth={2.5} />,
  },
  wisata: {
    grad: "from-emerald-500 to-teal-500",
    icon: <Compass className="w-5 h-5 text-white" strokeWidth={2.5} />,
  },
  all: {
    grad: "from-violet-500 to-purple-600",
    icon: <Gift className="w-5 h-5 text-white" strokeWidth={2.5} />,
  },
};

function VoucherCampaignCard({
  v,
  onClaim,
  claimState,
}: {
  v: PublicVoucher;
  onClaim: (id: number) => void;
  claimState: "idle" | "loading" | "done" | "error" | "auth";
}) {
  const cfg = TYPE_COLOR[v.applicable_type ?? "all"] ?? TYPE_COLOR.all;

  const expiryStr = v.expiry_date
    ? new Date(v.expiry_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "Tidak terbatas";

  const discountLabel =
    v.discount_type === "persen"
      ? `${parseFloat(String(v.discount_value))}%`
      : `Rp ${Number(v.discount_value).toLocaleString("id-ID")}`;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Colored top band */}
      <div className={`bg-gradient-to-r ${cfg.grad} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            {cfg.icon}
          </div>
          <div>
            <p className="text-white font-black text-2xl leading-none">{discountLabel}</p>
            <p className="text-white/70 text-[11px] mt-0.5">
              {v.applicable_type === "kuliner" ? "Untuk Kuliner & Cafe" : "Semua Layanan"}
            </p>
          </div>
        </div>
        <div className="bg-white/15 px-2.5 py-1 rounded-full">
          <span className="text-white text-[10px] font-black uppercase tracking-wide">Campaign</span>
        </div>
      </div>

      {/* Dashed separator */}
      <div className="flex items-center mx-4">
        <div className="hidden sm:block w-4 h-4 rounded-full bg-gray-50 border border-gray-100 -ml-6 shrink-0" />
        <div className="flex-1 border-t border-dashed border-gray-200 mx-2" />
        <div className="hidden sm:block w-4 h-4 rounded-full bg-gray-50 border border-gray-100 -mr-6 shrink-0" />
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <h3 className="font-black text-gray-900 text-sm mb-1">{v.title}</h3>
        {v.description && (
          <p className="text-gray-500 text-[11px] leading-relaxed mb-3">{v.description}</p>
        )}

        <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2 mb-3">
          <Tag className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span className="font-mono text-xs font-black text-gray-700 tracking-widest">{v.code}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <Clock className="h-3 w-3" />
            <span>s.d. {expiryStr}</span>
            {v.min_purchase > 0 && (
              <span className="ml-2 text-gray-300">·</span>
            )}
            {v.min_purchase > 0 && (
              <span>Min. Rp {Number(v.min_purchase).toLocaleString("id-ID")}</span>
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
          ) : claimState === "auth" ? (
            <Link href="/login">
              <span className="text-xs font-black text-[#0194f3] underline underline-offset-2">
                Login untuk klaim
              </span>
            </Link>
          ) : (
            <button
              onClick={() => onClaim(v.id)}
              className="px-4 py-1.5 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-xs font-black rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Klaim Sekarang
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CouponsPage() {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState<PublicVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimStates, setClaimStates] = useState<Record<number, "idle" | "loading" | "done" | "error" | "auth">>({});

  useEffect(() => {
    fetch(`${API}/vouchers/campaign/kuliner`)
      .then(r => r.json())
      .then(data => setVouchers(Array.isArray(data) ? data : []))
      .catch(() => setVouchers([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleClaim(id: number) {
    const token = localStorage.getItem("nempo_user_token");
    if (!token || !user) {
      setClaimStates(s => ({ ...s, [id]: "auth" }));
      return;
    }
    setClaimStates(s => ({ ...s, [id]: "loading" }));
    try {
      const res = await fetch(`${API}/user/vouchers/claim/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setClaimStates(s => ({ ...s, [id]: "done" }));
      } else if (res.status === 409) {
        setClaimStates(s => ({ ...s, [id]: "error" }));
      } else {
        setClaimStates(s => ({ ...s, [id]: "idle" }));
      }
      void data;
    } catch {
      setClaimStates(s => ({ ...s, [id]: "idle" }));
    }
  }

  return (
    <Layout>
      <SEO title="Voucher Campaign Cafe" noIndex />

      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 to-amber-500 px-4 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white" />
          <div className="absolute bottom-0 left-4 w-20 h-20 rounded-full bg-white" />
        </div>
        <Link href="/poin">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-4 relative z-10">
            <ChevronLeft className="h-4 w-4" /> Kembali
          </div>
        </Link>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Coffee className="h-5 w-5 text-white" strokeWidth={2.5} />
            <p className="text-white/80 text-sm font-bold">Nempo Cafe Campaign</p>
          </div>
          <h1 className="text-white font-black text-2xl leading-tight mb-1">
            Voucher Diskon Cafe
          </h1>
          <p className="text-white/70 text-xs">
            Klaim voucher gratis, tunjukkan ke kasir, langsung dapat diskon.
          </p>
        </div>
      </div>

      <div className="px-4 -mt-8 pb-8 relative z-10">
        {/* Info banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-3 mb-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-800 mb-0.5">Cara pakai voucher cafe</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Klaim voucher → muncul di <Link href="/voucherlist"><span className="text-[#0194f3] font-bold">Voucher Saya</span></Link> → tunjukkan kode ke kasir saat reservasi atau bayar di cafe.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-amber-400 animate-spin mb-3" />
            <p className="text-gray-400 text-sm">Memuat voucher…</p>
          </div>
        ) : vouchers.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="h-12 w-12 text-gray-200 mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-bold text-gray-500">Belum ada voucher aktif</p>
            <p className="text-gray-400 text-xs mt-1">Pantau terus untuk promo cafe terbaru!</p>
          </div>
        ) : (
           <div className="mobile-card-slider sm:grid sm:grid-cols-1 flex flex-col gap-4">
            {vouchers.map(v => (
              <VoucherCampaignCard
                key={v.id}
                v={v}
                onClaim={handleClaim}
                claimState={claimStates[v.id] ?? "idle"}
              />
            ))}
          </div>
        )}

        {!user && vouchers.length > 0 && (
          <div className="mt-4 bg-[#EBF3FF] rounded-2xl p-4 text-center">
            <p className="text-sm font-bold text-[#0172B1] mb-1">Belum login?</p>
            <p className="text-[11px] text-[#0194f3] mb-3">Login dulu untuk mengklaim voucher ke akun kamu.</p>
            <Link href="/login">
              <button className="px-6 py-2 bg-[#0194f3] text-white text-sm font-bold rounded-xl">
                Login Sekarang
              </button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
