import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useRoute, Link } from "@/lib/wouter";
import { Trophy, ArrowLeft, Share2, Clock, Gift, CheckCircle2, Users, MapPin, Building2, ChevronRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function formatRupiah(n: number) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)} Juta`;
  if (n === 0) return "GRATIS";
  return "Rp " + n.toLocaleString("id-ID");
}

function getStatus(dateStr: string): "open" | "upcoming" | "closed" {
  const today = new Date().toISOString().slice(0, 10);
  const weekOut = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  if (dateStr < today) return "closed";
  if (dateStr <= weekOut) return "open";
  return "upcoming";
}

const statusStyle: Record<string, { label: string; cls: string }> = {
  open:     { label: "Dibuka",  cls: "bg-emerald-500 text-white" },
  upcoming: { label: "Segera",  cls: "bg-blue-500 text-white" },
  closed:   { label: "Ditutup", cls: "bg-gray-400 text-white" },
};

interface Lomba {
  id: number;
  name: string;
  category: string;
  date: string;
  location: string;
  image: string;
  description: string;
  prize: string | number;
  organizer: string;
  fee: number;
  max_peserta: number;
}

export default function PerlombaanDetail() {
  const [, params] = useRoute("/perlombaan/:id");
  const [lomba, setLomba] = useState<Lomba | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);

  async function doShare(title: string) {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title, url }); return; } catch {} }
    try { await navigator.clipboard.writeText(url); } catch {
      const el = document.createElement("textarea"); el.value = url;
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setShareCopied(true); setTimeout(() => setShareCopied(false), 2000);
  }

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/perlombaan/${params.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setLomba(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!lomba) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
          <Trophy className="h-12 w-12 text-gray-300" />
          <p className="text-gray-500 font-medium">Lomba tidak ditemukan</p>
          <Link href="/perlombaan" className="text-violet-600 font-bold text-sm">← Kembali ke daftar lomba</Link>
        </div>
      </Layout>
    );
  }

  const status = getStatus(lomba.date);
  const isOpen = status === "open";
  const st = statusStyle[status];
  const prize = Number(lomba.prize) || 0;
  const registrationFee = lomba.fee ?? 0;

  return (
    <Layout>
      <SEO
        title={lomba.name}
        description={lomba.description?.slice(0, 160) || `Perlombaan ${lomba.name} di Garut — daftar sekarang dan raih hadiah menarik.`}
        image={lomba.image}
        path={`/perlombaan/${params?.id}`}
      />
      <div>
        {/* Hero */}
        <div className="relative w-full h-60 md:h-80 overflow-hidden">
          <img src={lomba.image} alt={lomba.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <button
              onClick={() => window.history.back()}
              className="bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full h-10 w-10 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button onClick={() => doShare(lomba?.name ?? "Perlombaan")}
              className="backdrop-blur-md border text-white rounded-full h-10 w-10 flex items-center justify-center transition-all"
              style={shareCopied ? { background: "#22c55e", borderColor: "#22c55e" } : { background: "rgba(255,255,255,0.2)", borderColor: "rgba(255,255,255,0.3)" }}
              title={shareCopied ? "Link disalin!" : "Bagikan"}>
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          <div className="absolute bottom-5 left-0 right-0 px-5 md:px-10">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
              <Badge className="bg-violet-600 text-white border-0">{lomba.category}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">{lomba.name}</h1>
            <p className="text-white/70 text-sm mt-1 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />{lomba.organizer}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main */}
            <div className="lg:col-span-2 space-y-5">

              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-violet-50 border border-violet-100 rounded-2xl p-3.5 flex flex-col items-center text-center">
                  <Gift className="h-5 w-5 text-violet-500 mb-1" />
                  <p className="font-extrabold text-violet-700 text-base">{formatRupiah(prize)}</p>
                  <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide">Total Hadiah</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 flex flex-col items-center text-center">
                  <Clock className="h-5 w-5 text-blue-500 mb-1" />
                  <p className="font-extrabold text-[#0172B1] text-sm">
                    {new Date(lomba.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide">Deadline</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 flex flex-col items-center text-center">
                  <Users className="h-5 w-5 text-emerald-500 mb-1" />
                  <p className="font-extrabold text-emerald-700 text-base">{lomba.max_peserta ?? "—"}</p>
                  <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide">Kuota</p>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-base font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-violet-500" />Tentang Lomba
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{lomba.description}</p>
                <div className="flex items-center gap-1.5 mt-3 text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{lomba.location}</span>
                </div>
              </div>

              {/* Biaya Pendaftaran */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-base font-extrabold text-gray-900 mb-3">Biaya Pendaftaran</h3>
                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Pendaftaran Umum</p>
                    <p className="text-gray-400 text-xs">Kuota maks. {lomba.max_peserta} peserta</p>
                  </div>
                  <span className={`font-extrabold text-sm ${registrationFee === 0 ? "text-emerald-600" : "text-violet-700"}`}>
                    {registrationFee === 0 ? "GRATIS" : `Rp ${registrationFee.toLocaleString("id-ID")}`}
                  </span>
                </div>
              </div>

              {/* Syarat umum */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-base font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" />Syarat & Ketentuan Umum
                </h3>
                <ul className="space-y-2">
                  {[
                    "Peserta WNI, terbuka untuk umum",
                    "Karya adalah hasil karya sendiri, bukan plagiat",
                    "Pendaftaran dilakukan sebelum deadline",
                    `Biaya pendaftaran: ${registrationFee === 0 ? "GRATIS" : `Rp ${registrationFee.toLocaleString("id-ID")}`}`,
                    "Keputusan juri bersifat mutlak dan tidak dapat diganggu gugat",
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-32 space-y-4">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg">Daftar Lomba</h3>
                  <p className="text-gray-400 text-sm">Segera daftar sebelum pendaftaran ditutup</p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-4 text-center">
                  <p className="text-violet-200 text-xs font-semibold mb-0.5">Total Hadiah</p>
                  <p className="text-white font-extrabold text-2xl">{formatRupiah(prize)}</p>
                  <p className="text-violet-200 text-xs mt-0.5">untuk semua kategori</p>
                </div>

                {isOpen ? (
                  <Link href={`/perlombaan/${lomba.id}/daftar`}>
                    <button className="w-full py-3.5 rounded-2xl font-bold text-sm bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 transition-all flex items-center justify-center gap-2">
                      Daftar Sekarang <ChevronRight className="h-4 w-4" />
                    </button>
                  </Link>
                ) : (
                  <button disabled className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gray-200 text-gray-400 cursor-not-allowed">
                    {status === "upcoming" ? "Belum Dibuka" : "Pendaftaran Ditutup"}
                  </button>
                )}

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                    <span>Deadline: <span className="font-bold text-gray-700">
                      {new Date(lomba.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                    <span>Kuota {lomba.max_peserta} peserta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                    <span>{lomba.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        {isOpen && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-3 safe-area-pb">
            <Link href={`/perlombaan/${lomba.id}/daftar`}>
              <button className="w-full py-3.5 rounded-2xl font-bold text-sm bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 transition-all flex items-center justify-center gap-2">
                Daftar Lomba Sekarang <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
