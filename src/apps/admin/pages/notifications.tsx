import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, textareaCls, FormActions } from "@/apps/admin/components/modal";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;
const empty = { title: "", message: "", type: "info", active: true };
const types = [
  { value: "info",    label: "📢 Informasi" },
  { value: "update",  label: "🆕 Fitur Baru / Update" },
  { value: "promo",   label: "🎁 Promo" },
  { value: "event",   label: "📅 Event" },
  { value: "warning", label: "⚠️ Peringatan" },
];

export default function NotificationsPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.notifications.list().then(setData).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    setForm({
      title:   String(row.title ?? ""),
      message: String(row.message ?? ""),
      type:    String(row.type ?? "info"),
      active:  Boolean(row.active),
    });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) { await api.notifications.delete(Number(row.id)); load(); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      if (modal.editing) await api.notifications.update(Number(modal.editing.id), form);
      else await api.notifications.create(form);
      setModal({ open: false, editing: null }); load();
    } finally { setSaving(false); }
  }

  const f = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const typeLabel = (v: unknown) => types.find(t => t.value === v)?.label ?? String(v);
  const typeColor: Record<string, string> = {
    info:    "bg-blue-100 text-blue-700",
    update:  "bg-violet-100 text-violet-700",
    promo:   "bg-amber-100 text-amber-700",
    event:   "bg-teal-100 text-teal-700",
    warning: "bg-red-100 text-red-700",
  };

  const cols = [
    { key: "title",   label: "Judul" },
    { key: "message", label: "Pesan", render: (v: unknown) => <span className="line-clamp-2 text-gray-500 text-xs max-w-xs">{String(v)}</span> },
    {
      key: "type", label: "Tipe",
      render: (v: unknown) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor[String(v)] ?? "bg-gray-100 text-gray-600"}`}>
          {typeLabel(v)}
        </span>
      ),
    },
    { key: "created_at", label: "Dibuat", render: (v: unknown) => v ? new Date(String(v)).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "–" },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
  ];

  return (
    <>
      <ContentTable
        title="Notifikasi"
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
        title={modal.editing ? "Edit Notifikasi" : "Tambah Notifikasi"}
        onClose={() => setModal({ open: false, editing: null })}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Judul *">
            <input className={inputCls} value={form.title} onChange={f("title")} required placeholder="Judul notifikasi" />
          </Field>
          <Field label="Pesan *">
            <textarea className={textareaCls} rows={3} value={form.message} onChange={f("message")} required placeholder="Isi pesan notifikasi..." />
          </Field>
          <Field label="Tipe">
            <select className={inputCls} value={form.type} onChange={f("type")}>
              {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputCls} value={form.active ? "true" : "false"}
              onChange={e => setForm(p => ({ ...p, active: e.target.value === "true" }))}>
              <option value="true">Aktif — tampil di aplikasi</option>
              <option value="false">Nonaktif — disembunyikan</option>
            </select>
          </Field>
          <FormActions loading={saving} onCancel={() => setModal({ open: false, editing: null })} />
        </form>
      </Modal>
    </>
  );
}
