import { useEffect, useState } from "react";
import { api } from "@/apps/admin/lib/api";
import { Activity, RefreshCw, Filter } from "lucide-react";

type ActivityRow = {
  id: number;
  action: string;
  details: string;
  ip_address: string;
  created_at: string;
  user_id: number;
  user_name: string;
  user_email: string;
};

const ACTION_MAP: Record<string, { label: string; cls: string }> = {
  login:                    { label: "Login",              cls: "bg-green-100 text-green-700" },
  login_google:             { label: "Login Google",       cls: "bg-blue-100 text-blue-700" },
  register:                 { label: "Daftar",             cls: "bg-purple-100 text-purple-700" },
  register_google:          { label: "Daftar Google",      cls: "bg-violet-100 text-violet-700" },
  update_profile:           { label: "Edit Profil",        cls: "bg-yellow-100 text-yellow-700" },
  request_password_reset:   { label: "Minta Reset PW",     cls: "bg-orange-100 text-orange-700" },
  password_reset_approved:  { label: "PW Direset",         cls: "bg-emerald-100 text-emerald-700" },
  password_reset_rejected:  { label: "Reset Ditolak",      cls: "bg-red-100 text-red-700" },
  request_delete_account:   { label: "Minta Hapus Akun",   cls: "bg-rose-100 text-rose-700" },
};

function fmt(d: string) {
  return new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

export default function UserActivitiesPage() {
  const [data, setData] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(100);
  const [filter, setFilter] = useState("");

  const load = (l = limit) => {
    setLoading(true);
    api.userActivities.list(l).then(setData).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = filter
    ? data.filter(a => a.action.includes(filter) || (a.user_name ?? "").toLowerCase().includes(filter.toLowerCase()) || (a.user_email ?? "").toLowerCase().includes(filter.toLowerCase()))
    : data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Aktivitas User</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} dari {data.length} aktivitas</p>
        </div>
        <div className="flex gap-2">
          <select
            value={limit}
            onChange={e => { const v = Number(e.target.value); setLimit(v); load(v); }}
            className="px-3 py-2 text-sm bg-gray-100 rounded-xl border-none outline-none text-gray-700"
          >
            <option value={50}>50 terakhir</option>
            <option value={100}>100 terakhir</option>
            <option value={200}>200 terakhir</option>
            <option value={500}>500 terakhir</option>
          </select>
          <button onClick={() => load()} className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter berdasarkan nama, email, atau jenis aktivitas..."
          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Memuat data...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{data.length === 0 ? "Belum ada aktivitas" : "Tidak ada aktivitas yang cocok"}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Aktivitas</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Detail</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">IP</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(a => {
                  const cfg = ACTION_MAP[a.action] ?? { label: a.action, cls: "bg-gray-100 text-gray-600" };
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        {a.user_name ? (
                          <div>
                            <p className="font-medium text-gray-800">{a.user_name}</p>
                            <p className="text-xs text-gray-400">{a.user_email}</p>
                          </div>
                        ) : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{a.details || "—"}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{a.ip_address || "—"}</td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmt(a.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
