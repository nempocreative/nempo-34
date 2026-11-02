import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  ContactRound,
  Download,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Kanban,
  LayoutDashboard,
  ListChecks,
  Lock,
  Mail,
  Megaphone,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@/lib/wouter";
import "./digital-demo-super-app.css";

type CrmView = "overview" | "contacts" | "pipeline" | "activities" | "campaigns" | "reports";
type LeadStatus = "Baru" | "Dihubungi" | "Proposal" | "Menang" | "Tidak lanjut";
type ContactSegment = "Pelanggan aktif" | "Prospek hangat" | "Pelanggan lama" | "Partner";
type ActivityType = "Follow-up" | "Meeting" | "WhatsApp" | "Email";

type Contact = {
  id: string;
  name: string;
  company: string;
  initials: string;
  segment: ContactSegment;
  status: LeadStatus;
  value: number;
  channel: string;
  lastInteraction: string;
  nextFollowUp: string;
  phone: string;
  email: string;
  tags: string[];
  note: string;
  tone: string;
};

type CrmActivity = {
  id: string;
  contactId: string;
  type: ActivityType;
  title: string;
  detail: string;
  time: string;
  due: string;
  completed: boolean;
};

type Campaign = {
  id: string;
  name: string;
  audience: string;
  channel: string;
  sent: number;
  opened: number;
  converted: number;
  status: "Aktif" | "Selesai" | "Draft";
  tone: string;
};

const navItems: Array<{ id: CrmView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { id: "contacts", label: "Kontak", icon: Users },
  { id: "pipeline", label: "Pipeline", icon: Kanban },
  { id: "activities", label: "Aktivitas", icon: ListChecks },
  { id: "campaigns", label: "Campaign", icon: Megaphone },
  { id: "reports", label: "Laporan", icon: BarChart3 },
];

const leadStatuses: LeadStatus[] = ["Baru", "Dihubungi", "Proposal", "Menang", "Tidak lanjut"];
const contactSegments: Array<"Semua" | ContactSegment> = ["Semua", "Pelanggan aktif", "Prospek hangat", "Pelanggan lama", "Partner"];

const initialContacts: Contact[] = [
  {
    id: "contact-01",
    name: "Rina Kurnia",
    company: "Kopi Nempo",
    initials: "RK",
    segment: "Pelanggan aktif",
    status: "Menang",
    value: 18600000,
    channel: "WhatsApp",
    lastInteraction: "Hari ini, 09:24",
    nextFollowUp: "20 Sep 2026",
    phone: "0812 4400 1288",
    email: "rina@kopinempo.id",
    tags: ["F&B", "QR Menu", "Repeat"],
    note: "Tertarik menambah modul CRM untuk program loyalti pelanggan Kopi Nempo.",
    tone: "bg-[#d7efeb] text-[#0f766e]",
  },
  {
    id: "contact-02",
    name: "Dimas Pratama",
    company: "Rasa Rasa Catering",
    initials: "DP",
    segment: "Prospek hangat",
    status: "Proposal",
    value: 12500000,
    channel: "Meeting",
    lastInteraction: "Kemarin, 15:10",
    nextFollowUp: "18 Sep 2026",
    phone: "0813 7712 9044",
    email: "dimas@rasarasa.co",
    tags: ["Catering", "Kasir", "Invoice"],
    note: "Menunggu revisi proposal untuk 3 outlet dan integrasi invoice.",
    tone: "bg-[#dce9f7] text-[#3a6b9b]",
  },
  {
    id: "contact-03",
    name: "Nadia Amelia",
    company: "Sagara Living",
    initials: "NA",
    segment: "Pelanggan aktif",
    status: "Menang",
    value: 9800000,
    channel: "Email",
    lastInteraction: "16 Sep 2026",
    nextFollowUp: "25 Sep 2026",
    phone: "0812 6631 2201",
    email: "nadia@sagaraliving.id",
    tags: ["Hospitality", "Website", "Booking"],
    note: "Website dan booking engine sudah aktif. Jadwalkan review performa bulanan.",
    tone: "bg-[#e8e3f5] text-[#7362a6]",
  },
  {
    id: "contact-04",
    name: "Agus Suherman",
    company: "Garut Adventure",
    initials: "AS",
    segment: "Prospek hangat",
    status: "Dihubungi",
    value: 7200000,
    channel: "Instagram",
    lastInteraction: "15 Sep 2026",
    nextFollowUp: "17 Sep 2026",
    phone: "0821 9055 1707",
    email: "agus@garutadventure.com",
    tags: ["Tour", "Ticketing", "Partner"],
    note: "Minta contoh alur ticketing dan dashboard partner untuk musim liburan.",
    tone: "bg-[#f8e8cf] text-[#a56c2b]",
  },
  {
    id: "contact-05",
    name: "Fajar Maulana",
    company: "Kelana Event",
    initials: "FM",
    segment: "Pelanggan lama",
    status: "Baru",
    value: 5400000,
    channel: "Referral",
    lastInteraction: "14 Sep 2026",
    nextFollowUp: "19 Sep 2026",
    phone: "0819 3302 8111",
    email: "fajar@kelanaevent.id",
    tags: ["Event", "Ticketing"],
    note: "Pelanggan lama kembali dengan kebutuhan event Halloween dan sponsor.",
    tone: "bg-[#f3e2df] text-[#aa6359]",
  },
  {
    id: "contact-06",
    name: "Maya Salsabila",
    company: "Maja Creative",
    initials: "MS",
    segment: "Partner",
    status: "Menang",
    value: 8400000,
    channel: "Meeting",
    lastInteraction: "12 Sep 2026",
    nextFollowUp: "22 Sep 2026",
    phone: "0812 1098 7765",
    email: "maya@majacreative.id",
    tags: ["Agency", "Partner"],
    note: "Partner referral untuk bisnis kreatif dan UMKM di area Garut.",
    tone: "bg-[#e2f0e2] text-[#4d865c]",
  },
  {
    id: "contact-07",
    name: "Beni Hidayat",
    company: "Kedai Pojok",
    initials: "BH",
    segment: "Pelanggan aktif",
    status: "Proposal",
    value: 6300000,
    channel: "WhatsApp",
    lastInteraction: "11 Sep 2026",
    nextFollowUp: "21 Sep 2026",
    phone: "0822 4428 0990",
    email: "beni@kedaipojok.id",
    tags: ["F&B", "Kasir"],
    note: "Membandingkan paket Kasir dan Business Super App untuk dua cabang.",
    tone: "bg-[#d7efeb] text-[#0f766e]",
  },
  {
    id: "contact-08",
    name: "Putri Ananda",
    company: "Arunika Wedding",
    initials: "PA",
    segment: "Pelanggan lama",
    status: "Tidak lanjut",
    value: 2900000,
    channel: "Email",
    lastInteraction: "08 Sep 2026",
    nextFollowUp: "03 Okt 2026",
    phone: "0813 9902 7118",
    email: "putri@arunikawedding.id",
    tags: ["Wedding", "Invitation"],
    note: "Belum menjadi prioritas bulan ini. Simpan untuk follow-up campaign Oktober.",
    tone: "bg-[#e9edf0] text-[#6f8288]",
  },
];

const initialActivities: CrmActivity[] = [
  { id: "activity-01", contactId: "contact-02", type: "Follow-up", title: "Follow-up proposal paket 3 outlet", detail: "Kirim revisi harga dan timeline implementasi.", time: "Hari ini, 10:30", due: "Jatuh tempo hari ini", completed: false },
  { id: "activity-02", contactId: "contact-04", type: "WhatsApp", title: "Kirim demo ticketing", detail: "Bagikan link demo dan contoh dashboard partner.", time: "Hari ini, 13:00", due: "Jatuh tempo hari ini", completed: false },
  { id: "activity-03", contactId: "contact-07", type: "Meeting", title: "Presentasi paket untuk Kedai Pojok", detail: "Meeting online dengan owner dan kepala operasional.", time: "Besok, 09:00", due: "Besok", completed: false },
  { id: "activity-04", contactId: "contact-01", type: "Email", title: "Review loyalty program", detail: "Kirim ringkasan penggunaan CRM dan rekomendasi segmentasi.", time: "20 Sep 2026", due: "20 Sep 2026", completed: false },
  { id: "activity-05", contactId: "contact-03", type: "Follow-up", title: "Review bulanan Sagara Living", detail: "Cek leads dari website dan performa booking engine.", time: "25 Sep 2026", due: "25 Sep 2026", completed: true },
];

const initialCampaigns: Campaign[] = [
  { id: "campaign-01", name: "Reactivation pelanggan lama", audience: "Pelanggan lama · 86 kontak", channel: "WhatsApp", sent: 86, opened: 74, converted: 18, status: "Aktif", tone: "bg-[#d7efeb] text-[#0f766e]" },
  { id: "campaign-02", name: "Paket bisnis akhir tahun", audience: "Prospek hangat · 42 kontak", channel: "Email", sent: 42, opened: 31, converted: 7, status: "Selesai", tone: "bg-[#dce9f7] text-[#3a6b9b]" },
  { id: "campaign-03", name: "Partner referral Garut", audience: "Partner · 18 kontak", channel: "WhatsApp", sent: 0, opened: 0, converted: 0, status: "Draft", tone: "bg-[#e8e3f5] text-[#7362a6]" },
];

const CRM_PREVIEW_PASSWORD = "nemposukses";
const CRM_PREVIEW_ACCESS_KEY = "nempo_crm_preview_access";

const rupiah = (amount: number) => `Rp${Math.round(amount / 1000).toLocaleString("id-ID")}K`;
const fullRupiah = (amount: number) => `Rp${amount.toLocaleString("id-ID")}`;

function CrmPreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="CRM" description="Masukkan password untuk membuka preview CRM dan melihat alur data pelanggan, pipeline, serta follow-up." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === CRM_PREVIEW_PASSWORD) {
      localStorage.setItem(CRM_PREVIEW_ACCESS_KEY, "1");
      onUnlock();
      return;
    }
    setError(true);
  }

  return (
    <main className="nempo-demo-green nempo-crm-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md border border-[#dcebea] bg-[#fbfdfd] p-6 shadow-[0_22px_70px_rgba(24,59,67,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-lg shadow-teal-800/20"><ContactRound className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f9b8e]">Live preview</p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">CRM Nempo</h1>
          </div>
        </div>
        <p className="text-sm leading-6 text-[#648084]">Masukkan password untuk membuka preview CRM dan melihat alur data pelanggan, pipeline, serta follow-up.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="text" name="username" autoComplete="username" value="crm-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
          <label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#b75c54] bg-[#fff8f5]" : "border-[#dcebea] focus-within:border-[#0f766e]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da5a2]"}`} />
            <span className="sr-only">Password live preview CRM</span>
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

export default function DigitalCrmDemoPage() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) return <CrmPreviewGate onUnlock={() => setUnlocked(true)} />;
  return <CrmWorkspace />;
}

function CrmWorkspace() {
  const [activeView, setActiveView] = useState<CrmView>("overview");
  const [contacts, setContacts] = useState(initialContacts);
  const [activities, setActivities] = useState(initialActivities);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState<"Semua" | ContactSegment>("Semua");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  const filteredContacts = useMemo(() => contacts.filter((contact) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || [contact.name, contact.company, contact.email, contact.tags.join(" ")].join(" ").toLowerCase().includes(needle);
    return matchesQuery && (segment === "Semua" || contact.segment === segment);
  }), [contacts, query, segment]);

  function updateStatus(contactId: string, status: LeadStatus) {
    setContacts((current) => current.map((contact) => contact.id === contactId ? { ...contact, status } : contact));
    setSelectedContact((current) => current?.id === contactId ? { ...current, status } : current);
    notify(`Status kontak diperbarui ke ${status}.`);
  }

  function addContact(contact: Contact) {
    setContacts((current) => [contact, ...current]);
    setAddContactOpen(false);
    setActiveView("contacts");
    notify(`${contact.name} ditambahkan ke CRM.`);
  }

  function addActivity(activity: CrmActivity) {
    setActivities((current) => [activity, ...current]);
    setActivityOpen(false);
    notify("Aktivitas follow-up berhasil dibuat.");
  }

  function toggleActivity(activityId: string) {
    setActivities((current) => current.map((activity) => activity.id === activityId ? { ...activity, completed: !activity.completed } : activity));
    notify("Status aktivitas diperbarui.");
  }

  function exportContacts() {
    const rows = [["Nama", "Perusahaan", "Segmen", "Status", "Nilai", "Channel"], ...contacts.map((contact) => [contact.name, contact.company, contact.segment, contact.status, String(contact.value), contact.channel])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = "nempo-crm-kontak.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    notify("Data kontak berhasil diekspor.");
  }

  const activeContact = selectedContact ? contacts.find((contact) => contact.id === selectedContact.id) ?? selectedContact : null;
  const activeActivities = activeContact ? activities.filter((activity) => activity.contactId === activeContact.id) : [];

  return (
    <Layout>
      <SEO title="CRM Demo — Digi Nempo" description="Preview CRM Digi Nempo untuk mengelola pelanggan, pipeline, aktivitas, campaign, dan laporan." keywords="CRM, customer relationship management, Digi Nempo, Garut" path="/digital-services/crm" />
      <main className="nempo-demo-green nempo-crm-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1480px] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link href="/digital-services" className="inline-flex items-center gap-2 text-[10px] font-black text-[#648084] transition-colors hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Digi Nempo</Link>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><span className="h-2 w-2 rounded-full bg-[#1db49f]" /> Demo workspace · data simulasi</div>
          </div>
          <div className="overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_24px_70px_rgba(20,74,77,0.1)]">
            <div className="flex min-h-[760px] flex-col lg:flex-row">
              <aside className="hidden w-[226px] shrink-0 bg-[#123f47] p-4 text-white lg:flex lg:flex-col">
                <div className="flex items-center gap-2.5 border-b border-white/10 px-2 pb-5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0f9b8e]"><ContactRound className="h-4 w-4" /></div>
                  <div><p className="text-xs font-black">Nempo CRM</p><p className="mt-0.5 text-[9px] font-semibold text-white/45">Kopi Nempo · Garut</p></div>
                </div>
                <div className="px-2 pt-6"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#72cfc4]">Workspace</p><nav className="mt-3 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black transition-colors ${activeView === id ? "bg-white text-[#0f766e]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}{id === "activities" && <span className="ml-auto rounded-full bg-[#e7a77d] px-1.5 py-0.5 text-[8px] text-[#fff]">{activities.filter((activity) => !activity.completed).length}</span>}</button>)}</nav></div>
                <div className="mt-auto rounded-2xl bg-white/10 p-3.5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">CRM terhubung</p><p className="mt-2 text-[11px] font-bold leading-4 text-white">Satu data pelanggan untuk tim yang lebih responsif.</p><button type="button" onClick={() => notify("Pengaturan integrasi akan tersedia di paket Business Super App.")} className="mt-3 inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Lihat integrasi <ArrowRight className="h-3 w-3" /></button></div>
              </aside>
              <section className="min-w-0 flex-1 bg-[#f8fbfb]">
                <div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kopi Nempo · CRM workspace</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{navItems.find((item) => item.id === activeView)?.label}</h1><p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Jaga hubungan, rapikan follow-up, dan ubah percakapan menjadi pertumbuhan.</p></div>
                    <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setActivityOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><CalendarClock className="h-3.5 w-3.5" /> Follow-up</button><button type="button" onClick={() => setAddContactOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Kontak baru</button></div>
                  </div>
                </div>
                <div className="flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white px-4 py-2 lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b]"}`}><Icon className="h-3 w-3" />{label}</button>)}</div>
                <div className="p-4 sm:p-6">
                  {activeView === "overview" && <OverviewView contacts={contacts} activities={activities} campaigns={campaigns} onView={setActiveView} onContact={setSelectedContact} onNotify={notify} />}
                  {activeView === "contacts" && <ContactsView contacts={filteredContacts} query={query} setQuery={setQuery} segment={segment} setSegment={setSegment} onAdd={() => setAddContactOpen(true)} onExport={exportContacts} onContact={setSelectedContact} onStatus={updateStatus} />}
                  {activeView === "pipeline" && <PipelineView contacts={contacts} onContact={setSelectedContact} onAdvance={(contact) => { const index = leadStatuses.indexOf(contact.status); if (index < leadStatuses.length - 2) updateStatus(contact.id, leadStatuses[index + 1]); else notify("Lead ini sudah berada di tahap akhir."); }} onAdd={() => setAddContactOpen(true)} />}
                  {activeView === "activities" && <ActivitiesView activities={activities} contacts={contacts} onToggle={toggleActivity} onAdd={() => setActivityOpen(true)} onContact={(id) => setSelectedContact(contacts.find((contact) => contact.id === id) ?? null)} />}
                  {activeView === "campaigns" && <CampaignsView campaigns={campaigns} onToggle={(id) => { setCampaigns((current) => current.map((campaign) => campaign.id === id ? { ...campaign, status: campaign.status === "Aktif" ? "Selesai" : "Aktif" } : campaign)); notify("Status campaign diperbarui."); }} onNotify={notify} />}
                  {activeView === "reports" && <ReportsView contacts={contacts} campaigns={campaigns} onExport={exportContacts} />}
                </div>
              </section>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]"><span>Data simulasi untuk kebutuhan presentasi customer.</span><span className="hidden items-center gap-1 sm:inline-flex"><Clock3 className="h-3 w-3" /> Terakhir diperbarui beberapa detik lalu</span></div>
        </div>
        {addContactOpen && <AddContactModal onClose={() => setAddContactOpen(false)} onSubmit={addContact} />}
        {activityOpen && <AddActivityModal contacts={contacts} defaultContactId={activeContact?.id} onClose={() => setActivityOpen(false)} onSubmit={addActivity} />}
        {activeContact && <ContactDrawer contact={activeContact} activities={activeActivities} onClose={() => setSelectedContact(null)} onStatus={(status) => updateStatus(activeContact.id, status)} onAddActivity={() => setActivityOpen(true)} onNotify={notify} />}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f47] px-4 py-3 text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8bd6cc]" /> {toast}</div>}
      </main>
    </Layout>
  );
}

function OverviewView({ contacts, activities, campaigns, onView, onContact, onNotify }: { contacts: Contact[]; activities: CrmActivity[]; campaigns: Campaign[]; onView: (view: CrmView) => void; onContact: (contact: Contact) => void; onNotify: (message: string) => void }) {
  const pipelineValue = contacts.filter((contact) => contact.status !== "Tidak lanjut").reduce((sum, contact) => sum + contact.value, 0);
  const openActivities = activities.filter((activity) => !activity.completed);
  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={Users} label="Total kontak" value={contacts.length.toLocaleString("id-ID")} detail="+18,4% bulan ini" tone="teal" /><MetricCard icon={Target} label="Pipeline aktif" value={fullRupiah(pipelineValue)} detail="8 peluang terbuka" tone="blue" /><MetricCard icon={TrendingUp} label="Win rate" value="42,8%" detail="+6,2% dari bulan lalu" tone="violet" /><MetricCard icon={CalendarClock} label="Follow-up hari ini" value={String(openActivities.filter((activity) => activity.due.includes("hari ini")).length).padStart(2, "0")} detail="2 perlu diselesaikan" tone="amber" /></div>
    <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Prioritas hari ini</p><h2 className="mt-2 text-lg font-black text-[#244950]">Jangan biarkan percakapan berhenti.</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">Tiga aktivitas terdekat untuk menjaga peluang tetap bergerak.</p></div><button type="button" onClick={() => onView("activities")} className="rounded-lg p-2 text-[#0f766e] hover:bg-[#e6f6f3]"><ArrowRight className="h-4 w-4" /></button></div><div className="mt-5 space-y-2">{openActivities.slice(0, 3).map((activity) => { const contact = contacts.find((item) => item.id === activity.contactId); return <button key={activity.id} type="button" onClick={() => contact && onContact(contact)} className="flex w-full items-center gap-3 rounded-xl border border-[#edf3f2] p-3 text-left transition-colors hover:border-[#b9ded8] hover:bg-[#fbfefe]"><ActivityIcon type={activity.type} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="truncate text-[10px] font-black text-[#365b60]">{activity.title}</p><span className="rounded-full bg-[#fff3df] px-2 py-1 text-[8px] font-black text-[#a56c2b]">{activity.due}</span></div><p className="mt-1 truncate text-[9px] font-semibold text-[#8aa1a3]">{contact?.name} · {contact?.company}</p></div><ChevronRight className="h-3.5 w-3.5 text-[#9eb4b5]" /></button>; })}</div></section>
      <section className="rounded-2xl border border-[#e3eeed] bg-[#123f47] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">CRM insight</p><h2 className="mt-2 text-lg font-black leading-tight">Pelanggan aktif punya ruang tumbuh.</h2></div><Sparkles className="h-5 w-5 text-[#8bd6cc]" /></div><p className="mt-3 text-[10px] leading-5 text-white/60">18 kontak aktif belum menerima follow-up dalam 14 hari terakhir. Buat campaign kecil untuk menjaga mereka tetap dekat.</p><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Pelanggan aktif</p><p className="mt-1 text-xl font-black">3.240</p><p className="mt-1 text-[9px] font-bold text-[#8bd6cc]">+12,8%</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Repeat order</p><p className="mt-1 text-xl font-black">68%</p><p className="mt-1 text-[9px] font-bold text-[#8bd6cc]">+8,4%</p></div></div><button type="button" onClick={() => onView("campaigns")} className="mt-5 flex items-center gap-1.5 text-[10px] font-black text-[#a2e7df]">Buka campaign pelanggan <ArrowRight className="h-3 w-3" /></button></section>
    </div>
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Pipeline penjualan</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Nilai peluang berdasarkan tahap</p></div><button type="button" onClick={() => onView("pipeline")} className="text-[10px] font-black text-[#0f766e]">Lihat pipeline</button></div><div className="mt-5 space-y-3">{leadStatuses.slice(0, 4).map((status, index) => { const value = contacts.filter((contact) => contact.status === status).reduce((sum, contact) => sum + contact.value, 0); const count = contacts.filter((contact) => contact.status === status).length; return <div key={status}><div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-[#6d878a]"><span>{status}</span><span>{count} kontak · {rupiah(value)}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#edf3f2]"><div className={`h-full rounded-full ${index === 0 ? "bg-[#8bd6cc]" : index === 1 ? "bg-[#55bdb1]" : index === 2 ? "bg-[#0f9b8e]" : "bg-[#0f766e]"}`} style={{ width: `${Math.max(8, Math.min(100, (value / 20000000) * 100))}%` }} /></div></div>; })}</div></section>
      <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Campaign terakhir</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Pantau engagement pelanggan</p></div><button type="button" onClick={() => onNotify("Ringkasan campaign siap digunakan untuk presentasi.")} className="rounded-lg p-2 text-[#0f766e] hover:bg-[#e6f6f3]"><MoreHorizontal className="h-4 w-4" /></button></div><div className="mt-4 space-y-3">{campaigns.map((campaign) => <div key={campaign.id} className="flex items-center gap-3"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${campaign.tone}`}><Megaphone className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{campaign.name}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{campaign.sent ? `${campaign.opened}% open rate · ${campaign.converted} konversi` : "Belum dikirim"}</p></div><StatusPill label={campaign.status} /></div>)}</div></section>
    </div>
  </div>;
}

function ContactsView({ contacts, query, setQuery, segment, setSegment, onAdd, onExport, onContact, onStatus }: { contacts: Contact[]; query: string; setQuery: (value: string) => void; segment: "Semua" | ContactSegment; setSegment: (value: "Semua" | ContactSegment) => void; onAdd: () => void; onExport: () => void; onContact: (contact: Contact) => void; onStatus: (id: string, status: LeadStatus) => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><SectionIntro eyebrow="Database pelanggan" title="Semua kontak" description="Satu sumber data untuk memahami pelanggan dan menindaklanjuti peluang." /></div><div className="flex gap-2"><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export</button><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><UserPlus className="h-3.5 w-3.5" /> Tambah kontak</button></div></div><div className="flex flex-col gap-2 rounded-2xl border border-[#e3eeed] bg-white p-3 sm:flex-row"><label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-[#f4f9f8] px-3 py-2.5"><Search className="h-4 w-4 text-[#8aa1a3]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, perusahaan, email, atau tag..." className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#a2b3b4]" /></label><label className="flex items-center gap-2 rounded-xl border border-[#e3eeed] px-3 py-2.5 text-[10px] font-black text-[#648084]"><Filter className="h-3.5 w-3.5 text-[#0f766e]" /><select value={segment} onChange={(event) => setSegment(event.target.value as "Semua" | ContactSegment)} className="bg-transparent outline-none">{contactSegments.map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="overflow-hidden rounded-2xl border border-[#e3eeed] bg-white"><div className="hidden grid-cols-[1.4fr_1fr_.85fr_.8fr_.8fr_24px] gap-3 border-b border-[#edf3f2] px-4 py-3 text-[9px] font-black uppercase tracking-[0.12em] text-[#9aadae] md:grid"><span>Kontak</span><span>Segmen</span><span>Nilai</span><span>Status</span><span>Interaksi</span><span /></div><div className="divide-y divide-[#edf3f2]">{contacts.length ? contacts.map((contact) => <div key={contact.id} className="grid gap-3 px-4 py-3.5 transition-colors hover:bg-[#fbfefe] md:grid-cols-[1.4fr_1fr_.85fr_.8fr_.8fr_24px] md:items-center"><button type="button" onClick={() => onContact(contact)} className="flex min-w-0 items-center gap-3 text-left"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[10px] font-black ${contact.tone}`}>{contact.initials}</span><span className="min-w-0"><strong className="block truncate text-[11px] font-black text-[#365b60]">{contact.name}</strong><span className="mt-1 block truncate text-[9px] font-semibold text-[#94a8aa]">{contact.company}</span></span></button><span className="flex items-center justify-between gap-2 text-[10px] font-semibold text-[#6d878a] md:block"><span className="md:hidden">Segmen · </span>{contact.segment}</span><span className="text-[10px] font-black text-[#365b60]">{fullRupiah(contact.value)}</span><label className="relative"><select aria-label={`Status ${contact.name}`} value={contact.status} onChange={(event) => onStatus(contact.id, event.target.value as LeadStatus)} className="w-full appearance-none rounded-lg border border-[#e3eeed] bg-white px-2 py-1.5 pr-6 text-[9px] font-black text-[#0f766e] outline-none focus:border-[#0f766e]"><option>{leadStatuses[0]}</option>{leadStatuses.slice(1).map((status) => <option key={status}>{status}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#0f766e]" /></label><span className="text-[9px] font-semibold text-[#94a8aa]">{contact.lastInteraction}</span><button type="button" onClick={() => onContact(contact)} aria-label={`Buka detail ${contact.name}`} className="hidden place-items-center rounded-lg p-1.5 text-[#94a8aa] hover:bg-[#e6f6f3] hover:text-[#0f766e] md:grid"><ChevronRight className="h-4 w-4" /></button></div>) : <div className="p-10 text-center"><Search className="mx-auto h-6 w-6 text-[#b3c5c5]" /><p className="mt-3 text-xs font-black text-[#365b60]">Kontak tidak ditemukan</p><p className="mt-1 text-[10px] text-[#94a8aa]">Coba kata kunci atau segmen lain.</p></div>}</div></div></div>;
}

function PipelineView({ contacts, onContact, onAdvance, onAdd }: { contacts: Contact[]; onContact: (contact: Contact) => void; onAdvance: (contact: Contact) => void; onAdd: () => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Sales pipeline" title="Peluang yang bergerak" description="Lihat posisi setiap prospek dan bantu tim menentukan langkah berikutnya." /><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah peluang</button></div><div className="grid gap-3 overflow-x-auto pb-2 xl:grid-cols-5">{leadStatuses.map((status) => { const column = contacts.filter((contact) => contact.status === status); const total = column.reduce((sum, contact) => sum + contact.value, 0); return <section key={status} className="min-w-[240px] rounded-2xl border border-[#e3eeed] bg-[#f3f8f7] p-3"><div className="flex items-center justify-between"><div><h2 className="text-[11px] font-black text-[#365b60]">{status}</h2><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{column.length} kontak · {rupiah(total)}</p></div><span className={`grid h-7 w-7 place-items-center rounded-lg text-[10px] font-black ${status === "Menang" ? "bg-[#d7efeb] text-[#0f766e]" : status === "Tidak lanjut" ? "bg-[#e9edf0] text-[#6f8288]" : "bg-white text-[#8aa1a3]"}`}>{column.length}</span></div><div className="mt-3 space-y-2">{column.map((contact) => <article key={contact.id} className="rounded-xl border border-[#e3eeed] bg-white p-3 shadow-sm"><button type="button" onClick={() => onContact(contact)} className="flex w-full items-start gap-2.5 text-left"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[9px] font-black ${contact.tone}`}>{contact.initials}</span><span className="min-w-0"><strong className="block truncate text-[10px] font-black text-[#365b60]">{contact.name}</strong><span className="mt-1 block truncate text-[9px] font-semibold text-[#94a8aa]">{contact.company}</span></span></button><div className="mt-3 flex items-center justify-between border-t border-[#edf3f2] pt-2"><span className="text-[10px] font-black text-[#0f766e]">{fullRupiah(contact.value)}</span>{status !== "Menang" && status !== "Tidak lanjut" ? <button type="button" onClick={() => onAdvance(contact)} className="inline-flex items-center gap-1 text-[9px] font-black text-[#0f766e]">Lanjut <ArrowRight className="h-3 w-3" /></button> : <span className="text-[9px] font-semibold text-[#a2b3b4]">{contact.nextFollowUp}</span>}</div></article>)}</div>{!column.length && <p className="rounded-xl border border-dashed border-[#cfe1df] px-3 py-5 text-center text-[9px] font-semibold text-[#9aadae]">Belum ada kontak</p>}</section>; })}</div></div>;
}

function ActivitiesView({ activities, contacts, onToggle, onAdd, onContact }: { activities: CrmActivity[]; contacts: Contact[]; onToggle: (id: string) => void; onAdd: () => void; onContact: (id: string) => void }) {
  const pending = activities.filter((activity) => !activity.completed);
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Follow-up & aktivitas" title="Agenda tim" description="Semua janji, pesan, dan langkah berikutnya tercatat di satu tempat." /><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Aktivitas baru</button></div><div className="grid gap-4 lg:grid-cols-[1.4fr_.6fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Aktivitas mendatang</h2><p className="mt-1 text-[10px] text-[#94a8aa]">{pending.length} tugas belum selesai</p></div><button type="button" onClick={onAdd} className="rounded-lg p-2 text-[#0f766e] hover:bg-[#e6f6f3]"><CalendarDays className="h-4 w-4" /></button></div><div className="mt-4 divide-y divide-[#edf3f2]">{activities.map((activity) => { const contact = contacts.find((item) => item.id === activity.contactId); return <div key={activity.id} className={`flex items-start gap-3 py-3 first:pt-0 last:pb-0 ${activity.completed ? "opacity-55" : ""}`}><button type="button" onClick={() => onToggle(activity.id)} aria-label={activity.completed ? "Tandai belum selesai" : "Tandai selesai"} className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${activity.completed ? "border-[#0f766e] bg-[#0f766e] text-white" : "border-[#b9ded8] text-transparent hover:bg-[#e6f6f3]"}`}><Check className="h-3 w-3" /></button><ActivityIcon type={activity.type} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => onContact(activity.contactId)} className={`text-left text-[10px] font-black ${activity.completed ? "text-[#8aa1a3] line-through" : "text-[#365b60]"}`}>{activity.title}</button><span className="rounded-full bg-[#f4f9f8] px-2 py-1 text-[8px] font-black text-[#6d878a]">{activity.type}</span></div><p className="mt-1 text-[9px] leading-4 text-[#94a8aa]">{contact?.name} · {contact?.company} · {activity.detail}</p></div><span className="shrink-0 text-right text-[9px] font-bold text-[#94a8aa]">{activity.time}</span></div>; })}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-[#e6f6f3] p-5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#0f766e]">Ritme follow-up</p><h2 className="mt-2 text-lg font-black leading-tight text-[#244950]">Konsisten lebih penting daripada ramai.</h2><p className="mt-3 text-[10px] leading-5 text-[#5d7b7d]">Tim dengan agenda yang jelas lebih mudah menjaga konteks setiap percakapan dan mengurangi peluang yang terlewat.</p><div className="mt-6 rounded-xl bg-white p-3"><div className="flex items-center justify-between text-[10px] font-black text-[#365b60]"><span>Penyelesaian minggu ini</span><span className="text-[#0f766e]">76%</span></div><div className="mt-2 h-2 rounded-full bg-[#d4efeb]"><div className="h-full w-[76%] rounded-full bg-[#0f766e]" /></div></div></section></div></div>;
}

function CampaignsView({ campaigns, onToggle, onNotify }: { campaigns: Campaign[]; onToggle: (id: string) => void; onNotify: (message: string) => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Marketing yang terhubung" title="Campaign pelanggan" description="Buat pesan yang relevan berdasarkan segmen dan riwayat interaksi." /><button type="button" onClick={() => onNotify("Campaign baru siap dibuat dari template segmentasi.")} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Campaign baru</button></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{campaigns.map((campaign) => { const rate = campaign.sent ? Math.round((campaign.opened / campaign.sent) * 100) : 0; return <article key={campaign.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl ${campaign.tone}`}><Megaphone className="h-4 w-4" /></span><StatusPill label={campaign.status} /><button type="button" onClick={() => onNotify("Menu campaign dibuka.")} aria-label="Menu campaign" className="text-[#9aadae]"><MoreHorizontal className="h-4 w-4" /></button></div><h2 className="mt-4 text-sm font-black text-[#365b60]">{campaign.name}</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{campaign.audience}</p><div className="mt-5 grid grid-cols-3 gap-2"><MiniStat label="Terkirim" value={campaign.sent ? campaign.sent.toLocaleString("id-ID") : "—"} /><MiniStat label="Open rate" value={campaign.sent ? `${rate}%` : "—"} /><MiniStat label="Konversi" value={campaign.converted ? String(campaign.converted) : "—"} /></div><div className="mt-5 flex items-center justify-between border-t border-[#edf3f2] pt-3"><span className="flex items-center gap-1.5 text-[9px] font-bold text-[#8aa1a3]"><MessageCircle className="h-3.5 w-3.5 text-[#0f766e]" /> {campaign.channel}</span><button type="button" onClick={() => onToggle(campaign.id)} className="text-[9px] font-black text-[#0f766e]">{campaign.status === "Aktif" ? "Tandai selesai" : campaign.status === "Selesai" ? "Aktifkan lagi" : "Mulai campaign"}</button></div></article>; })}</div></div>;
}

function ReportsView({ contacts, campaigns, onExport }: { contacts: Contact[]; campaigns: Campaign[]; onExport: () => void }) {
  const values = [58, 64, 52, 76, 69, 88, 82];
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Analitik CRM" title="Laporan hubungan pelanggan" description="Baca tren kontak, nilai pipeline, dan efektivitas campaign dalam satu ringkasan." /><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export data</button></div><div className="grid gap-3 sm:grid-cols-3"><MetricCard icon={CircleDollarSign} label="Nilai pelanggan" value="Rp53,2 jt" detail="+14,6% vs bulan lalu" tone="teal" /><MetricCard icon={TrendingUp} label="Konversi prospek" value="42,8%" detail="+6,2% vs bulan lalu" tone="blue" /><MetricCard icon={Mail} label="Campaign conversion" value="18,1%" detail="+3,8% vs campaign lalu" tone="violet" /></div><div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Kontak & peluang</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Performa 7 minggu terakhir</p></div><span className="rounded-lg bg-[#e6f6f3] px-2.5 py-1.5 text-[9px] font-black text-[#0f766e]">+18,4%</span></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-[#edf3f2] px-1">{values.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className={`w-full max-w-[34px] rounded-t-lg ${index === values.length - 1 ? "bg-[#0f766e]" : "bg-[#a9dcd6]"}`} style={{ height: `${value}%` }} /><span className="text-[9px] font-bold text-[#a2b3b4]">M{index + 1}</span></div>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Segmentasi kontak</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Distribusi database saat ini</p></div><Users className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-5 space-y-4">{contactSegments.slice(1).map((item, index) => { const count = contacts.filter((contact) => contact.segment === item).length; return <div key={item}><div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-[#6d878a]"><span>{item}</span><span>{count} kontak</span></div><div className="h-2 rounded-full bg-[#edf3f2]"><div className={`h-full rounded-full ${["bg-[#0f766e]", "bg-[#55bdb1]", "bg-[#8bd6cc]", "bg-[#b9ded8]"][index]}`} style={{ width: `${Math.max(10, (count / contacts.length) * 100)}%` }} /></div></div>; })}</div></section></div><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Ringkasan campaign</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Kinerja pesan yang sudah dijalankan</p></div><FileText className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{campaigns.map((campaign) => <div key={campaign.id} className="rounded-xl bg-[#f4f9f8] p-3"><p className="truncate text-[10px] font-black text-[#365b60]">{campaign.name}</p><div className="mt-3 flex items-end justify-between"><span className="text-xl font-black text-[#0f766e]">{campaign.converted || "—"}</span><span className="text-[9px] font-bold text-[#8aa1a3]">konversi</span></div></div>)}</div></section></div>;
}

function ContactDrawer({ contact, activities, onClose, onStatus, onAddActivity, onNotify }: { contact: Contact; activities: CrmActivity[]; onClose: () => void; onStatus: (status: LeadStatus) => void; onAddActivity: () => void; onNotify: (message: string) => void }) {
  return <div className="fixed inset-0 z-[70] bg-[#183b43]/35 backdrop-blur-sm" onMouseDown={onClose}><aside role="dialog" aria-modal="true" aria-label={`Detail ${contact.name}`} onMouseDown={(event) => event.stopPropagation()} className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-[#e3eeed] p-5"><div className="flex items-center gap-3"><span className={`grid h-12 w-12 place-items-center rounded-full text-sm font-black ${contact.tone}`}>{contact.initials}</span><div><p className="text-lg font-black text-[#244950]">{contact.name}</p><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{contact.company}</p></div></div><button type="button" onClick={onClose} aria-label="Tutup detail kontak" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="flex-1 overflow-y-auto p-5"><div className="flex flex-wrap gap-1.5">{contact.tags.map((tag) => <span key={tag} className="rounded-full bg-[#e6f6f3] px-2.5 py-1 text-[9px] font-black text-[#0f766e]">{tag}</span>)}</div><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-[#f4f9f8] p-3"><p className="text-[9px] font-bold text-[#94a8aa]">Nilai pelanggan</p><p className="mt-1 text-sm font-black text-[#365b60]">{fullRupiah(contact.value)}</p></div><div className="rounded-xl bg-[#f4f9f8] p-3"><p className="text-[9px] font-bold text-[#94a8aa]">Channel terakhir</p><p className="mt-1 text-sm font-black text-[#365b60]">{contact.channel}</p></div></div><div className="mt-5"><label className="block text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">Tahap hubungan</label><div className="mt-2 flex flex-wrap gap-1.5">{leadStatuses.map((status) => <button key={status} type="button" onClick={() => onStatus(status)} className={`rounded-lg px-2.5 py-2 text-[9px] font-black transition-colors ${contact.status === status ? "bg-[#0f766e] text-white" : "bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"}`}>{status}</button>)}</div></div><div className="mt-5 rounded-xl border border-[#e3eeed] p-3"><p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">Kontak</p><div className="mt-3 space-y-2 text-[10px] font-semibold text-[#648084]"><span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-[#0f766e]" /> {contact.phone}</span><span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-[#0f766e]" /> {contact.email}</span><span className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-[#0f766e]" /> Follow-up {contact.nextFollowUp}</span></div></div><div className="mt-5"><div className="flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">Catatan</p><button type="button" onClick={() => onNotify("Catatan kontak siap diedit.")} className="text-[9px] font-black text-[#0f766e]">Edit</button></div><p className="mt-2 rounded-xl bg-[#f4f9f8] p-3 text-[10px] leading-5 text-[#648084]">{contact.note}</p></div><div className="mt-5"><div className="flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">Aktivitas terakhir</p><button type="button" onClick={onAddActivity} className="text-[9px] font-black text-[#0f766e]">Tambah</button></div><div className="mt-3 space-y-3">{activities.length ? activities.map((activity) => <div key={activity.id} className="flex gap-2.5"><ActivityIcon type={activity.type} /><div><p className="text-[10px] font-black text-[#365b60]">{activity.title}</p><p className="mt-1 text-[9px] text-[#94a8aa]">{activity.time}</p></div></div>) : <p className="rounded-xl bg-[#f4f9f8] p-3 text-[10px] text-[#94a8aa]">Belum ada aktivitas tercatat.</p>}</div></div></div><div className="border-t border-[#e3eeed] p-4"><button type="button" onClick={onAddActivity} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] py-3 text-[10px] font-black text-white hover:bg-[#0b625c]"><CalendarClock className="h-3.5 w-3.5" /> Jadwalkan follow-up</button></div></aside></div>;
}

function AddContactModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (contact: Contact) => void }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [segment, setSegment] = useState<ContactSegment>("Prospek hangat");
  const [channel, setChannel] = useState("WhatsApp");
  const [value, setValue] = useState("5000000");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const cleanName = name.trim(); if (!cleanName || !company.trim()) return; onSubmit({ id: `contact-${Date.now()}`, name: cleanName, company: company.trim(), initials: cleanName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase(), segment, status: "Baru", value: Number(value) || 0, channel, lastInteraction: "Baru saja", nextFollowUp: "Atur jadwal", phone: phone.trim() || "Belum diisi", email: email.trim() || "Belum diisi", tags: [segment === "Partner" ? "Partner" : "Prospek"], note: "Kontak baru yang siap dilengkapi dengan catatan dan aktivitas.", tone: "bg-[#d7efeb] text-[#0f766e]" }); }
  return <ModalShell title="Tambah kontak baru" eyebrow="Database CRM" onClose={onClose}><form onSubmit={submit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama lengkap"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Sinta Prameswari" className={fieldClass} /></Field><Field label="Perusahaan / bisnis"><input required value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Contoh: Kedai Pagi" className={fieldClass} /></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Segmen"><select value={segment} onChange={(event) => setSegment(event.target.value as ContactSegment)} className={fieldClass}>{contactSegments.slice(1).map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Channel pertama"><select value={channel} onChange={(event) => setChannel(event.target.value)} className={fieldClass}><option>WhatsApp</option><option>Meeting</option><option>Email</option><option>Instagram</option><option>Referral</option></select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Estimasi nilai"><input type="number" min="0" value={value} onChange={(event) => setValue(event.target.value)} className={fieldClass} /></Field><Field label="Nomor WhatsApp"><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0812..." className={fieldClass} /></Field></div><Field label="Email"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@bisnis.id" className={fieldClass} /></Field><ModalActions onClose={onClose} submitLabel="Simpan kontak" /></form></ModalShell>;
}

function AddActivityModal({ contacts, defaultContactId, onClose, onSubmit }: { contacts: Contact[]; defaultContactId?: string; onClose: () => void; onSubmit: (activity: CrmActivity) => void }) {
  const [contactId, setContactId] = useState(defaultContactId ?? contacts[0]?.id ?? "");
  const [type, setType] = useState<ActivityType>("Follow-up");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [time, setTime] = useState("Besok, 09:00");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!title.trim() || !contactId) return; onSubmit({ id: `activity-${Date.now()}`, contactId, type, title: title.trim(), detail: detail.trim() || "Aktivitas baru untuk menjaga hubungan dengan pelanggan.", time, due: time.toLowerCase().includes("hari ini") ? "Jatuh tempo hari ini" : time, completed: false }); }
  return <ModalShell title="Jadwalkan aktivitas" eyebrow="Follow-up CRM" onClose={onClose}><form onSubmit={submit} className="space-y-4"><Field label="Kontak"><select value={contactId} onChange={(event) => setContactId(event.target.value)} className={fieldClass}>{contacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.name} · {contact.company}</option>)}</select></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Jenis aktivitas"><select value={type} onChange={(event) => setType(event.target.value as ActivityType)} className={fieldClass}><option>Follow-up</option><option>Meeting</option><option>WhatsApp</option><option>Email</option></select></Field><Field label="Waktu"><select value={time} onChange={(event) => setTime(event.target.value)} className={fieldClass}><option>Hari ini, 16:00</option><option>Besok, 09:00</option><option>Besok, 13:00</option><option>20 Sep 2026</option><option>25 Sep 2026</option></select></Field></div><Field label="Judul"><input required autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Contoh: Kirim proposal revisi" className={fieldClass} /></Field><Field label="Catatan"><textarea value={detail} onChange={(event) => setDetail(event.target.value)} rows={3} placeholder="Apa yang perlu dilakukan?" className={`${fieldClass} resize-none`} /></Field><ModalActions onClose={onClose} submitLabel="Simpan aktivitas" /></form></ModalShell>;
}

function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[75] flex items-end justify-center bg-[#183b43]/40 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-t-[26px] bg-white p-5 shadow-2xl sm:rounded-[26px] sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0f766e]">{eyebrow}</p><h2 className="mt-2 text-xl font-black text-[#183b43]">{title}</h2></div><button type="button" onClick={onClose} aria-label="Tutup modal" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-6">{children}</div></div></div>;
}

function ModalActions({ onClose, submitLabel }: { onClose: () => void; submitLabel: string }) {
  return <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[10px] font-black text-[#6d878a] hover:bg-[#f4f9f8]">Batal</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]">{submitLabel}</button></div>;
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">{eyebrow}</p><h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#244950]">{title}</h2><p className="mt-1 max-w-xl text-[10px] leading-5 text-[#94a8aa]">{description}</p></div>;
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: typeof Users; label: string; value: string; detail: string; tone: "teal" | "blue" | "violet" | "amber" }) {
  const styles = { teal: "bg-[#e6f6f3] text-[#0f766e]", blue: "bg-[#e3eff8] text-[#3a6b9b]", violet: "bg-[#ece9f8] text-[#7362a6]", amber: "bg-[#fff1dc] text-[#a56c2b]" };
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center justify-between"><span className={`grid h-9 w-9 place-items-center rounded-xl ${styles[tone]}`}><Icon className="h-4 w-4" /></span><TrendingUp className={`h-3.5 w-3.5 ${tone === "teal" ? "text-[#0f9b8e]" : "text-[#9cb3b5]"}`} /></div><p className="mt-4 text-[10px] font-bold text-[#94a8aa]">{label}</p><p className="mt-1 text-2xl font-black tracking-tight text-[#244950]">{value}</p><p className="mt-1 text-[9px] font-bold text-[#0f766e]">{detail}</p></div>;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f4f9f8] p-2"><p className="text-[8px] font-semibold text-[#94a8aa]">{label}</p><p className="mt-1 text-[12px] font-black text-[#365b60]">{value}</p></div>;
}

function StatusPill({ label }: { label: string }) {
  const tone = label === "Aktif" || label === "Menang" ? "bg-[#e6f6f3] text-[#0f766e]" : label === "Selesai" ? "bg-[#e3eff8] text-[#3a6b9b]" : "bg-[#f2f4f4] text-[#82999b]";
  return <span className={`rounded-full px-2 py-1 text-[8px] font-black ${tone}`}>{label}</span>;
}

function ActivityIcon({ type }: { type: ActivityType }) {
  const Icon = type === "Meeting" ? CalendarDays : type === "WhatsApp" ? MessageCircle : type === "Email" ? Mail : CalendarClock;
  return <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#e6f6f3] text-[#0f766e]"><Icon className="h-3.5 w-3.5" /></span>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">{label}</span>{children}</label>;
}

const fieldClass = "w-full rounded-xl border border-[#dcebea] bg-[#fbfdfd] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:border-[#0f766e] focus:ring-2 focus:ring-[#b9ded8]";