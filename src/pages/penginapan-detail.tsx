import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useRoute, Link } from "@/lib/wouter";
import { useState, useEffect } from "react";
import {
  MapPin, Star, Clock, Heart, Share2, ArrowLeft,
  Phone, ChevronRight, ExternalLink, Hotel,
  Info, CheckCircle, Sun, Globe, Map, Wifi, Coffee, Car, X, CalendarDays, Users, CreditCard,
} from "lucide-react";
import { UserRating } from "@/components/user-rating";
import { useWishlist } from "@/lib/use-wishlist";

interface PenginapanItem {
  id: number;
  name: string;
  category: string;
  image: string;
  location: string;
  description: string;
  amenities: string[] | null;
  featured: boolean;
  price_per_night?: number | null;
  phone?: string | null;
  website?: string | null;
  rating: number | string | null;
  google_maps_url?: string | null;
  maps_embed_url?: string | null;
  slug: string;
  computed_rating: number | null;
  review_count: number;
  booking_enabled?: boolean;
}

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

const catColor: Record<string, string> = {
  Hotel:    "bg-blue-600",
  Resort:   "bg-emerald-600",
  Villa:    "bg-violet-600",
  Homestay: "bg-[#0194f3]",
};

const tips: Record<string, string[]> = {
  Hotel:    ["Pesan lebih awal terutama di musim liburan", "Tanyakan fasilitas sarapan sebelum check-in", "Konfirmasi waktu check-in dan check-out", "Bawa kartu identitas untuk registrasi"],
  Resort:   ["Manfaatkan semua fasilitas resort selama menginap", "Cek jadwal aktivitas atau tur yang tersedia", "Bawa pakaian renang jika ada kolam renang", "Nikmati suasana alam di sekitar resort"],
  Villa:    ["Ideal untuk keluarga atau rombongan kecil", "Bawa bahan makanan untuk masak sendiri jika ada dapur", "Cek aturan tamu dan parkir sebelum tiba", "Manfaatkan area outdoor seperti taman atau BBQ"],
  Homestay: ["Berinteraksi dengan pemilik untuk tips wisata lokal", "Cocok untuk pengalaman autentik budaya Sunda", "Tanyakan sarapan tradisional yang bisa disediakan", "Hormati aturan rumah dan jam tamu"],
};

function PenginapanBookingModal({ item, onClose }: { item: PenginapanItem; onClose: () => void }) {
  const snapReady = useSnapScript();
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    guest_name: "", guest_email: "", guest_phone: "",
    checkin_date: "", checkout_date: "", num_guests: 2,
    room_type: "", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState("");

  // Hitung estimasi total dari malam × harga per malam
  const nights = (form.checkin_date && form.checkout_date)
    ? Math.max(1, Math.round((new Date(form.checkout_date).getTime() - new Date(form.checkin_date).getTime()) / 86400000))
    : 0;
  const pricePerNight = item.price_per_night ?? 0;
  const total = nights > 0 && pricePerNight > 0 ? nights * pricePerNight : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setSubmitting(true);
    try {
      const res = await fetch("/api/penginapan-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, penginapan_id: item.id, total_amount: total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim booking");

      if (!data.snap_token) {
        setDone(data.order_code);
        setSubmitting(false);
        return;
      }

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
            <p className="font-black text-gray-900 text-sm">Booking Kamar</p>
            <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[200px]">{item.name}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {done ? (
          <div className="p-6 text-center">
            <div className="h-14 w-14 rounded-full bg-[#EBF3FF] flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-7 w-7 text-[#0194f3]" />
            </div>
            <p className="font-black text-gray-900 mb-1">Booking Terkirim!</p>
            <p className="text-xs text-gray-500 mb-3">Kode booking Anda:</p>
            <div className="bg-gray-50 rounded-2xl p-4 font-mono text-lg font-black text-gray-800 mb-4 tracking-widest">{done}</div>
            <p className="text-xs text-gray-400 mb-4">Simpan kode ini. Penginapan akan segera mengkonfirmasi booking Anda.</p>
            <button onClick={onClose} className="w-full bg-[#0194f3] text-white font-bold text-sm py-3 rounded-xl">Selesai</button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3">
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">Nama Tamu *</label>
              <input required value={form.guest_name} onChange={e => setForm(f => ({...f, guest_name: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3]"
                placeholder="Nama lengkap" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">No. WhatsApp *</label>
              <input required type="tel" value={form.guest_phone} onChange={e => setForm(f => ({...f, guest_phone: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3]"
                placeholder="08xxxxxxxxxx" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">Email (opsional)</label>
              <input type="email" value={form.guest_email} onChange={e => setForm(f => ({...f, guest_email: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3]"
                placeholder="email@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1 flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" /> Check-in *
                </label>
                <input required type="date" min={today} value={form.checkin_date} onChange={e => setForm(f => ({...f, checkin_date: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3]" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1 flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" /> Check-out *
                </label>
                <input required type="date" min={form.checkin_date || today} value={form.checkout_date} onChange={e => setForm(f => ({...f, checkout_date: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1 flex items-center gap-1">
                  <Users className="h-3 w-3" /> Jumlah Tamu
                </label>
                <input type="number" min={1} max={20} value={form.num_guests} onChange={e => setForm(f => ({...f, num_guests: Math.max(1, +e.target.value)}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3]" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">Tipe Kamar</label>
                <input value={form.room_type} onChange={e => setForm(f => ({...f, room_type: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3]"
                  placeholder="Standard, Deluxe…" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">Catatan (opsional)</label>
              <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3] resize-none"
                placeholder="Permintaan khusus..." />
            </div>
            {err && <p className="text-xs text-red-500">{err}</p>}
            <button type="submit" disabled={submitting}
              className="w-full bg-[#0194f3] hover:bg-[#0172B1] disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl transition-colors">
              {submitting ? "Mengirim…" : "Booking Sekarang"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PenginapanDetail() {
  const [, params] = useRoute("/penginapan/:id");
  const [item, setItem]           = useState<PenginapanItem | null>(null);
  const [allItems, setAllItems]   = useState<PenginapanItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { toggle: wishlistToggle, isWishlisted: checkWishlisted } = useWishlist();

  useEffect(() => {
    if (!params?.id) return;
    setLoading(true);
    setNotFound(false);
    import("../lib/apicache").then(({ cachedFetch }) => {
      cachedFetch(`/api/penginapan/${params.id}`)
        .then((d: any) => { setItem(d); document.title = `${d.name} — Nempo Organizer`; })
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false));
      cachedFetch("/api/penginapan")
        .then((d: any) => setAllItems(Array.isArray(d) ? d : []))
        .catch(() => {});
    });
    return () => { document.title = "Nempo Organizer"; };
  }, [params?.id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-[#0194f3] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Memuat data penginapan…</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (notFound || !item) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
          <Hotel className="h-12 w-12 text-gray-200" />
          <p className="font-semibold text-gray-400">Penginapan tidak ditemukan</p>
          <Link href="/penginapan">
            <button className="text-sm font-bold text-[#0194f3] hover:underline">← Kembali ke Penginapan</button>
          </Link>
        </div>
      </Layout>
    );
  }

  const tipsList    = tips[item.category] ?? tips["Hotel"];
  const amenities   = Array.isArray(item.amenities) ? item.amenities : [];
  const mapsUrl     = item.google_maps_url || `https://www.google.com/maps/search/${encodeURIComponent(item.name + " " + item.location)}`;
  const googleRating = item.rating != null && Number(item.rating) > 0 ? Number(item.rating) : null;
  const hasRatingSummary = googleRating != null || item.computed_rating != null;
  const related     = allItems
    .filter(p => p.id !== item.id)
    .sort((a, b) => (a.category === item.category ? -1 : 1) - (b.category === item.category ? -1 : 1))
    .slice(0, 4);

  const wishlisted = item ? checkWishlisted(String(item.id), "penginapan") : false;

  async function handleWishlist() {
    if (!item) return;
    await wishlistToggle({
      id: String(item.id),
      type: "penginapan",
      name: item.name,
      image: item.image,
      location: item.location,
      category: item.category,
    });
  }

  return (
    <Layout>
      <SEO
        title={item.name}
        description={item.description?.slice(0, 160) || `Penginapan ${item.name} di ${item.location}, Garut — fasilitas, harga, dan info reservasi.`}
        image={item.image}
        path={`/penginapan/${item.id}`}
      />
      {/* ── Hero ── */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute top-4 left-4">
          <button onClick={() => window.history.back()}
            className="bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-full h-10 w-10 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={handleWishlist}
            className="bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-full h-10 w-10 flex items-center justify-center hover:bg-white transition-colors"
            style={wishlisted ? { background: "#ef4444", borderColor: "#ef4444" } : {}}>
            <Heart className={`h-5 w-5 ${wishlisted ? "fill-white text-white" : ""}`} />
          </button>
          <button onClick={() => { if (navigator.share) navigator.share({ title: item.name, url: window.location.href }); }}
            className="bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-full h-10 w-10 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute bottom-6 left-0 right-0 px-5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold text-white px-2.5 py-1 rounded-full ${catColor[item.category] ?? "bg-[#0194f3]"}`}>
              {item.category}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-1">{item.name}</h1>
          <div className="flex items-center gap-3 text-white/80 text-sm">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{item.location}</span>
            {item.computed_rating != null && (
              <span className="flex items-center gap-1" title="Rating Nempo">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />Nempo {item.computed_rating}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 pb-28">

        {/* Quick stats */}
        <div className={`grid gap-3 ${hasRatingSummary ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="font-extrabold text-gray-900 text-sm mb-0.5">{item.category}</div>
            <p className="text-[10px] text-gray-400 font-medium">Tipe Penginapan</p>
          </div>
          {googleRating != null && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm hover:border-yellow-200 hover:bg-yellow-50/40 transition-colors"
              title="Lihat rating dan ulasan di Google Maps">
              <div className="flex items-center justify-center gap-1 font-extrabold text-yellow-600 text-lg mb-0.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{googleRating.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Rating Google Maps</p>
            </a>
          )}
          {item.computed_rating != null && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 font-extrabold text-yellow-500 text-lg mb-0.5">
                <Star className="h-4 w-4 fill-yellow-500" />{item.computed_rating}
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Rating Nempo · {item.review_count} ulasan</p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-extrabold text-gray-900 text-base mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-[#0194f3]" /> Tentang Penginapan
          </h3>
          {item.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-3">{item.description}</p>
          )}
          {item.phone && (
            <a href={`tel:${item.phone}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#0194f3] transition-colors mt-2">
              <Phone className="h-4 w-4 text-green-500 shrink-0" />
              <span className="font-semibold">{item.phone}</span>
            </a>
          )}
          {item.website && (
            <a href={item.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors mt-2">
              <Globe className="h-4 w-4 shrink-0" />
              <span className="font-semibold truncate">{item.website}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          )}
          <div className="mt-4 space-y-2">
            {item.booking_enabled ? (
              <button
                onClick={() => setBookingOpen(true)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-emerald-600/20"
              >
                <CalendarDays className="h-4 w-4" /> Booking Kamar
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-400 rounded-xl text-sm font-semibold cursor-default">
                <CalendarDays className="h-4 w-4" /> Booking belum tersedia
              </div>
            )}
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#0194f3] hover:bg-[#0172B1] text-white rounded-xl text-sm font-bold transition-colors">
              <ExternalLink className="h-4 w-4" /> Buka di Google Maps
            </a>
          </div>
        </div>

        {/* Amenities / Fasilitas */}
        {amenities.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#0194f3]" /> Fasilitas Tersedia
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {amenities.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                  <CheckCircle className="h-3.5 w-3.5 text-[#0194f3] shrink-0" />
                  <span className="text-xs font-medium text-gray-700">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
            <Sun className="h-4 w-4 text-[#0194f3]" /> Tips Menginap
          </h3>
          <ul className="space-y-2.5">
            {tipsList.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                <span className="h-5 w-5 rounded-full bg-[#EBF3FF] text-[#0172B1] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" /> Lokasi
          </h3>
          {item.maps_embed_url ? (
            <div className="h-52 rounded-xl overflow-hidden border border-gray-100 mb-3">
              <iframe src={item.maps_embed_url} width="100%" height="100%"
                style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title={`Peta ${item.name}`} />
            </div>
          ) : (
            <div className="h-44 bg-gray-100 rounded-xl overflow-hidden relative mb-3">
              <div className="absolute inset-0 flex items-center justify-center">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-gray-900 font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:bg-gray-50 transition-colors">
                  <Map className="h-4 w-4 text-blue-600" /> Buka di Google Maps
                </a>
              </div>
            </div>
          )}
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors">
            <Map className="h-4 w-4" />{item.location}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Rating & Ulasan */}
        <UserRating itemType="penginapan" itemId={item.id} locationName={item.name} />

        {/* Penginapan Lainnya */}
        {related.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-black text-gray-900 text-sm leading-none">Penginapan Lainnya</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">{related.length} pilihan</p>
              </div>
              <Link href="/penginapan">
                <span className="flex items-center gap-0.5 text-[#0194f3] text-xs font-bold">
                  Semua <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
             <div className="mobile-card-slider sm:grid sm:grid-cols-2 gap-3">
              {related.map(p => (
                <Link key={p.id} href={`/penginapan/${p.slug || p.id}`}>
                  <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                    <div className="relative w-full" style={{ paddingBottom: "62%" }}>
                      <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
                      {Number(p.rating) > 0 ? (
                        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-white/90 rounded-full px-1.5 py-0.5 text-yellow-600 shadow-sm" title="Rating Google Maps">
                          <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-[10px] font-bold">{Number(p.rating).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                        </div>
                      ) : p.computed_rating != null && (
                        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-black/55 rounded-full px-1.5 py-0.5" title="Rating Nempo">
                          <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-white text-[10px] font-bold">Nempo {p.computed_rating}</span>
                        </div>
                      )}
                      {p.category === item.category && (
                        <div className="absolute top-1.5 right-1.5 bg-[#0194f3] rounded-full px-1.5 py-0.5">
                          <span className="text-white text-[9px] font-black">Serupa</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="font-bold text-gray-900 text-xs leading-tight line-clamp-1">{p.name}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <MapPin className="h-2.5 w-2.5 text-gray-400 shrink-0" />
                        <span className="text-[10px] text-gray-400 truncate">{p.location}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{p.category}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
      {bookingOpen && item && (
        <PenginapanBookingModal item={item} onClose={() => setBookingOpen(false)} />
      )}
    </Layout>
  );
}
