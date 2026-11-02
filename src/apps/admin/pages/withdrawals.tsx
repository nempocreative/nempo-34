import { useEffect, useState } from "react";
import { Wallet, RefreshCw, CheckCircle2, XCircle, Clock, Landmark, Send, Zap, ShieldAlert, AlertCircle } from "lucide-react";
import { api } from "@/apps/admin/lib/api";

type Withdrawal = {
  id: number;
  mitra_id: number;
  business_name: string;
  contact_name: string;
  phone: string;
  amount: number;
  bank_name: string;
  bank_account_no: string;
  bank_account_name: string;
  status: "pending" | "approved" | "processing" | "rejected" | "completed";
  admin_note: string | null;
  disbursement_reference: string | null;
  requested_at: string;
  approved_at: string | null;
  processed_at: string | null;
};

type Summary = { pending: number; approved: number; outstanding_amount: number };

function fmt(d: string | null) {
  if (!d) return "–";
  return new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}
function rupiah(n: number) {
  return `Rp${Number(n).toLocaleString("id")}`;
}

const STATUS_MAP: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  pending:    { label: "Menunggu Persetujuan",    cls: "bg-amber-100 text-amber-700",   icon: Clock },
  approved:   { label: "Disetujui — Perlu Transfer", cls: "bg-blue-100 text-blue-700", icon: Send },
  processing: { label: "Diproses Otomatis",        cls: "bg-purple-100 text-purple-700", icon: Zap },
  completed:  { label: "Selesai",                  cls: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  rejected:   { label: "Ditolak",                  cls: "bg-red-100 text-red-600",      icon: XCircle },
};

export default function WithdrawalsPage() {
  const [rows, setRows] = useState<Withdrawal[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");
  const [refModal, setRefModal] = useState<Withdrawal | null>(null);
  const [refValue, setRefValue] = useState("");
  const [rejectModal, setRejectModal] = useState<Withdrawal | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [irisConfigured, setIrisConfigured] = useState(false);

  const load = (f = filter) => {
    setLoading(true);
    Promise.all([
      api.withdrawals.list(f),
      api.withdrawals.summary(),
    ]).then(([data, sum]) => {
      setRows(data as Withdrawal[]);
      setSummary(sum as Summary);
    }).finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    api.withdrawals.irisStatus().then((r: any) => setIrisConfigured(!!r?.configured));
  }, []);

  const changeFilter = (f: string) => { setFilter(f); load(f); };

  async function handleApprove(w: Withdrawal) {
    setBusyId(w.id);
    setActionError("");
    try {
      await api.withdrawals.approve(w.id);
      load();
    } catch (err: any) {
      setActionError(`Gagal menyetujui #${w.id}: ${err?.message ?? "Terjadi kesalahan"}`);
    } finally {
      setBusyId(null);
    }
  }

  async function submitReject() {
    if (!rejectModal) return;
    setBusyId(rejectModal.id);
    setActionError("");
    try {
      await api.withdrawals.reject(rejectModal.id, rejectReason);
      setRejectModal(null);
      setRejectReason("");
      load();
    } catch (err: any) {
      setActionError(`Gagal menolak #${rejectModal.id}: ${err?.message ?? "Terjadi kesalahan"}`);
    } finally {
      setBusyId(null);
    }
  }

  async function submitComplete() {
    if (!refModal) return;
    setBusyId(refModal.id);
    setActionError("");
    try {
      await api.withdrawals.complete(refModal.id, refValue);
      setRefModal(null);
      setRefValue("");
      load();
    } catch (err: any) {
      setActionError(`Gagal menandai selesai #${refModal.id}: ${err?.message ?? "Terjadi kesalahan"}`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Penarikan Saldo Mitra</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tinjau dan proses permintaan tarik saldo dari mitra usaha</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-100 shadow-sm text-sm">
          {irisConfigured ? (
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <Zap className="w-4 h-4" /> Pencairan otomatis aktif (Midtrans Iris)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-gray-500 font-semibold">
              <ShieldAlert className="w-4 h-4" /> Pencairan manual (transfer bank sendiri)
            </span>
          )}
        </div>
      </div>

      {/* Error feedback */}
      {actionError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{actionError}</span>
          <button onClick={() => setActionError("")} className="text-red-400 hover:text-red-600 text-xs font-bold">✕</button>
        </div>
      )}

      {/* Summary cards — always from full data via summary API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Wallet className="w-5 h-5" /></div>
          <div>
            <p className="text-lg font-black text-gray-900">
              {summary ? rupiah(Number(summary.outstanding_amount)) : "–"}
            </p>
            <p className="text-[11px] text-gray-400 font-medium">Total dana belum dicairkan</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Clock className="w-5 h-5" /></div>
          <div>
            <p className="text-lg font-black text-gray-900">{summary?.pending ?? "–"}</p>
            <p className="text-[11px] text-gray-400 font-medium">Menunggu persetujuan</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {["all", "pending", "approved", "processing", "completed", "rejected"].map(s => (
          <button
            key={s}
            onClick={() => changeFilter(s)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === s ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}
          >
            {s === "all" ? "Semua" : STATUS_MAP[s]?.label ?? s}
          </button>
        ))}
        <button onClick={() => load()} className="p-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors ml-auto">
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
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mitra</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rekening Tujuan</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(w => {
                  const st = STATUS_MAP[w.status] ?? STATUS_MAP.pending;
                  return (
                    <tr key={w.id} className="hover:bg-gray-50 transition-colors align-top">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{w.business_name}</p>
                        <p className="text-xs text-gray-400">{w.contact_name} · {w.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-black text-gray-900">{rupiah(w.amount)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                          <Landmark className="w-3.5 h-3.5 text-gray-400" /> {w.bank_name}
                        </div>
                        <p className="text-xs text-gray-400 font-mono">{w.bank_account_no}</p>
                        <p className="text-xs text-gray-400">a.n. {w.bank_account_name}</p>
                        {w.disbursement_reference && (
                          <p className="text-[11px] text-blue-500 mt-1">Ref: {w.disbursement_reference}</p>
                        )}
                        {w.admin_note && (
                          <p className="text-[11px] text-gray-400 mt-1 italic">"{w.admin_note}"</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${st.cls}`}>
                          <st.icon className="w-3 h-3" /> {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-gray-500 space-y-0.5 whitespace-nowrap">
                        <p title="Diajukan">{fmt(w.requested_at)}</p>
                        {w.approved_at && <p className="text-blue-400" title="Disetujui">✓ {fmt(w.approved_at)}</p>}
                        {w.processed_at && <p className="text-emerald-500" title="Selesai">✓✓ {fmt(w.processed_at)}</p>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {w.status === "pending" && (
                            <>
                              <button
                                disabled={busyId === w.id}
                                onClick={() => handleApprove(w)}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                              >
                                Setujui
                              </button>
                              <button
                                disabled={busyId === w.id}
                                onClick={() => setRejectModal(w)}
                                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 disabled:opacity-50"
                              >
                                Tolak
                              </button>
                            </>
                          )}
                          {(w.status === "approved" || w.status === "processing") && (
                            <button
                              disabled={busyId === w.id}
                              onClick={() => { setRefModal(w); setRefValue(w.disbursement_reference ?? ""); }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
                            >
                              Tandai Selesai
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && (
            <p className="text-center py-8 text-gray-400 text-sm">Tidak ada permintaan penarikan.</p>
          )}
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setRejectModal(null)}>
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-1">Tolak Permintaan</h3>
            <p className="text-xs text-gray-500 mb-3">Saldo {rupiah(rejectModal.amount)} akan dikembalikan ke dompet mitra {rejectModal.business_name}.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Alasan penolakan (opsional)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:border-blue-300"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRejectModal(null)} className="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100">Batal</button>
              <button onClick={submitReject} disabled={busyId === rejectModal.id} className="px-3.5 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">Tolak & Kembalikan Saldo</button>
            </div>
          </div>
        </div>
      )}

      {refModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setRefModal(null)}>
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-1">Tandai Pencairan Selesai</h3>
            <p className="text-xs text-gray-500 mb-3">Konfirmasi dana {rupiah(refModal.amount)} sudah dikirim ke rekening {refModal.business_name}.</p>
            <input
              value={refValue}
              onChange={e => setRefValue(e.target.value)}
              placeholder="Nomor referensi transfer (opsional)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:border-blue-300"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRefModal(null)} className="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100">Batal</button>
              <button onClick={submitComplete} disabled={busyId === refModal.id} className="px-3.5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">Konfirmasi Selesai</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
