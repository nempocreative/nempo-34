// Wedding Content Creator packages supplied by the user.
export const WCC_PACKAGES = [
  { id: "intimate", name: "Intimate", price: 350_000, scope: "Akad Only · 2–3 Jam", items: ["1 Wedding Content Creator", "Dokumentasi momen akad", "Behind the Scene & candid", "1 video highlight", "Raw footage", "File digital maksimal H+1"] },
  { id: "essential", name: "Essential", price: 650_000, scope: "Akad & Resepsi · 5 Jam", items: ["1 Wedding Content Creator", "Dokumentasi akad & resepsi", "Behind the Scene", "2 video highlight", "Raw footage", "File digital maksimal H+1"] },
  { id: "exclusive", name: "Exclusive", price: 950_000, scope: "Full Wedding Day · 8 Jam", items: ["1 Wedding Content Creator", "Dokumentasi persiapan hingga resepsi", "3 video highlight", "1 video TikTok trend", "Raw footage", "Same Day Edit", "File digital maksimal H+1"] },
] as const;

export const WCC_ADDONS = [
  { id: "extra-hour", name: "Extra hour", price: 100_000, startingFrom: false },
  { id: "highlight", name: "Tambahan video highlight", price: 100_000, startingFrom: false },
  { id: "sde", name: "Same Day Edit", price: 200_000, startingFrom: false },
  { id: "crew", name: "Tambahan crew WCC", price: 250_000, startingFrom: false },
  { id: "engagement", name: "Lamaran / Engagement", price: 350_000, startingFrom: true },
] as const;

export const WCC_TRANSPORT_NOTE = "Transportasi luar Garut kota menyesuaikan.";
