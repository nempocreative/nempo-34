import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Grid2X2,
  ImagePlus,
  LayoutGrid,
  Link2,
  Lock,
  Megaphone,
  MessageCircle,
  MousePointerClick,
  Plus,
  Search,
  Send,
  Settings2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@/lib/wouter";
import "./digital-demo-super-app.css";

type MarketingView = "overview" | "calendar" | "campaigns" | "analytics";
type ContentStatus = "Terjadwal" | "Menunggu review" | "Konsep" | "Siap tayang";
type Channel = "Instagram" | "TikTok" | "WhatsApp" | "Email" | "Blog";

type ContentItem = {
  id: string;
  day: string;
  date: string;
  month: string;
  title: string;
  description: string;
  channel: Channel;
  format: string;
  status: ContentStatus;
  time: string;
  color: string;
};

type Campaign = {
  id: string;
  name: string;
  objective: string;
  channels: Channel[];
  status: "Berjalan" | "Draft" | "Selesai";
  reach: string;
  result: string;
  progress: number;
  budget: string;
  color: string;
};

const navigation: Array<{ id: MarketingView; label: string; icon: typeof Grid2X2 }> = [
  { id: "overview", label: "Overview", icon: Grid2X2 },
  { id: "calendar", label: "Kalender konten", icon: CalendarDays },
  { id: "campaigns", label: "Campaign", icon: Megaphone },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const channelStyles: Record<Channel, { label: string; className: string }> = {
  Instagram: { label: "Instagram", className: "bg-[#e7f6f4] text-[#08766f]" },
  TikTok: { label: "TikTok", className: "bg-[#edf1f2] text-[#365b60]" },
  WhatsApp: { label: "WhatsApp", className: "bg-[#e6f6ed] text-[#19734f]" },
  Email: { label: "Email", className: "bg-[#eef1fb] text-[#52638c]" },
  Blog: { label: "Blog", className: "bg-[#fff4df] text-[#9a6b20]" },
};

const statusStyles: Record<ContentStatus, string> = {
  Terjadwal: "bg-[#e7f6f4] text-[#08766f]",
  "Menunggu review": "bg-[#fff4df] text-[#9a6b20]",
  Konsep: "bg-[#edf1f2] text-[#536d71]",
  "Siap tayang": "bg-[#e6f6ed] text-[#19734f]",
};

const initialContent: ContentItem[] = [
  { id: "content-01", day: "12", date: "Senin", month: "Sep", title: "Video destinasi: Curug Orok", description: "Reels 30 detik dengan hook pengalaman liburan singkat.", channel: "Instagram", format: "Reels", status: "Siap tayang", time: "09:00", color: "#0f766e" },
  { id: "content-02", day: "13", date: "Selasa", month: "Sep", title: "Tips itinerary 2 hari di Garut", description: "Carousel edukasi untuk first-time visitor.", channel: "Instagram", format: "Carousel", status: "Menunggu review", time: "12:30", color: "#198a80" },
  { id: "content-03", day: "14", date: "Rabu", month: "Sep", title: "Promo Weekend Escape", description: "Pesan broadcast dengan CTA ke landing page paket.", channel: "WhatsApp", format: "Broadcast", status: "Terjadwal", time: "10:00", color: "#3b8f72" },
  { id: "content-04", day: "15", date: "Kamis", month: "Sep", title: "Cerita dari Garut: Teh Rina", description: "Wawancara singkat pemilik kedai lokal.", channel: "TikTok", format: "Video", status: "Konsep", time: "16:00", color: "#365b60" },
  { id: "content-05", day: "16", date: "Jumat", month: "Sep", title: "Newsletter: agenda akhir pekan", description: "Rangkuman event, kuliner, dan promo untuk subscriber.", channel: "Email", format: "Newsletter", status: "Terjadwal", time: "08:00", color: "#52638c" },
  { id: "content-06", day: "18", date: "Minggu", month: "Sep", title: "Panduan wisata keluarga", description: "Artikel evergreen untuk organic search.", channel: "Blog", format: "Artikel", status: "Konsep", time: "11:00", color: "#9a6b20" },
];

const initialCampaigns: Campaign[] = [
  { id: "campaign-01", name: "Weekend Escape", objective: "Booking paket wisata", channels: ["Instagram", "TikTok"], status: "Berjalan", reach: "18,4K", result: "126 klik", progress: 78, budget: "Rp2,4 jt", color: "#0f766e" },
  { id: "campaign-02", name: "Cerita dari Garut", objective: "Brand awareness", channels: ["Instagram", "Blog"], status: "Berjalan", reach: "12,8K", result: "7,8% engagement", progress: 62, budget: "Rp1,8 jt", color: "#3b8f72" },
  { id: "campaign-03", name: "Event bulan ini", objective: "Pendaftaran event", channels: ["Instagram", "WhatsApp"], status: "Draft", reach: "—", result: "Belum aktif", progress: 24, budget: "Rp900 rb", color: "#9a6b20" },
];

const performanceBars = [
  { label: "Sen", value: 52, reach: "5,2K" },
  { label: "Sel", value: 68, reach: "6,8K" },
  { label: "Rab", value: 46, reach: "4,6K" },
  { label: "Kam", value: 78, reach: "7,8K" },
  { label: "Jum", value: 92, reach: "9,2K" },
  { label: "Sab", value: 73, reach: "7,3K" },
  { label: "Min", value: 61, reach: "6,1K" },
];

const MARKETING_PREVIEW_PASSWORD = "nemposukses";
const MARKETING_PREVIEW_ACCESS_KEY = "nempo_marketing_preview_access";

function MarketingPreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="Marketing Tools" description="Masukkan password untuk membuka preview Marketing Tools Digi Nempo." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === MARKETING_PREVIEW_PASSWORD) {
      localStorage.setItem(MARKETING_PREVIEW_ACCESS_KEY, "1");
      onUnlock();
      return;
    }
    setError(true);
  }

  return (
    <main className="nempo-demo-green nempo-marketing-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md rounded-[28px] border border-[#e3eeed] bg-white p-6 shadow-[0_24px_70px_rgba(24,59,67,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e6f6f3] text-[#0f766e]"><Megaphone className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f766e]">Live preview</p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Marketing Tools</h1>
          </div>
        </div>
        <p className="text-sm leading-6 text-[#6d878a]">Masukkan password untuk membuka preview Marketing Tools Digi Nempo.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="text" name="username" autoComplete="username" value="marketing-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
          <label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#cf6c61] bg-[#fff9f8]" : "border-[#d8e8e6] focus-within:border-[#0f766e]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#bd5c52]" : "text-[#8aa1a3]"}`} />
            <span className="sr-only">Password live preview Marketing Tools</span>
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

export default function DigitalMarketingDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeView, setActiveView] = useState<MarketingView>("overview");
  const [contents, setContents] = useState(initialContent);
  const [campaignList, setCampaignList] = useState(initialCampaigns);
  const [toast, setToast] = useState<string | null>(null);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);

  if (!unlocked) return <MarketingPreviewGate onUnlock={() => setUnlocked(true)} />;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function addContent(item: ContentItem) {
    setContents((current) => [item, ...current]);
    setContentModalOpen(false);
    notify("Konten baru ditambahkan ke kalender.");
  }

  function addCampaign(campaign: Campaign) {
    setCampaignList((current) => [campaign, ...current]);
    setCampaignModalOpen(false);
    setActiveView("campaigns");
    notify("Campaign baru berhasil dibuat sebagai draft.");
  }

  return (
    <Layout>
      <SEO title="Marketing Tools Demo — Digi Nempo" description="Preview workspace Marketing Tools Digi Nempo untuk mengatur konten, campaign, dan performa promosi." keywords="Marketing Tools, dashboard marketing, kalender konten, campaign digital, analytics marketing, Digi Nempo" path="/digital-services/marketing" />
      <main className="nempo-demo-green nempo-marketing-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1440px] px-3 pb-24 pt-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-[#dcebea] py-3">
            <Link href="/digital-services" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8aa1a3] transition-colors hover:text-[#0f766e]">← Digi Nempo</Link>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f766e]"><span className="h-1.5 w-1.5 rounded-full bg-[#2aa793]" /> Preview workspace</div>
          </div>

          <section className="mt-4 overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_12px_40px_rgba(24,59,67,0.06)]">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7f0ef] px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Megaphone className="h-5 w-5" /></div>
                <div><p className="text-sm font-extrabold text-[#183b43]">Digi Nempo Marketing</p><p className="text-[11px] text-[#8aa1a3]">Workspace · Nempo Creative</p></div>
              </div>
              <div className="flex items-center gap-2">
                <label className="relative hidden sm:block"><span className="sr-only">Pilih periode demo</span><select className="appearance-none rounded-xl border border-[#dcebea] bg-white py-2 pl-3 pr-8 text-xs font-bold text-[#527174] outline-none focus:border-[#0f766e]"><option>September 2026</option><option>Agustus 2026</option><option>Juli 2026</option></select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8aa1a3]" /></label>
                <button type="button" onClick={() => notify("Tidak ada notifikasi baru.")} aria-label="Notifikasi" className="grid h-9 w-9 place-items-center rounded-full border border-[#dcebea] text-[#6d878a] transition-colors hover:bg-[#e6f6f3] hover:text-[#0f766e]"><Bell className="h-4 w-4" /></button>
                <button type="button" onClick={() => notify("Pengaturan workspace demo belum tersedia.")} aria-label="Pengaturan workspace" className="grid h-9 w-9 place-items-center rounded-full bg-[#0f766e] text-white transition-colors hover:bg-[#0b625c]">NC</button>
              </div>
            </header>

            <div className="grid lg:grid-cols-[15rem_1fr]">
              <aside className="border-b border-[#e7f0ef] bg-[#fbfdfd] p-3 lg:border-b-0 lg:border-r">
                <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#8aa1a3]">Marketing workspace</p>
                <nav className="grid grid-cols-2 gap-1 lg:grid-cols-1">
                  {navigation.map(({ id, label, icon: Icon }) => (
                    <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#6d878a] hover:bg-white hover:text-[#183b43]"}`}><Icon className="h-4 w-4" /> {label}</button>
                  ))}
                </nav>
                <div className="mt-4 hidden border-t border-[#e7f0ef] px-3 pt-4 lg:block">
                  <button type="button" onClick={() => notify("Pengaturan demo belum tersedia.")} className="flex items-center gap-2 text-xs font-bold text-[#6d878a] hover:text-[#0f766e]"><Settings2 className="h-4 w-4" /> Pengaturan</button>
                  <button type="button" onClick={() => notify("Pusat bantuan demo siap membantu.")} className="mt-3 flex items-center gap-2 text-xs font-bold text-[#6d878a] hover:text-[#0f766e]"><CircleHelp className="h-4 w-4" /> Pusat bantuan</button>
                </div>
              </aside>

              <div className="min-w-0 bg-[#fdfefe] p-4 sm:p-6 lg:p-7">
                <MarketingWorkspaceContent activeView={activeView} contents={contents} campaigns={campaignList} onAddContent={() => setContentModalOpen(true)} onAddCampaign={() => setCampaignModalOpen(true)} onNotify={notify} />
              </div>
            </div>
          </section>
        </div>
      </main>
      {contentModalOpen && <ContentModal onClose={() => setContentModalOpen(false)} onSubmit={addContent} />}
      {campaignModalOpen && <CampaignModal onClose={() => setCampaignModalOpen(false)} onSubmit={addCampaign} />}
      {toast && <div role="status" className="fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#183b43] px-4 py-3 text-center text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8de0d4]" /> {toast}</div>}
    </Layout>
  );
}

function MarketingWorkspaceContent({ activeView, contents, campaigns, onAddContent, onAddCampaign, onNotify }: { activeView: MarketingView; contents: ContentItem[]; campaigns: Campaign[]; onAddContent: () => void; onAddCampaign: () => void; onNotify: (message: string) => void }) {
  if (activeView === "calendar") return <CalendarView contents={contents} onAddContent={onAddContent} onNotify={onNotify} />;
  if (activeView === "campaigns") return <CampaignsView campaigns={campaigns} onAddCampaign={onAddCampaign} onNotify={onNotify} />;
  if (activeView === "analytics") return <AnalyticsView onNotify={onNotify} />;
  return <OverviewView contents={contents} campaigns={campaigns} onAddContent={onAddContent} onAddCampaign={onAddCampaign} onNotify={onNotify} />;
}

function WorkspaceHeader({ eyebrow, title, description, action, onAction }: { eyebrow: string; title: string; description: string; action: string; onAction: () => void }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0f766e]">{eyebrow}</p><h2 className="mt-2 max-w-2xl text-2xl font-black leading-tight tracking-[-0.04em] text-[#183b43] sm:text-3xl">{title}</h2><p className="mt-2 text-xs leading-5 text-[#7b9698]">{description}</p></div>
      <button type="button" onClick={onAction} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-3.5 py-2.5 text-[10px] font-black text-white transition-colors hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> {action}</button>
    </div>
  );
}

function OverviewView({ contents, campaigns, onAddContent, onAddCampaign, onNotify }: { contents: ContentItem[]; campaigns: Campaign[]; onAddContent: () => void; onAddCampaign: () => void; onNotify: (message: string) => void }) {
  return (
    <>
      <WorkspaceHeader eyebrow="Overview" title="Selamat datang di marketing workspace." description="Satu ruang untuk merencanakan, menerbitkan, dan membaca hasil marketing Nempo." action="Buat campaign" onAction={onAddCampaign} />
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Eye} label="Total reach" value="48,2K" detail="+18,4% dari periode lalu" trend />
        <MetricCard icon={MousePointerClick} label="Engagement rate" value="7,8%" detail="+2,1% dari periode lalu" trend />
        <MetricCard icon={CalendarDays} label="Konten terjadwal" value={String(contents.length).padStart(2, "0")} detail="5 konten minggu ini" />
        <MetricCard icon={Megaphone} label="Campaign aktif" value={String(campaigns.filter((item) => item.status === "Berjalan").length).padStart(2, "0")} detail="3 channel digunakan" />
      </div>
      <div className="mt-3 grid gap-3 xl:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-2xl border border-[#e1edeb] bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3"><div><h3 className="text-[13px] font-black text-[#183b43]">Performa channel</h3><p className="mt-1 text-[10px] text-[#8aa1a3]">Reach organik dan berbayar · 7 hari terakhir</p></div><button type="button" onClick={() => onNotify("Analytics lengkap dibuka.")} className="text-[10px] font-black text-[#0f766e] hover:text-[#0b625c]">Lihat detail <ArrowRight className="ml-1 inline h-3 w-3" /></button></div>
          <div className="mt-6 flex h-44 items-end gap-2 border-b border-[#e7f0ef] px-1 sm:gap-4">{performanceBars.map((bar, index) => <div key={bar.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="pointer-events-none rounded-md bg-[#183b43] px-1.5 py-1 text-[8px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">{bar.reach}</span><span className={`marketing-bar w-full max-w-9 rounded-t-lg ${index === 4 ? "bg-[#0f766e]" : "bg-[#a9ded7]"}`} style={{ height: `${bar.value}%` }} /><span className="text-[9px] font-semibold text-[#8aa1a3]">{bar.label}</span></div>)}</div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[9px] font-bold text-[#6d878a]"><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#0f766e]" />Hari terbaik</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#a9ded7]" />Reach organik</span><span className="ml-auto text-[#0f766e]">+18,4% naik</span></div>
        </section>
        <section className="rounded-2xl bg-[#183b43] p-5 text-white">
          <div className="flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#94c9c3]">Quick insight</p><Sparkles className="h-4 w-4 text-[#8de0d4]" /></div>
          <p className="mt-6 text-xl font-black leading-tight">Video destinasi sedang jadi format paling kuat.</p>
          <p className="mt-3 text-[10px] leading-5 text-white/60">Reach video naik 32% dibanding format lain. Jadwalkan dua konten serupa minggu depan untuk menjaga momentum.</p>
          <button type="button" onClick={onAddContent} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8de0d4] px-3 py-2 text-[9px] font-black text-[#183b43] transition-colors hover:bg-white">Jadwalkan konten <ArrowRight className="h-3 w-3" /></button>
        </section>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_.9fr]">
        <section className="rounded-2xl border border-[#e1edeb] bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3"><div><h3 className="text-[13px] font-black text-[#183b43]">Agenda terdekat</h3><p className="mt-1 text-[10px] text-[#8aa1a3]">Konten yang perlu perhatian tim</p></div><button type="button" onClick={onAddContent} className="text-[10px] font-black text-[#0f766e]">Tambah <Plus className="ml-1 inline h-3 w-3" /></button></div>
          <div className="mt-5 space-y-3">{contents.slice(0, 4).map((item) => <ContentRow key={item.id} item={item} />)}</div>
        </section>
        <section className="rounded-2xl border border-[#e1edeb] bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3"><div><h3 className="text-[13px] font-black text-[#183b43]">Kesehatan campaign</h3><p className="mt-1 text-[10px] text-[#8aa1a3]">Ringkasan campaign berjalan</p></div><Target className="h-4 w-4 text-[#0f766e]" /></div>
          <div className="mt-5 space-y-4">{campaigns.map((campaign) => <div key={campaign.id}><div className="mb-1.5 flex items-center justify-between gap-2"><span className="truncate text-[10px] font-black text-[#365b60]">{campaign.name}</span><span className="text-[9px] font-bold text-[#8aa1a3]">{campaign.progress}%</span></div><div className="h-1.5 rounded-full bg-[#edf4f3]"><div className="h-full rounded-full" style={{ width: `${campaign.progress}%`, backgroundColor: campaign.color }} /></div></div>)}</div>
          <button type="button" onClick={onAddCampaign} className="mt-6 w-full rounded-xl border border-[#b9ded8] py-2.5 text-[10px] font-black text-[#0f766e] transition-colors hover:bg-[#e6f6f3]">Buat campaign baru</button>
        </section>
      </div>
    </>
  );
}

function CalendarView({ contents, onAddContent, onNotify }: { contents: ContentItem[]; onAddContent: () => void; onNotify: (message: string) => void }) {
  const [filter, setFilter] = useState<"Semua" | ContentStatus>("Semua");
  const [query, setQuery] = useState("");
  const filteredContents = useMemo(() => contents.filter((item) => (filter === "Semua" || item.status === filter) && `${item.title} ${item.channel}`.toLowerCase().includes(query.toLowerCase())), [contents, filter, query]);
  return (
    <>
      <WorkspaceHeader eyebrow="Kalender konten" title="Jaga ritme publikasi tetap hidup." description="Lihat semua konten dalam satu alur kerja, dari konsep sampai siap tayang." action="Tambah konten" onAction={onAddContent} />
      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-[#e1edeb] bg-white p-3 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8aa1a3]" /><span className="sr-only">Cari konten</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari konten atau channel..." className="w-full rounded-xl bg-[#f4f9f8] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:ring-2 focus:ring-[#b9ded8]" /></label>
        <div className="flex items-center gap-2 overflow-x-auto"><Filter className="h-3.5 w-3.5 shrink-0 text-[#8aa1a3]" />{(["Semua", "Terjadwal", "Menunggu review", "Konsep", "Siap tayang"] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-lg px-2.5 py-2 text-[9px] font-black transition-colors ${filter === item ? "bg-[#0f766e] text-white" : "text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"}`}>{item}</button>)}</div>
      </div>
      <div className="mt-3 overflow-hidden rounded-2xl border border-[#e1edeb] bg-white">
        <div className="hidden grid-cols-[4.5rem_1.3fr_.75fr_.75fr_6rem] gap-4 border-b border-[#e7f0ef] bg-[#fbfdfd] px-4 py-3 text-[8px] font-black uppercase tracking-[0.12em] text-[#8aa1a3] sm:grid"><span>Tanggal</span><span>Konten</span><span>Channel</span><span>Status</span><span>Waktu</span></div>
        {filteredContents.map((item) => <div key={item.id} className="grid gap-3 border-b border-[#edf3f2] px-4 py-4 last:border-b-0 sm:grid-cols-[4.5rem_1.3fr_.75fr_.75fr_6rem] sm:items-center sm:gap-4"><div className="flex items-center gap-3 sm:block"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#e6f6f3] text-sm font-black text-[#0f766e] sm:h-auto sm:w-auto sm:grid-cols-none sm:place-items-start sm:bg-transparent">{item.day}</div><div><p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8aa1a3]">{item.date} · {item.month}</p><p className="mt-1 text-[9px] text-[#8aa1a3] sm:hidden">{item.time}</p></div></div><div><p className="text-[11px] font-black text-[#183b43]">{item.title}</p><p className="mt-1 text-[9px] leading-4 text-[#8aa1a3]">{item.description}</p><span className="mt-2 inline-flex rounded-md bg-[#f4f9f8] px-2 py-1 text-[8px] font-bold text-[#6d878a]">{item.format}</span></div><span className={`w-fit rounded-md px-2 py-1 text-[8px] font-bold ${channelStyles[item.channel].className}`}>{channelStyles[item.channel].label}</span><span className={`w-fit rounded-md px-2 py-1 text-[8px] font-bold ${statusStyles[item.status]}`}>{item.status}</span><div className="flex items-center justify-between sm:block"><p className="text-[10px] font-black text-[#365b60]">{item.time}</p><button type="button" onClick={() => onNotify(`Menu aksi untuk “${item.title}” dibuka.`)} className="text-[9px] font-black text-[#0f766e] sm:mt-2">Kelola</button></div></div>)}
        {filteredContents.length === 0 && <div className="p-12 text-center"><CalendarDays className="mx-auto h-6 w-6 text-[#a9c8c4]" /><p className="mt-3 text-xs font-bold text-[#6d878a]">Konten tidak ditemukan</p><p className="mt-1 text-[10px] text-[#9bb1b3]">Coba kata kunci atau filter lain.</p></div>}
      </div>
    </>
  );
}

function CampaignsView({ campaigns, onAddCampaign, onNotify }: { campaigns: Campaign[]; onAddCampaign: () => void; onNotify: (message: string) => void }) {
  return (
    <>
      <WorkspaceHeader eyebrow="Campaign" title="Semua campaign, satu pandangan." description="Pantau objektif, channel, budget, dan hasil setiap aktivasi marketing." action="Campaign baru" onAction={onAddCampaign} />
      <div className="mt-7 grid gap-3 xl:grid-cols-3">{campaigns.map((campaign) => <article key={campaign.id} className="rounded-2xl border border-[#e1edeb] bg-white p-4 transition-shadow hover:shadow-[0_12px_30px_rgba(24,59,67,0.08)]"><div className="flex items-start justify-between gap-3"><span className="rounded-lg px-2 py-1 text-[8px] font-black" style={{ backgroundColor: `${campaign.color}18`, color: campaign.color }}>{campaign.status}</span><button type="button" onClick={() => onNotify(`Detail campaign “${campaign.name}” dibuka.`)} aria-label={`Opsi ${campaign.name}`} className="text-[#8aa1a3] hover:text-[#0f766e]">•••</button></div><h3 className="mt-5 text-base font-black text-[#183b43]">{campaign.name}</h3><p className="mt-1 text-[10px] text-[#8aa1a3]">{campaign.objective}</p><div className="mt-4 flex flex-wrap gap-1.5">{campaign.channels.map((channel) => <span key={channel} className={`rounded-md px-2 py-1 text-[8px] font-bold ${channelStyles[channel].className}`}>{channel}</span>)}</div><div className="mt-5"><div className="mb-1.5 flex justify-between text-[9px] font-bold text-[#6d878a]"><span>Progress campaign</span><span>{campaign.progress}%</span></div><div className="h-2 rounded-full bg-[#edf4f3]"><div className="h-full rounded-full" style={{ width: `${campaign.progress}%`, backgroundColor: campaign.color }} /></div></div><div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#edf3f2] pt-4"><div><p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#8aa1a3]">Reach</p><p className="mt-1 text-sm font-black text-[#183b43]">{campaign.reach}</p></div><div><p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#8aa1a3]">Hasil</p><p className="mt-1 text-sm font-black text-[#183b43]">{campaign.result}</p></div></div><div className="mt-4 flex items-center justify-between rounded-xl bg-[#f4f9f8] px-3 py-2.5"><span className="text-[9px] font-bold text-[#6d878a]">Budget bulan ini</span><span className="text-[10px] font-black text-[#0f766e]">{campaign.budget}</span></div></article>)}</div>
      <div className="mt-3 rounded-2xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] p-5 text-center"><Megaphone className="mx-auto h-5 w-5 text-[#0f766e]" /><p className="mt-2 text-xs font-black text-[#365b60]">Punya objective marketing baru?</p><button type="button" onClick={onAddCampaign} className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black text-[#0f766e]">Rencanakan campaign <ArrowRight className="h-3 w-3" /></button></div>
    </>
  );
}

function AnalyticsView({ onNotify }: { onNotify: (message: string) => void }) {
  const [period, setPeriod] = useState("7 hari terakhir");
  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0f766e]">Analytics</p><h2 className="mt-2 max-w-2xl text-2xl font-black leading-tight tracking-[-0.04em] text-[#183b43] sm:text-3xl">Baca sinyal yang paling penting.</h2><p className="mt-2 text-xs leading-5 text-[#7b9698]">Ukur apa yang bekerja dan ubah insight menjadi langkah berikutnya.</p></div><div className="flex items-center gap-2"><select value={period} onChange={(event) => setPeriod(event.target.value)} className="rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#527174] outline-none focus:border-[#0f766e]"><option>7 hari terakhir</option><option>30 hari terakhir</option><option>90 hari terakhir</option></select><button type="button" onClick={() => onNotify(`Laporan ${period.toLowerCase()} sedang disiapkan.`)} className="inline-flex items-center gap-2 rounded-xl border border-[#b9ded8] px-3 py-2.5 text-[10px] font-black text-[#0f766e] hover:bg-[#e6f6f3]"><ArrowDownRight className="h-3.5 w-3.5" /> Export</button></div></div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={Eye} label="Total reach" value="48,2K" detail="+18,4% vs periode lalu" trend /><MetricCard icon={MousePointerClick} label="Engagement rate" value="7,8%" detail="+2,1% vs periode lalu" trend /><MetricCard icon={Send} label="Total klik" value="2.460" detail="+14,2% vs periode lalu" trend /><MetricCard icon={Users} label="Audience baru" value="1.280" detail="+9,6% vs periode lalu" trend /></div>
      <div className="mt-3 grid gap-3 xl:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-2xl border border-[#e1edeb] bg-white p-4 sm:p-5"><div className="flex items-start justify-between"><div><h3 className="text-[13px] font-black text-[#183b43]">Reach & engagement</h3><p className="mt-1 text-[10px] text-[#8aa1a3]">Performa semua channel · {period.toLowerCase()}</p></div><BarChart3 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-7 flex h-52 items-end gap-2 border-b border-[#e7f0ef] px-1 sm:gap-5">{performanceBars.map((bar, index) => <div key={bar.label} className="flex h-full flex-1 items-end gap-1.5 sm:gap-2"><span className="w-full rounded-t-md bg-[#c9e9e5]" style={{ height: `${Math.max(bar.value - 14, 20)}%` }} /><span className={`w-full rounded-t-md ${index === 4 ? "bg-[#0f766e]" : "bg-[#63bdb3]"}`} style={{ height: `${bar.value}%` }} /></div>)}</div><div className="mt-3 flex justify-between text-[9px] font-bold text-[#8aa1a3]">{performanceBars.map((bar) => <span key={bar.label}>{bar.label}</span>)}</div><div className="mt-4 flex gap-5 text-[9px] font-bold text-[#6d878a]"><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#0f766e]" />Reach</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#c9e9e5]" />Engagement</span></div></section>
        <section className="rounded-2xl border border-[#e1edeb] bg-white p-4 sm:p-5"><div className="flex items-start justify-between"><div><h3 className="text-[13px] font-black text-[#183b43]">Channel mix</h3><p className="mt-1 text-[10px] text-[#8aa1a3]">Kontribusi reach bulan ini</p></div><LayoutGrid className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-7 space-y-4">{[["Instagram", "42%", "20,2K", "#0f766e"], ["TikTok", "28%", "13,5K", "#63bdb3"], ["WhatsApp", "18%", "8,7K", "#3b8f72"], ["Blog & Email", "12%", "5,8K", "#9a6b20"]].map(([label, percent, reach, color]) => <div key={label}><div className="mb-1.5 flex items-center justify-between"><span className="text-[10px] font-black text-[#365b60]">{label}</span><span className="text-[9px] font-bold text-[#8aa1a3]">{reach} · {percent}</span></div><div className="h-2 rounded-full bg-[#edf4f3]"><div className="h-full rounded-full" style={{ width: percent, backgroundColor: color }} /></div></div>)}</div><div className="mt-7 rounded-xl bg-[#e6f6f3] p-3"><p className="flex items-center gap-1.5 text-[9px] font-black text-[#08766f]"><Sparkles className="h-3 w-3" /> Rekomendasi</p><p className="mt-1 text-[10px] leading-4 text-[#365b60]">Naikkan porsi Reels untuk menjaga pertumbuhan reach.</p></div></section>
      </div>
    </>
  );
}

function MetricCard({ icon: Icon, label, value, detail, trend = false }: { icon: typeof Eye; label: string; value: string; detail: string; trend?: boolean }) {
  return <div className="rounded-2xl border border-[#e1edeb] bg-white p-4"><div className="flex items-center justify-between"><p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#8aa1a3]">{label}</p><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#e6f6f3] text-[#0f766e]"><Icon className="h-3.5 w-3.5" /></span></div><p className="mt-3 text-2xl font-black tracking-tight text-[#183b43]">{value}</p><p className={`mt-1 text-[9px] font-bold ${trend ? "text-[#0f766e]" : "text-[#8aa1a3]"}`}>{detail}</p></div>;
}

function ContentRow({ item }: { item: ContentItem }) {
  return <div className="flex items-center gap-3 border-t border-[#edf3f2] pt-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#e6f6f3] text-[9px] font-black text-[#0f766e]">{item.day}</div><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{item.title}</p><p className="mt-0.5 text-[8px] text-[#8aa1a3]">{item.channel} · {item.time}</p></div><span className={`hidden rounded-md px-2 py-1 text-[8px] font-bold sm:inline-flex ${statusStyles[item.status]}`}>{item.status}</span></div>;
}

function ModalShell({ title, description, onClose, children }: { title: string; description: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#183b43]/45 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div role="dialog" aria-modal="true" className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[26px] bg-white p-5 shadow-2xl sm:rounded-[26px] sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0f766e]">Marketing workspace</p><h2 className="mt-2 text-xl font-black text-[#183b43]">{title}</h2><p className="mt-1 text-[10px] leading-5 text-[#8aa1a3]">{description}</p></div><button type="button" onClick={onClose} aria-label="Tutup" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div>{children}</div></div>;
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">{label}</span>{children}</label>;
}

const fieldClass = "w-full rounded-xl border border-[#dcebea] bg-[#fbfdfd] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:border-[#0f766e] focus:ring-2 focus:ring-[#b9ded8]";

function ContentModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (item: ContentItem) => void }) {
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState<Channel>("Instagram");
  const [format, setFormat] = useState("Reels");
  const [date, setDate] = useState("19");
  const [time, setTime] = useState("09:00");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!title.trim()) return; onSubmit({ id: `content-${Date.now()}`, day: date, date: "Senin", month: "Sep", title: title.trim(), description: "Konten baru yang siap direncanakan bersama tim.", channel, format, status: "Konsep", time, color: "#0f766e" }); }
  return <ModalShell title="Tambah konten" description="Masukkan ide dasar. Detail dan aset bisa dilengkapi setelahnya." onClose={onClose}><form onSubmit={submit} className="mt-6 space-y-4"><FormField label="Judul konten"><input required autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Contoh: 5 alasan liburan ke Garut" className={fieldClass} /></FormField><div className="grid gap-4 sm:grid-cols-2"><FormField label="Channel"><select value={channel} onChange={(event) => setChannel(event.target.value as Channel)} className={fieldClass}>{Object.keys(channelStyles).map((item) => <option key={item}>{item}</option>)}</select></FormField><FormField label="Format"><select value={format} onChange={(event) => setFormat(event.target.value)} className={fieldClass}>{["Reels", "Carousel", "Video", "Broadcast", "Newsletter", "Artikel"].map((item) => <option key={item}>{item}</option>)}</select></FormField><FormField label="Tanggal tayang"><input type="number" min="1" max="30" value={date} onChange={(event) => setDate(event.target.value)} className={fieldClass} /></FormField><FormField label="Waktu"><input type="time" value={time} onChange={(event) => setTime(event.target.value)} className={fieldClass} /></FormField></div><div className="rounded-xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] p-3"><p className="flex items-center gap-2 text-[10px] font-black text-[#08766f]"><ImagePlus className="h-3.5 w-3.5" /> Asset library terhubung</p><p className="mt-1 text-[9px] leading-4 text-[#6d878a]">Aset visual dapat dipilih setelah konten dibuat.</p></div><div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[10px] font-black text-[#6d878a] hover:bg-[#f4f9f8]">Batal</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]">Simpan sebagai konsep</button></div></form></ModalShell>;
}

function CampaignModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (campaign: Campaign) => void }) {
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("Brand awareness");
  const [budget, setBudget] = useState("Rp1,5 jt");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!name.trim()) return; onSubmit({ id: `campaign-${Date.now()}`, name: name.trim(), objective, channels: ["Instagram"], status: "Draft", reach: "—", result: "Belum aktif", progress: 8, budget, color: "#0f766e" }); }
  return <ModalShell title="Buat campaign baru" description="Mulai dari objective yang jelas, lalu kembangkan channel dan asetnya bersama tim." onClose={onClose}><form onSubmit={submit} className="mt-6 space-y-4"><FormField label="Nama campaign"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Liburan hemat bareng keluarga" className={fieldClass} /></FormField><FormField label="Objective"><select value={objective} onChange={(event) => setObjective(event.target.value)} className={fieldClass}><option>Brand awareness</option><option>Booking paket wisata</option><option>Pendaftaran event</option><option>Engagement komunitas</option></select></FormField><FormField label="Estimasi budget"><input value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="Rp1,5 jt" className={fieldClass} /></FormField><div className="grid gap-2 sm:grid-cols-3"><div className="rounded-xl border border-[#b9ded8] bg-[#e6f6f3] p-3"><Link2 className="h-4 w-4 text-[#0f766e]" /><p className="mt-2 text-[9px] font-black text-[#365b60]">Landing page</p><p className="mt-1 text-[8px] text-[#6d878a]">Siapkan CTA</p></div><div className="rounded-xl border border-[#dcebea] bg-[#fbfdfd] p-3"><FileText className="h-4 w-4 text-[#8aa1a3]" /><p className="mt-2 text-[9px] font-black text-[#365b60]">Brief konten</p><p className="mt-1 text-[8px] text-[#6d878a]">Bisa nanti</p></div><div className="rounded-xl border border-[#dcebea] bg-[#fbfdfd] p-3"><MessageCircle className="h-4 w-4 text-[#8aa1a3]" /><p className="mt-2 text-[9px] font-black text-[#365b60]">Kolaborator</p><p className="mt-1 text-[8px] text-[#6d878a]">Undang tim</p></div></div><div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[10px] font-black text-[#6d878a] hover:bg-[#f4f9f8]">Batal</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]">Buat campaign</button></div></form></ModalShell>;
}