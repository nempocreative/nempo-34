import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import {
  BookOpen, Search, Volume2, Star, ChevronRight,
  GraduationCap, MessageSquare, Lightbulb,
  Filter, ArrowRight, BookMarked, Globe, X,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { mockSundanese, sundaCategories, type SundaneseWord } from "@/data/mockSundanese";

/* ── Alphabet list ── */
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/* ── Level badge ── */
const levelStyle: Record<string, string> = {
  dasar:    "bg-emerald-100 text-emerald-700 border-emerald-200",
  menengah: "bg-blue-100 text-[#0172B1] border-blue-200",
  lanjut:   "bg-purple-100 text-purple-700 border-purple-200",
};
const levelLabel: Record<string, string> = {
  dasar: "Dasar", menengah: "Menengah", lanjut: "Lanjut"
};

/* ── Category colours ── */
const catColor: Record<string, string> = {
  Sapaan:          "bg-sky-100 text-sky-700 border-sky-200",
  Tanya:           "bg-violet-100 text-violet-700 border-violet-200",
  "Sopan Santun":  "bg-rose-100 text-rose-700 border-rose-200",
  Umum:            "bg-gray-100 text-gray-700 border-gray-200",
  Sifat:           "bg-teal-100 text-teal-700 border-teal-200",
  Orang:           "bg-blue-100 text-[#0172B1] border-blue-200",
  Waktu:           "bg-blue-100 text-blue-700 border-blue-200",
  "Kata Kerja":    "bg-lime-100 text-lime-700 border-lime-200",
  Tempat:          "bg-blue-100 text-[#0172B1] border-blue-200",
  Peribahasa:      "bg-pink-100 text-pink-700 border-pink-200",
};

/* ── Phrase of the day — will be set from words state ── */
let POD_FALLBACK = mockSundanese.find(w => w.example) ?? mockSundanese[0];

/* ── Tips ── */
const tips = [
  { icon: "🗣️", title: "Ucapan Salam", body: 'Mulai dengan Sampurasun saat memasuki rumah atau bertemu orang Sunda — balasannya Rampes.' },
  { icon: "🙏", title: "Tingkatan Bahasa", body: "Bahasa Sunda punya tingkatan: halus (lemes) untuk orang lebih tua, dan informal (kasar) untuk teman sebaya." },
  { icon: "🎵", title: "Intonasi Khas", body: "Bahasa Sunda memiliki intonasi melodis. Latih dengan mendengarkan lagu atau siaran radio lokal Garut." },
  { icon: "📝", title: "Latihan Harian", body: "Cukup hafal 3 kata baru per hari. Dalam sebulan Anda sudah bisa berkomunikasi dasar dengan warga lokal Garut!" },
];

/* ── Word Card ── */
function WordCard({ w, fav, onFav }: { w: SundaneseWord; fav: boolean; onFav: () => void }) {
  const [speak, setSpeak] = useState(false);

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;
    const utt = new SpeechSynthesisUtterance(w.sunda);
    utt.lang = "id-ID";
    utt.onstart = () => setSpeak(true);
    utt.onend   = () => setSpeak(false);
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Header strip */}
      <div className="flex items-center justify-between px-4 pt-4 pb-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${catColor[w.category] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
            {w.category}
          </span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${levelStyle[w.level]}`}>
            {levelLabel[w.level]}
          </span>
        </div>
        <button
          onClick={onFav}
          className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors ${fav ? "text-yellow-500 bg-yellow-50" : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-50"}`}
        >
          <Star className="h-3.5 w-3.5" fill={fav ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Word */}
      <div className="px-4 pt-3 pb-2">
        <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">{w.sunda}</h3>
        <p className="text-sm font-semibold text-[#0194f3] mt-0.5">{w.indonesia}</p>
        {/* Pronunciation */}
        <p className="text-[11px] text-gray-400 font-mono mt-1 tracking-wider">/{w.pronunciation}/</p>
      </div>

      {/* Example */}
      {w.example && (
        <div className="mx-4 mb-3 rounded-xl bg-blue-50/60 border border-blue-100 px-3 py-2">
          <div className="flex items-start gap-1.5">
            <MessageSquare className="h-3 w-3 text-[#0194f3] mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-gray-800 italic">"{w.example}"</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{w.exampleId}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto px-4 pb-4">
        <button
          onClick={handleSpeak}
          className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all ${
            speak ? "bg-[#0194f3] text-white" : "bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-[#0194f3]"
          }`}
        >
          <Volume2 className={`h-3 w-3 ${speak ? "animate-pulse" : ""}`} />
          {speak ? "Memutar…" : "Dengarkan"}
        </button>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function KamusSundaPage() {
  const [words, setWords] = useState<SundaneseWord[]>(mockSundanese);
  const [search, setSearch]       = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeLevel, setActiveLevel]   = useState<string>("Semua");
  const [favIds, setFavIds]       = useState<Set<string>>(new Set());
  const [showFavOnly, setShowFavOnly] = useState(false);

  useEffect(() => {
    fetch("/api/kamus-sunda")
      .then(r => r.ok ? r.json() : null)
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setWords(data.map(d => ({
            id: String(d.id),
            sunda: d.sunda,
            indonesia: d.indonesia,
            pronunciation: d.latin ?? "",
            category: d.category ?? "Umum",
            level: d.level ?? "dasar",
            example: d.example ?? undefined,
            exampleId: undefined,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const POD = words.find(w => w.example) ?? words[0] ?? POD_FALLBACK;

  const toggleFav = (id: string) =>
    setFavIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filtered = useMemo(() => {
    return words.filter(w => {
      const matchCat   = activeTab === "Semua" || w.category === activeTab;
      const matchLevel = activeLevel === "Semua" || w.level === activeLevel;
      const matchLetter = !activeLetter || w.sunda.toUpperCase().startsWith(activeLetter);
      const q = search.toLowerCase();
      const matchQ = !q || w.sunda.toLowerCase().includes(q) || w.indonesia.toLowerCase().includes(q) || w.category.toLowerCase().includes(q);
      const matchFav = !showFavOnly || favIds.has(w.id);
      return matchCat && matchLevel && matchLetter && matchQ && matchFav;
    });
  }, [words, search, activeTab, activeLevel, activeLetter, showFavOnly, favIds]);

  const stats = {
    total: words.length,
    categories: sundaCategories.length - 1,
    withExample: words.filter(w => w.example).length,
    favs: favIds.size,
  };

  return (
    <Layout>
      <SEO
        title="Kamus Bahasa Sunda Garut"
        description="Pelajari bahasa Sunda khas Garut — kamus lengkap dengan contoh kalimat, pelafalan, dan ungkapan sehari-hari. Cocok untuk wisatawan dan pelajar."
        keywords="kamus sunda, bahasa sunda garut, belajar sunda, kosakata sunda, ungkapan sunda"
        path="/kamus-sunda"
      />
      <div className="bg-[#F7F8FA] min-h-screen">

        {/* ══ HERO ═══════════════════════════════════════════════ */}
        <div className="bg-[linear-gradient(135deg,#001553_0%,#003BAF_50%,#0194f3_100%)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold tracking-widest uppercase mb-4 text-white/80">
                  <BookOpen className="h-3 w-3 text-yellow-400" /> Bahasa Lokal Garut
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                  Kamus Sunda<br />
                  <span className="text-yellow-400">Nempo Organizer</span>
                </h1>
                <p className="text-white/70 text-sm md:text-base max-w-xl leading-relaxed mb-5">
                  Pelajari kosakata dan ungkapan bahasa Sunda sehari-hari. Cocok untuk wisatawan yang ingin lebih dekat dengan budaya lokal Garut.
                </p>
                {/* Stats */}
                <div className="flex flex-wrap gap-6">
                  {[
                    { val: stats.total,       label: "Kosakata" },
                    { val: stats.categories,  label: "Kategori" },
                    { val: stats.withExample, label: "Contoh Kalimat" },
                    { val: "3",               label: "Level Belajar" },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="text-2xl font-black text-white leading-none">{s.val}</div>
                      <div className="text-white/50 text-[10px] font-bold uppercase tracking-wide mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phrase of day card */}
              <div className="lg:w-72 shrink-0">
                <div className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                    <span className="text-white/80 text-xs font-bold uppercase tracking-widest">Kata Hari Ini</span>
                  </div>
                  <p className="text-3xl font-black text-white leading-tight mb-1">{POD.sunda}</p>
                  <p className="text-yellow-300 font-bold text-sm mb-1">{POD.indonesia}</p>
                  <p className="text-white/50 font-mono text-[11px] tracking-widest mb-3">/{POD.pronunciation}/</p>
                  {POD.example && (
                    <div className="rounded-xl bg-white/10 border border-white/15 p-3">
                      <p className="text-white/80 text-[11px] italic leading-relaxed">"{POD.example}"</p>
                      <p className="text-white/50 text-[10px] mt-1">{POD.exampleId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SEARCH + FILTER BAR ════════════════════════════════ */}
        <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            {/* Search row */}
            <div className="flex gap-3 mb-3">
              <div className="flex-1 flex items-center bg-white rounded-2xl shadow-md border border-gray-100 pr-1.5 overflow-visible transition-all">
                <div className="flex items-center justify-center shrink-0" style={{ marginLeft:2, marginTop:2 }}>
                  <DotLottieReact
                    src={`${import.meta.env.BASE_URL}animations/bird.json`}
                    loop autoplay
                    style={{ width:32, height:32 }}
                  />
                </div>
                <div className="w-px self-stretch my-2 mx-1.5 shrink-0 bg-gray-200" />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setActiveLetter(null); }}
                  placeholder="Cari kata Sunda atau artinya…"
                  className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 font-medium bg-transparent py-2.5 px-1"
                />
                {search && (
                  <button onClick={() => { setSearch(""); setActiveLetter(null); }} className="text-gray-400 hover:text-gray-600 mr-1">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  className="shrink-0 active:scale-95 transition-all rounded-xl flex items-center justify-center"
                  style={{ background:"#0194f3", color:"#fff", boxShadow:"0 4px 12px rgba(1,148,243,0.35)", padding:"8px 10px" }}
                >
                  <Search className="w-4 h-4 shrink-0" />
                </button>
              </div>
              {/* Fav toggle */}
              <button
                onClick={() => setShowFavOnly(!showFavOnly)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all shrink-0 ${
                  showFavOnly
                    ? "bg-yellow-400 text-yellow-900 border-yellow-400"
                    : "bg-white text-gray-600 border-gray-200 hover:border-yellow-300"
                }`}
              >
                <Star className="h-4 w-4" fill={showFavOnly ? "currentColor" : "none"} />
                <span className="hidden sm:inline">Favorit</span>
                {favIds.size > 0 && <span className="bg-yellow-200 text-yellow-900 text-[10px] font-black rounded-full px-1.5 py-0.5">{favIds.size}</span>}
              </button>
            </div>

            {/* Category + Level row */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {/* Level pills */}
              {["Semua", "dasar", "menengah", "lanjut"].map(l => (
                <button
                  key={l}
                  onClick={() => setActiveLevel(l)}
                  className={`flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                    activeLevel === l
                      ? l === "Semua" ? "bg-[#0194f3] text-white border-[#0194f3]" : `${levelStyle[l]} border-current`
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {l === "Semua" ? "Semua Level" : levelLabel[l]}
                </button>
              ))}
              <div className="w-px h-5 bg-gray-200 mx-1" />
              {/* Category pills */}
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                {sundaCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                      activeTab === cat
                        ? "bg-[#0194f3] text-white border-[#0194f3]"
                        : "bg-white text-gray-500 border-gray-200 hover:border-[#0194f3]/40 hover:text-[#0194f3]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ MAIN CONTENT ═══════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-10">
          <div className="flex gap-6">

            {/* ── LEFT: Alphabet sidebar ── */}
            <div className="hidden xl:flex flex-col items-center gap-0.5 w-9 shrink-0 sticky top-28 self-start">
              <button
                onClick={() => setActiveLetter(null)}
                className={`w-8 h-7 rounded-lg text-[10px] font-black transition-colors ${!activeLetter ? "bg-[#0194f3] text-white" : "text-gray-400 hover:bg-gray-100"}`}
              >
                ALL
              </button>
              {ALPHA.map(l => {
                const has = words.some(w => w.sunda.toUpperCase().startsWith(l));
                return (
                  <button
                    key={l}
                    onClick={() => has && setActiveLetter(l === activeLetter ? null : l)}
                    disabled={!has}
                    className={`w-8 h-6 rounded-lg text-[10px] font-bold transition-colors ${
                      activeLetter === l ? "bg-[#0194f3] text-white" : has ? "text-gray-500 hover:bg-blue-50 hover:text-[#0194f3]" : "text-gray-200 cursor-default"
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>

            {/* ── CENTER: Word grid ── */}
            <div className="flex-1 min-w-0">
              {/* Active letter label */}
              {activeLetter && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-2xl bg-[#0194f3] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-[#0194f3]/20">
                    {activeLetter}
                  </div>
                  <div>
                    <div className="font-extrabold text-gray-900">Kata berawalan "{activeLetter}"</div>
                    <div className="text-gray-400 text-xs">{filtered.length} kata ditemukan</div>
                  </div>
                  <button onClick={() => setActiveLetter(null)} className="ml-auto text-gray-400 hover:text-gray-600 text-xs font-semibold">Hapus filter</button>
                </div>
              )}

              {/* Result count */}
              {!activeLetter && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full bg-[#0194f3]" />
                    <span className="font-extrabold text-gray-900">
                      {activeTab === "Semua" ? "Semua Kosakata" : activeTab}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs">{filtered.length} kata</span>
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <BookOpen className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                  <p className="font-bold text-gray-600">Kata tidak ditemukan</p>
                  <p className="text-gray-400 text-sm mt-1">Coba kata kunci, kategori, atau huruf lain</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map(w => (
                    <WordCard
                      key={w.id}
                      w={w}
                      fav={favIds.has(w.id)}
                      onFav={() => toggleFav(w.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Tips + Stats sidebar ── */}
            <div className="hidden lg:flex flex-col gap-4 w-60 xl:w-64 shrink-0">

              {/* Quick stats */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="h-4 w-4 text-[#0194f3]" />
                  <h3 className="font-extrabold text-gray-900 text-sm">Progres Belajar</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Dasar", count: words.filter(w => w.level === "dasar").length, color: "bg-emerald-500" },
                    { label: "Menengah", count: words.filter(w => w.level === "menengah").length, color: "bg-blue-500" },
                    { label: "Lanjut", count: words.filter(w => w.level === "lanjut").length, color: "bg-purple-500" },
                  ].map(l => (
                    <div key={l.label}>
                      <div className="flex justify-between text-[11px] font-semibold text-gray-600 mb-1">
                        <span>{l.label}</span><span className="text-gray-400">{l.count} kata</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full ${l.color}`} style={{ width: `${(l.count / stats.total) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                {favIds.size > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-500 font-semibold flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" /> Favorit</span>
                      <span className="font-black text-yellow-600">{favIds.size} kata</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips box */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <h3 className="font-extrabold text-gray-900 text-sm">Tips Belajar Sunda</h3>
                </div>
                <div className="space-y-3">
                  {tips.map((t, i) => (
                    <div key={i} className="flex gap-2.5">
                      <span className="text-base leading-none mt-0.5">{t.icon}</span>
                      <div>
                        <p className="text-[11px] font-bold text-gray-800">{t.title}</p>
                        <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">{t.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA: Tambah kata */}
              <div className="rounded-2xl overflow-hidden">
                <div className="bg-[linear-gradient(135deg,#001E6E_0%,#0194f3_100%)] p-4">
                  <div className="h-9 w-9 rounded-xl bg-yellow-400 flex items-center justify-center mb-3 shadow shadow-yellow-400/30">
                    <BookMarked className="h-4 w-4 text-yellow-900" />
                  </div>
                  <h3 className="font-black text-white text-sm mb-1">Tahu Kata Sunda Lain?</h3>
                  <p className="text-white/70 text-[10px] leading-relaxed mb-3">
                    Bantu kami memperkaya kamus dengan mengirimkan kata atau ungkapan Sunda yang belum ada.
                  </p>
                  <button className="w-full flex items-center justify-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 text-[11px] font-extrabold py-2 rounded-xl transition-colors">
                    Kirim Kata <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── MOBILE: Alphabet strip ── */}
          <div className="xl:hidden mt-6">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
              <button
                onClick={() => setActiveLetter(null)}
                className={`flex-shrink-0 w-8 h-8 rounded-xl text-[10px] font-black transition-colors ${!activeLetter ? "bg-[#0194f3] text-white" : "bg-white text-gray-400 border border-gray-200"}`}
              >
                ALL
              </button>
              {ALPHA.map(l => {
                const has = words.some(w => w.sunda.toUpperCase().startsWith(l));
                return (
                  <button
                    key={l}
                    onClick={() => has && setActiveLetter(l === activeLetter ? null : l)}
                    className={`flex-shrink-0 w-8 h-8 rounded-xl text-[10px] font-bold transition-colors ${
                      activeLetter === l ? "bg-[#0194f3] text-white" : has ? "bg-white text-gray-600 border border-gray-200 hover:border-[#0194f3]/40" : "bg-gray-50 text-gray-300"
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Tips section (mobile) ── */}
          <div className="lg:hidden mt-6 grid grid-cols-2 gap-3">
            {tips.map((t, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex gap-2.5">
                <span className="text-lg leading-none">{t.icon}</span>
                <div>
                  <p className="text-[11px] font-bold text-gray-800">{t.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed line-clamp-3">{t.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Related links ── */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Globe, title: "Wisata Budaya",     desc: "Jelajahi situs budaya dan tradisi Garut",     href: "/wisata",  color: "from-sky-500 to-blue-600" },
              { icon: Filter, title: "Komunitas Seni",   desc: "Bergabung dengan komunitas seni Sunda Garut",  href: "/komunitas", color: "from-emerald-500 to-teal-600" },
            ].map(l => (
              <a key={l.title} href={l.href} className={`bg-gradient-to-br ${l.color} rounded-2xl p-4 text-white flex items-center gap-3 hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-md`}>
                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <l.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm">{l.title}</div>
                  <div className="text-white/70 text-[11px] leading-snug">{l.desc}</div>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto opacity-60 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
