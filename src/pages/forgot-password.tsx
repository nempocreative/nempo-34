import { useState } from "react";
import { Link } from "@/lib/wouter";
import { SEO } from "@/components/seo";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) { setError("Password baru minimal 6 karakter"); return; }
    if (newPassword !== confirmPassword) { setError("Konfirmasi password tidak cocok"); return; }
    setLoading(true);
    try {
      const res = await forgotPassword(identifier.trim(), newPassword);
      setMessage(res.message);
    } catch (e: any) {
      setError(e?.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center px-4 py-10"
      style={{ background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)" }}>
      <SEO title="Lupa Password" noIndex />
      <div className="w-full max-w-md">
        <Link href="/auth/login" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors text-sm">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Login
        </Link>

        <div
          className="bg-white rounded-3xl p-6 sm:p-8"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8)" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 text-[#0172B1]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Lupa Password</h1>
              <p className="text-xs text-gray-500">Permintaan akan diverifikasi oleh admin</p>
            </div>
          </div>

          {message ? (
            <div className="mt-5 bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h2 className="font-bold text-green-800 mb-1">Permintaan Terkirim!</h2>
              <p className="text-sm text-green-700">{message}</p>
              <Link
                href="/auth/login"
                className="inline-block mt-4 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl text-sm hover:bg-green-700 transition-colors"
              >
                Kembali ke Login
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 my-5">
                <p className="text-sm text-blue-800">
                  <strong>Catatan:</strong> Admin akan menghubungi kamu (lewat No. HP yang terdaftar) untuk verifikasi identitas sebelum password baru diaktifkan, dalam 1×24 jam.
                </p>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Email atau No. HP</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      required
                      autoComplete="username"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Email atau No. HP akun kamu"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Password Baru</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Minimal 6 karakter"
                    />
                    <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPass ? "text" : "password"}
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
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Mengirim...</> : "Kirim Permintaan"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
