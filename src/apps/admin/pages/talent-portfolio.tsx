import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, FormActions } from "@/apps/admin/components/modal";
import { ImageUpload } from "@/apps/admin/components/image-upload";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;

const CATEGORIES = ["Sinematik", "Portrait", "Brand Film", "Budaya", "Event", "Musik", "Travel", "Kuliner", "Wedding", "Lainnya"];
const empty = {
  type: "photo", title: "", talent_name: "", role: "",
  thumb: "", youtube_id: "", duration: "", category: "Event",
  sort_order: "0", active: true,
};

export default function TalentPortfolioPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.talentPortfolio.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    setForm({
      type:        String(row.type        ?? "photo"),
      title:       String(row.title       ?? ""),
      talent_name: String(row.talent_name ?? ""),
      role:        String(row.role        ?? ""),
      thumb:       String(row.thumb       ?? ""),
      youtube_id:  String(row.youtube_id  ?? ""),
      duration:    String(row.duration    ?? ""),
      category:    String(row.category    ?? "Event"),
      sort_order:  String(row.sort_order  ?? "0"),
      active:      Boolean(row.active),
    });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) { await api.talentPortfolio.delete(Number(row.id)); load(); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const payload = {
        ...form,
        sort_order: parseInt(form.sort_order) || 0,
        youtube_id: form.youtube_id || null,
        duration:   form.duration   || null,
      };
      if (modal.editing) await api.talentPortfolio.update(Number(modal.editing.id), payload);
      else await api.talentPortfolio.create(payload);
      setModal({ open: false, editing: null }); load();
    } finally { setSaving(false); }
  }
  const f = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const cols = [
    {
      key: "thumb", label: "Thumbnail",
      render: (v: unknown) => v
        ? <img src={String(v)} alt="" className="w-16 h-20 rounded-xl object-cover border border-gray-100" />
        : <div className="w-16 h-20 rounded-xl bg-gray-100" />,
    },
    { key: "title", label: "Judul" },
    { key: "talent_name", label: "Talent", render: (v: unknown, row: Row) => (
      <div>
        <p className="font-semibold text-sm">{String(v)}</p>
        <p className="text-xs text-gray-400">{String(row.role ?? "")}</p>
      </div>
    )},
    { key: "type", label: "Tipe", render: (v: unknown) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${String(v) === "video" ? "bg-fuchsia-100 text-fuchsia-700" : "bg-blue-100 text-blue-700"}`}>
        {String(v) === "video" ? "🎬 Video" : "📷 Foto"}
      </span>
    )},
    { key: "category", label: "Kategori", render: (v: unknown) => <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{String(v)}</span> },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Karya Talent</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola portofolio foto & video yang tampil di halaman Talent</p>
      </div>

      <ContentTable title="Daftar Karya" cols={cols} data={data} loading={loading}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} />

      <Modal title={modal.editing ? "Edit Karya" : "Tambah Karya"} open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">

            <div className="col-span-2">
              <Field label="Thumbnail / Foto Karya">
                <ImageUpload value={form.thumb} onChange={url => setForm(p => ({ ...p, thumb: url }))} />
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="Judul Karya" required>
                <input className={inputCls} value={form.title} onChange={f("title")} required placeholder="Wedding Highlight — Rina & Doni" />
              </Field>
            </div>

            <Field label="Nama Talent" required>
              <input className={inputCls} value={form.talent_name} onChange={f("talent_name")} required placeholder="Fajar Maulana" />
            </Field>
            <Field label="Peran Talent">
              <input className={inputCls} value={form.role} onChange={f("role")} placeholder="Videografer, Fotografer, dll" />
            </Field>

            <Field label="Tipe Konten">
              <select className={inputCls} value={form.type} onChange={f("type")}>
                <option value="photo">📷 Foto</option>
                <option value="video">🎬 Video</option>
              </select>
            </Field>
            <Field label="Kategori">
              <select className={inputCls} value={form.category} onChange={f("category")}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>

            {/* Video fields — only show when type = video */}
            {form.type === "video" && (
              <>
                <Field label="YouTube ID">
                  <input className={inputCls} value={form.youtube_id} onChange={f("youtube_id")} placeholder="LXb3EKWsInQ" />
                </Field>
                <Field label="Durasi">
                  <input className={inputCls} value={form.duration} onChange={f("duration")} placeholder="4:32" />
                </Field>
              </>
            )}

            <Field label="Urutan Tampil">
              <input className={inputCls} type="number" min="0" value={form.sort_order} onChange={f("sort_order")} />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mb-1">
            <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
            <span>Tampilkan di Website</span>
          </label>

          <FormActions onCancel={() => setModal({ open: false, editing: null })} loading={saving} />
        </form>
      </Modal>
    </>
  );
}
