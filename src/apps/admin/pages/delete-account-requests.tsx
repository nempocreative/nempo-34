import { useEffect, useState } from "react";
import { api } from "@/apps/admin/lib/api";
import { Trash2, Check, X, RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

type Request = {
  id: number;
  user_id: number | null;
  user_email: string;
  user_name: string;
  reason: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
};

function fmt(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function StatusBadge({ status }: { status: string }) {
  if (status === "pending") return <span className="flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full"><Clock className="w-3 h-3"/>Menunggu</span>;
  if (status === "approved") return <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full"><CheckCircle className="w-3 h-3"/>Disetujui</span>;
  return <span className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-500 text-xs font-semibold rounded-full"><XCircle className="w-3 h-3"/>Ditolak</span>;
}

export default function DeleteAccountRequestsPage() {
  const [data, setData] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  const load = () => { setLoading(true); api.deleteAccountRequests.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  async function handleApprove(r: Request) {
    if (!confirm(`PERMANEN! Hapus akun "${r.user_name}" (${r.user_email})? Data user ini akan dihapus dari sistem.`)) return;
    setActionId(r.id);
    try { await api.deleteAccountRequests.approve(r.id); load(); }
    catch (e: any) { alert(e.message); }
    finally { setActionId(null); }
  }

  async function handleReject(id: number) {
    if (!confirm("Tolak permintaan hapus akun ini? User akan tetap aktif.")) return;
    setActionId(id);
    try { await api.deleteAccountRequests.reject(id); load(); }
    catch (e: any) { alert(e.message); }
    finally { setActionId(null); }
  }

  const pending = data.filter(r => r.status === "pending");
  const resolved = data.filter(r => r.status !== "pending");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Permintaan Hapus Akun</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pending.length} permintaan menunggu tindakan</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {pending.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">Menyetujui permintaan akan <strong>menghapus permanen</strong> akun user beserta seluruh datanya. Tindakan ini tidak bisa dibatalkan.</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Memuat data...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Trash2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada permintaan hapus akun</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-yellow-500"/>Menunggu Tindakan ({pending.length})</p>
              <div className="space-y-3">
                {pending.map(r => (
                  <div key={r.id} className="bg-white border border-red-100 rounded-2xl shadow-sm p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{r.user_name}</p>
                          <StatusBadge status={r.status} />
                        </div>
                        <p className="text-sm text-gray-500">{r.user_email}</p>
                        {r.reason && (
                          <div className="mt-2 bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-0.5">Alasan:</p>
                            <p className="text-sm text-gray-700">{r.reason}</p>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2">Diminta: {fmt(r.created_at)}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleApprove(r)}
                          disabled={actionId === r.id}
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
                        >
                          <Check className="w-4 h-4" /> Hapus Akun
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          disabled={actionId === r.id}
                          className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-600 text-sm font-medium rounded-xl transition-colors"
                        >
                          <X className="w-4 h-4" /> Tolak
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {resolved.length > 0 && (
            <div>
              <p className="text-sm font-bold text-gray-500 mb-3">Riwayat ({resolved.length})</p>
              <div className="space-y-2">
                {resolved.map(r => (
                  <div key={r.id} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{r.user_name} <span className="text-gray-400 font-normal">({r.user_email})</span></p>
                      {r.reason && <p className="text-xs text-gray-500 mt-0.5">{r.reason}</p>}
                      <p className="text-xs text-gray-400">Diminta: {fmt(r.created_at)} · Diproses: {fmt(r.resolved_at)}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
