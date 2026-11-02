import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useLocation } from "@/lib/wouter";
import { useAuth } from "@/contexts/auth-context";
import {
  ArrowLeft, LogIn, LogOut, User, Key, Shield, Star,
  Gift, Trash2, AlertCircle, RefreshCw, Smartphone,
  Clock, CheckCircle, Chrome,
} from "lucide-react";

const API = "/api";

interface Activity {
  id: number;
  action: string;
  details: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

const ACTION_MAP: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  login:                  { icon: LogIn,      color: "text-emerald-600", bg: "bg-emerald-50",  label: "Login" },
  login_google:           { icon: Chrome,     color: "text-blue-600",   bg: "bg-blue-50",     label: "Login via Google" },
  register:               { icon: User,       color: "text-violet-600", bg: "bg-violet-50",   label: "Daftar Akun" },
  register_google:        { icon: User,       color: "text-violet-600", bg: "bg-violet-50",   label: "Daftar via Google" },
  logout:                 { icon: LogOut,     color: "text-gray-500",   bg: "bg-gray-100",    label: "Keluar" },
  update_profile:         { icon: User,       color: "text-sky-600",    bg: "bg-sky-50",      label: "Ubah Profil" },
  request_password_reset: { icon: Key,        color: "text-amber-600",  bg: "bg-amber-50",    label: "Ganti Password" },
  request_delete_account: { icon: Trash2,     color: "text-red-500",    bg: "bg-red-50",      label: "Hapus Akun" },
  "2fa_enabled":          { icon: Shield,     color: "text-emerald-600",bg: "bg-emerald-50",  label: "2FA Diaktifkan" },
  "2fa_disabled":         { icon: Shield,     color: "text-gray-500",   bg: "bg-gray-100",    label: "2FA Dinonaktifkan" },
  daily_checkin:          { icon: CheckCircle,color: "text-blue-600",   bg: "bg-blue-50",     label: "Check In Harian" },
  earn_points:            { icon: Star,       color: "text-yellow-500", bg: "bg-yellow-50",   label: "Poin Diperoleh" },
  redeem_voucher:         { icon: Gift,       color: "text-pink-600",   bg: "bg-pink-50",     label: "Tukar Voucher" },
};

function getActionMeta(action: string) {
  return ACTION_MAP[action] ?? { icon: AlertCircle, color: "text-gray-400", bg: "bg-gray-50", label: action };
}

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function groupByDate(activities: Activity[]) {
  const groups: Record<string, Activity[]> = {};
  for (const a of activities) {
    const d = new Date(a.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    let label: string;
    if (d.toDateString() === today.toDateString()) label = "Hari Ini";
    else if (d.toDateString() === yesterday.toDateString()) label = "Kemarin";
    else label = d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (!groups[label]) groups[label] = [];
    groups[label].push(a);
  }
  return groups;
}

export default function RiwayatAktivitasPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("nempo_user_token");

  useEffect(() => {
    if (!token) { navigate("/auth/login"); return; }
    fetch(`${API}/user/activities?limit=50`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setActivities(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const groups = groupByDate(activities);

  return (
    <Layout>
      <SEO title="Riwayat Aktivitas" noIndex />
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
              <h1 className="text-white font-black text-lg leading-none">Riwayat Aktivitas</h1>
              <p className="text-white/50 text-xs mt-0.5">Login, perubahan akun & transaksi</p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="w-7 h-7 text-[#0194f3] animate-spin" />
              <p className="text-gray-400 text-sm">Memuat riwayat...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Clock className="w-12 h-12 text-gray-200" />
              <p className="text-gray-400 text-sm font-semibold">Belum ada aktivitas</p>
            </div>
          ) : (
            Object.entries(groups).map(([date, items]) => (
              <div key={date} className="mb-5">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">{date}</p>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                  {items.map((a) => {
                    const meta = getActionMeta(a.action);
                    const Icon = meta.icon;
                    return (
                      <div key={a.id} className="flex items-center gap-3.5 px-4 py-3.5">
                        <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${meta.color}`} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 leading-none">{meta.label}</p>
                          {a.details && <p className="text-xs text-gray-400 mt-0.5 truncate">{a.details}</p>}
                          {a.ip_address && (
                            <p className="text-[10px] text-gray-300 mt-0.5">IP: {a.ip_address}</p>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-300 shrink-0 ml-1 text-right leading-tight">
                          {timeAgo(a.created_at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
