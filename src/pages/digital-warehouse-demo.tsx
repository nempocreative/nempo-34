import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Box,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  History,
  LayoutDashboard,
  Lock,
  MapPin,
  MoreHorizontal,
  Package,
  PackageCheck,
  PackageOpen,
  Plus,
  RefreshCcw,
  Search,
  Send,
  Settings2,
  Sparkles,
  Truck,
  UserRound,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@/lib/wouter";
import "./digital-demo-super-app.css";

type WarehouseView = "overview" | "inventory" | "movements" | "transfers" | "suppliers" | "reports";
type WarehouseName = "Gudang Pusat" | "Cabang Cikajang" | "Dapur Produksi";
type StockCategory = "Bahan baku" | "Kemasan" | "Produk jual";
type MovementType = "Masuk" | "Keluar" | "Penyesuaian";
type TransferStatus = "Menunggu" | "Dikirim" | "Diterima";

type WarehouseItem = {
  id: string;
  sku: string;
  name: string;
  category: StockCategory;
  unit: string;
  onHand: number;
  reserved: number;
  minStock: number;
  maxStock: number;
  cost: number;
  location: WarehouseName;
  supplier: string;
  lastUpdated: string;
};

type WarehouseMovement = {
  id: string;
  itemId: string;
  type: MovementType;
  quantity: number;
  unit: string;
  date: string;
  note: string;
  staff: string;
  location: WarehouseName;
};

type TransferOrder = {
  id: string;
  itemId: string;
  quantity: number;
  unit: string;
  source: WarehouseName;
  destination: WarehouseName;
  status: TransferStatus;
  requestedBy: string;
  date: string;
};

type WarehouseSupplier = {
  id: string;
  name: string;
  category: string;
  contact: string;
  items: number;
  reliability: string;
  lastOrder: string;
};

const navItems: Array<{ id: WarehouseView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Ringkasan live", icon: LayoutDashboard },
  { id: "inventory", label: "Daftar stok", icon: Package },
  { id: "movements", label: "Pergerakan barang", icon: History },
  { id: "transfers", label: "Transfer antar gudang", icon: Send },
  { id: "suppliers", label: "Supplier", icon: Users },
  { id: "reports", label: "Laporan", icon: BarChart3 },
];

const warehouseOptions: Array<"Semua lokasi" | WarehouseName> = ["Semua lokasi", "Gudang Pusat", "Cabang Cikajang", "Dapur Produksi"];
const categoryOptions: Array<"Semua kategori" | StockCategory> = ["Semua kategori", "Bahan baku", "Kemasan", "Produk jual"];

const initialItems: WarehouseItem[] = [
  { id: "item-01", sku: "BHN-KOP-001", name: "Biji kopi Arabica", category: "Bahan baku", unit: "kg", onHand: 48, reserved: 20, minStock: 18, maxStock: 80, cost: 145000, location: "Gudang Pusat", supplier: "Kopi Gunung Putri", lastUpdated: "Hari ini, 08:40" },
  { id: "item-02", sku: "BHN-SUS-002", name: "Susu UHT full cream", category: "Bahan baku", unit: "liter", onHand: 86, reserved: 24, minStock: 40, maxStock: 160, cost: 22000, location: "Dapur Produksi", supplier: "Mitra Susu Garut", lastUpdated: "Hari ini, 07:15" },
  { id: "item-03", sku: "BHN-GUL-003", name: "Gula aren cair", category: "Bahan baku", unit: "liter", onHand: 22, reserved: 4, minStock: 18, maxStock: 60, cost: 78000, location: "Gudang Pusat", supplier: "Pangirutan Organik", lastUpdated: "Kemarin, 16:20" },
  { id: "item-04", sku: "KMS-CUP-016", name: "Cup 16 oz", category: "Kemasan", unit: "pcs", onHand: 420, reserved: 160, minStock: 300, maxStock: 1200, cost: 950, location: "Gudang Pusat", supplier: "Kemasan Berkah", lastUpdated: "Kemarin, 15:45" },
  { id: "item-05", sku: "KMS-BOT-001", name: "Botol cold brew", category: "Kemasan", unit: "pcs", onHand: 740, reserved: 0, minStock: 250, maxStock: 1200, cost: 2400, location: "Cabang Cikajang", supplier: "Kemasan Berkah", lastUpdated: "Hari ini, 09:10" },
  { id: "item-09", sku: "KMS-BOT-001", name: "Botol cold brew", category: "Kemasan", unit: "pcs", onHand: 120, reserved: 0, minStock: 100, maxStock: 600, cost: 2400, location: "Gudang Pusat", supplier: "Kemasan Berkah", lastUpdated: "Kemarin, 15:20" },
  { id: "item-06", sku: "PRD-CRS-001", name: "Croissant butter", category: "Produk jual", unit: "pcs", onHand: 68, reserved: 18, minStock: 24, maxStock: 100, cost: 11000, location: "Dapur Produksi", supplier: "Dapur Pagi", lastUpdated: "Hari ini, 09:10" },
  { id: "item-07", sku: "BHN-SAM-004", name: "Saus sambal", category: "Bahan baku", unit: "liter", onHand: 8, reserved: 2, minStock: 14, maxStock: 40, cost: 46000, location: "Dapur Produksi", supplier: "Rasa Nusantara", lastUpdated: "13 Sep 2026" },
  { id: "item-08", sku: "PRD-CBW-002", name: "Cold brew bottle", category: "Produk jual", unit: "pcs", onHand: 54, reserved: 12, minStock: 20, maxStock: 80, cost: 18000, location: "Cabang Cikajang", supplier: "Dapur Pagi", lastUpdated: "12 Sep 2026" },
];

const initialMovements: WarehouseMovement[] = [
  { id: "movement-01", itemId: "item-02", type: "Masuk", quantity: 48, unit: "liter", date: "Hari ini, 07:15", note: "Penerimaan dairy pagi", staff: "Asep", location: "Dapur Produksi" },
  { id: "movement-02", itemId: "item-01", type: "Keluar", quantity: 8, unit: "kg", date: "Hari ini, 08:40", note: "Distribusi ke dapur", staff: "Rina", location: "Gudang Pusat" },
  { id: "movement-03", itemId: "item-04", type: "Keluar", quantity: 180, unit: "pcs", date: "Hari ini, 08:05", note: "Pengiriman ke cabang", staff: "Sari", location: "Gudang Pusat" },
  { id: "movement-04", itemId: "item-07", type: "Penyesuaian", quantity: 2, unit: "liter", date: "Kemarin, 16:20", note: "Koreksi stok opname", staff: "Dani", location: "Dapur Produksi" },
  { id: "movement-05", itemId: "item-05", type: "Masuk", quantity: 240, unit: "pcs", date: "Kemarin, 09:10", note: "Penerimaan kemasan", staff: "Kemasan Berkah", location: "Cabang Cikajang" },
  { id: "movement-06", itemId: "item-03", type: "Keluar", quantity: 6, unit: "liter", date: "12 Sep 2026", note: "Pemakaian produksi mingguan", staff: "Nadia", location: "Gudang Pusat" },
];

const initialTransfers: TransferOrder[] = [
  { id: "TRF-0098", itemId: "item-04", quantity: 160, unit: "pcs", source: "Gudang Pusat", destination: "Cabang Cikajang", status: "Dikirim", requestedBy: "Sari Rahma", date: "Hari ini, 08:05" },
  { id: "TRF-0097", itemId: "item-01", quantity: 12, unit: "kg", source: "Gudang Pusat", destination: "Dapur Produksi", status: "Menunggu", requestedBy: "Nadia Putri", date: "Hari ini, 07:45" },
  { id: "TRF-0096", itemId: "item-05", quantity: 120, unit: "pcs", source: "Cabang Cikajang", destination: "Gudang Pusat", status: "Diterima", requestedBy: "Rizky Maulana", date: "Kemarin, 15:20" },
];

const initialSuppliers: WarehouseSupplier[] = [
  { id: "supplier-01", name: "Kopi Gunung Putri", category: "Kopi dan bahan minuman", contact: "0812 3300 4412", items: 4, reliability: "98%", lastOrder: "Hari ini" },
  { id: "supplier-02", name: "Kemasan Berkah", category: "Cup dan kemasan", contact: "0813 8801 2244", items: 6, reliability: "96%", lastOrder: "Kemarin" },
  { id: "supplier-03", name: "Dapur Pagi", category: "Produk bakery", contact: "0821 4455 7722", items: 3, reliability: "94%", lastOrder: "3 hari lalu" },
  { id: "supplier-04", name: "Mitra Susu Garut", category: "Susu dan dairy", contact: "0819 1122 3388", items: 2, reliability: "97%", lastOrder: "5 hari lalu" },
];

const WAREHOUSE_PREVIEW_PASSWORD = "nemposukses";
const WAREHOUSE_PREVIEW_ACCESS_KEY = "nempo_warehouse_preview_access";

function itemStatus(item: WarehouseItem) {
  const available = item.onHand - item.reserved;
  if (available <= item.minStock * 0.5) return "Kritis";
  if (available <= item.minStock) return "Menipis";
  return "Aman";
}

function formatQuantity(value: number) {
  return Number.isInteger(value) ? String(value) : value.toLocaleString("id-ID", { maximumFractionDigits: 1 });
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function itemValue(item: WarehouseItem) {
  return (item.onHand - item.reserved) * item.cost;
}

function WarehousePreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="Gudang" description="Masukkan password untuk membuka preview stok multi-lokasi, pergerakan barang, transfer, supplier, dan laporan persediaan." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === WAREHOUSE_PREVIEW_PASSWORD) {
      localStorage.setItem(WAREHOUSE_PREVIEW_ACCESS_KEY, "1");
      onUnlock();
    } else setError(true);
  }

  return (
    <main className="nempo-demo-green nempo-warehouse-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md border border-[#dcebea] bg-[#fbfdfd] p-6 shadow-[0_22px_70px_rgba(24,59,67,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-lg shadow-teal-800/20"><Warehouse className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f9b8e]">Live preview</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Nempo Warehouse OS</h1></div>
        </div>
        <p className="text-sm leading-6 text-[#648084]">Masukkan password untuk membuka preview stok multi-lokasi, pergerakan barang, transfer, supplier, dan laporan persediaan.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="text" name="username" autoComplete="username" value="warehouse-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
          <label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#b75c54] bg-[#fff8f5]" : "border-[#dcebea] focus-within:border-[#0f766e]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da5a2]"}`} />
            <span className="sr-only">Password live preview Gudang</span>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setError(false); }} placeholder="Masukkan password" autoComplete="current-password" autoFocus className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#183b43] outline-none placeholder:text-[#9db5b5]" />
            <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} className="text-[#7da5a2] hover:text-[#0f766e]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </label>
          {error && <p className="text-xs font-semibold text-[#b75c54]">Password salah. Coba lagi.</p>}
          <button type="submit" className="w-full rounded-xl bg-[#0f766e] px-4 py-3 text-xs font-black text-white transition-colors hover:bg-[#0b625c]">Masuk ke preview</button>
        </form>
        <p className="mt-5 flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><Sparkles className="h-3.5 w-3.5 text-[#0f9b8e]" /> Demo data untuk presentasi customer.</p>
      </div>
    </main>
  );
}

export default function DigitalWarehouseDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <WarehousePreviewGate onUnlock={() => setUnlocked(true)} />;
  return <WarehouseWorkspace />;
}

function WarehouseWorkspace() {
  const [activeView, setActiveView] = useState<WarehouseView>("overview");
  const [items, setItems] = useState(initialItems);
  const [movements, setMovements] = useState(initialMovements);
  const [transfers, setTransfers] = useState(initialTransfers);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
  const [movementOpen, setMovementOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<(typeof warehouseOptions)[number]>("Semua lokasi");
  const [categoryFilter, setCategoryFilter] = useState<(typeof categoryOptions)[number]>("Semua kategori");
  const [toast, setToast] = useState<string | null>(null);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }

  function resetDemo() {
    setActiveView("overview");
    setItems(initialItems);
    setMovements(initialMovements);
    setTransfers(initialTransfers);
    setSuppliers(initialSuppliers);
    setSelectedItem(null);
    setMovementOpen(false);
    setTransferOpen(false);
    setItemOpen(false);
    setSupplierOpen(false);
    setQuery("");
    setLocationFilter("Semua lokasi");
    setCategoryFilter("Semua kategori");
    notify("Demo gudang dikembalikan ke data awal.");
  }

  function recordMovement(itemId: string, type: MovementType, quantity: number, note: string) {
    const item = items.find((entry) => entry.id === itemId);
    if (!item || quantity <= 0) return;
    const nextOnHand = type === "Masuk" ? item.onHand + quantity : type === "Keluar" ? item.onHand - quantity : item.onHand + quantity;
    if (type === "Keluar" && nextOnHand < item.reserved) {
      notify("Jumlah keluar melebihi stok yang tersedia.");
      return;
    }
    setItems((current) => current.map((entry) => entry.id === itemId ? { ...entry, onHand: nextOnHand, lastUpdated: "Baru saja" } : entry));
    setMovements((current) => [{ id: `movement-${Date.now()}`, itemId, type, quantity, unit: item.unit, date: "Baru saja", note, staff: "Anda", location: item.location }, ...current]);
    setMovementOpen(false);
    notify(`${item.name} berhasil dicatat sebagai barang ${type.toLowerCase()}.`);
  }

  function addItem(item: WarehouseItem) {
    setItems((current) => [item, ...current]);
    setItemOpen(false);
    notify(`${item.name} berhasil ditambahkan ke ${item.location}.`);
  }

  function createTransfer(transfer: TransferOrder) {
    const item = items.find((entry) => entry.id === transfer.itemId);
    if (!item || transfer.quantity <= 0 || transfer.quantity > item.onHand - item.reserved) {
      notify("Jumlah transfer melebihi stok tersedia.");
      return;
    }
    setTransfers((current) => [transfer, ...current]);
    setItems((current) => current.map((entry) => entry.id === item.id
      ? { ...entry, reserved: entry.reserved + transfer.quantity, lastUpdated: "Baru saja" }
      : entry));
    setTransferOpen(false);
    notify(`Transfer ${transfer.id} dibuat dan menunggu diproses.`);
  }

  function advanceTransfer(transferId: string) {
    const transfer = transfers.find((entry) => entry.id === transferId);
    if (!transfer) return;
    const nextStatus: TransferStatus = transfer.status === "Menunggu" ? "Dikirim" : transfer.status === "Dikirim" ? "Diterima" : "Diterima";
    setTransfers((current) => current.map((entry) => entry.id === transferId ? { ...entry, status: nextStatus } : entry));
    if (nextStatus === "Diterima" && transfer.status !== "Diterima") {
      setItems((current) => {
        const sourceItem = current.find((entry) => entry.id === transfer.itemId);
        if (!sourceItem) return current;
        const destinationItem = current.find((entry) => entry.sku === sourceItem.sku && entry.location === transfer.destination);
        const sourceUpdated = {
          ...sourceItem,
          onHand: Math.max(0, sourceItem.onHand - transfer.quantity),
          reserved: Math.max(0, sourceItem.reserved - transfer.quantity),
          lastUpdated: "Baru saja",
        };
        const nextItems = current.map((entry) => entry.id === sourceItem.id ? sourceUpdated : entry);
        if (destinationItem) {
          return nextItems.map((entry) => entry.id === destinationItem.id
            ? { ...entry, onHand: entry.onHand + transfer.quantity, lastUpdated: "Baru saja" }
            : entry);
        }
        return [
          ...nextItems,
          {
            ...sourceItem,
            id: `${sourceItem.id}-${transfer.destination.toLowerCase().replaceAll(" ", "-")}`,
            onHand: transfer.quantity,
            reserved: 0,
            location: transfer.destination,
            lastUpdated: "Baru saja",
          },
        ];
      });
    }
    notify(`${transfer.id} diperbarui menjadi ${nextStatus}.`);
  }

  function addSupplier(supplier: WarehouseSupplier) {
    setSuppliers((current) => [supplier, ...current]);
    setSupplierOpen(false);
    notify(`${supplier.name} berhasil ditambahkan ke jaringan supplier.`);
  }

  function exportWarehouse() {
    const rows: Array<Array<string | number>> = [["SKU", "Nama barang", "Kategori", "Lokasi", "Stok fisik", "Dipesan", "Tersedia", "Nilai persediaan"], ...items.map((item) => [item.sku, item.name, item.category, item.location, item.onHand, item.reserved, item.onHand - item.reserved, itemValue(item)])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nempo-laporan-gudang.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Laporan gudang berhasil diekspor.");
  }

  const filteredItems = useMemo(() => items.filter((item) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || [item.sku, item.name, item.category, item.supplier, item.location].join(" ").toLowerCase().includes(needle);
    return matchesQuery && (locationFilter === "Semua lokasi" || item.location === locationFilter) && (categoryFilter === "Semua kategori" || item.category === categoryFilter);
  }), [categoryFilter, items, locationFilter, query]);
  const lowStock = items.filter((item) => itemStatus(item) !== "Aman");
  const totalAvailable = items.reduce((sum, item) => sum + item.onHand - item.reserved, 0);
  const inventoryValue = items.reduce((sum, item) => sum + itemValue(item), 0);
  const pageTitle = navItems.find((item) => item.id === activeView)?.label ?? "Ringkasan live";

  return (
    <Layout>
      <SEO title="Gudang Demo — Digi Nempo" description="Demo Gudang Digi Nempo untuk stok multi-lokasi, pergerakan barang, transfer antar gudang, supplier, dan laporan persediaan." keywords="gudang, warehouse management, stok multi lokasi, inventory, supplier, Digi Nempo" path="/digital-services/gudang" />
      <main className="nempo-demo-green nempo-warehouse-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1480px] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link href="/digital-services/super-app?module=gudang" className="inline-flex items-center gap-2 text-[10px] font-black text-[#648084] transition-colors hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Business Super App</Link>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><span className="h-2 w-2 rounded-full bg-[#1db49f]" /> Demo workspace · data simulasi</div>
          </div>
          <div className="overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_24px_70px_rgba(20,74,77,0.1)]">
            <div className="flex min-h-[790px] flex-col lg:flex-row">
              <aside className="hidden w-[242px] shrink-0 bg-[#123f47] p-4 text-white lg:flex lg:flex-col">
                <div className="flex items-center gap-2.5 border-b border-white/10 px-2 pb-5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0f9b8e]"><Warehouse className="h-4 w-4" /></div><div><p className="text-xs font-black">Nempo Warehouse OS</p><p className="mt-0.5 text-[9px] font-semibold text-white/45">Kopi Nempo · Garut</p></div></div>
                <div className="px-2 pt-6"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#72cfc4]">Inventory management</p><nav className="mt-3 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black transition-colors ${activeView === id ? "bg-white text-[#0f766e]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}{id === "inventory" && lowStock.length > 0 && <span className="ml-auto rounded-full bg-[#e7a77d] px-1.5 py-0.5 text-[8px] text-white">{lowStock.length}</span>}</button>)}</nav></div>
                <div className="mt-auto rounded-2xl bg-white/10 p-3.5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Super App connected</p><p className="mt-2 text-[11px] font-bold leading-4 text-white">Stok, pembelian, supplier, dan pemakaian punya satu sumber data.</p><div className="mt-3 flex flex-wrap gap-x-3 gap-y-2"><Link href="/digital-services/super-app" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Business OS <ArrowRight className="h-3 w-3" /></Link><Link href="/digital-services/dapur-stock" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Dapur Stock <ArrowRight className="h-3 w-3" /></Link></div></div>
              </aside>
              <section className="min-w-0 flex-1 bg-[#f8fbfb]">
                <div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kopi Nempo · Inventory management</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{pageTitle}</h1><p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Kendalikan stok, lokasi, dan pergerakan barang tanpa kehilangan jejak.</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setTransferOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Send className="h-3.5 w-3.5" /> Buat transfer</button><button type="button" onClick={() => setMovementOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Catat barang</button><button type="button" onClick={resetDemo} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><RefreshCcw className="h-3.5 w-3.5" /> Reset</button></div></div></div>
                <div className="flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white px-4 py-2 lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b]"}`}><Icon className="h-3 w-3" />{label}</button>)}</div>
                <div className="p-4 sm:p-6">
                  {activeView === "overview" && <WarehouseOverview items={items} lowStock={lowStock} transfers={transfers} inventoryValue={inventoryValue} totalAvailable={totalAvailable} onView={setActiveView} onItem={setSelectedItem} onNotify={notify} />}
                  {activeView === "inventory" && <InventoryView items={filteredItems} query={query} setQuery={setQuery} locationFilter={locationFilter} setLocationFilter={setLocationFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} onAdd={() => setItemOpen(true)} onItem={setSelectedItem} onExport={exportWarehouse} />}
                  {activeView === "movements" && <MovementsView movements={movements} items={items} onAdd={() => setMovementOpen(true)} onNotify={notify} />}
                  {activeView === "transfers" && <TransfersView transfers={transfers} items={items} onAdd={() => setTransferOpen(true)} onAdvance={advanceTransfer} />}
                   {activeView === "suppliers" && <SuppliersView suppliers={suppliers} onAdd={() => setSupplierOpen(true)} onNotify={notify} />}
                  {activeView === "reports" && <WarehouseReports items={items} movements={movements} transfers={transfers} onExport={exportWarehouse} />}
                </div>
              </section>
            </div>
          </div>
           <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]"><span>Data simulasi untuk kebutuhan presentasi customer.</span><span className="hidden items-center gap-1 sm:inline-flex"><Clock3 className="h-3 w-3" /> Update live · 13 Sep 2026, 09:22</span></div>
        </div>
        {movementOpen && <MovementModal items={items} onClose={() => setMovementOpen(false)} onSubmit={recordMovement} />}
        {transferOpen && <TransferModal items={items} transfers={transfers} onClose={() => setTransferOpen(false)} onSubmit={createTransfer} />}
        {itemOpen && <ItemModal onClose={() => setItemOpen(false)} onSubmit={addItem} />}
        {supplierOpen && <SupplierModal onClose={() => setSupplierOpen(false)} onSubmit={addSupplier} />}
        {selectedItem && <ItemDrawer item={selectedItem} onClose={() => setSelectedItem(null)} onNotify={notify} />}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f47] px-4 py-3 text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8bd6cc]" /> {toast}</div>}
      </main>
    </Layout>
  );
}

function WarehouseOverview({ items, lowStock, transfers, inventoryValue, totalAvailable, onView, onItem, onNotify }: { items: WarehouseItem[]; lowStock: WarehouseItem[]; transfers: TransferOrder[]; inventoryValue: number; totalAvailable: number; onView: (view: WarehouseView) => void; onItem: (item: WarehouseItem) => void; onNotify: (message: string) => void }) {
  const locations = (["Gudang Pusat", "Cabang Cikajang", "Dapur Produksi"] as WarehouseName[]).map((location) => ({ location, count: items.filter((item) => item.location === location).length, value: items.filter((item) => item.location === location).reduce((sum, item) => sum + itemValue(item), 0) }));
  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={Package} label="Stok tersedia" value={`${totalAvailable.toLocaleString("id-ID")} unit`} detail="Setelah stok dipesan" tone="teal" /><MetricCard icon={Warehouse} label="Nilai persediaan" value={formatRupiah(inventoryValue)} detail="+8,4% dari minggu lalu" tone="blue" /><MetricCard icon={PackageOpen} label="Perlu perhatian" value={`${lowStock.length} SKU`} detail={lowStock.length ? "Perlu restock segera" : "Semua stok aman"} tone="amber" /><MetricCard icon={Send} label="Transfer berjalan" value={`${transfers.filter((transfer) => transfer.status !== "Diterima").length} transfer`} detail="Antar lokasi aktif" tone="violet" /></div>
    <div className="grid gap-4 xl:grid-cols-[1.12fr_.88fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Warehouse health</p><h2 className="mt-2 text-lg font-black text-[#244950]">Persediaan terpantau antar lokasi.</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">Bandingkan kapasitas stok dan nilai barang di setiap lokasi bisnis.</p></div><MapPin className="h-5 w-5 text-[#0f766e]" /></div><div className="mt-5 grid gap-2 sm:grid-cols-3">{locations.map(({ location, count, value }) => <button type="button" key={location} onClick={() => onNotify(`${location} memiliki ${count} SKU aktif.`)} className="rounded-xl border border-[#edf3f2] p-3 text-left hover:border-[#b9ded8]"><div className="flex items-center justify-between"><span className="text-[9px] font-black text-[#8aa1a3]">{location.replace("Gudang ", "")}</span><span className="h-2 w-2 rounded-full bg-[#1db49f]" /></div><p className="mt-3 text-xl font-black text-[#0f766e]">{count} <span className="text-[10px] font-bold text-[#8aa1a3]">SKU</span></p><p className="mt-1 truncate text-[9px] font-semibold text-[#94a8aa]">{formatRupiah(value)}</p></button>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-[#123f47] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Inventory insight</p><h2 className="mt-2 text-lg font-black leading-tight">Stok siap dikendalikan.</h2></div><Sparkles className="h-5 w-5 text-[#8bd6cc]" /></div><p className="mt-3 text-[10px] leading-5 text-white/60">{lowStock.length ? `${lowStock.length} SKU berada di bawah batas minimum. Buat permintaan pembelian sebelum stok mengganggu operasional.` : "Tidak ada SKU kritis. Distribusi stok antar lokasi masih berada dalam batas aman."}</p><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">SKU aktif</p><p className="mt-1 text-xl font-black">{items.length}</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Transfer pending</p><p className="mt-1 text-xl font-black">{transfers.filter((transfer) => transfer.status === "Menunggu").length}</p></div></div><button type="button" onClick={() => lowStock.length ? onView("inventory") : onView("reports")} className="mt-5 flex items-center gap-1.5 text-[10px] font-black text-[#a2e7df]">{lowStock.length ? "Tinjau stok menipis" : "Lihat laporan stok"} <ArrowRight className="h-3 w-3" /></button></section></div>
    <div className="grid gap-4 lg:grid-cols-3"><QuickAction icon={PackageCheck} title="Tambah stok baru" detail="Daftarkan SKU dan lokasi" onClick={() => onView("inventory")} /><QuickAction icon={Send} title="Transfer antar lokasi" detail="Pindahkan stok dengan jejak jelas" onClick={() => onView("transfers")} /><QuickAction icon={FileSpreadsheet} title="Lihat laporan" detail="Nilai stok dan pergerakan" onClick={() => onView("reports")} /></div>
    <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Restock watchlist</p><h2 className="mt-1 text-sm font-black text-[#244950]">SKU yang perlu diperhatikan</h2></div><button type="button" onClick={() => onView("inventory")} className="text-[10px] font-black text-[#0f766e]">Lihat semua</button></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{lowStock.slice(0, 3).map((item) => <button type="button" key={item.id} onClick={() => onItem(item)} className="flex items-center gap-3 rounded-xl border border-[#edf3f2] p-3 text-left hover:border-[#b9ded8]"><span className={`grid h-9 w-9 place-items-center rounded-xl ${itemStatus(item) === "Kritis" ? "bg-[#f3e2df] text-[#aa6359]" : "bg-[#fff1dd] text-[#a56c2b]"}`}><PackageOpen className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{item.name}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{formatQuantity(item.onHand - item.reserved)} {item.unit} tersedia · {item.location.replace("Gudang ", "")}</p></div><ChevronRight className="h-3.5 w-3.5 text-[#9eb4b5]" /></button>)}</div></section>
  </div>;
}

function InventoryView({ items, query, setQuery, locationFilter, setLocationFilter, categoryFilter, setCategoryFilter, onAdd, onItem, onExport }: { items: WarehouseItem[]; query: string; setQuery: (value: string) => void; locationFilter: (typeof warehouseOptions)[number]; setLocationFilter: (value: (typeof warehouseOptions)[number]) => void; categoryFilter: (typeof categoryOptions)[number]; setCategoryFilter: (value: (typeof categoryOptions)[number]) => void; onAdd: () => void; onItem: (item: WarehouseItem) => void; onExport: () => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Stock control" title="Daftar stok" description="Lihat SKU, stok tersedia, batas minimum, dan nilai barang dari semua lokasi." /><div className="flex gap-2"><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export</button><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah SKU</button></div></div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari SKU, nama, supplier, atau lokasi..." className="w-full rounded-xl border border-[#dcebea] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#0f766e]" /></div><div className="flex gap-1.5 overflow-x-auto">{warehouseOptions.map((location) => <button key={location} type="button" onClick={() => setLocationFilter(location)} className={`shrink-0 rounded-lg px-2.5 py-2 text-[10px] font-black ${locationFilter === location ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#8aa1a3] hover:bg-[#f2f8f7]"}`}>{location === "Semua lokasi" ? "Semua lokasi" : location.replace("Gudang ", "")}</button>)}</div><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as (typeof categoryOptions)[number])} className="rounded-xl border border-[#dcebea] px-3 py-2.5 text-[10px] font-black text-[#648084] outline-none focus:border-[#0f766e]">{categoryOptions.map((category) => <option key={category}>{category}</option>)}</select></div></div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left"><thead><tr className="border-b border-[#edf3f2] text-[9px] font-black uppercase tracking-[0.12em] text-[#94a8aa]"><th className="pb-3">SKU & barang</th><th className="pb-3">Lokasi</th><th className="pb-3">Stok fisik</th><th className="pb-3">Dipesan</th><th className="pb-3">Tersedia</th><th className="pb-3">Nilai</th><th className="pb-3">Status</th><th className="pb-3" /></tr></thead><tbody className="divide-y divide-[#edf3f2]">{items.map((item) => <tr key={item.id}><td className="py-3"><button type="button" onClick={() => onItem(item)} className="flex items-center gap-2.5 text-left"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6f6f3] text-[#0f766e]"><Box className="h-4 w-4" /></span><span><span className="block text-[10px] font-black text-[#365b60]">{item.name}</span><span className="mt-0.5 block text-[9px] text-[#94a8aa]">{item.sku} · {item.category}</span></span></button></td><td className="py-3"><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#648084]"><MapPin className="h-3 w-3 text-[#0f766e]" />{item.location.replace("Gudang ", "")}</span></td><td className="py-3 text-[10px] font-black text-[#365b60]">{formatQuantity(item.onHand)} {item.unit}</td><td className="py-3 text-[10px] font-semibold text-[#648084]">{formatQuantity(item.reserved)} {item.unit}</td><td className="py-3 text-[10px] font-black text-[#0f766e]">{formatQuantity(item.onHand - item.reserved)} {item.unit}</td><td className="py-3 text-[10px] font-semibold text-[#648084]">{formatRupiah(itemValue(item))}</td><td className="py-3"><span className={`rounded-full px-2 py-1 text-[8px] font-black ${stockPill(itemStatus(item))}`}>{itemStatus(item)}</span></td><td className="py-3 text-right"><button type="button" onClick={() => onItem(item)} aria-label={`Buka ${item.name}`} className="rounded-lg p-2 text-[#8aa1a3] hover:bg-[#f4f9f8] hover:text-[#0f766e]"><MoreHorizontal className="h-4 w-4" /></button></td></tr>)}</tbody></table></div>{!items.length && <EmptyState label="SKU tidak ditemukan." />}</div></div>;
}

function MovementsView({ movements, items, onAdd, onNotify }: { movements: WarehouseMovement[]; items: WarehouseItem[]; onAdd: () => void; onNotify: (message: string) => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Stock ledger" title="Pergerakan barang" description="Catat barang masuk, keluar, dan penyesuaian agar setiap perubahan stok punya jejak." /><div className="flex gap-2"><button type="button" onClick={() => onNotify("Stok opname siap dimulai untuk demo.")} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><ClipboardList className="h-3.5 w-3.5" /> Stok opname</button><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Catat pergerakan</button></div></div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead><tr className="border-b border-[#edf3f2] text-[9px] font-black uppercase tracking-[0.12em] text-[#94a8aa]"><th className="pb-3">Waktu</th><th className="pb-3">Barang</th><th className="pb-3">Jenis</th><th className="pb-3">Jumlah</th><th className="pb-3">Lokasi</th><th className="pb-3">Catatan</th><th className="pb-3">Petugas</th></tr></thead><tbody className="divide-y divide-[#edf3f2]">{movements.map((movement) => { const item = items.find((entry) => entry.id === movement.itemId); return <tr key={movement.id}><td className="py-3 text-[10px] font-semibold text-[#648084]">{movement.date}</td><td className="py-3"><p className="text-[10px] font-black text-[#365b60]">{item?.name ?? "SKU tidak ditemukan"}</p><p className="mt-0.5 text-[9px] text-[#94a8aa]">{item?.sku}</p></td><td className="py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-black ${movementPill(movement.type)}`}>{movement.type === "Masuk" ? <PackageCheck className="h-3 w-3" /> : movement.type === "Keluar" ? <PackageOpen className="h-3 w-3" /> : <Settings2 className="h-3 w-3" />}{movement.type}</span></td><td className={`py-3 text-[10px] font-black ${movement.type === "Masuk" ? "text-[#0f766e]" : movement.type === "Keluar" ? "text-[#a56c2b]" : "text-[#648084]"}`}>{movement.type === "Masuk" ? "+" : movement.type === "Keluar" ? "-" : "±"}{formatQuantity(movement.quantity)} {movement.unit}</td><td className="py-3 text-[10px] font-semibold text-[#648084]">{movement.location.replace("Gudang ", "")}</td><td className="py-3 text-[10px] text-[#648084]">{movement.note}</td><td className="py-3 text-[10px] font-semibold text-[#648084]">{movement.staff}</td></tr>; })}</tbody></table></div></div></div>;
}

function TransfersView({ transfers, items, onAdd, onAdvance }: { transfers: TransferOrder[]; items: WarehouseItem[]; onAdd: () => void; onAdvance: (transferId: string) => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Multi-location inventory" title="Transfer antar gudang" description="Pindahkan stok antar lokasi dengan status pengiriman dan penerimaan yang jelas." /><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Buat transfer</button></div><div className="grid gap-3 md:grid-cols-2">{transfers.map((transfer) => { const item = items.find((entry) => entry.id === transfer.itemId); return <article key={transfer.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Send className="h-5 w-5" /></span><div><p className="text-xs font-black text-[#365b60]">{transfer.id}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{transfer.date} · oleh {transfer.requestedBy}</p></div></div><span className={`rounded-full px-2 py-1 text-[8px] font-black ${transferPill(transfer.status)}`}>{transfer.status}</span></div><div className="mt-5 rounded-xl bg-[#f4fbfa] p-3"><p className="text-[10px] font-black text-[#365b60]">{item?.name}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{formatQuantity(transfer.quantity)} {transfer.unit} · {item?.sku}</p><div className="mt-3 flex items-center gap-2 text-[9px] font-black text-[#0f766e]"><span>{transfer.source.replace("Gudang ", "")}</span><ArrowRight className="h-3 w-3" /><span>{transfer.destination.replace("Gudang ", "")}</span></div></div><div className="mt-4 flex items-center justify-between border-t border-[#edf3f2] pt-3"><span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#8aa1a3]"><Truck className="h-3 w-3" /> Multi-location stock</span>{transfer.status !== "Diterima" && <button type="button" onClick={() => onAdvance(transfer.id)} className="rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e]">{transfer.status === "Menunggu" ? "Tandai dikirim" : "Konfirmasi diterima"}</button>}</div></article>; })}</div></div>;
}

function SuppliersView({ suppliers, onAdd, onNotify }: { suppliers: WarehouseSupplier[]; onAdd: () => void; onNotify: (message: string) => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Supplier network" title="Supplier gudang" description="Simpan pemasok utama, reliabilitas pengiriman, dan barang yang mereka suplai." /><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah supplier</button></div><div className="grid gap-3 md:grid-cols-2">{suppliers.map((supplier) => <article key={supplier.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Users className="h-5 w-5" /></span><div><p className="text-xs font-black text-[#365b60]">{supplier.name}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{supplier.category}</p></div></div><span className="rounded-full bg-[#e6f6f3] px-2 py-1 text-[8px] font-black text-[#0f766e]">{supplier.reliability} tepat waktu</span></div><div className="mt-5 grid grid-cols-3 gap-2"><MiniMetric label="Barang" value={`${supplier.items} SKU`} /><MiniMetric label="Kontak" value={supplier.contact} /><MiniMetric label="Order terakhir" value={supplier.lastOrder} /></div><div className="mt-4 flex items-center justify-between border-t border-[#edf3f2] pt-3"><span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#8aa1a3]"><UserRound className="h-3 w-3" /> Supplier terverifikasi</span><button type="button" onClick={() => onNotify(`Pesanan baru ke ${supplier.name} siap dibuat.`)} className="rounded-lg border border-[#dcebea] px-2.5 py-2 text-[9px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]">Buat pesanan</button></div></article>)}</div><div className="rounded-2xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] p-4"><p className="flex items-center gap-2 text-[10px] font-black text-[#08766f]"><Settings2 className="h-3.5 w-3.5" /> Supplier terhubung ke Pembelian & Supplier</p><p className="mt-1 text-[9px] leading-4 text-[#6d878a]">Data supplier dari modul pembelian dapat dipakai untuk menyusun restock dan melacak reliabilitas penerimaan barang.</p></div></div>;
}

function WarehouseReports({ items, movements, transfers, onExport }: { items: WarehouseItem[]; movements: WarehouseMovement[]; transfers: TransferOrder[]; onExport: () => void }) {
  const bars = [46, 62, 54, 76, 68, 88, 80];
  const received = movements.filter((movement) => movement.type === "Masuk").reduce((sum, movement) => sum + movement.quantity, 0);
  const dispatched = movements.filter((movement) => movement.type === "Keluar").reduce((sum, movement) => sum + movement.quantity, 0);
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Inventory intelligence" title="Laporan gudang" description="Baca nilai persediaan, arus barang, dan aktivitas antar lokasi untuk keputusan restock yang lebih terukur." /><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export laporan</button></div><div className="grid gap-3 sm:grid-cols-3"><SmallMetric icon={Warehouse} label="Nilai stok tersedia" value={formatRupiah(items.reduce((sum, item) => sum + itemValue(item), 0))} /><SmallMetric icon={PackageCheck} label="Barang masuk" value={`${formatQuantity(received)} unit`} /><SmallMetric icon={Send} label="Transfer selesai" value={`${transfers.filter((transfer) => transfer.status === "Diterima").length} order`} /></div><div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Arus persediaan</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Simulasi volume 7 hari terakhir</p></div><BarChart3 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-l border-[#edf3f2] px-1">{bars.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className={`warehouse-report-bar w-full max-w-[34px] rounded-t-lg ${index === bars.length - 1 ? "bg-[#0f766e]" : "bg-[#a9dcd6]"}`} style={{ height: `${value}%` }} /><span className="text-[9px] font-bold text-[#a2b3b4]">H-{6 - index}</span></div>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Masuk vs keluar</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Total pergerakan tersimpan</p></div><History className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-5 space-y-4"><ReportProgress label="Barang masuk" value={received} total={Math.max(received + dispatched, 1)} tone="teal" /><ReportProgress label="Barang keluar" value={dispatched} total={Math.max(received + dispatched, 1)} tone="amber" /><ReportProgress label="Transfer antar lokasi" value={transfers.reduce((sum, transfer) => sum + transfer.quantity, 0)} total={Math.max(received + dispatched, 1)} tone="blue" /></div></section></div><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Nilai per kategori</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Nilai stok tersedia per kelompok barang</p></div><FileSpreadsheet className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{(["Bahan baku", "Kemasan", "Produk jual"] as StockCategory[]).map((category) => { const value = items.filter((item) => item.category === category).reduce((sum, item) => sum + itemValue(item), 0); return <div key={category} className="rounded-xl bg-[#f4fbfa] p-3"><p className="text-[9px] font-semibold text-[#6d878a]">{category}</p><p className="mt-1 text-lg font-black text-[#0f766e]">{formatRupiah(value)}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{items.filter((item) => item.category === category).length} SKU</p></div>; })}</div></section></div>;
}

function MovementModal({ items, onClose, onSubmit }: { items: WarehouseItem[]; onClose: () => void; onSubmit: (itemId: string, type: MovementType, quantity: number, note: string) => void }) {
  const [itemId, setItemId] = useState(items[0]?.id ?? "");
  const [type, setType] = useState<MovementType>("Masuk");
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  return <ModalShell title="Catat pergerakan barang" eyebrow="Stock ledger" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); onSubmit(itemId, type, Number(quantity), note.trim() || "Pencatatan manual"); }} className="space-y-4"><Field label="SKU dan barang"><select value={itemId} onChange={(event) => setItemId(event.target.value)} className={fieldClass}>{items.map((item) => <option key={item.id} value={item.id}>{item.sku} · {item.name} · {item.location.replace("Gudang ", "")}</option>)}</select></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Jenis pergerakan"><select value={type} onChange={(event) => setType(event.target.value as MovementType)} className={fieldClass}><option>Masuk</option><option>Keluar</option><option>Penyesuaian</option></select></Field><Field label="Jumlah"><input required min="0.1" step="0.1" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} className={fieldClass} /></Field></div><Field label="Catatan"><input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Contoh: penerimaan dari supplier" className={fieldClass} /></Field><ModalActions onClose={onClose} submitLabel="Simpan pergerakan" /></form></ModalShell>;
}

function TransferModal({ items, transfers, onClose, onSubmit }: { items: WarehouseItem[]; transfers: TransferOrder[]; onClose: () => void; onSubmit: (transfer: TransferOrder) => void }) {
  const [itemId, setItemId] = useState(items[0]?.id ?? "");
  const [destination, setDestination] = useState<WarehouseName>("Cabang Cikajang");
  const [quantity, setQuantity] = useState("1");
  const item = items.find((entry) => entry.id === itemId);
  const destinations = (["Gudang Pusat", "Cabang Cikajang", "Dapur Produksi"] as WarehouseName[]).filter((location) => location !== item?.location);
  return <ModalShell title="Buat transfer antar gudang" eyebrow="Multi-location inventory" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); if (!item) return; const nextNumber = Math.max(0, ...transfers.map((entry) => Number(entry.id.replace("TRF-", "")))) + 1; onSubmit({ id: `TRF-${String(nextNumber).padStart(4, "0")}`, itemId, quantity: Number(quantity), unit: item.unit, source: item.location, destination, status: "Menunggu", requestedBy: "Anda", date: "Baru saja" }); }} className="space-y-4"><Field label="Barang dan lokasi sumber"><select value={itemId} onChange={(event) => { setItemId(event.target.value); const next = items.find((entry) => entry.id === event.target.value); if (next?.location === destination) setDestination((["Gudang Pusat", "Cabang Cikajang", "Dapur Produksi"] as WarehouseName[]).find((location) => location !== next.location) ?? "Gudang Pusat"); }} className={fieldClass}>{items.map((entry) => <option key={entry.id} value={entry.id}>{entry.name} · {entry.location.replace("Gudang ", "")} · tersedia {formatQuantity(entry.onHand - entry.reserved)} {entry.unit}</option>)}</select></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Lokasi tujuan"><select value={destination} onChange={(event) => setDestination(event.target.value as WarehouseName)} className={fieldClass}>{destinations.map((location) => <option key={location}>{location}</option>)}</select></Field><Field label="Jumlah transfer"><input required min="0.1" step="0.1" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} className={fieldClass} /></Field></div><div className="rounded-xl border border-[#dcebea] bg-[#f4fbfa] p-3"><p className="text-[10px] font-black text-[#365b60]">Alur transfer tercatat end-to-end</p><p className="mt-1 text-[9px] leading-4 text-[#94a8aa]">Stok sumber berkurang saat transfer dibuat, lalu stok tujuan bertambah ketika penerimaan dikonfirmasi.</p></div><ModalActions onClose={onClose} submitLabel="Buat transfer" /></form></ModalShell>;
}

function ItemModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (item: WarehouseItem) => void }) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [location, setLocation] = useState<WarehouseName>("Gudang Pusat");
  const [unit, setUnit] = useState("pcs");
  const [category, setCategory] = useState<StockCategory>("Bahan baku");
  const [minStock, setMinStock] = useState("10");
  return <ModalShell title="Tambah SKU gudang" eyebrow="Stock control" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); const cleanName = name.trim(); const cleanSku = sku.trim().toUpperCase(); if (!cleanName || !cleanSku) return; onSubmit({ id: `item-${Date.now()}`, sku: cleanSku, name: cleanName, category, unit, onHand: 0, reserved: 0, minStock: Number(minStock) || 10, maxStock: (Number(minStock) || 10) * 4, cost: 0, location, supplier: "Belum ditentukan", lastUpdated: "Baru ditambahkan" }); }} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama barang"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Teh melati premium" className={fieldClass} /></Field><Field label="SKU"><input required value={sku} onChange={(event) => setSku(event.target.value)} placeholder="BHN-TEH-001" className={fieldClass} /></Field></div><div className="grid gap-4 sm:grid-cols-3"><Field label="Kategori"><select value={category} onChange={(event) => setCategory(event.target.value as StockCategory)} className={fieldClass}><option>Bahan baku</option><option>Kemasan</option><option>Produk jual</option></select></Field><Field label="Satuan"><select value={unit} onChange={(event) => setUnit(event.target.value)} className={fieldClass}><option>pcs</option><option>kg</option><option>liter</option><option>box</option></select></Field><Field label="Minimum stok"><input min="1" type="number" value={minStock} onChange={(event) => setMinStock(event.target.value)} className={fieldClass} /></Field></div><Field label="Lokasi penyimpanan"><select value={location} onChange={(event) => setLocation(event.target.value as WarehouseName)} className={fieldClass}><option>Gudang Pusat</option><option>Cabang Cikajang</option><option>Dapur Produksi</option></select></Field><ModalActions onClose={onClose} submitLabel="Simpan SKU" /></form></ModalShell>;
}

function SupplierModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (supplier: WarehouseSupplier) => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [contact, setContact] = useState("");
  const [reliability, setReliability] = useState("95%");

  return <ModalShell title="Tambah supplier" eyebrow="Supplier network" onClose={onClose}><form onSubmit={(event) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanCategory = category.trim();
    const cleanContact = contact.trim();
    if (!cleanName || !cleanCategory || !cleanContact) return;
    onSubmit({
      id: `supplier-${Date.now()}`,
      name: cleanName,
      category: cleanCategory,
      contact: cleanContact,
      items: 0,
      reliability: reliability.trim() || "95%",
      lastOrder: "Belum ada",
    });
  }} className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Nama supplier"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Tani Cikajang" className={fieldClass} /></Field>
      <Field label="Kategori barang"><input required value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Contoh: Sayur dan bahan segar" className={fieldClass} /></Field>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Nomor kontak"><input required value={contact} onChange={(event) => setContact(event.target.value)} placeholder="08xx xxxx xxxx" inputMode="tel" className={fieldClass} /></Field>
      <Field label="Reliabilitas awal"><input value={reliability} onChange={(event) => setReliability(event.target.value)} placeholder="95%" className={fieldClass} /></Field>
    </div>
    <div className="rounded-xl border border-[#dcebea] bg-[#f4fbfa] p-3">
      <p className="text-[10px] font-black text-[#365b60]">Terhubung ke Pembelian & Supplier</p>
      <p className="mt-1 text-[9px] leading-4 text-[#94a8aa]">Supplier baru bisa dipakai untuk membuat pesanan pembelian dan mencatat penerimaan barang.</p>
    </div>
    <ModalActions onClose={onClose} submitLabel="Simpan supplier" />
  </form></ModalShell>;
}

function ItemDrawer({ item, onClose, onNotify }: { item: WarehouseItem; onClose: () => void; onNotify: (message: string) => void }) {
  return <div className="fixed inset-0 z-[75] flex justify-end bg-[#123f47]/30 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside role="dialog" aria-modal="true" className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e6f6f3] text-[#0f766e]"><Box className="h-5 w-5" /></span><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Detail SKU</p><h2 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{item.name}</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{item.sku} · {item.location}</p></div></div><button type="button" onClick={onClose} aria-label="Tutup detail SKU" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-6 rounded-2xl bg-[#123f47] p-5 text-white"><p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8bd6cc]">Stok tersedia</p><p className="mt-2 text-4xl font-black">{formatQuantity(item.onHand - item.reserved)} <span className="text-xs font-bold text-white/55">{item.unit}</span></p><div className="mt-4 flex items-center justify-between"><span className={`rounded-full px-2.5 py-1 text-[9px] font-black ${itemStatus(item) === "Aman" ? "bg-[#b8eee7] text-[#0b625c]" : "bg-[#f2b880] text-[#5a3b22]"}`}>{itemStatus(item)}</span><span className="text-[9px] font-semibold text-white/55">Fisik {formatQuantity(item.onHand)} · Dipesan {formatQuantity(item.reserved)}</span></div></div><div className="mt-4 grid grid-cols-2 gap-2"><MiniMetric label="Batas minimum" value={`${formatQuantity(item.minStock)} ${item.unit}`} /><MiniMetric label="Nilai tersedia" value={formatRupiah(itemValue(item))} /><MiniMetric label="Supplier" value={item.supplier} /><MiniMetric label="Update terakhir" value={item.lastUpdated} /></div><div className="mt-6 rounded-2xl bg-[#f4fbfa] p-4"><InfoRow icon={MapPin} label="Lokasi" value={item.location} /><InfoRow icon={Package} label="Kategori" value={item.category} /><InfoRow icon={Truck} label="Supplier" value={item.supplier} /><InfoRow icon={Clock3} label="Batas restock" value={`${formatQuantity(item.minStock)} ${item.unit}`} /></div><button type="button" onClick={() => onNotify(`Permintaan pembelian untuk ${item.name} siap dibuat.`)} className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] px-4 py-3 text-[10px] font-black text-white hover:bg-[#0b625c]"><ClipboardList className="h-3.5 w-3.5" /> Buat permintaan pembelian</button></aside></div>;
}

function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#183b43]/40 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div role="dialog" aria-modal="true" className="w-full max-w-2xl rounded-t-[26px] bg-white p-5 shadow-2xl sm:rounded-[26px] sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0f766e]">{eyebrow}</p><h2 className="mt-2 text-xl font-black text-[#183b43]">{title}</h2></div><button type="button" onClick={onClose} aria-label="Tutup modal" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-6">{children}</div></div></div>;
}

function ModalActions({ onClose, submitLabel }: { onClose: () => void; submitLabel: string }) {
  return <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[10px] font-black text-[#6d878a] hover:bg-[#f4f9f8]">Batal</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]">{submitLabel}</button></div>;
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">{eyebrow}</p><h2 className="mt-1.5 text-lg font-black tracking-tight text-[#244950]">{title}</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">{description}</p></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">{label}</span>{children}</label>;
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: typeof Users; label: string; value: string; detail: string; tone: "teal" | "blue" | "violet" | "amber" }) {
  const styles = { teal: "bg-[#e6f6f3] text-[#0f766e]", blue: "bg-[#e3eff8] text-[#3a6b9b]", violet: "bg-[#ece9f8] text-[#7362a6]", amber: "bg-[#fff1dc] text-[#a56c2b]" };
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center justify-between"><span className={`grid h-9 w-9 place-items-center rounded-xl ${styles[tone]}`}><Icon className="h-4 w-4" /></span><CheckCircle2 className="h-3.5 w-3.5 text-[#9cb3b5]" /></div><p className="mt-4 text-[10px] font-bold text-[#94a8aa]">{label}</p><p className="mt-1 text-2xl font-black tracking-tight text-[#244950]">{value}</p><p className="mt-1 text-[9px] font-bold text-[#0f766e]">{detail}</p></div>;
}

function SmallMetric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#0f766e]" /><span className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8ba3a4]">{label}</span></div><p className="mt-3 text-lg font-black text-[#183b43]">{value}</p></div>;
}

function QuickAction({ icon: Icon, title, detail, onClick }: { icon: typeof Users; title: string; detail: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-2xl border border-[#e3eeed] bg-white p-4 text-left transition-colors hover:border-[#b9ded8] hover:bg-[#fbfefe]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Icon className="h-4 w-4" /></span><p className="mt-3 text-[11px] font-black text-[#365b60]">{title}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{detail}</p><ArrowRight className="mt-3 h-3.5 w-3.5 text-[#0f766e]" /></button>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f4f9f8] p-2"><p className="text-[8px] font-semibold text-[#94a8aa]">{label}</p><p className="mt-1 truncate text-[11px] font-black text-[#365b60]">{value}</p></div>;
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return <div className="flex items-center gap-2.5"><Icon className="h-3.5 w-3.5 shrink-0 text-[#0f766e]" /><div className="min-w-0"><p className="text-[8px] font-black uppercase tracking-[0.08em] text-[#94a8aa]">{label}</p><p className="truncate text-[10px] font-bold text-[#365b60]">{value}</p></div></div>;
}

function ReportProgress({ label, value, total, tone }: { label: string; value: number; total: number; tone: "teal" | "amber" | "blue" }) {
  const colors = { teal: "bg-[#0f766e]", amber: "bg-[#d8942f]", blue: "bg-[#5b8fc0]" };
  return <div><div className="flex items-center justify-between text-[10px]"><span className="font-bold text-[#648084]">{label}</span><span className="font-black text-[#365b60]">{formatQuantity(value)}</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#edf3f2]"><div className={`h-full rounded-full ${colors[tone]}`} style={{ width: `${Math.min(100, Math.max(4, (value / total) * 100))}%` }} /></div></div>;
}

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] py-10 text-center text-xs font-semibold text-[#8aa1a3]">{label}</div>;
}

function stockPill(status: string) {
  return status === "Aman" ? "bg-[#e6f6f3] text-[#0f766e]" : status === "Menipis" ? "bg-[#fff1dd] text-[#a56c2b]" : "bg-[#f3e2df] text-[#aa6359]";
}

function movementPill(type: MovementType) {
  return type === "Masuk" ? "bg-[#e6f6f3] text-[#0f766e]" : type === "Keluar" ? "bg-[#fff1dd] text-[#a56c2b]" : "bg-[#f0f5f4] text-[#648084]";
}

function transferPill(status: TransferStatus) {
  return status === "Diterima" ? "bg-[#e6f6f3] text-[#0f766e]" : status === "Dikirim" ? "bg-[#e3eff8] text-[#3a6b9b]" : "bg-[#fff1dd] text-[#a56c2b]";
}

const fieldClass = "w-full rounded-xl border border-[#dcebea] bg-[#fbfdfd] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:border-[#0f766e] focus:ring-2 focus:ring-[#b9ded8]";