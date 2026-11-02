import { useEffect, useState } from "react";
import { api } from "@/apps/admin/lib/api";
import { Users, ToggleLeft, ToggleRight, Activity, Mail, Phone, Calendar, Globe, RefreshCw, UserCheck, UserX } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  active: boolean;
  created_at: string;
  last_login_at: string | null;
  has_google: boolean;
  activity_count: number;
};

type UserDetail = { user: User; activities: { id: number; action: string; details: string; ip_address: string; created_at: string }[] };

function fmt(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function ActionBadge({ action }: { action: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    login: { label: "Login", cls: "bg-green-100 text-green-700" },
    login_google: { label: "Login Google", cls: "bg-blue-100 text-blue-700" },
    register: { label: "Daftar", cls: "bg-purple-100 text-purple-700" },
    register_google: { label: "Daftar Google", cls: "bg-violet-100 text-violet-700" },
    update_profile: { label: "Edit Profil", cls: "bg-yellow-100 text-yellow-700" },
    request_password_reset: { label: "Minta Reset Password", cls: "bg-orange-100 text-orange-700" },
    password_reset_approved: { label: "Password Direset", cls: "bg-emerald-100 text-emerald-700" },
    password_reset_rejected: { label: "Reset Ditolak", cls: "bg-red-100 text-red-700" },
    request_delete_account: { label: "Minta Hapus Akun", cls: "bg-rose-100 text-rose-700" },
  };
  const cfg = map[action] ?? { label: action, cls: "bg-gray-100 text-gray-600" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = () => { setLoading(true); api.users.list().then(setUsers).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  async function toggleActive(id: number) {
    await api.users.toggleActive(id);
    load();
  }

  async function viewDetail(id: number) {
    setDetailLoading(true);
    setDetail(null);
    const d = await api.users.get(id);
    setDetail(d);
    setDetailLoading(false);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Daftar User</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} user terdaftar</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Memuat data...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada user yang mendaftar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {users.map(u => (
            <div key={u.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden">
                  {u.avatar_url
                    ? <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" />
                    : u.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    {u.has_google && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">Google</span>}
                    {u.active
                      ? <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full font-medium flex items-center gap-1"><UserCheck className="w-3 h-3"/>Aktif</span>
                      : <span className="px-2 py-0.5 bg-red-50 text-red-500 text-xs rounded-full font-medium flex items-center gap-1"><UserX className="w-3 h-3"/>Dinonaktifkan</span>}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Mail className="w-3 h-3"/>{u.email}</span>
                    {u.phone && <span className="flex items-center gap-1 text-xs text-gray-500"><Phone className="w-3 h-3"/>{u.phone}</span>}
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Calendar className="w-3 h-3"/>Daftar: {fmt(u.created_at)}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Globe className="w-3 h-3"/>Login terakhir: {fmt(u.last_login_at)}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Activity className="w-3 h-3"/>{u.activity_count} aktivitas</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => viewDetail(u.id)}
                    className="px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => toggleActive(u.id)}
                    title={u.active ? "Nonaktifkan user" : "Aktifkan user"}
                    className={`p-1.5 rounded-lg transition-colors ${u.active ? "text-green-500 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                  >
                    {u.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {(detail || detailLoading) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="font-bold text-gray-900">Detail User</h2>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {detailLoading && <p className="text-center text-gray-400">Memuat...</p>}
              {detail && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                      {detail.user.avatar_url ? <img src={detail.user.avatar_url} alt={detail.user.name} className="w-full h-full object-cover" /> : detail.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{detail.user.name}</p>
                      <p className="text-sm text-gray-500">{detail.user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Status</p>
                      <p className="font-medium text-gray-800">{detail.user.active ? "Aktif" : "Nonaktif"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Login Google</p>
                      <p className="font-medium text-gray-800">{detail.user.has_google ? "Ya" : "Tidak"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Terdaftar</p>
                      <p className="font-medium text-gray-800">{fmt(detail.user.created_at)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Login Terakhir</p>
                      <p className="font-medium text-gray-800">{fmt(detail.user.last_login_at)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Riwayat Aktivitas ({detail.activities.length})</p>
                    {detail.activities.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">Belum ada aktivitas</p>
                    ) : (
                      <div className="space-y-2">
                        {detail.activities.map(a => (
                          <div key={a.id} className="flex items-start gap-3 text-sm border-b border-gray-50 pb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <ActionBadge action={a.action} />
                                {a.details && <span className="text-gray-500 text-xs">{a.details}</span>}
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5">{fmt(a.created_at)}{a.ip_address ? ` · ${a.ip_address}` : ""}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
