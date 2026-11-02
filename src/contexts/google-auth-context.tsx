import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  provider: "google";
}

interface GoogleAuthContextValue {
  user: GoogleUser | null;
  signIn: (user: GoogleUser) => void;
  signOut: () => void;
  showSignIn: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
}

const GoogleAuthContext = createContext<GoogleAuthContextValue | null>(null);

const STORAGE_KEY = "nempo_google_user";

export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [showSignIn, setShowSignIn] = useState(false);

  const signIn = useCallback((u: GoogleUser) => {
    setUser(u);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); } catch {}
    setShowSignIn(false);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const openSignIn  = useCallback(() => setShowSignIn(true),  []);
  const closeSignIn = useCallback(() => setShowSignIn(false), []);

  return (
    <GoogleAuthContext.Provider value={{ user, signIn, signOut, showSignIn, openSignIn, closeSignIn }}>
      {children}
      {showSignIn && <GoogleSignInModal />}
    </GoogleAuthContext.Provider>
  );
}

export function useGoogleAuth() {
  const ctx = useContext(GoogleAuthContext);
  if (!ctx) throw new Error("useGoogleAuth must be used inside GoogleAuthProvider");
  return ctx;
}

/* ─── Demo Accounts (shown in the picker) ─────────────────── */
const DEMO_ACCOUNTS: GoogleUser[] = [
  {
    id: "demo-1", provider: "google",
    name: "Andi Saputra",
    email: "andi.saputra@gmail.com",
    picture: "https://i.pravatar.cc/80?img=11",
  },
  {
    id: "demo-2", provider: "google",
    name: "Siti Rahayu",
    email: "siti.rahayu@gmail.com",
    picture: "https://i.pravatar.cc/80?img=5",
  },
  {
    id: "demo-3", provider: "google",
    name: "Budi Hartono",
    email: "budi.hartono@gmail.com",
    picture: "https://i.pravatar.cc/80?img=7",
  },
];

/* ─── Google Sign-In Modal ────────────────────────────────── */
function GoogleSignInModal() {
  const { signIn, closeSignIn } = useGoogleAuth();
  const [mode, setMode]         = useState<"picker" | "custom">("picker");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [err, setErr]           = useState("");

  function handleCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setErr("Masukkan nama Anda"); return; }
    if (!email.trim() || !email.includes("@")) { setErr("Masukkan email yang valid"); return; }
    const initials = name.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    signIn({
      id: `custom-${Date.now()}`,
      provider: "google",
      name: name.trim(),
      email: email.trim(),
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=4285F4&color=fff&size=80&bold=true`,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && closeSignIn()}
    >
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-8 pt-8 pb-5 text-center border-b border-gray-100">
          <GoogleLogo />
          <h2 className="text-xl font-bold text-gray-800 mt-4 mb-1">Masuk dengan Google</h2>
          <p className="text-gray-500 text-sm">Gunakan akun Google untuk memberi ulasan yang terverifikasi</p>
        </div>

        {mode === "picker" ? (
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Pilih akun</p>
            <div className="space-y-1">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => signIn(acc)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left group"
                >
                  <img src={acc.picture} alt={acc.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{acc.name}</p>
                    <p className="text-gray-400 text-xs truncate">{acc.email}</p>
                  </div>
                  <svg className="h-4 w-4 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
              <button
                onClick={() => setMode("custom")}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-700 text-sm">Gunakan akun lain</p>
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-4 leading-relaxed px-4">
              Dengan masuk, Anda menyetujui{" "}
              <span className="text-[#1A73E8]">Persyaratan Layanan</span> dan{" "}
              <span className="text-[#1A73E8]">Kebijakan Privasi</span> Nempo Organizer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCustom} className="p-6 space-y-4">
            <button type="button" onClick={() => setMode("picker")}
              className="flex items-center gap-1.5 text-[#1A73E8] text-sm font-medium hover:underline">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Nama Lengkap</label>
              <input type="text" value={name} onChange={e => { setName(e.target.value); setErr(""); }}
                placeholder="Nama Google Anda"
                className="w-full border-2 border-gray-200 focus:border-[#4285F4] rounded-xl px-3 py-2.5 text-sm outline-none transition-colors" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Alamat Email Google</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }}
                placeholder="nama@gmail.com"
                className="w-full border-2 border-gray-200 focus:border-[#4285F4] rounded-xl px-3 py-2.5 text-sm outline-none transition-colors" />
            </div>
            {err && <p className="text-red-500 text-xs font-medium">{err}</p>}
            <button type="submit"
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5"
              style={{ background: "#4285F4" }}>
              Masuk
            </button>
          </form>
        )}

        <button onClick={closeSignIn}
          className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="mx-auto">
      <path d="M39.2 20.45c0-1.43-.13-2.8-.36-4.12H20v7.8h10.77a9.2 9.2 0 01-3.99 6.03v5.02h6.46c3.78-3.48 5.96-8.6 5.96-14.73z" fill="#4285F4"/>
      <path d="M20 40c5.4 0 9.93-1.79 13.24-4.82l-6.46-5.02c-1.79 1.2-4.08 1.91-6.78 1.91-5.21 0-9.62-3.52-11.2-8.25H2.1v5.19A20 20 0 0020 40z" fill="#34A853"/>
      <path d="M8.8 23.82A12.02 12.02 0 018.17 20c0-1.33.23-2.62.63-3.82v-5.19H2.1A20.02 20.02 0 000 20c0 3.22.77 6.27 2.1 8.99l6.7-5.17z" fill="#FBBC05"/>
      <path d="M20 7.93c2.94 0 5.57 1.01 7.65 2.99l5.74-5.74C29.93 1.99 25.4 0 20 0A20 20 0 002.1 11.01l6.7 5.17C10.38 11.45 14.79 7.93 20 7.93z" fill="#EA4335"/>
    </svg>
  );
}
