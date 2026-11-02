import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, FormActions } from "@/apps/admin/components/modal";
import { ImageUpload } from "@/apps/admin/components/image-upload";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;

const empty = {
  image: "",
  link: "/",
  sort_order: "1",
  active: true,
};

export default function PromoBannersPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.promoBanners.list().then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    setForm({
      image: String(row.image ?? ""),
      link: String(row.link ?? "/"),
      sort_order: String(row.sort_order ?? "1"),
      active: Boolean(row.active),
    });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) {
    await api.promoBanners.delete(Number(row.id));
    load();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, sort_order: parseInt(form.sort_order) };
      if (modal.editing) await api.promoBanners.update(Number(modal.editing.id), payload);
      else await api.promoBanners.create(payload);
      setModal({ open: false, editing: null });
      load();
    } finally { setSaving(false); }
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const cols = [
    {
      key: "image", label: "Foto",
      render: (v: unknown) => v ? (
        <img src={String(v)} alt="" className="w-24 h-10 rounded-lg object-cover border border-gray-100" onError={e => { e.currentTarget.style.display = "none"; }} />
      ) : <div className="w-24 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">–</div>
    },
    { key: "sort_order", label: "Urutan", render: (v: unknown) => <span className="font-bold text-gray-600">#{String(v)}</span> },
    { key: "link", label: "Link Tujuan", render: (v: unknown) => <span className="text-sm text-blue-600 font-mono">{String(v)}</span> },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Banner Kecil (Promo)</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola slideshow banner foto kecil di tengah halaman beranda</p>
      </div>

      <ContentTable
        title="Daftar Banner Promo"
        cols={cols}
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        onRefresh={load}
      />

      <Modal
        open={modal.open}
        title={modal.editing ? "Edit Banner Promo" : "Tambah Banner Promo"}
        onClose={() => setModal({ open: false, editing: null })}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Link Tujuan">
              <input className={inputCls} value={form.link} onChange={f("link")} placeholder="cth: /wisata" />
            </Field>
            <Field label="Urutan Tampil">
              <input type="number" min={1} className={inputCls} value={form.sort_order} onChange={f("sort_order")} />
            </Field>
          </div>

          <Field label="Status">
            <select className={inputCls} value={form.active ? "1" : "0"} onChange={e => setForm(p => ({ ...p, active: e.target.value === "1" }))}>
              <option value="1">Aktif</option>
              <option value="0">Nonaktif</option>
            </select>
          </Field>

          <Field label="Foto Banner" required>
            <ImageUpload
              value={form.image}
              onChange={url => setForm(p => ({ ...p, image: url }))}
            />
          </Field>

          <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700 space-y-1">
            <p className="font-semibold">Tips foto banner promo:</p>
            <p>• Gunakan foto landscape (panoramik) resolusi tinggi</p>
            <p>• Rasio ideal sekitar 3:1 — lebar &gt; tinggi</p>
            <p>• Banner tampil sebagai foto penuh tanpa teks</p>
          </div>

          <FormActions loading={saving} onCancel={() => setModal({ open: false, editing: null })} />
        </form>
      </Modal>
    </>
  );
}
