import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useRoute } from "@/lib/wouter";
import { Link } from "@/lib/wouter";
import { useState, useEffect } from "react";
import {
  MapPin, Star, Clock, Heart, Share2, ArrowLeft,
  Map, CheckCircle, BadgeCheck, ChevronRight, Phone, Instagram,
  Info, Sun, Users, Ticket, Globe, ExternalLink, X, CalendarDays,
} from "lucide-react";
import { UserRating } from "@/components/user-rating";
import { useWishlist } from "@/lib/use-wishlist";
import { NEMPO_CONSULT_URL } from "@/lib/contact";

interface WisataItem {
  id: number;
  name: string;
  category: string;
  entry_fee: number;
  image: string;
  location: string;
  description: string;
  rating: number | string | null;
  partner: boolean;
  opening_hours: string;
  phone: string | null;
  website: string | null;
  facilities: string | null;
  maps_embed_url: string | null;
  google_maps_url: string | null;
  slug: string;
  photos: string[] | null;
  computed_rating: number | null;
  review_count: number;
}

const catColor: Record<string, string> = {
  Alam:    "bg-emerald-500",
  Sejarah: "bg-blue-500",
  Budaya:  "bg-violet-500",
  Buatan:  "bg-blue-500",
};

const tips: Record<string, string[]> = {
  Alam:    ["Gunakan alas kaki yang nyaman", "Bawa bekal air minum", "Jangan buang sampah sembarangan", "Siapkan jas hujan di musim hujan"],
  Sejarah: ["Hormati situs bersejarah", "Ikuti pemandu wisata lokal", "Tidak diperbolehkan menyentuh artefak", "Bawa kamera untuk dokumentasi"],
  Budaya:  ["Kenakan pakaian sopan", "Minta izin sebelum memotret warga", "Hormati adat istiadat setempat", "Belajar sedikit bahasa Sunda"],
  Buatan:  ["Cek jam operasional sebelum berangkat", "Pesan tiket lebih awal di musim liburan", "Siapkan uang tunai", "Bawa anak-anak untuk edukasi"],
};

function photoIdentity(photo: string): string {
  if (!photo) return "";
  try {
    const url = new URL(photo);
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return photo.replace(/\s+/g, " ").replace(/\/$/, "").toLowerCase();
  }
}

function getUniqueGalleryPhotos(item: WisataItem): string[] {
  const mainKey = photoIdentity(item.image?.trim());
  const seen = new Set<string>();
  return (Array.isArray(item.photos) ? item.photos : []).filter((photo): photo is string => {
    const url = typeof photo === "string" ? photo.trim() : "";
    const key = photoIdentity(url);
    if (!key || key === mainKey || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const TICKET_TYPES = [
  { value: "dewasa", label: "Dewasa" },
  { value: "anak", label: "Anak-anak (3–12 th)" },
  { value: "rombongan", label: "Rombongan" },
];

function useSnapScript() {
  const [snapReady, setSnapReady] = useState(false);
  useEffect(() => {
    if ((window as any).snap) { setSnapReady(true); return undefined; }
    if (document.getElementById("midtrans-snap-script")) {
      const interval = setInterval(() => { if ((window as any).snap) { setSnapReady(true); clearInterval(interval); } }, 200);
      return () => clearInterval(interval);
    }
    fetch("/api/payments/client-key").then(r => r.ok ? r.json() : null).then((cfg: any) => {
      if (!cfg?.clientKey) return;
      const s = document.createElement("script");
      s.id = "midtrans-snap-script";
      s.src = cfg.isProduction ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
      s.setAttribute("data-client-key", cfg.clientKey);
      s.onload = () => setSnapReady(true);
      document.body.appendChild(s);
    }).catch(() => {});
    return undefined;
  }, []);
  return snapReady;
}

function WisataBookingModal({ wisataId, wisataName, entryFee, onClose }: {
  wisataId: number; wisataName: string; entryFee: number; onClose: () => void;
}) {
  const snapReady = useSnapScript();
  const [form, setForm] = useState({
    buyer_name: "", buyer_phone: "", ticket_type: "dewasa",
    qty: 1, visit_date: "", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState("");

  const total = entryFee > 0 ? entryFee * form.qty : 0;
  const today = new Date().toISOString().split("T")[0];

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setSubmitting(true);
    try {
      const res = await fetch("/api/wisata-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, wisata_id: wisataId, total_amount: total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim pesanan");

      // Gratis atau tidak ada harga — langsung selesai
      if (!data.snap_token) {
        setDone(data.order_code);
        setSubmitting(false);
        return;
      }

      // Bayar via Midtrans Snap
      const snapWin = (window as any).snap;
      if (!snapWin) throw new Error("Gagal memuat metode pembayaran. Muat ulang halaman.");
      snapWin.pay(data.snap_token, {
        onSuccess: () => { setDone(data.order_code); setSubmitting(false); },
        onPending: () => { setDone(data.order_code); setSubmitting(false); },
        onError:   () => { setErr("Pembayaran gagal. Silakan coba lagi."); setSubmitting(false); },
        onClose:   () => { setSubmitting(false); },
      });
    } catch (e: any) { setErr(e.message); setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            <p className="font-black text-gray-900 text-sm">Pesan Tiket Masuk</p>
            <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[200px]">{wisataName}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {done ? (
          <div className="p-6 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-7 w-7 text-emerald-600" />
            </div>
            <p className="font-black text-gray-900 mb-1">Pesanan Terkirim!</p>
            <p className="text-xs text-gray-500 mb-3">Kode pesanan Anda:</p>
            <div className="bg-gray-50 rounded-2xl p-4 font-mono text-lg font-black text-gray-800 mb-4 tracking-widest">{done}</div>
            <p className="text-xs text-gray-400 mb-4">Simpan kode ini. Mitra akan segera mengkonfirmasi pesanan Anda.</p>
            <button onClick={onClose} className="w-full bg-emerald-600 text-white font-bold text-sm py-3 rounded-xl">Selesai</button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3">
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">Nama Lengkap *</label>
              <input required value={form.buyer_name} onChange={e => setForm(f => ({...f, buyer_name: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Masukkan nama Anda" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">No. WhatsApp *</label>
              <input required type="tel" value={form.buyer_phone} onChange={e => setForm(f => ({...f, buyer_phone: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="08xxxxxxxxxx" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">Jenis Tiket</label>
                <select value={form.ticket_type} onChange={e => setForm(f => ({...f, ticket_type: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  {TICKET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">Jumlah</label>
                <input type="number" min={1} max={50} value={form.qty} onChange={e => setForm(f => ({...f, qty: Math.max(1, +e.target.value)}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1 flex items-center gap-1">
                <CalendarDays className="h-3 w-3" /> Tanggal Kunjungan
              </label>
              <input type="date" min={today} value={form.visit_date} onChange={e => setForm(f => ({...f, visit_date: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">Catatan (opsional)</label>
              <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Permintaan khusus..." />
            </div>
            {total > 0 && (
              <div className="bg-emerald-50 rounded-2xl p-3 flex items-center justify-between">
                <p className="text-xs text-gray-600">Estimasi Total <span className="text-gray-400">({form.qty}×)</span></p>
                <p className="font-black text-emerald-700 text-sm">{total.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}</p>
              </div>
            )}
            {err && <p className="text-xs text-red-500">{err}</p>}
            <button type="submit" disabled={submitting || (total > 0 && !snapReady)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl transition-colors">
              {submitting ? "Memproses…" : (total > 0 && !snapReady) ? "Memuat pembayaran…" : total > 0 ? "Bayar Sekarang" : "Pesan Sekarang"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function WisataDetail() {
  const [, params] = useRoute("/wisata/:id");
  const [wisata, setWisata] = useState<WisataItem | null>(null);
  const [allWisata, setAllWisata] = useState<WisataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [failedPhotos, setFailedPhotos] = useState<Set<string>>(() => new Set());

  function markPhotoFailed(photo: string) {
    setFailedPhotos(previous => {
      if (previous.has(photo)) return previous;
      const next = new Set(previous);
      next.add(photo);
      return next;
    });
  }

  async function doShare(title: string) {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title, url }); return; } catch {} }
    try { await navigator.clipboard.writeText(url); } catch {
      const el = document.createElement("textarea"); el.value = url;
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setShareCopied(true); setTimeout(() => setShareCopied(false), 2000);
  }
  const { toggle: wishlistToggle, isWishlisted: checkWishlisted } = useWishlist();

  useEffect(() => {
    if (!params?.id) return;
    setFailedPhotos(new Set());
    setLoading(true);
    setNotFound(false);
    import("../lib/apicache").then(({ cachedFetch }) => {
      cachedFetch(`/api/wisata/${params.id}`)
        .then((d: any) => { setWisata(d); document.title = `${d.name} — Nempo Organizer`; })
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false));
      cachedFetch("/api/wisata")
        .then((d: any) => setAllWisata(Array.isArray(d) ? d : []))
        .catch(() => {});
    });
    return () => { document.title = "Nempo Organizer"; };
  }, [params?.id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Memuat data wisata…</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (notFound || !wisata) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-300 mb-2">404</p>
            <p className="text-gray-500 text-sm mb-4">Destinasi tidak ditemukan</p>
            <Link href="/wisata"><button className="bg-emerald-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl">Kembali ke Wisata</button></Link>
          </div>
        </div>
      </Layout>
    );
  }

  const visitTips = tips[wisata.category] ?? tips["Alam"];
  const facilitiesList = wisata.facilities
    ? wisata.facilities.split(",").map(f => f.trim()).filter(Boolean)
    : ["Parkir", "Toilet"];
  const galleryPhotos = getUniqueGalleryPhotos(wisata).filter(photo => !failedPhotos.has(photo));
  const heroPhotos = [wisata.image, ...galleryPhotos]
    .filter((photo): photo is string => Boolean(photo) && !failedPhotos.has(photo))
    .slice(0, 3);
  const related = allWisata.filter(w => w.id !== wisata.id).slice(0, 4);
  const mapsUrl = wisata.google_maps_url || `https://www.google.com/maps/search/${encodeURIComponent(wisata.name + " " + wisata.location)}`;
  const cityLabel = /bogor/i.test(wisata.location) ? "Bogor" : /garut/i.test(wisata.location) ? "Garut" : "Jawa Barat";
  const googleRating = wisata.rating != null && Number(wisata.rating) > 0
    ? Number(wisata.rating)
    : null;
  const hasRatingSummary = googleRating != null || wisata.computed_rating != null;

  const wishlisted = checkWishlisted(String(wisata.id), "wisata");
  async function handleWishlist() {
    await wishlistToggle({
      id: String(wisata!.id),
      type: "wisata",
      name: wisata!.name,
      image: wisata!.image,
      location: wisata!.location,
      category: wisata!.category,
    });
  }

  return (
    <Layout>
      <SEO
        title={wisata.name}
        description={wisata.description?.slice(0, 160) || `Destinasi wisata ${wisata.name} di ${wisata.location}, ${cityLabel} — foto, rute, dan info lengkap.`}
        image={wisata.image}
        path={`/wisata/${wisata.id}`}
      />
      <div>
        {/* ── Hero ── */}
        <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-96 lg:h-[480px] overflow-hidden bg-slate-950">
          <img
            src={heroPhotos[0] ?? wisata.image}
            alt={wisata.name}
            onError={() => markPhotoFailed(heroPhotos[0] ?? wisata.image)}
            className="relative z-[1] block w-full h-full object-cover md:hidden"
          />
          <div className={`absolute inset-0 z-[1] hidden md:grid gap-1 ${heroPhotos.length === 1 ? "grid-cols-1" : heroPhotos.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
            {heroPhotos.map((photo, index) => (
              <div key={`${photo}-${index}`} className="relative min-w-0 overflow-hidden bg-slate-900">
                <img
                  src={photo}
                  alt={index === 0 ? wisata.name : `Foto ${wisata.name} ${index + 1}`}
                  onError={() => markPhotoFailed(photo)}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Back + actions */}
          <div className="absolute top-4 left-4">
            <button
              onClick={() => window.history.back()}
              className="bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-full h-10 w-10 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={handleWishlist}
              className="backdrop-blur-md border text-white rounded-full h-10 w-10 flex items-center justify-center transition-colors"
              style={wishlisted ? { background: "#ef4444", borderColor: "#ef4444" } : { background: "rgba(255,255,255,0.2)", borderColor: "rgba(255,255,255,0.4)" }}>
              <Heart className={`h-5 w-5 ${wishlisted ? "fill-white text-white" : ""}`} />
            </button>
            <button onClick={() => doShare(wisata.name)}
              className="backdrop-blur-md border text-white rounded-full h-10 w-10 flex items-center justify-center transition-all"
              style={shareCopied ? { background: "#22c55e", borderColor: "#22c55e" } : { background: "rgba(255,255,255,0.2)", borderColor: "rgba(255,255,255,0.4)" }}
              title={shareCopied ? "Link disalin!" : "Bagikan"}>
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Title */}
          <div className="absolute bottom-6 left-0 right-0 px-5 md:px-10 lg:px-16">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold text-white px-2.5 py-1 rounded-full ${catColor[wisata.category] ?? "bg-gray-500"}`}>
                {cityLabel}
              </span>
              {wisata.partner && wisata.entry_fee > 0 && (
                <span className="flex items-center gap-1 bg-blue-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  <BadgeCheck className="h-3 w-3" /> Mitra Resmi
                </span>
              )}
              {googleRating != null && (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-yellow-600 shadow-sm"
                  title="Rating Google Maps"
                  aria-label={`Rating Google Maps ${googleRating.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`}
                >
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {googleRating.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-1">{wisata.name}</h1>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{wisata.location}</span>
              {wisata.computed_rating != null && (
                <span className="flex items-center gap-1" title="Rating Nempo">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />Nempo {wisata.computed_rating}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Main Left ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Quick stats */}
              <div className={`grid gap-3 ${hasRatingSummary ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                  <div className="font-extrabold text-gray-900 text-sm mb-0.5 leading-tight">
                    {wisata.opening_hours || "08.00 - 17.00"}
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">Jam Buka</p>
                </div>
                {googleRating != null && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:border-yellow-200 hover:bg-yellow-50/40 transition-colors"
                    title="Lihat ulasan di Google Maps"
                  >
                    <div className="flex items-center justify-center gap-1 font-extrabold text-yellow-600 text-lg mb-0.5">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {googleRating.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </div>
                     <p className="text-[10px] text-gray-400 font-medium">Rating Google Maps</p>
                  </a>
                )}
                {wisata.computed_rating != null && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                    <div className="flex items-center justify-center gap-1 font-extrabold text-yellow-500 text-lg mb-0.5">
                      <Star className="h-4 w-4 fill-yellow-500" />{wisata.computed_rating}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">Rating Nempo · {wisata.review_count} ulasan</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-extrabold text-gray-900 text-base mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-emerald-600" /> Tentang Tempat Ini
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{wisata.description}</p>
                {wisata.phone && (
                  <a href={`tel:${wisata.phone}`} className="mt-3 flex items-center gap-2 text-sm text-gray-700 hover:text-emerald-700 transition-colors">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold">{wisata.phone}</span>
                  </a>
                )}
                {wisata.website && (
                  <a href={wisata.website} target="_blank" rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    <Globe className="h-4 w-4" />
                    <span className="font-semibold truncate">{wisata.website}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                )}
              </div>

              {/* Photo Gallery */}
              {galleryPhotos.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    Foto Lokasi
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {galleryPhotos.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                        className={`block rounded-xl overflow-hidden border border-gray-100 shadow-sm ${i === 0 && galleryPhotos.length % 2 !== 0 ? "col-span-2" : ""}`}
                        style={{ aspectRatio: i === 0 && galleryPhotos.length % 2 !== 0 ? "16/7" : "4/3" }}>
                        <img
                          src={url}
                          alt={`Foto ${wisata.name} ${i + 1}`}
                          onError={() => markPhotoFailed(url)}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" /> Fasilitas Tersedia
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facilitiesList.map((f) => (
                    <div key={f} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-xs font-medium text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips kunjungan */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
                  <Sun className="h-4 w-4 text-blue-500" /> Tips Kunjungan
                </h3>
                <ul className="space-y-2.5">
                  {visitTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="h-5 w-5 rounded-full bg-blue-100 text-[#0172B1] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Map */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" /> Lokasi
                </h3>
                {wisata.maps_embed_url ? (
                  <div className="h-52 rounded-xl overflow-hidden border border-gray-100 mb-3">
                    <iframe
                      src={wisata.maps_embed_url}
                      width="100%" height="100%"
                      style={{ border: 0 }}
                      allowFullScreen loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Peta ${wisata.name}`}
                    />
                  </div>
                ) : (
                  <div className="h-44 bg-gray-100 rounded-xl overflow-hidden relative mb-3">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white text-gray-900 font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:bg-gray-50 transition-colors">
                         <Map className="h-4 w-4 text-blue-600" /> Lihat di Google Maps
                      </a>
                    </div>
                  </div>
                )}
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors">
                  <Map className="h-4 w-4" />{wisata.location}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <UserRating itemType="wisata" itemId={wisata.id} locationName={wisata.name} />

              {/* Related destinations */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-black text-gray-900 text-sm leading-none">Destinasi Lainnya</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">{related.length} destinasi pilihan</p>
                    </div>
                    <Link href="/wisata">
                      <span className="flex items-center gap-0.5 text-[#0194f3] text-xs font-bold">
                        Semua <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </div>
                   <div className="mobile-card-slider sm:grid sm:grid-cols-4 gap-3">
                    {related.map(w => (
                      <Link key={w.id} href={`/wisata/${w.slug || w.id}`}>
                        <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                          <div className="relative w-full" style={{ paddingBottom: "62%" }}>
                            <img src={w.image} alt={w.name} className="absolute inset-0 w-full h-full object-cover" />
                            {Number(w.rating) > 0 ? (
                              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-white/90 rounded-full px-1.5 py-0.5 text-yellow-600 shadow-sm" title="Rating Google Maps">
                                <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-[10px] font-bold">{Number(w.rating).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                              </div>
                            ) : w.computed_rating != null && (
                              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-black/55 rounded-full px-1.5 py-0.5" title="Rating Nempo">
                                <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-white text-[10px] font-bold">Nempo {w.computed_rating}</span>
                              </div>
                            )}
                            {w.category === wisata.category && (
                              <div className="absolute top-1.5 right-1.5 bg-emerald-500 rounded-full px-1.5 py-0.5">
                                <span className="text-white text-[9px] font-black">Serupa</span>
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <p className="font-bold text-gray-900 text-xs leading-tight line-clamp-1">{w.name}</p>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              <MapPin className="h-2.5 w-2.5 text-gray-400 shrink-0" />
                              <span className="text-[10px] text-gray-400 truncate">{w.location}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">{cityLabel}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-1 space-y-4 sticky top-20 self-start">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-extrabold text-gray-900 text-base mb-4">Info Kunjungan</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="h-8 w-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium">Jam Operasional</p>
                      <p className="text-sm font-bold text-gray-900">{wisata.opening_hours ?? "08.00 - 17.00"} WIB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium">Alamat</p>
                      <p className="text-sm font-bold text-gray-900">{wisata.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-[#0172B1]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium">Cocok untuk</p>
                      <p className="text-sm font-bold text-gray-900">Keluarga &amp; Umum</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  {wisata.partner ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <BadgeCheck className="h-4 w-4 text-blue-600" />
                        <p className="text-xs font-bold text-blue-700">Mitra Resmi — Reservasi Online</p>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                        Pesan tiket masuk secara online. Mitra kami akan mengkonfirmasi dalam waktu singkat.
                      </p>
                      <button
                        onClick={() => setBookingOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-md shadow-emerald-600/20 mb-2"
                      >
                        <Ticket className="h-4 w-4" /> Pesan Tiket Sekarang
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3">
                        <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-0.5">Pembelian Tiket Online Belum Tersedia</p>
                          <p className="text-[11px] text-gray-400 leading-relaxed">
                            Tiket dapat dibeli langsung di lokasi destinasi. Ingin kerjasama? Daftarkan sekarang.
                          </p>
                        </div>
                      </div>
                      <Link href="/sponsorship">
                        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-md shadow-blue-600/20 mb-2">
                          Daftar Kerja Sama Mitra
                        </button>
                      </Link>
                    </>
                  )}
                  <a
                    href={NEMPO_CONSULT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold text-sm py-3 rounded-xl transition-colors"
                  >
                    <Instagram className="h-4 w-4 text-pink-600" /> Hubungi via DM Instagram
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {bookingOpen && wisata && (
        <WisataBookingModal
          wisataId={wisata.id}
          wisataName={wisata.name}
          entryFee={wisata.entry_fee}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </Layout>
  );
}
