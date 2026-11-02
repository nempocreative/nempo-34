import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "@/lib/wouter";
import {
  Ticket, Search, CheckCircle2, XCircle, Clock, RefreshCw,
  Download, CalendarDays, MapPin, User, Loader2, ChevronRight,
  AlertTriangle, X,
} from "lucide-react";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import html2canvas from "html2canvas";

const API = "/api";

interface EventTicket {
  id: number;
  order_code: string;
  status: "pending" | "confirmed" | "rejected";
  total_amount: number;
  created_at: string;
  confirmed_at: string | null;
  ticket_name: string;
  qty: number;
  buyer_name: string;
  buyer_email: string;
  attendee_names: string[];
  checked_in: boolean;
  checked_in_at: string | null;
  event_name: string;
  event_date: string | null;
  time_start: string | null;
  event_location: string | null;
  event_image: string | null;
  organizer: string | null;
}

function fmtRp(n: number) {
  return n === 0 ? "Gratis" : `Rp${Number(n).toLocaleString("id")}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

/* ── E-Ticket Card (also the html2canvas target) ── */
function ETicketCard({ ticket, cardRef }: { ticket: EventTicket; cardRef?: React.RefObject<HTMLDivElement | null> }) {
  const qrUrl = `${API}/qr?data=${encodeURIComponent(ticket.order_code)}`;
  const isConfirmed = ticket.status === "confirmed";

  return (
    <div
      ref={cardRef}
      className="rounded-3xl overflow-hidden select-none"
      style={{
        background: "linear-gradient(145deg, #020817 0%, #0c1a3d 50%, #091228 100%)",
        boxShadow: "0 20px 60px rgba(1,148,243,0.25)",
        width: "100%",
        maxWidth: 420,
      }}
    >
      {/* Top band */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px dashed rgba(255,255,255,0.12)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#0194f3,#0172B1)" }}>
              <Ticket className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-black text-sm tracking-wide">NEMPO</span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#60a5fa" }}>ORGANIZER</span>
          </div>
          {isConfirmed ? (
            <span className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-2.5 py-1 text-[10px] font-bold text-emerald-300">
              <CheckCircle2 className="h-3 w-3" /> VALID
            </span>
          ) : ticket.status === "pending" ? (
            <span className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 rounded-full px-2.5 py-1 text-[10px] font-bold text-amber-300">
              <Clock className="h-3 w-3" /> MENUNGGU
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-red-500/20 border border-red-500/40 rounded-full px-2.5 py-1 text-[10px] font-bold text-red-300">
              <XCircle className="h-3 w-3" /> DITOLAK
            </span>
          )}
        </div>

        <h2 className="text-white font-black text-lg leading-snug mb-1">
          {ticket.event_name || "—"}
        </h2>

        <div className="flex flex-col gap-1">
          {ticket.event_date && (
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3 w-3 shrink-0" style={{ color: "#60a5fa" }} />
              <span className="text-xs font-medium" style={{ color: "#93c5fd" }}>
                {ticket.event_date}{ticket.time_start ? ` · ${ticket.time_start}` : ""}
              </span>
            </div>
          )}
          {ticket.event_location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 shrink-0" style={{ color: "#60a5fa" }} />
              <span className="text-xs font-medium" style={{ color: "#93c5fd" }}>{ticket.event_location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Middle: info + QR */}
      <div className="px-5 py-4 flex gap-4" style={{ borderBottom: "1px dashed rgba(255,255,255,0.12)" }}>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#fbbf24" }}>Nama Pemesan</p>
            <p className="text-white font-bold text-sm">{ticket.buyer_name}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#fbbf24" }}>Jenis Tiket</p>
            <p className="text-white font-semibold text-sm">{ticket.ticket_name} × {ticket.qty}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#fbbf24" }}>Kode Pesanan</p>
            <p className="font-mono font-extrabold text-base tracking-widest" style={{ color: "#fde68a" }}>
              {ticket.order_code}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#fbbf24" }}>Total Bayar</p>
            <p className="text-white font-extrabold text-sm">{fmtRp(ticket.total_amount)}</p>
          </div>
        </div>

        {/* QR code */}
        <div className="shrink-0 flex flex-col items-center gap-1.5">
          <div className="rounded-2xl p-2 bg-white" style={{ width: 88, height: 88 }}>
            {isConfirmed ? (
              <img
                src={qrUrl}
                alt={ticket.order_code}
                width={72}
                height={72}
                crossOrigin="anonymous"
                className="rounded"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded" style={{ background: "#f1f5f9" }}>
                <Ticket className="h-8 w-8 text-gray-300" />
              </div>
            )}
          </div>
          <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
            {isConfirmed ? "Scan Masuk" : "Belum Aktif"}
          </p>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: "rgba(1,148,243,0.12)" }}>
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#60a5fa" }}>Nempo Organizer</span>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < 3 ? "#0194f3" : "#1d4ed8" }} />
          ))}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#60a5fa" }}>
          {ticket.checked_in ? "✓ Sudah Masuk" : "Official Ticket"}
        </span>
      </div>
    </div>
  );
}

/* ── Download helper ── */
async function downloadTicket(el: HTMLElement, code: string) {
  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `etiket-${code}.png`;
    a.click();
  } catch {
    alert("Gagal mengunduh tiket. Coba lagi.");
  }
}

/* ── Search card (by order code) ── */
function SearchCard({ onFound }: { onFound: (t: EventTicket) => void }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const code = input.trim().toUpperCase();
    if (!code) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${API}/event-orders/status/${code}`);
      if (!r.ok) { setError("Kode pesanan tidak ditemukan."); return; }
      const data = await r.json();
      onFound({ ...data, buyer_email: "", attendee_names: [], checked_in: false, checked_in_at: null, id: 0 });
      setInput("");
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSearch} className="mb-2">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 focus-within:border-[#0194f3] focus-within:ring-2 focus-within:ring-[#0194f3]/10 rounded-xl px-3.5 py-3 transition-all">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value.toUpperCase()); setError(""); }}
            placeholder="Kode pesanan (cth: NGTAB1C2D)"
            className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-300 font-mono tracking-widest"
            maxLength={20}
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-40"
          style={{ background: "#0194f3" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cek"}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
          <XCircle className="h-3 w-3 shrink-0" /> {error}
        </p>
      )}
    </form>
  );
}

/* ── Ticket row wrapper ── */
function TicketRow({ ticket, onRemove }: { ticket: EventTicket; onRemove?: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    await downloadTicket(cardRef.current, ticket.order_code);
    setDownloading(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-gray-500 font-mono">{ticket.order_code}</span>
        <div className="flex items-center gap-2">
          {ticket.status === "confirmed" && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#0194f3,#0172B1)" }}
            >
              {downloading
                ? <><Loader2 className="h-3 w-3 animate-spin" /> Mengunduh…</>
                : <><Download className="h-3 w-3" /> Unduh Tiket</>
              }
            </button>
          )}
          {onRemove && (
            <button onClick={onRemove} className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <ETicketCard ticket={ticket} cardRef={cardRef} />

      {ticket.status === "pending" && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
          <p className="text-amber-700 text-xs font-bold">⏳ Menunggu Konfirmasi</p>
          <p className="text-amber-600 text-[11px] mt-0.5 leading-relaxed">
            Tim Nempo Organizer sedang memverifikasi pembayaranmu. QR code aktif setelah dikonfirmasi.
          </p>
        </div>
      )}
      {ticket.status === "rejected" && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
          <p className="text-red-600 text-xs font-bold flex items-center gap-1"><XCircle className="h-3.5 w-3.5" /> Pesanan Ditolak</p>
          <p className="text-red-500 text-[11px] mt-0.5">
            <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="underline">
              Hubungi admin via WhatsApp
            </a>{" "}
            untuk informasi lebih lanjut.
          </p>
        </div>
      )}
      {ticket.status === "confirmed" && ticket.checked_in && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
          <p className="text-blue-700 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Tiket sudah digunakan masuk
          </p>
          {ticket.checked_in_at && (
            <p className="text-blue-500 text-[11px] mt-0.5">Scan masuk: {fmtDate(ticket.checked_in_at)}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Page ── */
export default function TiketPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<EventTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState<EventTicket[]>([]);

  const fetchTickets = useCallback(async () => {
    const token = localStorage.getItem("nempo_user_token");
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${API}/user/event-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      if (Array.isArray(data)) setTickets(data);
      else setError(data.error || "Gagal memuat tiket");
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchTickets();
  }, [user, fetchTickets]);

  function handleFoundByCode(t: EventTicket) {
    setSearched(prev => {
      if (prev.some(p => p.order_code === t.order_code)) return prev;
      return [t, ...prev];
    });
  }

  const allTickets = [
    ...tickets,
    ...searched.filter(s => !tickets.some(t => t.order_code === s.order_code)),
  ];

  return (
    <Layout>
      <SEO title="Tiket Saya" noIndex />
      <div className="max-w-lg mx-auto px-4 py-6 pb-32">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg,#0194f3,#7C3AED)" }}>
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">E-Tiket Saya</h1>
            <p className="text-gray-400 text-xs">Tiket event digitalmu</p>
          </div>
          {user && (
            <button onClick={fetchTickets} className="ml-auto p-2 rounded-xl hover:bg-gray-100 transition-colors" title="Refresh">
              <RefreshCw className={`h-4 w-4 text-gray-400 ${loading ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>

        {/* Search by code */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Cari tiket lewat kode pesanan</p>
          <SearchCard onFound={handleFoundByCode} />
        </div>

        {/* Not logged in: nudge */}
        {!user && searched.length === 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-700 text-sm font-bold">Masuk untuk lihat semua tiket</p>
              <p className="text-blue-500 text-xs mt-0.5">Login agar tiket kamu otomatis muncul di sini.</p>
              <Link href="/login">
                <button className="mt-2 flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
                  Masuk sekarang <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Memuat tiket…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-4 mb-4">
            <p className="text-red-600 text-sm font-bold">Gagal memuat</p>
            <p className="text-red-500 text-xs mt-0.5">{error}</p>
          </div>
        )}

        {/* Tickets */}
        {!loading && allTickets.length > 0 && (
          <div className="space-y-6">
            {allTickets.map(t => (
              <TicketRow
                key={t.order_code}
                ticket={t}
                onRemove={searched.some(s => s.order_code === t.order_code) && !tickets.some(tk => tk.order_code === t.order_code)
                  ? () => setSearched(prev => prev.filter(p => p.order_code !== t.order_code))
                  : undefined
                }
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && allTickets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
              style={{ background: "linear-gradient(135deg,#eff6ff,#e0e7ff)" }}>
              <Ticket className="h-10 w-10 text-indigo-300" />
            </div>
            <p className="font-black text-gray-800 text-base mb-1">Belum ada tiket</p>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Beli tiket event untuk melihatnya di sini.
            </p>
            <Link href="/event">
              <button className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md"
                style={{ background: "linear-gradient(135deg,#0194f3,#0172B1)" }}>
                Lihat Event
              </button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
