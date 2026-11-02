import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, FormActions } from "@/apps/admin/components/modal";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;

const empty = {
  name: "",
  color: "#0194f3",
  sort_order: "1",
  active: true,
};

export default function PartnersPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.partners.list().then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    setForm({
      name: String(row.name ?? ""),
      color: String(row.color ?? "#0194f3"),
      sort_order: String(row.sort_order ?? "1"),
      active: Boolean(row.active),
    });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) {
    await api.partners.delete(Number(row.id));
    load();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, sort_order: parseInt(form.sort_order) };
      if (modal.editing) await api.partners.update(Number(modal.editing.id), payload);
      else await api.partners.create(payload);
      setModal({ open: false, editing: null });
      load();
    } finally { setSaving(false); }
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const cols = [
    { key: "sort_order", label: "Urutan", render: (v: unknown) => <span className="font-bold text-gray-600">#{String(v)}</span> },
    {
      key: "name", label: "Nama Mitra",
      render: (_v: unknown, row: Row) => {
        const parts = String(row.name ?? "").split(" ");
        const thin = parts.length > 1 ? parts.slice(0, -1).join(" ") : null;
        const bold = parts[parts.length - 1];
        return (
          <span className="font-semibold text-gray-900">
            {thin && <span className="font-normal text-gray-500 mr-1">{thin}</span>}
            <span style={{ color: String(row.color) }}>{bold}</span>
          </span>
        );
      }
    },
    {
      key: "color", label: "Warna Aksen",
      render: (v: unknown) => (
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full border border-gray-200" style={{ background: String(v) }} />
          <span className="text-xs text-gray-500 font-mono">{String(v)}</span>
        </div>
      )
    },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Mitra Kami</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola daftar brand / mitra yang tampil di marquee beranda</p>
      </div>

      <ContentTable
        title="Daftar Mitra"
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
        title={modal.editing ? "Edit Mitra" : "Tambah Mitra"}
        onClose={() => setModal({ open: false, editing: null })}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nama Mitra" required>
            <input className={inputCls} value={form.name} onChange={f("name")} required placeholder="cth: Kopi Nusantara" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Warna Aksen">
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={f("color")}
                  className="h-9 w-10 rounded border border-gray-200 cursor-pointer p-0.5 bg-white"
                />
                <input className={inputCls + " flex-1"} value={form.color} onChange={f("color")} placeholder="#0194f3" />
              </div>
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

          <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700 space-y-1">
            <p className="font-semibold">Cara tampil di beranda:</p>
            <p>• Kata terakhir dari nama tampil <strong>bold + berwarna</strong> sesuai aksen</p>
            <p>• Contoh: "Kopi <strong>Nusantara</strong>" — kata "Nusantara" yang diberi warna</p>
          </div>

          <FormActions loading={saving} onCancel={() => setModal({ open: false, editing: null })} />
        </form>
      </Modal>
    </>
  );
}
