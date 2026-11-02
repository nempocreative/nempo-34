import { useState, useEffect, useCallback } from "react";
import { Mail, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { api } from "@/apps/admin/lib/api";
import { useToast } from "@/apps/admin/hooks/use-toast";

interface EmailFailure {
  id: number;
  order_type: "event" | "wisata" | "penginapan";
  order_code: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  confirmed_at: string;
  product_name: string;
}

const ORDER_TYPE_LABEL: Record<string, string> = {
  event: "Tiket Event",
  wisata: "Wisata",
  penginapan: "Penginapan",
};

const ORDER_TYPE_COLOR: Record<string, string> = {
  event: "bg-purple-100 text-purple-700",
  wisata: "bg-green-100 text-green-700",
  penginapan: "bg-blue-100 text-blue-700",
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string): string {
  if (!date) return "-";
  return new Date(date).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EmailFailuresPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<EmailFailure[]>([]);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState<Record<string, boolean>>({});
  const [succeeded, setSucceeded] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.emailFailures.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast({ title: "Gagal memuat data", description: e?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function resend(row: EmailFailure) {
    const key = `${row.order_type}-${row.id}`;
    setResending(prev => ({ ...prev, [key]: true }));
    try {
      await api.emailFailures.resend(row.order_type, row.id);
      setSucceeded(prev => new Set([...prev, key]));
      toast({
        title: "Email berhasil dikirim",
        description: `Tiket untuk ${row.customer_email} telah dikirim ulang.`,
      });
      // Remove from list after short delay
      setTimeout(() => {
        setRows(prev => prev.filter(r => !(r.id === row.id && r.order_type === row.order_type)));
        setSucceeded(prev => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }, 2000);
    } catch (e: any) {
      toast({
        title: "Gagal kirim email",
        description: e?.message || "Terjadi kesalahan saat mengirim email.",
        variant: "destructive",
      });
    } finally {
      setResending(prev => ({ ...prev, [key]: false }));
    }
  }

  async function resendAll() {
    const pending = rows.filter(r => !succeeded.has(`${r.order_type}-${r.id}`));
    if (pending.length === 0) return;
    // Send one by one to avoid SMTP rate limits
    for (const row of pending) {
      await resend(row);
      // Small delay between sends
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-red-500" />
            Email Tiket Gagal Terkirim
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Order yang sudah dikonfirmasi tapi email tiket belum berhasil dikirim ke pembeli.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          {rows.length > 0 && (
            <button
              onClick={resendAll}
              disabled={Object.values(resending).some(Boolean)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Kirim Semua ({rows.length})
            </button>
          )}
        </div>
      </div>

      {/* Stats bar */}
      {!loading && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
          {rows.length === 0 ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-sm text-green-700 font-medium">
                Semua email tiket sudah berhasil dikirim. Tidak ada yang tertunda.
              </p>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-700">
                <span className="font-semibold">{rows.length} order</span> belum menerima email tiket.
                Klik <strong>Kirim Ulang</strong> pada baris yang ingin dikirim, atau <strong>Kirim Semua</strong> untuk mengirim semuanya sekaligus.
              </p>
            </>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Memuat data...
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <CheckCircle className="w-12 h-12 text-green-400 mb-3" />
            <p className="text-base font-medium text-gray-500">Tidak ada email yang tertunda</p>
            <p className="text-sm text-gray-400 mt-1">Semua pembeli sudah menerima tiket mereka.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Kode Order</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Tipe</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Produk</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Pembeli</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Total</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Dikonfirmasi</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map(row => {
                  const key = `${row.order_type}-${row.id}`;
                  const isResending = !!resending[key];
                  const isDone = succeeded.has(key);
                  return (
                    <tr key={key} className={`hover:bg-gray-50 transition-colors ${isDone ? "bg-green-50" : ""}`}>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700 font-semibold">
                        {row.order_code}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_TYPE_COLOR[row.order_type]}`}>
                          {ORDER_TYPE_LABEL[row.order_type]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate" title={row.product_name}>
                        {row.product_name || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{row.customer_name}</td>
                      <td className="px-4 py-3 text-blue-600 text-xs">{row.customer_email}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-700">
                        {formatRupiah(Number(row.total_amount) || 0)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(row.confirmed_at)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                            <CheckCircle className="w-4 h-4" />
                            Terkirim
                          </span>
                        ) : (
                          <button
                            onClick={() => resend(row)}
                            disabled={isResending}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                          >
                            {isResending ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Mail className="w-3 h-3" />
                            )}
                            {isResending ? "Mengirim..." : "Kirim Ulang"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
