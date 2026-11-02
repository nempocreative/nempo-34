import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import { Link } from "@/lib/wouter";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  Lock,
  MoreHorizontal,
  Package,
  PackageCheck,
  Plus,
  RefreshCcw,
  Search,
  Settings2,
  ShoppingCart,
  Sparkles,
  Store,
  Truck,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import "./digital-demo-super-app.css";

type PurchasingView = "overview" | "purchase-orders" | "suppliers" | "receiving" | "products" | "reports";
type PurchaseOrderStatus = "Draft" | "Menunggu persetujuan" | "Dikirim" | "Diterima" | "Dibatalkan";
type PaymentStatus = "Belum dibayar" | "Sebagian" | "Lunas";

type PurchaseOrder = {
  id: string;
  supplier: string;
  date: string;
  expectedDate: string;
  items: number;
  summary: string;
  total: number;
  status: PurchaseOrderStatus;
  payment: PaymentStatus;
  received: number;
  note: string;
};

type Supplier = {
  id: string;
  name: string;
  category: string;
  contact: string;
  leadTime: string;
  rating: string;
  orders: number;
  status: "Aktif" | "Perlu ditinjau";
};

type Product = {
  name: string;
  category: string;
  stock: string;
  minimum: string;
  unit: string;
  supplier: string;
  level: "Aman" | "Perlu beli" | "Kritis";
};

const navItems: Array<{ id: PurchasingView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { id: "purchase-orders", label: "Pesanan pembelian", icon: ShoppingCart },
  { id: "suppliers", label: "Supplier", icon: Store },
  { id: "receiving", label: "Penerimaan barang", icon: PackageCheck },
  { id: "products", label: "Kebutuhan stok", icon: Package },
  { id: "reports", label: "Laporan", icon: BarChart3 },
];

const initialOrders: PurchaseOrder[] = [
  { id: "PO-2026-0248", supplier: "Kopi Arunika", date: "13 Sep 2026", expectedDate: "15 Sep 2026", items: 4, summary: "Biji kopi, susu, gula aren", total: 4860000, status: "Dikirim", payment: "Belum dibayar", received: 0, note: "Kirim sebelum jam 10.00." },
  { id: "PO-2026-0247", supplier: "Segar Makmur", date: "12 Sep 2026", expectedDate: "14 Sep 2026", items: 6, summary: "Susu segar, butter, telur", total: 2785000, status: "Menunggu persetujuan", payment: "Belum dibayar", received: 0, note: "Menunggu approval owner." },
  { id: "PO-2026-0246", supplier: "Kemasan Kita", date: "10 Sep 2026", expectedDate: "12 Sep 2026", items: 3, summary: "Cup 16 oz, paper bag, lid", total: 1640000, status: "Diterima", payment: "Lunas", received: 3, note: "Diterima lengkap oleh Raka." },
  { id: "PO-2026-0245", supplier: "Dapur Lokal Garut", date: "09 Sep 2026", expectedDate: "11 Sep 2026", items: 5, summary: "Tepung, rempah, saus", total: 1245000, status: "Diterima", payment: "Sebagian", received: 5, note: "Sisa pembayaran akhir bulan." },
  { id: "PO-2026-0244", supplier: "Kopi Arunika", date: "06 Sep 2026", expectedDate: "08 Sep 2026", items: 2, summary: "Arabica Gayo, robusta", total: 3120000, status: "Dibatalkan", payment: "Belum dibayar", received: 0, note: "Harga tidak sesuai penawaran terbaru." },
];

const suppliers: Supplier[] = [
  { id: "sup-01", name: "Kopi Arunika", category: "Biji kopi & minuman", contact: "0812 4000 2190", leadTime: "2 hari", rating: "4,9", orders: 28, status: "Aktif" },
  { id: "sup-02", name: "Segar Makmur", category: "Dairy & bahan segar", contact: "0821 7788 3201", leadTime: "1 hari", rating: "4,7", orders: 22, status: "Aktif" },
  { id: "sup-03", name: "Kemasan Kita", category: "Kemasan F&B", contact: "0857 9012 4410", leadTime: "3 hari", rating: "4,6", orders: 17, status: "Aktif" },
  { id: "sup-04", name: "Dapur Lokal Garut", category: "Bahan kering", contact: "0813 2288 7100", leadTime: "2 hari", rating: "4,2", orders: 11, status: "Perlu ditinjau" },
];

const products: Product[] = [
  { name: "Biji kopi Arabica", category: "Bahan minuman", stock: "2,4 kg", minimum: "5 kg", unit: "kg", supplier: "Kopi Arunika", level: "Kritis" },
  { name: "Susu segar", category: "Bahan segar", stock: "8 liter", minimum: "12 liter", unit: "liter", supplier: "Segar Makmur", level: "Perlu beli" },
  { name: "Cup 16 oz", category: "Kemasan", stock: "42 pcs", minimum: "100 pcs", unit: "pcs", supplier: "Kemasan Kita", level: "Perlu beli" },
  { name: "Gula aren", category: "Bahan minuman", stock: "3,2 kg", minimum: "2 kg", unit: "kg", supplier: "Dapur Lokal Garut", level: "Aman" },
  { name: "Butter premium", category: "Bahan bakery", stock: "6 kg", minimum: "4 kg", unit: "kg", supplier: "Segar Makmur", level: "Aman" },
  { name: "Paper bag medium", category: "Kemasan", stock: "280 pcs", minimum: "150 pcs", unit: "pcs", supplier: "Kemasan Kita", level: "Aman" },
];

const statusTone: Record<PurchaseOrderStatus, string> = {
  Draft: "bg-slate-100 text-slate-600",
  "Menunggu persetujuan": "bg-amber-50 text-amber-700",
  Dikirim: "bg-blue-50 text-blue-700",
  Diterima: "bg-emerald-50 text-emerald-700",
  Dibatalkan: "bg-rose-50 text-rose-700",
};

const purchasingPassword = "nemposukses";
const purchasingAccessKey = "nempo_purchasing_preview_access";
const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

function PurchasingPreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="Pembelian & Supplier" description="Masukkan password untuk membuka preview pesanan pembelian, supplier, penerimaan barang, dan kontrol pengadaan." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === purchasingPassword) {
      localStorage.setItem(purchasingAccessKey, "1");
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <main className="nempo-demo-green nempo-purchasing-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md rounded-3xl border border-[#dcebea] bg-white p-6 shadow-[0_22px_70px_rgba(24,59,67,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-lg shadow-teal-800/20"><ClipboardCheck className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f9b8e]">Live preview</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Nempo Pembelian & Supplier</h1></div>
        </div>
        <p className="text-sm leading-6 text-[#648084]">Masukkan password untuk mencoba pesanan pembelian, supplier, penerimaan barang, stok, dan laporan procurement.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="text" name="username" autoComplete="username" value="purchasing-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
          <label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#b75c54] bg-[#fff8f5]" : "border-[#dcebea] focus-within:border-[#0f766e]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da5a2]"}`} />
            <span className="sr-only">Password live preview Pembelian & Supplier</span>
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

export default function DigitalPurchasingDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <PurchasingPreviewGate onUnlock={() => setUnlocked(true)} />;
  return <PurchasingWorkspace />;
}

function PurchasingWorkspace() {
  const [activeView, setActiveView] = useState<PurchasingView>("overview");
  const [orders, setOrders] = useState(initialOrders);
  const [supplierRecords, setSupplierRecords] = useState(suppliers);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | PurchaseOrderStatus>("Semua");
  const [toast, setToast] = useState<string | null>(null);

  const pendingApproval = orders.filter((order) => order.status === "Menunggu persetujuan").length;
  const inTransit = orders.filter((order) => order.status === "Dikirim").length;
  const activeOrders = orders.filter((order) => order.status !== "Dibatalkan");
  const filteredOrders = useMemo(() => {
    const term = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesQuery = !term || [order.id, order.supplier, order.summary, order.status].join(" ").toLowerCase().includes(term);
      return matchesQuery && (statusFilter === "Semua" || order.status === statusFilter);
    });
  }, [orders, query, statusFilter]);
  const pageTitle = navItems.find((item) => item.id === activeView)?.label ?? "Ringkasan";

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function resetDemo() {
    setActiveView("overview");
    setOrders(initialOrders);
    setSupplierRecords(suppliers);
    setSelectedOrder(null);
    setModalOpen(false);
    setSupplierModalOpen(false);
    setQuery("");
    setStatusFilter("Semua");
    notify("Demo pembelian dikembalikan ke data awal.");
  }

  function addOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const supplier = String(data.get("supplier") || "Supplier baru");
    const next: PurchaseOrder = {
      id: `PO-2026-${String(249 + orders.length).padStart(4, "0")}`,
      supplier,
      date: "13 Sep 2026",
      expectedDate: String(data.get("expectedDate") || "16 Sep 2026"),
      items: Number(data.get("items") || 1),
      summary: String(data.get("summary") || "Item pembelian baru"),
      total: Number(data.get("total") || 0),
      status: "Menunggu persetujuan",
      payment: "Belum dibayar",
      received: 0,
      note: String(data.get("note") || "Menunggu persetujuan owner."),
    };
    setOrders((current) => [next, ...current]);
    setActiveView("purchase-orders");
    setModalOpen(false);
    notify(`${next.id} dibuat dan menunggu persetujuan.`);
  }

  function addSupplier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "Supplier baru");
    const next: Supplier = {
      id: `sup-${String(supplierRecords.length + 1).padStart(2, "0")}`,
      name,
      category: String(data.get("category") || "Supplier umum"),
      contact: String(data.get("contact") || "-"),
      leadTime: String(data.get("leadTime") || "2 hari"),
      rating: "Baru",
      orders: 0,
      status: "Aktif",
    };
    setSupplierRecords((current) => [next, ...current]);
    setActiveView("suppliers");
    setSupplierModalOpen(false);
    notify(`${name} berhasil ditambahkan ke daftar supplier.`);
  }

  function updateOrder(id: string, status: PurchaseOrderStatus) {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status, received: status === "Diterima" ? order.items : order.received, payment: status === "Diterima" ? "Sebagian" : order.payment } : order));
    setSelectedOrder((current) => current?.id === id ? { ...current, status, received: status === "Diterima" ? current.items : current.received, payment: status === "Diterima" ? "Sebagian" : current.payment } : current);
    const label = status === "Dikirim" ? "disetujui dan dikirim" : status === "Diterima" ? "ditandai diterima" : status === "Dibatalkan" ? "dibatalkan" : "diperbarui";
    notify(`${id} berhasil ${label}.`);
  }

  function exportOrders() {
    const rows = [
      ["PO", "Supplier", "Tanggal", "Estimasi tiba", "Item", "Ringkasan", "Total", "Status", "Pembayaran"],
      ...orders.map((order) => [order.id, order.supplier, order.date, order.expectedDate, order.items, order.summary, order.total, order.status, order.payment]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nempo-pembelian-supplier.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Data pembelian berhasil diekspor.");
  }

  return (
    <Layout>
      <SEO title="Pembelian & Supplier Demo — Digi Nempo" description="Demo procurement Digi Nempo untuk purchase order, supplier, penerimaan barang, kebutuhan stok, dan laporan pembelian." keywords="pembelian supplier, purchase order, procurement, penerimaan barang, stok bisnis, Digi Nempo" path="/digital-services/purchasing" />
      <main className="nempo-demo-green nempo-purchasing-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1480px] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link href="/digital-services/super-app?module=purchasing" className="inline-flex items-center gap-2 text-[10px] font-black text-[#648084] transition-colors hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Business Super App</Link>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><span className="h-2 w-2 rounded-full bg-[#1db49f]" /> Demo workspace · data simulasi</div>
          </div>
          <div className="overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_24px_70px_rgba(20,74,77,0.1)]">
            <div className="flex min-h-[790px] flex-col lg:flex-row">
              <aside className="hidden w-[232px] shrink-0 bg-[#123f47] p-4 text-white lg:flex lg:flex-col">
                <div className="flex items-center gap-2.5 border-b border-white/10 px-2 pb-5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0f9b8e]"><ClipboardCheck className="h-4 w-4" /></div><div><p className="text-xs font-black">Nempo Procurement OS</p><p className="mt-0.5 text-[9px] font-semibold text-white/45">Kopi Nempo · Garut</p></div></div>
                <div className="px-2 pt-6"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#72cfc4]">Procurement operations</p><nav className="mt-3 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black transition-colors ${activeView === id ? "bg-white text-[#0f766e]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}{id === "purchase-orders" && pendingApproval > 0 && <span className="ml-auto rounded-full bg-[#e7a77d] px-1.5 py-0.5 text-[8px] text-white">{pendingApproval}</span>}</button>)}</nav></div>
                <div className="mt-auto rounded-2xl bg-white/10 p-3.5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Super App connected</p><p className="mt-2 text-[11px] font-bold leading-4 text-white">Satu alur untuk belanja, supplier, penerimaan, dan stok usaha.</p><div className="mt-3 flex flex-wrap gap-x-3 gap-y-2"><Link href="/digital-services/super-app" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Business OS <ArrowRight className="h-3 w-3" /></Link><Link href="/digital-services/gudang" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Gudang <ArrowRight className="h-3 w-3" /></Link></div></div>
              </aside>
              <section className="min-w-0 flex-1 bg-[#f8fbfb]">
                <div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kopi Nempo · Procurement operations</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{pageTitle}</h1><p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Kelola kebutuhan belanja dari permintaan sampai barang masuk ke stok.</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setActiveView("receiving")} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><PackageCheck className="h-3.5 w-3.5" /> Penerimaan</button><button type="button" onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Pesanan pembelian</button><button type="button" onClick={resetDemo} aria-label="Reset demo" className="grid h-9 w-9 place-items-center rounded-xl border border-[#dcebea] bg-white text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><RefreshCcw className="h-3.5 w-3.5" /></button></div></div></div>
                <div className="flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white px-4 py-2 lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b]"}`}><Icon className="h-3 w-3" />{label}</button>)}</div>
                <div className="p-4 sm:p-6">
                  {activeView === "overview" && <PurchasingOverview orders={orders} pendingApproval={pendingApproval} inTransit={inTransit} activeOrders={activeOrders.length} onView={setActiveView} onSelect={setSelectedOrder} onNew={() => setModalOpen(true)} />}
                  {activeView === "purchase-orders" && <PurchaseOrdersView orders={filteredOrders} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onSelect={setSelectedOrder} onStatus={updateOrder} onNew={() => setModalOpen(true)} onExport={exportOrders} />}
                   {activeView === "suppliers" && <SuppliersView suppliers={supplierRecords} orders={orders} onAdd={() => setSupplierModalOpen(true)} onNotify={notify} />}
                  {activeView === "receiving" && <ReceivingView orders={orders} onSelect={setSelectedOrder} onReceive={(id) => updateOrder(id, "Diterima")} />}
                  {activeView === "products" && <ProductsView onCreate={() => setModalOpen(true)} />}
                  {activeView === "reports" && <PurchasingReports orders={orders} onExport={exportOrders} />}
                </div>
              </section>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]"><span>Data simulasi untuk kebutuhan presentasi customer.</span><span className="hidden items-center gap-1 sm:inline-flex"><Clock3 className="h-3 w-3" /> Update live · 13 Sep 2026, 09:26</span></div>
        </div>
         {modalOpen && <PurchaseOrderModal suppliers={supplierRecords} onClose={() => setModalOpen(false)} onSubmit={addOrder} />}
         {supplierModalOpen && <SupplierModal onClose={() => setSupplierModalOpen(false)} onSubmit={addSupplier} />}
        {selectedOrder && <PurchaseOrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatus={updateOrder} onNotify={notify} />}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f47] px-4 py-3 text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8bd6cc]" /> {toast}</div>}
      </main>
    </Layout>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone = "teal" }: { icon: typeof PackageCheck; label: string; value: string; detail: string; tone?: "teal" | "blue" | "amber" | "violet" }) {
  const tones = { teal: "bg-[#e6f6f3] text-[#0f766e]", blue: "bg-[#e6f0ff] text-[#3478c9]", amber: "bg-[#fff1dd] text-[#b97820]", violet: "bg-[#eeeaff] text-[#7260bf]" };
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center justify-between gap-2"><p className="truncate text-[10px] font-black uppercase tracking-[0.06em] text-[#8aa1a3]">{label}</p><span className={`grid h-8 w-8 place-items-center rounded-xl ${tones[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-4 text-xl font-black tracking-tight text-[#183b43]">{value}</p><p className="mt-1 text-[10px] font-bold text-[#7b999a]">{detail}</p></div>;
}

function PurchasingOverview({ orders, pendingApproval, inTransit, activeOrders, onView, onSelect, onNew }: { orders: PurchaseOrder[]; pendingApproval: number; inTransit: number; activeOrders: number; onView: (view: PurchasingView) => void; onSelect: (order: PurchaseOrder) => void; onNew: () => void }) {
  const monthlySpend = orders.filter((order) => order.status !== "Dibatalkan").reduce((sum, order) => sum + order.total, 0);
  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={ShoppingCart} label="Pesanan aktif" value={`${activeOrders}`} detail="Semua status aktif" /><MetricCard icon={ClipboardCheck} label="Menunggu approval" value={`${pendingApproval}`} detail="Perlu ditinjau owner" tone="amber" /><MetricCard icon={Truck} label="Dalam pengiriman" value={`${inTransit}`} detail="Pantau waktu tiba" tone="blue" /><MetricCard icon={WalletCards} label="Belanja periode ini" value={rupiah(monthlySpend)} detail="+12,6% dari periode lalu" tone="violet" /></div>
    <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Purchase pipeline</p><h2 className="mt-2 text-lg font-black text-[#244950]">Alur pembelian berjalan.</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">Pantau pesanan dari approval, pengiriman, sampai barang diterima dan masuk ke stok.</p></div><ShoppingCart className="h-5 w-5 text-[#0f766e]" /></div><div className="mt-5 space-y-2">{orders.filter((order) => order.status !== "Dibatalkan").slice(0, 4).map((order) => <button key={order.id} type="button" onClick={() => onSelect(order)} className="flex w-full items-center gap-3 rounded-xl border border-[#edf3f2] p-3 text-left transition-colors hover:border-[#b9ded8] hover:bg-[#f8fcfb]"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><FileText className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-black text-[#365b60]">{order.id} · {order.supplier}</span><span className="mt-1 block truncate text-[9px] font-semibold text-[#94a8aa]">{order.summary} · tiba {order.expectedDate}</span></span><span className="text-right"><span className="block text-[10px] font-black text-[#365b60]">{rupiah(order.total)}</span><span className={`mt-1 inline-block rounded-full px-2 py-1 text-[8px] font-black ${statusTone[order.status]}`}>{order.status}</span></span><ChevronRight className="h-3.5 w-3.5 text-[#9eb4b5]" /></button>)}</div><button type="button" onClick={() => onView("purchase-orders")} className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-black text-[#0f766e]">Lihat semua pesanan <ArrowRight className="h-3 w-3" /></button></section><section className="rounded-2xl border border-[#dceae8] bg-[#123f47] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Procurement insight</p><h2 className="mt-2 text-lg font-black leading-tight">Tiga kebutuhan perlu dibeli.</h2></div><Sparkles className="h-5 w-5 text-[#8bd6cc]" /></div><p className="mt-3 text-[10px] leading-5 text-white/60">Biji kopi Arabica, susu segar, dan cup 16 oz berada di bawah stok minimum. Buat satu purchase order agar operasional tidak terhenti.</p><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Stok kritis</p><p className="mt-1 text-xl font-black">1</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Supplier aktif</p><p className="mt-1 text-xl font-black">4</p></div></div><button type="button" onClick={() => onView("products")} className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-black text-[#a2e4dc]">Tinjau kebutuhan stok <ArrowRight className="h-3.5 w-3.5" /></button></section></div>
    <div className="grid gap-3 sm:grid-cols-3"><QuickAction icon={Plus} title="Buat purchase order" detail="Catat kebutuhan belanja baru" onClick={onNew} /><QuickAction icon={PackageCheck} title="Terima barang" detail="Cocokkan barang dan jumlah datang" onClick={() => onView("receiving")} /><QuickAction icon={Store} title="Kelola supplier" detail="Lihat performa dan lead time" onClick={() => onView("suppliers")} /></div>
    <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Connected flow</p><h2 className="mt-1 text-sm font-black text-[#244950]">Pembelian terhubung dengan modul Digi Nempo</h2></div><span className="rounded-full bg-[#e6f6f3] px-2.5 py-1 text-[9px] font-black text-[#0f766e]">Super App</span></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{[["Gudang", "Stok masuk otomatis setelah penerimaan"], ["Dapur Stock", "Kebutuhan bahan dari pemakaian harian"], ["HPP", "Harga beli menjadi dasar margin"]].map(([title, detail]) => <div key={title} className="rounded-xl border border-[#edf3f2] p-3"><p className="text-[11px] font-black text-[#365b60]">{title}</p><p className="mt-1 text-[9px] leading-4 text-[#94a8aa]">{detail}</p></div>)}</div></section>
  </div>;
}

function QuickAction({ icon: Icon, title, detail, onClick }: { icon: typeof Plus; title: string; detail: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex items-center gap-3 rounded-2xl border border-[#e3eeed] bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#b9ded8] hover:shadow-[0_10px_24px_rgba(27,78,80,0.06)]"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Icon className="h-4 w-4" /></span><span><span className="block text-[11px] font-black text-[#365b60]">{title}</span><span className="mt-1 block text-[9px] font-semibold text-[#94a8aa]">{detail}</span></span><ChevronRight className="ml-auto h-3.5 w-3.5 text-[#9eb4b5]" /></button>;
}

function PurchaseOrdersView({ orders, query, setQuery, statusFilter, setStatusFilter, onSelect, onStatus, onNew, onExport }: { orders: PurchaseOrder[]; query: string; setQuery: (value: string) => void; statusFilter: "Semua" | PurchaseOrderStatus; setStatusFilter: (value: "Semua" | PurchaseOrderStatus) => void; onSelect: (order: PurchaseOrder) => void; onStatus: (id: string, status: PurchaseOrderStatus) => void; onNew: () => void; onExport: () => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Procurement inbox</p><h2 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Pesanan pembelian</h2><p className="mt-1 text-xs leading-5 text-[#8aa1a3]">Buat, setujui, dan pantau purchase order sampai supplier mengirim barang.</p></div><div className="flex gap-2"><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] px-3.5 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export</button><button type="button" onClick={onNew} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3.5 py-2.5 text-[10px] font-black text-white"><Plus className="h-3.5 w-3.5" /> Pesanan baru</button></div></div><div className="overflow-hidden rounded-2xl border border-[#e3eeed] bg-white"><div className="flex flex-col justify-between gap-3 border-b border-[#e8f0ef] p-4 sm:flex-row sm:items-center"><div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari PO, supplier, atau item..." className="w-full rounded-xl border border-[#dce8e7] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#56b8ae]" /></div><div className="flex gap-1.5 overflow-x-auto">{(["Semua", "Menunggu persetujuan", "Dikirim", "Diterima", "Dibatalkan"] as const).map((option) => <button key={option} type="button" onClick={() => setStatusFilter(option)} className={`shrink-0 rounded-lg px-2.5 py-2 text-[10px] font-black ${statusFilter === option ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#8aa1a3] hover:bg-[#f2f8f7]"}`}>{option}</button>)}</div></div><div className="divide-y divide-[#edf3f2]">{orders.map((order) => <div key={order.id} className="flex flex-col gap-3 p-4 transition-colors hover:bg-[#fbfdfd] sm:flex-row sm:items-center"><button type="button" onClick={() => onSelect(order)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><FileText className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-black text-[#365b60]">{order.id} · {order.supplier}</span><span className="mt-1 block truncate text-[9px] font-semibold text-[#94a8aa]">{order.summary} · {order.items} item · tiba {order.expectedDate}</span></span></button><div className="flex items-center justify-between gap-3 sm:justify-end"><div className="text-left sm:text-right"><p className="text-[10px] font-black text-[#365b60]">{rupiah(order.total)}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{order.payment}</p></div><span className={`rounded-full px-2 py-1 text-[9px] font-black ${statusTone[order.status]}`}>{order.status}</span>{order.status === "Menunggu persetujuan" && <button type="button" onClick={() => onStatus(order.id, "Dikirim")} className="rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e]">Setujui</button>}{order.status === "Dikirim" && <button type="button" onClick={() => onStatus(order.id, "Diterima")} className="rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e]">Terima</button>}<MoreHorizontal className="h-4 w-4 text-[#9eb4b5]" /></div></div>)}{!orders.length && <EmptyState text="Tidak ada purchase order yang cocok dengan filter ini." />}</div></div></div>;
}

function SuppliersView({ suppliers: supplierRecords, orders, onAdd, onNotify }: { suppliers: Supplier[]; orders: PurchaseOrder[]; onAdd: () => void; onNotify: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const filteredSuppliers = supplierRecords.filter((supplier) => [supplier.name, supplier.category, supplier.contact].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Supplier relationship" title="Supplier & performa" description="Bandingkan lead time, kualitas layanan, dan riwayat order sebelum membuat pembelian berikutnya." /><button type="button" onClick={onAdd} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] px-3.5 py-2.5 text-[10px] font-black text-white"><Plus className="h-3.5 w-3.5" /> Tambah supplier</button></div><div className="relative max-w-md"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, kategori, atau kontak supplier..." className="w-full rounded-xl border border-[#dce8e7] bg-white py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#56b8ae]" /></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{filteredSuppliers.map((supplier) => <div key={supplier.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Store className="h-5 w-5" /></span><span className={`rounded-full px-2 py-1 text-[9px] font-black ${supplier.status === "Aktif" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{supplier.status}</span></div><h3 className="mt-4 text-sm font-black text-[#365b60]">{supplier.name}</h3><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{supplier.category}</p><div className="mt-4 grid grid-cols-2 gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.08em] text-[#a0b4b5]">Rating</p><p className="mt-1 text-sm font-black text-[#0f766e]">{supplier.rating === "Baru" ? supplier.rating : `★ ${supplier.rating}`}</p></div><div><p className="text-[9px] font-black uppercase tracking-[0.08em] text-[#a0b4b5]">Lead time</p><p className="mt-1 text-sm font-black text-[#365b60]">{supplier.leadTime}</p></div></div><div className="mt-4 flex items-center justify-between gap-2 border-t border-[#edf3f2] pt-3"><p className="text-[9px] text-[#94a8aa]">{supplier.orders} order selesai</p><button type="button" onClick={() => onNotify(`Update supplier ${supplier.name} siap dikirim ke ${supplier.contact}.`)} className="inline-flex items-center gap-1 text-[9px] font-black text-[#0f766e]"><Truck className="h-3 w-3" /> Hubungi</button></div></div>)}</div>{!filteredSuppliers.length && <EmptyState text="Supplier tidak ditemukan." />}<div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#0f9b8e]">Supplier activity</p><h3 className="mt-1 text-sm font-black text-[#244950]">Riwayat pesanan terbaru</h3></div><Truck className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-4 divide-y divide-[#edf3f2]">{orders.slice(0, 4).map((order) => <div key={order.id} className="flex items-center gap-3 py-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6f6f3] text-[#0f766e]"><ShoppingCart className="h-3.5 w-3.5" /></span><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-black text-[#365b60]">{order.supplier}</p><p className="mt-1 text-[9px] text-[#94a8aa]">{order.id} · {order.date}</p></div><span className="text-[10px] font-black text-[#365b60]">{rupiah(order.total)}</span></div>)}</div></div></div>;
}

function ReceivingView({ orders, onSelect, onReceive }: { orders: PurchaseOrder[]; onSelect: (order: PurchaseOrder) => void; onReceive: (id: string) => void }) {
  const shipments = orders.filter((order) => order.status === "Dikirim" || order.status === "Diterima");
  return <div className="space-y-4"><SectionIntro eyebrow="Goods receiving" title="Penerimaan barang" description="Cocokkan purchase order dengan barang yang datang agar stok dan nilai pembelian tetap akurat." /><div className="grid gap-3 sm:grid-cols-3"><MetricCard icon={Truck} label="Dalam perjalanan" value={`${orders.filter((order) => order.status === "Dikirim").length}`} detail="Perlu dicek saat tiba" tone="blue" /><MetricCard icon={PackageCheck} label="Diterima bulan ini" value={`${orders.filter((order) => order.status === "Diterima").length}`} detail="Masuk ke stok" /><MetricCard icon={AlertTriangle} label="Selisih penerimaan" value="1" detail="Perlu pemeriksaan" tone="amber" /></div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-[#244950]">Shipment yang perlu dipantau</h3><p className="mt-1 text-[10px] text-[#94a8aa]">Klik detail untuk mencocokkan jumlah barang.</p></div><ClipboardCheck className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-4 space-y-2">{shipments.map((order) => <div key={order.id} className="flex flex-col gap-3 rounded-xl border border-[#edf3f2] p-3 sm:flex-row sm:items-center"><button type="button" onClick={() => onSelect(order)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#e6f6f3] text-[#0f766e]"><PackageCheck className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-[11px] font-black text-[#365b60]">{order.id} · {order.supplier}</span><span className="mt-1 block truncate text-[9px] text-[#94a8aa]">{order.summary} · {order.items} item</span></span></button><div className="flex items-center justify-between gap-3 sm:justify-end"><span className="text-[10px] font-semibold text-[#94a8aa]">Estimasi {order.expectedDate}</span><span className={`rounded-full px-2 py-1 text-[9px] font-black ${statusTone[order.status]}`}>{order.status}</span>{order.status === "Dikirim" && <button type="button" onClick={() => onReceive(order.id)} className="rounded-lg bg-[#0f766e] px-2.5 py-2 text-[9px] font-black text-white">Terima barang</button>}</div></div>)}{!shipments.length && <EmptyState text="Belum ada barang dalam proses penerimaan." />}</div></div></div>;
}

function ProductsView({ onCreate }: { onCreate: () => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Stock replenishment" title="Kebutuhan stok" description="Prioritaskan pembelian berdasarkan stok minimum dan supplier utama setiap produk." /><button type="button" onClick={onCreate} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] px-3.5 py-2.5 text-[10px] font-black text-white"><Plus className="h-3.5 w-3.5" /> Buat PO dari kebutuhan</button></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <div key={product.name} className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-start gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl ${product.level === "Aman" ? "bg-emerald-50 text-emerald-700" : product.level === "Kritis" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}><Package className="h-5 w-5" /></span><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-black text-[#365b60]">{product.name}</h3><p className="mt-1 text-[10px] text-[#94a8aa]">{product.category} · {product.supplier}</p></div><span className={`rounded-full px-2 py-1 text-[9px] font-black ${product.level === "Aman" ? "bg-emerald-50 text-emerald-700" : product.level === "Kritis" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{product.level}</span></div><div className="mt-5 flex items-end justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.08em] text-[#a0b4b5]">Stok sekarang</p><p className="mt-1 text-lg font-black text-[#183b43]">{product.stock}</p></div><div className="text-right"><p className="text-[9px] font-black uppercase tracking-[0.08em] text-[#a0b4b5]">Minimum</p><p className="mt-1 text-[10px] font-black text-[#648084]">{product.minimum}</p></div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf3f2]"><div className={`h-full rounded-full ${product.level === "Aman" ? "bg-[#0f766e]" : product.level === "Kritis" ? "bg-[#c05c55]" : "bg-[#d8942f]"}`} style={{ width: product.level === "Aman" ? "82%" : product.level === "Kritis" ? "28%" : "52%" }} /></div></div>)}</div></div>;
}

function PurchasingReports({ orders, onExport }: { orders: PurchaseOrder[]; onExport: () => void }) {
  const values = [42, 58, 50, 72, 64, 86, 69];
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Procurement intelligence" title="Laporan pembelian" description="Baca tren belanja, supplier, dan penerimaan untuk mengontrol biaya operasional." /><button type="button" onClick={onExport} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] px-3.5 py-2.5 text-[10px] font-black text-white"><FileSpreadsheet className="h-3.5 w-3.5" /> Unduh laporan</button></div><div className="grid gap-3 sm:grid-cols-3"><MetricCard icon={WalletCards} label="Total belanja" value={rupiah(orders.filter((order) => order.status !== "Dibatalkan").reduce((sum, order) => sum + order.total, 0))} detail="Bulan berjalan" /><MetricCard icon={Truck} label="Supplier aktif" value="4" detail="3 dengan order aktif" tone="blue" /><MetricCard icon={PackageCheck} label="Fill rate" value="96,4%" detail="+2,1% dari bulan lalu" tone="violet" /></div><div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-[#244950]">Nilai pembelian</h3><p className="mt-1 text-[10px] text-[#94a8aa]">7 hari terakhir</p></div><BarChart3 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-l border-[#e5eeee] px-3 sm:gap-4">{values.map((value, index) => <div key={index} className="purchasing-report-bar flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[9px] font-black text-[#5a7c80]">{value}</span><div className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-[#0f766e] to-[#64c9bd]" style={{ height: `${value}%` }} /><span className="text-[9px] font-bold text-[#9aadaf]">{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][index]}</span></div>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-[#244950]">Komposisi belanja</h3><p className="mt-1 text-[10px] text-[#94a8aa]">Berdasarkan kategori</p></div><BarChart3 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-5 space-y-4">{[["Bahan minuman", "42%", "bg-[#0f766e]"], ["Bahan segar", "27%", "bg-[#53b7ac]"], ["Kemasan", "19%", "bg-[#9bd8d0]"], ["Bahan kering", "12%", "bg-[#ccebe7]"]].map(([label, width, color]) => <div key={label}><div className="flex justify-between text-[10px]"><span className="font-bold text-[#365b60]">{label}</span><span className="font-black text-[#0f766e]">{width}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf3f2]"><div className={`h-full rounded-full ${color}`} style={{ width }} /></div></div>)}</div></section></div></div>;
}

function PurchaseOrderModal({ suppliers: supplierRecords, onClose, onSubmit }: { suppliers: Supplier[]; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <ModalShell title="Buat purchase order" description="Catat kebutuhan pembelian dan kirim ke alur approval owner." onClose={onClose}><form onSubmit={onSubmit} className="space-y-4 p-5"><div className="grid gap-3 sm:grid-cols-2"><SelectField label="Supplier" name="supplier" options={supplierRecords.map((supplier) => supplier.name)} /><Field label="Estimasi tiba" name="expectedDate" placeholder="16 Sep 2026" defaultValue="16 Sep 2026" /></div><div className="grid gap-3 sm:grid-cols-2"><Field label="Jumlah item" name="items" type="number" defaultValue="3" /><Field label="Total pembelian" name="total" type="number" placeholder="1500000" defaultValue="1500000" /></div><Field label="Ringkasan item" name="summary" placeholder="Contoh: Biji kopi, susu, gula aren" defaultValue="Biji kopi dan bahan minuman" /><label className="block"><span className="text-[10px] font-black text-[#547377]">Catatan pembelian</span><textarea name="note" rows={2} placeholder="Jadwal kirim, spesifikasi, atau kebutuhan approval..." className="mt-1.5 w-full resize-none rounded-xl border border-[#dce8e7] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none focus:border-[#56b8ae] focus:ring-2 focus:ring-[#d4efeb]" /></label><div className="rounded-xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] p-3"><p className="flex items-center gap-2 text-[10px] font-black text-[#0f766e]"><ClipboardCheck className="h-3.5 w-3.5" /> Masuk ke approval owner</p><p className="mt-1 text-[9px] leading-4 text-[#6d878a]">Stok baru bertambah setelah barang diterima dan dicocokkan.</p></div><div className="flex justify-end gap-2 pt-1"><button type="button" onClick={onClose} className="rounded-xl px-3.5 py-2.5 text-xs font-black text-[#789396] hover:bg-[#f2f8f7]">Batal</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-xs font-black text-white hover:bg-[#0b625c]">Simpan purchase order</button></div></form></ModalShell>;
}

function SupplierModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <ModalShell title="Tambah supplier" description="Simpan kontak dan ekspektasi layanan supplier agar siap dipakai saat membuat purchase order." onClose={onClose}><form onSubmit={onSubmit} className="space-y-4 p-5"><Field label="Nama supplier" name="name" placeholder="Contoh: Sumber Rasa Garut" /><div className="grid gap-3 sm:grid-cols-2"><Field label="Kategori" name="category" placeholder="Bahan segar, kemasan..." /><Field label="Kontak" name="contact" placeholder="08xx atau email" /></div><div className="grid gap-3 sm:grid-cols-2"><Field label="Lead time" name="leadTime" placeholder="2 hari" defaultValue="2 hari" /><Field label="Catatan" name="note" placeholder="Minimum order..." /></div><div className="rounded-xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] p-3"><p className="flex items-center gap-2 text-[10px] font-black text-[#0f766e]"><Store className="h-3.5 w-3.5" /> Supplier aktif setelah disimpan</p><p className="mt-1 text-[9px] leading-4 text-[#6d878a]">Supplier baru langsung tersedia di pilihan purchase order.</p></div><div className="flex justify-end gap-2 pt-1"><button type="button" onClick={onClose} className="rounded-xl px-3.5 py-2.5 text-xs font-black text-[#789396] hover:bg-[#f2f8f7]">Batal</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-xs font-black text-white hover:bg-[#0b625c]">Simpan supplier</button></div></form></ModalShell>;
}

function PurchaseOrderDrawer({ order, onClose, onStatus, onNotify }: { order: PurchaseOrder; onClose: () => void; onStatus: (id: string, status: PurchaseOrderStatus) => void; onNotify: (message: string) => void }) {
  return <div className="fixed inset-0 z-[70] flex items-center justify-end bg-[#123f47]/30 p-3 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div role="dialog" aria-modal="true" aria-labelledby="purchase-order-detail-title" className="h-full w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0f9b8e]">Detail purchase order</p><h2 id="purchase-order-detail-title" className="mt-1 text-lg font-black text-[#183b43]">{order.id}</h2><p className="mt-1 text-xs font-semibold text-[#82999b]">{order.date} · estimasi tiba {order.expectedDate}</p></div><button type="button" onClick={onClose} aria-label="Tutup detail purchase order" className="grid h-8 w-8 place-items-center rounded-full bg-[#f2f8f7] text-[#789396] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-5 rounded-2xl bg-[#f4faf9] p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d9f1ec] text-[#0f766e]"><Store className="h-4 w-4" /></span><div><p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8aa1a3]">Supplier</p><p className="mt-1 text-sm font-black text-[#365b60]">{order.supplier}</p></div></div><div className="mt-5 grid grid-cols-2 gap-3"><DetailItem label="Ringkasan" value={order.summary} /><DetailItem label="Jumlah item" value={`${order.items} item`} /><DetailItem label="Total" value={rupiah(order.total)} /><DetailItem label="Pembayaran" value={order.payment} /></div></div><div className="mt-4 rounded-2xl border border-[#e3eeed] p-4"><p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#8aa1a3]">Catatan procurement</p><p className="mt-2 text-xs leading-5 text-[#547377]">{order.note}</p></div><div className="mt-5 space-y-2">{order.status === "Menunggu persetujuan" && <button type="button" onClick={() => onStatus(order.id, "Dikirim")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 py-3 text-xs font-black text-white"><Check className="h-4 w-4" /> Setujui & kirim ke supplier</button>}{order.status === "Dikirim" && <button type="button" onClick={() => onStatus(order.id, "Diterima")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6f6f3] px-4 py-3 text-xs font-black text-[#0f766e]"><PackageCheck className="h-4 w-4" /> Konfirmasi barang diterima</button>}{order.status !== "Dibatalkan" && order.status !== "Diterima" && <button type="button" onClick={() => onStatus(order.id, "Dibatalkan")} className="w-full rounded-xl px-4 py-3 text-xs font-black text-[#b75c54] hover:bg-[#fff5f3]">Batalkan purchase order</button>}<button type="button" onClick={() => onNotify(`Purchase order ${order.id} siap dibagikan ke ${order.supplier}.`)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce8e7] px-4 py-3 text-xs font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Truck className="h-4 w-4" /> Kirim update supplier</button></div></div></div>;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[9px] font-black uppercase tracking-[0.08em] text-[#8aa1a3]">{label}</p><p className="mt-1 text-[10px] font-black text-[#365b60]">{value}</p></div>;
}

function ModalShell({ title, description, onClose, children }: { title: string; description: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-[#123f47]/35 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div role="dialog" aria-modal="true" aria-labelledby="purchasing-modal-title" className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-[#edf3f2] px-5 py-4"><div><h2 id="purchasing-modal-title" className="text-base font-black text-[#183b43]">{title}</h2><p className="mt-1 text-xs leading-relaxed text-[#8aa1a3]">{description}</p></div><button type="button" onClick={onClose} aria-label="Tutup" className="rounded-full p-1.5 text-[#8aa1a3] hover:bg-[#f2f8f7] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div>{children}</div></div>;
}

function Field({ label, name, placeholder, type = "text", defaultValue }: { label: string; name: string; placeholder?: string; type?: string; defaultValue?: string }) {
  return <label className="block"><span className="text-[10px] font-black text-[#547377]">{label}</span><input required name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} className="mt-1.5 w-full rounded-xl border border-[#dce8e7] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#b1c1c1] focus:border-[#56b8ae] focus:ring-2 focus:ring-[#d4efeb]" /></label>;
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <label className="block"><span className="text-[10px] font-black text-[#547377]">{label}</span><select required name={name} className="mt-1.5 w-full rounded-xl border border-[#dce8e7] bg-white px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none focus:border-[#56b8ae] focus:ring-2 focus:ring-[#d4efeb]">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">{eyebrow}</p><h2 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{title}</h2><p className="mt-1 text-xs leading-5 text-[#8aa1a3]">{description}</p></div>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-[#cfe4e1] bg-[#fbfdfd] px-4 py-8 text-center text-xs font-semibold text-[#8aa1a3]">{text}</div>;
}