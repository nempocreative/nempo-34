import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useLocation } from "@/lib/wouter";
import { ArrowLeft, Check, TrendingUp, Info } from "lucide-react";
import { useDisplayPrefs, CURRENCY_OPTIONS, type Currency } from "@/lib/use-display-prefs";

const APPROX_RATES: Record<Currency, number> = {
  IDR: 1,
  USD: 0.000063,
  SGD: 0.000085,
  MYR: 0.00030,
  EUR: 0.000058,
  JPY: 0.0094,
  AUD: 0.000096,
  GBP: 0.000050,
};

function formatExample(code: Currency): string {
  const symbol = CURRENCY_OPTIONS.find(c => c.code === code)?.symbol ?? "";
  const rate = APPROX_RATES[code];
  const example = 100000 * rate;
  if (code === "IDR") return "Rp 100.000";
  if (code === "JPY") return `${symbol} ${Math.round(example)}`;
  return `${symbol} ${example.toFixed(2)}`;
}

export default function PilihMataUangPage() {
  const [, navigate] = useLocation();
  const { prefs, setCurrency } = useDisplayPrefs();

  return (
    <Layout>
      <SEO title="Pilih Mata Uang" noIndex />
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
              <h1 className="text-white font-black text-lg leading-none">Mata Uang</h1>
              <p className="text-white/50 text-xs mt-0.5">Pilih mata uang untuk tampilan harga</p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-3">
          {/* Active currency card */}
          {(() => {
            const cur = CURRENCY_OPTIONS.find(c => c.code === prefs.currency)!;
            return (
              <div className="bg-gradient-to-br from-[#0194f3] to-[#0172B1] rounded-2xl px-4 py-4 flex items-center gap-4 shadow-lg">
                <span className="text-3xl">{cur.flag}</span>
                <div className="flex-1">
                  <p className="text-white/60 text-[11px] font-bold uppercase tracking-wide">Mata Uang Aktif</p>
                  <p className="text-white font-black text-base leading-tight">{cur.label}</p>
                  <p className="text-white/60 text-xs mt-0.5">
                    Contoh harga: <span className="text-white font-bold">{formatExample(prefs.currency)}</span>
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 text-white/40" strokeWidth={1.5} />
              </div>
            );
          })()}

          {/* Currency list */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Pilih Mata Uang</p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {CURRENCY_OPTIONS.map((cur) => {
                const active = prefs.currency === cur.code;
                return (
                  <button
                    key={cur.code}
                    onClick={() => setCurrency(cur.code)}
                    className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    {/* Flag */}
                    <span className="text-xl shrink-0 leading-none w-8 text-center">{cur.flag}</span>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-800 leading-none">{cur.label}</p>
                        <span className="text-[10px] font-black text-gray-300 bg-gray-100 px-1.5 py-0.5 rounded-md">{cur.code}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatExample(cur.code)}
                        {cur.code !== "IDR" && <span className="text-gray-300"> ≈ Rp 100.000</span>}
                      </p>
                    </div>

                    {/* Symbol badge */}
                    <span className={`text-sm font-black w-8 text-center shrink-0 ${active ? "text-[#0194f3]" : "text-gray-300"}`}>
                      {cur.symbol}
                    </span>

                    {/* Check */}
                    {active ? (
                      <div className="w-6 h-6 rounded-full bg-[#0194f3] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-200 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-xs text-gray-400 leading-relaxed">
              Kurs yang ditampilkan bersifat estimasi dan dapat berbeda dari kurs pasar aktual.
              Semua transaksi tetap diproses dalam Rupiah (IDR).
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
