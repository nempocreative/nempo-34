import { useEffect, useState } from "react";
import { api } from "@/apps/admin/lib/api";
import { KeyRound, Check, X, RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";

type Request = {
  id: number;
  status: string;
  created_at: string;
  resolved_at: string | null;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string | null;
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

export default function PasswordResetRequestsPage() {
  const [data, setData] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  const load = () => { setLoading(true); api.passwordResetRequests.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  async function handleApprove(id: number) {
    if (!confirm("Setujui dan reset password user ini? Password baru yang diminta user akan langsung aktif.")) return;
    setActionId(id);
    try { await api.passwordResetRequests.approve(id); load(); }
    catch (e: any) { alert(e.message); }
    finally { setActionId(null); }
  }

  async function handleReject(id: number) {
    if (!confirm("Tolak permintaan ganti password ini?")) return;
    setActionId(id);
    try { await api.passwordResetRequests.reject(id); load(); }
    catch (e: any) { alert(e.message); }
    finally { setActionId(null); }
  }

  const pending = data.filter(r => r.status === "pending");
  const resolved = data.filter(r => r.status !== "pending");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Permintaan Ganti Password</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pending.length} permintaan menunggu persetujuan</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Memuat data...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <KeyRound className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada permintaan ganti password</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-yellow-500"/>Menunggu Tindakan ({pending.length})</p>
              <div className="space-y-3">
                {pending.map(r => (
                  <div key={r.id} className="bg-white border border-yellow-100 rounded-2xl shadow-sm p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{r.user_name}</p>
                          <StatusBadge status={r.status} />
                        </div>
                        <p className="text-sm text-gray-500">{r.user_email}</p>
                        {r.user_phone && <p className="text-sm text-gray-500">No. HP: {r.user_phone}</p>}
                        <p className="text-xs text-gray-400 mt-1">Diminta: {fmt(r.created_at)}</p>
                        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1 mt-2 inline-block">
                          ⚠️ Hubungi user untuk verifikasi identitas sebelum menyetujui — password baru dari user ini bisa saja bukan diajukan olehnya sendiri
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleApprove(r.id)}
                          disabled={actionId === r.id}
                          className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
                        >
                          <Check className="w-4 h-4" /> Setujui
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          disabled={actionId === r.id}
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-500 text-sm font-medium rounded-xl transition-colors"
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
