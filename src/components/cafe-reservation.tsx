import { useMemo, useState } from "react";
import { Armchair, Map, MessageCircle, Star } from "lucide-react";
import denahAsset from "@/assets/denah-good-story-cafe.jpg.asset.json";
import {
  CAFE_ZONES,
  cafeBestSpotTables,
  cafeJamRange,
  cafeReservationUrl,
  cafeZoneOf,
} from "@/data/cafe-layout";

interface Props {
  eventName: string;
  eventDate?: string;
  timeStart?: string | null;
  timeEnd?: string | null;
  location?: string;
  accent: string;
  light: string;
}

/** Reservasi kursi Good Story Cafe: pilih nomor meja, lalu kirim lewat WhatsApp. */
export function CafeReservation({ eventName, eventDate, timeStart, timeEnd, location, accent, light }: Props) {
  const [zone, setZone] = useState<string>("all");
  const [bestOnly, setBestOnly] = useState(false);
  const [table, setTable] = useState<string | null>(null);
  const [showDenah, setShowDenah] = useState(false);

  const best = useMemo(() => new Set(cafeBestSpotTables()), []);
  const zones = zone === "all" ? CAFE_ZONES : CAFE_ZONES.filter((z) => z.id === zone);
  const jam = cafeJamRange(timeStart, timeEnd);
  const waHref = cafeReservationUrl({ eventName, eventDate, timeStart, timeEnd, location, table });
  const chosenZone = table ? cafeZoneOf(table) : undefined;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-gray-50 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}15` }}>
          <Armchair className="h-3.5 w-3.5" style={{ color: accent }} />
        </div>
        <p className="font-extrabold text-gray-900 text-sm">Reservasi Kursi &amp; Pilih Meja</p>
        <span
          className="ml-auto shrink-0 text-[9px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-full"
          style={{ background: light, color: accent }}
        >
          Gratis
        </span>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-gray-600 text-xs leading-relaxed">
          {jam && (
            <>
              Acara <span className="font-extrabold text-gray-900">{jam}</span>.{" "}
            </>
          )}
          Mau posisi kursi terbaik? Boleh reservasi — pilih meja sesuai keinginanmu, lalu kirim
          nomornya lewat WhatsApp.
        </p>

        <button
          type="button"
          onClick={() => setShowDenah((v) => !v)}
          className="w-full rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:border-gray-400 flex items-center justify-center gap-2"
        >
          <Map className="h-3.5 w-3.5" />
          {showDenah ? "Tutup denah meja" : "Lihat denah meja"}
        </button>

        {showDenah && (
          <div className="rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
            <img
              src={denahAsset.url}
              alt="Denah meja Good Story Cafe: panggung, VIP, lantai 2 dan 3, area bar"
              className="w-full h-auto"
              loading="lazy"
            />
            <p className="px-3 py-2 text-[10px] leading-relaxed text-gray-400">
              VIP 1–2 dan M1–M5 paling dekat ke panggung. Nomor 58–65 adalah meja tambahan.
            </p>
          </div>
        )}

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setZone("all")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
              zone === "all" ? "text-white" : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-400"
            }`}
            style={zone === "all" ? { background: accent } : {}}
          >
            Semua area
          </button>
          {CAFE_ZONES.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => setZone(z.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
                zone === z.id ? "text-white" : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}
              style={zone === z.id ? { background: accent } : {}}
            >
              {z.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setBestOnly((v) => !v)}
          className={`w-full rounded-xl border py-2 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors ${
            bestOnly ? "text-white border-transparent" : "border-gray-200 text-gray-600 hover:border-gray-400"
          }`}
          style={bestOnly ? { background: accent } : {}}
        >
          <Star className="h-3 w-3" />
          {bestOnly ? "Menampilkan posisi terbaik saja" : "Tampilkan hanya posisi terbaik"}
        </button>

        <div className="space-y-3">
          {zones.map((z) => {
            const tables = bestOnly ? z.tables.filter((t) => best.has(t)) : z.tables;
            if (tables.length === 0) return null;
            return (
              <div key={z.id}>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <p className="text-[11px] font-extrabold text-gray-800">{z.label}</p>
                  <p className="text-[10px] text-gray-400">{z.note}</p>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
                  {tables.map((t) => {
                    const selected = table === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTable(t)}
                        title={z.label}
                        className={`relative rounded-lg py-1.5 text-[10px] font-extrabold tabular-nums transition-colors ${
                          selected ? "text-white" : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                        style={selected ? { background: accent } : {}}
                      >
                        {t}
                        {best.has(t) && !selected && (
                          <span
                            className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full"
                            style={{ background: accent }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl px-3.5 py-3" style={{ background: light }}>
          <p className="text-[11px] font-bold text-gray-700 leading-relaxed">
            {table
              ? `Meja dipilih: ${table}${chosenZone ? ` — ${chosenZone.label}` : ""}`
              : "Belum pilih meja — boleh langsung chat, nanti dibantu carikan posisi terbaik."}
          </p>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold text-white"
          style={{ background: accent }}
        >
          <MessageCircle className="h-4 w-4" />
          Kirim reservasi ke WhatsApp
        </a>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Nomor meja yang kamu pilih langsung terbawa di chat. Tim kami konfirmasi ketersediaan
          mejanya, lalu kursimu diamankan.
        </p>
      </div>
    </div>
  );
}
