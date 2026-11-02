import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link, useLocation } from "@/lib/wouter";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useDisplayPrefs, LANGUAGE_OPTIONS, CURRENCY_OPTIONS } from "@/lib/use-display-prefs";
import {
  ArrowLeft, User, Bell, Shield, Smartphone, Globe,
  ChevronRight, LogOut, Trash2, Eye, Mail, Phone,
  FileText, HelpCircle, Info, CheckCircle,
  AlertTriangle, Key, RefreshCw, Download, Languages,
} from "lucide-react";

const API = "/api";

function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "Belum diisi";
  const clean = phone.replace(/\s+/g, "");
  if (clean.length <= 8) return phone;
  return clean.slice(0, 5) + " •••• " + clean.slice(-4);
}

/* ── Toggle Switch ────────────────────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200"
      style={{ background: on ? "#0194f3" : "#e2e8f0" }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200"
        style={{ transform: on ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

/* ── Row Components ───────────────────────────────────────── */
function RowLink({
  icon: Icon, iconBg, iconColor, label, sub, path, danger = false,
}: {
  icon: React.ElementType; iconBg: string; iconColor: string;
  label: string; sub?: string; path: string; danger?: boolean;
}) {
  return (
    <Link href={path}>
      <button className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-none ${danger ? "text-red-500" : "text-gray-800"}`}>{label}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5 leading-none">{sub}</p>}
        </div>
        <ChevronRight className={`w-4 h-4 shrink-0 ${danger ? "text-red-400" : "text-gray-300"}`} strokeWidth={2} />
      </button>
    </Link>
  );
}

function RowToggle({
  icon: Icon, iconBg, iconColor, label, sub, value, onChange,
}: {
  icon: React.ElementType; iconBg: string; iconColor: string;
  label: string; sub?: string; value: boolean; onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5">
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 leading-none">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5 leading-none">{sub}</p>}
      </div>
      <Toggle on={value} onChange={onChange} />
    </div>
  );
}

function RowInfo({
  icon: Icon, iconBg, iconColor, label, value,
}: {
  icon: React.ElementType; iconBg: string; iconColor: string;
  label: string; value: string;
}) {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5">
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 leading-none">{label}</p>
      </div>
      <span className="text-xs text-gray-400 font-medium">{value}</span>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-4 mb-1.5">{title}</p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
        {children}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function SettingsPage() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { prefs: displayPrefs } = useDisplayPrefs();
  const activeLang = LANGUAGE_OPTIONS.find(l => l.code === displayPrefs.lang);
  const activeCurrency = CURRENCY_OPTIONS.find(c => c.code === displayPrefs.currency);

  type NotifState = { push: boolean; email: boolean; promo: boolean; event: boolean; komunitas: boolean; berita: boolean };

  const [notif, setNotif] = useState<NotifState>({
    push: true, email: false, promo: true, event: true, komunitas: false, berita: true,
  });
  const [notifLoaded, setNotifLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [security, setSecurity] = useState<{ twofa_enabled: boolean; biometric_pref: boolean } | null>(null);
  const [securityLoading, setSecurityLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("nempo_user_token") : null;

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch(`${API}/user/security`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch(`${API}/user/notifications/prefs`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
    ]).then(([sec, pref]) => {
      if (sec) setSecurity(sec);
      if (pref) {
        setNotif({
          push: pref.push_enabled, email: pref.email_enabled, promo: pref.promo_enabled,
          event: pref.event_enabled, komunitas: pref.komunitas_enabled, berita: pref.berita_enabled,
        });
      }
      setNotifLoaded(true);
    }).catch(() => setNotifLoaded(true));
  }, [token]);

  const saveNotif = useCallback((next: NotifState) => {
    if (!token) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch(`${API}/user/notifications/prefs`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          push_enabled: next.push, email_enabled: next.email, promo_enabled: next.promo,
          event_enabled: next.event, komunitas_enabled: next.komunitas, berita_enabled: next.berita,
        }),
      }).catch(() => {});
    }, 600);
  }, [token]);

  const handleTwofaToggle = async () => {
    if (!security) return;
    if (!security.twofa_enabled) {
      navigate("/setup-2fa");
    } else {
      if (!confirm("Nonaktifkan Autentikasi Dua Faktor? Akun kamu akan jadi kurang aman.")) return;
      setSecurityLoading(true);
      const r = await fetch(`${API}/user/2fa`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (r.ok) setSecurity(s => s ? { ...s, twofa_enabled: false } : s);
      setSecurityLoading(false);
    }
  };

  const handleBiometricToggle = async () => {
    if (!security) return;
    const next = !security.biometric_pref;
    setSecurity(s => s ? { ...s, biometric_pref: next } : s);
    await fetch(`${API}/user/security/biometric`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: next }),
    }).catch(() => {});
  };

  const toggleNotif = (key: keyof NotifState) => {
    const next = { ...notif, [key]: !notif[key] };
    setNotif(next);
    saveNotif(next);
  };

  return (
    <Layout>
      <SEO title="Pengaturan" noIndex />
      <div className="pb-24 md:pb-10">

        {/* ── Header ── */}
        <div
          className="relative pt-safe"
          style={{ background: "linear-gradient(135deg, #001E6E 0%, #0046B8 60%, #0194f3 100%)" }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 80% 30%, #FFC300 0%, transparent 55%)" }} />
          <div className="relative flex items-center gap-3 px-4 pt-5 pb-5">
            <button
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-white" strokeWidth={2} />
            </button>
            <div>
              <h1 className="text-white font-black text-lg leading-none">Pengaturan</h1>
              <p className="text-white/50 text-xs mt-0.5">Kelola akun & preferensi Anda</p>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="px-4 pt-5">

          {/* Akun */}
          <SectionCard title="Akun">
            <RowLink icon={User}     iconBg="bg-blue-50"   iconColor="text-blue-600"   label="Edit Profil"          sub={user?.name ?? "Nama, foto & bio"}             path="/edit-profil" />
            <RowLink icon={Mail}     iconBg="bg-sky-50"    iconColor="text-sky-600"    label="Email"                sub={user?.email ?? "–"}       path="/edit-email" />
            <RowLink icon={Phone}    iconBg="bg-teal-50"   iconColor="text-teal-600"   label="Nomor HP"             sub={maskPhone(user?.phone)}             path="/edit-phone" />
            {!user?.is_google && (
              <RowLink icon={Key}    iconBg="bg-blue-50"   iconColor="text-[#0172B1]"  label="Ganti Password"       sub="Ubah kata sandi akun"  path="/profil/ganti-password" />
            )}
            <RowLink
              icon={CheckCircle}
              iconBg={user?.is_google ? "bg-emerald-50" : "bg-amber-50"}
              iconColor={user?.is_google ? "text-emerald-600" : "text-amber-500"}
              label="Verifikasi Identitas"
              sub={user?.is_google ? "Terverifikasi via Google ✓" : "Akun belum terverifikasi"}
              path="/verifikasi-identitas"
            />
          </SectionCard>

          {/* Keamanan */}
          <SectionCard title="Keamanan">
            <RowToggle
              icon={Shield}   iconBg="bg-violet-50"  iconColor="text-violet-600"
              label="Autentikasi Dua Faktor"
              sub={security?.twofa_enabled ? "Aktif · OTP via Authenticator" : "OTP via Authenticator"}
              value={security?.twofa_enabled ?? false}
              onChange={handleTwofaToggle}
            />
            <RowToggle
              icon={Smartphone} iconBg="bg-indigo-50" iconColor="text-indigo-600"
              label="Login Biometrik"
              sub={security?.biometric_pref ? "Aktif · Sidik jari / Face ID" : "Sidik jari / Face ID"}
              value={security?.biometric_pref ?? false}
              onChange={handleBiometricToggle}
            />
            <RowLink icon={Eye}  iconBg="bg-slate-50" iconColor="text-slate-600" label="Sesi Aktif"  sub="Kelola perangkat yang login"  path="/sesi-aktif" />
            <RowLink icon={RefreshCw} iconBg="bg-blue-50" iconColor="text-[#0172B1]" label="Riwayat Aktivitas" sub="Login & transaksi terbaru" path="/riwayat-aktivitas" />
          </SectionCard>

          {/* Notifikasi */}
          <SectionCard title="Notifikasi">
            <RowToggle
              icon={Bell}  iconBg="bg-blue-50"    iconColor="text-blue-600"
              label="Push Notification"
              sub={notif.push ? "Aktif · Notifikasi di layar perangkat" : "Notifikasi di layar perangkat"}
              value={notif.push}     onChange={() => toggleNotif("push")}
            />
            <RowToggle
              icon={Mail}  iconBg="bg-sky-50"     iconColor="text-sky-600"
              label="Notifikasi Email"
              sub={notif.email ? `Aktif · ${user?.email ?? "email terdaftar"}` : "Dikirim ke email terdaftar"}
              value={notif.email}    onChange={() => toggleNotif("email")}
            />
            <RowToggle
              icon={Bell}  iconBg="bg-blue-50"    iconColor="text-[#0172B1]"
              label="Promo & Diskon"
              sub={notif.promo ? "Aktif · Voucher dan penawaran spesial" : "Voucher dan penawaran spesial"}
              value={notif.promo}    onChange={() => toggleNotif("promo")}
            />
            <RowToggle
              icon={Bell}  iconBg="bg-emerald-50" iconColor="text-emerald-600"
              label="Event & Acara"
              sub={notif.event ? "Aktif · Info event baru di Garut" : "Info event baru di Garut"}
              value={notif.event}    onChange={() => toggleNotif("event")}
            />
            <RowToggle
              icon={Bell}  iconBg="bg-violet-50"  iconColor="text-violet-600"
              label="Komunitas"
              sub={notif.komunitas ? "Aktif · Komentar & diskusi" : "Komentar & diskusi"}
              value={notif.komunitas} onChange={() => toggleNotif("komunitas")}
            />
            <RowToggle
              icon={Bell}  iconBg="bg-rose-50"    iconColor="text-rose-600"
              label="Berita Terkini"
              sub={notif.berita ? "Aktif · Kabar terbaru seputar Garut" : "Kabar terbaru seputar Garut"}
              value={notif.berita}   onChange={() => toggleNotif("berita")}
            />
          </SectionCard>

          {/* Tampilan */}
          <SectionCard title="Tampilan & Bahasa">
            <RowLink icon={Languages} iconBg="bg-blue-50" iconColor="text-blue-600"
              label="Bahasa Aplikasi"
              sub={activeLang ? `${activeLang.flag} ${activeLang.label}` : "Indonesia (Bahasa)"}
              path="/pilih-bahasa" />
            <RowLink icon={Globe}     iconBg="bg-teal-50"  iconColor="text-teal-600"
              label="Mata Uang"
              sub={activeCurrency ? `${activeCurrency.flag} ${activeCurrency.label} (${activeCurrency.code})` : "Rupiah (IDR)"}
              path="/pilih-mata-uang" />
          </SectionCard>

          {/* Data & Privasi */}
          <SectionCard title="Data & Privasi">
            <RowLink icon={Download}      iconBg="bg-blue-50"   iconColor="text-blue-600"   label="Unduh Data Saya"    sub="Ekspor riwayat akun & transaksi"  path="/unduh-data" />
            <RowLink icon={Eye}           iconBg="bg-slate-50"  iconColor="text-slate-600"  label="Kebijakan Privasi"  sub="Cara kami melindungi data Anda"    path="/privacy" />
            <RowLink icon={FileText}      iconBg="bg-gray-50"   iconColor="text-gray-500"   label="Syarat & Ketentuan" sub="Peraturan penggunaan aplikasi"      path="/tos" />
          </SectionCard>

          {/* Aplikasi */}
          <SectionCard title="Aplikasi">
            <RowLink  icon={HelpCircle} iconBg="bg-teal-50"   iconColor="text-teal-600"  label="Bantuan & FAQ"   sub="Temukan jawaban atas pertanyaan Anda" path="/bantuan" />
            <RowLink  icon={AlertTriangle} iconBg="bg-blue-50" iconColor="text-[#0172B1]" label="Laporkan Masalah" sub="Kirim laporan bug atau keluhan"     path="/laporkan" />
            <RowInfo  icon={Info}       iconBg="bg-gray-50"   iconColor="text-gray-400"  label="Versi Aplikasi"  value="v2.4.1" />
          </SectionCard>

          {/* Bahaya */}
          <SectionCard title="Lainnya">
            <button
              onClick={() => { logout(); navigate("/auth/login"); }}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <LogOut className="w-4 h-4 text-red-500" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-none text-red-500">Keluar dari Akun</p>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 text-red-400" strokeWidth={2} />
            </button>
            <RowLink
              icon={Trash2} iconBg="bg-red-50" iconColor="text-red-500"
              label="Hapus Akun" sub="Tindakan ini tidak dapat dibatalkan" danger path="/profil/hapus-akun"
            />
          </SectionCard>

        </div>
      </div>
    </Layout>
  );
}
