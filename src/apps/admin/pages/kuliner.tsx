import { useEffect, useState, useRef, useCallback } from "react";
import { ContentTable } from "@/apps/admin/components/content-table";
import { Modal, Field, inputCls, textareaCls, FormActions } from "@/apps/admin/components/modal";
import { ImageUpload } from "@/apps/admin/components/image-upload";
import { api } from "@/apps/admin/lib/api";
import { cleanCommaList, cleanDescription, cleanLocation, cleanPlaceName, cleanText } from "@/apps/admin/lib/text";
import { Plus, X, Loader2 } from "lucide-react";

type Row = Record<string, unknown>;
const MAX_CAFE_PHOTOS = 4;
const empty = {
  name: "", category: "Makanan Berat", image: "", location: "",
  description: "", featured: false, hours: "", active: true,
  phone: "", google_maps_url: "", maps_embed_url: "", price_range: "",
  instagram: "", website: "", facilities: "", reservasi_enabled: false,
};
const kulinerCategories = ["Makanan Berat", "Snack", "Minuman", "Dessert", "Oleh-oleh"];

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
    });
}

function uniquePhotoCount(mainImage: string, gallery: string[]): number {
  const keys = new Set([photoIdentity(mainImage), ...gallery.map(photoIdentity)].filter(Boolean));
  return keys.size;
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

function KulinerManager({ cafeMode = false }: { cafeMode?: boolean }) {
  const categories = cafeMode ? ["Cafe"] : kulinerCategories;
  const contentApi = cafeMode ? api.cafe : api.kuliner;
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof empty>(empty);
  const [photos, setPhotos] = useState<string[]>([]);
  const [cafePhotoPolicyConfirmed, setCafePhotoPolicyConfirmed] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [saving, setSaving] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const load = () => { setLoading(true); contentApi.list().then(setData).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(empty);
    setPhotos([]);
    setCafePhotoPolicyConfirmed(false);
    setPhotoError("");
    setModal({ open: true, editing: null });
  }
  function openEdit(row: Row) {
    setForm({
      name:           String(row.name ?? ""),
      category:       String(row.category ?? "Makanan Berat"),
      image:          String(row.image ?? ""),
      location:       String(row.location ?? ""),
      description:    String(row.description ?? ""),
      featured:       Boolean(row.featured),
      hours:          String(row.hours ?? ""),
      active:         Boolean(row.active),
      phone:          String(row.phone ?? ""),
      google_maps_url:String(row.google_maps_url ?? ""),
      maps_embed_url: String(row.maps_embed_url ?? ""),
      price_range:    String(row.price_range ?? ""),
      instagram:      String(row.instagram ?? ""),
      website:           String(row.website ?? ""),
      facilities:        String(row.facilities ?? ""),
      reservasi_enabled: Boolean(row.reservasi_enabled),
    });
    setPhotos(uniquePhotos(row.photos, String(row.image ?? "")));
    setCafePhotoPolicyConfirmed(false);
    setPhotoError("");
    setModal({ open: true, editing: row });
  }

  const uploadPhoto = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (cafeMode && uniquePhotoCount(form.image, [...photos, "__new_photo__"]) > MAX_CAFE_PHOTOS) {
      setPhotoError(`Cafe maksimal ${MAX_CAFE_PHOTOS} foto termasuk foto utama.`);
      return;
    }
    setUploadingPhoto(true);
    try {
      const url = await api.uploadImage(file);
      const key = photoIdentity(url);
      const existing = new Set([
        photoIdentity(form.image),
        ...photos.map(photoIdentity),
      ].filter(Boolean));
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
    if (cafeMode && url && hasDuplicatePhotos(url, photos)) {
      setPhotoError("Foto Cafe tidak boleh menggunakan foto yang sama lebih dari sekali.");
      return;
    }
    if (cafeMode && uniquePhotoCount(url, photos) > MAX_CAFE_PHOTOS) {
      setPhotoError(`Cafe maksimal ${MAX_CAFE_PHOTOS} foto termasuk foto utama.`);
      return;
    }
    setPhotoError("");
    setForm(p => ({ ...p, image: url }));
  }

  async function handleDelete(row: Row) { await contentApi.delete(Number(row.id)); load(); }
  async function handleBulkDelete(ids: number[]) { await contentApi.bulkDelete(ids); load(); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      if (cafeMode && hasDuplicatePhotos(form.image, photos)) {
        setPhotoError("Foto Cafe tidak boleh menggunakan foto yang sama lebih dari sekali.");
        return;
      }
      if (cafeMode && uniquePhotoCount(form.image, photos) > MAX_CAFE_PHOTOS) {
        setPhotoError(`Cafe maksimal ${MAX_CAFE_PHOTOS} foto termasuk foto utama.`);
        return;
      }
      if (cafeMode && !cafePhotoPolicyConfirmed) {
        setPhotoError("Centang konfirmasi bahwa foto Cafe hanya menampilkan lokasi/suasana, tanpa makanan atau minuman.");
        return;
      }
      const cleanPhotos = uniquePhotos(photos, form.image);
      const payload = {
        ...form,
        name:            cleanPlaceName(form.name),
        category:        cleanPlaceName(form.category),
        location:        cleanLocation(form.location),
        description:     cleanDescription(form.description, form.name, cleanPlaceName(form.name)),
        hours:           cleanText(form.hours),
        phone:           form.phone || null,
        google_maps_url: form.google_maps_url || null,
        maps_embed_url:  form.maps_embed_url || null,
        price_range:     form.price_range || null,
        instagram:       form.instagram || null,
        website:         form.website || null,
        facilities:      cleanCommaList(form.facilities) || null,
        photos: cleanPhotos,
        cafe_photo_policy_confirmed: cafeMode ? cafePhotoPolicyConfirmed : undefined,
      };
       if (modal.editing) await contentApi.update(Number(modal.editing.id), payload);
       else await contentApi.create(payload);
      setModal({ open: false, editing: null }); load();
    } catch (err: any) {
      if (cafeMode) setPhotoError(err?.message || "Gagal menyimpan data Cafe.");
      else throw err;
    } finally { setSaving(false); }
  }
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const cols = [
    {
      key: "image", label: "Foto",
      render: (v: unknown) => v ? (
        <img src={String(v)} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" onError={e => { e.currentTarget.style.display = "none"; }} />
      ) : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">–</div>
    },
    ...(cafeMode ? [{
      key: "photos", label: "Jumlah Foto",
      render: (_v: unknown, row: Row) => {
        const count = (row.image ? 1 : 0) + (Array.isArray(row.photos) ? row.photos.length : 0);
        return <span className="text-xs font-semibold text-gray-600">{count} foto</span>;
      },
    }] : []),
    { key: "name", label: "Nama" },
     ...(!cafeMode ? [{ key: "category", label: "Kategori" }] : []),
    {
      key: "rating", label: "Google Maps",
      render: (v: unknown) => v != null && Number(v) > 0
        ? <span className="font-semibold text-yellow-600">⭐ {Number(v).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
        : <span className="text-gray-300 text-xs">–</span>,
    },
    {
      key: "computed_rating", label: "Ulasan Nempo",
      render: (v: unknown, row: Row) => v != null
        ? <span className="font-semibold text-amber-600">⭐ {String(v)} <span className="text-gray-400 text-xs">({String(row.review_count)})</span></span>
        : <span className="text-gray-400 text-xs">Belum ada</span>
    },
    { key: "location", label: "Lokasi" },
    { key: "hours", label: "Jam Buka" },
    { key: "price_range", label: "Harga", render: (v: unknown) => v ? <span className="text-xs text-gray-600">{String(v)}</span> : <span className="text-gray-300">–</span> },
    { key: "featured", label: "Featured", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"}`}>{v ? "Ya" : "Tidak"}</span> },
    { key: "active", label: "Status", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{v ? "Aktif" : "Nonaktif"}</span> },
    { key: "reservasi_enabled", label: "Reservasi", render: (v: unknown) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-400"}`}>{v ? "✓ Aktif" : "–"}</span> },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">{cafeMode ? "Cafe" : "Kuliner"}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
           {cafeMode ? "Kelola data cafe Jawa Barat · Cafe tetap tampil meski jumlah fotonya belum lengkap" : "Kelola data kuliner umum Jawa Barat"}
        </p>
      </div>
      <ContentTable title={cafeMode ? "Daftar Cafe" : "Daftar Kuliner"} cols={cols} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onRefresh={load} onBulkDelete={handleBulkDelete} />

      <Modal title={modal.editing ? `Edit ${cafeMode ? "Cafe" : "Kuliner"}` : `Tambah ${cafeMode ? "Cafe" : "Kuliner"}`} open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="col-span-2">
              <Field label="Foto Utama">
                <ImageUpload value={form.image} onChange={changeMainImage} />
              </Field>
            </div>

            {/* Multi-photo gallery */}
            <div className="col-span-2">
              <Field label="Foto Tambahan (gallery)">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {photos.map((url, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200" style={{ aspectRatio: "4/3" }}>
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                   <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                     disabled={uploadingPhoto || (cafeMode && uniquePhotoCount(form.image, photos) >= MAX_CAFE_PHOTOS)}
                    className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-500 transition-all cursor-pointer disabled:opacity-50"
                    style={{ aspectRatio: "4/3" }}
                  >
                    {uploadingPhoto
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : <><Plus className="w-5 h-5" /><span className="text-xs font-medium">Tambah</span></>
                    }
                  </button>
                </div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) uploadPhoto(file);
                    e.target.value = "";
                  }}
                />
                 <p className="text-xs text-gray-400">Foto utama tidak dihitung ulang di galeri. Foto yang sama tidak boleh dipakai dua kali.</p>
                 {cafeMode && (
                  <>
                    <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                      <p className="text-xs font-bold text-amber-800">Aturan foto Cafe</p>
                      <p className="text-xs text-amber-700 mt-0.5">Gunakan foto lokasi, interior, eksterior, dan suasana/vibes saja. Foto makanan atau minuman tidak diperbolehkan.</p>
                    </div>
                    <p className="text-xs mt-1.5 font-medium text-gray-600">
                       {uniquePhotoCount(form.image, photos)}/{MAX_CAFE_PHOTOS} foto lokasi berbeda dipilih. Cafe tetap dapat ditampilkan meskipun jumlah foto belum lengkap.
                    </p>
                  </>
                 )}
                  {cafeMode && (
                    <label className="mt-2 flex items-start gap-2 cursor-pointer text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={cafePhotoPolicyConfirmed}
                        onChange={e => {
                          setCafePhotoPolicyConfirmed(e.target.checked);
                          if (e.target.checked && photoError.includes("tanpa makanan")) setPhotoError("");
                        }}
                        className="mt-0.5 h-4 w-4 rounded accent-amber-600"
                      />
                      <span>Saya memastikan semua foto Cafe hanya menampilkan lokasi/suasana, tanpa foto makanan atau minuman.</span>
                    </label>
                  )}
                  {photoError && <p className="text-xs mt-1.5 font-medium text-red-600">{photoError}</p>}
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="Nama" required>
                <input className={inputCls} value={form.name} onChange={f("name")} required placeholder={cafeMode ? "Nama cafe..." : "Nama kuliner atau restoran..."} />
              </Field>
            </div>
            <Field label="Kategori">
              {cafeMode ? (
                <input className={`${inputCls} bg-gray-50 text-gray-500`} value="Cafe" readOnly />
              ) : (
                <select className={inputCls} value={form.category} onChange={f("category")}>{categories.map(c => <option key={c}>{c}</option>)}</select>
              )}
              {!cafeMode && form.category === "Cafe" && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                  <span>☕</span>
                  <span>Data cafe dikelola dari menu <strong>Cafe</strong></span>
                </div>
              )}
            </Field>
            <Field label="Jam Buka">
              <input className={inputCls} value={form.hours} onChange={f("hours")} placeholder="09.00 – 21.00" />
            </Field>
            <Field label="Kisaran Harga">
              <input className={inputCls} value={form.price_range} onChange={f("price_range")} placeholder="Rp 10.000 – Rp 30.000" />
            </Field>
            <Field label="Nomor Telepon">
              <input className={inputCls} value={form.phone} onChange={f("phone")} placeholder="0812-3456-7890" />
            </Field>
            <Field label="Instagram">
              <input className={inputCls} value={form.instagram} onChange={f("instagram")} placeholder="@namakuliner" />
            </Field>
            <Field label="Website">
              <input className={inputCls} value={form.website} onChange={f("website")} placeholder="https://namakuliner.com" />
            </Field>
            <Field label="Lokasi" required>
              <input className={inputCls} value={form.location} onChange={f("location")} required placeholder="Kecamatan, Garut" />
            </Field>
            <Field label="Link Google Maps">
              <input className={inputCls} value={form.google_maps_url} onChange={f("google_maps_url")} placeholder="https://maps.google.com/..." />
            </Field>
            <div className="col-span-2">
              <Field label="Embed Maps (opsional)">
                <input className={inputCls} value={form.maps_embed_url} onChange={f("maps_embed_url")} placeholder="https://www.google.com/maps/embed?..." />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Fasilitas (pisahkan dengan koma)">
                <input className={inputCls} value={form.facilities} onChange={f("facilities")} placeholder="Parkir,Toilet,WiFi,Mushola,Area Makan Outdoor" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Deskripsi">
                <textarea className={textareaCls} rows={3} value={form.description} onChange={f("description")} placeholder="Deskripsi singkat..." />
              </Field>
            </div>
          </div>
          <div className="flex gap-5 mb-1 flex-wrap">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
              <span>Tampilkan sebagai Featured</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
              <span>Tampilkan di Website</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.reservasi_enabled} onChange={e => setForm(p => ({ ...p, reservasi_enabled: e.target.checked }))} className="w-4 h-4 rounded accent-emerald-600" />
              <span className="font-semibold text-emerald-700">Aktifkan Fitur Reservasi</span>
            </label>
          </div>
          <FormActions
            onCancel={() => setModal({ open: false, editing: null })}
            loading={saving}
            disabled={cafeMode && (hasDuplicatePhotos(form.image, photos) || !cafePhotoPolicyConfirmed)}
          />
        </form>
      </Modal>
    </>
  );
}

export default function KulinerPage() {
  return <KulinerManager />;
}

export function CafeManager() {
  return <KulinerManager cafeMode />;
}
