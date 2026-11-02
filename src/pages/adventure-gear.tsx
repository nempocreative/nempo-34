import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { SedangDipersiapkan } from "@/components/sedang-dipersiapkan";
import { Link } from "@/lib/wouter";
import { mockGear } from "@/data/mockGear";
import { useEffect, useState } from "react";
import {
  Search, X, ArrowUpDown, CheckCircle2, ShieldCheck, Zap, Clock, Star, ChevronRight, Package, Mountain, Tent, Shield, Wrench,
} from "lucide-react";

const catChip: Record<string, string> = {
  Camping: "bg-sky-100 text-sky-700",
  Hiking: "bg-emerald-100 text-emerald-700",
  Climbing: "bg-blue-100 text-[#0172B1]",
  Cycling: "bg-violet-100 text-violet-700",
};

export default function AdventureGearPage() {
  return (
    <Layout>
      <SEO title="Adventure Gear" noIndex />
      <SedangDipersiapkan
        icon={Tent}
        iconGradient="linear-gradient(135deg, #059669, #34D399)"
        dotColor1="#1BA0E2"
        dotColor2="#6EE7B7"
        title="Sedang Dipersiapkan"
        titleHighlight="Penuh Semangat"
        description="Sewa perlengkapan outdoor berkualitas untuk petualangan terbaik di Garut. Segera hadir."
        btn1Label="Jelajahi Wisata Alam"
        btn1Href="/wisata"
        btn2Label="Cek Penginapan Garut"
        btn2Href="/penginapan"
      />
    </Layout>
  );
}

/* KODE HALAMAN ASLI – AKAN DIAKTIFKAN SAAT DATA SIAP */
function _AdventureGearPageFull() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFeat, setActiveFeat] = useState(0);

  const featured = mockGear.filter(g => g.featured).slice(0, 5);

  useEffect(() => {
    const iv = setInterval(() => setActiveFeat(p => (p + 1) % featured.length), 3100);
    return () => clearInterval(iv);
  }, [featured.length]);

  const filtered = mockGear
    .filter(g => {
      const matchCat = g.category.toLowerCase().includes(search.toLowerCase()) || g.name.toLowerCase().includes(search.toLowerCase());
      return matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.pricePerDay - b.pricePerDay;
      if (sortBy === "price-desc") return b.pricePerDay - a.pricePerDay;
      if (sortBy === "stock") return b.stock - a.stock;
      return 0;
    });

  const hasFilter = sortBy !== "default";

  return (
    <Layout>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#0194f3" }}>Sewa Perlengkapan Outdoor</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">Adventure Gear</h1>
            <p className="text-gray-400 text-sm mt-1">Petualangan Garut lebih siap · {mockGear.length} item tersedia</p>
          </div>
          <div className="flex gap-3 mb-5 overflow-x-auto scrollbar-hide pb-1">
            {[
              { icon: ShieldCheck, text: "Terawat & Bersih", color: "text-emerald-600" },
              { icon: Zap, text: "Ambil Hari Ini", color: "text-blue-500" },
              { icon: Clock, text: "Sewa Harian", color: "text-[#0194f3]" },
              { icon: Star, text: "Paket Bundling", color: "text-rose-500" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-1.5 shrink-0 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                <Icon className={`h-3.5 w-3.5 ${color}`} />
                <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">{text}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2.5 bg-gray-50 border border-gray-200 focus-within:border-[#0194f3] focus-within:ring-2 focus-within:ring-[#0194f3]/10 rounded-2xl px-4 py-3 transition-all">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari perlengkapan outdoor…" className="bg-transparent flex-1 outline-none text-sm text-gray-700 placeholder-gray-400" />
              {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600"><X className="h-3.5 w-3.5" /></button>}
            </div>
            <button onClick={() => setFilterOpen(!filterOpen)} className={`relative h-12 w-12 rounded-2xl flex items-center justify-center shadow-md shrink-0 transition-all ${filterOpen || hasFilter ? "bg-gray-900 shadow-gray-900/25" : "shadow-[#0194f3]/25 hover:opacity-90"}`} style={!(filterOpen || hasFilter) ? { background: "#0194f3" } : undefined}>
              <ArrowUpDown className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-10 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-gray-900 text-base">Pilihan Terbaik</h2>
            <span className="text-[#0194f3] text-xs font-bold flex items-center gap-0.5">Lihat semua <ChevronRight className="h-3.5 w-3.5" /></span>
          </div>
          <div className="relative" style={{ height: 320, perspective: "1000px", perspectiveOrigin: "50% 50%" }}>
            {featured.map((g, idx) => {
              const total = featured.length;
              let off = idx - activeFeat;
              if (off > total / 2) off -= total;
              if (off < -total / 2) off += total;
              const absOff = Math.abs(off);
              const sign = off < 0 ? -1 : 1;
              if (absOff > 2) return null;
              const txDesktop = sign * (absOff === 0 ? 0 : absOff === 1 ? 175 : 310);
              const txMobile = sign * (absOff === 0 ? 0 : absOff === 1 ? 110 : 195);
              const scale = absOff === 0 ? 1 : absOff === 1 ? 0.82 : 0.64;
              const opacity = absOff === 0 ? 1 : absOff === 1 ? 0.75 : 0.45;
              const rotateY = off * -18;
              const zIndex = 10 - absOff;
              const isCenter = absOff === 0;
              return (
                <Link key={g.id} href={isCenter ? `/adventure-gear/${g.id}` : "#"} onClick={e => { if (!isCenter) { e.preventDefault(); setActiveFeat(idx); } }}>
                  <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translateX(-50%) translateY(-50%) translateX(${typeof window !== "undefined" && window.innerWidth < 640 ? txMobile : txDesktop}px) scale(${scale}) rotateY(${rotateY}deg)`, opacity, zIndex, transition: "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease", willChange: "transform", cursor: isCenter ? "default" : "pointer" }}>
                    <div className="rounded-3xl overflow-hidden flex flex-col" style={{ width: 168, height: 272, background: "linear-gradient(145deg, #001E6E, #0194f3)", boxShadow: isCenter ? "0 28px 52px -8px #0194f388" : "0 8px 24px rgba(0,0,0,0.18)" }}>
                      <div className="relative mx-3 mt-4 rounded-2xl overflow-hidden" style={{ height: 110 }}>
                        <img src={g.image} alt={g.name} className="w-full h-full object-cover opacity-50" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,30,56,0.7), transparent)" }} />
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${catChip[g.category] ?? "bg-white/20 text-white"}`}>{g.category}</span>
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">Ready</span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col px-3 pt-2.5 pb-3">
                        <h3 className="font-extrabold text-white text-xs leading-tight line-clamp-2 mb-1">{g.name}</h3>
                        <p className="text-blue-200/80 text-[10px] flex items-center gap-0.5 truncate mb-auto"><Wrench className="h-2.5 w-2.5 shrink-0" />{g.brand}</p>
                        <div className="mt-2 pt-2 border-t border-white/15">
                          <p className="text-blue-200/70 text-[8px] uppercase tracking-wide font-semibold">Harga</p>
                          <p className="text-yellow-300 font-extrabold text-sm leading-tight">Rp {g.pricePerDay.toLocaleString("id")}</p>
                        </div>
                        {isCenter && <div className="mt-2.5 w-full bg-white/20 text-white text-[10px] font-bold py-1.5 rounded-xl text-center">Detail Item</div>}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
}
