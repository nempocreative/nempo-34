import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, textareaCls, FormActions } from "@/apps/admin/components/modal";
import { ImageUpload } from "@/apps/admin/components/image-upload";
import { api } from "@/apps/admin/lib/api";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";

type Row = Record<string, unknown>;

/* ── Sub-types ── */
type GuestStar   = { name: string; role: string; note: string; photo: string };
type RSession    = { time: string; title: string; note: string };
type RundownDay  = { day: number; date: string; sessions: RSession[] };
type TransRoute  = { from: string; duration: string; icon: string; options: string[] };

type Ticket = {
  id?: number; name: string; description: string; price: number;
  quota: number; sold: number; sale_start: string; sale_end: string;
  sort_order: number; active: boolean;
};

type MenuItem = { name: string; price: number; note: string };

/* ── Defaults ── */
const EMPTY_GUEST: GuestStar  = { name: "", role: "", note: "", photo: "" };
const EMPTY_SESSION: RSession = { time: "", title: "", note: "" };
const EMPTY_DAY: RundownDay   = { day: 1, date: "", sessions: [{ ...EMPTY_SESSION }] };
const EMPTY_ROUTE: TransRoute = { from: "", duration: "", icon: "car", options: [""] };
const EMPTY_TICKET: Ticket    = { name: "", description: "", price: 0, quota: 100, sold: 0, sale_start: "", sale_end: "", sort_order: 0, active: true };
const EMPTY_MENU_ITEM: MenuItem = { name: "", price: 0, note: "" };

const CATEGORIES = ["Perlombaan", "Budaya", "Musik", "Olahraga", "Edukasi", "Kuliner", "Cafe", "Lainnya"];

/* ── Info form (flat fields) ── */
const emptyInfo = {
  name: "", title: "", category: "Perlombaan",
  date: "", date_end: "", time_start: "", time_end: "", location: "", image: "", banner_image: "", description: "",
  price: "0", organizer: "", organizer_ig: "", maps_url: "", visitors: "0",
  featured: false, active: true, allow_voucher: false, crew_active: false,
  service_fee_percent: "2",
};

/* ── Helper: parse JSON safely ── */
function pj<T>(val: unknown, fallback: T): T {
  if (!val || val === "null") return fallback;
  if (typeof val !== "string") {
    try { return val as T; } catch { return fallback; }
  }
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

/* ── Small helpers ── */
const btnSm  = "px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors";
const btnBlue = `${btnSm} bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100`;
const btnRed  = `${btnSm} bg-red-50 text-red-600 border-red-200 hover:bg-red-100`;

function SectionCard({ title, onAdd, children }: { title: string; onAdd?: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <p className="text-sm font-bold text-gray-800">{title}</p>
        {onAdd && (
          <button type="button" onClick={onAdd} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800">
            <Plus className="h-3.5 w-3.5" /> Tambah
          </button>
        )}
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

/* ── Ekstrak grup dari nama tiket (kata pertama kapital) ── */
function extractGroup(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length <= 1) return name;
  const known = ["VIP", "VVIP", "Reguler", "Regular", "Festival", "Tribune", "Gold", "Silver", "Platinum", "Diamond", "Bronze", "Free", "Gratis", "Umum", "Student", "Pelajar", "Online", "Offline"];
  for (const k of known) {
    if (name.toLowerCase().startsWith(k.toLowerCase())) return k.charAt(0).toUpperCase() + k.slice(1);
  }
  return words[0];
}
function extractPhase(name: string, group: string): string {
  const phase = name.slice(group.length).trim();
  return phase || name;
}

/* ── TicketTab Component ── */
const GROUP_STYLE: Record<string, { bg: string; border: string; badge: string; label: string; text: string }> = {
  VIP:      { bg: "bg-amber-50",   border: "border-amber-200",  badge: "bg-amber-100 text-amber-800",    label: "VIP",      text: "text-amber-700" },
  VVIP:     { bg: "bg-yellow-50",  border: "border-yellow-300", badge: "bg-yellow-100 text-yellow-900",  label: "VVIP",     text: "text-yellow-700" },
  Platinum: { bg: "bg-slate-50",   border: "border-slate-300",  badge: "bg-slate-200 text-slate-800",    label: "Platinum", text: "text-slate-700" },
  Gold:     { bg: "bg-yellow-50",  border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-800",  label: "Gold",     text: "text-yellow-700" },
  Silver:   { bg: "bg-gray-50",    border: "border-gray-300",   badge: "bg-gray-200 text-gray-700",      label: "Silver",   text: "text-gray-600"  },
  DEFAULT:  { bg: "bg-blue-50",    border: "border-blue-200",   badge: "bg-blue-100 text-blue-800",      label: "",         text: "text-blue-700"  },
};
function getGroupStyle(g: string) { return GROUP_STYLE[g] ?? GROUP_STYLE.DEFAULT; }

function TicketTab({
  editing, tickets, onAdd, onEdit, onDelete,
}: {
  editing: boolean;
  tickets: Ticket[];
  onAdd: () => void;
  onEdit: (t: Ticket) => void;
  onDelete: (t: Ticket) => void;
}) {
  const [showInactive, setShowInactive] = useState(false);

  if (!editing) return (
    <p className="text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
      Simpan event terlebih dahulu sebelum menambah kategori tiket.
    </p>
  );

  const active   = tickets.filter(t => t.active);
  const inactive = tickets.filter(t => !t.active);
  const shown    = showInactive ? tickets : active;

  /* group by prefix */
  const groupMap = new Map<string, Ticket[]>();
  [...shown].sort((a, b) => a.sort_order - b.sort_order).forEach(t => {
    const g = extractGroup(t.name);
    if (!groupMap.has(g)) groupMap.set(g, []);
    groupMap.get(g)!.push(t);
  });
  const groups = [...groupMap.entries()];

  /* totals across ALL active tickets */
  const totalQ = active.reduce((s, t) => s + t.quota, 0);
  const totalS = active.reduce((s, t) => s + t.sold, 0);
  const totalPct = totalQ > 0 ? Math.round((totalS / totalQ) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-gray-900">Kategori Tiket</p>
          <p className="text-xs text-gray-400">{active.length} aktif{inactive.length > 0 ? ` · ${inactive.length} nonaktif` : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          {inactive.length > 0 && (
            <button type="button" onClick={() => setShowInactive(p => !p)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${showInactive ? "bg-gray-200 text-gray-700 border-gray-300" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
              {showInactive ? "Sembunyikan" : `+${inactive.length} nonaktif`}
            </button>
          )}
          <button type="button" onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
            <Plus className="h-3.5 w-3.5" /> Tambah Tiket
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-2xl mb-1">🎟️</p>
          <p className="text-gray-500 text-sm font-semibold">Belum ada kategori tiket</p>
          <p className="text-gray-400 text-xs mt-0.5">Klik "Tambah Tiket" untuk mulai</p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map(([group, rows]) => {
            const gs   = getGroupStyle(group);
            const gQ   = rows.reduce((s, t) => s + t.quota, 0);
            const gS   = rows.reduce((s, t) => s + t.sold, 0);
            const gPct = gQ > 0 ? Math.round((gS / gQ) * 100) : 0;
            const barColor = gPct >= 90 ? "#ef4444" : gPct >= 60 ? "#f59e0b" : "#22c55e";

            return (
              <div key={group} className={`border rounded-2xl overflow-hidden ${gs.border}`}>
                {/* Group header */}
                <div className={`flex items-center justify-between px-4 py-2.5 ${gs.bg} border-b ${gs.border}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide ${gs.badge}`}>{group}</span>
                    <span className="text-xs text-gray-500 font-medium">{rows.length} fase</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span><span className="font-bold text-gray-800">{gS.toLocaleString("id")}</span>/{gQ.toLocaleString("id")} terjual</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${gPct}%`, background: barColor }} />
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: barColor }}>{gPct}%</span>
                    </div>
                  </div>
                </div>

                {/* Fase rows */}
                <div className="divide-y divide-gray-100 bg-white">
                  {rows.map(t => {
                    const sisa = t.quota - t.sold;
                    const pct  = t.quota > 0 ? Math.min(100, Math.round((t.sold / t.quota) * 100)) : 0;
                    const bar  = pct >= 90 ? "#ef4444" : pct >= 60 ? "#f59e0b" : "#22c55e";
                    const sisaCls = sisa <= 0 ? "text-red-600" : sisa <= t.quota * 0.1 ? "text-amber-600" : "text-emerald-600";
                    const phase = extractPhase(t.name, group);

                    return (
                      <div key={t.id} className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${!t.active ? "opacity-40" : ""}`}>
                        {/* Phase name */}
                        <div className="w-28 shrink-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{phase}</p>
                          {(t.sale_start || t.sale_end) && (
                            <p className="text-[10px] text-gray-400 leading-tight">
                              {t.sale_start?.substring(0, 10)}{t.sale_end ? ` – ${t.sale_end.substring(0, 10)}` : ""}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="w-24 shrink-0">
                          <p className={`text-sm font-extrabold ${t.price === 0 ? "text-emerald-600" : "text-gray-900"}`}>
                            {t.price === 0 ? "GRATIS" : `Rp ${Number(t.price).toLocaleString("id")}`}
                          </p>
                        </div>

                        {/* Bar + stats */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                            <span><span className="font-bold text-gray-800">{t.sold.toLocaleString("id")}</span>/{t.quota.toLocaleString("id")}</span>
                            <span className={`font-bold ${sisaCls}`}>sisa {sisa.toLocaleString("id")}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: bar }} />
                          </div>
                        </div>

                        {/* Status */}
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${t.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                          {t.active ? "Aktif" : "Off"}
                        </span>

                        {/* Actions */}
                        <div className="flex gap-1 shrink-0">
                          <button type="button" onClick={() => onEdit(t)} className={btnBlue}>Edit</button>
                          <button type="button" onClick={() => onDelete(t)} className={btnRed}>Hapus</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Grand total */}
          {active.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Total keseluruhan</span>
              <span>
                <span className="font-bold text-gray-900">{totalS.toLocaleString("id")}</span>/{totalQ.toLocaleString("id")} terjual
                <span className="ml-2 font-bold" style={{ color: totalPct >= 90 ? "#ef4444" : totalPct >= 60 ? "#f59e0b" : "#22c55e" }}>({totalPct}%)</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════ */
export default function EventsPage() {
  const [data, setData]     = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [info, setInfo]     = useState<typeof emptyInfo>(emptyInfo);
  const [guestStars, setGuestStars]   = useState<GuestStar[]>([]);
  const [rundown, setRundown]         = useState<RundownDay[]>([]);
  const [prohibited, setProhibited]   = useState<string[]>([]);
  const [transport, setTransport]     = useState<TransRoute[]>([]);
  const [saving, setSaving]           = useState(false);
  const [activeTab, setActiveTab]     = useState<"info" | "detail" | "tiket">("info");

  const [menuItems, setMenuItems]   = useState<MenuItem[]>([]);
  const [paymentInfo, setPaymentInfo] = useState({ bank_name: "", bank_account_no: "", bank_account_name: "", qr_image: "" });

  const [tickets, setTickets]   = useState<Ticket[]>([]);
  const [tModal, setTModal]     = useState<{ open: boolean; editing: Ticket | null }>({ open: false, editing: null });
  const [tForm, setTForm]       = useState<Ticket>(EMPTY_TICKET);
  const [savingT, setSavingT]   = useState(false);

  const load = () => { setLoading(true); api.events.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  async function loadTickets(id: number) {
    const rows = await api.eventTickets.list(id) as Ticket[];
    setTickets(rows);
  }

  function openAdd() {
    setInfo(emptyInfo); setGuestStars([]); setRundown([]); setProhibited([]); setTransport([]);
    setMenuItems([]); setPaymentInfo({ bank_name: "", bank_account_no: "", bank_account_name: "", qr_image: "" }); setTickets([]); setActiveTab("info");
    setModal({ open: true, editing: null });
  }

  function openEdit(row: Row) {
    setInfo({
      name: String(row.name ?? ""), title: String(row.title ?? ""),
      category: String(row.category ?? "Perlombaan"),
      date: row.date ? String(row.date).substring(0, 10) : "",
      date_end: row.date_end ? String(row.date_end).substring(0, 10) : "",
      time_start: String(row.time_start ?? ""), time_end: String(row.time_end ?? ""),
      location: String(row.location ?? ""), image: String(row.image ?? ""),
      banner_image: String(row.banner_image ?? ""),
      description: String(row.description ?? ""), price: String(row.price ?? "0"),
      organizer: String(row.organizer ?? ""), organizer_ig: String(row.organizer_ig ?? ""),
      maps_url: String(row.maps_url ?? ""), visitors: String(row.visitors ?? "0"),
      featured: Boolean(row.featured), active: Boolean(row.active), allow_voucher: Boolean(row.allow_voucher),
      crew_active: Boolean(row.crew_active),
      service_fee_percent: String(row.service_fee_percent ?? "2"),
    });
    setGuestStars(pj<GuestStar[]>(row.guest_stars, []));
    setRundown(pj<RundownDay[]>(row.rundown, []));
    setProhibited(pj<string[]>(row.prohibited_items, []));
    setTransport(pj<TransRoute[]>(row.transportation_info, []));
    setMenuItems(pj<MenuItem[]>(row.menu_items, []));
    const pi = pj<{ bank_name?: string; bank_account_no?: string; bank_account_name?: string; qr_image?: string }>(row.payment_info, {});
    setPaymentInfo({ bank_name: pi.bank_name ?? "", bank_account_no: pi.bank_account_no ?? "", bank_account_name: pi.bank_account_name ?? "", qr_image: pi.qr_image ?? "" });
    setActiveTab("info");
    setModal({ open: true, editing: row });
    if (row.id) loadTickets(Number(row.id));
  }

  async function handleDelete(row: Row) { await api.events.delete(Number(row.id)); load(); }
  async function handleBulkDelete(ids: number[]) { await api.events.bulkDelete(ids); load(); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...info, price: parseInt(info.price), visitors: parseInt(info.visitors) || 0,
        service_fee_percent: parseFloat(info.service_fee_percent) || 0,
        guest_stars: guestStars,
        prohibited_items: prohibited.filter(s => s.trim()),
        rundown,
        transportation_info: transport,
        menu_items: menuItems.filter(m => m.name.trim()),
        payment_info: paymentInfo.bank_account_no.trim() || paymentInfo.qr_image.trim() ? paymentInfo : {},
      };
      if (modal.editing) await api.events.update(Number(modal.editing.id), payload);
      else await api.events.create(payload);
      setModal({ open: false, editing: null });
      load();
    } finally { setSaving(false); }
  }

  /* ── Guest Star helpers ── */
  const addGuest = () => setGuestStars(p => [...p, { ...EMPTY_GUEST }]);
  const delGuest = (i: number) => setGuestStars(p => p.filter((_, j) => j !== i));
  const setGuest = (i: number, k: keyof GuestStar, v: string) =>
    setGuestStars(p => p.map((g, j) => j === i ? { ...g, [k]: v } : g));

  /* ── Rundown helpers ── */
  const addDay     = () => setRundown(p => [...p, { ...EMPTY_DAY, day: p.length + 1 }]);
  const delDay     = (i: number) => setRundown(p => p.filter((_, j) => j !== i));
  const setDay     = (i: number, k: keyof Omit<RundownDay, "sessions">, v: string | number) =>
    setRundown(p => p.map((d, j) => j === i ? { ...d, [k]: v } : d));
  const addSession = (di: number) =>
    setRundown(p => p.map((d, j) => j === di ? { ...d, sessions: [...d.sessions, { ...EMPTY_SESSION }] } : d));
  const delSession = (di: number, si: number) =>
    setRundown(p => p.map((d, j) => j === di ? { ...d, sessions: d.sessions.filter((_, k) => k !== si) } : d));
  const setSes     = (di: number, si: number, k: keyof RSession, v: string) =>
    setRundown(p => p.map((d, j) => j === di ? {
      ...d, sessions: d.sessions.map((s, k2) => k2 === si ? { ...s, [k]: v } : s)
    } : d));

  /* ── Prohibited helpers ── */
  const addProhibited = () => setProhibited(p => [...p, ""]);
  const setProhibitedItem = (i: number, v: string) => setProhibited(p => p.map((s, j) => j === i ? v : s));
  const delProhibited = (i: number) => setProhibited(p => p.filter((_, j) => j !== i));

  /* ── Transport helpers ── */
  const addRoute      = () => setTransport(p => [...p, { ...EMPTY_ROUTE }]);
  const delRoute      = (i: number) => setTransport(p => p.filter((_, j) => j !== i));
  const setRoute      = (i: number, k: keyof Omit<TransRoute, "options">, v: string) =>
    setTransport(p => p.map((r, j) => j === i ? { ...r, [k]: v } : r));
  const addOption     = (ri: number) =>
    setTransport(p => p.map((r, j) => j === ri ? { ...r, options: [...r.options, ""] } : r));
  const setOption     = (ri: number, oi: number, v: string) =>
    setTransport(p => p.map((r, j) => j === ri ? {
      ...r, options: r.options.map((o, k) => k === oi ? v : o)
    } : r));
  const delOption     = (ri: number, oi: number) =>
    setTransport(p => p.map((r, j) => j === ri ? { ...r, options: r.options.filter((_, k) => k !== oi) } : r));

  /* ── Menu Item helpers ── */
  const addMenuItem    = () => setMenuItems(p => [...p, { ...EMPTY_MENU_ITEM }]);
  const delMenuItem    = (i: number) => setMenuItems(p => p.filter((_, j) => j !== i));
  const setMenuItem    = (i: number, k: keyof MenuItem, v: string | number) =>
    setMenuItems(p => p.map((m, j) => j === i ? { ...m, [k]: v } : m));

  /* ── Ticket helpers ── */
  function openAddTicket() { setTForm(EMPTY_TICKET); setTModal({ open: true, editing: null }); }
  function openEditTicket(t: Ticket) {
    setTForm({ ...t, sale_start: t.sale_start?.substring(0, 10) ?? "", sale_end: t.sale_end?.substring(0, 10) ?? "" });
    setTModal({ open: true, editing: t });
  }
  async function handleTicketSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!modal.editing?.id) return;
    setSavingT(true);
    try {
      if (tModal.editing?.id) await api.eventTickets.update(Number(tModal.editing.id), tForm);
      else await api.eventTickets.create(Number(modal.editing.id), tForm);
      setTModal({ open: false, editing: null });
      await loadTickets(Number(modal.editing.id));
    } finally { setSavingT(false); }
  }
  async function handleDeleteTicket(t: Ticket) {
    if (!t.id || !modal.editing?.id) return;
    if (!confirm(`Hapus tiket "${t.name}"?`)) return;
    await api.eventTickets.delete(Number(t.id));
    await loadTickets(Number(modal.editing.id));
  }

  const TABS = [
    { id: "info",   label: "Info Utama" },
    { id: "detail", label: "Konten & Detail" },
    { id: "tiket",  label: `Tiket${tickets.length ? ` (${tickets.length})` : ""}` },
  ] as const;

  /* ── Table columns ── */
  const cols = [
    {
      key: "image", label: "Poster",
      render: (v: unknown) => v
        ? <img src={String(v)} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" onError={e => { e.currentTarget.style.display = "none"; }} />
        : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">–</div>,
    },
    {
      key: "name", label: "Nama Event",
      render: (v: unknown, row: Row) => (
        <div>
          <p className="font-semibold text-gray-900 text-sm">{String(v)}</p>
          {Boolean(row.title) && String(row.title) !== String(v) && <p className="text-gray-400 text-xs">{String(row.title)}</p>}
        </div>
      ),
    },
    {
      key: "category", label: "Kategori",
      render: (v: unknown) => {
        const chip: Record<string, string> = {
          Perlombaan: "bg-red-100 text-red-700", Budaya: "bg-violet-100 text-violet-700",
          Musik: "bg-pink-100 text-pink-700", Olahraga: "bg-emerald-100 text-emerald-700",
          Edukasi: "bg-blue-100 text-blue-700", Kuliner: "bg-amber-100 text-amber-700",
        };
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${chip[String(v)] ?? "bg-gray-100 text-gray-600"}`}>{String(v)}</span>;
      },
    },
    {
      key: "date", label: "Tanggal",
      render: (v: unknown) => v ? new Date(String(v)).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "–",
    },
    { key: "location", label: "Lokasi" },
    {
      key: "price", label: "Harga",
      render: (v: unknown) => Number(v) === 0
        ? <span className="text-green-600 font-medium text-xs">GRATIS</span>
        : <span className="text-xs">Rp {Number(v).toLocaleString("id")}</span>,
    },
    { key: "organizer", label: "Penyelenggara" },
    {
      key: "featured", label: "Unggulan",
      render: (v: unknown) => v ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">⭐ Ya</span> : <span className="text-gray-300 text-xs">–</span>,
    },
    {
      key: "active", label: "Status",
      render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span>,
    },
  ];

  /* ═══════════════════════════════════════════ RENDER ═══ */
  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Event</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola event dan acara di Jawa Barat</p>
      </div>

      <ContentTable title="Daftar Event" cols={cols} data={data} loading={loading}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} onBulkDelete={handleBulkDelete} />

      {/* ══════════ Modal Event ══════════ */}
      <Modal
        title={modal.editing ? `Edit Event — ${String(modal.editing.name ?? "")}` : "Tambah Event"}
        open={modal.open} onClose={() => setModal({ open: false, editing: null })}
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-5 -mx-6 px-6">
          {TABS.map(tab => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>

          {/* ─── TAB: INFO UTAMA ─── */}
          {activeTab === "info" && (
            <div className="grid grid-cols-2 gap-x-4">
              <div className="col-span-1">
                <Field label="Poster / Foto Event">
                  <ImageUpload value={info.image} onChange={url => setInfo(p => ({ ...p, image: url }))} />
                  <p className="text-[11px] text-gray-400 mt-1">Dipakai di halaman detail event</p>
                </Field>
              </div>
              <div className="col-span-1">
                <Field label="Banner Upcoming (Homepage)">
                  <ImageUpload value={info.banner_image} onChange={url => setInfo(p => ({ ...p, banner_image: url }))} />
                  <p className="text-[11px] text-gray-400 mt-1">Dipakai di kartu carousel homepage. Rasio 9:16 (portrait). Jika kosong, pakai Poster.</p>
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Nama Event" required>
                  <input className={inputCls} value={info.name} onChange={e => setInfo(p => ({ ...p, name: e.target.value }))} required placeholder="cth: Temu Tarung Vol. 2" />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Judul Panjang (untuk banner — opsional)">
                  <input className={inputCls} value={info.title} onChange={e => setInfo(p => ({ ...p, title: e.target.value }))} placeholder="Judul lengkap yang ditampilkan di banner unggulan" />
                </Field>
              </div>
              <Field label="Kategori">
                <select className={inputCls} value={info.category} onChange={e => setInfo(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <div className="col-span-1" />
              <Field label="Tanggal Mulai">
                <input className={inputCls} type="date" value={info.date} onChange={e => setInfo(p => ({ ...p, date: e.target.value }))} />
              </Field>
              <Field label="Tanggal Selesai (kosongkan jika 1 hari)">
                <input className={inputCls} type="date" value={info.date_end} onChange={e => setInfo(p => ({ ...p, date_end: e.target.value }))}
                  min={info.date} />
              </Field>
              {info.date && info.date_end && info.date !== info.date_end && (
                <div className="col-span-2 -mt-2">
                  <p className="text-xs text-blue-600 font-medium bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                    📅 Event berlangsung {Math.ceil((new Date(info.date_end).getTime() - new Date(info.date).getTime()) / 86400000) + 1} hari:&nbsp;
                    {new Date(info.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} –&nbsp;
                    {new Date(info.date_end).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              )}
              <Field label="Jam Mulai (opsional)">
                <input className={inputCls} type="time" value={info.time_start}
                  onChange={e => setInfo(p => ({ ...p, time_start: e.target.value }))} />
              </Field>
              <Field label="Jam Selesai (opsional)">
                <input className={inputCls} type="time" value={info.time_end}
                  onChange={e => setInfo(p => ({ ...p, time_end: e.target.value }))} />
              </Field>
              <div className="col-span-2">
                <Field label="Lokasi / Venue" required>
                  <input className={inputCls} value={info.location} onChange={e => setInfo(p => ({ ...p, location: e.target.value }))} required placeholder="Nama venue atau alamat lengkap..." />
                </Field>
              </div>
              <Field label="Penyelenggara">
                <input className={inputCls} value={info.organizer} onChange={e => setInfo(p => ({ ...p, organizer: e.target.value }))} placeholder="Nama EO / komunitas" />
              </Field>
              <Field label="Instagram Penyelenggara">
                <input className={inputCls} value={info.organizer_ig} onChange={e => setInfo(p => ({ ...p, organizer_ig: e.target.value }))} placeholder="@namaakun" />
              </Field>
              <Field label="Jumlah Pengunjung (aktual setelah selesai)">
                <input className={inputCls} type="number" min="0" value={info.visitors} onChange={e => setInfo(p => ({ ...p, visitors: e.target.value }))} placeholder="0" />
              </Field>
              <Field label="Harga Tiket Mulai (Rp) — 0 = Gratis">
                <input className={inputCls} type="number" min="0" value={info.price} onChange={e => setInfo(p => ({ ...p, price: e.target.value }))} />
              </Field>
              <Field label="Biaya Layanan (%)">
                <div className="relative">
                  <input
                    className={inputCls}
                    type="number" min="0" max="100" step="0.5"
                    value={info.service_fee_percent}
                    onChange={e => setInfo(p => ({ ...p, service_fee_percent: e.target.value }))}
                    placeholder="2"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Isi 0 untuk tidak ada biaya layanan. Default: 2%</p>
              </Field>
              <div className="col-span-2">
                <Field label="URL Google Maps Embed">
                  <input className={inputCls} value={info.maps_url} onChange={e => setInfo(p => ({ ...p, maps_url: e.target.value }))} placeholder="https://maps.google.com/maps?q=...&output=embed" />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Deskripsi Event">
                  <textarea className={textareaCls} rows={4} value={info.description} onChange={e => setInfo(p => ({ ...p, description: e.target.value }))} placeholder="Informasi lengkap tentang event..." />
                </Field>
              </div>
              <div className="col-span-2 flex flex-wrap gap-5 mt-1">
                {[
                  { key: "featured" as const, label: "⭐ Featured / Unggulan" },
                  { key: "active" as const, label: "Tampilkan di Website" },
                  { key: "allow_voucher" as const, label: "Izinkan Voucher" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={info[key] as boolean}
                      onChange={e => setInfo(p => ({ ...p, [key]: e.target.checked }))}
                      className="w-4 h-4 rounded accent-blue-600" />
                    {label}
                  </label>
                ))}
              </div>

              {/* Crew active — baris sendiri karena label panjang + keterangan khusus */}
              <div className="col-span-2 border border-blue-100 bg-blue-50/40 rounded-xl px-4 py-3 flex flex-col gap-1">
                <label className="flex items-center gap-2 text-sm font-semibold text-blue-900 cursor-pointer">
                  <input type="checkbox" checked={info.crew_active}
                    onChange={e => setInfo(p => ({ ...p, crew_active: e.target.checked }))}
                    className="w-4 h-4 rounded accent-blue-600" />
                  🎫 Event Aktif untuk Crew / Tiketing
                </label>
                <p className="text-xs text-blue-600 leading-relaxed pl-6">
                  Menentukan event mana yang dipakai halaman scan/OTS tim di lokasi. Hanya boleh satu event aktif pada satu waktu — mengaktifkan ini akan menonaktifkan event lain.
                </p>
              </div>

              {/* ── Pembayaran Penyelenggara ── */}
              <div className="col-span-2">
                <div className="border border-amber-200 rounded-xl overflow-hidden bg-amber-50/30">
                  <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
                    <p className="text-sm font-bold text-amber-900">💳 Info Pembayaran Penyelenggara</p>
                    <p className="text-xs text-amber-600 mt-0.5">Isi rekening & QR milik penyelenggara. Jika kosong, digunakan rekening platform default.</p>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <Field label="Nama Bank">
                      <input className={inputCls} value={paymentInfo.bank_name}
                        onChange={e => setPaymentInfo(p => ({ ...p, bank_name: e.target.value }))}
                        placeholder="cth: BCA, Mandiri, BRI, QRIS..." />
                    </Field>
                    <Field label="No. Rekening / Virtual Account">
                      <input className={inputCls} value={paymentInfo.bank_account_no}
                        onChange={e => setPaymentInfo(p => ({ ...p, bank_account_no: e.target.value }))}
                        placeholder="cth: 1234567890" />
                    </Field>
                    <div className="col-span-2">
                      <Field label="Atas Nama">
                        <input className={inputCls} value={paymentInfo.bank_account_name}
                          onChange={e => setPaymentInfo(p => ({ ...p, bank_account_name: e.target.value }))}
                          placeholder="Nama pemilik rekening sesuai buku tabungan" />
                      </Field>
                    </div>
                    <div className="col-span-2">
                      <Field label="Foto QR Code (opsional — QRIS / GoPay / OVO / dll)">
                        <ImageUpload value={paymentInfo.qr_image}
                          onChange={url => setPaymentInfo(p => ({ ...p, qr_image: url }))} />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB: KONTEN & DETAIL ─── */}
          {activeTab === "detail" && (
            <div className="space-y-5">

              {/* ── Bintang Tamu ── */}
              <SectionCard title={`Bintang Tamu (${guestStars.length})`} onAdd={addGuest}>
                {guestStars.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-2">Belum ada bintang tamu. Klik "Tambah" untuk menambah.</p>
                )}
                {guestStars.map((g, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Bintang Tamu #{i + 1}</p>
                      <button type="button" onClick={() => delGuest(i)} className={btnRed}>
                        <Trash2 className="h-3 w-3 inline mr-1" />Hapus
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Nama">
                        <input className={inputCls} value={g.name} onChange={e => setGuest(i, "name", e.target.value)} placeholder="Nama artis / tamu" />
                      </Field>
                      <Field label="Peran / Role">
                        <input className={inputCls} value={g.role} onChange={e => setGuest(i, "role", e.target.value)} placeholder="cth: Penyanyi, MC, Juri" />
                      </Field>
                      <div className="col-span-2">
                        <Field label="Keterangan (opsional)">
                          <input className={inputCls} value={g.note} onChange={e => setGuest(i, "note", e.target.value)} placeholder="Info singkat tentang tamu..." />
                        </Field>
                      </div>
                      <div className="col-span-2">
                        <Field label="Foto">
                          <ImageUpload value={g.photo} onChange={url => setGuest(i, "photo", url)} />
                        </Field>
                      </div>
                    </div>
                  </div>
                ))}
              </SectionCard>

              {/* ── Rundown Acara ── */}
              <SectionCard title={`Rundown Acara (${rundown.length} hari)`} onAdd={addDay}>
                {rundown.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-2">Belum ada rundown. Klik "Tambah" untuk menambah hari.</p>
                )}
                {rundown.map((day, di) => (
                  <div key={di} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Day header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <Field label="Hari ke-">
                          <input className={inputCls} type="number" min="1" value={day.day}
                            onChange={e => setDay(di, "day", Number(e.target.value))} />
                        </Field>
                        <Field label="Tanggal / Keterangan">
                          <input className={inputCls} value={day.date}
                            onChange={e => setDay(di, "date", e.target.value)}
                            placeholder="cth: Sabtu, 21 Juni 2025" />
                        </Field>
                      </div>
                      <button type="button" onClick={() => delDay(di)} className={`${btnRed} self-end mb-0.5`}>
                        <Trash2 className="h-3 w-3 inline mr-1" />Hapus Hari
                      </button>
                    </div>

                    {/* Sessions */}
                    <div className="p-4 space-y-2">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sesi ({day.sessions.length})</p>
                      {day.sessions.map((s, si) => (
                        <div key={si} className="flex items-start gap-2 border border-gray-100 rounded-lg p-3 bg-white">
                          <GripVertical className="h-4 w-4 text-gray-300 shrink-0 mt-2" />
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            <Field label="Waktu">
                              <input className={inputCls} value={s.time} onChange={e => setSes(di, si, "time", e.target.value)} placeholder="08:00" />
                            </Field>
                            <Field label="Judul Sesi">
                              <input className={inputCls} value={s.title} onChange={e => setSes(di, si, "title", e.target.value)} placeholder="Registrasi Peserta" />
                            </Field>
                            <Field label="Catatan (opsional)">
                              <input className={inputCls} value={s.note} onChange={e => setSes(di, si, "note", e.target.value)} placeholder="keterangan singkat" />
                            </Field>
                          </div>
                          <button type="button" onClick={() => delSession(di, si)} className="text-red-400 hover:text-red-600 p-1 mt-1 shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addSession(di)} className={`${btnBlue} mt-1`}>
                        <Plus className="h-3 w-3 inline mr-1" />Tambah Sesi
                      </button>
                    </div>
                  </div>
                ))}
              </SectionCard>

              {/* ── Menu Promo (khusus Cafe) ── */}
              {info.category === "Cafe" && (
                <SectionCard title={`Menu & Paket Promo (${menuItems.filter(m => m.name.trim()).length} item)`} onAdd={addMenuItem}>
                  {menuItems.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-2">Belum ada menu. Klik "Tambah" untuk menambah menu atau paket promo.</p>
                  )}
                  {menuItems.map((m, i) => (
                    <div key={i} className="border border-amber-100 rounded-xl p-4 bg-amber-50/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Menu #{i + 1}</p>
                        <button type="button" onClick={() => delMenuItem(i)} className={btnRed}>
                          <Trash2 className="h-3 w-3 inline mr-1" />Hapus
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <Field label="Nama Menu / Paket" required>
                            <input className={inputCls} value={m.name}
                              onChange={e => setMenuItem(i, "name", e.target.value)}
                              placeholder="cth: Paket Nobar, Kopi + Snack, All You Can Eat..." />
                          </Field>
                        </div>
                        <Field label="Harga (Rp)">
                          <input className={inputCls} type="number" min="0" value={m.price}
                            onChange={e => setMenuItem(i, "price", parseInt(e.target.value) || 0)}
                            placeholder="0 = Gratis" />
                        </Field>
                        <div className="col-span-3">
                          <Field label="Keterangan singkat (opsional)">
                            <input className={inputCls} value={m.note}
                              onChange={e => setMenuItem(i, "note", e.target.value)}
                              placeholder="cth: Sudah termasuk 1 gelas kopi & 1 snack ringan" />
                          </Field>
                        </div>
                      </div>
                    </div>
                  ))}
                </SectionCard>
              )}

              {/* ── Barang Terlarang ── */}
              <SectionCard title={`Barang Terlarang (${prohibited.filter(s => s.trim()).length} item)`} onAdd={addProhibited}>
                {prohibited.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-2">Belum ada daftar larangan. Klik "Tambah".</p>
                )}
                {prohibited.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-red-400 font-bold text-sm shrink-0">✕</span>
                    <input
                      className={`${inputCls} flex-1`}
                      value={item}
                      onChange={e => setProhibitedItem(i, e.target.value)}
                      placeholder="cth: Senjata tajam, Minuman keras..."
                    />
                    <button type="button" onClick={() => delProhibited(i)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </SectionCard>

              {/* ── Transportasi ── */}
              <SectionCard title={`Info Transportasi (${transport.length} rute)`} onAdd={addRoute}>
                {transport.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-2">Belum ada info transportasi. Klik "Tambah".</p>
                )}
                {transport.map((r, ri) => (
                  <div key={ri} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Rute #{ri + 1}</p>
                      <button type="button" onClick={() => delRoute(ri)} className={btnRed}>
                        <Trash2 className="h-3 w-3 inline mr-1" />Hapus
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Field label="Dari (asal)">
                        <input className={inputCls} value={r.from} onChange={e => setRoute(ri, "from", e.target.value)} placeholder="Bandung" />
                      </Field>
                      <Field label="Estimasi Waktu">
                        <input className={inputCls} value={r.duration} onChange={e => setRoute(ri, "duration", e.target.value)} placeholder="±2 jam" />
                      </Field>
                      <Field label="Ikon">
                        <select className={inputCls} value={r.icon} onChange={e => setRoute(ri, "icon", e.target.value)}>
                          <option value="car">🚗 Mobil/Motor</option>
                          <option value="train">🚆 Kereta</option>
                          <option value="local">🚌 Angkutan Umum</option>
                        </select>
                      </Field>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">Pilihan Rute / Opsi:</p>
                      <div className="space-y-1.5">
                        {r.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <span className="text-gray-300 text-sm">·</span>
                            <input className={`${inputCls} flex-1`} value={opt}
                              onChange={e => setOption(ri, oi, e.target.value)}
                              placeholder="cth: Via Tol Cipularang, turun pintu keluar Garut" />
                            <button type="button" onClick={() => delOption(ri, oi)} className="text-red-400 hover:text-red-600 p-1">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addOption(ri)} className={`${btnBlue} mt-1`}>
                          <Plus className="h-3 w-3 inline mr-1" />Tambah Opsi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </SectionCard>

            </div>
          )}

          {/* ─── TAB: TIKET ─── */}
          {activeTab === "tiket" && (
            <TicketTab
              editing={!!modal.editing}
              tickets={tickets}
              onAdd={openAddTicket}
              onEdit={openEditTicket}
              onDelete={handleDeleteTicket}
            />
          )}

          {activeTab !== "tiket" && <FormActions onCancel={() => setModal({ open: false, editing: null })} loading={saving} />}
          {activeTab === "tiket" && (
            <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setModal({ open: false, editing: null })} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100">Tutup</button>
            </div>
          )}
        </form>
      </Modal>

      {/* ══════════ Modal Tiket ══════════ */}
      <Modal
        title={tModal.editing ? `Edit Tiket — ${tModal.editing.name}` : "Tambah Kategori Tiket"}
        open={tModal.open} onClose={() => setTModal({ open: false, editing: null })}
      >
        <form onSubmit={handleTicketSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="col-span-2">
              <Field label="Nama Kategori Tiket" required>
                <input className={inputCls} value={tForm.name} onChange={e => setTForm(p => ({ ...p, name: e.target.value }))} required placeholder="cth: VIP Early Bird, Reguler Presale 2, OTS..." />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Deskripsi (opsional)">
                <input className={inputCls} value={tForm.description} onChange={e => setTForm(p => ({ ...p, description: e.target.value }))} placeholder="Benefit atau keterangan tiket..." />
              </Field>
            </div>
            <Field label="Harga (Rp) — 0 = Gratis">
              <input className={inputCls} type="number" min="0" value={tForm.price} onChange={e => setTForm(p => ({ ...p, price: Number(e.target.value) }))} />
            </Field>
            <Field label="Kuota Total">
              <input className={inputCls} type="number" min="0" value={tForm.quota} onChange={e => setTForm(p => ({ ...p, quota: Number(e.target.value) }))} />
            </Field>
            <Field label="Sudah Terjual">
              <input className={inputCls} type="number" min="0" value={tForm.sold} onChange={e => setTForm(p => ({ ...p, sold: Number(e.target.value) }))} />
            </Field>
            <Field label="Urutan Tampil">
              <input className={inputCls} type="number" min="0" value={tForm.sort_order} onChange={e => setTForm(p => ({ ...p, sort_order: Number(e.target.value) }))} />
            </Field>
            <Field label="Mulai Penjualan">
              <input className={inputCls} type="date" value={tForm.sale_start} onChange={e => setTForm(p => ({ ...p, sale_start: e.target.value }))} />
            </Field>
            <Field label="Akhir Penjualan">
              <input className={inputCls} type="date" value={tForm.sale_end} onChange={e => setTForm(p => ({ ...p, sale_end: e.target.value }))} />
            </Field>
          </div>
          <div className="flex items-center gap-2 mt-2 mb-4">
            <input type="checkbox" id="tActive" checked={tForm.active} onChange={e => setTForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
            <label htmlFor="tActive" className="text-sm text-gray-700 cursor-pointer">Aktif (tampil di website)</label>
          </div>
          {tForm.quota > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 flex gap-6 text-sm">
              <div><p className="text-gray-400 text-[10px] font-bold uppercase">Kuota</p><p className="font-bold text-gray-900">{tForm.quota}</p></div>
              <div><p className="text-gray-400 text-[10px] font-bold uppercase">Terjual</p><p className="font-bold text-gray-900">{tForm.sold}</p></div>
              <div><p className="text-gray-400 text-[10px] font-bold uppercase">Sisa</p>
                <p className={`font-bold ${tForm.quota - tForm.sold <= 0 ? "text-red-600" : "text-emerald-600"}`}>{tForm.quota - tForm.sold}</p>
              </div>
            </div>
          )}
          <FormActions onCancel={() => setTModal({ open: false, editing: null })} loading={savingT} />
        </form>
      </Modal>
    </>
  );
}
