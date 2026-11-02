import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link, useLocation } from "@/lib/wouter";
import { useEffect, useState } from "react";
import {
  Building2, Phone, Tag, LogOut, Loader2, ArrowRight, ChevronRight,
  Edit3, Lock, HelpCircle, Store, CheckCircle, AlertCircle, Eye, EyeOff,
  BadgeCheck, Clock, FileSignature, MessageCircle, Info,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { MitraBusinessPanel } from "@/components/mitra-business-panel";
import { NEMPO_CONSULT_URL } from "@/lib/contact";

const API = "/api";

const MENU = [
  { icon: Edit3, label: "Edit Profil Usaha", sub: "Ubah nama, kontak & telepon", key: "edit" as const, color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Lock,  label: "Ganti Password",    sub: "Perbarui password akun mitra", key: "password" as const, color: "text-[#0172B1]", bg: "bg-blue-50" },
  { icon: HelpCircle, label: "Bantuan Mitra", sub: "Hubungi admin Nempo Organizer", key: "help" as const, color: "text-teal-600", bg: "bg-teal-50" },
];

export default function MitraDashboardPage() {
  const { mitra, mitraToken, loading, logoutMitra, updateMitraProfile, changeMitraPassword } = useAuth();
  const [, setLocation] = useLocation();
  const [panel, setPanel] = useState<null | "edit" | "password" | "help">(null);

  const [editForm, setEditForm] = useState({ business_name: "", contact_name: "", phone: "" });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  function handleLogout() {
    logoutMitra();
    setLocation("/");
  }

  function openEdit() {
    setEditForm({
      business_name: mitra?.business_name ?? "",
      contact_name: mitra?.contact_name ?? "",
      phone: mitra?.phone ?? "",
    });
    setEditError(""); setEditSuccess(false);
    setPanel("edit");
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.business_name.trim()) return;
    // Validasi format telepon
    const phoneClean = editForm.phone.trim();
    if (phoneClean && !/^(\+62|62|0)[0-9]{8,13}$/.test(phoneClean.replace(/[\s\-]/g, ""))) {
      setEditError("Format telepon tidak valid. Gunakan 08xxx atau +62xxx.");
      return;
    }
    setEditSaving(true); setEditError("");
    try {
      await updateMitraProfile(editForm);
      setEditSuccess(true);
      setTimeout(() => { setPanel(null); setEditSuccess(false); }, 1200);
    } catch (err: any) {
      setEditError(err?.message || "Gagal menyimpan perubahan.");
    } finally {
      setEditSaving(false);
    }
  }

  async function handleSavePw(e: React.FormEvent) {
    e.preventDefault();
    if (!pwForm.current || !pwForm.next) return;
    if (pwForm.next.length < 6) { setPwError("Password baru minimal 6 karakter"); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Konfirmasi password tidak cocok"); return; }
    if (pwForm.current === pwForm.next) { setPwError("Password baru harus berbeda dari password saat ini"); return; }
    setPwSaving(true); setPwError("");
    try {
      await changeMitraPassword(pwForm.current, pwForm.next);
      setPwSuccess(true);
      setPwForm({ current: "", next: "", confirm: "" });
      setTimeout(() => { setPanel(null); setPwSuccess(false); }, 1200);
    } catch (err: any) {
      setPwError(err?.message || "Gagal mengganti password.");
    } finally {
      setPwSaving(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!mitra || !mitraToken) {
    return (
      <Layout>
        <div className="relative bg-gradient-to-br from-[#001E6E] via-[#0046B8] to-[#0194f3] pt-14 pb-28 px-6 overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -mr-24 -mt-24 pointer-events-none" />
          <div className="relative w-24 h-24 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/35 flex items-center justify-center mb-5 shadow-2xl">
            <Building2 className="w-11 h-11 text-white" strokeWidth={1.6} />
          </div>
          <h2 className="text-white font-black text-2xl mb-2">Akun Mitra</h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            Masuk sebagai mitra untuk mengelola profil usahamu di Nempo Organizer
          </p>
        </div>
        <div className="bg-gray-50 -mt-10 rounded-t-[2rem] px-5 pt-8 pb-24 md:pb-10 flex flex-col items-center">
          <div className="w-full max-w-sm flex flex-col gap-4">
            <Link href="/auth/login">
              <button className="w-full py-4 bg-gradient-to-r from-[#0172B1] via-[#0194f3] to-[#1BA0E2] text-white font-black text-base rounded-2xl shadow-lg shadow-[#0194f3]/30 hover:opacity-90 active:scale-[.98] transition-all flex items-center justify-center gap-2">
                Masuk sebagai Mitra
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </Link>
            <p className="text-center text-gray-400 text-[11px] leading-relaxed">
              Belum punya akun mitra? ID dan password dibuat oleh admin Nempo Organizer.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const mouStatus = mitra.mou_status ?? "dalam_proses";

  return (
    <Layout>
      <SEO title="Dashboard Mitra" noIndex />
      <div className="pb-24 md:pb-12">

        {/* ── Hero ── */}
        <div className="relative bg-gradient-to-br from-[#001E6E] via-[#0046B8] to-[#0194f3] pt-8 pb-24 md:pb-28 px-5">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #FFC300 0%, transparent 60%)" }} />
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -mr-16 -mt-16" />

          <div className="relative max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">Akun Mitra</span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-white/15 text-white">
                <Store className="w-3 h-3" strokeWidth={2} /> Mitra Nempo Organizer
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shrink-0">
                <Store className="w-9 h-9 text-white/85" strokeWidth={1.5} />
              </div>
              <div className="flex-1 pb-1 min-w-0">
                <h1 className="text-white font-black text-xl md:text-2xl leading-tight truncate">{mitra.business_name}</h1>
                <p className="text-white/60 text-xs mb-2 font-mono">ID: {mitra.username}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {mitra.category && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/15 text-white">
                      <Tag className="w-3 h-3" strokeWidth={2} /> {mitra.category}
                    </div>
                  )}
                  {mitra.phone && (
                    <div className="inline-flex items-center gap-1 text-[10px] text-white/60">
                      <Phone className="w-3 h-3" strokeWidth={2} /> {mitra.phone}
                    </div>
                  )}
                  {mouStatus === "aktif" && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-400/25 text-emerald-200 border border-emerald-400/30">
                      <BadgeCheck className="w-3 h-3" strokeWidth={2} /> MoU Aktif
                    </div>
                  )}
                  {(mouStatus === "dalam_proses" || !mitra.mou_status) && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                      <Clock className="w-3 h-3" strokeWidth={2} /> MoU Dalam Proses
                    </div>
                  )}
                  {mouStatus === "berakhir" && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-400/20 text-red-200 border border-red-400/30">
                      <FileSignature className="w-3 h-3" strokeWidth={2} /> MoU Berakhir
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* ── Info card ── */}
          <div className="px-4 -mt-14 relative z-10 mb-5">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Info Kontak</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-sm">
                <div className="flex justify-between sm:flex-col sm:gap-1">
                  <span className="text-gray-400">Nama Kontak</span>
                  <span className="font-semibold text-gray-800">{mitra.contact_name || "–"}</span>
                </div>
                <div className="flex justify-between sm:flex-col sm:gap-1">
                  <span className="text-gray-400">Telepon</span>
                  <span className="font-semibold text-gray-800">{mitra.phone || "–"}</span>
                </div>
                <div className="flex justify-between sm:flex-col sm:gap-1">
                  <span className="text-gray-400">Kategori</span>
                  <span className="font-semibold text-gray-800">{mitra.category || "–"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── MoU Status Info ── */}
          {mouStatus === "dalam_proses" && (
            <div className="mx-4 mb-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-800">MoU dalam proses penandatanganan</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Akun kamu sudah aktif, namun MoU dengan Nempo Organizer belum ditandatangani.{" "}
                  <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="font-bold underline">
                    Hubungi admin via DM Instagram
                  </a>{" "}
                  untuk melanjutkan proses.
                </p>
              </div>
            </div>
          )}
          {mouStatus === "berakhir" && (
            <div className="mx-4 mb-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
              <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-800">MoU telah berakhir</p>
                <p className="text-[11px] text-red-700 mt-0.5">
                  Masa berlaku MoU kerja sama kamu dengan Nempo Organizer sudah habis. Segera{" "}
                  <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="font-bold underline">
                    hubungi admin via DM Instagram
                  </a>{" "}
                  untuk pembaruan.
                </p>
              </div>
            </div>
          )}

          {/* ── Pengelolaan usaha ── */}
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-5">Pengelolaan Usaha</p>
          <MitraBusinessPanel mitraToken={mitraToken} hasListing={!!(mitra.listing_type && mitra.listing_id)} listingType={mitra.listing_type} />

          {/* ── Menu ── */}
          <div className="px-4 mb-5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Pengaturan Akun</p>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {MENU.map((item, idx) => (
                <button
                  key={item.key}
                  onClick={() => item.key === "edit" ? openEdit() : setPanel(item.key)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left ${idx !== MENU.length - 1 ? "border-b border-gray-50" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm leading-tight">{item.label}</p>
                      <p className="text-gray-400 text-[11px] mt-0.5 truncate">{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" strokeWidth={2} />
                </button>
              ))}
            </div>
          </div>

          {/* ── Logout ── */}
          <div className="px-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} />
              Keluar dari Akun Mitra
            </button>
          </div>
        </div>
      </div>

      {/* ── Edit profil modal ── */}
      {panel === "edit" && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 px-4" onClick={() => setPanel(null)}>
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-sm p-5 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 md:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-gray-900 text-lg mb-4">Edit Profil Usaha</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              {editError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> <span>{editError}</span>
                </div>
              )}
              {editSuccess && (
                <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl px-3 py-2.5">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> <span>Profil usaha berhasil diperbarui.</span>
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Nama Usaha</label>
                <input required value={editForm.business_name} onChange={e => setEditForm(p => ({ ...p, business_name: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Nama Kontak</label>
                <input value={editForm.contact_name} onChange={e => setEditForm(p => ({ ...p, contact_name: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Telepon</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="08xxx atau +62xxx"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setPanel(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold">Batal</button>
                <button type="submit" disabled={editSaving} className="flex-1 py-3 rounded-xl bg-[#0194f3] text-white text-sm font-black disabled:opacity-60 flex items-center justify-center gap-1.5">
                  {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Ganti password modal ── */}
      {panel === "password" && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 px-4" onClick={() => setPanel(null)}>
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-sm p-5 animate-in fade-in slide-in-from-bottom-4 md:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-gray-900 text-lg mb-4">Ganti Password</h3>
            <form onSubmit={handleSavePw} className="space-y-3.5">
              {pwError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> <span>{pwError}</span>
                </div>
              )}
              {pwSuccess && (
                <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl px-3 py-2.5">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> <span>Password berhasil diganti.</span>
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Password Saat Ini</label>
                <input required type="password" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Password Baru</label>
                <div className="relative">
                  <input required minLength={6} type={showPw ? "text" : "password"} value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-11 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Konfirmasi Password Baru</label>
                <input required minLength={6} type={showPw ? "text" : "password"} value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setPanel(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold">Batal</button>
                <button type="submit" disabled={pwSaving} className="flex-1 py-3 rounded-xl bg-[#0194f3] text-white text-sm font-black disabled:opacity-60 flex items-center justify-center gap-1.5">
                  {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Bantuan panel ── */}
      {panel === "help" && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 px-4" onClick={() => setPanel(null)}>
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-sm p-5 animate-in fade-in slide-in-from-bottom-4 md:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-gray-900 text-lg mb-1">Bantuan Mitra</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Butuh bantuan terkait akun mitra, perubahan kategori usaha, atau pertanyaan teknis lainnya? Tim admin Nempo Organizer siap membantu.
            </p>
            <div className="space-y-2.5 mb-4">
              {[
                { label: "Ubah ID / Username", desc: "Hanya bisa dilakukan oleh admin" },
                { label: "Ubah Kategori Usaha", desc: "Hubungi admin untuk perubahan kategori" },
                { label: "Hapus Akun Mitra", desc: "Proses verifikasi melalui admin" },
                { label: "Masalah Teknis / Bug", desc: "Laporkan masalah langsung ke admin" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-2.5 bg-gray-50 rounded-2xl px-3.5 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0194f3] mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">{item.label}</p>
                    <p className="text-[11px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPanel(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold">Tutup</button>
              <a
                href={NEMPO_CONSULT_URL}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-[#25d366] text-white text-sm font-black flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" /> Chat Admin via Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
