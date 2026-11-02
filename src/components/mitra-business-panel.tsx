import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useLocation } from "@/lib/wouter";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import {
  Store, Loader2, AlertCircle, CheckCircle, Pencil, MapPin, Clock, Wallet,
  Ticket, Plus, Trash2, Power, X, TrendingUp, ShoppingBag, BadgePercent,
  Star, MessageSquare, Upload, ImageIcon, Landmark, History, Send, ShieldCheck,
  ChevronRight, BarChart2, Images, CalendarX, ChevronLeft, ImagePlus, CalendarDays,
  ChevronDown, Mail, Phone as PhoneIcon, StickyNote, Users, CalendarCheck, ExternalLink,
  QrCode, BadgeCheck as CheckedIn, ScanLine, XCircle, CheckCircle2, RefreshCw, KeyRound,
} from "lucide-react";

const API = "/api";

type ListingType = "wisata" | "kuliner" | "penginapan" | "event";

type FieldDef = { key: string; label: string; type: "text" | "textarea" | "number" | "date" | "time" | "list" | "image"; };

const FIELDS_BY_TYPE: Record<ListingType, FieldDef[]> = {
  wisata: [
    { key: "name", label: "Nama Usaha", type: "text" },
    { key: "image", label: "Foto Utama", type: "image" },
    { key: "location", label: "Lokasi", type: "text" },
    { key: "description", label: "Deskripsi", type: "textarea" },
    { key: "opening_hours", label: "Jam Buka", type: "text" },
    { key: "facilities", label: "Fasilitas (pisahkan dengan koma)", type: "list" },
    { key: "phone", label: "Telepon", type: "text" },
    { key: "google_maps_url", label: "Link Google Maps", type: "text" },
  ],
  kuliner: [
    { key: "name", label: "Nama Usaha", type: "text" },
    { key: "image", label: "Foto Utama", type: "image" },
    { key: "location", label: "Lokasi", type: "text" },
    { key: "description", label: "Deskripsi", type: "textarea" },
    { key: "hours", label: "Jam Buka", type: "text" },
    { key: "price_range", label: "Kisaran Harga", type: "text" },
    { key: "facilities", label: "Fasilitas (pisahkan dengan koma)", type: "list" },
    { key: "phone", label: "Telepon", type: "text" },
    { key: "google_maps_url", label: "Link Google Maps", type: "text" },
  ],
  penginapan: [
    { key: "name", label: "Nama Usaha", type: "text" },
    { key: "image", label: "Foto Utama", type: "image" },
    { key: "location", label: "Lokasi", type: "text" },
    { key: "description", label: "Deskripsi", type: "textarea" },
    { key: "price_per_night", label: "Harga per Malam (Rp)", type: "number" },
    { key: "amenities", label: "Fasilitas (pisahkan dengan koma)", type: "list" },
  ],
  event: [
    { key: "name", label: "Nama Event", type: "text" },
    { key: "title", label: "Judul Tambahan", type: "text" },
    { key: "image", label: "Foto Utama", type: "image" },
    { key: "location", label: "Lokasi", type: "text" },
    { key: "description", label: "Deskripsi", type: "textarea" },
    { key: "price", label: "Harga Tiket (Rp)", type: "number" },
    { key: "date", label: "Tanggal Mulai", type: "date" },
    { key: "date_end", label: "Tanggal Selesai", type: "date" },
    { key: "time_start", label: "Jam Mulai", type: "time" },
    { key: "time_end", label: "Jam Selesai", type: "time" },
  ],
};

const TYPE_LABEL: Record<ListingType, string> = { wisata: "Wisata", kuliner: "Kuliner", penginapan: "Penginapan", event: "Event" };

function formatRupiah(n: number) {
  return `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
}

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

export function MitraBusinessPanel({ mitraToken, hasListing, listingType }: { mitraToken: string; hasListing: boolean; listingType?: string | null }) {
  return (
    <div className="px-4 mb-5 grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <AnalyticsSection mitraToken={mitraToken} />
      <ListingSection mitraToken={mitraToken} />
      <WalletSection mitraToken={mitraToken} />
      <OrdersSection mitraToken={mitraToken} />
      {hasListing && <ReviewsSection mitraToken={mitraToken} />}
      <GallerySection mitraToken={mitraToken} />
      {listingType === "penginapan" && <BlockedDatesSection mitraToken={mitraToken} />}
      {listingType === "event" && <ScannerSection mitraToken={mitraToken} />}
      {(listingType === "kuliner" || listingType === "wisata" || listingType === "penginapan") && (
        <VoucherScannerSection mitraToken={mitraToken} />
      )}
      <VouchersSection mitraToken={mitraToken} />
    </div>
  );
}

/* ═══════════════════════ Image Upload Field ═══════════════════════ */

function ImageUploadField({
  value, onChange, token,
}: { value: string; onChange: (url: string) => void; token: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(value);

  useEffect(() => { setPreview(value); }, [value]);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("Hanya file gambar yang diizinkan"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Ukuran file maksimal 5MB"); return; }
    setError(""); setUploading(true);
    try {
      const url = await uploadImage(token, file);
      setPreview(url);
      onChange(url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {preview && (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-gray-100">
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => { setPreview(""); onChange(""); }}
            className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      )}

      {!preview && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-28 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#0194f3] hover:text-[#0194f3] transition-colors disabled:opacity-60"
        >
          {uploading
            ? <Loader2 className="w-5 h-5 animate-spin" />
            : <><ImageIcon className="w-6 h-6" /><span className="text-xs font-semibold">Pilih foto dari galeri</span></>
          }
        </button>
      )}

      {preview && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-[11px] font-bold text-[#0194f3] px-2 py-1 rounded-lg hover:bg-blue-50 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
          {uploading ? "Mengupload…" : "Ganti foto"}
        </button>
      )}

       <p className="text-[10px] text-gray-400">Maks 5MB · otomatis WebP ≤450KB · sisi maks 1600px</p>
       <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
      {error && <p className="text-red-500 text-[11px]">{error}</p>}
    </div>
  );
}

/* ═══════════════════════ Usaha Saya ═══════════════════════ */

type LinkedListingSummary = { id: number; listing_type: string; listing_id: number; listing_name: string | null; listing_image: string | null };

const TYPE_COLOR_CLS: Record<string, string> = {
  wisata: "text-blue-600 bg-blue-50",
  kuliner: "text-orange-600 bg-orange-50",
  penginapan: "text-indigo-600 bg-indigo-50",
  event: "text-violet-600 bg-violet-50",
};

function ListingSection({ mitraToken }: { mitraToken: string }) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allListings, setAllListings] = useState<LinkedListingSummary[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [listingType, setListingType] = useState<ListingType | null>(null);
  const [listing, setListing] = useState<Record<string, any> | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Load all linked listings summary first
  function loadAll() {
    setLoading(true); setError("");
    apiReq("GET", "/auth/mitra-me/listings", mitraToken)
      .then((ls: LinkedListingSummary[]) => {
        setAllListings(ls);
        if (ls.length > 0) loadDetail(ls[0], false);
        else { setLoading(false); }
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }

  function loadDetail(item: LinkedListingSummary, showDetailLoading = true) {
    if (showDetailLoading) setDetailLoading(true);
    else setLoading(true);
    setError("");
    apiReq("GET", `/auth/mitra-me/listing?type=${item.listing_type}&id=${item.listing_id}`, mitraToken)
      .then(d => { setListingType(d.listing_type); setListing(d.listing); })
      .catch(err => setError(err.message))
      .finally(() => { setLoading(false); setDetailLoading(false); });
  }

  useEffect(() => { loadAll(); }, []);

  function selectListing(idx: number) {
    setSelectedIdx(idx);
    loadDetail(allListings[idx]);
  }

  const editUrl = listing && listingType
    ? `/mitra-usaha/edit?type=${listingType}&id=${listing.id}`
    : "/mitra-usaha/edit";

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Store className="w-[18px] h-[18px] text-blue-600" strokeWidth={1.8} />
          </div>
          <p className="font-black text-gray-800 text-sm">Usaha Saya</p>
          {allListings.length > 1 && (
            <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">{allListings.length}</span>
          )}
        </div>
        {listing && !loading && (
          <button
            onClick={() => setLocation(editUrl)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#0194f3] px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Pencil className="w-3 h-3" /> Edit
          </button>
        )}
      </div>

      {/* Tab selector for multiple listings */}
      {allListings.length > 1 && (
        <div className="px-5 pb-3 flex gap-1.5 overflow-x-auto">
          {allListings.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => selectListing(idx)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                selectedIdx === idx
                  ? "bg-[#0194f3] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {item.listing_name ?? `${TYPE_LABEL[item.listing_type as ListingType] ?? item.listing_type} #${item.listing_id}`}
            </button>
          ))}
        </div>
      )}

      {(loading || detailLoading) && <div className="flex justify-center py-6 px-5"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>}

      {!loading && !detailLoading && error && (
        <div className="mx-5 mb-5 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl px-3 py-2.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> <span>{error}</span>
        </div>
      )}

      {!loading && !detailLoading && allListings.length === 0 && !error && (
        <div className="mx-5 mb-5 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl px-3 py-2.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> <span>Usaha belum ditautkan oleh admin.{" "}
            <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="font-bold underline">
              Hubungi admin Nempo Organizer via WhatsApp
            </a>.
          </span>
        </div>
      )}

      {!loading && !detailLoading && listing && listingType && (
        <>
          {listing.image && (
            <img src={listing.image} alt={listing.name} className="w-full h-36 object-cover bg-gray-100" />
          )}
          <div className="px-5 py-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-bold text-gray-900 text-base leading-tight">{listing.name}</p>
              <span className={`inline-block shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLOR_CLS[listingType] ?? "text-blue-600 bg-blue-50"}`}>
                {TYPE_LABEL[listingType]}
              </span>
            </div>
            {listing.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{listing.description}</p>}
            <div className="space-y-1.5 text-xs mb-4">
              {listing.location && <div className="flex items-center gap-1.5 text-gray-500"><MapPin className="w-3 h-3 shrink-0 text-gray-400" />{listing.location}</div>}
              {(listing.opening_hours || listing.hours) && <div className="flex items-center gap-1.5 text-gray-500"><Clock className="w-3 h-3 shrink-0 text-gray-400" />{listing.opening_hours || listing.hours}</div>}
              {(listing.price_per_night != null || listing.price != null || listing.price_range) && (
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Wallet className="w-3 h-3 shrink-0 text-gray-400" />
                  {listing.price_range || (listing.price_per_night != null ? `${formatRupiah(listing.price_per_night)} / malam` : formatRupiah(listing.price))}
                </div>
              )}
            </div>
            <button
              onClick={() => setLocation(editUrl)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-100 rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Pencil className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#0194f3]" />
                <span className="text-xs font-bold text-gray-600 group-hover:text-[#0194f3]">Edit detail profil usaha lengkap</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#0194f3]" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════ Dompet Saya ═══════════════════════ */

const WITHDRAWAL_STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: "Menunggu Persetujuan", cls: "bg-amber-50 text-amber-600" },
  approved: { label: "Disetujui, siap dicairkan", cls: "bg-blue-50 text-blue-600" },
  processing: { label: "Sedang Dicairkan", cls: "bg-purple-50 text-purple-600" },
  completed: { label: "Selesai", cls: "bg-emerald-50 text-emerald-600" },
  rejected: { label: "Ditolak", cls: "bg-red-50 text-red-500" },
};

function WalletSection({ mitraToken }: { mitraToken: string }) {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<any>(null);
  const [history, setHistory] = useState<{ ledger: any[]; withdrawals: any[] } | null>(null);
  const [error, setError] = useState("");
  const [showBankForm, setShowBankForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [bankForm, setBankForm] = useState({ bank_name: "", bank_account_no: "", bank_account_name: "" });
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const w = await apiReq("GET", "/auth/mitra-me/wallet", mitraToken);
      setWallet(w);
      setBankForm({ bank_name: w.bank_name || "", bank_account_no: w.bank_account_no || "", bank_account_name: w.bank_account_name || "" });
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function loadHistory() {
    if (history) return;
    try { setHistory(await apiReq("GET", "/auth/mitra-me/wallet/history", mitraToken)); }
    catch (err: any) {
      setHistory({ ledger: [], withdrawals: [] });
      setError(err.message || "Gagal memuat riwayat transaksi.");
    }
  }

  async function handleSaveBank(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setFormError(""); setFormSuccess("");
    try {
      await apiReq("PUT", "/auth/mitra-me/wallet/bank", mitraToken, bankForm);
      setFormSuccess("Data rekening berhasil disimpan.");
      await load();
      setTimeout(() => { setShowBankForm(false); setFormSuccess(""); }, 1200);
    } catch (err: any) { setFormError(err.message); }
    finally { setSaving(false); }
  }

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setFormError("");
    try {
      await apiReq("POST", "/auth/mitra-me/withdrawals", mitraToken, { amount: Number(withdrawAmount) });
      setShowWithdrawForm(false);
      setWithdrawAmount("");
      setHistory(null);
      await load();
    } catch (err: any) { setFormError(err.message); }
    finally { setSaving(false); }
  }

  async function handleCancelWithdrawal() {
    if (!wallet?.pending_withdrawal?.id) return;
    setCancelling(true); setError("");
    try {
      await apiReq("DELETE", `/auth/mitra-me/withdrawals/${wallet.pending_withdrawal.id}`, mitraToken);
      setHistory(null);
      await load();
    } catch (err: any) { setError(err.message); }
    finally { setCancelling(false); }
  }

  const hasBank = wallet?.bank_name && wallet?.bank_account_no && wallet?.bank_account_name;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
          <Wallet className="w-[18px] h-[18px] text-[#0194f3]" strokeWidth={1.8} />
        </div>
        <div>
          <p className="font-black text-gray-800 text-sm leading-none">Dompet Saya</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Saldo dari penjualan tiket & penarikan dana</p>
        </div>
      </div>

      {loading && <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>}
      {!loading && error && <p className="text-xs text-red-500">{error}</p>}

      {!loading && wallet && (
        <div>
          <div className="bg-gradient-to-r from-[#001E6E] to-[#0194f3] rounded-2xl p-4 text-white mb-3">
            <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-0.5">Saldo Tersedia</p>
            <p className="text-2xl font-black">{formatRupiah(wallet.saldo)}</p>
            <p className="text-[10px] text-white/50 mt-1">Setiap tiket terjual dikurangi komisi platform {wallet.commission_percent}%</p>
          </div>

          {wallet.pending_withdrawal && (
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3 text-xs font-semibold ${WITHDRAWAL_STATUS_LABEL[wallet.pending_withdrawal.status]?.cls ?? "bg-gray-50 text-gray-600"}`}>
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1">Penarikan {formatRupiah(wallet.pending_withdrawal.amount)} — {WITHDRAWAL_STATUS_LABEL[wallet.pending_withdrawal.status]?.label ?? wallet.pending_withdrawal.status}</span>
              {wallet.pending_withdrawal.status === "pending" && (
                <button
                  onClick={handleCancelWithdrawal}
                  disabled={cancelling}
                  className="flex-shrink-0 text-[10px] font-bold underline opacity-70 hover:opacity-100 disabled:opacity-40"
                >
                  {cancelling ? <Loader2 className="w-3 h-3 animate-spin inline" /> : "Batalkan"}
                </button>
              )}
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-3.5 mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" /> Rekening Pencairan
              </p>
              <button onClick={() => setShowBankForm(true)} className="text-[11px] font-bold text-[#0194f3]">
                {hasBank ? "Ubah" : "Lengkapi"}
              </button>
            </div>
            {hasBank ? (
              <div className="text-xs text-gray-600">
                <p className="font-bold text-gray-800">{wallet.bank_name} — {wallet.bank_account_no}</p>
                <p className="text-gray-400">a.n. {wallet.bank_account_name}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-400">Lengkapi data rekening sebelum bisa mengajukan penarikan saldo.</p>
            )}
          </div>

          <div className="flex gap-2 mb-1">
            <button
              disabled={!!wallet.pending_withdrawal || wallet.saldo < wallet.min_withdrawal}
              onClick={() => setShowWithdrawForm(true)}
              className="flex-1 bg-[#0194f3] hover:bg-[#0180d6] disabled:opacity-40 text-white text-xs font-black py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Tarik Saldo
            </button>
            <button
              onClick={() => { setShowHistory(true); loadHistory(); }}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-xs font-bold flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5" /> Riwayat
            </button>
          </div>
          <p className="text-[10px] text-gray-300">Minimal penarikan {formatRupiah(wallet.min_withdrawal)}. Pencairan diproses admin dalam 3–7 hari kerja.</p>
        </div>
      )}

      {showBankForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 px-4" onClick={() => setShowBankForm(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900 text-lg">Rekening Pencairan</h3>
              <button onClick={() => setShowBankForm(false)}><X className="w-[18px] h-[18px] text-gray-400" /></button>
            </div>
            <form onSubmit={handleSaveBank} className="space-y-3.5">
              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl px-3 py-2.5">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> <span>{formSuccess}</span>
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Nama Bank</label>
                <input value={bankForm.bank_name} onChange={e => setBankForm(p => ({ ...p, bank_name: e.target.value }))}
                  placeholder="BCA / BRI / Mandiri / dll"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" required />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Nomor Rekening</label>
                <input value={bankForm.bank_account_no} onChange={e => setBankForm(p => ({ ...p, bank_account_no: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" required />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Nama Pemilik Rekening</label>
                <input value={bankForm.bank_account_name} onChange={e => setBankForm(p => ({ ...p, bank_account_name: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" required />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowBankForm(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-[#0194f3] text-white text-sm font-black disabled:opacity-60 flex items-center justify-center gap-1.5">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showWithdrawForm && wallet && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 px-4" onClick={() => setShowWithdrawForm(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900 text-lg">Tarik Saldo</h3>
              <button onClick={() => setShowWithdrawForm(false)}><X className="w-[18px] h-[18px] text-gray-400" /></button>
            </div>
            <form onSubmit={handleWithdraw} className="space-y-3.5">
              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> <span>{formError}</span>
                </div>
              )}
              <p className="text-xs text-gray-400">Saldo tersedia: <span className="font-bold text-gray-700">{formatRupiah(wallet.saldo)}</span></p>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Jumlah Penarikan (Rp)</label>
                <input
                  type="number" min={wallet.min_withdrawal} max={wallet.saldo}
                  value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder={String(wallet.min_withdrawal)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" required
                />
              </div>
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-[11px] rounded-xl px-3 py-2.5">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>Permintaan akan ditinjau admin. Dana dicairkan ke rekening {wallet.bank_name} dalam 3–7 hari kerja setelah disetujui.</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowWithdrawForm(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-[#0194f3] text-white text-sm font-black disabled:opacity-60 flex items-center justify-center gap-1.5">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ajukan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 px-4" onClick={() => setShowHistory(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[80vh] overflow-y-auto p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900 text-lg">Riwayat Dompet</h3>
              <button onClick={() => setShowHistory(false)}><X className="w-[18px] h-[18px] text-gray-400" /></button>
            </div>
            {!history && <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>}
            {history && (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Penarikan</p>
                  {history.withdrawals.length === 0 && <p className="text-xs text-gray-400">Belum ada penarikan.</p>}
                  <div className="space-y-2">
                    {history.withdrawals.map(w => (
                      <div key={w.id} className="border border-gray-100 rounded-xl p-2.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-gray-800">{formatRupiah(w.amount)}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${WITHDRAWAL_STATUS_LABEL[w.status]?.cls ?? "bg-gray-50 text-gray-500"}`}>
                            {WITHDRAWAL_STATUS_LABEL[w.status]?.label ?? w.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">{new Date(w.requested_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</p>
                        {w.admin_note && <p className="text-[10px] text-gray-400 italic mt-0.5">"{w.admin_note}"</p>}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Mutasi Saldo</p>
                  {history.ledger.length === 0 && <p className="text-xs text-gray-400">Belum ada mutasi saldo.</p>}
                  <div className="space-y-2">
                    {history.ledger.map(l => (
                      <div key={l.id} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                        <div>
                          <p className="text-xs text-gray-700">{l.note}</p>
                          <p className="text-[10px] text-gray-300">{new Date(l.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</p>
                        </div>
                        <p className={`text-xs font-black ${l.amount >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {l.amount >= 0 ? "+" : ""}{formatRupiah(l.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════ Statistik Pesanan ═══════════════════════ */

const STATUS_LABEL: Record<string, string> = { pending: "Menunggu", confirmed: "Dikonfirmasi", rejected: "Ditolak" };
const STATUS_CLS: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-600",
  rejected:  "bg-red-50 text-red-500",
  pending:   "bg-amber-50 text-amber-600",
};

function orderName(o: any, type: string) {
  if (type === "kuliner")   return o.customer_name;
  if (type === "penginapan") return o.guest_name;
  return o.buyer_name;
}
function orderPhone(o: any) { return o.buyer_phone || o.customer_phone || o.guest_phone || null; }
function orderEmail(o: any) { return o.buyer_email || o.customer_email || o.guest_email || null; }

function fmtDate(d: string | null) {
  if (!d) return "–";
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtTime(t: string | null) { return t ? t.slice(0, 5) : ""; }
function fmtTs(ts: string | null) {
  if (!ts) return "–";
  return new Date(ts).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function OrderSummaryLine({ o, type }: { o: any; type: string }) {
  if (type === "wisata")
    return <>{o.ticket_type || "Tiket Dewasa"} &times; {o.qty ?? 1} &nbsp;·&nbsp; {fmtDate(o.visit_date)}</>;
  if (type === "kuliner")
    return <>{o.num_guests ?? 1} tamu &nbsp;·&nbsp; {fmtDate(o.reservation_date)} {fmtTime(o.reservation_time)}</>;
  if (type === "penginapan")
    return <>{fmtDate(o.checkin_date)} → {fmtDate(o.checkout_date)} &nbsp;·&nbsp; {o.num_guests ?? 1} tamu</>;
  return <>{o.ticket_name || "Tiket"} &times; {o.qty ?? 1}</>;
}

function OrderDetailPanel({ o, type }: { o: any; type: string }) {
  const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-2.5">
      <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide leading-none mb-0.5">{label}</p>
        <p className="text-xs text-gray-800 font-medium break-words">{value}</p>
      </div>
    </div>
  );

  const phone = orderPhone(o);
  const email = orderEmail(o);
  const name  = orderName(o, type);

  // Attendee names for event (JSONB array of strings)
  let attendees: string[] = [];
  if (type === "event" && o.attendee_names) {
    try { attendees = typeof o.attendee_names === "string" ? JSON.parse(o.attendee_names) : o.attendee_names; }
    catch { attendees = []; }
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-50 space-y-2.5">
      {/* Kontak pemesan */}
      <DetailRow
        icon={<Users className="w-3.5 h-3.5 text-[#0194f3]" strokeWidth={2} />}
        label="Nama Pemesan"
        value={name || "–"}
      />
      {phone && (
        <DetailRow
          icon={<PhoneIcon className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />}
          label="Telepon"
          value={<a href={`tel:${phone}`} className="text-[#0194f3] underline underline-offset-2">{phone}</a>}
        />
      )}
      {email && (
        <DetailRow
          icon={<Mail className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />}
          label="Email"
          value={<a href={`mailto:${email}`} className="text-[#0194f3] underline underline-offset-2 break-all">{email}</a>}
        />
      )}

      {/* Detail per tipe */}
      {type === "wisata" && <>
        <DetailRow icon={<Ticket className="w-3.5 h-3.5 text-amber-500" strokeWidth={2} />} label="Jenis Tiket" value={`${o.ticket_type || "Dewasa"} × ${o.qty ?? 1}`} />
        <DetailRow icon={<CalendarCheck className="w-3.5 h-3.5 text-sky-500" strokeWidth={2} />} label="Tanggal Kunjungan" value={fmtDate(o.visit_date)} />
        {o.total_amount > 0 && <DetailRow icon={<TrendingUp className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />} label="Total Pembayaran" value={<span className="font-black text-emerald-700">{formatRupiah(o.total_amount)}</span>} />}
      </>}

      {type === "kuliner" && <>
        <DetailRow icon={<Users className="w-3.5 h-3.5 text-orange-400" strokeWidth={2} />} label="Jumlah Tamu" value={`${o.num_guests ?? 1} orang`} />
        <DetailRow icon={<CalendarCheck className="w-3.5 h-3.5 text-sky-500" strokeWidth={2} />} label="Reservasi" value={`${fmtDate(o.reservation_date)}${o.reservation_time ? ` pukul ${fmtTime(o.reservation_time)}` : ""}`} />
        {o.order_type && <DetailRow icon={<ShoppingBag className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />} label="Tipe Order" value={o.order_type} />}
      </>}

      {type === "penginapan" && <>
        <DetailRow icon={<CalendarCheck className="w-3.5 h-3.5 text-sky-500" strokeWidth={2} />} label="Check-in" value={fmtDate(o.checkin_date)} />
        <DetailRow icon={<CalendarCheck className="w-3.5 h-3.5 text-rose-400" strokeWidth={2} />} label="Check-out" value={fmtDate(o.checkout_date)} />
        <DetailRow icon={<Users className="w-3.5 h-3.5 text-indigo-400" strokeWidth={2} />} label="Jumlah Tamu" value={`${o.num_guests ?? 1} orang`} />
        {o.room_type && <DetailRow icon={<Store className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />} label="Tipe Kamar" value={o.room_type} />}
        {o.total_amount > 0 && <DetailRow icon={<TrendingUp className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />} label="Total Pembayaran" value={<span className="font-black text-emerald-700">{formatRupiah(o.total_amount)}</span>} />}
      </>}

      {type === "event" && <>
        <DetailRow icon={<Ticket className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />} label="Nama Tiket" value={`${o.ticket_name || "–"} × ${o.qty ?? 1}`} />
        {attendees.length > 0 && (
          <DetailRow
            icon={<Users className="w-3.5 h-3.5 text-blue-500" strokeWidth={2} />}
            label="Nama Peserta"
            value={
              <ul className="space-y-0.5 mt-0.5">
                {attendees.map((n: string, i: number) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#0194f3]/10 text-[#0194f3] text-[9px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="text-xs text-gray-800">{n}</span>
                  </li>
                ))}
              </ul>
            }
          />
        )}
        {o.total_amount > 0 && <DetailRow icon={<TrendingUp className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />} label="Total Pembayaran" value={<span className="font-black text-emerald-700">{formatRupiah(o.total_amount)}</span>} />}
        {o.payment_method && <DetailRow icon={<QrCode className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />} label="Metode Bayar" value={o.payment_method} />}
        <DetailRow
          icon={<CheckedIn className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />}
          label="Status Check-in"
          value={o.checked_in
            ? <span className="text-emerald-600 font-bold">✓ Sudah Check-in · {fmtTs(o.checked_in_at)}</span>
            : <span className="text-gray-400">Belum check-in</span>}
        />
      </>}

      {/* Catatan */}
      {o.notes && (
        <DetailRow
          icon={<StickyNote className="w-3.5 h-3.5 text-amber-400" strokeWidth={2} />}
          label="Catatan Pemesan"
          value={<span className="italic text-gray-600">"{o.notes}"</span>}
        />
      )}

      {/* Bukti pembayaran */}
      {(o.proof_url || o.payment_proof_url) && (
        <DetailRow
          icon={<ExternalLink className="w-3.5 h-3.5 text-[#0194f3]" strokeWidth={2} />}
          label="Bukti Pembayaran"
          value={
            <a href={o.proof_url || o.payment_proof_url} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 text-[#0194f3] underline underline-offset-2 font-semibold">
              Lihat Bukti <ExternalLink className="w-3 h-3" />
            </a>
          }
        />
      )}

      {/* Waktu pesan */}
      <DetailRow
        icon={<Clock className="w-3.5 h-3.5 text-gray-300" strokeWidth={2} />}
        label="Waktu Pemesanan"
        value={<span className="text-gray-400">{fmtTs(o.created_at)}</span>}
      />

      {/* QR Code e-tiket — hanya tiket yang sudah dikonfirmasi */}
      {o.status === "confirmed" && o.order_code && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
            <QrCode className="w-3 h-3" /> E-Tiket QR Code
          </p>
          <div className="flex flex-col items-center gap-2.5 bg-gray-50 rounded-2xl p-4">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <QRCode value={o.order_code} size={120} level="M" />
            </div>
            <p className="font-mono text-[11px] text-gray-500 font-bold tracking-widest">{o.order_code}</p>
            <p className="text-[10px] text-gray-400 text-center leading-relaxed">
              Tunjukkan QR ini ke petugas saat masuk venue atau gunakan untuk verifikasi manual.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersSection({ mitraToken }: { mitraToken: string }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function load() {
    setLoading(true); setError("");
    try { const d = await apiReq("GET", "/auth/mitra-me/orders", mitraToken); setData(d); }
    catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function handleStatus(id: number, status: string) {
    setUpdating(id);
    try {
      await apiReq("PUT", `/auth/mitra-me/orders/${id}/status`, mitraToken, { status });
      await load();
    } catch (err: any) { alert(err.message); }
    finally { setUpdating(null); }
  }

  const type = data?.listing_type || "event";
  const hasRevenue = ["wisata", "penginapan", "event"].includes(type);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <ShoppingBag className="w-[18px] h-[18px] text-emerald-600" strokeWidth={1.8} />
        </div>
        <div>
          <p className="font-black text-gray-800 text-sm leading-none">Pesanan Masuk</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Ketuk pesanan untuk lihat detail lengkap</p>
        </div>
      </div>

      {loading && <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>}
      {!loading && error && <p className="text-xs text-red-500">{error}</p>}

      {!loading && data && (
        <div>
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <StatBox label="Total Pesanan" value={data.summary?.total_orders ?? 0} />
            <StatBox label="Menunggu"      value={data.summary?.pending_orders ?? 0}   accent="text-amber-600" />
            <StatBox label="Dikonfirmasi"  value={data.summary?.confirmed_orders ?? 0} accent="text-emerald-600" />
            <StatBox label="Ditolak"       value={data.summary?.rejected_orders ?? 0}  accent="text-red-500" />
          </div>

          {hasRevenue && (
            <div className="bg-gradient-to-r from-[#001E6E] to-[#0194f3] rounded-2xl p-4 text-white mb-4">
              <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-0.5">Pendapatan Terkonfirmasi</p>
              <p className="text-xl font-black">{formatRupiah(data.summary?.confirmed_revenue ?? 0)}</p>
            </div>
          )}

          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pesanan Terbaru</p>
          {(data.recent?.length ?? 0) === 0 && (
            <div className="flex flex-col items-center py-6 text-gray-300">
              <ShoppingBag className="w-8 h-8 mb-2" />
              <p className="text-xs text-gray-400">Belum ada pesanan masuk.</p>
            </div>
          )}
          <div className="space-y-2.5">
            {data.recent?.map((o: any) => {
              const isOpen = expandedId === o.id;
              return (
                <div key={o.id} className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? "border-[#0194f3]/30 shadow-sm" : "border-gray-100"}`}>
                  {/* ── Header baris (selalu tampil) ── */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : o.id)}
                    className="w-full text-left p-3 flex items-start gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="font-bold text-gray-800 text-xs truncate">{orderName(o, type) || "–"}</p>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${STATUS_CLS[o.status] || "bg-gray-50 text-gray-500"}`}>
                          {STATUS_LABEL[o.status] || o.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400"><OrderSummaryLine o={o} type={type} /></p>
                      <p className="text-[10px] text-gray-300 font-mono mt-0.5">{o.order_code}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-300 shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} strokeWidth={2.5} />
                  </button>

                  {/* ── Detail panel (expand) ── */}
                  {isOpen && (
                    <div className="px-3 pb-3">
                      <OrderDetailPanel o={o} type={type} />

                      {/* Tombol aksi */}
                      {o.status === "pending" && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                          <button
                            disabled={updating === o.id}
                            onClick={() => handleStatus(o.id, "confirmed")}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-[11px] font-bold py-2 rounded-xl transition-colors"
                          >
                            {updating === o.id ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "✓ Konfirmasi"}
                          </button>
                          <button
                            disabled={updating === o.id}
                            onClick={() => handleStatus(o.id, "rejected")}
                            className="flex-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-500 text-[11px] font-bold py-2 rounded-xl border border-red-100 transition-colors"
                          >
                            {updating === o.id ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "✕ Tolak"}
                          </button>
                        </div>
                      )}
                      {o.status === "confirmed" && orderPhone(o) && (
                        <div className="mt-3 pt-3 border-t border-gray-50">
                          <a
                            href={`https://wa.me/${orderPhone(o)?.replace(/\D/g, "").replace(/^0/, "62")}?text=Halo%20${encodeURIComponent(orderName(o, type) || "")}%2C%20pesanan%20Anda%20(${o.order_code})%20sudah%20dikonfirmasi!`}
                            target="_blank" rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-[#25d366] text-white text-[11px] font-bold py-2 rounded-xl"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Notif via WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-3">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-lg font-black ${accent || "text-gray-800"}`}>{value}</p>
    </div>
  );
}

/* ═══════════════════════ Ulasan Pengunjung ═══════════════════════ */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3 h-3 ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

function ReviewsSection({ mitraToken }: { mitraToken: string }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ reviews: any[]; summary: { count: number; avg: number } } | null>(null);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    apiReq("GET", "/auth/mitra-me/reviews", mitraToken)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const reviews = data?.reviews ?? [];
  const visible = showAll ? reviews : reviews.slice(0, 4);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
            <MessageSquare className="w-[18px] h-[18px] text-amber-500" strokeWidth={1.8} />
          </div>
          <p className="font-black text-gray-800 text-sm">Ulasan Pengunjung</p>
        </div>
        {data && data.summary.count > 0 && (
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-black text-gray-800 text-sm">{data.summary.avg}</span>
            <span className="text-gray-400 text-[11px]">({data.summary.count})</span>
          </div>
        )}
      </div>

      {loading && <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>}
      {!loading && error && <p className="text-xs text-red-500">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <div className="flex flex-col items-center text-center py-6 text-gray-400">
          <Star className="w-8 h-8 mb-2 text-gray-200" strokeWidth={1.4} />
          <p className="text-xs font-semibold text-gray-400">Belum ada ulasan dari pengunjung.</p>
          <p className="text-[11px] text-gray-300 mt-0.5">Ulasan akan muncul di sini setelah pengunjung memberikan review.</p>
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <>
          {data && (
            <div className="flex items-center gap-3 bg-amber-50 rounded-2xl px-4 py-3 mb-4">
              <div className="text-center">
                <p className="text-2xl font-black text-amber-500">{data.summary.avg}</p>
                <p className="text-[10px] text-amber-400 font-bold">dari 5</p>
              </div>
              <div className="flex-1">
                <StarRating rating={Math.round(data.summary.avg)} />
                <p className="text-[11px] text-amber-600 font-semibold mt-1">
                  Berdasarkan {data.summary.count} ulasan
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {visible.map((r, idx) => (
              <div key={idx} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  {r.user_avatar
                    ? <img src={r.user_avatar} alt={r.user_name} className="w-7 h-7 rounded-full object-cover" />
                    : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0194f3] to-[#001E6E] flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-black text-white">{(r.user_name || "?")[0].toUpperCase()}</span>
                      </div>
                    )
                  }
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-xs truncate">{r.user_name || "Pengguna"}</p>
                    <p className="text-gray-400 text-[10px]">
                      {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                {r.comment && <p className="text-xs text-gray-600 leading-relaxed pl-9">{r.comment}</p>}
              </div>
            ))}
          </div>

          {reviews.length > 4 && (
            <button
              onClick={() => setShowAll(p => !p)}
              className="mt-3 w-full py-2 rounded-xl border border-gray-100 text-[11px] font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {showAll ? "Sembunyikan" : `Lihat semua ${reviews.length} ulasan`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════ Analitik Pesanan ═══════════════════════ */

function AnalyticsSection({ mitraToken }: { mitraToken: string }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ monthly: any[]; hasRevenue: boolean; listing_type: string | null } | null>(null);

  useEffect(() => {
    apiReq("GET", "/auth/mitra-me/stats", mitraToken)
      .then(setData)
      .catch(() => setData({ monthly: [], hasRevenue: false, listing_type: null }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex justify-center py-8">
      <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
    </div>
  );
  if (!data || data.monthly.length === 0) return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
          <BarChart2 className="w-[18px] h-[18px] text-indigo-600" strokeWidth={1.8} />
        </div>
        <p className="font-black text-gray-800 text-sm">Statistik Usaha</p>
      </div>
      <div className="flex flex-col items-center py-5 text-center">
        <BarChart2 className="w-8 h-8 text-gray-200 mb-2" strokeWidth={1.4} />
        <p className="text-xs text-gray-400">Statistik akan muncul setelah ada pesanan masuk.</p>
      </div>
    </div>
  );

  const monthly = data.monthly;
  const maxOrders = Math.max(...monthly.map((m: any) => m.total), 1);
  const maxRevenue = data.hasRevenue ? Math.max(...monthly.map((m: any) => Number(m.revenue)), 1) : 1;
  const totalOrders = monthly.reduce((s: number, m: any) => s + m.total, 0);
  const totalRevenue = data.hasRevenue ? monthly.reduce((s: number, m: any) => s + Number(m.revenue), 0) : 0;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
            <BarChart2 className="w-[18px] h-[18px] text-indigo-600" strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-black text-gray-800 text-sm leading-none">Statistik Usaha</p>
            <p className="text-[10px] text-gray-400 mt-0.5">6 bulan terakhir</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-gray-400">Total Pesanan</p>
            <p className="font-black text-gray-800 text-sm">{totalOrders}</p>
          </div>
          {data.hasRevenue && (
            <div className="text-right">
              <p className="text-[10px] text-gray-400">Total Pendapatan</p>
              <p className="font-black text-[#0194f3] text-sm">{formatRupiah(totalRevenue)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bar chart — pesanan */}
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pesanan per Bulan</p>
      <div className="flex items-end gap-1.5 h-20 mb-1">
        {monthly.map((m: any, i: number) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            {m.total > 0 && <span className="text-[9px] text-gray-400 font-bold">{m.total}</span>}
            <div className="w-full relative flex flex-col justify-end" style={{ height: 52 }}>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-[#0046B8] to-[#0194f3] transition-all duration-700"
                style={{ height: `${Math.max((m.total / maxOrders) * 52, m.total > 0 ? 4 : 0)}px` }}
              />
            </div>
            <span className="text-[9px] text-gray-400 truncate w-full text-center">{m.month}</span>
          </div>
        ))}
      </div>

      {/* Bar chart — pendapatan */}
      {data.hasRevenue && (
        <>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 mt-4">Pendapatan per Bulan (Dikonfirmasi)</p>
          <div className="flex items-end gap-1.5 h-20 mb-1">
            {monthly.map((m: any, i: number) => {
              const rev = Number(m.revenue);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  {rev > 0 && <span className="text-[9px] text-gray-400 font-bold">{rev >= 1000000 ? `${(rev/1000000).toFixed(1)}jt` : rev >= 1000 ? `${Math.round(rev/1000)}rb` : rev}</span>}
                  <div className="w-full relative flex flex-col justify-end" style={{ height: 52 }}>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-700"
                      style={{ height: `${Math.max((rev / maxRevenue) * 52, rev > 0 ? 4 : 0)}px` }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 truncate w-full text-center">{m.month}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Breakdown konfirmasi */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { label: "Total", value: totalOrders, color: "text-gray-800" },
          { label: "Dikonfirmasi", value: monthly.reduce((s: number, m: any) => s + m.confirmed, 0), color: "text-emerald-600" },
          { label: "Lainnya", value: totalOrders - monthly.reduce((s: number, m: any) => s + m.confirmed, 0), color: "text-amber-600" },
        ].map(item => (
          <div key={item.label} className="bg-gray-50 rounded-2xl p-2.5 text-center">
            <p className={`text-base font-black ${item.color}`}>{item.value}</p>
            <p className="text-[10px] text-gray-400 font-bold">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════ Galeri Foto ═══════════════════════ */

const MAX_GALLERY = 12;

function GallerySection({ mitraToken }: { mitraToken: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<{ id: number; image_url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try { setPhotos(await apiReq("GET", "/auth/mitra-me/gallery", mitraToken)); }
    catch (e: any) { setError(e.message || "Gagal memuat galeri."); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function handleUpload(file: File) {
    if (photos.length >= MAX_GALLERY) return;
    if (!file.type.startsWith("image/")) { setError("Hanya file gambar yang diizinkan"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Ukuran file maksimal 5MB"); return; }
    setError(""); setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API}/auth/mitra-me/gallery`, {
        method: "POST",
        headers: { Authorization: `Bearer ${mitraToken}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal upload");
      setPhotos(p => [...p, data]);
    } catch (e: any) { setError(e.message); }
    finally { setUploading(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    try {
      await apiReq("DELETE", `/auth/mitra-me/gallery/${id}`, mitraToken);
      setPhotos(p => p.filter(ph => ph.id !== id));
    } catch (e: any) { setError(e.message); }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
       <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center">
            <Images className="w-[18px] h-[18px] text-pink-500" strokeWidth={1.8} />
          </div>
       <p className="text-[10px] text-gray-400 -mt-2 mb-3">Setiap foto otomatis dikonversi ke WebP ≤450KB, sisi maks 1600px.</p>
          <div>
            <p className="font-black text-gray-800 text-sm leading-none">Galeri Foto</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{photos.length}/{MAX_GALLERY} foto ditampilkan di profil usaha</p>
          </div>
        </div>
        {photos.length < MAX_GALLERY && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1 text-[11px] font-bold text-[#0194f3] px-2.5 py-1.5 rounded-lg hover:bg-blue-50 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />}
            {uploading ? "Upload..." : "Tambah Foto"}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2.5 mb-3">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> <span>{error}</span>
        </div>
      )}

      {loading && <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>}

      {!loading && photos.length === 0 && (
        <div className="flex flex-col items-center py-8 text-center">
          <div
            onClick={() => inputRef.current?.click()}
            className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:border-[#0194f3] hover:text-[#0194f3] transition-colors cursor-pointer mb-3"
          >
            <ImagePlus className="w-7 h-7" strokeWidth={1.4} />
          </div>
          <p className="text-xs text-gray-400 font-semibold">Belum ada foto galeri</p>
          <p className="text-[11px] text-gray-300 mt-0.5">Upload foto menarik untuk menarik lebih banyak pengunjung</p>
        </div>
      )}

      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {photos.map(ph => (
            <div key={ph.id} className="relative aspect-square rounded-2xl overflow-hidden group bg-gray-100">
              <img src={ph.image_url} alt="galeri" className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete(ph.id)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          {photos.length < MAX_GALLERY && (
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-[#0194f3] hover:text-[#0194f3] transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }}
      />
    </div>
  );
}

/* ═══════════════════════ Kalender Ketersediaan (Penginapan) ═══════════════════════ */

const MONTH_NAMES_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAY_SHORT = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"];

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay + 6) % 7; // Mon=0
  const days: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/* ═══════════════════════ Scanner E-Tiket (Event) ═══════════════════════ */

type ScanResult = { ok: true; order: any } | { ok: false; error: string; order?: any };

function ScannerSection({ mitraToken }: { mitraToken: string }) {
  const [mode, setMode]         = useState<"camera" | "manual">("camera");
  const [scanning, setScanning] = useState(false);
  const [result, setResult]     = useState<ScanResult | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [busy, setBusy]         = useState(false);
  const [history, setHistory]   = useState<ScanResult[]>([]);
  const scannerRef              = useRef<any>(null);
  const didScanRef              = useRef(false);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch { /* ignore */ }
      try { scannerRef.current.clear(); } catch { /* ignore */ }
      scannerRef.current = null;
    }
    setScanning(false);
    didScanRef.current = false;
  }, []);

  const processCode = useCallback(async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    setBusy(true); setResult(null);
    try {
      const res = await fetch(`${API}/auth/mitra-me/scan/${encodeURIComponent(clean)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${mitraToken}` },
      });
      const data = await res.json();
      const r: ScanResult = res.ok ? { ok: true, order: data.order } : { ok: false, error: data.error || "Gagal scan", order: data.order };
      setResult(r);
      setHistory(prev => [r, ...prev].slice(0, 20));
    } catch (e: any) {
      const r: ScanResult = { ok: false, error: "Koneksi gagal" };
      setResult(r);
      setHistory(prev => [r, ...prev].slice(0, 20));
    } finally { setBusy(false); }
  }, [mitraToken]);

  const startScanner = useCallback(async () => {
    setResult(null); didScanRef.current = false;
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("mitra-qr-reader");
      scannerRef.current = scanner;
      setScanning(true);
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (text: string) => {
          if (didScanRef.current) return;
          didScanRef.current = true;
          await stopScanner();
          await processCode(text);
        },
        undefined
      );
    } catch (e: any) {
      setScanning(false);
      setResult({ ok: false, error: "Kamera tidak dapat diakses. Gunakan input manual." });
    }
  }, [processCode, stopScanner]);

  useEffect(() => () => { stopScanner(); }, [stopScanner]);

  async function handleManual(e: React.FormEvent) {
    e.preventDefault();
    if (!manualCode.trim()) return;
    await processCode(manualCode);
    setManualCode("");
  }

  function ResultCard({ r }: { r: ScanResult }) {
    if (r.ok) {
      const o = r.order;
      let attendees: string[] = [];
      try { attendees = typeof o.attendee_names === "string" ? JSON.parse(o.attendee_names) : (o.attendee_names ?? []); } catch { attendees = []; }
      return (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" strokeWidth={2.5} />
            <p className="font-black text-emerald-700 text-sm">Tiket Valid — Silakan Masuk!</p>
          </div>
          <div className="space-y-1.5 text-xs text-emerald-800">
            <p><span className="font-bold">Pemesan:</span> {o.buyer_name || "–"}</p>
            <p><span className="font-bold">Tiket:</span> {o.ticket_name || "–"} × {o.qty ?? 1}</p>
            {o.buyer_phone && <p><span className="font-bold">Telepon:</span> {o.buyer_phone}</p>}
            {attendees.length > 0 && (
              <div>
                <p className="font-bold mb-1">Peserta:</p>
                <ul className="space-y-0.5 pl-2">
                  {attendees.map((n: string, i: number) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-700 text-[9px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="font-mono text-[10px] text-emerald-600 mt-1">{o.order_code}</p>
          </div>
        </div>
      );
    }
    // Tiket sudah dipakai (409)
    if (r.order?.checked_in) {
      return (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" strokeWidth={2.5} />
            <p className="font-black text-amber-700 text-sm">Tiket Sudah Digunakan</p>
          </div>
          <p className="text-xs text-amber-700">{r.error}</p>
          {r.order && <p className="text-xs text-amber-600 mt-1">Pemesan: {r.order.buyer_name} · {r.order.ticket_name}</p>}
        </div>
      );
    }
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <XCircle className="w-5 h-5 text-red-500 shrink-0" strokeWidth={2.5} />
          <p className="font-black text-red-600 text-sm">Tidak Valid</p>
        </div>
        <p className="text-xs text-red-500">{r.error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <ScanLine className="w-[18px] h-[18px] text-violet-600" strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-black text-gray-800 text-sm leading-none">Scanner E-Tiket</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Scan QR tiket peserta saat masuk venue</p>
          </div>
        </div>
        {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {(["camera", "manual"] as const).map(m => (
            <button key={m} onClick={() => { stopScanner(); setMode(m); setResult(null); }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${mode === m ? "bg-white shadow text-gray-800" : "text-gray-400"}`}>
              {m === "camera" ? "📷 Kamera" : "⌨️ Manual"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: scanner / input */}
        <div>
          {mode === "camera" ? (
            <div>
              {/* Viewfinder */}
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden mb-3" style={{ minHeight: 240 }}>
                <div id="mitra-qr-reader" className="w-full" />
                {!scanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                      <ScanLine className="w-8 h-8 text-white/60" strokeWidth={1.5} />
                    </div>
                    <p className="text-white/50 text-xs">Kamera belum aktif</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {!scanning ? (
                  <button onClick={startScanner} disabled={busy}
                    className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold py-3 rounded-2xl transition-colors disabled:opacity-50">
                    <ScanLine className="w-4 h-4" /> Mulai Scan
                  </button>
                ) : (
                  <button onClick={stopScanner}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-500 border border-red-100 text-sm font-bold py-3 rounded-2xl">
                    <X className="w-4 h-4" /> Stop Kamera
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleManual} className="space-y-3">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <KeyRound className="w-3 h-3" /> Input Kode Tiket
                </p>
                <input
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: NGE-XXXXXXXX"
                  className="w-full font-mono text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 uppercase tracking-widest"
                  autoComplete="off"
                />
              </div>
              <button type="submit" disabled={busy || !manualCode.trim()}
                className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-bold py-3 rounded-2xl transition-colors">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Verifikasi Tiket</>}
              </button>
            </form>
          )}

          {/* Result */}
          {(busy || result) && (
            <div className="mt-3">
              {busy && (
                <div className="flex items-center justify-center gap-2 py-4 bg-gray-50 rounded-2xl">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                  <span className="text-sm text-gray-500">Memverifikasi tiket…</span>
                </div>
              )}
              {!busy && result && (
                <div>
                  <ResultCard r={result} />
                  <button onClick={() => { setResult(null); if (mode === "camera") { didScanRef.current = false; startScanner(); } }}
                    className="w-full mt-2 py-2.5 text-sm font-bold text-violet-600 flex items-center justify-center gap-1.5 hover:bg-violet-50 rounded-xl transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> Scan Berikutnya
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: scan history */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <History className="w-3 h-3" /> Riwayat Scan ({history.length})
          </p>
          {history.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-gray-200">
              <ScanLine className="w-8 h-8 mb-2" />
              <p className="text-xs text-gray-400">Belum ada scan</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {history.map((r, i) => (
                <div key={i} className={`rounded-xl px-3 py-2.5 border text-xs flex items-start gap-2 ${r.ok ? "bg-emerald-50 border-emerald-100" : r.order?.checked_in ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"}`}>
                  {r.ok
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                    : r.order?.checked_in
                      ? <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" strokeWidth={2.5} />}
                  <div className="min-w-0">
                    {r.ok
                      ? <><p className="font-bold text-emerald-800 truncate">{r.order.buyer_name}</p><p className="text-emerald-600 truncate">{r.order.ticket_name} × {r.order.qty}</p></>
                      : <><p className="font-bold text-red-600 truncate">{r.order?.buyer_name || "–"}</p><p className="truncate text-[10px]">{r.error}</p></>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BlockedDatesSection({ mitraToken }: { mitraToken: string }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const rows: { blocked_date: string }[] = await apiReq("GET", "/auth/mitra-me/blocked-dates", mitraToken);
      setBlockedDates(rows.map(r => r.blocked_date.slice(0, 10)));
    } catch (e: any) { setError(e.message || "Gagal memuat kalender."); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function toggleDate(dateStr: string) {
    const todayStr = today.toISOString().slice(0, 10);
    if (dateStr < todayStr) return; // jangan blokir masa lalu
    setToggling(dateStr); setError("");
    try {
      if (blockedDates.includes(dateStr)) {
        await apiReq("DELETE", `/auth/mitra-me/blocked-dates/${dateStr}`, mitraToken);
        setBlockedDates(p => p.filter(d => d !== dateStr));
      } else {
        await apiReq("POST", "/auth/mitra-me/blocked-dates", mitraToken, { date: dateStr });
        setBlockedDates(p => [...p, dateStr].sort());
      }
    } catch (e: any) { setError(e.message); }
    finally { setToggling(null); }
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const days = getCalendarDays(viewYear, viewMonth);
  const todayStr = today.toISOString().slice(0, 10);
  const blockedThisMonth = blockedDates.filter(d => d.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`)).length;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
            <CalendarX className="w-[18px] h-[18px] text-rose-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-black text-gray-800 text-sm leading-none">Kalender Ketersediaan</p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {blockedDates.length === 0 ? "Semua tanggal tersedia" : `${blockedDates.length} tanggal diblokir · ${blockedThisMonth} bulan ini`}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2.5 mb-3">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> <span>{error}</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 text-[10px] text-gray-400 font-semibold">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300 inline-block" />Tersedia</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-300 inline-block" />Diblokir</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200 inline-block" />Lewat</span>
      </div>

      {/* Header bulan */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <p className="font-black text-gray-800 text-sm">{MONTH_NAMES_ID[viewMonth]} {viewYear}</p>
        <button onClick={nextMonth} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
      ) : (
        <>
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_SHORT.map(d => (
              <div key={d} className="text-center text-[10px] font-black text-gray-400 py-1">{d}</div>
            ))}
          </div>
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const dateStr = toDateStr(viewYear, viewMonth, day);
              const isPast = dateStr < todayStr;
              const isBlocked = blockedDates.includes(dateStr);
              const isTogglingThis = toggling === dateStr;

              return (
                <button
                  key={dateStr}
                  disabled={isPast || isTogglingThis}
                  onClick={() => toggleDate(dateStr)}
                  className={`
                    aspect-square rounded-lg text-[11px] font-bold flex items-center justify-center transition-all
                    ${isPast ? "text-gray-200 cursor-not-allowed" : ""}
                    ${!isPast && isBlocked ? "bg-rose-100 text-rose-600 border border-rose-300 hover:bg-rose-200" : ""}
                    ${!isPast && !isBlocked ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" : ""}
                    ${dateStr === todayStr ? "ring-2 ring-[#0194f3] ring-offset-1" : ""}
                  `}
                >
                  {isTogglingThis ? <Loader2 className="w-3 h-3 animate-spin" /> : day}
                </button>
              );
            })}
          </div>
        </>
      )}

      <p className="text-[10px] text-gray-300 mt-3 text-center">Klik tanggal untuk blokir / buka kembali ketersediaan kamar</p>
    </div>
  );
}

/* ═══════════════════════ Scanner Voucher (Non-Event Mitra) ═══════════════════════ */

type VoucherRedeemResult =
  | { ok: true; voucher: { title: string; code: string; discount_type: string; discount_value: number; min_purchase?: number; applicable_type: string } }
  | { ok: false; error: string; voucher?: { title: string; code: string } };

function VoucherScannerSection({ mitraToken }: { mitraToken: string }) {
  const [mode, setMode]         = useState<"camera" | "manual">("camera");
  const [scanning, setScanning] = useState(false);
  const [result, setResult]     = useState<VoucherRedeemResult | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [busy, setBusy]         = useState(false);
  const [history, setHistory]   = useState<VoucherRedeemResult[]>([]);
  const scannerRef              = useRef<any>(null);
  const didScanRef              = useRef(false);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch { /* ignore */ }
      try { scannerRef.current.clear(); } catch { /* ignore */ }
      scannerRef.current = null;
    }
    setScanning(false);
    didScanRef.current = false;
  }, []);

  const processCode = useCallback(async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    setBusy(true); setResult(null);
    try {
      const res = await fetch(`${API}/auth/mitra-me/redeem-voucher/${encodeURIComponent(clean)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${mitraToken}` },
      });
      const data = await res.json();
      const r: VoucherRedeemResult = res.ok
        ? { ok: true, voucher: data.voucher }
        : { ok: false, error: data.error || "Gagal verifikasi", voucher: data.voucher };
      setResult(r);
      setHistory(prev => [r, ...prev].slice(0, 20));
    } catch {
      const r: VoucherRedeemResult = { ok: false, error: "Koneksi gagal" };
      setResult(r);
      setHistory(prev => [r, ...prev].slice(0, 20));
    } finally { setBusy(false); }
  }, [mitraToken]);

  const startScanner = useCallback(async () => {
    setResult(null); didScanRef.current = false;
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("mitra-voucher-qr-reader");
      scannerRef.current = scanner;
      setScanning(true);
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (text: string) => {
          if (didScanRef.current) return;
          didScanRef.current = true;
          await stopScanner();
          await processCode(text);
        },
        undefined
      );
    } catch {
      setScanning(false);
      setResult({ ok: false, error: "Kamera tidak dapat diakses. Gunakan input manual." });
    }
  }, [processCode, stopScanner]);

  useEffect(() => () => { stopScanner(); }, [stopScanner]);

  async function handleManual(e: React.FormEvent) {
    e.preventDefault();
    if (!manualCode.trim()) return;
    await processCode(manualCode);
    setManualCode("");
  }

  function formatDiscount(v: VoucherRedeemResult & { ok: true }) {
    const val = v.voucher.discount_value;
    return v.voucher.discount_type === "fixed"
      ? `Rp${Number(val).toLocaleString("id-ID")}`
      : `${val}%`;
  }

  function VoucherResultCard({ r }: { r: VoucherRedeemResult }) {
    if (r.ok) {
      return (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" strokeWidth={2.5} />
            <p className="font-black text-emerald-700 text-sm">Voucher Valid — Berikan Diskon!</p>
          </div>
          <div className="space-y-1.5 text-xs text-emerald-800">
            <p><span className="font-bold">Nama Promo:</span> {r.voucher.title}</p>
            <p><span className="font-bold">Diskon:</span> <span className="font-black text-lg">{formatDiscount(r)}</span></p>
            {r.voucher.min_purchase ? (
              <p><span className="font-bold">Min. Pembelian:</span> Rp{Number(r.voucher.min_purchase).toLocaleString("id-ID")}</p>
            ) : null}
            <p className="font-mono text-[10px] text-emerald-600 mt-1">{r.voucher.code}</p>
          </div>
        </div>
      );
    }
    if (r.voucher) {
      return (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" strokeWidth={2.5} />
            <p className="font-black text-amber-700 text-sm">Voucher Tidak Dapat Digunakan</p>
          </div>
          <p className="text-xs text-amber-700">{r.error}</p>
          <p className="text-xs text-amber-600 mt-1 font-mono">{r.voucher.title} · {r.voucher.code}</p>
        </div>
      );
    }
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <XCircle className="w-5 h-5 text-red-500 shrink-0" strokeWidth={2.5} />
          <p className="font-black text-red-600 text-sm">Tidak Valid</p>
        </div>
        <p className="text-xs text-red-500">{r.error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
            <BadgePercent className="w-[18px] h-[18px] text-orange-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-black text-gray-800 text-sm leading-none">Scan Voucher Pelanggan</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Verifikasi kode promo dari aplikasi Nempo Organizer</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {(["camera", "manual"] as const).map(m => (
            <button key={m} onClick={() => { stopScanner(); setMode(m); setResult(null); }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${mode === m ? "bg-white shadow text-gray-800" : "text-gray-400"}`}>
              {m === "camera" ? "📷 Kamera" : "⌨️ Manual"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: scanner / input */}
        <div>
          {mode === "camera" ? (
            <div>
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden mb-3" style={{ minHeight: 240 }}>
                <div id="mitra-voucher-qr-reader" className="w-full" />
                {!scanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                      <ScanLine className="w-8 h-8 text-white/60" strokeWidth={1.5} />
                    </div>
                    <p className="text-white/50 text-xs">Kamera belum aktif</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {!scanning ? (
                  <button onClick={startScanner} disabled={busy}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-3 rounded-2xl transition-colors disabled:opacity-50">
                    <ScanLine className="w-4 h-4" /> Scan QR Voucher
                  </button>
                ) : (
                  <button onClick={stopScanner}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-500 border border-red-100 text-sm font-bold py-3 rounded-2xl">
                    <X className="w-4 h-4" /> Stop Kamera
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleManual} className="space-y-3">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <KeyRound className="w-3 h-3" /> Input Kode Voucher
                </p>
                <input
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: NEMPO10-U123"
                  className="w-full font-mono text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 uppercase tracking-widest"
                  autoComplete="off"
                />
              </div>
              <button type="submit" disabled={busy || !manualCode.trim()}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold py-3 rounded-2xl transition-colors">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Verifikasi Voucher</>}
              </button>
            </form>
          )}

          {/* Result */}
          {(busy || result) && (
            <div className="mt-3">
              {busy && (
                <div className="flex items-center justify-center gap-2 py-4 bg-gray-50 rounded-2xl">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  <span className="text-sm text-gray-500">Memverifikasi voucher…</span>
                </div>
              )}
              {!busy && result && (
                <div>
                  <VoucherResultCard r={result} />
                  <button onClick={() => { setResult(null); if (mode === "camera") { didScanRef.current = false; startScanner(); } }}
                    className="w-full mt-2 py-2.5 text-sm font-bold text-orange-500 flex items-center justify-center gap-1.5 hover:bg-orange-50 rounded-xl transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> Scan Berikutnya
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: redeem history */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <History className="w-3 h-3" /> Riwayat Redeem ({history.length})
          </p>
          {history.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-gray-200">
              <BadgePercent className="w-8 h-8 mb-2 text-gray-200" />
              <p className="text-xs text-gray-400">Belum ada voucher diverifikasi</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {history.map((r, i) => (
                <div key={i} className={`rounded-xl px-3 py-2.5 border text-xs flex items-start gap-2 ${
                  r.ok ? "bg-emerald-50 border-emerald-100" : r.voucher ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"
                }`}>
                  {r.ok
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                    : r.voucher
                      ? <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" strokeWidth={2.5} />}
                  <div className="min-w-0">
                    {r.ok
                      ? <><p className="font-bold text-emerald-800 truncate">{r.voucher.title}</p><p className="text-emerald-600 truncate">{r.voucher.discount_type === "fixed" ? `Rp${Number(r.voucher.discount_value).toLocaleString("id-ID")}` : `${r.voucher.discount_value}%`} diskon</p></>
                      : <><p className="font-bold text-red-600 truncate">{r.voucher?.title || "–"}</p><p className="truncate text-[10px]">{r.error}</p></>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ Promo Saya ═══════════════════════ */

const emptyVoucher = { title: "", code: "", discount_type: "persen", discount_value: "", min_purchase: "", expiry_date: "", description: "", active: true };

function VouchersSection({ mitraToken }: { mitraToken: string }) {
  const [loading, setLoading] = useState(true);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<{ open: boolean; editing: any | null }>({ open: false, editing: null });
  const [form, setForm] = useState<typeof emptyVoucher>(emptyVoucher);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function load() {
    setLoading(true);
    apiReq("GET", "/auth/mitra-me/vouchers", mitraToken)
      .then(setVouchers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(emptyVoucher); setFormError(""); setModal({ open: true, editing: null }); }
  function openEdit(v: any) {
    setForm({
      title: v.title, code: v.code, discount_type: v.discount_type, discount_value: String(v.discount_value),
      min_purchase: v.min_purchase ? String(v.min_purchase) : "", expiry_date: v.expiry_date ? String(v.expiry_date).slice(0, 10) : "",
      description: v.description || "", active: v.active,
    });
    setFormError("");
    setModal({ open: true, editing: v });
  }

  async function handleDelete(v: any) {
    if (!confirm(`Hapus promo "${v.title}"?`)) return;
    await apiReq("DELETE", `/auth/mitra-me/vouchers/${v.id}`, mitraToken);
    load();
  }

  async function handleToggle(v: any) {
    await apiReq("PUT", `/auth/mitra-me/vouchers/${v.id}`, mitraToken, { active: !v.active });
    load();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setFormError("");
    try {
      const payload = {
        title: form.title, code: form.code, discount_type: form.discount_type,
        discount_value: Number(form.discount_value) || 0,
        min_purchase: Number(form.min_purchase) || 0,
        expiry_date: form.expiry_date || null,
        description: form.description || null,
        active: form.active,
      };
      if (modal.editing) await apiReq("PUT", `/auth/mitra-me/vouchers/${modal.editing.id}`, mitraToken, payload);
      else await apiReq("POST", "/auth/mitra-me/vouchers", mitraToken, payload);
      setModal({ open: false, editing: null });
      load();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
            <BadgePercent className="w-[18px] h-[18px] text-purple-600" strokeWidth={1.8} />
          </div>
          <p className="font-black text-gray-800 text-sm">Promo Saya</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1 text-[11px] font-bold text-[#0194f3] px-2.5 py-1.5 rounded-lg hover:bg-blue-50">
          <Plus className="w-3.5 h-3.5" /> Tambah
        </button>
      </div>

      {loading && <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>}
      {!loading && error && <p className="text-xs text-red-500">{error}</p>}
      {!loading && !error && vouchers.length === 0 && (
        <div className="flex flex-col items-center text-center py-6 text-gray-400">
          <Ticket className="w-8 h-8 mb-2" strokeWidth={1.4} />
          <p className="text-xs">Belum ada promo. Buat promo pertamamu!</p>
        </div>
      )}

      <div className="space-y-2.5">
        {vouchers.map(v => (
          <div key={v.id} className="border border-gray-100 rounded-2xl p-3.5">
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <p className="font-bold text-gray-800 text-sm">{v.title}</p>
                <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{v.code}</span>
              </div>
              <button onClick={() => handleToggle(v)} className={`px-2 py-0.5 rounded-full text-[10px] font-black ${v.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>
                {v.active ? "Aktif" : "Nonaktif"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Diskon {v.discount_type === "percent" ? `${v.discount_value}%` : formatRupiah(v.discount_value)}
              {v.min_purchase ? ` · min. ${formatRupiah(v.min_purchase)}` : ""}
              {v.expiry_date ? ` · s/d ${new Date(v.expiry_date).toLocaleDateString("id-ID")}` : ""}
            </p>
            <div className="flex gap-2">
              <button onClick={() => openEdit(v)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-bold"><Pencil className="w-3 h-3" /> Edit</button>
              <button onClick={() => handleDelete(v)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-red-100 text-red-500 text-xs font-bold"><Trash2 className="w-3 h-3" /> Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 px-4" onClick={() => setModal({ open: false, editing: null })}>
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[85vh] overflow-y-auto p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900 text-lg">{modal.editing ? "Edit Promo" : "Tambah Promo"}</h3>
              <button onClick={() => setModal({ open: false, editing: null })}><X className="w-[18px] h-[18px] text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> <span>{formError}</span>
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Nama Promo</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Kode Voucher</label>
                <input required value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none font-mono focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Jenis Diskon</label>
                  <select value={form.discount_type} onChange={e => setForm(p => ({ ...p, discount_type: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15">
                    <option value="percent">Persen (%)</option>
                    <option value="fixed">Nominal (Rp)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Besar Diskon</label>
                  <input required type="number" value={form.discount_value} onChange={e => setForm(p => ({ ...p, discount_value: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Minimal Pembelian (Rp)</label>
                <input type="number" value={form.min_purchase} onChange={e => setForm(p => ({ ...p, min_purchase: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Berlaku Sampai</label>
                <input type="date" value={form.expiry_date} onChange={e => setForm(p => ({ ...p, expiry_date: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Deskripsi</label>
                <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#0194f3] focus:ring-2 focus:ring-[#0194f3]/15 resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 rounded accent-[#0194f3]" />
                <span className="flex items-center gap-1"><Power className="w-3.5 h-3.5" /> Aktifkan promo</span>
              </label>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setModal({ open: false, editing: null })} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-[#0194f3] text-white text-sm font-black disabled:opacity-60 flex items-center justify-center gap-1.5">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
