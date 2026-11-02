import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Package, Clock, CheckCircle2, XCircle,
  CreditCard, AlertTriangle, X, ShoppingBag,
  Loader2, UtensilsCrossed, Bed, Ticket, ArrowRight,
} from "lucide-react";

const API = "/api";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
type OrderType   = "wisata" | "kuliner" | "penginapan" | "event" | "jajan-yuk";

interface Order {
  order_code:   string;
  type:         OrderType;
  item_name:    string;
  status:       string;   // raw from API
  total_amount: number;
  created_at:   string;
  tracking_token?: string;
}

const TAB_FILTERS: Record<string, OrderStatus[] | null> = {
  "Semua":      null,
  "Belum Bayar": ["pending"],
  "Berlangsung": ["processing"],
  "Selesai":    ["completed"],
  "Dibatalkan": ["cancelled"],
};

/* Map raw DB status → display status */
function mapStatus(raw: string, type?: OrderType): OrderStatus {
  if (type === "jajan-yuk") {
    switch (raw) {
      case "pending_confirmation":
      case "confirmed":
        return "pending";
      case "preparing":
      case "driver_assigned":
      case "picked_up":
      case "on_the_way":
        return "processing";
      case "delivered":
        return "completed";
      case "rejected":
      case "cancelled":
      case "expired":
        return "cancelled";
      default:
        return "processing";
    }
  }
  switch (raw) {
    case "pending":    return "pending";
    case "confirmed":  return "completed";
    case "rejected":   return "cancelled";
    case "processing": return "processing";
    default:           return "processing";
  }
}

function getStatusDisplay(status: OrderStatus) {
  switch (status) {
    case "pending":    return { icon: CreditCard,   text: "Belum Dibayar", color: "text-amber-600",  bg: "bg-amber-50" };
    case "processing": return { icon: Clock,        text: "Diproses",      color: "text-blue-600",   bg: "bg-blue-50" };
    case "completed":  return { icon: CheckCircle2, text: "Selesai",       color: "text-green-600",  bg: "bg-green-50" };
    case "cancelled":  return { icon: XCircle,      text: "Dibatalkan",    color: "text-red-500",    bg: "bg-red-50" };
  }
}

function getTypeIcon(type: OrderType) {
  switch (type) {
    case "wisata":     return Package;
    case "kuliner":    return UtensilsCrossed;
    case "penginapan": return Bed;
    case "event":      return Ticket;
    case "jajan-yuk":  return UtensilsCrossed;
  }
}

function getTypeLabel(type: OrderType) {
  switch (type) {
    case "wisata":     return "Wisata";
    case "kuliner":    return "Kuliner";
    case "penginapan": return "Penginapan";
    case "event":      return "Event";
    case "jajan-yuk":  return "Jajan YUK";
  }
}

function readSavedJajanAccess(): Array<{ code: string; token: string }> {
  try {
    const saved = JSON.parse(localStorage.getItem("jajan_yuk_order_access") || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((item): item is { code: string; token: string } =>
      typeof item?.code === "string" && typeof item?.token === "string" && item.token.length >= 32,
    );
  } catch {
    return [];
  }
}

async function loadSavedJajanOrders(): Promise<Order[]> {
  const accesses = readSavedJajanAccess();
  const results: Array<Order | null> = await Promise.all(accesses.map(async ({ code, token }) => {
    try {
      const response = await fetch(`/api/jajan-yuk/orders/${encodeURIComponent(code)}?token=${encodeURIComponent(token)}`);
      if (!response.ok) return null;
      const order = await response.json();
      return {
        order_code: order.order_code,
        type: "jajan-yuk" as const,
        item_name: order.merchant_name || "Pesanan Jajan YUK",
        status: order.order_status || "processing",
        total_amount: Number(order.total_amount) || 0,
        created_at: order.created_at,
        tracking_token: token,
      };
    } catch {
      return null;
    }
  }));
  return results.filter((order): order is Order => Boolean(order));
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/* ── Page ───────────────────────────────────────────────────── */
export default function PesananSayaPage() {
  const { user } = useAuth();
  const [orders, setOrders]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Semua");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function loadOrders() {
      try {
        const token = localStorage.getItem("nempo_user_token");
        let accountOrders: Order[] = [];

        if (user && token) {
          const response = await fetch(`${API}/user/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (!response.ok || !Array.isArray(data)) {
            throw new Error(data.error || "Gagal memuat pesanan");
          }
          accountOrders = data;
        }

        const jajanOrders = await loadSavedJajanOrders();
        const allOrders = [...accountOrders, ...jajanOrders]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        if (!cancelled) setOrders(allOrders);
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Tidak dapat terhubung ke server");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadOrders();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const tabs = Object.keys(TAB_FILTERS);

  const tabCount = (key: string) => {
    const filter = TAB_FILTERS[key];
    if (!filter) return orders.length;
    return orders.filter(o => filter.includes(mapStatus(o.status, o.type))).length;
  };

  const visible = (() => {
    const filter = TAB_FILTERS[activeTab];
    if (!filter) return orders;
    return orders.filter(o => filter.includes(mapStatus(o.status, o.type)));
  })();

  const pendingCount = orders.filter(o => mapStatus(o.status, o.type) === "pending").length;

  return (
    <Layout>
      <SEO title="Pesanan Saya" noIndex />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <Link href="/profil">
            <button className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Package className="h-5 w-5 text-gray-700" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-gray-900 text-[15px]">Pesanan Saya</h1>
            <p className="text-[10px] text-gray-400">Riwayat transaksi kamu</p>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                <CreditCard className="h-3 w-3 text-amber-600" />
                <span className="text-[10px] font-bold text-amber-700">{pendingCount} belum bayar</span>
              </div>
            )}
            <Link href="/tiket" className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
              <Ticket className="h-3 w-3" /> Tiket event
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map(tab => {
              const count  = tabCount(tab);
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                    active ? "text-white shadow-md" : "bg-white border border-gray-200 text-gray-500"
                  }`}
                  style={active ? { background: "#0194f3" } : undefined}
                >
                  {tab}
                  {count > 0 && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      active ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-3 pb-28 space-y-3">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#0194f3] mb-3" />
              <p className="text-sm text-gray-400">Memuat pesanan…</p>
            </div>
          )}

          {/* Not logged in */}
          {!loading && !user && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-5">
                <ShoppingBag className="h-10 w-10 text-[#0194f3]" />
              </div>
              <p className="font-black text-gray-800 text-base mb-1">Masuk terlebih dahulu</p>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                Login untuk melihat riwayat pesananmu.
              </p>
              <Link href="/login">
                <button className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md"
                  style={{ background: "linear-gradient(135deg,#0194f3,#0172B1)" }}>
                  Masuk
                </button>
              </Link>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <p className="font-bold text-gray-800 mb-1">Gagal memuat</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && visible.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-5">
                <ShoppingBag className="h-10 w-10 text-[#0194f3]" />
              </div>
              <p className="font-black text-gray-800 text-base mb-1">
                {activeTab === "Semua" ? "Belum ada pesanan" : `Tidak ada pesanan "${activeTab}"`}
              </p>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                {activeTab === "Semua"
                  ? "Yuk mulai pesan wisata, kuliner, atau penginapan favoritmu!"
                  : "Tidak ada pesanan dengan status ini."}
              </p>
              {activeTab === "Semua" && (
                <Link href="/wisata">
                  <button className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md"
                    style={{ background: "linear-gradient(135deg,#0194f3,#0172B1)" }}>
                    Lihat Wisata
                  </button>
                </Link>
              )}
            </div>
          )}

          {/* Orders list */}
          {!loading && !error && visible.map(order => {
            const mapped    = mapStatus(order.status, order.type);
            const s         = getStatusDisplay(mapped);
            const StatusIcon = s.icon;
            const TypeIcon  = getTypeIcon(order.type);
            const isPending = mapped === "pending";

            return (
              <div
                key={order.order_code}
                className={`bg-white rounded-2xl shadow-sm border p-4 transition-all ${
                  isPending ? "border-amber-200" : "border-gray-100"
                }`}
              >
                {/* Top row */}
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500">{formatDate(order.created_at)}</span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[10px] text-gray-400 font-mono">{order.order_code}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${s.bg} ${s.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {s.text}
                  </div>
                </div>

                {/* Item */}
                <div className="mb-4">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                    {getTypeLabel(order.type)}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 leading-snug mt-0.5">{order.item_name}</h3>
                </div>

                {/* Bottom row */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] text-gray-400">Total Pembayaran</p>
                    <p className="font-black text-gray-900">
                      {order.total_amount > 0 ? `Rp ${order.total_amount.toLocaleString("id-ID")}` : "Gratis"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending && order.type === "jajan-yuk" && order.tracking_token && (
                      <Link
                        href={`/jajan-yuk/lacak?code=${encodeURIComponent(order.order_code)}&token=${encodeURIComponent(order.tracking_token)}`}
                        className="flex h-9 items-center gap-1 rounded-xl bg-orange-500 px-3 text-xs font-bold text-white shadow-md active:scale-95"
                      >
                        Lihat Pesanan <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                    {isPending && order.type !== "jajan-yuk" && order.total_amount > 0 && (
                      <button
                        className="h-9 px-4 rounded-xl text-xs font-bold text-white active:scale-95 transition-all shadow-md"
                        style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", boxShadow: "0 4px 12px rgba(245,158,11,0.35)" }}
                      >
                        Bayar Sekarang
                      </button>
                    )}
                    {mapped === "completed" && order.type === "jajan-yuk" && order.tracking_token && (
                      <Link
                        href={`/jajan-yuk/lacak?code=${encodeURIComponent(order.order_code)}&token=${encodeURIComponent(order.tracking_token)}`}
                        className="flex h-9 items-center gap-1 rounded-xl border border-orange-200 px-3 text-xs font-semibold text-orange-700 hover:bg-orange-50"
                      >
                        Lihat Detail <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                    {mapped === "completed" && order.type !== "jajan-yuk" && (
                      <button className="h-9 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                        Beli Lagi
                      </button>
                    )}
                    {(mapped === "processing" || mapped === "cancelled") && order.type === "jajan-yuk" && order.tracking_token && (
                      <Link
                        href={`/jajan-yuk/lacak?code=${encodeURIComponent(order.order_code)}&token=${encodeURIComponent(order.tracking_token)}`}
                        className="flex h-9 items-center gap-1 rounded-xl bg-orange-500 px-3 text-xs font-bold text-white"
                      >
                        Lacak <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                    {(mapped === "processing" || mapped === "cancelled") && order.type !== "jajan-yuk" && (
                      <button
                        className="h-9 px-4 rounded-xl text-xs font-bold text-white transition-all"
                        style={{ background: "#0194f3" }}
                      >
                        Detail
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
