import { useState } from "react";
import { Link, useLocation } from "@/lib/wouter";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { ArrowLeft, Mail, Lock, User, Phone, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Konfirmasi password tidak cocok"); return; }
    if (form.password.length < 6) { setError("Password minimal 6 karakter"); return; }
    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password, form.phone.trim() || undefined);
      setSuccess(true);
      setTimeout(() => setLocation("/profil"), 1500);
    } catch (e: any) {
      setError(e?.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] w-full flex">
      <SEO title="Daftar Akun" noIndex path="/register" />
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-blue-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" />
        <div className="relative z-10 text-center text-white">
           <img src="/Assets/Logo/nempo-new.webp" alt="Logo" className="h-20 w-20 object-contain rounded-2xl bg-white p-2 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-3">Bergabung dengan Nempo Organizer</h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-sm">
            Buat akun gratis dan mulai jelajahi keindahan Jawa Barat bersama kami
          </p>
          <div className="mt-8 mx-auto flex h-32 w-32 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-lg shadow-blue-950/10">
            <img src="/Assets/Logo/nempo-new.webp" alt="Logo Nempo" className="h-20 w-20 object-contain opacity-90" />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto p-8">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Kembali</span>
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Buat Akun</h1>
            <p className="text-gray-500 text-sm">Daftar untuk mendapatkan pengalaman terbaik</p>
          </div>

          {success && (
            <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Akun berhasil dibuat! Mengalihkan...</span>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" value={form.name} onChange={set("name")} required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Masukkan nama lengkap" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="email" value={form.email} onChange={set("email")} required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Masukkan alamat email" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">No. Telepon <span className="text-gray-400">(opsional)</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="tel" value={form.phone} onChange={set("phone")} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Contoh: 08xxxxxxxxxx" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} required minLength={6} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Minimal 6 karakter" />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type={showPass ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")} required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Ulangi password" />
              </div>
            </div>

            <Button type="submit" disabled={loading || success} className="w-full rounded-xl py-6 shadow-lg shadow-primary/20 text-base font-semibold mt-2">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Mendaftar...</> : "Daftar Sekarang"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun? <Link href="/auth/login" className="font-bold text-primary hover:underline">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
