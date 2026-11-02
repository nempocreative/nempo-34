import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const API = "/api";

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  last_login_at: string | null;
  is_google: boolean;
};

export type MitraProfile = {
  id: number;
  username: string;
  business_name: string;
  contact_name: string | null;
  phone: string | null;
  category: string | null;
  listing_type: string | null;
  listing_id: number | null;
  mou_status?: "dalam_proses" | "aktif" | "berakhir" | null;
};

type AuthState = {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  mitra: MitraProfile | null;
  mitraToken: string | null;
};

type AuthCtx = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  loginGoogle: (credential: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  loginMitra: (username: string, password: string) => Promise<void>;
  logoutMitra: () => void;
  updateMitraProfile: (data: { business_name: string; contact_name?: string; phone?: string }) => Promise<void>;
  changeMitraPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<{ name: string; phone: string; avatar_url: string }>) => Promise<void>;
  requestPasswordReset: (newPassword: string, currentPassword: string) => Promise<void>;
  forgotPassword: (identifier: string, newPassword: string) => Promise<{ ok: boolean; message: string }>;
  requestDeleteAccount: (reason?: string) => Promise<void>;
  deleteAccount: (password?: string) => Promise<void>;
  track: (action: string, details?: string) => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("nempo_user_token"));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mitraToken, setMitraToken] = useState<string | null>(() => localStorage.getItem("nempo_mitra_token"));
  const [mitra, setMitra] = useState<MitraProfile | null>(null);

  async function authReq(method: string, path: string, body?: unknown, authToken?: string) {
    const t = authToken ?? token;
    const res = await fetch(`${API}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal");
    return data;
  }

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    authReq("GET", "/auth/me")
      .then(setUser)
      .catch(() => { localStorage.removeItem("nempo_user_token"); setToken(null); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!mitraToken) return;
    authReq("GET", "/auth/mitra-me", undefined, mitraToken)
      .then(setMitra)
      .catch(() => { localStorage.removeItem("nempo_mitra_token"); setMitraToken(null); });
  }, []);

  function persist(t: string, u: UserProfile) {
    localStorage.setItem("nempo_user_token", t);
    setToken(t);
    setUser(u);
  }

  async function login(email: string, password: string) {
    const d = await authReq("POST", "/auth/login", { email, password });
    persist(d.token, d.user);
  }

  async function loginGoogle(credential: string) {
    const d = await authReq("POST", "/auth/google", { credential });
    persist(d.token, d.user);
  }

  async function register(name: string, email: string, password: string, phone?: string) {
    const d = await authReq("POST", "/auth/register", { name, email, password, phone });
    persist(d.token, d.user);
  }

  function logout() {
    localStorage.removeItem("nempo_user_token");
    setToken(null);
    setUser(null);
  }

  async function loginMitra(username: string, password: string) {
    const d = await authReq("POST", "/auth/mitra-login", { username, password });
    localStorage.setItem("nempo_mitra_token", d.token);
    setMitraToken(d.token);
    setMitra(d.mitra);
  }

  function logoutMitra() {
    localStorage.removeItem("nempo_mitra_token");
    setMitraToken(null);
    setMitra(null);
  }

  async function updateMitraProfile(data: { business_name: string; contact_name?: string; phone?: string }) {
    const updated = await authReq("PUT", "/auth/mitra-me", data, mitraToken ?? undefined);
    setMitra(updated);
  }

  async function changeMitraPassword(currentPassword: string, newPassword: string) {
    await authReq("PUT", "/auth/mitra-me/password", { current_password: currentPassword, new_password: newPassword }, mitraToken ?? undefined);
  }

  async function updateProfile(data: Partial<{ name: string; phone: string; avatar_url: string }>) {
    const updated = await authReq("PUT", "/auth/profile", data);
    setUser(prev => prev ? { ...prev, ...updated } : prev);
  }

  async function requestPasswordReset(newPassword: string, currentPassword: string) {
    await authReq("POST", "/auth/request-password-reset", { current_password: currentPassword, new_password: newPassword });
  }

  async function requestDeleteAccount(reason?: string) {
    await authReq("POST", "/auth/request-delete-account", { reason });
  }

  async function deleteAccount(password?: string) {
    await authReq("DELETE", "/auth/account", { password });
    // Logout local state setelah akun dihapus
    localStorage.removeItem("nempo_user_token");
    setToken(null);
    setUser(null);
  }

  async function forgotPassword(identifier: string, newPassword: string) {
    return authReq("POST", "/auth/forgot-password", { identifier, new_password: newPassword });
  }

  const track = useCallback((action: string, details?: string) => {
    if (!token) return;
    fetch(`${API}/auth/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, details }),
    }).catch(() => {});
  }, [token]);

  return (
    <Ctx.Provider value={{ user, token, loading, mitra, mitraToken, login, loginGoogle, register, loginMitra, logoutMitra, updateMitraProfile, changeMitraPassword, logout, updateProfile, requestPasswordReset, requestDeleteAccount, deleteAccount, forgotPassword, track }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
