import { useEffect, useState } from "react";
import { MapPin, Utensils, Coffee, Hotel, Calendar, Newspaper, ExternalLink, ArrowRight, Globe, Activity, MailWarning, Image, Ticket } from "lucide-react";
import { api } from "@/apps/admin/lib/api";
import { Link } from "@/lib/wouter";

interface Stats {
  wisata: number;
  kuliner: number;
  cafe: number;
  penginapan: number;
  events: number;
  berita: number;
}

const cards = [
  { key: "wisata", label: "Destinasi Wisata", icon: MapPin, gradient: "from-blue-500 to-blue-600", light: "bg-blue-50", text: "text-blue-600", path: "/wisata" },
  { key: "kuliner", label: "Kuliner", icon: Utensils, gradient: "from-orange-400 to-orange-500", light: "bg-orange-50", text: "text-orange-600", path: "/kuliner" },
  { key: "cafe", label: "Cafe", icon: Coffee, gradient: "from-amber-500 to-orange-500", light: "bg-amber-50", text: "text-amber-600", path: "/cafe" },
  { key: "penginapan", label: "Penginapan", icon: Hotel, gradient: "from-purple-500 to-purple-600", light: "bg-purple-50", text: "text-purple-600", path: "/penginapan" },
  { key: "events", label: "Event", icon: Calendar, gradient: "from-emerald-500 to-emerald-600", light: "bg-emerald-50", text: "text-emerald-600", path: "/events" },
  { key: "berita", label: "Berita & Artikel", icon: Newspaper, gradient: "from-rose-500 to-rose-600", light: "bg-rose-50", text: "text-rose-600", path: "/berita" },
];

const quickActions = [
  { label: "Tambah destinasi wisata baru", desc: "Wisata", path: "/wisata", icon: MapPin, color: "text-blue-600 bg-blue-50" },
  { label: "Tambah info kuliner", desc: "Kuliner", path: "/kuliner", icon: Utensils, color: "text-orange-600 bg-orange-50" },
  { label: "Kelola data cafe", desc: "Cafe", path: "/cafe", icon: Coffee, color: "text-amber-600 bg-amber-50" },
  { label: "Kelola data penginapan", desc: "Penginapan", path: "/penginapan", icon: Hotel, color: "text-purple-600 bg-purple-50" },
  { label: "Buat event baru", desc: "Event", path: "/events", icon: Calendar, color: "text-emerald-600 bg-emerald-50" },
  { label: "Pantau pesanan tiket", desc: "Tiket", path: "/event-orders", icon: Ticket, color: "text-cyan-600 bg-cyan-50" },
  { label: "Publish berita terkini", desc: "Berita", path: "/berita", icon: Newspaper, color: "text-rose-600 bg-rose-50" },
  { label: "Kelola banner beranda", desc: "Banner", path: "/banners", icon: Image, color: "text-indigo-600 bg-indigo-50" },
];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [emailFailureCount, setEmailFailureCount] = useState(0);
  const adminUser = localStorage.getItem("nempo_admin_user") || "Admin";

  useEffect(() => {
    api.stats()
      .then(setStats)
      .catch(error => setStatsError(error instanceof Error ? error.message : "Gagal memuat ringkasan NEMPO Garut."))
      .finally(() => setLoading(false));
    api.emailFailures.count().then(d => setEmailFailureCount(d.count ?? 0)).catch(() => {});
  }, []);

  const totalContent = stats ? Object.values(stats).reduce((a, b) => a + b, 0) : 0;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Selamat datang di NEMPO Garut, <span className="capitalize">{adminUser}</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Kelola konten wisata, kuliner, penginapan, event, dan layanan lokal dari satu tempat.</p>
        </div>
        <a
          href="https://nempo.id"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 shadow-sm transition-colors shrink-0"
        >
          <Globe className="w-4 h-4" />
          nempo.id
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        {cards.map(card => (
          <Link key={card.key} href={card.path}>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div className={`w-10 h-10 ${card.light} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <card.icon className={`w-5 h-5 ${card.text}`} strokeWidth={2} />
              </div>
              <p className="text-2xl font-black text-gray-900">
                {loading ? <span className="inline-block w-6 h-6 bg-gray-100 rounded animate-pulse" /> : (stats?.[card.key as keyof Stats] ?? "—")}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium leading-snug">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>
      {statsError && (
        <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Ringkasan NEMPO Garut tidak bisa dimuat: {statsError}
        </p>
      )}

      {emailFailureCount > 0 && (
        <Link href="/email-failures">
          <div className="mb-5 flex items-center gap-3 px-4 py-3.5 bg-red-50 border border-red-200 rounded-2xl cursor-pointer hover:bg-red-100 transition-colors group">
            <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <MailWarning className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-red-700">
                {emailFailureCount} email tiket belum terkirim
              </p>
              <p className="text-xs text-red-500 mt-0.5">
                Ada pesanan yang emailnya gagal atau belum dikirim ke pembeli. Klik untuk kirim ulang.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-red-400 group-hover:text-red-600 transition-colors shrink-0" />
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" strokeWidth={2} />
            <h2 className="font-bold text-gray-900 text-sm">Kelola NEMPO Garut</h2>
          </div>
          <div className="p-3">
            {quickActions.map(action => (
              <Link key={action.path} href={action.path}>
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 group transition-colors cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center shrink-0`}>
                    <action.icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium group-hover:text-blue-600 transition-colors">{action.label}</p>
                    <p className="text-xs text-gray-400">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-blue-200" />
              <p className="text-blue-200 text-xs font-medium uppercase tracking-wide">NEMPO Garut</p>
            </div>
            <p className="text-2xl font-black mb-1">{loading ? "–" : stats ? totalContent : "–"}</p>
            <p className="text-blue-100 text-sm mb-4">Total konten lokal yang dikelola melalui CMS.</p>
            <a
              href="https://nempo.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Buka Website
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Panduan Cepat</h3>
            <ol className="space-y-2.5">
              {[
                "Klik menu di sidebar kiri",
                "Tekan tombol \"+ Tambah\"",
                "Isi form & upload foto",
                "Centang \"Tampilkan di Website\"",
                "Klik Simpan — selesai!",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-sm text-gray-600">{tip}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
