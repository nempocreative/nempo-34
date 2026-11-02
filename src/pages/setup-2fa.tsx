import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useLocation } from "@/lib/wouter";
import {
  ArrowLeft, Shield, QrCode, KeyRound, CheckCircle,
  Loader2, AlertCircle, Copy, Eye, EyeOff, Smartphone,
} from "lucide-react";

const API = "/api";

type Step = "intro" | "scan" | "verify" | "done";

export default function Setup2FAPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("intro");
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("nempo_user_token");

  const startSetup = async () => {
    setLoading(true); setError("");
    const r = await fetch(`${API}/user/2fa/setup`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const d = await r.json();
    if (!r.ok) { setError(d.error ?? "Gagal memulai setup 2FA"); setLoading(false); return; }
    setQr(d.qr);
    setSecret(d.secret);
    setStep("scan");
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (otp.length < 6) { setError("Masukkan 6 digit kode OTP"); return; }
    setLoading(true); setError("");
    const r = await fetch(`${API}/user/2fa/verify`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ token: otp }),
    });
    const d = await r.json();
    if (!r.ok) { setError(d.error ?? "Kode OTP salah"); setLoading(false); return; }
    setStep("done");
    setLoading(false);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Layout>
      <SEO title="Setup Keamanan 2FA" noIndex />
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div
          className="relative pt-safe"
          style={{ background: "linear-gradient(135deg, #001E6E 0%, #0046B8 60%, #0194f3 100%)" }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 80% 30%, #FFC300 0%, transparent 55%)" }} />
          <div className="relative flex items-center gap-3 px-4 pt-5 pb-5">
            <button
              onClick={() => navigate("/settings")}
              className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-white" strokeWidth={2} />
            </button>
            <div>
              <h1 className="text-white font-black text-lg leading-none">Autentikasi Dua Faktor</h1>
              <p className="text-white/50 text-xs mt-0.5">Lindungi akun dengan OTP</p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-6 max-w-md mx-auto space-y-5">

          {/* Step indicator */}
          {step !== "done" && (
            <div className="flex items-center gap-2">
              {(["intro","scan","verify"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                    s === step ? "bg-[#0194f3] text-white" :
                    (["intro","scan","verify"].indexOf(step) > i) ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"
                  }`}>{i + 1}</div>
                  {i < 2 && <div className={`flex-1 h-0.5 rounded-full transition-all ${
                    (["intro","scan","verify"].indexOf(step) > i) ? "bg-emerald-400" : "bg-gray-200"
                  }`} />}
                </div>
              ))}
            </div>
          )}

          {/* Step: Intro */}
          {step === "intro" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-[#0194f3]" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="font-black text-gray-800 text-base">Tingkatkan Keamanan Akun</h2>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                    Setiap login akan membutuhkan kode 6 digit dari aplikasi authenticator di HP kamu.
                  </p>
                </div>
                <div className="space-y-2.5">
                  {[
                    { icon: Smartphone, text: "Install Google Authenticator atau Authy di HP kamu" },
                    { icon: QrCode, text: "Scan QR code yang akan ditampilkan" },
                    { icon: KeyRound, text: "Masukkan kode 6 digit untuk konfirmasi" },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#0194f3]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-[#0194f3]" strokeWidth={2} />
                      </div>
                      <p className="text-xs text-gray-600">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={startSetup}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#0194f3,#0172B1)", boxShadow: "0 4px 16px rgba(1,148,243,0.35)" }}
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Mempersiapkan...</> : "Mulai Setup 2FA"}
              </button>
            </div>
          )}

          {/* Step: Scan QR */}
          {step === "scan" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <p className="font-black text-gray-800 text-sm text-center">Scan QR Code Ini</p>
                <div className="flex justify-center">
                  {qr && <img src={qr} alt="QR Code 2FA" className="w-48 h-48 rounded-xl border-2 border-gray-100" />}
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Buka <strong>Google Authenticator</strong> atau <strong>Authy</strong>, lalu scan QR code di atas
                </p>
                <div className="border-t border-gray-50 pt-4">
                  <p className="text-[11px] text-gray-400 mb-2 text-center">Atau masukkan kode manual:</p>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                    <code className="text-xs text-gray-700 flex-1 font-mono select-all">
                      {showSecret ? secret : secret.replace(/./g, "•")}
                    </code>
                    <button onClick={() => setShowSecret(!showSecret)} className="shrink-0">
                      {showSecret ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                    <button onClick={copySecret} className="shrink-0 ml-1">
                      {copied
                        ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                        : <Copy className="w-4 h-4 text-gray-400" />
                      }
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep("verify")}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                style={{ background: "linear-gradient(135deg,#0194f3,#0172B1)", boxShadow: "0 4px 16px rgba(1,148,243,0.35)" }}
              >
                Sudah Scan, Lanjut →
              </button>
            </div>
          )}

          {/* Step: Verify OTP */}
          {step === "verify" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <KeyRound className="w-7 h-7 text-[#0194f3]" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="font-black text-gray-800 text-sm">Masukkan Kode OTP</h2>
                  <p className="text-gray-400 text-xs mt-1">Lihat kode 6 digit di aplikasi authenticator kamu</p>
                </div>
                <input
                  type="number"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => { setOtp(e.target.value.slice(0, 6)); setError(""); }}
                  placeholder="000000"
                  className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/20 transition-all bg-gray-50 text-gray-800"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={verifyOtp}
                disabled={loading || otp.length < 6}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#0194f3,#0172B1)", boxShadow: "0 4px 16px rgba(1,148,243,0.35)" }}
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memverifikasi...</> : "Verifikasi & Aktifkan 2FA"}
              </button>
              <button onClick={() => setStep("scan")} className="w-full text-gray-400 text-sm py-2">← Kembali scan QR</button>
            </div>
          )}

          {/* Step: Done */}
          {step === "done" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h2 className="font-black text-gray-800 text-lg">2FA Berhasil Diaktifkan!</h2>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                    Setiap login berikutnya akan meminta kode OTP dari aplikasi authenticator kamu.
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-xs text-amber-700 font-semibold">⚠️ Simpan kode backup</p>
                  <p className="text-xs text-amber-600 mt-0.5">Jangan hapus aplikasi authenticator karena kamu akan membutuhkannya setiap login.</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/settings")}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                style={{ background: "linear-gradient(135deg,#0194f3,#0172B1)", boxShadow: "0 4px 16px rgba(1,148,243,0.35)" }}
              >
                Kembali ke Pengaturan
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
