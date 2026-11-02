import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "@/lib/wouter";
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Loader2, MapPinned, MessageCircle, Search, ShieldCheck, WalletCards } from "lucide-react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";

type Order = {
  order_code: string;
  merchant_name: string;
  customer_name: string;
  delivery_area: string;
  delivery_address: string;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  subtotal: number;
  delivery_fee: number | null;
  delivery_discount: number;
  service_fee: number;
  voucher_code: string | null;
  voucher_discount: number;
  total_amount: number | null;
  delivery_eta: string | null;
  order_status: string;
  payment_status: string;
  payment_type: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  driver_vehicle: string | null;
  driver_plate: string | null;
  created_at: string;
  items: Array<{ id: number; item_name: string; quantity: number; line_total: number }>;
};

type ManualPaymentMethods = {
  delivery_fee: number | null;
  delivery_discount: number;
  whatsapp_url: string | null;
  bank_name: string | null;
  bank_account_no: string | null;
  bank_account_name: string | null;
  qris_image: string | null;
};

const statusLabels: Record<string, string> = {
  pending_confirmation: "Menunggu konfirmasi",
  confirmed: "Menunggu pembayaran",
  preparing: "Sedang disiapkan",
  driver_assigned: "Driver ditugaskan",
  picked_up: "Pesanan diambil driver",
  on_the_way: "Dalam perjalanan",
  delivered: "Pesanan selesai",
  rejected: "Pesanan ditolak",
};

const steps = [
  ["pending_confirmation", "Pesanan diterima"],
  ["confirmed", "Pesanan dikonfirmasi"],
  ["preparing", "Disiapkan merchant"],
  ["driver_assigned", "Driver ditugaskan"],
  ["picked_up", "Diambil driver"],
  ["on_the_way", "Dalam perjalanan"],
  ["delivered", "Sampai"],
] as const;

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

function mapsUrl(latitude: number | null, longitude: number | null) {
  if (latitude == null || longitude == null) return null;
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

function mapPreviewUrl(latitude: number, longitude: number) {
  const padding = 0.0025;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - padding}%2C${latitude - padding}%2C${longitude + padding}%2C${latitude + padding}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

function loadSnap() {
  if ((window as any).snap) return Promise.resolve(true);
  return fetch("/api/payments/client-key")
    .then((response) => response.json())
    .then((config) => new Promise<boolean>((resolve, reject) => {
      if (!config?.clientKey) return reject(new Error("Gateway pembayaran belum siap."));
      const existing = document.getElementById("midtrans-snap-script");
      if (existing) {
        const timer = window.setInterval(() => {
          if ((window as any).snap) {
            window.clearInterval(timer);
            resolve(true);
          }
        }, 150);
        window.setTimeout(() => {
          window.clearInterval(timer);
          reject(new Error("Gateway pembayaran belum siap."));
        }, 12000);
        return;
      }
      const script = document.createElement("script");
      script.id = "midtrans-snap-script";
      script.src = config.isProduction
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", config.clientKey);
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Gateway pembayaran belum siap."));
      document.head.appendChild(script);
    }));
}

export default function JajanYukTrackPage() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const [code, setCode] = useState(params.get("code") || "");
  const [token, setToken] = useState(params.get("token") || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [methods, setMethods] = useState<ManualPaymentMethods | null>(null);
  const [paying, setPaying] = useState(false);
  const [manualPaying, setManualPaying] = useState(false);

  useEffect(() => {
    fetch("/api/jajan-yuk/payment-methods")
      .then((response) => response.json())
      .then((data) => setMethods(data))
      .catch(() => setMethods(null));
  }, []);

  useEffect(() => {
    if (code && token) {
      void findOrder(code, token);
    }
    // The query string is the private access link generated after checkout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!order || !code || !token || ["delivered", "rejected"].includes(order.order_status)) return;
    const timer = window.setInterval(() => {
      void findOrder(order.order_code, token);
    }, 15000);
    return () => window.clearInterval(timer);
  }, [order?.order_code, order?.order_status, code, token]);

  async function findOrder(orderCode = code, accessToken = token) {
    if (!orderCode.trim() || accessToken.length < 32) {
      setError("Masukkan kode pesanan dan kode akses privat dari halaman checkout.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/jajan-yuk/orders/${encodeURIComponent(orderCode.trim())}?token=${encodeURIComponent(accessToken.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Pesanan tidak ditemukan.");
      setOrder(data);
      setCode(data.order_code);
      setLocation(`/jajan-yuk/lacak?code=${encodeURIComponent(data.order_code)}&token=${encodeURIComponent(accessToken.trim())}`);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || "Gagal memuat pelacakan.");
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void findOrder();
  }

  async function startPayment() {
    if (!order || !token || paying || order.total_amount == null) return;
    setPaying(true);
    setError("");
    try {
      await loadSnap();
      const response = await fetch(`/api/jajan-yuk/orders/${order.order_code}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracking_token: token }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Pembayaran belum dapat dimulai.");
      (window as any).snap.pay(data.snap_token, {
        onSuccess: () => { setPaying(false); window.setTimeout(() => void findOrder(), 800); },
        onPending: () => { setPaying(false); window.setTimeout(() => void findOrder(), 800); },
        onError: () => { setPaying(false); setError("Pembayaran gagal. Kamu dapat mencoba lagi."); },
        onClose: () => setPaying(false),
      });
    } catch (err: any) {
      setError(err.message || "Pembayaran belum dapat dimulai.");
      setPaying(false);
    }
  }

  async function startManualPayment() {
    if (!order || !token || manualPaying || order.total_amount == null) return;
    setManualPaying(true);
    setError("");
    try {
      const response = await fetch(`/api/jajan-yuk/orders/${order.order_code}/manual-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracking_token: token }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Pembayaran manual belum dapat dipilih.");
      if (data.methods) setMethods(data.methods);
      await findOrder();
      const target = data.methods?.whatsapp_url || methods?.whatsapp_url;
      if (target) {
        const text = `Halo Nempo, saya sudah transfer pembayaran Jajan YUK.\nKode pesanan: ${order.order_code}\nTotal: ${formatRupiah(order.total_amount)}\nSaya akan mengirim bukti transfer di chat ini.`;
        window.open(`${target}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
      }
    } catch (err: any) {
      setError(err.message || "Pembayaran manual belum dapat dipilih.");
    } finally {
      setManualPaying(false);
    }
  }

  const currentIndex = order ? steps.findIndex(([value]) => value === order.order_status) : -1;
  const paymentAvailable = order ? ["pending_confirmation", "confirmed"].includes(order.order_status) : false;

  return (
    <Layout>
      <SEO title="Lacak Pesanan Jajan YUK" description="Lacak pesanan kuliner Jajan YUK dengan kode pesanan dan kode akses privat." noIndex />
      <main className="min-h-screen bg-[#fffaf5] px-4 pb-24 pt-6 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <Link href="/jajan-yuk" className="inline-flex items-center gap-2 rounded-full border border-[#eedfd2] bg-white px-3.5 py-2 text-xs font-black text-[#775b47]">
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Jajan YUK
          </Link>
          <div className="mt-5 rounded-[1.75rem] bg-[#3e2117] p-6 text-[#fff8f0] shadow-[0_18px_42px_rgba(102,50,18,0.16)] sm:p-8">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-400/20 text-orange-200"><Search className="h-5 w-5" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-200">Jajan YUK</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Lacak pesananmu</h1>
                <p className="mt-2 max-w-lg text-xs leading-relaxed text-[#e8cdb8]">Gunakan kode pesanan dan kode akses privat yang diberikan setelah checkout. Status diperbarui oleh tim Nempo.</p>
              </div>
            </div>
            <form onSubmit={submit} className="mt-6 space-y-3">
              <label className="block"><span className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-orange-100">Kode pesanan</span><input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="Masukkan kode pesanan" autoComplete="off" className="w-full rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 font-mono text-sm text-white outline-none placeholder:text-orange-100/60 focus:border-orange-300" /></label>
              <label className="block"><span className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-orange-100">Kode akses privat</span><input value={token} onChange={(event) => setToken(event.target.value)} placeholder="Kode dari halaman konfirmasi pesanan" autoComplete="off" className="w-full rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 text-sm text-white outline-none placeholder:text-orange-100/60 focus:border-orange-300" /></label>
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-black text-white shadow-lg shadow-black/10 disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} {loading ? "Mencari pesanan…" : "Lacak pesanan"}</button>
            </form>
            {error && <p className="mt-3 rounded-xl bg-red-500/15 p-3 text-xs font-bold text-red-100">{error}</p>}
          </div>

          {order && (
            <section className="mt-5 rounded-[1.5rem] border border-[#eadfd5] bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#f0e7df] pb-4">
                <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-600">Pesanan ditemukan</p><h2 className="mt-1 font-mono text-lg font-black text-[#2e211b]">{order.order_code}</h2><p className="mt-1 text-xs text-[#806f63]">{order.merchant_name} · {order.delivery_area}</p></div>
                <span className="rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-black text-orange-700">{statusLabels[order.order_status] || order.order_status}</span>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1fr)_15rem]">
                <ol className="space-y-0">
                  {steps.map(([status, label], index) => {
                    const complete = index <= currentIndex && order.order_status !== "rejected";
                    return <li key={status} className="relative flex gap-3 pb-4 last:pb-0">{index < steps.length - 1 && <span className={`absolute bottom-0 left-[11px] top-6 w-px ${index < currentIndex ? "bg-orange-300" : "bg-[#eee6df]"}`} />}<span className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${complete ? "bg-orange-500 text-white" : "border border-[#e7d9cc] text-[#b6a69a]"}`}>{complete ? "✓" : index + 1}</span><p className={`pt-1 text-xs font-black ${complete ? "text-[#2e211b]" : "text-[#9a887b]"}`}>{label}</p></li>;
                  })}
                </ol>
                <div className="space-y-3">
                   <div className="rounded-2xl bg-[#fffaf5] p-4"><p className="text-[10px] font-black uppercase tracking-wide text-[#9a887b]">Ringkasan</p>{order.items.map((item) => <div key={item.id} className="mt-2 flex justify-between gap-2 text-xs"><span className="text-[#806f63]">{item.quantity} × {item.item_name}</span><span className="font-bold text-[#2e211b]">{formatRupiah(item.line_total)}</span></div>)}<div className="mt-3 border-t border-dashed border-[#eadfd5] pt-2 text-xs"><div className="flex justify-between text-[#806f63]"><span>Subtotal</span><span>{formatRupiah(order.subtotal)}</span></div>{order.service_fee > 0 && <div className="mt-1 flex justify-between text-[#806f63]"><span>Biaya layanan</span><span>{formatRupiah(order.service_fee)}</span></div>}<div className="mt-1 flex justify-between text-[#806f63]"><span>Ongkir</span><span>{order.delivery_fee == null ? "Menunggu" : formatRupiah(order.delivery_fee)}</span></div>{order.delivery_discount > 0 && <div className="mt-1 flex justify-between text-emerald-700"><span>{order.delivery_fee != null && order.delivery_discount >= order.delivery_fee ? "Gratis ongkir" : "Diskon ongkir"}</span><span>-{formatRupiah(order.delivery_discount)}</span></div>}{order.voucher_discount > 0 && <div className="mt-1 flex justify-between text-emerald-700"><span>Voucher{order.voucher_code ? ` · ${order.voucher_code}` : ""}</span><span>-{formatRupiah(order.voucher_discount)}</span></div>}<div className="mt-2 flex justify-between font-black text-[#2e211b]"><span>Total</span><span>{order.total_amount == null ? "Menunggu" : formatRupiah(order.total_amount)}</span></div></div></div>
                    {paymentAvailable && order.total_amount != null && order.payment_status !== "paid" && (
                     <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                       <p className="text-[10px] font-black uppercase tracking-wide text-orange-700">Pembayaran</p>
                        {order.order_status === "pending_confirmation" && <p className="mt-2 rounded-xl bg-orange-100/70 p-3 text-[11px] leading-relaxed text-orange-900">Pembayaran bisa dilakukan sekarang. Pesanan tetap menunggu konfirmasi merchant sebelum disiapkan.</p>}
                       {order.payment_type === "manual_transfer" && order.payment_status === "pending" ? (
                         <div className="mt-2 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-800">Menunggu verifikasi pembayaran manual. Pesanan diproses setelah bukti transfer diperiksa.</div>
                       ) : (
                         <div className="mt-2 space-y-2">
                            <button type="button" onClick={() => void startPayment()} disabled={paying || order.payment_status === "pending"} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-3 py-3 text-xs font-black text-white disabled:opacity-50"><WalletCards className="h-4 w-4" /> {paying ? "Menyiapkan pembayaran…" : `Bayar sekarang ${formatRupiah(order.total_amount)}`}</button>
                           <p className="text-center text-[10px] text-orange-900/70">Atau bayar manual melalui transfer / QRIS.</p>
                         </div>
                       )}
                       {(methods?.bank_name || methods?.bank_account_no || methods?.bank_account_name || methods?.qris_image) && (
                         <div className="mt-3 space-y-1 rounded-xl bg-white p-3 text-[11px] text-[#59483c]">
                           {methods.bank_name && <p>Bank: <strong>{methods.bank_name}</strong></p>}
                           {methods.bank_account_no && <p>No. rekening: <strong>{methods.bank_account_no}</strong></p>}
                           {methods.bank_account_name && <p>Atas nama: <strong>{methods.bank_account_name}</strong></p>}
                           {methods.qris_image && <img src={methods.qris_image} alt="QRIS pembayaran manual" className="mx-auto mt-2 max-h-48 w-auto rounded-lg border border-orange-100 object-contain" />}
                         </div>
                       )}
                       {order.payment_type !== "manual_transfer" || order.payment_status !== "pending" ? (
                         <button type="button" onClick={() => void startManualPayment()} disabled={manualPaying || !methods?.whatsapp_url} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-white px-3 py-3 text-xs font-black text-emerald-700 disabled:opacity-50"><MessageCircle className="h-4 w-4" /> {manualPaying ? "Menyiapkan WhatsApp…" : methods?.whatsapp_url ? "Saya sudah transfer, kirim bukti" : "WhatsApp pembayaran belum diatur"}</button>
                       ) : methods?.whatsapp_url ? (
                         <a href={`${methods.whatsapp_url}?text=${encodeURIComponent(`Halo Nempo, saya ingin mengirim bukti pembayaran ${order.order_code}.`)}`} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-xs font-black text-white"><MessageCircle className="h-4 w-4" /> Kirim bukti via WhatsApp</a>
                       ) : null}
                       <p className="mt-2 text-[10px] leading-relaxed text-orange-900/70">Menekan tombol WhatsApp belum dianggap lunas. Admin akan memverifikasi pembayaran terlebih dahulu.</p>
                     </div>
                   )}
                   {order.payment_status === "paid" && <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> Pembayaran diterima</div>}
                  {order.driver_name && <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4"><p className="text-[10px] font-black uppercase tracking-wide text-blue-700">Driver</p><p className="mt-2 text-sm font-black text-blue-950">{order.driver_name}</p><p className="mt-1 text-xs text-blue-800">{[order.driver_vehicle, order.driver_plate].filter(Boolean).join(" · ")}</p>{order.driver_phone && <p className="mt-1 text-xs text-blue-800">{order.driver_phone}</p>}</div>}
                   {mapsUrl(order.delivery_latitude, order.delivery_longitude) && <div className="overflow-hidden rounded-2xl border border-orange-100 bg-orange-50"><div className="h-32 bg-[#f5eee8]"><iframe title="Titik lokasi pengantaran" src={mapPreviewUrl(order.delivery_latitude!, order.delivery_longitude!)} className="h-full w-full border-0" loading="lazy" /></div><a href={mapsUrl(order.delivery_latitude, order.delivery_longitude)!} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-2 px-4 py-3 text-xs font-black text-orange-700 hover:bg-orange-100"><span className="inline-flex items-center gap-2"><MapPinned className="h-4 w-4" /> Buka titik di Maps</span><ArrowRight className="h-3.5 w-3.5" /></a></div>}
                </div>
              </div>
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-[10px] leading-relaxed text-blue-900"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />Kode akses ini tidak disimpan oleh server dalam bentuk asli. Simpan tautan halaman ini untuk membuka pelacakan kembali.</div>
            </section>
          )}
          <p className="mt-5 text-center text-[11px] text-[#a08e82]">Jangan bagikan kode akses privat kepada orang lain.</p>
        </div>
      </main>
    </Layout>
  );
}