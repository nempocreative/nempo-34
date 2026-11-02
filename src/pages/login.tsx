import { useState, useEffect } from "react";
import { Link, useLocation } from "@/lib/wouter";
import { SEO } from "@/components/seo";
import {
  Mail, Lock, Eye, EyeOff, Loader2, AlertCircle,
  User, Building2, ArrowRight, ChevronLeft, MapPin,
  Star, Coffee, Ticket, KeyRound,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { NEMPO_CONSULT_URL } from "@/lib/contact";

type AccountType = "pengguna" | "mitra";

const TYPES = [
  {
    id: "pengguna" as AccountType,
    label: "Pengguna",
    Icon: User,
    desc: "Jelajahi wisata, kuliner & event Jawa Barat",
    placeholder: "Email atau No. HP",
    from: "#0194f3",
    to: "#0055b3",
    shadow: "rgba(1,148,243,0.32)",
    light: "rgba(1,148,243,0.08)",
    border: "rgba(1,148,243,0.20)",
  },
  {
    id: "mitra" as AccountType,
    label: "Mitra",
    Icon: Building2,
    desc: "Kelola bisnis & promosi di Jawa Barat",
    placeholder: "ID mitra dari admin",
    from: "#f97316",
    to: "#c2410c",
    shadow: "rgba(249,115,22,0.32)",
    light: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.20)",
  },
] as const;

const FEATURES = [
  { Icon: MapPin,  text: "500+ destinasi wisata Jawa Barat" },
  { Icon: Coffee,  text: "Kuliner & cafe lokal terbaik"  },
  { Icon: Ticket,  text: "Event & tiket wisata terkini"  },
  { Icon: Star,    text: "Review & rating terpercaya"    },
];

export default function LoginPage() {
  const { login, loginMitra, user, mitra } = useAuth();
  const [, setLocation] = useLocation();
  const [accountType, setAccountType] = useState<AccountType>("pengguna");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => { if (user) setLocation("/profil"); }, [user]);
  useEffect(() => { if (mitra) setLocation("/mitra-dashboard"); }, [mitra]);

  const active = TYPES.find(t => t.id === accountType)!;
  const isMitra = accountType === "mitra";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true); setError("");
    try {
      if (isMitra) {
        await loginMitra(email.trim(), password);
        setLocation("/mitra-dashboard");
      } else {
        await login(email.trim(), password);
        setLocation("/profil");
      }
    } catch (err: any) {
      setError(err?.message || (isMitra ? "ID atau password salah. Silakan coba lagi." : "Email/No. HP atau password salah. Silakan coba lagi."));
    } finally {
      setLoading(false);
    }
  }

  function switchType(id: AccountType) {
    setAccountType(id);
    setEmail("");
    setPassword("");
    setError("");
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row">
      <SEO title="Masuk" noIndex path="/login" />

      {/* ═══════════════════ LEFT PANEL (desktop only) ═══════════════════ */}
      <div
        className="hidden lg:flex lg:w-[46%] xl:w-[42%] flex-col justify-between p-10 xl:p-14 relative overflow-hidden shrink-0"
        style={{ background: "linear-gradient(155deg, #0a1628 0%, #0d2344 45%, #0f3a6e 100%)" }}
      >
        {/* Blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, #0194f3, transparent 70%)" }} />
        <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #f97316, transparent 70%)" }} />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fbbf24, transparent 70%)" }} />

        {/* Floating dots */}
        {[
          [12,8],[78,15],[5,42],[90,38],[18,68],[85,72],[40,88],[60,20],
        ].map(([l, t], i) => (
          <div key={i} className="pointer-events-none absolute rounded-full bg-white/20"
            style={{ width: i % 2 === 0 ? 4 : 3, height: i % 2 === 0 ? 4 : 3, left: `${l}%`, top: `${t}%` }} />
        ))}

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/Assets/Logo/nempo-new.webp" alt="Nempo" className="h-10 w-10 object-contain rounded-xl bg-white p-1" />
          <div>
            <p className="text-white font-black text-lg leading-none">Nempo</p>
            <p className="text-white/50 text-[11px] font-medium tracking-widest uppercase">ID</p>
          </div>
        </Link>

        {/* Center content */}
        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <h1 className="text-white font-black text-3xl xl:text-4xl leading-tight mb-3">
              Jelajahi Jawa Barat<br />
              <span style={{ color: "#0194f3" }}>Lebih Jauh</span>
            </h1>
            <p className="text-white/60 text-sm xl:text-base leading-relaxed max-w-xs">
              Platform pariwisata digital untuk menjelajahi keindahan Jawa Barat.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-2.5">
            {FEATURES.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(1,148,243,0.18)", border: "1px solid rgba(1,148,243,0.25)" }}>
                  <Icon className="h-4 w-4" style={{ color: "#0194f3" }} strokeWidth={2} />
                </div>
                <p className="text-white/75 text-sm">{text}</p>
              </div>
            ))}
          </div>

          {/* Brand mark */}
          <div className="self-start rounded-3xl border border-white/15 bg-white/10 p-4 shadow-lg shadow-black/10">
            <img
              src="/Assets/Logo/nempo-new.webp"
              alt="Logo Nempo"
              className="h-16 w-16 object-contain opacity-90"
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-white/30 text-xs">© 2025 Nempo Organizer · Swiss van Java</p>
        </div>
      </div>

      {/* ═══════════════════ RIGHT PANEL (form) ═══════════════════ */}
      <div
        className="flex-1 flex flex-col min-h-[100dvh] lg:min-h-0 lg:overflow-y-auto relative"
        style={{ background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)" }}
      >
        {/* Mobile top background strip */}
        <div
          className="lg:hidden absolute top-0 left-0 right-0 h-52 pointer-events-none"
          style={{ background: "linear-gradient(160deg, #0a1628 0%, #0f3a6e 100%)" }}
        />
        {/* Mobile blobs */}
        <div className="lg:hidden pointer-events-none absolute top-0 right-0 w-48 h-48 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #0194f3, transparent 70%)" }} />
        <div className="lg:hidden pointer-events-none absolute top-24 left-0 w-32 h-32 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #fbbf24, transparent 70%)" }} />

        {/* Back button */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-5 lg:px-8 lg:pt-7">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors lg:text-gray-500 lg:hover:text-gray-800"
            style={{ color: "rgba(255,255,255,0.80)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "white")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.80)")}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="lg:hidden">Kembali</span>
            <span className="hidden lg:inline text-gray-500 hover:text-gray-800">Kembali</span>
          </button>
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/Assets/Logo/nempo-new.webp" alt="Nempo" className="h-8 w-8 object-contain rounded-lg bg-white p-1" />
            <span className="text-white font-black text-sm">Nempo Organizer</span>
          </Link>
        </div>

        {/* Form card */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 lg:py-10">
          <div
            className="w-full"
            style={{
              maxWidth: 440,
              background: "white",
              borderRadius: 24,
              boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8)",
              overflow: "hidden",
            }}
          >
            {/* Accent bar */}
            <div
              className="h-1"
              style={{
                background: `linear-gradient(90deg, ${active.from} 0%, ${active.to} 100%)`,
                transition: "background 0.35s ease",
              }}
            />

            <div className="px-6 pt-6 pb-7 sm:px-8 sm:pt-7 sm:pb-8">
              {/* Heading (desktop only — mobile shows logo in header) */}
              <div className="hidden lg:block mb-6">
                <h2 className="text-2xl font-black text-gray-900 leading-tight">Selamat Datang!</h2>
                <p className="text-gray-400 text-sm mt-1">Masuk untuk menjelajahi Jawa Barat lebih jauh</p>
              </div>
              <div className="lg:hidden mb-5">
                <h2 className="text-xl font-black text-gray-900 leading-tight">Masuk ke Akunmu</h2>
                <p className="text-gray-400 text-xs mt-0.5">Pilih tipe akun dan isi data login</p>
              </div>

              {/* Account type toggle */}
              <div className="flex p-1 rounded-2xl mb-5" style={{ background: "#f1f5f9" }}>
                {TYPES.map(t => {
                  const isActive = accountType === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => switchType(t.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${t.from} 0%, ${t.to} 100%)`
                          : "transparent",
                        color: isActive ? "white" : "#64748b",
                        boxShadow: isActive ? `0 4px 14px ${t.shadow}` : "none",
                        transform: isActive ? "scale(1.02)" : "scale(1)",
                      }}
                    >
                      <t.Icon className="h-4 w-4" strokeWidth={2.5} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Descriptor chip */}
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl mb-5 transition-all duration-300"
                style={{ background: active.light, border: `1px solid ${active.border}` }}
              >
                <active.Icon className="h-4 w-4 shrink-0" style={{ color: active.from }} strokeWidth={2.5} />
                <p className="text-xs font-semibold" style={{ color: active.from }}>{active.desc}</p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3.5 py-3">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email/No. HP / ID Mitra */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">{isMitra ? "ID Mitra" : "Email atau No. HP"}</label>
                  <div className="relative">
                    {isMitra
                      ? <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      : <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />}
                    <input
                      type="text"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="username"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 text-sm transition-all outline-none"
                      placeholder={active.placeholder}
                      onFocus={e => {
                        e.target.style.borderColor = active.from;
                        e.target.style.boxShadow = `0 0 0 3px ${active.light}`;
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-11 text-sm transition-all outline-none"
                      placeholder="Masukkan password"
                      onFocus={e => {
                        e.target.style.borderColor = active.from;
                        e.target.style.boxShadow = `0 0 0 3px ${active.light}`;
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {!isMitra && (
                    <div className="flex justify-end pt-0.5">
                      <Link
                        href="/forgot-password"
                        className="text-[11px] font-semibold hover:underline transition-colors"
                        style={{ color: active.from }}
                      >
                        Lupa Password?
                      </Link>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-extrabold text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, ${active.from} 0%, ${active.to} 100%)`,
                    boxShadow: `0 6px 20px ${active.shadow}`,
                    transition: "background 0.35s ease, box-shadow 0.35s ease",
                  }}
                >
                  {loading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</>
                    : <>Masuk sebagai {active.label} <ArrowRight className="h-4 w-4" /></>
                  }
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-gray-300 text-xs font-medium">atau</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Register / Contact admin */}
              {isMitra ? (
                <div
                  className="flex items-start gap-3 rounded-2xl px-4 py-3.5 text-left"
                  style={{ background: active.light }}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "#fff" }}
                  >
                    <KeyRound className="h-4 w-4" style={{ color: active.from }} />
                  </div>
                  <p className="text-xs leading-relaxed text-gray-600">
                    <span className="block font-bold text-gray-800">Belum punya akun mitra?</span>
                    ID dan password akun mitra dibuat oleh admin Nempo Organizer.{" "}
                    <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="font-bold underline">
                      Hubungi admin via DM Instagram
                    </a>{" "}
                    untuk mendapatkannya.
                  </p>
                </div>
              ) : (
                <p className="text-center text-xs text-gray-500">
                  Belum punya akun?{" "}
                  <Link
                    href="/auth/register"
                    className="font-extrabold hover:underline"
                    style={{ color: active.from }}
                  >
                    Daftar sekarang
                  </Link>
                </p>
              )}
            </div>

            {/* Footer strip */}
            <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/60 flex items-center justify-center gap-3 flex-wrap">
              {[
                { label: "Syarat & Ketentuan", href: "/tos" },
                { label: "Privasi", href: "/privacy" },
                { label: "Bantuan", href: "/bantuan" },
              ].map((l, i, arr) => (
                <span key={l.href} className="flex items-center gap-3">
                  <Link href={l.href} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">{l.label}</Link>
                  {i < arr.length - 1 && <span className="text-gray-200 text-[10px]">·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Tagline below card */}
          <p className="mt-5 text-gray-400 text-[11px] text-center">
            © 2025 Nempo Organizer · Platform Pariwisata Digital
          </p>
        </div>
      </div>
    </div>
  );
}
