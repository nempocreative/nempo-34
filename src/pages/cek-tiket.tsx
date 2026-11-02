import { Layout } from "@/components/layout";
import { useEffect, useState, useCallback } from "react";
import { SEO } from "@/components/seo";
import { Ticket, Search, CheckCircle2, XCircle, Clock, RefreshCw, CalendarDays, X, ChevronRight, Mail, CreditCard, Trash2 } from "lucide-react";
import { Link } from "@/lib/wouter";
import { NEMPO_CONSULT_URL } from "@/lib/contact";

interface OrderStatus {
  order_code: string;
  buyer_name: string;
  ticket_name: string;
  qty: number;
  total_amount: number;
  status: "pending" | "confirmed" | "rejected";
  created_at: string;
  confirmed_at: string | null;
  event_name: string;
  event_slug: string | null;
}

function fmtRp(n: number) {
  return n === 0 ? "Gratis" : `Rp${Number(n).toLocaleString("id")}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatusBadge({ status }: { status: OrderStatus["status"] }) {
  if (status === "confirmed") return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
      <CheckCircle2 className="h-3 w-3" /> Dikonfirmasi
    </span>
  );
  if (status === "rejected") return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
      <XCircle className="h-3 w-3" /> Ditolak
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
      <Clock className="h-3 w-3" /> Menunggu Konfirmasi
    </span>
  );
}

const RECENT_KEY = "nempo_recent_orders";

function loadRecentCodes(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); } catch { return []; }
}

function saveRecentCodes(codes: string[]) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(codes.slice(0, 20))); } catch { /* ignore */ }
}

function removeRecentCode(code: string) {
  try {
    const prev = loadRecentCodes();
    saveRecentCodes(prev.filter(c => c !== code));
  } catch { /* ignore */ }
}

export default function CekTiketPage() {
  const [orders, setOrders] = useState<Map<string, OrderStatus | "loading" | "not_found">>(new Map());
  const [recentCodes, setRecentCodes] = useState<string[]>([]);
  const [cancelling, setCancelling] = useState<Record<string, boolean>>({});

  // Tab: "code" | "email"
  const [tab, setTab] = useState<"code" | "email">("code");

  // Code search
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");

  // Email search
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSearching, setEmailSearching] = useState(false);
  const [emailSearched, setEmailSearched] = useState(false);

  const fetchOrder = useCallback(async (code: string): Promise<OrderStatus | "not_found"> => {
    try {
      const r = await fetch(`/api/event-orders/status/${code.trim().toUpperCase()}`);
      if (!r.ok) return "not_found";
      return await r.json();
    } catch { return "not_found"; }
  }, []);

  const loadOrders = useCallback(async (codes: string[]) => {
    if (codes.length === 0) return;
    setOrders(prev => {
      const next = new Map(prev);
      codes.forEach(c => { if (!next.has(c)) next.set(c, "loading"); });
      return next;
    });
    const results = await Promise.all(codes.map(c => fetchOrder(c).then(r => [c, r] as const)));
    setOrders(prev => {
      const next = new Map(prev);
      results.forEach(([code, result]) => next.set(code, result));
      return next;
    });
  }, [fetchOrder]);

  useEffect(() => {
    const codes = loadRecentCodes();
    setRecentCodes(codes);
    loadOrders(codes);
  }, [loadOrders]);

  // ── Cari by kode pesanan ──
  async function handleCodeSearch(e: React.FormEvent) {
    e.preventDefault();
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    setCodeError("");
    setOrders(prev => new Map(prev).set(code, "loading"));
    const result = await fetchOrder(code);
    if (result === "not_found") {
      setOrders(prev => { const next = new Map(prev); next.delete(code); return next; });
      setCodeError("Kode pesanan tidak ditemukan. Pastikan kode benar.");
      return;
    }
    setOrders(prev => new Map(prev).set(code, result));
    setCodeInput("");
    const prev = loadRecentCodes();
    if (!prev.includes(code)) {
      const updated = [code, ...prev];
      saveRecentCodes(updated);
      setRecentCodes(updated.slice(0, 20));
    }
  }

  // ── Cari by email ──
  async function handleEmailSearch(e: React.FormEvent) {
    e.preventDefault();
    const email = emailInput.trim().toLowerCase();
    if (!email || !email.includes("@")) { setEmailError("Masukkan email yang valid"); return; }
    setEmailError("");
    setEmailSearching(true);
    setEmailSearched(false);
    try {
      const r = await fetch(`/api/event-orders/by-email?email=${encodeURIComponent(email)}`);
      if (!r.ok) { setEmailError("Gagal mencari pesanan. Coba lagi."); return; }
      const data: OrderStatus[] = await r.json();
      if (data.length === 0) {
        setEmailError("Tidak ada pesanan yang ditemukan untuk email ini.");
        setEmailSearched(true);
        return;
      }
      // Tambahkan semua ke map + simpan kode ke localStorage
      const newCodes: string[] = [];
      setOrders(prev => {
        const next = new Map(prev);
        data.forEach(o => { next.set(o.order_code, o); });
        return next;
      });
      const prev = loadRecentCodes();
      data.forEach(o => { if (!prev.includes(o.order_code)) newCodes.push(o.order_code); });
      if (newCodes.length > 0) {
        const updated = [...newCodes, ...prev];
        saveRecentCodes(updated);
        setRecentCodes(updated.slice(0, 20));
      }
      setEmailSearched(true);
    } catch {
      setEmailError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setEmailSearching(false);
    }
  }

  function handleRemove(code: string) {
    removeRecentCode(code);
    setOrders(prev => { const next = new Map(prev); next.delete(code); return next; });
    setRecentCodes(prev => prev.filter(c => c !== code));
  }

  async function cancelOrder(code: string) {
    if (!window.confirm("Batalkan pesanan ini? Kuota tiket akan dilepas dan pesanan tidak bisa dipulihkan.")) return;
    setCancelling(prev => ({ ...prev, [code]: true }));
    try {
      const r = await fetch(`/api/event-orders/${code}/cancel`, { method: "POST" });
      const d = await r.json();
      if (!r.ok) { alert(d.error ?? "Gagal membatalkan pesanan"); return; }
      // Refresh order status
      const updated = await fetchOrder(code);
      setOrders(prev => new Map(prev).set(code, updated));
    } catch {
      alert("Terjadi kesalahan. Coba lagi.");
    } finally {
      setCancelling(prev => ({ ...prev, [code]: false }));
    }
  }

  async function handleRefreshAll() {
    const codes = Array.from(orders.keys());
    await loadOrders(codes);
  }

  const orderEntries = Array.from(orders.entries()).filter(([, v]) => v !== "loading" && v !== "not_found") as [string, OrderStatus][];

  return (
    <Layout>
      <SEO title="Cek Tiket" description="Cek status pesanan tiket event kamu di Nempo Organizer." path="/cek-tiket" />
      <div className="max-w-2xl mx-auto px-4 py-8 pb-32">

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)" }}>
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">Cek Tiket Saya</h1>
              <p className="text-gray-400 text-xs">Status pesanan tiket event</p>
            </div>
          </div>
        </div>

        {/* Tab toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
          <button
            onClick={() => { setTab("code"); setCodeError(""); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${tab === "code" ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Search className="h-3.5 w-3.5" /> Kode Pesanan
          </button>
          <button
            onClick={() => { setTab("email"); setEmailError(""); setEmailSearched(false); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${tab === "email" ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Mail className="h-3.5 w-3.5" /> Cari by Email
          </button>
        </div>

        {/* Form kode pesanan */}
        {tab === "code" && (
          <form onSubmit={handleCodeSearch} className="mb-6">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 border border-gray-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/10 rounded-xl px-3.5 py-3 transition-all bg-white">
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={codeInput}
                  onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError(""); }}
                  placeholder="Masukkan kode pesanan (cth: NGTAB1C2D)"
                  className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-300 font-mono tracking-widest"
                  maxLength={20}
                />
              </div>
              <button
                type="submit"
                disabled={!codeInput.trim()}
                className="px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cek
              </button>
            </div>
            {codeError && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <XCircle className="h-3 w-3 shrink-0" /> {codeError}
              </p>
            )}
          </form>
        )}

        {/* Form email */}
        {tab === "email" && (
          <form onSubmit={handleEmailSearch} className="mb-6">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 border border-gray-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/10 rounded-xl px-3.5 py-3 transition-all bg-white">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => { setEmailInput(e.target.value); setEmailError(""); setEmailSearched(false); }}
                  placeholder="Email yang dipakai saat pesan"
                  className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-300"
                />
              </div>
              <button
                type="submit"
                disabled={!emailInput.trim() || emailSearching}
                className="px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {emailSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Cari"}
              </button>
            </div>
            {emailError && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <XCircle className="h-3 w-3 shrink-0" /> {emailError}
              </p>
            )}
            {emailSearched && !emailError && (
              <p className="text-emerald-600 text-xs mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 shrink-0" /> Pesanan ditemukan dan ditambahkan ke daftar di bawah.
              </p>
            )}
            <p className="text-gray-400 text-[11px] mt-2">Masukkan email yang sama dengan yang kamu pakai saat checkout.</p>
          </form>
        )}

        {Array.from(orders.values()).some(v => v === "loading") && (
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <RefreshCw className="h-4 w-4 animate-spin" /> Memuat status pesanan...
          </div>
        )}

        {orderEntries.length === 0 && !Array.from(orders.values()).some(v => v === "loading") && (
          <div className="bg-white rounded-2xl border border-gray-100 py-12 text-center">
            <Ticket className="h-10 w-10 mx-auto mb-3 text-gray-200" />
            <p className="font-bold text-gray-600 text-sm">Belum ada tiket</p>
            <p className="text-gray-400 text-xs mt-1 mb-4">Cari dengan kode pesanan atau email yang dipakai saat checkout</p>
            <Link href="/event">
              <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-colors">
                <Ticket className="h-4 w-4" /> Lihat Event
              </button>
            </Link>
          </div>
        )}

        {orderEntries.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{orderEntries.length} Pesanan</p>
              <button onClick={handleRefreshAll} className="flex items-center gap-1 text-xs text-teal-600 font-semibold hover:text-teal-700">
                <RefreshCw className="h-3 w-3" /> Refresh
              </button>
            </div>

            <div className="space-y-3">
              {orderEntries.map(([code, order]) => (
                <div key={code} className={`bg-white rounded-2xl border overflow-hidden ${order.status === "pending" ? "border-amber-200 shadow-sm shadow-amber-50" : order.status === "confirmed" ? "border-emerald-200" : "border-red-100"}`}>
                  <div className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-extrabold text-gray-900 text-sm font-mono tracking-wide">{order.order_code}</span>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-gray-800 font-bold text-sm leading-snug">{order.event_name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{order.ticket_name} × {order.qty}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <p className="font-extrabold text-gray-900 text-sm">{fmtRp(order.total_amount)}</p>
                        <button
                          onClick={() => handleRemove(code)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                          title="Hapus dari daftar"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" /> {fmtDate(order.created_at)}
                      </span>
                      <span className="font-medium text-gray-600">Pemesan: {order.buyer_name}</span>
                    </div>

                    {order.status === "pending" && (
                      <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                        <p className="text-amber-700 text-xs font-bold">⏳ Menunggu Konfirmasi Admin</p>
                        <p className="text-amber-600 text-[11px] mt-0.5 leading-relaxed mb-3">Selesaikan pembayaran di aplikasi bank/dompet digitalmu lalu kirim konfirmasi ke admin.</p>
                        <div className="flex gap-2">
                          <a
                             href={NEMPO_CONSULT_URL}
                            target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs text-white transition-colors"
                             style={{ background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}
                          >
                             <CreditCard className="h-3.5 w-3.5" /> Kirim Konfirmasi via Instagram
                          </a>
                          <button
                            onClick={() => cancelOrder(order.order_code)}
                            disabled={!!cancelling[order.order_code]}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs bg-white border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {cancelling[order.order_code] ? "..." : "Batalkan"}
                          </button>
                        </div>
                      </div>
                    )}
                    {order.status === "confirmed" && (
                      <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
                        <p className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Pesanan Dikonfirmasi!
                        </p>
                        {order.confirmed_at && (
                          <p className="text-emerald-600 text-[11px] mt-0.5">Dikonfirmasi pada {fmtDate(order.confirmed_at)}</p>
                        )}
                        <p className="text-emerald-600 text-[11px] mt-0.5">E-tiket telah dikirim ke email & WhatsApp kamu.</p>
                      </div>
                    )}
                    {order.status === "rejected" && (
                      <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                        <p className="text-red-600 text-xs font-bold flex items-center gap-1">
                          <XCircle className="h-3.5 w-3.5" /> Pesanan Ditolak
                        </p>
                        <p className="text-red-500 text-[11px] mt-0.5">
                          <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="underline">
                            Hubungi admin via DM Instagram
                          </a>{" "}
                          untuk info lebih lanjut.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
              <div className="flex-1">
                <p className="text-blue-700 font-bold text-xs">Ingin beli tiket baru?</p>
                <p className="text-blue-500 text-[11px] mt-0.5">Lihat semua event yang tersedia di Jawa Barat</p>
              </div>
              <Link href="/event">
                <button className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shrink-0">
                  Event <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
