import { useState } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { ArrowLeft, Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, KeyRound } from "lucide-react";
import { useLocation } from "@/lib/wouter";
import { useAuth } from "@/contexts/auth-context";

export default function ChangePasswordPage() {
  const { user, requestPasswordReset } = useAuth();
  const [, setLocation] = useLocation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <p className="text-gray-500">Silakan masuk terlebih dahulu</p>
        </div>
      </Layout>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!currentPassword) { setError("Password saat ini wajib diisi"); return; }
    if (newPassword.length < 6) { setError("Password baru minimal 6 karakter"); return; }
    if (newPassword !== confirmPassword) { setError("Konfirmasi password tidak cocok"); return; }
    if (currentPassword === newPassword) { setError("Password baru harus berbeda dari password saat ini"); return; }
    setLoading(true);
    try {
      await requestPasswordReset(newPassword, currentPassword);
      setSuccess(true);
    } catch (e: any) {
      setError(e?.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <SEO title="Ganti Password" noIndex />
      <div className="max-w-md mx-auto px-4 py-6">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Kembali</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-[#0172B1]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Ganti Password</h1>
            <p className="text-sm text-gray-500">Perubahan langsung aktif setelah disimpan</p>
          </div>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="font-bold text-green-800 mb-1">Password Berhasil Diubah!</h2>
            <p className="text-sm text-green-700 mb-4">
              Password kamu sudah diperbarui. Gunakan password baru saat login berikutnya.
            </p>
            <button
              onClick={() => setLocation("/profil")}
              className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl text-sm hover:bg-green-700 transition-colors"
            >
              Kembali ke Profil
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Password saat ini */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Password Saat Ini</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Masukkan password saat ini"
                  />
                  <button type="button" onClick={() => setShowCurrent(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password baru */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Password Baru</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Minimal 6 karakter"
                  />
                  <button type="button" onClick={() => setShowNew(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi password baru */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Ulangi password baru"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Menyimpan...</> : "Simpan Password Baru"}
              </button>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
}
