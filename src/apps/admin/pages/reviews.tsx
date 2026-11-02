import { useEffect, useState } from "react";
import { Star, Trash2, Eye, EyeOff, MessageSquare, Search, Filter, RefreshCw } from "lucide-react";

const API = "/api";

interface Review {
  id: number;
  item_type: string;
  item_id: number;
  item_name: string | null;
  user_id: number | null;
  user_name: string;
  user_email: string | null;
  user_avatar: string | null;
  rating: number;
  comment: string;
  visible: boolean;
  created_at: string;
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= value ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </span>
  );
}

function Avatar({ name, picture }: { name: string; picture?: string | null }) {
  const [err, setErr] = useState(false);
  if (picture && !err) return <img src={picture} alt={name} onError={() => setErr(true)} className="h-8 w-8 rounded-full object-cover shrink-0" />;
  const initials = name.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();
  const colors = ["bg-blue-500","bg-violet-500","bg-emerald-500","bg-orange-500","bg-rose-500","bg-cyan-500"];
  return <div className={`${colors[name.charCodeAt(0)%colors.length]} h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>{initials}</div>;
}

const TYPE_LABELS: Record<string,string> = { wisata: "Wisata", kuliner: "Kuliner", penginapan: "Penginapan" };

export default function ReviewsPage() {
  const token = localStorage.getItem("nempo_admin_token") ?? "";
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [itemType, setItemType] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const q = new URLSearchParams({ limit: "100" });
    if (search) q.set("search", search);
    if (itemType) q.set("item_type", itemType);
    const res = await fetch(`${API}/admin/reviews?${q}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setReviews(data.reviews);
      setTotal(data.total);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [search, itemType]);

  async function toggleVisibility(id: number, visible: boolean) {
    setToggling(id);
    await fetch(`${API}/admin/reviews/${id}/visibility`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ visible: !visible }),
    });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, visible: !visible } : r));
    setToggling(null);
  }

  async function deleteReview(id: number) {
    if (!confirm("Hapus ulasan ini? Tindakan tidak bisa dibatalkan.")) return;
    setDeleting(id);
    await fetch(`${API}/admin/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setReviews(prev => prev.filter(r => r.id !== id));
    setTotal(t => t - 1);
    setDeleting(null);
  }

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const dist = [5,4,3,2,1].map(s => ({ s, c: reviews.filter(r => r.rating === s).length }));

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Ulasan &amp; Rating</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total ulasan dari pengguna Nempo</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-colors disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex flex-wrap gap-8 items-start">
            <div className="text-center">
              <div className="text-4xl font-black text-gray-900">{avgRating.toFixed(1)}</div>
              <Stars value={avgRating} />
              <p className="text-xs text-gray-400 mt-1">Rata-rata</p>
            </div>
            <div className="flex-1 min-w-48 space-y-1.5">
              {dist.map(({ s, c }) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3 text-right">{s}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${reviews.length ? (c/reviews.length)*100 : 0}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-6">{c}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(TYPE_LABELS).map(([k, label]) => {
                const count = reviews.filter(r => r.item_type === k).length;
                return (
                  <div key={k} className="text-center bg-gray-50 rounded-xl px-4 py-2">
                    <div className="text-lg font-black text-gray-900">{count}</div>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                );
              })}
              <div className="text-center bg-red-50 rounded-xl px-4 py-2">
                <div className="text-lg font-black text-red-600">{reviews.filter(r => !r.visible).length}</div>
                <p className="text-xs text-red-400">Disembunyikan</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau komentar..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300" />
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select value={itemType} onChange={e => setItemType(e.target.value)}
            className="text-sm text-gray-700 focus:outline-none bg-transparent">
            <option value="">Semua Kategori</option>
            <option value="wisata">Wisata</option>
            <option value="kuliner">Kuliner</option>
            <option value="penginapan">Penginapan</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="font-semibold text-gray-500">Belum ada ulasan</p>
            <p className="text-sm text-gray-400 mt-1">Ulasan dari pengunjung akan muncul di sini</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {reviews.map(r => (
              <div key={r.id} className={`px-5 py-4 flex gap-4 items-start hover:bg-gray-50/50 transition-colors ${!r.visible ? "opacity-50" : ""}`}>
                <Avatar name={r.user_name} picture={r.user_avatar} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-gray-900">{r.user_name}</span>
                        {r.user_email && <span className="text-xs text-gray-400">{r.user_email}</span>}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          r.item_type === "wisata" ? "bg-blue-50 text-blue-600" :
                          r.item_type === "kuliner" ? "bg-orange-50 text-orange-600" :
                          "bg-purple-50 text-purple-600"
                        }`}>
                          {TYPE_LABELS[r.item_type] ?? r.item_type}
                          {r.item_name ? ` · ${r.item_name}` : ""}
                        </span>
                        {!r.visible && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500">Disembunyikan</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Stars value={r.rating} />
                        <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toggleVisibility(r.id, r.visible)} disabled={toggling === r.id}
                        title={r.visible ? "Sembunyikan" : "Tampilkan"}
                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50">
                        {r.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button onClick={() => deleteReview(r.id)} disabled={deleting === r.id}
                        title="Hapus ulasan"
                        className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {r.comment && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
