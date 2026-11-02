import { MapPin, RotateCcw } from "lucide-react";
import { ALL_CITIES, useCityFilter } from "@/contexts/city-filter-context";

type CityUnavailableProps = {
  accent?: string;
  category?: string;
};

export function CityUnavailable({
  accent = "#0194f3",
  category = "Konten",
}: CityUnavailableProps) {
  const { selectedCity, setSelectedCity } = useCityFilter();

  if (selectedCity === ALL_CITIES) return null;

  return (
    <div className="rounded-3xl border border-dashed border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 px-6 py-12 text-center shadow-sm">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${accent}, #0172B1)` }}
      >
        <MapPin className="h-8 w-8" strokeWidth={1.8} />
      </div>
      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>
        Area pilihanmu
      </p>
      <h3 className="mt-2 text-xl font-black text-gray-900">
        {selectedCity}
      </h3>
      <p className="mt-2 text-base font-extrabold text-gray-700">
        Kota kamu sedang dipersiapkan
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
        {category} untuk {selectedCity} sedang kami siapkan. Pilihan lokasi ini akan
        segera hadir di Nempo Organizer.
      </p>
      <button
        type="button"
        onClick={() => setSelectedCity(ALL_CITIES)}
        className="mx-auto mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
        style={{ background: accent }}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Lihat semua Jawa Barat
      </button>
    </div>
  );
}