import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/apps/admin/lib/api";
import {
  CheckCircle2, XCircle, Clock, ExternalLink, RefreshCw,
  Ticket, Download, Eye, Trash2, FileDown, Users,
  TrendingUp, AlertCircle, Filter, ScanLine, Mail, FileText,
} from "lucide-react";

type Order = {
  id: number;
  order_code: string;
  event_name: string;
  event_date: string | null;
  event_location: string | null;
  ticket_name: string;
  qty: number;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  attendee_names: string[];
  total_amount: number;
  payment_proof_url: string | null;
  status: "pending" | "confirmed" | "rejected";
  notes: string | null;
  created_at: string;
  confirmed_at: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
  email_sent_at: string | null;
  pdf_sent_at: string | null;
};

function orderSource(o: Order): "ots" | "offline" | "online" {
  if (o.notes === "ots-tiketing") return "ots";
  if (o.notes === "offline-crew") return "offline";
  return "online";
}

function fmtRp(n: number) {
  return `Rp${Number(n).toLocaleString("id")}`;
}

function fmtDate(s: string | null) {
  if (!s) return "-";
  return new Date(s).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtDatetime(s: string | null) {
  if (!s) return "-";
  return new Date(s).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const TICKET_PALETTES = [
  { grad: "#0d9488,#0f766e,#134e4a", accent: "#5eead4", sub: "#99f6e4", catLabel: "#ccfbf1", count: "#a7f3d0", label: "#0d9488", amount: "#0f766e", cfBg: "#f0fdf4", cfBorder: "#bbf7d0", cfText: "#15803d", btn: "#0d9488" },
  { grad: "#7c3aed,#6d28d9,#4c1d95", accent: "#c4b5fd", sub: "#ddd6fe", catLabel: "#ede9fe", count: "#c4b5fd", label: "#7c3aed", amount: "#6d28d9", cfBg: "#faf5ff", cfBorder: "#e9d5ff", cfText: "#7e22ce", btn: "#7c3aed" },
  { grad: "#e11d48,#be123c,#881337", accent: "#fda4af", sub: "#fecdd3", catLabel: "#ffe4e6", count: "#fda4af", label: "#e11d48", amount: "#be123c", cfBg: "#fff1f2", cfBorder: "#fecdd3", cfText: "#be123c", btn: "#e11d48" },
  { grad: "#1d4ed8,#1e40af,#1e3a8a", accent: "#93c5fd", sub: "#bfdbfe", catLabel: "#dbeafe", count: "#93c5fd", label: "#1d4ed8", amount: "#1e40af", cfBg: "#eff6ff", cfBorder: "#bfdbfe", cfText: "#1d4ed8", btn: "#1d4ed8" },
  { grad: "#d97706,#b45309,#92400e", accent: "#fcd34d", sub: "#fde68a", catLabel: "#fef9c3", count: "#fcd34d", label: "#d97706", amount: "#b45309", cfBg: "#fffbeb", cfBorder: "#fde68a", cfText: "#b45309", btn: "#d97706" },
  { grad: "#4338ca,#3730a3,#312e81", accent: "#a5b4fc", sub: "#c7d2fe", catLabel: "#e0e7ff", count: "#a5b4fc", label: "#4338ca", amount: "#3730a3", cfBg: "#eef2ff", cfBorder: "#c7d2fe", cfText: "#4338ca", btn: "#4338ca" },
  { grad: "#059669,#047857,#064e3b", accent: "#6ee7b7", sub: "#a7f3d0", catLabel: "#d1fae5", count: "#6ee7b7", label: "#059669", amount: "#047857", cfBg: "#ecfdf5", cfBorder: "#a7f3d0", cfText: "#047857", btn: "#059669" },
  { grad: "#db2777,#be185d,#9d174d", accent: "#f9a8d4", sub: "#fbcfe8", catLabel: "#fce7f3", count: "#f9a8d4", label: "#db2777", amount: "#be185d", cfBg: "#fdf2f8", cfBorder: "#fbcfe8", cfText: "#be185d", btn: "#db2777" },
];

function getTicketPalette(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TICKET_PALETTES[h % TICKET_PALETTES.length];
}

function downloadTicket(o: Order) {
  const all = [o.buyer_name, ...(o.attendee_names ?? [])];
  const ticketCode = (idx: number) => `${o.order_code}-${String(idx + 1).padStart(2, "0")}`;
  const p = getTicketPalette(o.ticket_name);

  const ticketsHtml = all.map((nm, idx) => {
    const code = ticketCode(idx);
    return `
    <div style="page-break-before:${idx > 0 ? "always" : "auto"};break-before:${idx > 0 ? "page" : "auto"};padding:24px 0;">
      <div style="width:460px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;border-radius:20px;overflow:hidden;box-shadow:0 8px 48px rgba(0,0,0,.2);background:#fff;">
        <div style="background:linear-gradient(135deg,${p.grad.split(",").map((c,i)=>`${c} ${[0,60,100][i]}%`).join(",")});padding:26px 28px 16px;color:#fff;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
            <div style="flex:1;min-width:0;">
              <p style="margin:0 0 4px;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:${p.accent};">NEMPO.ID · E-TIKET</p>
              <h2 style="margin:0 0 10px;font-size:19px;font-weight:900;line-height:1.2;">${o.event_name}</h2>
              ${o.event_date ? `<p style="margin:0 0 3px;font-size:11px;color:${p.sub};">${o.event_date}</p>` : ""}
              ${o.event_location ? `<p style="margin:0;font-size:11px;color:${p.sub};">${o.event_location}</p>` : ""}
            </div>
            <div style="background:rgba(255,255,255,.18);border-radius:12px;padding:10px 16px;text-align:center;flex-shrink:0;">
              <p style="margin:0 0 3px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${p.catLabel};">KATEGORI</p>
              <p style="margin:0 0 4px;font-size:13px;font-weight:900;">${o.ticket_name}</p>
              <p style="margin:0;font-size:11px;color:${p.count};">Tiket ${idx + 1} dari ${all.length}</p>
            </div>
          </div>
        </div>
        <div style="display:flex;align-items:center;background:linear-gradient(135deg,${p.grad.split(",")[0]},${p.grad.split(",")[2]});height:22px;">
          <div style="width:22px;height:22px;background:#f3f4f6;border-radius:50%;margin-left:-11px;flex-shrink:0;"></div>
          <div style="flex:1;border-top:2px dashed rgba(255,255,255,.3);"></div>
          <div style="width:22px;height:22px;background:#f3f4f6;border-radius:50%;margin-right:-11px;flex-shrink:0;"></div>
        </div>
        <div style="padding:22px 28px 10px;">
          <div style="flex:1;min-width:0;">
            <div style="margin-bottom:13px;">
              <p style="margin:0 0 2px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${p.label};">PEMEGANG TIKET</p>
              <p style="margin:0;font-size:17px;font-weight:900;color:#111827;">${nm}</p>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:13px;">
              <div>
                <p style="margin:0 0 2px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${p.label};">KODE TIKET</p>
                <p style="margin:0;font-size:14px;font-weight:900;color:#111827;font-family:monospace;letter-spacing:2px;">${code}</p>
              </div>
              <div>
                <p style="margin:0 0 2px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${p.label};">TOTAL BAYAR</p>
                <p style="margin:0;font-size:14px;font-weight:900;color:${p.amount};">${fmtRp(o.total_amount)}</p>
              </div>
            </div>
            ${o.confirmed_at ? `<div style="padding:7px 10px;background:${p.cfBg};border-radius:8px;border:1px solid ${p.cfBorder};"><p style="margin:0;font-size:10px;font-weight:700;color:${p.cfText};">✓ Dikonfirmasi ${new Date(o.confirmed_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p></div>` : ""}
          </div>
        </div>
        <div style="padding:10px 28px 22px;text-align:center;">
          <p style="margin:0 0 6px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#9ca3af;">SCAN UNTUK VERIFIKASI MASUK</p>
          <svg id="bc-${idx}" style="max-width:100%;"></svg>
          <p style="margin:6px 0 0;font-size:11px;font-weight:700;color:#374151;font-family:monospace;letter-spacing:2px;">${code}</p>
        </div>
        <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:10px 28px;text-align:center;">
          <p style="margin:0;font-size:10px;color:#9ca3af;">Tunjukkan tiket ini kepada petugas · nempo.id</p>
        </div>
      </div>
    </div>`;
  }).join("");

  const initBarcodes = all.map((_, idx) =>
    `JsBarcode("#bc-${idx}","${ticketCode(idx)}",{format:"CODE128",width:2.2,height:60,displayValue:false,margin:0,background:"#ffffff",lineColor:"#111827"});`
  ).join("\n");

  const html = `<!DOCTYPE html><html lang="id">
<head>
  <meta charset="UTF-8">
  <title>E-Tiket ${o.order_code}</title>
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
  <style>body{background:#e5e7eb;margin:0;padding:16px 0;}@media print{body{background:#fff;padding:0}#printbtn{display:none!important}}</style>
</head>
<body>
  <div id="printbtn" style="position:fixed;top:16px;right:16px;z-index:99;">
    <button onclick="window.print()" style="background:${p.btn};color:#fff;border:none;padding:11px 22px;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;">Cetak / Download PDF</button>
  </div>
  ${ticketsHtml}
  <script>window.addEventListener("load",function(){${initBarcodes}});<\/script>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); }
}

function exportCSV(orders: Order[]) {
  const headers = [
    "Kode Pesanan", "Event", "Tanggal Event", "Lokasi",
    "Jenis Tiket", "Qty", "Total", "Status",
    "Nama Pemesan", "Email", "No HP",
    "Peserta Lainnya", "Bukti Bayar", "Tanggal Pesan", "Dikonfirmasi",
    "Sudah Masuk", "Waktu Masuk",
  ];
  const rows = orders.map(o => [
    o.order_code,
    o.event_name,
    o.event_date ?? "",
    o.event_location ?? "",
    o.ticket_name,
    o.qty,
    o.total_amount,
    o.status === "confirmed" ? "Dikonfirmasi" : o.status === "rejected" ? "Ditolak" : "Menunggu",
    o.buyer_name,
    o.buyer_email,
    o.buyer_phone,
    (o.attendee_names ?? []).join("; "),
    o.payment_proof_url ?? "",
    fmtDatetime(o.created_at),
    fmtDatetime(o.confirmed_at),
    o.checked_in ? "Ya" : "Tidak",
    fmtDatetime(o.checked_in_at),
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pesanan-tiket-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function StatusBadge({ status }: { status: Order["status"] }) {
  if (status === "confirmed") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 whitespace-nowrap">
      <CheckCircle2 className="h-3 w-3" /> Dikonfirmasi
    </span>
  );
  if (status === "rejected") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 whitespace-nowrap">
      <XCircle className="h-3 w-3" /> Ditolak
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 whitespace-nowrap">
      <Clock className="h-3 w-3" /> Menunggu
    </span>
  );
}

export default function EventOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<number | null>(null);
  const [detail, setDetail] = useState<Order | null>(null);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [rejectNote, setRejectNote] = useState("");
  const [filterSource, setFilterSource] = useState<"all" | "online" | "ots" | "offline">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "confirmed" | "rejected">("all");
  const [filterEvent, setFilterEvent] = useState<string>("all");
  const [filterCheckin, setFilterCheckin] = useState<"all" | "in" | "out">("all");
  const [sourceCounts, setSourceCounts] = useState({ total: 0, online: 0, ots: 0, offline: 0 });
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [resending, setResending] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback((silent = false, src = filterSource) => {
    if (!silent) setLoading(true);
    api.eventOrders.list(src)
      .then((d: unknown) => {
        setOrders(d as Order[]);
        setLastSync(new Date());
        if (detail) {
          const updated = (d as Order[]).find(o => o.id === detail.id);
          if (updated) setDetail(updated);
        }
      })
      .catch(() => {})
      .finally(() => { if (!silent) setLoading(false); });
  }, [detail, filterSource]);

  const loadCounts = useCallback(() => {
    api.eventOrders.counts()
      .then((d: any) => setSourceCounts(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load(false, filterSource);
    loadCounts();
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => { load(true, filterSource); loadCounts(); }, 15000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [filterSource]);

  async function confirmOrder(id: number) {
    if (!window.confirm("Konfirmasi pesanan ini?")) return;
    setActing(id);
    await api.eventOrders.confirm(id).catch(() => {});
    setActing(null);
    load(); loadCounts();
    if (detail?.id === id) setDetail(prev => prev ? { ...prev, status: "confirmed", confirmed_at: new Date().toISOString() } : prev);
  }

  async function reject() {
    if (!rejectModal.id) return;
    setActing(rejectModal.id);
    await api.eventOrders.reject(rejectModal.id, rejectNote).catch(() => {});
    setActing(null);
    setRejectModal({ open: false, id: null });
    setRejectNote("");
    load(); loadCounts();
    setDetail(null);
  }

  async function deleteOrder(id: number, code: string) {
    if (!window.confirm(`Hapus pesanan ${code}? Tindakan ini tidak dapat dibatalkan.`)) return;
    setActing(id);
    await api.eventOrders.delete(id).catch(() => {});
    setActing(null);
    setDetail(null);
    load(); loadCounts();
  }

  async function markPdfSent(id: number) {
    try {
      const res = await fetch(`/api/event-orders/${id}/mark-pdf-sent`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("nempo_admin_token") ?? ""}` },
      });
      if (!res.ok) { alert("Gagal menandai PDF terkirim"); return; }
      load(true);
      setDetail(prev => prev ? { ...prev, pdf_sent_at: new Date().toISOString() } : prev);
    } catch {
      alert("Terjadi kesalahan. Coba lagi.");
    }
  }

  async function resendEmail(order: Order) {
    if (!order.buyer_email) return;
    if (!window.confirm(`Kirim ulang e-tiket ke ${order.buyer_email}?`)) return;
    setResending(true);
    try {
      const res = await fetch(`/api/admin/email-failures/event/${order.id}/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("nempo_admin_token") ?? ""}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengirim email");
      alert(`E-tiket berhasil dikirim ke ${order.buyer_email}`);
      load(true);
    } catch (err: any) {
      alert(err.message ?? "Gagal mengirim email. Coba lagi.");
    } finally {
      setResending(false);
    }
  }

  const eventNames = [...new Set(orders.map(o => o.event_name))].sort();
  /* API sudah filter by source — bySource = orders langsung */
  const byEvent   = filterEvent === "all" ? orders : orders.filter(o => o.event_name === filterEvent);
  const byCheckin = filterCheckin === "in" ? byEvent.filter(o => o.checked_in) : filterCheckin === "out" ? byEvent.filter(o => !o.checked_in) : byEvent;
  const filtered  = filterStatus === "all" ? byCheckin : byCheckin.filter(o => o.status === filterStatus);

  const pending = byEvent.filter(o => o.status === "pending").length;
  const confirmed = byEvent.filter(o => o.status === "confirmed").length;
  const rejected = byEvent.filter(o => o.status === "rejected").length;
  const checkedIn = byEvent.filter(o => o.checked_in).length;
  const totalRevenue = byEvent.filter(o => o.status === "confirmed").reduce((s, o) => s + Number(o.total_amount), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Ticket className="h-6 w-6 text-blue-600" /> Pesanan Tiket
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {orders.length} pesanan total
            {filterEvent !== "all" && <span className="ml-1 text-blue-600 font-semibold">· filter: {filterEvent}</span>}
          </p>
          {lastSync && (
            <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Auto-sync · terakhir {lastSync.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportCSV(filtered)}
            disabled={orders.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-40"
          >
            <FileDown className="h-4 w-4" /> Export CSV
          </button>
          <button onClick={() => load()} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200 px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Menunggu</span>
          </div>
          <p className="text-2xl font-extrabold text-amber-700">{pending}</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Dikonfirmasi</span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">{confirmed}</p>
        </div>
        <div
          className="bg-white rounded-2xl border border-green-200 px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors"
          onClick={() => setFilterCheckin(v => v === "in" ? "all" : "in")}
          title="Klik untuk filter Sudah Masuk"
        >
          <div className="flex items-center gap-2 mb-1">
            <ScanLine className="h-4 w-4 text-green-500" />
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Sudah Masuk</span>
          </div>
          <p className="text-2xl font-extrabold text-green-700">{checkedIn}</p>
          {filterCheckin === "in" && <p className="text-[10px] text-green-500 font-bold mt-0.5">▲ difilter</p>}
        </div>
        <div className="bg-white rounded-2xl border border-teal-200 px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-teal-500" />
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">Pendapatan</span>
          </div>
          <p className="text-lg font-extrabold text-teal-700 leading-tight">{fmtRp(totalRevenue)}</p>
        </div>
      </div>

      {/* Source tabs — pisah Online / OTS / Offline */}
      <div className="mb-4 max-w-full overflow-x-auto rounded-2xl bg-gray-100 p-1">
        <div className="flex w-max min-w-full gap-1">
          {([
            { v: "all",     label: "Semua",           count: sourceCounts.total,   color: "bg-white text-gray-900" },
            { v: "online",  label: "🌐 Online",        count: sourceCounts.online,  color: "bg-white text-blue-700" },
            { v: "ots",     label: "📲 OTS Tiketing",  count: sourceCounts.ots,     color: "bg-white text-green-700" },
            { v: "offline", label: "🎟 Tiket Offline", count: sourceCounts.offline, color: "bg-white text-purple-700" },
          ] as const).map(({ v, label, count, color }) => (
            <button
              key={v}
              onClick={() => { setFilterSource(v); setFilterStatus("all"); setFilterEvent("all"); }}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                filterSource === v ? `${color} shadow-sm` : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label} <span className="ml-1 opacity-60">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Event filter */}
        {eventNames.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <select
              value={filterEvent}
              onChange={e => { setFilterEvent(e.target.value); setFilterStatus("all"); }}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 bg-white max-w-[220px] truncate"
            >
              <option value="all">Semua Event ({orders.length})</option>
              {eventNames.map(name => (
                <option key={name} value={name}>
                  {name} ({orders.filter(o => o.event_name === name).length})
                </option>
              ))}
            </select>
            {filterEvent !== "all" && (
              <button
                onClick={() => { setFilterEvent("all"); setFilterStatus("all"); }}
                className="text-xs text-gray-400 hover:text-gray-700 font-bold"
                title="Reset filter"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Status filter tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(["all", "pending", "confirmed", "rejected"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filterStatus === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {s === "all" ? `Semua (${byEvent.length})` : s === "pending" ? `Menunggu (${pending})` : s === "confirmed" ? `Dikonfirmasi (${confirmed})` : `Ditolak (${rejected})`}
            </button>
          ))}
        </div>

        {/* Check-in filter */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {([
            { v: "all", label: "Semua" },
            { v: "in",  label: `✓ Sudah Masuk (${checkedIn})` },
            { v: "out", label: `Belum Masuk (${byEvent.length - checkedIn})` },
          ] as const).map(({ v, label }) => (
            <button
              key={v}
              onClick={() => setFilterCheckin(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                filterCheckin === v
                  ? v === "in" ? "bg-green-600 text-white shadow-sm" : v === "out" ? "bg-gray-600 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20 text-gray-400">Memuat...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center text-gray-400">
          <Ticket className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Belum ada pesanan</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">No</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Kode</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Event</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Pemesan</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Tiket</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Masuk</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Tanggal</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((o, idx) => (
                  <tr key={o.id} className={`hover:bg-gray-50 transition-colors ${o.status === "pending" ? "bg-amber-50/40" : ""}`}>
                    <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-gray-800 text-xs">{o.order_code}</span>
                      {orderSource(o) === "ots" && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700 align-middle">OTS</span>
                      )}
                      {orderSource(o) === "offline" && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-700 align-middle">OFFLINE</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <p className="font-semibold text-gray-800 truncate text-xs">{o.event_name}</p>
                      {o.event_date && <p className="text-gray-400 text-[11px]">{fmtDate(o.event_date)}</p>}
                    </td>
                    <td className="px-4 py-3 max-w-[140px]">
                      <p className="font-semibold text-gray-800 truncate text-xs">{o.buyer_name}</p>
                      <p className="text-gray-400 text-[11px] truncate">{o.buyer_phone}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-gray-700 text-xs">{o.ticket_name}</p>
                      <p className="text-gray-400 text-[11px]">× {o.qty}</p>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="font-bold text-gray-900 text-xs">{fmtRp(o.total_amount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {o.checked_in ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          <CheckCircle2 className="h-3 w-3" /> Sudah
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-400">
                          Belum
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[11px] text-gray-400">
                      {fmtDate(o.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setDetail(o)}
                          title="Lihat detail"
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {o.status === "confirmed" && (
                          <button
                            onClick={() => downloadTicket(o)}
                            title="Download tiket"
                            className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteOrder(o.id, o.order_code)}
                          disabled={acting === o.id}
                          title="Hapus pesanan"
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center px-4 py-8 overflow-y-auto" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-auto" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-gray-900 text-base font-mono">{detail.order_code}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{detail.event_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={detail.status} />
                <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none ml-2">×</button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Event info */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm">
                <p className="font-bold text-gray-700">{detail.event_name}</p>
                {detail.event_date && <p className="text-gray-500 text-xs">📅 {fmtDate(detail.event_date)}</p>}
                {detail.event_location && <p className="text-gray-500 text-xs">📍 {detail.event_location}</p>}
              </div>

              {/* Ticket info */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide mb-0.5">Tiket</p>
                  <p className="font-bold text-blue-800 text-sm">{detail.ticket_name}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide mb-0.5">Qty</p>
                  <p className="font-bold text-blue-800 text-sm">{detail.qty}</p>
                </div>
                <div className="bg-teal-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wide mb-0.5">Total</p>
                  <p className="font-bold text-teal-800 text-sm">{fmtRp(detail.total_amount)}</p>
                </div>
              </div>

              {/* Buyer info */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Data Pemesan</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Nama</span><span className="font-semibold text-gray-800">{detail.buyer_name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-semibold text-gray-800">{detail.buyer_email}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">No HP</span><span className="font-semibold text-gray-800">{detail.buyer_phone}</span></div>
                </div>
              </div>

              {/* Attendees */}
              {detail.attendee_names?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Peserta Lainnya</p>
                  <div className="space-y-1">
                    {detail.attendee_names.map((n, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-500">Orang ke-{i + 2}</span>
                        <span className="font-semibold text-gray-800">{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment proof */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Bukti Pembayaran</p>
                {detail.payment_proof_url ? (
                  <a href={detail.payment_proof_url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" /> Lihat Bukti Bayar
                  </a>
                ) : (
                  <p className="text-gray-400 text-sm">Tidak ada bukti bayar</p>
                )}
              </div>

              {/* Sumber tiket */}
              {orderSource(detail) !== "online" && (
                <div className={`rounded-xl p-3 ${orderSource(detail) === "ots" ? "bg-green-50 border border-green-200" : "bg-purple-50 border border-purple-200"}`}>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: orderSource(detail) === "ots" ? "#15803d" : "#7e22ce" }}>Sumber Tiket</p>
                  <p className="text-sm font-bold" style={{ color: orderSource(detail) === "ots" ? "#166534" : "#6b21a8" }}>
                    {orderSource(detail) === "ots" ? "📲 OTS Tiketing (bayar di tempat)" : "🎟 Tiket Offline (input crew)"}
                  </p>
                </div>
              )}

              {/* Notes */}
              {detail.notes && orderSource(detail) === "online" && (
                <div className="bg-red-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide mb-1">Catatan Penolakan</p>
                  <p className="text-red-700 text-sm">{detail.notes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="text-[11px] text-gray-400 space-y-0.5">
                <p>Dipesan: {fmtDatetime(detail.created_at)}</p>
                {detail.confirmed_at && <p className="text-emerald-600">✓ Dikonfirmasi: {fmtDatetime(detail.confirmed_at)}</p>}
                {detail.checked_in
                  ? <p className="text-green-600 font-semibold">✓ Sudah masuk (scan): {fmtDatetime(detail.checked_in_at)}</p>
                  : <p className="text-gray-400">⊙ Belum scan masuk</p>
                }
                {detail.status === "confirmed" && (
                  detail.pdf_sent_at
                    ? <p className="text-teal-600">✓ PDF terkirim: {fmtDatetime(detail.pdf_sent_at)}</p>
                    : <p className="text-orange-500 font-semibold">⚠ PDF belum dikirim</p>
                )}
              </div>
            </div>

            {/* Modal actions */}
            <div className="px-6 pb-5 flex flex-wrap gap-2">
              {detail.status === "pending" && (
                <>
                  <button
                    onClick={() => confirmOrder(detail.id)}
                    disabled={acting === detail.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {acting === detail.id ? "Memproses..." : "Konfirmasi"}
                  </button>
                  <button
                    onClick={() => { setRejectModal({ open: true, id: detail.id }); setRejectNote(""); }}
                    disabled={acting === detail.id}
                    className="px-5 py-2.5 rounded-xl border-2 border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Tolak
                  </button>
                </>
              )}
              {detail.status === "confirmed" && (
                <>
                  <button
                    onClick={() => downloadTicket(detail)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors"
                  >
                    <Download className="h-4 w-4" /> Download Tiket
                  </button>
                  {detail.buyer_email && (
                    <button
                      onClick={() => resendEmail(detail)}
                      disabled={resending}
                      title={detail.email_sent_at ? `Terakhir dikirim: ${new Date(detail.email_sent_at).toLocaleString("id-ID")}` : "Email belum pernah dikirim"}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors disabled:opacity-50"
                    >
                      <Mail className="h-4 w-4" />
                      {resending ? "Mengirim..." : detail.email_sent_at ? "Kirim Ulang Tiket" : "Kirim Tiket"}
                    </button>
                  )}
                  {!detail.pdf_sent_at && (
                    <button
                      onClick={() => markPdfSent(detail.id)}
                      title="Klik setelah PDF tiket berhasil dikirim manual ke pembeli"
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-colors"
                    >
                      <FileText className="h-4 w-4" /> Tandai PDF Terkirim
                    </button>
                  )}
                </>
              )}
              <button
                onClick={() => deleteOrder(detail.id, detail.order_code)}
                disabled={acting === detail.id}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center px-4" onClick={() => setRejectModal({ open: false, id: null })}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-extrabold text-gray-900 text-lg mb-1">Tolak Pesanan</h3>
            <p className="text-gray-500 text-sm mb-4">Tambahkan alasan penolakan (opsional).</p>
            <textarea
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              placeholder="Contoh: Bukti bayar tidak jelas, nominal tidak sesuai..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/10 resize-none mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setRejectModal({ open: false, id: null })}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">
                Batal
              </button>
              <button onClick={reject} disabled={acting !== null}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors disabled:opacity-50">
                {acting !== null ? "Memproses..." : "Tolak Pesanan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
