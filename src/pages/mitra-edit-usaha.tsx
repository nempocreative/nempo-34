import { useEffect, useRef, useState } from "react";
import { useLocation } from "@/lib/wouter";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useAuth } from "@/contexts/auth-context";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import {
  ArrowLeft, Store, MapPin, Clock, Phone, FileText, Star, Wallet, Calendar,
  Ticket, Globe, Loader2, AlertCircle, CheckCircle, Upload, ImageIcon, X,
  BedDouble, Utensils, ChevronRight, Tag, Info, Link2,
} from "lucide-react";

const API = "/api";

type ListingType = "wisata" | "kuliner" | "penginapan" | "event";

type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "time" | "list" | "image" | "url";
  placeholder?: string;
  hint?: string;
};

const FIELDS: Record<string, FieldDef> = {
  name:             { key: "name",             label: "Nama Usaha",                type: "text",     placeholder: "Nama usaha atau destinasi Anda" },
  title:            { key: "title",            label: "Judul Tambahan",            type: "text",     placeholder: "Sub-judul atau tagline event" },
  image:            { key: "image",            label: "Foto Utama",                type: "image" },
  location:         { key: "location",         label: "Lokasi",                    type: "text",     placeholder: "Alamat lengkap atau nama daerah" },
  description:      { key: "description",      label: "Deskripsi",                 type: "textarea", placeholder: "Ceritakan tentang usaha atau destinasi Anda..." },
  opening_hours:    { key: "opening_hours",    label: "Jam Buka",                  type: "text",     placeholder: "Contoh: 07.00 – 18.00 WIB" },
  hours:            { key: "hours",            label: "Jam Buka",                  type: "text",     placeholder: "Contoh: 10.00 – 22.00 WIB" },
  facilities:       { key: "facilities",       label: "Fasilitas",                 type: "list",     placeholder: "Parkir, Toilet, Mushola, WiFi ...", hint: "Pisahkan setiap fasilitas dengan koma" },
  amenities:        { key: "amenities",        label: "Fasilitas & Amenitas",      type: "list",     placeholder: "AC, WiFi, Kolam Renang, Sarapan ...", hint: "Pisahkan setiap fasilitas dengan koma" },
  phone:            { key: "phone",            label: "Nomor Telepon / WhatsApp",  type: "text",     placeholder: "0812-xxxx-xxxx" },
  google_maps_url:  { key: "google_maps_url",  label: "Link Google Maps",          type: "url",      placeholder: "https://maps.google.com/...", hint: "Paste URL dari Google Maps agar pengunjung mudah menemukan lokasi Anda" },
  price_range:      { key: "price_range",      label: "Kisaran Harga",             type: "text",     placeholder: "Contoh: Rp 20.000 – Rp 80.000" },
  price_per_night:  { key: "price_per_night",  label: "Harga per Malam (Rp)",      type: "number",   placeholder: "150000" },
  price:            { key: "price",            label: "Harga Tiket (Rp)",          type: "number",   placeholder: "50000" },
  date:             { key: "date",             label: "Tanggal Mulai",             type: "date" },
  date_end:         { key: "date_end",         label: "Tanggal Selesai",           type: "date" },
  time_start:       { key: "time_start",       label: "Jam Mulai",                 type: "time" },
  time_end:         { key: "time_end",         label: "Jam Selesai",               type: "time" },
};

type SectionDef = { title: string; icon: React.ElementType; iconColor: string; iconBg: string; fields: string[] };

const SECTIONS_BY_TYPE: Record<ListingType, SectionDef[]> = {
  wisata: [
    { title: "Identitas Usaha",        icon: Store,       iconColor: "text-blue-600",    iconBg: "bg-blue-50",    fields: ["name", "image"] },
    { title: "Lokasi & Jam Buka",      icon: MapPin,      iconColor: "text-red-500",     iconBg: "bg-red-50",     fields: ["location", "opening_hours", "google_maps_url"] },
    { title: "Deskripsi",              icon: FileText,    iconColor: "text-violet-600",  iconBg: "bg-violet-50",  fields: ["description"] },
    { title: "Fasilitas",              icon: Star,        iconColor: "text-amber-500",   iconBg: "bg-amber-50",   fields: ["facilities"] },
    { title: "Kontak",                 icon: Phone,       iconColor: "text-emerald-600", iconBg: "bg-emerald-50", fields: ["phone"] },
  ],
  kuliner: [
    { title: "Identitas Usaha",        icon: Utensils,    iconColor: "text-orange-500",  iconBg: "bg-orange-50",  fields: ["name", "image"] },
    { title: "Lokasi & Jam Buka",      icon: MapPin,      iconColor: "text-red-500",     iconBg: "bg-red-50",     fields: ["location", "hours", "google_maps_url"] },
    { title: "Deskripsi",              icon: FileText,    iconColor: "text-violet-600",  iconBg: "bg-violet-50",  fields: ["description"] },
    { title: "Harga & Fasilitas",      icon: Tag,         iconColor: "text-pink-500",    iconBg: "bg-pink-50",    fields: ["price_range", "facilities"] },
    { title: "Kontak",                 icon: Phone,       iconColor: "text-emerald-600", iconBg: "bg-emerald-50", fields: ["phone"] },
  ],
  penginapan: [
    { title: "Identitas Penginapan",   icon: BedDouble,   iconColor: "text-indigo-600",  iconBg: "bg-indigo-50",  fields: ["name", "image"] },
    { title: "Lokasi",                 icon: MapPin,      iconColor: "text-red-500",     iconBg: "bg-red-50",     fields: ["location", "google_maps_url"] },
    { title: "Deskripsi",              icon: FileText,    iconColor: "text-violet-600",  iconBg: "bg-violet-50",  fields: ["description"] },
    { title: "Harga per Malam",        icon: Wallet,      iconColor: "text-blue-600",    iconBg: "bg-blue-50",    fields: ["price_per_night"] },
    { title: "Fasilitas & Amenitas",   icon: Star,        iconColor: "text-amber-500",   iconBg: "bg-amber-50",   fields: ["amenities"] },
  ],
  event: [
    { title: "Identitas Event",        icon: Calendar,    iconColor: "text-blue-600",    iconBg: "bg-blue-50",    fields: ["name", "title", "image"] },
    { title: "Lokasi",                 icon: MapPin,      iconColor: "text-red-500",     iconBg: "bg-red-50",     fields: ["location", "google_maps_url"] },
    { title: "Deskripsi",              icon: FileText,    iconColor: "text-violet-600",  iconBg: "bg-violet-50",  fields: ["description"] },
    { title: "Jadwal",                 icon: Clock,       iconColor: "text-emerald-600", iconBg: "bg-emerald-50", fields: ["date", "date_end", "time_start", "time_end"] },
    { title: "Tiket",                  icon: Ticket,      iconColor: "text-pink-500",    iconBg: "bg-pink-50",    fields: ["price"] },
  ],
};

const TYPE_LABEL: Record<ListingType, string> = {
  wisata: "Wisata", kuliner: "Kuliner", penginapan: "Penginapan", event: "Event",
};
const TYPE_COLOR: Record<ListingType, string> = {
  wisata: "text-blue-600 bg-blue-50",
  kuliner: "text-orange-600 bg-orange-50",
  penginapan: "text-indigo-600 bg-indigo-50",
  event: "text-violet-600 bg-violet-50",
};

async function apiReq(method: string, path: string, token: string, body?: unknown) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");
  return data;
}

async function uploadImage(token: string, file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API}/auth/mitra-me/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal upload gambar");
  return data.url;
}

function ImageField({ value, onChange, token }: { value: string; onChange: (url: string) => void; token: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { setErr("Hanya file gambar yang diizinkan"); return; }
    if (file.size > 5 * 1024 * 1024) { setErr("Ukuran file maksimal 5MB"); return; }
    setErr(""); setUploading(true);
    try { onChange(await uploadImage(token, file)); }
    catch (e: any) { setErr(e.message); }
    finally { setUploading(false); }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full rounded-2xl overflow-hidden bg-gray-100 aspect-video max-h-56">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-gray-800 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Ganti Foto
            </button>
            <button type="button" onClick={() => onChange("")}
              className="px-3 py-1.5 bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          className="w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-gray-400 hover:border-[#0194f3] hover:text-[#0194f3] transition-colors disabled:opacity-60">
          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">Pilih atau drop foto di sini</p>
               <p className="text-xs mt-0.5">JPG, PNG, WebP — maks 5MB · otomatis WebP ≤450KB · sisi maks 1600px</p>
            </div>
          </>}
        </button>
      )}
      {value && !uploading && (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs font-bold text-[#0194f3] hover:underline">
          <Upload className="w-3 h-3" /> Ganti foto
        </button>
      )}
      {uploading && <p className="text-xs text-gray-400 flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" />Mengupload foto...</p>}
      {err && <p className="text-xs text-red-500">{err}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
    </div>
  );
}

function FieldInput({
  field, value, onChange, token,
}: { field: FieldDef; value: any; onChange: (v: any) => void; token: string }) {
  const cls = "w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/10 transition-all";

  if (field.type === "image") {
    return <ImageField value={value ?? ""} onChange={onChange} token={token} />;
  }
  if (field.type === "textarea") {
    return (
      <textarea rows={5} value={value ?? ""} onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder} className={`${cls} resize-none`} />
    );
  }
  if (field.type === "list") {
    return (
      <input type="text" value={value ?? ""} onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder} className={cls} />
    );
  }
  return (
    <input
      type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "time" ? "time" : field.type === "url" ? "url" : "text"}
      value={value ?? ""} onChange={e => onChange(e.target.value)}
      placeholder={field.placeholder} className={cls}
    />
  );
}

export default function MitraEditUsahaPage() {
  const [, setLocation] = useLocation();
  const { mitraToken, mitra } = useAuth();

  // Read optional ?type=X&id=Y from URL for multi-listing support
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const urlType = searchParams.get("type") ?? undefined;
  const urlId   = searchParams.get("id")   ?? undefined;
  const listingQuery = urlType && urlId ? `?type=${urlType}&id=${urlId}` : "";

  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [listingType, setListingType] = useState<ListingType | null>(null);
  const [listingId, setListingId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Redirect if not logged in as mitra
  useEffect(() => {
    if (!mitraToken && mitra === null) setLocation("/mitra-dashboard");
  }, [mitraToken, mitra]);

  useEffect(() => {
    if (!mitraToken) return;
    setLoadingData(true); setFetchError("");
    apiReq("GET", `/auth/mitra-me/listing${listingQuery}`, mitraToken)
      .then(d => {
        const type: ListingType = d.listing_type;
        setListingType(type);
        setListingId(d.listing?.id ?? null);
        const listing = d.listing ?? {};
        const sections = SECTIONS_BY_TYPE[type] ?? [];
        const allKeys = sections.flatMap(s => s.fields);
        const f: Record<string, any> = {};
        for (const key of allKeys) {
          const fd = FIELDS[key];
          if (!fd) continue;
          const v = listing[fd.key];
          f[fd.key] = fd.type === "list" ? (Array.isArray(v) ? v.join(", ") : (v || "")) : (v ?? "");
        }
        setForm(f);
      })
      .catch(err => setFetchError(err.message))
      .finally(() => setLoadingData(false));
  }, [mitraToken]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!listingType || !mitraToken) return;
    setSaving(true); setSaveError(""); setSaveSuccess(false);
    const putQuery = listingId ? `?type=${listingType}&id=${listingId}` : listingQuery;
    try {
      const sections = SECTIONS_BY_TYPE[listingType];
      const allKeys = sections.flatMap(s => s.fields);
      const payload: Record<string, any> = {};
      for (const key of allKeys) {
        const fd = FIELDS[key];
        if (!fd) continue;
        if (fd.type === "list") {
          payload[fd.key] = String(form[fd.key] || "").split(",").map((s: string) => s.trim()).filter(Boolean);
        } else if (fd.type === "number") {
          payload[fd.key] = Number(form[fd.key]) || 0;
        } else {
          payload[fd.key] = form[fd.key];
        }
      }
      await apiReq("PUT", `/auth/mitra-me/listing${putQuery}`, mitraToken, payload);
      setSaveSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loadingData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Memuat data usaha...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (fetchError) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-5 py-12 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <p className="font-bold text-gray-800 mb-2">Gagal memuat data</p>
          <p className="text-sm text-gray-500 mb-6">{fetchError}</p>
          <button onClick={() => setLocation("/mitra-dashboard")}
            className="px-5 py-2.5 bg-[#0194f3] text-white rounded-xl text-sm font-bold">
            Kembali ke Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  if (!listingType) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-5 py-12 text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Info className="w-7 h-7 text-amber-500" />
          </div>
          <p className="font-bold text-gray-800 mb-2">Usaha belum ditautkan</p>
          <p className="text-sm text-gray-500 mb-6">
             <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="font-bold underline">
               Hubungi admin Nempo Organizer via DM Instagram
             </a>{" "}
             untuk menautkan usaha atau destinasi ke akun mitra Anda.
          </p>
          <button onClick={() => setLocation("/mitra-dashboard")}
            className="px-5 py-2.5 bg-[#0194f3] text-white rounded-xl text-sm font-bold">
            Kembali ke Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const sections = SECTIONS_BY_TYPE[listingType];

  return (
    <Layout>
      <SEO title="Edit Usaha Mitra" noIndex />
      <div className="pb-32">

        {/* ── Header ── */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-3">
            <button onClick={() => setLocation("/mitra-dashboard")}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-900 text-base leading-tight truncate">Edit Profil Usaha</p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${TYPE_COLOR[listingType]}`}>
                {TYPE_LABEL[listingType]}
              </span>
            </div>
            {saveSuccess && (
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-xl">
                <CheckCircle className="w-3.5 h-3.5" /> Tersimpan
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">

            {saveError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{saveError}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-2xl px-4 py-3">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Profil usaha berhasil diperbarui! Perubahan akan terlihat di halaman publik.</span>
              </div>
            )}

            {sections.map(section => (
              <div key={section.title} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Section header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
                  <div className={`w-9 h-9 rounded-xl ${section.iconBg} flex items-center justify-center shrink-0`}>
                    <section.icon className={`w-[18px] h-[18px] ${section.iconColor}`} strokeWidth={1.8} />
                  </div>
                  <p className="font-black text-gray-800 text-sm">{section.title}</p>
                </div>

                {/* Fields */}
                <div className="px-5 py-4 space-y-5">
                  {section.fields.map(key => {
                    const fd = FIELDS[key];
                    if (!fd) return null;
                    return (
                      <div key={fd.key} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest">
                            {fd.label}
                          </label>
                          {fd.type === "url" && form[fd.key] && (
                            <a href={form[fd.key]} target="_blank" rel="noopener noreferrer"
                              className="text-[11px] text-[#0194f3] font-bold flex items-center gap-1 hover:underline">
                              <Link2 className="w-3 h-3" /> Buka
                            </a>
                          )}
                        </div>
                        <FieldInput
                          field={fd}
                          value={form[fd.key]}
                          token={mitraToken ?? ""}
                          onChange={v => setForm(p => ({ ...p, [fd.key]: v }))}
                        />
                        {fd.hint && (
                          <p className="text-[11px] text-gray-400 flex items-start gap-1">
                            <Info className="w-3 h-3 shrink-0 mt-0.5" /> {fd.hint}
                          </p>
                        )}
                        {fd.type === "list" && form[fd.key] && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {String(form[fd.key]).split(",").map(s => s.trim()).filter(Boolean).map((item, i) => (
                              <span key={i} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-semibold">
                                {item}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          </div>

          {/* ── Sticky save bar ── */}
          <div className="fixed bottom-16 md:bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-2xl">
            <div className="max-w-2xl mx-auto px-4 py-3 flex gap-3">
              <button type="button" onClick={() => setLocation("/mitra-dashboard")}
                className="px-5 py-3.5 rounded-2xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#0172B1] to-[#0194f3] text-white text-sm font-black shadow-lg shadow-[#0194f3]/25 disabled:opacity-60 flex items-center justify-center gap-2 transition-all active:scale-[.98]">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
