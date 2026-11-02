import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useRoute, Link } from "@/lib/wouter";
import { useState, useEffect } from "react";
import {
  MapPin, Star, Clock, Heart, Share2, ArrowLeft,
  Phone, ChevronRight, ExternalLink, UtensilsCrossed,
  Info, Sun, Globe, Map, CheckCircle, X, CalendarDays, Users, ShoppingBag,
  Tag, Loader2, CheckCircle2, AlertCircle, Ticket,
} from "lucide-react";
import { UserRating } from "@/components/user-rating";
import { PlacePhoto } from "@/components/place-photo";
import { useWishlist } from "@/lib/use-wishlist";

interface KulinerItem {
  id: number;
  name: string;
  category: string;
  image: string;
  location: string;
  description: string;
  featured: boolean;
  hours: string | null;
  rating: number | string | null;
  phone: string | null;
  website?: string | null;
  instagram: string | null;
  google_maps_url: string | null;
  maps_embed_url: string | null;
  facilities: string | null;
  photos: string[] | null;
  slug: string;
  computed_rating: number | null;
  review_count: number;
  reservasi_enabled?: boolean;
}

const catColor: Record<string, string> = {
  "Makanan Berat": "bg-blue-600",
  Cafe:            "bg-amber-600",
  Snack:           "bg-slate-600",
  Minuman:         "bg-cyan-600",
  Dessert:         "bg-indigo-600",
  "Oleh-oleh":    "bg-[#0194f3]",
};

const tips: Record<string, string[]> = {
  "Makanan Berat": ["Datang saat jam makan siang untuk hidangan paling segar", "Coba menu andalan yang direkomendasikan pelayan", "Tanyakan menu khas hari ini yang mungkin tidak ada di menu reguler", "Siapkan uang tunai sebagai alternatif pembayaran"],
  Cafe:            ["Kunjungi di pagi hari untuk suasana paling tenang dan nyaman", "Tanyakan kopi single origin lokal Garut yang khas", "Coba menu seasonal yang sering berganti setiap bulan", "Cocok untuk bekerja, meeting santai, atau bersantai sore"],
  Snack:           ["Pilih produk dalam kemasan tertutup untuk ketahanan lebih lama", "Cek tanggal produksi atau kadaluarsa sebelum membeli", "Tanyakan varian rasa terlaris kepada penjual", "Bagus untuk dijadikan oleh-oleh keluarga di rumah"],
  Minuman:         ["Minta tanpa es jika ingin merasakan cita rasa aslinya", "Coba versi original dulu sebelum memilih variasi rasa", "Cocok dinikmati saat sore atau setelah beraktivitas", "Pastikan tempat bersih dan hygienis sebelum memesan"],
  Dessert:         ["Nikmati selagi segar dan baru disajikan", "Cocok sebagai penutup makan siang yang menyegarkan", "Tanyakan apakah ada versi rendah gula untuk pilihan lebih sehat", "Bagikan ke keluarga dan teman agar pengalaman lebih berkesan"],
  "Oleh-oleh":    ["Beli langsung dari produsen untuk mendapat harga dan kualitas terbaik", "Pilih kemasan yang rapi dan menarik jika untuk hadiah", "Cek komposisi bahan untuk menghindari alergi tertentu", "Simpan di tempat sejuk dan kering agar tahan lebih lama"],
};

interface VoucherResult {
  valid: boolean;
  voucher?: {
    id: number;
    title: string;
    code: string;
    discount_type: string;
    discount_value: number;
    min_purchase: number;
    applicable_type: string | null;
    description: string | null;
    expiry_date: string | null;
  };
  discount?: number;
  error?: string;
}

function getUniqueGalleryPhotos(item: KulinerItem): string[] {
  const mainPhoto = item.image?.trim();
  const mainKey = photoIdentity(mainPhoto);
  const seen = new Set<string>();

  return (Array.isArray(item.photos) ? item.photos : []).filter((photo): photo is string => {
    const url = typeof photo === "string" ? photo.trim() : "";
    const key = photoIdentity(url);
    if (!key || key === mainKey || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

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

function KulinerReservasiModal({
  kuliner,
  onClose,
  showVoucher = false,
  mode = "reservasi",
}: {
  kuliner: KulinerItem;
  onClose: () => void;
  showVoucher?: boolean;
  mode?: "reservasi" | "order";
}) {
  const isOrder = mode === "order";
  const [form, setForm] = useState({
    customer_name: "", customer_phone: "", reservation_date: "",
    reservation_time: "", num_guests: 2, notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ order_code: string; voucher_code?: string | null } | null>(null);
  const [err, setErr] = useState("");
  const today = new Date().toISOString().split("T")[0];

  // Voucher state
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherResult, setVoucherResult] = useState<VoucherResult | null>(null);
  const [voucherApplied, setVoucherApplied] = useState(false);

  async function validateVoucher() {
    const code = voucherCode.trim().toUpperCase();
    if (!code) return;
    setVoucherLoading(true);
    setVoucherResult(null);
    try {
      const res = await fetch("/api/vouchers/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, type: "kuliner", amount: 0 }),
      });
      const data: VoucherResult = await res.json();
      setVoucherResult(data);
      if (data.valid) setVoucherApplied(true);
    } catch {
      setVoucherResult({ valid: false, error: "Gagal menghubungi server" });
    } finally {
      setVoucherLoading(false);
    }
  }

  function removeVoucher() {
    setVoucherCode("");
    setVoucherResult(null);
    setVoucherApplied(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        ...form,
        kuliner_id: kuliner.id,
        order_type: isOrder ? "pesan" : "reservasi",
      };
      if (voucherApplied && voucherResult?.valid && voucherResult.voucher) {
        payload.voucher_code = voucherResult.voucher.code;
      }
      const res = await fetch("/api/kuliner-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (isOrder ? "Gagal mengirim pesanan" : "Gagal mengirim reservasi"));
      setDone({ order_code: data.order_code, voucher_code: data.voucher_code });
    } catch (e: any) { setErr(e.message); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 pt-4 pb-20 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[calc(100dvh-6rem)] sm:max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            <p className="font-black text-gray-900 text-sm">{isOrder ? "Buat Pesanan" : "Buat Reservasi"}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[200px]">{kuliner.name}</p>
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
             <p className="font-black text-gray-900 mb-1">{isOrder ? "Pesanan Terkirim!" : "Reservasi Terkirim!"}</p>
             <p className="text-xs text-gray-500 mb-3">{isOrder ? "Kode pesanan Anda:" : "Kode reservasi Anda:"}</p>
            <div className="bg-gray-50 rounded-2xl p-4 font-mono text-lg font-black text-gray-800 mb-3 tracking-widest">{done.order_code}</div>
            {done.voucher_code && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3 mb-3 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Ticket className="h-4 w-4 text-amber-600 shrink-0" />
                  <p className="text-xs font-black text-amber-700">Voucher diskon aktif</p>
                </div>
                <p className="font-mono text-sm font-black text-amber-800 tracking-widest mb-1">{done.voucher_code}</p>
                <p className="text-[11px] text-amber-600">Tunjukkan kode ini kepada kasir untuk mendapatkan diskon kampanye cafe Nempo.</p>
              </div>
            )}
             <p className="text-xs text-gray-400 mb-4">
               Simpan kode ini. {isOrder ? "Tempat jajan akan segera mengkonfirmasi pesanan Anda." : "Tempat makan akan segera mengkonfirmasi reservasi Anda."}
             </p>
            <button onClick={onClose} className="w-full bg-[#0194f3] text-white font-bold text-sm py-3 rounded-xl">Selesai</button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3">
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">Nama Lengkap *</label>
              <input required value={form.customer_name} onChange={e => setForm(f => ({...f, customer_name: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3]"
                placeholder="Masukkan nama Anda" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">No. WhatsApp *</label>
              <input required type="tel" value={form.customer_phone} onChange={e => setForm(f => ({...f, customer_phone: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3]"
                placeholder="08xxxxxxxxxx" />
            </div>
             {!isOrder && (
               <>
                 <div className="grid grid-cols-2 gap-2">
                   <div>
                     <label className="text-[11px] font-bold text-gray-500 block mb-1 flex items-center gap-1">
                       <CalendarDays className="h-3 w-3" /> Tanggal
                     </label>
                     <input type="date" min={today} value={form.reservation_date} onChange={e => setForm(f => ({...f, reservation_date: e.target.value}))}
                       className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3]" />
                   </div>
                   <div>
                     <label className="text-[11px] font-bold text-gray-500 block mb-1">Waktu</label>
                     <input type="time" value={form.reservation_time} onChange={e => setForm(f => ({...f, reservation_time: e.target.value}))}
                       className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3]" />
                   </div>
                 </div>
                 <div>
                   <label className="text-[11px] font-bold text-gray-500 block mb-1 flex items-center gap-1">
                     <Users className="h-3 w-3" /> Jumlah Tamu
                   </label>
                   <input type="number" min={1} max={100} value={form.num_guests} onChange={e => setForm(f => ({...f, num_guests: Math.max(1, +e.target.value)}))}
                     className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3]" />
                 </div>
               </>
             )}
            <div>
               <label className="text-[11px] font-bold text-gray-500 block mb-1">{isOrder ? "Pesanan yang diinginkan *" : "Catatan (opsional)"}</label>
              <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                 required={isOrder}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0194f3] resize-none"
                 placeholder={isOrder ? "Contoh: 2 nasi tutug oncom, 1 es jeruk…" : "Permintaan khusus, alergi, dll..."} />
            </div>

             {!isOrder && showVoucher && (
              <>
            {/* ── Voucher Campaign Section ── */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-3 border border-amber-100">
              <div className="flex items-center gap-1.5 mb-2">
                <Tag className="h-3.5 w-3.5 text-amber-600" />
                <p className="text-[11px] font-black text-amber-700">Kode Promo / Voucher Cafe</p>
              </div>
              {voucherApplied && voucherResult?.valid ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white rounded-xl px-3 py-2 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-black text-emerald-700 text-xs truncate">{voucherResult.voucher!.title}</p>
                      <p className="text-[10px] text-emerald-600 font-mono">{voucherResult.voucher!.code}</p>
                    </div>
                    <div className="ml-auto shrink-0">
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {voucherResult.voucher!.discount_type === "persen"
                          ? `-${voucherResult.voucher!.discount_value}%`
                          : `-Rp${Number(voucherResult.voucher!.discount_value).toLocaleString("id-ID")}`}
                      </span>
                    </div>
                  </div>
                  <button type="button" onClick={removeVoucher}
                    className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0">
                    <X className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={voucherCode}
                    onChange={e => { setVoucherCode(e.target.value.toUpperCase()); setVoucherResult(null); setVoucherApplied(false); }}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); validateVoucher(); } }}
                    className="flex-1 border border-amber-200 bg-white rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:font-sans placeholder:text-gray-400"
                    placeholder="Contoh: CAFENEMPO20" />
                  <button type="button" onClick={validateVoucher} disabled={!voucherCode.trim() || voucherLoading}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0">
                    {voucherLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Pakai"}
                  </button>
                </div>
              )}
              {voucherResult && !voucherResult.valid && (
                <div className="flex items-center gap-1.5 mt-2">
                  <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  <p className="text-[11px] text-red-600">{voucherResult.error}</p>
                </div>
              )}
              {!voucherApplied && !voucherResult && (
                <p className="text-[10px] text-amber-600 mt-1.5">Coba: <span className="font-mono font-bold">CAFENEMPO20</span> · <span className="font-mono font-bold">NGOPI15K</span> · <span className="font-mono font-bold">CAFEWEEKEND</span></p>
              )}
            </div>
              </>
            )}

            {err && <p className="text-xs text-red-500">{err}</p>}
             <button type="submit" disabled={submitting}
              className="w-full bg-[#0194f3] hover:bg-[#0172B1] disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl transition-colors">
               {submitting ? "Mengirim…" : isOrder ? "Kirim Pesanan" : voucherApplied ? "Buat Reservasi + Klaim Voucher" : "Buat Reservasi"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function KulinerDetail() {
  const [, kulinerParams] = useRoute("/kuliner/:id");
  const [, cafeParams] = useRoute("/cafe/:id");
  const [, jajanParams] = useRoute("/jajan-yuk/:id");
  const params = jajanParams ?? cafeParams ?? kulinerParams;
  const isJajanYuk = Boolean(jajanParams);
  const isCafe = Boolean(cafeParams);
  const detailBase = isJajanYuk ? "jajan-yuk" : isCafe ? "cafe" : "kuliner";
  const [kuliner, setKuliner]       = useState<KulinerItem | null>(null);
  const [allKuliner, setAllKuliner] = useState<KulinerItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [reservasiOpen, setReservasiOpen] = useState(false);
  const [hasCampaign, setHasCampaign] = useState(false);

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
    setLoading(true);
    setNotFound(false);
    import("../lib/apicache").then(({ cachedFetch }) => {
      const itemEndpoint = isCafe ? "cafe" : "kuliner";
      cachedFetch(`/api/${itemEndpoint}/${params.id}`)
        .then((d: any) => { setKuliner(d); document.title = `${d.name} — Nempo Organizer`; })
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false));
      cachedFetch(`/api/${itemEndpoint}`)
        .then((d: any) => setAllKuliner(Array.isArray(d) ? d : []))
        .catch(() => {});
      // Cek campaign sesuai jenis listing (tetap memakai kuliner_id untuk kompatibilitas data voucher lama).
      cachedFetch(`/api/vouchers/campaign/${isCafe ? "cafe" : "kuliner"}?kuliner_id=${params.id}`)
        .then((d: any) => setHasCampaign(Array.isArray(d) && d.length > 0))
        .catch(() => setHasCampaign(false));
    });
    return () => { document.title = "Nempo Organizer"; };
   }, [params?.id, isCafe, isJajanYuk]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-[#0194f3] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Memuat data {isJajanYuk ? "jajan" : isCafe ? "cafe" : "kuliner"}…</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (notFound || !kuliner) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
          <UtensilsCrossed className="h-12 w-12 text-gray-200" />
          <p className="font-semibold text-gray-400">{isJajanYuk ? "Jajan" : isCafe ? "Cafe" : "Kuliner"} tidak ditemukan</p>
          <Link href={`/${detailBase}`}>
            <button className="text-sm font-bold text-[#0194f3] hover:underline">← Kembali ke {isJajanYuk ? "Jajan YUK" : isCafe ? "Cafe" : "Kuliner"}</button>
          </Link>
        </div>
      </Layout>
    );
  }

  const tipsList       = tips[kuliner.category] ?? tips["Makanan Berat"];
  const facilitiesList = kuliner.facilities
    ? kuliner.facilities.split(",").map(f => f.trim()).filter(Boolean)
    : [];
  const galleryPhotos = getUniqueGalleryPhotos(kuliner);
  const heroPhotos = [kuliner.image, ...galleryPhotos]
    .filter(Boolean)
    .slice(0, 3);
  if (isCafe && heroPhotos.length === 0) heroPhotos.push("");
  const mapsUrl   = kuliner.google_maps_url || `https://www.google.com/maps/search/${encodeURIComponent(kuliner.name + " " + kuliner.location)}`;
  const googleRating = kuliner.rating != null && Number(kuliner.rating) > 0
    ? Number(kuliner.rating)
    : null;
  const hasRatingSummary = googleRating != null || kuliner.computed_rating != null;
  const related   = allKuliner
    .filter(k => k.id !== kuliner.id)
    .sort((a, b) => {
      const aMatch = a.category === kuliner.category ? -1 : 1;
      const bMatch = b.category === kuliner.category ? -1 : 1;
      return aMatch - bMatch;
    })
    .slice(0, 4);

  const wishlisted = kuliner ? checkWishlisted(String(kuliner.id), "kuliner") : false;

  async function handleWishlist() {
    if (!kuliner) return;
    await wishlistToggle({
      id: String(kuliner.id),
      type: "kuliner",
      name: kuliner.name,
      image: kuliner.image,
      location: kuliner.location,
      category: kuliner.category,
    });
  }

  return (
    <Layout>
      <SEO
        title={kuliner.name}
        description={kuliner.description?.slice(0, 160) || `Kuliner ${kuliner.name} di ${kuliner.location}, Garut — menu, lokasi, dan info lengkap.`}
        image={kuliner.image}
        path={`/${detailBase}/${kuliner.id}`}
      />
      {/* ── Hero ── */}
      <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-96 lg:h-[480px] overflow-hidden bg-slate-950">
        {/* Mobile: one photo, sized to the phone viewport without a wide desktop crop. */}
        <PlacePhoto
          kind={isCafe ? "cafe" : "culinary"}
          src={kuliner.image}
          alt={kuliner.name}
          className="relative z-[1] h-full w-full md:hidden"
        />

        {/* Cafe banners always use three desktop columns; mobile intentionally shows only the main photo. */}
        <div className={`absolute inset-0 z-[1] hidden md:grid gap-1 ${isCafe ? "grid-cols-3" : heroPhotos.length === 1 ? "grid-cols-1" : heroPhotos.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {heroPhotos.map((photo, index) => (
            <div key={`${photo}-${index}`} className="relative min-w-0 overflow-hidden bg-slate-900">
              <PlacePhoto
                kind={isCafe ? "cafe" : "culinary"}
                src={photo}
                alt={index === 0 ? kuliner.name : `Foto ${kuliner.name} ${index + 1}`}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back button */}
        <div className="absolute z-10 top-4 left-4">
          <button onClick={() => window.history.back()}
            className="bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-full h-10 w-10 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Heart + Share */}
        <div className="absolute z-10 top-4 right-4 flex gap-2">
          <button onClick={handleWishlist}
            className="bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-full h-10 w-10 flex items-center justify-center hover:bg-white transition-colors"
            style={wishlisted ? { background: "#ef4444", borderColor: "#ef4444" } : {}}>
            <Heart className={`h-5 w-5 ${wishlisted ? "fill-white text-white" : ""}`} />
          </button>
          <button onClick={() => doShare(kuliner.name)}
            className="backdrop-blur-md border text-white rounded-full h-10 w-10 flex items-center justify-center transition-all"
            style={shareCopied ? { background: "#22c55e", borderColor: "#22c55e" } : { background: "rgba(255,255,255,0.2)", borderColor: "rgba(255,255,255,0.4)" }}
            title={shareCopied ? "Link disalin!" : "Bagikan"}>
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Title overlay */}
        <div className="absolute z-10 bottom-6 left-0 right-0 px-5 md:px-10 lg:px-16">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold text-white px-2.5 py-1 rounded-full ${catColor[kuliner.category] ?? "bg-[#0194f3]"}`}>
              {kuliner.category}
            </span>
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
          <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-1">{kuliner.name}</h1>
          <div className="flex items-center gap-3 text-white/80 text-sm">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{kuliner.location}</span>
            {kuliner.computed_rating != null && (
                <span className="flex items-center gap-1" title="Rating Nempo">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />Nempo {kuliner.computed_rating}
                </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">

        {/* Quick stats */}
        <div className={`grid gap-3 ${hasRatingSummary ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="font-extrabold text-gray-900 text-sm mb-0.5 leading-tight">
              {kuliner.hours || "09.00 – 21.00"}
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
              <div className="flex items-center justify-center gap-1 font-extrabold text-gray-900 text-sm mb-0.5 leading-tight">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {googleRating.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </div>
               <p className="text-[10px] text-gray-400 font-medium">Rating Google Maps</p>
            </a>
          )}
          {kuliner.computed_rating != null && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <div className="flex items-center justify-center gap-1 font-extrabold text-yellow-500 text-lg mb-0.5">
                <Star className="h-4 w-4 fill-yellow-500" />{kuliner.computed_rating}
              </div>
               <p className="text-[10px] text-gray-400 font-medium">Rating Nempo · {kuliner.review_count} ulasan</p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-extrabold text-gray-900 text-base mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-[#0194f3]" /> Tentang Tempat Ini
          </h3>
          {kuliner.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-3">{kuliner.description}</p>
          )}
          {kuliner.phone && (
            <a href={`tel:${kuliner.phone}`} className="mt-2 flex items-center gap-2 text-sm text-gray-700 hover:text-[#0194f3] transition-colors">
              <Phone className="h-4 w-4 text-green-500 shrink-0" />
              <span className="font-semibold">{kuliner.phone}</span>
            </a>
          )}
          {kuliner.instagram && (
            <a href={`https://instagram.com/${kuliner.instagram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 text-sm text-pink-500 hover:text-pink-600 transition-colors">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current shrink-0"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              <span className="font-semibold">{kuliner.instagram.startsWith("@") ? kuliner.instagram : `@${kuliner.instagram}`}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          )}
          {kuliner.website && (
            <a href={kuliner.website} target="_blank" rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
              <Globe className="h-4 w-4 shrink-0" />
              <span className="font-semibold truncate">{kuliner.website}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          )}
           {/* Order hanya tersedia melalui Jajan YUK; Kuliner/Cafe tetap discovery-only. */}
           <div className="mt-4 space-y-2 lg:hidden">
             {isJajanYuk ? (
              <button
                onClick={() => setReservasiOpen(true)}
                 className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-orange-500/20"
              >
                 <ShoppingBag className="h-4 w-4" /> Pesan Sekarang
              </button>
            ) : null}
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#0194f3] hover:bg-[#0172B1] text-white rounded-xl text-sm font-bold transition-colors">
              <ExternalLink className="h-4 w-4" /> Lihat ulasan di Google Maps
            </a>
          </div>
        </div>

        {/* Photo Gallery */}
        {galleryPhotos.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#0194f3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              Foto Lokasi
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {galleryPhotos.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                  className={`block rounded-xl overflow-hidden border border-gray-100 shadow-sm ${i === 0 && galleryPhotos.length % 2 !== 0 ? "col-span-2" : ""}`}
                  style={{ aspectRatio: i === 0 && galleryPhotos.length % 2 !== 0 ? "16/7" : "4/3" }}
                >
                  <PlacePhoto
                    kind={isCafe ? "cafe" : "culinary"}
                    src={url}
                    alt={`Foto ${kuliner.name} ${i + 1}`}
                    className="h-full w-full"
                    imageClassName="hover:scale-105 transition-transform duration-300"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Facilities */}
        {facilitiesList.length > 0 && (
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
        )}

        {/* Tips */}
           <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
            <Sun className="h-4 w-4 text-[#0194f3]" /> Tips Berkunjung
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
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" /> Lokasi
          </h3>
          {kuliner.maps_embed_url ? (
            <div className="h-52 rounded-xl overflow-hidden border border-gray-100 mb-3">
              <iframe
                src={kuliner.maps_embed_url}
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Peta ${kuliner.name}`}
              />
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
            <Map className="h-4 w-4" />{kuliner.location}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Rating & Ulasan */}
        <UserRating itemType="kuliner" itemId={kuliner.id} locationName={kuliner.name} />

        {/* Kuliner Lainnya */}
        {related.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-black text-gray-900 text-sm leading-none">{isJajanYuk ? "Jajan Lainnya" : isCafe ? "Cafe Lainnya" : "Kuliner Lainnya"}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">{related.length} pilihan</p>
              </div>
              <Link href={`/${detailBase}`}>
                <span className="flex items-center gap-0.5 text-[#0194f3] text-xs font-bold">
                  Semua <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
            <div className="mobile-card-slider sm:grid sm:grid-cols-4 gap-3">
              {related.map(k => (
                <Link key={k.id} href={`/${detailBase}/${k.slug || k.id}`}>
                  <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                    <div className="relative w-full" style={{ paddingBottom: "62%" }}>
                      <PlacePhoto
                        kind={isCafe ? "cafe" : "culinary"}
                        src={k.image}
                        alt={k.name}
                        className="absolute inset-0 h-full w-full"
                      />
                      {Number(k.rating) > 0 ? (
                        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-white/90 rounded-full px-1.5 py-0.5 text-yellow-600 shadow-sm" title="Rating Google Maps">
                          <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-[10px] font-bold">{Number(k.rating).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                        </div>
                      ) : k.computed_rating != null && (
                        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-black/55 rounded-full px-1.5 py-0.5" title="Rating Nempo">
                          <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-white text-[10px] font-bold">Nempo {k.computed_rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="font-bold text-gray-900 text-xs leading-tight line-clamp-1">{k.name}</p>
                      <div className="flex items-center gap-0.5 mt-0.5 min-w-0">
                        <MapPin className="h-2.5 w-2.5 text-gray-400 shrink-0" />
                        <span className="text-[10px] text-gray-400 truncate min-w-0">{k.location}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <span className="text-[10px] text-gray-400">{k.category}</span>
                        {k.category === kuliner.category && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#EBF3FF] text-[#0194f3] leading-none">Serupa</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

          </div>

          {/* ── Sidebar desktop ── */}
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
                    <p className="text-sm font-bold text-gray-900">{kuliner.hours || "09.00 – 21.00"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-medium">Alamat</p>
                    <p className="text-sm font-bold text-gray-900 break-words">{kuliner.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="h-8 w-8 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Cocok untuk</p>
                    <p className="text-sm font-bold text-gray-900">Keluarga &amp; Nongkrong</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                 {isJajanYuk && (
                  <button
                    onClick={() => setReservasiOpen(true)}
                     className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-md shadow-orange-500/20"
                  >
                     <ShoppingBag className="h-4 w-4" /> Pesan Sekarang
                  </button>
                )}
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#0194f3] hover:bg-[#0172B1] text-white rounded-xl text-sm font-bold transition-colors">
                  <ExternalLink className="h-4 w-4" /> Lihat ulasan di Google Maps
                </a>
                {kuliner.phone && (
                  <a href={`tel:${kuliner.phone}`}
                    className="flex items-center justify-center gap-2 w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold text-sm py-3 rounded-xl transition-colors">
                     <Phone className="h-4 w-4 text-green-600" /> Hubungi {isCafe ? "Cafe" : "Tempat"}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {reservasiOpen && kuliner && (
        <KulinerReservasiModal
          kuliner={kuliner}
          mode={isJajanYuk ? "order" : "reservasi"}
          showVoucher={isCafe && hasCampaign}
          onClose={() => setReservasiOpen(false)}
        />
      )}
    </Layout>
  );
}
