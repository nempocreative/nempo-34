import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, textareaCls, FormActions } from "@/apps/admin/components/modal";
import { MultiImageUpload } from "@/apps/admin/components/multi-image-upload";
import { api } from "@/apps/admin/lib/api";
import { Instagram } from "lucide-react";

type Row = Record<string, unknown>;

const empty = {
  name: "", handle: "", instagram: "", tiktok: "", verified: false,
  color: "#EC4899", color2: "#be185d", niches: "", location: "",
  rating: "4.5", rate: "", bio: "", photos: [] as string[],
  active: true, sort_order: "0",
};

export default function InfluencersPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.influencers.list().then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    setForm({
      name: String(row.name ?? ""),
      handle: String(row.handle ?? ""),
      instagram: String(row.instagram ?? ""),
      tiktok: String(row.tiktok ?? ""),
      verified: Boolean(row.verified),
      color: String(row.color ?? "#EC4899"),
      color2: String(row.color2 ?? "#be185d"),
      niches: Array.isArray(row.niches) ? (row.niches as string[]).join(", ") : String(row.niches ?? ""),
      location: String(row.location ?? ""),
      rating: String(row.rating ?? "4.5"),
      rate: String(row.rate ?? ""),
      bio: String(row.bio ?? ""),
      photos: Array.isArray(row.photos) ? (row.photos as string[]) : [],
      active: Boolean(row.active),
      sort_order: String(row.sort_order ?? "0"),
    });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) {
    await api.influencers.delete(Number(row.id));
    load();
  }

  async function handleBulkDelete(ids: number[]) {
    await api.influencers.bulkDelete(ids);
    load();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        rating: parseFloat(form.rating) || 0,
        sort_order: parseInt(form.sort_order) || 0,
      };
      if (modal.editing) await api.influencers.update(Number(modal.editing.id), payload);
      else await api.influencers.create(payload);
      setModal({ open: false, editing: null });
      load();
    } finally { setSaving(false); }
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const cols = [
    {
      key: "photos", label: "Foto",
      render: (v: unknown) => {
        const photos = Array.isArray(v) ? v as string[] : [];
        return photos[0] ? (
          <img src={photos[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" onError={e => { e.currentTarget.style.display = "none"; }} />
        ) : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">–</div>;
      }
    },
    { key: "name", label: "Nama" },
    { key: "handle", label: "Handle" },
    {
      key: "instagram", label: "Followers",
      render: (_v: unknown, row: Row) => (
        <span className="text-xs text-gray-500 flex items-center gap-2">
          <span className="flex items-center gap-1"><Instagram className="w-3 h-3" />{String(row.instagram ?? "-")}</span>
          <span>TikTok {String(row.tiktok ?? "-")}</span>
        </span>
      )
    },
    { key: "location", label: "Lokasi" },
    { key: "rate", label: "Rate Card" },
    { key: "rating", label: "Rating", render: (v: unknown) => v != null ? `⭐ ${v}` : "-" },
    { key: "verified", label: "Verified", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>{v ? "Ya" : "Tidak"}</span> },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Tampil" : "Sembunyi"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Influencer &amp; Kreator</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola profil kreator yang ditampilkan di halaman Influencer &amp; Kreator</p>
      </div>
      <ContentTable title="Daftar Influencer" cols={cols} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} onBulkDelete={handleBulkDelete} />

      <Modal title={modal.editing ? "Edit Influencer" : "Tambah Influencer"} open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="col-span-2">
              <Field label="Foto Galeri (bisa lebih dari satu)">
                <MultiImageUpload value={form.photos} onChange={photos => setForm(p => ({ ...p, photos }))} />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Nama Kreator" required>
                <input className={inputCls} value={form.name} onChange={f("name")} required placeholder="Nama lengkap kreator..." />
              </Field>
            </div>
            <Field label="Handle / Username" required>
              <input className={inputCls} value={form.handle} onChange={f("handle")} required placeholder="@username" />
            </Field>
            <Field label="Lokasi">
              <input className={inputCls} value={form.location} onChange={f("location")} placeholder="Garut" />
            </Field>
            <Field label="Followers Instagram">
              <input className={inputCls} value={form.instagram} onChange={f("instagram")} placeholder="128K" />
            </Field>
            <Field label="Followers TikTok">
              <input className={inputCls} value={form.tiktok} onChange={f("tiktok")} placeholder="64K" />
            </Field>
            <Field label="Rate Card / Harga">
              <input className={inputCls} value={form.rate} onChange={f("rate")} placeholder="Rp 500K/post" />
            </Field>
            <Field label="Rating (0 - 5)">
              <input className={inputCls} type="number" step="0.1" min="0" max="5" value={form.rating} onChange={f("rating")} />
            </Field>
            <div className="col-span-2">
              <Field label="Kategori / Niche (pisah dengan koma)">
                <input className={inputCls} value={form.niches} onChange={f("niches")} placeholder="Travel, Lifestyle, Vlog" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Bio Singkat">
                <textarea className={textareaCls} rows={2} value={form.bio} onChange={f("bio")} placeholder="Deskripsi singkat kreator..." />
              </Field>
            </div>
            <Field label="Warna Aksen 1">
              <input className={`${inputCls} h-10`} type="color" value={form.color} onChange={f("color")} />
            </Field>
            <Field label="Warna Aksen 2">
              <input className={`${inputCls} h-10`} type="color" value={form.color2} onChange={f("color2")} />
            </Field>
            <Field label="Urutan Tampil">
              <input className={inputCls} type="number" value={form.sort_order} onChange={f("sort_order")} />
            </Field>
          </div>
          <div className="flex gap-5 mb-1">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.verified} onChange={e => setForm(p => ({ ...p, verified: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
              <span>Kreator Terverifikasi</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
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
