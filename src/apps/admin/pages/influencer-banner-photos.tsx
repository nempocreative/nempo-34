import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, FormActions } from "@/apps/admin/components/modal";
import { ImageUpload } from "@/apps/admin/components/image-upload";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;
const empty = { url: "", use_as_hero: false, sort_order: "0", active: true };

export default function InfluencerBannerPhotosPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.influencerBannerPhotos.list().then(setData).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    setForm({
      url:          String(row.url          ?? ""),
      use_as_hero:  Boolean(row.use_as_hero),
      sort_order:   String(row.sort_order   ?? "0"),
      active:       Boolean(row.active),
    });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) { await api.influencerBannerPhotos.delete(Number(row.id)); load(); }
  async function handleBulkDelete(ids: number[]) { await api.influencerBannerPhotos.bulkDelete(ids); load(); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, sort_order: parseInt(form.sort_order) || 0 };
      if (modal.editing) await api.influencerBannerPhotos.update(Number(modal.editing.id), payload);
      else await api.influencerBannerPhotos.create(payload);
      setModal({ open: false, editing: null }); load();
    } finally { setSaving(false); }
  }

  const cols = [
    {
      key: "url", label: "Foto",
      render: (v: unknown) => v && String(v)
        ? <img src={String(v).startsWith("http") ? String(v) : `/${String(v).replace(/^\//, "")}`}
            alt="" className="w-16 h-20 rounded-xl object-cover border border-gray-100"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        : <div className="w-16 h-20 rounded-xl bg-gray-100" />,
    },
    { key: "url", label: "URL / Path", render: (v: unknown) => <span className="text-xs text-gray-500 truncate block max-w-[220px]">{String(v || "–")}</span> },
    {
      key: "use_as_hero", label: "Background Hero",
      render: (v: unknown) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${v ? "bg-fuchsia-100 text-fuchsia-700" : "bg-gray-100 text-gray-500"}`}>
          {v ? "✓ Hero" : "Strip saja"}
        </span>
      ),
    },
    { key: "sort_order", label: "Urutan", render: (v: unknown) => <span className="text-sm text-gray-600">{String(v)}</span> },
    {
      key: "active", label: "Status",
      render: (v: unknown) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>
          {v ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Foto Banner Influencer</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola foto yang tampil di banner halaman Influencer & Kreator</p>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700">
        <p className="font-bold mb-1">📌 Cara kerja foto banner</p>
        <ul className="list-disc list-inside space-y-0.5 text-xs">
          <li><strong>Background Hero</strong> — foto dipakai sebagai latar belakang crossfade di kiri banner</li>
          <li><strong>Strip saja</strong> — foto hanya tampil di strip animasi kanan banner</li>
          <li>Semua foto aktif (apapun settingnya) tampil di strip animasi</li>
          <li>Upload foto via tombol upload, atau isi URL langsung</li>
        </ul>
      </div>

      <ContentTable
        title="Daftar Foto Banner"
        cols={cols}
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onRefresh={load}
      />

      <Modal
        title={modal.editing ? "Edit Foto Banner" : "Tambah Foto Banner"}
        open={modal.open}
        onClose={() => setModal({ open: false, editing: null })}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Field label="Upload Foto">
              <ImageUpload value={form.url} onChange={url => setForm(p => ({ ...p, url }))} />
            </Field>

            <Field label="Atau isi URL / path langsung">
              <input
                className={inputCls}
                value={form.url}
                onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                placeholder="/api/uploads/foto.jpg atau https://..."
              />
            </Field>

            <Field label="Urutan Tampil">
              <input
                className={inputCls}
                type="number"
                min="0"
                value={form.sort_order}
                onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))}
              />
            </Field>
          </div>

          <div className="flex gap-5 mt-3 mb-1 flex-wrap">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.use_as_hero}
                onChange={e => setForm(p => ({ ...p, use_as_hero: e.target.checked }))}
                className="w-4 h-4 rounded accent-fuchsia-600"
              />
              <span>Gunakan sebagai background hero (crossfade)</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => setForm(p => ({ ...p, active: e.target.checked }))}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span>Tampilkan di Website</span>
            </label>
          </div>

          <FormActions onCancel={() => setModal({ open: false, editing: null })} loading={saving} />
        </form>
      </Modal>
    </>
  );
}
