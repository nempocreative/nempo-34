import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/apps/admin/lib/api";
import {
  CheckCircle2,
  ClipboardList,
  Loader2,
  MapPin,
  MapPinned,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";

type Merchant = { id: number; name: string; category: string; location: string; active: boolean };
type MenuOption = { id: string; name: string; price: number };
type MenuOptionGroup = {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  options: MenuOption[];
};
type MenuItem = {
  id: number;
  kuliner_id: number;
  merchant_name: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  active: boolean;
  option_groups: MenuOptionGroup[];
};
type MenuForm = {
  kuliner_id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  active: boolean;
  option_groups: MenuOptionGroup[];
};
type SelectedOptionGroup = {
  group_id: string;
  group_name: string;
  choices: Array<{ id: string; name: string; price: number }>;
};
type Order = {
  id: number;
  order_code: string;
  merchant_name: string;
  customer_name: string;
  customer_phone: string;
  delivery_area: string;
  delivery_address: string;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  customer_note: string | null;
  admin_note: string | null;
  subtotal: number;
  delivery_fee: number | null;
  delivery_discount: number;
  service_fee: number;
  voucher_code: string | null;
  voucher_discount: number;
  total_amount: number | null;
  delivery_eta: string | null;
  order_status: string;
  payment_status: string;
  payment_type: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  driver_vehicle: string | null;
  driver_plate: string | null;
  created_at: string;
  items: Array<{
    item_name: string;
    quantity: number;
    line_total: number;
    selected_options: SelectedOptionGroup[];
  }>;
};

const statuses = [
  ["pending_confirmation", "Menunggu konfirmasi"],
  ["confirmed", "Menunggu pembayaran"],
  ["preparing", "Sedang disiapkan"],
  ["driver_assigned", "Driver ditugaskan"],
  ["picked_up", "Pesanan diambil"],
  ["on_the_way", "Dalam perjalanan"],
  ["delivered", "Selesai"],
  ["rejected", "Ditolak"],
];

const fmtRp = (n: number | null) => n == null ? "Belum ditentukan" : `Rp${Number(n).toLocaleString("id-ID")}`;
const fmtDate = (value: string) => new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
const mapsUrl = (latitude: number | null, longitude: number | null) =>
  latitude == null || longitude == null ? null : `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

const blankMenu: MenuForm = {
  kuliner_id: "",
  name: "",
  description: "",
  price: "",
  image: "",
  active: true,
  option_groups: [],
};

function newOptionId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function JajanYukPage() {
  const [tab, setTab] = useState<"orders" | "menu">("orders");
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | "new" | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState("all");
  const [menuForm, setMenuForm] = useState<MenuForm>({ ...blankMenu });
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, Partial<Order>>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [merchantData, menuData, orderData] = await Promise.all([
        api.jajanYuk.merchants(),
        api.jajanYuk.menuItems(),
        api.jajanYuk.orders(),
      ]);
      setMerchants(merchantData as Merchant[]);
      setMenuItems(menuData as MenuItem[]);
      setOrders(orderData as Order[]);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data Jajan YUK.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const visibleMenu = useMemo(
    () => selectedMerchant === "all" ? menuItems : menuItems.filter((item) => item.kuliner_id === Number(selectedMerchant)),
    [menuItems, selectedMerchant],
  );

  function draftFor(order: Order) {
    return { ...order, ...(drafts[order.id] || {}) };
  }

  function setDraft(id: number, values: Partial<Order>) {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...values } }));
  }

  async function saveOrder(order: Order) {
    const draft = draftFor(order);
    setSaving(order.id);
    setError("");
    try {
      await api.jajanYuk.updateOrder(order.id, {
        order_status: draft.order_status,
        delivery_eta: draft.delivery_eta || "",
        driver_name: draft.driver_name || "",
        driver_phone: draft.driver_phone || "",
        driver_vehicle: draft.driver_vehicle || "",
        driver_plate: draft.driver_plate || "",
        admin_note: draft.admin_note || "",
      });
      setNotice(`Pesanan ${order.order_code} diperbarui.`);
      await load();
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui pesanan.");
    } finally {
      setSaving(null);
    }
  }

  async function updateManualPayment(order: Order, action: "verify" | "reject") {
    const message = action === "verify"
      ? `Tandai pembayaran manual ${order.order_code} sebagai diterima?`
      : `Tolak pembayaran manual ${order.order_code}?`;
    if (!window.confirm(message)) return;
    setSaving(order.id);
    setError("");
    try {
      await api.jajanYuk.manualPayment(order.id, action);
      setNotice(action === "verify" ? "Pembayaran manual diverifikasi." : "Pembayaran manual ditolak.");
      await load();
    } catch (err: any) {
      setError(err.message || "Gagal memproses pembayaran manual.");
    } finally {
      setSaving(null);
    }
  }

  function startEditMenu(item: MenuItem) {
    setEditingMenuId(item.id);
    setMenuForm({
      kuliner_id: String(item.kuliner_id),
      name: item.name,
      description: item.description || "",
      price: String(item.price),
      image: item.image || "",
      active: item.active,
      option_groups: Array.isArray(item.option_groups) ? item.option_groups : [],
    });
  }

  async function saveMenu() {
    if (menuForm.option_groups.some((group) =>
      !group.name.trim() || group.options.length === 0 || group.options.some((option) => !option.name.trim()),
    )) {
      setError("Lengkapi nama setiap grup dan pilihan, atau hapus grup yang tidak dipakai.");
      return;
    }
    setSaving(editingMenuId ?? "new");
    setError("");
    try {
      const payload = { ...menuForm, kuliner_id: Number(menuForm.kuliner_id), price: Number(menuForm.price) };
      if (editingMenuId) await api.jajanYuk.updateMenuItem(editingMenuId, payload);
      else await api.jajanYuk.createMenuItem(payload);
      setNotice(editingMenuId ? "Menu diperbarui." : "Menu ditambahkan.");
      setEditingMenuId(null);
      setMenuForm({ ...blankMenu });
      await load();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan menu.");
    } finally {
      setSaving(null);
    }
  }

  function addOptionGroup() {
    setMenuForm((current) => ({
      ...current,
      option_groups: [
        ...current.option_groups,
        {
          id: newOptionId("group"),
          name: "",
          required: true,
          multiple: false,
          options: [{ id: newOptionId("choice"), name: "", price: 0 }],
        },
      ],
    }));
  }

  function updateOptionGroup(groupId: string, patch: Partial<MenuOptionGroup>) {
    setMenuForm((current) => ({
      ...current,
      option_groups: current.option_groups.map((group) =>
        group.id === groupId ? { ...group, ...patch } : group,
      ),
    }));
  }

  function removeOptionGroup(groupId: string) {
    setMenuForm((current) => ({
      ...current,
      option_groups: current.option_groups.filter((group) => group.id !== groupId),
    }));
  }

  function updateOption(groupId: string, optionId: string, patch: Partial<MenuOption>) {
    setMenuForm((current) => ({
      ...current,
      option_groups: current.option_groups.map((group) => group.id === groupId
        ? {
            ...group,
            options: group.options.map((option) =>
              option.id === optionId ? { ...option, ...patch } : option,
            ),
          }
        : group),
    }));
  }

  function addOption(groupId: string) {
    setMenuForm((current) => ({
      ...current,
      option_groups: current.option_groups.map((group) => group.id === groupId
        ? { ...group, options: [...group.options, { id: newOptionId("choice"), name: "", price: 0 }] }
        : group),
    }));
  }

  function removeOption(groupId: string, optionId: string) {
    setMenuForm((current) => ({
      ...current,
      option_groups: current.option_groups.map((group) => group.id === groupId
        ? { ...group, options: group.options.filter((option) => option.id !== optionId) }
        : group),
    }));
  }

  async function deleteMenu(item: MenuItem) {
    if (!window.confirm(`Nonaktifkan dan hapus menu "${item.name}"?`)) return;
    setSaving(item.id);
    try {
      await api.jajanYuk.deleteMenuItem(item.id);
      setNotice("Menu dihapus dari daftar Jajan YUK.");
      await load();
    } catch (err: any) {
      setError(err.message || "Gagal menghapus menu.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Jajan YUK</p>
          <h1 className="mt-1 text-2xl font-black text-gray-900">Pesanan & menu</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Kelola menu aktif, konfirmasi ongkir, tetapkan driver, dan perbarui status yang terlihat pelanggan.</p>
        </div>
        <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 shadow-sm hover:bg-gray-50"><RefreshCw className="h-4 w-4" /> Muat ulang</button>
      </div>

      {(error || notice) && <div className={`mt-5 flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{error || notice}<button type="button" onClick={() => { setError(""); setNotice(""); }}><XCircle className="h-4 w-4" /></button></div>}

      <div className="mt-6 flex gap-2 border-b border-gray-200">
        <button type="button" onClick={() => setTab("orders")} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold ${tab === "orders" ? "border-orange-500 text-orange-700" : "border-transparent text-gray-500"}`}><ClipboardList className="h-4 w-4" /> Pesanan <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">{orders.length}</span></button>
        <button type="button" onClick={() => setTab("menu")} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold ${tab === "menu" ? "border-orange-500 text-orange-700" : "border-transparent text-gray-500"}`}><UtensilsCrossed className="h-4 w-4" /> Menu <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">{menuItems.filter((item) => item.active).length}</span></button>
      </div>

      {loading ? <div className="flex justify-center py-24"><Loader2 className="h-7 w-7 animate-spin text-orange-500" /></div> : tab === "orders" ? (
        <div className="mt-5 space-y-4">
          {orders.length === 0 && <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-sm text-gray-500">Belum ada pesanan Jajan YUK.</div>}
          {orders.map((order) => {
            const draft = draftFor(order);
            return (
              <article key={order.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${order.order_status === "pending_confirmation" ? "border-orange-200" : "border-gray-200"}`}>
                 <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
                   <div><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-sm font-black text-gray-900">{order.order_code}</span><span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700">{statuses.find(([value]) => value === order.order_status)?.[1] || order.order_status}</span><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${order.payment_type === "manual_transfer" && order.payment_status === "pending" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"}`}>Bayar: {order.payment_type === "manual_transfer" && order.payment_status === "pending" ? "Manual · perlu verifikasi" : order.payment_status}</span></div><p className="mt-1 text-xs text-gray-500">{order.merchant_name} · {fmtDate(order.created_at)}</p></div>
                   <div className="text-right"><p className="text-xs text-gray-400">Total</p><p className="font-black text-gray-900">{fmtRp(order.total_amount)}</p></div>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
                   <div><p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pelanggan</p><p className="mt-1 text-sm font-bold text-gray-900">{order.customer_name}</p><p className="text-xs text-gray-500">{order.customer_phone}</p><p className="mt-2 flex items-start gap-1 text-xs text-gray-500"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" /><span>{order.delivery_area}<br />{order.delivery_address}</span></p>{mapsUrl(order.delivery_latitude, order.delivery_longitude) ? <a href={mapsUrl(order.delivery_latitude, order.delivery_longitude)!} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-2 text-[10px] font-black text-orange-700 hover:bg-orange-100"><MapPinned className="h-3.5 w-3.5" /> Buka titik di Maps</a> : <p className="mt-2 text-[10px] font-semibold text-gray-400">Belum ada titik Maps</p>}</div>
                   <div><p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Isi pesanan</p>{order.items.map((item, index) => <div key={`${item.item_name}-${index}`} className="mt-1 text-xs text-gray-600"><span>{item.quantity} × {item.item_name} <span className="font-bold">{fmtRp(item.line_total)}</span></span>{item.selected_options?.map((group) => <p key={group.group_id} className="ml-3 mt-0.5 text-[10px] text-gray-400">{group.group_name}: {group.choices.map((choice) => choice.name).join(", ")}</p>)}</div>)}{order.customer_note && <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">Catatan: {order.customer_note}</p>}</div>
                   <div className="space-y-2"><label className="block"><span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</span><select value={String(draft.order_status)} onChange={(event) => setDraft(order.id, { order_status: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold"><option value="">Pilih status</option>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><div className="grid grid-cols-2 gap-2"><div className="rounded-lg border border-orange-100 bg-orange-50 px-2.5 py-2"><span className="block text-[10px] font-bold text-orange-700">Ongkir otomatis</span><span className="mt-1 block text-xs font-black text-orange-950">{fmtRp(order.delivery_fee)}</span>{order.delivery_discount > 0 && <span className="mt-0.5 block text-[10px] font-bold text-emerald-700">-{fmtRp(order.delivery_discount)} {order.delivery_discount >= Number(order.delivery_fee || 0) ? "gratis" : "diskon"}</span>}</div><label className="block"><span className="text-[10px] font-bold text-gray-400">Estimasi</span><input value={draft.delivery_eta || ""} onChange={(event) => setDraft(order.id, { delivery_eta: event.target.value })} placeholder="30–45 menit" className="mt-1 w-full rounded-lg border border-gray-200 px-2.5 py-2 text-xs" /></label></div>{order.service_fee > 0 && <div className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-2"><span className="block text-[10px] font-bold text-blue-700">Biaya layanan</span><span className="mt-1 block text-xs font-black text-blue-900">{fmtRp(order.service_fee)}</span></div>}{order.voucher_discount > 0 && <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-2"><span className="block text-[10px] font-bold text-emerald-700">Voucher {order.voucher_code ? `· ${order.voucher_code}` : ""}</span><span className="mt-1 block text-xs font-black text-emerald-900">-{fmtRp(order.voucher_discount)}</span></div>}</div>
                </div>
                <div className="mt-4 grid gap-2 border-t border-gray-100 pt-4 sm:grid-cols-4"><input value={draft.driver_name || ""} onChange={(event) => setDraft(order.id, { driver_name: event.target.value })} placeholder="Nama driver" className="rounded-lg border border-gray-200 px-2.5 py-2 text-xs" /><input value={draft.driver_phone || ""} onChange={(event) => setDraft(order.id, { driver_phone: event.target.value })} placeholder="WhatsApp driver" className="rounded-lg border border-gray-200 px-2.5 py-2 text-xs" /><input value={draft.driver_vehicle || ""} onChange={(event) => setDraft(order.id, { driver_vehicle: event.target.value })} placeholder="Kendaraan" className="rounded-lg border border-gray-200 px-2.5 py-2 text-xs" /><input value={draft.driver_plate || ""} onChange={(event) => setDraft(order.id, { driver_plate: event.target.value })} placeholder="Plat nomor" className="rounded-lg border border-gray-200 px-2.5 py-2 text-xs" /></div>
                 <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                   {order.payment_type === "manual_transfer" && order.payment_status === "pending" && (
                     <>
                       <button type="button" onClick={() => void updateManualPayment(order, "reject")} disabled={saving === order.id} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-xs font-black text-red-700 hover:bg-red-50 disabled:opacity-50"><XCircle className="h-4 w-4" /> Tolak pembayaran</button>
                       <button type="button" onClick={() => void updateManualPayment(order, "verify")} disabled={saving === order.id} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-black text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"><CheckCircle2 className="h-4 w-4" /> Verifikasi sudah bayar</button>
                     </>
                   )}
                   <button type="button" onClick={() => void saveOrder(order)} disabled={saving === order.id} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-black text-white shadow-sm hover:bg-orange-600 disabled:opacity-50">{saving === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan perubahan</button>
                 </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><select value={selectedMerchant} onChange={(event) => setSelectedMerchant(event.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"><option value="all">Semua merchant</option>{merchants.map((merchant) => <option key={merchant.id} value={merchant.id}>{merchant.name}</option>)}</select><span className="text-xs text-gray-500">{visibleMenu.length} item menu</span></div>
             <div className="space-y-3">{visibleMenu.map((item) => <article key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-black text-gray-900">{item.name}</h3><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{item.active ? "Aktif" : "Nonaktif"}</span></div><p className="mt-1 text-xs text-gray-500">{item.merchant_name} · {fmtRp(item.price)}</p>{item.description && <p className="mt-1 line-clamp-1 text-xs text-gray-400">{item.description}</p>}<p className="mt-1 text-[10px] font-semibold text-orange-600">{item.option_groups?.length ? `${item.option_groups.length} grup pilihan: ${item.option_groups.map((group) => group.name).join(", ")}` : "Tanpa pilihan tambahan"}</p></div><div className="flex shrink-0 gap-1"><button type="button" onClick={() => startEditMenu(item)} className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600" aria-label="Edit menu"><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => void deleteMenu(item)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" aria-label="Hapus menu"><Trash2 className="h-4 w-4" /></button></div></article>)}{visibleMenu.length === 0 && <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-sm text-gray-500">Belum ada menu untuk merchant ini.</div>}</div>
          </section>
           <section className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
             <div className="flex items-center justify-between">
               <h2 className="font-black text-gray-900">{editingMenuId ? "Edit menu" : "Tambah menu"}</h2>
               {editingMenuId && <button type="button" onClick={() => { setEditingMenuId(null); setMenuForm({ ...blankMenu }); }} className="text-gray-400 hover:text-gray-700"><XCircle className="h-4 w-4" /></button>}
             </div>
             <div className="mt-4 space-y-3">
               <label className="block"><span className="text-xs font-bold text-gray-600">Merchant</span><select value={menuForm.kuliner_id} onChange={(event) => setMenuForm({ ...menuForm, kuliner_id: event.target.value })} disabled={Boolean(editingMenuId)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"><option value="">Pilih merchant</option>{merchants.map((merchant) => <option key={merchant.id} value={merchant.id}>{merchant.name}</option>)}</select></label>
               <label className="block"><span className="text-xs font-bold text-gray-600">Nama menu</span><input value={menuForm.name} onChange={(event) => setMenuForm({ ...menuForm, name: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm" placeholder="Nama menu" /></label>
               <label className="block"><span className="text-xs font-bold text-gray-600">Harga</span><input type="number" min="1" value={menuForm.price} onChange={(event) => setMenuForm({ ...menuForm, price: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm" placeholder="15000" /></label>
               <label className="block"><span className="text-xs font-bold text-gray-600">Deskripsi</span><textarea rows={3} value={menuForm.description} onChange={(event) => setMenuForm({ ...menuForm, description: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm" /></label>
               <label className="block"><span className="text-xs font-bold text-gray-600">URL gambar <span className="font-normal text-gray-400">(opsional)</span></span><input value={menuForm.image} onChange={(event) => setMenuForm({ ...menuForm, image: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm" placeholder="https://…" /></label>

               <section className="rounded-xl border border-orange-100 bg-orange-50/40 p-3">
                 <div className="flex items-start justify-between gap-2">
                   <div><h3 className="text-xs font-black text-gray-800">Pilihan jenis & topping</h3><p className="mt-1 text-[10px] leading-4 text-gray-500">Contoh: ukuran (pilih satu) atau topping (bisa lebih dari satu).</p></div>
                   <button type="button" onClick={addOptionGroup} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-2 text-[10px] font-black text-orange-700 ring-1 ring-orange-200 hover:bg-orange-50"><Plus className="h-3.5 w-3.5" /> Grup</button>
                 </div>
                 {menuForm.option_groups.length === 0 ? (
                   <p className="mt-3 rounded-lg border border-dashed border-orange-200 bg-white p-3 text-[10px] leading-4 text-gray-500">Belum ada pilihan. Tambahkan grup untuk ukuran, jenis, level pedas, atau topping.</p>
                 ) : (
                   <div className="mt-3 space-y-3">
                     {menuForm.option_groups.map((group) => (
                       <div key={group.id} className="rounded-xl border border-gray-200 bg-white p-3">
                         <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center">
                           <input value={group.name} onChange={(event) => updateOptionGroup(group.id, { name: event.target.value })} placeholder="Nama grup, misalnya Ukuran" className="min-w-0 rounded-lg border border-gray-200 px-2.5 py-2 text-xs font-semibold" />
                           <select value={group.multiple ? "multiple" : "single"} onChange={(event) => updateOptionGroup(group.id, { multiple: event.target.value === "multiple" })} className="rounded-lg border border-gray-200 bg-white px-2 py-2 text-[10px] font-semibold"><option value="single">Pilih satu</option><option value="multiple">Bisa pilih banyak</option></select>
                           <label className="flex items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold text-gray-600"><input type="checkbox" checked={group.required} onChange={(event) => updateOptionGroup(group.id, { required: event.target.checked })} className="accent-orange-600" /> Wajib</label>
                           <button type="button" onClick={() => removeOptionGroup(group.id)} aria-label="Hapus grup pilihan" className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                         </div>
                         <div className="mt-2 space-y-2">
                           {group.options.map((option) => (
                             <div key={option.id} className="grid grid-cols-[minmax(0,1fr)_6rem_auto] gap-2">
                               <input value={option.name} onChange={(event) => updateOption(group.id, option.id, { name: event.target.value })} placeholder="Nama pilihan, misalnya Keju" className="min-w-0 rounded-lg border border-gray-200 px-2.5 py-2 text-xs" />
                               <input type="number" min="0" step="500" value={option.price} onChange={(event) => updateOption(group.id, option.id, { price: Number(event.target.value) || 0 })} aria-label={`Harga tambahan ${option.name || "pilihan"}`} className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs" placeholder="Tambah Rp" />
                               <button type="button" onClick={() => removeOption(group.id, option.id)} aria-label="Hapus pilihan" className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><XCircle className="h-4 w-4" /></button>
                             </div>
                           ))}
                           <button type="button" onClick={() => addOption(group.id)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-bold text-orange-700 hover:bg-orange-50"><Plus className="h-3 w-3" /> Tambah pilihan</button>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </section>

               <label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><input type="checkbox" checked={menuForm.active} onChange={(event) => setMenuForm({ ...menuForm, active: event.target.checked })} /> Tampilkan di Jajan YUK</label>
               <button type="button" onClick={() => void saveMenu()} disabled={saving === (editingMenuId ?? "new")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-black text-white hover:bg-orange-600 disabled:opacity-50">{saving === (editingMenuId ?? "new") ? <Loader2 className="h-4 w-4 animate-spin" /> : editingMenuId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {editingMenuId ? "Simpan menu" : "Tambah menu"}</button>
             </div>
           </section>
        </div>
      )}
    </div>
  );
}