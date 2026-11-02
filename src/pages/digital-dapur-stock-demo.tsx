import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock3,
  Download,
  Eye,
  EyeOff,
  Filter,
  History,
  LayoutDashboard,
  Leaf,
  Lock,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  ReceiptText,
  RefreshCcw,
  Search,
  ShoppingBasket,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  Users,
  UtensilsCrossed,
  Warehouse,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@/lib/wouter";
import "./digital-demo-super-app.css";

type StockView = "overview" | "inventory" | "receiving" | "usage" | "suppliers" | "reports";
type StockStatus = "Aman" | "Menipis" | "Kritis";
type StockCategory = "Bahan baku" | "Kemasan" | "Produk siap jual";
type MovementType = "Masuk" | "Pakai" | "Penyesuaian";

type StockItem = {
  id: string;
  name: string;
  category: StockCategory;
  unit: string;
  onHand: number;
  minLevel: number;
  cost: number;
  supplier: string;
  lastUpdated: string;
  waste: number;
  tone: string;
};

type StockMovement = {
  id: string;
  itemId: string;
  type: MovementType;
  quantity: number;
  unit: string;
  date: string;
  note: string;
  staff: string;
};

type Supplier = {
  id: string;
  name: string;
  category: string;
  contact: string;
  items: number;
  reliability: string;
  tone: string;
};

const navItems: Array<{ id: StockView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { id: "inventory", label: "Stok bahan", icon: Warehouse },
  { id: "receiving", label: "Barang masuk", icon: Truck },
  { id: "usage", label: "Pemakaian", icon: UtensilsCrossed },
  { id: "suppliers", label: "Supplier", icon: Users },
  { id: "reports", label: "Laporan", icon: BarChart3 },
];

const categories: Array<"Semua kategori" | StockCategory> = ["Semua kategori", "Bahan baku", "Kemasan", "Produk siap jual"];
const stockFilters: Array<"Semua status" | StockStatus> = ["Semua status", "Aman", "Menipis", "Kritis"];

const initialItems: StockItem[] = [
  { id: "stock-01", name: "Biji kopi Arabica", category: "Bahan baku", unit: "kg", onHand: 2.4, minLevel: 1.5, cost: 145000, supplier: "Kopi Gunung Putri", lastUpdated: "Hari ini, 08:40", waste: 1.8, tone: "bg-[#d7efeb] text-[#0f766e]" },
  { id: "stock-02", name: "Susu segar", category: "Bahan baku", unit: "liter", onHand: 8, minLevel: 10, cost: 22000, supplier: "Mitra Susu Garut", lastUpdated: "Hari ini, 07:15", waste: 3.4, tone: "bg-[#e3eff8] text-[#3a6b9b]" },
  { id: "stock-03", name: "Gula aren", category: "Bahan baku", unit: "kg", onHand: 3.2, minLevel: 2, cost: 78000, supplier: "Pangirutan Organik", lastUpdated: "Kemarin, 16:20", waste: 0.8, tone: "bg-[#f8e8cf] text-[#a56c2b]" },
  { id: "stock-04", name: "Cup 16 oz", category: "Kemasan", unit: "pcs", onHand: 42, minLevel: 100, cost: 950, supplier: "Kemasan Berkah", lastUpdated: "Kemarin, 15:45", waste: 0.3, tone: "bg-[#e8e3f5] text-[#7362a6]" },
  { id: "stock-05", name: "Croissant butter", category: "Produk siap jual", unit: "pcs", onHand: 18, minLevel: 12, cost: 11000, supplier: "Dapur Pagi", lastUpdated: "Hari ini, 09:10", waste: 2.2, tone: "bg-[#fff0d9] text-[#b87928]" },
  { id: "stock-06", name: "Saus sambal", category: "Bahan baku", unit: "liter", onHand: 1.1, minLevel: 2, cost: 46000, supplier: "Rasa Nusantara", lastUpdated: "13 Sep 2026", waste: 4.8, tone: "bg-[#f3e2df] text-[#aa6359]" },
  { id: "stock-07", name: "Tepung terigu", category: "Bahan baku", unit: "kg", onHand: 14, minLevel: 8, cost: 14500, supplier: "Dapur Pagi", lastUpdated: "12 Sep 2026", waste: 1.2, tone: "bg-[#e4f0e2] text-[#4d865c]" },
  { id: "stock-08", name: "Botol cold brew", category: "Kemasan", unit: "pcs", onHand: 86, minLevel: 50, cost: 2400, supplier: "Kemasan Berkah", lastUpdated: "11 Sep 2026", waste: 0.2, tone: "bg-[#dce9f7] text-[#3a6b9b]" },
];

const initialMovements: StockMovement[] = [
  { id: "movement-01", itemId: "stock-02", type: "Masuk", quantity: 12, unit: "liter", date: "Hari ini, 07:15", note: "Penerimaan susu pagi", staff: "Asep" },
  { id: "movement-02", itemId: "stock-01", type: "Pakai", quantity: 0.8, unit: "kg", date: "Hari ini, 08:40", note: "Produksi kopi dan espresso", staff: "Rina" },
  { id: "movement-03", itemId: "stock-04", type: "Pakai", quantity: 36, unit: "pcs", date: "Hari ini, 08:05", note: "Pesanan dine-in dan takeaway", staff: "Sari" },
  { id: "movement-04", itemId: "stock-06", type: "Pakai", quantity: 0.4, unit: "liter", date: "Kemarin, 16:20", note: "Produksi nasi ayam sambal", staff: "Dani" },
  { id: "movement-05", itemId: "stock-03", type: "Penyesuaian", quantity: 0.2, unit: "kg", date: "Kemarin, 15:10", note: "Koreksi stok opname", staff: "Rina" },
  { id: "movement-06", itemId: "stock-05", type: "Masuk", quantity: 24, unit: "pcs", date: "Kemarin, 09:10", note: "Pengiriman produk siap jual", staff: "Dapur Pagi" },
];

const initialSuppliers: Supplier[] = [
  { id: "supplier-01", name: "Kopi Gunung Putri", category: "Kopi dan bahan minuman", contact: "0812 3300 4412", items: 4, reliability: "98%", tone: "bg-[#d7efeb] text-[#0f766e]" },
  { id: "supplier-02", name: "Kemasan Berkah", category: "Cup dan kemasan", contact: "0813 8801 2244", items: 6, reliability: "96%", tone: "bg-[#e8e3f5] text-[#7362a6]" },
  { id: "supplier-03", name: "Dapur Pagi", category: "Produk bakery", contact: "0821 4455 7722", items: 3, reliability: "94%", tone: "bg-[#fff0d9] text-[#b87928]" },
  { id: "supplier-04", name: "Mitra Susu Garut", category: "Susu dan dairy", contact: "0819 1122 3388", items: 2, reliability: "97%", tone: "bg-[#e3eff8] text-[#3a6b9b]" },
];

const STOCK_PREVIEW_PASSWORD = "nemposukses";
const STOCK_PREVIEW_ACCESS_KEY = "nempo_dapur_stock_preview_access";
const stockStatus = (item: StockItem): StockStatus => item.onHand <= item.minLevel * 0.55 ? "Kritis" : item.onHand <= item.minLevel ? "Menipis" : "Aman";
const formatQty = (quantity: number) => Number.isInteger(quantity) ? String(quantity) : quantity.toLocaleString("id-ID", { maximumFractionDigits: 1 });
const rupiah = (amount: number) => `Rp${Math.round(amount / 1000).toLocaleString("id-ID")}K`;
const fullRupiah = (amount: number) => `Rp${amount.toLocaleString("id-ID")}`;

function StockPreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="Dapur Stock" description="Masukkan password untuk membuka preview stok bahan, barang masuk, pemakaian, dan supplier." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === STOCK_PREVIEW_PASSWORD) {
      localStorage.setItem(STOCK_PREVIEW_ACCESS_KEY, "1");
      onUnlock();
    } else setError(true);
  }
  return <main className="nempo-demo-green nempo-dapur-stock-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]"><div className="w-full max-w-md border border-[#dcebea] bg-[#fbfdfd] p-6 shadow-[0_22px_70px_rgba(24,59,67,0.12)] sm:p-8"><div className="mb-7 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-lg shadow-teal-800/20"><ShoppingBasket className="h-5 w-5" /></div><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f9b8e]">Live preview</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Dapur Stock</h1></div></div><p className="text-sm leading-6 text-[#648084]">Masukkan password untuk membuka preview stok bahan, barang masuk, pemakaian, dan supplier.</p><form onSubmit={submit} className="mt-6 space-y-3"><input type="text" name="username" autoComplete="username" value="dapur-stock-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" /><label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#b75c54] bg-[#fff8f5]" : "border-[#dcebea] focus-within:border-[#0f766e]"}`}><Warehouse className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da5a2]"}`} /><span className="sr-only">Password live preview Dapur Stock</span><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setError(false); }} placeholder="Masukkan password" autoComplete="current-password" autoFocus className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#183b43] outline-none placeholder:text-[#9db5b5]" /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} className="text-[#7da5a2] hover:text-[#0f766e]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></label>{error && <p className="text-xs font-semibold text-[#b75c54]">Password salah. Coba lagi.</p>}<button type="submit" className="w-full rounded-xl bg-[#0f766e] px-4 py-3 text-xs font-black text-white hover:bg-[#0b625c]">Masuk ke preview</button></form><p className="mt-5 flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><Sparkles className="h-3.5 w-3.5 text-[#0f9b8e]" /> Demo data untuk presentasi customer.</p></div></main>;
}

export default function DigitalDapurStockDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <StockPreviewGate onUnlock={() => setUnlocked(true)} />;
  return <StockWorkspace />;
}

function StockWorkspace() {
  const [activeView, setActiveView] = useState<StockView>("overview");
  const [items, setItems] = useState(initialItems);
  const [movements, setMovements] = useState(initialMovements);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"Semua kategori" | StockCategory>("Semua kategori");
  const [statusFilter, setStatusFilter] = useState<"Semua status" | StockStatus>("Semua status");
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItem, setEditItem] = useState<StockItem | null>(null);
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }
  const filteredItems = useMemo(() => items.filter((item) => {
    const needle = query.trim().toLowerCase();
    return (!needle || `${item.name} ${item.category} ${item.supplier}`.toLowerCase().includes(needle)) && (category === "Semua kategori" || item.category === category) && (statusFilter === "Semua status" || stockStatus(item) === statusFilter);
  }), [category, items, query, statusFilter]);
  function receiveStock(itemId: string, quantity: number, note: string) {
    const item = items.find((entry) => entry.id === itemId);
    if (!item) return;
    setItems((current) => current.map((entry) => entry.id === itemId ? { ...entry, onHand: entry.onHand + quantity, lastUpdated: "Baru saja" } : entry));
    setMovements((current) => [{ id: `movement-${Date.now()}`, itemId, type: "Masuk", quantity, unit: item.unit, date: "Baru saja", note, staff: "Anda" }, ...current]);
    setReceiveOpen(false);
    notify(`${item.name} bertambah ${formatQty(quantity)} ${item.unit}.`);
  }
  function useStock(itemId: string, quantity: number, note: string) {
    const item = items.find((entry) => entry.id === itemId);
    if (!item) return;
    const used = Math.min(quantity, item.onHand);
    setItems((current) => current.map((entry) => entry.id === itemId ? { ...entry, onHand: Math.max(0, entry.onHand - used), lastUpdated: "Baru saja" } : entry));
    setMovements((current) => [{ id: `movement-${Date.now()}`, itemId, type: "Pakai", quantity: used, unit: item.unit, date: "Baru saja", note, staff: "Anda" }, ...current]);
    setSelectedItem(null);
    notify(`${item.name} dicatat terpakai ${formatQty(used)} ${item.unit}.`);
  }
  function restock(item: StockItem) {
    const amount = Math.max(item.minLevel * 2, 1);
    receiveStock(item.id, amount, "Restock dari peringatan stok menipis");
  }
  function addItem(item: StockItem) {
    setItems((current) => [item, ...current]);
    setAddItemOpen(false);
    setActiveView("inventory");
    notify(`${item.name} ditambahkan ke stok.`);
  }
  function updateItem(item: StockItem) {
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, ...item, lastUpdated: "Baru saja" } : entry));
    setSelectedItem((current) => current?.id === item.id ? { ...item, lastUpdated: "Baru saja" } : current);
    setEditItem(null);
    notify(`${item.name} berhasil diperbarui.`);
  }
  function addSupplier(supplier: Supplier) {
    setSuppliers((current) => [supplier, ...current]);
    setAddSupplierOpen(false);
    notify(`${supplier.name} ditambahkan ke daftar supplier.`);
  }
  function resetDemo() {
    setActiveView("overview");
    setItems(initialItems);
    setMovements(initialMovements);
    setSuppliers(initialSuppliers);
    setQuery("");
    setCategory("Semua kategori");
    setStatusFilter("Semua status");
    setSelectedItem(null);
    setReceiveOpen(false);
    setAddItemOpen(false);
    setEditItem(null);
    setAddSupplierOpen(false);
    notify("Demo Dapur Stock dikembalikan ke data awal.");
  }
  function exportStock() {
    const rows = [["Bahan", "Kategori", "Stok", "Satuan", "Minimum", "Status", "Supplier"], ...items.map((item) => [item.name, item.category, formatQty(item.onHand), item.unit, formatQty(item.minLevel), stockStatus(item), item.supplier])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = "nempo-dapur-stock.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    notify("Data stok berhasil diekspor.");
  }
  const lowStock = items.filter((item) => stockStatus(item) !== "Aman");
  const activeItem = selectedItem ? items.find((item) => item.id === selectedItem.id) ?? selectedItem : null;
  const activeMovements = activeItem ? movements.filter((movement) => movement.itemId === activeItem.id) : [];
  return <Layout><SEO title="Dapur Stock Demo — Digi Nempo" description="Preview Dapur Stock Digi Nempo untuk mengelola bahan, pemakaian, supplier, dan peringatan stok." keywords="Dapur Stock, stok dapur, inventory, supplier, Digi Nempo" path="/digital-services/dapur-stock" /><main className="nempo-demo-green nempo-dapur-stock-preview min-h-screen bg-[#f4f7f7] text-[#183b43]"><div className="mx-auto max-w-[1480px] px-3 py-5 sm:px-6 lg:px-8 lg:py-8"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><Link href="/digital-services" className="inline-flex items-center gap-2 text-[10px] font-black text-[#648084] hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Digi Nempo</Link><div className="flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><span className="h-2 w-2 rounded-full bg-[#1db49f]" /> Demo workspace · data simulasi</div></div><div className="overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_24px_70px_rgba(20,74,77,0.1)]"><div className="flex min-h-[760px] flex-col lg:flex-row"><aside className="hidden w-[226px] shrink-0 bg-[#123f47] p-4 text-white lg:flex lg:flex-col"><div className="flex items-center gap-2.5 border-b border-white/10 px-2 pb-5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0f9b8e]"><ShoppingBasket className="h-4 w-4" /></div><div><p className="text-xs font-black">Nempo Dapur Stock</p><p className="mt-0.5 text-[9px] font-semibold text-white/45">Kopi Nempo · Garut</p></div></div><div className="px-2 pt-6"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#72cfc4]">Operasional</p><nav className="mt-3 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black transition-colors ${activeView === id ? "bg-white text-[#0f766e]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}{id === "inventory" && lowStock.length > 0 && <span className="ml-auto rounded-full bg-[#e7a77d] px-1.5 py-0.5 text-[8px] text-white">{lowStock.length}</span>}</button>)}</nav></div><div className="mt-auto rounded-2xl bg-white/10 p-3.5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Super App connected</p><p className="mt-2 text-[11px] font-bold leading-4 text-white">Stok terhubung dengan Kasir, HPP, Resep, dan Pembelian.</p><Link href="/digital-services/super-app?module=dapur-stock" className="mt-3 inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Lihat alur integrasi <ArrowRight className="h-3 w-3" /></Link></div></aside><section className="min-w-0 flex-1 bg-[#f8fbfb]"><div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kopi Nempo · Kitchen operations</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{navItems.find((item) => item.id === activeView)?.label}</h1><p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Tahu bahan apa yang tersedia, dipakai, dan perlu dibeli sebelum operasional terganggu.</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setActiveView("receiving")} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Truck className="h-3.5 w-3.5" /> Catat barang masuk</button><button type="button" onClick={() => setAddItemOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah bahan</button><button type="button" onClick={resetDemo} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><RefreshCcw className="h-3.5 w-3.5" /> Reset</button></div></div></div><div className="flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white px-4 py-2 lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b]"}`}><Icon className="h-3 w-3" />{label}</button>)}</div><div className="p-4 sm:p-6">{activeView === "overview" && <OverviewView items={items} movements={movements} lowStock={lowStock} onView={setActiveView} onItem={setSelectedItem} onRestock={restock} onNotify={notify} />}{activeView === "inventory" && <InventoryView items={filteredItems} query={query} setQuery={setQuery} category={category} setCategory={setCategory} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onAdd={() => setAddItemOpen(true)} onExport={exportStock} onItem={setSelectedItem} />}{activeView === "receiving" && <ReceivingView items={items} movements={movements} onReceive={() => setReceiveOpen(true)} onItem={setSelectedItem} />}{activeView === "usage" && <UsageView items={items} movements={movements} onItem={setSelectedItem} onUsage={(item) => setSelectedItem(item)} />}{activeView === "suppliers" && <SuppliersView suppliers={suppliers} items={items} onNotify={notify} onAdd={() => setAddSupplierOpen(true)} />}{activeView === "reports" && <ReportsView items={items} movements={movements} onExport={exportStock} />}</div></section></div></div><div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]"><span>Data simulasi untuk kebutuhan presentasi customer.</span><span className="hidden items-center gap-1 sm:inline-flex"><Clock3 className="h-3 w-3" /> Terakhir diperbarui beberapa detik lalu</span></div></div>{receiveOpen && <ReceiveModal items={items} initialItemId={activeItem?.id} onClose={() => setReceiveOpen(false)} onSubmit={receiveStock} />}{addItemOpen && <AddStockModal suppliers={suppliers} onClose={() => setAddItemOpen(false)} onSubmit={addItem} />}{editItem && <EditStockModal item={editItem} onClose={() => setEditItem(null)} onSubmit={updateItem} />}{addSupplierOpen && <AddSupplierModal onClose={() => setAddSupplierOpen(false)} onSubmit={addSupplier} />}{activeItem && <StockDrawer item={activeItem} movements={activeMovements} onClose={() => setSelectedItem(null)} onReceive={() => { setReceiveOpen(true); }} onUsage={(item) => { setSelectedItem(item); }} onEdit={setEditItem} onUse={useStock} onNotify={notify} />}{toast && <div role="status" className="fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f47] px-4 py-3 text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8bd6cc]" /> {toast}</div>}</main></Layout>;
}

function OverviewView({ items, movements, lowStock, onView, onItem, onRestock, onNotify }: { items: StockItem[]; movements: StockMovement[]; lowStock: StockItem[]; onView: (view: StockView) => void; onItem: (item: StockItem) => void; onRestock: (item: StockItem) => void; onNotify: (message: string) => void }) {
  const value = items.reduce((sum, item) => sum + item.onHand * item.cost, 0);
  const used = movements.filter((movement) => movement.type === "Pakai").reduce((sum, movement) => sum + movement.quantity, 0);
  return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={Warehouse} label="Nilai stok saat ini" value={rupiah(value)} detail="+8,4% dari minggu lalu" tone="teal" /><MetricCard icon={CircleAlert} label="Perlu restock" value={`${lowStock.length} item`} detail={lowStock.length ? "Perlu perhatian" : "Semua aman"} tone="amber" /><MetricCard icon={UtensilsCrossed} label="Pemakaian bulan ini" value={`${formatQty(used)} unit`} detail="+12,8% dari bulan lalu" tone="blue" /><MetricCard icon={Trash2} label="Waste rate" value="2,1%" detail="-0,6% lebih efisien" tone="violet" /></div><div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kontrol persediaan</p><h2 className="mt-2 text-lg font-black text-[#244950]">Dapur siap melayani.</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">Stok yang jelas membantu tim belanja tepat waktu dan mengurangi bahan terbuang.</p></div><button type="button" onClick={() => onView("inventory")} className="rounded-lg p-2 text-[#0f766e] hover:bg-[#e6f6f3]"><ArrowRight className="h-4 w-4" /></button></div><div className="mt-5 space-y-2">{items.slice(0, 4).map((item) => <button key={item.id} type="button" onClick={() => onItem(item)} className="flex w-full items-center gap-3 rounded-xl border border-[#edf3f2] p-3 text-left hover:border-[#b9ded8] hover:bg-[#fbfefe]"><span className={`grid h-9 w-9 place-items-center rounded-xl ${item.tone}`}><Package className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{item.name}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{item.category} · minimum {formatQty(item.minLevel)} {item.unit}</p></div><div className="text-right"><p className="text-[10px] font-black text-[#365b60]">{formatQty(item.onHand)} {item.unit}</p><StockPill status={stockStatus(item)} /></div><ChevronRight className="h-3.5 w-3.5 text-[#9eb4b5]" /></button>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-[#123f47] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Stock insight</p><h2 className="mt-2 text-lg font-black leading-tight">Belanja berdasarkan data.</h2></div><Sparkles className="h-5 w-5 text-[#8bd6cc]" /></div><p className="mt-3 text-[10px] leading-5 text-white/60">Susu segar dan cup 16 oz sedang berada di bawah batas minimum. Restock sekarang agar operasional besok tetap lancar.</p><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Akurasi stok</p><p className="mt-1 text-xl font-black">96,8%</p><p className="mt-1 text-[9px] font-bold text-[#8bd6cc]">+2,4%</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Waste bulan ini</p><p className="mt-1 text-xl font-black">Rp420K</p><p className="mt-1 text-[9px] font-bold text-[#8bd6cc]">-11,2%</p></div></div><button type="button" onClick={() => lowStock[0] ? onRestock(lowStock[0]) : onNotify("Belum ada item yang perlu direstock.")} className="mt-5 flex items-center gap-1.5 text-[10px] font-black text-[#a2e7df]">Restock prioritas <ArrowRight className="h-3 w-3" /></button></section></div><div className="grid gap-4 xl:grid-cols-[1fr_1fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Peringatan stok</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Bahan di bawah batas minimum</p></div><button type="button" onClick={() => onView("inventory")} className="text-[10px] font-black text-[#0f766e]">Lihat semua</button></div><div className="mt-4 space-y-2">{lowStock.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-xl border border-[#f2eadf] bg-[#fffdf9] p-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff1dc] text-[#a56c2b]"><CircleAlert className="h-3.5 w-3.5" /></span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{item.name}</p><p className="mt-1 text-[9px] text-[#94a8aa]">{formatQty(item.onHand)} {item.unit} tersisa · minimum {formatQty(item.minLevel)} {item.unit}</p></div><button type="button" onClick={() => onRestock(item)} className="text-[9px] font-black text-[#a56c2b]">Restock</button></div>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Aktivitas terbaru</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Pergerakan stok terakhir</p></div><button type="button" onClick={() => onNotify("Riwayat lengkap tersedia di modul laporan.")} className="rounded-lg p-2 text-[#0f766e] hover:bg-[#e6f6f3]"><History className="h-4 w-4" /></button></div><div className="mt-4 space-y-3">{movements.slice(0, 4).map((movement) => { const item = items.find((entry) => entry.id === movement.itemId); return <div key={movement.id} className="flex items-center gap-3"><MovementIcon type={movement.type} /><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{movement.type} · {item?.name}</p><p className="mt-1 truncate text-[9px] text-[#94a8aa]">{movement.note} · {movement.date}</p></div><span className={`text-[10px] font-black ${movement.type === "Masuk" ? "text-[#0f766e]" : movement.type === "Pakai" ? "text-[#a56c2b]" : "text-[#6d878a]"}`}>{movement.type === "Masuk" ? "+" : movement.type === "Pakai" ? "-" : "±"}{formatQty(movement.quantity)} {movement.unit}</span></div>; })}</div></section></div></div>;
}

function InventoryView({ items, query, setQuery, category, setCategory, statusFilter, setStatusFilter, onAdd, onExport, onItem }: { items: StockItem[]; query: string; setQuery: (value: string) => void; category: "Semua kategori" | StockCategory; setCategory: (value: "Semua kategori" | StockCategory) => void; statusFilter: "Semua status" | StockStatus; setStatusFilter: (value: "Semua status" | StockStatus) => void; onAdd: () => void; onExport: () => void; onItem: (item: StockItem) => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Database persediaan" title="Stok bahan" description="Kelola bahan baku, kemasan, dan produk siap jual dalam satu sumber data." /><div className="flex gap-2"><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export</button><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah bahan</button></div></div><div className="flex flex-col gap-2 rounded-2xl border border-[#e3eeed] bg-white p-3 sm:flex-row"><label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-[#f4f9f8] px-3 py-2.5"><Search className="h-4 w-4 text-[#8aa1a3]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama bahan atau supplier..." className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#a2b3b4]" /></label><label className="flex items-center gap-2 rounded-xl border border-[#e3eeed] px-3 py-2.5 text-[10px] font-black text-[#648084]"><Tag className="h-3.5 w-3.5 text-[#0f766e]" /><select value={category} onChange={(event) => setCategory(event.target.value as "Semua kategori" | StockCategory)} className="bg-transparent outline-none">{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="flex items-center gap-2 rounded-xl border border-[#e3eeed] px-3 py-2.5 text-[10px] font-black text-[#648084]"><Filter className="h-3.5 w-3.5 text-[#0f766e]" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "Semua status" | StockStatus)} className="bg-transparent outline-none">{stockFilters.map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="overflow-hidden rounded-2xl border border-[#e3eeed] bg-white"><div className="hidden grid-cols-[1.35fr_.9fr_.8fr_.85fr_1fr_24px] gap-3 border-b border-[#edf3f2] px-4 py-3 text-[9px] font-black uppercase tracking-[0.12em] text-[#9aadae] md:grid"><span>Bahan</span><span>Kategori</span><span>Stok</span><span>Status</span><span>Supplier</span><span /></div><div className="divide-y divide-[#edf3f2]">{items.length ? items.map((item) => <div key={item.id} className="grid gap-3 px-4 py-3.5 transition-colors hover:bg-[#fbfefe] md:grid-cols-[1.35fr_.9fr_.8fr_.85fr_1fr_24px] md:items-center"><button type="button" onClick={() => onItem(item)} className="flex min-w-0 items-center gap-3 text-left"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.tone}`}><Package className="h-4 w-4" /></span><span className="min-w-0"><strong className="block truncate text-[11px] font-black text-[#365b60]">{item.name}</strong><span className="mt-1 block truncate text-[9px] font-semibold text-[#94a8aa]">Update {item.lastUpdated}</span></span></button><span className="text-[10px] font-semibold text-[#6d878a]">{item.category}</span><span className="text-[10px] font-black text-[#365b60]">{formatQty(item.onHand)} {item.unit}<small className="ml-1 text-[9px] font-semibold text-[#a2b3b4]">/ min {formatQty(item.minLevel)}</small></span><span><StockPill status={stockStatus(item)} /></span><span className="truncate text-[9px] font-semibold text-[#94a8aa]">{item.supplier}</span><button type="button" onClick={() => onItem(item)} aria-label={`Buka detail ${item.name}`} className="hidden place-items-center rounded-lg p-1.5 text-[#94a8aa] hover:bg-[#e6f6f3] hover:text-[#0f766e] md:grid"><ChevronRight className="h-4 w-4" /></button></div>) : <div className="p-10 text-center"><Search className="mx-auto h-6 w-6 text-[#b3c5c5]" /><p className="mt-3 text-xs font-black text-[#365b60]">Bahan tidak ditemukan</p><p className="mt-1 text-[10px] text-[#94a8aa]">Coba kata kunci atau filter lain.</p></div>}</div></div></div>;
}

function ReceivingView({ items, movements, onReceive, onItem }: { items: StockItem[]; movements: StockMovement[]; onReceive: () => void; onItem: (item: StockItem) => void }) {
  const receiving = movements.filter((movement) => movement.type === "Masuk");
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Penerimaan bahan" title="Barang masuk" description="Catat bahan yang datang supaya stok dan riwayat supplier selalu punya dasar." /><button type="button" onClick={onReceive} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Catat penerimaan</button></div><div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Riwayat barang masuk</h2><p className="mt-1 text-[10px] text-[#94a8aa]">{receiving.length} penerimaan tercatat</p></div><Truck className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-4 divide-y divide-[#edf3f2]">{receiving.map((movement) => { const item = items.find((entry) => entry.id === movement.itemId); return <button key={movement.id} type="button" onClick={() => item && onItem(item)} className="flex w-full items-center gap-3 py-3 text-left first:pt-0"><MovementIcon type={movement.type} /><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{item?.name}</p><p className="mt-1 truncate text-[9px] text-[#94a8aa]">{movement.note} · {movement.date}</p></div><div className="text-right"><p className="text-[10px] font-black text-[#0f766e]">+{formatQty(movement.quantity)} {movement.unit}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{movement.staff}</p></div></button>; })}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-[#e6f6f3] p-5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#0f766e]">Kontrol penerimaan</p><h2 className="mt-2 text-lg font-black leading-tight text-[#244950]">Stok masuk dengan konteks.</h2><p className="mt-3 text-[10px] leading-5 text-[#5d7b7d]">Setiap penerimaan mencatat jumlah, waktu, staff, dan catatan supaya stok mudah ditelusuri ketika ada selisih.</p><div className="mt-5 rounded-xl bg-white p-3"><div className="flex items-center justify-between text-[10px] font-black text-[#365b60]"><span>Penerimaan bulan ini</span><span className="text-[#0f766e]">24</span></div><div className="mt-2 h-2 rounded-full bg-[#d4efeb]"><div className="h-full w-[82%] rounded-full bg-[#0f766e]" /></div></div></section></div></div>;
}

function UsageView({ items, movements, onItem, onUsage }: { items: StockItem[]; movements: StockMovement[]; onItem: (item: StockItem) => void; onUsage: (item: StockItem) => void }) {
  const usage = movements.filter((movement) => movement.type === "Pakai");
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Pemakaian produksi" title="Pemakaian bahan" description="Catat bahan yang dipakai untuk produksi supaya HPP dan kebutuhan restock lebih akurat." /><span className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#e6f6f3] px-3 py-2.5 text-[10px] font-black text-[#0f766e]"><UtensilsCrossed className="h-3.5 w-3.5" /> Terhubung ke Resep</span></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{usage.map((movement) => { const item = items.find((entry) => entry.id === movement.itemId); return <article key={movement.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-start justify-between gap-3"><MovementIcon type={movement.type} /><span className="text-[9px] font-semibold text-[#94a8aa]">{movement.date}</span></div><button type="button" onClick={() => item && onItem(item)} className="mt-4 block text-left"><h2 className="text-sm font-black text-[#365b60]">{item?.name}</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{movement.note}</p></button><div className="mt-4 flex items-end justify-between border-t border-[#edf3f2] pt-3"><div><p className="text-[9px] text-[#94a8aa]">Terpakai</p><p className="mt-1 text-lg font-black text-[#a56c2b]">-{formatQty(movement.quantity)} {movement.unit}</p></div><button type="button" onClick={() => item && onUsage(item)} className="text-[9px] font-black text-[#0f766e]">Catat lagi <ArrowRight className="ml-1 inline h-3 w-3" /></button></div></article>; })}</div></div>;
}

function SuppliersView({ suppliers, items, onNotify, onAdd }: { suppliers: Supplier[]; items: StockItem[]; onNotify: (message: string) => void; onAdd: () => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Mitra bahan" title="Supplier" description="Pantau supplier, jenis bahan, dan konsistensi penerimaan untuk keputusan pembelian yang lebih tenang." /><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah supplier</button></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{suppliers.map((supplier) => <article key={supplier.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${supplier.tone}`}><Truck className="h-4 w-4" /></span><button type="button" onClick={() => onNotify(`Menu ${supplier.name} dibuka.`)} aria-label={`Opsi ${supplier.name}`} className="text-[#9aadae]"><MoreHorizontal className="h-4 w-4" /></button></div><h2 className="mt-4 text-sm font-black text-[#365b60]">{supplier.name}</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{supplier.category}</p><div className="mt-5 grid grid-cols-2 gap-2"><MiniStat label="Jenis bahan" value={`${supplier.items} item`} /><MiniStat label="Ketepatan" value={supplier.reliability} /></div><p className="mt-4 text-[10px] font-semibold text-[#648084]">{supplier.contact}</p><button type="button" onClick={() => onNotify(`${items.filter((item) => item.supplier === supplier.name).length} item terhubung ke ${supplier.name}.`)} className="mt-3 text-[9px] font-black text-[#0f766e]">Lihat bahan terhubung <ArrowRight className="ml-1 inline h-3 w-3" /></button></article>)}</div></div>;
}

function ReportsView({ items, movements, onExport }: { items: StockItem[]; movements: StockMovement[]; onExport: () => void }) {
  const bars = [48, 64, 52, 75, 66, 88, 80];
  const totalMovement = movements.reduce((sum, movement) => sum + movement.quantity, 0);
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Analitik dapur" title="Laporan stok" description="Lihat nilai persediaan, pola pemakaian, dan efisiensi bahan untuk membantu keputusan operasional." /><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export data</button></div><div className="grid gap-3 sm:grid-cols-3"><MetricCard icon={Warehouse} label="Nilai persediaan" value={rupiah(items.reduce((sum, item) => sum + item.onHand * item.cost, 0))} detail="+8,4% vs minggu lalu" tone="teal" /><MetricCard icon={UtensilsCrossed} label="Total pergerakan" value={`${formatQty(totalMovement)} unit`} detail="+12,8% dari periode lalu" tone="blue" /><MetricCard icon={Trash2} label="Efisiensi waste" value="97,9%" detail="+2,1% lebih baik" tone="violet" /></div><div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Pemakaian bahan</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Performa 7 minggu terakhir</p></div><span className="rounded-lg bg-[#e6f6f3] px-2.5 py-1.5 text-[9px] font-black text-[#0f766e]">-6,4% waste</span></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-[#edf3f2] px-1">{bars.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className={`w-full max-w-[34px] rounded-t-lg ${index === bars.length - 1 ? "bg-[#0f766e]" : "bg-[#a9dcd6]"}`} style={{ height: `${value}%` }} /><span className="text-[9px] font-bold text-[#a2b3b4]">M{index + 1}</span></div>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Komposisi stok</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Berdasarkan nilai persediaan</p></div><Leaf className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-5 space-y-4">{(["Bahan baku", "Kemasan", "Produk siap jual"] as StockCategory[]).map((category, index) => { const amount = items.filter((item) => item.category === category).reduce((sum, item) => sum + item.onHand * item.cost, 0); return <div key={category}><div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-[#6d878a]"><span>{category}</span><span>{rupiah(amount)}</span></div><div className="h-2 rounded-full bg-[#edf3f2]"><div className={`h-full rounded-full ${["bg-[#0f766e]", "bg-[#55bdb1]", "bg-[#8bd6cc]"][index]}`} style={{ width: `${Math.max(12, Math.min(100, amount / 2500000 * 100))}%` }} /></div></div>; })}</div></section></div></div>;
}

function StockDrawer({ item, movements, onClose, onReceive, onUsage, onEdit, onUse, onNotify }: { item: StockItem; movements: StockMovement[]; onClose: () => void; onReceive: (item: StockItem) => void; onUsage: (item: StockItem) => void; onEdit: (item: StockItem) => void; onUse: (itemId: string, quantity: number, note: string) => void; onNotify: (message: string) => void }) {
  const [usage, setUsage] = useState("1");
  const [usageNote, setUsageNote] = useState("Pemakaian produksi hari ini");
  return <div className="fixed inset-0 z-[70] bg-[#183b43]/35 backdrop-blur-sm" onMouseDown={onClose}><aside role="dialog" aria-modal="true" aria-label={`Detail stok ${item.name}`} onMouseDown={(event) => event.stopPropagation()} className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-[#e3eeed] p-5"><div className="flex items-center gap-3"><span className={`grid h-12 w-12 place-items-center rounded-xl ${item.tone}`}><Package className="h-5 w-5" /></span><div><p className="text-lg font-black text-[#244950]">{item.name}</p><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{item.category} · {item.supplier}</p></div></div><button type="button" onClick={onClose} aria-label="Tutup detail stok" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="flex-1 overflow-y-auto p-5"><div className="grid grid-cols-2 gap-2"><div className="rounded-xl bg-[#f4f9f8] p-3"><p className="text-[9px] font-bold text-[#94a8aa]">Stok tersedia</p><p className="mt-1 text-xl font-black text-[#365b60]">{formatQty(item.onHand)} <small className="text-[10px]">{item.unit}</small></p><StockPill status={stockStatus(item)} /></div><div className="rounded-xl bg-[#f4f9f8] p-3"><p className="text-[9px] font-bold text-[#94a8aa]">Nilai stok</p><p className="mt-1 text-xl font-black text-[#365b60]">{fullRupiah(item.onHand * item.cost)}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">HPP {fullRupiah(item.cost)} / {item.unit}</p></div></div><div className="mt-5"><div className="flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">Catat pemakaian</p><span className="text-[9px] font-semibold text-[#94a8aa]">Minimum {formatQty(item.minLevel)} {item.unit}</span></div><div className="mt-3 rounded-xl border border-[#e3eeed] p-3"><div className="grid gap-3 sm:grid-cols-[100px_1fr]"><Field label={`Jumlah (${item.unit})`}><input type="number" min="0" max={item.onHand} step="0.1" value={usage} onChange={(event) => setUsage(event.target.value)} className={fieldClass} /></Field><Field label="Catatan"><input value={usageNote} onChange={(event) => setUsageNote(event.target.value)} className={fieldClass} /></Field></div><button type="button" onClick={() => onUse(item.id, Number(usage) || 0, usageNote)} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><UtensilsCrossed className="h-3.5 w-3.5" /> Simpan pemakaian</button></div></div><div className="mt-5"><div className="flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">Riwayat pergerakan</p><button type="button" onClick={() => onNotify("Riwayat lengkap tersedia di laporan stok.")} className="text-[9px] font-black text-[#0f766e]">Lihat semua</button></div><div className="mt-3 space-y-3">{movements.length ? movements.map((movement) => <div key={movement.id} className="flex items-center gap-2.5"><MovementIcon type={movement.type} /><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{movement.type} {formatQty(movement.quantity)} {movement.unit}</p><p className="mt-1 truncate text-[9px] text-[#94a8aa]">{movement.note} · {movement.date}</p></div></div>) : <p className="rounded-xl bg-[#f4f9f8] p-3 text-[10px] text-[#94a8aa]">Belum ada pergerakan.</p>}</div></div></div><div className="border-t border-[#e3eeed] p-4"><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => onReceive(item)} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#dcebea] py-3 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Truck className="h-3.5 w-3.5" /> Barang masuk</button><button type="button" onClick={() => onEdit(item)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#e6f6f3] py-3 text-[10px] font-black text-[#0f766e] hover:bg-[#d4efeb]"><Pencil className="h-3.5 w-3.5" /> Edit bahan</button></div></div></aside></div>;
}

function ReceiveModal({ items, initialItemId, onClose, onSubmit }: { items: StockItem[]; initialItemId?: string; onClose: () => void; onSubmit: (itemId: string, quantity: number, note: string) => void }) {
  const [itemId, setItemId] = useState(initialItemId ?? items[0]?.id ?? "");
  const [quantity, setQuantity] = useState("10");
  const [note, setNote] = useState("Penerimaan bahan dari supplier");
  return <ModalShell title="Catat barang masuk" eyebrow="Penerimaan stok" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); onSubmit(itemId, Number(quantity) || 0, note); }} className="space-y-4"><Field label="Bahan"><select value={itemId} onChange={(event) => setItemId(event.target.value)} className={fieldClass}>{items.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.unit}</option>)}</select></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Jumlah masuk"><input required type="number" min="0.1" step="0.1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className={fieldClass} /></Field><Field label="Tanggal"><select className={fieldClass}><option>Hari ini</option><option>Kemarin</option><option>12 Sep 2026</option></select></Field></div><Field label="Catatan penerimaan"><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className={`${fieldClass} resize-none`} /></Field><div className="rounded-xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] p-3"><p className="flex items-center gap-2 text-[10px] font-black text-[#08766f]"><Truck className="h-3.5 w-3.5" /> Stok otomatis diperbarui</p><p className="mt-1 text-[9px] leading-4 text-[#6d878a]">Pergerakan akan masuk ke riwayat dan memengaruhi status restock.</p></div><ModalActions onClose={onClose} submitLabel="Simpan penerimaan" /></form></ModalShell>;
}

function AddStockModal({ suppliers, onClose, onSubmit }: { suppliers: Supplier[]; onClose: () => void; onSubmit: (item: StockItem) => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<StockCategory>("Bahan baku");
  const [unit, setUnit] = useState("kg");
  const [minimum, setMinimum] = useState("5");
  const [cost, setCost] = useState("25000");
  const [supplier, setSupplier] = useState("Dapur Pagi");
  return <ModalShell title="Tambah bahan baru" eyebrow="Database persediaan" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); if (!name.trim()) return; onSubmit({ id: `stock-${Date.now()}`, name: name.trim(), category, unit, onHand: 0, minLevel: Number(minimum) || 0, cost: Number(cost) || 0, supplier, lastUpdated: "Baru saja", waste: 0, tone: "bg-[#d7efeb] text-[#0f766e]" }); }} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama bahan"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Sirup pandan" className={fieldClass} /></Field><Field label="Kategori"><select value={category} onChange={(event) => setCategory(event.target.value as StockCategory)} className={fieldClass}><option>Bahan baku</option><option>Kemasan</option><option>Produk siap jual</option></select></Field></div><div className="grid gap-4 sm:grid-cols-3"><Field label="Satuan"><select value={unit} onChange={(event) => setUnit(event.target.value)} className={fieldClass}><option>kg</option><option>liter</option><option>pcs</option><option>karton</option></select></Field><Field label="Minimum stok"><input type="number" min="0" value={minimum} onChange={(event) => setMinimum(event.target.value)} className={fieldClass} /></Field><Field label="HPP per satuan"><input type="number" min="0" value={cost} onChange={(event) => setCost(event.target.value)} className={fieldClass} /></Field></div><Field label="Supplier utama"><select value={supplier} onChange={(event) => setSupplier(event.target.value)} className={fieldClass}>{suppliers.map((entry) => <option key={entry.id} value={entry.name}>{entry.name}</option>)}</select></Field><ModalActions onClose={onClose} submitLabel="Simpan bahan" /></form></ModalShell>;
}

function EditStockModal({ item, onClose, onSubmit }: { item: StockItem; onClose: () => void; onSubmit: (item: StockItem) => void }) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState<StockCategory>(item.category);
  const [unit, setUnit] = useState(item.unit);
  const [minimum, setMinimum] = useState(String(item.minLevel));
  const [cost, setCost] = useState(String(item.cost));
  const [supplier, setSupplier] = useState(item.supplier);
  return <ModalShell title={`Edit ${item.name}`} eyebrow="Database persediaan" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); if (!name.trim()) return; onSubmit({ ...item, name: name.trim(), category, unit, minLevel: Number(minimum) || 0, cost: Number(cost) || 0, supplier }); }} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama bahan"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} /></Field><Field label="Kategori"><select value={category} onChange={(event) => setCategory(event.target.value as StockCategory)} className={fieldClass}><option>Bahan baku</option><option>Kemasan</option><option>Produk siap jual</option></select></Field></div><div className="grid gap-4 sm:grid-cols-3"><Field label="Satuan"><select value={unit} onChange={(event) => setUnit(event.target.value)} className={fieldClass}><option>kg</option><option>liter</option><option>pcs</option><option>karton</option></select></Field><Field label="Minimum stok"><input type="number" min="0" value={minimum} onChange={(event) => setMinimum(event.target.value)} className={fieldClass} /></Field><Field label="HPP per satuan"><input type="number" min="0" value={cost} onChange={(event) => setCost(event.target.value)} className={fieldClass} /></Field></div><Field label="Supplier utama"><input value={supplier} onChange={(event) => setSupplier(event.target.value)} className={fieldClass} /></Field><div className="rounded-xl border border-[#dcebea] bg-[#f4f9f8] p-3"><p className="text-[10px] font-black text-[#0f766e]">Stok tersedia tetap {formatQty(item.onHand)} {item.unit}</p><p className="mt-1 text-[9px] leading-4 text-[#6d878a]">Edit bahan hanya mengubah identitas, batas minimum, HPP, dan supplier.</p></div><ModalActions onClose={onClose} submitLabel="Simpan perubahan" /></form></ModalShell>;
}

function AddSupplierModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (supplier: Supplier) => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Bahan baku dan minuman");
  const [contact, setContact] = useState("");
  return <ModalShell title="Tambah supplier" eyebrow="Mitra bahan" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); if (!name.trim() || !contact.trim()) return; onSubmit({ id: `supplier-${Date.now()}`, name: name.trim(), category, contact: contact.trim(), items: 0, reliability: "Baru", tone: "bg-[#d7efeb] text-[#0f766e]" }); }} className="space-y-4"><Field label="Nama supplier"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Segar Makmur Garut" className={fieldClass} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Kategori bahan"><select value={category} onChange={(event) => setCategory(event.target.value)} className={fieldClass}><option>Bahan baku dan minuman</option><option>Kemasan</option><option>Produk bakery</option><option>Produk segar</option></select></Field><Field label="Nomor kontak"><input required value={contact} onChange={(event) => setContact(event.target.value)} placeholder="08xx xxxx xxxx" className={fieldClass} /></Field></div><div className="rounded-xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] p-3"><p className="text-[10px] font-black text-[#08766f]">Supplier siap dipakai di database stok</p><p className="mt-1 text-[9px] leading-4 text-[#6d878a]">Kamu dapat menghubungkannya ke bahan saat membuat atau mengedit item stok.</p></div><ModalActions onClose={onClose} submitLabel="Simpan supplier" /></form></ModalShell>;
}

function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[75] flex items-end justify-center bg-[#183b43]/40 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div role="dialog" aria-modal="true" className="w-full max-w-2xl rounded-t-[26px] bg-white p-5 shadow-2xl sm:rounded-[26px] sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0f766e]">{eyebrow}</p><h2 className="mt-2 text-xl font-black text-[#183b43]">{title}</h2></div><button type="button" onClick={onClose} aria-label="Tutup modal" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-6">{children}</div></div></div>;
}

function ModalActions({ onClose, submitLabel }: { onClose: () => void; submitLabel: string }) {
  return <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[10px] font-black text-[#6d878a] hover:bg-[#f4f9f8]">Batal</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]">{submitLabel}</button></div>;
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">{eyebrow}</p><h2 className="mt-1.5 text-lg font-black tracking-tight text-[#244950]">{title}</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">{description}</p></div>;
}

function StockPill({ status }: { status: StockStatus }) {
  const tone = status === "Aman" ? "bg-[#e6f6f3] text-[#0f766e]" : status === "Menipis" ? "bg-[#fff3df] text-[#a56c2b]" : "bg-[#f3e2df] text-[#aa6359]";
  return <span className={`rounded-full px-2 py-1 text-[8px] font-black ${tone}`}>{status}</span>;
}

function MovementIcon({ type }: { type: MovementType }) {
  const Icon = type === "Masuk" ? Truck : type === "Pakai" ? UtensilsCrossed : RefreshCcw;
  const tone = type === "Masuk" ? "bg-[#e6f6f3] text-[#0f766e]" : type === "Pakai" ? "bg-[#fff1dc] text-[#a56c2b]" : "bg-[#f2f4f4] text-[#6d878a]";
  return <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${tone}`}><Icon className="h-3.5 w-3.5" /></span>;
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: typeof Package; label: string; value: string; detail: string; tone: "teal" | "blue" | "violet" | "amber" }) {
  const styles = { teal: "bg-[#e6f6f3] text-[#0f766e]", blue: "bg-[#e3eff8] text-[#3a6b9b]", violet: "bg-[#ece9f8] text-[#7362a6]", amber: "bg-[#fff1dc] text-[#a56c2b]" };
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center justify-between"><span className={`grid h-9 w-9 place-items-center rounded-xl ${styles[tone]}`}><Icon className="h-4 w-4" /></span><CircleCheck className={`h-3.5 w-3.5 ${tone === "teal" ? "text-[#0f9b8e]" : "text-[#9cb3b5]"}`} /></div><p className="mt-4 text-[10px] font-bold text-[#94a8aa]">{label}</p><p className="mt-1 text-2xl font-black tracking-tight text-[#244950]">{value}</p><p className="mt-1 text-[9px] font-bold text-[#0f766e]">{detail}</p></div>;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f4f9f8] p-2"><p className="text-[8px] font-semibold text-[#94a8aa]">{label}</p><p className="mt-1 text-[12px] font-black text-[#365b60]">{value}</p></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">{label}</span>{children}</label>;
}

const fieldClass = "w-full rounded-xl border border-[#dcebea] bg-[#fbfdfd] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:border-[#0f766e] focus:ring-2 focus:ring-[#b9ded8]";