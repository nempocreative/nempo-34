import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, textareaCls, FormActions } from "@/apps/admin/components/modal";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;
const empty = { name: "", type: "Angkot", kode: "", asal: "", tujuan: "", via: "", tarif: "0", jam: "", frekuensi: "", description: "", active: true };
const types = ["Angkot", "Bus", "Travel", "Ojek Online", "Kereta", "Shuttle", "Lainnya"];

export default function TransportasiPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.transportasi.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    setForm({ name: String(row.name ?? ""), type: String(row.type ?? "Angkot"), kode: String(row.kode ?? ""), asal: String(row.asal ?? ""), tujuan: String(row.tujuan ?? ""), via: String(row.via ?? ""), tarif: String(row.tarif ?? "0"), jam: String(row.jam ?? ""), frekuensi: String(row.frekuensi ?? ""), description: String(row.description ?? ""), active: Boolean(row.active) });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) { await api.transportasi.delete(Number(row.id)); load(); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, tarif: parseInt(form.tarif) };
      if (modal.editing) await api.transportasi.update(Number(modal.editing.id), payload);
      else await api.transportasi.create(payload);
      setModal({ open: false, editing: null }); load();
    } finally { setSaving(false); }
  }
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const typeColor: Record<string, string> = {
    Angkot: "bg-orange-100 text-orange-700",
    Bus: "bg-blue-100 text-blue-700",
    Travel: "bg-purple-100 text-purple-700",
    Kereta: "bg-green-100 text-green-700",
  };

  const cols = [
    { key: "kode", label: "Kode", render: (v: unknown) => v ? <span className="font-bold font-mono bg-gray-100 px-2 py-0.5 rounded-md text-xs">{String(v)}</span> : "–" },
    { key: "name", label: "Nama Rute" },
    { key: "type", label: "Tipe", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor[String(v)] ?? "bg-gray-100 text-gray-700"}`}>{String(v)}</span> },
    { key: "asal", label: "Asal" },
    { key: "tujuan", label: "Tujuan" },
    { key: "tarif", label: "Tarif", render: (v: unknown) => `Rp ${Number(v).toLocaleString("id")}` },
    { key: "jam", label: "Jam Operasi" },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Transportasi</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola info angkot, bus, travel, dan transportasi Jawa Barat</p>
      </div>
      <ContentTable title="Daftar Transportasi" cols={cols} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} />
      <Modal title={modal.editing ? "Edit Transportasi" : "Tambah Transportasi"} open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="col-span-2"><Field label="Nama Rute / Kendaraan" required><input className={inputCls} value={form.name} onChange={f("name")} required placeholder="Misal: Angkot Guntur – Tarogong" /></Field></div>
            <Field label="Tipe Transportasi"><select className={inputCls} value={form.type} onChange={f("type")}>{types.map(t => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Kode / Nomor"><input className={inputCls} value={form.kode} onChange={f("kode")} placeholder="01, 02, dll..." /></Field>
            <Field label="Terminal Asal"><input className={inputCls} value={form.asal} onChange={f("asal")} placeholder="Terminal Guntur" /></Field>
            <Field label="Tujuan Akhir"><input className={inputCls} value={form.tujuan} onChange={f("tujuan")} placeholder="Tarogong Kidul" /></Field>
            <Field label="Tarif (Rp)"><input className={inputCls} type="number" min="0" value={form.tarif} onChange={f("tarif")} /></Field>
            <Field label="Jam Operasi"><input className={inputCls} value={form.jam} onChange={f("jam")} placeholder="05.00 – 20.00" /></Field>
            <div className="col-span-2"><Field label="Rute Via (dipisah koma)"><input className={inputCls} value={form.via} onChange={f("via")} placeholder="Jl. Ahmad Yani, Alun-alun, Simpang Tarogong" /></Field></div>
            <Field label="Frekuensi / Interval"><input className={inputCls} value={form.frekuensi} onChange={f("frekuensi")} placeholder="5–10 menit" /></Field>
            <div className="col-span-2"><Field label="Keterangan Tambahan"><textarea className={textareaCls} rows={2} value={form.description} onChange={f("description")} placeholder="Info tambahan..." /></Field></div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer mb-1">
            <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" /><span>Tampilkan di Website</span>
          </label>
          <FormActions onCancel={() => setModal({ open: false, editing: null })} loading={saving} />
        </form>
      </Modal>
    </>
  );
}
