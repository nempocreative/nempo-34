import { useState, useRef } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "@/lib/wouter";
import { ArrowLeft, User, Phone, Camera, CheckCircle, Loader2, AlertCircle } from "lucide-react";

const API = "/api";

export default function EditProfilPage() {
  const { user, token, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatar, setAvatar] = useState(user?.avatar_url ?? "");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await fetch(`${API}/upload`, { method: "POST", body: fd });
      const d = await r.json();
      if (d.url) setAvatar(d.url);
    } catch {}
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Nama tidak boleh kosong."); return; }
    setSaving(true); setError("");
    try {
      await updateProfile({ name: name.trim(), phone: phone.trim() || undefined, avatar_url: avatar || undefined });
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch {
      setError("Gagal menyimpan. Coba lagi.");
    } finally { setSaving(false); }
  };

  const initials = (name || user?.name || "U").charAt(0).toUpperCase();

  return (
    <Layout>
      <SEO title="Edit Profil" noIndex />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <Link href="/profil">
            <button className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
          </Link>
          <h1 className="font-bold text-gray-900 text-[15px]">Edit Profil</h1>
        </div>

        <form onSubmit={handleSave} className="max-w-lg mx-auto px-4 py-6 space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="relative">
              {avatar
                ? <img src={avatar} alt="avatar" className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-lg" />
                : <div className="h-24 w-24 rounded-full flex items-center justify-center text-white font-black text-3xl ring-4 ring-white shadow-lg"
                    style={{ background: "linear-gradient(135deg,#0194f3,#0172B1)" }}>{initials}</div>
              }
              <button type="button" onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-[#0194f3] text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-[#0172B1] transition-colors">
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </div>
            <p className="text-xs text-gray-400">Ketuk kamera untuk ganti foto</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/20 transition-all"
                placeholder="Nama kamu" />
            </div>
          </div>

          {/* Email — read-only */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <input value={user?.email ?? ""} disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm cursor-not-allowed" />
            <p className="text-[10px] text-gray-400 mt-1">Email tidak dapat diubah</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nomor HP</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={phone} onChange={e => setPhone(e.target.value)} type="tel"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/20 transition-all"
                placeholder="+62..." />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success */}
          {done && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
              <p className="text-sm text-emerald-700 font-semibold">Profil berhasil disimpan!</p>
            </div>
          )}

          {/* Save */}
          <button type="submit" disabled={saving}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#0194f3,#0172B1)", boxShadow: "0 4px 16px rgba(1,148,243,0.35)" }}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
