import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, FormActions } from "@/apps/admin/components/modal";
import { api } from "@/apps/admin/lib/api";
import { KeyRound, Plus, X, Loader2, Link2, AlertCircle } from "lucide-react";

type Row = Record<string, unknown>;
type ListingOption = { id: number; name: string };
type LinkedListing = { id: number; listing_type: string; listing_id: number; listing_name: string | null };

const empty = { username: "", password: "", business_name: "", contact_name: "", phone: "", category: "", active: true, mou_status: "dalam_proses" };

const MOU_STATUS_OPTIONS = [
  { value: "tidak_ada",    label: "Tidak Ada MoU" },
  { value: "dalam_proses", label: "Dalam Proses Penandatanganan" },
  { value: "aktif",        label: "MoU Aktif ✓" },
  { value: "berakhir",     label: "MoU Berakhir" },
];
const MOU_COLOR: Record<string, string> = {
  aktif:        "bg-emerald-100 text-emerald-700",
  dalam_proses: "bg-amber-100 text-amber-700",
  berakhir:     "bg-red-100 text-red-600",
  tidak_ada:    "bg-gray-100 text-gray-500",
};
const categories = ["Wisata", "Kuliner", "Penginapan", "Event", "Transportasi", "Lainnya"];
const LISTING_TYPES = [
  { value: "wisata",     label: "Wisata" },
  { value: "kuliner",    label: "Kuliner" },
  { value: "penginapan", label: "Penginapan" },
  { value: "event",      label: "Event" },
];
const TYPE_LABEL: Record<string, string> = { wisata: "Wisata", kuliner: "Kuliner", penginapan: "Penginapan", event: "Event" };
const TYPE_COLOR: Record<string, string> = {
  wisata:     "bg-sky-100 text-sky-700",
  kuliner:    "bg-orange-100 text-orange-700",
  penginapan: "bg-indigo-100 text-indigo-700",
  event:      "bg-violet-100 text-violet-700",
};

export default function MitraPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  // Multi-listing state (only relevant when editing an existing mitra)
  const [linkedListings, setLinkedListings] = useState<LinkedListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [addType, setAddType] = useState("");
  const [addId, setAddId] = useState("");
  const [addOptions, setAddOptions] = useState<ListingOption[]>([]);
  const [addOptionsLoading, setAddOptionsLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addBusy, setAddBusy] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const load = () => { setLoading(true); api.mitra.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  // Fetch listing options when addType changes (in edit modal)
  useEffect(() => {
    setAddId(""); setAddOptions([]);
    if (!addType) return;
    setAddOptionsLoading(true);
    api.mitra.listingOptions(addType).then(setAddOptions).finally(() => setAddOptionsLoading(false));
  }, [addType]);

  function openAdd() {
    setForm(empty);
    setLinkedListings([]);
    setAddType(""); setAddId(""); setAddError("");
    setModal({ open: true, editing: null });
  }

  function openEdit(row: Row) {
    setForm({
      username:      String(row.username ?? ""),
      password:      "",
      business_name: String(row.business_name ?? ""),
      contact_name:  String(row.contact_name ?? ""),
      phone:         String(row.phone ?? ""),
      category:      String(row.category ?? ""),
      active:        Boolean(row.active),
      mou_status:    String(row.mou_status ?? "dalam_proses"),
    });
    setAddType(""); setAddId(""); setAddError("");
    setModal({ open: true, editing: row });

    // Fetch current linked listings
    setListingsLoading(true);
    api.mitra.listings(Number(row.id))
      .then((ls: LinkedListing[]) => setLinkedListings(ls))
      .finally(() => setListingsLoading(false));
  }

  async function handleDelete(row: Row) { await api.mitra.delete(Number(row.id)); load(); }
  async function handleToggle(row: Row) { await api.mitra.toggleActive(Number(row.id)); load(); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const payload: Record<string, unknown> = { ...form };
      if (modal.editing && !form.password) delete payload.password;
      if (modal.editing) await api.mitra.update(Number(modal.editing.id), payload);
      else await api.mitra.create(payload);
      setModal({ open: false, editing: null }); load();
    } finally { setSaving(false); }
  }

  async function handleAddListing() {
    if (!addType || !addId || !modal.editing) return;
    setAddBusy(true); setAddError("");
    try {
      const link: LinkedListing = await api.mitra.addListing(Number(modal.editing.id), addType, Number(addId)) as LinkedListing;
      setLinkedListings(prev => [...prev, link]);
      setAddId(""); setAddType("");
      load(); // refresh table row
    } catch (err: any) {
      setAddError(err.message || "Gagal menambahkan listing");
    } finally { setAddBusy(false); }
  }

  async function handleRemoveListing(linkId: number) {
    if (!modal.editing) return;
    setRemovingId(linkId);
    try {
      await api.mitra.removeListing(Number(modal.editing.id), linkId);
      setLinkedListings(prev => prev.filter(l => l.id !== linkId));
      load(); // refresh table row
    } finally { setRemovingId(null); }
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const cols = [
    { key: "username", label: "ID / Username", render: (v: unknown) => <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-md">{String(v)}</span> },
    { key: "business_name", label: "Nama Usaha" },
    { key: "contact_name",  label: "Kontak" },
    { key: "phone",         label: "Telepon" },
    { key: "category",      label: "Kategori" },
    {
      key: "listings",
      label: "Usaha Tertaut",
      render: (_v: unknown, row: Row) => {
        const ls = (row.listings as LinkedListing[] | undefined) ?? [];
        if (ls.length === 0) return <span className="text-xs text-gray-400 italic">Belum ditautkan</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {ls.map(l => (
              <span key={l.id} className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLOR[l.listing_type] ?? "bg-gray-100 text-gray-600"}`}>
                {l.listing_name ?? `${TYPE_LABEL[l.listing_type] ?? l.listing_type} #${l.listing_id}`}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "active", label: "Status", render: (v: unknown, row: Row) => (
        <button onClick={() => handleToggle(row)} className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${v ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-red-100 text-red-500 hover:bg-red-200"}`}>
          {v ? "Aktif" : "Nonaktif"}
        </button>
      ),
    },
    {
      key: "mou_status", label: "MoU", render: (v: unknown) => {
        const val = String(v ?? "dalam_proses");
        const label = MOU_STATUS_OPTIONS.find(o => o.value === val)?.label ?? val;
        return <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${MOU_COLOR[val] ?? "bg-gray-100 text-gray-500"}`}>{label}</span>;
      }
    },
    { key: "last_login_at", label: "Login Terakhir", render: (v: unknown) => v ? new Date(String(v)).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "Belum pernah" },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Akun Mitra</h1>
        <p className="text-sm text-gray-500 mt-0.5">Akun mitra dibuat oleh admin — mitra tidak bisa mendaftar sendiri. Bagikan ID dan password ke mitra secara langsung.</p>
      </div>
      <ContentTable title="Daftar Akun Mitra" cols={cols} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} />

      <Modal title={modal.editing ? "Edit Akun Mitra" : "Buat Akun Mitra"} open={modal.open} onClose={() => setModal({ open: false, editing: null })} size="lg">
        <form onSubmit={handleSubmit}>
          {/* ── Info akun ── */}
          <div className="grid grid-cols-2 gap-x-4">
            <Field label="ID / Username" required>
              <input className={inputCls} value={form.username} onChange={f("username")} required placeholder="mis. mitra_saungkopi" autoComplete="off" />
            </Field>
            <Field label={modal.editing ? "Password Baru (opsional)" : "Password"} required={!modal.editing}>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  className={`${inputCls} pl-8`}
                  type="text"
                  value={form.password}
                  onChange={f("password")}
                  required={!modal.editing}
                  minLength={6}
                  placeholder={modal.editing ? "Kosongkan jika tidak diganti" : "Minimal 6 karakter"}
                  autoComplete="new-password"
                />
              </div>
            </Field>
            <div className="col-span-2">
              <Field label="Nama Usaha" required>
                <input className={inputCls} value={form.business_name} onChange={f("business_name")} required placeholder="Nama bisnis/usaha mitra..." />
              </Field>
            </div>
            <Field label="Nama Kontak">
              <input className={inputCls} value={form.contact_name} onChange={f("contact_name")} placeholder="Nama PIC / pemilik usaha..." />
            </Field>
            <Field label="Telepon">
              <input className={inputCls} value={form.phone} onChange={f("phone")} placeholder="08xxxxxxxxxx" />
            </Field>
            <Field label="Kategori">
              <select className={inputCls} value={form.category} onChange={f("category")}>
                <option value="">Pilih kategori...</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status MoU">
              <select className={inputCls} value={form.mou_status} onChange={f("mou_status")}>
                {MOU_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer mb-4">
            <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
            <span>Akun Aktif (bisa login)</span>
          </label>

          {/* ── Multi-listing section (edit only) ── */}
          {modal.editing && (
            <div className="border border-gray-100 rounded-xl p-4 mb-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-bold text-gray-800">Usaha Tertaut</p>
                <span className="text-xs text-gray-400 font-normal ml-1">— bisa lebih dari satu</span>
              </div>

              {/* Current linked listings */}
              {listingsLoading ? (
                <div className="flex items-center gap-2 text-gray-400 text-xs py-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Memuat...
                </div>
              ) : linkedListings.length === 0 ? (
                <p className="text-xs text-gray-400 italic mb-3">Belum ada usaha yang ditautkan.</p>
              ) : (
                <div className="flex flex-wrap gap-2 mb-3">
                  {linkedListings.map(link => (
                    <div key={link.id} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${TYPE_COLOR[link.listing_type] ?? "bg-gray-100 text-gray-600"}`}>
                      <span className="opacity-60 text-[10px] uppercase font-bold">{TYPE_LABEL[link.listing_type] ?? link.listing_type}</span>
                      <span>{link.listing_name ?? `#${link.listing_id}`}</span>
                      <button
                        type="button"
                        disabled={removingId === link.id}
                        onClick={() => handleRemoveListing(link.id)}
                        className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
                        title="Lepas tautan"
                      >
                        {removingId === link.id
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <X className="w-3 h-3" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add listing row */}
              <div className="flex gap-2 items-end flex-wrap">
                <div className="flex-1 min-w-[130px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tipe</label>
                  <select
                    className={`${inputCls} text-xs py-2`}
                    value={addType}
                    onChange={e => setAddType(e.target.value)}
                  >
                    <option value="">Pilih tipe...</option>
                    {LISTING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="flex-[2] min-w-[180px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Listing</label>
                  <select
                    className={`${inputCls} text-xs py-2`}
                    value={addId}
                    onChange={e => setAddId(e.target.value)}
                    disabled={!addType || addOptionsLoading}
                  >
                    <option value="">
                      {!addType ? "— pilih tipe dulu —" : addOptionsLoading ? "Memuat..." : "Pilih listing..."}
                    </option>
                    {addOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <button
                  type="button"
                  disabled={!addType || !addId || addBusy}
                  onClick={handleAddListing}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors whitespace-nowrap"
                >
                  {addBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Tambah
                </button>
              </div>

              {addError && (
                <div className="flex items-center gap-1.5 text-red-600 text-xs mt-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {addError}
                </div>
              )}
              <p className="text-[11px] text-gray-400 mt-2">
                Mitra hanya bisa mengelola listing yang sudah ada. Satu mitra dapat mengelola beberapa listing sekaligus.
              </p>
            </div>
          )}

          {/* Note for create mode */}
          {!modal.editing && (
            <p className="text-xs text-gray-400 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-4">
              💡 Setelah akun dibuat, edit kembali untuk menautkan satu atau lebih usaha ke mitra ini.
            </p>
          )}

          <FormActions onCancel={() => setModal({ open: false, editing: null })} loading={saving} />
        </form>
      </Modal>
    </>
  );
}
