import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import { Link } from "@/lib/wouter";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Copy,
  Download,
  Eye,
  EyeOff,
  ExternalLink,
  Globe2,
  LayoutDashboard,
  Link2,
  MapPin,
  Megaphone,
  MessageCircle,
  MousePointerClick,
  Palette,
  Pencil,
  Plus,
  QrCode,
  RefreshCcw,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import "./digital-demo-super-app.css";

type BioView = "overview" | "profile" | "links" | "appearance" | "analytics";
type BioLinkCategory = "Utama" | "Sosial" | "Katalog" | "Kontak";
type BioTheme = "teal" | "mist";
type BioButtonStyle = "rounded" | "soft";

type BioProfile = {
  name: string;
  handle: string;
  bio: string;
  location: string;
  initials: string;
};

type BioLink = {
  id: string;
  title: string;
  url: string;
  description: string;
  category: BioLinkCategory;
  clicks: number;
  enabled: boolean;
  pinned: boolean;
  icon: "link" | "menu" | "instagram" | "whatsapp" | "maps" | "booking";
};

const navItems: Array<{ id: BioView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { id: "profile", label: "Profil halaman", icon: Users },
  { id: "links", label: "Kelola tautan", icon: Link2 },
  { id: "appearance", label: "Tampilan", icon: Palette },
  { id: "analytics", label: "Analitik", icon: BarChart3 },
];

const categories: Array<"Semua kategori" | BioLinkCategory> = ["Semua kategori", "Utama", "Sosial", "Katalog", "Kontak"];

const initialProfile: BioProfile = {
  name: "Kopi Nempo",
  handle: "kopinempo",
  bio: "Kopi, ruang cerita, dan rasa lokal Garut. Temukan menu, lokasi, dan kabar terbaru kami.",
  location: "Garut, Jawa Barat",
  initials: "KN",
};

const initialLinks: BioLink[] = [
  { id: "bio-01", title: "Pesan meja & reservasi", url: "https://nempo.id/booking/kopi-nempo", description: "Amankan meja untuk kunjunganmu", category: "Utama", clicks: 842, enabled: true, pinned: true, icon: "booking" },
  { id: "bio-02", title: "Lihat menu terbaru", url: "https://nempo.id/menu/kopi-nempo", description: "Menu, harga, dan rekomendasi hari ini", category: "Katalog", clicks: 716, enabled: true, pinned: true, icon: "menu" },
  { id: "bio-03", title: "Instagram @kopinempo", url: "https://instagram.com/kopinempo", description: "Cerita di balik meja dan biji kopi kami", category: "Sosial", clicks: 584, enabled: true, pinned: false, icon: "instagram" },
  { id: "bio-04", title: "Chat WhatsApp", url: "https://wa.me/6281234567890", description: "Tanya menu, event, atau kerja sama", category: "Kontak", clicks: 431, enabled: true, pinned: false, icon: "whatsapp" },
  { id: "bio-05", title: "Lokasi & jam buka", url: "https://maps.google.com/?q=Kopi+Nempo+Garut", description: "Jalan Cimanuk No. 18 · 08.00–22.00", category: "Kontak", clicks: 389, enabled: true, pinned: false, icon: "maps" },
  { id: "bio-06", title: "Kolaborasi & event", url: "https://nempo.id/kerja-sama", description: "Ruang untuk brand, komunitas, dan event", category: "Utama", clicks: 168, enabled: false, pinned: false, icon: "link" },
];

const analyticsData = [
  { label: "Sen", views: 1180, clicks: 288 },
  { label: "Sel", views: 1420, clicks: 354 },
  { label: "Rab", views: 1260, clicks: 301 },
  { label: "Kam", views: 1690, clicks: 422 },
  { label: "Jum", views: 1880, clicks: 468 },
  { label: "Sab", views: 2460, clicks: 636 },
  { label: "Min", views: 2100, clicks: 525 },
];

const PREVIEW_PASSWORD = "nemposukses";
const PREVIEW_ACCESS_KEY = "nempo_link_bio_preview_access";
const formatNumber = (value: number) => value.toLocaleString("id-ID");
const percent = (value: number) => `${value.toFixed(1)}%`;

function PreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="Nempo Link Bio" description="Masukkan password untuk membuka pengaturan profil, tautan, tampilan, dan analitik halaman Link Bio." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === PREVIEW_PASSWORD) {
      localStorage.setItem(PREVIEW_ACCESS_KEY, "1");
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <main className="nempo-demo-green nempo-link-bio-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md border border-[#dcebea] bg-[#fbfdfd] p-6 shadow-[0_22px_70px_rgba(24,59,67,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-lg shadow-teal-800/20"><Link2 className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f9b8e]">Live preview</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Nempo Link Bio</h1></div>
        </div>
        <p className="text-sm leading-6 text-[#648084]">Masukkan password untuk membuka pengaturan profil, tautan, tampilan, dan analitik halaman Link Bio.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="text" name="username" autoComplete="username" value="link-bio-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
          <label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#b75c54] bg-[#fff8f5]" : "border-[#dcebea] focus-within:border-[#0f766e]"}`}>
            <Settings2 className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da5a2]"}`} />
            <span className="sr-only">Password live preview Link Bio</span>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setError(false); }} placeholder="Masukkan password" autoComplete="current-password" autoFocus className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#183b43] outline-none placeholder:text-[#9db5b5]" />
            <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} className="text-[#7da5a2] hover:text-[#0f766e]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </label>
          {error && <p className="text-xs font-semibold text-[#b75c54]">Password salah. Coba lagi.</p>}
          <button type="submit" className="w-full rounded-xl bg-[#0f766e] px-4 py-3 text-xs font-black text-white hover:bg-[#0b625c]">Masuk ke preview</button>
        </form>
        <p className="mt-5 flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><Sparkles className="h-3.5 w-3.5 text-[#0f9b8e]" /> Demo data untuk presentasi customer.</p>
      </div>
    </main>
  );
}

export default function DigitalLinkBioDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <PreviewGate onUnlock={() => setUnlocked(true)} />;
  return <LinkBioWorkspace />;
}

function LinkBioWorkspace() {
  const [activeView, setActiveView] = useState<BioView>("overview");
  const [profile, setProfile] = useState(initialProfile);
  const [links, setLinks] = useState(initialLinks);
  const [theme, setTheme] = useState<BioTheme>("teal");
  const [buttonStyle, setButtonStyle] = useState<BioButtonStyle>("rounded");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Semua kategori");
  const [linkModal, setLinkModal] = useState<BioLink | "new" | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function resetDemo() {
    setActiveView("overview");
    setProfile(initialProfile);
    setLinks(initialLinks);
    setTheme("teal");
    setButtonStyle("rounded");
    setQuery("");
    setCategory("Semua kategori");
    setLinkModal(null);
    notify("Demo Link Bio dikembalikan ke data awal.");
  }

  function saveLink(link: BioLink) {
    setLinks((current) => current.some((entry) => entry.id === link.id) ? current.map((entry) => entry.id === link.id ? link : entry) : [link, ...current]);
    setLinkModal(null);
    notify(`${link.title} berhasil disimpan.`);
  }

  function duplicateLink(link: BioLink) {
    const duplicate = { ...link, id: `bio-${Date.now()}`, title: `${link.title} · Duplikat`, clicks: 0, enabled: false, pinned: false };
    setLinks((current) => [...current, duplicate]);
    notify(`${duplicate.title} dibuat sebagai tautan nonaktif.`);
  }

  function deleteLink(link: BioLink) {
    setLinks((current) => current.filter((entry) => entry.id !== link.id));
    notify(`${link.title} dihapus dari halaman.`);
  }

  function toggleLink(link: BioLink) {
    setLinks((current) => current.map((entry) => entry.id === link.id ? { ...entry, enabled: !entry.enabled } : entry));
    notify(`${link.title} ${link.enabled ? "disembunyikan" : "ditampilkan"}.`);
  }

  function moveLink(link: BioLink, direction: "up" | "down") {
    setLinks((current) => {
      const index = current.findIndex((entry) => entry.id === link.id);
      const target = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    notify("Urutan tautan diperbarui.");
  }

  function shareLink() {
    const publicUrl = "https://link.nempo.id/kopinempo";
    navigator.clipboard?.writeText(publicUrl).catch(() => undefined);
    notify("Link halaman disalin ke clipboard.");
  }

  function exportAnalytics() {
    const rows = [
      ["Periode", "Views", "Klik", "CTR"],
      ...analyticsData.map((entry) => [entry.label, entry.views, entry.clicks, percent((entry.clicks / entry.views) * 100)]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nempo-link-bio-analytics.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Laporan analitik berhasil diekspor.");
  }

  const visibleLinks = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return links.filter((link) => (!needle || `${link.title} ${link.url} ${link.description}`.toLowerCase().includes(needle)) && (category === "Semua kategori" || link.category === category));
  }, [category, links, query]);
  const activeLinks = links.filter((link) => link.enabled);
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const totalViews = analyticsData.reduce((sum, entry) => sum + entry.views, 0);
  const totalChartClicks = analyticsData.reduce((sum, entry) => sum + entry.clicks, 0);
  const pageTitle = navItems.find((item) => item.id === activeView)?.label ?? "Ringkasan";

  return (
    <Layout>
      <SEO title="Link Bio Demo — Digi Nempo" description="Demo Link Bio Digi Nempo untuk mengelola profil, tautan, tampilan, dan analitik dalam satu halaman publik." keywords="Link Bio, digital profile, link in bio, analitik tautan, Digi Nempo" path="/digital-services/link-bio" />
      <main className="nempo-demo-green nempo-link-bio-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1480px] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link href="/digital-services/super-app?module=link-bio" className="inline-flex items-center gap-2 text-[10px] font-black text-[#648084] hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Business Super App</Link>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><span className="h-2 w-2 rounded-full bg-[#1db49f]" /> Demo workspace · data simulasi</div>
          </div>
          <div className="overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_24px_70px_rgba(20,74,77,0.1)]">
            <div className="flex min-h-[790px] flex-col lg:flex-row">
              <aside className="hidden w-[242px] shrink-0 bg-[#123f47] p-4 text-white lg:flex lg:flex-col">
                <div className="flex items-center gap-2.5 border-b border-white/10 px-2 pb-5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0f9b8e]"><Link2 className="h-4 w-4" /></div><div><p className="text-xs font-black">Nempo Link Bio</p><p className="mt-0.5 text-[9px] font-semibold text-white/45">Kopi Nempo · Garut</p></div></div>
                <div className="px-2 pt-6"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#72cfc4]">Digital profile</p><nav className="mt-3 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black transition-colors ${activeView === id ? "bg-white text-[#0f766e]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}{id === "links" && <span className="ml-auto rounded-full bg-[#8bd6cc] px-1.5 py-0.5 text-[8px] text-[#123f47]">{activeLinks.length}</span>}</button>)}</nav></div>
                <div className="mt-auto rounded-2xl bg-white/10 p-3.5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Super App connected</p><p className="mt-2 text-[11px] font-bold leading-4 text-white">Satu link untuk mengarahkan pelanggan ke menu, chat, booking, dan kanal brand.</p><div className="mt-3 flex flex-wrap gap-x-3 gap-y-2"><Link href="/digital-services/qr-menu" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">QR Menu <ArrowRight className="h-3 w-3" /></Link><Link href="/digital-services/crm" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">CRM <ArrowRight className="h-3 w-3" /></Link></div></div>
              </aside>
              <section className="min-w-0 flex-1 bg-[#f8fbfb]">
                <div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kopi Nempo · Digital profile</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{pageTitle}</h1><p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Bangun satu halaman yang rapi untuk mengubah kunjungan menjadi percakapan dan pesanan.</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={shareLink} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Share2 className="h-3.5 w-3.5" /> Bagikan</button><button type="button" onClick={() => setLinkModal("new")} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah tautan</button><button type="button" onClick={resetDemo} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><RefreshCcw className="h-3.5 w-3.5" /> Reset</button></div></div>
                </div>
                <div className="flex flex-wrap items-center gap-2 border-b border-[#e3eeed] bg-[#fbfdfd] px-4 py-2.5 sm:px-6"><span className="mr-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#9aadaf]">Terhubung</span><Link href="/digital-services/qr-menu" className="inline-flex items-center gap-1.5 rounded-lg bg-[#e6f6f3] px-2.5 py-1.5 text-[9px] font-black text-[#0f766e] hover:bg-[#d4efeb]"><QrCode className="h-3 w-3" /> QR Menu <span className="font-semibold text-[#5ca69f]">· katalog</span></Link><Link href="/digital-services/crm" className="inline-flex items-center gap-1.5 rounded-lg bg-[#e6f6f3] px-2.5 py-1.5 text-[9px] font-black text-[#0f766e] hover:bg-[#d4efeb]"><Users className="h-3 w-3" /> CRM <span className="font-semibold text-[#5ca69f]">· pelanggan</span></Link><Link href="/digital-services/marketing" className="inline-flex items-center gap-1.5 rounded-lg bg-[#e6f6f3] px-2.5 py-1.5 text-[9px] font-black text-[#0f766e] hover:bg-[#d4efeb]"><Megaphone className="h-3 w-3" /> Marketing <span className="font-semibold text-[#5ca69f]">· campaign</span></Link><Link href="/digital-services/super-app" className="ml-auto inline-flex items-center gap-1 text-[9px] font-black text-[#648084] hover:text-[#0f766e]"><LayoutDashboard className="h-3 w-3" /> Business OS <ArrowRight className="h-3 w-3" /></Link></div>
                <div className="flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white px-4 py-2 lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b]"}`}><Icon className="h-3 w-3" />{label}</button>)}</div>
                <div className="p-4 sm:p-6">
                  {activeView === "overview" && <OverviewView profile={profile} links={links} totalClicks={totalClicks} totalViews={totalViews} totalChartClicks={totalChartClicks} theme={theme} buttonStyle={buttonStyle} onView={setActiveView} onEditProfile={() => setActiveView("profile")} onAddLink={() => setLinkModal("new")} onNotify={notify} />}
                  {activeView === "profile" && <ProfileView profile={profile} onSave={(next) => { setProfile(next); notify("Profil halaman berhasil diperbarui."); }} />}
                  {activeView === "links" && <LinksView links={visibleLinks} allLinks={links} query={query} setQuery={setQuery} category={category} setCategory={setCategory} onAdd={() => setLinkModal("new")} onEdit={setLinkModal} onDuplicate={duplicateLink} onDelete={deleteLink} onToggle={toggleLink} onMove={moveLink} />}
                  {activeView === "appearance" && <AppearanceView profile={profile} links={activeLinks} theme={theme} setTheme={setTheme} buttonStyle={buttonStyle} setButtonStyle={setButtonStyle} onNotify={notify} />}
                  {activeView === "analytics" && <AnalyticsView totalViews={totalViews} totalClicks={totalChartClicks} links={links} onExport={exportAnalytics} />}
                </div>
              </section>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]"><span>Data simulasi untuk kebutuhan presentasi customer.</span><span className="hidden items-center gap-1 sm:inline-flex"><MousePointerClick className="h-3 w-3" /> Statistik halaman publik</span></div>
        </div>
        {linkModal && <LinkModal link={linkModal === "new" ? null : linkModal} onClose={() => setLinkModal(null)} onSubmit={saveLink} />}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f47] px-4 py-3 text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8bd6cc]" /> {toast}</div>}
      </main>
    </Layout>
  );
}

function OverviewView({ profile, links, totalClicks, totalViews, totalChartClicks, theme, buttonStyle, onView, onEditProfile, onAddLink, onNotify }: { profile: BioProfile; links: BioLink[]; totalClicks: number; totalViews: number; totalChartClicks: number; theme: BioTheme; buttonStyle: BioButtonStyle; onView: (view: BioView) => void; onEditProfile: () => void; onAddLink: () => void; onNotify: (message: string) => void }) {
  const activeLinks = links.filter((link) => link.enabled);
  const ctr = totalViews ? (totalChartClicks / totalViews) * 100 : 0;
  return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={Eye} label="Profile views" value={formatNumber(totalViews)} detail="+18,4% dari minggu lalu" tone="teal" /><MetricCard icon={MousePointerClick} label="Total klik" value={formatNumber(totalChartClicks)} detail={`${percent(ctr)} click-through rate`} tone="blue" /><MetricCard icon={Link2} label="Tautan aktif" value={`${activeLinks.length} link`} detail={`${links.length} link tersimpan`} tone="violet" /><MetricCard icon={TrendingUp} label="Klik teratas" value={formatNumber(Math.max(...links.map((link) => link.clicks)))} detail="Pesan meja & reservasi" tone="amber" /></div><div className="grid gap-4 xl:grid-cols-[.85fr_1.15fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Public profile</p><h2 className="mt-2 text-lg font-black text-[#244950]">Satu halaman untuk semua kanal.</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">Pastikan pelanggan menemukan tujuan yang paling penting dalam satu klik.</p></div><Globe2 className="h-5 w-5 text-[#0f766e]" /></div><div className="mt-5 flex justify-center"><BioPreview profile={profile} links={activeLinks.slice(0, 4)} theme={theme} buttonStyle={buttonStyle} compact onLink={(link) => onNotify(`${link.title} dibuka dari preview.`)} /></div><div className="mt-4 flex gap-2"><button type="button" onClick={onEditProfile} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#dcebea] px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Pencil className="h-3.5 w-3.5" /> Edit profil</button><button type="button" onClick={onAddLink} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah tautan</button></div></section><section className="space-y-4"><div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Top links</p><h2 className="mt-1 text-sm font-black text-[#244950]">Tujuan yang paling banyak dipilih.</h2></div><button type="button" onClick={() => onView("analytics")} className="text-[10px] font-black text-[#0f766e]">Lihat analitik</button></div><div className="mt-4 space-y-2">{[...links].sort((a, b) => b.clicks - a.clicks).slice(0, 4).map((link, index) => <div key={link.id} className="flex items-center gap-3 rounded-xl border border-[#edf3f2] p-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6f6f3] text-[10px] font-black text-[#0f766e]">0{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{link.title}</p><p className="mt-1 truncate text-[9px] text-[#94a8aa]">{link.url}</p></div><div className="text-right"><p className="text-[10px] font-black text-[#365b60]">{formatNumber(link.clicks)}</p><p className="mt-1 text-[9px] font-semibold text-[#0f766e]">klik</p></div></div>)}</div></div><div className="rounded-2xl border border-[#e3eeed] bg-[#123f47] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Profile insight</p><h2 className="mt-2 text-lg font-black leading-tight">Bio ringkas, arah jelas.</h2></div><Sparkles className="h-5 w-5 text-[#8bd6cc]" /></div><p className="mt-3 text-[10px] leading-5 text-white/60">Link Bio mengumpulkan katalog, chat, lokasi, dan promosi tanpa membuat pelanggan berpindah-pindah kanal.</p><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">CTR halaman</p><p className="mt-1 text-xl font-black">{percent(ctr)}</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Link aktif</p><p className="mt-1 text-xl font-black">{activeLinks.length}</p></div></div><button type="button" onClick={() => onView("appearance")} className="mt-5 flex items-center gap-1.5 text-[10px] font-black text-[#a2e7df]">Atur tampilan halaman <ArrowRight className="h-3 w-3" /></button></div></section></div><div className="grid gap-3 md:grid-cols-3"><QuickLink icon={Link2} title="Kelola tautan" detail="Atur urutan, kategori, dan status" onClick={() => onView("links")} /><QuickLink icon={Palette} title="Atur tampilan" detail="Gunakan identitas Super App" onClick={() => onView("appearance")} /><QuickLink icon={BarChart3} title="Baca performa" detail="Views, klik, dan sumber trafik" onClick={() => onView("analytics")} /></div></div>;
}

function ProfileView({ profile, onSave }: { profile: BioProfile; onSave: (profile: BioProfile) => void }) {
  const [draft, setDraft] = useState(profile);
  return <div className="space-y-4"><SectionIntro eyebrow="Profile identity" title="Profil halaman" description="Buat pengunjung langsung memahami siapa kamu, apa yang kamu tawarkan, dan di mana mereka bisa menemukanmu." /><div className="grid gap-4 lg:grid-cols-[1fr_.8fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama bisnis"><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className={fieldClass} /></Field><Field label="Username halaman"><div className="flex items-center"><span className="rounded-l-xl border border-r-0 border-[#dcebea] bg-[#f4f9f8] px-3 py-2.5 text-xs font-black text-[#8aa1a3]">link.nempo.id/</span><input value={draft.handle} onChange={(event) => setDraft({ ...draft, handle: event.target.value.replace(/\s/g, "-").toLowerCase() })} className={`${fieldClass} rounded-l-none`} /></div></Field></div><Field label="Bio singkat"><textarea rows={4} value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} className={fieldClass} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Lokasi"><div className="relative"><MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8aa1a3]" /><input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} className={`${fieldClass} pl-9`} /></div></Field><Field label="Inisial avatar"><input maxLength={3} value={draft.initials} onChange={(event) => setDraft({ ...draft, initials: event.target.value.toUpperCase() })} className={fieldClass} /></Field></div><div className="flex justify-end pt-2"><button type="button" onClick={() => onSave(draft)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-4 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Check className="h-3.5 w-3.5" /> Simpan profil</button></div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Live preview</p><div className="mt-4 flex justify-center"><BioPreview profile={draft} links={initialLinks.filter((link) => link.enabled).slice(0, 4)} theme="teal" buttonStyle="rounded" compact={false} /></div></section></div></div>;
}

function LinksView({ links, allLinks, query, setQuery, category, setCategory, onAdd, onEdit, onDuplicate, onDelete, onToggle, onMove }: { links: BioLink[]; allLinks: BioLink[]; query: string; setQuery: (value: string) => void; category: (typeof categories)[number]; setCategory: (value: (typeof categories)[number]) => void; onAdd: () => void; onEdit: (link: BioLink) => void; onDuplicate: (link: BioLink) => void; onDelete: (link: BioLink) => void; onToggle: (link: BioLink) => void; onMove: (link: BioLink, direction: "up" | "down") => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Link library" title="Kelola tautan" description="Susun tujuan penting, aktifkan campaign, dan arahkan pelanggan ke kanal yang paling relevan." /><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah tautan</button></div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex flex-col gap-3 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari judul, URL, atau deskripsi..." className="w-full rounded-xl border border-[#dcebea] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#0f766e]" /></div><select value={category} onChange={(event) => setCategory(event.target.value as (typeof categories)[number])} className={filterClass}>{categories.map((option) => <option key={option}>{option}</option>)}</select></div><div className="mt-4 flex items-center justify-between text-[9px] font-bold text-[#94a8aa]"><span>Menampilkan {links.length} dari {allLinks.length} tautan</span><span className="inline-flex items-center gap-1 text-[#0f766e]"><CheckCircle2 className="h-3 w-3" /> {allLinks.filter((link) => link.enabled).length} aktif di halaman</span></div></div><div className="space-y-2">{links.map((link, index) => <LinkRow key={link.id} link={link} index={index} total={allLinks.length} onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} onToggle={onToggle} onMove={onMove} />)}{!links.length && <EmptyState label="Tautan tidak ditemukan. Coba ubah kata kunci atau kategori." />}</div></div>;
}

function LinkRow({ link, index, total, onEdit, onDuplicate, onDelete, onToggle, onMove }: { link: BioLink; index: number; total: number; onEdit: (link: BioLink) => void; onDuplicate: (link: BioLink) => void; onDelete: (link: BioLink) => void; onToggle: (link: BioLink) => void; onMove: (link: BioLink, direction: "up" | "down") => void }) {
  return <article className={`rounded-2xl border bg-white p-4 transition-colors ${link.enabled ? "border-[#e3eeed]" : "border-dashed border-[#d7e3e1] opacity-70"}`}><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><LinkIcon type={link.icon} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xs font-black text-[#365b60]">{link.title}</h2><span className="rounded-full bg-[#f4f9f8] px-2 py-1 text-[8px] font-black text-[#648084]">{link.category}</span>{link.pinned && <span className="rounded-full bg-[#e6f6f3] px-2 py-1 text-[8px] font-black text-[#0f766e]">Pinned</span>}</div><p className="mt-1 truncate text-[10px] font-semibold text-[#648084]">{link.url}</p><p className="mt-1 text-[9px] text-[#94a8aa]">{link.description}</p></div><button type="button" onClick={() => onToggle(link)} className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${link.enabled ? "bg-[#0f766e]" : "bg-[#cbdad7]"}`} aria-label={link.enabled ? `Sembunyikan ${link.title}` : `Tampilkan ${link.title}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${link.enabled ? "left-5" : "left-1"}`} /></button></div><div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf3f2] pt-3"><span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-[#94a8aa]"><MousePointerClick className="h-3 w-3" /> {formatNumber(link.clicks)} klik</span><div className="flex flex-wrap gap-1.5"><button type="button" onClick={() => onMove(link, "up")} disabled={index === 0} className="grid h-8 w-8 place-items-center rounded-lg border border-[#dcebea] text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e] disabled:opacity-30" aria-label="Naikkan urutan"><ChevronUp className="h-3.5 w-3.5" /></button><button type="button" onClick={() => onMove(link, "down")} disabled={index === total - 1} className="grid h-8 w-8 place-items-center rounded-lg border border-[#dcebea] text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e] disabled:opacity-30" aria-label="Turunkan urutan"><ChevronDown className="h-3.5 w-3.5" /></button><button type="button" onClick={() => onEdit(link)} className="grid h-8 w-8 place-items-center rounded-lg border border-[#dcebea] text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]" aria-label={`Edit ${link.title}`}><Pencil className="h-3.5 w-3.5" /></button><button type="button" onClick={() => onDuplicate(link)} className="grid h-8 w-8 place-items-center rounded-lg border border-[#dcebea] text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]" aria-label={`Duplikat ${link.title}`}><Copy className="h-3.5 w-3.5" /></button><button type="button" onClick={() => onDelete(link)} className="grid h-8 w-8 place-items-center rounded-lg border border-[#f0d8d4] text-[#b75c54] hover:bg-[#fff8f5]" aria-label={`Hapus ${link.title}`}><Trash2 className="h-3.5 w-3.5" /></button></div></div></article>;
}

function AppearanceView({ profile, links, theme, setTheme, buttonStyle, setButtonStyle, onNotify }: { profile: BioProfile; links: BioLink[]; theme: BioTheme; setTheme: (value: BioTheme) => void; buttonStyle: BioButtonStyle; setButtonStyle: (value: BioButtonStyle) => void; onNotify: (message: string) => void }) {
  return <div className="space-y-4"><SectionIntro eyebrow="Brand system" title="Tampilan halaman" description="Gunakan identitas Super App yang bersih dan mudah dibaca, lalu lihat perubahan secara langsung di preview." /><div className="grid gap-4 xl:grid-cols-[.85fr_1.15fr]"><section className="space-y-4 rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div><p className="text-[10px] font-black text-[#365b60]">Warna halaman</p><p className="mt-1 text-[9px] leading-4 text-[#94a8aa]">Palet operasional Nempo menjaga CTA tetap fokus tanpa mengalahkan konten.</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{([{ id: "teal", label: "Super App Teal", detail: "Primary #0f766e", color: "#0f766e" }, { id: "mist", label: "Teal Mist", detail: "Soft surface #e6f6f3", color: "#e6f6f3" }] as Array<{ id: BioTheme; label: string; detail: string; color: string }>).map((option) => <button key={option.id} type="button" onClick={() => setTheme(option.id)} className={`flex items-center gap-3 rounded-xl border p-3 text-left ${theme === option.id ? "border-[#56b8ae] bg-[#f4fbfa]" : "border-[#e3eeed]"}`}><span className="h-8 w-8 rounded-lg border border-white shadow-sm" style={{ backgroundColor: option.color }} /><span><span className="block text-[10px] font-black text-[#365b60]">{option.label}</span><span className="mt-1 block text-[9px] text-[#94a8a3]">{option.detail}</span></span>{theme === option.id && <CheckCircle2 className="ml-auto h-4 w-4 text-[#0f766e]" />}</button>)}</div></div><div className="border-t border-[#edf3f2] pt-4"><p className="text-[10px] font-black text-[#365b60]">Gaya tombol</p><div className="mt-3 grid grid-cols-2 gap-2">{([{ id: "rounded", label: "Rounded", detail: "CTA tegas dan akrab" }, { id: "soft", label: "Soft", detail: "Lebih ringan dan tenang" }] as Array<{ id: BioButtonStyle; label: string; detail: string }>).map((option) => <button key={option.id} type="button" onClick={() => setButtonStyle(option.id)} className={`rounded-xl border p-3 text-left ${buttonStyle === option.id ? "border-[#56b8ae] bg-[#f4fbfa]" : "border-[#e3eeed]"}`}><span className="block text-[10px] font-black text-[#365b60]">{option.label}</span><span className="mt-1 block text-[9px] text-[#94a8aa]">{option.detail}</span></button>)}</div></div><div className="rounded-xl border border-[#b9ded8] bg-[#f4fbfa] p-3"><div className="flex items-start gap-2.5"><Palette className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" /><p className="text-[10px] leading-5 text-[#648084]">Warna status seperti alert dan error tetap memakai semantic amber atau red. Warna brand utama halaman tetap berada di dalam sistem Super App.</p></div></div><button type="button" onClick={() => onNotify("Tampilan Link Bio siap dipublikasikan.")} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-4 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Check className="h-3.5 w-3.5" /> Simpan tampilan</button></section><div className="flex justify-center rounded-2xl border border-[#e3eeed] bg-[#f1f7f6] p-5 sm:p-8"><BioPreview profile={profile} links={links} theme={theme} buttonStyle={buttonStyle} compact={false} onLink={() => onNotify("Preview tautan dibuka.")} /></div></div></div>;
}

function AnalyticsView({ totalViews, totalClicks, links, onExport }: { totalViews: number; totalClicks: number; links: BioLink[]; onExport: () => void }) {
  const maxViews = Math.max(...analyticsData.map((entry) => entry.views));
  const ctr = totalViews ? (totalClicks / totalViews) * 100 : 0;
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Profile intelligence" title="Analitik halaman" description="Baca performa halaman, temukan tautan teratas, dan gunakan data untuk memperbaiki CTA." /><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export CSV</button></div><div className="grid gap-3 sm:grid-cols-3"><MetricCard icon={Eye} label="Views 7 hari" value={formatNumber(totalViews)} detail="+18,4% vs periode lalu" tone="teal" /><MetricCard icon={MousePointerClick} label="Klik 7 hari" value={formatNumber(totalClicks)} detail={`${percent(ctr)} CTR halaman`} tone="blue" /><MetricCard icon={TrendingUp} label="Tautan terbaik" value="Reservasi" detail="842 klik" tone="violet" /></div><div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Views & klik</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Performa 7 hari terakhir</p></div><BarChart3 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-6 flex h-52 items-end gap-2 border-b border-l border-[#edf3f2] px-1 sm:gap-4">{analyticsData.map((entry) => <div key={entry.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="flex h-full w-full max-w-10 items-end gap-1"><span className="link-bio-chart-bar w-1/2 rounded-t-md bg-[#a9dcd6]" style={{ height: `${(entry.views / maxViews) * 100}%` }} /><span className="link-bio-chart-bar w-1/2 rounded-t-md bg-[#0f766e]" style={{ height: `${(entry.clicks / maxViews) * 100}%` }} /></div><span className="text-[9px] font-bold text-[#a2b3b4]">{entry.label}</span></div>)}</div><div className="mt-4 flex flex-wrap gap-4 text-[9px] font-bold text-[#648084]"><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[#a9dcd6]" /> Views</span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[#0f766e]" /> Klik</span></div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Klik per tautan</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Urutan berdasarkan performa</p></div><Link2 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-5 space-y-3">{[...links].sort((a, b) => b.clicks - a.clicks).slice(0, 5).map((link) => <div key={link.id}><div className="flex items-center justify-between gap-3 text-[10px]"><span className="truncate font-black text-[#365b60]">{link.title}</span><span className="shrink-0 font-black text-[#0f766e]">{formatNumber(link.clicks)}</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#edf3f2]"><div className="h-full rounded-full bg-[#0f766e]" style={{ width: `${Math.max(8, (link.clicks / Math.max(...links.map((entry) => entry.clicks))) * 100)}%` }} /></div></div>)}</div></section></div><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="text-sm font-black text-[#244950]">Sumber kunjungan</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Channel yang membawa orang ke halaman Link Bio</p></div><CircleAlert className="h-4 w-4 text-[#b97820]" /></div><div className="mt-4 grid gap-2 sm:grid-cols-3"><div className="rounded-xl bg-[#f4fbfa] p-3"><p className="text-[9px] font-semibold text-[#94a8aa]">Instagram</p><p className="mt-1 text-lg font-black text-[#365b60]">62%</p><p className="mt-1 text-[9px] font-bold text-[#0f766e]">+8,4% minggu ini</p></div><div className="rounded-xl bg-[#f4fbfa] p-3"><p className="text-[9px] font-semibold text-[#94a8aa]">WhatsApp</p><p className="mt-1 text-lg font-black text-[#365b60]">24%</p><p className="mt-1 text-[9px] font-bold text-[#0f766e]">+4,1% minggu ini</p></div><div className="rounded-xl bg-[#fffaf1] p-3"><p className="text-[9px] font-semibold text-[#94a8aa]">QR Menu</p><p className="mt-1 text-lg font-black text-[#365b60]">14%</p><p className="mt-1 text-[9px] font-bold text-[#b97820]">Perlu dipromosikan</p></div></div></section></div>;
}

function BioPreview({ profile, links, theme, buttonStyle, compact, onLink }: { profile: BioProfile; links: BioLink[]; theme: BioTheme; buttonStyle: BioButtonStyle; compact?: boolean; onLink?: (link: BioLink) => void }) {
  const isMist = theme === "mist";
  return <div className={`link-bio-phone w-full max-w-[292px] overflow-hidden border border-[#d7e5e2] p-4 shadow-[0_18px_45px_rgba(20,74,77,0.12)] ${compact ? "scale-[.88]" : ""} ${isMist ? "bg-[#e6f6f3]" : "bg-[#f8fbfb]"}`}><div className="flex items-center justify-between"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#0f766e] text-[10px] font-black text-white">{profile.initials || "KN"}</span><button type="button" aria-label="Opsi halaman" className="grid h-7 w-7 place-items-center rounded-full bg-white/70 text-[#648084]"><Settings2 className="h-3.5 w-3.5" /></button></div><div className="mt-3 text-center"><h3 className="text-sm font-black text-[#183b43]">{profile.name}</h3><p className="mt-1 text-[9px] font-bold text-[#0f766e]">@{profile.handle}</p><p className="mx-auto mt-2 max-w-[230px] text-[9px] leading-4 text-[#648084]">{profile.bio}</p><p className="mt-2 inline-flex items-center gap-1 text-[8px] font-semibold text-[#8aa1a3]"><MapPin className="h-3 w-3" /> {profile.location}</p></div><div className="mt-4 space-y-2">{links.map((link) => <button key={link.id} type="button" onClick={() => onLink?.(link)} className={`flex w-full items-center gap-2.5 border border-[#dcebea] bg-white px-3 py-2.5 text-left transition-colors hover:border-[#56b8ae] hover:bg-[#f4fbfa] ${buttonStyle === "rounded" ? "rounded-xl" : "rounded-lg"}`}><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#e6f6f3] text-[#0f766e]"><LinkIcon type={link.icon} /></span><span className="min-w-0 flex-1"><span className="block truncate text-[9px] font-black text-[#365b60]">{link.title}</span><span className="mt-0.5 block truncate text-[8px] text-[#94a8aa]">{link.description}</span></span><ExternalLink className="h-3 w-3 shrink-0 text-[#9aadaf]" /></button>)}</div><div className="mt-4 flex items-center justify-center gap-3 border-t border-[#dcebea] pt-3 text-[#8aa1a3]"><span className="text-[8px] font-black">NEMPO</span><span className="h-1 w-1 rounded-full bg-[#8aa1a3]" /><span className="text-[8px] font-semibold">Kunjungi lagi</span></div></div>;
}

function LinkModal({ link, onClose, onSubmit }: { link: BioLink | null; onClose: () => void; onSubmit: (link: BioLink) => void }) {
  const [title, setTitle] = useState(link?.title ?? "");
  const [url, setUrl] = useState(link?.url ?? "https://");
  const [description, setDescription] = useState(link?.description ?? "");
  const [category, setCategory] = useState<BioLinkCategory>(link?.category ?? "Utama");
  const [icon, setIcon] = useState<BioLink["icon"]>(link?.icon ?? "link");
  const [enabled, setEnabled] = useState(link?.enabled ?? true);
  const [pinned, setPinned] = useState(link?.pinned ?? false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onSubmit({ id: link?.id ?? `bio-${Date.now()}`, title: title.trim(), url: url.trim(), description: description.trim() || "Tautan informasi untuk pelanggan.", category, icon, enabled, pinned, clicks: link?.clicks ?? 0 });
  }
  return <ModalShell title={link ? "Edit tautan" : "Tambah tautan"} eyebrow="Link library" onClose={onClose}><form onSubmit={submit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Judul tautan"><input required autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Contoh: Pesan sekarang" className={fieldClass} /></Field><Field label="Kategori"><select value={category} onChange={(event) => setCategory(event.target.value as BioLinkCategory)} className={fieldClass}>{categories.slice(1).map((option) => <option key={option}>{option}</option>)}</select></Field></div><Field label="URL tujuan"><input required type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." className={fieldClass} /></Field><Field label="Deskripsi singkat"><input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Jelaskan tujuan tautan ini." className={fieldClass} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Ikon"><select value={icon} onChange={(event) => setIcon(event.target.value as BioLink["icon"])} className={fieldClass}><option value="link">Link umum</option><option value="menu">Menu / katalog</option><option value="booking">Booking</option><option value="instagram">Instagram</option><option value="whatsapp">WhatsApp</option><option value="maps">Lokasi</option></select></Field><div className="grid grid-cols-2 gap-2"><label className="flex items-center gap-2 rounded-xl border border-[#dcebea] px-3 py-2.5 text-[10px] font-black text-[#648084]"><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} className="accent-[#0f766e]" /> Aktif</label><label className="flex items-center gap-2 rounded-xl border border-[#dcebea] px-3 py-2.5 text-[10px] font-black text-[#648084]"><input type="checkbox" checked={pinned} onChange={(event) => setPinned(event.target.checked)} className="accent-[#0f766e]" /> Pinned</label></div></div><ModalActions onClose={onClose} submitLabel={link ? "Simpan perubahan" : "Simpan tautan"} /></form></ModalShell>;
}

function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#183b43]/40 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div role="dialog" aria-modal="true" className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[26px] bg-white p-5 shadow-2xl sm:rounded-[26px] sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0f766e]">{eyebrow}</p><h2 className="mt-2 text-xl font-black text-[#183b43]">{title}</h2></div><button type="button" onClick={onClose} aria-label="Tutup modal" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-6">{children}</div></div></div>;
}

function ModalActions({ onClose, submitLabel }: { onClose: () => void; submitLabel: string }) {
  return <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[10px] font-black text-[#6d878a] hover:bg-[#f4f9f8]">Batal</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]">{submitLabel}</button></div>;
}

function LinkIcon({ type }: { type: BioLink["icon"] }) {
  if (type === "menu") return <Globe2 className="h-3.5 w-3.5" />;
  if (type === "maps") return <MapPin className="h-3.5 w-3.5" />;
  if (type === "whatsapp") return <MessageCircle className="h-3.5 w-3.5" />;
  if (type === "booking") return <Check className="h-3.5 w-3.5" />;
  return <Link2 className="h-3.5 w-3.5" />;
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">{eyebrow}</p><h2 className="mt-1.5 text-lg font-black tracking-tight text-[#244950]">{title}</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">{description}</p></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">{label}</span>{children}</label>;
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: typeof Link2; label: string; value: string; detail: string; tone: "teal" | "blue" | "violet" | "amber" }) {
  const styles = { teal: "bg-[#e6f6f3] text-[#0f766e]", blue: "bg-[#e3eff8] text-[#3a6b9b]", violet: "bg-[#ece9f8] text-[#7362a6]", amber: "bg-[#fff1dc] text-[#a56c2b]" };
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center justify-between"><span className={`grid h-9 w-9 place-items-center rounded-xl ${styles[tone]}`}><Icon className="h-4 w-4" /></span><CheckCircle2 className="h-3.5 w-3.5 text-[#9cb3b5]" /></div><p className="mt-4 text-[10px] font-bold text-[#94a8aa]">{label}</p><p className="mt-1 text-2xl font-black tracking-tight text-[#244950]">{value}</p><p className="mt-1 text-[9px] font-bold text-[#0f766e]">{detail}</p></div>;
}

function QuickLink({ icon: Icon, title, detail, onClick }: { icon: typeof Link2; title: string; detail: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-2xl border border-[#e3eeed] bg-white p-4 text-left transition-colors hover:border-[#b9ded8] hover:bg-[#fbfefe]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Icon className="h-4 w-4" /></span><p className="mt-3 text-[11px] font-black text-[#365b60]">{title}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{detail}</p><ArrowRight className="mt-3 h-3.5 w-3.5 text-[#0f766e]" /></button>;
}

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] py-10 text-center text-xs font-semibold text-[#8aa1a3]">{label}</div>;
}

const filterClass = "rounded-xl border border-[#dcebea] px-3 py-2.5 text-[10px] font-black text-[#648084] outline-none focus:border-[#0f766e]";
const fieldClass = "w-full rounded-xl border border-[#dcebea] bg-[#fbfdfd] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:border-[#0f766e] focus:ring-2 focus:ring-[#b9ded8]";