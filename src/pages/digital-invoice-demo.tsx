import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  Clock3,
  Copy,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Landmark,
  LayoutDashboard,
  Lock,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  ReceiptText,
  RefreshCcw,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@/lib/wouter";
import "./digital-demo-super-app.css";

type BillingView = "overview" | "invoices" | "faktur" | "customers" | "reminders" | "reports";
type DocumentKind = "Invoice" | "Faktur";
type DocumentStatus = "Draft" | "Terkirim" | "Jatuh tempo" | "Lunas" | "Dibatalkan";

type BillingItem = {
  description: string;
  quantity: number;
  price: number;
};

type BillingDocument = {
  id: string;
  kind: DocumentKind;
  number: string;
  customer: string;
  company: string;
  email: string;
  phone: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: DocumentStatus;
  channel: string;
  taxRate: number;
  taxNumber: string;
  notes: string;
  items: BillingItem[];
};

const navItems: Array<{ id: BillingView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { id: "invoices", label: "Invoice", icon: FileText },
  { id: "faktur", label: "Faktur", icon: ReceiptText },
  { id: "customers", label: "Pelanggan", icon: Users },
  { id: "reminders", label: "Pengingat", icon: Bell },
  { id: "reports", label: "Laporan", icon: BarChart3 },
];

const documentStatuses: Array<"Semua status" | DocumentStatus> = [
  "Semua status",
  "Draft",
  "Terkirim",
  "Jatuh tempo",
  "Lunas",
  "Dibatalkan",
];

const initialDocuments: BillingDocument[] = [
  {
    id: "doc-01",
    kind: "Invoice",
    number: "INV-2026-0912",
    customer: "Dimas Pratama",
    company: "Rasa Rasa Catering",
    email: "dimas@rasarasa.co",
    phone: "0813 7712 9044",
    issueDate: "12 Sep 2026",
    dueDate: "20 Sep 2026",
    amount: 13750000,
    paidAmount: 0,
    status: "Terkirim",
    channel: "Email",
    taxRate: 11,
    taxNumber: "",
    notes: "Pembayaran dapat dilakukan melalui transfer bank atau QRIS.",
    items: [{ description: "Business Super App · 3 outlet", quantity: 1, price: 12387387 }],
  },
  {
    id: "doc-02",
    kind: "Invoice",
    number: "INV-2026-0908",
    customer: "Rina Kurnia",
    company: "Kopi Nempo",
    email: "rina@kopinempo.id",
    phone: "0812 4400 1288",
    issueDate: "08 Sep 2026",
    dueDate: "15 Sep 2026",
    amount: 18600000,
    paidAmount: 18600000,
    status: "Lunas",
    channel: "WhatsApp",
    taxRate: 11,
    taxNumber: "",
    notes: "Terima kasih sudah memilih Digi Nempo.",
    items: [{ description: "Kasir + QR Menu + CRM · Paket tahunan", quantity: 1, price: 16756757 }],
  },
  {
    id: "doc-03",
    kind: "Faktur",
    number: "FKT-2026-0906",
    customer: "Nadia Amelia",
    company: "Sagara Living",
    email: "nadia@sagaraliving.id",
    phone: "0812 6631 2201",
    issueDate: "06 Sep 2026",
    dueDate: "06 Sep 2026",
    amount: 9800000,
    paidAmount: 9800000,
    status: "Lunas",
    channel: "Email",
    taxRate: 11,
    taxNumber: "010.006-26.12345678",
    notes: "Faktur untuk layanan website dan booking engine.",
    items: [{ description: "Company Website + Booking Engine", quantity: 1, price: 8828829 }],
  },
  {
    id: "doc-04",
    kind: "Invoice",
    number: "INV-2026-0904",
    customer: "Agus Suherman",
    company: "Garut Adventure",
    email: "agus@garutadventure.com",
    phone: "0821 9055 1707",
    issueDate: "04 Sep 2026",
    dueDate: "11 Sep 2026",
    amount: 7200000,
    paidAmount: 0,
    status: "Jatuh tempo",
    channel: "WhatsApp",
    taxRate: 11,
    taxNumber: "",
    notes: "Invoice event ticketing dan dashboard partner.",
    items: [{ description: "Event Ticketing · Setup dan campaign", quantity: 1, price: 6486486 }],
  },
  {
    id: "doc-05",
    kind: "Faktur",
    number: "FKT-2026-0901",
    customer: "Maya Salsabila",
    company: "Maja Creative",
    email: "maya@majacreative.id",
    phone: "0812 1098 7765",
    issueDate: "01 Sep 2026",
    dueDate: "01 Sep 2026",
    amount: 8400000,
    paidAmount: 8400000,
    status: "Lunas",
    channel: "Email",
    taxRate: 11,
    taxNumber: "010.006-26.12340091",
    notes: "Faktur jasa referral dan partnership.",
    items: [{ description: "Partnership setup dan referral program", quantity: 1, price: 7567568 }],
  },
  {
    id: "doc-06",
    kind: "Invoice",
    number: "INV-2026-0828",
    customer: "Fajar Maulana",
    company: "Kelana Event",
    email: "fajar@kelanaevent.id",
    phone: "0819 3302 8111",
    issueDate: "28 Agu 2026",
    dueDate: "12 Sep 2026",
    amount: 5400000,
    paidAmount: 0,
    status: "Jatuh tempo",
    channel: "Email",
    taxRate: 11,
    taxNumber: "",
    notes: "Termin pertama untuk event Halloween.",
    items: [{ description: "Ticketing event dan sponsor dashboard", quantity: 1, price: 4864865 }],
  },
  {
    id: "doc-07",
    kind: "Invoice",
    number: "INV-2026-0915",
    customer: "Beni Hidayat",
    company: "Kedai Pojok",
    email: "beni@kedaipojok.id",
    phone: "0822 4428 0990",
    issueDate: "15 Sep 2026",
    dueDate: "29 Sep 2026",
    amount: 6300000,
    paidAmount: 0,
    status: "Draft",
    channel: "Belum dikirim",
    taxRate: 11,
    taxNumber: "",
    notes: "Menunggu konfirmasi paket dua cabang.",
    items: [{ description: "Kasir + Inventory · 2 cabang", quantity: 1, price: 5675676 }],
  },
  {
    id: "doc-08",
    kind: "Faktur",
    number: "FKT-2026-0825",
    customer: "Putri Ananda",
    company: "Arunika Wedding",
    email: "putri@arunikawedding.id",
    phone: "0813 9902 7118",
    issueDate: "25 Agu 2026",
    dueDate: "25 Agu 2026",
    amount: 2900000,
    paidAmount: 2900000,
    status: "Lunas",
    channel: "Email",
    taxRate: 11,
    taxNumber: "010.006-26.12338761",
    notes: "Faktur layanan digital invitation.",
    items: [{ description: "Digital Invitation Premium", quantity: 1, price: 2612613 }],
  },
];

const INVOICE_PREVIEW_PASSWORD = "nemposukses";
const INVOICE_PREVIEW_ACCESS_KEY = "nempo_invoice_preview_access";

const rupiah = (amount: number) => `Rp${Math.round(amount / 1000).toLocaleString("id-ID")}K`;
const fullRupiah = (amount: number) => `Rp${amount.toLocaleString("id-ID")}`;
const formatTaxBase = (amount: number, taxRate: number) => Math.round(amount / (1 + taxRate / 100));

function InvoicePreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="Invoice & Faktur" description="Masukkan password untuk membuka preview penagihan, faktur, dan laporan pembayaran Digi Nempo." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === INVOICE_PREVIEW_PASSWORD) {
      localStorage.setItem(INVOICE_PREVIEW_ACCESS_KEY, "1");
      onUnlock();
      return;
    }
    setError(true);
  }

  return (
    <main className="nempo-demo-green nempo-invoice-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md border border-[#dcebea] bg-[#fbfdfd] p-6 shadow-[0_22px_70px_rgba(24,59,67,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-lg shadow-teal-800/20"><ReceiptText className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f9b8e]">Live preview</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Invoice & Faktur</h1></div>
        </div>
        <p className="text-sm leading-6 text-[#648084]">Masukkan password untuk membuka preview penagihan, faktur, dan laporan pembayaran Digi Nempo.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="text" name="username" autoComplete="username" value="invoice-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
          <label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#b75c54] bg-[#fff8f5]" : "border-[#dcebea] focus-within:border-[#0f766e]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da5a2]"}`} />
            <span className="sr-only">Password live preview Invoice dan Faktur</span>
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

export default function DigitalInvoiceDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <InvoicePreviewGate onUnlock={() => setUnlocked(true)} />;
  return <InvoiceWorkspace />;
}

function InvoiceWorkspace() {
  const [activeView, setActiveView] = useState<BillingView>("overview");
  const [documents, setDocuments] = useState(initialDocuments);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua status" | DocumentStatus>("Semua status");
  const [selectedDocument, setSelectedDocument] = useState<BillingDocument | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  const filteredDocuments = useMemo(() => documents.filter((document) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || [document.number, document.customer, document.company, document.email].join(" ").toLowerCase().includes(needle);
    const matchesStatus = statusFilter === "Semua status" || document.status === statusFilter;
    const matchesView = activeView === "invoices" ? document.kind === "Invoice" : activeView === "faktur" ? document.kind === "Faktur" : true;
    return matchesQuery && matchesStatus && matchesView;
  }), [activeView, documents, query, statusFilter]);

  function updateDocument(updated: BillingDocument) {
    setDocuments((current) => current.map((document) => document.id === updated.id ? updated : document));
    setSelectedDocument(updated);
  }

  function markPaid(document: BillingDocument) {
    updateDocument({ ...document, paidAmount: document.amount, status: "Lunas" });
    notify(`${document.number} ditandai lunas.`);
  }

  function sendDocument(document: BillingDocument) {
    updateDocument({ ...document, status: document.status === "Draft" ? "Terkirim" : document.status, channel: document.channel === "Belum dikirim" ? "Email" : document.channel });
    notify(`${document.number} siap dibagikan ke ${document.customer}.`);
  }

  function addDocument(document: BillingDocument) {
    setDocuments((current) => [document, ...current]);
    setCreateOpen(false);
    setActiveView(document.kind === "Invoice" ? "invoices" : "faktur");
    notify(`${document.kind} ${document.number} berhasil dibuat.`);
  }

  function exportDocuments() {
    const rows = [["Nomor", "Jenis", "Pelanggan", "Perusahaan", "Tanggal jatuh tempo", "Total", "Status"], ...documents.map((document) => [document.number, document.kind, document.customer, document.company, document.dueDate, String(document.amount), document.status])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = "nempo-invoice-faktur.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    notify("Data Invoice dan Faktur berhasil diekspor.");
  }

  const activeDocument = selectedDocument ? documents.find((document) => document.id === selectedDocument.id) ?? selectedDocument : null;
  const unpaid = documents.filter((document) => document.status !== "Lunas" && document.status !== "Dibatalkan");

  return (
    <Layout>
      <SEO title="Invoice & Faktur Demo — Digi Nempo" description="Preview Invoice dan Faktur Digi Nempo untuk membuat tagihan, memantau pembayaran, dan mengelola dokumen keuangan." keywords="invoice, faktur, billing, pembayaran, Digi Nempo" path="/digital-services/invoice" />
      <main className="nempo-demo-green nempo-invoice-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1480px] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link href="/digital-services" className="inline-flex items-center gap-2 text-[10px] font-black text-[#648084] transition-colors hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Digi Nempo</Link>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><span className="h-2 w-2 rounded-full bg-[#1db49f]" /> Demo workspace · data simulasi</div>
          </div>
          <div className="overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_24px_70px_rgba(20,74,77,0.1)]">
            <div className="flex min-h-[760px] flex-col lg:flex-row">
              <aside className="hidden w-[226px] shrink-0 bg-[#123f47] p-4 text-white lg:flex lg:flex-col">
                <div className="flex items-center gap-2.5 border-b border-white/10 px-2 pb-5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0f9b8e]"><ReceiptText className="h-4 w-4" /></div><div><p className="text-xs font-black">Nempo Billing</p><p className="mt-0.5 text-[9px] font-semibold text-white/45">Invoice & Faktur</p></div></div>
                <div className="px-2 pt-6"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#72cfc4]">Keuangan</p><nav className="mt-3 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black transition-colors ${activeView === id ? "bg-white text-[#0f766e]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}{id === "reminders" && unpaid.length > 0 && <span className="ml-auto rounded-full bg-[#e7a77d] px-1.5 py-0.5 text-[8px] text-white">{unpaid.length}</span>}</button>)}</nav></div>
                <div className="mt-auto rounded-2xl bg-white/10 p-3.5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Super App connected</p><p className="mt-2 text-[11px] font-bold leading-4 text-white">Invoice terhubung dengan CRM, Kasir, dan laporan usaha.</p><button type="button" onClick={() => notify("Integrasi CRM dan Kasir siap dijelaskan dalam presentasi.")} className="mt-3 inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Lihat alur integrasi <ArrowRight className="h-3 w-3" /></button></div>
              </aside>
              <section className="min-w-0 flex-1 bg-[#f8fbfb]">
                <div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Nempo Billing · Garut</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{navItems.find((item) => item.id === activeView)?.label}</h1><p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Buat tagihan rapi, tahu siapa yang sudah bayar, dan follow-up tanpa lupa.</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setActiveView("reminders")} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Bell className="h-3.5 w-3.5" /> Pengingat</button><button type="button" onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Buat dokumen</button></div></div></div>
                <div className="flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white px-4 py-2 lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b]"}`}><Icon className="h-3 w-3" />{label}</button>)}</div>
                <div className="p-4 sm:p-6">
                  {activeView === "overview" && <OverviewView documents={documents} onView={setActiveView} onDocument={setSelectedDocument} onNotify={notify} />}
                  {activeView === "invoices" && <DocumentsView kind="Invoice" documents={filteredDocuments} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onCreate={() => setCreateOpen(true)} onExport={exportDocuments} onDocument={setSelectedDocument} />}
                  {activeView === "faktur" && <DocumentsView kind="Faktur" documents={filteredDocuments} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onCreate={() => setCreateOpen(true)} onExport={exportDocuments} onDocument={setSelectedDocument} />}
                  {activeView === "customers" && <CustomersView documents={documents} onDocument={setSelectedDocument} />}
                  {activeView === "reminders" && <RemindersView documents={documents} onDocument={setSelectedDocument} onNotify={notify} />}
                  {activeView === "reports" && <ReportsView documents={documents} onExport={exportDocuments} />}
                </div>
              </section>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]"><span>Data simulasi untuk kebutuhan presentasi customer.</span><span className="hidden items-center gap-1 sm:inline-flex"><Clock3 className="h-3 w-3" /> Terakhir diperbarui beberapa detik lalu</span></div>
        </div>
        {createOpen && <CreateDocumentModal onClose={() => setCreateOpen(false)} onSubmit={addDocument} />}
        {activeDocument && <DocumentDrawer document={activeDocument} onClose={() => setSelectedDocument(null)} onPaid={markPaid} onSend={sendDocument} onNotify={notify} />}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f47] px-4 py-3 text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8bd6cc]" /> {toast}</div>}
      </main>
    </Layout>
  );
}

function OverviewView({ documents, onView, onDocument, onNotify }: { documents: BillingDocument[]; onView: (view: BillingView) => void; onDocument: (document: BillingDocument) => void; onNotify: (message: string) => void }) {
  const billed = documents.reduce((sum, document) => sum + document.amount, 0);
  const collected = documents.reduce((sum, document) => sum + document.paidAmount, 0);
  const outstanding = billed - collected;
  const overdue = documents.filter((document) => document.status === "Jatuh tempo");
  const recent = documents.slice(0, 4);
  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={CircleDollarSign} label="Total ditagihkan" value={rupiah(billed)} detail="+18,6% bulan ini" tone="teal" /><MetricCard icon={WalletCards} label="Sudah diterima" value={rupiah(collected)} detail={`${Math.round((collected / billed) * 100)}% dari total invoice`} tone="blue" /><MetricCard icon={CreditCard} label="Belum dibayar" value={rupiah(outstanding)} detail={`${documents.filter((document) => document.paidAmount === 0).length} dokumen terbuka`} tone="violet" /><MetricCard icon={CircleAlert} label="Jatuh tempo" value={rupiah(overdue.reduce((sum, document) => sum + document.amount, 0))} detail={`${overdue.length} perlu ditindaklanjuti`} tone="amber" /></div>
    <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Arus pembayaran</p><h2 className="mt-2 text-lg font-black text-[#244950]">Tagihan yang bergerak.</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">Pantau invoice terbuka dan pastikan tidak ada pembayaran yang terlewat.</p></div><button type="button" onClick={() => onView("invoices")} className="rounded-lg p-2 text-[#0f766e] hover:bg-[#e6f6f3]"><ArrowRight className="h-4 w-4" /></button></div><div className="mt-5 space-y-2">{recent.map((document) => <button key={document.id} type="button" onClick={() => onDocument(document)} className="flex w-full items-center gap-3 rounded-xl border border-[#edf3f2] p-3 text-left transition-colors hover:border-[#b9ded8] hover:bg-[#fbfefe]"><DocumentIcon kind={document.kind} status={document.status} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="truncate text-[10px] font-black text-[#365b60]">{document.number}</p><StatusPill status={document.status} /></div><p className="mt-1 truncate text-[9px] font-semibold text-[#94a8aa]">{document.company} · jatuh tempo {document.dueDate}</p></div><span className="shrink-0 text-[10px] font-black text-[#365b60]">{fullRupiah(document.amount)}</span><ChevronRight className="h-3.5 w-3.5 text-[#9eb4b5]" /></button>)}</div></section>
      <section className="rounded-2xl border border-[#e3eeed] bg-[#123f47] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Billing insight</p><h2 className="mt-2 text-lg font-black leading-tight">Penagihan yang terasa profesional.</h2></div><Sparkles className="h-5 w-5 text-[#8bd6cc]" /></div><p className="mt-3 text-[10px] leading-5 text-white/60">Invoice dan Faktur tersusun dalam satu ruang, jadi tim bisa membagikan dokumen, mengecek status, dan menindaklanjuti pembayaran dengan konteks yang jelas.</p><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Rata-rata dibayar</p><p className="mt-1 text-xl font-black">8,4 hari</p><p className="mt-1 text-[9px] font-bold text-[#8bd6cc]">-1,2 hari</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Lunas bulan ini</p><p className="mt-1 text-xl font-black">68%</p><p className="mt-1 text-[9px] font-bold text-[#8bd6cc]">+8,4%</p></div></div><button type="button" onClick={() => onNotify("Pengaturan pengingat otomatis siap dijelaskan dalam demo.")} className="mt-5 flex items-center gap-1.5 text-[10px] font-black text-[#a2e7df]">Atur pengingat otomatis <ArrowRight className="h-3 w-3" /></button></section>
    </div>
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Invoice vs Faktur</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Dokumen yang dibuat bulan ini</p></div><button type="button" onClick={() => onView("faktur")} className="text-[10px] font-black text-[#0f766e]">Lihat faktur</button></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#e6f6f3] p-4"><p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#0f766e]">Invoice</p><p className="mt-2 text-2xl font-black text-[#244950]">{documents.filter((document) => document.kind === "Invoice").length}</p><p className="mt-1 text-[9px] font-semibold text-[#6d878a]">{rupiah(documents.filter((document) => document.kind === "Invoice").reduce((sum, document) => sum + document.amount, 0))} nilai tagihan</p></div><div className="rounded-xl bg-[#e3eff8] p-4"><p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#3a6b9b]">Faktur</p><p className="mt-2 text-2xl font-black text-[#244950]">{documents.filter((document) => document.kind === "Faktur").length}</p><p className="mt-1 text-[9px] font-semibold text-[#6d878a]">{rupiah(documents.filter((document) => document.kind === "Faktur").reduce((sum, document) => sum + document.amount, 0))} nilai dokumen</p></div></div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Perlu perhatian</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Dokumen yang membutuhkan aksi</p></div><button type="button" onClick={() => onView("reminders")} className="rounded-lg p-2 text-[#0f766e] hover:bg-[#e6f6f3]"><Bell className="h-4 w-4" /></button></div><div className="mt-4 space-y-3">{overdue.slice(0, 3).map((document) => <button key={document.id} type="button" onClick={() => onDocument(document)} className="flex w-full items-center gap-3 text-left"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff1dc] text-[#a56c2b]"><Bell className="h-3.5 w-3.5" /></span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{document.company}</p><p className="mt-1 text-[9px] text-[#94a8aa]">{document.number} · {fullRupiah(document.amount)}</p></div><ChevronRight className="h-3.5 w-3.5 text-[#9eb4b5]" /></button>)}</div></section></div>
  </div>;
}

function DocumentsView({ kind, documents, query, setQuery, statusFilter, setStatusFilter, onCreate, onExport, onDocument }: { kind: DocumentKind; documents: BillingDocument[]; query: string; setQuery: (value: string) => void; statusFilter: "Semua status" | DocumentStatus; setStatusFilter: (value: "Semua status" | DocumentStatus) => void; onCreate: () => void; onExport: () => void; onDocument: (document: BillingDocument) => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow={kind === "Invoice" ? "Penagihan pelanggan" : "Dokumen transaksi"} title={kind === "Invoice" ? "Semua invoice" : "Faktur usaha"} description={kind === "Invoice" ? "Buat, kirim, dan pantau tagihan sampai pembayaran diterima." : "Simpan faktur yang rapi dengan nomor dokumen dan data pajak yang mudah dicari."} /><div className="flex gap-2"><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export</button><button type="button" onClick={onCreate} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Buat {kind}</button></div></div><div className="flex flex-col gap-2 rounded-2xl border border-[#e3eeed] bg-white p-3 sm:flex-row"><label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-[#f4f9f8] px-3 py-2.5"><Search className="h-4 w-4 text-[#8aa1a3]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Cari nomor ${kind.toLowerCase()}, pelanggan, atau perusahaan...`} className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#a2b3b4]" /></label><label className="flex items-center gap-2 rounded-xl border border-[#e3eeed] px-3 py-2.5 text-[10px] font-black text-[#648084]"><Filter className="h-3.5 w-3.5 text-[#0f766e]" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "Semua status" | DocumentStatus)} className="bg-transparent outline-none">{documentStatuses.map((status) => <option key={status}>{status}</option>)}</select></label></div><div className="overflow-hidden rounded-2xl border border-[#e3eeed] bg-white"><div className="hidden grid-cols-[1.15fr_1.25fr_.8fr_.9fr_.9fr_24px] gap-3 border-b border-[#edf3f2] px-4 py-3 text-[9px] font-black uppercase tracking-[0.12em] text-[#9aadae] md:grid"><span>Dokumen</span><span>Pelanggan</span><span>Total</span><span>Status</span><span>Jatuh tempo</span><span /></div><div className="divide-y divide-[#edf3f2]">{documents.length ? documents.map((document) => <div key={document.id} className="grid gap-3 px-4 py-3.5 transition-colors hover:bg-[#fbfefe] md:grid-cols-[1.15fr_1.25fr_.8fr_.9fr_.9fr_24px] md:items-center"><button type="button" onClick={() => onDocument(document)} className="flex min-w-0 items-center gap-3 text-left"><DocumentIcon kind={document.kind} status={document.status} /><span className="min-w-0"><strong className="block truncate text-[11px] font-black text-[#365b60]">{document.number}</strong><span className="mt-1 block truncate text-[9px] font-semibold text-[#94a8aa]">{document.issueDate} · {document.channel}</span></span></button><span className="min-w-0 text-[10px] font-semibold text-[#6d878a]"><strong className="block truncate text-[10px] font-black text-[#365b60]">{document.company}</strong><span className="mt-1 block truncate text-[9px]">{document.customer}</span></span><span className="text-[10px] font-black text-[#365b60]">{fullRupiah(document.amount)}</span><span><StatusPill status={document.status} /></span><span className="text-[9px] font-semibold text-[#94a8aa]">{document.dueDate}</span><button type="button" onClick={() => onDocument(document)} aria-label={`Buka ${document.number}`} className="hidden place-items-center rounded-lg p-1.5 text-[#94a8aa] hover:bg-[#e6f6f3] hover:text-[#0f766e] md:grid"><ChevronRight className="h-4 w-4" /></button></div>) : <div className="p-10 text-center"><Search className="mx-auto h-6 w-6 text-[#b3c5c5]" /><p className="mt-3 text-xs font-black text-[#365b60]">Dokumen tidak ditemukan</p><p className="mt-1 text-[10px] text-[#94a8aa]">Coba kata kunci atau status lain.</p></div>}</div></div></div>;
}

function CustomersView({ documents, onDocument }: { documents: BillingDocument[]; onDocument: (document: BillingDocument) => void }) {
  const customers = Array.from(new Set(documents.map((document) => document.company))).map((company) => { const entries = documents.filter((document) => document.company === company); return { company, customer: entries[0].customer, email: entries[0].email, total: entries.reduce((sum, document) => sum + document.amount, 0), outstanding: entries.reduce((sum, document) => sum + document.amount - document.paidAmount, 0), latest: entries[0] }; });
  return <div className="space-y-4"><SectionIntro eyebrow="Pelanggan & piutang" title="Pelanggan penagihan" description="Lihat total transaksi dan saldo terbuka setiap pelanggan dari satu tampilan." /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{customers.map((customer) => <article key={customer.company} className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Building2 className="h-4 w-4" /></span><button type="button" onClick={() => onDocument(customer.latest)} aria-label={`Lihat dokumen ${customer.company}`} className="rounded-lg p-2 text-[#9aadae] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><MoreHorizontal className="h-4 w-4" /></button></div><h2 className="mt-4 text-sm font-black text-[#365b60]">{customer.company}</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{customer.customer} · {customer.email}</p><div className="mt-5 grid grid-cols-2 gap-2"><MiniStat label="Total transaksi" value={rupiah(customer.total)} /><MiniStat label="Saldo terbuka" value={customer.outstanding ? rupiah(customer.outstanding) : "Lunas"} /></div><button type="button" onClick={() => onDocument(customer.latest)} className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-[#0f766e]">Lihat dokumen terakhir <ArrowRight className="h-3 w-3" /></button></article>)}</div></div>;
}

function RemindersView({ documents, onDocument, onNotify }: { documents: BillingDocument[]; onDocument: (document: BillingDocument) => void; onNotify: (message: string) => void }) {
  const overdue = documents.filter((document) => document.status === "Jatuh tempo");
  const upcoming = documents.filter((document) => document.status === "Terkirim");
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Koleksi follow-up" title="Pengingat pembayaran" description="Prioritaskan invoice yang jatuh tempo dan kirim pengingat dari detail dokumen." /><button type="button" onClick={() => onNotify("Pengingat massal siap dijadwalkan untuk invoice terbuka.")} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Bell className="h-3.5 w-3.5" /> Atur pengingat</button></div><div className="grid gap-4 lg:grid-cols-2"><ReminderSection title="Jatuh tempo" detail="Perlu ditindaklanjuti hari ini" icon={CircleAlert} tone="amber" documents={overdue} onDocument={onDocument} onNotify={onNotify} /><ReminderSection title="Akan jatuh tempo" detail="Kirim pengingat sebelum terlambat" icon={Clock3} tone="teal" documents={upcoming} onDocument={onDocument} onNotify={onNotify} /></div></div>;
}

function ReminderSection({ title, detail, icon: Icon, tone, documents, onDocument, onNotify }: { title: string; detail: string; icon: typeof CircleAlert; tone: "amber" | "teal"; documents: BillingDocument[]; onDocument: (document: BillingDocument) => void; onNotify: (message: string) => void }) {
  const colors = tone === "amber" ? { box: "bg-[#fff1dc]", icon: "text-[#a56c2b]", pill: "bg-[#fff3df] text-[#a56c2b]" } : { box: "bg-[#e6f6f3]", icon: "text-[#0f766e]", pill: "bg-[#e6f6f3] text-[#0f766e]" };
  return <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center gap-3"><span className={`grid h-9 w-9 place-items-center rounded-xl ${colors.box} ${colors.icon}`}><Icon className="h-4 w-4" /></span><div><h2 className="text-sm font-black text-[#365b60]">{title}</h2><p className="mt-1 text-[10px] text-[#94a8aa]">{detail}</p></div></div><div className="mt-5 space-y-2">{documents.length ? documents.map((document) => <div key={document.id} className="flex items-center gap-3 rounded-xl border border-[#edf3f2] p-3"><DocumentIcon kind={document.kind} status={document.status} /><button type="button" onClick={() => onDocument(document)} className="min-w-0 flex-1 text-left"><p className="truncate text-[10px] font-black text-[#365b60]">{document.company}</p><p className="mt-1 truncate text-[9px] font-semibold text-[#94a8aa]">{document.number} · jatuh tempo {document.dueDate}</p></button><div className="text-right"><p className="text-[10px] font-black text-[#365b60]">{fullRupiah(document.amount)}</p><button type="button" onClick={() => onNotify(`Pengingat ${document.number} siap dibagikan.`)} className={`mt-1 rounded-full px-2 py-1 text-[8px] font-black ${colors.pill}`}>Kirim pengingat</button></div></div>) : <p className="rounded-xl bg-[#f4f9f8] p-4 text-center text-[10px] font-semibold text-[#94a8aa]">Tidak ada dokumen di daftar ini.</p>}</div></section>;
}

function ReportsView({ documents, onExport }: { documents: BillingDocument[]; onExport: () => void }) {
  const bars = [52, 64, 48, 76, 69, 88, 82];
  const taxBase = documents.filter((document) => document.kind === "Faktur").reduce((sum, document) => sum + formatTaxBase(document.amount, document.taxRate), 0);
  const tax = documents.filter((document) => document.kind === "Faktur").reduce((sum, document) => sum + (document.amount - formatTaxBase(document.amount, document.taxRate)), 0);
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Analitik keuangan" title="Laporan billing" description="Baca pemasukan, piutang, dan nilai faktur dalam satu ringkasan yang siap dipresentasikan." /><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export data</button></div><div className="grid gap-3 sm:grid-cols-3"><MetricCard icon={CircleDollarSign} label="Pendapatan tertagih" value={rupiah(documents.reduce((sum, document) => sum + document.paidAmount, 0))} detail="+14,6% vs bulan lalu" tone="teal" /><MetricCard icon={TrendingUp} label="Rasio tertagih" value={`${Math.round((documents.reduce((sum, document) => sum + document.paidAmount, 0) / documents.reduce((sum, document) => sum + document.amount, 0)) * 100)}%`} detail="+6,2% vs bulan lalu" tone="blue" /><MetricCard icon={ReceiptText} label="Nilai faktur" value={rupiah(taxBase + tax)} detail={`${documents.filter((document) => document.kind === "Faktur").length} dokumen pajak`} tone="violet" /></div><div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Penerimaan pembayaran</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Performa 7 minggu terakhir</p></div><span className="rounded-lg bg-[#e6f6f3] px-2.5 py-1.5 text-[9px] font-black text-[#0f766e]">+18,4%</span></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-[#edf3f2] px-1">{bars.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className={`w-full max-w-[34px] rounded-t-lg ${index === bars.length - 1 ? "bg-[#0f766e]" : "bg-[#a9dcd6]"}`} style={{ height: `${value}%` }} /><span className="text-[9px] font-bold text-[#a2b3b4]">M{index + 1}</span></div>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Ringkasan faktur</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Dasar pengenaan dan pajak</p></div><Landmark className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-5 space-y-3"><ReportRow label="DPP / dasar pengenaan" value={fullRupiah(taxBase)} /><ReportRow label="PPN terkumpul" value={fullRupiah(tax)} /><ReportRow label="Total faktur" value={fullRupiah(taxBase + tax)} /><div className="border-t border-[#edf3f2] pt-3"><ReportRow label="Faktur lunas" value={`${documents.filter((document) => document.kind === "Faktur" && document.status === "Lunas").length} dokumen`} /></div></div></section></div></div>;
}

function DocumentDrawer({ document, onClose, onPaid, onSend, onNotify }: { document: BillingDocument; onClose: () => void; onPaid: (document: BillingDocument) => void; onSend: (document: BillingDocument) => void; onNotify: (message: string) => void }) {
  const taxBase = formatTaxBase(document.amount, document.taxRate);
  const tax = document.amount - taxBase;
  return <div className="fixed inset-0 z-[70] bg-[#183b43]/35 backdrop-blur-sm" onMouseDown={onClose}><aside role="dialog" aria-modal="true" aria-label={`Detail ${document.number}`} onMouseDown={(event) => event.stopPropagation()} className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-[#e3eeed] p-5"><div className="flex items-center gap-3"><DocumentIcon kind={document.kind} status={document.status} large /><div><p className="text-lg font-black text-[#244950]">{document.number}</p><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{document.kind} · {document.issueDate}</p></div></div><button type="button" onClick={onClose} aria-label="Tutup detail dokumen" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="flex-1 overflow-y-auto p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">Status dokumen</p><div className="mt-2"><StatusPill status={document.status} /></div></div><p className="text-2xl font-black tracking-tight text-[#244950]">{fullRupiah(document.amount)}</p></div><div className="mt-5 rounded-xl bg-[#f4f9f8] p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d7efeb] text-[#0f766e]"><Building2 className="h-4 w-4" /></span><div><p className="text-[10px] font-black text-[#365b60]">{document.company}</p><p className="mt-1 text-[9px] text-[#94a8aa]">{document.customer}</p></div></div><div className="mt-4 space-y-2 text-[10px] font-semibold text-[#648084]"><span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-[#0f766e]" /> {document.email}</span><span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-[#0f766e]" /> {document.phone}</span><span className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-[#0f766e]" /> Jatuh tempo {document.dueDate}</span></div></div><div className="mt-5"><div className="flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">Rincian</p><button type="button" onClick={() => onNotify("Mode edit dokumen siap dikembangkan.")} className="inline-flex items-center gap-1 text-[9px] font-black text-[#0f766e]"><Pencil className="h-3 w-3" /> Edit</button></div><div className="mt-3 overflow-hidden rounded-xl border border-[#e3eeed]">{document.items.map((item, index) => <div key={`${item.description}-${index}`} className="flex items-center justify-between gap-3 border-b border-[#edf3f2] p-3 last:border-0"><div className="min-w-0"><p className="truncate text-[10px] font-black text-[#365b60]">{item.description}</p><p className="mt-1 text-[9px] text-[#94a8aa]">{item.quantity} × {fullRupiah(item.price)}</p></div><p className="shrink-0 text-[10px] font-black text-[#365b60]">{fullRupiah(item.quantity * item.price)}</p></div>)}<div className="space-y-2 bg-[#fbfefe] p-3 text-[10px]"><ReportRow label="DPP" value={fullRupiah(taxBase)} /><ReportRow label={`PPN ${document.taxRate}%`} value={fullRupiah(tax)} /><div className="border-t border-[#e3eeed] pt-2"><ReportRow label="Total" value={fullRupiah(document.amount)} strong /></div></div></div></div><div className="mt-5 rounded-xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] p-3"><p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#0f766e]">Catatan</p><p className="mt-2 text-[10px] leading-5 text-[#648084]">{document.notes}</p>{document.taxNumber && <p className="mt-2 text-[9px] font-semibold text-[#8aa1a3]">Nomor faktur pajak: {document.taxNumber}</p>}</div></div><div className="border-t border-[#e3eeed] p-4"><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => { navigator.clipboard?.writeText(document.number); onNotify(`${document.number} disalin.`); }} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#dcebea] py-3 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Copy className="h-3.5 w-3.5" /> Salin nomor</button><button type="button" onClick={() => onNotify(`${document.number} disiapkan untuk diunduh.`)} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#dcebea] py-3 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Download</button></div><div className="mt-2 grid grid-cols-2 gap-2"><button type="button" onClick={() => onSend(document)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#e6f6f3] py-3 text-[10px] font-black text-[#0f766e] hover:bg-[#d4efeb]"><Send className="h-3.5 w-3.5" /> Bagikan</button>{document.status !== "Lunas" && document.status !== "Dibatalkan" ? <button type="button" onClick={() => onPaid(document)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] py-3 text-[10px] font-black text-white hover:bg-[#0b625c]"><CircleCheck className="h-3.5 w-3.5" /> Tandai lunas</button> : <button type="button" onClick={() => onNotify("Dokumen sudah tercatat lunas.")} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#eff7f5] py-3 text-[10px] font-black text-[#0f766e]"><Check className="h-3.5 w-3.5" /> Sudah lunas</button>}</div></div></aside></div>;
}

function CreateDocumentModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (document: BillingDocument) => void }) {
  const [kind, setKind] = useState<DocumentKind>("Invoice");
  const [customer, setCustomer] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("Layanan digital Digi Nempo");
  const [price, setPrice] = useState("5000000");
  const [quantity, setQuantity] = useState("1");
  const [dueDate, setDueDate] = useState("30 Sep 2026");
  const [taxRate, setTaxRate] = useState("11");
  const [notes, setNotes] = useState("Pembayaran dapat dilakukan melalui transfer bank atau QRIS.");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanCustomer = customer.trim();
    const cleanCompany = company.trim();
    if (!cleanCustomer || !cleanCompany) return;
    const amount = Math.round((Number(price) || 0) * (Number(quantity) || 1) * (1 + (Number(taxRate) || 0) / 100));
    const prefix = kind === "Invoice" ? "INV" : "FKT";
    const number = `${prefix}-2026-${String(Date.now()).slice(-4)}`;
    onSubmit({ id: `doc-${Date.now()}`, kind, number, customer: cleanCustomer, company: cleanCompany, email: email.trim() || "Belum diisi", phone: phone.trim() || "Belum diisi", issueDate: "Hari ini", dueDate, amount, paidAmount: 0, status: "Draft", channel: "Belum dikirim", taxRate: Number(taxRate) || 0, taxNumber: kind === "Faktur" ? "Menunggu nomor faktur pajak" : "", notes: notes.trim() || "Belum ada catatan tambahan.", items: [{ description: description.trim() || "Layanan digital Digi Nempo", quantity: Number(quantity) || 1, price: Number(price) || 0 }] });
  }
  return <ModalShell title="Buat dokumen baru" eyebrow="Invoice & Faktur" onClose={onClose}><form onSubmit={submit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Jenis dokumen"><select value={kind} onChange={(event) => setKind(event.target.value as DocumentKind)} className={fieldClass}><option>Invoice</option><option>Faktur</option></select></Field><Field label="Jatuh tempo"><select value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={fieldClass}><option>Hari ini</option><option>30 Sep 2026</option><option>07 Okt 2026</option><option>14 Okt 2026</option></select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama pelanggan"><input required autoFocus value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Contoh: Sinta Prameswari" className={fieldClass} /></Field><Field label="Perusahaan / bisnis"><input required value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Contoh: Kedai Pagi" className={fieldClass} /></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Email"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@bisnis.id" className={fieldClass} /></Field><Field label="Nomor WhatsApp"><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0812..." className={fieldClass} /></Field></div><div className="rounded-xl border border-[#e3eeed] p-3"><p className="mb-3 text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">Rincian layanan</p><div className="grid gap-3 sm:grid-cols-[1fr_90px_120px]"><Field label="Deskripsi"><input value={description} onChange={(event) => setDescription(event.target.value)} className={fieldClass} /></Field><Field label="Qty"><input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className={fieldClass} /></Field><Field label="Harga satuan"><input type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} className={fieldClass} /></Field></div></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Pajak"><select value={taxRate} onChange={(event) => setTaxRate(event.target.value)} className={fieldClass}><option value="11">PPN 11%</option><option value="0">Tanpa pajak</option></select></Field><Field label="Catatan"><input value={notes} onChange={(event) => setNotes(event.target.value)} className={fieldClass} /></Field></div><div className="rounded-xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] p-3"><p className="flex items-center gap-2 text-[10px] font-black text-[#08766f]"><Sparkles className="h-3.5 w-3.5" /> Siap dibagikan setelah disimpan</p><p className="mt-1 text-[9px] leading-4 text-[#6d878a]">Dokumen baru akan masuk sebagai Draft supaya tim bisa mengecek detail sebelum dikirim.</p></div><ModalActions onClose={onClose} submitLabel={`Simpan ${kind}`} /></form></ModalShell>;
}

function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[75] flex items-end justify-center bg-[#183b43]/40 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div role="dialog" aria-modal="true" className="w-full max-w-2xl rounded-t-[26px] bg-white p-5 shadow-2xl sm:rounded-[26px] sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0f766e]">{eyebrow}</p><h2 className="mt-2 text-xl font-black text-[#183b43]">{title}</h2></div><button type="button" onClick={onClose} aria-label="Tutup modal" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-6">{children}</div></div></div>;
}

function ModalActions({ onClose, submitLabel }: { onClose: () => void; submitLabel: string }) {
  return <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[10px] font-black text-[#6d878a] hover:bg-[#f4f9f8]">Batal</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]">{submitLabel}</button></div>;
}

function DocumentIcon({ kind, status, large = false }: { kind: DocumentKind; status: DocumentStatus; large?: boolean }) {
  const Icon = kind === "Invoice" ? FileText : ReceiptText;
  const tone = status === "Lunas" ? "bg-[#e6f6f3] text-[#0f766e]" : status === "Jatuh tempo" ? "bg-[#fff1dc] text-[#a56c2b]" : kind === "Faktur" ? "bg-[#e3eff8] text-[#3a6b9b]" : "bg-[#f2f4f4] text-[#6d878a]";
  return <span className={`grid shrink-0 place-items-center rounded-xl ${large ? "h-12 w-12" : "h-9 w-9"} ${tone}`}><Icon className={large ? "h-5 w-5" : "h-4 w-4"} /></span>;
}

function StatusPill({ status }: { status: DocumentStatus }) {
  const tone = status === "Lunas" ? "bg-[#e6f6f3] text-[#0f766e]" : status === "Jatuh tempo" ? "bg-[#fff3df] text-[#a56c2b]" : status === "Terkirim" ? "bg-[#e3eff8] text-[#3a6b9b]" : status === "Dibatalkan" ? "bg-[#f3e9e9] text-[#aa6359]" : "bg-[#f2f4f4] text-[#82999b]";
  return <span className={`rounded-full px-2 py-1 text-[8px] font-black ${tone}`}>{status}</span>;
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: typeof Users; label: string; value: string; detail: string; tone: "teal" | "blue" | "violet" | "amber" }) {
  const styles = { teal: "bg-[#e6f6f3] text-[#0f766e]", blue: "bg-[#e3eff8] text-[#3a6b9b]", violet: "bg-[#ece9f8] text-[#7362a6]", amber: "bg-[#fff1dc] text-[#a56c2b]" };
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center justify-between"><span className={`grid h-9 w-9 place-items-center rounded-xl ${styles[tone]}`}><Icon className="h-4 w-4" /></span><TrendingUp className={`h-3.5 w-3.5 ${tone === "teal" ? "text-[#0f9b8e]" : "text-[#9cb3b5]"}`} /></div><p className="mt-4 text-[10px] font-bold text-[#94a8aa]">{label}</p><p className="mt-1 text-2xl font-black tracking-tight text-[#244950]">{value}</p><p className="mt-1 text-[9px] font-bold text-[#0f766e]">{detail}</p></div>;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f4f9f8] p-2"><p className="text-[8px] font-semibold text-[#94a8aa]">{label}</p><p className="mt-1 text-[12px] font-black text-[#365b60]">{value}</p></div>;
}

function ReportRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className={`flex items-center justify-between gap-3 ${strong ? "text-[#244950]" : "text-[#6d878a]"}`}><span className={`text-[10px] ${strong ? "font-black" : "font-semibold"}`}>{label}</span><span className={`text-[10px] ${strong ? "font-black" : "font-bold"}`}>{value}</span></div>;
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">{eyebrow}</p><h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#244950]">{title}</h2><p className="mt-1 max-w-xl text-[10px] leading-5 text-[#94a8aa]">{description}</p></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">{label}</span>{children}</label>;
}

const fieldClass = "w-full rounded-xl border border-[#dcebea] bg-[#fbfdfd] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:border-[#0f766e] focus:ring-2 focus:ring-[#b9ded8]";