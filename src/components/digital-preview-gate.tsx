import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LayoutDashboard, Lock, MonitorSmartphone, ShieldCheck } from "lucide-react";
import { Link } from "@/lib/wouter";

const PREVIEW_SESSION_URL = "/api/digital-services/preview/session";
const PREVIEW_UNLOCK_URL = "/api/digital-services/preview/unlock";

type DigitalPreviewGateProps = {
  title: string;
  description: string;
  children: ReactNode;
  onUnlock?: () => void;
  accent?: "teal" | "blue";
};

export function DigitalPreviewGate({ title, description, children, onUnlock, accent = "teal" }: DigitalPreviewGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(PREVIEW_SESSION_URL, { credentials: "include" })
      .then((response) => {
        if (mounted) {
          setUnlocked(response.ok);
          if (response.ok && !children) onUnlock?.();
        }
      })
      .catch(() => {
        if (mounted) setUnlocked(false);
      })
      .finally(() => {
        if (mounted) setCheckingAccess(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (checkingAccess) {
    return (
      <main className={`digital-preview-gate ${accent === "blue" ? "digital-preview-gate-blue" : ""} flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#eef7f5] px-5 text-[#183b43]`}>
        <div className="flex items-center gap-3 rounded-2xl border border-[#d5ebe7] bg-white/90 px-5 py-4 text-xs font-bold shadow-[0_14px_45px_rgba(24,59,67,0.10)]">
          <span className="grid h-8 w-8 animate-pulse place-items-center rounded-xl bg-[#e2f5f1] text-[#0f766e]">
            <Lock className="h-4 w-4" />
          </span>
          Memeriksa akses demo...
        </div>
      </main>
    );
  }

  if (!unlocked) {
    return (
      <DigitalPreviewPasswordForm
        title={title}
        description={description}
        accent={accent}
        onUnlock={() => {
          setUnlocked(true);
          onUnlock?.();
        }}
      />
    );
  }

  return <>{children}</>;
}

function DigitalPreviewPasswordForm({
  title,
  description,
  onUnlock,
  accent,
}: {
  title: string;
  description: string;
  onUnlock: () => void;
  accent: "teal" | "blue";
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(PREVIEW_UNLOCK_URL, {
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
    <main className={`digital-preview-gate ${accent === "blue" ? "digital-preview-gate-blue" : ""} relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#eef7f5] px-4 py-8 text-[#183b43] sm:px-6`}>
      <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-[#bfe9df]/60 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-36 -right-16 h-80 w-80 rounded-full bg-[#d5e9f5]/70 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(15,118,110,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,.06)_1px,transparent_1px)] [background-size:32px_32px]" aria-hidden="true" />

       <div className="relative grid max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-y-auto overflow-x-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-[0_28px_90px_rgba(24,59,67,0.16)] backdrop-blur-xl lg:max-h-none lg:overflow-hidden lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-[#0f766e] p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full border-[28px] border-white/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-[#72d7c5]/20 blur-2xl" aria-hidden="true" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#0f766e] shadow-lg shadow-[#064e49]/20">
                <MonitorSmartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b7f1e6]">Nempo Digital</p>
                <p className="mt-0.5 text-sm font-black">Digi Nempo</p>
              </div>
            </div>
            <p className="mt-16 max-w-xs text-3xl font-black leading-tight tracking-tight">Lihat cara bisnis bekerja lebih rapi.</p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#d5f5ef]">Preview eksklusif untuk menjelajahi dashboard dan modul digital yang saling terhubung.</p>
          </div>
          <div className="relative space-y-3 text-xs font-semibold text-[#d5f5ef]">
            {["Satu dashboard operasional", "Data bisnis lebih terhubung", "Demo aman untuk presentasi"].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15 text-[#b7f1e6]">
                  <Check className="h-3 w-3" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-9 lg:p-10">
          <Link href="/digital-services" className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#789496] transition-colors hover:bg-[#f1f8f6] hover:text-[#0f766e]">
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Digi Nempo
          </Link>
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e2f5f1] text-[#0f766e] ring-1 ring-[#c7e9e2]">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f9b8e]">Private preview</p>
                <h1 id="preview-title" className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{title}</h1>
              </div>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full border border-[#d5ebe7] bg-[#f4fbf9] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide text-[#47847d] sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" /> Aman
            </span>
          </div>

          <p id="preview-description" className="max-w-md text-sm leading-6 text-[#648084]">{description}</p>
          <div className="mt-5 rounded-2xl border border-[#dcefea] bg-[#f7fcfb] p-3.5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-[#0f766e] shadow-sm ring-1 ring-[#dcefea]">
                <LayoutDashboard className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-xs font-black text-[#285b5c]">Siap untuk dieksplorasi</p>
                <p className="mt-0.5 text-[11px] leading-5 text-[#789496]">Masukkan kode akses dari tim Nempo untuk membuka demo.</p>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-3" aria-labelledby="preview-title" aria-describedby="preview-description">
            <input type="text" name="username" autoComplete="username" tabIndex={-1} aria-hidden="true" className="hidden" />
            <label className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#648084]" htmlFor="preview-password">Kode akses demo</label>
            <div className={`flex items-center gap-3 rounded-2xl border bg-white px-3.5 py-3.5 shadow-sm transition-all ${error ? "border-[#d28a80] bg-[#fff8f5] ring-4 ring-[#f8dfd9]" : "border-[#dcebea] focus-within:border-[#0f766e] focus-within:ring-4 focus-within:ring-[#d9f1ed]"}`}>
              <Lock className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da5a2]"}`} />
              <input
                id="preview-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Masukkan kode akses"
                autoComplete="current-password"
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#183b43] outline-none placeholder:text-[#a1b8b8]"
              />
              <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Sembunyikan kode akses" : "Tampilkan kode akses"} className="rounded-lg p-1 text-[#7da5a2] transition-colors hover:bg-[#eaf7f4] hover:text-[#0f766e]">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="flex items-center gap-1.5 text-xs font-semibold text-[#b75c54]" role="alert"><span className="h-1.5 w-1.5 rounded-full bg-current" />{error}</p>}
            <button type="submit" disabled={submitting} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f766e] px-4 py-3.5 text-xs font-black text-white shadow-lg shadow-[#0f766e]/20 transition-all hover:bg-[#0b625c] hover:shadow-xl hover:shadow-[#0f766e]/25 disabled:cursor-wait disabled:opacity-60">
              {submitting ? "Memeriksa akses..." : "Buka demo sekarang"}
              {!submitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#edf3f2] pt-4 text-[10px] font-semibold text-[#8aa1a3]">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#0f9b8e]" /> Akses terbatas</span>
            <span>Demo data presentasi</span>
          </div>
        </div>
      </div>
    </main>
  );
}