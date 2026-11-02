import { useEffect, useState } from "react";
import { Coins, Ticket, TrendingUp, TrendingDown, ChevronDown, ChevronUp, RefreshCw, Search, Filter, User, Calendar } from "lucide-react";

const API_BASE = "/api";
function getToken() { return localStorage.getItem("nempo_admin_token") || ""; }
async function apiFetch(path: string) {
  const r = await fetch(`${API_BASE}${path}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  return r.json();
}

type UserPointRow = {
  id: number; name: string; email: string; registered_at: string;
  total_points: number; login_streak: number; last_login_date: string | null;
  txn_count: number; total_earned: number; total_spent: number; voucher_count: number;
};

type Txn = {
  id: number; type: string; points: number; description: string; created_at: string;
};

type UserVoucher = {
  id: number; user_id: number; user_name: string; user_email: string;
  code: string; title: string; discount_value: number; discount_type: string;
  applicable_type: string; source: string; status: string;
  claimed_at: string; used_at: string | null; expires_at: string | null;
};

function getTier(pts: number) {
  if (pts >= 3000) return { label: "Platinum", cls: "bg-cyan-100 text-cyan-700" };
  if (pts >= 1500) return { label: "Gold", cls: "bg-yellow-100 text-yellow-700" };
  if (pts >= 500) return { label: "Silver", cls: "bg-gray-200 text-gray-700" };
  return { label: "Bronze", cls: "bg-orange-100 text-orange-700" };
}

function fmt(d: string | null) {
  if (!d) return "–";
  return new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}
function fmtDate(d: string | null) {
  if (!d) return "–";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    used: "bg-blue-100 text-blue-700",
    expired: "bg-gray-100 text-gray-500",
  };
  const labels: Record<string, string> = { active: "Aktif", used: "Digunakan", expired: "Expired" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-500"}`}>{labels[status] ?? status}</span>;
}

function TxnBadge({ points }: { points: number }) {
  if (points > 0) return <span className="flex items-center gap-0.5 text-emerald-600 font-bold text-sm"><TrendingUp className="h-3.5 w-3.5" />+{points}</span>;
  return <span className="flex items-center gap-0.5 text-red-500 font-bold text-sm"><TrendingDown className="h-3.5 w-3.5" />{points}</span>;
}

/* ── Tab 1: Poin User ── */
function PointsTab() {
  const [rows, setRows] = useState<UserPointRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [txns, setTxns] = useState<Record<number, Txn[]>>({});
  const [txnLoading, setTxnLoading] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    apiFetch("/admin/user-points").then(setRows).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const toggle = async (userId: number) => {
    if (expanded === userId) { setExpanded(null); return; }
    setExpanded(userId);
    if (!txns[userId]) {
      setTxnLoading(true);
      const data = await apiFetch(`/admin/user-points/${userId}/transactions`);
      setTxns(prev => ({ ...prev, [userId]: data }));
      setTxnLoading(false);
    }
  };

  const filtered = rows.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPts = rows.reduce((a, r) => a + Number(r.total_points), 0);
  const totalEarned = rows.reduce((a, r) => a + Number(r.total_earned), 0);
  const totalSpent = rows.reduce((a, r) => a + Number(r.total_spent), 0);

  return (
    <div>
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total Poin Aktif", val: totalPts.toLocaleString("id"), cls: "text-[#0194f3]", icon: Coins },
          { label: "Total Diperoleh", val: totalEarned.toLocaleString("id"), cls: "text-emerald-600", icon: TrendingUp },
          { label: "Total Digunakan", val: totalSpent.toLocaleString("id"), cls: "text-red-500", icon: TrendingDown },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center bg-gray-50 ${s.cls}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div>
              <p className={`text-lg font-black ${s.cls}`}>{s.val}</p>
              <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + refresh */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-300 bg-white" />
        </div>
        <button onClick={load} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
          <RefreshCw className={`h-4 w-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">Memuat data...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Tier</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total Poin</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Diperoleh</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Digunakan</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Streak</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Voucher</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Transaksi</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(row => {
                  const tier = getTier(Number(row.total_points));
                  const open = expanded === row.id;
                  return (
                    <>
                      <tr key={row.id} className={`hover:bg-gray-50 transition-colors ${open ? "bg-blue-50/40" : ""}`}>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900 text-sm">{row.name}</p>
                          <p className="text-xs text-gray-400">{row.email}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tier.cls}`}>{tier.label}</span>
                        </td>
                        <td className="px-4 py-3 text-center font-black text-[#0194f3] text-base">{Number(row.total_points).toLocaleString("id")}</td>
                        <td className="px-4 py-3 text-center text-emerald-600 font-semibold">+{Number(row.total_earned).toLocaleString("id")}</td>
                        <td className="px-4 py-3 text-center text-red-500 font-semibold">{Number(row.total_spent).toLocaleString("id")}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-semibold text-gray-700">{row.login_streak}</span>
                          <span className="text-gray-400 text-xs"> hari</span>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700">{row.voucher_count}</td>
                        <td className="px-4 py-3 text-center text-gray-500">{row.txn_count}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggle(row.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>

                      {open && (
                        <tr key={`txn-${row.id}`}>
                          <td colSpan={9} className="px-4 pb-4 pt-0 bg-blue-50/40">
                            <div className="rounded-xl border border-blue-100 bg-white overflow-hidden">
                              <div className="px-4 py-2.5 bg-blue-50 border-b border-blue-100">
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                                  Riwayat Transaksi Poin — {row.name}
                                </p>
                              </div>
                              {txnLoading ? (
                                <p className="px-4 py-4 text-xs text-gray-400">Memuat...</p>
                              ) : (txns[row.id] ?? []).length === 0 ? (
                                <p className="px-4 py-4 text-xs text-gray-400">Belum ada transaksi poin.</p>
                              ) : (
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b border-gray-100">
                                      <th className="px-4 py-2 text-left text-gray-500 font-semibold">Tipe</th>
                                      <th className="px-4 py-2 text-left text-gray-500 font-semibold">Deskripsi</th>
                                      <th className="px-4 py-2 text-center text-gray-500 font-semibold">Poin</th>
                                      <th className="px-4 py-2 text-right text-gray-500 font-semibold">Waktu</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-50">
                                    {(txns[row.id] ?? []).map(t => (
                                      <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2">
                                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">{t.type}</span>
                                        </td>
                                        <td className="px-4 py-2 text-gray-600">{t.description}</td>
                                        <td className="px-4 py-2 text-center"><TxnBadge points={t.points} /></td>
                                        <td className="px-4 py-2 text-right text-gray-400">{fmt(t.created_at)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="text-center py-8 text-gray-400 text-sm">Tidak ada data ditemukan.</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Tab 2: Voucher User ── */
function VouchersTab() {
  const [rows, setRows] = useState<UserVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = (s = statusFilter) => {
    setLoading(true);
    const qs = s !== "all" ? `?status=${s}` : "";
    apiFetch(`/admin/user-vouchers${qs}`).then(setRows).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const changeFilter = (s: string) => { setStatusFilter(s); load(s); };

  const filtered = rows.filter(r =>
    r.user_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.user_email?.toLowerCase().includes(search.toLowerCase()) ||
    r.code?.toLowerCase().includes(search.toLowerCase()) ||
    r.title?.toLowerCase().includes(search.toLowerCase())
  );

  const counts = { all: rows.length, active: 0, used: 0, expired: 0 };
  rows.forEach(r => { counts[r.status as keyof typeof counts]++; });

  return (
    <div>
      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {(["all", "active", "used", "expired"] as const).map(s => (
          <button key={s} onClick={() => changeFilter(s)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === s ? "bg-[#0194f3] text-white shadow-md shadow-blue-200" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
            {s === "all" ? "Semua" : s === "active" ? "Aktif" : s === "used" ? "Digunakan" : "Expired"}
            <span className="ml-1.5 text-[10px] opacity-70">({counts[s]})</span>
          </button>
        ))}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama / kode..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-blue-300 bg-white" />
        </div>
        <button onClick={() => load()} className="p-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
          <RefreshCw className={`h-4 w-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">Memuat data...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Voucher</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kode</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Diskon</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Sumber</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Diklaim</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Dipakai</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Kedaluwarsa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(uv => (
                  <tr key={uv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <User className="h-3.5 w-3.5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{uv.user_name}</p>
                          <p className="text-xs text-gray-400">{uv.user_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 text-sm max-w-[200px]">{uv.title}</p>
                      <p className="text-xs text-gray-400">{uv.applicable_type}</p>
                    </td>
                    <td className="px-4 py-3">
                      <code className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-700 font-mono">{uv.code}</code>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-emerald-600">
                        {uv.discount_type === "percentage" ? `${uv.discount_value}%` : `Rp${Number(uv.discount_value).toLocaleString("id")}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700">{uv.source}</span>
                    </td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={uv.status} /></td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500">{fmtDate(uv.claimed_at)}</td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500">{uv.used_at ? fmtDate(uv.used_at) : <span className="text-gray-300">–</span>}</td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500">{fmtDate(uv.expires_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="text-center py-8 text-gray-400 text-sm">Tidak ada data ditemukan.</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function UserRewardsPage() {
  const [tab, setTab] = useState<"points" | "vouchers">("points");

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Poin & Reward User</h1>
          <p className="text-sm text-gray-500 mt-0.5">Pantau poin, riwayat transaksi, dan voucher yang dimiliki setiap user</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: "points", label: "Poin Pengguna", icon: Coins },
          { key: "vouchers", label: "Voucher Pengguna", icon: Ticket },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "points" ? <PointsTab /> : <VouchersTab />}
    </div>
  );
}
