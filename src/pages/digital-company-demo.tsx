import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import "./digital-demo-super-app.css";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ContactRound,
  Eye,
  EyeOff,
  FileText,
  Globe2,
  Link2,
  Lock,
  Menu,
  MonitorSmartphone,
  Palette,
  Quote,
  Send,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "@/lib/wouter";

const COMPANY_PREVIEW_PASSWORD = "nemposukses";
const COMPANY_PREVIEW_ACCESS_KEY = "nempo_company_preview_access";

function CompanyPreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="Company Website" description="Masukkan password untuk membuka preview website company Nempo." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === COMPANY_PREVIEW_PASSWORD) {
      localStorage.setItem(COMPANY_PREVIEW_ACCESS_KEY, "1");
      onUnlock();
      return;
    }
    setError(true);
  }

  return (
    <main className="nempo-demo-green nempo-company-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md border border-[#dce8e7] bg-white p-6 shadow-[0_22px_70px_rgba(27,78,80,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center bg-[#0f766e] text-white"><Globe2 className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f766e]">Live preview</p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Company Website</h1>
          </div>
        </div>
        <p className="text-sm leading-6 text-[#648079]">Masukkan password untuk membuka preview website company Nempo.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <label className={`flex items-center gap-3 border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#b75c54] bg-[#fff8f5]" : "border-[#d6ded8] focus-within:border-[#387f73]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da098]"}`} />
            <span className="sr-only">Password live preview company website</span>
            <input type="text" name="username" autoComplete="username" tabIndex={-1} aria-hidden="true" className="sr-only" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => { setPassword(event.target.value); setError(false); }}
              placeholder="Masukkan password"
              autoComplete="current-password"
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#183b43] outline-none placeholder:text-[#9db1ab]"
            />
            <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} className="text-[#7da098] hover:text-[#183b43]">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </label>
          {error && <p className="text-xs font-semibold text-[#b75c54]">Password salah. Coba lagi.</p>}
          <button type="submit" className="w-full bg-[#0f766e] px-4 py-3 text-xs font-black text-white transition-colors hover:bg-[#0b625c]">Masuk ke preview</button>
        </form>
      </div>
    </main>
  );
}

type CaseStudy = {
  name: string;
  category: string;
  year: string;
  description: string;
  accent: string;
  soft: string;
  mark: string;
};

const caseStudies: CaseStudy[] = [
  {
    name: "Sagara Living",
    category: "Hospitality",
    year: "2025",
    description: "Identitas digital yang tenang untuk penginapan kecil yang ingin terasa personal sejak halaman pertama.",
    accent: "#0f766e",
    soft: "#d7f1eb",
    mark: "SL",
  },
  {
    name: "Karsa Studio",
    category: "Creative partner",
    year: "2025",
    description: "Website editorial untuk memperjelas layanan, karya, dan cara kerja studio kreatif yang terus bergerak.",
    accent: "#0f9b8e",
    soft: "#e6f6f3",
    mark: "KS",
  },
  {
    name: "Bumi Pangan",
    category: "Food system",
    year: "2026",
    description: "Platform brand yang menghubungkan cerita petani, produk, dan pelanggan dalam satu alur yang mudah dipahami.",
    accent: "#3478c9",
    soft: "#e5f0ff",
    mark: "BP",
  },
];

export default function DigitalCompanyDemoPage() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) return <CompanyPreviewGate onUnlock={() => setUnlocked(true)} />;
  return <CompanyWebsiteWorkspace />;
}

function CompanyWebsiteWorkspace() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(0);
  const [sent, setSent] = useState(false);
  const [leadCount, setLeadCount] = useState(12);
  const selected = caseStudies[selectedCase];

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLeadCount((current) => current + 1);
    setSent(true);
  }

  return (
    <Layout>
      <SEO
        title="Company Website Demo — Digi Nempo"
        description="Preview website company yang hangat, jelas, dan siap membantu bisnis terlihat lebih dipercaya."
        keywords="demo website company, company profile website, web design Garut, Digi Nempo"
        path="/digital-services/company"
      />

      <main className="nempo-demo-green nempo-company-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="border-b border-[#b9ded8] bg-[#e6f6f3] text-[#183b43]">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-5 py-3 sm:flex-row sm:items-center sm:px-8 lg:px-10">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#0f766e] text-white"><Globe2 className="h-3.5 w-3.5" /></span>
              <p className="truncate text-[10px] font-black">Company Website terhubung ke Business OS</p>
              <span className="hidden text-[10px] text-[#5d7d80] sm:inline">Brand, portfolio, dan lead masuk dalam satu workspace.</span>
            </div>
            <Link href="/digital-services/super-app" className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-black text-[#0f766e] hover:text-[#0b625c]">Lihat ringkasan bisnis <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
        <section className="overflow-hidden bg-[#123f47] text-white">
          <div className="mx-auto max-w-7xl px-5 pb-7 pt-4 sm:px-8 lg:px-10">
            <nav className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-4">
                <Link href="/digital-services" className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-white">← Digi Nempo</Link>
                <Link href="/digital-services/super-app" className="hidden items-center gap-1.5 border border-white/20 px-3 py-1.5 text-[10px] font-black text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex">Business OS <ArrowUpRight className="h-3 w-3" /></Link>
              </div>
              <div className="hidden items-center gap-8 text-[11px] font-bold text-white/65 md:flex">
                <a href="#about" className="transition-colors hover:text-white">Tentang</a>
                <a href="#services" className="transition-colors hover:text-white">Layanan</a>
                <a href="#integration" className="transition-colors hover:text-white">Integrasi</a>
                <a href="#work" className="transition-colors hover:text-white">Karya</a>
                <a href="#contact" className="transition-colors hover:text-white">Kontak</a>
              </div>
              <button type="button" onClick={() => setMenuOpen((current) => !current)} aria-label="Buka menu" className="grid h-8 w-8 place-items-center border border-white/20 md:hidden">
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </nav>
            {menuOpen && (
              <div className="grid gap-2 border-b border-white/15 py-4 text-xs font-bold md:hidden">
                {["about", "services", "integration", "work", "contact"].map((id) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className="py-1 text-white/70 hover:text-white">{id === "about" ? "Tentang" : id === "services" ? "Layanan" : id === "integration" ? "Integrasi" : id === "work" ? "Karya" : "Kontak"}</a>)}
              </div>
            )}

            <div className="flex items-center justify-between border-b border-white/15 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
              <span>Digi Nempo / 2026</span>
              <span className="hidden sm:inline">Strategy · Identity · Digital</span>
              <span>Garut — Indonesia</span>
            </div>

            <div className="grid items-end gap-12 pb-14 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:pb-24 lg:pt-24">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8bd6cc]"><span className="h-1.5 w-1.5 rounded-full bg-[#8bd6cc]" /> Company website preview</div>
                <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.06em] sm:text-7xl">Bisnis yang baik layak terlihat <span className="text-[#8bd6cc]">sejelas itu.</span></h1>
                <p className="mt-7 max-w-xl text-sm leading-7 text-white/65 sm:text-base">Website company yang menyusun cerita, layanan, dan kepercayaan menjadi pengalaman yang terasa utuh sejak kunjungan pertama.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href="#work" className="inline-flex items-center justify-center gap-2 bg-[#8bd6cc] px-5 py-3.5 text-sm font-black text-[#123f47] transition-transform hover:-translate-y-0.5">Lihat karya <ArrowRight className="h-4 w-4" /></a>
                  <a href="#integration" className="inline-flex items-center justify-center gap-2 border border-white/20 px-5 py-3.5 text-sm font-black text-white transition-colors hover:bg-white/10">Lihat integrasi <Link2 className="h-4 w-4" /></a>
                  <a href="#contact" className="inline-flex items-center justify-center gap-2 border border-white/20 px-5 py-3.5 text-sm font-black text-white transition-colors hover:bg-white/10">Mulai ngobrol <ArrowUpRight className="h-4 w-4" /></a>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
                <div className="absolute -right-5 -top-7 h-28 w-28 rounded-full bg-[#0f9b8e]/80 blur-2xl" />
                <div className="absolute -bottom-6 -left-5 z-20 border border-[#183b43]/10 bg-white px-4 py-3 text-[#183b43] shadow-xl sm:-left-8">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#6c8b82]">Small detail</p>
                  <p className="mt-1 text-sm font-black">Big impression.</p>
                </div>
                <div className="relative overflow-hidden border border-white/20 bg-[#f4f7f7] p-3 text-[#183b43] shadow-2xl">
                   <div className="flex items-center justify-between border-b border-[#dce8e7] px-3 pb-3 text-[9px] font-black uppercase tracking-[0.15em]"><span>N / forma</span><span>01 — 06</span></div>
                   <div className="grid min-h-[260px] grid-cols-1 gap-3 p-2 sm:min-h-[295px] sm:grid-cols-[.8fr_1.2fr] sm:p-3">
                      <div className="flex min-h-[110px] flex-col justify-between bg-[#8bd6cc] p-4 text-[#123f47] sm:min-h-0"><span className="text-xs font-black">Ruang untuk<br />bertumbuh.</span><span className="text-[10px] font-bold">nusaforma.co</span></div>
                      <div className="relative min-h-[140px] overflow-hidden bg-[#0f766e] sm:min-h-0"><div className="absolute -bottom-12 -right-9 h-48 w-48 rounded-full border-[22px] border-[#123f47]/80" /><div className="absolute left-5 top-7 h-14 w-14 rounded-full bg-white/80" /><p className="absolute bottom-4 left-4 text-[9px] font-black uppercase tracking-[0.14em] text-white">Built with clarity</p></div>
                  </div>
                   <div className="flex items-center justify-between border-t border-[#dce8e7] px-3 pt-3 text-[9px] font-bold text-[#6f898d]"><span>Strategy · Identity · Digital</span><span>↗</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

         <section className="border-b border-[#dce8e7] bg-[#f4f7f7]">
           <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#dce8e7] px-5 sm:grid-cols-4 sm:px-8 lg:px-10">
             {[["12+", "brand dibantu"], ["04", "tahun berkarya"], ["28", "project selesai"], ["96%", "repeat partner"]].map(([value, label]) => (
               <div key={label} className="px-4 py-6 first:pl-0 sm:px-6 lg:py-8"><p className="text-2xl font-black tracking-[-0.04em] sm:text-3xl">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8aa1a3]">{label}</p></div>
            ))}
          </div>
        </section>

         <section id="about" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:px-10 lg:py-28">
          <div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f766e]">Tentang pendekatan</p>
            <h2 className="mt-4 max-w-md text-3xl font-black leading-tight tracking-[-0.05em] sm:text-4xl">Tidak ramai. Tepat sasaran.</h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
             <p className="text-base leading-8 text-[#365b60]">Kami membantu bisnis menerjemahkan hal yang paling penting: siapa kamu, apa yang kamu kerjakan, dan mengapa orang perlu percaya.</p>
             <div className="border-l border-[#dce8e7] pl-5 text-sm leading-7 text-[#8aa1a3]">Setiap halaman dirancang supaya pengunjung tidak perlu menebak-nebak. Pesan yang jelas, visual yang punya karakter, dan alur yang terasa ringan.</div>
          </div>
        </section>

         <section id="services" className="bg-[#e6f6f3]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
               <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f766e]">Layanan kami</p><h2 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Dari fondasi sampai peluncuran.</h2></div>
               <p className="max-w-xs text-sm leading-6 text-[#6f898d]">Satu partner untuk membangun digital presence yang konsisten dan mudah dirawat.</p>
            </div>
             <div className="mt-12 grid gap-px overflow-hidden border border-[#b9ded8] bg-[#b9ded8] md:grid-cols-3">
              {[
                { icon: Palette, number: "01", title: "Brand direction", text: "Menentukan arah visual dan pesan yang membuat brand mudah dikenali." },
                { icon: MonitorSmartphone, number: "02", title: "Website system", text: "Menyusun halaman yang cepat, responsif, dan fokus pada tujuan bisnis." },
                { icon: BriefcaseBusiness, number: "03", title: "Growth support", text: "Menyiapkan fondasi yang bisa berkembang bersama kebutuhan tim." },
              ].map(({ icon: Icon, number, title, text }) => (
                 <article key={title} className="group bg-white p-6 transition-all hover:-translate-y-1 hover:bg-[#fbfdfd] hover:shadow-[0_18px_45px_rgba(27,78,80,0.08)] sm:p-8"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center bg-[#d4efeb] transition-colors group-hover:bg-[#8bd6cc]"><Icon className="h-5 w-5 text-[#0f766e]" /></span><span className="text-[10px] font-black text-[#a4b6b7]">{number}</span></div><h3 className="mt-12 text-lg font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-[#6f898d]">{text}</p><span className="mt-7 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#0f766e]">Pelajari <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span></article>
              ))}
            </div>
          </div>
        </section>

         <section id="integration" className="border-y border-[#dce8e7] bg-white">
           <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
             <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
               <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f766e]">Connected to Business OS</p>
                 <h2 className="mt-4 max-w-md text-3xl font-black leading-tight tracking-[-0.05em] sm:text-4xl">Website tidak berhenti di halaman depan.</h2>
               </div>
               <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                 <p className="max-w-lg text-sm leading-7 text-[#6f898d]">Setiap kunjungan, brief, dan permintaan konsultasi bisa diteruskan ke modul yang tepat. Tim tidak perlu memindahkan data dari website ke workspace secara manual.</p>
                 <Link href="/digital-services/super-app" className="inline-flex shrink-0 items-center gap-2 text-xs font-black text-[#0f766e] hover:text-[#0b625c]">Buka Business OS <ArrowUpRight className="h-4 w-4" /></Link>
               </div>
             </div>
             <div className="mt-12 grid gap-3 md:grid-cols-3">
               {[
                 { icon: ContactRound, label: "CRM", title: "Lead tersimpan rapi", text: "Brief baru masuk sebagai kontak dan bisa langsung diberi tindak lanjut.", status: `${leadCount} leads masuk`, href: "/digital-services/crm", tone: "bg-[#e6f6f3] text-[#0f766e]" },
                 { icon: BarChart3, label: "Marketing Tools", title: "Performa bisa dibaca", text: "Portfolio views dan campaign terhubung agar tim tahu apa yang bekerja.", status: "2,4k portfolio views", href: "/digital-services/marketing", tone: "bg-[#e5f0ff] text-[#3478c9]" },
                 { icon: FileText, label: "Invoice & Faktur", title: "Brief siap jadi proyek", text: "Kebutuhan yang sudah disepakati bisa diteruskan ke alur penawaran dan billing.", status: "4 brief baru", href: "/digital-services/invoice", tone: "bg-[#fff1dd] text-[#b97820]" },
               ].map(({ icon: Icon, label, title, text, status, href, tone }) => (
                 <Link key={label} href={href} className="group border border-[#e3eeed] bg-[#fbfdfd] p-5 transition-all hover:-translate-y-1 hover:border-[#b9ded8] hover:shadow-[0_16px_36px_rgba(27,78,80,0.08)] sm:p-6">
                   <div className="flex items-center justify-between">
                     <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span>
                     <ArrowUpRight className="h-4 w-4 text-[#a4b6b7] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0f766e]" />
                   </div>
                   <p className="mt-7 text-[10px] font-black uppercase tracking-[0.16em] text-[#8aa1a3]">{label}</p>
                   <h3 className="mt-2 text-lg font-black tracking-tight text-[#183b43]">{title}</h3>
                   <p className="mt-2 min-h-12 text-sm leading-6 text-[#6f898d]">{text}</p>
                   <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-[#0f766e] shadow-sm ring-1 ring-[#dce8e7]"><CheckCircle2 className="h-3.5 w-3.5" /> {status}</div>
                 </Link>
               ))}
             </div>
           </div>
         </section>

         <section id="work" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
           <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f766e]">Selected work</p><h2 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Karya yang punya alasan.</h2></div><p className="max-w-xs text-sm leading-6 text-[#6f898d]">Beberapa contoh arah visual yang bisa dibentuk untuk kebutuhan company profile.</p></div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <div className="space-y-2">
              {caseStudies.map((item, index) => (
                <button key={item.name} type="button" onClick={() => setSelectedCase(index)} className={`group flex w-full items-center justify-between border-b px-0 py-5 text-left transition-colors ${selectedCase === index ? "border-[#183b43]" : "border-[#dce8e7]"}`}>
                  <span className="flex items-center gap-4"><span className="text-[10px] font-black text-[#a4b6b7]">0{index + 1}</span><span className={`text-xl font-black tracking-[-0.04em] transition-colors ${selectedCase === index ? "text-[#183b43]" : "text-[#8aa1a3] group-hover:text-[#365b60]"}`}>{item.name}</span></span>
                  <ArrowUpRight className={`h-5 w-5 transition-transform ${selectedCase === index ? "text-[#0f766e]" : "text-[#a4b6b7] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"}`} />
                </button>
              ))}
            </div>
            <div className="relative min-h-[360px] overflow-hidden p-5 sm:p-8" style={{ backgroundColor: selected.soft }}>
              <div className="flex items-start justify-between text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: selected.accent }}><span>{selected.category}</span><span>{selected.year}</span></div>
              <div className="absolute bottom-8 left-8 right-8 top-20 overflow-hidden bg-[#123f47] p-5 text-white shadow-lg sm:left-14 sm:right-14">
                <div className="flex items-center justify-between border-b border-white/15 pb-3 text-[9px] font-black uppercase tracking-[0.13em]"><span>{selected.mark} / digital presence</span><span>↗</span></div>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[.7fr_1.3fr]"><div className="min-h-[120px] p-4 sm:min-h-[170px]" style={{ backgroundColor: selected.accent }}><BriefcaseBusiness className="h-4 w-4" /><p className="mt-8 text-xl font-black leading-none sm:mt-12">Make<br />space.</p></div><div className="relative min-h-[140px] overflow-hidden bg-[#e6f6f3] sm:min-h-[170px]"><div className="absolute -bottom-10 -left-8 h-40 w-40 rounded-full border-[18px]" style={{ borderColor: selected.accent }} /><div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-[#8bd6cc]" /></div></div>
                <p className="mt-4 max-w-xs text-xs leading-5 text-white/60">{selected.description}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#123f47] text-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
              <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8bd6cc]">Cara kerja</p><h2 className="mt-4 max-w-sm text-3xl font-black leading-tight tracking-[-0.05em] sm:text-4xl">Terstruktur, terbuka, dan tetap manusiawi.</h2></div>
              <div className="divide-y divide-white/15 border-y border-white/15">
                {[["01", "Dengar dulu", "Kami mulai dari konteks bisnis, bukan dari template."], ["02", "Susun arah", "Pesan, struktur, dan visual dirapikan menjadi satu bahasa."], ["03", "Bangun bersama", "Setiap tahap bisa dilihat, diuji, dan disempurnakan bersama."]].map(([number, title, text]) => (
                  <div key={number} className="grid gap-3 py-6 sm:grid-cols-[3rem_10rem_1fr] sm:items-center"><span className="text-xs font-black text-[#8bd6cc]">{number}</span><h3 className="text-lg font-black">{title}</h3><p className="text-sm leading-6 text-white/55">{text}</p></div>
                ))}
              </div>
            </div>
          </div>
        </section>

         <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_.85fr] lg:px-10 lg:py-24">
           <div className="border border-[#dce8e7] bg-white p-6 sm:p-9"><Quote className="h-8 w-8 text-[#0f766e]" /><p className="mt-8 max-w-xl text-2xl font-black leading-tight tracking-[-0.04em]">“Website baru kami akhirnya terasa seperti bisnis yang selama ini kami ceritakan ke orang lain.”</p><div className="mt-8 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#8bd6cc] text-xs font-black text-[#123f47]">AR</div><div><p className="text-xs font-black">Ari Rahman</p><p className="mt-1 text-[10px] font-bold text-[#8aa1a3]">Founder, Sagara Living</p></div></div></div>
           <div className="flex flex-col justify-between bg-[#e6f6f3] p-6 sm:p-9"><div><ShieldCheck className="h-7 w-7 text-[#0f766e]" /><h3 className="mt-6 text-2xl font-black leading-tight tracking-[-0.04em]">Website yang bekerja bahkan saat kamu sedang tidak menjelaskan.</h3><p className="mt-4 text-sm leading-6 text-[#6f898d]">Buat pengunjung memahami nilai bisnismu dalam beberapa detik, lalu tahu harus melangkah ke mana.</p></div><div className="mt-10 flex items-center gap-3 text-xs font-black text-[#0f766e]"><Users className="h-4 w-4" /> Dibuat untuk tim yang sedang bertumbuh</div></div>
        </section>

         <section id="contact" className="bg-[#0f766e] text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_.9fr] lg:px-10 lg:py-24">
             <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Punya cerita untuk dibentuk?</p><h2 className="mt-4 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">Mari buat website yang terasa seperti kamu.</h2><a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 bg-[#123f47] px-5 py-3.5 text-sm font-black text-white transition-transform hover:-translate-y-0.5">Konsultasi via WhatsApp <ArrowUpRight className="h-4 w-4" /></a><p className="mt-5 flex items-center gap-2 text-xs font-semibold text-white/70"><CheckCircle2 className="h-4 w-4 text-[#8bd6cc]" /> Brief akan masuk ke alur CRM dalam demo ini.</p></div>
            <form onSubmit={submitContact} className="bg-white/10 p-5 backdrop-blur-sm sm:p-7">
              <div className="mb-5 flex items-center gap-2 text-xs font-black"><Send className="h-4 w-4" /> Kirim brief singkat</div>
              <div className="grid gap-3"><input required placeholder="Nama / nama bisnis" className="border border-white/25 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/55 focus:border-white" /><input required type="email" placeholder="Email untuk dihubungi" className="border border-white/25 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/55 focus:border-white" /><textarea required rows={4} placeholder="Ceritakan website yang ingin dibuat..." className="resize-none border border-white/25 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/55 focus:border-white" /></div>
               <button type="submit" className="mt-3 flex w-full items-center justify-center gap-2 bg-white px-4 py-3 text-sm font-black text-[#123f47] transition-colors hover:bg-[#e6f6f3]">{sent ? `Brief tersimpan · ${leadCount} leads` : "Kirim brief"} <Check className="h-4 w-4" /></button>
            </form>
          </div>
        </section>

         <footer className="bg-[#123f47] px-5 py-7 text-white sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50 sm:flex-row"><span>Digi Nempo / Company website preview</span><span>Strategy · Identity · Digital</span></div>
        </footer>
      </main>
    </Layout>
  );
}