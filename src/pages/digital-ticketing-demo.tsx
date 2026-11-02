import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import { Link } from "@/lib/wouter";
import { useState, type FormEvent } from "react";
import "./digital-ticketing-demo.css";
import "./digital-demo-super-app.css";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Download,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  QrCode,
  ReceiptText,
  RotateCcw,
  Search,
  Settings2,
  Ticket,
  Users,
  WalletCards,
  X,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

type DemoView = "overview" | "events" | "tickets" | "orders" | "checkin" | "reports";
type DemoEvent = {
  id: string;
  name: string;
  date: string;
  venue: string;
  sold: string;
  status: string;
  color: string;
};
type DemoTicket = {
  name: string;
  price: string;
  sold: string;
  quota: string;
  progress: string;
  color: string;
};
type DemoOrder = {
  id: string;
  name: string;
  ticket: string;
  amount: string;
  time: string;
  status: string;
};
type DemoSettings = {
  notifications: boolean;
  autoRefresh: boolean;
};

const navigation: Array<{ id: DemoView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "events", label: "Event saya", icon: CalendarDays },
  { id: "tickets", label: "Jenis tiket", icon: Ticket },
  { id: "orders", label: "Pesanan", icon: ReceiptText },
  { id: "checkin", label: "Check-in", icon: QrCode },
  { id: "reports", label: "Laporan", icon: BarChart3 },
];

const initialEvents: DemoEvent[] = [
  { id: "riuh-rona", name: "Riuh Rona Vol. 3", date: "21 Sep 2026", venue: "Lapangan Kerkhof, Garut", sold: "842 / 1.000", status: "Penjualan aktif", color: "bg-[#805538]" },
  { id: "creative-market", name: "Nempo Creative Market", date: "05 Okt 2026", venue: "Sasana Budaya, Bandung", sold: "406 / 600", status: "Penjualan aktif", color: "bg-[#b16a48]" },
  { id: "sunset-sessions", name: "Sunset Sessions", date: "19 Okt 2026", venue: "Pantai Santolo", sold: "Draft", status: "Belum dipublikasikan", color: "bg-[#c9972c]" },
];

const initialTicketTypes: DemoTicket[] = [
  { name: "Presale 1", price: "Rp75.000", sold: "482", quota: "500", progress: "96%", color: "bg-[#805538]" },
  { name: "Regular", price: "Rp100.000", sold: "292", quota: "400", progress: "73%", color: "bg-[#b16a48]" },
  { name: "VIP", price: "Rp175.000", sold: "68", quota: "100", progress: "68%", color: "bg-[#c9972c]" },
];

const initialOrders: DemoOrder[] = [
  { id: "#NR-1048", name: "Aulia Rahman", ticket: "Presale 1 · 2 tiket", amount: "Rp150.000", time: "12 menit lalu", status: "Berhasil" },
  { id: "#NR-1047", name: "Salsa Nuraini", ticket: "VIP · 1 tiket", amount: "Rp175.000", time: "18 menit lalu", status: "Berhasil" },
  { id: "#NR-1046", name: "Dimas Pratama", ticket: "Regular · 3 tiket", amount: "Rp300.000", time: "26 menit lalu", status: "Menunggu pembayaran" },
  { id: "#NR-1045", name: "Nadia Putri", ticket: "Presale 1 · 2 tiket", amount: "Rp150.000", time: "41 menit lalu", status: "Berhasil" },
];

const TICKETING_PREVIEW_PASSWORD = "nemposukses";
const TICKETING_PREVIEW_ACCESS_KEY = "nempo_ticketing_preview_access";

function TicketingPreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="Nempo Ticketing" description="Masukkan password untuk membuka preview ticketing event Nempo." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === TICKETING_PREVIEW_PASSWORD) {
      localStorage.setItem(TICKETING_PREVIEW_ACCESS_KEY, "1");
      onUnlock();
      return;
    }
    setError(true);
  }

  return (
    <main className="nempo-demo-green nempo-ticketing-gate flex min-h-[100dvh] items-center justify-center bg-[#f3eee7] px-5 text-[#382c25]">
      <div className="w-full max-w-md border border-[#dfd2c5] bg-[#fbfaf7] p-6 shadow-[0_20px_60px_rgba(83,53,34,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center bg-[#805538] text-white"><Lock className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9b6240]">Live preview</p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-[#392d27]">Nempo Ticketing</h1>
          </div>
        </div>
        <p className="text-sm leading-6 text-[#7f6d60]">Masukkan password untuk membuka preview ticketing event Nempo.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
           <input
             type="text"
             name="username"
             autoComplete="username"
             tabIndex={-1}
             aria-hidden="true"
             className="hidden"
           />
          <label className={`flex items-center gap-3 border bg-[#fffdfa] px-3.5 py-3 transition-colors ${error ? "border-[#b86755] bg-[#fff8f5]" : "border-[#dfd2c5] focus-within:border-[#9b6240]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#b86755]" : "text-[#a58e7d]"}`} />
            <span className="sr-only">Password live preview ticketing</span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => { setPassword(event.target.value); setError(false); }}
              placeholder="Masukkan password"
              autoComplete="current-password"
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#392d27] outline-none placeholder:text-[#b4a293]"
            />
            <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} className="text-[#a58e7d] hover:text-[#805538]">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </label>
          {error && <p className="text-xs font-semibold text-[#b86755]">Password salah. Coba lagi.</p>}
          <button type="submit" className="w-full bg-[#805538] px-4 py-3 text-xs font-black text-white transition-colors hover:bg-[#68432d]">Masuk ke preview</button>
        </form>
      </div>
    </main>
  );
}

export default function DigitalTicketingDemoPage() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) return <TicketingPreviewGate onUnlock={() => setUnlocked(true)} />;

  return <DigitalTicketingWorkspace />;
}

function DigitalTicketingWorkspace() {
  const [activeView, setActiveView] = useState<DemoView>("overview");
  const [eventList, setEventList] = useState<DemoEvent[]>(initialEvents);
  const [ticketList, setTicketList] = useState<DemoTicket[]>(initialTicketTypes);
  const [orderList, setOrderList] = useState<DemoOrder[]>(initialOrders);
  const [selectedEventId, setSelectedEventId] = useState(initialEvents[0].id);
  const [checkedIn, setCheckedIn] = useState(842);
  const [modal, setModal] = useState<"event" | "ticket" | "scanner" | "settings" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [settings, setSettings] = useState<DemoSettings>({ notifications: true, autoRefresh: true });

  const selectedEvent = eventList.find((event) => event.id === selectedEventId) ?? eventList[0];

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function resetDemo() {
    setEventList(initialEvents);
    setTicketList(initialTicketTypes);
    setOrderList(initialOrders);
    setSelectedEventId(initialEvents[0].id);
    setCheckedIn(842);
    setSettings({ notifications: true, autoRefresh: true });
    setActiveView("overview");
    setModal(null);
    notify("Demo dikembalikan ke data awal.");
  }

  function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newEvent: DemoEvent = {
      id: `event-${Date.now()}`,
      name: String(data.get("name") || "Event baru"),
      date: String(data.get("date") || "25 Nov 2026"),
      venue: String(data.get("venue") || "Lokasi belum diatur"),
      sold: "0 / 500",
      status: "Draft",
      color: "bg-cyan-500",
    };
    setEventList((current) => [...current, newEvent]);
    setSelectedEventId(newEvent.id);
    setActiveView("events");
    setModal(null);
    notify("Event baru berhasil ditambahkan ke demo.");
  }

  function handleCreateTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newTicket: DemoTicket = {
      name: String(data.get("name") || "Tiket baru"),
      price: String(data.get("price") || "Rp100.000"),
      sold: "0",
      quota: String(data.get("quota") || "100"),
      progress: "0%",
      color: "bg-cyan-500",
    };
    setTicketList((current) => [...current, newTicket]);
    setModal(null);
    notify("Jenis tiket baru berhasil ditambahkan.");
  }

  function exportOrders() {
    const csv = [
      ["Order ID", "Pembeli", "Tiket", "Total", "Waktu", "Status"],
      ...orderList.map((order) => [order.id, order.name, order.ticket, order.amount, order.time, order.status]),
    ].map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nempo-ticketing-pesanan.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Data pesanan berhasil diekspor.");
  }

  function selectEvent(eventId: string) {
    setSelectedEventId(eventId);
    setActiveView("overview");
    const event = eventList.find((item) => item.id === eventId);
    if (event) notify(`${event.name} sekarang menjadi event aktif.`);
  }

  return (
    <Layout>
      <SEO
        title="Nempo Ticketing — Nempo Organizer"
        description="Kelola event, tiket, penjualan, dan check-in dengan Nempo Ticketing."
        keywords="demo platform ticketing, ticketing event, check-in QR, dashboard event"
        path="/digital-services/ticketing"
      />

      <main className="nempo-demo-green nempo-ticketing-preview min-h-screen bg-[#f5f0e9]">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-3 md:pb-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-gray-200 py-3">
            <Link href="/digital-services" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 transition-colors hover:text-cyan-600">
              <ArrowLeft className="h-3.5 w-3.5" /> Digi Nempo
            </Link>
             <div className="flex items-center gap-3">
               <Link href="/digital-services/super-app?module=ticketing" className="hidden text-[10px] font-black text-cyan-700 transition-colors hover:text-cyan-800 sm:inline-flex">Business OS</Link>
               <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">
                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live preview
               </span>
             </div>
          </div>

          <section className="ticketing-frame overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#ee6a4d] text-white">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-gray-900">Nempo Ticketing</p>
                  <p className="text-[11px] text-gray-400">Workspace · Nempo Creative</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="relative">
                  <span className="sr-only">Pilih event demo</span>
                  <select
                    value={selectedEventId}
                    onChange={(event) => { setSelectedEventId(event.target.value); notify("Event aktif berhasil diganti."); }}
                    className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-xs font-bold text-gray-600 outline-none transition-colors focus:border-cyan-400"
                  >
                    {eventList.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                </label>
                <button type="button" onClick={() => setModal("settings")} title="Buka pengaturan workspace" className="grid h-9 w-9 place-items-center rounded-full bg-cyan-50 text-xs font-extrabold text-cyan-700 transition-colors hover:bg-cyan-100">NC</button>
                <button type="button" onClick={resetDemo} title="Reset demo" className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[13rem_1fr]">
              <aside className="border-b border-gray-100 bg-gray-50/70 p-3 lg:border-b-0 lg:border-r">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Workspace</p>
                <nav className="grid grid-cols-2 gap-1 lg:grid-cols-1">
                  {navigation.map(({ id, label, icon: Icon }) => {
                    const active = activeView === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveView(id)}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${active ? "bg-white text-cyan-700 shadow-sm" : "text-gray-500 hover:bg-white hover:text-gray-800"}`}
                      >
                        <Icon className="h-4 w-4" /> {label}
                      </button>
                    );
                  })}
                </nav>
                 <div className="mt-4 hidden border-t border-gray-200 px-3 pt-4 lg:block">
                   <button type="button" onClick={() => setModal("settings")} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-800"><Settings2 className="h-4 w-4" /> Pengaturan</button>
                </div>
              </aside>

              <div className="min-w-0 p-4 sm:p-6">
                 {activeView === "overview" && <OverviewPanel event={selectedEvent} ticketTypes={ticketList} checkedIn={checkedIn} onCheckIn={() => { setCheckedIn((count) => count + 1); notify("Check-in demo berhasil dicatat."); }} onShowEvents={() => setActiveView("events")} onSelectEvent={selectEvent} />}
                 {activeView === "events" && <EventsPanel events={eventList} onCreate={() => setModal("event")} onSelectEvent={selectEvent} />}
                 {activeView === "tickets" && <TicketsPanel ticketTypes={ticketList} onCreate={() => setModal("ticket")} />}
                 {activeView === "orders" && <OrdersPanel orders={orderList} onExport={exportOrders} />}
                 {activeView === "checkin" && <CheckInPanel checkedIn={checkedIn} onCheckIn={() => setModal("scanner")} />}
                 {activeView === "reports" && <ReportsPanel ticketTypes={ticketList} onExport={exportOrders} />}
              </div>
            </div>
          </section>

        </div>
      </main>
       {modal === "event" && <CreateEventModal onClose={() => setModal(null)} onSubmit={handleCreateEvent} />}
       {modal === "ticket" && <CreateTicketModal onClose={() => setModal(null)} onSubmit={handleCreateTicket} />}
       {modal === "scanner" && <ScannerModal onClose={() => setModal(null)} onConfirm={() => { setCheckedIn((count) => count + 1); setModal(null); notify("QR tiket valid. Tamu berhasil check-in."); }} />}
       {modal === "settings" && <SettingsModal values={settings} onClose={() => setModal(null)} onSave={(nextSettings) => { setSettings(nextSettings); setModal(null); notify("Pengaturan workspace berhasil disimpan."); }} />}
       {toast && <div role="status" className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2.5 text-xs font-bold text-white shadow-xl">{toast}</div>}
    </Layout>
  );
}

function OverviewPanel({ event, ticketTypes, checkedIn, onCheckIn, onShowEvents, onSelectEvent }: { event: DemoEvent; ticketTypes: DemoTicket[]; checkedIn: number; onCheckIn: () => void; onShowEvents: () => void; onSelectEvent: (eventId: string) => void }) {
  return (
    <>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold text-[#ee6a4d]">Overview event</p>
          <h2 className="mt-1 text-2xl font-extrabold text-gray-900">{event.name}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400"><CalendarDays className="h-3.5 w-3.5" /> {event.date} · {event.venue}</p>
        </div>
        <button type="button" onClick={onCheckIn} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ee6a4d] px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-colors hover:bg-[#dc5c42]">
          <QrCode className="h-3.5 w-3.5" /> Simulasikan check-in
        </button>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon={WalletCards} label="Total penjualan" value="Rp24,8 jt" change="+18,4%" />
        <StatCard icon={Ticket} label="Tiket terjual" value="1.248" change="+12,8%" />
        <StatCard icon={QrCode} label="Sudah check-in" value={checkedIn.toLocaleString("id-ID")} change="68,2%" />
        <StatCard icon={Users} label="Total tamu" value="1.248" change="Kuota 1.500" />
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
        <SalesChart ticketTypes={ticketTypes} />
        <CheckInSummary checkedIn={checkedIn} />
      </div>
      <EventSnapshot events={[event, ...initialEvents.filter((item) => item.id !== event.id)]} onShowEvents={onShowEvents} onSelectEvent={onSelectEvent} />
       <TicketingIntegrationPanel />
    </>
  );
}

function StatCard({ icon: Icon, label, value, change }: { icon: typeof Ticket; label: string; value: string; change: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3.5">
      <div className="flex items-center justify-between gap-2"><p className="truncate text-[10px] font-bold uppercase tracking-[0.06em] text-gray-400">{label}</p><Icon className="h-4 w-4 shrink-0 text-cyan-600" /></div>
      <p className="mt-3 text-lg font-extrabold text-gray-900">{value}</p>
      <p className="mt-1 text-[11px] font-bold text-emerald-600">{change}</p>
    </div>
  );
}

function SalesChart({ ticketTypes = initialTicketTypes }: { ticketTypes?: DemoTicket[] }) {
  return (
    <div className="rounded-2xl border border-gray-100 p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div><h3 className="text-sm font-extrabold text-gray-900">Penjualan tiket</h3><p className="mt-1 text-xs text-gray-400">7 hari terakhir</p></div>
        <BarChart3 className="h-4 w-4 text-cyan-600" />
      </div>
      <div className="mt-5 flex h-40 items-end gap-2 border-b border-gray-100 px-1 sm:gap-3">
         {[36, 54, 44, 67, 56, 78, Math.min(96, 70 + ticketTypes.length * 6)].map((height, index) => (
          <div key={index} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className={`w-full max-w-8 rounded-t-md transition-all group-hover:bg-cyan-500 ${index === 6 ? "bg-[#ee6a4d]" : "bg-cyan-100"}`} style={{ height: `${height}%` }} />
            <span className="text-[10px] text-gray-400">{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckInSummary({ checkedIn }: { checkedIn: number }) {
  const percentage = Math.min(100, Math.round((checkedIn / 1248) * 100));
  return (
    <div className="rounded-2xl border border-gray-100 p-4 sm:p-5">
      <div className="flex items-center justify-between"><h3 className="text-sm font-extrabold text-gray-900">Check-in hari ini</h3><QrCode className="h-4 w-4 text-cyan-600" /></div>
      <div className="mt-5 flex items-center gap-4">
        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border-[10px] border-cyan-100 border-r-cyan-600 border-t-cyan-600">
          <span className="text-xl font-extrabold text-gray-900">{percentage}%</span>
        </div>
        <div className="space-y-3 text-xs">
          <div><p className="text-gray-400">Sudah hadir</p><p className="mt-0.5 font-extrabold text-gray-800">{checkedIn.toLocaleString("id-ID")} tamu</p></div>
          <div><p className="text-gray-400">Belum hadir</p><p className="mt-0.5 font-extrabold text-gray-800">{(1248 - checkedIn).toLocaleString("id-ID")} tamu</p></div>
        </div>
      </div>
    </div>
  );
}

function EventSnapshot({ events, onShowEvents, onSelectEvent }: { events: DemoEvent[]; onShowEvents: () => void; onSelectEvent: (eventId: string) => void }) {
  return (
    <div className="mt-5 rounded-2xl border border-gray-100 p-4 sm:p-5">
      <div className="flex items-center justify-between"><h3 className="text-sm font-extrabold text-gray-900">Event mendatang</h3><button type="button" onClick={onShowEvents} className="text-xs font-bold text-cyan-600 hover:text-cyan-700">Lihat semua</button></div>
      <div className="mt-3 space-y-2">
        {events.slice(0, 2).map((event) => (
          <button key={event.id} type="button" onClick={() => onSelectEvent(event.id)} className="flex w-full items-center gap-3 border-t border-gray-100 py-2.5 text-left transition-colors hover:bg-gray-50">
            <span className={`h-9 w-1.5 rounded-full ${event.color}`} />
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-extrabold text-gray-800">{event.name}</p><p className="mt-1 text-[11px] text-gray-400">{event.date} · {event.venue}</p></div>
            <span className="hidden text-xs font-bold text-gray-600 sm:block">{event.sold}</span>
            <ArrowRight className="h-3.5 w-3.5 text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );
}

function TicketingIntegrationPanel() {
  const integrations = [
    { title: "CRM", description: "Kirim profil pembeli dan riwayat order ke follow-up pelanggan.", href: "/digital-services/crm", icon: Users, label: "Kontak baru" },
    { title: "Marketing Tools", description: "Gunakan data penjualan untuk campaign dan retargeting event.", href: "/digital-services/marketing", icon: BarChart3, label: "Campaign event" },
    { title: "Invoice & Faktur", description: "Teruskan transaksi berhasil ke alur invoice dan rekonsiliasi.", href: "/digital-services/invoice", icon: ReceiptText, label: "12 invoice siap" },
  ];

  return (
    <section className="mt-5 rounded-2xl border border-teal-100 bg-teal-50/60 p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-700">Terhubung ke Business OS</p>
          <h3 className="mt-1 text-base font-extrabold text-gray-900">Event tidak berhenti di penjualan tiket</h3>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">Satukan data pembeli, promosi, dan administrasi transaksi dalam workspace Digi Nempo yang sama.</p>
        </div>
        <Link href="/digital-services/super-app?module=ticketing" className="inline-flex items-center gap-1.5 text-xs font-black text-cyan-700 hover:text-cyan-800">
          Buka Business OS <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {integrations.map(({ title, description, href, icon: Icon, label }) => (
          <Link key={title} href={href} className="ticketing-integration-card rounded-2xl border p-3.5 transition-all">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-cyan-700 shadow-sm"><Icon className="h-4 w-4" /></span>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-700">Terhubung</span>
            </div>
            <p className="mt-3 text-xs font-extrabold text-gray-900">{title}</p>
            <p className="mt-1 min-h-10 text-[11px] leading-4 text-gray-500">{description}</p>
            <div className="mt-3 flex items-center justify-between border-t border-teal-100 pt-2.5">
              <span className="text-[10px] font-black text-cyan-700">{label}</span>
              <ArrowRight className="h-3.5 w-3.5 text-cyan-600" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function EventsPanel({ events, onCreate, onSelectEvent }: { events: DemoEvent[]; onCreate: () => void; onSelectEvent: (eventId: string) => void }) {
  return (
    <div>
       <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="text-xs font-bold text-cyan-600">Workspace event</p><h2 className="mt-1 text-2xl font-extrabold text-gray-900">Event saya</h2><p className="mt-1 text-sm text-gray-400">Buat dan pantau event dari satu workspace.</p></div><button type="button" onClick={onCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-600/15 transition-colors hover:bg-cyan-700"><Plus className="h-3.5 w-3.5" /> Buat event</button></div>
       <div className="mt-5 space-y-3">{events.map((event) => <div key={event.id} className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 transition-shadow hover:shadow-sm sm:flex-row sm:items-center"><button type="button" onClick={() => onSelectEvent(event.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><span className={`h-10 w-1.5 rounded-full ${event.color}`} /><span className="min-w-0 flex-1"><span className="block text-sm font-extrabold text-gray-900">{event.name}</span><span className="mt-1 block text-xs text-gray-400">{event.date} · {event.venue}</span></span></button><div className="flex items-center justify-between gap-3 sm:justify-end"><div className="text-left sm:text-right"><p className="text-xs font-extrabold text-gray-800">{event.sold}</p><p className={`mt-1 text-[11px] font-bold ${event.status === "Draft" ? "text-gray-400" : "text-emerald-600"}`}>{event.status}</p></div><button type="button" onClick={() => onSelectEvent(event.id)} aria-label={`Pilih ${event.name}`} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-cyan-700"><MoreHorizontal className="h-4 w-4" /></button></div></div>)}</div>
    </div>
  );
}

function TicketsPanel({ ticketTypes, onCreate }: { ticketTypes: DemoTicket[]; onCreate: () => void }) {
  return (
    <div>
       <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="text-xs font-bold text-cyan-600">Riuh Rona Vol. 3</p><h2 className="mt-1 text-2xl font-extrabold text-gray-900">Jenis tiket</h2><p className="mt-1 text-sm text-gray-400">Atur harga, kuota, dan progres penjualan.</p></div><button type="button" onClick={onCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-600/15 transition-colors hover:bg-cyan-700"><Plus className="h-3.5 w-3.5" /> Tambah tiket</button></div>
       <div className="mt-5 grid gap-3">{ticketTypes.map((ticket) => <div key={ticket.name} className="rounded-2xl border border-gray-100 p-4 transition-shadow hover:shadow-sm"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><h3 className="text-sm font-extrabold text-gray-900">{ticket.name}</h3><p className="mt-1 text-xs text-gray-400">{ticket.price} per tiket</p></div><span className="text-sm font-extrabold text-gray-800">{ticket.sold} <span className="text-xs font-medium text-gray-400">/ {ticket.quota} terjual</span></span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100"><div className={`h-full rounded-full ${ticket.color}`} style={{ width: ticket.progress }} /></div><p className="mt-2 text-[11px] font-bold text-gray-400">{ticket.progress} kuota terisi</p></div>)}</div>
    </div>
  );
}

function OrdersPanel({ orders, onExport }: { orders: DemoOrder[]; onExport: () => void }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Berhasil" | "Menunggu pembayaran">("Semua");
  const filteredOrders = orders.filter((order) => {
    const matchesQuery = `${order.id} ${order.name} ${order.ticket}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "Semua" || order.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div><p className="text-xs font-bold text-cyan-600">Riuh Rona Vol. 3</p><h2 className="mt-1 text-2xl font-extrabold text-gray-900">Pesanan</h2><p className="mt-1 text-sm text-gray-400">Pantau transaksi tiket yang masuk.</p></div>
        <button type="button" onClick={onExport} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-bold text-gray-600 transition-colors hover:border-cyan-200 hover:text-cyan-700"><Download className="h-3.5 w-3.5" /> Export data</button>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard icon={ReceiptText} label="Total pesanan" value="842" change="+12,8%" />
        <StatCard icon={WalletCards} label="Pendapatan" value="Rp24,8 jt" change="+18,4%" />
        <StatCard icon={Clock3} label="Menunggu" value="12" change="Perlu ditindaklanjuti" />
      </div>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-gray-100">
        <div className="min-w-[620px]">
           <div className="flex flex-col gap-2 border-b border-gray-100 bg-gray-50 p-3 sm:flex-row">
             <label className="relative flex-1">
               <span className="sr-only">Cari pesanan</span>
               <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
               <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari ID, nama pembeli, atau tiket" className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs text-gray-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
             </label>
             <div className="flex gap-1 rounded-xl bg-white p-1">
               {(["Semua", "Berhasil", "Menunggu pembayaran"] as const).map((filter) => (
                 <button key={filter} type="button" onClick={() => setStatusFilter(filter)} className={`rounded-lg px-2.5 py-2 text-[10px] font-bold transition-colors ${statusFilter === filter ? "bg-cyan-50 text-cyan-700" : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"}`}>{filter === "Menunggu pembayaran" ? "Menunggu" : filter}</button>
               ))}
             </div>
           </div>
          <div className="grid grid-cols-[1fr_1.2fr_1fr_.9fr] gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.06em] text-gray-400">
            <span>Order ID</span><span>Pembeli</span><span>Total</span><span>Status</span>
          </div>
           {filteredOrders.map((order) => (
            <div key={order.id} className="grid grid-cols-[1fr_1.2fr_1fr_.9fr] gap-3 border-b border-gray-100 px-4 py-3.5 text-xs last:border-b-0">
              <div><p className="font-extrabold text-gray-800">{order.id}</p><p className="mt-1 text-[10px] text-gray-400">{order.time}</p></div>
              <div><p className="font-bold text-gray-800">{order.name}</p><p className="mt-1 text-[10px] text-gray-400">{order.ticket}</p></div>
              <p className="font-extrabold text-gray-800">{order.amount}</p>
              <span className={`h-fit w-fit rounded-full px-2 py-1 text-[10px] font-bold ${order.status === "Berhasil" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{order.status}</span>
            </div>
          ))}
           {filteredOrders.length === 0 && <div className="px-4 py-8 text-center text-xs text-gray-400">Tidak ada pesanan yang cocok.</div>}
        </div>
      </div>
    </div>
  );
}

function ReportsPanel({ ticketTypes, onExport }: { ticketTypes: DemoTicket[]; onExport: () => void }) {
  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div><p className="text-xs font-bold text-cyan-600">Riuh Rona Vol. 3</p><h2 className="mt-1 text-2xl font-extrabold text-gray-900">Laporan</h2><p className="mt-1 text-sm text-gray-400">Ringkasan performa event dan penjualan tiket.</p></div>
         <button type="button" onClick={onExport} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-600/15 transition-colors hover:bg-cyan-700"><Download className="h-3.5 w-3.5" /> Unduh laporan</button>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
         <SalesChart ticketTypes={ticketTypes} />
        <div className="rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between"><h3 className="text-sm font-extrabold text-gray-900">Komposisi pendapatan</h3><BarChart3 className="h-4 w-4 text-cyan-600" /></div>
          <div className="mt-5 space-y-4">
            {ticketTypes.map((ticket) => (
              <div key={ticket.name}>
                <div className="flex justify-between text-xs"><span className="font-bold text-gray-700">{ticket.name}</span><span className="font-extrabold text-gray-800">{ticket.price}</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"><div className={`h-full rounded-full ${ticket.color}`} style={{ width: ticket.progress }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[["Conversion rate", "7,8%", "+1,2% dari minggu lalu"], ["Rata-rata order", "1,5 tiket", "Stabil"], ["Total refund", "Rp350.000", "2 transaksi"]].map(([label, value, detail]) => (
          <div key={label} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.06em] text-gray-400">{label}</p><p className="mt-3 text-xl font-extrabold text-gray-900">{value}</p><p className="mt-1 text-[11px] font-bold text-gray-500">{detail}</p></div>
        ))}
      </div>
    </div>
  );
}

function CheckInPanel({ checkedIn, onCheckIn }: { checkedIn: number; onCheckIn: () => void }) {
  const [query, setQuery] = useState("");
  const [verifiedGuest, setVerifiedGuest] = useState<string | null>(null);
  const guests = [
    { name: "Aulia Rahman", ticket: "Presale 1 · 2 tiket", code: "NMP-RR3-1048", status: "Belum check-in" },
    { name: "Salsa Nuraini", ticket: "VIP · 1 tiket", code: "NMP-RR3-1047", status: "Sudah check-in" },
    { name: "Nadia Putri", ticket: "Presale 1 · 2 tiket", code: "NMP-RR3-1045", status: "Belum check-in" },
  ];
  const matches = guests.filter((guest) => `${guest.name} ${guest.code}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-bold text-[#ee6a4d]">Pintu masuk event</p><h2 className="mt-1 text-2xl font-extrabold text-gray-900">Check-in tamu</h2><p className="mt-1 text-sm text-gray-400">Scan QR tiket atau cari nama tamu secara manual.</p></div><button type="button" onClick={onCheckIn} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ee6a4d] px-3.5 py-2.5 text-xs font-bold text-white"><QrCode className="h-3.5 w-3.5" /> Simulasi scan QR</button></div>
       <div className="mt-5 grid gap-4 sm:grid-cols-[.9fr_1.1fr]"><div className="grid min-h-52 place-items-center rounded-2xl bg-[#211b45] p-6 text-center text-white"><div><div className="mx-auto grid h-20 w-20 place-items-center border-2 border-dashed border-white/40 text-orange-300"><QrCode className="h-10 w-10" /></div><p className="mt-4 text-sm font-extrabold">Arahkan QR tiket ke scanner</p><p className="mt-1 text-xs text-white/45">Demo scanner siap digunakan</p></div></div><div className="rounded-2xl border border-gray-100 p-5"><p className="text-xs font-bold text-gray-400">Progress check-in</p><p className="mt-2 text-4xl font-extrabold text-gray-900">{checkedIn.toLocaleString("id-ID")} <span className="text-base font-medium text-gray-400">/ 1.248</span></p><div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100"><div className="ticketing-progress-bar h-full rounded-full" style={{ width: `${Math.min(100, (checkedIn / 1248) * 100)}%` }} /></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-emerald-50 p-3"><Check className="h-4 w-4 text-emerald-600" /><p className="mt-2 text-xs font-bold text-emerald-700">Valid</p></div><div className="rounded-xl bg-gray-50 p-3"><Clock3 className="h-4 w-4 text-gray-400" /><p className="mt-2 text-xs font-bold text-gray-600">Real-time</p></div></div></div></div>
       <div className="mt-4 rounded-2xl border border-gray-100 p-4 sm:p-5">
         <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
           <div><p className="text-sm font-extrabold text-gray-900">Cari tamu secara manual</p><p className="mt-1 text-xs text-gray-400">Gunakan nama atau kode tiket untuk backup saat QR sulit dipindai.</p></div>
           <label className="relative sm:w-64"><span className="sr-only">Cari nama atau kode tiket</span><Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nama atau kode tiket" className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-xs text-gray-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" /></label>
         </div>
         <div className="mt-3 space-y-2">
           {matches.map((guest) => (
             <div key={guest.code} className="flex flex-col gap-3 rounded-xl bg-gray-50 p-3 sm:flex-row sm:items-center">
               <div className="min-w-0 flex-1"><p className="truncate text-xs font-extrabold text-gray-800">{guest.name}</p><p className="mt-1 text-[10px] text-gray-400">{guest.ticket} · {guest.code}</p></div>
               <span className={`text-[10px] font-bold ${guest.status === "Sudah check-in" || verifiedGuest === guest.code ? "text-emerald-600" : "text-amber-600"}`}>{verifiedGuest === guest.code ? "Baru check-in" : guest.status}</span>
               <button type="button" disabled={guest.status === "Sudah check-in" || verifiedGuest === guest.code} onClick={() => { setVerifiedGuest(guest.code); onCheckIn(); }} className="rounded-lg bg-cyan-600 px-3 py-2 text-[10px] font-black text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400">{guest.status === "Sudah check-in" || verifiedGuest === guest.code ? "Terverifikasi" : "Check-in"}</button>
             </div>
           ))}
           {matches.length === 0 && <p className="py-3 text-center text-xs text-gray-400">Tamu tidak ditemukan di data demo.</p>}
         </div>
       </div>
    </div>
  );
}

function ModalShell({ title, description, onClose, children }: { title: string; description: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/45 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
          <div><h2 className="text-base font-extrabold text-gray-900">{title}</h2><p className="mt-1 text-xs leading-relaxed text-gray-400">{description}</p></div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, name, placeholder, type = "text", defaultValue }: { label: string; name: string; placeholder: string; type?: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-gray-700">{label}</span>
      <input required name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
    </label>
  );
}

function CreateEventModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <ModalShell title="Buat event baru" description="Coba alur membuat event tanpa menyimpan data ke server." onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4 p-5">
        <FormField label="Nama event" name="name" placeholder="Contoh: Festival Kopi Garut" />
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Tanggal" name="date" type="text" placeholder="25 Nov 2026" />
          <FormField label="Lokasi" name="venue" placeholder="Alun-alun Garut" />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50">Batal</button>
          <button type="submit" className="rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-600/15 hover:bg-cyan-700">Tambah ke demo</button>
        </div>
      </form>
    </ModalShell>
  );
}

function CreateTicketModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <ModalShell title="Tambah jenis tiket" description="Buat tier tiket dan lihat langsung perubahannya di dashboard." onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4 p-5">
        <FormField label="Nama tiket" name="name" placeholder="Contoh: Early Bird" />
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Harga" name="price" placeholder="Rp85.000" />
          <FormField label="Kuota" name="quota" type="number" placeholder="250" />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50">Batal</button>
          <button type="submit" className="rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-600/15 hover:bg-cyan-700">Tambah ke demo</button>
        </div>
      </form>
    </ModalShell>
  );
}

function ScannerModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <ModalShell title="Simulasi scan QR" description="Masukkan kode demo atau langsung validasi untuk mencoba alur check-in." onClose={onClose}>
      <div className="space-y-4 p-5">
        <div className="grid place-items-center rounded-2xl bg-[#211b45] py-6 text-orange-300">
          <div className="grid h-24 w-24 place-items-center border-2 border-dashed border-white/40"><QrCode className="h-12 w-12" /></div>
          <p className="mt-3 text-xs font-bold text-white">Scanner siap digunakan</p>
        </div>
        <label className="block"><span className="text-xs font-bold text-gray-700">Kode tiket</span><input defaultValue="NMP-RR3-1048" className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" /></label>
        <button type="button" onClick={onConfirm} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ee6a4d] px-4 py-3 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-[#dc5c42]"><Check className="h-4 w-4" /> Validasi tiket demo</button>
      </div>
    </ModalShell>
  );
}

function SettingsModal({ values, onClose, onSave }: { values: DemoSettings; onClose: () => void; onSave: (settings: DemoSettings) => void }) {
  const [draft, setDraft] = useState(values);

  return (
    <ModalShell title="Pengaturan workspace" description="Atur perilaku demo dashboard sebelum mencoba alur berikutnya." onClose={onClose}>
      <div className="space-y-3 p-5">
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-gray-100 p-3.5 transition-colors hover:bg-gray-50">
          <span><span className="block text-xs font-extrabold text-gray-800">Notifikasi aktivitas</span><span className="mt-1 block text-[11px] text-gray-400">Tampilkan feedback setelah aksi demo.</span></span>
          <input type="checkbox" checked={draft.notifications} onChange={(event) => setDraft((current) => ({ ...current, notifications: event.target.checked }))} className="h-4 w-4 accent-cyan-600" />
        </label>
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-gray-100 p-3.5 transition-colors hover:bg-gray-50">
          <span><span className="block text-xs font-extrabold text-gray-800">Refresh otomatis</span><span className="mt-1 block text-[11px] text-gray-400">Simulasikan pembaruan data secara berkala.</span></span>
          <input type="checkbox" checked={draft.autoRefresh} onChange={(event) => setDraft((current) => ({ ...current, autoRefresh: event.target.checked }))} className="h-4 w-4 accent-cyan-600" />
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50">Batal</button>
          <button type="button" onClick={() => onSave(draft)} className="rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-600/15 hover:bg-cyan-700">Simpan pengaturan</button>
        </div>
      </div>
    </ModalShell>
  );
}