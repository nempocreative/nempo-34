import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, textareaCls, FormActions } from "@/apps/admin/components/modal";
import { ImageUpload } from "@/apps/admin/components/image-upload";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;
const empty = { title: "", description: "", price: "", category: "Website", image: "", whatsapp: "", featured: false, active: true };
const categories = ["Website", "Aplikasi", "Desain", "Media Sosial", "Kasir Digital", "Reservasi", "Konsultasi", "Lainnya"];

export default function DigitalServicesPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.digitalServices.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    setForm({ title: String(row.title ?? ""), description: String(row.description ?? ""), price: String(row.price ?? ""), category: String(row.category ?? "Website"), image: String(row.image ?? ""), whatsapp: String(row.whatsapp ?? ""), featured: Boolean(row.featured), active: Boolean(row.active) });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) { await api.digitalServices.delete(Number(row.id)); load(); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      if (modal.editing) await api.digitalServices.update(Number(modal.editing.id), form);
      else await api.digitalServices.create(form);
      setModal({ open: false, editing: null }); load();
    } finally { setSaving(false); }
  }
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const cols = [
    { key: "image", label: "Foto", render: (v: unknown) => v ? <img src={String(v)} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" onError={e => { e.currentTarget.style.display = "none"; }} /> : <div className="w-10 h-10 rounded-lg bg-gray-100" /> },
    { key: "title", label: "Nama Layanan" },
    { key: "category", label: "Kategori" },
    { key: "price", label: "Harga", render: (v: unknown) => <span className="font-semibold text-blue-700">{String(v) || "–"}</span> },
    { key: "whatsapp", label: "WhatsApp", render: (v: unknown) => v ? <span className="text-green-600 font-mono text-xs">{String(v)}</span> : "–" },
    { key: "featured", label: "Featured", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>{v ? "Ya" : "Tidak"}</span> },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Layanan Digital</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola layanan digital yang ditawarkan Nempo.id</p>
      </div>
      <ContentTable title="Daftar Layanan Digital" cols={cols} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} />
      <Modal title={modal.editing ? "Edit Layanan" : "Tambah Layanan Digital"} open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="col-span-2"><Field label="Foto / Ikon Layanan"><ImageUpload value={form.image} onChange={url => setForm(p => ({ ...p, image: url }))} /></Field></div>
            <div className="col-span-2"><Field label="Nama Layanan" required><input className={inputCls} value={form.title} onChange={f("title")} required placeholder="Misal: Pembuatan Website UMKM" /></Field></div>
            <Field label="Kategori"><select className={inputCls} value={form.category} onChange={f("category")}>{categories.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Harga"><input className={inputCls} value={form.price} onChange={f("price")} placeholder="Mulai Rp 1.500.000" /></Field>
            <div className="col-span-2"><Field label="Nomor WhatsApp"><input className={inputCls} type="tel" value={form.whatsapp} onChange={f("whatsapp")} placeholder="+6281200000000" /></Field></div>
            <div className="col-span-2"><Field label="Deskripsi Layanan"><textarea className={textareaCls} rows={3} value={form.description} onChange={f("description")} placeholder="Jelaskan layanan ini secara lengkap..." /></Field></div>
          </div>
          <div className="flex gap-5 mb-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" /><span>Featured</span></label>
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" /><span>Tampilkan di Website</span></label>
          </div>
          <FormActions onCancel={() => setModal({ open: false, editing: null })} loading={saving} />
        </form>
      </Modal>
    </>
  );
}
