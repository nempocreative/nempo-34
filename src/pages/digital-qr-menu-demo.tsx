import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import QRCode from "react-qr-code";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Copy,
  Eye,
  EyeOff,
  FileText,
  Filter,
  LayoutDashboard,
  ListOrdered,
  Lock,
  MoreHorizontal,
  Pencil,
  Plus,
  QrCode,
  RotateCcw,
  Search,
  Settings2,
  ShoppingBag,
  Sparkles,
  Store,
  Table2,
  Tag,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useRoute } from "@/lib/wouter";
import "./digital-demo-super-app.css";

type QrMenuView = "overview" | "menu" | "orders" | "tables" | "insights" | "customer";
type MenuCategory = "Paket hemat" | "Kopi" | "Minuman" | "Makanan" | "Snack";
type OrderStatus = "Baru" | "Diproses" | "Siap diantar" | "Selesai";

type MenuProduct = {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  sold: number;
  available: boolean;
  mark: string;
  tone: string;
  badge?: string;
};

type TableItem = {
  id: string;
  name: string;
  zone: string;
  status: "Kosong" | "Terisi";
  scans: number;
  orders: number;
};

type QrOrder = {
  id: string;
  table: string;
  customer: string;
  items: string;
  itemCount: number;
  total: number;
  time: string;
  status: OrderStatus;
};

const navItems: Array<{ id: QrMenuView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { id: "menu", label: "Menu digital", icon: UtensilsCrossed },
  { id: "orders", label: "Pesanan meja", icon: ListOrdered },
  { id: "tables", label: "QR meja", icon: QrCode },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

const categories: Array<"Semua" | MenuCategory> = ["Semua", "Paket hemat", "Kopi", "Minuman", "Makanan", "Snack"];

const initialProducts: MenuProduct[] = [
  { id: "kopi-susu", name: "Kopi Susu Gula Aren", category: "Kopi", price: 18000, description: "Espresso, susu segar, dan gula aren khas Kopi Nempo.", sold: 42, available: true, mark: "KS", tone: "bg-[#d7c0a5]", badge: "Favorit" },
  { id: "paket-ceria", name: "Paket Ceria Nempo", category: "Paket hemat", price: 39000, description: "Kopi susu, croissant, dan cookies untuk teman kerja.", sold: 28, available: true, mark: "PC", tone: "bg-[#9dd4cb]", badge: "Paling laris" },
  { id: "matcha", name: "Matcha Latte", category: "Minuman", price: 24000, description: "Matcha creamy dengan rasa earthy yang lembut.", sold: 18, available: true, mark: "ML", tone: "bg-[#b8c9a3]" },
  { id: "nasi-ayam", name: "Nasi Ayam Sambal", category: "Makanan", price: 28000, description: "Nasi hangat, ayam crispy, lalapan, dan sambal.", sold: 24, available: true, mark: "NA", tone: "bg-[#e7a475]" },
  { id: "croissant", name: "Croissant Butter", category: "Makanan", price: 22000, description: "Croissant flaky dengan butter premium.", sold: 16, available: true, mark: "CB", tone: "bg-[#f0c878]", badge: "Baru" },
  { id: "lemon-tea", name: "Fresh Lemon Tea", category: "Minuman", price: 16000, description: "Teh segar dengan lemon dan sedikit madu.", sold: 20, available: true, mark: "LT", tone: "bg-[#e8c76e]" },
  { id: "paket-ngopi", name: "Paket Ngopi Berdua", category: "Paket hemat", price: 56000, description: "Dua kopi favorit dan dua snack untuk dinikmati bersama.", sold: 10, available: true, mark: "NB", tone: "bg-[#9cb9b4]", badge: "Hemat 20%" },
  { id: "cookies", name: "Cookies Cokelat", category: "Snack", price: 14000, description: "Cookies chewy dengan potongan cokelat.", sold: 11, available: false, mark: "CC", tone: "bg-[#aa806b]" },
];

const initialTables: TableItem[] = [
  { id: "table-01", name: "Meja 01", zone: "Teras depan", status: "Terisi", scans: 84, orders: 18 },
  { id: "table-02", name: "Meja 02", zone: "Teras depan", status: "Kosong", scans: 67, orders: 14 },
  { id: "table-03", name: "Meja 03", zone: "Indoor", status: "Terisi", scans: 92, orders: 22 },
  { id: "table-04", name: "Meja 04", zone: "Indoor", status: "Kosong", scans: 55, orders: 10 },
  { id: "table-05", name: "Meja 05", zone: "Indoor", status: "Terisi", scans: 76, orders: 16 },
  { id: "table-06", name: "Meja 06", zone: "Taman", status: "Kosong", scans: 41, orders: 4 },
];

const initialOrders: QrOrder[] = [
  { id: "QR-0248", table: "Meja 03", customer: "Dina", items: "Kopi Susu Gula Aren, Croissant Butter", itemCount: 2, total: 40000, time: "Baru saja", status: "Baru" },
  { id: "QR-0247", table: "Meja 01", customer: "Rizky", items: "Paket Ceria Nempo", itemCount: 1, total: 39000, time: "4 menit lalu", status: "Diproses" },
  { id: "QR-0246", table: "Meja 05", customer: "Salsa", items: "Matcha Latte, Fresh Lemon Tea", itemCount: 2, total: 40000, time: "9 menit lalu", status: "Siap diantar" },
  { id: "QR-0245", table: "Meja 02", customer: "Bayu", items: "Nasi Ayam Sambal, Kopi Susu Gula Aren", itemCount: 2, total: 46000, time: "16 menit lalu", status: "Selesai" },
];

const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const getCustomerMenuUrl = (tableId: string) => `${typeof window === "undefined" ? "https://nempo.id" : window.location.origin}/digital-services/qr-menu/customer/${tableId}`;

const QR_MENU_PREVIEW_PASSWORD = "nemposukses";
const QR_MENU_PREVIEW_ACCESS_KEY = "nempo_qr_menu_preview_access";

function QrMenuPreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="QR Menu" description="Masukkan password untuk membuka preview QR Menu Digi Nempo." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === QR_MENU_PREVIEW_PASSWORD) {
      localStorage.setItem(QR_MENU_PREVIEW_ACCESS_KEY, "1");
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <main className="nempo-demo-green nempo-qr-menu-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md rounded-[28px] border border-[#e3eeed] bg-white p-6 shadow-[0_24px_70px_rgba(24,59,67,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e6f6f3] text-[#0f766e]"><QrCode className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f766e]">Live preview</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">QR Menu</h1></div>
        </div>
        <p className="text-sm leading-6 text-[#6d878a]">Masukkan password untuk membuka preview QR Menu Digi Nempo.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="text" name="username" autoComplete="username" value="qr-menu-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
          <label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#cf6c61] bg-[#fff9f8]" : "border-[#d8e8e6] focus-within:border-[#0f766e]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#bd5c52]" : "text-[#8aa1a3]"}`} />
            <span className="sr-only">Password live preview QR Menu</span>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setError(false); }} placeholder="Masukkan password" autoComplete="current-password" autoFocus className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#183b43] outline-none placeholder:text-[#9bb1b3]" />
            <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} className="text-[#8aa1a3] hover:text-[#0f766e]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </label>
          {error && <p className="text-xs font-semibold text-[#bd5c52]">Password salah. Coba lagi.</p>}
          <button type="submit" className="w-full rounded-xl bg-[#0f766e] px-4 py-3 text-xs font-black text-white transition-colors hover:bg-[#0b625c]">Masuk ke preview</button>
        </form>
      </div>
    </main>
  );
}

export default function DigitalQrMenuDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeView, setActiveView] = useState<QrMenuView>("overview");
  const [products, setProducts] = useState(initialProducts);
  const [tables, setTables] = useState(initialTables);
  const [orders, setOrders] = useState(initialOrders);
  const [selectedTable, setSelectedTable] = useState(initialTables[0]);
  const [toast, setToast] = useState<string | null>(null);
  const [addProductOpen, setAddProductOpen] = useState(false);

  if (!unlocked) return <QrMenuPreviewGate onUnlock={() => setUnlocked(true)} />;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }

  function toggleProduct(productId: string) {
    setProducts((current) => current.map((product) => product.id === productId ? { ...product, available: !product.available } : product));
    const product = products.find((item) => item.id === productId);
    if (product) notify(`${product.name} ${product.available ? "disembunyikan dari" : "ditampilkan di"} menu.`);
  }

  function updateOrder(orderId: string, status: OrderStatus) {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order));
    notify(`Status ${orderId} diubah menjadi ${status}.`);
  }

  function addProduct(product: MenuProduct) {
    setProducts((current) => [product, ...current]);
    setAddProductOpen(false);
    setActiveView("menu");
    notify("Menu baru berhasil ditambahkan.");
  }

  function resetDemo() {
    setProducts(initialProducts);
    setTables(initialTables);
    setOrders(initialOrders);
    setSelectedTable(initialTables[0]);
    setActiveView("overview");
    notify("Demo dikembalikan ke data awal.");
  }

  return (
    <Layout>
      <SEO title="QR Menu Demo — Digi Nempo" description="Preview QR Menu Digi Nempo untuk mengelola menu digital, pesanan meja, QR per meja, dan insight pelanggan." keywords="QR Menu, menu digital, pesan dari meja, digital menu, QR cafe, Digi Nempo" path="/digital-services/qr-menu" />
      <main className="nempo-demo-green nempo-qr-menu-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1440px] px-3 pb-24 pt-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-[#dcebea] py-3">
            <Link href="/digital-services" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8aa1a3] transition-colors hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Digi Nempo</Link>
            <div className="flex items-center gap-3"><span className="hidden items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#0f766e] sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-[#2aa793]" /> Live preview</span><button type="button" onClick={resetDemo} className="inline-flex items-center gap-1.5 rounded-lg border border-[#dcebea] bg-white px-2.5 py-2 text-[10px] font-bold text-[#6d878a] hover:border-[#b9ded8] hover:text-[#0f766e]"><RotateCcw className="h-3 w-3" /> Reset demo</button></div>
          </div>

          <div className="mt-4 overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_20px_60px_rgba(24,59,67,0.09)]">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7f0ef] px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><QrCode className="h-5 w-5" /></div><div><p className="text-sm font-extrabold text-[#183b43]">Digi Nempo QR Menu</p><p className="text-[11px] text-[#8aa1a3]">Kopi Nempo · Menu dan pesanan meja</p></div></div>
              <div className="flex items-center gap-2"><div className="hidden items-center gap-2 rounded-full bg-[#f2f8f7] py-1.5 pl-1.5 pr-3 sm:flex"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#d4efeb] text-[10px] font-black text-[#0f766e]">AN</span><span className="text-[10px] font-extrabold text-[#547377]">Admin Nempo</span><ChevronDown className="h-3 w-3 text-[#8aa1a3]" /></div><button type="button" onClick={() => notify("Tidak ada notifikasi baru.")} aria-label="Notifikasi" className="grid h-9 w-9 place-items-center rounded-full border border-[#dcebea] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><Bell className="h-4 w-4" /></button></div>
            </header>

             <div className="flex min-h-[520px] flex-col lg:min-h-[720px] lg:flex-row">
              <aside className="hidden w-[224px] shrink-0 border-r border-[#e7f0ef] bg-[#fbfdfd] p-4 lg:block">
                <div className="mb-5 rounded-2xl border border-[#dcecea] bg-gradient-to-br from-[#effaf8] to-white p-3"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#d4efeb] text-[#0f766e]"><Store className="h-4 w-4" /></span><div className="min-w-0"><p className="truncate text-[11px] font-black text-[#214950]">Kopi Nempo</p><p className="text-[9px] font-semibold text-[#8aa1a3]">1 cabang aktif</p></div><ChevronDown className="ml-auto h-3.5 w-3.5 text-[#8aa1a3]" /></div></div>
                <p className="px-3 text-[9px] font-black uppercase tracking-[0.14em] text-[#a4b6b7]">Workspace</p>
                <nav className="mt-2 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-all ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#718b8e] hover:bg-[#f2f8f7] hover:text-[#24575b]"}`}><Icon className="h-4 w-4" /> {label}{id === "orders" && <span className="ml-auto rounded-full bg-[#fff1dd] px-1.5 py-0.5 text-[9px] font-black text-[#b97820]">{orders.filter((order) => order.status === "Baru").length}</span>}</button>)}</nav>
                 <div className="mt-7 border-t border-[#e3eeed] pt-4"><p className="px-3 text-[9px] font-black uppercase tracking-[0.14em] text-[#a4b6b7]">Bantuan</p><button type="button" onClick={() => setActiveView("customer")} className="mt-2 flex w-full items-center gap-2.5 rounded-xl bg-[#e6f6f3] px-3 py-2.5 text-left text-xs font-black text-[#0f766e] hover:bg-[#d4efeb]"><Eye className="h-4 w-4" /> Lihat web customer <ArrowUpRightIcon /></button><button type="button" onClick={() => notify("Tim Nempo siap membantu setup QR Menu.")} className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#718b8e] hover:bg-[#f2f8f7] hover:text-[#24575b]"><CircleHelp className="h-4 w-4" /> Panduan setup</button><button type="button" onClick={() => notify("Pengaturan QR Menu dibuka.")} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#718b8e] hover:bg-[#f2f8f7] hover:text-[#24575b]"><Settings2 className="h-4 w-4" /> Pengaturan</button></div>
                <div className="mt-12 rounded-2xl bg-[#123f47] p-3.5 text-white"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">QR Menu terhubung</p><p className="mt-2 text-[11px] font-bold leading-4">Menu, meja, dan pesanan masuk dalam satu alur.</p><button type="button" onClick={() => setActiveView("tables")} className="mt-3 inline-flex items-center gap-1 text-[10px] font-black text-[#9fe5dd]">Kelola QR meja <ArrowUpRightIcon /></button></div>
              </aside>

               <section className="min-w-0 flex-1 bg-[#f9fbfb]">
                 <div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kopi Nempo · Garut</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{activeView === "customer" ? "Web customer" : navItems.find((item) => item.id === activeView)?.label}</h1><p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Buat pelanggan lebih cepat memilih, memesan, dan menikmati.</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => setActiveView("tables")} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><QrCode className="h-3.5 w-3.5" /> Lihat QR</button><button type="button" onClick={() => activeView === "menu" ? setAddProductOpen(true) : setActiveView("menu")} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> {activeView === "menu" ? "Tambah menu" : "Kelola menu"}</button></div></div></div>
                 <div className="sticky top-0 z-20 flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white/95 px-4 py-2 backdrop-blur-sm lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black transition-colors ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b] hover:bg-[#f2f8f7]"}`}><Icon className="h-3 w-3" />{label}{id === "orders" && orders.filter((order) => order.status === "Baru").length > 0 && <span className="rounded-full bg-[#fff1dd] px-1.5 py-0.5 text-[8px] text-[#b97820]">{orders.filter((order) => order.status === "Baru").length}</span>}</button>)}</div>
                  <div className="p-4 sm:p-6">{activeView === "overview" && <QrOverview products={products} tables={tables} orders={orders} onView={(view) => setActiveView(view)} onNotify={notify} onOpenCustomerPreview={() => setActiveView("customer")} />}{activeView === "menu" && <MenuView products={products} onToggle={toggleProduct} onAdd={() => setAddProductOpen(true)} onNotify={notify} />}{activeView === "orders" && <OrdersView orders={orders} onUpdate={updateOrder} onNotify={notify} />}{activeView === "tables" && <TablesView tables={tables} selectedTable={selectedTable} onSelect={setSelectedTable} onMark={(id) => { setTables((current) => current.map((table) => table.id === id ? { ...table, status: table.status === "Terisi" ? "Kosong" : "Terisi" } : table)); notify("Status meja diperbarui."); }} onNotify={notify} />}{activeView === "insights" && <InsightsView products={products} tables={tables} onNotify={notify} />}{activeView === "customer" && <CustomerMenuModal products={products} onClose={() => setActiveView("overview")} onNotify={notify} />}</div>
              </section>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]"><span>Data simulasi untuk kebutuhan presentasi customer.</span><span className="hidden items-center gap-1 sm:inline-flex"><Clock3 className="h-3 w-3" /> Terakhir diperbarui beberapa detik lalu</span></div>
        </div>
          {addProductOpen && <AddProductModal onClose={() => setAddProductOpen(false)} onSubmit={addProduct} />}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f47] px-4 py-3 text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8bd6cc]" /> {toast}</div>}
      </main>
    </Layout>
  );
}

function ArrowUpRightIcon() {
  return <ArrowRight className="h-3 w-3" />;
}

function QrOverview({ products, tables, orders, onView, onNotify, onOpenCustomerPreview }: { products: MenuProduct[]; tables: TableItem[]; orders: QrOrder[]; onView: (view: QrMenuView) => void; onNotify: (message: string) => void; onOpenCustomerPreview: () => void }) {
  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard icon={Eye} label="Menu dilihat" value="1.284" detail="+22,4% minggu ini" tone="teal" />
      <MetricCard icon={ShoppingBag} label="Pesanan QR" value="84" detail="+14 pesanan hari ini" tone="blue" />
      <MetricCard icon={Users} label="Konversi scan" value="6,5%" detail="+1,8% dari minggu lalu" tone="violet" />
      <MetricCard icon={Tag} label="Rata-rata order" value="Rp68K" detail="+8,2% dari bulan lalu" tone="amber" />
    </div>
    <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="text-sm font-black text-[#244950]">Pesanan dari meja</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">Pesanan terbaru yang masuk lewat QR</p></div><button type="button" onClick={() => onView("orders")} className="text-[10px] font-black text-[#0f766e]">Lihat semua</button></div><div className="mt-4 space-y-1">{orders.slice(0, 3).map((order) => <OrderRow key={order.id} order={order} onClick={() => onNotify(`Detail ${order.id} dibuka.`)} />)}</div></section>
      <section className="rounded-2xl border border-[#e3eeed] bg-[#123f47] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Customer preview</p><h2 className="mt-2 text-lg font-black leading-tight">Menu yang terasa mudah.</h2></div><Sparkles className="h-5 w-5 text-[#8bd6cc]" /></div><div className="mt-5 rounded-2xl bg-white p-3 text-[#183b43]"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6f6f3] text-[#0f766e]"><Store className="h-4 w-4" /></div><div><p className="text-[10px] font-black">Kopi Nempo</p><p className="text-[8px] text-[#8aa1a3]">Buka · 15–20 menit</p></div><span className="ml-auto rounded-full bg-[#e6f6f3] px-2 py-1 text-[8px] font-black text-[#0f766e]">Meja 03</span></div><div className="mt-3 grid grid-cols-2 gap-2">{products.filter((product) => product.available).slice(0, 2).map((product) => <div key={product.id} className="rounded-xl bg-[#f4f9f8] p-2"><div className={`grid h-12 place-items-center rounded-lg ${product.tone} text-xs font-black text-white/80`}>{product.mark}</div><p className="mt-2 truncate text-[9px] font-black">{product.name}</p><p className="mt-1 text-[9px] font-bold text-[#0f766e]">{rupiah(product.price)}</p></div>)}</div><button type="button" onClick={onOpenCustomerPreview} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0f766e] py-2 text-[9px] font-black text-white">Buka customer preview <ArrowRight className="h-3 w-3" /></button></div></section>
    </div>
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between"><div><h2 className="text-sm font-black text-[#244950]">Menu paling laku</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">Berdasarkan pesanan 30 hari terakhir</p></div><button type="button" onClick={() => onView("menu")} className="text-[#0f766e]"><ArrowRight className="h-4 w-4" /></button></div><div className="mt-5 space-y-4">{products.slice(0, 4).map((product, index) => <div key={product.id} className="flex items-center gap-3"><span className="w-4 text-center text-[10px] font-black text-[#a4b6b7]">0{index + 1}</span><div className={`grid h-9 w-9 place-items-center rounded-lg ${product.tone} text-[9px] font-black text-white/80`}>{product.mark}</div><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{product.name}</p><div className="mt-1 h-1.5 rounded-full bg-[#edf4f3]"><div className="h-full rounded-full bg-[#0f766e]" style={{ width: `${Math.min(100, product.sold * 1.8)}%` }} /></div></div><span className="text-[10px] font-black text-[#0f766e]">{product.sold} terjual</span></div>)}</div></section>
      <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between"><div><h2 className="text-sm font-black text-[#244950]">Status meja</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{tables.filter((table) => table.status === "Terisi").length} meja sedang aktif</p></div><button type="button" onClick={() => onView("tables")} className="text-[10px] font-black text-[#0f766e]">Kelola QR</button></div><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">{tables.map((table) => <button type="button" key={table.id} onClick={() => onView("tables")} className={`rounded-xl border p-3 text-left transition-colors ${table.status === "Terisi" ? "border-[#b9ded8] bg-[#e6f6f3]" : "border-[#edf3f2] bg-[#fbfdfd] hover:border-[#b9ded8]"}`}><div className="flex items-center justify-between"><QrCode className={`h-4 w-4 ${table.status === "Terisi" ? "text-[#0f766e]" : "text-[#9bb1b3]"}`} /><span className={`h-2 w-2 rounded-full ${table.status === "Terisi" ? "bg-[#2aa793]" : "bg-[#c8d8d7]"}`} /></div><p className="mt-3 text-[10px] font-black text-[#365b60]">{table.name}</p><p className="mt-1 text-[8px] text-[#8aa1a3]">{table.scans} scan · {table.orders} order</p></button>)}</div></section>
    </div>
  </div>;
}

function MenuView({ products, onToggle, onAdd, onNotify }: { products: MenuProduct[]; onToggle: (id: string) => void; onAdd: () => void; onNotify: (message: string) => void }) {
  const [category, setCategory] = useState<"Semua" | MenuCategory>("Semua");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => products.filter((product) => (category === "Semua" || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase())), [products, category, query]);
  return <div className="space-y-4">
    <div className="flex flex-col gap-3 rounded-2xl border border-[#e3eeed] bg-white p-3 sm:flex-row sm:items-center"><label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8aa1a3]" /><span className="sr-only">Cari menu</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari menu atau kategori..." className="w-full rounded-xl bg-[#f4f9f8] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:ring-2 focus:ring-[#b9ded8]" /></label><div className="flex items-center gap-1.5 overflow-x-auto"><Filter className="h-3.5 w-3.5 shrink-0 text-[#8aa1a3]" />{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-lg px-2.5 py-2 text-[9px] font-black ${category === item ? "bg-[#0f766e] text-white" : "text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"}`}>{item}</button>)}</div></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((product) => <article key={product.id} className={`rounded-2xl border bg-white p-4 transition-shadow hover:shadow-[0_12px_30px_rgba(24,59,67,0.07)] ${product.available ? "border-[#e3eeed]" : "border-dashed border-[#ccd9d8] opacity-75"}`}><div className="flex items-start justify-between gap-2"><div className={`grid h-14 w-14 place-items-center rounded-xl ${product.tone} text-sm font-black text-white/80`}>{product.mark}</div><div className="flex items-center gap-1"><button type="button" onClick={() => onNotify(`Form edit ${product.name} dibuka.`)} aria-label={`Edit ${product.name}`} className="grid h-8 w-8 place-items-center rounded-lg text-[#8aa1a3] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><Pencil className="h-3.5 w-3.5" /></button><button type="button" onClick={() => onNotify(`Opsi ${product.name} dibuka.`)} aria-label={`Opsi ${product.name}`} className="grid h-8 w-8 place-items-center rounded-lg text-[#8aa1a3] hover:bg-[#f2f8f7] hover:text-[#0f766e]"><MoreHorizontal className="h-4 w-4" /></button></div></div><div className="mt-4 flex items-start justify-between gap-2"><div><h3 className="text-[12px] font-black text-[#183b43]">{product.name}</h3><p className="mt-1 text-[9px] leading-4 text-[#8aa1a3]">{product.description}</p></div>{product.badge && <span className="shrink-0 rounded-md bg-[#fff4df] px-2 py-1 text-[8px] font-black text-[#9a6b20]">{product.badge}</span>}</div><div className="mt-4 flex items-center justify-between border-t border-[#edf3f2] pt-3"><div><p className="text-sm font-black text-[#0f766e]">{rupiah(product.price)}</p><p className="mt-1 text-[9px] text-[#8aa1a3]">{product.sold} terjual · {product.category}</p></div><button type="button" onClick={() => onToggle(product.id)} className={`relative h-6 w-11 rounded-full p-1 transition-colors ${product.available ? "bg-[#0f766e]" : "bg-[#cbd9d8]"}`} aria-label={`${product.available ? "Sembunyikan" : "Tampilkan"} ${product.name}`}><span className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${product.available ? "translate-x-5" : "translate-x-0"}`} /></button></div><p className={`mt-2 text-right text-[8px] font-bold ${product.available ? "text-[#19734f]" : "text-[#bd5c52]"}`}>{product.available ? "Tampil di QR Menu" : "Disembunyikan sementara"}</p></article>)}<button type="button" onClick={onAdd} className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] text-[#0f766e] transition-colors hover:bg-[#e6f6f3]"><Plus className="h-6 w-6" /><span className="mt-3 text-xs font-black">Tambah menu baru</span><span className="mt-1 text-[9px] text-[#6d878a]">Foto, harga, dan detail produk</span></button></div>
    {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-[#cbd9d8] p-12 text-center"><Search className="mx-auto h-6 w-6 text-[#a9c8c4]" /><p className="mt-3 text-xs font-bold text-[#6d878a]">Menu tidak ditemukan</p></div>}
  </div>;
}

function OrdersView({ orders, onUpdate, onNotify }: { orders: QrOrder[]; onUpdate: (id: string, status: OrderStatus) => void; onNotify: (message: string) => void }) {
  const [filter, setFilter] = useState<"Semua" | OrderStatus>("Semua");
  const filtered = orders.filter((order) => filter === "Semua" || order.status === filter);
  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0f9b8e]">Order management</p><h2 className="mt-1 text-lg font-black text-[#183b43]">Pesanan masuk dari QR meja</h2><p className="mt-1 text-[10px] text-[#8aa1a3]">Teruskan status order agar pelanggan tahu progres pesanannya.</p></div><div className="flex items-center gap-1.5 overflow-x-auto">{(["Semua", "Baru", "Diproses", "Siap diantar", "Selesai"] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-lg px-2.5 py-2 text-[9px] font-black ${filter === item ? "bg-[#0f766e] text-white" : "bg-white text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"}`}>{item}</button>)}</div></div>
    <div className="grid gap-3 xl:grid-cols-2">{filtered.map((order) => <article key={order.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><ShoppingBag className="h-4 w-4" /></span><div><p className="text-[12px] font-black text-[#183b43]">{order.id} · {order.table}</p><p className="mt-1 text-[9px] text-[#8aa1a3]">{order.customer} · {order.time}</p></div></div><span className={`rounded-md px-2 py-1 text-[8px] font-black ${order.status === "Baru" ? "bg-[#fff4df] text-[#9a6b20]" : order.status === "Selesai" ? "bg-[#e6f6ed] text-[#19734f]" : "bg-[#e6f6f3] text-[#08766f]"}`}>{order.status}</span></div><div className="mt-4 flex items-center justify-between gap-3 border-t border-[#edf3f2] pt-3"><div><p className="text-[10px] font-black text-[#365b60]">{order.items}</p><p className="mt-1 text-[9px] text-[#8aa1a3]">{order.itemCount} item · <span className="font-black text-[#0f766e]">{rupiah(order.total)}</span></p></div><div className="flex items-center gap-2">{order.status !== "Selesai" && <button type="button" onClick={() => onUpdate(order.id, order.status === "Baru" ? "Diproses" : order.status === "Diproses" ? "Siap diantar" : "Selesai")} className="rounded-lg bg-[#0f766e] px-2.5 py-2 text-[9px] font-black text-white hover:bg-[#0b625c]">{order.status === "Baru" ? "Proses order" : order.status === "Diproses" ? "Siapkan" : "Tandai selesai"}</button>}<button type="button" onClick={() => onNotify(`Detail ${order.id} dibuka.`)} className="grid h-8 w-8 place-items-center rounded-lg border border-[#dcebea] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><ArrowRight className="h-3.5 w-3.5" /></button></div></div></article>)}</div>
    {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-[#cbd9d8] bg-white p-12 text-center"><ListOrdered className="mx-auto h-6 w-6 text-[#a9c8c4]" /><p className="mt-3 text-xs font-bold text-[#6d878a]">Belum ada pesanan pada filter ini.</p></div>}
  </div>;
}

function TablesView({ tables, selectedTable, onSelect, onMark, onNotify }: { tables: TableItem[]; selectedTable: TableItem; onSelect: (table: TableItem) => void; onMark: (id: string) => void; onNotify: (message: string) => void }) {
  const qrLink = getCustomerMenuUrl(selectedTable.id);
  const copyQrLink = async () => {
    try {
      await navigator.clipboard.writeText(qrLink);
      onNotify(`Link ${selectedTable.name} berhasil disalin.`);
    } catch {
      onNotify(`Link ${selectedTable.name}: ${qrLink}`);
    }
  };

  return <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
    <section><div className="mb-4 flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0f9b8e]">QR meja</p><h2 className="mt-1 text-lg font-black text-[#183b43]">Atur QR untuk setiap meja</h2><p className="mt-1 text-[10px] text-[#8aa1a3]">Satu QR berbeda untuk membaca meja, scan, dan pesanan.</p></div><button type="button" onClick={() => onNotify("QR semua meja sedang disiapkan untuk diunduh.")} className="inline-flex items-center gap-1.5 rounded-xl border border-[#b9ded8] px-3 py-2.5 text-[10px] font-black text-[#0f766e] hover:bg-[#e6f6f3]"><FileText className="h-3.5 w-3.5" /> Export semua</button></div><div className="grid gap-3 sm:grid-cols-2">{tables.map((table) => <button type="button" key={table.id} onClick={() => onSelect(table)} className={`rounded-2xl border p-4 text-left transition-all ${selectedTable.id === table.id ? "border-[#70c7bd] bg-[#f1fbf9] shadow-sm" : "border-[#e3eeed] bg-white hover:border-[#b9ded8]"}`}><div className="flex items-start justify-between gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><QrCode className="h-5 w-5" /></div><span className={`rounded-full px-2 py-1 text-[8px] font-black ${table.status === "Terisi" ? "bg-[#e6f6ed] text-[#19734f]" : "bg-[#f2f8f7] text-[#8aa1a3]"}`}>{table.status}</span></div><p className="mt-4 text-sm font-black text-[#183b43]">{table.name}</p><p className="mt-1 text-[9px] text-[#8aa1a3]">{table.zone}</p><div className="mt-4 flex items-center gap-4 border-t border-[#edf3f2] pt-3 text-[9px] font-bold text-[#6d878a]"><span>{table.scans} scan</span><span>{table.orders} order</span></div></button>)}</div></section>
     <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#0f766e]">QR aktif</p><h3 className="mt-1 text-base font-black text-[#183b43]">{selectedTable.name}</h3></div><button type="button" onClick={copyQrLink} aria-label={`Salin link ${selectedTable.name}`} className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6f6f3] text-[#0f766e] hover:bg-[#d4efeb]"><Copy className="h-3.5 w-3.5" /></button></div><div className="mt-5 rounded-2xl bg-[#f4f9f8] p-5"><div className="mx-auto max-w-[170px] rounded-xl bg-white p-3 shadow-sm"><QRCode value={qrLink} size={144} fgColor="#183b43" bgColor="#ffffff" /></div><p className="mt-4 text-center text-[9px] font-bold text-[#6d878a]">Scan untuk membuka menu Kopi Nempo</p></div><div className="mt-5 space-y-3"><div className="flex items-center justify-between text-[10px]"><span className="text-[#8aa1a3]">Link meja</span><span className="font-black text-[#365b60]">/{selectedTable.id}</span></div><div className="flex items-center justify-between text-[10px]"><span className="text-[#8aa1a3]">Total scan</span><span className="font-black text-[#0f766e]">{selectedTable.scans}</span></div><button type="button" onClick={copyQrLink} className="w-full rounded-xl bg-[#0f766e] py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Copy className="mr-1 inline-block h-3.5 w-3.5" /> Salin link menu</button><button type="button" onClick={() => onMark(selectedTable.id)} className="w-full rounded-xl border border-[#b9ded8] py-2.5 text-[10px] font-black text-[#0f766e] hover:bg-[#e6f6f3]">{selectedTable.status === "Terisi" ? "Tandai meja kosong" : "Tandai meja terisi"}</button></div></section>
  </div>;
}

function CustomerMenuModal({ products, onClose, onNotify }: { products: MenuProduct[]; onClose: () => void; onNotify: (message: string) => void }) {
  const [category, setCategory] = useState<"Semua" | MenuCategory>("Semua");
  const [cart, setCart] = useState<Record<string, number>>({});
  const availableProducts = products.filter((product) => product.available && (category === "Semua" || product.category === category));
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const cartTotal = products.reduce((sum, product) => sum + (cart[product.id] ?? 0) * product.price, 0);

  function addToCart(productId: string) {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div role="region" aria-label="Preview menu pelanggan" className="flex w-full flex-col overflow-hidden rounded-[26px] border border-[#dcebea] bg-[#f8fbfa] shadow-[0_16px_40px_rgba(24,59,67,0.08)]">
        <header className="flex items-center justify-between border-b border-[#e3eeed] bg-white px-5 py-4">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Store className="h-5 w-5" /></div><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Customer preview</p><h2 className="mt-1 text-base font-black text-[#183b43]">Kopi Nempo</h2><p className="mt-0.5 text-[9px] text-[#8aa1a3]">Meja 03 · Buka · 15–20 menit</p></div></div>
          <button type="button" onClick={onClose} aria-label="Kembali ke ringkasan" className="inline-flex items-center gap-1.5 rounded-lg bg-[#f4f9f8] px-2.5 py-2 text-[9px] font-black text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Kembali</button>
        </header>
         <section className="relative overflow-hidden bg-[#123f47] px-5 py-6 text-white"><div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border-[16px] border-[#2aa793]/20" /><div className="relative"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 text-[8px] font-black text-[#a7e2db]"><Table2 className="h-3 w-3" /> Pesan dari meja</span><h3 className="mt-3 max-w-[290px] text-xl font-black leading-tight">Menu yang enak, tanpa perlu antre.</h3><p className="mt-2 max-w-[320px] text-[9px] leading-4 text-[#c0d8d6]">Pilih menu favoritmu dan kami antar langsung ke Meja 03.</p><div className="mt-4 flex items-center gap-2 text-[8px] font-bold text-[#b4d0cd]"><span className="rounded-full bg-white/10 px-2.5 py-1.5">15–20 menit</span><span className="rounded-full bg-white/10 px-2.5 py-1.5">Fresh hari ini</span></div></div></section>
        <div className="overflow-y-auto p-4 sm:p-5">
           <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Menu Kopi Nempo</p><h3 className="mt-1 text-base font-black tracking-tight text-[#183b43]">Pilih yang kamu suka</h3></div><span className="text-[8px] font-bold text-[#8aa1a3]">{availableProducts.length} tersedia</span></div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-3 py-2 text-[9px] font-black ${category === item ? "bg-[#0f766e] text-white" : "bg-white text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"}`}>{item}</button>)}</div>
          <div className="mt-4 space-y-2.5">
             {availableProducts.map((product) => <article key={product.id} className="flex items-center gap-3 rounded-2xl border border-[#e3eeed] bg-white p-3 shadow-[0_5px_16px_rgba(24,59,67,0.035)] transition-shadow hover:shadow-[0_9px_22px_rgba(24,59,67,0.08)]"><div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${product.tone} text-xs font-black text-white/80 shadow-inner`}>{product.mark}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><h3 className="text-[11px] font-black text-[#183b43]">{product.name}</h3><p className="mt-1 line-clamp-2 text-[9px] leading-4 text-[#8aa1a3]">{product.description}</p></div>{product.badge && <span className="shrink-0 rounded-md bg-[#fff1dd] px-1.5 py-1 text-[8px] font-black text-[#9a6b20]">{product.badge}</span>}</div><div className="mt-2 flex items-center justify-between"><span className="text-[11px] font-black text-[#0f766e]">{rupiah(product.price)}</span><button type="button" onClick={() => addToCart(product.id)} className="rounded-lg bg-[#e6f6f3] px-3 py-1.5 text-[9px] font-black text-[#0f766e] hover:bg-[#d4efeb]">{cart[product.id] ? `Tambah lagi · ${cart[product.id]}` : "Tambah"}</button></div></div></article>)}
            {availableProducts.length === 0 && <div className="rounded-2xl border border-dashed border-[#cbd9d8] bg-white p-8 text-center text-[10px] font-bold text-[#6d878a]">Belum ada menu aktif di kategori ini.</div>}
          </div>
        </div>
         <footer className="border-t border-[#e3eeed] bg-white p-4">
           <button type="button" disabled={!cartCount} onClick={() => onNotify(`${cartCount} item siap dipesan · ${rupiah(cartTotal)}`)} className="flex w-full items-center justify-between rounded-xl bg-[#0f766e] px-4 py-3 text-left text-[10px] font-black text-white transition-colors hover:bg-[#0b625c] disabled:cursor-not-allowed disabled:bg-[#d7e5e3] disabled:text-[#8aa1a3]"><span className="flex items-center gap-2"><ShoppingBag className="h-4 w-4" /> {cartCount ? `${cartCount} item di pesanan` : "Pilih menu untuk mulai"}</span><span>{cartCount ? `${rupiah(cartTotal)} · Lanjutkan` : "Belum ada item"}</span></button>
        </footer>
      </div>
    </div>
  );
}

export function QrMenuCustomerPage() {
  const [, params] = useRoute("/digital-services/qr-menu/customer/:tableId");
  const table = initialTables.find((item) => item.id === params?.tableId) ?? initialTables[2];
  const [category, setCategory] = useState<"Semua" | MenuCategory>("Semua");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [orderSent, setOrderSent] = useState(false);
  const availableProducts = initialProducts.filter((product) => product.available && (category === "Semua" || product.category === category));
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const cartTotal = initialProducts.reduce((sum, product) => sum + (cart[product.id] ?? 0) * product.price, 0);

  function addToCart(productId: string) {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
    setOrderSent(false);
  }

  function submitOrder() {
    if (cartCount) setOrderSent(true);
  }

  return (
    <>
      <SEO title="Menu Kopi Nempo" description={`Menu digital Kopi Nempo untuk ${table.name}. Pilih menu dan pesan langsung dari meja.`} path={`/digital-services/qr-menu/customer/${table.id}`} noIndex />
      <main className="min-h-[100dvh] bg-[#f4f7f7] pb-28 text-[#183b43]">
        <div className="mx-auto w-full max-w-xl px-4 sm:px-6">
          <header className="flex items-center justify-between gap-3 py-5">
            <div className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-[0_8px_18px_rgba(15,118,110,0.2)]"><Store className="h-4 w-4" /></span><div><p className="text-sm font-black tracking-tight text-[#183b43]">Kopi Nempo</p><p className="text-[9px] font-bold text-[#8aa1a3]">Menu digital · Garut</p></div></div>
            <div className="flex flex-col items-end gap-1.5"><span className="inline-flex items-center gap-1.5 rounded-full border border-[#b9ded8] bg-white px-3 py-2 text-[9px] font-black text-[#0f766e]"><span className="h-1.5 w-1.5 rounded-full bg-[#2aa793]" /> Buka sekarang</span><span className="inline-flex items-center gap-1 text-[8px] font-bold text-[#8aa1a3]"><Table2 className="h-3 w-3 text-[#0f766e]" /> {table.name}</span></div>
          </header>

          <section className="relative overflow-hidden rounded-[28px] bg-[#123f47] p-5 text-white shadow-[0_18px_45px_rgba(18,63,71,0.18)] ring-1 ring-[#2aa793]/20 sm:p-7">
            <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full border-[22px] border-[#2aa793]/20" />
            <div className="absolute -bottom-20 -left-10 h-36 w-36 rounded-full border-[18px] border-[#d7c0a5]/20" />
            <div className="relative"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 text-[9px] font-black text-[#a7e2db]"><Table2 className="h-3 w-3" /> {table.name}</span><h1 className="mt-5 max-w-[290px] text-2xl font-black leading-tight tracking-tight sm:text-3xl">Pesan menu favoritmu dari meja.</h1><p className="mt-3 max-w-[320px] text-[11px] leading-5 text-[#c0d8d6]">Pilih menu, tambahkan ke pesanan, lalu tunggu kami mengantarkannya.</p><div className="mt-5 flex items-center gap-4 text-[9px] font-bold text-[#b4d0cd]"><span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-[#8bd6cc]" /> 15–20 menit</span><span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-[#8bd6cc]" /> Fresh hari ini</span></div></div>
          </section>

          {orderSent && <section className="mt-4 flex items-start gap-3 rounded-2xl border border-[#b9ded8] bg-[#e6f6f3] p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0f766e] text-white"><Check className="h-4 w-4" /></span><div><p className="text-[11px] font-black text-[#0f766e]">Pesanan demo diterima</p><p className="mt-1 text-[10px] leading-4 text-[#477477]">Pesanan QR-0250 sedang disiapkan untuk {table.name}.</p><button type="button" onClick={() => { setOrderSent(false); setCart({}); }} className="mt-2 text-[9px] font-black text-[#0f766e] underline underline-offset-2">Buat pesanan baru</button></div></section>}

          <section className="mt-7">
            <div className="flex items-end justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Menu Kopi Nempo</p><h2 className="mt-1 text-lg font-black tracking-tight text-[#183b43]">Pilih yang kamu suka</h2></div><span className="text-[9px] font-bold text-[#8aa1a3]">{initialProducts.filter((product) => product.available).length} menu tersedia</span></div>
            <div className="sticky top-0 z-20 -mx-4 mt-3 flex gap-1.5 overflow-x-auto bg-[#f4f7f7]/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-3 py-2 text-[9px] font-black transition-colors ${category === item ? "bg-[#0f766e] text-white shadow-[0_5px_12px_rgba(15,118,110,0.18)]" : "bg-white text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"}`}>{item}</button>)}</div>
            <div className="mt-1 space-y-3">{availableProducts.map((product) => <article key={product.id} className="flex gap-3 rounded-2xl border border-[#e3eeed] bg-white p-3.5 shadow-[0_6px_20px_rgba(24,59,67,0.035)] transition-all hover:-translate-y-0.5 hover:border-[#b9ded8] hover:shadow-[0_10px_24px_rgba(24,59,67,0.08)]"><div className={`grid h-[76px] w-[76px] shrink-0 place-items-center rounded-2xl ${product.tone} text-sm font-black text-white/80 shadow-inner`}>{product.mark}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><h3 className="text-[12px] font-black text-[#183b43]">{product.name}</h3><p className="mt-1 line-clamp-2 text-[9px] leading-4 text-[#8aa1a3]">{product.description}</p></div>{product.badge && <span className="shrink-0 rounded-md bg-[#fff1dd] px-1.5 py-1 text-[8px] font-black text-[#9a6b20]">{product.badge}</span>}</div><div className="mt-3 flex items-center justify-between"><span className="text-[12px] font-black text-[#0f766e]">{rupiah(product.price)}</span><button type="button" onClick={() => addToCart(product.id)} className="rounded-xl bg-[#e6f6f3] px-3 py-2 text-[9px] font-black text-[#0f766e] transition-colors hover:bg-[#d4efeb]">{cart[product.id] ? `Tambah lagi · ${cart[product.id]}` : "Tambah"}</button></div></div></article>)}</div>
          </section>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#dcebea] bg-white/95 p-3 shadow-[0_-10px_30px_rgba(24,59,67,0.08)] backdrop-blur-md"><div className="mx-auto max-w-xl"><button type="button" disabled={!cartCount || orderSent} onClick={submitOrder} className="flex w-full items-center justify-between rounded-2xl bg-[#0f766e] px-4 py-3.5 text-left text-[10px] font-black text-white transition-colors hover:bg-[#0b625c] disabled:cursor-not-allowed disabled:bg-[#d7e5e3] disabled:text-[#8aa1a3]"><span className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-white/15"><ShoppingBag className="h-3.5 w-3.5" /></span> {orderSent ? "Pesanan sudah diterima" : cartCount ? `${cartCount} item di pesanan` : "Pilih menu untuk mulai"}</span><span>{cartCount ? `${rupiah(cartTotal)} · Lanjutkan` : "Belum ada item"}</span></button></div></div>
      </main>
    </>
  );
}

function InsightsView({ products, tables, onNotify }: { products: MenuProduct[]; tables: TableItem[]; onNotify: (message: string) => void }) {
  return <div className="space-y-4">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0f9b8e]">Insights</p><h2 className="mt-1 text-lg font-black text-[#183b43]">Baca kebiasaan pelanggan dari QR.</h2><p className="mt-1 text-[10px] text-[#8aa1a3]">Pakai data scan dan order untuk memperbaiki menu dan penempatan QR.</p></div><button type="button" onClick={() => onNotify("Laporan QR Menu sedang disiapkan.")} className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#b9ded8] px-3 py-2.5 text-[10px] font-black text-[#0f766e] hover:bg-[#e6f6f3]"><FileText className="h-3.5 w-3.5" /> Export insight</button></div>
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard icon={Eye} label="Total scan" value="1.284" detail="+22,4%" tone="teal" /><MetricCard icon={ShoppingBag} label="Scan jadi order" value="84" detail="6,5% conversion" tone="blue" /><MetricCard icon={Clock3} label="Waktu pilih menu" value="2m 18d" detail="-18 detik lebih cepat" tone="violet" /></div>
    <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between"><div><h3 className="text-sm font-black text-[#244950]">Scan per meja</h3><p className="mt-1 text-[10px] text-[#94a8aa]">Meja dengan traffic tertinggi bulan ini</p></div><Table2 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-6 space-y-4">{tables.map((table) => <div key={table.id}><div className="mb-1.5 flex items-center justify-between text-[10px]"><span className="font-black text-[#365b60]">{table.name} <span className="font-normal text-[#8aa1a3]">· {table.zone}</span></span><span className="font-black text-[#0f766e]">{table.scans}</span></div><div className="h-2 rounded-full bg-[#edf4f3]"><div className="h-full rounded-full bg-[#0f766e]" style={{ width: `${Math.min(100, table.scans)}%` }} /></div></div>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between"><div><h3 className="text-sm font-black text-[#244950]">Peluang optimasi</h3><p className="mt-1 text-[10px] text-[#94a8aa]">Rekomendasi dari data demo</p></div><Sparkles className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-5 space-y-3"><InsightItem title="Tampilkan Paket Ceria lebih awal" detail={`${products.find((product) => product.name.includes("Paket Ceria"))?.sold ?? 28} penjualan bulan ini`} /><InsightItem title="Cetak ulang QR Meja 06" detail="Scan masih paling rendah di area taman" /><InsightItem title="Tambahkan foto untuk 2 menu" detail="Foto membantu pelanggan memilih lebih cepat" /></div></section></div>
  </div>;
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: typeof Eye; label: string; value: string; detail: string; tone: "teal" | "blue" | "violet" | "amber" }) {
  const styles = { teal: "bg-[#e6f6f3] text-[#0f766e]", blue: "bg-[#e5f0ff] text-[#3478c9]", violet: "bg-[#eeeaff] text-[#7260bf]", amber: "bg-[#fff1dd] text-[#b97820]" };
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-start justify-between gap-3"><p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8ba3a4]">{label}</p><span className={`grid h-8 w-8 place-items-center rounded-xl ${styles[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-4 text-xl font-black tracking-tight text-[#183b43]">{value}</p><p className={`mt-1 text-[10px] font-bold ${tone === "amber" ? "text-[#b97820]" : "text-[#0f766e]"}`}>{detail}</p></div>;
}

function OrderRow({ order, onClick }: { order: QrOrder; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex w-full items-center gap-3 border-t border-[#edf3f2] py-3 text-left hover:bg-[#fbfdfd]"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#e6f6f3] text-[#0f766e]"><ShoppingBag className="h-3.5 w-3.5" /></span><span className="min-w-0 flex-1"><span className="block truncate text-[10px] font-black text-[#365b60]">{order.id} · {order.table}</span><span className="mt-0.5 block truncate text-[8px] text-[#8aa1a3]">{order.items}</span></span><span className="text-right"><span className="block text-[9px] font-black text-[#0f766e]">{rupiah(order.total)}</span><span className="mt-0.5 block text-[8px] text-[#8aa1a3]">{order.status}</span></span></button>;
}

function InsightItem({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-xl border border-[#edf3f2] bg-[#fbfdfd] p-3"><div className="flex items-start gap-2.5"><span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-[#e6f6f3] text-[#0f766e]"><Sparkles className="h-3 w-3" /></span><div><p className="text-[10px] font-black text-[#365b60]">{title}</p><p className="mt-1 text-[9px] leading-4 text-[#8aa1a3]">{detail}</p></div></div></div>;
}

function AddProductModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (product: MenuProduct) => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("18000");
  const [category, setCategory] = useState<MenuCategory>("Kopi");
  const [description, setDescription] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!name.trim()) return; onSubmit({ id: `product-${Date.now()}`, name: name.trim(), category, price: Number(price) || 0, description: description.trim() || "Menu baru yang siap dilengkapi detailnya.", sold: 0, available: true, mark: name.trim().slice(0, 2).toUpperCase(), tone: "bg-[#9dd4cb]" }); }
  return <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#183b43]/45 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-t-[26px] bg-white p-5 shadow-2xl sm:rounded-[26px] sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0f766e]">Menu digital</p><h2 className="mt-2 text-xl font-black text-[#183b43]">Tambah menu baru</h2><p className="mt-1 text-[10px] leading-5 text-[#8aa1a3]">Menu langsung tersedia untuk diatur di QR Menu.</p></div><button type="button" onClick={onClose} aria-label="Tutup modal" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><form onSubmit={submit} className="mt-6 space-y-4"><Field label="Nama menu"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Es Kopi Pandan" className={fieldClass} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Kategori"><select value={category} onChange={(event) => setCategory(event.target.value as MenuCategory)} className={fieldClass}>{categories.filter((item): item is MenuCategory => item !== "Semua").map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Harga"><input type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} className={fieldClass} /></Field></div><Field label="Deskripsi singkat"><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="Jelaskan rasa, isi, atau porsi menu..." className={`${fieldClass} resize-none`} /></Field><div className="rounded-xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] p-3"><p className="flex items-center gap-2 text-[10px] font-black text-[#08766f]"><QrCode className="h-3.5 w-3.5" /> Otomatis tampil di QR Menu</p><p className="mt-1 text-[9px] leading-4 text-[#6d878a]">Kamu masih bisa mengubah ketersediaan setelah menu disimpan.</p></div><div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[10px] font-black text-[#6d878a] hover:bg-[#f4f9f8]">Batal</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]">Simpan menu</button></div></form></div></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">{label}</span>{children}</label>;
}

const fieldClass = "w-full rounded-xl border border-[#dcebea] bg-[#fbfdfd] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:border-[#0f766e] focus:ring-2 focus:ring-[#b9ded8]";