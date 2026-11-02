import { useEffect, useState } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, textareaCls, FormActions } from "@/apps/admin/components/modal";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;
const empty = { title: "", code: "", type: "wisata", discount_type: "persen", discount_value: "0", min_purchase: "0", expiry_date: "", description: "", active: true, kuliner_id: "" };
const types = ["wisata", "kuliner", "hotel", "event", "umum"];
const discountTypes = ["persen", "nominal"];

export default function VouchersPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);
  const [kulinerList, setKulinerList] = useState<{ id: number; name: string }[]>([]);

  const load = () => { setLoading(true); api.vouchers.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  // Fetch cafe list once from the dedicated Cafe endpoint
  useEffect(() => {
    fetch("/api/cafe")
      .then(r => r.json())
      .then((d: { id: number; name: string }[]) => setKulinerList(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  function openAdd() { setForm(empty); setModal({ open: true, editing: null }); }
  function openEdit(row: Row) {
    const exp = row.expiry_date ? String(row.expiry_date).substring(0, 10) : "";
    setForm({
      title: String(row.title ?? ""),
      code: String(row.code ?? ""),
      type: String(row.type ?? "wisata"),
      discount_type: String(row.discount_type ?? "persen"),
      discount_value: String(row.discount_value ?? "0"),
      min_purchase: String(row.min_purchase ?? "0"),
      expiry_date: exp,
      description: String(row.description ?? ""),
      active: Boolean(row.active),
      kuliner_id: row.kuliner_id ? String(row.kuliner_id) : "",
    });
    setModal({ open: true, editing: row });
  }

  async function handleDelete(row: Row) { await api.vouchers.delete(Number(row.id)); load(); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const payload = {
        ...form,
        discount_value: parseFloat(form.discount_value),
        min_purchase: parseFloat(form.min_purchase),
        kuliner_id: form.type === "kuliner" && form.kuliner_id ? Number(form.kuliner_id) : null,
      };
      if (modal.editing) await api.vouchers.update(Number(modal.editing.id), payload);
      else await api.vouchers.create(payload);
      setModal({ open: false, editing: null }); load();
    } finally { setSaving(false); }
  }
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  // Find cafe name for display in table
  const cafeName = (row: Row) => {
    if (!row.kuliner_id) return null;
    const cafe = kulinerList.find(k => k.id === Number(row.kuliner_id));
    return cafe?.name ?? `Cafe #${row.kuliner_id}`;
  };

  const cols = [
    { key: "title", label: "Nama Voucher" },
    { key: "code", label: "Kode", render: (v: unknown) => <code className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-xs tracking-wider">{String(v)}</code> },
    { key: "type", label: "Tipe", render: (v: unknown, row: Row) => (
      <div className="flex flex-col gap-0.5">
        <span className="capitalize px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 w-fit">{String(v)}</span>
        {cafeName(row) && <span className="text-[10px] text-orange-600 font-semibold">{cafeName(row)}</span>}
      </div>
    )},
    { key: "discount_value", label: "Nilai", render: (v: unknown, row: Row) => row.discount_type === "reward" ? "Hadiah eksklusif" : row.discount_type === "persen" ? `${parseFloat(String(v))}%` : `Rp ${Number(v).toLocaleString("id")}` },
    { key: "expiry_date", label: "Berlaku Sampai", render: (v: unknown) => v ? new Date(String(v)).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "–" },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Voucher & Kupon</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola voucher diskon untuk pengguna</p>
      </div>
      <ContentTable title="Daftar Voucher" cols={cols} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} />
      <Modal title={modal.editing ? "Edit Voucher" : "Tambah Voucher Baru"} open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="col-span-2">
              <Field label="Nama Voucher" required><input className={inputCls} value={form.title} onChange={f("title")} required placeholder="Misal: Diskon Cafe 20%" /></Field>
            </div>
            <Field label="Kode Voucher" required>
              <input className={`${inputCls} font-mono uppercase tracking-widest`} value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} required placeholder="NEMPO20" />
            </Field>
            <Field label="Tipe">
              <select className={inputCls} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value, kuliner_id: "" }))}>
                {types.map(t => <option key={t} className="capitalize">{t}</option>)}
              </select>
            </Field>

            {/* Dropdown cafe — hanya muncul saat tipe = kuliner */}
            {form.type === "kuliner" && (
              <div className="col-span-2">
                <Field label="Cafe Spesifik (opsional)">
                  <select className={inputCls} value={form.kuliner_id} onChange={f("kuliner_id")}>
                    <option value="">— Semua Cafe (berlaku global) —</option>
                    {kulinerList.map(k => (
                      <option key={k.id} value={String(k.id)}>{k.name}</option>
                    ))}
                  </select>
                </Field>
                <p className="text-[11px] text-gray-400 -mt-2 mb-2">Kosongkan = voucher berlaku untuk semua cafe kuliner</p>
              </div>
            )}

            <Field label="Jenis Diskon">
              <select className={inputCls} value={form.discount_type} onChange={f("discount_type")}>{discountTypes.map(t => <option key={t}>{t === "persen" ? "Persentase (%)" : "Nominal (Rp)"}</option>)}</select>
            </Field>
            <Field label={form.discount_type === "persen" ? "Besar Diskon (%)" : "Besar Diskon (Rp)"}>
              <input className={inputCls} type="number" min="0" value={form.discount_value} onChange={f("discount_value")} />
            </Field>
            <Field label="Minimum Pembelian (Rp)">
              <input className={inputCls} type="number" min="0" value={form.min_purchase} onChange={f("min_purchase")} />
            </Field>
            <Field label="Berlaku Sampai">
              <input className={inputCls} type="date" value={form.expiry_date} onChange={f("expiry_date")} />
            </Field>
            <div className="col-span-2">
              <Field label="Deskripsi / Syarat & Ketentuan">
                <textarea className={textareaCls} rows={2} value={form.description} onChange={f("description")} placeholder="Syarat dan ketentuan voucher..." />
              </Field>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mb-1">
            <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
            <span>Voucher Aktif</span>
          </label>
          <FormActions onCancel={() => setModal({ open: false, editing: null })} loading={saving} />
        </form>
      </Modal>
    </>
  );
}
