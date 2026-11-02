// Event Liaison Officer Service tariffs supplied by the user.
// Kept browser-safe: no process.env, no database access.

export const LO_SERVICE_NAME = "Event Liaison Officer Service";

export const LO_TARIFFS = [
  {
    id: "half-day",
    name: "Half Day",
    price: 150_000,
    duration: "Durasi 4–5 jam / orang",
    items: [
      "Pendampingan tamu atau talent",
      "Koordinasi kebutuhan acara",
      "Komunikasi dengan panitia",
    ],
  },
  {
    id: "full-day",
    name: "Full Day",
    price: 250_000,
    duration: "Durasi 8–10 jam / orang",
    items: [
      "Pendampingan tamu atau talent",
      "Koordinasi rundown",
      "Mengatur kebutuhan talent",
      "Komunikasi dengan divisi terkait",
    ],
  },
  {
    id: "vip",
    name: "VIP / Special Guest",
    price: 350_000,
    duration: "Durasi 8–10 jam / orang",
    items: [
      "Pendampingan VIP / VVIP",
      "Handling kebutuhan khusus",
      "Koordinasi protokoler",
      "Pendampingan selama acara",
    ],
  },
] as const;

export const LO_ADDONS = [
  { id: "extra-hour", name: "Extra hour", price: 35_000, startingFrom: false },
  { id: "briefing", name: "Briefing / Technical Meeting", price: 50_000, startingFrom: false },
  { id: "talent", name: "LO Talent", price: 250_000, startingFrom: true },
  { id: "wedding", name: "LO Wedding / Family", price: 250_000, startingFrom: true },
  { id: "corporate", name: "LO Corporate / VIP", price: 350_000, startingFrom: true },
] as const;

export const LO_EXCLUSION_NOTE =
  "Harga per orang, belum termasuk transportasi, konsumsi, dan akomodasi jika diperlukan.";

export function loRupiah(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}
