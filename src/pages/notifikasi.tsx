import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import { ArrowLeft, Bell, BellOff, Megaphone, Tag, Info, Loader2, RefreshCw, AlertTriangle } from "lucide-react";

const API = "/api";

interface Notif {
  id: number;
  title: string;
  message: string;
  type: string;
  href: string;
  created_at: string;
}

const typeIcon: Record<string, typeof Bell> = {
  promo: Tag, info: Info, event: Megaphone, update: RefreshCw, warning: AlertTriangle,
};
const typeColor: Record<string, string> = {
  promo: "text-orange-500 bg-orange-50", info: "text-[#0194f3] bg-blue-50",
  event: "text-teal-600 bg-teal-50", update: "text-violet-600 bg-violet-50",
  warning: "text-red-500 bg-red-50",
};

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 2) return "baru saja";
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

export default function NotifikasiPage() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/notifications`)
      .then(r => r.ok ? r.json() : [])
      .then(d => setNotifs(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <SEO title="Notifikasi" noIndex />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <button className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-bold text-gray-900 text-[15px]">Notifikasi</h1>
            {!loading && <p className="text-[10px] text-gray-400">{notifs.length} pemberitahuan</p>}
          </div>
          <Bell className="h-4.5 w-4.5 text-gray-400" />
        </div>

        <div className="max-w-2xl mx-auto px-4 pt-5 pb-24 md:pb-10">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-[#0194f3]" />
            </div>
          ) : notifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <BellOff className="h-8 w-8 text-blue-300" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Belum ada notifikasi</h3>
              <p className="text-sm text-gray-400">Kamu akan mendapat pemberitahuan seputar layanan Nempo, jadwal event, promo, dan open recruitment di sini.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifs.map(n => {
                const Ic = typeIcon[n.type] ?? Bell;
                const cls = typeColor[n.type] ?? "text-gray-500 bg-gray-50";
                return (
                  <Link key={n.id} href={n.href} className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3 transition hover:border-[#0194f3]/40 hover:shadow-md">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${cls}`}>
                      <Ic className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm leading-tight">{n.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-gray-300 text-[10px] mt-1.5">{timeAgo(n.created_at)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
