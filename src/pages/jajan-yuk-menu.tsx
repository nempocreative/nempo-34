import { useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { Link, useRoute } from "@/lib/wouter";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Info,
  Leaf,
  Loader2,
  MapPin,
  MapPinned,
  MessageCircle,
  Minus,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Tag,
  UtensilsCrossed,
  WalletCards,
  X,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  option_groups: OptionGroup[];
};

type OptionGroup = {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  options: Array<{ id: string; name: string; price: number }>;
};

type SelectedOptionGroup = {
  group_id: string;
  group_name: string;
  choices: Array<{ id: string; name: string; price: number }>;
};

type CartLine = MenuItem & {
  cart_key: string;
  quantity: number;
  selected_option_ids: Record<string, string[]>;
  selected_options: SelectedOptionGroup[];
  unit_price: number;
};

type Merchant = {
  id: number;
  slug: string;
  name: string;
  category: string;
  image?: string | null;
  location: string;
  description: string;
  hours: string | null;
  menu: MenuItem[];
};

type Order = {
  order_code: string;
  merchant_name: string;
  customer_name: string;
  customer_phone: string;
  delivery_area: string;
  delivery_address: string;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  customer_note: string | null;
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
  confirmed_at: string | null;
  paid_at: string | null;
  delivered_at: string | null;
  items: Array<{
    id: number;
    item_name: string;
    unit_price: number;
    quantity: number;
    line_total: number;
    selected_options: SelectedOptionGroup[];
  }>;
};

type ManualPaymentMethods = {
  delivery_fee: number | null;
  delivery_discount: number;
  service_fee_percent: number;
  whatsapp: string | null;
  whatsapp_url: string | null;
  bank_name: string | null;
  bank_account_no: string | null;
  bank_account_name: string | null;
  qris_image: string | null;
};

type CheckoutVoucher = {
  id: number;
  title: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_purchase: number;
  applicable_type: string | null;
  description: string | null;
  expiry_date: string | null;
};

type SavedAccess = { code: string; token: string };

type AddressSuggestion = {
  id: string;
  display_name: string;
  latitude: number;
  longitude: number;
  type: string;
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

const JAJAN_YUK_DELIVERY_AREA = "Garut Kota";
const JAJAN_YUK_DELIVERY_FEE = 9000;

const STATUS_LABELS: Record<string, string> = {
  pending_confirmation: "Menunggu konfirmasi",
  confirmed: "Menunggu pembayaran",
  preparing: "Sedang disiapkan",
  driver_assigned: "Driver ditugaskan",
  picked_up: "Pesanan diambil driver",
  on_the_way: "Dalam perjalanan",
  delivered: "Pesanan selesai",
  rejected: "Pesanan ditolak",
};

const STATUS_STEPS = [
  ["pending_confirmation", "Pesanan diterima"],
  ["confirmed", "Pesanan dikonfirmasi"],
  ["preparing", "Merchant menyiapkan pesanan"],
  ["driver_assigned", "Driver ditugaskan"],
  ["picked_up", "Pesanan diambil driver"],
  ["on_the_way", "Dalam perjalanan"],
  ["delivered", "Pesanan sampai"],
] as const;

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

function mapsUrl(latitude: number | null | undefined, longitude: number | null | undefined) {
  if (latitude == null || longitude == null) return null;
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

function mapPreviewUrl(latitude: number, longitude: number) {
  const padding = 0.0025;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - padding}%2C${latitude - padding}%2C${longitude + padding}%2C${latitude + padding}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

function mapPreviewUrlAtCenter(latitude: number, longitude: number, center: Coordinate) {
  const padding = 0.0025;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${center.longitude - padding}%2C${center.latitude - padding}%2C${center.longitude + padding}%2C${center.latitude + padding}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function DeliveryLocationMap({
  coordinate,
  mapCenter,
  onChange,
}: {
  coordinate: Coordinate;
  mapCenter: Coordinate;
  onChange: (coordinate: Coordinate) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  function updateFromPointer(event: Pick<PointerEvent<HTMLElement>, "clientX" | "clientY">) {
    const bounds = mapRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
    const padding = 0.0025;
    onChange({
      longitude: Number((mapCenter.longitude - padding + x * padding * 2).toFixed(7)),
      latitude: Number((mapCenter.latitude + padding - y * padding * 2).toFixed(7)),
    });
  }

  const padding = 0.0025;
  const markerLeft = clamp(((coordinate.longitude - (mapCenter.longitude - padding)) / (padding * 2)) * 100, 3, 97);
  const markerTop = clamp(((mapCenter.latitude + padding - coordinate.latitude) / (padding * 2)) * 100, 7, 88);

  return (
    <div
      ref={mapRef}
      className={`relative h-48 overflow-hidden bg-[#e9eee8] sm:h-56 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      onPointerMove={(event) => {
        if (dragging) updateFromPointer(event);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <iframe
        title="Peta lokasi pengantaran"
        src={mapPreviewUrlAtCenter(coordinate.latitude, coordinate.longitude, mapCenter)}
        className="pointer-events-none h-full w-full border-0"
        loading="lazy"
      />
      <div
        className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl bg-[#2e211b]/85 px-3 py-2 text-center text-[10px] font-bold text-white shadow-lg backdrop-blur-sm"
        aria-hidden="true"
      >
        Geser pin untuk menyesuaikan titik rumah
      </div>
      <button
        type="button"
        aria-label="Geser pin lokasi pengantaran"
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
          updateFromPointer(event);
        }}
        className="absolute z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_5px_14px_rgba(194,78,12,0.4)] ring-4 ring-white/80 transition-transform active:scale-110"
        style={{ left: `${markerLeft}%`, top: `${markerTop}%` }}
      >
        <MapPin className="h-5 w-5 fill-current" />
      </button>
    </div>
  );
}

function distanceInKm(from: Coordinate, to: Coordinate) {
  const earthRadiusKm = 6371;
  const latitudeDelta = ((to.latitude - from.latitude) * Math.PI) / 180;
  const longitudeDelta = ((to.longitude - from.longitude) * Math.PI) / 180;
  const latitude1 = (from.latitude * Math.PI) / 180;
  const latitude2 = (to.latitude * Math.PI) / 180;
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.sin(longitudeDelta / 2) ** 2 * Math.cos(latitude1) * Math.cos(latitude2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function formatDistance(distanceKm: number) {
  if (distanceKm < 0.025) return "0 m";
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000 / 50) * 50} m`;
  return `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;
}

function saveAccess(access: SavedAccess) {
  try {
    const current = JSON.parse(localStorage.getItem("jajan_yuk_order_access") || "[]");
    const next = [
      access,
      ...current.filter((item: SavedAccess) => item.code !== access.code),
    ].slice(0, 10);
    localStorage.setItem("jajan_yuk_order_access", JSON.stringify(next));
  } catch {
    // Local storage is only a convenience; the access link remains usable.
  }
}

function getStatusIndex(status: string) {
  const index = STATUS_STEPS.findIndex(([value]) => value === status);
  return index < 0 ? 0 : index;
}

function useSnapScript() {
  const [ready, setReady] = useState(Boolean((window as any).snap));
  const [error, setError] = useState("");

  useEffect(() => {
    if ((window as any).snap) {
      setReady(true);
      return;
    }
    let cancelled = false;
    const existing = document.getElementById("midtrans-snap-script");
    if (existing) {
      const startedAt = Date.now();
      const timer = window.setInterval(() => {
        if ((window as any).snap) {
          window.clearInterval(timer);
          if (!cancelled) {
            setReady(true);
            setError("");
          }
        } else if (Date.now() - startedAt >= 15000) {
          window.clearInterval(timer);
          if (!cancelled) setError("Midtrans belum bisa dimuat. Coba muat ulang halaman.");
        }
      }, 200);
      return () => {
        cancelled = true;
        window.clearInterval(timer);
      };
    }
    fetch("/api/payments/client-key")
      .then(async (response) => {
        if (!response.ok) throw new Error("Konfigurasi pembayaran belum tersedia.");
        return response.json();
      })
      .then((config) => {
        if (!config?.clientKey) {
          throw new Error("Pembayaran Midtrans belum diaktifkan oleh admin.");
        }
        if (cancelled) return;
        const script = document.createElement("script");
        script.id = "midtrans-snap-script";
        script.src = config.isProduction
          ? "https://app.midtrans.com/snap/snap.js"
          : "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", config.clientKey);
        script.onload = () => {
          if (!cancelled) {
            setReady(true);
            setError("");
          }
        };
        script.onerror = () => {
          if (!cancelled) setError("Midtrans gagal dimuat. Periksa koneksi lalu coba lagi.");
        };
        document.head.appendChild(script);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || "Konfigurasi pembayaran belum tersedia.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { ready, error };
}

function OrderTracking({
  order,
  trackingHref,
  onRefresh,
  onPay,
  onManualPayment,
  paying,
  manualPaying,
  snapReady,
  snapError,
  manualPaymentMethods,
}: {
  order: Order;
  trackingHref: string;
  onRefresh: () => void;
  onPay: () => void;
  onManualPayment: () => void;
  paying: boolean;
  manualPaying: boolean;
  snapReady: boolean;
  snapError: string;
  manualPaymentMethods: ManualPaymentMethods | null;
}) {
  const currentIndex = getStatusIndex(order.order_status);
  const paymentAvailable = ["pending_confirmation", "confirmed"].includes(order.order_status);
  const paymentPending = order.payment_status === "pending";
  const manualPending = paymentPending && order.payment_type === "manual_transfer";
  const gatewayPending = paymentPending && !manualPending;
  const manualWhatsappUrl = manualPaymentMethods?.whatsapp_url
    ? `${manualPaymentMethods.whatsapp_url}?text=${encodeURIComponent(`Halo Nempo, saya sudah transfer pembayaran Jajan YUK.\nKode pesanan: ${order.order_code}\nTotal: ${order.total_amount == null ? "-" : formatRupiah(order.total_amount)}\nSaya akan mengirim bukti transfer di chat ini.`)}`
    : null;
  return (
    <section className="mt-5 rounded-[1.5rem] border border-[#eadfd5] bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#f0e7df] pb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-600">
            Pesanan tersimpan
          </p>
          <h2 className="mt-1 font-mono text-lg font-black text-[#2e211b]">
            {order.order_code}
          </h2>
          <p className="mt-1 text-xs text-[#806f63]">
            {order.merchant_name} · dibuat{" "}
            {new Date(order.created_at).toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-black text-orange-700">
            {STATUS_LABELS[order.order_status] || order.order_status}
          </span>
          <Link
            href={trackingHref}
            className="hidden rounded-full border border-[#eadfd5] px-3 py-1.5 text-[10px] font-black text-[#806f63] hover:bg-orange-50 hover:text-orange-700 sm:inline-flex"
          >
            Buka halaman lacak
          </Link>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-full border border-[#eadfd5] p-2 text-[#806f63] hover:bg-orange-50 hover:text-orange-700"
            aria-label="Perbarui status pesanan"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wide text-orange-700">Simpan akses pesanan</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#806f63]">
            Gunakan halaman lacak untuk membayar setelah pesanan dikonfirmasi dan melihat status pengantaran.
          </p>
        </div>
        <Link
          href={trackingHref}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2.5 text-[10px] font-black text-white hover:bg-orange-600"
        >
          Lacak pesanan <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <ol className="space-y-0">
            {STATUS_STEPS.map(([status, label], index) => {
              const complete = index <= currentIndex && order.order_status !== "rejected";
              const current = index === currentIndex && order.order_status !== "rejected";
              return (
                <li key={status} className="relative flex gap-3 pb-4 last:pb-0">
                  {index < STATUS_STEPS.length - 1 && (
                    <span
                      className={`absolute bottom-0 left-[11px] top-6 w-px ${
                        index < currentIndex ? "bg-orange-300" : "bg-[#eee6df]"
                      }`}
                    />
                  )}
                  <span
                    className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      complete
                        ? "bg-orange-500 text-white"
                        : "border border-[#e7d9cc] bg-white text-[#b6a69a]"
                    }`}
                  >
                    {complete ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="text-[10px] font-black">{index + 1}</span>}
                  </span>
                  <div className="pt-0.5">
                    <p className={`text-xs font-black ${current ? "text-orange-700" : "text-[#2e211b]"}`}>
                      {label}
                    </p>
                    {current && (
                      <p className="mt-0.5 text-[10px] text-[#806f63]">
                        Status akan diperbarui oleh tim Nempo.
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          {order.order_status === "rejected" && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">
              Pesanan ini tidak dapat diproses. Hubungi tim Nempo jika perlu bantuan.
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl bg-[#fffaf5] p-4">
            <p className="text-[10px] font-black uppercase tracking-wide text-[#9a887b]">Ringkasan</p>
            <div className="mt-3 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-xs">
                  <span className="min-w-0 text-[#806f63]">
                    {item.quantity} × {item.item_name}
                    {item.selected_options?.map((group) => (
                      <span key={group.group_id} className="mt-1 block text-[10px] text-[#9a887b]">
                        {group.group_name}: {group.choices.map((choice) => choice.name).join(", ")}
                      </span>
                    ))}
                  </span>
                  <span className="shrink-0 font-bold text-[#2e211b]">{formatRupiah(item.line_total)}</span>
                </div>
              ))}
              <div className="border-t border-dashed border-[#eadfd5] pt-2 text-xs">
                <div className="flex justify-between text-[#806f63]">
                  <span>Subtotal</span><span>{formatRupiah(order.subtotal)}</span>
                </div>
                {order.service_fee > 0 && (
                  <div className="mt-1 flex justify-between text-[#806f63]">
                    <span>Biaya layanan</span><span>{formatRupiah(order.service_fee)}</span>
                  </div>
                )}
                <div className="mt-1 flex justify-between text-[#806f63]">
                  <span>Ongkir</span><span>{order.delivery_fee == null ? "Menunggu" : formatRupiah(order.delivery_fee)}</span>
                </div>
                {order.delivery_discount > 0 && (
                  <div className="mt-1 flex justify-between text-emerald-700">
                    <span>Diskon ongkir</span><span>-{formatRupiah(order.delivery_discount)}</span>
                  </div>
                )}
                {order.voucher_discount > 0 && (
                  <div className="mt-1 flex justify-between text-emerald-700">
                    <span>Voucher{order.voucher_code ? ` · ${order.voucher_code}` : ""}</span><span>-{formatRupiah(order.voucher_discount)}</span>
                  </div>
                )}
                <div className="mt-2 flex justify-between font-black text-[#2e211b]">
                  <span>Total</span><span>{order.total_amount == null ? "Menunggu konfirmasi" : formatRupiah(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
          {order.driver_name && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-blue-700">Driver</p>
              <p className="mt-2 text-sm font-black text-blue-950">{order.driver_name}</p>
              <p className="mt-1 text-xs text-blue-800">
                {[order.driver_vehicle, order.driver_plate].filter(Boolean).join(" · ")}
              </p>
              {order.driver_phone && <p className="mt-1 text-xs text-blue-800">{order.driver_phone}</p>}
            </div>
          )}
          {mapsUrl(order.delivery_latitude, order.delivery_longitude) && (
            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-orange-50">
              <div className="h-32 bg-[#f5eee8]">
                <iframe
                  title="Titik lokasi pengantaran"
                  src={mapPreviewUrl(order.delivery_latitude!, order.delivery_longitude!)}
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              </div>
              <a
                href={mapsUrl(order.delivery_latitude, order.delivery_longitude)!}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 px-4 py-3 text-xs font-black text-orange-700 hover:bg-orange-100"
              >
                <span className="inline-flex items-center gap-2"><MapPinned className="h-4 w-4" /> Buka titik pengantaran di Maps</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
          {paymentAvailable && order.total_amount != null && order.payment_status !== "paid" && (
            <div className="space-y-3">
              {order.order_status === "pending_confirmation" && (
                <div className="rounded-xl border border-orange-100 bg-orange-50/70 p-3 text-[11px] leading-relaxed text-orange-900">
                  Pembayaran bisa dilakukan sekarang. Pesanan tetap menunggu konfirmasi merchant sebelum disiapkan.
                </div>
              )}
              {!manualPending && (
                <>
                  <button
                    type="button"
                    onClick={onPay}
                    disabled={paying || !snapReady || paymentPending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-xs font-black text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <WalletCards className="h-4 w-4" />
                    {paying
                      ? "Menyiapkan pembayaran…"
                      : paymentPending
                        ? "Menunggu pembayaran…"
                        : snapError
                          ? "Pembayaran online belum tersedia"
                          : !snapReady
                            ? "Memuat pembayaran…"
                            : `Bayar sekarang ${formatRupiah(order.total_amount)}`}
                  </button>
                  {snapError && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-[11px] leading-relaxed text-red-700">
                      {snapError} Silakan pilih transfer/QRIS manual jika opsi tersebut tersedia.
                    </div>
                  )}
                </>
              )}
              {gatewayPending && (
                <div className="rounded-xl bg-amber-50 p-3 text-[11px] font-bold leading-relaxed text-amber-800">
                  Pembayaran Midtrans sedang menunggu penyelesaian. Selesaikan atau tunggu hasilnya sebelum memilih pembayaran manual.
                </div>
              )}
              {!gatewayPending && <div className={`rounded-2xl border p-4 ${manualPending ? "border-amber-200 bg-amber-50" : "border-[#eadfd5] bg-[#fffaf5]"}`}>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-[#2e211b]">Bayar manual via transfer / QRIS</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-[#806f63]">
                      {manualPending
                        ? "Menunggu tim memeriksa bukti pembayaran. Pesanan diproses setelah pembayaran diverifikasi."
                        : "Transfer sesuai total, lalu kirim bukti pembayaran melalui WhatsApp. Menekan tombol belum dianggap lunas."}
                    </p>
                  </div>
                </div>
                {(manualPaymentMethods?.bank_name || manualPaymentMethods?.bank_account_no || manualPaymentMethods?.qris_image) && (
                  <div className="mt-3 space-y-2 rounded-xl bg-white p-3 text-[11px] text-[#59483c]">
                    {manualPaymentMethods.bank_name && <p><span className="text-[#9a887b]">Bank:</span> <strong>{manualPaymentMethods.bank_name}</strong></p>}
                    {manualPaymentMethods.bank_account_no && <p><span className="text-[#9a887b]">No. rekening:</span> <strong>{manualPaymentMethods.bank_account_no}</strong></p>}
                    {manualPaymentMethods.bank_account_name && <p><span className="text-[#9a887b]">Atas nama:</span> <strong>{manualPaymentMethods.bank_account_name}</strong></p>}
                    {manualPaymentMethods.qris_image && (
                      <img src={manualPaymentMethods.qris_image} alt="QRIS pembayaran manual" className="mx-auto mt-2 max-h-52 w-auto rounded-lg border border-[#eee6df] object-contain" />
                    )}
                  </div>
                )}
                {manualPending ? (
                  manualWhatsappUrl && (
                    <a href={manualWhatsappUrl} target="_blank" rel="noreferrer" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#19a765] px-4 py-3 text-xs font-black text-white hover:bg-[#12894f]">
                      <MessageCircle className="h-4 w-4" /> Kirim / cek bukti di WhatsApp
                    </a>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={onManualPayment}
                    disabled={manualPaying || !manualPaymentMethods?.whatsapp_url}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#19a765] bg-white px-4 py-3 text-xs font-black text-[#13864e] hover:bg-[#effaf3] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <MessageCircle className="h-4 w-4" /> {manualPaying ? "Menyiapkan WhatsApp…" : manualPaymentMethods?.whatsapp_url ? "Saya sudah transfer, kirim bukti" : "WhatsApp pembayaran belum diatur"}
                  </button>
                )}
                {!manualPaymentMethods?.whatsapp_url && !manualPending && (
                  <p className="mt-3 text-[10px] font-semibold leading-relaxed text-amber-700">
                    Transfer/QRIS manual belum diatur oleh admin.
                  </p>
                )}
              </div>}
            </div>
          )}
          {order.payment_status === "paid" && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4" /> Pembayaran diterima
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function JajanYukMenuPage() {
  const [, routeParams] = useRoute("/jajan-yuk/menu/:slug");
  const slug = routeParams?.slug || "";
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [optionItem, setOptionItem] = useState<MenuItem | null>(null);
  const [selectedOptionIds, setSelectedOptionIds] = useState<Record<string, string[]>>({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [trackingToken, setTrackingToken] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryLatitude, setDeliveryLatitude] = useState<number | null>(null);
  const [deliveryLongitude, setDeliveryLongitude] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [locationMapCenter, setLocationMapCenter] = useState<Coordinate | null>(null);
  const [locating, setLocating] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [addressSearchError, setAddressSearchError] = useState("");
  const addressSelectionRef = useRef(false);
  const [customerNote, setCustomerNote] = useState("");
  const [ecoContribution, setEcoContribution] = useState(false);
  const [requestCutlery, setRequestCutlery] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [manualPaying, setManualPaying] = useState(false);
  const [manualPaymentMethods, setManualPaymentMethods] = useState<ManualPaymentMethods | null>(null);
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; title: string; discount: number } | null>(null);
  const [activeVouchers, setActiveVouchers] = useState<CheckoutVoucher[]>([]);
  const [vouchersLoading, setVouchersLoading] = useState(false);
  const [voucherError, setVoucherError] = useState("");
  const [voucherApplying, setVoucherApplying] = useState(false);
  const { ready: snapReady, error: snapError } = useSnapScript();

  useEffect(() => {
    fetch("/api/jajan-yuk/payment-methods")
      .then(async (response) => {
        if (!response.ok) throw new Error("Metode pembayaran belum tersedia.");
        return response.json();
      })
      .then((data) => {
        setManualPaymentMethods(data);
      })
      .catch(() => setManualPaymentMethods(null));
  }, [checkoutOpen]);

  useEffect(() => {
    if (!checkoutOpen || !merchant) {
      setActiveVouchers([]);
      setVouchersLoading(false);
      return;
    }

    const controller = new AbortController();
    setVouchersLoading(true);
    fetch(`/api/vouchers/campaign/jajan-yuk?kuliner_id=${merchant.id}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Voucher belum tersedia.");
        const data = await response.json();
        return Array.isArray(data) ? data as CheckoutVoucher[] : [];
      })
      .then((data) => setActiveVouchers(data))
      .catch((error: any) => {
        if (error?.name !== "AbortError") setActiveVouchers([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setVouchersLoading(false);
      });

    return () => controller.abort();
  }, [checkoutOpen, merchant?.id]);

  useEffect(() => {
    if (!checkoutOpen) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setCheckoutOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [checkoutOpen]);

  useEffect(() => {
    if (!checkoutOpen || deliveryAddress.trim().length < 3) {
      setAddressSuggestions([]);
      setSearchingAddress(false);
      return;
    }
    if (addressSelectionRef.current) {
      addressSelectionRef.current = false;
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearchingAddress(true);
      setAddressSearchError("");
      try {
        const response = await fetch(`/api/jajan-yuk/geocode?q=${encodeURIComponent(deliveryAddress.trim())}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Pencarian alamat sedang bermasalah.");
        const data = await response.json();
        setAddressSuggestions(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setAddressSuggestions([]);
          setAddressSearchError("Rekomendasi alamat belum tersedia. Alamat tetap bisa ditulis manual.");
        }
      } finally {
        if (!controller.signal.aborted) setSearchingAddress(false);
      }
    }, 1000);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [checkoutOpen, deliveryAddress]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/jajan-yuk/merchants/${encodeURIComponent(slug)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Menu belum tersedia.");
        return data as Merchant;
      })
      .then((data) => {
        if (!cancelled) setMerchant(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const cartItems = cartLines;
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const deliveryDiscount = manualPaymentMethods?.delivery_discount || 0;
  const serviceFeePercent = manualPaymentMethods?.service_fee_percent ?? 2;
  const serviceFee = Math.round(subtotal * serviceFeePercent / 100);
  const voucherDiscount = appliedVoucher?.discount || 0;
  const estimatedTotal = Math.max(0, subtotal + serviceFee + JAJAN_YUK_DELIVERY_FEE - deliveryDiscount - voucherDiscount);

  useEffect(() => {
    setAppliedVoucher(null);
    setVoucherError("");
  }, [subtotal]);

  function addConfiguredItem(item: MenuItem, selections: Record<string, string[]>) {
    const selectedOptions = item.option_groups.flatMap((group) => {
      const chosen = new Set(selections[group.id] || []);
      const choices = group.options
        .filter((option) => chosen.has(option.id))
        .map(({ id, name, price }) => ({ id, name, price }));
      return choices.length ? [{ group_id: group.id, group_name: group.name, choices }] : [];
    });
    const optionPrice = selectedOptions.reduce(
      (sum, group) => sum + group.choices.reduce((groupSum, choice) => groupSum + choice.price, 0),
      0,
    );
    const cartKey = `${item.id}:${item.option_groups.map((group) => (
      `${group.id}=${(selections[group.id] || []).slice().sort().join(",")}`
    )).join(";")}`;
    setCartLines((current) => {
      const itemCount = current
        .filter((line) => line.id === item.id)
        .reduce((sum, line) => sum + line.quantity, 0);
      if (itemCount >= 30) return current;
      const existing = current.find((line) => line.cart_key === cartKey);
      if (existing) {
        return current.map((line) => line.cart_key === cartKey
          ? { ...line, quantity: Math.min(30, line.quantity + 1) }
          : line);
      }
      return [
        ...current,
        {
          ...item,
          cart_key: cartKey,
          quantity: 1,
          selected_option_ids: selections,
          selected_options: selectedOptions,
          unit_price: item.price + optionPrice,
        },
      ];
    });
    setOptionItem(null);
    setSelectedOptionIds({});
  }

  function addMenuItem(item: MenuItem) {
    if (item.option_groups?.length) {
      setOptionItem(item);
      setSelectedOptionIds({});
      return;
    }
    addConfiguredItem(item, {});
  }

  function changeLineQuantity(cartKey: string, delta: number) {
    setCartLines((current) => {
      const target = current.find((line) => line.cart_key === cartKey);
      if (!target) return current;
      const itemCount = current
        .filter((line) => line.id === target.id)
        .reduce((sum, line) => sum + line.quantity, 0);
      if (delta > 0 && itemCount >= 30) return current;
      return current
        .map((line) => line.cart_key === cartKey
          ? { ...line, quantity: Math.max(0, Math.min(30, line.quantity + delta)) }
          : line)
        .filter((line) => line.quantity > 0);
    });
  }

  function changeOptionSelection(group: OptionGroup, optionId: string, checked: boolean) {
    setSelectedOptionIds((current) => {
      const selected = current[group.id] || [];
      const next = group.multiple
        ? checked ? [...selected, optionId] : selected.filter((id) => id !== optionId)
        : checked ? [optionId] : [];
      return { ...current, [group.id]: next };
    });
  }

  const optionItemQuantity = optionItem
    ? cartItems.filter((line) => line.id === optionItem.id).reduce((sum, line) => sum + line.quantity, 0)
    : 0;
  const canAddOptions = Boolean(optionItem && optionItemQuantity < 30 && optionItem.option_groups.every((group) =>
    !group.required || (selectedOptionIds[group.id]?.length || 0) > 0,
  ));
  const configuredPrice = optionItem
    ? optionItem.price + optionItem.option_groups.reduce(
        (sum, group) => sum + group.options
          .filter((option) => (selectedOptionIds[group.id] || []).includes(option.id))
          .reduce((groupSum, option) => groupSum + option.price, 0),
        0,
      )
    : 0;
  const recommendedItems = merchant
    ? merchant.menu.filter((item) => !cartItems.some((line) => line.id === item.id)).slice(0, 4)
    : [];

  async function refreshOrder() {
    if (!order || !trackingToken) return;
    const response = await fetch(`/api/jajan-yuk/orders/${order.order_code}?token=${encodeURIComponent(trackingToken)}`);
    const data = await response.json();
    if (response.ok) setOrder(data);
  }

  useEffect(() => {
    if (!order || !trackingToken || ["delivered", "rejected"].includes(order.order_status)) return;
    const timer = window.setInterval(() => {
      void refreshOrder();
    }, 15000);
    return () => window.clearInterval(timer);
  }, [order?.order_code, order?.order_status, trackingToken]);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!merchant || cartItems.length === 0 || submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/jajan-yuk/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: merchant.id,
          customer_name: customerName,
          customer_phone: customerPhone,
          delivery_address: deliveryAddress,
          delivery_latitude: deliveryLatitude,
          delivery_longitude: deliveryLongitude,
          customer_note: [
            customerNote.trim(),
            requestCutlery ? "Minta alat makan." : "",
            ecoContribution ? "Kontribusi langkah hijau." : "",
          ].filter(Boolean).join(" ") || null,
          voucher_code: appliedVoucher?.code || null,
          items: cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            selected_option_ids: item.selected_option_ids,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Pesanan gagal disimpan.");
      const access = { code: data.order_code, token: data.tracking_token };
      saveAccess(access);
      setTrackingToken(access.token);
      setCheckoutOpen(false);
      setCartLines([]);
      const detailResponse = await fetch(`/api/jajan-yuk/orders/${access.code}?token=${encodeURIComponent(access.token)}`);
      const detail = await detailResponse.json();
      if (detailResponse.ok) setOrder(detail);
      else throw new Error("Pesanan tersimpan, tetapi detailnya belum dapat dimuat.");
    } catch (err: any) {
      setError(err.message || "Pesanan gagal disimpan.");
    } finally {
      setSubmitting(false);
    }
  }

  async function applyVoucher(codeOverride?: string) {
    const code = (codeOverride || voucherInput).trim().toUpperCase();
    if (!code || voucherApplying) return;
    setVoucherApplying(true);
    setVoucherError("");
    try {
      const response = await fetch("/api/vouchers/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, type: "jajan-yuk", amount: subtotal, kuliner_id: merchant?.id }),
      });
      const data = await response.json();
      if (!response.ok || !data.valid || data.voucher?.discount_type === "reward") {
        throw new Error(data.error || "Voucher tidak dapat digunakan untuk Jajan YUK.");
      }
      setAppliedVoucher({
        code: data.voucher.code,
        title: data.voucher.title,
        discount: Math.min(subtotal, Math.max(0, Number(data.discount) || 0)),
      });
      setVoucherInput(data.voucher.code);
    } catch (err: any) {
      setAppliedVoucher(null);
      setVoucherError(err.message || "Voucher tidak dapat digunakan.");
    } finally {
      setVoucherApplying(false);
    }
  }

  function captureDeliveryLocation() {
    if (!navigator.geolocation) {
      setError("Perangkat ini tidak mendukung pengambilan lokasi. Alamat tetap bisa digunakan tanpa titik Maps.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinate = {
          latitude: Number(position.coords.latitude.toFixed(7)),
          longitude: Number(position.coords.longitude.toFixed(7)),
        };
        setCurrentLocation(coordinate);
        setDeliveryLatitude(coordinate.latitude);
        setDeliveryLongitude(coordinate.longitude);
        setLocationMapCenter(coordinate);
        addressSelectionRef.current = true;
        setDeliveryAddress("Lokasi saya saat ini");
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError("Lokasi belum bisa diambil. Izinkan akses lokasi di browser, lalu coba lagi.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  }

  function changeDeliveryAddress(value: string) {
    addressSelectionRef.current = false;
    setDeliveryAddress(value);
    setDeliveryLatitude(null);
    setDeliveryLongitude(null);
    setLocationMapCenter(null);
    setAddressSearchError("");
  }

  function selectAddressSuggestion(suggestion: AddressSuggestion) {
    addressSelectionRef.current = true;
    setDeliveryAddress(suggestion.display_name);
    setDeliveryLatitude(Number(suggestion.latitude.toFixed(7)));
    setDeliveryLongitude(Number(suggestion.longitude.toFixed(7)));
    setLocationMapCenter({
      latitude: Number(suggestion.latitude.toFixed(7)),
      longitude: Number(suggestion.longitude.toFixed(7)),
    });
    setAddressSuggestions([]);
    setAddressSearchError("");
  }

  function startPayment() {
    if (!order || !trackingToken || paying) return;
    setPaying(true);
    fetch(`/api/jajan-yuk/orders/${order.order_code}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tracking_token: trackingToken }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Pembayaran belum dapat dimulai.");
        const snap = (window as any).snap;
        if (!snap) throw new Error("Gateway pembayaran belum siap. Muat ulang halaman.");
        snap.pay(data.snap_token, {
          onSuccess: () => {
            setPaying(false);
            window.setTimeout(refreshOrder, 1000);
          },
          onPending: () => {
            setPaying(false);
            window.setTimeout(refreshOrder, 1000);
          },
          onError: () => {
            setPaying(false);
            setError("Pembayaran gagal. Kamu dapat mencoba lagi.");
          },
          onClose: () => setPaying(false),
        });
      })
      .catch((err: Error) => {
        setError(err.message);
        setPaying(false);
      });
  }

  async function startManualPayment() {
    if (!order || !trackingToken || manualPaying || order.total_amount == null) return;
    setManualPaying(true);
    setError("");
    try {
      const response = await fetch(`/api/jajan-yuk/orders/${order.order_code}/manual-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracking_token: trackingToken }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Pembayaran manual belum dapat dipilih.");
      if (data.methods) setManualPaymentMethods(data.methods);
      await refreshOrder();
      const target = data.methods?.whatsapp_url || manualPaymentMethods?.whatsapp_url;
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

  if (loading) {
    return <Layout><main className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-[#806f63]">Memuat menu…</main></Layout>;
  }
  if (!merchant) {
    return (
      <Layout>
        <SEO title="Menu tidak ditemukan — Jajan YUK" noIndex />
        <main className="mx-auto max-w-3xl px-4 py-24 text-center">
          <UtensilsCrossed className="mx-auto h-10 w-10 text-orange-500" />
          <h1 className="mt-4 text-2xl font-black text-[#2e211b]">Menu belum tersedia</h1>
          <p className="mt-2 text-sm text-[#806f63]">{error || "Merchant ini belum membuka menu di Jajan YUK."}</p>
          <Link href="/jajan-yuk" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Jajan YUK
          </Link>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title={`${merchant.name} — Menu Jajan YUK`} description={`Pesan menu ${merchant.name} dan lacak pengantarannya melalui Jajan YUK.`} path={`/jajan-yuk/menu/${merchant.slug}`} />
      <main className={`min-h-screen bg-[#f7f8f8] pl-4 pr-5 pt-3 sm:px-6 sm:pt-5 ${cartItems.length > 0 ? "pb-40 sm:pb-24" : "pb-20 sm:pb-24"}`}>
        <div className="mx-auto max-w-6xl">
          <Link href="/jajan-yuk" className="inline-flex items-center gap-2 rounded-full border border-[#e6e8e8] bg-white px-3.5 py-2 text-[11px] font-bold text-[#53616b] shadow-sm transition hover:border-orange-200 hover:text-orange-700">
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali
          </Link>
          <section className="mt-3 overflow-hidden rounded-[1.4rem] border border-[#e8e9e7] bg-white shadow-[0_8px_24px_rgba(30,41,51,0.055)] sm:mt-4 sm:rounded-[1.75rem]">
            <div className="p-3 sm:p-7">
              <div className="flex items-start gap-3">
                {merchant.image && (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f3f5f5] sm:h-[4.5rem] sm:w-[4.5rem] sm:rounded-2xl">
                    <img
                      src={merchant.image}
                      alt={`Foto ${merchant.name}`}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {merchant.category && (
                    <span className="inline-flex max-w-full truncate rounded-full bg-orange-50 px-2 py-1 text-[9px] font-black text-orange-700">
                      {merchant.category}
                    </span>
                  )}
                  <h1 className="mt-1 text-[19px] font-black leading-tight tracking-[-0.035em] text-[#252b2e] sm:text-3xl">
                    {merchant.name}
                  </h1>
                </div>
              </div>
              {merchant.description && (
                <p className="mt-2 hidden line-clamp-2 text-xs leading-relaxed text-[#737c81] min-[350px]:block sm:text-sm">
                  {merchant.description}
                </p>
              )}
              <div className="mt-2 flex min-w-0 flex-nowrap items-center gap-2.5 overflow-hidden text-[10px] font-semibold text-[#66737a] sm:mt-3 sm:gap-4 sm:text-xs">
                <span className="inline-flex min-w-0 flex-1 items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                  <span className="truncate">{merchant.location}</span>
                </span>
                {merchant.hours && (
                  <span className="inline-flex shrink-0 items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                    {merchant.hours}
                  </span>
                )}
              </div>
            </div>
          </section>

          {error && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700">
              {error}<button type="button" onClick={() => setError("")}><X className="h-4 w-4" /></button>
            </div>
          )}

          {order && (
             <OrderTracking
               order={order}
               trackingHref={`/jajan-yuk/lacak?code=${encodeURIComponent(order.order_code)}&token=${encodeURIComponent(trackingToken)}`}
               onRefresh={refreshOrder}
               onPay={startPayment}
               onManualPayment={startManualPayment}
               paying={paying}
               manualPaying={manualPaying}
               snapReady={snapReady}
              snapError={snapError}
               manualPaymentMethods={manualPaymentMethods}
             />
          )}

          <div className="mt-5 grid gap-5 sm:mt-7 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black tracking-tight text-[#252b2e] sm:text-xl">Menu</h2>
                <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#727b80] ring-1 ring-[#e8e9e7]">
                  {merchant.menu.length} pilihan
                </span>
              </div>
              <div className="space-y-2.5">
                {merchant.menu.map((item) => {
                  const quantity = cartItems
                    .filter((line) => line.id === item.id)
                    .reduce((sum, line) => sum + line.quantity, 0);
                  const simpleCartKey = `${item.id}:`;
                  return (
                    <article key={item.id} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3 rounded-[1.25rem] border border-[#e8e9e7] bg-white p-3 shadow-[0_5px_16px_rgba(30,41,51,0.045)] transition hover:border-orange-200 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-4 sm:p-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fff2e6] text-orange-600 sm:h-16 sm:w-16">
                        <img
                          src={item.image || "/images/jajan-yuk-garut-food-banner.jpg"}
                          alt={item.image ? item.name : ""}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-[13px] font-black leading-snug text-[#292f32] sm:text-sm">{item.name}</h3>
                        {item.description && (
                          <p className="mt-1 line-clamp-1 text-[10px] leading-relaxed text-[#81898d] sm:line-clamp-2 sm:text-xs">
                            {item.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p className="shrink-0 text-sm font-black text-[#d95f18]">{formatRupiah(item.price)}</p>
                          {item.option_groups?.length ? (
                            <button
                              type="button"
                              onClick={() => {
                                if (optionItem?.id === item.id) {
                                  setOptionItem(null);
                                  setSelectedOptionIds({});
                                } else {
                                  setOptionItem(item);
                                  setSelectedOptionIds({});
                                }
                              }}
                              disabled={quantity >= 30}
                              aria-expanded={optionItem?.id === item.id}
                              className={`inline-flex min-h-8 shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-black transition sm:text-xs ${
                                optionItem?.id === item.id
                                  ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                                  : "bg-[#ed7024] text-white hover:bg-[#d95f18]"
                              }`}
                            >
                              {optionItem?.id === item.id ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                              {optionItem?.id === item.id ? "Tutup pilihan" : quantity ? `Atur pilihan · ${quantity}` : "Pilih topping"}
                            </button>
                          ) : quantity === 0 ? (
                            <button
                              type="button"
                              onClick={() => addMenuItem(item)}
                              disabled={quantity >= 30}
                              className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-full bg-[#ed7024] px-3 py-1.5 text-[10px] font-black text-white transition hover:bg-[#d95f18] sm:text-xs"
                            >
                              <Plus className="h-3.5 w-3.5" /> Tambah
                            </button>
                          ) : (
                            <div className="flex shrink-0 items-center gap-1 rounded-full border border-orange-100 bg-orange-50 p-0.5">
                              <button type="button" onClick={() => changeLineQuantity(simpleCartKey, -1)} className="rounded-full p-1.5 text-orange-700 hover:bg-white" aria-label={`Kurangi ${item.name}`}><Minus className="h-3.5 w-3.5" /></button>
                              <span className="w-5 text-center text-xs font-black text-[#2e211b]">{quantity}</span>
                              <button type="button" onClick={() => addMenuItem(item)} disabled={quantity >= 30} className="rounded-full p-1.5 text-orange-700 hover:bg-white disabled:opacity-40" aria-label={`Tambah ${item.name}`}><Plus className="h-3.5 w-3.5" /></button>
                            </div>
                          )}
                        </div>
                      </div>
                      {optionItem?.id === item.id && (
                        <div className="col-span-2 min-w-0 border-t border-[#f1e6dc] pt-3">
                          <div className="mb-3">
                            <h4 className="text-xs font-black text-[#35281f]">Sesuaikan pesanan</h4>
                            <p className="mt-0.5 text-[10px] leading-relaxed text-[#8c7a6d]">
                              Pilih topping atau variasi yang kamu inginkan.
                            </p>
                          </div>
                          <div className="space-y-3">
                            {item.option_groups.map((group) => (
                              <fieldset key={group.id} className="rounded-xl border border-[#f0e7df] bg-[#fffdfa] p-3">
                                <legend className="sr-only">{group.name}</legend>
                                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                                  <h5 className="text-[11px] font-black text-[#49372a]">{group.name}</h5>
                                  <span className={`rounded-full px-2 py-1 text-[9px] font-black ${group.required ? "bg-orange-50 text-orange-700" : "bg-[#f4f2ef] text-[#8c7a6d]"}`}>
                                    {group.required ? "Wajib pilih" : "Opsional"} · {group.multiple ? "boleh pilih beberapa" : "pilih satu"}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  {group.options.map((option) => {
                                    const checked = (selectedOptionIds[group.id] || []).includes(option.id);
                                    return (
                                      <label
                                        key={option.id}
                                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition ${
                                          checked
                                            ? "border-orange-300 bg-orange-50/70"
                                            : "border-[#f0eeeb] bg-white hover:border-orange-200"
                                        }`}
                                      >
                                        <input
                                          type={group.multiple ? "checkbox" : "radio"}
                                          name={`jajan-option-${group.id}`}
                                          checked={checked}
                                          onChange={(event) => changeOptionSelection(group, option.id, event.target.checked)}
                                          className="h-4 w-4 shrink-0 accent-orange-600"
                                        />
                                        <span className="min-w-0 flex-1 text-[11px] font-bold text-[#49372a]">{option.name}</span>
                                        <span className="shrink-0 text-[10px] font-bold text-[#76685e]">
                                          {option.price ? `+${formatRupiah(option.price)}` : "Termasuk"}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </fieldset>
                            ))}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#fff4e8] px-3 py-2.5">
                            <div>
                              <p className="text-[9px] font-semibold text-[#8c7a6d]">Harga per porsi</p>
                              <p className="text-sm font-black text-[#2e211b]">{formatRupiah(configuredPrice)}</p>
                            </div>
                            <button
                              type="button"
                              disabled={!canAddOptions}
                              onClick={() => addConfiguredItem(item, selectedOptionIds)}
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#ed7024] px-4 py-2.5 text-xs font-black text-white shadow-[0_6px_16px_rgba(237,112,36,0.2)] transition hover:bg-[#d95f18] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Plus className="h-4 w-4" /> Tambahkan ke keranjang
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-[1.5rem] border border-[#eadfd5] bg-white p-5 shadow-[0_8px_22px_rgba(74,46,29,0.06)]">
                <div className="flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-orange-600" /><h2 className="text-base font-black text-[#2e211b]">Keranjang</h2><span className="ml-auto rounded-full bg-orange-50 px-2 py-1 text-[10px] font-black text-orange-700">{cartCount}</span></div>
                {cartItems.length === 0 ? <p className="mt-4 rounded-xl bg-[#fffaf5] p-3 text-xs leading-relaxed text-[#8c7a6d]">Pilih menu untuk mulai mengisi keranjang.</p> : (
                  <div className="mt-4 space-y-3">
                     {cartItems.map((item) => <div key={item.cart_key} className="flex justify-between gap-3 text-xs"><span className="min-w-0 text-[#6d5a4b]">{item.quantity} × {item.name}{item.selected_options.map((group) => <span key={group.group_id} className="mt-0.5 block text-[10px] text-[#9a887b]">{group.group_name}: {group.choices.map((choice) => choice.name).join(", ")}</span>)}</span><span className="shrink-0 font-bold text-[#2e211b]">{formatRupiah(item.unit_price * item.quantity)}</span></div>)}
                     <div className="border-t border-dashed border-[#eadfd5] pt-3"><div className="flex justify-between text-xs text-[#806f63]"><span>Subtotal menu</span><span>{formatRupiah(subtotal)}</span></div><div className="mt-1 flex justify-between text-xs text-[#806f63]"><span>Ongkir Garut Kota</span><span>{formatRupiah(JAJAN_YUK_DELIVERY_FEE)}</span></div>{deliveryDiscount > 0 && <div className="mt-1 flex justify-between text-xs text-emerald-700"><span>Diskon ongkir</span><span>-{formatRupiah(deliveryDiscount)}</span></div>}<div className="mt-2 flex justify-between text-sm font-black text-[#2e211b]"><span>Total</span><span>{formatRupiah(estimatedTotal)}</span></div><button type="button" onClick={() => setCheckoutOpen(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-black text-white shadow-md shadow-orange-200">Lanjut checkout <ArrowRight className="h-4 w-4" /></button></div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="fixed bottom-[5.5rem] left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-center justify-between gap-3 rounded-2xl border border-[#e7e9e8] bg-white px-3.5 py-2.5 text-left shadow-[0_10px_28px_rgba(30,41,51,0.18)] sm:bottom-6 sm:px-4 sm:py-3"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <ShoppingBag className="h-5 w-5 shrink-0 text-[#d95f18]" />
              <span className="min-w-0">
              <span className="block whitespace-nowrap text-[10px] font-semibold text-[#7a858a]">{cartCount} item</span>
                <span className="block whitespace-nowrap text-xs font-black text-[#292f32]">{formatRupiah(estimatedTotal)}</span>
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#ed7024] px-3 py-2.5 text-[11px] font-black text-white">
              Checkout <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
        )}

        {checkoutOpen && (
          <div
            className="fixed inset-0 z-[80] flex items-stretch justify-center overscroll-y-contain bg-[#21150f]/55 backdrop-blur-sm sm:items-center sm:p-5"
            onClick={() => setCheckoutOpen(false)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="jajan-checkout-title"
              className="flex h-[100dvh] max-h-[100dvh] w-full max-w-xl flex-col overflow-hidden bg-[#f7f8f8] shadow-2xl sm:h-auto sm:max-h-[min(94dvh,54rem)] sm:rounded-[1.65rem]"
              onClick={(event) => event.stopPropagation()}
            >
               <header className="shrink-0 border-b border-[#edf0ef] bg-white px-4 py-3.5 sm:px-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                     <button
                       type="button"
                       onClick={() => setCheckoutOpen(false)}
                       className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#2e3437] transition hover:bg-[#f1f3f3]"
                       aria-label="Kembali ke menu"
                     >
                       <ArrowLeft className="h-5 w-5" />
                     </button>
                    <div className="min-w-0">
                       <h2 id="jajan-checkout-title" className="text-[17px] font-black leading-tight text-[#202629]">Checkout</h2>
                       <p className="mt-0.5 truncate text-[11px] font-medium text-[#7c8589]">{merchant.name}</p>
                    </div>
                  </div>
                   <span className="rounded-full bg-[#f1f8f5] px-3 py-1.5 text-[10px] font-black text-[#16764c]">
                     {cartCount} item
                   </span>
                </div>
              </header>

              <form onSubmit={submitOrder} className="flex min-h-0 flex-1 flex-col">
                <div
                  className="min-h-0 flex-1 space-y-3.5 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5"
                  style={{ scrollbarColor: "#e8a16f #fff3e7", scrollbarWidth: "thin" }}
                >
                  {error && (
                    <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-semibold text-red-700">
                      <span>{error}</span>
                      <button type="button" onClick={() => setError("")} aria-label="Tutup pesan error">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <section className="rounded-2xl border border-[#eeece8] bg-white p-4 shadow-[0_4px_14px_rgba(39,31,24,0.035)]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-[17px] font-black tracking-tight text-[#202629]">Ringkasan pesanan</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCheckoutOpen(false)}
                        className="inline-flex items-center gap-1 text-xs font-black text-[#d95f18] transition hover:text-[#b94d12]"
                      >
                        Tambah pesanan <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-3 divide-y divide-[#f1efec]">
                      {cartItems.map((item) => (
                        <div key={item.cart_key} className="grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-2.5 py-3 first:pt-0 last:pb-0 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fff1e4] text-orange-600 sm:h-12 sm:w-12">
                            <img
                              src={item.image || merchant.image || "/images/jajan-yuk-garut-food-banner.jpg"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-xs font-bold leading-snug text-[#35281f]">{item.name}</p>
                            {item.selected_options.map((group) => (
                              <p key={group.group_id} className="mt-1 text-[10px] text-[#8c7a6d]">
                                {group.group_name}: {group.choices.map((choice) => choice.name).join(", ")}
                              </p>
                            ))}
                            <p className="mt-1 text-[10px] text-[#8c7a6d]">{formatRupiah(item.unit_price)} / porsi</p>
                          </div>
                          <div className="flex min-w-[5.25rem] flex-col items-end gap-1.5">
                            <p className="text-[11px] font-black text-[#35281f]">{formatRupiah(item.unit_price * item.quantity)}</p>
                            <div className="flex items-center gap-1 rounded-full border border-orange-100 bg-orange-50 p-0.5">
                              <button type="button" onClick={() => changeLineQuantity(item.cart_key, -1)} className="rounded-full p-1.5 text-orange-700 transition hover:bg-white" aria-label={`Kurangi ${item.name}`}><Minus className="h-3 w-3" /></button>
                              <span className="w-4 text-center text-[10px] font-black text-[#2e211b]">{item.quantity}</span>
                              <button type="button" onClick={() => changeLineQuantity(item.cart_key, 1)} disabled={item.quantity >= 30} className="rounded-full p-1.5 text-orange-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40" aria-label={`Tambah ${item.name}`}><Plus className="h-3 w-3" /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 space-y-2 border-t border-dashed border-[#e9e5e0] pt-3 text-xs">
                      <div className="flex justify-between text-[#76685e]">
                        <span>Subtotal</span><span>{formatRupiah(subtotal)}</span>
                      </div>
                      {serviceFee > 0 && (
                        <div className="flex justify-between text-[#76685e]">
                          <span>Biaya layanan ({serviceFeePercent}%)</span><span>{formatRupiah(serviceFee)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#76685e]">
                        <span className="inline-flex items-center gap-1">Ongkir · {JAJAN_YUK_DELIVERY_AREA} <Info className="h-3 w-3 text-[#a8b0b2]" /></span><span>{formatRupiah(JAJAN_YUK_DELIVERY_FEE)}</span>
                      </div>
                      {deliveryDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>{deliveryDiscount >= JAJAN_YUK_DELIVERY_FEE ? "Gratis ongkir" : "Diskon ongkir"}</span><span>-{formatRupiah(deliveryDiscount)}</span>
                        </div>
                      )}
                      {appliedVoucher && (
                        <div className="flex justify-between text-emerald-700">
                          <span>Voucher · {appliedVoucher.code}</span><span>-{formatRupiah(voucherDiscount)}</span>
                        </div>
                      )}
                      <div className="mt-1 flex items-center justify-between gap-3 rounded-xl bg-[#fff4e8] px-3 py-2.5 text-sm font-black text-[#2e211b]">
                        <span>Total sementara</span><span className="shrink-0 text-[#d95f18]">{formatRupiah(estimatedTotal)}</span>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#eeece8] bg-white p-4 shadow-[0_4px_14px_rgba(39,31,24,0.035)]">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-[#d95f18]" />
                      <h3 className="text-sm font-black text-[#202629]">Voucher</h3>
                    </div>
                    {!appliedVoucher && (
                      <div className="mt-3 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-wide text-[#9a887b]">Voucher aktif</p>
                        {vouchersLoading ? (
                          <div className="flex items-center gap-2 rounded-xl bg-[#fcfaf8] px-3 py-3 text-[10px] font-semibold text-[#8b7b70]">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Memuat voucher…
                          </div>
                        ) : activeVouchers.length === 0 ? (
                          <p className="rounded-xl bg-[#fcfaf8] px-3 py-3 text-[10px] font-semibold text-[#8b7b70]">Belum ada voucher aktif untuk merchant ini.</p>
                        ) : (
                          <div className="space-y-2">
                            {activeVouchers.map((voucher) => {
                              const minimumPurchase = Number(voucher.min_purchase) || 0;
                              const supportedDiscount = ["persen", "nominal"].includes(voucher.discount_type);
                              const minimumMet = subtotal >= minimumPurchase;
                              const usable = supportedDiscount && minimumMet;
                              const discountLabel = voucher.discount_type === "persen"
                                ? `${Number(voucher.discount_value)}%`
                                : voucher.discount_type === "nominal"
                                  ? formatRupiah(Number(voucher.discount_value))
                                  : "Tidak tersedia";
                              const disabledReason = !supportedDiscount
                                ? "Tidak bisa dipakai di Jajan YUK"
                                : `Min. pembelian ${formatRupiah(minimumPurchase)}`;
                              return (
                                <button
                                  key={voucher.id}
                                  type="button"
                                  disabled={!usable || voucherApplying}
                                  onClick={() => void applyVoucher(voucher.code)}
                                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                                    usable
                                      ? "border-orange-100 bg-orange-50 hover:border-orange-300 hover:bg-orange-100"
                                      : "cursor-not-allowed border-[#eeeae6] bg-[#faf9f8] opacity-70"
                                  }`}
                                >
                                  <span className="min-w-0">
                                    <span className={`block truncate text-xs font-black ${usable ? "text-[#2e211b]" : "text-[#76685e]"}`}>{voucher.title || voucher.code}</span>
                                    <span className="mt-0.5 block text-[10px] font-bold text-[#d95f18]">{discountLabel} · {voucher.code}</span>
                                    <span className="mt-0.5 block truncate text-[10px] text-[#8b7b70]">
                                      {usable ? (minimumPurchase > 0 ? `Min. pembelian ${formatRupiah(minimumPurchase)}` : "Bisa dipakai sekarang") : disabledReason}
                                    </span>
                                  </span>
                                  <span className={`shrink-0 text-[10px] font-black ${usable ? "text-[#d95f18]" : "text-[#9a887b]"}`}>
                                    {usable ? "Pakai" : "Tidak bisa"}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                    {appliedVoucher ? (
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-black text-emerald-800">{appliedVoucher.code}</p>
                          <p className="mt-0.5 text-[10px] text-emerald-700">Potongan {formatRupiah(voucherDiscount)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setAppliedVoucher(null);
                            setVoucherInput("");
                            setVoucherError("");
                          }}
                          className="shrink-0 text-[10px] font-black text-emerald-700 hover:text-emerald-900"
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 flex gap-2">
                        <input
                          value={voucherInput}
                          onChange={(event) => {
                            setVoucherInput(event.target.value.toUpperCase());
                            setVoucherError("");
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              void applyVoucher();
                            }
                          }}
                          className="min-w-0 flex-1 rounded-xl border border-[#e7e3de] bg-[#fcfcfb] px-3 py-2.5 text-xs font-bold uppercase tracking-wide outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                          placeholder="Masukkan kode voucher"
                          aria-label="Kode voucher"
                        />
                        <button
                          type="button"
                          onClick={() => void applyVoucher()}
                          disabled={!voucherInput.trim() || voucherApplying}
                          className="shrink-0 rounded-xl bg-[#202629] px-3.5 py-2.5 text-xs font-black text-white hover:bg-[#343d40] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {voucherApplying ? "Memeriksa…" : "Pakai"}
                        </button>
                      </div>
                    )}
                    {voucherError && <p className="mt-2 text-[10px] font-semibold text-red-600">{voucherError}</p>}
                  </section>

                    {recommendedItems.length > 0 && (
                      <details className="group rounded-2xl border border-[#eeece8] bg-white shadow-[0_4px_14px_rgba(39,31,24,0.035)]">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                          <span>
                            <span className="block text-xs font-black text-[#202629]">Tambah menu lain</span>
                            <span className="mt-0.5 block text-[10px] text-[#7c8589]">Opsional, pesananmu sudah siap dilanjutkan</span>
                          </span>
                          <Plus className="h-4 w-4 text-[#d95f18] transition group-open:rotate-45" />
                        </summary>
                        <div className="flex gap-2.5 overflow-x-auto border-t border-[#f0f2f1] px-4 py-3.5 [scrollbar-width:none]">
                          {recommendedItems.map((item) => (
                            <div key={item.id} className="w-[8.5rem] shrink-0 rounded-xl bg-[#fafafa] p-2.5">
                              <div className="relative h-20 overflow-hidden rounded-lg bg-[#fff1e4]">
                                <img src={item.image || "/images/jajan-yuk-garut-food-banner.jpg"} alt="" className="h-full w-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCheckoutOpen(false);
                                    addMenuItem(item);
                                  }}
                                  className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#d95f18] text-white shadow-md"
                                  aria-label={`Tambah ${item.name}`}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="mt-2 line-clamp-2 text-[11px] font-bold leading-snug text-[#30383b]">{item.name}</p>
                              <p className="mt-1 text-xs font-black text-[#d95f18]">{formatRupiah(item.price)}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                  <section className="rounded-2xl border border-[#eeece8] bg-white p-4 shadow-[0_4px_14px_rgba(39,31,24,0.035)]">
                    <div className="mb-3 flex items-center justify-between gap-3">
                       <h3 className="text-[17px] font-black tracking-tight text-[#202629]">Detail pengantaran</h3>
                       <MapPin className="h-5 w-5 text-[#d95f18]" />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-bold text-[#59483c]">Nama penerima</span>
                        <input
                          required
                          minLength={2}
                          value={customerName}
                          onChange={(event) => setCustomerName(event.target.value)}
                          autoComplete="name"
                          className="w-full rounded-xl border border-[#e7e3de] bg-[#fcfcfb] px-3.5 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                          placeholder="Nama lengkap"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-bold text-[#59483c]">Nomor WhatsApp</span>
                        <input
                          required
                          value={customerPhone}
                          onChange={(event) => setCustomerPhone(event.target.value)}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          className="w-full rounded-xl border border-[#e7e3de] bg-[#fcfcfb] px-3.5 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                          placeholder="08xxxxxxxxxx"
                        />
                      </label>
                    </div>
                    <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#f5e2cf] bg-[#fff8f0] px-3.5 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold text-[#9b806e]">Area pengantaran</p>
                        <p className="text-xs font-black text-[#49372a]">{JAJAN_YUK_DELIVERY_AREA}</p>
                      </div>
                      <span className="text-xs font-black text-[#49372a]">{formatRupiah(JAJAN_YUK_DELIVERY_FEE)}</span>
                    </div>
                    <div className="relative mt-3">
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-bold text-[#59483c]">Cari alamat pengantaran</span>
                        <div className="relative">
                          <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#b59c8b]" />
                          <input
                            required
                            minLength={8}
                            value={deliveryAddress}
                            onChange={(event) => changeDeliveryAddress(event.target.value)}
                            autoComplete="street-address"
                            className="w-full rounded-xl border border-[#e7e3de] bg-[#fcfcfb] py-3 pl-10 pr-10 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                            placeholder="Ketik jalan, area, atau patokan"
                          />
                          {searchingAddress && <Loader2 className="absolute right-3.5 top-3.5 h-4 w-4 animate-spin text-orange-500" />}
                        </div>
                      </label>
                      {addressSuggestions.length > 0 && (
                         <div className="absolute inset-x-0 top-[4.55rem] z-30 overflow-hidden rounded-xl border border-[#eadfd5] bg-white shadow-[0_14px_30px_rgba(72,42,20,0.15)]">
                          <p className="border-b border-[#f3ece6] px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-[#a08e82]">
                            Pilih alamat yang sesuai
                          </p>
                           <div className="max-h-[min(60vh,22rem)] overflow-y-auto overscroll-contain">
                            {addressSuggestions.map((suggestion) => (
                              <button
                                key={suggestion.id}
                                type="button"
                                onClick={() => selectAddressSuggestion(suggestion)}
                                 className="flex min-h-[4.5rem] w-full items-start gap-2.5 border-b border-[#f6f0eb] px-3.5 py-3 text-left transition last:border-b-0 hover:bg-[#fff7ef] active:bg-[#fff1e2]"
                              >
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                                <span className="min-w-0">
                                  <span className="block text-xs font-bold leading-snug text-[#49372a]">{suggestion.display_name.split(",")[0]}</span>
                                  <span className="mt-0.5 block text-[10px] leading-snug text-[#8c7a6d]">{suggestion.display_name}</span>
                                   <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] font-bold text-orange-700">
                                     {suggestion.type && <span className="capitalize text-[#a08e82]">{suggestion.type.replace(/_/g, " ")}</span>}
                                     {currentLocation && (
                                       <span className="inline-flex items-center gap-1">
                                         <MapPinned className="h-3 w-3" />
                                         {formatDistance(distanceInKm(currentLocation, suggestion))}
                                         <span className="font-semibold text-[#a08e82]">dari lokasimu</span>
                                       </span>
                                     )}
                                   </span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                       <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                         <p className="text-[10px] leading-relaxed text-[#8c7a6d]">
                           Pilih hasil pencarian agar titik lokasi terisi otomatis.
                         </p>
                         <button
                           type="button"
                           onClick={captureDeliveryLocation}
                           disabled={locating}
                           className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-[10px] font-black text-orange-700 transition hover:bg-orange-100 disabled:cursor-wait disabled:opacity-60"
                         >
                           <MapPinned className="h-3.5 w-3.5" />
                           {locating ? "Mencari lokasimu…" : "Gunakan lokasiku"}
                         </button>
                       </div>
                       {currentLocation && (
                         <p className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700">
                           <CheckCircle2 className="h-3 w-3" /> Lokasi aktif
                         </p>
                       )}
                      <p className="mt-1 text-[9px] text-[#a08e82]">
                        Pencarian alamat oleh{" "}
                        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="font-bold underline">
                          OpenStreetMap
                        </a>
                        .
                      </p>
                      {addressSearchError && <p className="mt-1 text-[10px] font-semibold text-[#a36c40]">{addressSearchError}</p>}
                    </div>
                    {deliveryLatitude != null && deliveryLongitude != null && locationMapCenter && (
                      <div className="mt-3 overflow-hidden rounded-2xl border border-orange-100 bg-[#fffaf3]">
                        <DeliveryLocationMap
                          coordinate={{ latitude: deliveryLatitude, longitude: deliveryLongitude }}
                          mapCenter={locationMapCenter}
                          onChange={(coordinate) => {
                            setDeliveryLatitude(coordinate.latitude);
                            setDeliveryLongitude(coordinate.longitude);
                          }}
                        />
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3.5 py-3">
                          <div className="min-w-0">
                            <p className="truncate text-[10px] font-black text-[#49372a]">{deliveryAddress || "Titik lokasi siap dikirim"}</p>
                            <p className="mt-0.5 text-[9px] font-semibold text-orange-700">
                              {currentLocation
                                ? `Jarak dari lokasimu: ${formatDistance(distanceInKm(currentLocation, { latitude: deliveryLatitude, longitude: deliveryLongitude }))}`
                                : "Titik lokasi siap dikirim ke driver"}
                            </p>
                          </div>
                          <a
                            href={mapsUrl(deliveryLatitude, deliveryLongitude)!}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-9 items-center rounded-lg px-2 text-[10px] font-black text-orange-700 hover:bg-orange-100"
                          >
                            Buka Maps
                          </a>
                        </div>
                      </div>
                    )}
                    <label className="mt-3 block">
                      <span className="mb-1.5 block text-[11px] font-bold text-[#59483c]">
                        Catatan untuk merchant <span className="font-normal text-[#a08e82]">· opsional</span>
                      </span>
                      <textarea
                        rows={2}
                        value={customerNote}
                        onChange={(event) => setCustomerNote(event.target.value)}
                        className="w-full resize-y rounded-xl border border-[#e7e3de] bg-[#fcfcfb] px-3.5 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        placeholder="Contoh: sambal dipisah"
                      />
                    </label>
                     <details className="group mt-3 overflow-hidden rounded-2xl border border-[#edf0ef] bg-white">
                       <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3 [&::-webkit-details-marker]:hidden">
                         <span className="inline-flex items-center gap-2">
                           <Leaf className="h-4 w-4 text-[#1c9b5c]" />
                           <span className="text-[11px] font-black text-[#30383b]">Permintaan tambahan <span className="font-normal text-[#9aa4a5]">· opsional</span></span>
                         </span>
                         <ChevronRight className="h-4 w-4 text-[#9aa4a5] transition group-open:rotate-90" />
                       </summary>
                       <div className="space-y-1 border-t border-[#f0f2f1] px-3.5">
                         <label className="flex cursor-pointer items-center gap-3 py-3">
                           <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f6f8f8] text-[#687477]">
                             <UtensilsCrossed className="h-4 w-4" />
                           </span>
                           <span className="min-w-0 flex-1">
                             <span className="block text-[11px] font-black text-[#30383b]">Alat makan</span>
                           </span>
                           <input type="checkbox" checked={requestCutlery} onChange={(event) => setRequestCutlery(event.target.checked)} className="h-5 w-5 shrink-0 rounded accent-[#d95f18]" />
                         </label>
                         <label className="flex cursor-pointer items-center gap-3 border-t border-[#f0f2f1] py-3">
                           <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#effaf3] text-[#1c9b5c]">
                             <Leaf className="h-4 w-4" />
                           </span>
                           <span className="min-w-0 flex-1">
                             <span className="block text-[11px] font-black text-[#30383b]">Kontribusi langkah hijau</span>
                           </span>
                           <input type="checkbox" checked={ecoContribution} onChange={(event) => setEcoContribution(event.target.checked)} className="h-5 w-5 shrink-0 rounded accent-[#19a765]" />
                         </label>
                       </div>
                     </details>
                  </section>

                </div>

                 <footer className="shrink-0 border-t border-[#e7ecea] bg-white px-4 py-3 shadow-[0_-8px_22px_rgba(30,41,51,0.08)] sm:px-5" style={{ paddingBottom: "max(0.9rem, env(safe-area-inset-bottom))" }}>
                  <button
                    type="submit"
                    disabled={submitting || cartItems.length === 0}
                     className="flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl bg-[#ed7024] px-4 py-3 text-left text-white shadow-[0_8px_20px_rgba(237,112,36,0.24)] transition hover:bg-[#d95f18] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span>
                       <span className="block text-[9px] font-bold text-orange-100">Total harga</span>
                       <span className="mt-0.5 block text-base font-black">{formatRupiah(estimatedTotal)}</span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-2 text-sm font-black">
                       {submitting ? "Menyimpan…" : "Lanjut ke pembayaran"}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                </footer>
              </form>
            </section>
          </div>
        )}
      </main>
    </Layout>
  );
}