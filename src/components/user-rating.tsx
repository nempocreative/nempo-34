import { useState } from "react";
import { Star, MessageSquare, Send, ThumbsUp, LogIn, User } from "lucide-react";
import { useReviews } from "@/hooks/use-reviews";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "@/lib/wouter";

/* ── Star display ── */
function Stars({ value, max = 5, size = "md" }: { value: number; max?: number; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} className={`${sizes[size]} ${i < Math.round(value) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </span>
  );
}

/* ── Interactive star picker ── */
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const labels = ["", "Buruk", "Kurang", "Cukup", "Bagus", "Sangat Bagus"];
  const active = hover || value;
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} type="button"
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(s)}
            className="focus:outline-none transition-transform hover:scale-110">
            <Star className={`h-7 w-7 transition-colors ${s <= active ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
          </button>
        ))}
      </div>
      {active > 0 && <span className="text-sm font-semibold text-yellow-600">{labels[active]}</span>}
    </div>
  );
}

/* ── Avatar ── */
function Avatar({ name, picture }: { name: string; picture?: string | null }) {
  const [imgErr, setImgErr] = useState(false);
  if (picture && !imgErr) {
    return (
      <img src={picture} alt={name}
        onError={() => setImgErr(true)}
        className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100 shrink-0" />
    );
  }
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const colors = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-[#0194f3]", "bg-rose-500", "bg-cyan-500"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`${color} h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {initials}
    </div>
  );
}

/* ── Main export ── */
export function UserRating({ itemType, itemId, locationName }: {
  itemType: string;
  itemId: number | string;
  locationName: string;
}) {
  const { reviews, loading, addReview, averageRating, distribution } = useReviews(itemType, itemId);
  const { user, token } = useAuth();

  const [formOpen,  setFormOpen]  = useState(false);
  const [rating,    setRating]    = useState(0);
  const [comment,   setComment]   = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");
  const [saving,    setSaving]    = useState(false);
  const [showAll,   setShowAll]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;
    if (rating === 0) { setError("Pilih bintang rating terlebih dahulu."); return; }
    if (!comment.trim()) { setError("Tulis komentar singkat ya."); return; }
    setSaving(true);
    try {
      await addReview(token, rating, comment);
      setRating(0);
      setComment("");
      setError("");
      setSubmitted(true);
      setFormOpen(false);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan. Silakan coba lagi.");
    }
    setSaving(false);
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-4 w-4 text-[#0194f3]" />
          <h3 className="font-extrabold text-gray-900">Ulasan Nempo</h3>
          {reviews.length > 0 && (
            <span className="ml-auto text-[10px] font-bold text-gray-400">{reviews.length} ulasan</span>
          )}
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
          Ulasan dari komunitas Nempo Organizer. Rating Google Maps ditampilkan sebagai sumber terpisah.
        </p>

        {/* Rating summary — hanya tampil kalau ada review */}
        {reviews.length > 0 ? (
          <div className="flex gap-6 items-start">
            <div className="text-center shrink-0">
              <div className="text-5xl font-black text-gray-900 leading-none">{averageRating.toFixed(1)}</div>
              <Stars value={averageRating} size="sm" />
              <p className="text-[10px] text-gray-400 mt-1">{reviews.length} ulasan</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {distribution.map(({ star, count }) => {
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500 w-3 text-right shrink-0">{star}</span>
                    <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400 shrink-0" />
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400 w-4 shrink-0">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : !loading && (
          <div className="flex items-center gap-3 py-2">
            <div className="h-12 w-12 rounded-2xl bg-yellow-50 flex items-center justify-center shrink-0">
              <Star className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="font-bold text-gray-700 text-sm">Belum ada ulasan</p>
              <p className="text-xs text-gray-400">Jadilah yang pertama memberi ulasan!</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Write review area ── */}
      <div className="px-5 py-4 border-b border-gray-50">
        {submitted && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 mb-4 text-sm font-semibold">
            <ThumbsUp className="h-4 w-4" />
            Terima kasih! Ulasan Anda sudah ditambahkan.
          </div>
        )}

        {!user ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <p className="text-sm text-gray-500 text-center">Masuk ke akun Nempo untuk memberi ulasan</p>
            <Link to="/masuk"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
              style={{ background: "#0194f3" }}>
              <LogIn className="h-4 w-4" /> Masuk / Daftar
            </Link>
          </div>
        ) : !formOpen ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2">
              <Avatar name={user.name} picture={user.avatar_url} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-xs truncate">{user.name}</p>
                <p className="text-gray-400 text-[10px] truncate">{user.email}</p>
              </div>
              <User className="h-4 w-4 text-gray-300 shrink-0" />
            </div>
            <button onClick={() => setFormOpen(true)}
              className="w-full flex flex-col items-center justify-center gap-0.5 border-2 border-dashed border-[#0194f3]/30 hover:border-[#0194f3]/60 hover:bg-[#0194f3]/5 text-[#0194f3] rounded-xl py-3 px-3 transition-all">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 shrink-0" />
                <span className="text-sm font-bold">Tulis Ulasan</span>
              </div>
              <span className="text-[11px] font-semibold text-[#0194f3]/70 text-center leading-snug break-words w-full">
                untuk {locationName}
              </span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-2 block">Rating Anda</label>
                <StarPicker value={rating} onChange={(v) => { setRating(v); setError(""); }} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Komentar</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={`Ceritakan pengalaman Anda di ${locationName}...`}
                  rows={3}
                  className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0194f3]/20 focus:border-[#0194f3]/50"
                />
              </div>
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button type="button"
                  onClick={() => { setFormOpen(false); setError(""); setRating(0); setComment(""); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                  style={{ background: "#0194f3" }}>
                  <Send className="h-3.5 w-3.5" /> {saving ? "Menyimpan..." : "Kirim Ulasan"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* ── Review list ── */}
      {reviews.length > 0 && (
        <div className="px-5 pb-5 space-y-4 pt-4">
          {displayedReviews.map((r) => (
            <div key={r.id} className="flex gap-3">
              <Avatar name={r.name} picture={r.picture} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm text-gray-900">{r.name}</p>
                    <Stars value={r.rating} size="sm" />
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">{r.date}</span>
                </div>
                {r.comment && (
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{r.comment}</p>
                )}
              </div>
            </div>
          ))}

          {reviews.length > 3 && (
            <button onClick={() => setShowAll(s => !s)}
              className="w-full flex items-center justify-center gap-1.5 text-[#0194f3] text-sm font-semibold hover:underline pt-1">
              {showAll ? "Tampilkan lebih sedikit" : `Lihat semua ${reviews.length} ulasan`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
