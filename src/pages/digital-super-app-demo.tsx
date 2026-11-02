import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import { Link, useLocation } from "@/lib/wouter";
import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgePercent,
  BarChart3,
  BookOpen,
  Calculator,
  ChefHat,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  ContactRound,
  Download,
  FileText,
  Globe2,
  GraduationCap,
  LayoutGrid,
  LayoutDashboard,
  Link2,
  ListOrdered,
  Mail,
  Megaphone,
  Package,
  Plus,
  QrCode,
  ReceiptText,
  RotateCcw,
  Search,
  Settings2,
  ShoppingCart,
  Store,
  Ticket,
  TrendingUp,
  Truck,
  UserRound,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import "./digital-super-app-demo.css";

type AppView = "overview" | "services" | "transactions" | "inventory" | "customers" | "reports";
type Period = "7 hari" | "30 hari" | "90 hari";
type TransactionStatusFilter = "Semua" | Transaction["status"];
type ServiceGroup = "Operasional" | "Pelanggan & Penjualan" | "Keuangan & Kontrol" | "Tim & Brand" | "Event & Kreatif";

type Transaction = {
  id: string;
  customer: string;
  detail: string;
  amount: number;
  status: "Selesai" | "Menunggu";
  time: string;
};

const navItems: { id: AppView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { id: "services", label: "Semua layanan", icon: LayoutGrid },
  { id: "transactions", label: "Transaksi", icon: ShoppingCart },
  { id: "inventory", label: "Stok & HPP", icon: Package },
  { id: "customers", label: "Pelanggan", icon: Users },
  { id: "reports", label: "Laporan", icon: BarChart3 },
];

type ServiceModule = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  features: string[];
  group: ServiceGroup;
  icon: typeof LayoutDashboard;
  tone: string;
  connected?: boolean;
};

const serviceModules: ServiceModule[] = [
  { id: "business-super-app", title: "Business Super App", eyebrow: "CONNECTED BUSINESS SUITE", description: "Satu ruang kerja untuk menghubungkan pelanggan, penjualan, stok, keuangan, tim, dan seluruh modul Digi Nempo.", features: ["Semua modul terhubung", "Satu dashboard operasional", "Bisa tumbuh sesuai kebutuhan"], group: "Operasional", icon: LayoutDashboard, tone: "bg-teal-50 text-teal-700", connected: true },
  { id: "ticketing", title: "Event Ticketing", eyebrow: "EVENT TICKETING", description: "Jual tiket, atur kuota, dan pantau penjualan event dari dashboard yang sama.", features: ["Tiket online", "Check-in QR", "Dashboard penjualan"], group: "Event & Kreatif", icon: Ticket, tone: "bg-teal-50 text-teal-700", connected: true },
  { id: "kasir", title: "Kasir", eyebrow: "F&B POS", description: "Order, meja, stok bahan, dan laporan penjualan terhubung dalam satu alur.", features: ["Order & meja", "Stok bahan", "Laporan harian"], group: "Operasional", icon: ReceiptText, tone: "bg-teal-50 text-teal-700", connected: true },
  { id: "invitation", title: "Wedding Invitation", eyebrow: "DIGITAL INVITATION", description: "Undangan online personal yang mudah dibagikan kepada keluarga dan tamu.", features: ["RSVP online", "Galeri momen", "Ucapan tamu"], group: "Event & Kreatif", icon: Mail, tone: "bg-purple-50 text-purple-600" },
  { id: "company", title: "Company Website", eyebrow: "COMPANY WEBSITE", description: "Website company yang cepat, jelas, dan siap berkembang bersama bisnis.", features: ["Profil perusahaan", "Portofolio", "Form kontak"], group: "Tim & Brand", icon: Globe2, tone: "bg-teal-50 text-teal-700" },
  { id: "yearbook", title: "Yearbook", eyebrow: "MEMORIES BOOK", description: "Simpan cerita satu angkatan dalam yearbook digital yang hangat dan interaktif.", features: ["Profil angkatan", "Galeri kenangan", "Pesan teman"], group: "Event & Kreatif", icon: GraduationCap, tone: "bg-teal-50 text-teal-700" },
  { id: "marketing", title: "Marketing Tools", eyebrow: "MARKETING TOOLS", description: "Rencanakan konten, kelola campaign, dan baca performa promosi.", features: ["Kalender konten", "Campaign terarah", "Analitik performa"], group: "Tim & Brand", icon: Megaphone, tone: "bg-red-50 text-red-600" },
  { id: "crm", title: "CRM", eyebrow: "CUSTOMER RELATIONSHIP", description: "Simpan data pelanggan, catat interaksi, dan bangun hubungan yang lebih dekat.", features: ["Data pelanggan terpusat", "Riwayat interaksi", "Follow-up terarah"], group: "Pelanggan & Penjualan", icon: ContactRound, tone: "bg-teal-50 text-teal-700", connected: true },
  { id: "qr-menu", title: "QR Menu", eyebrow: "DIGITAL MENU", description: "Menu digital, harga, rekomendasi, dan pesanan dari meja dalam satu QR.", features: ["Menu mudah diperbarui", "Foto produk", "Pesan dari meja"], group: "Pelanggan & Penjualan", icon: QrCode, tone: "bg-teal-50 text-teal-700", connected: true },
  { id: "invoice", title: "Invoice & Faktur", eyebrow: "FINANCE & BILLING", description: "Buat invoice rapi dan pantau status pembayaran tanpa mencari dokumen.", features: ["Invoice profesional", "Faktur tertata", "Status pembayaran"], group: "Keuangan & Kontrol", icon: FileText, tone: "bg-cyan-50 text-cyan-700", connected: true },
  { id: "dapur-stock", title: "Dapur Stock", eyebrow: "KITCHEN OPERATIONS", description: "Pantau bahan masuk, pemakaian, dan kebutuhan dapur agar minim terbuang.", features: ["Stok bahan dapur", "Pencatatan pemakaian", "Peringatan stok menipis"], group: "Operasional", icon: ChefHat, tone: "bg-orange-50 text-orange-700", connected: true },
  { id: "gudang", title: "Gudang", eyebrow: "INVENTORY MANAGEMENT", description: "Kelola stok dan pergerakan barang dari satu tempat.", features: ["Stok antar lokasi", "Barang masuk dan keluar", "Riwayat pergerakan"], group: "Operasional", icon: Warehouse, tone: "bg-teal-50 text-teal-700", connected: true },
  { id: "hpp", title: "HPP", eyebrow: "COST CONTROL", description: "Hitung harga pokok penjualan agar harga jual dan margin lebih terukur.", features: ["Komponen biaya", "Margin lebih mudah dipantau", "Dasar harga jual"], group: "Keuangan & Kontrol", icon: Calculator, tone: "bg-teal-50 text-teal-700", connected: true },
  { id: "resep", title: "Resep", eyebrow: "RECIPE MANAGEMENT", description: "Simpan takaran standar agar rasa, porsi, dan biaya tetap konsisten.", features: ["Resep standar", "Versi resep terkontrol", "Terhubung ke HPP"], group: "Operasional", icon: BookOpen, tone: "bg-teal-50 text-teal-700", connected: true },
  { id: "human-resource", title: "Human Resource", eyebrow: "PEOPLE OPERATIONS", description: "Rapikan data tim, jadwal, dan administrasi operasional.", features: ["Data anggota tim", "Jadwal kerja", "Administrasi rapi"], group: "Tim & Brand", icon: UserRound, tone: "bg-teal-50 text-teal-700", connected: true },
  { id: "link-bio", title: "Link Bio", eyebrow: "DIGITAL PROFILE", description: "Satukan semua tautan penting bisnis dalam satu halaman yang mudah dibagikan.", features: ["Satu tautan semua kanal", "Profil dan katalog", "Statistik kunjungan"], group: "Tim & Brand", icon: Link2, tone: "bg-teal-50 text-teal-700", connected: true },
  { id: "antrian", title: "Sistem Antrian", eyebrow: "QUEUE MANAGEMENT", description: "Buat alur kunjungan lebih nyaman dengan nomor dan status layanan.", features: ["Ambil nomor online", "Panggil antrian", "Pantau waktu tunggu"], group: "Operasional", icon: ListOrdered, tone: "bg-teal-50 text-teal-700", connected: true },
  { id: "booking", title: "Booking & Reservasi", eyebrow: "RESERVATION SYSTEM", description: "Atur jadwal kunjungan, reservasi meja, atau pemesanan layanan.", features: ["Jadwal dan slot", "Konfirmasi otomatis", "Riwayat reservasi"], group: "Pelanggan & Penjualan", icon: CalendarDays, tone: "bg-teal-50 text-teal-700", connected: true },
  { id: "loyalty", title: "Loyalty & Membership", eyebrow: "CUSTOMER RETENTION", description: "Beri alasan pelanggan untuk kembali dengan poin, benefit, dan promo.", features: ["Poin dan stamp digital", "Benefit member", "Promo personal"], group: "Pelanggan & Penjualan", icon: BadgePercent, tone: "bg-teal-50 text-teal-700", connected: true },
  { id: "purchasing", title: "Pembelian & Supplier", eyebrow: "PROCUREMENT", description: "Kelola belanja, supplier, dan penerimaan barang agar stok punya dasar jelas.", features: ["Pesanan pembelian", "Data supplier", "Penerimaan barang"], group: "Operasional", icon: Truck, tone: "bg-teal-50 text-teal-700", connected: true },
];

const chartSets: Record<Period, { day: string; value: number }[]> = {
  "7 hari": [
    { day: "Sen", value: 62 },
    { day: "Sel", value: 78 },
    { day: "Rab", value: 54 },
    { day: "Kam", value: 86 },
    { day: "Jum", value: 72 },
    { day: "Sab", value: 94 },
    { day: "Min", value: 68 },
  ],
  "30 hari": [
    { day: "M1", value: 58 },
    { day: "M2", value: 72 },
    { day: "M3", value: 64 },
    { day: "M4", value: 88 },
    { day: "M5", value: 76 },
    { day: "M6", value: 94 },
    { day: "M7", value: 82 },
  ],
  "90 hari": [
    { day: "Jan", value: 48 },
    { day: "Feb", value: 64 },
    { day: "Mar", value: 58 },
    { day: "Apr", value: 78 },
    { day: "Mei", value: 86 },
    { day: "Jun", value: 72 },
    { day: "Jul", value: 96 },
  ],
};

const initialTransactions: Transaction[] = [
  { id: "INV-0248", customer: "Kedai Tilu", detail: "Kasir · 4 item", amount: 486000, status: "Selesai", time: "Baru saja" },
  { id: "INV-0247", customer: "Rina Amelia", detail: "QR Menu · 2 item", amount: 128000, status: "Selesai", time: "12 menit lalu" },
  { id: "INV-0246", customer: "Dapur Nusa", detail: "Supplier · 8 item", amount: 875000, status: "Menunggu", time: "28 menit lalu" },
  { id: "INV-0245", customer: "Fajar Nugraha", detail: "Kasir · 3 item", amount: 92000, status: "Selesai", time: "41 menit lalu" },
];

const inventoryItems = [
  { name: "Biji kopi Arabica", category: "Bahan baku", stock: "2,4 kg", level: "Aman", tone: "emerald" },
  { name: "Susu segar", category: "Bahan baku", stock: "8 liter", level: "Perlu restock", tone: "amber" },
  { name: "Gula aren", category: "Bahan baku", stock: "3,2 kg", level: "Aman", tone: "emerald" },
  { name: "Cup 16 oz", category: "Kemasan", stock: "42 pcs", level: "Perlu restock", tone: "amber" },
  { name: "Croissant butter", category: "Produk siap jual", stock: "18 pcs", level: "Aman", tone: "emerald" },
  { name: "Saus sambal", category: "Bahan baku", stock: "1,1 liter", level: "Kritis", tone: "rose" },
];

const customers = [
  { name: "Rina Amelia", initials: "RA", visits: "18 kunjungan", value: "Rp2.840.000", tone: "bg-cyan-100 text-cyan-700" },
  { name: "Kedai Tilu", initials: "KT", visits: "12 pesanan", value: "Rp2.420.000", tone: "bg-violet-100 text-violet-700" },
  { name: "Fajar Nugraha", initials: "FN", visits: "9 kunjungan", value: "Rp1.180.000", tone: "bg-amber-100 text-amber-700" },
  { name: "Dapur Nusa", initials: "DN", visits: "7 pesanan", value: "Rp980.000", tone: "bg-emerald-100 text-emerald-700" },
];

const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

function getRequestedService() {
  if (typeof window === "undefined") return null;
  const moduleId = new URLSearchParams(window.location.search).get("module");
  if (!moduleId) return null;
  const normalizedId = moduleId === "super-app" ? "business-super-app" : moduleId === "memories" ? "yearbook" : moduleId;
  return serviceModules.find((service) => service.id === normalizedId) ?? null;
}

function getDemoServiceModules(requestedService: ServiceModule | null) {
  const isSuperAppDemo = !requestedService || requestedService.id === "business-super-app";

  return serviceModules.map((service) => ({
    ...service,
    connected: isSuperAppDemo || service.id === requestedService?.id,
  }));
}

const dedicatedServiceDemoPaths: Record<string, string> = {
  ticketing: "/digital-services/ticketing",
  kasir: "/digital-services/kasir",
  invitation: "/digital-services/invitation",
  company: "/digital-services/company",
  yearbook: "/digital-services/yearbook",
  marketing: "/digital-services/marketing",
  "qr-menu": "/digital-services/qr-menu",
  crm: "/digital-services/crm",
  hpp: "/digital-services/hpp",
  resep: "/digital-services/resep",
  "human-resource": "/digital-services/human-resource",
  "link-bio": "/digital-services/link-bio",
  antrian: "/digital-services/antrian",
  booking: "/digital-services/booking",
  purchasing: "/digital-services/purchasing",
  loyalty: "/digital-services/loyalty",
  gudang: "/digital-services/gudang",
};

export default function DigitalSuperAppDemoPage() {
  return (
    <DigitalPreviewGate
      title="Business Super App"
      description="Masukkan password untuk membuka dashboard Business Super App dan seluruh modul demo Digi Nempo."
    >
      <DigitalSuperAppWorkspace />
    </DigitalPreviewGate>
  );
}

function DigitalSuperAppWorkspace() {
  const [, setLocation] = useLocation();
  const requestedService = getRequestedService();
  const demoServices = getDemoServiceModules(requestedService);
  const initialSelectedService = requestedService
    ? demoServices.find((service) => service.id === requestedService.id) ?? null
    : null;
  const isSuperAppDemo = !requestedService || requestedService.id === "business-super-app";
  const [activeView, setActiveView] = useState<AppView>(() => requestedService ? "services" : "overview");
  const [period, setPeriod] = useState<Period>("7 hari");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [openedService, setOpenedService] = useState<ServiceModule | null>(initialSelectedService);
  const [toast, setToast] = useState<string | null>(null);
  const [restockResolved, setRestockResolved] = useState(false);

  const chart = chartSets[period];
  const completedTransactions = transactions.filter((transaction) => transaction.status === "Selesai").length;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  }

  function resetDemo() {
    setActiveView("overview");
    setPeriod("7 hari");
    setTransactions(initialTransactions);
    setOpenedService(null);
    setRestockResolved(false);
    notify("Demo dikembalikan ke data awal.");
  }

  function openService(service: ServiceModule) {
    if (!service.connected) {
      notify(`${service.title} masih siap diaktifkan.`);
      return;
    }

    const dedicatedPath = dedicatedServiceDemoPaths[service.id];
    if (dedicatedPath) {
      setLocation(dedicatedPath);
      return;
    }

    if (service.id === "business-super-app") {
      setOpenedService(null);
      setActiveView("overview");
      notify("Business Super App dibuka.");
      return;
    }

    setOpenedService(service);
    setActiveView("services");
  }

  function addTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const customer = String(form.get("customer") || "Pelanggan baru");
    const amount = Number(form.get("amount") || 0);
    setTransactions((current) => [
      {
        id: `INV-0${249 + current.length}`,
        customer,
        detail: "Kasir · transaksi baru",
        amount,
        status: "Selesai",
        time: "Baru saja",
      },
      ...current,
    ]);
    setModalOpen(false);
    setActiveView("transactions");
    notify("Transaksi baru berhasil ditambahkan ke demo.");
  }

  function downloadCsv(filename: string, rows = transactions) {
    const header = ["ID", "Pelanggan", "Detail", "Nominal", "Status", "Waktu"];
    const csv = [
      header,
      ...rows.map((transaction) => [
        transaction.id,
        transaction.customer,
        transaction.detail,
        transaction.amount,
        transaction.status,
        transaction.time,
      ]),
    ]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${filename}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    notify("File CSV berhasil diunduh.");
  }

  const pageTitle = navItems.find((item) => item.id === activeView)?.label ?? "Ringkasan";

  return (
    <Layout>
      <SEO
        title="Demo Business Super App — Digi Nempo"
        description="Demo interaktif Business Super App Nempo untuk mengelola 20 layanan bisnis, transaksi, stok, pelanggan, supplier, tim, dan laporan dalam satu dashboard."
        keywords="demo business super app, dashboard bisnis, kasir, CRM, QR menu, invoice, stok, supplier, booking, loyalty, laporan usaha"
        path="/digital-services/super-app"
      />

      <main className="nempo-demo-green nempo-super-app min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1440px] px-3 pb-24 pt-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-[#dce8e7] py-3">
            <Link href="/digital-services" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#79959a] transition-colors hover:text-[#0f766e]">
              <ArrowLeft className="h-3.5 w-3.5" /> Digi Nempo
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-600 sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live demo
              </span>
              <button type="button" onClick={resetDemo} className="inline-flex items-center gap-1.5 rounded-lg border border-[#dce8e7] bg-white px-2.5 py-2 text-[10px] font-bold text-[#6f898d] transition-colors hover:border-[#9bc9c5] hover:text-[#0f766e]">
                <RotateCcw className="h-3 w-3" /> Reset demo
              </button>
            </div>
          </div>

          <div className="super-app-frame mt-4 overflow-hidden rounded-[24px] border border-[#d9e6e5] bg-white shadow-[0_20px_60px_rgba(27,78,80,0.1)]">
            <div className="flex items-center justify-between border-b border-[#e3eeed] px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0f766e] text-white shadow-sm shadow-teal-800/20">
                  <LayoutDashboard className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black tracking-tight text-[#183b43]">Nempo Business OS</p>
                  <p className="text-[10px] font-semibold text-[#8aa1a3]">Ruang kerja operasional · Live preview</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => notify("Tidak ada notifikasi baru.")} aria-label="Notifikasi" className="grid h-9 w-9 place-items-center rounded-full border border-[#e3eeed] text-[#789396] transition-colors hover:bg-[#f2f8f7] hover:text-[#0f766e]">
                  <Bell className="h-4 w-4" />
                </button>
                <div className="hidden items-center gap-2 rounded-full bg-[#f2f8f7] py-1.5 pl-1.5 pr-3 sm:flex">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d4efeb] text-[10px] font-black text-[#0f766e]">AN</span>
                  <span className="text-[10px] font-extrabold text-[#547377]">Admin Nempo</span>
                  <ChevronDown className="h-3 w-3 text-[#8ba3a4]" />
                </div>
              </div>
            </div>

            <div className="flex min-h-[720px] flex-col lg:flex-row">
              <aside className="hidden w-[224px] shrink-0 border-r border-[#e3eeed] bg-[#fbfdfd] p-4 lg:block">
                <div className="mb-5 rounded-2xl border border-[#dcecea] bg-gradient-to-br from-[#effaf8] to-white p-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#d4efeb] text-[#0f766e]"><Store className="h-4 w-4" /></span>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-black text-[#214950]">Kopi Nempo</p>
                      <p className="text-[9px] font-semibold text-[#8aa1a3]">1 cabang aktif</p>
                    </div>
                    <ChevronDown className="ml-auto h-3.5 w-3.5 text-[#8aa1a3]" />
                  </div>
                </div>
                <p className="px-3 text-[9px] font-black uppercase tracking-[0.14em] text-[#a4b6b7]">Workspace</p>
                <nav className="mt-2 space-y-1">
                  {navItems.map(({ id, label, icon: Icon }) => (
                    <button key={id} type="button" onClick={() => setActiveView(id)} className={`super-app-nav-item flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-all ${activeView === id ? "super-app-nav-active bg-[#e6f6f3] text-[#0f766e]" : "text-[#718b8e] hover:bg-[#f2f8f7] hover:text-[#24575b]"}`}>
                      <Icon className="h-4 w-4" /> {label}
                      {id === "inventory" && <span className="ml-auto rounded-full bg-[#fff1dd] px-1.5 py-0.5 text-[9px] font-black text-[#b97820]">3</span>}
                    </button>
                  ))}
                </nav>
                <div className="mt-7 border-t border-[#e3eeed] pt-4">
                  <p className="px-3 text-[9px] font-black uppercase tracking-[0.14em] text-[#a4b6b7]">Bantuan</p>
                  <button type="button" onClick={() => notify("Tim Nempo siap membantu implementasi.")} className="mt-2 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#718b8e] transition-colors hover:bg-[#f2f8f7] hover:text-[#24575b]"><UserRound className="h-4 w-4" /> Pendampingan</button>
                  <button type="button" onClick={() => notify("Pengaturan demo dibuka.")} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#718b8e] transition-colors hover:bg-[#f2f8f7] hover:text-[#24575b]"><Settings2 className="h-4 w-4" /> Pengaturan</button>
                </div>
                <div className="mt-12 rounded-2xl bg-[#123f47] p-3.5 text-white">
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Digi Nempo</p>
                  <p className="mt-2 text-[11px] font-bold leading-4">Semua alur bisnis terhubung dalam satu ruang.</p>
                  <button type="button" onClick={() => notify("Tim Nempo akan menghubungi kamu untuk konsultasi.")} className="mt-3 inline-flex items-center gap-1 text-[10px] font-black text-[#9fe5dd]">Konsultasi <ArrowUpRight className="h-3 w-3" /></button>
                </div>
              </aside>

              <section className="min-w-0 flex-1 bg-[#f9fbfb]">
                <div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kopi Nempo · Garut</p>
                      <h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{pageTitle}</h1>
                      <p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Pantau dan kelola operasional usaha dari satu dashboard.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => downloadCsv(`nempo-${activeView}`)} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dce8e7] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] transition-colors hover:border-[#9bc9c5] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export</button>
                      <button type="button" onClick={() => setLocation("/digital-services/kasir")} className="hidden items-center gap-1.5 rounded-xl border border-[#b9ded8] bg-[#f4fbfa] px-3 py-2.5 text-[10px] font-black text-[#0f766e] transition-colors hover:bg-[#e6f6f3] sm:inline-flex"><ReceiptText className="h-3.5 w-3.5" /> Kasir</button>
                      <button type="button" onClick={() => setLocation("/digital-services/company")} className="hidden items-center gap-1.5 rounded-xl border border-[#b9ded8] bg-[#f4fbfa] px-3 py-2.5 text-[10px] font-black text-[#0f766e] transition-colors hover:bg-[#e6f6f3] sm:inline-flex"><Globe2 className="h-3.5 w-3.5" /> Company</button>
                      <button type="button" onClick={() => setLocation("/digital-services/purchasing")} className="hidden items-center gap-1.5 rounded-xl border border-[#b9ded8] bg-[#f4fbfa] px-3 py-2.5 text-[10px] font-black text-[#0f766e] transition-colors hover:bg-[#e6f6f3] sm:inline-flex"><Truck className="h-3.5 w-3.5" /> Pembelian</button>
                      <button type="button" onClick={() => activeView === "services" ? notify("Pilih layanan untuk melihat detail dan mengaktifkannya.") : setModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 transition-colors hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> {activeView === "services" ? "Tambah layanan" : "Transaksi baru"}</button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white px-4 py-2 lg:hidden">
                  {navItems.map(({ id, label, icon: Icon }) => (
                    <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b]"}`}><Icon className="h-3 w-3" />{label}</button>
                  ))}
                </div>

                <div className="super-app-content p-4 sm:p-6">
                  {activeView === "overview" && (
                    <OverviewView
                      services={demoServices}
                      chart={chart}
                      period={period}
                      setPeriod={setPeriod}
                      transactions={transactions}
                      completedTransactions={completedTransactions}
                      restockResolved={restockResolved}
                      onResolveRestock={() => {
                        setRestockResolved(true);
                        notify("Daftar restock ditandai selesai.");
                      }}
                      onOpenTransactions={() => setActiveView("transactions")}
                      onOpenServices={() => setActiveView("services")}
                      onOpenKasir={() => setLocation("/digital-services/kasir")}
                      onOpenCompany={() => setLocation("/digital-services/company")}
                      onOpenPurchasing={() => setLocation("/digital-services/purchasing")}
                      onOpenService={openService}
                      onSelectTransaction={setSelectedTransaction}
                      onShowInsight={() => notify("Ringkasan lengkap akan menggabungkan tren penjualan, pelanggan, dan stok.")}
                    />
                  )}
                  {activeView === "services" && (openedService ? (
                    <ModuleDemoView service={openedService} onBack={() => setOpenedService(null)} onNotify={notify} />
                  ) : (
                    <ServicesView services={demoServices} isSuperAppDemo={isSuperAppDemo} onOpenService={openService} />
                  ))}
                  {activeView === "transactions" && <TransactionsView transactions={transactions} onSelectTransaction={setSelectedTransaction} />}
                  {activeView === "inventory" && <InventoryView resolved={restockResolved} onResolve={() => { setRestockResolved(true); notify("Stok berhasil diperbarui."); }} />}
                  {activeView === "customers" && <CustomersView onNotify={notify} />}
                  {activeView === "reports" && <ReportsView period={period} setPeriod={setPeriod} chart={chart} onExport={() => downloadCsv("nempo-laporan")} />}
                </div>
              </section>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]">
            <span>Data simulasi untuk kebutuhan presentasi customer.</span>
            <span className="hidden items-center gap-1 sm:inline-flex"><Clock3 className="h-3 w-3" /> Terakhir diperbarui beberapa detik lalu</span>
          </div>
        </div>

        {toast && <div className="super-app-toast fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#123f47] px-4 py-2.5 text-xs font-bold text-white shadow-xl">{toast}</div>}

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123f47]/30 p-4 backdrop-blur-sm">
            <div role="dialog" aria-modal="true" aria-labelledby="new-transaction-title" className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0f9b8e]">Demo interaktif</p>
                  <h2 id="new-transaction-title" className="mt-1 text-lg font-black text-[#183b43]">Tambah transaksi</h2>
                  <p className="mt-1 text-xs leading-5 text-[#82999b]">Data hanya tersimpan selama demo ini dibuka.</p>
                </div>
                <button type="button" onClick={() => setModalOpen(false)} aria-label="Tutup dialog" className="grid h-8 w-8 place-items-center rounded-full bg-[#f2f8f7] text-[#789396] hover:text-[#0f766e]"><X className="h-4 w-4" /></button>
              </div>
              <form onSubmit={addTransaction} className="mt-5 space-y-4">
                <label className="block text-xs font-black text-[#547377]">Nama pelanggan
                  <input name="customer" required defaultValue="Pelanggan baru" className="mt-2 w-full rounded-xl border border-[#dce8e7] px-3 py-3 text-sm font-semibold text-[#183b43] outline-none focus:border-[#56b8ae] focus:ring-2 focus:ring-[#d4efeb]" />
                </label>
                <label className="block text-xs font-black text-[#547377]">Total transaksi
                  <input name="amount" required type="number" min="0" defaultValue="125000" className="mt-2 w-full rounded-xl border border-[#dce8e7] px-3 py-3 text-sm font-semibold text-[#183b43] outline-none focus:border-[#56b8ae] focus:ring-2 focus:ring-[#d4efeb]" />
                </label>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl px-4 py-3 text-xs font-black text-[#789396] hover:bg-[#f2f8f7]">Batal</button>
                  <button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-3 text-xs font-black text-white hover:bg-[#0b625c]">Simpan transaksi</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedTransaction && (
          <TransactionDetailDialog
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            onNotify={notify}
          />
        )}

      </main>
    </Layout>
  );
}

function OverviewView({
  services,
  chart,
  period,
  setPeriod,
  transactions,
  completedTransactions,
  restockResolved,
  onResolveRestock,
  onOpenTransactions,
  onOpenServices,
  onOpenKasir,
  onOpenCompany,
  onOpenPurchasing,
  onOpenService,
  onSelectTransaction,
  onShowInsight,
}: {
  services: ServiceModule[];
  chart: { day: string; value: number }[];
  period: Period;
  setPeriod: (period: Period) => void;
  transactions: Transaction[];
  completedTransactions: number;
  restockResolved: boolean;
  onResolveRestock: () => void;
  onOpenTransactions: () => void;
  onOpenServices: () => void;
  onOpenKasir: () => void;
  onOpenCompany: () => void;
  onOpenPurchasing: () => void;
  onOpenService: (service: ServiceModule) => void;
  onSelectTransaction: (transaction: Transaction) => void;
  onShowInsight: () => void;
}) {
  const statCards = [
    { label: "Penjualan hari ini", value: "Rp12.480.000", change: "+18,4%", icon: CircleDollarSign, tone: "teal" },
    { label: "Transaksi", value: `${186 + completedTransactions - 3}`, change: "+12,8%", icon: ShoppingCart, tone: "blue" },
    { label: "Pelanggan aktif", value: "1.248", change: "+8,2%", icon: Users, tone: "violet" },
    { label: "Stok perlu dicek", value: restockResolved ? "0" : "3", change: restockResolved ? "Sudah ditangani" : "Perlu perhatian", icon: Package, tone: restockResolved ? "teal" : "amber" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, change, icon: Icon, tone }) => (
          <div key={label} className="super-app-card super-app-card-in rounded-2xl border border-[#e3eeed] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8ba3a4]">{label}</p>
              <span className={`grid h-8 w-8 place-items-center rounded-xl ${tone === "teal" ? "bg-[#e1f5f1] text-[#0f766e]" : tone === "blue" ? "bg-[#e5f0ff] text-[#3478c9]" : tone === "violet" ? "bg-[#eeeaff] text-[#7260bf]" : "bg-[#fff1dd] text-[#b97820]"}`}><Icon className="h-4 w-4" /></span>
            </div>
            <p className="mt-4 text-xl font-black tracking-tight text-[#183b43]">{value}</p>
            <p className={`mt-1 text-[10px] font-bold ${tone === "amber" ? "text-[#b97820]" : "text-emerald-600"}`}>{change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_.7fr]">
        <div className="super-app-card rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-[#244950]">Performa penjualan</h2>
              <p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">Pendapatan dari semua channel</p>
            </div>
            <select value={period} onChange={(event) => setPeriod(event.target.value as Period)} className="rounded-lg border border-[#dce8e7] bg-white px-2.5 py-2 text-[10px] font-black text-[#6f898d] outline-none focus:border-[#56b8ae]">
              <option>7 hari</option><option>30 hari</option><option>90 hari</option>
            </select>
          </div>
          <div className="mt-6 flex h-44 items-end gap-2 border-b border-l border-[#e5eeee] px-3 pb-0 pt-3 sm:gap-4">
            {chart.map(({ day, value }) => (
              <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[9px] font-black text-[#5a7c80]">{value}%</span>
                <div className="super-app-bar w-full max-w-10 rounded-t-lg bg-gradient-to-t from-[#0f766e] to-[#64c9bd]" style={{ height: `${value}%` }} />
                <span className="text-[9px] font-bold text-[#9aadaf]">{day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600"><TrendingUp className="h-3.5 w-3.5" /> Pendapatan naik 18,4% dibanding periode sebelumnya</div>
        </div>

        <div className="super-app-card rounded-2xl border border-[#e3eeed] bg-[#123f47] p-4 text-white sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Ringkasan bisnis</p>
              <h2 className="mt-2 text-lg font-black leading-tight">Bisnismu sedang bertumbuh.</h2>
            </div>
            <BarChart3 className="h-5 w-5 text-[#8bd6cc]" />
          </div>
          <p className="mt-4 text-xs leading-5 text-white/65">Pelanggan baru naik 24% minggu ini. Produk dengan pertumbuhan tertinggi adalah Kopi Susu Gula Aren.</p>
          <div className="mt-5 rounded-xl border border-white/10 bg-white/10 p-3">
            <div className="flex items-center justify-between text-[10px] font-bold"><span className="text-white/60">Target bulan ini</span><span className="text-[#a2e4dc]">72%</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-[#8bd6cc]" /></div>
            <p className="mt-2 text-[10px] font-semibold text-white/45">Rp8,4 jt lagi menuju target</p>
          </div>
            <button type="button" onClick={onShowInsight} className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-black text-[#a2e4dc]">Lihat ringkasan lengkap <ArrowUpRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
        <div className="super-app-card rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="text-sm font-black text-[#244950]">Transaksi terbaru</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">Aktivitas yang baru masuk ke workspace</p></div>
            <button type="button" onClick={onOpenTransactions} className="text-[10px] font-black text-[#0f766e] hover:text-[#0b625c]">Lihat semua</button>
          </div>
          <div className="mt-4 space-y-1">
             {transactions.slice(0, 4).map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} onClick={() => onSelectTransaction(transaction)} />)}
          </div>
        </div>
        <div className="super-app-card rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3"><div><h2 className="text-sm font-black text-[#244950]">Perlu perhatian</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">Hal yang bisa segera ditindaklanjuti</p></div><ClipboardList className="h-4 w-4 text-[#0f766e]" /></div>
          <div className="mt-4 space-y-3">
            <div className={`rounded-xl border p-3 ${restockResolved ? "border-emerald-100 bg-emerald-50/60" : "border-amber-100 bg-amber-50/60"}`}>
              <div className="flex items-start gap-2.5"><Package className={`mt-0.5 h-4 w-4 shrink-0 ${restockResolved ? "text-emerald-600" : "text-amber-600"}`} /><div className="min-w-0"><p className="text-[11px] font-black text-[#365b60]">{restockResolved ? "Restock sudah ditandai selesai" : "3 bahan perlu restock"}</p><p className="mt-1 text-[10px] leading-4 text-[#879d9e]">{restockResolved ? "Daftar stok siap dipantau kembali." : "Susu segar, cup 16 oz, dan saus sambal."}</p></div></div>
              {!restockResolved && <button type="button" onClick={onResolveRestock} className="mt-2 text-[10px] font-black text-[#a56b17]">Tandai selesai</button>}
            </div>
            <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-3"><div className="flex items-start gap-2.5"><Users className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" /><div><p className="text-[11px] font-black text-[#514a7b]">24 pelanggan belum di-follow up</p><p className="mt-1 text-[10px] leading-4 text-[#8c88a9]">Gunakan CRM untuk menjaga pelanggan tetap kembali.</p></div></div></div>
          </div>
        </div>
      </div>

      <div className="super-app-card overflow-hidden rounded-2xl border border-[#d7eae7] bg-[#123f47] text-white">
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0f9b8e] text-white"><Truck className="h-5 w-5" /></span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8bd6cc]">Procurement terhubung</p>
                <h2 className="mt-1 text-base font-black tracking-tight">Pembelian & supplier dalam satu alur.</h2>
                <p className="mt-2 max-w-xl text-[10px] leading-5 text-white/60">Kebutuhan stok menjadi purchase order, masuk ke approval, dipantau saat dikirim, lalu menambah stok setelah barang diterima.</p>
              </div>
            </div>
            <button type="button" onClick={onOpenPurchasing} className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2.5 text-[10px] font-black text-[#0f766e] transition-colors hover:bg-[#e6f6f3]">Buka modul pembelian <ArrowUpRight className="h-3.5 w-3.5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {[
              ["1", "Menunggu approval", "bg-[#fff1dd] text-[#b97820]"],
              ["1", "Dalam pengiriman", "bg-[#e5f0ff] text-[#3478c9]"],
              ["4", "Supplier aktif", "bg-[#e1f5f1] text-[#0f766e]"],
              ["Rp10,5 jt", "Belanja berjalan", "bg-[#eeeaff] text-[#7260bf]"],
            ].map(([value, label, tone]) => (
              <button key={label} type="button" onClick={onOpenPurchasing} className="rounded-xl border border-white/10 bg-white/10 p-3 text-left transition-colors hover:bg-white/15">
                <span className={`inline-flex rounded-lg px-2 py-1 text-[9px] font-black ${tone}`}>{value}</span>
                <span className="mt-2 block text-[9px] font-semibold text-white/55">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="super-app-card overflow-hidden rounded-2xl border border-[#b9ded8] bg-[#e6f6f3]">
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0f766e] text-white"><ReceiptText className="h-5 w-5" /></span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f766e]">Kasir terhubung</p>
                <h2 className="mt-1 text-base font-black tracking-tight text-[#183b43]">Penjualan, dapur, dan stok dalam satu alur.</h2>
                <p className="mt-2 max-w-xl text-[10px] leading-5 text-[#5d7d80]">Order dari meja dan takeaway masuk ke antrian dapur, pembayaran tercatat ke omzet, lalu stok menu berkurang otomatis.</p>
              </div>
            </div>
            <button type="button" onClick={onOpenKasir} className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3.5 py-2.5 text-[10px] font-black text-white transition-colors hover:bg-[#0b625c]">Buka modul kasir <ArrowUpRight className="h-3.5 w-3.5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {[
              ["24", "Order hari ini", "bg-white text-[#0f766e]"],
              ["4", "Perlu diproses", "bg-[#fff1dd] text-[#b97820]"],
              ["7 / 12", "Meja terisi", "bg-[#e5f0ff] text-[#3478c9]"],
              ["Rp1,28 jt", "Penjualan shift", "bg-[#eeeaff] text-[#7260bf]"],
            ].map(([value, label, tone]) => (
              <button key={label} type="button" onClick={onOpenKasir} className="rounded-xl border border-[#c7e5e0] bg-white/70 p-3 text-left transition-colors hover:border-[#75c8bd] hover:bg-white">
                <span className={`inline-flex rounded-lg px-2 py-1 text-[9px] font-black ${tone}`}>{value}</span>
                <span className="mt-2 block text-[9px] font-semibold text-[#5d7d80]">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="super-app-card overflow-hidden rounded-2xl border border-[#d7eae7] bg-[#123f47] text-white">
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0f9b8e] text-white"><Globe2 className="h-5 w-5" /></span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8bd6cc]">Company Website terhubung</p>
                <h2 className="mt-1 text-base font-black tracking-tight">Brand, layanan, dan leads dalam satu workspace.</h2>
                <p className="mt-2 max-w-xl text-[10px] leading-5 text-white/60">Website company memperjelas positioning, menampilkan portofolio, dan mengarahkan calon pelanggan ke brief atau konsultasi.</p>
              </div>
            </div>
            <button type="button" onClick={onOpenCompany} className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2.5 text-[10px] font-black text-[#0f766e] transition-colors hover:bg-[#e6f6f3]">Buka company website <ArrowUpRight className="h-3.5 w-3.5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {[
              ["12", "Leads masuk", "bg-[#e1f5f1] text-[#0f766e]"],
              ["6", "Halaman aktif", "bg-white text-[#0f766e]"],
              ["2,4k", "Portfolio views", "bg-[#e5f0ff] text-[#3478c9]"],
              ["4", "Brief baru", "bg-[#fff1dd] text-[#b97820]"],
            ].map(([value, label, tone]) => (
              <button key={label} type="button" onClick={onOpenCompany} className="rounded-xl border border-white/10 bg-white/10 p-3 text-left transition-colors hover:bg-white/15">
                <span className={`inline-flex rounded-lg px-2 py-1 text-[9px] font-black ${tone}`}>{value}</span>
                <span className="mt-2 block text-[9px] font-semibold text-white/55">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="super-app-card rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#0f9b8e]">One workspace</p>
            <h2 className="mt-1 text-sm font-black text-[#244950]">Semua layanan Digi Nempo terhubung</h2>
            <p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">20 modul untuk operasional, pelanggan, keuangan, tim, brand, dan event.</p>
          </div>
          <button type="button" onClick={onOpenServices} className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#0f766e]">Lihat semua layanan <ArrowUpRight className="h-3.5 w-3.5" /></button>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {services.slice(0, 5).map((service) => {
            const Icon = service.icon;
            return (
              <button key={service.id} type="button" onClick={() => onOpenService(service)} className="flex items-center gap-2.5 rounded-xl border border-[#edf3f2] p-3 text-left transition-colors hover:border-[#b9ded8] hover:bg-[#f6fbfa]">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${service.tone}`}><Icon className="h-3.5 w-3.5" /></span>
                <span className="min-w-0"><span className="block truncate text-[10px] font-black text-[#365b60]">{service.title}</span><span className="mt-0.5 block text-[9px] font-semibold text-[#9aadaf]">{service.group}</span></span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ServicesView({
  services,
  isSuperAppDemo,
  onOpenService,
}: {
  services: ServiceModule[];
  isSuperAppDemo: boolean;
  onOpenService: (service: ServiceModule) => void;
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<"Semua" | ServiceGroup>("Semua");
  const groups: ("Semua" | ServiceGroup)[] = ["Semua", "Operasional", "Pelanggan & Penjualan", "Keuangan & Kontrol", "Tim & Brand", "Event & Kreatif"];
  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return services.filter((service) => {
      const matchesGroup = group === "Semua" || service.group === group;
      const matchesQuery = !normalizedQuery || [service.title, service.eyebrow, service.description, service.group].some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesGroup && matchesQuery;
    });
  }, [group, query, services]);

  return (
    <div className="space-y-4">
      <SectionIntro
        eyebrow="Connected business suite"
        title="Semua layanan"
        description={isSuperAppDemo
          ? "Semua modul Digi Nempo terbuka dan terhubung untuk demo ini."
          : "Demo layanan yang dipilih sedang terhubung. Modul lain siap diaktifkan."}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <SmallMetric icon={LayoutGrid} label="Total layanan" value={`${services.length} modul`} />
        <SmallMetric icon={Check} label="Terhubung ke workspace" value={`${services.filter((service) => service.connected).length} aktif`} />
        <SmallMetric icon={ClipboardList} label="Kelompok layanan" value="5 kategori" />
      </div>
      <div className="super-app-card rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari layanan, modul, atau kategori..." className="w-full rounded-xl border border-[#dce8e7] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#56b8ae]" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {groups.map((option) => (
              <button key={option} type="button" onClick={() => setGroup(option)} className={`shrink-0 rounded-lg px-2.5 py-2 text-[10px] font-black ${group === option ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#8aa1a3] hover:bg-[#f2f8f7]"}`}>{option}</button>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <button key={service.id} type="button" onClick={() => onOpenService(service)} className="group rounded-2xl border border-[#e8f0ef] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#b9ded8] hover:shadow-[0_10px_24px_rgba(27,78,80,0.07)]">
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${service.tone}`}><Icon className="h-5 w-5" /></span>
                  <span className={`rounded-full px-2 py-1 text-[9px] font-black ${service.connected ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>{service.connected ? "Terhubung" : "Siap diaktifkan"}</span>
                </div>
                <p className="mt-4 text-[9px] font-black uppercase tracking-[0.12em] text-[#0f9b8e]">{service.eyebrow}</p>
                <h3 className="mt-1 text-sm font-black text-[#244950]">{service.title}</h3>
                <p className="mt-2 min-h-10 text-[10px] leading-4 text-[#8aa1a3]">{service.description}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold text-[#9aadaf]">{service.group}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#0f766e]">Buka modul <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                </div>
              </button>
            );
          })}
        </div>
        {!filteredServices.length && <div className="py-10 text-center text-xs font-semibold text-[#8aa1a3]">Layanan tidak ditemukan. Coba kata kunci atau kategori lain.</div>}
      </div>
    </div>
  );
}

function ModuleDemoView({
  service,
  onBack,
  onNotify,
}: {
  service: ServiceModule;
  onBack: () => void;
  onNotify: (message: string) => void;
}) {
  const Icon = service.icon;
  const [completedFeature, setCompletedFeature] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#0f766e] hover:text-[#0b625c]">
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke semua layanan
      </button>
      <div className="rounded-3xl border border-[#dceae8] bg-gradient-to-br from-[#eaf8f5] via-white to-white p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${service.tone}`}><Icon className="h-6 w-6" /></span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">{service.eyebrow}</p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{service.title}</h2>
              <p className="mt-2 max-w-xl text-xs leading-5 text-[#6f898d]">{service.description}</p>
            </div>
          </div>
          <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-black text-emerald-600"><Check className="h-3 w-3" /> Terhubung ke workspace</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <div className="super-app-card rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#0f9b8e]">Live module preview</p>
            <h3 className="mt-1 text-sm font-black text-[#244950]">Alur yang bisa dicoba</h3>
            <p className="mt-1 text-[10px] leading-4 text-[#94a8aa]">Contoh fitur utama yang tersedia di dalam workspace Nempo.</p>
          </div>
          <div className="mt-4 space-y-2">
            {service.features.map((feature, index) => {
              const isCompleted = completedFeature === feature;
              return (
                <button
                  key={feature}
                  type="button"
                  onClick={() => {
                    setCompletedFeature(feature);
                    onNotify(`${feature} dibuka di demo ${service.title}.`);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${isCompleted ? "border-emerald-200 bg-emerald-50/70" : "border-[#edf3f2] hover:border-[#b9ded8] hover:bg-[#f6fbfa]"}`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-[#e7f6f3] text-[#0f766e]"}`}>
                    {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-[10px] font-black">{index + 1}</span>}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-black text-[#365b60]">{feature}</span>
                    <span className="mt-0.5 block text-[9px] font-semibold text-[#9aadaf]">{isCompleted ? "Contoh alur selesai" : "Klik untuk melihat contoh alur"}</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#8aa1a3]" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-[#dceae8] bg-[#123f47] p-5 text-white">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Workspace terhubung</p>
          <h3 className="mt-2 text-lg font-black leading-tight">Modul ini siap dipakai untuk contoh bisnis.</h3>
          <p className="mt-3 text-xs leading-5 text-white/65">Data yang kamu lihat adalah simulasi presentasi. Coba setiap alur di sebelah kiri untuk melihat respons modul.</p>
          <button type="button" onClick={() => onNotify(`Konsultasi implementasi ${service.title} siap dibuka.`)} className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-black text-[#a2e4dc]">Minta contoh implementasi <ArrowUpRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}

function TransactionRow({ transaction, onClick }: { transaction: Transaction; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-[#f6faf9]">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#e7f6f3] text-[#0f766e]"><ReceiptIcon /></span>
      <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-black text-[#365b60]">{transaction.customer}</p><p className="mt-0.5 text-[9px] font-semibold text-[#9aadaf]">{transaction.id} · {transaction.detail}</p></div>
      <div className="text-right"><p className="text-[11px] font-black text-[#365b60]">{rupiah(transaction.amount)}</p><p className={`mt-0.5 text-[9px] font-bold ${transaction.status === "Selesai" ? "text-emerald-600" : "text-amber-600"}`}>{transaction.status} · {transaction.time}</p></div>
    </button>
  );
}

function ReceiptIcon() {
  return <FileText className="h-3.5 w-3.5" />;
}

function TransactionsView({ transactions, onSelectTransaction }: { transactions: Transaction[]; onSelectTransaction: (transaction: Transaction) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TransactionStatusFilter>("Semua");
  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesQuery = !normalizedQuery || [transaction.id, transaction.customer, transaction.detail].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesStatus = status === "Semua" || transaction.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status, transactions]);

  return (
    <div className="space-y-4">
      <SectionIntro eyebrow="Operational flow" title="Semua transaksi" description="Pantau transaksi dari kasir, QR Menu, supplier, dan modul bisnis lain." />
      <div className="super-app-card overflow-hidden rounded-2xl border border-[#e3eeed] bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-[#e8f0ef] p-4 sm:flex-row sm:items-center">
          <div className="relative max-w-xs flex-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari transaksi atau pelanggan..." className="w-full rounded-xl border border-[#dce8e7] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#56b8ae]" /></div>
          <div className="flex items-center gap-1.5">
            {(["Semua", "Selesai", "Menunggu"] as TransactionStatusFilter[]).map((option) => (
              <button key={option} type="button" onClick={() => setStatus(option)} className={`rounded-lg px-2.5 py-2 text-[10px] font-black ${status === option ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#8aa1a3] hover:bg-[#f2f8f7]"}`}>{option}</button>
            ))}
            <button type="button" onClick={() => setStatus("Semua")} className="ml-1 hidden items-center gap-1.5 text-[10px] font-black text-[#0f766e] sm:inline-flex"><CalendarDays className="h-3.5 w-3.5" /> Hari ini <ChevronDown className="h-3 w-3" /></button>
          </div>
        </div>
        <div className="divide-y divide-[#edf3f2]">
          {filteredTransactions.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} onClick={() => onSelectTransaction(transaction)} />)}
          {!filteredTransactions.length && <div className="px-4 py-10 text-center text-xs font-semibold text-[#8aa1a3]">Tidak ada transaksi yang cocok dengan filter ini.</div>}
        </div>
      </div>
    </div>
  );
}

function InventoryView({ resolved, onResolve }: { resolved: boolean; onResolve: () => void }) {
  return (
    <div className="space-y-4">
      <SectionIntro eyebrow="Inventory management" title="Stok & HPP" description="Ketahui bahan yang tersedia, biaya produksi, dan apa yang perlu dibeli." />
      <div className="grid gap-3 sm:grid-cols-3">
        <SmallMetric icon={Package} label="Total item" value="48 item" />
        <SmallMetric icon={Truck} label="Perlu restock" value={resolved ? "0 item" : "3 item"} />
        <SmallMetric icon={CircleDollarSign} label="Nilai persediaan" value="Rp18,4 jt" />
      </div>
      <div className="super-app-card rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Status persediaan</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Pembaruan terakhir 2 menit lalu</p></div><button type="button" onClick={onResolve} className="text-[10px] font-black text-[#0f766e]">Sinkronkan stok</button></div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">{inventoryItems.map((item) => <div key={item.name} className="flex items-center gap-3 rounded-xl border border-[#edf3f2] p-3"><span className={`grid h-8 w-8 place-items-center rounded-lg ${item.tone === "emerald" ? "bg-emerald-50 text-emerald-600" : item.tone === "amber" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}><Package className="h-3.5 w-3.5" /></span><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-black text-[#365b60]">{item.name}</p><p className="mt-0.5 text-[9px] text-[#9aadaf]">{item.category} · {item.stock}</p></div><span className={`text-[9px] font-black ${item.tone === "emerald" ? "text-emerald-600" : item.tone === "amber" ? "text-amber-600" : "text-rose-600"}`}>{resolved && item.level !== "Aman" ? "Dipantau" : item.level}</span></div>)}</div>
      </div>
    </div>
  );
}

function CustomersView({ onNotify }: { onNotify: (message: string) => void }) {
  return <div className="space-y-4"><SectionIntro eyebrow="Customer relationship" title="Pelanggan" description="Bangun hubungan yang lebih dekat dengan data pelanggan yang terpusat." /><div className="grid gap-3 sm:grid-cols-3"><SmallMetric icon={Users} label="Pelanggan aktif" value="1.248" /><SmallMetric icon={TrendingUp} label="Kembali bulan ini" value="68%" /><SmallMetric icon={CircleDollarSign} label="Nilai rata-rata" value="Rp186 rb" /></div><div className="super-app-card rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Pelanggan bernilai tinggi</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Berdasarkan transaksi 90 hari terakhir</p></div><button type="button" onClick={() => onNotify("CRM demo siap dikembangkan menjadi follow-up otomatis.")} className="text-[10px] font-black text-[#0f766e]">Lihat CRM</button></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{customers.map((customer) => <div key={customer.name} className="flex items-center gap-3 rounded-xl border border-[#edf3f2] p-3"><span className={`grid h-9 w-9 place-items-center rounded-full text-[10px] font-black ${customer.tone}`}>{customer.initials}</span><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-black text-[#365b60]">{customer.name}</p><p className="mt-0.5 text-[9px] text-[#9aadaf]">{customer.visits}</p></div><p className="text-[10px] font-black text-[#0f766e]">{customer.value}</p></div>)}</div></div></div>;
}

function ReportsView({ period, setPeriod, chart, onExport }: { period: Period; setPeriod: (period: Period) => void; chart: { day: string; value: number }[]; onExport: () => void }) {
  return <div className="space-y-4"><SectionIntro eyebrow="Business intelligence" title="Laporan" description="Baca performa bisnis dan ambil keputusan berdasarkan data yang terhubung." /><div className="grid gap-3 sm:grid-cols-3"><SmallMetric icon={BarChart3} label="Omzet periode ini" value="Rp84,6 jt" /><SmallMetric icon={TrendingUp} label="Pertumbuhan" value="+18,4%" /><SmallMetric icon={CircleDollarSign} label="Margin kotor" value="42,8%" /></div><div className="super-app-card rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Ringkasan omzet</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Gabungan seluruh modul bisnis</p></div><select value={period} onChange={(event) => setPeriod(event.target.value as Period)} className="rounded-lg border border-[#dce8e7] px-2.5 py-2 text-[10px] font-black text-[#6f898d]"><option>7 hari</option><option>30 hari</option><option>90 hari</option></select></div><div className="mt-6 flex h-56 items-end gap-2 border-b border-l border-[#e5eeee] px-4 sm:gap-5">{chart.map(({ day, value }) => <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[9px] font-black text-[#5a7c80]">{value}%</span><div className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-[#0f766e] to-[#64c9bd]" style={{ height: `${value}%` }} /><span className="text-[9px] font-bold text-[#9aadaf]">{day}</span></div>)}</div><button type="button" onClick={onExport} className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-black text-[#0f766e]"><FileText className="h-3.5 w-3.5" /> Buat laporan lengkap <ArrowUpRight className="h-3.5 w-3.5" /></button></div></div>;
}

function TransactionDetailDialog({ transaction, onClose, onNotify }: { transaction: Transaction; onClose: () => void; onNotify: (message: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123f47]/30 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="transaction-detail-title" className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0f9b8e]">Detail transaksi</p>
            <h2 id="transaction-detail-title" className="mt-1 text-lg font-black text-[#183b43]">{transaction.id}</h2>
            <p className="mt-1 text-xs font-semibold text-[#82999b]">{transaction.time} · {transaction.detail}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup detail transaksi" className="grid h-8 w-8 place-items-center rounded-full bg-[#f2f8f7] text-[#789396] hover:text-[#0f766e]"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 rounded-2xl bg-[#f4faf9] p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d9f1ec] text-[#0f766e]"><FileText className="h-4 w-4" /></span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8aa1a3]">Pelanggan</p>
              <p className="mt-1 text-sm font-black text-[#365b60]">{transaction.customer}</p>
            </div>
          </div>
          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8aa1a3]">Total pembayaran</p>
              <p className="mt-1 text-2xl font-black tracking-tight text-[#183b43]">{rupiah(transaction.amount)}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${transaction.status === "Selesai" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{transaction.status}</span>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => onNotify(`Invoice ${transaction.id} siap dibagikan.`)} className="rounded-xl border border-[#dce8e7] px-4 py-3 text-xs font-black text-[#648084] hover:border-[#9bc9c5] hover:text-[#0f766e]">Bagikan invoice</button>
          <button type="button" onClick={onClose} className="rounded-xl bg-[#0f766e] px-4 py-3 text-xs font-black text-white hover:bg-[#0b625c]">Selesai</button>
        </div>
      </div>
    </div>
  );
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">{eyebrow}</p><h2 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{title}</h2><p className="mt-1 text-xs leading-5 text-[#8aa1a3]">{description}</p></div>;
}

function SmallMetric({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#0f766e]" /><span className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8ba3a4]">{label}</span></div><p className="mt-3 text-lg font-black text-[#183b43]">{value}</p></div>;
}