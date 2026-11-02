import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import { Link } from "@/lib/wouter";
import { useEffect, useState, type FormEvent } from "react";
import "./digital-demo-super-app.css";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Heart,
  MapPin,
  Menu,
  Music,
  Pause,
  Send,
  Share2,
  Utensils,
  X,
  Eye,
  EyeOff,
  Gift,
  Lock,
} from "lucide-react";

type InvitationSection = "home" | "acara" | "cerita" | "galeri" | "kado" | "rsvp";
type Attendance = "Hadir" | "Tidak hadir" | "Masih tentatif";
type GiftCopyTarget = "bank" | "address";

type GuestMessage = {
  name: string;
  message: string;
  time: string;
};

const invitationSections: Array<{ id: InvitationSection; label: string }> = [
  { id: "home", label: "Beranda" },
  { id: "acara", label: "Acara" },
  { id: "cerita", label: "Cerita kami" },
  { id: "galeri", label: "Galeri" },
  { id: "kado", label: "Kado" },
  { id: "rsvp", label: "Ucapan & RSVP" },
];

const initialMessages: GuestMessage[] = [
  { name: "Aulia & Dimas", message: "Selamat menempuh hidup baru. Semoga selalu saling memilih setiap hari.", time: "Baru saja" },
  { name: "Keluarga Rahman", message: "Kami ikut bahagia dan mendoakan rumah tangga yang penuh berkah.", time: "12 menit lalu" },
  { name: "Nadia Putri", message: "Tidak sabar bertemu di hari bahagia kalian. Sampai jumpa!", time: "28 menit lalu" },
];

const invitationPhotos = {
  hero: "/images/invitation-hero.jpg",
  story: "/images/invitation-story.jpg",
  detail: "/images/invitation-detail.jpg",
};

export default function DigitalInvitationDemoPage() {
  return (
    <DigitalPreviewGate
      title="Wedding Invitation"
      description="Masukkan password untuk membuka preview invitation digital Nempo."
    >
      <DigitalInvitationWorkspace />
    </DigitalPreviewGate>
  );
}

function InvitationPreviewLoading() {
  return (
    <main className="nempo-demo-green nempo-invitation-gate flex min-h-[100dvh] items-center justify-center bg-[#f3eee7] px-5 text-[#382c25]">
      <div className="flex items-center gap-3 border border-[#dfd2c5] bg-[#fbfaf7] px-5 py-4 text-xs font-bold text-[#805538] shadow-[0_14px_45px_rgba(83,53,34,0.10)]">
        <Lock className="h-4 w-4" />
        Memeriksa akses preview...
      </div>
    </main>
  );
}

function InvitationPreviewGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/digital-services/invitation/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.error || "Password salah. Coba lagi.");
        return;
      }
      onUnlock();
    } catch {
      setError("Preview tidak dapat dihubungkan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="nempo-demo-green nempo-invitation-gate flex min-h-[100dvh] items-center justify-center bg-[#f3eee7] px-5 text-[#382c25]">
      <div className="w-full max-w-md border border-[#dfd2c5] bg-[#fbfaf7] p-6 shadow-[0_20px_60px_rgba(83,53,34,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center bg-[#805538] text-white">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9b6240]">Live preview</p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-[#392d27]">Invitation Digital</h1>
          </div>
        </div>
        <p className="text-sm leading-6 text-[#7f6d60]">Masukkan password untuk membuka preview invitation digital Nempo.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <label className={`flex items-center gap-3 border bg-[#fffdfa] px-3.5 py-3 transition-colors ${error ? "border-[#b86755] bg-[#fff8f5]" : "border-[#dfd2c5] focus-within:border-[#9b6240]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#b86755]" : "text-[#a58e7d]"}`} />
            <span className="sr-only">Password live preview invitation</span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Masukkan password"
              autoComplete="current-password"
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#392d27] outline-none placeholder:text-[#b4a293]"
            />
            <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} className="text-[#a58e7d] hover:text-[#805538]">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </label>
          {error && <p className="text-xs font-semibold text-[#b86755]">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full bg-[#805538] px-4 py-3 text-xs font-black text-white transition-colors hover:bg-[#68432d] disabled:cursor-wait disabled:opacity-60">
            {submitting ? "Memeriksa..." : "Masuk ke preview"}
          </button>
        </form>
      </div>
    </main>
  );
}

function DigitalInvitationWorkspace() {
  const [isOpened, setIsOpened] = useState(false);
  const [activeSection, setActiveSection] = useState<InvitationSection>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [guestMessages, setGuestMessages] = useState(initialMessages);
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Hadir");
  const [guestCount, setGuestCount] = useState("2 orang");
  const [guestMessage, setGuestMessage] = useState("");
  const [giftCopied, setGiftCopied] = useState<GiftCopyTarget | null>(null);

  function openSection(section: InvitationSection) {
    setActiveSection(section);
    setMenuOpen(false);
    window.setTimeout(() => document.getElementById(`invitation-${section}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  async function copyLocation() {
    try {
      await navigator.clipboard.writeText("The Papandayan, Jl. Gatot Subroto No. 83, Garut");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function copyGift(target: GiftCopyTarget, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setGiftCopied(target);
      window.setTimeout(() => setGiftCopied(null), 1800);
    } catch {
      setGiftCopied(null);
    }
  }

  function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!guestName.trim()) return;
    setGuestMessages((current) => [
      { name: guestName.trim(), message: guestMessage.trim() || "Selamat untuk Alya & Reza. Sampai bertemu di hari bahagia.", time: "Baru saja" },
      ...current,
    ]);
    setRsvpSent(true);
    setGuestName("");
    setGuestMessage("");
  }

  return (
    <Layout>
      <SEO
        title="Invitation Digital Alya & Reza — Nempo Organizer"
        description="Live preview invitation digital Nempo dengan RSVP, detail acara, galeri, dan ucapan tamu."
        keywords="invitation digital, undangan online, RSVP online, undangan pernikahan Garut"
        path="/digital-services/invitation"
      />

      <main className="nempo-demo-green nempo-invitation-preview min-h-screen bg-[#f3eee7] text-[#382c25]">
        <div className="mx-auto max-w-[1220px] px-3 pb-16 pt-3 sm:px-5 sm:pt-5 lg:px-7">
          <header className="mb-3 flex items-center justify-between gap-3 border border-[#dfd2c5] bg-[#fbfaf7] px-3 py-2.5 sm:mb-4 sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <Link href="/digital-services" aria-label="Kembali ke Digi Nempo" className="grid h-8 w-8 shrink-0 place-items-center border border-[#dfd2c5] text-[#8c7768] transition-colors hover:border-[#9b6240] hover:bg-[#f5ede5] hover:text-[#805538]">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#9b6240]">Live preview</p>
                <p className="truncate text-xs font-black text-[#392d27] sm:text-sm">Invitation digital · Alya & Reza</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 text-[10px] font-bold text-[#8c7768] sm:flex">
              <span className="h-1.5 w-1.5 bg-[#6f947b]" /> Tampilan tamu
            </div>
            <button type="button" onClick={() => setMusicPlaying((current) => !current)} className="inline-flex shrink-0 items-center gap-1.5 border border-[#dfd2c5] bg-[#fffdf9] px-2.5 py-2 text-[10px] font-bold text-[#805538] hover:bg-[#f5ede5]">
              {musicPlaying ? <Pause className="h-3.5 w-3.5" /> : <Music className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{musicPlaying ? "Musik menyala" : "Putar musik"}</span>
            </button>
          </header>

          {!isOpened ? (
            <InvitationCover onOpen={() => setIsOpened(true)} />
          ) : (
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="overflow-hidden border border-[#dfd2c5] bg-[#fbfaf7] shadow-[0_14px_45px_rgba(83,53,34,0.10)]">
                <InvitationNavigation activeSection={activeSection} menuOpen={menuOpen} onMenu={() => setMenuOpen((current) => !current)} onSelect={openSection} />
                <InvitationHero onRsvp={() => { setActiveSection("rsvp"); setRsvpOpen(true); }} onSelect={openSection} />
                <div className="space-y-0">
                  <InvitationEventSection onCopy={copyLocation} copied={copied} onOpenRsvp={() => { setActiveSection("rsvp"); setRsvpOpen(true); }} />
                  <InvitationStorySection />
                  <InvitationGallerySection />
                   <InvitationGiftSection copied={giftCopied} onCopy={copyGift} />
                  <InvitationRsvpSection messages={guestMessages} onOpenForm={() => { setRsvpSent(false); setRsvpOpen(true); }} />
                </div>
                <footer className="border-t border-[#eadfd5] bg-[#f7f0e8] px-5 py-8 text-center sm:px-10">
                  <Heart className="mx-auto h-5 w-5 fill-[#a65d4c] text-[#a65d4c]" />
                  <p className="mt-3 font-serif text-xl font-semibold text-[#594136]">Terima kasih atas doa dan kehadirannya.</p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#9b8778]">Alya & Reza · 12 Oktober 2026</p>
                </footer>
              </div>

              <aside className="space-y-3 lg:sticky lg:top-4">
                <div className="border border-[#dfd2c5] bg-[#fbfaf7] p-4 shadow-[0_1px_3px_rgba(83,56,39,0.05)]">
                  <div className="flex items-center gap-2 border-b border-[#eee5dc] pb-3">
                    <span className="grid h-8 w-8 place-items-center bg-[#f1e2d5] text-[#9b6240]"><Heart className="h-4 w-4 fill-current" /></span>
                    <div><p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#9b6240]">Alya & Reza</p><p className="mt-0.5 text-[10px] text-[#9b8778]">Sabtu, 12 Oktober 2026</p></div>
                  </div>
                  <p className="mt-4 text-xs font-black text-[#594136]">Bagikan undangan</p>
                  <p className="mt-1 text-[10px] leading-4 text-[#9b8778]">Tamu bisa membuka undangan dari satu tautan yang ringan di ponsel.</p>
                  <button type="button" onClick={() => setCopied(true)} className="mt-3 flex w-full items-center justify-center gap-2 border border-[#d9c4b4] bg-[#fffaf5] px-3 py-2.5 text-[10px] font-black text-[#805538] hover:bg-[#f6eee6]"><Share2 className="h-3.5 w-3.5" /> Salin tautan undangan</button>
                  {copied && <p className="mt-2 text-center text-[10px] font-bold text-[#47705d]">Tautan siap dibagikan.</p>}
                </div>
                <div className="border border-[#dfd2c5] bg-[#fbfaf7] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#9b6240]">Yang bisa dibuat</p>
                   <div className="mt-3 space-y-2.5">
                     {["RSVP online", "Galeri momen", "Perjalanan cerita", "Ucapan tamu", "Amplop digital", "Kado fisik", "Detail acara & peta"].map((item) => <div key={item} className="flex items-center gap-2 text-[11px] font-semibold text-[#66564c]"><span className="grid h-4 w-4 place-items-center bg-[#e4efe6] text-[#47705d]"><Check className="h-2.5 w-2.5" /></span>{item}</div>)}
                  </div>
                </div>
                <Link href="/digital-services" className="flex items-center justify-center gap-2 border border-[#dfd2c5] bg-[#f7f0e8] px-3 py-3 text-[10px] font-black text-[#805538] hover:bg-[#eee1d5]"><ArrowLeft className="h-3.5 w-3.5" /> Lihat produk digital lain</Link>
              </aside>
            </div>
          )}
        </div>
      </main>

      {rsvpOpen && <RsvpModal attendance={attendance} guestCount={guestCount} guestMessage={guestMessage} guestName={guestName} sent={rsvpSent} onAttendance={setAttendance} onCount={setGuestCount} onMessage={setGuestMessage} onName={setGuestName} onClose={() => setRsvpOpen(false)} onSubmit={submitRsvp} />}
    </Layout>
  );
}

function InvitationCover({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="relative min-h-[620px] overflow-hidden border border-[#4d362b] bg-[#392b25] shadow-[0_14px_45px_rgba(83,53,34,0.18)] sm:min-h-[680px]">
      <img src={invitationPhotos.hero} alt="Alya dan Reza di hari pernikahan" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#241b18]/95 via-[#2c201b]/30 to-[#241b18]/15" />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between px-5 py-5 text-white/80 sm:px-8 sm:py-7">
        <div className="font-serif text-lg tracking-tight">A<span className="text-[#ddb39a]">&amp;</span>R</div>
        <div className="text-right text-[9px] font-black uppercase tracking-[0.2em]"><p>Save the date</p><p className="mt-1 text-[#ddb39a]">12 · 10 · 26</p></div>
      </div>
      <div className="relative mx-auto flex min-h-[620px] max-w-5xl flex-col justify-end px-5 pb-9 text-white sm:min-h-[680px] sm:px-10 sm:pb-12">
        <div className="max-w-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#e4c3ad]">The wedding of</p>
          <h1 className="mt-3 font-serif text-6xl font-semibold leading-[0.84] tracking-[-0.05em] sm:text-8xl">Alya <span className="text-[#dfaa8f]">&amp;</span><br />Reza</h1>
          <div className="mt-6 flex items-center gap-3 text-[10px] font-bold text-white/80"><span className="h-px w-10 bg-[#dfaa8f]" /><span>Sabtu, 12 Oktober 2026</span><span className="h-px w-10 bg-[#dfaa8f]" /></div>
          <p className="mt-3 text-xs font-semibold text-white/65">The Papandayan · Garut</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onOpen} className="inline-flex items-center gap-2 bg-[#fbf5ef] px-5 py-3.5 text-xs font-black text-[#4c3529] shadow-xl transition-transform hover:-translate-y-0.5 hover:bg-white">Buka undangan <ArrowRight className="h-4 w-4" /></button>
            <span className="text-[10px] font-semibold text-white/55">Untuk keluarga dan sahabat terkasih</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function InvitationNavigation({ activeSection, menuOpen, onMenu, onSelect }: { activeSection: InvitationSection; menuOpen: boolean; onMenu: () => void; onSelect: (section: InvitationSection) => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#eadfd5] bg-[#fbfaf7]/95 px-4 py-3 backdrop-blur sm:px-7">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => onSelect("home")} className="flex items-center gap-2 text-left">
          <span className="grid h-7 w-7 place-items-center bg-[#f1e2d5] text-[#a65d4c]"><Heart className="h-3.5 w-3.5 fill-current" /></span>
          <span className="font-serif text-sm font-semibold text-[#594136]">Alya & Reza</span>
        </button>
        <nav className="hidden items-center gap-5 sm:flex">
          {invitationSections.map((section) => <button type="button" key={section.id} onClick={() => onSelect(section.id)} className={`text-[10px] font-black transition-colors ${activeSection === section.id ? "text-[#a65d4c]" : "text-[#9b8778] hover:text-[#805538]"}`}>{section.label}</button>)}
        </nav>
        <button type="button" aria-label="Buka menu undangan" onClick={onMenu} className="grid h-8 w-8 place-items-center border border-[#dfd2c5] text-[#805538] sm:hidden">{menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
      </div>
      {menuOpen && <nav className="mt-3 grid gap-1 border-t border-[#eee5dc] pt-3 sm:hidden">{invitationSections.map((section) => <button type="button" key={section.id} onClick={() => onSelect(section.id)} className={`px-3 py-2 text-left text-[11px] font-black ${activeSection === section.id ? "bg-[#f4e7dd] text-[#a65d4c]" : "text-[#806f63]"}`}>{section.label}</button>)}</nav>}
    </header>
  );
}

function InvitationHero({ onRsvp, onSelect }: { onRsvp: () => void; onSelect: (section: InvitationSection) => void }) {
  return (
    <section id="invitation-home" className="grid items-stretch bg-[#f7f0e8] lg:grid-cols-[.9fr_1.1fr]">
      <div className="relative min-h-[350px] overflow-hidden lg:min-h-[500px]">
        <img src={invitationPhotos.story} alt="Momen pernikahan Alya dan Reza" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3a2922]/75 via-transparent to-[#3a2922]/10" />
        <div className="absolute bottom-5 left-5 text-white sm:bottom-7 sm:left-7"><p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/70">A new chapter begins</p><p className="mt-2 font-serif text-2xl font-semibold">Bersama, lebih dari sekadar hari.</p></div>
      </div>
      <div className="flex flex-col justify-center px-5 py-10 sm:px-10 sm:py-14">
        <p className="text-[10px] font-black uppercase tracking-[0.23em] text-[#a65d4c]">Alya & Reza</p>
        <h2 className="mt-3 max-w-md font-serif text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-[#4c3529] sm:text-6xl">Satu hari untuk dirayakan bersama.</h2>
        <p className="mt-5 max-w-sm text-sm leading-6 text-[#806653]">Dua hati, satu perjalanan, dan orang-orang terkasih yang membuat cerita ini terasa lengkap.</p>
        <div className="mt-6 grid max-w-sm grid-cols-2 border-y border-[#ddcbbd] py-4 text-[10px]"><div><p className="font-black uppercase tracking-[0.12em] text-[#a65d4c]">Tanggal</p><p className="mt-1.5 font-semibold text-[#594136]">12 Oktober 2026</p></div><div className="border-l border-[#ddcbbd] pl-4"><p className="font-black uppercase tracking-[0.12em] text-[#a65d4c]">Lokasi</p><p className="mt-1.5 font-semibold text-[#594136]">Garut, Jawa Barat</p></div></div>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button type="button" onClick={onRsvp} className="inline-flex items-center gap-2 bg-[#805538] px-4 py-3 text-[11px] font-black text-[#fffaf5] hover:bg-[#6f472f]">Konfirmasi kehadiran <ArrowRight className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => onSelect("acara")} className="inline-flex items-center gap-2 border border-[#d9c4b4] bg-[#fffaf5] px-4 py-3 text-[11px] font-black text-[#805538] hover:bg-white">Lihat acara <ChevronDown className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </section>
  );
}

function InvitationEventSection({ onCopy, copied, onOpenRsvp }: { onCopy: () => void; copied: boolean; onOpenRsvp: () => void }) {
  return (
    <section id="invitation-acara" className="scroll-mt-16 border-t border-[#eadfd5] bg-[#fbfaf7] px-5 py-10 sm:px-10 sm:py-14">
      <SectionHeading eyebrow="Save the date" title="Sampai jumpa di hari bahagia kami." description="Catat waktunya dan pilih acara yang ingin kamu hadiri." />
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <div className="border border-[#dfd2c5] bg-[#fffdf9] p-5">
          <div className="flex items-start justify-between gap-3"><span className="grid h-9 w-9 place-items-center bg-[#f1e2d5] text-[#a65d4c]"><Utensils className="h-4 w-4" /></span><span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#a65d4c]">Akad</span></div>
          <h3 className="mt-5 font-serif text-2xl font-semibold text-[#594136]">Akad nikah</h3>
          <div className="mt-4 space-y-2.5 text-[11px] font-semibold text-[#806f63]"><p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-[#a65d4c]" /> Sabtu, 12 Oktober 2026</p><p className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-[#a65d4c]" /> 15.30 – 16.30 WIB</p><p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#a65d4c]" /> The Papandayan, Garut</p></div>
        </div>
        <div className="border border-[#dfd2c5] bg-[#fffdf9] p-5">
          <div className="flex items-start justify-between gap-3"><span className="grid h-9 w-9 place-items-center bg-[#e4efe6] text-[#47705d]"><CalendarDays className="h-4 w-4" /></span><span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#47705d]">Resepsi</span></div>
          <h3 className="mt-5 font-serif text-2xl font-semibold text-[#594136]">Malam perayaan</h3>
          <div className="mt-4 space-y-2.5 text-[11px] font-semibold text-[#806f63]"><p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-[#47705d]" /> Sabtu, 12 Oktober 2026</p><p className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-[#47705d]" /> 18.30 – 21.00 WIB</p><p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#47705d]" /> Ballroom Papandayan</p></div>
        </div>
      </div>
      <div className="mt-3 flex flex-col justify-between gap-3 border border-[#eadfd5] bg-[#f7f0e8] p-4 sm:flex-row sm:items-center"><div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#a65d4c]" /><div><p className="text-xs font-black text-[#594136]">The Papandayan</p><p className="mt-1 text-[10px] leading-4 text-[#92735e]">Jl. Gatot Subroto No. 83, Garut</p></div></div><div className="flex gap-2"><button type="button" onClick={onCopy} className="inline-flex items-center gap-1.5 border border-[#d9c4b4] bg-[#fffaf5] px-3 py-2 text-[10px] font-black text-[#805538]">{copied ? <Check className="h-3.5 w-3.5 text-[#47705d]" /> : <Copy className="h-3.5 w-3.5" />}{copied ? "Tersalin" : "Salin alamat"}</button><button type="button" onClick={onOpenRsvp} className="inline-flex items-center gap-1.5 bg-[#805538] px-3 py-2 text-[10px] font-black text-[#fffaf5]">RSVP <ArrowRight className="h-3.5 w-3.5" /></button></div></div>
    </section>
  );
}

function InvitationStorySection() {
  return (
    <section id="invitation-cerita" className="scroll-mt-16 border-t border-[#eadfd5] bg-[#f7f0e8] px-5 py-10 sm:px-10 sm:py-14">
      <SectionHeading eyebrow="Our story" title="Berawal dari obrolan sederhana." description="Lima tahun, banyak cerita, dan satu keputusan untuk terus berjalan bersama." />
      <div className="mt-7 grid items-stretch gap-6 sm:grid-cols-[1.05fr_.95fr]">
        <div className="relative min-h-[310px] overflow-hidden">
          <img src={invitationPhotos.detail} alt="Dekorasi meja resepsi" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3a2922]/65 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 text-white"><p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70">2019 — 2026</p><p className="mt-2 font-serif text-3xl font-semibold leading-tight">Dari “hai”<br />menjadi “selamanya”.</p></div>
        </div>
        <div className="flex flex-col justify-center space-y-5 text-sm leading-7 text-[#806f63]"><p>Semesta mempertemukan kami di sebuah sore yang biasa. Dari percakapan kecil, kami belajar bahwa rumah bisa berarti seseorang yang membuat kita merasa tenang.</p><p>Terima kasih sudah menjadi bagian dari perjalanan ini. Kehadiran, doa, dan cerita baik dari kalian akan membuat hari kami semakin lengkap.</p><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.13em] text-[#a65d4c]"><Heart className="h-3.5 w-3.5 fill-current" /> With love, Alya & Reza</div></div>
      </div>
    </section>
  );
}

function InvitationGallerySection() {
  return (
    <section id="invitation-galeri" className="scroll-mt-16 border-t border-[#eadfd5] bg-[#fbfaf7] px-5 py-10 sm:px-10 sm:py-14">
      <SectionHeading eyebrow="A few moments" title="Potongan kecil dari cerita kami." description="Galeri bisa diisi dengan foto pre-wedding, keluarga, dan momen yang paling berarti." />
      <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="relative col-span-2 row-span-2 min-h-[270px] overflow-hidden"><img src={invitationPhotos.hero} alt="Alya dan Reza" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#3a2922]/70 to-transparent" /><p className="absolute bottom-3 left-3 text-[9px] font-black text-white">Pertama bertemu</p></div>
        <div className="relative min-h-[130px] overflow-hidden"><img src={invitationPhotos.story} alt="Momen bersama keluarga" className="absolute inset-0 h-full w-full object-cover object-right" /><div className="absolute inset-0 bg-[#3a2922]/15" /><p className="absolute bottom-3 left-3 text-[9px] font-black text-white">Hari yang tenang</p></div>
        <div className="relative min-h-[130px] overflow-hidden"><img src={invitationPhotos.detail} alt="Dekorasi acara" className="absolute inset-0 h-full w-full object-cover object-center" /><p className="absolute bottom-3 left-3 text-[9px] font-black text-white">Menuju hari ini</p></div>
        <div className="relative min-h-[130px] overflow-hidden bg-[#b7c4ae]"><img src={invitationPhotos.detail} alt="Meja resepsi" className="absolute inset-0 h-full w-full object-cover object-left opacity-85" /><p className="absolute bottom-3 left-3 text-[9px] font-black text-white">Bersama keluarga</p></div>
        <div className="relative min-h-[130px] overflow-hidden bg-[#d7a39a]"><img src={invitationPhotos.hero} alt="Hari bahagia" className="absolute inset-0 h-full w-full object-cover object-right opacity-85" /><p className="absolute bottom-3 left-3 text-[9px] font-black text-white">Selalu pulang</p></div>
      </div>
    </section>
  );
}

function InvitationGiftSection({ copied, onCopy }: { copied: GiftCopyTarget | null; onCopy: (target: GiftCopyTarget, value: string) => void }) {
  return (
    <section id="invitation-kado" className="scroll-mt-16 border-t border-[#eadfd5] bg-[#f7f0e8] px-5 py-10 sm:px-10 sm:py-14">
      <SectionHeading
        eyebrow="Kado & doa"
        title="Doa baikmu adalah hadiah terindah."
        description="Bagi yang ingin berbagi tanda kasih, tersedia amplop digital dan alamat pengiriman kado."
      />
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <div className="border border-[#dfd2c5] bg-[#fffdf9] p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-10 w-10 place-items-center bg-[#f1e2d5] text-[#a65d4c]"><Gift className="h-5 w-5" /></span>
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#a65d4c]">Amplop digital</span>
          </div>
          <h3 className="mt-5 font-serif text-2xl font-semibold text-[#594136]">Kirim tanda kasih</h3>
          <p className="mt-2 text-xs leading-5 text-[#92735e]">Jika berkenan, kamu dapat mengirimkan hadiah melalui rekening berikut.</p>
          <div className="mt-5 border border-[#eadfd5] bg-[#f7f0e8] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8c7768]">Contoh rekening</p>
            <p className="mt-2 text-sm font-black text-[#594136]">Bank BCA</p>
            <p className="mt-1 font-mono text-lg font-bold tracking-wide text-[#805538]">1234 5678 9012</p>
            <p className="mt-1 text-[10px] font-semibold text-[#92735e]">a.n. Alya Putri</p>
            <button type="button" onClick={() => onCopy("bank", "123456789012")} className="mt-4 inline-flex items-center gap-1.5 border border-[#d9c4b4] bg-[#fffaf5] px-3 py-2 text-[10px] font-black text-[#805538] hover:bg-white">
              {copied === "bank" ? <Check className="h-3.5 w-3.5 text-[#47705d]" /> : <Copy className="h-3.5 w-3.5" />}
              {copied === "bank" ? "Nomor tersalin" : "Salin nomor rekening"}
            </button>
          </div>
        </div>
        <div className="border border-[#dfd2c5] bg-[#fffdf9] p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-10 w-10 place-items-center bg-[#e4efe6] text-[#47705d]"><MapPin className="h-5 w-5" /></span>
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#47705d]">Kado fisik</span>
          </div>
          <h3 className="mt-5 font-serif text-2xl font-semibold text-[#594136]">Kirim ke alamat kami</h3>
          <p className="mt-2 text-xs leading-5 text-[#92735e]">Untuk kado fisik, silakan kirimkan ke alamat venue berikut.</p>
          <div className="mt-5 border border-[#dce8df] bg-[#f3f8f3] p-4">
            <p className="text-sm font-black text-[#594136]">The Papandayan</p>
            <p className="mt-1 text-xs leading-5 text-[#806f63]">Jl. Gatot Subroto No. 83<br />Garut, Jawa Barat</p>
            <button type="button" onClick={() => onCopy("address", "The Papandayan, Jl. Gatot Subroto No. 83, Garut, Jawa Barat")} className="mt-4 inline-flex items-center gap-1.5 border border-[#c8dccd] bg-white px-3 py-2 text-[10px] font-black text-[#47705d] hover:bg-[#fbfffb]">
              {copied === "address" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied === "address" ? "Alamat tersalin" : "Salin alamat"}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-3 border border-[#eadfd5] bg-[#fffdf9] px-4 py-3 text-[10px] leading-5 text-[#92735e]">
        Rekening dan alamat di atas adalah contoh tampilan untuk preview. Data asli dapat diatur sesuai kebutuhan pasangan.
      </div>
    </section>
  );
}

function InvitationRsvpSection({ messages, onOpenForm }: { messages: GuestMessage[]; onOpenForm: () => void }) {
  return (
    <section id="invitation-rsvp" className="scroll-mt-16 border-t border-[#eadfd5] bg-[#f7f0e8] px-5 py-10 sm:px-10 sm:py-14">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><SectionHeading eyebrow="RSVP & wishes" title="Kehadiranmu berarti bagi kami." description="Sampaikan konfirmasi dan doa baikmu sebelum hari acara." /><button type="button" onClick={onOpenForm} className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#805538] px-4 py-3 text-[11px] font-black text-[#fffaf5] hover:bg-[#6f472f]">Isi RSVP <Send className="h-3.5 w-3.5" /></button></div>
      <div className="mt-7 grid gap-3 sm:grid-cols-3">{messages.slice(0, 3).map((message) => <div key={`${message.name}-${message.time}`} className="border border-[#dfd2c5] bg-[#fffdf9] p-4"><div className="flex items-center justify-between gap-2"><p className="text-[11px] font-black text-[#594136]">{message.name}</p><span className="text-[9px] text-[#b09b8a]">{message.time}</span></div><p className="mt-3 text-[11px] leading-5 text-[#806f63]">“{message.message}”</p></div>)}</div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a65d4c]">{eyebrow}</p><h2 className="mt-2 max-w-xl font-serif text-3xl font-semibold leading-tight text-[#594136] sm:text-4xl">{title}</h2><p className="mt-3 max-w-lg text-xs leading-5 text-[#92735e]">{description}</p></div>;
}

function RsvpModal({ attendance, guestCount, guestMessage, guestName, sent, onAttendance, onCount, onMessage, onName, onClose, onSubmit }: { attendance: Attendance; guestCount: string; guestMessage: string; guestName: string; sent: boolean; onAttendance: (value: Attendance) => void; onCount: (value: string) => void; onMessage: (value: string) => void; onName: (value: string) => void; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-[#382c25]/55 p-4 backdrop-blur-sm">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto border border-[#dfd2c5] bg-[#fbfaf7] shadow-2xl">
        <header className="flex items-start justify-between border-b border-[#eadfd5] px-5 py-4"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#a65d4c]">Konfirmasi kehadiran</p><h2 className="mt-1 font-serif text-2xl font-semibold text-[#594136]">Sampai bertemu.</h2></div><button type="button" aria-label="Tutup RSVP" onClick={onClose} className="grid h-8 w-8 place-items-center border border-[#dfd2c5] text-[#8c7768] hover:bg-[#f5ede5]"><X className="h-4 w-4" /></button></header>
        {sent ? <div className="px-5 py-10 text-center"><span className="mx-auto grid h-12 w-12 place-items-center bg-[#e4efe6] text-[#47705d]"><Check className="h-6 w-6" /></span><h3 className="mt-4 font-serif text-2xl font-semibold text-[#594136]">Terima kasih.</h3><p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-[#92735e]">Konfirmasi dan ucapanmu sudah masuk ke buku tamu Alya & Reza.</p><button type="button" onClick={onClose} className="mt-6 bg-[#805538] px-4 py-3 text-[11px] font-black text-[#fffaf5]">Tutup</button></div> : <form onSubmit={onSubmit} className="space-y-4 px-5 py-5"><label className="block"><span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.11em] text-[#8c7768]">Nama</span><input required value={guestName} onChange={(event) => onName(event.target.value)} placeholder="Nama kamu" className="w-full border border-[#dfd2c5] bg-[#fffdf9] px-3 py-2.5 text-xs font-semibold text-[#594136] outline-none placeholder:text-[#b4a293] focus:border-[#a65d4c]" /></label><div><span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.11em] text-[#8c7768]">Kehadiran</span><div className="grid grid-cols-3 gap-2">{(["Hadir", "Tidak hadir", "Masih tentatif"] as Attendance[]).map((item) => <button type="button" key={item} onClick={() => onAttendance(item)} className={`border px-2 py-2.5 text-[10px] font-bold ${attendance === item ? "border-[#a65d4c] bg-[#f4e7dd] text-[#a65d4c]" : "border-[#dfd2c5] bg-[#fffdf9] text-[#92735e]"}`}>{item}</button>)}</div></div><label className="block"><span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.11em] text-[#8c7768]">Jumlah tamu</span><select value={guestCount} onChange={(event) => onCount(event.target.value)} className="w-full border border-[#dfd2c5] bg-[#fffdf9] px-3 py-2.5 text-xs font-semibold text-[#594136] outline-none focus:border-[#a65d4c]"><option>1 orang</option><option>2 orang</option><option>3 orang</option><option>4 orang</option></select></label><label className="block"><span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.11em] text-[#8c7768]">Ucapan untuk pengantin <span className="font-normal normal-case tracking-normal">(opsional)</span></span><textarea value={guestMessage} onChange={(event) => onMessage(event.target.value)} rows={3} placeholder="Tulis doa baikmu..." className="w-full resize-none border border-[#dfd2c5] bg-[#fffdf9] px-3 py-2.5 text-xs text-[#594136] outline-none placeholder:text-[#b4a293] focus:border-[#a65d4c]" /></label><button type="submit" className="flex w-full items-center justify-center gap-2 bg-[#805538] py-3 text-[11px] font-black text-[#fffaf5] hover:bg-[#6f472f]">Kirim konfirmasi <Send className="h-3.5 w-3.5" /></button></form>}
      </div>
    </div>
  );
}