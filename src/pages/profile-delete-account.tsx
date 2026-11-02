import { useState } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle, Trash2, Eye, EyeOff } from "lucide-react";
import { useLocation } from "@/lib/wouter";
import { useAuth } from "@/contexts/auth-context";

export default function DeleteAccountPage() {
  const { user, deleteAccount } = useAuth();
  const [, setLocation] = useLocation();
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [done, setDone]           = useState(false);

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <p className="text-gray-500">Silakan masuk terlebih dahulu</p>
        </div>
      </Layout>
    );
  }

  const currentUser = user;
  const confirmOk = confirm.toLowerCase() === "hapus akun";
  const pwOk      = currentUser.is_google || password.length > 0;
  const canSubmit = confirmOk && pwOk && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!confirmOk) { setError('Ketikkan "hapus akun" untuk konfirmasi'); return; }
    if (!currentUser.is_google && !password) { setError("Masukkan password kamu"); return; }

    setLoading(true);
    try {
      await deleteAccount(currentUser.is_google ? undefined : password);
      setDone(true);
      // Redirect ke beranda setelah 3 detik
      setTimeout(() => setLocation("/"), 3000);
    } catch (e: any) {
      setError(e?.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-black text-gray-900 text-xl mb-2">Akun Berhasil Dihapus</h2>
          <p className="text-sm text-gray-500 mb-1">Data kamu telah dihapus permanen dari sistem Nempo Organizer.</p>
          <p className="text-xs text-gray-400">Mengalihkan ke beranda…</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Hapus Akun" noIndex />
      <div className="max-w-md mx-auto px-4 py-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Kembali</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Hapus Akun</h1>
            <p className="text-sm text-gray-500">Tindakan ini tidak bisa dibatalkan</p>
          </div>
        </div>

        {/* Warning box */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm text-red-800 space-y-1">
              <p className="font-bold">Perhatian! Tindakan ini tidak bisa dibatalkan.</p>
              <p>Kamu akan kehilangan:</p>
              <ul className="list-disc list-inside space-y-0.5 text-red-700">
                <li>Seluruh riwayat pesanan</li>
                <li>Poin reward yang terkumpul</li>
                <li>Voucher yang dimiliki</li>
                <li>Data profil dan preferensi</li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Password — tidak perlu untuk Google account */}
          {!user.is_google ? (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Konfirmasi dengan password kamu
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-600">
              Akun Google tidak memerlukan konfirmasi password.
            </div>
          )}

          {/* Type confirmation */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Ketikkan <strong className="text-red-600">hapus akun</strong> untuk konfirmasi
            </label>
            <input
              type="text"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="w-full bg-gray-50 border border-red-200 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
              placeholder="hapus akun"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Menghapus Akun…</>
              : <><Trash2 className="h-4 w-4" /> Hapus Akun Sekarang</>
            }
          </button>
        </form>
      </div>
    </Layout>
  );
}
