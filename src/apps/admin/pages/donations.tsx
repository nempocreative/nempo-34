import { useEffect, useState } from "react";
import { api } from "@/apps/admin/lib/api";
import { Leaf, Users, TreePine, Clock, CheckCircle, Sprout, XCircle, ImageIcon, Loader2 } from "lucide-react";

type Row = Record<string, unknown>;

const STATUSES = [
  { key: "all",       label: "Semua" },
  { key: "pending",   label: "Pending" },
  { key: "confirmed", label: "Dikonfirmasi" },
  { key: "planted",   label: "Ditanam" },
  { key: "completed", label: "Selesai" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending:   { label: "Pending",        color: "text-amber-700",  bg: "bg-amber-50 border-amber-200",   icon: Clock },
  confirmed: { label: "Dikonfirmasi",   color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",     icon: CheckCircle },
  planted:   { label: "Ditanam",        color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-200",icon: Sprout },
  completed: { label: "Selesai",        color: "text-gray-700",   bg: "bg-gray-50 border-gray-200",     icon: CheckCircle },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

export default function DonationsPage() {
  const [data,     setData]     = useState<Row[]>([]);
  const [stats,    setStats]    = useState<Record<string, number>>({});
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("all");
  const [editing,  setEditing]  = useState<Row | null>(null);
  const [form,     setForm]     = useState({ status: "", photo_url: "", message: "" });
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [rows, s] = await Promise.all([api.donations.list(tab), api.donations.stats()]);
      setData(rows);
      setStats(s);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [tab]);

  function openEdit(row: Row) {
    setEditing(row);
    setForm({ status: String(row.status ?? "pending"), photo_url: String(row.photo_url ?? ""), message: String(row.message ?? "") });
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      await api.donations.update(Number(editing.id), {
        status: form.status || undefined,
        photo_url: form.photo_url || undefined,
        message: form.message || undefined,
      });
      setEditing(null);
      load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus donasi ini?")) return;
    setDeleting(id);
    try { await api.donations.delete(id); load(); }
    finally { setDeleting(null); }
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Donasi Bibit</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola donasi bibit program penghijauan Jawa Barat</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Leaf,     label: "Total Bibit",   val: Number(stats.total_bibit  ?? 0).toLocaleString("id"), color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: Users,    label: "Donatur",        val: Number(stats.total_donors ?? 0).toLocaleString("id"), color: "text-rose-600",    bg: "bg-rose-50"    },
          { icon: Clock,    label: "Menunggu",       val: Number(stats.pending      ?? 0).toLocaleString("id"), color: "text-amber-600",   bg: "bg-amber-50"   },
          { icon: TreePine, label: "Pohon Tumbuh",   val: Number(stats.pohon_tumbuh ?? 0).toLocaleString("id"), color: "text-teal-600",    bg: "bg-teal-50"    },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-black text-gray-900 text-xl leading-none">{s.val}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map(s => (
          <button key={s.key} onClick={() => setTab(s.key)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === s.key ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Leaf className="w-12 h-12 mx-auto mb-3 opacity-30" strokeWidth={1.5} />
            <p className="font-medium">Belum ada donasi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["#", "Donatur", "Bibit", "Qty", "Lokasi", "Pengambilan", "Status", "Waktu", "Aksi"].map(h => (
                    <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((row) => {
                  const st = STATUS_CONFIG[String(row.status)] ?? STATUS_CONFIG.pending;
                  const St = st.icon;
                  const bibitName = row.bibit_type === "lainnya" && row.bibit_custom_name
                    ? String(row.bibit_custom_name)
                    : String(row.bibit_type);
                  return (
                    <tr key={String(row.id)} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-xs text-gray-400 font-mono">#{String(row.id)}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900 text-sm">{String(row.donor_name)}</p>
                        <p className="text-gray-400 text-xs">{String(row.donor_email ?? "–")}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-medium max-w-[120px]">
                        <span className="truncate block">{bibitName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-black text-emerald-700 text-sm">{String(row.quantity)}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[120px]">
                        <span className="truncate block">{String(row.location_name)}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {row.delivery_type === "pickup" ? "Ambil Sendiri" : "Diantar"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-bold ${st.bg} ${st.color}`}>
                          <St className="w-3 h-3" strokeWidth={2} />{st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {timeAgo(String(row.created_at))}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(row)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(Number(row.id))}
                            disabled={deleting === Number(row.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50">
                            {deleting === Number(row.id) ? "..." : "Hapus"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 text-lg">Update Donasi #{String(editing.id)}</h2>
              <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="mb-3 p-3 bg-gray-50 rounded-2xl text-sm">
              <p className="font-semibold text-gray-800">{String(editing.donor_name)}</p>
              <p className="text-gray-500 text-xs">{String(editing.bibit_type)} × {String(editing.quantity)} bibit — {String(editing.location_name)}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Dikonfirmasi</option>
                  <option value="planted">Ditanam</option>
                  <option value="completed">Selesai</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />URL Foto Bukti Tanam
                </label>
                <input type="url" value={form.photo_url} onChange={e => setForm(p => ({ ...p, photo_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Catatan Admin (opsional)</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  rows={3} placeholder="Catatan untuk donatur..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditing(null)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
