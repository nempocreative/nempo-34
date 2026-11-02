import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import { Link } from "@/lib/wouter";
import "./digital-demo-super-app.css";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BarChart3,
  Bell,
  Calculator,
  ChefHat,
  Check,
  ChevronDown,
  CircleUserRound,
  Clock3,
  ClipboardList,
  CreditCard,
  History,
  HelpCircle,
  MessageSquareText,
  MapPin,
  MoreHorizontal,
  Minus,
  PauseCircle,
  Printer,
  Plus,
  Receipt,
  ReceiptText,
  RotateCcw,
  Search,
  Settings2,
  ShoppingBag,
  Store,
  Tag,
  Trash2,
  Utensils,
  Wifi,
  Volume2,
  X,
} from "lucide-react";

type Fulfillment = "Dine in" | "Takeaway";
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  soldToday: number;
  color: string;
  mark: string;
  description: string;
  badge?: string;
};

type CartItem = {
  key: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant: string;
};

type HeldOrder = {
  id: string;
  cart: CartItem[];
  fulfillment: Fulfillment;
  table: string;
  customerName: string;
  note: string;
  serviceArea: string;
  total: number;
  createdAt: string;
};

type QueueFilter = "processing" | "ready" | "called";
type CalledOrder = { number: string; customerName: string };
type CompletedOrder = {
  number: string;
  customerName: string;
  itemCount: number;
  total: number;
  method: string;
  status: "paid" | "refunded";
  createdAt: string;
  refundReason?: string;
};
type KitchenOrder = {
  number: string;
  customerName: string;
  status: QueueFilter;
  detail: string;
  time: string;
};

const categories = ["Semua menu", "Paket hemat", "Kopi", "Minuman", "Makanan", "Snack"];
const serviceAreas = ["Lantai 1", "Taman", "Depan", "Samping"];

const initialKitchenOrders: KitchenOrder[] = [
  { number: "KP-0245", customerName: "Budi", status: "ready", detail: "2 item · Meja 03", time: "14:28" },
  { number: "KP-0246", customerName: "Sinta", status: "ready", detail: "1 item · Takeaway", time: "14:29" },
  { number: "KP-0247", customerName: "Rafi", status: "ready", detail: "3 item · Meja 11", time: "14:30" },
  { number: "KP-0248", customerName: "Nia", status: "processing", detail: "2 item · Meja 05", time: "14:31" },
  { number: "KP-0249", customerName: "Dimas", status: "processing", detail: "4 item · Takeaway", time: "14:32" },
  { number: "KP-0250", customerName: "Ayu", status: "processing", detail: "1 item · Meja 07", time: "14:32" },
  { number: "KP-0241", customerName: "Wawan", status: "called", detail: "2 item · Meja 02", time: "14:09" },
];

const initialCompletedOrders: CompletedOrder[] = [
  { number: "KP-0244", customerName: "Maya", itemCount: 2, total: 42000, method: "QRIS", status: "paid", createdAt: "14:21" },
  { number: "KP-0243", customerName: "Bagas", itemCount: 3, total: 68000, method: "Cash", status: "paid", createdAt: "14:17" },
  { number: "KP-0242", customerName: "Lala", itemCount: 1, total: 19800, method: "Transfer", status: "paid", createdAt: "14:11" },
];

const products: Product[] = [
  { id: "paket-ceria", name: "Paket Ceria Nempo", category: "Paket hemat", price: 39000, stock: 20, soldToday: 18, color: "bg-[#e58c3a]", mark: "PC", description: "Kopi susu, croissant, dan cookies untuk teman kerja.", badge: "Paling laris" },
  { id: "paket-ngopi", name: "Paket Ngopi Berdua", category: "Paket hemat", price: 56000, stock: 14, soldToday: 10, color: "bg-[#b16a48]", mark: "NB", description: "Dua kopi favorit dan dua snack untuk dinikmati bersama.", badge: "Hemat 20%" },
  { id: "kopi-susu", name: "Kopi Susu Gula Aren", category: "Kopi", price: 18000, stock: 28, soldToday: 42, color: "bg-[#ead1a8]", mark: "KS", description: "Espresso, susu segar, dan gula aren khas Kopi Nempo.", badge: "Favorit" },
  { id: "americano", name: "Americano", category: "Kopi", price: 15000, stock: 34, soldToday: 26, color: "bg-[#c8b09b]", mark: "AM", description: "Espresso dengan air mineral, ringan dan clean." },
  { id: "matcha", name: "Matcha Latte", category: "Minuman", price: 24000, stock: 16, soldToday: 18, color: "bg-[#b8c9a3]", mark: "ML", description: "Matcha creamy dengan rasa earthy yang lembut." },
  { id: "lemon-tea", name: "Fresh Lemon Tea", category: "Minuman", price: 16000, stock: 22, soldToday: 20, color: "bg-[#e8c76e]", mark: "LT", description: "Teh segar dengan lemon dan sedikit madu." },
  { id: "cokelat", name: "Cokelat Nempo", category: "Minuman", price: 22000, stock: 18, soldToday: 14, color: "bg-[#8f6b63]", mark: "CN", description: "Cokelat Belgia hangat dengan foam susu." },
  { id: "croissant", name: "Croissant Butter", category: "Makanan", price: 22000, stock: 12, soldToday: 16, color: "bg-[#f0c878]", mark: "CB", description: "Croissant flaky dengan butter premium.", badge: "Baru" },
  { id: "nasi-ayam", name: "Nasi Ayam Sambal", category: "Makanan", price: 28000, stock: 8, soldToday: 24, color: "bg-[#e7a475]", mark: "NA", description: "Nasi hangat, ayam crispy, lalapan, dan sambal." },
  { id: "pisang-goreng", name: "Pisang Goreng", category: "Makanan", price: 17000, stock: 18, soldToday: 13, color: "bg-[#d9ae62]", mark: "PG", description: "Pisang goreng renyah dengan saus karamel." },
  { id: "fries", name: "French Fries", category: "Snack", price: 16000, stock: 5, soldToday: 19, color: "bg-[#e6c06c]", mark: "FF", description: "Kentang goreng renyah dengan bumbu gurih." },
  { id: "cookies", name: "Cookies Cokelat", category: "Snack", price: 14000, stock: 3, soldToday: 11, color: "bg-[#aa806b]", mark: "CC", description: "Cookies chewy dengan potongan cokelat." },
];

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

export default function DigitalKasirDemoPage() {
  return (
    <DigitalPreviewGate
      title="Kopi Nempo"
      description="Masukkan password untuk membuka preview kasir Kopi Nempo."
      accent="blue"
    >
      <DigitalKasirWorkspace />
    </DigitalPreviewGate>
  );
}

function DigitalKasirWorkspace() {
  const [cart, setCart] = useState<CartItem[]>([
    { key: "kopi-susu-Regular", productId: "kopi-susu", name: "Kopi Susu Gula Aren", price: 18000, quantity: 1, variant: "Regular" },
  ]);
  const [category, setCategory] = useState("Semua menu");
  const [query, setQuery] = useState("");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("Dine in");
  const [table, setTable] = useState("Meja 07");
  const [customerName, setCustomerName] = useState("Rina");
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [successOrder, setSuccessOrder] = useState<CalledOrder | null>(null);
  const [voucher, setVoucher] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [orderNote, setOrderNote] = useState("");
  const [serviceArea, setServiceArea] = useState("Lantai 1");
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [heldOrdersOpen, setHeldOrdersOpen] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState<string | null>(null);
  const [lastCustomerName, setLastCustomerName] = useState("");
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("processing");
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>(initialKitchenOrders);
  const [inventory, setInventory] = useState<Record<string, { stock: number; soldToday: number }>>(
    () => Object.fromEntries(products.map(({ id, stock, soldToday }) => [id, { stock, soldToday }])),
  );
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>(initialCompletedOrders);
  const [refundOpen, setRefundOpen] = useState(false);
  const productsWithInventory = useMemo(
    () => products.map((product) => ({ ...product, ...(inventory[product.id] ?? {}) })),
    [inventory],
  );
  const visibleProducts = useMemo(
    () => productsWithInventory.filter((product) => (category === "Semua menu" || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase())),
    [category, productsWithInventory, query],
  );
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedVoucher === "NEMPO10" ? Math.round(subtotal * 0.1) : 0;
  const tax = Math.round((subtotal - discount) * 0.1);
  const total = subtotal - discount + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  }

  function addItem(product: Product, variant = "Regular", price = product.price, quantity = 1) {
    if (product.stock <= 0) {
      notify(`${product.name} sedang habis.`);
      return;
    }
    setCart((current) => {
      const key = `${product.id}-${variant}`;
      const existing = current.find((item) => item.key === key);
      if (existing) return current.map((item) => item.key === key ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) } : item);
      return [...current, { key, productId: product.id, name: product.name, price, quantity, variant }];
    });
    notify(`${product.name} ditambahkan ke pesanan.`);
  }

  function addQuick(product: Product) {
    addItem(product);
  }

  function updateQuantity(key: string, amount: number) {
    setCart((current) => current.flatMap((item) => {
      if (item.key !== key) return [item];
      const product = productsWithInventory.find((candidate) => candidate.id === item.productId);
      const nextQuantity = Math.min(product?.stock ?? item.quantity + amount, item.quantity + amount);
      return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
    }));
  }

  function removeItem(key: string) {
    setCart((current) => current.filter((item) => item.key !== key));
    notify("Item dihapus dari pesanan.");
  }

  function applyVoucher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = voucher.trim().toUpperCase();
    if (code === "NEMPO10") {
      setAppliedVoucher(code);
      notify("Voucher NEMPO10 berhasil digunakan.");
    } else {
      setAppliedVoucher("");
      notify("Kode belum tersedia. Coba NEMPO10.");
    }
  }

  function useQuickPromo() {
    setVoucher("NEMPO10");
    setAppliedVoucher("NEMPO10");
    notify("Promo NEMPO10 langsung diterapkan ke order.");
  }

  function completePayment(method: string) {
    const highestOrderNumber = kitchenOrders.reduce((highest, order) => {
      const numericPart = Number(order.number.replace(/\D/g, ""));
      return Number.isFinite(numericPart) ? Math.max(highest, numericPart) : highest;
    }, 0);
    const orderNumber = `KP-${String(highestOrderNumber + 1).padStart(4, "0")}`;
    const calledOrder = { number: orderNumber, customerName: customerName.trim() || "Pelanggan" };
    setKitchenOrders((current) => [{
      number: orderNumber,
      customerName: calledOrder.customerName,
      status: "processing",
      detail: `${itemCount} item · ${fulfillment === "Dine in" ? table : "Takeaway"} · ${serviceArea}`,
      time: "baru",
    }, ...current]);
    setInventory((current) => {
      const next = { ...current };
      cart.forEach((item) => {
        const previous = next[item.productId];
        if (!previous) return;
        next[item.productId] = {
          stock: Math.max(0, previous.stock - item.quantity),
          soldToday: previous.soldToday + item.quantity,
        };
      });
      return next;
    });
    setCompletedOrders((current) => [{
      number: orderNumber,
      customerName: calledOrder.customerName,
      itemCount,
      total,
      method,
      status: "paid",
      createdAt: "baru",
    }, ...current]);
    setCart([]);
    setPaymentOpen(false);
    setCartOpen(false);
    setAppliedVoucher("");
    setVoucher("");
    setOrderNote("");
    setServiceArea("Lantai 1");
    setCustomerName("");
    setLastOrderNumber(calledOrder.number);
    setLastCustomerName(calledOrder.customerName);
    setSuccessOrder(calledOrder);
    notify(`Pembayaran ${method} berhasil.`);
  }

  function announceOrder(orderNumber: string, name = "") {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      notify("Browser ini belum mendukung panggilan suara.");
      return;
    }
    window.speechSynthesis.cancel();
    const [prefix, digits] = orderNumber.split("-");
    const spokenNumber = `${prefix.split("").join(" ")} ${digits?.split("").join(" ") ?? ""}`.trim();
    const announcement = new SpeechSynthesisUtterance(`Nomor order ${spokenNumber}, atas nama ${name || "pelanggan"}, silakan menuju kasir.`);
    announcement.lang = "id-ID";
    announcement.rate = 0.82;
    announcement.pitch = 1;
    window.speechSynthesis.speak(announcement);
    notify(`Memanggil ${orderNumber} dengan suara.`);
  }

  function announceQueueOrder(orderNumber: string, name: string) {
    announceOrder(orderNumber, name);
    setKitchenOrders((current) => current.map((order) => order.number === orderNumber && order.status === "ready"
      ? { ...order, status: "called", time: "dipanggil" }
      : order));
    notify(`${orderNumber} dipindahkan ke status sudah dipanggil.`);
  }

  function refundOrder(orderNumber: string, reason: string) {
    const order = completedOrders.find((item) => item.number === orderNumber);
    if (!order || order.status === "refunded") {
      notify("Transaksi ini sudah direfund atau tidak ditemukan.");
      return;
    }
    setCompletedOrders((current) => current.map((item) => item.number === orderNumber
      ? { ...item, status: "refunded", refundReason: reason }
      : item));
    setRefundOpen(false);
    notify(`${orderNumber} berhasil direfund · ${formatRupiah(order.total)} dikembalikan.`);
  }

  function startNewOrder() {
    setCart([]);
    setOrderNote("");
    setServiceArea("Lantai 1");
    setAppliedVoucher("");
    setVoucher("");
    setCustomerName("");
    setFulfillment("Dine in");
    setTable("Meja 07");
    notify("Order baru siap diisi.");
  }

  function holdCurrentOrder() {
    if (!cart.length) {
      notify("Belum ada item untuk disimpan.");
      return;
    }
    const heldOrder: HeldOrder = {
      id: `T-${String(heldOrders.length + 1).padStart(2, "0")}`,
      cart,
      fulfillment,
      table,
      customerName,
      note: orderNote,
      serviceArea,
      total,
      createdAt: "Baru saja",
    };
    setHeldOrders((current) => [heldOrder, ...current]);
    startNewOrder();
    notify(`${heldOrder.id} disimpan dan siap dipanggil kembali.`);
  }

  function resumeHeldOrder(order: HeldOrder) {
    setCart(order.cart);
    setFulfillment(order.fulfillment);
    setTable(order.table);
    setCustomerName(order.customerName);
    setOrderNote(order.note);
    setServiceArea(order.serviceArea);
    setHeldOrders((current) => current.filter((item) => item.id !== order.id));
    setHeldOrdersOpen(false);
    notify(`${order.id} dipanggil kembali.`);
  }

  return (
    <Layout minimalChrome hideBottomNav>
      <SEO title="Nempo Kasir F&B — Nempo Organizer" description="Live preview POS kasir F&B Nempo untuk order, meja, pembayaran, dan laporan penjualan." keywords="kasir F&B, POS cafe, point of sale, aplikasi kasir restoran" path="/digital-services/kasir" />
      <main className="nempo-demo-green nempo-pos min-h-screen bg-[#f5f0e9] text-[#2f2925]">
        <div className="pos-shell mx-auto max-w-[1480px] px-2.5 pb-32 pt-2 sm:px-5 sm:pb-28 sm:pt-3 lg:px-7">
          <header className="pos-topbar flex flex-wrap items-center justify-between gap-2 border-b border-[#e5dbd0] bg-[#fbfaf7] px-2 py-2.5 sm:gap-3 sm:px-3 sm:py-3">
            <div className="min-w-0 flex items-center gap-2 sm:gap-3">
              <Link href="/digital-services" aria-label="Kembali ke Digi Nempo" className="grid h-9 w-9 place-items-center border border-[#dfd2c5] text-[#8c7768] transition-colors hover:border-[#ad7651] hover:bg-[#f5ede5] hover:text-[#805538]"><ArrowLeft className="h-4 w-4" /></Link>
               <div className="pos-brand-mark grid h-10 w-10 place-items-center bg-[#805538] text-[#fbfaf7]"><Store className="h-5 w-5" /></div>
              <div><p className="text-sm font-black tracking-tight text-[#2f2925]">Kopi Nempo</p><p className="mt-0.5 text-[10px] font-medium text-[#98877a]">Kasir utama · Garut</p></div>
              <span className="ml-1 hidden items-center gap-1.5 border-l border-[#dfd2c5] pl-3 text-[10px] font-bold text-[#47705d] sm:inline-flex"><Wifi className="h-3 w-3" /> Terhubung</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/digital-services/super-app" className="hidden items-center gap-1.5 border border-[#b9ded8] bg-[#f4fbfa] px-3 py-2 text-[10px] font-black text-[#0f766e] transition-colors hover:bg-[#e6f6f3] md:inline-flex">Business OS <ArrowRight className="h-3 w-3" /></Link>
              <div className="hidden items-center gap-2 px-3 py-2 text-[10px] font-semibold text-[#8c7768] md:flex"><Clock3 className="h-3.5 w-3.5 text-[#aa9686]" /> Shift pagi · 08:00–16:00</div>
              <button type="button" onClick={() => notify("Tidak ada notifikasi baru.")} aria-label="Notifikasi" className="grid h-9 w-9 place-items-center border border-[#dfd2c5] text-[#8c7768] hover:bg-[#f5ede5] hover:text-[#805538]"><Bell className="h-4 w-4" /></button>
              <button type="button" onClick={() => notify("Pengaturan demo belum tersedia.")} aria-label="Pengaturan" className="grid h-9 w-9 place-items-center border border-[#dfd2c5] text-[#8c7768] hover:bg-[#f5ede5] hover:text-[#805538]"><Settings2 className="h-4 w-4" /></button>
              <div className="hidden items-center gap-2 border-l border-[#dfd2c5] pl-3 sm:flex"><CircleUserRound className="h-5 w-5 text-[#aa9686]" /><span className="text-[11px] font-bold text-[#66564c]">Ayu · Kasir</span></div>
            </div>
          </header>

          <div className="pos-integration-strip mt-3 flex flex-col justify-between gap-3 border border-[#b9ded8] bg-[#e6f6f3] px-4 py-3 sm:flex-row sm:items-center sm:px-5">
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#0f766e] text-white"><ReceiptText className="h-3.5 w-3.5" /></span>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-[#183b43]">Kasir terhubung ke Business OS</p>
                <p className="mt-0.5 text-[10px] leading-4 text-[#5d7d80]">Order, omzet, antrian dapur, kapasitas meja, dan stok menu tersinkron dalam satu workspace.</p>
              </div>
            </div>
            <Link href="/digital-services/super-app" className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-black text-[#0f766e] hover:text-[#0b625c]">Lihat ringkasan bisnis <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>

           <OperationsOverview products={productsWithInventory} orders={kitchenOrders} queueFilter={queueFilter} onQueueFilter={setQueueFilter} onAnnounce={announceQueueOrder} onUsePromo={useQuickPromo} />

            <div className="pos-page-heading mb-3 mt-4 flex flex-wrap items-end justify-between gap-3 sm:mb-4 sm:mt-5">
             <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9b6240]">Meja kasir</p><h1 className="mt-1 text-2xl font-black tracking-tight text-[#2f2925] sm:text-3xl">Penjualan</h1><p className="mt-1 text-xs text-[#8c7768]">Susun pesanan, teruskan ke dapur, lalu selesaikan pembayaran.</p></div>
             <div className="flex w-full items-center gap-2 sm:w-auto">
               <button type="button" onClick={() => setHeldOrdersOpen(true)} className="relative hidden items-center gap-2 border border-[#dfd2c5] bg-[#fbfaf7] px-3 py-2.5 text-xs font-bold text-[#66564c] hover:border-[#bd8a68] hover:text-[#805538] sm:inline-flex"><History className="h-4 w-4" /> Tersimpan {heldOrders.length > 0 && <span className="grid h-5 min-w-5 place-items-center bg-[#f0dfd0] px-1 text-[10px] text-[#805538]">{heldOrders.length}</span>}</button>
               {lastOrderNumber && <button type="button" onClick={() => announceOrder(lastOrderNumber, lastCustomerName)} className="hidden items-center gap-2 border border-[#cfe0d4] bg-[#eef6f0] px-3 py-2.5 text-xs font-bold text-[#47705d] hover:bg-[#e3f0e6] sm:inline-flex"><Volume2 className="h-4 w-4" /> Panggil {lastOrderNumber}</button>}
                 <button type="button" onClick={() => setRefundOpen(true)} className="inline-flex items-center gap-2 border border-[#e2c5b7] bg-[#fff8f5] px-3 py-2.5 text-xs font-bold text-[#a65d4c] hover:border-[#c98b76] hover:bg-[#fdf0eb]"><RotateCcw className="h-4 w-4" /> <span className="hidden sm:inline">Refund</span></button>
               <button type="button" onClick={startNewOrder} className="inline-flex items-center gap-2 bg-[#805538] px-3 py-2.5 text-xs font-bold text-[#fffaf5] hover:bg-[#6f472f]"><Plus className="h-4 w-4" /> Order baru</button>
            </div>
          </div>

            <div className="pos-metrics mb-3 grid grid-cols-2 gap-2.5 sm:mb-4 sm:gap-3 lg:grid-cols-4">
             <MetricCard icon={Receipt} label="Order hari ini" value="24" detail="+12% dari kemarin" tone="orange" />
             <MetricCard icon={Banknote} label="Penjualan" value="Rp1,28 jt" detail="Update 14:32" tone="green" />
             <MetricCard icon={ChefHat} label="Perlu diproses" value="4 order" detail="Barista & dapur" tone="purple" />
             <MetricCard icon={ClipboardList} label="Meja terisi" value="7 / 12" detail="58% kapasitas" tone="blue" />
          </div>

            <div className="pos-workspace grid items-start gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_370px]">
              <section className="pos-menu-panel min-w-0 border border-[#dfd2c5] bg-[#fbfaf7] shadow-[0_1px_3px_rgba(83,56,39,0.05)]">
               <div className="flex flex-col gap-4 border-b border-[#eee5dc] px-4 py-4 sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                   <div><h2 className="text-base font-black text-[#392d27]">Pilih menu</h2><p className="mt-1 text-[11px] text-[#9b8778]">Klik produk untuk menambahkan ke transaksi.</p></div>
                   <label className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a58e7d]" /><span className="sr-only">Cari menu</span><input data-pos-search value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama menu..." className="w-full border border-[#dfd2c5] bg-[#f8f4ef] py-2.5 pl-9 pr-3 text-xs outline-none transition-colors placeholder:text-[#b4a293] focus:border-[#9b6240] focus:bg-[#fffdf9] focus:ring-2 focus:ring-[#c99e78]/25" /></label>
                </div>
                 <nav className="flex gap-1.5 overflow-x-auto">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 px-3 py-2 text-[11px] font-bold transition-colors ${category === item ? "bg-[#4b3428] text-[#fffaf5]" : "text-[#8c7768] hover:bg-[#f3e9df] hover:text-[#59483e]"}`}>{item}</button>)}</nav>
              </div>
               <div className="p-3 sm:p-5">
                 <div className="mb-3 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9b8778]">{visibleProducts.length} menu tersedia</p><span className="hidden items-center gap-1 text-[10px] text-[#9b8778] sm:inline-flex"><Calculator className="h-3.5 w-3.5" /> Harga sudah termasuk pajak</span></div>
                 <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 xl:grid-cols-4">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onDetails={() => setSelectedProduct(product)} onAdd={() => addQuick(product)} />)}</div>
                {visibleProducts.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-400">Menu yang kamu cari belum tersedia.</div>}
              </div>
            </section>

           <PosOrderPanel cart={cart} subtotal={subtotal} discount={discount} tax={tax} total={total} voucher={voucher} appliedVoucher={appliedVoucher} orderNote={orderNote} serviceArea={serviceArea} customerName={customerName} fulfillment={fulfillment} table={table} onChangeQuantity={updateQuantity} onRemove={removeItem} onVoucher={setVoucher} onApplyVoucher={applyVoucher} onNote={setOrderNote} onServiceArea={setServiceArea} onCustomerName={setCustomerName} onFulfillment={setFulfillment} onTable={setTable} onClear={() => { setCart([]); setOrderNote(""); notify("Pesanan dikosongkan."); }} onCheckout={() => { if (cart.length) setPaymentOpen(true); else notify("Tambahkan menu terlebih dahulu."); }} onHelp={() => notify("Kasir online. Tim Kopi Nempo siap membantu.")} onNewOrder={startNewOrder} onHoldOrder={holdCurrentOrder} onOpenHeld={() => setHeldOrdersOpen(true)} heldCount={heldOrders.length} />
          </div>
        </div>
      </main>

       <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.25rem)] max-w-xl -translate-x-1/2 sm:bottom-5 sm:w-[calc(100%-2rem)] lg:hidden">
         <button type="button" onClick={() => setCartOpen(true)} className="flex w-full items-center justify-between gap-4 bg-[#4b3428] px-4 py-3.5 text-left text-[#fffaf5] shadow-2xl shadow-[#4b3428]/20 transition-transform hover:-translate-y-0.5 sm:px-5"><span className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center bg-[#c58d62] text-[#fffaf5]"><ShoppingBag className="h-4 w-4" /></span><span><span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#e3cfc0]">Pesananmu</span><span className="mt-0.5 block text-xs font-extrabold">{itemCount} item · {fulfillment}{fulfillment === "Dine in" ? ` · ${table}` : ""}</span></span></span><span className="flex items-center gap-3"><span className="text-sm font-black text-[#e7bd96]">{formatRupiah(total)}</span><span className="grid h-8 w-8 place-items-center bg-white/10"><ArrowRight className="h-4 w-4" /></span></span></button>
      </div>

      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={(variant, price, quantity) => { addItem(selectedProduct, variant, price, quantity); setSelectedProduct(null); }} />}
       {cartOpen && <CartDrawer cart={cart} subtotal={subtotal} discount={discount} tax={tax} total={total} voucher={voucher} appliedVoucher={appliedVoucher} customerName={customerName} fulfillment={fulfillment} table={table} serviceArea={serviceArea} onClose={() => setCartOpen(false)} onChangeQuantity={updateQuantity} onRemove={removeItem} onVoucher={setVoucher} onApplyVoucher={applyVoucher} onCustomerName={setCustomerName} onFulfillment={setFulfillment} onTable={setTable} onServiceArea={setServiceArea} onClear={() => { setCart([]); notify("Pesanan dikosongkan."); }} onCheckout={() => { if (cart.length) setPaymentOpen(true); else notify("Tambahkan menu terlebih dahulu."); }} />}
      {paymentOpen && <PaymentModal total={total} onClose={() => setPaymentOpen(false)} onConfirm={completePayment} />}
      {successOrder && <SuccessModal orderNumber={successOrder.number} customerName={successOrder.customerName} fulfillment={fulfillment} onClose={() => setSuccessOrder(null)} onAnnounce={() => announceOrder(successOrder.number, successOrder.customerName)} onOrderAgain={() => { setSuccessOrder(null); setCategory("Semua menu"); }} />}
      {refundOpen && <RefundModal orders={completedOrders} onClose={() => setRefundOpen(false)} onRefund={refundOrder} />}
      {heldOrdersOpen && <HeldOrdersModal orders={heldOrders} onClose={() => setHeldOrdersOpen(false)} onResume={resumeHeldOrder} onDelete={(id) => { setHeldOrders((current) => current.filter((order) => order.id !== id)); notify("Order tersimpan dihapus."); }} />}
       {toast && <div role="status" className="fixed bottom-24 left-1/2 z-[80] max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2.5 text-center text-xs font-bold text-white shadow-xl">{toast}</div>}
    </Layout>
  );
}

function OperationsOverview({ products, orders, queueFilter, onQueueFilter, onAnnounce, onUsePromo }: { products: Product[]; orders: KitchenOrder[]; queueFilter: QueueFilter; onQueueFilter: (filter: QueueFilter) => void; onAnnounce: (orderNumber: string, customerName: string) => void; onUsePromo: () => void }) {
  const [queueQuery, setQueueQuery] = useState("");
  const normalizedQuery = queueQuery.trim().toLowerCase();
  const visibleOrders = orders
    .filter((order) => order.status === queueFilter)
    .filter((order) => !normalizedQuery || order.number.toLowerCase().includes(normalizedQuery) || order.customerName.toLowerCase().includes(normalizedQuery));
  const processingCount = orders.filter((order) => order.status === "processing").length;
  const readyCount = orders.filter((order) => order.status === "ready").length;
  const calledCount = orders.filter((order) => order.status === "called").length;
  const lowStock = products.filter((product) => product.stock <= 5);

   return <section className="pos-operations mt-4 grid gap-3 lg:grid-cols-[1.42fr_.88fr]">
     <div className="pos-queue overflow-hidden border border-[#d9c8b8] bg-[#eee3d7] p-4 text-[#392d27] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
         <div><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center bg-[#805538] text-[#fffaf5]"><ClipboardList className="h-3.5 w-3.5" /></span><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#805538]">Layar antrian</p></div><h2 className="mt-2 text-xl font-black tracking-tight">Pesanan dapur</h2><p className="mt-1 text-[11px] text-[#846f61]">Cari nomor order atau nama pemesan.</p></div>
         <div className="flex items-center gap-1.5 border-l-2 border-[#6f947b] pl-2.5 text-[10px] font-bold text-[#47705d]"><span className="h-1.5 w-1.5 bg-[#47705d]" /> Dapur aktif</div>
      </div>
       <label className="relative mt-4 block"><Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a58e7d]" /><span className="sr-only">Cari nomor order atau nama pemesan</span><input value={queueQuery} onChange={(event) => setQueueQuery(event.target.value)} placeholder="Cari KP-0251 atau nama pemesan..." className="w-full border border-[#d7c5b4] bg-[#fbfaf7] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#392d27] outline-none placeholder:text-[#b4a293] focus:border-[#9b6240] focus:ring-2 focus:ring-[#c99e78]/25" /></label>
        <div className="mt-4 flex gap-1.5 overflow-x-auto border-b border-[#d9c8b8] pb-3">{([{ key: "processing", label: "Diproses", count: processingCount }, { key: "ready", label: "Sudah beres", count: readyCount }, { key: "called", label: "Sudah dipanggil", count: calledCount }] as { key: QueueFilter; label: string; count: number }[]).map((filter) => <button type="button" key={filter.key} onClick={() => onQueueFilter(filter.key)} className={`shrink-0 px-3 py-2 text-[10px] font-bold transition-colors ${queueFilter === filter.key ? "border-b-2 border-[#805538] text-[#805538]" : "text-[#9a8576] hover:text-[#5a4438]"}`}>{filter.label} <span className={`ml-1 px-1.5 py-0.5 text-[9px] ${queueFilter === filter.key ? "bg-[#dfc8b4] text-[#805538]" : "bg-[#e5d7ca] text-[#9a8576]"}`}>{filter.count}</span></button>)}</div>
       {visibleOrders.length === 0 ? <div className="mt-3 grid min-h-24 place-items-center border border-dashed border-[#d1bcaa] px-4 text-center text-[11px] text-[#988273]">{normalizedQuery ? "Order dengan nama atau nomor tersebut tidak ditemukan." : "Belum ada pesanan di status ini."}</div> : <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{visibleOrders.map((order) => { const statusLabel = order.status === "called" ? "Sudah dipanggil" : order.status === "ready" ? "Sudah beres" : "Sedang diproses"; const statusTone = order.status === "called" ? "text-[#667085]" : order.status === "ready" ? "text-[#47705d]" : "text-[#9b6b31]"; const cardTone = order.status === "called" ? "border-[#cbd2dc] bg-[#f4f6f8]" : order.status === "ready" ? "border-[#b8d2bf] bg-[#f1f7f1]" : "border-[#dfc9a9] bg-[#f8f1e7]"; return <div key={order.number} className={`min-w-0 border p-3 ${cardTone}`}><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-sm font-black tracking-tight">{order.number}</p><p className="mt-1 truncate text-[11px] font-bold text-[#59483e]">Atas nama {order.customerName}</p><p className={`mt-1 text-[9px] font-black uppercase tracking-[0.1em] ${statusTone}`}>{statusLabel}</p></div><span className="shrink-0 text-[9px] text-[#a18d7e]">{order.time}</span></div><div className="mt-3 flex min-w-0 items-center justify-between gap-2 text-[9px] text-[#8e7b6d]"><span className="min-w-0 truncate">{order.detail}</span>{order.status === "ready" && <button type="button" onClick={() => onAnnounce(order.number, order.customerName)} aria-label={`Panggil ${order.number} atas nama ${order.customerName}`} className="inline-flex shrink-0 items-center gap-1 bg-[#e1eee3] px-2 py-1.5 font-bold text-[#47705d] hover:bg-[#d2e6d7]"><Volume2 className="h-3 w-3" /> Panggil</button>}{order.status === "called" && <span className="inline-flex shrink-0 items-center gap-1 font-bold text-[#667085]"><Check className="h-3 w-3" /> Selesai</span>}</div></div>; })}</div>}
    </div>
     <div className="pos-ops-side grid grid-cols-2 gap-3">
      <div className="border border-[#dfd2c5] bg-[#fbfaf7] p-4"><div className="flex items-center justify-between"><span className="grid h-8 w-8 place-items-center bg-[#f6e7e2] text-[#a65d4c]"><ShoppingBag className="h-4 w-4" /></span><span className="border-l-2 border-[#bd7965] pl-2 text-[9px] font-black text-[#a65d4c]">Perhatian</span></div><p className="mt-3 text-[10px] font-bold text-[#9b8778]">Menu habis / menipis</p><p className="mt-1 text-lg font-black text-[#392d27]">{lowStock.length} menu</p><div className="mt-2 space-y-1">{lowStock.slice(0, 2).map((product) => <p key={product.id} className="truncate text-[10px] font-semibold text-[#a65d4c]">{product.name} · sisa {product.stock}</p>)}</div></div>
      <div className="border border-[#dfd2c5] bg-[#fbfaf7] p-4"><div className="flex items-center justify-between"><span className="grid h-8 w-8 place-items-center bg-[#e8eee8] text-[#47705d]"><ClipboardList className="h-4 w-4" /></span><span className="text-[9px] font-bold text-[#9b8778]">Kapasitas</span></div><p className="mt-3 text-[10px] font-bold text-[#9b8778]">Meja tersedia</p><p className="mt-1 text-lg font-black text-[#392d27]">5 meja</p><p className="mt-2 text-[10px] font-semibold text-[#47705d]">18 kursi masih kosong</p><div className="mt-2 h-1.5 overflow-hidden bg-[#e8dfd6]"><div className="h-full w-[58%] bg-[#6f947b]" /></div></div>
      <div className="col-span-2 flex items-center justify-between gap-3 border border-[#dfd2c5] bg-[#f5ede5] p-4"><div className="flex min-w-0 items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center bg-[#d6b393] text-[#5a3826]"><Tag className="h-4 w-4" /></span><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#805538]">Promo aktif hari ini</p><p className="mt-1 truncate text-xs font-black text-[#4a3930]">NEMPO10 · Diskon 10% untuk semua menu</p><p className="mt-1 text-[10px] text-[#8e7869]">Sudah dipakai 17 kali di shift ini</p></div></div><button type="button" onClick={onUsePromo} className="shrink-0 border border-[#b98b6b] bg-[#805538] px-3 py-2 text-[10px] font-black text-[#fffaf5] hover:bg-[#6f472f]">Pakai promo</button></div>
    </div>
  </section>;
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: typeof Receipt; label: string; value: string; detail: string; tone: "orange" | "green" | "purple" | "blue" }) {
  const tones = {
    orange: "bg-[#f4e5d8] text-[#805538]",
    green: "bg-[#e6efe7] text-[#47705d]",
    purple: "bg-[#eee6df] text-[#765d4d]",
    blue: "bg-[#e5ecec] text-[#4f716f]",
  };
   return <div className="pos-metric-card border border-[#dfd2c5] bg-[#fbfaf7] p-3.5 shadow-[0_1px_3px_rgba(83,56,39,0.04)] sm:p-4"><div className="flex items-start justify-between gap-2"><span className={`grid h-8 w-8 place-items-center ${tones[tone]}`}><Icon className="h-4 w-4" /></span><span className="hidden text-[9px] font-bold text-[#b1a094] sm:block">SHIFT HARI INI</span></div><p className="mt-3 text-[10px] font-bold text-[#9b8778]">{label}</p><p className="mt-1 text-base font-black tracking-tight text-[#392d27] sm:text-lg">{value}</p><p className="mt-1 truncate text-[10px] font-semibold text-[#47705d]">{detail}</p></div>;
}

function PosOrderPanel({ cart, subtotal, discount, tax, total, voucher, appliedVoucher, orderNote, serviceArea, customerName, fulfillment, table, onChangeQuantity, onRemove, onVoucher, onApplyVoucher, onNote, onServiceArea, onCustomerName, onFulfillment, onTable, onClear, onCheckout, onHelp, onNewOrder, onHoldOrder, onOpenHeld, heldCount }: { cart: CartItem[]; subtotal: number; discount: number; tax: number; total: number; voucher: string; appliedVoucher: string; orderNote: string; serviceArea: string; customerName: string; fulfillment: Fulfillment; table: string; onChangeQuantity: (key: string, amount: number) => void; onRemove: (key: string) => void; onVoucher: (value: string) => void; onApplyVoucher: (event: FormEvent<HTMLFormElement>) => void; onNote: (value: string) => void; onServiceArea: (value: string) => void; onCustomerName: (value: string) => void; onFulfillment: (value: Fulfillment) => void; onTable: (value: string) => void; onClear: () => void; onCheckout: () => void; onHelp: () => void; onNewOrder: () => void; onHoldOrder: () => void; onOpenHeld: () => void; heldCount: number }) {
   return <aside className="pos-order-panel flex min-h-[420px] flex-col overflow-hidden border border-[#dfd2c5] bg-[#fbfaf7] shadow-[0_1px_3px_rgba(83,56,39,0.05)] sm:min-h-[620px] lg:sticky lg:top-4">
    <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-orange-600">Transaksi baru</p><h2 className="mt-1 text-lg font-black text-slate-900">Pesanan saat ini</h2></div>
      <div className="flex items-center gap-1"><button type="button" onClick={onHelp} aria-label="Bantuan" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-orange-600"><HelpCircle className="h-4 w-4" /></button><button type="button" onClick={onClear} disabled={!cart.length} aria-label="Kosongkan pesanan" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button><button type="button" onClick={onHelp} aria-label="Menu lainnya" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-50"><MoreHorizontal className="h-4 w-4" /></button></div>
    </header>
    <div className="flex-1 overflow-y-auto p-5">
      <div className="mb-4 grid grid-cols-3 gap-2"><button type="button" onClick={onNewOrder} className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-[10px] font-bold text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"><Plus className="h-4 w-4" />Order baru</button><button type="button" onClick={onHoldOrder} className="relative flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-[10px] font-bold text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"><PauseCircle className="h-4 w-4" />Simpan{heldCount > 0 && <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-orange-500 px-1 text-[8px] text-white">{heldCount}</span>}</button><button type="button" onClick={onOpenHeld} className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-[10px] font-bold text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"><History className="h-4 w-4" />Panggil order</button></div>
      <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-orange-100 text-orange-600"><ReceiptText className="h-3.5 w-3.5" /></span><div><p className="text-[10px] font-bold text-slate-400">Nomor order</p><p className="text-xs font-black text-slate-700">Draft · KP-0250</p></div></div><span className="text-[10px] font-bold text-emerald-600">Belum dibayar</span></div>
      <label className="mb-4 block"><span className="mb-1.5 block text-[10px] font-bold text-slate-400">Atas nama</span><input value={customerName} onChange={(event) => onCustomerName(event.target.value)} placeholder="Nama pelanggan" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none transition-colors placeholder:text-slate-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100" /></label>
      <div className="space-y-3">
        {cart.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 px-4 py-12 text-center text-xs leading-5 text-slate-400">Belum ada item.<br />Pilih menu di sebelah kiri.</div> : cart.map((item) => <div key={item.key} className="flex gap-3 border-b border-slate-100 pb-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange-50 text-[10px] font-black text-orange-700">{item.name.slice(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-extrabold text-slate-800">{item.name}</p><p className="mt-0.5 text-[10px] text-slate-400">{item.variant} · {formatRupiah(item.price)}</p><div className="mt-2 flex items-center gap-2"><button type="button" onClick={() => onChangeQuantity(item.key, -1)} className="grid h-6 w-6 place-items-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"><Minus className="h-3 w-3" /></button><span className="min-w-4 text-center text-xs font-bold">{item.quantity}</span><button type="button" onClick={() => onChangeQuantity(item.key, 1)} className="grid h-6 w-6 place-items-center rounded-md bg-orange-50 text-orange-600 hover:bg-orange-100"><Plus className="h-3 w-3" /></button></div></div><div className="text-right"><p className="text-xs font-extrabold text-slate-800">{formatRupiah(item.price * item.quantity)}</p><button type="button" onClick={() => onRemove(item.key)} className="mt-2 text-[10px] font-bold text-slate-400 hover:text-red-500">Hapus</button></div></div>)}
      </div>
      <div className="mt-5 rounded-xl border border-slate-100 p-3"><div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Tipe pesanan</p><span className="text-[10px] text-slate-400">Wajib diisi</span></div><div className="flex gap-2"><button type="button" onClick={() => onFulfillment("Dine in")} className={`flex-1 rounded-lg px-2 py-2.5 text-[11px] font-bold ${fulfillment === "Dine in" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500"}`}><Utensils className="mr-1 inline h-3.5 w-3.5" /> Dine in</button><button type="button" onClick={() => onFulfillment("Takeaway")} className={`flex-1 rounded-lg px-2 py-2.5 text-[11px] font-bold ${fulfillment === "Takeaway" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500"}`}><ShoppingBag className="mr-1 inline h-3.5 w-3.5" /> Takeaway</button></div>{fulfillment === "Dine in" && <label className="relative mt-2 block"><span className="sr-only">Pilih meja</span><select value={table} onChange={(event) => onTable(event.target.value)} className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 outline-none focus:border-orange-400"><option>Meja 07</option><option>Meja 03</option><option>Meja 12</option><option>Meja 15</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 text-slate-400" /></label>}</div>
       <label className="mt-3 block"><span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400"><MessageSquareText className="h-3.5 w-3.5" /> Catatan dapur</span><textarea value={orderNote} onChange={(event) => onNote(event.target.value)} placeholder="Contoh: less ice, pisahkan saus..." rows={2} className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none focus:border-orange-400 focus:bg-white" /></label>
       <label className="mt-3 block"><span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400"><MapPin className="h-3.5 w-3.5" /> Area layanan</span><select value={serviceArea} onChange={(event) => onServiceArea(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-orange-400 focus:bg-white">{serviceAreas.map((area) => <option key={area}>{area}</option>)}</select></label>
      <form onSubmit={onApplyVoucher} className="mt-4 flex gap-2"><input value={voucher} onChange={(event) => onVoucher(event.target.value)} placeholder="Tambah kode promo" className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none focus:border-orange-400 focus:bg-white" /><button type="submit" className="rounded-lg border border-slate-200 px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:border-orange-200 hover:text-orange-600">Pakai</button></form>{appliedVoucher && <p className="mt-2 text-[11px] font-bold text-emerald-600">NEMPO10 aktif · hemat {formatRupiah(discount)}</p>}
    </div>
    <footer className="border-t border-slate-100 bg-slate-50/60 p-5"><div className="space-y-2 text-xs"><div className="flex justify-between text-slate-400"><span>Subtotal</span><span>{formatRupiah(subtotal)}</span></div><div className="flex justify-between text-slate-400"><span>Diskon</span><span className="text-emerald-600">-{formatRupiah(discount)}</span></div><div className="flex justify-between text-slate-400"><span>Pajak layanan 10%</span><span>{formatRupiah(tax)}</span></div><div className="mt-2 flex justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-900"><span>Total</span><span className="text-orange-600">{formatRupiah(total)}</span></div></div><div className="mt-4 grid grid-cols-[auto_1fr] gap-2"><button type="button" onClick={onHelp} aria-label="Cetak pesanan" className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-orange-200 hover:text-orange-600"><Printer className="h-4 w-4" /></button><button type="button" onClick={onCheckout} disabled={!cart.length} className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-xs font-black text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"><Banknote className="h-4 w-4" /> Proses pembayaran</button></div></footer>
  </aside>;
}

function HeldOrdersModal({ orders, onClose, onResume, onDelete }: { orders: HeldOrder[]; onClose: () => void; onResume: (order: HeldOrder) => void; onDelete: (id: string) => void }) {
  return <ModalShell title="Order tersimpan" description="Panggil kembali transaksi yang belum selesai untuk dilanjutkan." onClose={onClose}><div className="p-5">{orders.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center"><History className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-bold text-slate-600">Belum ada order tersimpan</p><p className="mt-1 text-xs text-slate-400">Gunakan tombol Simpan saat pelanggan masih memilih.</p></div> : <div className="space-y-2">{orders.map((order) => <div key={order.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange-50 text-orange-600"><PauseCircle className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="text-xs font-black text-slate-800">{order.id}</p><span className="text-[10px] text-slate-400">{order.createdAt}</span></div><p className="mt-1 truncate text-[11px] text-slate-500">{order.cart.reduce((sum, item) => sum + item.quantity, 0)} item · {order.fulfillment}{order.fulfillment === "Dine in" ? ` · ${order.table}` : ""}</p><p className="mt-1 text-xs font-black text-orange-600">{formatRupiah(order.total)}</p></div><div className="flex shrink-0 flex-col gap-1.5"><button type="button" onClick={() => onResume(order)} className="rounded-lg bg-slate-900 px-3 py-2 text-[10px] font-bold text-white hover:bg-slate-800">Panggil</button><button type="button" onClick={() => onDelete(order.id)} className="rounded-lg px-3 py-1 text-[10px] font-bold text-slate-400 hover:bg-red-50 hover:text-red-500">Hapus</button></div></div>)}</div>}</div></ModalShell>;
}

function ProductCard({ product, onDetails, onAdd }: { product: Product; onDetails: () => void; onAdd: () => void }) {
  const stockTone = product.stock === 0 ? "text-[#a65d4c]" : product.stock <= 5 ? "text-[#9b6b31]" : "text-[#47705d]";
  return <article className="group overflow-hidden border border-[#dfd2c5] bg-[#fbfaf7] transition-shadow hover:border-[#bd8a68] hover:shadow-[0_4px_14px_rgba(83,56,39,0.10)]"><button type="button" onClick={onDetails} className="relative block w-full text-left"><div className={`relative grid h-24 place-items-center overflow-hidden ${product.color}`}><span className="relative font-mono text-2xl font-bold tracking-tight text-white/80">{product.mark}</span>{product.badge && <span className="absolute left-2.5 top-2.5 border border-white/30 bg-black/10 px-2 py-1 text-[9px] font-black text-white">{product.badge}</span>}</div><div className="p-3 pb-1"><p className="truncate text-xs font-extrabold text-[#59483e]">{product.name}</p><p className="mt-1 h-8 overflow-hidden text-[10px] leading-relaxed text-[#9b8778]">{product.description}</p><div className="mt-2 flex items-center justify-between gap-2 text-[9px] font-bold"><span className={stockTone}>{product.stock === 0 ? "Habis" : `Sisa ${product.stock}`}</span><span className="text-[#9b8778]">Terjual {product.soldToday}</span></div></div></button><div className="flex items-center justify-between gap-2 p-3 pt-2"><span className="text-xs font-black text-[#805538]">{formatRupiah(product.price)}</span><button type="button" onClick={onAdd} disabled={!product.stock} className="grid h-8 w-8 place-items-center bg-[#805538] text-[#fffaf5] shadow-sm transition-colors hover:bg-[#6f472f] disabled:cursor-not-allowed disabled:bg-[#d6c9be]"><Plus className="h-4 w-4" /></button></div></article>;
}

function ModalShell({ title, description, onClose, children }: { title: string; description: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-[#392d27]/45 p-3 backdrop-blur-sm sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div role="dialog" aria-modal="true" className="max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto border border-[#dfd2c5] bg-[#fbfaf7] shadow-2xl sm:max-h-[calc(100dvh-2rem)]"><div className="flex items-start justify-between gap-3 border-b border-[#eee5dc] px-4 py-3.5 sm:px-5 sm:py-4"><div className="min-w-0"><h2 className="text-base font-extrabold text-[#392d27]">{title}</h2><p className="mt-1 text-xs leading-relaxed text-[#9b8778]">{description}</p></div><button type="button" onClick={onClose} aria-label="Tutup" className="shrink-0 p-1.5 text-[#9b8778] hover:bg-[#f3e9df] hover:text-[#59483e]"><X className="h-4 w-4" /></button></div>{children}</div></div>;
}

function ProductDetailModal({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (variant: string, price: number, quantity: number) => void }) {
  const [size, setSize] = useState("Regular");
  const [extraShot, setExtraShot] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const sizePrice = size === "Large" ? 6000 : size === "Medium" ? 3000 : 0;
  const price = product.price + sizePrice + (extraShot ? 7000 : 0);
  return <ModalShell title={product.name} description={product.description} onClose={onClose}><div className="p-4 sm:p-5"><div className={`grid h-28 place-items-center rounded-2xl ${product.color} text-4xl font-black text-white/75 sm:h-36`}>{product.mark}</div><div className="mt-4"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-600">Pilih ukuran</p><div className="mt-2 grid grid-cols-3 gap-2">{["Regular", "Medium", "Large"].map((item) => <button type="button" key={item} onClick={() => setSize(item)} className={`rounded-xl border px-2 py-2.5 text-xs font-bold ${size === item ? "border-orange-400 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-500"}`}>{item}<span className="mt-1 block text-[10px] font-normal">{item === "Regular" ? "Standar" : item === "Medium" ? "+ Rp3.000" : "+ Rp6.000"}</span></button>)}</div></div><label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-3"><span className="flex min-w-0 items-center gap-2 text-xs font-bold text-gray-700"><Tag className="h-4 w-4 shrink-0 text-orange-500" /> <span>Extra shot espresso <span className="font-normal text-gray-400">+ Rp7.000</span></span></span><input type="checkbox" checked={extraShot} onChange={(event) => setExtraShot(event.target.checked)} className="h-4 w-4 shrink-0 accent-orange-500" /></label><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-500"><Minus className="h-3.5 w-3.5" /></button><span className="min-w-6 text-center text-sm font-black">{quantity}</span><button type="button" onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))} className="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 text-orange-600"><Plus className="h-3.5 w-3.5" /></button></div><button type="button" onClick={() => onAdd(`${size}${extraShot ? " + Extra shot" : ""}`, price, quantity)} className="min-w-0 flex-1 rounded-xl bg-orange-500 px-3 py-3 text-xs font-black text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 sm:flex-none sm:px-4">Tambah · {formatRupiah(price * quantity)}</button></div></div></ModalShell>;
}

function CartDrawer({ cart, subtotal, discount, tax, total, voucher, appliedVoucher, customerName, fulfillment, table, serviceArea, onClose, onChangeQuantity, onRemove, onVoucher, onApplyVoucher, onCustomerName, onFulfillment, onTable, onServiceArea, onClear, onCheckout }: { cart: CartItem[]; subtotal: number; discount: number; tax: number; total: number; voucher: string; appliedVoucher: string; customerName: string; fulfillment: Fulfillment; table: string; serviceArea: string; onClose: () => void; onChangeQuantity: (key: string, amount: number) => void; onRemove: (key: string) => void; onVoucher: (value: string) => void; onApplyVoucher: (event: FormEvent<HTMLFormElement>) => void; onCustomerName: (value: string) => void; onFulfillment: (value: Fulfillment) => void; onTable: (value: string) => void; onServiceArea: (value: string) => void; onClear: () => void; onCheckout: () => void }) {
  return <div className="fixed inset-0 z-[60] bg-slate-900/45 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside role="dialog" aria-modal="true" className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-orange-100 px-5 py-4"><div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-orange-600">Ringkasan order</p><h2 className="mt-1 text-lg font-extrabold text-gray-900">Pesananmu</h2></div><button type="button" onClick={onClose} aria-label="Tutup pesanan" className="rounded-full p-2 text-gray-400 hover:bg-gray-100"><X className="h-4 w-4" /></button></header><div className="flex-1 overflow-y-auto p-5"><div className="space-y-3">{cart.length === 0 ? <div className="rounded-2xl border border-dashed border-orange-200 px-4 py-12 text-center text-sm text-gray-400">Pesanan masih kosong.<br />Pilih menu favoritmu dulu.</div> : cart.map((item) => <div key={item.key} className="flex gap-3 border-b border-orange-50 pb-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-100 text-xs font-black text-orange-700">{item.name.slice(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-extrabold text-gray-800">{item.name}</p><p className="mt-1 text-[10px] text-gray-400">{item.variant} · {formatRupiah(item.price)}</p><div className="mt-2 flex items-center gap-2"><button type="button" onClick={() => onChangeQuantity(item.key, -1)} className="grid h-6 w-6 place-items-center rounded-md border border-gray-200 text-gray-500"><Minus className="h-3 w-3" /></button><span className="min-w-4 text-center text-xs font-bold">{item.quantity}</span><button type="button" onClick={() => onChangeQuantity(item.key, 1)} className="grid h-6 w-6 place-items-center rounded-md bg-orange-50 text-orange-600"><Plus className="h-3 w-3" /></button></div></div><div className="text-right"><p className="text-xs font-extrabold text-gray-800">{formatRupiah(item.price * item.quantity)}</p><button type="button" onClick={() => onRemove(item.key)} className="mt-2 text-[10px] font-bold text-red-400 hover:text-red-600"><Trash2 className="mr-1 inline h-3 w-3" /> Hapus</button></div></div>)}</div><div className="mt-6 rounded-2xl bg-orange-50/70 p-3.5"><label className="block"><span className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-500">Atas nama</span><input value={customerName} onChange={(event) => onCustomerName(event.target.value)} placeholder="Nama pelanggan" className="mt-2 w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-orange-400" /></label><p className="mt-4 text-[10px] font-black uppercase tracking-[0.12em] text-gray-500">Pesanan untuk</p><div className="mt-2 flex gap-2"><button type="button" onClick={() => onFulfillment("Dine in")} className={`flex-1 rounded-xl px-2 py-2.5 text-xs font-bold ${fulfillment === "Dine in" ? "bg-orange-500 text-white" : "bg-white text-gray-500"}`}><Utensils className="mr-1 inline h-3.5 w-3.5" /> Dine in</button><button type="button" onClick={() => onFulfillment("Takeaway")} className={`flex-1 rounded-xl px-2 py-2.5 text-xs font-bold ${fulfillment === "Takeaway" ? "bg-orange-500 text-white" : "bg-white text-gray-500"}`}><ShoppingBag className="mr-1 inline h-3.5 w-3.5" /> Takeaway</button></div>{fulfillment === "Dine in" && <label className="relative mt-2 block"><span className="sr-only">Pilih meja</span><select value={table} onChange={(event) => onTable(event.target.value)} className="w-full appearance-none rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-xs font-bold text-gray-600 outline-none"><option>Meja 07</option><option>Meja 03</option><option>Meja 12</option><option>Meja 15</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" /></label>}<label className="relative mt-2 block"><span className="sr-only">Pilih area layanan</span><select value={serviceArea} onChange={(event) => onServiceArea(event.target.value)} className="w-full appearance-none rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-xs font-bold text-gray-600 outline-none"><option value="" disabled>Pilih area layanan</option>{serviceAreas.map((area) => <option key={area}>{area}</option>)}</select><MapPin className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 text-gray-400" /></label></div><form onSubmit={onApplyVoucher} className="mt-4 flex gap-2"><input value={voucher} onChange={(event) => onVoucher(event.target.value)} placeholder="Kode voucher" className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-orange-400" /><button type="submit" className="rounded-xl border border-orange-200 px-3 py-2.5 text-xs font-bold text-orange-600 hover:bg-orange-50">Pakai</button></form>{appliedVoucher && <p className="mt-2 text-[11px] font-bold text-emerald-600">Voucher NEMPO10 aktif · hemat {formatRupiah(discount)}</p>}</div><footer className="border-t border-orange-100 bg-white p-5"><div className="space-y-2 text-xs"><div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{formatRupiah(subtotal)}</span></div><div className="flex justify-between text-gray-400"><span>Diskon</span><span className="text-emerald-600">-{formatRupiah(discount)}</span></div><div className="flex justify-between text-gray-400"><span>Pajak layanan 10%</span><span>{formatRupiah(tax)}</span></div><div className="flex justify-between border-t border-orange-100 pt-3 text-base font-black text-gray-900"><span>Total</span><span className="text-orange-600">{formatRupiah(total)}</span></div></div><div className="mt-4 flex gap-2"><button type="button" onClick={onClear} disabled={!cart.length} className="rounded-xl border border-gray-200 px-3 py-3 text-xs font-bold text-gray-500 disabled:opacity-40">Kosongkan</button><button type="button" onClick={onCheckout} disabled={!cart.length} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-xs font-black text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"><CreditCard className="h-4 w-4" /> Lanjut bayar</button></div></footer></aside></div>;
}

function PaymentModal({ total, onClose, onConfirm }: { total: number; onClose: () => void; onConfirm: (method: string) => void }) {
  const [method, setMethod] = useState("QRIS");
  const [cashReceived, setCashReceived] = useState("");
  const received = Number(cashReceived.replace(/\D/g, "")) || 0;
  const change = Math.max(0, received - total);
  const cashReady = method !== "Cash" || received >= total;
  return <ModalShell title="Pilih pembayaran" description="Pilih metode pembayaran dan pastikan nominal cash sudah benar sebelum menyelesaikan pesanan." onClose={onClose}><div className="space-y-4 p-5"><div className="rounded-2xl bg-orange-50 p-4"><p className="text-xs font-bold text-gray-500">Total pembayaran</p><p className="mt-1 text-2xl font-black text-orange-600">{formatRupiah(total)}</p></div><div className="grid grid-cols-3 gap-2">{["Cash", "QRIS", "Transfer"].map((item) => <button type="button" key={item} onClick={() => setMethod(item)} className={`rounded-xl border px-2 py-3 text-xs font-bold ${method === item ? "border-orange-400 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}><CreditCard className="mx-auto mb-1 h-4 w-4" />{item}</button>)}</div>{method === "Cash" && <div className="rounded-xl border border-slate-200 p-3"><label className="block text-xs font-bold text-slate-600">Nominal cash diterima</label><div className="relative mt-2"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span><input autoFocus inputMode="numeric" value={cashReceived} onChange={(event) => setCashReceived(event.target.value.replace(/\D/g, ""))} placeholder="Masukkan nominal uang" aria-label="Nominal cash diterima" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-black outline-none focus:border-orange-400 focus:bg-white" /></div><div className="mt-2 flex flex-wrap gap-1.5">{[total, 50000, 100000, 200000].filter((amount, index, list) => amount >= total && list.indexOf(amount) === index).slice(0, 3).map((amount) => <button type="button" key={amount} onClick={() => setCashReceived(String(amount))} className="rounded-md bg-slate-50 px-2 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-orange-50 hover:text-orange-600">{formatRupiah(amount).replace("Rp", "Rp ")}</button>)}</div><div className={`mt-3 flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-black ${cashReady ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}><span>{cashReady ? "Kembalian" : "Uang masih kurang"}</span><span>{cashReady ? formatRupiah(change) : formatRupiah(total - received)}</span></div></div>}<button type="button" disabled={!cashReady} onClick={() => onConfirm(method)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-xs font-black text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"><Check className="h-4 w-4" /> Konfirmasi pembayaran</button></div></ModalShell>;
}

function SuccessModal({ orderNumber, customerName, fulfillment, onClose, onAnnounce, onOrderAgain }: { orderNumber: string; customerName: string; fulfillment: Fulfillment; onClose: () => void; onAnnounce: () => void; onOrderAgain: () => void }) {
  return <ModalShell title="Pesanan berhasil dibuat" description="Demo order sudah selesai dan siap diproses oleh barista." onClose={onClose}><div className="p-5 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check className="h-8 w-8" /></div><p className="mt-4 text-xs text-gray-400">Nomor pesanan</p><p className="mt-1 text-2xl font-black text-gray-900">{orderNumber}</p><p className="mt-2 text-xs font-bold text-gray-500">Atas nama {customerName}</p><div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-50 px-3 py-3 text-xs font-bold text-orange-700"><Clock3 className="h-4 w-4" /> Estimasi 10–15 menit · {fulfillment}</div><button type="button" onClick={onAnnounce} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-black text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"><Volume2 className="h-4 w-4" /> Panggil order dengan suara</button><div className="mt-2 grid grid-cols-2 gap-2"><button type="button" onClick={onClose} className="rounded-xl border border-gray-200 py-3 text-xs font-bold text-gray-500">Tutup</button><button type="button" onClick={onOrderAgain} className="rounded-xl bg-orange-500 py-3 text-xs font-bold text-white hover:bg-orange-600">Order lagi</button></div></div></ModalShell>;
}

function RefundModal({ orders, onClose, onRefund }: { orders: CompletedOrder[]; onClose: () => void; onRefund: (orderNumber: string, reason: string) => void }) {
  const [query, setQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<CompletedOrder | null>(null);
  const [reason, setReason] = useState("Pesanan dibatalkan");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleOrders = orders.filter((order) =>
    !normalizedQuery
      || order.number.toLowerCase().includes(normalizedQuery)
      || order.customerName.toLowerCase().includes(normalizedQuery),
  );

  return <ModalShell title="Refund transaksi" description="Pilih transaksi yang sudah dibayar untuk mengembalikan seluruh nominalnya." onClose={onClose}>
    <div className="p-5">
      <div className="flex items-center gap-2 border border-[#dfd2c5] bg-[#f8f4ef] px-3 py-2.5">
        <Search className="h-4 w-4 text-[#a58e7d]" />
        <label className="sr-only" htmlFor="refund-search">Cari transaksi</label>
        <input id="refund-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nomor order atau nama..." className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-[#59483e] outline-none placeholder:text-[#b4a293]" />
      </div>
      <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
        {visibleOrders.length === 0
          ? <div className="border border-dashed border-[#dfd2c5] px-4 py-10 text-center text-xs text-[#9b8778]">Transaksi tidak ditemukan.</div>
          : visibleOrders.map((order) => {
            const isRefunded = order.status === "refunded";
            const isSelected = selectedOrder?.number === order.number;
            return <div key={order.number} className={`border p-3 ${isSelected ? "border-[#bd8a68] bg-[#f8eee6]" : "border-[#dfd2c5] bg-[#fbfaf7]"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2"><p className="text-sm font-black text-[#392d27]">{order.number}</p><span className="text-[10px] text-[#a18d7e]">{order.createdAt}</span></div>
                  <p className="mt-1 truncate text-[11px] font-bold text-[#66564c]">Atas nama {order.customerName} · {order.itemCount} item</p>
                  <p className="mt-1 text-[10px] text-[#8c7768]">{order.method} · {formatRupiah(order.total)}</p>
                </div>
                <span className={`shrink-0 px-2 py-1 text-[9px] font-black uppercase tracking-wide ${isRefunded ? "bg-[#f6e7e2] text-[#a65d4c]" : "bg-[#e6efe7] text-[#47705d]"}`}>{isRefunded ? "Refunded" : "Dibayar"}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                {isRefunded
                  ? <p className="text-[10px] text-[#a65d4c]">Alasan: {order.refundReason}</p>
                  : <p className="text-[10px] text-[#9b8778]">Refund penuh</p>}
                {!isRefunded && <button type="button" onClick={() => setSelectedOrder(order)} className="border border-[#c98b76] bg-[#fff8f5] px-2.5 py-1.5 text-[10px] font-black text-[#a65d4c] hover:bg-[#fdf0eb]">{isSelected ? "Dipilih" : "Pilih refund"}</button>}
              </div>
            </div>;
          })}
      </div>
      {selectedOrder && <div className="mt-4 border border-[#e2c5b7] bg-[#fff8f5] p-4">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#a65d4c]">Konfirmasi refund</p><p className="mt-1 text-xs font-bold text-[#59483e]">{selectedOrder.number} · {selectedOrder.customerName}</p></div>
          <p className="text-sm font-black text-[#a65d4c]">{formatRupiah(selectedOrder.total)}</p>
        </div>
        <label className="mt-3 block"><span className="mb-1.5 block text-[10px] font-bold text-[#8c7768]">Alasan refund</span><select value={reason} onChange={(event) => setReason(event.target.value)} className="w-full border border-[#dfd2c5] bg-[#fbfaf7] px-3 py-2.5 text-xs font-semibold text-[#66564c] outline-none focus:border-[#bd8a68]"><option>Pesanan dibatalkan</option><option>Pesanan salah</option><option>Pembayaran ganda</option><option>Permintaan pelanggan</option></select></label>
        <div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => setSelectedOrder(null)} className="border border-[#dfd2c5] bg-[#fbfaf7] py-2.5 text-[11px] font-bold text-[#8c7768] hover:text-[#59483e]">Batal</button><button type="button" onClick={() => onRefund(selectedOrder.number, reason)} className="bg-[#a65d4c] py-2.5 text-[11px] font-black text-white hover:bg-[#8f4d3e]">Konfirmasi refund</button></div>
      </div>}
    </div>
  </ModalShell>;
}