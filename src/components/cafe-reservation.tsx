import { useMemo, useState } from "react";
import { Armchair, ArrowUpRight, Check, ChevronDown, Clock, Map, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NEMPO_WA_NUMBER } from "@/lib/contact";
import denahAsset from "@/assets/denah-good-story-cafe.jpg.asset.json";
import { CAFE_ZONES, cafeBestSpotTables, cafeJamRange, cafeReservationUrl, cafeZoneOf } from "@/data/cafe-layout";

interface Props {
  eventName: string;
  eventDate?: string;
  timeStart?: string | null;
  timeEnd?: string | null;
  location?: string;
}

export function CafeReservation({ eventName, eventDate, timeStart, timeEnd, location }: Props) {
  const [zone, setZone] = useState("all");
  const [bestOnly, setBestOnly] = useState(false);
  const [table, setTable] = useState<string | null>(null);
  const [showDenah, setShowDenah] = useState(true);
  const best = useMemo(() => new Set(cafeBestSpotTables()), []);
  const zones = (zone === "all" ? CAFE_ZONES : CAFE_ZONES.filter((z) => z.id === zone))
    .map((z) => ({ ...z, tables: bestOnly ? z.tables.filter((t) => best.has(t)) : z.tables }))
    .filter((z) => z.tables.length > 0);
  const jam = cafeJamRange(timeStart, timeEnd);
  const chosenZone = table ? cafeZoneOf(table) : undefined;
  const waHref = cafeReservationUrl({ eventName, eventDate, timeStart, timeEnd, location, table });

  return (
    <section className="cafe-reservation @container border-y border-border bg-card text-foreground py-6" aria-labelledby="reservation-title">
      <header className="px-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="flex items-center gap-2 text-primary text-xs font-bold"><Armchair className="size-4" /> GOOD STORY CAFE</span>
          {jam && <span className="inline-flex items-center gap-2 text-sm font-bold tabular-nums"><Clock className="size-4 text-primary" />{jam}</span>}
        </div>
        <h2 id="reservation-title" className="text-xl font-extrabold leading-tight">Reservasi Kursi &amp; Pilih Meja</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Mau posisi kursi terbaik? Boleh reservasi. Pilih nomor meja sesuai keinginan kamu, lalu hubungi kami lewat WhatsApp.</p>
      </header>

      <div className="mt-5 grid @min-[620px]:grid-cols-[1fr_1.1fr] gap-5 px-4 sm:px-5">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-bold text-sm flex items-center gap-2"><Map className="size-4 text-primary" /> Denah meja</h3>
            <Button variant="ghost" size="icon" aria-label={showDenah ? "Tutup denah meja" : "Lihat denah meja"} aria-expanded={showDenah} onClick={() => setShowDenah(!showDenah)}><ChevronDown className={showDenah ? "rotate-180" : ""} /></Button>
          </div>
          {showDenah && <>
            <a href={denahAsset.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-border bg-muted p-2" aria-label="Buka denah ukuran penuh">
              <img src={denahAsset.url} alt="Denah nomor meja Good Story Cafe" width={1400} height={1833} className="w-full h-auto max-h-[420px] object-contain" loading="lazy" />
            </a>
            <Button variant="link" asChild className="px-0 text-xs"><a href={denahAsset.url} target="_blank" rel="noopener noreferrer">Lihat denah lengkap<ArrowUpRight /></a></Button>
          </>}
        </div>

        <div className="min-w-0">
          <label htmlFor="cafe-area" className="block text-sm font-bold mb-2">Pilih area &amp; nomor meja</label>
          <select id="cafe-area" value={zone} onChange={(e) => setZone(e.target.value)} className="w-full h-10 rounded-md border border-border bg-background text-foreground px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="all">Semua area</option>
            {CAFE_ZONES.map((z) => <option key={z.id} value={z.id}>{z.label}</option>)}
          </select>
          <label className="flex items-center gap-2 py-3 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={bestOnly} onChange={(e) => setBestOnly(e.target.checked)} className="size-4 accent-primary" />
            <Star className="size-3 text-primary" /> Posisi dekat panggung saja
          </label>
          <div className="max-h-[360px] overflow-y-auto pr-1 space-y-4" aria-label="Pilihan nomor meja">
            {zones.length === 0 && <p className="text-sm text-muted-foreground py-4">Tidak ada meja dekat panggung di area ini.</p>}
            {zones.map((z) => <div key={z.id}>
              <div className="mb-2"><h4 className="font-bold text-xs">{z.label}</h4><p className="text-muted-foreground text-xs mt-1">{z.note}</p></div>
              <div className="grid grid-cols-5 gap-2">
                {z.tables.map((t) => <Button key={t} type="button" size="sm" variant={table === t ? "default" : "outline"} aria-pressed={table === t} onClick={() => setTable(t)} title={`${t} — ${z.label}`} className="relative h-10 min-w-0 px-0 text-xs tabular-nums">
                  {t}{table === t ? <Check className="absolute right-0.5 top-0.5 !size-2.5" /> : best.has(t) ? <span className="absolute right-1 top-1 size-1 rounded-full bg-primary" /> : null}
                </Button>)}
              </div>
            </div>)}
          </div>
        </div>
      </div>

      <footer className="mt-5 border-t border-border px-4 sm:px-5 pt-4">
        <div className="flex items-start gap-3 mb-4" aria-live="polite">
          <Armchair className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0"><p className="text-sm font-bold">{table ? `Meja ${table} dipilih` : "Belum memilih meja"}</p><p className="text-xs text-muted-foreground mt-1">{chosenZone ? chosenZone.label : "Boleh langsung chat untuk dibantu memilih posisi terbaik."}</p></div>
          {table && <Button variant="ghost" size="sm" className="ml-auto shrink-0" onClick={() => setTable(null)}>Batal</Button>}
        </div>
        <Button asChild className="w-full min-h-12 whitespace-normal text-center font-bold"><a href={waHref} target="_blank" rel="noopener noreferrer"><MessageCircle />{table ? `Reservasi ${table} via WhatsApp` : "Reservasi via WhatsApp"}<ArrowUpRight /></a></Button>
        <p className="text-center text-xs text-muted-foreground mt-2">NEMPO · {NEMPO_WA_NUMBER}</p>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">Pilihan meja adalah permintaan reservasi. Ketersediaan dan posisi kursi dikonfirmasi oleh tim melalui WhatsApp.</p>
      </footer>
    </section>
  );
}
