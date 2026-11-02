import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, textareaCls, FormActions } from "@/apps/admin/components/modal";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;
const empty = { item: "", price: "", category: "Umum", description: "", sort_order: "0", active: true };
const categories = ["Wisata", "Penginapan", "Kuliner", "Transportasi", "Sewa Alat", "Event", "Layanan", "Umum"];

export default function PriceListPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.priceList.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    setForm({ item: String(row.item ?? ""), price: String(row.price ?? ""), category: String(row.category ?? "Umum"), description: String(row.description ?? ""), sort_order: String(row.sort_order ?? "0"), active: Boolean(row.active) });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) { await api.priceList.delete(Number(row.id)); load(); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, sort_order: parseInt(form.sort_order) };
      if (modal.editing) await api.priceList.update(Number(modal.editing.id), payload);
      else await api.priceList.create(payload);
      setModal({ open: false, editing: null }); load();
    } finally { setSaving(false); }
  }
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const cols = [
    { key: "sort_order", label: "#", render: (v: unknown) => <span className="text-gray-400 font-mono text-xs">{String(v)}</span> },
    { key: "item", label: "Item / Layanan" },
    { key: "price", label: "Harga", render: (v: unknown) => <span className="font-semibold text-green-700">{String(v)}</span> },
    { key: "category", label: "Kategori" },
    { key: "description", label: "Keterangan", render: (v: unknown) => <span className="text-gray-400 text-xs truncate block max-w-[150px]">{String(v) || "–"}</span> },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Daftar Harga</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola daftar harga layanan dan tiket</p>
      </div>
      <ContentTable title="Daftar Harga & Tarif" cols={cols} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} />
      <Modal title={modal.editing ? "Edit Harga" : "Tambah Item Harga"} open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="col-span-2"><Field label="Nama Item / Layanan" required><input className={inputCls} value={form.item} onChange={f("item")} required placeholder="Misal: Tiket Reguler Wisata Alam" /></Field></div>
            <Field label="Harga" required><input className={inputCls} value={form.price} onChange={f("price")} required placeholder="Rp 25.000 atau Hubungi Admin" /></Field>
            <Field label="Kategori"><select className={inputCls} value={form.category} onChange={f("category")}>{categories.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Urutan Tampil"><input className={inputCls} type="number" min="0" value={form.sort_order} onChange={f("sort_order")} /></Field>
            <div className="col-span-2"><Field label="Keterangan / Catatan"><textarea className={textareaCls} rows={2} value={form.description} onChange={f("description")} placeholder="Syarat dan info tambahan..." /></Field></div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer mb-1">
            <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" /><span>Tampilkan di Website</span>
          </label>
          <FormActions onCancel={() => setModal({ open: false, editing: null })} loading={saving} />
        </form>
      </Modal>
    </>
  );
}
