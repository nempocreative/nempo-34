import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, textareaCls, FormActions } from "@/apps/admin/components/modal";
import { ImageUpload } from "@/apps/admin/components/image-upload";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;
const empty = { title: "", category: "Wisata", image: "", summary: "", content: "", author: "", location: "Garut", featured: false, active: true, event_date: "", photo_source: "", source_name: "", source_url: "" };
const categories = ["Wisata", "Kuliner", "Event", "Budaya", "Infrastruktur", "Umum"];

export default function BeritaPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "pending">("pending");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const load = () => { setLoading(true); api.berita.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const pending = data.filter(r => r.status === "pending");
  const published = data.filter(r => r.status !== "pending");

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    setForm({
      title: String(row.title ?? ""),
      category: String(row.category ?? "Wisata"),
      image: String(row.image ?? ""),
      summary: String(row.summary ?? ""),
      content: String(row.content ?? ""),
      author: String(row.author ?? ""),
      location: String(row.location ?? "Garut"),
      featured: Boolean(row.featured),
      active: Boolean(row.active),
      event_date: row.event_date ? String(row.event_date).slice(0, 10) : "",
      photo_source: String(row.photo_source ?? ""),
      source_name: String(row.source_name ?? ""),
      source_url: String(row.source_url ?? ""),
    });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) { await api.berita.delete(Number(row.id)); load(); }
  async function handleBulkDelete(ids: number[]) { await Promise.all(ids.map(id => api.berita.delete(id))); load(); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      if (modal.editing) await api.berita.update(Number(modal.editing.id), form);
      else await api.berita.create(form);
      setModal({ open: false, editing: null }); load();
    } finally { setSaving(false); }
  }

  async function handleApprove(row: Row) {
    setActionLoading(Number(row.id));
    try { await api.berita.approve(Number(row.id)); load(); }
    finally { setActionLoading(null); }
  }

  async function handleReject(row: Row) {
    if (!confirm(`Tolak kiriman "${row.title}"?`)) return;
    setActionLoading(Number(row.id));
    try { await api.berita.reject(Number(row.id)); load(); }
    finally { setActionLoading(null); }
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const cols = [
    {
      key: "image", label: "Foto",
      render: (v: unknown) => v ? (
        <img src={String(v)} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" onError={e => { e.currentTarget.style.display = "none"; }} />
      ) : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">–</div>
    },
    { key: "title", label: "Judul" },
    { key: "category", label: "Kategori" },
    { key: "author", label: "Penulis" },
    { key: "published_at", label: "Tanggal", render: (v: unknown) => v ? new Date(String(v)).toLocaleDateString("id-ID") : "–" },
    { key: "featured", label: "Featured", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-500"}`}>{v ? "Ya" : "Tidak"}</span> },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
  ];

  const pendingCols = [
    {
      key: "image", label: "Foto",
      render: (v: unknown) => v ? (
        <img src={String(v)} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" onError={e => { e.currentTarget.style.display = "none"; }} />
      ) : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">–</div>
    },
    { key: "title", label: "Judul" },
    { key: "category", label: "Kategori" },
    { key: "submitter_name", label: "Pengirim" },
    { key: "submitter_email", label: "Email", render: (v: unknown) => v ? <span className="text-xs text-gray-500">{String(v)}</span> : <span className="text-gray-300">–</span> },
    { key: "created_at", label: "Dikirim", render: (v: unknown) => v ? new Date(String(v)).toLocaleDateString("id-ID") : "–" },
    {
      key: "id", label: "Aksi",
      render: (_v: unknown, row: Row) => (
        <div className="flex gap-1.5">
          <button
            onClick={() => handleApprove(row)}
            disabled={actionLoading === Number(row.id)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {actionLoading === Number(row.id) ? "…" : "✓ Setujui"}
          </button>
          <button
            onClick={() => openEdit(row)}
            className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleReject(row)}
            disabled={actionLoading === Number(row.id)}
            className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-bold hover:bg-red-200 disabled:opacity-50 transition-colors"
          >
            ✕ Tolak
          </button>
        </div>
      )
    },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Berita & Artikel</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola berita, artikel, dan moderasi kiriman pengguna</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "pending" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Kiriman Pengguna
          {pending.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {pending.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "all" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Semua Berita
        </button>
      </div>

      {activeTab === "pending" ? (
        <div>
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-sm">Memuat...</div>
          ) : pending.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="font-semibold text-gray-600">Tidak ada kiriman yang menunggu persetujuan</p>
              <p className="text-sm text-gray-400 mt-1">Kiriman baru dari pengguna akan muncul di sini</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">Menunggu Persetujuan</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{pending.length} kiriman dari pengguna</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {pendingCols.map(col => (
                        <th key={col.key} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pending.map((row, i) => (
                      <tr key={i} className="hover:bg-amber-50/30 transition-colors">
                        {pendingCols.map(col => (
                          <td key={col.key} className="px-4 py-3 text-gray-700">
                            {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "–")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ContentTable title="Daftar Berita" cols={cols} data={published} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} onBulkDelete={handleBulkDelete} />
      )}

      <Modal title={modal.editing ? "Edit Berita" : "Tulis Berita Baru"} open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="col-span-2">
              <Field label="Foto / Thumbnail Berita">
                <ImageUpload value={form.image} onChange={url => setForm(p => ({ ...p, image: url }))} />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Judul Berita" required>
                <input className={inputCls} value={form.title} onChange={f("title")} required placeholder="Judul berita yang menarik..." />
              </Field>
            </div>
            <Field label="Kategori">
              <select className={inputCls} value={form.category} onChange={f("category")}>{categories.map(c => <option key={c}>{c}</option>)}</select>
            </Field>
            <Field label="Penulis">
              <input className={inputCls} value={form.author} onChange={f("author")} placeholder="Nama penulis..." />
            </Field>
            <Field label="Kota / Lokasi">
              <select className={inputCls} value={form.location} onChange={f("location")}>
                <option value="Garut">Garut</option>
                <option value="Bandung">Bandung</option>
              </select>
            </Field>
            <Field label="Tanggal Acara">
              <input className={inputCls} type="date" value={form.event_date} onChange={f("event_date")} />
            </Field>
            <Field label="Sumber Foto">
              <input className={inputCls} value={form.photo_source} onChange={f("photo_source")} placeholder="Contoh: Dok. Pemkab Garut, Suara Garut..." />
            </Field>
            <Field label="Sumber Berita">
              <input className={inputCls} value={form.source_name} onChange={f("source_name")} placeholder="Contoh: Garut Dulu" />
            </Field>
            <div className="col-span-2">
              <Field label="Link Artikel Asli">
                <input className={inputCls} type="url" value={form.source_url} onChange={f("source_url")} placeholder="https://contoh.com/berita/..." />
                <p className="text-[11px] text-gray-400 mt-1">Pengunjung akan diarahkan ke link ini saat membaca sumber asli.</p>
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Ringkasan">
                <textarea className={textareaCls} rows={2} value={form.summary} onChange={f("summary")} placeholder="Ringkasan singkat berita (tampil di halaman utama)..." />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Isi Berita Lengkap">
                <textarea className={textareaCls} rows={6} value={form.content} onChange={f("content")} placeholder="Tulis isi berita lengkap di sini..." />
              </Field>
            </div>
          </div>
          <div className="flex gap-5 mb-1">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
              <span>Featured (tampil di beranda)</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
              <span>Publish</span>
            </label>
          </div>
          <FormActions onCancel={() => setModal({ open: false, editing: null })} loading={saving} submitLabel={modal.editing ? "Simpan Perubahan" : "Publish Berita"} />
        </form>
      </Modal>
    </>
  );
}
