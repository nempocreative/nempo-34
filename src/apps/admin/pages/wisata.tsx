import { useEffect, useState, useRef, useCallback } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, textareaCls, FormActions } from "@/apps/admin/components/modal";
import { ImageUpload } from "@/apps/admin/components/image-upload";
import { api } from "@/apps/admin/lib/api";
import { cleanDescription, cleanLocation, cleanPlaceName, cleanText } from "@/apps/admin/lib/text";
import { Plus, X, Loader2 } from "lucide-react";

type Row = Record<string, unknown>;
const MAX_WISATA_PHOTOS = 4;

const empty = {
  name: "", category: "Alam", entry_fee: "0", image: "",
  location: "", description: "", partner: false, active: true,
  phone: "", website: "", opening_hours: "08.00 - 17.00",
  facilities: "", maps_embed_url: "", google_maps_url: "", instagram: "",
};
const categories = ["Alam", "Budaya", "Sejarah", "Buatan", "Religi"];

function photoIdentity(photo: string): string {
  const value = photo.trim();
  if (!value) return "";
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return value.replace(/\s+/g, " ").replace(/\/$/, "").toLowerCase();
  }
}

function uniquePhotos(rawPhotos: unknown, mainImage = ""): string[] {
  let values: unknown[] = [];
  if (Array.isArray(rawPhotos)) values = rawPhotos;
  else if (typeof rawPhotos === "string") {
    try {
      const parsed = JSON.parse(rawPhotos);
      if (Array.isArray(parsed)) values = parsed;
    } catch {
      values = [];
    }
  }
  const seen = new Set<string>();
  const mainKey = photoIdentity(mainImage);
  return values
    .filter((photo): photo is string => typeof photo === "string" && photo.trim().length > 0)
    .map(photo => photo.trim())
    .filter(photo => {
      const key = photoIdentity(photo);
      if (!key || key === mainKey || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, Math.max(0, MAX_WISATA_PHOTOS - (mainImage ? 1 : 0)));
}

function uniquePhotoCount(mainImage: string, gallery: string[]): number {
  return new Set([photoIdentity(mainImage), ...gallery.map(photoIdentity)].filter(Boolean)).size;
}

function hasDuplicatePhotos(mainImage: string, gallery: string[]): boolean {
  const seen = new Set<string>();
  for (const photo of [mainImage, ...gallery]) {
    const key = photoIdentity(photo);
    if (!key) continue;
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}

export default function WisataPage() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [saving, setSaving] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    api.wisata.list().then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(empty);
    setPhotos([]);
    setPhotoError("");
    setModal({ open: true, editing: null });
  }
  function openEdit(row: Row) {
    setForm({
      name: String(row.name ?? ""),
      category: String(row.category ?? "Alam"),
      entry_fee: String(row.entry_fee ?? "0"),
      image: String(row.image ?? ""),
      location: String(row.location ?? ""),
      description: String(row.description ?? ""),
      partner: Boolean(row.partner),
      active: Boolean(row.active),
      phone: String(row.phone ?? ""),
      website: String(row.website ?? ""),
      opening_hours: String(row.opening_hours ?? "08.00 - 17.00"),
      facilities: String(row.facilities ?? ""),
      maps_embed_url: String(row.maps_embed_url ?? ""),
      google_maps_url: String(row.google_maps_url ?? ""),
      instagram: String(row.instagram ?? ""),
    });
    setPhotos(uniquePhotos(row.photos, String(row.image ?? "")));
    setPhotoError("");
    setModal({ open: true, editing: row });
  }

  const uploadPhoto = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (uniquePhotoCount(form.image, [...photos, "__new_photo__"]) > MAX_WISATA_PHOTOS) {
      setPhotoError(`Wisata maksimal ${MAX_WISATA_PHOTOS} foto termasuk foto utama.`);
      return;
    }
    setUploadingPhoto(true);
    try {
      const url = await api.uploadImage(file);
      const key = photoIdentity(url);
      const existing = new Set([photoIdentity(form.image), ...photos.map(photoIdentity)].filter(Boolean));
      if (existing.has(key)) {
        setPhotoError("Foto ini sudah dipilih dan tidak boleh dimasukkan dua kali.");
        return;
      }
      setPhotoError("");
      setPhotos(prev => [...prev, url]);
    } finally {
      setUploadingPhoto(false);
    }
  }, [form.image, photos]);

  function changeMainImage(url: string) {
    if (url && hasDuplicatePhotos(url, photos)) {
      setPhotoError("Wisata tidak boleh menggunakan foto yang sama lebih dari sekali.");
      return;
    }
    if (uniquePhotoCount(url, photos) > MAX_WISATA_PHOTOS) {
      setPhotoError(`Wisata maksimal ${MAX_WISATA_PHOTOS} foto termasuk foto utama.`);
      return;
    }
    setPhotoError("");
    setForm(p => ({ ...p, image: url }));
  }

  async function handleDelete(row: Row) {
    await api.wisata.delete(Number(row.id));
    load();
  }

  async function handleBulkDelete(ids: number[]) {
    await api.wisata.bulkDelete(ids);
    load();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        name: cleanPlaceName(form.name),
        category: cleanPlaceName(form.category),
        location: cleanLocation(form.location),
        description: cleanDescription(form.description, form.name, cleanPlaceName(form.name)),
        opening_hours: cleanText(form.opening_hours),
        entry_fee: parseInt(form.entry_fee),
        photos: uniquePhotos(photos, form.image),
      };
      if (hasDuplicatePhotos(form.image, photos)) {
        setPhotoError("Wisata tidak boleh menggunakan foto yang sama lebih dari sekali.");
        return;
      }
      if (uniquePhotoCount(form.image, photos) > MAX_WISATA_PHOTOS) {
        setPhotoError(`Wisata maksimal ${MAX_WISATA_PHOTOS} foto termasuk foto utama.`);
        return;
      }
      if (modal.editing) await api.wisata.update(Number(modal.editing.id), payload);
      else await api.wisata.create(payload);
      setModal({ open: false, editing: null });
      load();
    } finally { setSaving(false); }
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const cols = [
    {
      key: "image", label: "Foto",
      render: (v: unknown) => v ? (
        <img src={String(v)} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" onError={e => { e.currentTarget.style.display = "none"; }} />
      ) : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">–</div>
    },
    {
      key: "photos", label: "Jumlah Foto",
      render: (_v: unknown, row: Row) => {
        const count = (row.image ? 1 : 0) + (Array.isArray(row.photos) ? row.photos.length : 0);
        return <span className="text-xs font-semibold text-gray-600">{count} foto</span>;
      },
    },
    { key: "name", label: "Nama" },
    { key: "category", label: "Kategori" },
    {
      key: "rating", label: "Google Maps",
      render: (v: unknown) => v != null && Number(v) > 0
        ? <span className="font-semibold text-yellow-600">⭐ {Number(v).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
        : <span className="text-gray-300 text-xs">–</span>,
    },
    {
      key: "computed_rating", label: "Ulasan Nempo",
      render: (v: unknown, row: Row) =>
        v != null
          ? <span className="font-semibold text-amber-600">⭐ {String(v)} <span className="text-gray-400 text-[10px]">({String(row.review_count)} ulasan)</span></span>
          : <span className="text-gray-300 text-xs">{Number(row.review_count) > 0 ? `${String(row.review_count)} ulasan` : "–"}</span>
    },
    { key: "entry_fee", label: "HTM", render: (v: unknown) => `Rp ${Number(v).toLocaleString("id")}` },
    { key: "opening_hours", label: "Jam Buka" },
    { key: "location", label: "Lokasi" },
    { key: "partner", label: "Partner", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{v ? "Ya" : "Tidak"}</span> },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Wisata</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola data destinasi wisata Jawa Barat</p>
      </div>
      <ContentTable title="Daftar Wisata" cols={cols} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} onBulkDelete={handleBulkDelete} />

      <Modal title={modal.editing ? "Edit Destinasi Wisata" : "Tambah Destinasi Wisata"} open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="col-span-2">
              <Field label="Foto Destinasi">
                <ImageUpload value={form.image} onChange={changeMainImage} />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Foto Tambahan (gallery)">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {photos.map((url, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200" style={{ aspectRatio: "4/3" }}>
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto || uniquePhotoCount(form.image, photos) >= MAX_WISATA_PHOTOS}
                    className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-500 transition-all cursor-pointer disabled:opacity-50"
                    style={{ aspectRatio: "4/3" }}>
                    {uploadingPhoto ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /><span className="text-xs font-medium">Tambah</span></>}
                  </button>
                </div>
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const file = e.target.files?.[0]; if (file) uploadPhoto(file); e.target.value = ""; }} />
                <p className="text-xs text-gray-400">Maksimal {MAX_WISATA_PHOTOS} foto termasuk foto utama. Foto yang sama tidak boleh dipakai dua kali.</p>
                <p className="text-xs mt-1.5 font-medium text-gray-600">{uniquePhotoCount(form.image, photos)}/{MAX_WISATA_PHOTOS} foto lokasi dipilih.</p>
                {photoError && <p className="text-xs mt-1.5 font-medium text-red-600">{photoError}</p>}
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Nama Destinasi" required>
                <input className={inputCls} value={form.name} onChange={f("name")} required placeholder="Nama destinasi wisata..." />
              </Field>
            </div>
            <Field label="Kategori">
              <select className={inputCls} value={form.category} onChange={f("category")}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Lokasi" required>
              <input className={inputCls} value={form.location} onChange={f("location")} required placeholder="Kecamatan, Garut" />
            </Field>
            <Field label="HTM / Tiket Masuk (Rp)">
              <input className={inputCls} type="number" min="0" value={form.entry_fee} onChange={f("entry_fee")} />
            </Field>
            <Field label="Jam Operasional">
              <input className={inputCls} value={form.opening_hours} onChange={f("opening_hours")} placeholder="08.00 - 17.00" />
            </Field>
            <Field label="No. Telepon">
              <input className={inputCls} value={form.phone} onChange={f("phone")} placeholder="0812xxxxxxxx" />
            </Field>
            <Field label="Instagram">
              <input className={inputCls} value={form.instagram} onChange={f("instagram")} placeholder="@namadestinasi" />
            </Field>
            <div className="col-span-2">
              <Field label="Website Resmi">
                <input className={inputCls} value={form.website} onChange={f("website")} placeholder="https://..." />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Fasilitas (pisah dengan koma)">
                <input className={inputCls} value={form.facilities} onChange={f("facilities")} placeholder="Parkir,Toilet,Warung Makan,Mushola" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Link Google Maps">
                <input className={inputCls} value={form.google_maps_url} onChange={f("google_maps_url")} placeholder="https://maps.google.com/..." />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Google Maps Embed URL">
                <input className={inputCls} value={form.maps_embed_url} onChange={f("maps_embed_url")} placeholder="https://www.google.com/maps/embed?pb=..." />
              </Field>
              <p className="text-[10px] text-gray-400 mt-1">Buka Google Maps → Share → Embed a map → copy URL dari src="..."</p>
            </div>
            <div className="col-span-2">
              <Field label="Deskripsi">
                <textarea className={textareaCls} rows={3} value={form.description} onChange={f("description")} placeholder="Deskripsi singkat destinasi..." />
              </Field>
            </div>
          </div>
          <div className="flex gap-5 mb-1">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.partner} onChange={e => setForm(p => ({ ...p, partner: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
              <span>Partner Nempo</span>
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
