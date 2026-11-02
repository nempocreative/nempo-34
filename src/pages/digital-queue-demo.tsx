import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BellRing,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Gauge,
  LayoutDashboard,
  ListOrdered,
  Lock,
  MapPin,
  Megaphone,
  MonitorPlay,
  MoreHorizontal,
  PauseCircle,
  Plus,
  RefreshCcw,
  Search,
  Settings2,
  Sparkles,
  Ticket,
  UserRound,
  Users,
  Volume2,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@/lib/wouter";
import "./digital-demo-super-app.css";

type QueueView = "overview" | "tickets" | "display" | "counters" | "reports";
type TicketStatus = "Menunggu" | "Dipanggil" | "Dilayani" | "Selesai" | "Dilewati";
type TicketChannel = "Walk-in" | "Online" | "WhatsApp";
type QueueService = "Konsultasi umum" | "Pembayaran" | "Pengambilan pesanan";

type QueueTicket = {
  id: string;
  number: string;
  name: string;
  service: QueueService;
  channel: TicketChannel;
  status: TicketStatus;
  counter: string;
  issuedAt: string;
  calledAt: string;
  waitMinutes: number;
  priority: boolean;
};

type QueueCounter = {
  id: string;
  name: string;
  service: string;
  staff: string;
  status: "Buka" | "Istirahat" | "Tutup";
  currentNumber: string;
  served: number;
};

const navItems: Array<{ id: QueueView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Ringkasan live", icon: LayoutDashboard },
  { id: "tickets", label: "Daftar antrian", icon: ListOrdered },
  { id: "display", label: "Display publik", icon: MonitorPlay },
  { id: "counters", label: "Loket & petugas", icon: Users },
  { id: "reports", label: "Laporan", icon: BarChart3 },
];

const serviceOptions: QueueService[] = ["Konsultasi umum", "Pembayaran", "Pengambilan pesanan"];
const serviceCode: Record<QueueService, string> = {
  "Konsultasi umum": "A",
  Pembayaran: "B",
  "Pengambilan pesanan": "C",
};

const initialTickets: QueueTicket[] = [
  { id: "ticket-01", number: "A-021", name: "Rina Kurnia", service: "Konsultasi umum", channel: "Online", status: "Dipanggil", counter: "Loket 1", issuedAt: "09:01", calledAt: "09:14", waitMinutes: 13, priority: false },
  { id: "ticket-02", number: "A-022", name: "Budi Santoso", service: "Konsultasi umum", channel: "Walk-in", status: "Menunggu", counter: "—", issuedAt: "09:07", calledAt: "—", waitMinutes: 0, priority: false },
  { id: "ticket-03", number: "A-023", name: "Maya Salsabila", service: "Konsultasi umum", channel: "WhatsApp", status: "Menunggu", counter: "—", issuedAt: "09:11", calledAt: "—", waitMinutes: 0, priority: true },
  { id: "ticket-04", number: "B-014", name: "Dimas Pratama", service: "Pembayaran", channel: "Walk-in", status: "Dilayani", counter: "Loket 2", issuedAt: "09:04", calledAt: "09:12", waitMinutes: 8, priority: false },
  { id: "ticket-05", number: "B-015", name: "Agus Suherman", service: "Pembayaran", channel: "Online", status: "Menunggu", counter: "—", issuedAt: "09:15", calledAt: "—", waitMinutes: 0, priority: false },
  { id: "ticket-06", number: "C-009", name: "Nadia Amelia", service: "Pengambilan pesanan", channel: "Walk-in", status: "Selesai", counter: "Loket 3", issuedAt: "08:51", calledAt: "09:02", waitMinutes: 11, priority: false },
  { id: "ticket-07", number: "C-010", name: "Fajar Maulana", service: "Pengambilan pesanan", channel: "WhatsApp", status: "Menunggu", counter: "—", issuedAt: "09:18", calledAt: "—", waitMinutes: 0, priority: false },
  { id: "ticket-08", number: "C-011", name: "Putri Ananda", service: "Pengambilan pesanan", channel: "Walk-in", status: "Dilewati", counter: "Loket 3", issuedAt: "08:57", calledAt: "09:08", waitMinutes: 11, priority: false },
];

const initialCounters: QueueCounter[] = [
  { id: "counter-01", name: "Loket 1", service: "Konsultasi umum", staff: "Nadia Putri", status: "Buka", currentNumber: "A-021", served: 18 },
  { id: "counter-02", name: "Loket 2", service: "Pembayaran", staff: "Rizky Maulana", status: "Buka", currentNumber: "B-014", served: 22 },
  { id: "counter-03", name: "Loket 3", service: "Pengambilan pesanan", staff: "Siti Rahma", status: "Buka", currentNumber: "C-009", served: 27 },
  { id: "counter-04", name: "Loket 4", service: "Semua layanan", staff: "Dewi Anggraini", status: "Istirahat", currentNumber: "—", served: 15 },
];

const QUEUE_PREVIEW_PASSWORD = "nemposukses";
const QUEUE_PREVIEW_ACCESS_KEY = "nempo_queue_preview_access";

function QueuePreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="Sistem Antrian" description="Masukkan password untuk membuka preview nomor antrian, panggilan loket, display publik, dan laporan waktu tunggu." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === QUEUE_PREVIEW_PASSWORD) {
      localStorage.setItem(QUEUE_PREVIEW_ACCESS_KEY, "1");
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <main className="nempo-demo-green nempo-queue-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md border border-[#dcebea] bg-[#fbfdfd] p-6 shadow-[0_22px_70px_rgba(24,59,67,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-lg shadow-teal-800/20"><ListOrdered className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f9b8e]">Live preview</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Nempo Sistem Antrian</h1></div>
        </div>
        <p className="text-sm leading-6 text-[#648084]">Masukkan password untuk membuka preview nomor antrian, panggilan loket, display publik, dan laporan waktu tunggu.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="text" name="username" autoComplete="username" value="queue-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
          <label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#b75c54] bg-[#fff8f5]" : "border-[#dcebea] focus-within:border-[#0f766e]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da5a2]"}`} />
            <span className="sr-only">Password live preview Sistem Antrian</span>
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

export default function DigitalQueueDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <QueuePreviewGate onUnlock={() => setUnlocked(true)} />;
  return <QueueWorkspace />;
}

function QueueWorkspace() {
  const [activeView, setActiveView] = useState<QueueView>("overview");
  const [tickets, setTickets] = useState(initialTickets);
  const [counters, setCounters] = useState(initialCounters);
  const [selectedTicket, setSelectedTicket] = useState<QueueTicket | null>(null);
  const [ticketModal, setTicketModal] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<"Semua layanan" | QueueService>("Semua layanan");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }

  function resetDemo() {
    setActiveView("overview");
    setTickets(initialTickets);
    setCounters(initialCounters);
    setSelectedTicket(null);
    setServiceFilter("Semua layanan");
    setQuery("");
    notify("Demo antrian dikembalikan ke data awal.");
  }

  function callNext(counterId: string) {
    const counter = counters.find((entry) => entry.id === counterId);
    if (!counter || counter.status !== "Buka") {
      notify("Loket belum siap menerima antrian.");
      return;
    }
    const next = tickets
      .filter((ticket) => ticket.status === "Menunggu" && (counter.service === "Semua layanan" || ticket.service === counter.service))
      .sort((first, second) => Number(second.priority) - Number(first.priority) || first.id.localeCompare(second.id))[0];
    if (!next) {
      notify(`${counter.name} tidak memiliki antrian menunggu.`);
      return;
    }
    setTickets((current) => current.map((ticket) => ticket.id === next.id ? { ...ticket, status: "Dipanggil", counter: counter.name, calledAt: "09:22", waitMinutes: 14 } : ticket));
    setCounters((current) => current.map((entry) => entry.id === counterId ? { ...entry, currentNumber: next.number } : entry));
    notify(`${next.number} dipanggil ke ${counter.name}.`);
  }

  function updateTicketStatus(ticketId: string, status: TicketStatus) {
    setTickets((current) => current.map((ticket) => ticket.id === ticketId ? { ...ticket, status } : ticket));
    const ticket = tickets.find((entry) => entry.id === ticketId);
    if (ticket) notify(`${ticket.number} dipindahkan ke status ${status}.`);
    setSelectedTicket((current) => current?.id === ticketId ? { ...current, status } : current);
  }

  function toggleCounter(counterId: string) {
    setCounters((current) => current.map((counter) => counter.id === counterId ? { ...counter, status: counter.status === "Buka" ? "Istirahat" : "Buka" } : counter));
    notify("Status loket diperbarui.");
  }

  function addTicket(ticket: QueueTicket) {
    setTickets((current) => [...current, ticket]);
    setTicketModal(false);
    notify(`${ticket.number} berhasil dibuat untuk ${ticket.name}.`);
  }

  function exportQueue() {
    const rows: Array<Array<string | number>> = [["Nomor", "Nama", "Layanan", "Kanal", "Status", "Loket", "Waktu tunggu"], ...tickets.map((ticket) => [ticket.number, ticket.name, ticket.service, ticket.channel, ticket.status, ticket.counter, ticket.waitMinutes])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nempo-laporan-antrian.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Laporan antrian berhasil diekspor.");
  }

  const waiting = tickets.filter((ticket) => ticket.status === "Menunggu");
  const activeCalls = tickets.filter((ticket) => ticket.status === "Dipanggil" || ticket.status === "Dilayani");
  const completed = tickets.filter((ticket) => ticket.status === "Selesai");
  const avgWait = Math.round(tickets.filter((ticket) => ticket.waitMinutes > 0).reduce((sum, ticket) => sum + ticket.waitMinutes, 0) / Math.max(tickets.filter((ticket) => ticket.waitMinutes > 0).length, 1));
  const filteredTickets = useMemo(() => tickets.filter((ticket) => {
    const term = query.trim().toLowerCase();
    const matchesQuery = !term || [ticket.number, ticket.name, ticket.service, ticket.channel].join(" ").toLowerCase().includes(term);
    return matchesQuery && (serviceFilter === "Semua layanan" || ticket.service === serviceFilter);
  }), [query, serviceFilter, tickets]);
  const pageTitle = navItems.find((item) => item.id === activeView)?.label ?? "Ringkasan live";

  return (
    <Layout>
      <SEO title="Sistem Antrian Demo — Digi Nempo" description="Demo Sistem Antrian Digi Nempo dengan nomor online, panggilan loket, display publik, dan laporan waktu tunggu." keywords="Sistem Antrian, queue management, nomor online, loket, waktu tunggu, Digi Nempo" path="/digital-services/antrian" />
      <main className="nempo-demo-green nempo-queue-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1480px] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link href="/digital-services/super-app?module=antrian" className="inline-flex items-center gap-2 text-[10px] font-black text-[#648084] transition-colors hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Business Super App</Link>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><span className="h-2 w-2 rounded-full bg-[#1db49f]" /> Demo workspace · data simulasi</div>
          </div>
          <div className="overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_24px_70px_rgba(20,74,77,0.1)]">
            <div className="flex min-h-[790px] flex-col lg:flex-row">
              <aside className="hidden w-[232px] shrink-0 bg-[#123f47] p-4 text-white lg:flex lg:flex-col">
                <div className="flex items-center gap-2.5 border-b border-white/10 px-2 pb-5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0f9b8e]"><ListOrdered className="h-4 w-4" /></div><div><p className="text-xs font-black">Nempo Queue OS</p><p className="mt-0.5 text-[9px] font-semibold text-white/45">Kopi Nempo · Garut</p></div></div>
                <div className="px-2 pt-6"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#72cfc4]">Queue operations</p><nav className="mt-3 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black transition-colors ${activeView === id ? "bg-white text-[#0f766e]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}{id === "tickets" && waiting.length > 0 && <span className="ml-auto rounded-full bg-[#e7a77d] px-1.5 py-0.5 text-[8px] text-white">{waiting.length}</span>}</button>)}</nav></div>
                <div className="mt-auto rounded-2xl bg-white/10 p-3.5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Super App connected</p><p className="mt-2 text-[11px] font-bold leading-4 text-white">Satu alur untuk nomor online, layanan loket, dan pengalaman pelanggan.</p><div className="mt-3 flex flex-wrap gap-x-3 gap-y-2"><Link href="/digital-services/super-app" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Business OS <ArrowRight className="h-3 w-3" /></Link><Link href="/digital-services/human-resource" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">People OS <ArrowRight className="h-3 w-3" /></Link></div></div>
              </aside>
              <section className="min-w-0 flex-1 bg-[#f8fbfb]">
                <div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kopi Nempo · Queue operations</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{pageTitle}</h1><p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Buat kunjungan lebih tertib dengan nomor, panggilan, dan status layanan yang terlihat jelas.</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setActiveView("display")} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><MonitorPlay className="h-3.5 w-3.5" /> Display publik</button><button type="button" onClick={() => setTicketModal(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Ambil nomor</button><button type="button" onClick={resetDemo} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><RefreshCcw className="h-3.5 w-3.5" /> Reset</button></div></div></div>
                <div className="flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white px-4 py-2 lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b]"}`}><Icon className="h-3 w-3" />{label}</button>)}</div>
                <div className="p-4 sm:p-6">
                  {activeView === "overview" && <QueueOverview tickets={tickets} counters={counters} waiting={waiting} activeCalls={activeCalls} avgWait={avgWait} onView={setActiveView} onCall={callNext} onTicket={setSelectedTicket} onNotify={notify} />}
                  {activeView === "tickets" && <TicketsView tickets={filteredTickets} query={query} setQuery={setQuery} serviceFilter={serviceFilter} setServiceFilter={setServiceFilter} onAdd={() => setTicketModal(true)} onTicket={setSelectedTicket} onCall={(ticket) => { setSelectedTicket(ticket); updateTicketStatus(ticket.id, "Dipanggil"); }} onExport={exportQueue} />}
                  {activeView === "display" && <PublicDisplay tickets={tickets} counters={counters} onCall={callNext} onNotify={notify} />}
                  {activeView === "counters" && <CountersView counters={counters} onCall={callNext} onToggle={toggleCounter} onNotify={notify} />}
                  {activeView === "reports" && <QueueReports tickets={tickets} counters={counters} avgWait={avgWait} onExport={exportQueue} />}
                </div>
              </section>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]"><span>Data simulasi untuk kebutuhan presentasi customer.</span><span className="hidden items-center gap-1 sm:inline-flex"><Clock3 className="h-3 w-3" /> Update live · 18 Sep 2026, 09:22</span></div>
        </div>
        {ticketModal && <TicketModal tickets={tickets} onClose={() => setTicketModal(false)} onSubmit={addTicket} />}
        {selectedTicket && <TicketDrawer ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onStatus={updateTicketStatus} onNotify={notify} />}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f47] px-4 py-3 text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8bd6cc]" /> {toast}</div>}
      </main>
    </Layout>
  );
}

function QueueOverview({ tickets, counters, waiting, activeCalls, avgWait, onView, onCall, onTicket, onNotify }: { tickets: QueueTicket[]; counters: QueueCounter[]; waiting: QueueTicket[]; activeCalls: QueueTicket[]; avgWait: number; onView: (view: QueueView) => void; onCall: (counterId: string) => void; onTicket: (ticket: QueueTicket) => void; onNotify: (message: string) => void }) {
  const completed = tickets.filter((ticket) => ticket.status === "Selesai").length;
  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard icon={ListOrdered} label="Menunggu sekarang" value={`${waiting.length} nomor`} detail="Dalam antrean layanan" tone="teal" />
      <MetricCard icon={BellRing} label="Sedang dipanggil" value={`${activeCalls.length} nomor`} detail="Di loket aktif" tone="blue" />
      <MetricCard icon={AlarmClock} label="Rata-rata tunggu" value={`${avgWait} menit`} detail="Dari tiket terlayani" tone="amber" />
      <MetricCard icon={CheckCircle2} label="Selesai hari ini" value={`${completed} nomor`} detail="Layanan terselesaikan" tone="violet" />
    </div>
    <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
      <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Now serving</p><h2 className="mt-2 text-lg font-black text-[#244950]">Kondisi antrian saat ini.</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">Panggil nomor berikutnya dari loket aktif dan pantau beban layanan per kategori.</p></div><Gauge className="h-5 w-5 text-[#0f766e]" /></div><div className="mt-5 grid gap-2 sm:grid-cols-3">{counters.slice(0, 3).map((counter) => <div key={counter.id} className="rounded-xl border border-[#edf3f2] p-3"><div className="flex items-center justify-between"><span className="text-[9px] font-black text-[#8aa1a3]">{counter.name}</span><span className={`h-2 w-2 rounded-full ${counter.status === "Buka" ? "bg-[#1db49f]" : "bg-[#e7a77d]"}`} /></div><p className="mt-3 text-xl font-black text-[#0f766e]">{counter.currentNumber}</p><p className="mt-1 truncate text-[9px] font-semibold text-[#94a8aa]">{counter.service}</p><button type="button" disabled={counter.status !== "Buka"} onClick={() => onCall(counter.id)} className="mt-3 w-full rounded-lg bg-[#e6f6f3] px-2 py-2 text-[9px] font-black text-[#0f766e] disabled:cursor-not-allowed disabled:opacity-40">Panggil berikutnya</button></div>)}</div></section>
      <section className="rounded-2xl border border-[#e3eeed] bg-[#123f47] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Queue insight</p><h2 className="mt-2 text-lg font-black leading-tight">Antrian tetap nyaman.</h2></div><Sparkles className="h-5 w-5 text-[#8bd6cc]" /></div><p className="mt-3 text-[10px] leading-5 text-white/60">{waiting.length ? `${waiting.length} pelanggan menunggu. Prioritaskan nomor prioritas agar waktu tunggu tetap terkendali.` : "Tidak ada pelanggan yang menunggu. Semua loket siap menerima nomor baru."}</p><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Prioritas</p><p className="mt-1 text-xl font-black">{waiting.filter((ticket) => ticket.priority).length}</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Loket buka</p><p className="mt-1 text-xl font-black">{counters.filter((counter) => counter.status === "Buka").length}/{counters.length}</p></div></div><button type="button" onClick={() => waiting.length ? onView("tickets") : onNotify("Tidak ada antrian yang perlu ditinjau.")} className="mt-5 flex items-center gap-1.5 text-[10px] font-black text-[#a2e7df]">{waiting.length ? "Tinjau daftar antrian" : "Lihat display publik"} <ArrowRight className="h-3 w-3" /></button></section>
    </div>
    <div className="grid gap-4 lg:grid-cols-3"><QuickAction icon={Ticket} title="Ambil nomor baru" detail="Buat tiket walk-in atau online" onClick={() => onView("tickets")} /><QuickAction icon={MonitorPlay} title="Buka display publik" detail="Tampilkan nomor yang dipanggil" onClick={() => onView("display")} /><QuickAction icon={FileSpreadsheet} title="Lihat laporan" detail="Analisis waktu tunggu dan layanan" onClick={() => onView("reports")} /></div>
    <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Next in line</p><h2 className="mt-1 text-sm font-black text-[#244950]">Nomor berikutnya</h2></div><button type="button" onClick={() => onView("tickets")} className="text-[10px] font-black text-[#0f766e]">Lihat semua</button></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{waiting.slice(0, 3).map((ticket) => <button type="button" key={ticket.id} onClick={() => onTicket(ticket)} className="flex items-center gap-3 rounded-xl border border-[#edf3f2] p-3 text-left hover:border-[#b9ded8]"><span className={`grid h-9 w-9 place-items-center rounded-xl text-[10px] font-black ${ticket.priority ? "bg-[#fff1dd] text-[#a56c2b]" : "bg-[#e6f6f3] text-[#0f766e]"}`}>{ticket.number.split("-")[0]}</span><div className="min-w-0 flex-1"><p className="text-[11px] font-black text-[#365b60]">{ticket.number} · {ticket.name}</p><p className="mt-1 truncate text-[9px] font-semibold text-[#94a8aa]">{ticket.service}</p></div><ChevronRight className="h-3.5 w-3.5 text-[#9eb4b5]" /></button>)}</div></section>
  </div>;
}

function TicketsView({ tickets, query, setQuery, serviceFilter, setServiceFilter, onAdd, onTicket, onCall, onExport }: { tickets: QueueTicket[]; query: string; setQuery: (value: string) => void; serviceFilter: "Semua layanan" | QueueService; setServiceFilter: (value: "Semua layanan" | QueueService) => void; onAdd: () => void; onTicket: (ticket: QueueTicket) => void; onCall: (ticket: QueueTicket) => void; onExport: () => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Ticket management" title="Daftar antrian" description="Kelola tiket dari semua kanal, panggil nomor secara manual, dan buka detail kebutuhan pelanggan." /><div className="flex gap-2"><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export</button><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Ambil nomor</button></div></div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nomor atau nama pelanggan..." className="w-full rounded-xl border border-[#dcebea] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#0f766e]" /></div><div className="flex gap-1.5 overflow-x-auto"><button type="button" onClick={() => setServiceFilter("Semua layanan")} className={`shrink-0 rounded-lg px-2.5 py-2 text-[10px] font-black ${serviceFilter === "Semua layanan" ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#8aa1a3] hover:bg-[#f2f8f7]"}`}>Semua layanan</button>{serviceOptions.map((service) => <button key={service} type="button" onClick={() => setServiceFilter(service)} className={`shrink-0 rounded-lg px-2.5 py-2 text-[10px] font-black ${serviceFilter === service ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#8aa1a3] hover:bg-[#f2f8f7]"}`}>{service}</button>)}</div></div></div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left"><thead><tr className="border-b border-[#edf3f2] text-[9px] font-black uppercase tracking-[0.12em] text-[#94a8aa]"><th className="pb-3">Nomor</th><th className="pb-3">Pelanggan</th><th className="pb-3">Layanan</th><th className="pb-3">Kanal</th><th className="pb-3">Status</th><th className="pb-3">Loket</th><th className="pb-3" /></tr></thead><tbody className="divide-y divide-[#edf3f2]">{tickets.map((ticket) => <tr key={ticket.id}><td className="py-3"><button type="button" onClick={() => onTicket(ticket)} className={`rounded-lg px-2.5 py-1.5 text-[10px] font-black ${ticket.priority ? "bg-[#fff1dd] text-[#a56c2b]" : "bg-[#e6f6f3] text-[#0f766e]"}`}>{ticket.number}</button></td><td className="py-3"><p className="text-[10px] font-black text-[#365b60]">{ticket.name}</p><p className="mt-0.5 text-[9px] text-[#94a8aa]">{ticket.issuedAt} · tunggu {ticket.waitMinutes || "—"} mnt</p></td><td className="py-3 text-[10px] font-semibold text-[#648084]">{ticket.service}</td><td className="py-3 text-[10px] text-[#648084]">{ticket.channel}</td><td className="py-3"><span className={`rounded-full px-2 py-1 text-[8px] font-black ${ticketPill(ticket.status)}`}>{ticket.status}</span></td><td className="py-3 text-[10px] font-semibold text-[#648084]">{ticket.counter}</td><td className="py-3 text-right">{ticket.status === "Menunggu" ? <button type="button" onClick={() => onCall(ticket)} className="rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e]">Panggil</button> : <button type="button" onClick={() => onTicket(ticket)} aria-label={`Buka ${ticket.number}`} className="rounded-lg p-2 text-[#8aa1a3] hover:bg-[#f4f9f8] hover:text-[#0f766e]"><MoreHorizontal className="h-4 w-4" /></button>}</td></tr>)}</tbody></table></div>{!tickets.length && <EmptyState label="Tiket tidak ditemukan." />}</div></div>;
}

function PublicDisplay({ tickets, counters, onCall, onNotify }: { tickets: QueueTicket[]; counters: QueueCounter[]; onCall: (counterId: string) => void; onNotify: (message: string) => void }) {
  const activeCalls = tickets.filter((ticket) => ticket.status === "Dipanggil" || ticket.status === "Dilayani");
  const waiting = tickets.filter((ticket) => ticket.status === "Menunggu");
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Customer-facing screen" title="Display publik" description="Preview layar yang bisa ditempatkan di area tunggu, lengkap dengan nomor dipanggil dan estimasi antrian berikutnya." /><button type="button" onClick={() => onNotify("Mode layar penuh tersedia saat display publik diaktifkan.")} className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><MonitorPlay className="h-3.5 w-3.5" /> Mode layar penuh</button></div><section className="overflow-hidden rounded-[26px] border border-[#0c5f5d] bg-[#0b4e52] text-white shadow-[0_24px_60px_rgba(12,95,93,.22)]"><div className="flex flex-col justify-between gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:px-7"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0f9b8e]"><ListOrdered className="h-5 w-5" /></div><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8bd6cc]">Kopi Nempo</p><h2 className="mt-1 text-lg font-black">Nomor antrian dipanggil</h2></div></div><div className="text-left sm:text-right"><p className="text-[9px] font-semibold text-white/50">Jumat, 18 September 2026</p><p className="mt-1 text-sm font-black">09:22 WIB</p></div></div><div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-7">{counters.slice(0, 3).map((counter) => { const active = activeCalls.find((ticket) => ticket.counter === counter.name); return <div key={counter.id} className="rounded-2xl bg-white/10 p-4 text-center"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">{counter.name}</p><p className="mt-3 text-4xl font-black tracking-tight">{active?.number ?? counter.currentNumber}</p><p className="mt-2 text-[10px] font-semibold text-white/60">{counter.service}</p><button type="button" onClick={() => onCall(counter.id)} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-[9px] font-black text-[#b8eee7] hover:bg-white/20"><Volume2 className="h-3 w-3" /> Panggil berikutnya</button></div>; })}</div><div className="grid gap-4 border-t border-white/10 px-5 py-5 sm:grid-cols-[1fr_auto] sm:px-7"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Berikutnya</p><div className="mt-3 flex flex-wrap gap-2">{waiting.slice(0, 5).map((ticket) => <span key={ticket.id} className={`rounded-lg px-3 py-2 text-[10px] font-black ${ticket.priority ? "bg-[#f2b880] text-[#5a3b22]" : "bg-white/10 text-white"}`}>{ticket.number}</span>)}</div></div><div className="rounded-xl bg-white/10 px-4 py-3 sm:min-w-[170px]"><p className="text-[9px] font-semibold text-white/55">Total menunggu</p><p className="mt-1 text-2xl font-black">{waiting.length} <span className="text-xs font-bold text-white/55">nomor</span></p></div></div></section></div>;
}

function CountersView({ counters, onCall, onToggle, onNotify }: { counters: QueueCounter[]; onCall: (counterId: string) => void; onToggle: (counterId: string) => void; onNotify: (message: string) => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Service desk" title="Loket & petugas" description="Atur loket yang aktif, lihat petugas yang bertugas, dan panggil nomor sesuai layanan yang ditangani." /><button type="button" onClick={() => onNotify("Pengaturan loket dibuka untuk demo.")} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah loket</button></div><div className="grid gap-3 md:grid-cols-2">{counters.map((counter) => <article key={counter.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className={`grid h-11 w-11 place-items-center rounded-xl ${counter.status === "Buka" ? "bg-[#e6f6f3] text-[#0f766e]" : "bg-[#fff1dd] text-[#a56c2b]"}`}><Ticket className="h-5 w-5" /></span><div><p className="text-xs font-black text-[#365b60]">{counter.name}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{counter.service}</p></div></div><span className={`rounded-full px-2 py-1 text-[8px] font-black ${counter.status === "Buka" ? "bg-[#e6f6f3] text-[#0f766e]" : "bg-[#fff1dd] text-[#a56c2b]"}`}>{counter.status}</span></div><div className="mt-5 grid grid-cols-3 gap-2"><MiniMetric label="Petugas" value={counter.staff} /><MiniMetric label="Sedang dipanggil" value={counter.currentNumber} /><MiniMetric label="Selesai" value={`${counter.served} nomor`} /></div><div className="mt-4 flex items-center justify-between border-t border-[#edf3f2] pt-3"><span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#8aa1a3]"><UserRound className="h-3 w-3" /> Shift aktif hari ini</span><div className="flex gap-2"><button type="button" onClick={() => onToggle(counter.id)} className="rounded-lg border border-[#dcebea] px-2.5 py-2 text-[9px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]">{counter.status === "Buka" ? "Istirahatkan" : "Buka loket"}</button><button type="button" disabled={counter.status !== "Buka"} onClick={() => onCall(counter.id)} className="rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e] disabled:opacity-40">Panggil</button></div></div></article>)}</div><div className="rounded-2xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] p-4"><p className="flex items-center gap-2 text-[10px] font-black text-[#08766f]"><Settings2 className="h-3.5 w-3.5" /> Loket terhubung ke layanan</p><p className="mt-1 text-[9px] leading-4 text-[#6d878a]">Tiket akan diarahkan ke loket berdasarkan kategori layanan sehingga petugas tidak perlu memilah antrean secara manual.</p></div></div>;
}

function QueueReports({ tickets, counters, avgWait, onExport }: { tickets: QueueTicket[]; counters: QueueCounter[]; avgWait: number; onExport: () => void }) {
  const bars = [48, 62, 54, 72, 66, 83, 76];
  const completed = tickets.filter((ticket) => ticket.status === "Selesai").length;
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Queue intelligence" title="Laporan antrian" description="Baca beban layanan, waktu tunggu, dan produktivitas loket untuk memperbaiki pengalaman pelanggan." /><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export laporan</button></div><div className="grid gap-3 sm:grid-cols-3"><SmallMetric icon={ListOrdered} label="Total tiket" value={`${tickets.length} nomor`} /><SmallMetric icon={AlarmClock} label="Rata-rata tunggu" value={`${avgWait} menit`} /><SmallMetric icon={CheckCircle2} label="Tingkat selesai" value={`${Math.round((completed / Math.max(tickets.length, 1)) * 100)}%`} /></div><div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Volume antrian</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Simulasi jumlah tiket 7 hari terakhir</p></div><BarChart3 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-l border-[#edf3f2] px-1">{bars.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className={`w-full max-w-[34px] rounded-t-lg ${index === bars.length - 1 ? "bg-[#0f766e]" : "bg-[#a9dcd6]"}`} style={{ height: `${value}%` }} /><span className="text-[9px] font-bold text-[#a2b3b4]">H-{6 - index}</span></div>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Produktivitas loket</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Nomor selesai per loket</p></div><Gauge className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-5 space-y-3">{counters.slice(0, 3).map((counter) => <div key={counter.id}><div className="flex items-center justify-between text-[10px]"><span className="font-bold text-[#648084]">{counter.name}</span><span className="font-black text-[#365b60]">{counter.served} nomor</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#edf3f2]"><div className="h-full rounded-full bg-[#56b8ae]" style={{ width: `${Math.min(counter.served * 3, 100)}%` }} /></div></div>)}</div></section></div><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Ringkasan layanan</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Kanal dan kategori tiket yang masuk hari ini</p></div><FileSpreadsheet className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{serviceOptions.map((service) => { const total = tickets.filter((ticket) => ticket.service === service).length; return <div key={service} className="rounded-xl bg-[#f4fbfa] p-3"><p className="text-[9px] font-semibold text-[#6d878a]">{service}</p><p className="mt-1 text-lg font-black text-[#0f766e]">{total} tiket</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">Hari ini</p></div>; })}</div></section></div>;
}

function TicketModal({ tickets, onClose, onSubmit }: { tickets: QueueTicket[]; onClose: () => void; onSubmit: (ticket: QueueTicket) => void }) {
  const [name, setName] = useState("");
  const [service, setService] = useState<QueueService>("Konsultasi umum");
  const [channel, setChannel] = useState<TicketChannel>("Walk-in");
  const [priority, setPriority] = useState(false);
  return <ModalShell title="Ambil nomor antrian" eyebrow="Ticket management" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); const cleanName = name.trim(); if (!cleanName) return; const prefix = serviceCode[service]; const next = Math.max(0, ...tickets.filter((ticket) => ticket.number.startsWith(`${prefix}-`)).map((ticket) => Number(ticket.number.split("-")[1]))) + 1; onSubmit({ id: `ticket-${Date.now()}`, number: `${prefix}-${String(next).padStart(3, "0")}`, name: cleanName, service, channel, status: "Menunggu", counter: "—", issuedAt: "09:22", calledAt: "—", waitMinutes: 0, priority }); }} className="space-y-4"><Field label="Nama pelanggan"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Intan Permata" className={fieldClass} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Layanan"><select value={service} onChange={(event) => setService(event.target.value as QueueService)} className={fieldClass}>{serviceOptions.map((option) => <option key={option}>{option}</option>)}</select></Field><Field label="Kanal pendaftaran"><select value={channel} onChange={(event) => setChannel(event.target.value as TicketChannel)} className={fieldClass}><option>Walk-in</option><option>Online</option><option>WhatsApp</option></select></Field></div><label className="flex items-center gap-3 rounded-xl border border-[#dcebea] bg-[#fbfdfd] p-3"><input type="checkbox" checked={priority} onChange={(event) => setPriority(event.target.checked)} className="h-4 w-4 accent-[#0f766e]" /><span><span className="block text-[10px] font-black text-[#365b60]">Tandai sebagai prioritas</span><span className="mt-1 block text-[9px] font-semibold text-[#94a8aa]">Nomor prioritas akan dipanggil lebih dahulu.</span></span></label><ModalActions onClose={onClose} submitLabel="Buat nomor antrian" /></form></ModalShell>;
}

function TicketDrawer({ ticket, onClose, onStatus, onNotify }: { ticket: QueueTicket; onClose: () => void; onStatus: (ticketId: string, status: TicketStatus) => void; onNotify: (message: string) => void }) {
  return <div className="fixed inset-0 z-[75] flex justify-end bg-[#123f47]/30 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside role="dialog" aria-modal="true" className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Detail tiket</p><h2 className="mt-2 text-3xl font-black tracking-tight text-[#0f766e]">{ticket.number}</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{ticket.name} · {ticket.service}</p></div><button type="button" onClick={onClose} aria-label="Tutup detail tiket" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-6 grid grid-cols-2 gap-2"><MiniMetric label="Status" value={ticket.status} /><MiniMetric label="Kanal" value={ticket.channel} /><MiniMetric label="Terbit" value={ticket.issuedAt} /><MiniMetric label="Waktu tunggu" value={`${ticket.waitMinutes || "—"} menit`} /></div><div className="mt-5 space-y-3 rounded-2xl bg-[#f4fbfa] p-4"><InfoRow icon={Ticket} label="Layanan" value={ticket.service} /><InfoRow icon={MapPin} label="Loket" value={ticket.counter} /><InfoRow icon={Clock3} label="Dipanggil" value={ticket.calledAt} /><InfoRow icon={BellRing} label="Prioritas" value={ticket.priority ? "Ya" : "Tidak"} /></div><div className="mt-6"><p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6d878a]">Perbarui status</p><div className="mt-2 grid grid-cols-2 gap-2">{(["Dipanggil", "Dilayani", "Selesai", "Dilewati"] as TicketStatus[]).map((status) => <button key={status} type="button" onClick={() => { onStatus(ticket.id, status); onNotify(`${ticket.number} diperbarui.`); }} className={`rounded-xl px-2 py-2.5 text-[9px] font-black ${ticket.status === status ? "bg-[#e6f6f3] text-[#0f766e]" : "border border-[#dcebea] text-[#8aa1a3] hover:border-[#b9ded8]"}`}>{status}</button>)}</div></div><button type="button" onClick={() => onNotify(`Panggilan suara untuk ${ticket.number} dikirim.`)} className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] px-4 py-3 text-[10px] font-black text-white hover:bg-[#0b625c]"><Volume2 className="h-3.5 w-3.5" /> Panggil dengan suara</button></aside></div>;
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

function InfoRow({ icon: Icon, label, value }: { icon: typeof Ticket; label: string; value: string }) {
  return <div className="flex items-center gap-2.5"><Icon className="h-3.5 w-3.5 shrink-0 text-[#0f766e]" /><div className="min-w-0"><p className="text-[8px] font-black uppercase tracking-[0.08em] text-[#94a8aa]">{label}</p><p className="truncate text-[10px] font-bold text-[#365b60]">{value}</p></div></div>;
}

function ticketPill(status: TicketStatus) {
  return status === "Selesai" ? "bg-[#e6f6f3] text-[#0f766e]" : status === "Dipanggil" || status === "Dilayani" ? "bg-[#e3eff8] text-[#3a6b9b]" : status === "Menunggu" ? "bg-[#fff1dd] text-[#a56c2b]" : "bg-[#f3e2df] text-[#aa6359]";
}

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] py-10 text-center text-xs font-semibold text-[#8aa1a3]">{label}</div>;
}

const fieldClass = "w-full rounded-xl border border-[#dcebea] bg-[#fbfdfd] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:border-[#0f766e] focus:ring-2 focus:ring-[#b9ded8]";