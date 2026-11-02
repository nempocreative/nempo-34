import {
  Bike,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  Phone,
  Search,
  ShieldCheck,
  Store,
  UserRound,
  WalletCards,
} from "lucide-react";
import type { JajanOrderRouting, JajanMenuItem } from "@/lib/jajan-yuk-demo";

export const DEMO_DELIVERY_ZONES = [
  {
    id: "garut-kota",
    name: "Garut Kota",
    distance: "±3 km",
    fee: 9000,
    eta: "20–35 menit",
  },
  {
    id: "tarogong-kidul",
    name: "Tarogong Kidul",
    distance: "±6 km",
    fee: 15000,
    eta: "35–50 menit",
  },
  {
    id: "tarogong-kaler",
    name: "Tarogong Kaler",
    distance: "±9 km",
    fee: 21000,
    eta: "50–70 menit",
  },
] as const;

export type JajanDemoDeliveryZone = (typeof DEMO_DELIVERY_ZONES)[number];

export type JajanDemoOrderStatus =
  | "waiting_confirmation"
  | "confirmed"
  | "finding_driver"
  | "driver_assigned"
  | "preparing"
  | "picked_up"
  | "on_the_way"
  | "delivered";

export interface JajanDemoDriver {
  name: string;
  vehicle: string;
  plate: string;
}

export interface JajanYukDemoOrder {
  code: string;
  merchantName: string;
  orderRouting: JajanOrderRouting;
  items: Array<JajanMenuItem & { quantity: number }>;
  subtotal: number;
  deliveryZone: JajanDemoDeliveryZone;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  status: JajanDemoOrderStatus;
  driver: JajanDemoDriver | null;
}

const ORDER_STEPS: Array<{
  status: JajanDemoOrderStatus;
  label: string;
  icon: typeof CheckCircle2;
}> = [
  { status: "confirmed", label: "Pesanan dikonfirmasi", icon: CheckCircle2 },
  { status: "finding_driver", label: "Mencari driver", icon: Search },
  { status: "driver_assigned", label: "Driver ditemukan", icon: Bike },
  { status: "preparing", label: "Merchant menyiapkan pesanan", icon: Store },
  { status: "picked_up", label: "Pesanan diambil driver", icon: PackageCheck },
  { status: "on_the_way", label: "Dalam perjalanan", icon: Bike },
  { status: "delivered", label: "Pesanan sampai", icon: Check },
];

const statusLabels: Record<JajanDemoOrderStatus, string> = {
  waiting_confirmation: "Menunggu konfirmasi",
  confirmed: "Pesanan dikonfirmasi",
  finding_driver: "Mencari driver",
  driver_assigned: "Driver ditemukan",
  preparing: "Pesanan disiapkan",
  picked_up: "Pesanan diambil",
  on_the_way: "Dalam perjalanan",
  delivered: "Pesanan selesai",
};

const statusDescriptions: Record<JajanDemoOrderStatus, string> = {
  waiting_confirmation: "Pesanan demo masuk dan menunggu konfirmasi.",
  confirmed: "Pesanan demo dikonfirmasi. Berikutnya kita simulasikan pencarian driver.",
  finding_driver: "Sistem demo sedang mencarikan driver di sekitar area.",
  driver_assigned: "Driver demo sudah ditemukan dan siap menuju merchant.",
  preparing: "Merchant demo sedang menyiapkan pesanan.",
  picked_up: "Driver demo sudah mengambil pesanan dari merchant.",
  on_the_way: "Driver demo sedang menuju alamat tujuan.",
  delivered: "Simulasi pengantaran selesai.",
};

const nextActionLabels: Record<JajanDemoOrderStatus, string> = {
  waiting_confirmation: "Simulasikan konfirmasi",
  confirmed: "Mulai cari driver demo",
  finding_driver: "Tampilkan driver demo",
  driver_assigned: "Simulasikan pesanan disiapkan",
  preparing: "Simulasikan driver mengambil pesanan",
  picked_up: "Simulasikan mulai diantar",
  on_the_way: "Selesaikan demo pengantaran",
  delivered: "Pesanan demo selesai",
};

const demoDrivers: JajanDemoDriver[] = [
  { name: "Asep (Driver Demo)", vehicle: "Motor matic hitam", plate: "Z 0000 XX" },
  { name: "Deni (Driver Demo)", vehicle: "Motor matic merah", plate: "Z 0000 XX" },
  { name: "Rizal (Driver Demo)", vehicle: "Motor matic putih", plate: "Z 0000 XX" },
];

export function getNextJajanDemoStatus(
  status: JajanDemoOrderStatus,
): JajanDemoOrderStatus {
  const sequence: JajanDemoOrderStatus[] = [
    "waiting_confirmation",
    "confirmed",
    "finding_driver",
    "driver_assigned",
    "preparing",
    "picked_up",
    "on_the_way",
    "delivered",
  ];
  return sequence[Math.min(sequence.indexOf(status) + 1, sequence.length - 1)];
}

export function getJajanDemoDriver(zone: JajanDemoDeliveryZone): JajanDemoDriver {
  const index = DEMO_DELIVERY_ZONES.findIndex((item) => item.id === zone.id);
  return demoDrivers[Math.max(index, 0)];
}

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export function JajanYukDemoTracking({
  order,
  onAdvance,
  onClose,
  onNewDemo,
}: {
  order: JajanYukDemoOrder;
  onAdvance: (status: JajanDemoOrderStatus) => void;
  onClose: () => void;
  onNewDemo: () => void;
}) {
  const currentStepIndex =
    order.status === "waiting_confirmation"
      ? -1
      : ORDER_STEPS.findIndex((step) => step.status === order.status);
  const RoutingIcon = order.orderRouting === "admin_whatsapp" ? ShieldCheck : Store;
  const nextStatus = getNextJajanDemoStatus(order.status);
  const confirmationLabel =
    order.orderRouting === "admin_whatsapp"
      ? "Simulasikan konfirmasi admin Nempo"
      : "Simulasikan konfirmasi merchant";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
            <PackageCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-black text-[#2e211b]">
                {statusLabels[order.status]}
              </p>
              <span className="rounded-full bg-white px-2 py-1 text-[9px] font-black uppercase tracking-wide text-orange-700">
                Demo
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[#806f63]">
              {statusDescriptions[order.status]}
            </p>
            <p className="mt-2 font-mono text-[10px] font-bold text-orange-800">
              Kode contoh: {order.code}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#eee6df] bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-wide text-[#9a887b]">
            Alur merchant
          </p>
          <div className="mt-2 flex items-start gap-2">
            <RoutingIcon className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
            <div>
              <p className="text-xs font-black text-[#2e211b]">
                {order.orderRouting === "admin_whatsapp"
                  ? "Persetujuan admin Nempo"
                  : "Konfirmasi merchant"}
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-[#806f63]">
                {order.orderRouting === "admin_whatsapp"
                  ? "Tombol konfirmasi hanya mengubah status demo. Tidak ada WhatsApp yang dikirim."
                  : "Pesanan hanya ditandai diteruskan dalam simulasi ini."}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#eee6df] bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-wide text-[#9a887b]">
            Driver contoh
          </p>
          {order.driver ? (
            <div className="mt-2 flex items-start gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <UserRound className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-black text-[#2e211b]">
                  {order.driver.name}
                </p>
                <p className="mt-0.5 text-[10px] text-[#806f63]">
                  {order.driver.vehicle} · {order.driver.plate}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-xs text-[#806f63]">
              Nama dan kendaraan muncul setelah simulasi menemukan driver.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-[#eee6df] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xs font-black text-[#2e211b]">Perjalanan pesanan</h3>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#806f63]">
            <Clock3 className="h-3.5 w-3.5 text-orange-600" />
            Estimasi {order.deliveryZone.eta}
          </span>
        </div>
        <ol className="mt-4 space-y-0">
          <li className="relative flex gap-3 pb-3">
            <span className="absolute bottom-0 left-[11px] top-6 w-px bg-orange-200" />
            <span className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-xs font-black text-[#2e211b]">Pesanan diterima</p>
              <p className="mt-0.5 text-[10px] text-[#806f63]">
                {order.status === "waiting_confirmation"
                  ? order.orderRouting === "admin_whatsapp"
                    ? "Menunggu persetujuan admin Nempo"
                    : "Menunggu konfirmasi merchant"
                  : "Konfirmasi pesanan tercatat di simulasi"}
              </p>
            </div>
          </li>
          {ORDER_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const complete = index <= currentStepIndex;
            const current = index === currentStepIndex;
            return (
              <li key={step.status} className="relative flex gap-3 pb-3 last:pb-0">
                {index < ORDER_STEPS.length - 1 && (
                  <span
                    className={`absolute bottom-0 left-[11px] top-6 w-px ${
                      complete ? "bg-orange-200" : "bg-[#eee6df]"
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
                  {complete ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <StepIcon className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p
                    className={`text-xs ${
                      current
                        ? "font-black text-orange-800"
                        : complete
                          ? "font-bold text-[#2e211b]"
                          : "font-medium text-[#9a887b]"
                    }`}
                  >
                    {step.label}
                    {current && (
                      <span className="ml-2 rounded-full bg-orange-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-wide text-orange-700">
                        Sekarang
                      </span>
                    )}
                  </p>
                  {step.status === "driver_assigned" && order.driver && (
                    <p className="mt-0.5 text-[10px] text-[#806f63]">
                      {order.driver.name} · {order.driver.vehicle}
                    </p>
                  )}
                  {step.status === "on_the_way" && (
                    <p className="mt-0.5 text-[10px] text-[#806f63]">
                      Tujuan: {order.deliveryZone.name} · {order.deliveryZone.distance}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-2xl border border-[#eee6df] bg-[#fffaf5] p-4">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-[#2e211b]">
              {order.customerName} · {order.deliveryZone.name}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#806f63]">
              {order.deliveryAddress}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-[#eadfd5] pt-3 text-xs text-[#806f63]">
          <Phone className="h-3.5 w-3.5 shrink-0 text-orange-600" />
          {order.customerPhone}
        </div>
        <div className="mt-3 space-y-2 border-t border-[#eadfd5] pt-3 text-xs">
          <p className="font-black text-[#2e211b]">Rincian menu</p>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-3 text-[#806f63]"
            >
              <span className="min-w-0">
                {item.quantity} × {item.name}
              </span>
              <span className="shrink-0">
                {formatRupiah(item.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="flex justify-between gap-3 text-[#806f63]">
            <span>Subtotal menu</span>
            <span>{formatRupiah(order.subtotal)}</span>
          </div>
          <div className="flex justify-between gap-3 text-[#806f63]">
            <span>
              Ongkir demo · {order.deliveryZone.distance}
            </span>
            <span>{formatRupiah(order.deliveryZone.fee)}</span>
          </div>
          <div className="flex justify-between gap-3 border-t border-dashed border-[#eadfd5] pt-2 font-black text-[#2e211b]">
            <span>Total simulasi</span>
            <span>
              {formatRupiah(order.subtotal + order.deliveryZone.fee)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[10px] text-[#806f63]">
            <WalletCards className="h-3.5 w-3.5" />
            {order.paymentMethod} · belum ditagihkan, pembayaran hanya demo
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-[10px] leading-relaxed text-blue-900">
        Driver, nomor kendaraan, jarak, ongkir, dan estimasi waktu adalah data
        contoh. Tidak ada pesanan yang tersimpan, peta/rute langsung, pembayaran,
        atau pesan WhatsApp yang dijalankan.
      </p>

      {order.status !== "delivered" ? (
        <button
          type="button"
          onClick={() =>
            onAdvance(
              order.status === "waiting_confirmation" ? "confirmed" : nextStatus,
            )
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-black text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
        >
          {order.status === "waiting_confirmation"
            ? confirmationLabel
            : nextActionLabels[order.status]}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNewDemo}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-black text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
        >
          Mulai pesanan demo baru
        </button>
      )}
      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-xl border border-[#eadfd5] py-3 text-xs font-black text-[#806f63] transition hover:bg-[#fffaf5]"
      >
        Tutup pelacakan
      </button>
    </div>
  );
}