import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useRoute, Link, useLocation, useSearch } from "@/lib/wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import { toSnake } from "@/lib/api-keys";

import {
  ChevronRight, ChevronLeft, Check, Ticket, MapPin, Calendar,
  User, Users, Mail, Phone, Building2, CheckCircle2, Instagram,
  CreditCard, Smartphone, Wallet, Info, Tag, Loader2, XCircle,
} from "lucide-react";

const API = "/api";

interface PaymentInfo {
  bank_name?: string;
  bank_account_no?: string;
  bank_account_name?: string;
  qr_image?: string;
}

interface ApiEvent {
  id: number;
  slug: string;
  name: string;
  category: string;
  date: string;
  date_end?: string;
  time_start?: string;
  time_end?: string;
  location: string;
  image: string;
  description: string;
  price: number;
  organizer: string;
  organizer_ig?: string;
  allow_voucher: boolean;
  payment_info?: PaymentInfo;
  service_fee_percent?: number;
}

interface EventTicket {
  id: number;
  event_id: number;
  name: string;
  description: string;
  price: number;
  quota: number;
  sold: number;
  sort_order: number;
  active: boolean;
  sale_start: string | null;
  sale_end: string | null;
}

const STEPS = ["Pilih Tiket", "Detail Pesanan", "Pembayaran"];


interface AppliedVoucher {
  id: number;
  code: string;
  title: string;
  discount_value: number;
  discount_type: string;
  applicable_type: string;
}

const DRAFT_TTL = 24 * 60 * 60 * 1000; // 24 jam
function draftKey(eventId: string) { return `nempo_checkout_${eventId}`; }

export default function EventCheckout() {
  const [, params]      = useRoute("/event/:slug/checkout");
  const [, setLocation] = useLocation();
  const search          = useSearch();
  const { token, user } = useAuth();

  const [event, setEvent]     = useState<ApiEvent | null>(null);
  const [tickets, setTickets] = useState<EventTicket[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Step state ── */
  const [step, setStep]         = useState(1);
  const [selType, setSelType]   = useState<number | null>(null);
  const [qty, setQty]           = useState(0);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [attendeeNames, setAttendeeNames] = useState<string[]>([]);
  const [done, setDone]         = useState(false);
  const [paymentAutoConfirmed, setPaymentAutoConfirmed] = useState(false); // true = QRIS/e-wallet/gratis; false = VA/transfer menunggu admin
  const [submitting, setSubmitting] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [snapToken, setSnapToken] = useState(""); // token Midtrans sesi ini — reuse supaya tidak buat order baru saat retry
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  /* ── Voucher state ── */
  const [voucherInput, setVoucherInput]       = useState("");
  const [appliedVoucher, setAppliedVoucher]   = useState<AppliedVoucher | null>(null);
  const [voucherError, setVoucherError]       = useState("");
  const [applyingVoucher, setApplyingVoucher] = useState(false);

  /* ── Batalkan snap token saat tiket / qty berubah — agar tidak reuse order lama ── */
  useEffect(() => {
    setSnapToken("");
    setOrderCode("");
  }, [selType, qty]);

  /* ── Simpan draft ke localStorage setiap kali ada perubahan ── */
  useEffect(() => {
    if (!params?.slug || loading || done) return;
    const draft = { step, selType, qty, name, email, phone, attendeeNames, appliedVoucher, savedAt: Date.now() };
    try { localStorage.setItem(draftKey(params.slug), JSON.stringify(draft)); } catch { /* ignore */ }
  }, [step, selType, qty, name, email, phone, attendeeNames, appliedVoucher, loading, done, params?.slug]);

  /* ── Hapus draft setelah pesanan berhasil ── */
  useEffect(() => {
    if (done && params?.slug) {
      try { localStorage.removeItem(draftKey(params.slug)); } catch { /* ignore */ }
    }
  }, [done, params?.slug]);

  // Auto-simpan kode pesanan ke localStorage agar muncul di /cek-tiket tanpa perlu login
  useEffect(() => {
    if (!done || !orderCode) return;
    try {
      const prev: string[] = JSON.parse(localStorage.getItem("nempo_recent_orders") ?? "[]");
      if (!prev.includes(orderCode)) {
        localStorage.setItem("nempo_recent_orders", JSON.stringify([orderCode, ...prev].slice(0, 20)));
      }
    } catch { /* ignore */ }
  }, [done, orderCode]);

  useEffect(() => {
    if (!params?.slug) return;
    const qs     = new URLSearchParams(search);
    const qTix   = qs.get("ticket");
    const qQty   = Number(qs.get("qty") ?? "0");

    Promise.all([
      fetch(`/api/events/${params.slug}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/events/${params.slug}/tickets`).then(r => r.ok ? r.json() : []),
    ]).then(([rawEv, rawTix]: [ApiEvent | null, EventTicket[]]) => {
      const ev = toSnake<ApiEvent | null>(rawEv);
      const tix = toSnake<EventTicket[]>(rawTix);
      setEvent(ev);
      setTickets(tix);


      /* Cek ketersediaan berdasarkan tanggal penjualan */
      const now = new Date();
      const isDateOk = (t: EventTicket) => {
        const start = t.sale_start ? new Date(t.sale_start) : null;
        const end   = t.sale_end   ? new Date(t.sale_end)   : null;
        if (start && now < start) return false;
        if (end   && now > end)   return false;
        return true;
      };

      /* ── Kalau ada ?ticket= di URL, itu selalu prioritas (user klik dari halaman event) ── */
      if (qTix) {
        const found = tix.find(t => t.id === Number(qTix));
        if (found && isDateOk(found)) {
          const validQty = Math.max(0, qQty);
          setSelType(found.id);
          setQty(validQty);
          if (validQty > 0) setStep(2);
        } else {
          const first = tix.find(t => t.sold < t.quota && isDateOk(t)) ?? tix[0];
          setSelType(first?.id ?? null);
        }
        setRestoredDraft(false);
        return;
      }

      /* ── Tidak ada ?ticket= — coba pulihkan draft tersimpan ── */
      let restored = false;
      try {
        const raw = localStorage.getItem(draftKey(params.slug!));
        if (raw) {
          const draft = JSON.parse(raw);
          if (Date.now() - draft.savedAt < DRAFT_TTL) {
            /* Restore draft sepenuhnya — termasuk step=1 agar pilihan tiket tidak hilang */
            setStep(draft.step ?? 1);
            if (draft.selType !== undefined) setSelType(draft.selType);
            if (draft.qty)     setQty(draft.qty);
            if (draft.name)    setName(draft.name);
            if (draft.email)   setEmail(draft.email);
            if (draft.phone)   setPhone(draft.phone);
            if (draft.attendeeNames) setAttendeeNames(draft.attendeeNames);
            if (draft.appliedVoucher) setAppliedVoucher(draft.appliedVoucher);
            /* Tampilkan banner "lanjutkan" hanya jika sudah ada progres nyata (step > 1) */
            restored = draft.step > 1;
          } else {
            localStorage.removeItem(draftKey(params.slug!));
          }
        }
      } catch { /* ignore */ }

      if (!restored && tix.length > 0) {
        /* Hanya set tiket default jika belum ada pilihan dari draft */
        setSelType(prev => {
          if (prev !== null) return prev;
          const first = tix.find(t => t.sold < t.quota && isDateOk(t)) ?? tix[0];
          return first?.id ?? null;
        });
      }

      setRestoredDraft(restored);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [params?.slug]);

  /* ── Prefill nama/email/HP dari profil user jika sudah login dan field masih kosong ── */
  useEffect(() => {
    if (!user) return;
    if (!name  && user.name)  setName(user.name);
    if (!email && user.email) setEmail(user.email);
    if (!phone && user.phone) setPhone(user.phone);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* ── Muat script Midtrans Snap.js sekali saat halaman dibuka ── */
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [step]);

  useEffect(() => {
    if (document.getElementById("midtrans-snap-script")) { setSnapReady(true); return; }
    fetch(`${API}/payments/client-key`)
      .then(r => r.ok ? r.json() : null)
      .then((cfg: { clientKey?: string; isProduction?: boolean } | null) => {
        if (!cfg?.clientKey) return;
        const script = document.createElement("script");
        script.id = "midtrans-snap-script";
        script.src = cfg.isProduction ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", cfg.clientKey);
        script.onload = () => setSnapReady(true);
        document.body.appendChild(script);
      })
      .catch(() => {});
  }, []);

  async function applyVoucher() {
    if (!voucherInput.trim()) return;
    if (!token) { setVoucherError("Login untuk menggunakan voucher"); return; }
    setApplyingVoucher(true);
    setVoucherError("");
    try {
      const r = await fetch(`${API}/user/vouchers/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: voucherInput.trim() }),
      });
      const d = await r.json();
      if (!r.ok) { setVoucherError(d.error ?? "Voucher tidak valid"); return; }
      setAppliedVoucher(d.voucher);
      setVoucherInput("");
    } catch { setVoucherError("Gagal memeriksa voucher. Coba lagi."); }
    finally { setApplyingVoucher(false); }
  }

  function removeVoucher() {
    setAppliedVoucher(null);
    setVoucherError("");
  }

  function saveOrderCodeLocally(code: string) {
    try {
      const key = "nempo_recent_orders";
      const prev: string[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      const updated = [code, ...prev.filter((c: string) => c !== code)].slice(0, 20);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch { /* ignore */ }
  }

  async function markVoucherUsed() {
    if (!appliedVoucher || !token) return;
    try {
      await fetch(`${API}/user/vouchers/use`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: appliedVoucher.code }),
      });
    } catch { /* non-critical */ }
  }

  async function handleCheckoutComplete() {
    if (submitting) return;
    setSubmitting(true);
    try {
      let activeOrderCode = orderCode;
      let activeSnapToken = snapToken;

      /* ── Buat order baru hanya kalau belum ada token sesi ini ──
         Jika user menutup Snap lalu klik "Bayar Sekarang" lagi, kita reuse
         token yang sama sehingga tidak ada pesanan ganda di database. ── */
      if (!activeSnapToken) {
        const res = await fetch(`${API}/event-orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_id: event?.id,
            ticket_id: ticket?.id,
            ticket_name: ticket?.name ?? "",
            qty,
            buyer_name: name,
            buyer_email: email,
            buyer_phone: phone,
            attendee_names: JSON.stringify(syncedAttendeeNames),
            total_amount: finalTotal,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Gagal membuat pesanan");

        activeOrderCode = data.order_code;
        setOrderCode(activeOrderCode);
        saveOrderCodeLocally(activeOrderCode);

        /* Tiket gratis — langsung selesai tanpa pembayaran */
        if (data.free) {
          await markVoucherUsed();
          setPaymentAutoConfirmed(true); // gratis = langsung terkonfirmasi
          setDone(true);
          setSubmitting(false);
          return;
        }

        activeSnapToken = data.snap_token;
        setSnapToken(activeSnapToken);
      }

      const snapWin = (window as any).snap;
      if (!activeSnapToken || !snapWin) {
        throw new Error("Gagal memuat metode pembayaran. Muat ulang halaman dan coba lagi.");
      }

      snapWin.pay(activeSnapToken, {
        onSuccess: async () => {
          await markVoucherUsed();
          // Pembayaran settle langsung (e-wallet, QRIS, kartu) → auto-confirm + kirim tiket
          try {
            await fetch(`/api/event-orders/${activeOrderCode}/payment-success`, { method: "POST" });
          } catch { /* order tetap tersimpan, email masuk antrian failures */ }
          setPaymentAutoConfirmed(true); // QRIS/e-wallet = langsung dikonfirmasi
          setSnapToken(""); // bersihkan setelah berhasil
          setDone(true); setSubmitting(false);
        },
        onPending: async () => {
          // VA / transfer bank: uang belum masuk → jangan auto-confirm.
          // Admin konfirmasi manual setelah dana diterima, baru email tiket terkirim.
          await markVoucherUsed();
          setSnapToken(""); // bersihkan setelah selesai
          setDone(true); setSubmitting(false);
        },
        onError: () => {
          // Error pembayaran — biarkan token tetap ada agar user bisa coba metode lain
          // tanpa membuat pesanan baru
          setSubmitting(false);
          alert("Pembayaran gagal. Silakan coba lagi atau pilih metode lain.");
        },
        onClose: () => {
          // User tutup popup — pertahankan token agar retry tidak buat pesanan baru
          setSubmitting(false);
        },
      });
    } catch (err: any) {
      alert(err.message ?? "Gagal mengirim pesanan. Coba lagi.");
      setSubmitting(false);
    }
  }

  function fmtRp(n: number) {
    return n === 0 ? "Gratis" : `Rp${n.toLocaleString("id")}`;
  }

  const ticket    = tickets.find(t => t.id === selType) ?? null;
  const subtotal  = ticket ? ticket.price * qty : 0;
  const discountAmount = appliedVoucher
    ? (appliedVoucher.discount_type === "persen"
        ? Math.round(subtotal * appliedVoucher.discount_value / 100)
        : Math.min(subtotal, appliedVoucher.discount_value))
    : 0;
  const total  = Math.max(0, subtotal - discountAmount);
  const serviceFeePercent = total > 0 ? (event?.service_fee_percent ?? 2) : 0;
  const serviceFee = total > 0 ? Math.round(total * serviceFeePercent / 100) : 0;
  const finalTotal = total + serviceFee;
  const sisa   = ticket ? ticket.quota - ticket.sold : 0;

  /* Sync jumlah slot attendeeNames ke qty-1 */
  const extraCount = Math.max(0, qty - 1);
  const syncedAttendeeNames = Array.from({ length: extraCount }, (_, i) => attendeeNames[i] ?? "");

  const setAttendeeName = (idx: number, val: string) => {
    setAttendeeNames(prev => {
      const next = Array.from({ length: extraCount }, (_, i) => prev[i] ?? "");
      next[idx] = val;
      return next;
    });
  };

  const allAttendeeNamesFilled = syncedAttendeeNames.every(n => n.trim().length > 1);

  const ticketDateStatus = ticket ? dateStatus(ticket) : "available";
  const canNext = step === 1
    ? selType !== null && ticketDateStatus === "available" && qty > 0
    : step === 2
    ? name.trim().length > 1 && email.includes("@") && phone.length >= 8
    : false; /* step 3 has its own confirm button */

  const tierBadge = (t: EventTicket) => {
    const n = t.name.toLowerCase();
    if (n.includes("presale 1") || n.includes("early bird")) return { label: "Early Bird", color: "bg-amber-500 text-white" };
    if (n.includes("presale 2")) return { label: "Presale 2",   color: "bg-blue-500 text-white"  };
    if (n.includes("ots"))       return { label: "On The Spot", color: "bg-gray-500 text-white" };
    return null;
  };

  /* ── Cek apakah tiket bisa dibeli sekarang berdasarkan tanggal ── */
  function dateStatus(t: EventTicket): "available" | "upcoming" | "ended" {
    const now   = new Date();
    // Tambah waktu eksplisit agar tidak di-parse sebagai UTC midnight
    // (tanpa ini, "2026-08-29" → midnight UTC = jam 7 pagi WIB → tiket dianggap berakhir seharian)
    const start = t.sale_start ? new Date(t.sale_start + "T00:00:00") : null;
    const end   = t.sale_end   ? new Date(t.sale_end   + "T23:59:59") : null;
    if (start && now < start) return "upcoming";
    if (end   && now > end)   return "ended";
    return "available";
  }

  function fmtSaleDate(iso: string | null) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  }

  /* Order summary box */
  function OrderSummary() {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <Ticket className="h-4 w-4 text-teal-600" />
          <p className="font-extrabold text-gray-900 text-sm">Rincian Pesanan</p>
        </div>
        <div className="px-4 py-4 space-y-2.5">
          {ticket ? (
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-gray-900 text-sm">{ticket.name}</p>
                <p className="text-gray-400 text-xs">× {qty}</p>
              </div>
              <p className="font-bold text-gray-900 text-sm shrink-0">{fmtRp(subtotal)}</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Belum memilih tiket</p>
          )}
          <div className="border-t border-dashed border-gray-100 pt-2 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-700">{fmtRp(subtotal)}</span>
            </div>
            {appliedVoucher && (
              <div className="flex justify-between text-xs">
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Tag className="h-3 w-3" /> {appliedVoucher.code}
                </span>
                <span className="font-semibold text-emerald-600">− {fmtRp(discountAmount)}</span>
              </div>
            )}
            {serviceFee > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Biaya Layanan ({serviceFeePercent}%)</span>
                <span className="font-semibold text-gray-700">{fmtRp(serviceFee)}</span>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 pt-2.5 flex justify-between">
            <span className="font-extrabold text-gray-900 text-sm">Total {qty} Tiket</span>
            <span className="font-extrabold text-teal-700 text-base">{fmtRp(finalTotal)}</span>
          </div>
        </div>

        {step < 3 ? (
          (step === 1 && !canNext) ? null : (
            <div className="hidden lg:block px-4 pb-4">
              <button
                disabled={!canNext}
                onClick={() => setStep(s => s + 1)}
                className={`w-full py-3 rounded-xl font-extrabold text-sm transition-all ${
                  canNext
                    ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Lanjutkan →
              </button>
            </div>
          )
        ) : (
          <div className="hidden lg:block px-4 pb-4">
            <button
              disabled={submitting || (finalTotal > 0 && !snapReady)}
              onClick={handleCheckoutComplete}
              className={`w-full py-3 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
                !submitting && (finalTotal === 0 || snapReady)
                  ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {submitting
                ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Memproses...</>
                : finalTotal === 0
                ? "Klaim Tiket Gratis →"
                : !snapReady
                ? "Memuat pembayaran..."
                : "Bayar Sekarang →"}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <Layout hideBottomNav>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout hideBottomNav>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
          <p className="font-bold text-gray-700">Event tidak ditemukan</p>
          <button onClick={() => window.history.back()} className="text-teal-600 text-sm underline">Kembali</button>
        </div>
      </Layout>
    );
  }

  /* ── SUCCESS SCREEN ── */
  if (done) {
    return (
      <Layout hideBottomNav>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${paymentAutoConfirmed ? "bg-emerald-100" : "bg-amber-100"}`}>
              {paymentAutoConfirmed
                ? <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                : <svg viewBox="0 0 24 24" className="h-10 w-10 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              }
            </div>
            <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${paymentAutoConfirmed ? "text-emerald-600" : "text-amber-600"}`}>
              {paymentAutoConfirmed ? "Pembayaran Berhasil!" : "Pesanan Dikirim!"}
            </p>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">{event.name}</h2>
            <p className="text-gray-400 text-sm mb-2">{ticket?.name ?? "Tiket"} × {qty}</p>
            {paymentAutoConfirmed ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4 text-left">
                <p className="text-emerald-800 text-xs font-bold mb-1">✅ Tiket Sedang Dikirim ke Email</p>
                <p className="text-emerald-700 text-[11px] leading-relaxed">Pembayaran berhasil dikonfirmasi. E-tiket akan dikirimkan ke emailmu dalam beberapa menit.</p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-left">
                <p className="text-amber-800 text-xs font-bold mb-1">⏳ Selesaikan Pembayaran</p>
                <p className="text-amber-700 text-[11px] leading-relaxed">Selesaikan transfer ke rekening/VA yang tampil di aplikasi bank atau dompet digitalmu. Tiket dikirim setelah admin mengkonfirmasi dana masuk.</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-2xl px-4 py-3 mb-5 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Kode Pesanan</span>
                <span className="font-bold text-gray-900 font-mono tracking-wide">{orderCode}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Pemesan</span>
                <span className="font-bold text-gray-900">{name || "—"}</span>
              </div>
              {syncedAttendeeNames.map((n, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-gray-500">Orang ke-{i + 2}</span>
                  <span className="font-bold text-gray-900">{n || "—"}</span>
                </div>
              ))}
              {appliedVoucher && discountAmount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-600">Diskon Voucher</span>
                  <span className="font-bold text-emerald-600">− {fmtRp(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Total Dibayar</span>
                <span className="font-bold text-teal-700">{fmtRp(finalTotal)}</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-4">E-tiket dikirim ke <strong className="text-gray-700">{email || "emailmu"}</strong></p>
            <a
              href={NEMPO_CONSULT_URL}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-extrabold text-sm text-white mb-3 transition-colors"
               style={{ background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.859L.057 23.428a.5.5 0 0 0 .609.61l5.699-1.464A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.373l-.358-.214-3.724.956.988-3.618-.234-.373A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
               Kirim Konfirmasi ke DM Instagram
            </a>
            <Link href="/cek-tiket">
              <button className="w-full py-3 rounded-xl bg-teal-600 text-white font-extrabold text-sm hover:bg-teal-700 transition-colors">
                Lihat Tiket Saya
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideBottomNav>
      <SEO title="Checkout Tiket Event" noIndex />
      <div className="min-h-screen bg-gray-50">

        {/* ── Stepper header ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
            <button
              onClick={() => step === 1 ? setLocation(`/event/${event.slug}`) : setStep(s => s - 1)}
              className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold mb-4 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Kembali
            </button>
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
              {STEPS.map((label, i) => {
                const n      = i + 1;
                const active = n === step;
                const isDone = n < step;
                return (
                  <div key={label} className="flex items-center gap-1 shrink-0">
                    <div className={`flex items-center gap-1.5 ${active ? "text-teal-600" : isDone ? "text-gray-400" : "text-gray-300"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold border-2 transition-all ${
                        active ? "border-teal-600 bg-teal-600 text-white"
                        : isDone ? "border-teal-400 bg-teal-50 text-teal-600"
                        : "border-gray-200 bg-white text-gray-300"
                      }`}>
                        {isDone ? <Check className="h-3 w-3" /> : n}
                      </div>
                      <span className={`text-[11px] font-bold hidden sm:block ${active ? "text-teal-700" : isDone ? "text-gray-500" : "text-gray-300"}`}>
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-gray-200 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Banner draft dipulihkan ── */}
        {restoredDraft && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-3">
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <span className="text-lg">📋</span>
              <div className="flex-1 min-w-0">
                <p className="text-amber-800 font-bold text-sm">Pesanan kamu sebelumnya ditemukan</p>
                <p className="text-amber-600 text-[11px]">Lanjutkan dari langkah {step} — data form sudah terisi otomatis</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    try { localStorage.removeItem(draftKey(params!.slug)); } catch { /* ignore */ }
                    setStep(1); setSelType(null); setQty(0);
                    setName(""); setEmail(""); setPhone("");
                    setAttendeeNames([]); setAppliedVoucher(null);
                    setRestoredDraft(false);
                  }}
                  className="text-[11px] font-bold text-amber-700 underline underline-offset-2 hover:text-amber-900"
                >
                  Mulai ulang
                </button>
                <button
                  onClick={() => setRestoredDraft(false)}
                  className="text-amber-500 hover:text-amber-800 transition-colors text-base leading-none font-bold"
                  aria-label="Tutup"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-7 pb-36 lg:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ── LEFT: main content ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Event banner */}
              <div className="rounded-2xl overflow-hidden relative min-h-52 bg-gradient-to-br from-teal-700 via-teal-500 to-teal-400">
                {event.image && (
                  <img src={event.image} alt={event.name} className="w-full block" style={{ display: "block" }} />
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)" }} />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white font-extrabold text-xl leading-tight mb-1.5">{event.name}</p>
                  <div className="flex flex-col gap-1">
                    {event.date && <p className="text-white/80 text-xs flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 shrink-0" />{event.date}</p>}
                    {event.location && <p className="text-white/80 text-xs flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" />{event.location}</p>}
                  </div>
                </div>
              </div>

              {/* ── Konten per-step (fade-in saat pindah step) ── */}
              <div key={step} className="animate-in fade-in slide-in-from-bottom-3 duration-200 space-y-4">

              {/* ══ STEP 1: Pilih Tiket ══ */}
              {step === 1 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-teal-600" />
                    <p className="font-extrabold text-gray-900 text-sm">Pilih Kategori Tiket</p>
                  </div>
                  <div className="p-4 space-y-3">
                    {tickets.length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-4">Tiket belum tersedia</p>
                    )}
                    {tickets.map(t => {
                      const isSelected = selType === t.id;
                      const habis      = t.sold >= t.quota;
                      const sisaT      = t.quota - t.sold;
                      const badge      = tierBadge(t);
                      const ds         = dateStatus(t);
                      const disabled   = habis || ds !== "available";
                      return (
                        <div
                          key={t.id}
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => { if (!disabled) { setSelType(t.id); setQty(0); } }}
                          className={`w-full text-left rounded-xl border-2 px-4 py-3.5 transition-all ${
                            disabled
                              ? "opacity-50 cursor-not-allowed border-gray-100 bg-gray-50"
                              : isSelected
                              ? "border-teal-500 bg-teal-50 cursor-pointer"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <p className="font-extrabold text-gray-900 text-sm">{t.name}</p>
                                {badge && (
                                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${badge.color}`}>{badge.label}</span>
                                )}
                                {habis && (
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-100 text-red-600">Habis</span>
                                )}
                                {!habis && ds === "available" && (
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">On Sale</span>
                                )}
                                {!habis && ds === "upcoming" && (
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-600">
                                    Buka {fmtSaleDate(t.sale_start)}
                                  </span>
                                )}
                                {!habis && ds === "ended" && (
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-gray-200 text-gray-500">Penjualan Berakhir</span>
                                )}
                              </div>
                              {t.description && <p className="text-gray-400 text-xs">{t.description}</p>}
                              {!habis && ds === "available" && (
                                <p className="text-gray-400 text-[10px] mt-1">Sisa {sisaT} tiket</p>
                              )}
                              {!habis && ds === "upcoming" && t.sale_end && (
                                <p className="text-gray-400 text-[10px] mt-1">s/d {fmtSaleDate(t.sale_end)}</p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-extrabold text-gray-900 text-base">{t.price === 0 ? "Gratis" : `Rp${t.price.toLocaleString("id")}`}</p>
                              {isSelected && !disabled && (
                                <div className="flex items-center gap-2 mt-2 justify-end">
                                  <button
                                    onClick={e => { e.stopPropagation(); setQty(q => Math.max(0, q - 1)); }}
                                    className={`w-7 h-7 rounded-lg border font-bold text-base flex items-center justify-center transition-colors ${
                                      qty === 0 ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50" : "border-gray-200 text-gray-700 hover:bg-gray-100"
                                    }`}
                                    disabled={qty === 0}
                                  >−</button>
                                  <span className="font-extrabold text-gray-900 w-5 text-center">{qty}</span>
                                  <button
                                    onClick={e => { e.stopPropagation(); setQty(q => Math.min(Math.max(1, sisaT), q + 1)); }}
                                    className="w-7 h-7 rounded-lg border border-teal-400 bg-teal-50 text-teal-700 font-bold text-base flex items-center justify-center hover:bg-teal-100"
                                  >+</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex items-start gap-2 bg-blue-50 rounded-xl px-3 py-2.5 mt-1">
                      <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-blue-600 text-[11px] leading-relaxed">Tiket tidak dapat dikembalikan setelah pembelian dikonfirmasi.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ STEP 2: Detail Pesanan ══ */}
              {step === 2 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <User className="h-4 w-4 text-teal-600" />
                    <p className="font-extrabold text-gray-900 text-sm">Data Pemesan</p>
                  </div>
                  <div className="p-4 space-y-3.5">
                    {[
                      { label: "Nama Lengkap", icon: User,  type: "text",  placeholder: "Nama sesuai KTP",  val: name,  set: setName  },
                      { label: "Email",         icon: Mail,  type: "email", placeholder: "email@contoh.com", val: email, set: setEmail },
                      { label: "No. WhatsApp",  icon: Phone, type: "tel",  placeholder: "08xxxxxxxxxx",     val: phone, set: setPhone },
                    ].map(({ label, icon: Icon, type, placeholder, val, set }) => (
                      <div key={label}>
                        <label className="text-xs font-bold text-gray-700 mb-1.5 block">{label}</label>
                        <div className="flex items-center gap-2.5 border border-gray-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/10 rounded-xl px-3.5 py-2.5 transition-all">
                          <Icon className="h-4 w-4 text-gray-400 shrink-0" />
                          <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={placeholder}
                            className="flex-1 outline-none text-base text-gray-800 bg-transparent placeholder-gray-300" />
                        </div>
                      </div>
                    ))}

                    <div className="flex items-start gap-2 bg-blue-50 rounded-xl px-3 py-2.5">
                      <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-[#0172B1] text-[11px] leading-relaxed">E-tiket akan dikirim ke email dan WhatsApp yang kamu isi.</p>
                    </div>

                    {/* Nama peserta tambahan (orang ke-2, ke-3, dst) */}
                    {extraCount > 0 && (
                      <div className="border-t border-gray-100 pt-3.5 space-y-3">
                        <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-teal-500" /> Nama Peserta Lainnya
                          <span className="text-[10px] font-normal text-gray-400">(opsional)</span>
                        </p>
                        {syncedAttendeeNames.map((val, idx) => (
                          <div key={idx}>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Orang ke-{idx + 2}</label>
                            <div className="flex items-center gap-2.5 border border-gray-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/10 rounded-xl px-3.5 py-2.5 transition-all">
                              <User className="h-4 w-4 text-gray-400 shrink-0" />
                              <input
                                type="text"
                                value={val}
                                onChange={e => setAttendeeName(idx, e.target.value)}
                                placeholder={`Nama orang ke-${idx + 2} sesuai KTP`}
                                className="flex-1 outline-none text-base text-gray-800 bg-transparent placeholder-gray-300"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Voucher input — hanya tampil jika event mengizinkan */}
                    {event.allow_voucher ? (
                      <div className="border-t border-gray-100 pt-3.5">
                        <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-teal-500" /> Kode Voucher / Diskon
                        </label>
                        {appliedVoucher ? (
                          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-emerald-700">{appliedVoucher.code}</p>
                              <p className="text-[10px] text-emerald-600">{appliedVoucher.title} — hemat {fmtRp(discountAmount)}</p>
                            </div>
                            <button onClick={removeVoucher} className="p-1 hover:bg-emerald-100 rounded-lg transition-colors">
                              <XCircle className="h-4 w-4 text-emerald-400" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="flex gap-2">
                              <input type="text" value={voucherInput}
                                onChange={e => { setVoucherInput(e.target.value.toUpperCase()); setVoucherError(""); }}
                                onKeyDown={e => e.key === "Enter" && applyVoucher()}
                                placeholder="Masukkan kode voucher"
                                className="flex-1 border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 rounded-xl px-3.5 py-2.5 text-base outline-none placeholder-gray-300 uppercase tracking-widest" />
                              <button onClick={applyVoucher} disabled={!voucherInput.trim() || applyingVoucher}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5">
                                {applyingVoucher ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Pakai"}
                              </button>
                            </div>
                            {voucherError && (
                              <p className="text-[11px] text-red-500 flex items-center gap-1">
                                <XCircle className="h-3 w-3 shrink-0" /> {voucherError}
                              </p>
                            )}
                            {!token && (
                              <p className="text-[11px] text-gray-400">
                                <Link href="/auth/login" className="text-teal-600 font-medium underline">Login</Link> untuk menggunakan voucher
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* ══ STEP 3: Pembayaran (rekening + upload) ══ */}
              {step === 3 && (
                <div className="space-y-3">

                  {/* ── Preview E-Tiket ── */}
                  <div className="relative select-none">
                    {/* Kartu tiket */}
                    <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(160deg,#020817 0%,#0c1a3a 45%,#1a0a0a 100%)" }}>

                      {/* Stripe merah di atas */}
                      <div style={{ background: "linear-gradient(90deg,#dc2626 0%,#991b1b 60%,#7f1d1d 100%)", height: 5 }} />

                      {/* Header tiket */}
                      <div className="px-5 pt-4 pb-3">
                        {/* Logo baris */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {/* Ikon tiket */}
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#dc2626,#7f1d1d)" }}>
                              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a1 1 0 0 1 0-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a1 1 0 0 1 0 2v2a1 1 0 0 1 0 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a1 1 0 0 1 0-2V9z"/></svg>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#fbbf24" }}>Nempo Organizer</span>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: "rgba(220,38,38,0.2)", color: "#fca5a5", border: "1px solid rgba(220,38,38,0.35)" }}>E-Tiket Resmi</span>
                        </div>

                        {/* Nama event */}
                        <p className="text-white font-black text-xl leading-tight line-clamp-2 mb-2">{event.name}</p>

                        {/* Divider merah */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-0.5 w-6 rounded-full" style={{ background: "#dc2626" }} />
                          <div className="h-0.5 flex-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                        </div>

                        {/* Info baris */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {event.date && (
                            <span className="text-[11px] flex items-center gap-1" style={{ color: "#93c5fd" }}>
                              <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              {event.date}
                            </span>
                          )}
                          {event.location && (
                            <span className="text-[11px] flex items-center gap-1" style={{ color: "#93c5fd" }}>
                              <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Kategori tiket — badge menonjol */}
                      <div className="mx-5 mb-3 rounded-xl px-4 py-2.5 flex items-center justify-between" style={{ background: "linear-gradient(90deg,rgba(220,38,38,0.18),rgba(29,78,216,0.18))", border: "1px solid rgba(220,38,38,0.3)" }}>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#fca5a5" }}>Kategori Tiket</p>
                          <p className="text-white font-extrabold text-sm">{ticket?.name ?? "—"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#93c5fd" }}>Jumlah</p>
                          <p className="text-white font-extrabold text-sm">{qty} Orang</p>
                        </div>
                      </div>

                      {/* Perforasi */}
                      <div className="relative flex items-center px-2">
                        <div className="w-5 h-5 rounded-full -ml-3 shrink-0" style={{ background: "#0f172a" }} />
                        <div className="flex-1 border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.12)" }} />
                        <div className="w-5 h-5 rounded-full -mr-3 shrink-0" style={{ background: "#0f172a" }} />
                      </div>

                      {/* Body tiket */}
                      <div className="px-5 pt-3 pb-5 flex items-end justify-between gap-3">
                        <div className="space-y-2.5 flex-1">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#fbbf24" }}>Nama Pemesan</p>
                            <p className="text-white font-bold text-sm">{name || "—"}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#fbbf24" }}>Kode Pesanan</p>
                            <p className="font-mono font-extrabold text-base tracking-widest" style={{ color: "#fde68a" }}>— — —</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#fbbf24" }}>Total Bayar</p>
                            <p className="text-white font-extrabold text-sm">{fmtRp(finalTotal)}</p>
                          </div>
                        </div>

                        {/* Barcode */}
                        <div className="shrink-0 flex flex-col items-center gap-1.5">
                          <div className="rounded-xl p-2.5 flex flex-col items-center gap-1" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <svg viewBox="0 0 48 34" className="w-14 h-9">
                              {[0,5,8,12,15,20,22,26,29,34,36,40,43,47].map((x, i) => (
                                <rect key={i} x={x} y="0" width={[3,1,2,1,3,1,2,1,3,1,2,1,3,1][i]} height={i % 3 === 0 ? 34 : 28} fill="white" opacity={0.85}/>
                              ))}
                            </svg>
                            <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Scan Me</p>
                          </div>
                        </div>
                      </div>

                      {/* Footer stripe biru */}
                      <div className="px-5 py-2.5 flex items-center justify-between" style={{ background: "rgba(29,78,216,0.25)", borderTop: "1px solid rgba(29,78,216,0.3)" }}>
                        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#93c5fd" }}>Nempo Organizer</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < 3 ? "#dc2626" : "#1d4ed8" }} />)}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#93c5fd" }}>Official Ticket</span>
                      </div>
                    </div>

                    {/* Overlay "menunggu konfirmasi" */}
                    <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ background: "rgba(2,8,23,0.55)", backdropFilter: "blur(2px)" }}>
                      <div className="rounded-2xl px-6 py-4 text-center shadow-2xl mx-4" style={{ background: "rgba(255,255,255,0.97)", border: "2px solid #dc2626" }}>
                        <div className="flex justify-center mb-2">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#dc2626,#1d4ed8)" }}>
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 9a1 1 0 0 1 0-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a1 1 0 0 1 0 2v2a1 1 0 0 1 0 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a1 1 0 0 1 0-2V9z"/>
                              <line x1="9" y1="3" x2="9" y2="21" strokeDasharray="2 2"/>
                            </svg>
                          </div>
                        </div>
                        <p className="text-gray-900 font-black text-sm">Pratinjau E-Tiket</p>
                        <p className="text-gray-500 text-[11px] mt-0.5 leading-relaxed">Tiket asli dikirim admin setelah<br/>pembayaran dikonfirmasi</p>
                      </div>
                    </div>
                  </div>

                  {/* Metode pembayaran — Midtrans (VA, e-wallet, QRIS, kartu) */}
                  {finalTotal > 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-teal-600" />
                        <p className="font-extrabold text-gray-900 text-sm">Metode Pembayaran</p>
                      </div>
                      <div className="p-5 space-y-4">
                        <p className="text-gray-500 text-xs leading-relaxed">
                          Pilih metode pembayaran favoritmu — Transfer Bank / Virtual Account, E-Wallet (GoPay, OVO, DANA, ShopeePay), QRIS, atau Kartu Kredit/Debit — pada jendela pembayaran yang aman dari Midtrans.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: "Virtual Account", icon: Building2 },
                            { label: "E-Wallet",         icon: Wallet   },
                            { label: "QRIS",             icon: Smartphone },
                            { label: "Kartu Kredit",     icon: CreditCard },
                          ].map(({ label, icon: Icon }) => (
                            <span key={label} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-600">
                              <Icon className="h-3.5 w-3.5 text-teal-500" /> {label}
                            </span>
                          ))}
                        </div>
                        <div className="bg-teal-50 border border-teal-100 rounded-2xl px-4 py-4 flex items-center justify-between">
                          <p className="text-teal-600 text-xs font-semibold">Total Bayar</p>
                          <p className="font-extrabold text-teal-800 text-xl">{fmtRp(finalTotal)}</p>
                        </div>
                        <p className="text-gray-400 text-[11px] text-center">Tiket otomatis dikonfirmasi begitu pembayaran berhasil — tanpa perlu upload bukti transfer.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-emerald-700 text-xs leading-relaxed">Tiket ini gratis — tidak perlu pembayaran. Klik tombol di bawah untuk langsung mengklaim tiketmu.</p>
                    </div>
                  )}

                  {/* Tombol konfirmasi — hanya tampil di desktop, mobile pakai sticky bottom bar */}
                  <button
                    disabled={submitting || (total > 0 && !snapReady)}
                    onClick={handleCheckoutComplete}
                    className={`hidden lg:flex w-full py-4 rounded-2xl font-extrabold text-base transition-all items-center justify-center gap-2 ${
                      !submitting && (total === 0 || snapReady)
                        ? "bg-teal-600 hover:bg-teal-700 text-white shadow-xl shadow-teal-600/25"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {submitting
                      ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Memproses...</>
                      : total === 0
                      ? "Klaim Tiket Gratis →"
                      : !snapReady
                      ? "Memuat pembayaran..."
                      : "Bayar Sekarang →"
                    }
                  </button>
                </div>
              )}
              </div>{/* end animate wrapper */}
            </div>

            {/* ── RIGHT: Order summary (sticky) ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-36 space-y-3">
                {OrderSummary()}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
                  <p className="text-xs font-extrabold text-gray-800 line-clamp-2 leading-snug">{event.name}</p>
                  {event.date && <p className="text-gray-400 text-[11px] flex items-center gap-1"><Calendar className="h-3 w-3 shrink-0" />{event.date}</p>}
                  {event.location && <p className="text-gray-400 text-[11px] flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" />{event.location}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar (semua step) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-xl px-4 pt-2.5 pb-4" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
        {ticket && (
          <div className="flex items-center justify-between mb-2">
            <div className="min-w-0">
              <p className="text-gray-400 text-[10px] font-semibold">Tiket dipilih</p>
              <p className="text-gray-900 font-extrabold text-xs truncate">
                {ticket.name}{qty > 0 ? ` × ${qty}` : ""}
              </p>
            </div>
            {qty > 0 && ticket.price > 0 && (
              <p className="font-extrabold text-sm text-teal-700 shrink-0 ml-2">{fmtRp(finalTotal)}</p>
            )}
          </div>
        )}
        {step < 3 ? (
          step === 1 ? (
            canNext ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="w-full py-3.5 rounded-2xl font-extrabold text-sm bg-teal-600 text-white shadow-md shadow-teal-600/25 active:scale-[0.98] transition-all"
              >
                Lanjut ke Detail Pesanan →
              </button>
            ) : (
              <p className="text-center text-xs text-gray-400 py-1">
                {!selType ? "Pilih kategori tiket untuk melanjutkan" : "Tambah jumlah tiket untuk melanjutkan"}
              </p>
            )
          ) : (
            <button
              disabled={!canNext}
              onClick={() => setStep(s => s + 1)}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all ${
                canNext
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/25 active:scale-[0.98]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Lanjut ke Pembayaran →
            </button>
          )
        ) : (
          <button
            disabled={submitting || (finalTotal > 0 && !snapReady)}
            onClick={handleCheckoutComplete}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
              !submitting && (finalTotal === 0 || snapReady)
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/25 active:scale-[0.98]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting
              ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Memproses...</>
              : finalTotal === 0
              ? "Klaim Tiket Gratis →"
              : !snapReady
              ? "Memuat pembayaran..."
              : "Bayar Sekarang →"}
          </button>
        )}
      </div>
    </Layout>
  );
}
