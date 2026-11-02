import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "@/lib/wouter";
import { ArrowLeft, Star, MessageSquare, Clock, Loader2 } from "lucide-react";

const API = "/api";

interface MyReview {
  id: number;
  item_type: string;
  item_id: number;
  item_name: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

const typeLabel: Record<string, string> = {
  wisata: "Wisata", kuliner: "Kuliner", penginapan: "Penginapan", event: "Event",
};
const typeColor: Record<string, string> = {
  wisata: "text-sky-600 bg-sky-50", kuliner: "text-orange-600 bg-orange-50",
  penginapan: "text-teal-600 bg-teal-50", event: "text-violet-600 bg-violet-50",
};

export default function UlasanPage() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(`${API}/user/reviews`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(d => setReviews(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Layout>
      <SEO title="Ulasan Saya" noIndex />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <Link href="/profil">
            <button className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-bold text-gray-900 text-[15px]">Ulasan Saya</h1>
            {!loading && <p className="text-[10px] text-gray-400">{reviews.length} ulasan ditulis</p>}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-[#0194f3]" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-2xl bg-yellow-50 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Belum ada ulasan</h3>
              <p className="text-sm text-gray-400 max-w-xs">Mulai bagikan pengalamanmu setelah mengunjungi tempat wisata atau mencoba kuliner di Garut.</p>
              <Link href="/wisata">
                <button className="mt-5 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#0194f3,#0172B1)" }}>
                  Jelajahi Wisata
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColor[r.item_type] ?? "text-gray-600 bg-gray-50"}`}>
                        {typeLabel[r.item_type] ?? r.item_type}{r.item_name ? ` · ${r.item_name}` : ` #${r.item_id}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
                  <div className="flex items-center gap-1 mt-2 text-gray-400 text-[10px]">
                    <Clock className="h-3 w-3" />
                    {new Date(r.created_at).toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
