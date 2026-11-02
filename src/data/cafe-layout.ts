// Browser-safe data: denah meja Good Story Cafe.
// Sumber: file denah venue LAYOUT_GSC_CAFE_2.pdf (stage musik, VIP 1-2, M1-M52,
// meja 53-57 di strip bar, dan catatan "Nomor Meja Tambahan: 58-65").
// Nomor meja dan zona diambil apa adanya dari denah — jangan mengarang nomor baru.

import { NEMPO_WA_URL } from "@/lib/contact";

export interface CafeZone {
  id: string;
  label: string;
  note: string;
  tables: string[];
  /** Meja dengan pandangan paling dekat ke panggung. */
  bestSpot: boolean;
}

const m = (from: number, to: number) => {
  const out: string[] = [];
  for (let i = from; i <= to; i++) out.push(`M${i}`);
  return out;
};
const num = (from: number, to: number) => {
  const out: string[] = [];
  for (let i = from; i <= to; i++) out.push(`${i}`);
  return out;
};

export const CAFE_ZONES: CafeZone[] = [
  { id: "vip", label: "VIP", note: "Persis di samping panggung", tables: ["VIP 1", "VIP 2"], bestSpot: true },
  { id: "depan", label: "Depan Panggung", note: "Tepi lantai 2, paling dekat ke panggung", tables: m(1, 5), bestSpot: true },
  { id: "lt2", label: "Lantai 2", note: "Area tengah lantai 2", tables: m(6, 18), bestSpot: false },
  { id: "lt3", label: "Lantai 3", note: "Area lantai 3", tables: m(19, 35), bestSpot: false },
  { id: "samping", label: "Samping Panggung", note: "Sudut kiri & kanan panggung", tables: m(36, 45), bestSpot: true },
  { id: "bar", label: "Area Bar & Kolam", note: "Dekat kolam ikan dan area bar", tables: [...m(46, 52), ...num(53, 57)], bestSpot: false },
  { id: "tambahan", label: "Meja Tambahan", note: "Meja tambahan di luar denah utama", tables: num(58, 65), bestSpot: false },
];

export const CAFE_TABLES: string[] = CAFE_ZONES.flatMap((z) => z.tables);

export function cafeZoneOf(table: string): CafeZone | undefined {
  return CAFE_ZONES.find((z) => z.tables.includes(table));
}

export function cafeBestSpotTables(): string[] {
  return CAFE_ZONES.filter((z) => z.bestSpot).flatMap((z) => z.tables);
}

/** "15:00" -> "15.00" (gaya jam Indonesia). */
export function formatJamWib(time?: string | null): string {
  return time ? time.replace(":", ".") : "";
}

/** "15.00 – 23.00 WIB" dari jam mulai/selesai event. */
export function cafeJamRange(timeStart?: string | null, timeEnd?: string | null): string {
  const start = formatJamWib(timeStart);
  const end = formatJamWib(timeEnd);
  if (start && end) return `${start} – ${end} WIB`;
  if (start) return `mulai ${start} WIB`;
  if (end) return `s/d ${end} WIB`;
  return "";
}

export interface CafeReservationInput {
  eventName: string;
  eventDate?: string;
  timeStart?: string | null;
  timeEnd?: string | null;
  location?: string;
  table?: string | null;
}

function fmtTanggal(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/** Isi pesan WhatsApp: event, jam, dan nomor meja yang dipilih. */
export function cafeReservationMessage(input: CafeReservationInput): string {
  const jam = cafeJamRange(input.timeStart, input.timeEnd);
  const zone = input.table ? cafeZoneOf(input.table) : undefined;
  const meja = input.table
    ? `${input.table}${zone ? ` (${zone.label})` : ""}`
    : "belum dipilih — mohon dibantu posisi terbaik";
  const lines = [
    `Halo NEMPO, saya mau reservasi kursi untuk ${input.eventName}.`,
    `Tanggal: ${fmtTanggal(input.eventDate) || "-"}`,
    `Jam acara: ${jam || "-"}`,
    `Tempat: ${input.location || "-"}`,
    `Meja dipilih: ${meja}`,
    "Nama: ",
    "Jumlah orang: ",
  ];
  return lines.join("\n");
}

/** Tautan WhatsApp resmi Nempo dengan pesan reservasi sudah terisi. */
export function cafeReservationUrl(input: CafeReservationInput): string {
  return `${NEMPO_WA_URL}?text=${encodeURIComponent(cafeReservationMessage(input))}`;
}
