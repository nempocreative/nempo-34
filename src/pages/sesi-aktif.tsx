import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useLocation } from "@/lib/wouter";
import {
  ArrowLeft, Smartphone, Monitor, Tablet, Globe,
  CheckCircle, Trash2, RefreshCw, AlertCircle, LogOut,
} from "lucide-react";

const API = "/api";

interface Session {
  id: number;
  device_name: string;
  browser: string;
  ip_address: string | null;
  last_active_at: string;
  created_at: string;
  is_current: boolean;
}

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Aktif baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function DeviceIcon({ name }: { name: string }) {
  if (/Android|iPhone|iPad/.test(name)) return <Smartphone className="w-5 h-5" />;
  if (/Tablet/.test(name)) return <Tablet className="w-5 h-5" />;
  return <Monitor className="w-5 h-5" />;
}

export default function SesiAktifPage() {
  const [, navigate] = useLocation();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<number | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);
  const [done, setDone] = useState<number | null>(null);

  const token = localStorage.getItem("nempo_user_token");

  const fetchSessions = () => {
    if (!token) { navigate("/auth/login"); return; }
    fetch(`${API}/user/sessions`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setSessions(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchSessions(); }, []);

  const revokeOne = async (id: number) => {
    setRevoking(id);
    await fetch(`${API}/user/sessions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setDone(id);
    setTimeout(() => {
      setSessions(s => s.filter(x => x.id !== id));
      setRevoking(null);
      setDone(null);
    }, 700);
  };

  const revokeAll = async () => {
    if (!confirm("Keluarkan semua sesi lain? Kamu akan tetap login di perangkat ini.")) return;
    setRevokingAll(true);
    await fetch(`${API}/user/sessions`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTimeout(() => {
      setSessions(s => s.filter(x => x.is_current));
      setRevokingAll(false);
    }, 700);
  };

  const others = sessions.filter(s => !s.is_current);

  return (
    <Layout>
      <SEO title="Sesi Aktif" noIndex />
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
              <h1 className="text-white font-black text-lg leading-none">Sesi Aktif</h1>
              <p className="text-white/50 text-xs mt-0.5">Perangkat yang sedang login</p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="w-7 h-7 text-[#0194f3] animate-spin" />
              <p className="text-gray-400 text-sm">Memuat sesi...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Globe className="w-12 h-12 text-gray-200" />
              <p className="text-gray-400 text-sm font-semibold">Tidak ada sesi aktif tercatat</p>
              <p className="text-gray-300 text-xs text-center">Sesi akan tercatat saat login berikutnya</p>
            </div>
          ) : (
            <>
              {/* Current session */}
              {sessions.filter(s => s.is_current).map(s => (
                <div key={s.id}>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Sesi Ini</p>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                      <DeviceIcon name={s.device_name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-gray-800 leading-none">{s.device_name}</p>
                        <span className="text-[9px] font-black bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full">AKTIF</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{s.browser}</p>
                      {s.ip_address && <p className="text-[10px] text-gray-300 mt-0.5">IP: {s.ip_address}</p>}
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" strokeWidth={2} />
                  </div>
                </div>
              ))}

              {/* Other sessions */}
              {others.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Sesi Lainnya</p>
                    {others.length > 1 && (
                      <button
                        onClick={revokeAll}
                        disabled={revokingAll}
                        className="flex items-center gap-1 text-[11px] font-bold text-red-500 active:opacity-70"
                      >
                        {revokingAll ? <RefreshCw className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />}
                        Keluarkan Semua
                      </button>
                    )}
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {others.map(s => (
                      <div key={s.id} className={`flex items-center gap-3.5 px-4 py-3.5 transition-all ${done === s.id ? "opacity-30" : ""}`}>
                        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                          <DeviceIcon name={s.device_name} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 leading-none">{s.device_name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{s.browser}</p>
                          <p className="text-[10px] text-gray-300 mt-0.5">{timeAgo(s.last_active_at)}</p>
                        </div>
                        <button
                          onClick={() => revokeOne(s.id)}
                          disabled={revoking === s.id}
                          className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-400 active:bg-red-100 transition-colors shrink-0"
                        >
                          {revoking === s.id
                            ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-xs text-blue-600 leading-relaxed">
                  Jika kamu melihat sesi yang tidak dikenal, segera keluarkan dan ganti password akunmu.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
