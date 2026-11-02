import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, textareaCls, FormActions } from "@/apps/admin/components/modal";
import { ImageUpload } from "@/apps/admin/components/image-upload";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;

const CATEGORIES = ["mc", "band", "budaya", "vokalis"];
const CATEGORY_LABEL: Record<string, string> = {
  mc: "MC", band: "Band / Musisi", budaya: "Budaya", vokalis: "Vokalis",
};
const CATEGORY_COLOR: Record<string, string> = {
  mc: "bg-violet-100 text-violet-700",
  band: "bg-blue-100 text-blue-700",
  budaya: "bg-amber-100 text-amber-700",
  vokalis: "bg-pink-100 text-pink-700",
};

const empty = {
  name: "", role: "", category: "mc", tagline: "", instagram: "",
  tags: "", verified: false, featured: false, bio: "", wa: "",
  photo: "", sort_order: "0", active: true,
};

export default function TalentPage() {
  const [data,   setData]   = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,  setModal]  = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form,   setForm]   = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.talents.list().then(setData).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    const tagsRaw = Array.isArray(row.tags)
      ? (row.tags as string[]).join(", ")
      : String(row.tags ?? "");
    setForm({
      name:       String(row.name       ?? ""),
      role:       String(row.role       ?? ""),
      category:   String(row.category   ?? "mc"),
      tagline:    String(row.tagline    ?? ""),
      instagram:  String(row.instagram  ?? ""),
      tags:       tagsRaw,
      verified:   Boolean(row.verified),
      featured:   Boolean(row.featured),
      bio:        String(row.bio        ?? ""),
      wa:         String(row.wa         ?? ""),
      photo:      String(row.photo      ?? ""),
      sort_order: String(row.sort_order ?? "0"),
      active:     Boolean(row.active),
    });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) { await api.talents.delete(Number(row.id)); load(); }
  async function handleBulkDelete(ids: number[]) { await api.talents.bulkDelete(ids); load(); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, sort_order: parseInt(form.sort_order) || 0 };
      if (modal.editing) await api.talents.update(Number(modal.editing.id), payload);
      else await api.talents.create(payload);
      setModal({ open: false, editing: null }); load();
    } finally { setSaving(false); }
  }

  const f = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const cols = [
    {
      key: "photo", label: "Foto",
      render: (v: unknown) => v
        ? <img src={String(v)} alt="" className="w-11 h-11 rounded-xl object-cover object-top border border-gray-100" onError={e => { e.currentTarget.style.display = "none"; }} />
        : <div className="w-11 h-11 rounded-xl bg-gray-100" />,
    },
    { key: "name", label: "Nama" },
    { key: "role", label: "Peran" },
    {
      key: "category", label: "Kategori",
      render: (v: unknown) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${CATEGORY_COLOR[String(v)] ?? "bg-gray-100 text-gray-600"}`}>
          {CATEGORY_LABEL[String(v)] ?? String(v)}
        </span>
      ),
    },
    { key: "tagline", label: "Tagline", render: (v: unknown) => <span className="text-gray-400 text-xs truncate block max-w-[180px]">{String(v || "–")}</span> },
    { key: "instagram", label: "Instagram" },
    {
      key: "tags", label: "Tags",
      render: (v: unknown) => {
        const arr = Array.isArray(v) ? v as string[] : [];
        return arr.length ? (
          <div className="flex gap-1 flex-wrap max-w-[180px]">
            {arr.slice(0, 3).map(t => (
              <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        ) : <span className="text-gray-300">–</span>;
      },
    },
    { key: "verified", label: "Verified", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>{v ? "Ya" : "Tidak"}</span> },
    { key: "featured", label: "Featured", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>{v ? "Ya" : "Tidak"}</span> },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Talent Studio</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola talent lokal Jawa Barat — MC, band, seniman budaya, dan vokalis</p>
      </div>

      <ContentTable
        title="Daftar Talent"
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
        title={modal.editing ? "Edit Talent" : "Tambah Talent"}
        open={modal.open}
        onClose={() => setModal({ open: false, editing: null })}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">

            {/* Photo */}
            <div className="col-span-2">
              <Field label="Foto Talent">
                <ImageUpload value={form.photo} onChange={url => setForm(p => ({ ...p, photo: url }))} />
              </Field>
            </div>

            {/* Name */}
            <div className="col-span-2">
              <Field label="Nama Lengkap" required>
                <input className={inputCls} value={form.name} onChange={f("name")} required placeholder="Nama talent..." />
              </Field>
            </div>

            {/* Role + Category */}
            <Field label="Peran / Role" required>
              <input className={inputCls} value={form.role} onChange={f("role")} required placeholder="MC & Host, Gitaris, dll" />
            </Field>
            <Field label="Kategori">
              <select className={inputCls} value={form.category} onChange={f("category")}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
                ))}
              </select>
            </Field>

            {/* Tagline */}
            <div className="col-span-2">
              <Field label="Tagline">
                <input className={inputCls} value={form.tagline} onChange={f("tagline")} placeholder="Kalimat singkat yang menggambarkan talent..." />
              </Field>
            </div>

            {/* Instagram + WA */}
            <Field label="Instagram">
              <input className={inputCls} value={form.instagram} onChange={f("instagram")} placeholder="@username" />
            </Field>
            <Field label="WhatsApp (no internasional)">
              <input className={inputCls} value={form.wa} onChange={f("wa")} placeholder="628xxx" />
            </Field>

            {/* Tags */}
            <div className="col-span-2">
              <Field label="Tags Keahlian (pisah dengan koma)">
                <input className={inputCls} value={form.tags} onChange={f("tags")} placeholder="Pernikahan, Corporate, Festival" />
              </Field>
            </div>

            {/* Bio */}
            <div className="col-span-2">
              <Field label="Bio / Deskripsi">
                <textarea className={textareaCls} rows={3} value={form.bio} onChange={f("bio")} placeholder="Ceritakan latar belakang dan keahlian talent..." />
              </Field>
            </div>

            {/* Sort order */}
            <Field label="Urutan Tampil">
              <input className={inputCls} type="number" min="0" value={form.sort_order} onChange={f("sort_order")} />
            </Field>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-5 mb-1 flex-wrap">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.verified} onChange={e => setForm(p => ({ ...p, verified: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
              <span>Talent Terverifikasi</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
              <span>Featured / Unggulan</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
              <span>Tampilkan di Website</span>
            </label>
          </div>

          <FormActions onCancel={() => setModal({ open: false, editing: null })} loading={saving} />
        </form>
      </Modal>
    </>
  );
}
