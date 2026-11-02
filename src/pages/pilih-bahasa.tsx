import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useLocation } from "@/lib/wouter";
import { ArrowLeft, Check, Globe } from "lucide-react";
import { useDisplayPrefs, LANGUAGE_OPTIONS, type Language } from "@/lib/use-display-prefs";

export default function PilihBahasaPage() {
  const [, navigate] = useLocation();
  const { prefs, setLang } = useDisplayPrefs();

  const handleSelect = (code: Language, available: boolean) => {
    if (!available) return;
    setLang(code);
  };

  return (
    <Layout>
      <SEO title="Pilih Bahasa" noIndex />
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div
          className="relative pt-safe"
          style={{ background: "linear-gradient(135deg, #001E6E 0%, #0046B8 60%, #0194f3 100%)" }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 80% 30%, #FFC300 0%, transparent 55%)" }} />
          <div className="relative flex items-center gap-3 px-4 pt-5 pb-5">
            <button
              onClick={() => navigate("/settings")}
              className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-white" strokeWidth={2} />
            </button>
            <div>
              <h1 className="text-white font-black text-lg leading-none">Bahasa Aplikasi</h1>
              <p className="text-white/50 text-xs mt-0.5">Pilih bahasa tampilan aplikasi</p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-3">
          {/* Current */}
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
            <Globe className="w-4 h-4 text-[#0194f3] shrink-0" strokeWidth={2} />
            <p className="text-xs text-blue-700">
              Bahasa aktif: <strong>{LANGUAGE_OPTIONS.find(l => l.code === prefs.lang)?.label ?? "Bahasa Indonesia"}</strong>
            </p>
          </div>

          {/* Language list */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Pilih Bahasa</p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {LANGUAGE_OPTIONS.map((lang) => {
                const active = prefs.lang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code, lang.available)}
                    className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-colors ${
                      lang.available ? "hover:bg-gray-50 active:bg-gray-100" : "cursor-not-allowed"
                    }`}
                  >
                    {/* Flag */}
                    <span className="text-2xl shrink-0 leading-none">{lang.flag}</span>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold leading-none ${lang.available ? "text-gray-800" : "text-gray-300"}`}>
                        {lang.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${lang.available ? "text-gray-400" : "text-gray-200"}`}>
                        {lang.native}
                      </p>
                    </div>

                    {/* Status */}
                    {active ? (
                      <div className="w-6 h-6 rounded-full bg-[#0194f3] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                    ) : !lang.available ? (
                      <span className="text-[10px] font-bold text-gray-300 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                        Segera
                      </span>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-200 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
            <p className="text-xs text-amber-700 font-semibold">Info</p>
            <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
              Saat ini aplikasi hanya tersedia dalam Bahasa Indonesia. Bahasa lain akan segera hadir.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
