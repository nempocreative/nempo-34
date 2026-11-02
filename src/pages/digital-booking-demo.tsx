import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import { Link } from "@/lib/wouter";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  LayoutDashboard,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  Search,
  Settings2,
  Sparkles,
  Table2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import "./digital-demo-super-app.css";

type BookingView = "overview" | "calendar" | "reservations" | "resources" | "customers" | "reports";
type ReservationStatus = "Dikonfirmasi" | "Menunggu" | "Selesai" | "Dibatalkan";
type ReservationChannel = "Website" | "WhatsApp" | "Instagram" | "Walk-in";

type Reservation = {
  id: string;
  guest: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  resource: string;
  guests: number;
  channel: ReservationChannel;
  status: ReservationStatus;
  note: string;
};

type Resource = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: "Tersedia" | "Terisi sebagian" | "Maintenance";
  nextSlot: string;
};

const navItems: Array<{ id: BookingView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { id: "calendar", label: "Kalender slot", icon: CalendarDays },
  { id: "reservations", label: "Reservasi", icon: CalendarCheck },
  { id: "resources", label: "Meja & ruang", icon: Table2 },
  { id: "customers", label: "Pelanggan", icon: Users },
  { id: "reports", label: "Laporan", icon: BarChart3 },
];

const dates = [
  { value: "2026-09-13", label: "Hari ini", short: "13 Sep" },
  { value: "2026-09-14", label: "Besok", short: "14 Sep" },
  { value: "2026-09-15", label: "Selasa", short: "15 Sep" },
  { value: "2026-09-16", label: "Rabu", short: "16 Sep" },
];

const slotTimes = ["10:00", "11:30", "13:00", "14:30", "16:00", "18:30", "20:00"];

const initialReservations: Reservation[] = [
  { id: "RSV-1048", guest: "Rina Amelia", phone: "0812 3456 7890", date: "2026-09-13", time: "11:30", service: "Brunch & meja makan", resource: "Meja Indoor 04", guests: 4, channel: "Website", status: "Dikonfirmasi", note: "Minta area dekat jendela." },
  { id: "RSV-1047", guest: "Kedai Tilu", phone: "0821 8822 1001", date: "2026-09-13", time: "13:00", service: "Ruang meeting", resource: "Ruang Sela", guests: 8, channel: "WhatsApp", status: "Dikonfirmasi", note: "Perlu projector." },
  { id: "RSV-1046", guest: "Fajar Nugraha", phone: "0857 2201 9900", date: "2026-09-13", time: "16:00", service: "Meja makan", resource: "Meja Teras 02", guests: 2, channel: "Instagram", status: "Menunggu", note: "Konfirmasi maksimal pukul 14.00." },
  { id: "RSV-1045", guest: "Dimas Pratama", phone: "0813 7411 2288", date: "2026-09-14", time: "18:30", service: "Private dining", resource: "Ruang Panggung", guests: 10, channel: "Website", status: "Dikonfirmasi", note: "Perayaan ulang tahun." },
  { id: "RSV-1044", guest: "Nadia Putri", phone: "0896 4420 7712", date: "2026-09-14", time: "10:00", service: "Meja makan", resource: "Meja Indoor 02", guests: 3, channel: "Walk-in", status: "Selesai", note: "Pelanggan reguler." },
  { id: "RSV-1043", guest: "Salsa Nuraini", phone: "0819 1182 6600", date: "2026-09-15", time: "14:30", service: "Konsultasi venue", resource: "Ruang Sela", guests: 5, channel: "WhatsApp", status: "Menunggu", note: "Membahas acara komunitas." },
];

const resources: Resource[] = [
  { id: "resource-01", name: "Meja Indoor 01–06", type: "Area makan", capacity: 24, status: "Terisi sebagian", nextSlot: "Slot berikutnya 14:30" },
  { id: "resource-02", name: "Meja Teras 01–04", type: "Area outdoor", capacity: 16, status: "Tersedia", nextSlot: "Slot berikutnya 10:00" },
  { id: "resource-03", name: "Ruang Sela", type: "Meeting room", capacity: 12, status: "Terisi sebagian", nextSlot: "Slot berikutnya besok 10:00" },
  { id: "resource-04", name: "Ruang Panggung", type: "Private dining", capacity: 18, status: "Maintenance", nextSlot: "Aktif kembali 17 Sep" },
];

const bookingPreviewPassword = "nemposukses";
const bookingPreviewAccessKey = "nempo_booking_preview_access";

const statusTone: Record<ReservationStatus, string> = {
  Dikonfirmasi: "bg-emerald-50 text-emerald-700",
  Menunggu: "bg-amber-50 text-amber-700",
  Selesai: "bg-slate-100 text-slate-600",
  Dibatalkan: "bg-rose-50 text-rose-700",
};

function BookingPreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="Nempo Booking & Reservasi" description="Masukkan password untuk mencoba kalender slot, reservasi pelanggan, konfirmasi otomatis, dan laporan kapasitas." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === bookingPreviewPassword) {
      localStorage.setItem(bookingPreviewAccessKey, "1");
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <main className="nempo-demo-green nempo-booking-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md rounded-3xl border border-[#dcebea] bg-white p-6 shadow-[0_22px_70px_rgba(24,59,67,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-lg shadow-teal-800/20"><CalendarCheck className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f9b8e]">Live preview</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Nempo Booking & Reservasi</h1></div>
        </div>
        <p className="text-sm leading-6 text-[#648084]">Masukkan password untuk mencoba kalender slot, reservasi pelanggan, konfirmasi otomatis, dan laporan kapasitas.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="text" name="username" autoComplete="username" value="booking-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
          <label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#b75c54] bg-[#fff8f5]" : "border-[#dcebea] focus-within:border-[#0f766e]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da5a2]"}`} />
            <span className="sr-only">Password live preview Booking & Reservasi</span>
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

export default function DigitalBookingDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <BookingPreviewGate onUnlock={() => setUnlocked(true)} />;
  return <BookingWorkspace />;
}

function BookingWorkspace() {
  const [activeView, setActiveView] = useState<BookingView>("overview");
  const [reservations, setReservations] = useState(initialReservations);
  const [selectedDate, setSelectedDate] = useState("2026-09-13");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | ReservationStatus>("Semua");
  const [toast, setToast] = useState<string | null>(null);

  const dayReservations = reservations.filter((reservation) => reservation.date === selectedDate);
  const todayReservations = reservations.filter((reservation) => reservation.date === "2026-09-13");
  const confirmed = todayReservations.filter((reservation) => reservation.status === "Dikonfirmasi").length;
  const waiting = todayReservations.filter((reservation) => reservation.status === "Menunggu").length;
  const filteredReservations = useMemo(() => {
    const term = query.trim().toLowerCase();
    return reservations.filter((reservation) => {
      const matchesQuery = !term || [reservation.id, reservation.guest, reservation.phone, reservation.service, reservation.resource].join(" ").toLowerCase().includes(term);
      return matchesQuery && (statusFilter === "Semua" || reservation.status === statusFilter);
    });
  }, [query, reservations, statusFilter]);
  const pageTitle = navItems.find((item) => item.id === activeView)?.label ?? "Ringkasan";

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function resetDemo() {
    setActiveView("overview");
    setReservations(initialReservations);
    setSelectedDate("2026-09-13");
    setSelectedReservation(null);
    setModalOpen(false);
    setQuery("");
    setStatusFilter("Semua");
    notify("Demo booking dikembalikan ke data awal.");
  }

  function addReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Reservation = {
      id: `RSV-${String(1049 + reservations.length).padStart(4, "0")}`,
      guest: String(data.get("guest") || "Pelanggan baru"),
      phone: String(data.get("phone") || "Nomor belum diisi"),
      date: String(data.get("date") || selectedDate),
      time: String(data.get("time") || "10:00"),
      service: String(data.get("service") || "Meja makan"),
      resource: String(data.get("resource") || "Meja Indoor 01"),
      guests: Number(data.get("guests") || 2),
      channel: String(data.get("channel") || "Website") as ReservationChannel,
      status: "Menunggu",
      note: String(data.get("note") || "Tidak ada catatan."),
    };
    setReservations((current) => [next, ...current]);
    setSelectedDate(next.date);
    setActiveView("reservations");
    setModalOpen(false);
    notify(`${next.id} dibuat dan menunggu konfirmasi.`);
  }

  function updateStatus(id: string, status: ReservationStatus) {
    setReservations((current) => current.map((reservation) => reservation.id === id ? { ...reservation, status } : reservation));
    setSelectedReservation((current) => current?.id === id ? { ...current, status } : current);
    const label = status === "Dikonfirmasi" ? "dikonfirmasi" : status === "Dibatalkan" ? "dibatalkan" : status.toLowerCase();
    notify(`Reservasi ${id} berhasil ${label}.`);
  }

  function exportReservations() {
    const rows = [
      ["ID", "Tamu", "Telepon", "Tanggal", "Jam", "Layanan", "Meja/Ruang", "Jumlah tamu", "Kanal", "Status", "Catatan"],
      ...reservations.map((reservation) => [reservation.id, reservation.guest, reservation.phone, reservation.date, reservation.time, reservation.service, reservation.resource, reservation.guests, reservation.channel, reservation.status, reservation.note]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nempo-booking-reservasi.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Data reservasi berhasil diekspor.");
  }

  return (
    <Layout>
      <SEO title="Booking & Reservasi Demo — Digi Nempo" description="Demo Booking & Reservasi Digi Nempo dengan kalender slot, konfirmasi otomatis, resource, pelanggan, dan laporan." keywords="booking reservasi, kalender slot, reservasi meja, booking venue, Digi Nempo" path="/digital-services/booking" />
      <main className="nempo-demo-green nempo-booking-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1480px] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link href="/digital-services/super-app?module=booking" className="inline-flex items-center gap-2 text-[10px] font-black text-[#648084] transition-colors hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Business Super App</Link>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><span className="h-2 w-2 rounded-full bg-[#1db49f]" /> Demo workspace · data simulasi</div>
          </div>
          <div className="overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_24px_70px_rgba(20,74,77,0.1)]">
            <div className="flex min-h-[790px] flex-col lg:flex-row">
              <aside className="hidden w-[232px] shrink-0 bg-[#123f47] p-4 text-white lg:flex lg:flex-col">
                <div className="flex items-center gap-2.5 border-b border-white/10 px-2 pb-5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0f9b8e]"><CalendarCheck className="h-4 w-4" /></div><div><p className="text-xs font-black">Nempo Booking OS</p><p className="mt-0.5 text-[9px] font-semibold text-white/45">Kopi Nempo · Garut</p></div></div>
                <div className="px-2 pt-6"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#72cfc4]">Reservation operations</p><nav className="mt-3 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black transition-colors ${activeView === id ? "bg-white text-[#0f766e]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}{id === "reservations" && waiting > 0 && <span className="ml-auto rounded-full bg-[#e7a77d] px-1.5 py-0.5 text-[8px] text-white">{waiting}</span>}</button>)}</nav></div>
                <div className="mt-auto rounded-2xl bg-white/10 p-3.5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Super App connected</p><p className="mt-2 text-[11px] font-bold leading-4 text-white">Satu alur untuk slot, reservasi, pelanggan, dan operasional venue.</p><div className="mt-3 flex flex-wrap gap-x-3 gap-y-2"><Link href="/digital-services/super-app" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Business OS <ArrowRight className="h-3 w-3" /></Link><Link href="/digital-services/crm" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">CRM <ArrowRight className="h-3 w-3" /></Link></div></div>
              </aside>
              <section className="min-w-0 flex-1 bg-[#f8fbfb]">
                <div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kopi Nempo · Reservation operations</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{pageTitle}</h1><p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Atur kapasitas dan pengalaman pelanggan tanpa bentrok jadwal.</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setActiveView("calendar")} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><CalendarDays className="h-3.5 w-3.5" /> Lihat slot</button><button type="button" onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Reservasi baru</button><button type="button" onClick={resetDemo} aria-label="Reset demo" className="grid h-9 w-9 place-items-center rounded-xl border border-[#dcebea] bg-white text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><RefreshCcw className="h-3.5 w-3.5" /></button></div></div></div>
                <div className="flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white px-4 py-2 lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b]"}`}><Icon className="h-3 w-3" />{label}</button>)}</div>
                <div className="p-4 sm:p-6">
                  {activeView === "overview" && <BookingOverview reservations={todayReservations} confirmed={confirmed} waiting={waiting} onView={setActiveView} onSelect={setSelectedReservation} onNew={() => setModalOpen(true)} />}
                  {activeView === "calendar" && <CalendarView reservations={reservations} selectedDate={selectedDate} onDate={setSelectedDate} onNew={() => setModalOpen(true)} onSelect={setSelectedReservation} />}
                  {activeView === "reservations" && <ReservationsView reservations={filteredReservations} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onSelect={setSelectedReservation} onStatus={updateStatus} onNew={() => setModalOpen(true)} onExport={exportReservations} />}
                  {activeView === "resources" && <ResourcesView reservations={reservations} />}
                  {activeView === "customers" && <CustomersView reservations={reservations} />}
                  {activeView === "reports" && <ReportsView reservations={reservations} onExport={exportReservations} />}
                </div>
              </section>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]"><span>Data simulasi untuk kebutuhan presentasi customer.</span><span className="hidden items-center gap-1 sm:inline-flex"><Clock3 className="h-3 w-3" /> Update live · 13 Sep 2026, 09:24</span></div>
        </div>
        {modalOpen && <ReservationModal selectedDate={selectedDate} onClose={() => setModalOpen(false)} onSubmit={addReservation} />}
        {selectedReservation && <ReservationDrawer reservation={selectedReservation} onClose={() => setSelectedReservation(null)} onStatus={updateStatus} onNotify={notify} />}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f47] px-4 py-3 text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8bd6cc]" /> {toast}</div>}
      </main>
    </Layout>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone = "teal" }: { icon: typeof CalendarCheck; label: string; value: string; detail: string; tone?: "teal" | "blue" | "amber" | "violet" }) {
  const tones = { teal: "bg-[#e6f6f3] text-[#0f766e]", blue: "bg-[#e6f0ff] text-[#3478c9]", amber: "bg-[#fff1dd] text-[#b97820]", violet: "bg-[#eeeaff] text-[#7260bf]" };
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center justify-between gap-2"><p className="truncate text-[10px] font-black uppercase tracking-[0.06em] text-[#8aa1a3]">{label}</p><span className={`grid h-8 w-8 place-items-center rounded-xl ${tones[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-4 text-xl font-black tracking-tight text-[#183b43]">{value}</p><p className="mt-1 text-[10px] font-bold text-[#7b999a]">{detail}</p></div>;
}

function BookingOverview({ reservations, confirmed, waiting, onView, onSelect, onNew }: { reservations: Reservation[]; confirmed: number; waiting: number; onView: (view: BookingView) => void; onSelect: (reservation: Reservation) => void; onNew: () => void }) {
  const finished = reservations.filter((reservation) => reservation.status === "Selesai").length;
  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard icon={CalendarCheck} label="Reservasi hari ini" value={`${reservations.length}`} detail="Semua kanal masuk" />
      <MetricCard icon={CheckCircle2} label="Sudah dikonfirmasi" value={`${confirmed}`} detail="Siap menerima tamu" tone="blue" />
      <MetricCard icon={AlarmClock} label="Menunggu konfirmasi" value={`${waiting}`} detail="Perlu ditindaklanjuti" tone="amber" />
      <MetricCard icon={Users} label="Tamu selesai" value={`${finished}`} detail="Check-out tercatat" tone="violet" />
    </div>
    <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
      <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Today schedule</p><h2 className="mt-2 text-lg font-black text-[#244950]">Jadwal reservasi hari ini.</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">Satu tampilan untuk melihat waktu, jumlah tamu, dan meja yang harus disiapkan.</p></div><CalendarDays className="h-5 w-5 text-[#0f766e]" /></div><div className="mt-5 space-y-2">{reservations.slice(0, 4).map((reservation) => <button key={reservation.id} type="button" onClick={() => onSelect(reservation)} className="flex w-full items-center gap-3 rounded-xl border border-[#edf3f2] p-3 text-left transition-colors hover:border-[#b9ded8] hover:bg-[#f8fcfb]"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e6f6f3] text-[10px] font-black text-[#0f766e]">{reservation.time}</span><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-black text-[#365b60]">{reservation.guest} <span className="font-semibold text-[#9aadaf]">· {reservation.guests} pax</span></p><p className="mt-1 truncate text-[9px] font-semibold text-[#94a8aa]">{reservation.resource} · {reservation.service}</p></div><span className={`rounded-full px-2 py-1 text-[9px] font-black ${statusTone[reservation.status]}`}>{reservation.status}</span><ChevronRight className="h-3.5 w-3.5 text-[#9eb4b5]" /></button>)}{!reservations.length && <EmptyState text="Belum ada reservasi pada tanggal ini." />}</div><button type="button" onClick={() => onView("reservations")} className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-black text-[#0f766e]">Lihat semua reservasi <ArrowRight className="h-3 w-3" /></button></section>
      <section className="rounded-2xl border border-[#dceae8] bg-[#123f47] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Booking insight</p><h2 className="mt-2 text-lg font-black leading-tight">Slot terisi dengan sehat.</h2></div><Sparkles className="h-5 w-5 text-[#8bd6cc]" /></div><p className="mt-3 text-[10px] leading-5 text-white/60">Kapasitas hari ini terisi 68%. Masih ada ruang untuk menerima reservasi walk-in dan booking baru.</p><div className="mt-5 rounded-xl bg-white/10 p-3"><div className="flex items-center justify-between text-[10px] font-bold"><span className="text-white/55">Kapasitas terpakai</span><span className="text-[#a2e4dc]">68%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-[#8bd6cc]" /></div><p className="mt-2 text-[10px] font-semibold text-white/45">14 dari 21 slot sudah terisi</p></div><button type="button" onClick={() => onView("calendar")} className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-black text-[#a2e4dc]">Atur slot tersedia <ArrowUpRightIcon /></button></section>
    </div>
    <div className="grid gap-3 sm:grid-cols-3"><QuickAction icon={Plus} title="Buat reservasi" detail="Catat booking dari kanal apa pun" onClick={onNew} /><QuickAction icon={CalendarDays} title="Buka kalender slot" detail="Cek kapasitas per jam dan resource" onClick={() => onView("calendar")} /><QuickAction icon={MessageCircle} title="Follow-up pelanggan" detail="Kirim pengingat sebelum kunjungan" onClick={() => onView("customers")} /></div>
    <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Connected flow</p><h2 className="mt-1 text-sm font-black text-[#244950]">Reservasi terhubung dengan modul Digi Nempo</h2></div><span className="rounded-full bg-[#e6f6f3] px-2.5 py-1 text-[9px] font-black text-[#0f766e]">Super App</span></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{[["CRM", "Profil dan riwayat pelanggan"], ["QR Menu", "Booking dari menu digital"], ["Loyalty", "Benefit untuk pelanggan kembali"]].map(([title, detail]) => <div key={title} className="rounded-xl border border-[#edf3f2] p-3"><p className="text-[11px] font-black text-[#365b60]">{title}</p><p className="mt-1 text-[9px] leading-4 text-[#94a8aa]">{detail}</p></div>)}</div></section>
  </div>;
}

function QuickAction({ icon: Icon, title, detail, onClick }: { icon: typeof Plus; title: string; detail: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex items-center gap-3 rounded-2xl border border-[#e3eeed] bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#b9ded8] hover:shadow-[0_10px_24px_rgba(27,78,80,0.06)]"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Icon className="h-4 w-4" /></span><span><span className="block text-[11px] font-black text-[#365b60]">{title}</span><span className="mt-1 block text-[9px] font-semibold text-[#94a8aa]">{detail}</span></span><ChevronRight className="ml-auto h-3.5 w-3.5 text-[#9eb4b5]" /></button>;
}

function CalendarView({ reservations, selectedDate, onDate, onNew, onSelect }: { reservations: Reservation[]; selectedDate: string; onDate: (date: string) => void; onNew: () => void; onSelect: (reservation: Reservation) => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Availability planner</p><h2 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Kalender slot & kapasitas</h2><p className="mt-1 text-xs leading-5 text-[#8aa1a3]">Pilih hari untuk melihat slot terisi, slot tersedia, dan resource yang dipakai.</p></div><button type="button" onClick={onNew} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] px-3.5 py-2.5 text-[10px] font-black text-white"><Plus className="h-3.5 w-3.5" /> Tambah booking</button></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{dates.map((date) => <button key={date.value} type="button" onClick={() => onDate(date.value)} className={`rounded-2xl border p-3 text-left transition-colors ${selectedDate === date.value ? "border-[#82cfc5] bg-[#e6f6f3]" : "border-[#e3eeed] bg-white hover:border-[#b9ded8]"}`}><p className={`text-[10px] font-black ${selectedDate === date.value ? "text-[#0f766e]" : "text-[#8aa1a3]"}`}>{date.label}</p><p className="mt-1 text-sm font-black text-[#365b60]">{date.short}</p><p className="mt-2 text-[9px] font-semibold text-[#94a8aa]">{reservations.filter((reservation) => reservation.date === date.value).length} reservasi</p></button>)}</div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#0f9b8e]">Slot tersedia</p><h3 className="mt-1 text-sm font-black text-[#244950]">{dates.find((date) => date.value === selectedDate)?.label ?? "Jadwal"} · kapasitas venue</h3></div><div className="flex items-center gap-3 text-[9px] font-bold text-[#8aa1a3]"><span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#0f766e]" /> Terisi</span><span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#e6f6f3]" /> Tersedia</span></div></div><div className="mt-4 overflow-x-auto"><div className="min-w-[620px] space-y-2">{slotTimes.map((time) => { const items = reservations.filter((reservation) => reservation.date === selectedDate && reservation.time === time); const isFull = items.length >= 2; return <div key={time} className="grid grid-cols-[4.5rem_1fr] items-stretch gap-3"><div className="flex items-center text-[11px] font-black text-[#648084]">{time}</div><div className={`min-h-16 rounded-xl border p-2 ${isFull ? "border-[#b9ded8] bg-[#e6f6f3]" : "border-dashed border-[#cfe4e1] bg-[#fbfdfd]"}`}>{items.length ? <div className="flex flex-wrap gap-2">{items.map((reservation) => <button type="button" key={reservation.id} onClick={() => onSelect(reservation)} className="flex min-w-[190px] flex-1 items-center gap-2 rounded-lg border border-white bg-white px-3 py-2 text-left shadow-sm hover:border-[#82cfc5]"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#e6f6f3] text-[#0f766e]"><UserRound className="h-3.5 w-3.5" /></span><span className="min-w-0 flex-1"><span className="block truncate text-[10px] font-black text-[#365b60]">{reservation.guest}</span><span className="mt-0.5 block truncate text-[9px] font-semibold text-[#94a8aa]">{reservation.resource} · {reservation.guests} pax</span></span><span className={`rounded-full px-1.5 py-1 text-[8px] font-black ${statusTone[reservation.status]}`}>{reservation.status}</span></button>)}</div> : <button type="button" onClick={onNew} className="flex h-full min-h-12 w-full items-center justify-center gap-1.5 text-[10px] font-black text-[#77a09f] hover:text-[#0f766e]"><Plus className="h-3.5 w-3.5" /> Slot tersedia · tambah booking</button>}</div></div>; })}</div></div></div></div>;
}

function ReservationsView({ reservations, query, setQuery, statusFilter, setStatusFilter, onSelect, onStatus, onNew, onExport }: { reservations: Reservation[]; query: string; setQuery: (value: string) => void; statusFilter: "Semua" | ReservationStatus; setStatusFilter: (value: "Semua" | ReservationStatus) => void; onSelect: (reservation: Reservation) => void; onStatus: (id: string, status: ReservationStatus) => void; onNew: () => void; onExport: () => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Reservation inbox</p><h2 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Semua reservasi</h2><p className="mt-1 text-xs leading-5 text-[#8aa1a3]">Kelola booking dari website, WhatsApp, Instagram, dan walk-in dalam satu daftar.</p></div><div className="flex gap-2"><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] px-3.5 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export</button><button type="button" onClick={onNew} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3.5 py-2.5 text-[10px] font-black text-white"><Plus className="h-3.5 w-3.5" /> Reservasi baru</button></div></div><div className="overflow-hidden rounded-2xl border border-[#e3eeed] bg-white"><div className="flex flex-col justify-between gap-3 border-b border-[#e8f0ef] p-4 sm:flex-row sm:items-center"><div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, ID, meja, atau layanan..." className="w-full rounded-xl border border-[#dce8e7] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#56b8ae]" /></div><div className="flex gap-1.5 overflow-x-auto">{(["Semua", "Menunggu", "Dikonfirmasi", "Selesai", "Dibatalkan"] as const).map((option) => <button key={option} type="button" onClick={() => setStatusFilter(option)} className={`shrink-0 rounded-lg px-2.5 py-2 text-[10px] font-black ${statusFilter === option ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#8aa1a3] hover:bg-[#f2f8f7]"}`}>{option}</button>)}</div></div><div className="divide-y divide-[#edf3f2]">{reservations.map((reservation) => <div key={reservation.id} className="flex flex-col gap-3 p-4 transition-colors hover:bg-[#fbfdfd] sm:flex-row sm:items-center"><button type="button" onClick={() => onSelect(reservation)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><CalendarCheck className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-black text-[#365b60]">{reservation.guest} <span className="font-semibold text-[#9aadaf]">· {reservation.guests} pax</span></span><span className="mt-1 block truncate text-[9px] font-semibold text-[#94a8aa]">{reservation.id} · {reservation.date} {reservation.time} · {reservation.resource}</span></span></button><div className="flex items-center justify-between gap-3 sm:justify-end"><div className="text-left sm:text-right"><p className="text-[10px] font-black text-[#365b60]">{reservation.channel}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{reservation.service}</p></div><span className={`rounded-full px-2 py-1 text-[9px] font-black ${statusTone[reservation.status]}`}>{reservation.status}</span>{reservation.status === "Menunggu" && <button type="button" onClick={() => onStatus(reservation.id, "Dikonfirmasi")} className="rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e]">Konfirmasi</button>}<MoreHorizontal className="h-4 w-4 text-[#9eb4b5]" /></div></div>)}{!reservations.length && <EmptyState text="Tidak ada reservasi yang cocok dengan filter ini." />}</div></div></div>;
}

function ResourcesView({ reservations }: { reservations: Reservation[] }) {
  return <div className="space-y-4"><SectionIntro eyebrow="Capacity management" title="Meja & ruang" description="Pantau kapasitas tiap resource dan jadwal booking berikutnya sebelum menerima tamu baru." /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{resources.map((resource) => { const count = reservations.filter((reservation) => reservation.resource === resource.name && reservation.status !== "Dibatalkan").length; return <div key={resource.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Table2 className="h-5 w-5" /></span><span className={`rounded-full px-2 py-1 text-[9px] font-black ${resource.status === "Tersedia" ? "bg-emerald-50 text-emerald-700" : resource.status === "Maintenance" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{resource.status}</span></div><h3 className="mt-4 text-sm font-black text-[#365b60]">{resource.name}</h3><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{resource.type} · hingga {resource.capacity} pax</p><div className="mt-4 flex items-end justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.08em] text-[#a0b4b5]">Booking aktif</p><p className="mt-1 text-lg font-black text-[#183b43]">{count}</p></div><p className="text-right text-[9px] font-bold text-[#0f766e]">{resource.nextSlot}</p></div></div>; })}</div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#0f9b8e]">Rules & availability</p><h3 className="mt-1 text-sm font-black text-[#244950]">Aturan slot untuk operasional</h3></div><Settings2 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{[["Durasi default", "90 menit per booking"], ["Buffer antar slot", "15 menit untuk reset meja"], ["Batas booking", "Maksimal 30 hari ke depan"]].map(([title, detail]) => <div key={title} className="rounded-xl border border-[#edf3f2] p-3"><p className="text-[10px] font-black text-[#365b60]">{title}</p><p className="mt-1 text-[10px] text-[#94a8aa]">{detail}</p></div>)}</div></div></div>;
}

function CustomersView({ reservations }: { reservations: Reservation[] }) {
  const guests = Array.from(new Map(reservations.map((reservation) => [reservation.phone, reservation])).values());
  return <div className="space-y-4"><SectionIntro eyebrow="Customer relationship" title="Pelanggan reservasi" description="Gunakan riwayat booking untuk memberi pengalaman yang lebih personal dan follow-up yang tepat waktu." /><div className="grid gap-3 sm:grid-cols-3"><MetricCard icon={Users} label="Profil pelanggan" value={`${guests.length}`} detail="Dari seluruh kanal" /><MetricCard icon={CalendarCheck} label="Repeat booking" value="42%" detail="+8,4% bulan ini" tone="blue" /><MetricCard icon={MessageCircle} label="Perlu diingatkan" value="6" detail="Booking 24 jam lagi" tone="amber" /></div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-[#244950]">Pelanggan terbaru</h3><p className="mt-1 text-[10px] text-[#94a8aa]">Data otomatis terhubung ke CRM Nempo.</p></div><UserRound className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{guests.slice(0, 6).map((reservation, index) => <div key={reservation.phone} className="flex items-center gap-3 rounded-xl border border-[#edf3f2] p-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#e6f6f3] text-[10px] font-black text-[#0f766e]">{reservation.guest.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-black text-[#365b60]">{reservation.guest}</p><p className="mt-1 text-[9px] text-[#94a8aa]">{reservation.phone} · {index + 1} booking aktif</p></div><button type="button" className="rounded-lg p-2 text-[#8aa1a3] hover:bg-[#e6f6f3] hover:text-[#0f766e]" aria-label={`Buka profil ${reservation.guest}`}><ChevronRight className="h-3.5 w-3.5" /></button></div>)}</div></div></div>;
}

function ReportsView({ reservations, onExport }: { reservations: Reservation[]; onExport: () => void }) {
  const values = [42, 58, 51, 74, 66, 88, 72];
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Reservation intelligence" title="Laporan booking" description="Baca tren permintaan dan kapasitas untuk menentukan jam operasional, staffing, dan promo." /><button type="button" onClick={onExport} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] px-3.5 py-2.5 text-[10px] font-black text-white"><FileSpreadsheet className="h-3.5 w-3.5" /> Unduh laporan</button></div><div className="grid gap-3 sm:grid-cols-3"><MetricCard icon={CalendarCheck} label="Total booking" value={`${reservations.length + 96}`} detail="+16,8% dari periode lalu" /><MetricCard icon={Users} label="Rata-rata tamu" value="4,2 pax" detail="Per reservasi" tone="blue" /><MetricCard icon={Clock3} label="No-show rate" value="3,4%" detail="-1,2% dari bulan lalu" tone="violet" /></div><div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-[#244950]">Tren reservasi</h3><p className="mt-1 text-[10px] text-[#94a8aa]">7 hari terakhir</p></div><BarChart3 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-l border-[#e5eeee] px-3 sm:gap-4">{values.map((value, index) => <div key={index} className="booking-report-bar flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[9px] font-black text-[#5a7c80]">{value}</span><div className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-[#0f766e] to-[#64c9bd]" style={{ height: `${value}%` }} /><span className="text-[9px] font-bold text-[#9aadaf]">{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][index]}</span></div>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-[#244950]">Kanal booking</h3><p className="mt-1 text-[10px] text-[#94a8aa]">Kontribusi reservasi</p></div><BarChart3 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-5 space-y-4">{[["Website", "46%", "bg-[#0f766e]"], ["WhatsApp", "28%", "bg-[#53b7ac]"], ["Instagram", "16%", "bg-[#9bd8d0]"], ["Walk-in", "10%", "bg-[#ccebe7]"]].map(([label, width, color]) => <div key={label}><div className="flex justify-between text-[10px]"><span className="font-bold text-[#365b60]">{label}</span><span className="font-black text-[#0f766e]">{width}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf3f2]"><div className={`h-full rounded-full ${color}`} style={{ width }} /></div></div>)}</div></section></div></div>;
}

function ReservationModal({ selectedDate, onClose, onSubmit }: { selectedDate: string; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <ModalShell title="Buat reservasi baru" description="Catat booking dari kanal apa pun. Reservasi baru akan masuk sebagai Menunggu." onClose={onClose}><form onSubmit={onSubmit} className="space-y-4 p-5"><div className="grid gap-3 sm:grid-cols-2"><Field label="Nama tamu" name="guest" placeholder="Contoh: Rina Amelia" /><Field label="Nomor WhatsApp" name="phone" placeholder="08xx xxxx xxxx" type="tel" /></div><div className="grid gap-3 sm:grid-cols-2"><Field label="Tanggal" name="date" type="date" defaultValue={selectedDate} /><Field label="Jam" name="time" type="time" defaultValue="10:00" /></div><div className="grid gap-3 sm:grid-cols-2"><SelectField label="Layanan" name="service" options={["Meja makan", "Brunch & meja makan", "Ruang meeting", "Private dining", "Konsultasi venue"]} /><SelectField label="Meja / ruang" name="resource" options={["Meja Indoor 01", "Meja Indoor 02", "Meja Indoor 04", "Meja Teras 02", "Ruang Sela", "Ruang Panggung"]} /></div><div className="grid gap-3 sm:grid-cols-2"><Field label="Jumlah tamu" name="guests" type="number" defaultValue="2" /><SelectField label="Kanal booking" name="channel" options={["Website", "WhatsApp", "Instagram", "Walk-in"]} /></div><label className="block"><span className="text-[10px] font-black text-[#547377]">Catatan</span><textarea name="note" rows={2} placeholder="Permintaan khusus, acara, atau kebutuhan setup..." className="mt-1.5 w-full resize-none rounded-xl border border-[#dce8e7] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none focus:border-[#56b8ae] focus:ring-2 focus:ring-[#d4efeb]" /></label><div className="flex justify-end gap-2 pt-1"><button type="button" onClick={onClose} className="rounded-xl px-3.5 py-2.5 text-xs font-black text-[#789396] hover:bg-[#f2f8f7]">Batal</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-xs font-black text-white hover:bg-[#0b625c]">Simpan reservasi</button></div></form></ModalShell>;
}

function ReservationDrawer({ reservation, onClose, onStatus, onNotify }: { reservation: Reservation; onClose: () => void; onStatus: (id: string, status: ReservationStatus) => void; onNotify: (message: string) => void }) {
  return <div className="fixed inset-0 z-[70] flex items-center justify-end bg-[#123f47]/30 p-3 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div role="dialog" aria-modal="true" aria-labelledby="reservation-detail-title" className="h-full w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0f9b8e]">Detail reservasi</p><h2 id="reservation-detail-title" className="mt-1 text-lg font-black text-[#183b43]">{reservation.id}</h2><p className="mt-1 text-xs font-semibold text-[#82999b]">{reservation.date} · {reservation.time} · {reservation.channel}</p></div><button type="button" onClick={onClose} aria-label="Tutup detail reservasi" className="grid h-8 w-8 place-items-center rounded-full bg-[#f2f8f7] text-[#789396] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-5 rounded-2xl bg-[#f4faf9] p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d9f1ec] text-[#0f766e]"><UserRound className="h-4 w-4" /></span><div><p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#8aa1a3]">Tamu</p><p className="mt-1 text-sm font-black text-[#365b60]">{reservation.guest}</p><p className="mt-0.5 text-[10px] font-semibold text-[#94a8aa]">{reservation.phone}</p></div></div><div className="mt-5 grid grid-cols-2 gap-3"><DetailItem label="Layanan" value={reservation.service} /><DetailItem label="Meja / ruang" value={reservation.resource} /><DetailItem label="Jumlah tamu" value={`${reservation.guests} pax`} /><DetailItem label="Status" value={reservation.status} /></div></div><div className="mt-4 rounded-2xl border border-[#e3eeed] p-4"><p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#8aa1a3]">Catatan pelanggan</p><p className="mt-2 text-xs leading-5 text-[#547377]">{reservation.note}</p></div><div className="mt-5 space-y-2">{reservation.status === "Menunggu" && <button type="button" onClick={() => onStatus(reservation.id, "Dikonfirmasi")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 py-3 text-xs font-black text-white"><Check className="h-4 w-4" /> Konfirmasi reservasi</button>}{reservation.status === "Dikonfirmasi" && <button type="button" onClick={() => onStatus(reservation.id, "Selesai")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6f6f3] px-4 py-3 text-xs font-black text-[#0f766e]"><CheckCircle2 className="h-4 w-4" /> Tandai selesai</button>}{reservation.status !== "Dibatalkan" && reservation.status !== "Selesai" && <button type="button" onClick={() => onStatus(reservation.id, "Dibatalkan")} className="w-full rounded-xl px-4 py-3 text-xs font-black text-[#b75c54] hover:bg-[#fff5f3]">Batalkan reservasi</button>}<button type="button" onClick={() => onNotify(`Pengingat untuk ${reservation.guest} siap dikirim via WhatsApp.`)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce8e7] px-4 py-3 text-xs font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><MessageCircle className="h-4 w-4" /> Kirim pengingat</button></div></div></div>;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[9px] font-black uppercase tracking-[0.08em] text-[#8aa1a3]">{label}</p><p className="mt-1 text-[10px] font-black text-[#365b60]">{value}</p></div>;
}

function ModalShell({ title, description, onClose, children }: { title: string; description: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-[#123f47]/35 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div role="dialog" aria-modal="true" aria-labelledby="booking-modal-title" className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-[#edf3f2] px-5 py-4"><div><h2 id="booking-modal-title" className="text-base font-black text-[#183b43]">{title}</h2><p className="mt-1 text-xs leading-relaxed text-[#8aa1a3]">{description}</p></div><button type="button" onClick={onClose} aria-label="Tutup" className="rounded-full p-1.5 text-[#8aa1a3] hover:bg-[#f2f8f7] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div>{children}</div></div>;
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

function ArrowUpRightIcon() {
  return <ArrowRight className="h-3.5 w-3.5" />;
}