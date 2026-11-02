import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, FormActions } from "@/apps/admin/components/modal";
import { ImageUpload } from "@/apps/admin/components/image-upload";
import { VideoUpload } from "@/apps/admin/components/video-upload";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;
const empty = { video_url: "", poster_url: "", active: true };

export default function TalentBannerPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.talentBanner.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    setForm({
      video_url:  String(row.video_url  ?? ""),
      poster_url: String(row.poster_url ?? ""),
      active:     Boolean(row.active),
    });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) { await api.talentBanner.delete(Number(row.id)); load(); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      if (modal.editing) await api.talentBanner.update(Number(modal.editing.id), form);
      else await api.talentBanner.create(form);
      setModal({ open: false, editing: null }); load();
    } finally { setSaving(false); }
  }
  const f = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const cols = [
    {
      key: "poster_url", label: "Poster / Thumbnail",
      render: (v: unknown) => v && String(v)
        ? <img src={String(v)} alt="" className="h-16 w-28 rounded-xl object-cover border border-gray-100"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        : <div className="h-16 w-28 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 text-xs">Tidak ada</div>,
    },
    { key: "video_url", label: "URL Video", render: (v: unknown) => <span className="text-xs text-gray-500 truncate block max-w-[220px]">{String(v || "–")}</span> },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Banner Halaman Talent</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola video hero yang tampil di bagian atas halaman Talent Studio</p>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700">
        <p className="font-bold mb-1">📌 Panduan URL Video & Poster</p>
        <ul className="list-disc list-inside space-y-0.5 text-xs">
          <li>Upload video (.mp4) via Admin → upload, lalu salin URL-nya</li>
          <li>Poster adalah gambar thumbnail (JPG/PNG) yang muncul sebelum video diputar</li>
          <li>Hanya 1 banner aktif yang akan ditampilkan (yang pertama aktif)</li>
        </ul>
      </div>

      <ContentTable title="Daftar Banner" cols={cols} data={data} loading={loading}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} />

      <Modal title={modal.editing ? "Edit Banner Talent" : "Tambah Banner Talent"} open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <Field label="File Video (.mp4)" required>
              <VideoUpload value={form.video_url} onChange={url => setForm(p => ({ ...p, video_url: url }))} />
              {form.video_url && (
                <p className="text-[11px] text-gray-400 mt-1 truncate">URL: {form.video_url}</p>
              )}
            </Field>
            <Field label="Poster / Thumbnail (gambar yang muncul sebelum video diputar)">
              <ImageUpload value={form.poster_url} onChange={url => setForm(p => ({ ...p, poster_url: url }))} />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mb-1 mt-4">
            <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
            <span>Aktifkan Banner Ini</span>
          </label>

          <FormActions onCancel={() => setModal({ open: false, editing: null })} loading={saving} />
        </form>
      </Modal>
    </>
  );
}
