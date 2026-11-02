import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, textareaCls, FormActions } from "@/apps/admin/components/modal";
import { ImageUpload } from "@/apps/admin/components/image-upload";
import { api } from "@/apps/admin/lib/api";
import { cleanDescription, cleanLocation, cleanPlaceName, cleanText } from "@/apps/admin/lib/text";

type Row = Record<string, unknown>;
const empty = { name: "", category: "Hotel", rating: "", price_per_night: "0", image: "", location: "", description: "", featured: false, active: true, instagram: "", booking_enabled: false };
const categories = ["Hotel", "Villa", "Homestay", "Guest House", "Resort", "Glamping"];

export default function PenginapanPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.penginapan.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    setForm({
      name: String(row.name ?? ""),
      category: String(row.category ?? "Hotel"),
      rating: String(row.rating ?? ""),
      price_per_night: String(row.price_per_night ?? "0"),
      image: String(row.image ?? ""),
      location: String(row.location ?? ""),
      description: String(row.description ?? ""),
      featured: Boolean(row.featured),
      active: Boolean(row.active),
      instagram: String(row.instagram ?? ""),
      booking_enabled: Boolean(row.booking_enabled),
    });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) { await api.penginapan.delete(Number(row.id)); load(); }

  async function handleBulkDelete(ids: number[]) {
    await api.penginapan.bulkDelete(ids);
    load();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const payload = {
        ...form,
        name: cleanPlaceName(form.name),
        category: cleanPlaceName(form.category),
        location: cleanLocation(form.location),
        description: cleanDescription(form.description, form.name, cleanPlaceName(form.name)),
        rating: parseFloat(form.rating),
        price_per_night: parseInt(form.price_per_night),
      };
      if (modal.editing) await api.penginapan.update(Number(modal.editing.id), payload);
      else await api.penginapan.create(payload);
      setModal({ open: false, editing: null }); load();
    } finally { setSaving(false); }
  }
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const cols = [
    {
      key: "image", label: "Foto",
      render: (v: unknown) => v ? (
        <img src={String(v)} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" onError={e => { e.currentTarget.style.display = "none"; }} />
      ) : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">–</div>
    },
    { key: "name", label: "Nama" },
    { key: "category", label: "Tipe" },
    {
      key: "rating", label: "Google Maps",
      render: (v: unknown) => v != null && Number(v) > 0
        ? <span className="font-semibold text-yellow-600">⭐ {Number(v).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
        : <span className="text-gray-300 text-xs">–</span>,
    },
    {
      key: "computed_rating", label: "Ulasan Nempo",
      render: (v: unknown, row: Row) =>
        v != null
          ? <span className="font-semibold text-amber-600">⭐ {String(v)} <span className="text-gray-400 text-[10px]">({String(row.review_count)} ulasan)</span></span>
          : <span className="text-gray-300 text-xs">{Number(row.review_count) > 0 ? `${String(row.review_count)} ulasan` : "–"}</span>
    },
    { key: "price_per_night", label: "Harga/Malam", render: (v: unknown) => `Rp ${Number(v).toLocaleString("id")}` },
    { key: "location", label: "Lokasi" },
    { key: "featured", label: "Featured", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"}`}>{v ? "Ya" : "Tidak"}</span> },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
    { key: "booking_enabled", label: "Booking", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-400"}`}>{v ? "✓ Aktif" : "–"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Penginapan</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola data penginapan dan akomodasi</p>
      </div>
      <ContentTable title="Daftar Penginapan" cols={cols} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} onBulkDelete={handleBulkDelete} />

      <Modal title={modal.editing ? "Edit Penginapan" : "Tambah Penginapan"} open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="col-span-2">
              <Field label="Foto Penginapan">
                <ImageUpload value={form.image} onChange={url => setForm(p => ({ ...p, image: url }))} />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Nama Penginapan" required>
                <input className={inputCls} value={form.name} onChange={f("name")} required placeholder="Nama hotel/villa/homestay..." />
              </Field>
            </div>
            <Field label="Tipe">
              <select className={inputCls} value={form.category} onChange={f("category")}>{categories.map(c => <option key={c}>{c}</option>)}</select>
            </Field>
            <Field label="Lokasi" required>
              <input className={inputCls} value={form.location} onChange={f("location")} required placeholder="Kecamatan, Garut" />
            </Field>
            <Field label="Harga per Malam (Rp)">
              <input className={inputCls} type="number" min="0" value={form.price_per_night} onChange={f("price_per_night")} />
            </Field>
            <Field label="Rating Google Maps (opsional)">
              <input className={inputCls} type="number" min="0" max="5" step="0.1" value={form.rating} onChange={f("rating")} placeholder="Contoh: 4.7" />
            </Field>
            <Field label="Instagram">
              <input className={inputCls} value={form.instagram} onChange={f("instagram")} placeholder="@namapenginapan" />
            </Field>
            <div className="col-span-2">
              <Field label="Deskripsi">
                <textarea className={textareaCls} rows={3} value={form.description} onChange={f("description")} placeholder="Fasilitas, keunggulan, dll..." />
              </Field>
            </div>
          </div>
          <div className="flex gap-5 mb-1 flex-wrap">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
              <span>Featured</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
              <span>Tampilkan di Website</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.booking_enabled} onChange={e => setForm(p => ({ ...p, booking_enabled: e.target.checked }))} className="w-4 h-4 rounded accent-emerald-600" />
              <span className="font-semibold text-emerald-700">Aktifkan Fitur Booking</span>
            </label>
          </div>
          <FormActions onCancel={() => setModal({ open: false, editing: null })} loading={saving} />
        </form>
      </Modal>
    </>
  );
}
