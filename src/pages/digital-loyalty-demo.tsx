import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BadgePercent,
  BellRing,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Gift,
  LayoutDashboard,
  Lock,
  Megaphone,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  Search,
  Settings2,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@/lib/wouter";
import "./digital-demo-super-app.css";

type LoyaltyView = "overview" | "members" | "rewards" | "campaigns" | "reports";
type MemberTier = "Starter" | "Growth" | "Elite";
type MemberStatus = "Aktif" | "Perlu perhatian" | "Tidak aktif";
type MemberChannel = "Kasir" | "QR Menu" | "WhatsApp" | "Import";

type LoyaltyMember = {
  id: string;
  name: string;
  phone: string;
  tier: MemberTier;
  points: number;
  visits: number;
  spend: number;
  lastVisit: string;
  channel: MemberChannel;
  status: MemberStatus;
};

type LoyaltyReward = {
  id: string;
  title: string;
  detail: string;
  points: number;
  stock: number;
  claimed: number;
  category: "Produk" | "Benefit" | "Voucher";
  active: boolean;
};

type LoyaltyCampaign = {
  id: string;
  title: string;
  audience: string;
  period: string;
  progress: number;
  redemptions: number;
  status: "Aktif" | "Terjadwal" | "Selesai";
  accent: "teal" | "amber" | "blue";
};

const navItems: Array<{ id: LoyaltyView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Ringkasan live", icon: LayoutDashboard },
  { id: "members", label: "Daftar member", icon: Users },
  { id: "rewards", label: "Rewards & benefit", icon: Gift },
  { id: "campaigns", label: "Campaign", icon: Megaphone },
  { id: "reports", label: "Laporan", icon: BarChart3 },
];

const tierOptions: Array<"Semua tier" | MemberTier> = ["Semua tier", "Starter", "Growth", "Elite"];
const tierPoints: Record<MemberTier, number> = { Starter: 0, Growth: 500, Elite: 1500 };

const initialMembers: LoyaltyMember[] = [
  { id: "member-01", name: "Rina Amelia", phone: "0812 7700 4488", tier: "Elite", points: 2240, visits: 18, spend: 2840000, lastVisit: "Hari ini", channel: "QR Menu", status: "Aktif" },
  { id: "member-02", name: "Kedai Tilu", phone: "0813 6221 9021", tier: "Growth", points: 980, visits: 12, spend: 2420000, lastVisit: "Kemarin", channel: "Kasir", status: "Aktif" },
  { id: "member-03", name: "Fajar Nugraha", phone: "0821 9002 1177", tier: "Growth", points: 720, visits: 9, spend: 1180000, lastVisit: "3 hari lalu", channel: "WhatsApp", status: "Aktif" },
  { id: "member-04", name: "Dapur Nusa", phone: "0857 1900 6122", tier: "Starter", points: 320, visits: 7, spend: 980000, lastVisit: "8 hari lalu", channel: "Kasir", status: "Perlu perhatian" },
  { id: "member-05", name: "Maya Salsabila", phone: "0819 4450 2088", tier: "Elite", points: 1880, visits: 21, spend: 3210000, lastVisit: "5 hari lalu", channel: "QR Menu", status: "Aktif" },
  { id: "member-06", name: "Budi Santoso", phone: "0838 7712 0390", tier: "Starter", points: 140, visits: 3, spend: 385000, lastVisit: "22 hari lalu", channel: "Import", status: "Tidak aktif" },
  { id: "member-07", name: "Nadia Putri", phone: "0812 8801 6652", tier: "Growth", points: 640, visits: 10, spend: 1490000, lastVisit: "2 hari lalu", channel: "Kasir", status: "Aktif" },
];

const initialRewards: LoyaltyReward[] = [
  { id: "reward-01", title: "Gratis 1 minuman", detail: "Berlaku untuk minuman regular", points: 250, stock: 42, claimed: 86, category: "Produk", active: true },
  { id: "reward-02", title: "Diskon 20%", detail: "Maksimal potongan Rp50.000", points: 500, stock: 28, claimed: 54, category: "Voucher", active: true },
  { id: "reward-03", title: "Upgrade size gratis", detail: "Untuk semua menu kopi susu", points: 180, stock: 64, claimed: 112, category: "Benefit", active: true },
  { id: "reward-04", title: "Bundling weekend", detail: "2 minuman + 1 pastry", points: 900, stock: 8, claimed: 31, category: "Produk", active: true },
];

const initialCampaigns: LoyaltyCampaign[] = [
  { id: "campaign-01", title: "Double Points Weekend", audience: "Member Growth & Elite", period: "20–22 Sep 2026", progress: 78, redemptions: 86, status: "Aktif", accent: "teal" },
  { id: "campaign-02", title: "Kembali Ngopi", audience: "Member tidak aktif 14+ hari", period: "23–30 Sep 2026", progress: 42, redemptions: 29, status: "Terjadwal", accent: "amber" },
  { id: "campaign-03", title: "Member Anniversary", audience: "Member dengan ulang tahun bulan ini", period: "1–30 Sep 2026", progress: 91, redemptions: 74, status: "Aktif", accent: "blue" },
];

const LOYALTY_PREVIEW_PASSWORD = "nemposukses";
const LOYALTY_PREVIEW_ACCESS_KEY = "nempo_loyalty_preview_access";

function LoyaltyPreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="Loyalty & Membership" description="Masukkan password untuk membuka preview member, points, rewards, campaign, dan laporan retensi pelanggan." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === LOYALTY_PREVIEW_PASSWORD) {
      localStorage.setItem(LOYALTY_PREVIEW_ACCESS_KEY, "1");
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <main className="nempo-demo-green nempo-loyalty-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md border border-[#dcebea] bg-[#fbfdfd] p-6 shadow-[0_22px_70px_rgba(24,59,67,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-lg shadow-teal-800/20"><BadgePercent className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f9b8e]">Live preview</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Nempo Loyalty OS</h1></div>
        </div>
        <p className="text-sm leading-6 text-[#648084]">Masukkan password untuk membuka preview member, points, rewards, campaign, dan laporan retensi pelanggan.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="text" name="username" autoComplete="username" value="loyalty-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
          <label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#b75c54] bg-[#fff8f5]" : "border-[#dcebea] focus-within:border-[#0f766e]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da5a2]"}`} />
            <span className="sr-only">Password live preview Loyalty & Membership</span>
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

export default function DigitalLoyaltyDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <LoyaltyPreviewGate onUnlock={() => setUnlocked(true)} />;
  return <LoyaltyWorkspace />;
}

function LoyaltyWorkspace() {
  const [activeView, setActiveView] = useState<LoyaltyView>("overview");
  const [members, setMembers] = useState(initialMembers);
  const [rewards, setRewards] = useState(initialRewards);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null);
  const [memberModal, setMemberModal] = useState(false);
  const [redeemModal, setRedeemModal] = useState(false);
  const [query, setQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<(typeof tierOptions)[number]>("Semua tier");
  const [toast, setToast] = useState<string | null>(null);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }

  function resetDemo() {
    setActiveView("overview");
    setMembers(initialMembers);
    setRewards(initialRewards);
    setCampaigns(initialCampaigns);
    setSelectedMember(null);
    setQuery("");
    setTierFilter("Semua tier");
    notify("Demo loyalty dikembalikan ke data awal.");
  }

  function addMember(member: LoyaltyMember) {
    setMembers((current) => [member, ...current]);
    setMemberModal(false);
    notify(`${member.name} berhasil ditambahkan sebagai member.`);
  }

  function updateMemberPoints(memberId: string, amount: number) {
    setMembers((current) => current.map((member) => {
      if (member.id !== memberId) return member;
      const points = Math.max(0, member.points + amount);
      const tier = points >= tierPoints.Elite ? "Elite" : points >= tierPoints.Growth ? "Growth" : "Starter";
      return { ...member, points, tier, status: "Aktif" };
    }));
    setSelectedMember((current) => {
      if (!current || current.id !== memberId) return current;
      const points = Math.max(0, current.points + amount);
      const tier = points >= tierPoints.Elite ? "Elite" : points >= tierPoints.Growth ? "Growth" : "Starter";
      return { ...current, points, tier, status: "Aktif" };
    });
    notify(amount > 0 ? `${amount} points ditambahkan.` : `${Math.abs(amount)} points ditukarkan.`);
  }

  function claimReward(memberId: string, rewardId: string) {
    const member = members.find((entry) => entry.id === memberId);
    const reward = rewards.find((entry) => entry.id === rewardId);
    if (!member || !reward) return;
    if (member.points < reward.points) {
      notify("Points member belum cukup untuk reward ini.");
      return;
    }
    if (reward.stock <= 0) {
      notify("Stok reward sedang habis.");
      return;
    }
    updateMemberPoints(memberId, -reward.points);
    setRewards((current) => current.map((entry) => entry.id === rewardId ? { ...entry, stock: entry.stock - 1, claimed: entry.claimed + 1 } : entry));
    setRedeemModal(false);
    notify(`${reward.title} berhasil ditukarkan oleh ${member.name}.`);
  }

  function toggleCampaign(campaignId: string) {
    setCampaigns((current) => current.map((campaign) => campaign.id === campaignId ? { ...campaign, status: campaign.status === "Aktif" ? "Selesai" : "Aktif" } : campaign));
    notify("Status campaign diperbarui.");
  }

  function exportLoyalty() {
    const rows: Array<Array<string | number>> = [["Nama", "Telepon", "Tier", "Points", "Kunjungan", "Total belanja", "Status"], ...members.map((member) => [member.name, member.phone, member.tier, member.points, member.visits, member.spend, member.status])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nempo-loyalty-members.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Data member berhasil diekspor.");
  }

  const filteredMembers = useMemo(() => members.filter((member) => {
    const term = query.trim().toLowerCase();
    const matchesQuery = !term || [member.name, member.phone, member.tier, member.channel].join(" ").toLowerCase().includes(term);
    return matchesQuery && (tierFilter === "Semua tier" || member.tier === tierFilter);
  }), [members, query, tierFilter]);
  const activeMembers = members.filter((member) => member.status === "Aktif").length;
  const totalPoints = members.reduce((sum, member) => sum + member.points, 0);
  const totalRedemptions = rewards.reduce((sum, reward) => sum + reward.claimed, 0);
  const pageTitle = navItems.find((item) => item.id === activeView)?.label ?? "Ringkasan live";

  return (
    <Layout>
      <SEO title="Loyalty & Membership Demo — Digi Nempo" description="Demo Loyalty & Membership Digi Nempo untuk member, points, rewards, campaign, dan laporan retensi pelanggan." keywords="loyalty membership, customer retention, points, rewards, member bisnis, Digi Nempo" path="/digital-services/loyalty" />
      <main className="nempo-demo-green nempo-loyalty-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1480px] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link href="/digital-services/super-app?module=loyalty" className="inline-flex items-center gap-2 text-[10px] font-black text-[#648084] transition-colors hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Business Super App</Link>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><span className="h-2 w-2 rounded-full bg-[#1db49f]" /> Demo workspace · data simulasi</div>
          </div>
          <div className="overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_24px_70px_rgba(20,74,77,0.1)]">
            <div className="flex min-h-[790px] flex-col lg:flex-row">
              <aside className="hidden w-[232px] shrink-0 bg-[#123f47] p-4 text-white lg:flex lg:flex-col">
                <div className="flex items-center gap-2.5 border-b border-white/10 px-2 pb-5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0f9b8e]"><BadgePercent className="h-4 w-4" /></div><div><p className="text-xs font-black">Nempo Loyalty OS</p><p className="mt-0.5 text-[9px] font-semibold text-white/45">Kopi Nempo · Garut</p></div></div>
                <div className="px-2 pt-6"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#72cfc4]">Customer retention</p><nav className="mt-3 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black transition-colors ${activeView === id ? "bg-white text-[#0f766e]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}{id === "members" && <span className="ml-auto rounded-full bg-[#8bd6cc] px-1.5 py-0.5 text-[8px] text-[#123f47]">{members.length}</span>}</button>)}</nav></div>
                <div className="mt-auto rounded-2xl bg-white/10 p-3.5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Super App connected</p><p className="mt-2 text-[11px] font-bold leading-4 text-white">Pelanggan, transaksi, points, dan benefit tumbuh dalam satu alur.</p><div className="mt-3 flex flex-wrap gap-x-3 gap-y-2"><Link href="/digital-services/super-app" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Business OS <ArrowRight className="h-3 w-3" /></Link><Link href="/digital-services/crm" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">CRM <ArrowRight className="h-3 w-3" /></Link></div></div>
              </aside>
              <section className="min-w-0 flex-1 bg-[#f8fbfb]">
                <div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kopi Nempo · Customer retention</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{pageTitle}</h1><p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Bangun kebiasaan kembali dengan member, points, dan benefit yang terukur.</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setRedeemModal(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Gift className="h-3.5 w-3.5" /> Tukar reward</button><button type="button" onClick={() => setMemberModal(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah member</button><button type="button" onClick={resetDemo} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><RefreshCcw className="h-3.5 w-3.5" /> Reset</button></div></div></div>
                <div className="flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white px-4 py-2 lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b]"}`}><Icon className="h-3 w-3" />{label}</button>)}</div>
                <div className="p-4 sm:p-6">
                  {activeView === "overview" && <LoyaltyOverview members={members} rewards={rewards} campaigns={campaigns} activeMembers={activeMembers} totalPoints={totalPoints} totalRedemptions={totalRedemptions} onView={setActiveView} onMember={setSelectedMember} onNotify={notify} />}
                  {activeView === "members" && <MembersView members={filteredMembers} query={query} setQuery={setQuery} tierFilter={tierFilter} setTierFilter={setTierFilter} onAdd={() => setMemberModal(true)} onMember={setSelectedMember} onExport={exportLoyalty} />}
                  {activeView === "rewards" && <RewardsView rewards={rewards} onRedeem={() => setRedeemModal(true)} onNotify={notify} />}
                  {activeView === "campaigns" && <CampaignsView campaigns={campaigns} onToggle={toggleCampaign} onNotify={notify} />}
                  {activeView === "reports" && <LoyaltyReports members={members} rewards={rewards} campaigns={campaigns} onExport={exportLoyalty} />}
                </div>
              </section>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]"><span>Data simulasi untuk kebutuhan presentasi customer.</span><span className="hidden items-center gap-1 sm:inline-flex"><Clock3 className="h-3 w-3" /> Update live · 18 Sep 2026, 09:22</span></div>
        </div>
        {memberModal && <MemberModal members={members} onClose={() => setMemberModal(false)} onSubmit={addMember} />}
        {redeemModal && <RedeemModal members={members} rewards={rewards} onClose={() => setRedeemModal(false)} onSubmit={claimReward} />}
        {selectedMember && <MemberDrawer member={selectedMember} onClose={() => setSelectedMember(null)} onAddPoints={(amount) => updateMemberPoints(selectedMember.id, amount)} onNotify={notify} />}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f47] px-4 py-3 text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8bd6cc]" /> {toast}</div>}
      </main>
    </Layout>
  );
}

function LoyaltyOverview({ members, rewards, campaigns, activeMembers, totalPoints, totalRedemptions, onView, onMember, onNotify }: { members: LoyaltyMember[]; rewards: LoyaltyReward[]; campaigns: LoyaltyCampaign[]; activeMembers: number; totalPoints: number; totalRedemptions: number; onView: (view: LoyaltyView) => void; onMember: (member: LoyaltyMember) => void; onNotify: (message: string) => void }) {
  const tierCounts = (["Starter", "Growth", "Elite"] as MemberTier[]).map((tier) => ({ tier, count: members.filter((member) => member.tier === tier).length }));
  const averageSpend = Math.round(members.reduce((sum, member) => sum + member.spend, 0) / Math.max(members.length, 1));
  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard icon={Users} label="Total member" value={`${members.length}`} detail={`${activeMembers} member aktif`} tone="teal" />
      <MetricCard icon={BadgePercent} label="Points beredar" value={totalPoints.toLocaleString("id-ID")} detail="Siap digunakan member" tone="blue" />
      <MetricCard icon={Gift} label="Reward ditukar" value={`${totalRedemptions}`} detail="Sepanjang periode demo" tone="violet" />
      <MetricCard icon={TrendingUp} label="Rata-rata belanja" value={formatRupiah(averageSpend)} detail="+18,4% dari bulan lalu" tone="amber" />
    </div>
    <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
      <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Member health</p><h2 className="mt-2 text-lg font-black text-[#244950]">Pelanggan punya alasan untuk kembali.</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">Pantau komposisi tier dan momentum retensi dari satu workspace.</p></div><Target className="h-5 w-5 text-[#0f766e]" /></div><div className="mt-5 space-y-4">{tierCounts.map(({ tier, count }) => <div key={tier}><div className="flex items-center justify-between text-[10px]"><span className="font-black text-[#365b60]">{tier} member</span><span className="font-bold text-[#8aa1a3]">{count} orang</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf3f2]"><div className={`h-full rounded-full ${tier === "Elite" ? "bg-[#0f766e]" : tier === "Growth" ? "bg-[#56b8ae]" : "bg-[#a9dcd6]"}`} style={{ width: `${Math.max(14, (count / Math.max(members.length, 1)) * 100)}%` }} /></div></div>)}</div><button type="button" onClick={() => onView("members")} className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-black text-[#0f766e]">Lihat seluruh member <ArrowRight className="h-3 w-3" /></button></section>
      <section className="rounded-2xl border border-[#e3eeed] bg-[#123f47] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Retention insight</p><h2 className="mt-2 text-lg font-black leading-tight">Program loyalty sedang sehat.</h2></div><Sparkles className="h-5 w-5 text-[#8bd6cc]" /></div><p className="mt-3 text-[10px] leading-5 text-white/60">{members.filter((member) => member.status === "Perlu perhatian").length} member perlu diajak kembali. Campaign aktif sudah menjangkau {campaigns.filter((campaign) => campaign.status === "Aktif").length} segmen utama.</p><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Reward aktif</p><p className="mt-1 text-xl font-black">{rewards.filter((reward) => reward.active).length}</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Campaign aktif</p><p className="mt-1 text-xl font-black">{campaigns.filter((campaign) => campaign.status === "Aktif").length}</p></div></div><button type="button" onClick={() => onNotify("Rekomendasi follow-up member siap ditinjau.")} className="mt-5 flex items-center gap-1.5 text-[10px] font-black text-[#a2e7df]">Buka rekomendasi <ArrowRight className="h-3 w-3" /></button></section>
    </div>
    <div className="grid gap-4 lg:grid-cols-3"><QuickAction icon={UserPlus} title="Tambah member" detail="Daftarkan pelanggan baru" onClick={() => onView("members")} /><QuickAction icon={Gift} title="Kelola rewards" detail="Atur hadiah dan benefit" onClick={() => onView("rewards")} /><QuickAction icon={Megaphone} title="Buat campaign" detail="Aktifkan promo personal" onClick={() => onView("campaigns")} /></div>
    <section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Recent members</p><h2 className="mt-1 text-sm font-black text-[#244950]">Member yang baru aktif</h2></div><button type="button" onClick={() => onView("members")} className="text-[10px] font-black text-[#0f766e]">Lihat semua</button></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{members.slice(0, 3).map((member) => <button type="button" key={member.id} onClick={() => onMember(member)} className="flex items-center gap-3 rounded-xl border border-[#edf3f2] p-3 text-left hover:border-[#b9ded8]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e6f6f3] text-[10px] font-black text-[#0f766e]">{initials(member.name)}</span><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-black text-[#365b60]">{member.name}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{member.tier} · {member.points.toLocaleString("id-ID")} points</p></div><ChevronRight className="h-3.5 w-3.5 text-[#9eb4b5]" /></button>)}</div></section>
  </div>;
}

function MembersView({ members, query, setQuery, tierFilter, setTierFilter, onAdd, onMember, onExport }: { members: LoyaltyMember[]; query: string; setQuery: (value: string) => void; tierFilter: (typeof tierOptions)[number]; setTierFilter: (value: (typeof tierOptions)[number]) => void; onAdd: () => void; onMember: (member: LoyaltyMember) => void; onExport: () => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Member management" title="Daftar member" description="Kelola profil pelanggan, tier, points, dan kesehatan hubungan mereka dengan bisnis." /><div className="flex gap-2"><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export</button><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah member</button></div></div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, nomor, tier, atau kanal..." className="w-full rounded-xl border border-[#dcebea] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#0f766e]" /></div><div className="flex gap-1.5 overflow-x-auto">{tierOptions.map((tier) => <button key={tier} type="button" onClick={() => setTierFilter(tier)} className={`shrink-0 rounded-lg px-2.5 py-2 text-[10px] font-black ${tierFilter === tier ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#8aa1a3] hover:bg-[#f2f8f7]"}`}>{tier}</button>)}</div></div></div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead><tr className="border-b border-[#edf3f2] text-[9px] font-black uppercase tracking-[0.12em] text-[#94a8aa]"><th className="pb-3">Member</th><th className="pb-3">Tier</th><th className="pb-3">Points</th><th className="pb-3">Kunjungan</th><th className="pb-3">Belanja</th><th className="pb-3">Terakhir aktif</th><th className="pb-3">Status</th><th className="pb-3" /></tr></thead><tbody className="divide-y divide-[#edf3f2]">{members.map((member) => <tr key={member.id}><td className="py-3"><button type="button" onClick={() => onMember(member)} className="flex items-center gap-2.5 text-left"><span className={`grid h-8 w-8 place-items-center rounded-lg text-[9px] font-black ${tierClass(member.tier)}`}>{initials(member.name)}</span><span><span className="block text-[10px] font-black text-[#365b60]">{member.name}</span><span className="mt-0.5 block text-[9px] text-[#94a8aa]">{member.phone} · {member.channel}</span></span></button></td><td className="py-3"><span className={`rounded-full px-2 py-1 text-[8px] font-black ${tierPill(member.tier)}`}>{member.tier}</span></td><td className="py-3 text-[10px] font-black text-[#0f766e]">{member.points.toLocaleString("id-ID")}</td><td className="py-3 text-[10px] font-semibold text-[#648084]">{member.visits} kali</td><td className="py-3 text-[10px] font-semibold text-[#648084]">{formatRupiah(member.spend)}</td><td className="py-3 text-[10px] text-[#648084]">{member.lastVisit}</td><td className="py-3"><span className={`rounded-full px-2 py-1 text-[8px] font-black ${statusPill(member.status)}`}>{member.status}</span></td><td className="py-3 text-right"><button type="button" onClick={() => onMember(member)} aria-label={`Buka ${member.name}`} className="rounded-lg p-2 text-[#8aa1a3] hover:bg-[#f4f9f8] hover:text-[#0f766e]"><MoreHorizontal className="h-4 w-4" /></button></td></tr>)}</tbody></table></div>{!members.length && <EmptyState label="Member tidak ditemukan." />}</div></div>;
}

function RewardsView({ rewards, onRedeem, onNotify }: { rewards: LoyaltyReward[]; onRedeem: () => void; onNotify: (message: string) => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Rewards catalog" title="Rewards & benefit" description="Buat benefit yang jelas agar member tahu alasan untuk mengumpulkan points dan kembali." /><button type="button" onClick={() => onNotify("Form reward baru dibuka untuk demo.")} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah reward</button></div><div className="grid gap-3 md:grid-cols-2">{rewards.map((reward) => <article key={reward.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Gift className="h-5 w-5" /></span><div><p className="text-xs font-black text-[#365b60]">{reward.title}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{reward.detail}</p></div></div><span className={`rounded-full px-2 py-1 text-[8px] font-black ${reward.stock < 15 ? "bg-[#fff1dd] text-[#a56c2b]" : "bg-[#e6f6f3] text-[#0f766e]"}`}>{reward.stock} tersisa</span></div><div className="mt-5 grid grid-cols-3 gap-2"><MiniMetric label="Harga points" value={`${reward.points}`} /><MiniMetric label="Ditukar" value={`${reward.claimed} kali`} /><MiniMetric label="Kategori" value={reward.category} /></div><div className="mt-4 flex items-center justify-between border-t border-[#edf3f2] pt-3"><span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#8aa1a3]"><Star className="h-3 w-3 text-[#d89a32]" /> Reward aktif</span><button type="button" onClick={onRedeem} className="rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e]">Tukar reward</button></div></article>)}</div></div>;
}

function CampaignsView({ campaigns, onToggle, onNotify }: { campaigns: LoyaltyCampaign[]; onToggle: (campaignId: string) => void; onNotify: (message: string) => void }) {
  const accentClass = { teal: "bg-[#e6f6f3] text-[#0f766e]", amber: "bg-[#fff1dd] text-[#a56c2b]", blue: "bg-[#e3eff8] text-[#3a6b9b]" };
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Retention campaigns" title="Campaign member" description="Rancang promo berdasarkan tier, kebiasaan kunjungan, dan momen pelanggan." /><button type="button" onClick={() => onNotify("Campaign baru siap dikonfigurasi di demo.")} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Buat campaign</button></div><div className="grid gap-3 lg:grid-cols-3">{campaigns.map((campaign) => <article key={campaign.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl ${accentClass[campaign.accent]}`}><Megaphone className="h-4 w-4" /></span><span className={`rounded-full px-2 py-1 text-[8px] font-black ${campaign.status === "Aktif" ? "bg-[#e6f6f3] text-[#0f766e]" : campaign.status === "Terjadwal" ? "bg-[#fff1dd] text-[#a56c2b]" : "bg-[#f1f4f4] text-[#82999b]"}`}>{campaign.status}</span></div><h3 className="mt-4 text-sm font-black text-[#365b60]">{campaign.title}</h3><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{campaign.audience}</p><p className="mt-3 text-[9px] font-black uppercase tracking-[0.1em] text-[#0f9b8e]">{campaign.period}</p><div className="mt-4 flex items-center justify-between text-[9px]"><span className="font-bold text-[#8aa1a3]">Progress campaign</span><span className="font-black text-[#365b60]">{campaign.progress}%</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#edf3f2]"><div className="h-full rounded-full bg-[#0f766e]" style={{ width: `${campaign.progress}%` }} /></div><div className="mt-4 flex items-center justify-between border-t border-[#edf3f2] pt-3"><span className="text-[9px] font-semibold text-[#8aa1a3]">{campaign.redemptions} redemption</span><button type="button" onClick={() => onToggle(campaign.id)} className="rounded-lg border border-[#dcebea] px-2.5 py-2 text-[9px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]">{campaign.status === "Aktif" ? "Selesaikan" : "Aktifkan"}</button></div></article>)}</div></div>;
}

function LoyaltyReports({ members, rewards, campaigns, onExport }: { members: LoyaltyMember[]; rewards: LoyaltyReward[]; campaigns: LoyaltyCampaign[]; onExport: () => void }) {
  const bars = [42, 56, 51, 68, 63, 82, 76];
  const avgVisits = (members.reduce((sum, member) => sum + member.visits, 0) / Math.max(members.length, 1)).toFixed(1);
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Loyalty intelligence" title="Laporan retensi" description="Baca kesehatan member, penggunaan benefit, dan performa campaign untuk mengambil keputusan berikutnya." /><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export laporan</button></div><div className="grid gap-3 sm:grid-cols-3"><SmallMetric icon={Users} label="Member aktif" value={`${members.filter((member) => member.status === "Aktif").length} orang`} /><SmallMetric icon={TrendingUp} label="Rata-rata kunjungan" value={`${avgVisits} kali`} /><SmallMetric icon={Gift} label="Reward tersedia" value={`${rewards.reduce((sum, reward) => sum + reward.stock, 0)} unit`} /></div><div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Aktivitas member</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Simulasi transaksi loyalty 7 hari terakhir</p></div><BarChart3 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-l border-[#edf3f2] px-1">{bars.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className={`loyalty-report-bar w-full max-w-[34px] rounded-t-lg ${index === bars.length - 1 ? "bg-[#0f766e]" : "bg-[#a9dcd6]"}`} style={{ height: `${value}%` }} /><span className="text-[9px] font-bold text-[#a2b3b4]">H-{6 - index}</span></div>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Performa campaign</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Redemption per campaign aktif</p></div><Target className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-5 space-y-3">{campaigns.map((campaign) => <div key={campaign.id}><div className="flex items-center justify-between text-[10px]"><span className="max-w-[70%] truncate font-bold text-[#648084]">{campaign.title}</span><span className="font-black text-[#365b60]">{campaign.redemptions}</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#edf3f2]"><div className="h-full rounded-full bg-[#56b8ae]" style={{ width: `${Math.min(campaign.redemptions, 100)}%` }} /></div></div>)}</div></section></div><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Nilai per tier</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Perbandingan kontribusi member terhadap bisnis</p></div><FileSpreadsheet className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{(["Starter", "Growth", "Elite"] as MemberTier[]).map((tier) => { const tierMembers = members.filter((member) => member.tier === tier); const spend = tierMembers.reduce((sum, member) => sum + member.spend, 0); return <div key={tier} className="rounded-xl bg-[#f4fbfa] p-3"><p className="text-[9px] font-semibold text-[#6d878a]">{tier} member</p><p className="mt-1 text-lg font-black text-[#0f766e]">{tierMembers.length} orang</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{formatRupiah(spend)} total belanja</p></div>; })}</div></section></div>;
}

function MemberModal({ members, onClose, onSubmit }: { members: LoyaltyMember[]; onClose: () => void; onSubmit: (member: LoyaltyMember) => void }) {
  return <ModalShell title="Tambah member baru" eyebrow="Member management" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const name = String(form.get("name") || "").trim(); const phone = String(form.get("phone") || "").trim(); if (!name || !phone) return; onSubmit({ id: `member-${Date.now()}`, name, phone, tier: "Starter", points: 0, visits: 0, spend: 0, lastVisit: "Baru terdaftar", channel: "Kasir", status: "Aktif" }); }} className="space-y-4"><Field label="Nama pelanggan"><input name="name" required autoFocus placeholder="Contoh: Intan Permata" className={fieldClass} /></Field><Field label="Nomor WhatsApp"><input name="phone" required placeholder="08xx xxxx xxxx" className={fieldClass} /></Field><div className="rounded-xl border border-[#dcebea] bg-[#f4fbfa] p-3"><p className="text-[10px] font-black text-[#365b60]">Member baru dimulai dari tier Starter</p><p className="mt-1 text-[9px] font-semibold leading-4 text-[#94a8aa]">Points dapat bertambah otomatis dari transaksi kasir, QR Menu, atau campaign.</p></div><ModalActions onClose={onClose} submitLabel="Simpan member" /></form></ModalShell>;
}

function RedeemModal({ members, rewards, onClose, onSubmit }: { members: LoyaltyMember[]; rewards: LoyaltyReward[]; onClose: () => void; onSubmit: (memberId: string, rewardId: string) => void }) {
  const [memberId, setMemberId] = useState(members[0]?.id ?? "");
  const [rewardId, setRewardId] = useState(rewards[0]?.id ?? "");
  const member = members.find((entry) => entry.id === memberId);
  const reward = rewards.find((entry) => entry.id === rewardId);
  return <ModalShell title="Tukar reward member" eyebrow="Rewards & benefit" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); onSubmit(memberId, rewardId); }} className="space-y-4"><Field label="Pilih member"><select value={memberId} onChange={(event) => setMemberId(event.target.value)} className={fieldClass}>{members.map((entry) => <option key={entry.id} value={entry.id}>{entry.name} · {entry.points.toLocaleString("id-ID")} points</option>)}</select></Field><Field label="Pilih reward"><select value={rewardId} onChange={(event) => setRewardId(event.target.value)} className={fieldClass}>{rewards.filter((entry) => entry.active).map((entry) => <option key={entry.id} value={entry.id}>{entry.title} · {entry.points} points</option>)}</select></Field><div className="grid grid-cols-2 gap-2"><MiniMetric label="Saldo member" value={`${member?.points.toLocaleString("id-ID") ?? 0} points`} /><MiniMetric label="Harga reward" value={`${reward?.points ?? 0} points`} /></div>{member && reward && member.points < reward.points && <p className="rounded-xl bg-[#fff1dd] p-3 text-[10px] font-semibold text-[#a56c2b]">Saldo points belum cukup. Pilih reward lain atau tambahkan points melalui detail member.</p>}<ModalActions onClose={onClose} submitLabel="Konfirmasi penukaran" /></form></ModalShell>;
}

function MemberDrawer({ member, onClose, onAddPoints, onNotify }: { member: LoyaltyMember; onClose: () => void; onAddPoints: (amount: number) => void; onNotify: (message: string) => void }) {
  return <div className="fixed inset-0 z-[75] flex justify-end bg-[#123f47]/30 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside role="dialog" aria-modal="true" className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className={`grid h-12 w-12 place-items-center rounded-2xl text-sm font-black ${tierClass(member.tier)}`}>{initials(member.name)}</span><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Detail member</p><h2 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{member.name}</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{member.phone} · {member.channel}</p></div></div><button type="button" onClick={onClose} aria-label="Tutup detail member" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-6 rounded-2xl bg-[#123f47] p-5 text-white"><p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8bd6cc]">Saldo loyalty</p><p className="mt-2 text-4xl font-black">{member.points.toLocaleString("id-ID")} <span className="text-xs font-bold text-white/55">points</span></p><div className="mt-4 flex items-center justify-between"><span className={`rounded-full px-2.5 py-1 text-[9px] font-black ${member.tier === "Elite" ? "bg-[#b8eee7] text-[#0b625c]" : "bg-white/10 text-white"}`}>{member.tier}</span><span className="text-[9px] font-semibold text-white/55">{member.visits} kunjungan</span></div></div><div className="mt-4 grid grid-cols-2 gap-2"><MiniMetric label="Total belanja" value={formatRupiah(member.spend)} /><MiniMetric label="Terakhir aktif" value={member.lastVisit} /><MiniMetric label="Status" value={member.status} /><MiniMetric label="Next tier" value={member.tier === "Elite" ? "Maksimal" : `${Math.max(0, tierPoints[member.tier === "Starter" ? "Growth" : "Elite"] - member.points)} points`} /></div><div className="mt-6"><p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6d878a]">Aksi points</p><div className="mt-2 grid grid-cols-2 gap-2"><button type="button" onClick={() => onAddPoints(100)} className="rounded-xl bg-[#e6f6f3] px-3 py-2.5 text-[9px] font-black text-[#0f766e]">+100 points</button><button type="button" onClick={() => onAddPoints(500)} className="rounded-xl bg-[#e6f6f3] px-3 py-2.5 text-[9px] font-black text-[#0f766e]">+500 points</button></div></div><button type="button" onClick={() => onNotify(`Pesan benefit untuk ${member.name} siap dikirim.`)} className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] px-4 py-3 text-[10px] font-black text-white hover:bg-[#0b625c]"><BellRing className="h-3.5 w-3.5" /> Kirim pengingat benefit</button></aside></div>;
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

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] py-10 text-center text-xs font-semibold text-[#8aa1a3]">{label}</div>;
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function tierClass(tier: MemberTier) {
  return tier === "Elite" ? "bg-[#d4efeb] text-[#0f766e]" : tier === "Growth" ? "bg-[#e3eff8] text-[#3a6b9b]" : "bg-[#f0f5f4] text-[#648084]";
}

function tierPill(tier: MemberTier) {
  return tier === "Elite" ? "bg-[#e6f6f3] text-[#0f766e]" : tier === "Growth" ? "bg-[#e3eff8] text-[#3a6b9b]" : "bg-[#f0f5f4] text-[#648084]";
}

function statusPill(status: MemberStatus) {
  return status === "Aktif" ? "bg-[#e6f6f3] text-[#0f766e]" : status === "Perlu perhatian" ? "bg-[#fff1dd] text-[#a56c2b]" : "bg-[#f3e2df] text-[#aa6359]";
}

const fieldClass = "w-full rounded-xl border border-[#dcebea] bg-[#fbfdfd] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:border-[#0f766e] focus:ring-2 focus:ring-[#b9ded8]";