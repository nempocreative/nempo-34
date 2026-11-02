import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, textareaCls, FormActions } from "@/apps/admin/components/modal";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;
const empty = { sunda: "", indonesia: "", latin: "", category: "Umum", level: "dasar", example: "", active: true };
const categories = ["Sapaan", "Tanya", "Sopan Santun", "Umum", "Sifat", "Orang", "Waktu", "Kata Kerja", "Tempat", "Peribahasa"];
const levels = ["dasar", "menengah", "lanjut"];

export default function KamusSundaPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.kamusSunda.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    setForm({ sunda: String(row.sunda ?? ""), indonesia: String(row.indonesia ?? ""), latin: String(row.latin ?? ""), category: String(row.category ?? "Umum"), level: String(row.level ?? "dasar"), example: String(row.example ?? ""), active: Boolean(row.active) });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) { await api.kamusSunda.delete(Number(row.id)); load(); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      if (modal.editing) await api.kamusSunda.update(Number(modal.editing.id), form);
      else await api.kamusSunda.create(form);
      setModal({ open: false, editing: null }); load();
    } finally { setSaving(false); }
  }
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const levelColor: Record<string, string> = {
    dasar: "bg-emerald-100 text-emerald-700",
    menengah: "bg-amber-100 text-amber-700",
    lanjut: "bg-purple-100 text-purple-700",
  };

  const cols = [
    { key: "sunda", label: "Kata Sunda", render: (v: unknown) => <span className="font-bold text-indigo-700">{String(v)}</span> },
    { key: "latin", label: "Transliterasi", render: (v: unknown) => <span className="italic text-gray-500">{String(v) || "–"}</span> },
    { key: "indonesia", label: "Arti (Indonesia)" },
    { key: "category", label: "Kategori" },
    { key: "level", label: "Tingkat", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${levelColor[String(v)] ?? "bg-gray-100 text-gray-600"}`}>{String(v)}</span> },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Kamus Sunda</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola kosakata dan kamus bahasa Sunda</p>
      </div>
      <ContentTable title="Daftar Kosakata Sunda" cols={cols} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} />
      <Modal title={modal.editing ? "Edit Kosakata" : "Tambah Kosakata Sunda"} open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <Field label="Kata dalam Bahasa Sunda" required><input className={`${inputCls} font-bold text-indigo-700`} value={form.sunda} onChange={f("sunda")} required placeholder="Contoh: Nuhun" /></Field>
            <Field label="Transliterasi / Cara Baca"><input className={`${inputCls} italic`} value={form.latin} onChange={f("latin")} placeholder="Contoh: Nu-hun" /></Field>
            <div className="col-span-2">
              <Field label="Arti dalam Bahasa Indonesia" required><input className={inputCls} value={form.indonesia} onChange={f("indonesia")} required placeholder="Contoh: Terima kasih" /></Field>
            </div>
            <Field label="Kategori"><select className={inputCls} value={form.category} onChange={f("category")}>{categories.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Tingkat Kesulitan">
              <select className={inputCls} value={form.level} onChange={f("level")}>
                {levels.map(l => <option key={l} className="capitalize">{l}</option>)}
              </select>
            </Field>
            <div className="col-span-2">
              <Field label="Contoh Kalimat"><textarea className={textareaCls} rows={2} value={form.example} onChange={f("example")} placeholder="Contoh penggunaan dalam kalimat..." /></Field>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer mb-1">
            <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" /><span>Tampilkan di Kamus</span>
          </label>
          <FormActions onCancel={() => setModal({ open: false, editing: null })} loading={saving} />
        </form>
      </Modal>
    </>
  );
}
