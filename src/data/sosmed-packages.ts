// Sosmed Management prices — same values as the Kerja Sama price list (/price-list#paket-promosi).

export type SosmedItem = {
  id: string;
  name: string;
  platform: "Instagram" | "TikTok";
  price: number;
  unit: string;
  features: string[];
};

export const SOSMED_ITEMS: SosmedItem[] = [
  { id: "ig-ads", name: "Instagram Ads", platform: "Instagram", price: 300_000, unit: "/minggu", features: ["Prioritas tayang khusus", "Tombol CTA langsung ke detail event", "Konten tunggal/multiple atau video pendek (Reels)"] },
  { id: "ig-feed", name: "Instagram Feed", platform: "Instagram", price: 1_250_000, unit: "/post", features: ["1 post di feed", "Materi dari Nempo Organizer", "Caption dari event creator", "3 hashtag utama + 2 tag"] },
  { id: "ig-story", name: "Instagram Story", platform: "Instagram", price: 250_000, unit: "/post", features: ["1 post story", "Link CTA langsung ke detail event", "Materi dari Nempo Organizer"] },
  { id: "ig-reels", name: "Instagram Reels", platform: "Instagram", price: 650_000, unit: "/post", features: ["1 video Reels", "Materi dari Nempo Organizer", "3 hashtag utama + 5 tag"] },
  { id: "ig-highlight", name: "Instagram Highlight", platform: "Instagram", price: 500_000, unit: "/paket", features: ["3 konten highlight", "Materi khusus dari Feed, Story & Reels"] },
  { id: "tt-photo", name: "TikTok Post (Foto)", platform: "TikTok", price: 400_000, unit: "/post", features: ["1 post foto", "Materi dari Nempo Organizer", "3 hashtag utama + 3 tag"] },
  { id: "tt-video", name: "TikTok Post (Video)", platform: "TikTok", price: 500_000, unit: "/post", features: ["1 video maks. 1 menit", "Materi dari Nempo Organizer", "3 hashtag utama + 3 tag"] },
];

export type SosmedBundle = {
  id: string;
  name: string;
  normalPrice: number;
  price: number;
  tagline: string;
  includes: string[];
  popular?: boolean;
};

export const SOSMED_BUNDLES: SosmedBundle[] = [
  {
    id: "social-media",
    name: "Paket Social Media",
    normalPrice: 5_000_000,
    price: 4_000_000,
    tagline: "Semua kanal Instagram dalam satu paket",
    popular: true,
    includes: ["Instagram Ads Rp300.000/minggu", "2x Instagram Feed", "2x Instagram Story", "1x Instagram Reels", "1x Instagram Highlight"],
  },
  {
    id: "all-promotion",
    name: "All Promotion",
    normalPrice: 10_000_000,
    price: 7_500_000,
    tagline: "Sosmed + tampil di website Nempo",
    includes: ["Semua isi Paket Social Media", "Dedicated Hero Banner 2 minggu", "Campaign Hero Banner 2 minggu", "Campaign Banner 2 minggu", "Rekomendasi Event 2 minggu"],
  },
];

export const bundleSaving = (b: SosmedBundle) => b.normalPrice - b.price;

export const rupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

// Paket bulanan Sosmed Management — harga & isi dari daftar harga resmi Nempo (STARTER / RECOMMENDED / PROFESSIONAL).
export type SosmedMonthlyPackage = {
  id: string;
  tier: string;
  name: string;
  price: number;
  unit: string;
  includes: string[];
  fit: string;
  recommended?: boolean;
};

export const SOSMED_MONTHLY_PACKAGES: SosmedMonthlyPackage[] = [
  {
    id: "basic",
    tier: "STARTER",
    name: "Paket Basic",
    price: 750_000,
    unit: "/bulan",
    includes: ["8 desain Feed Instagram", "8 Instagram Story", "Caption dan hashtag", "Content planning", "Penjadwalan posting", "1 akun Instagram"],
    fit: "Cocok untuk UMKM yang baru mulai aktif.",
  },
  {
    id: "growth",
    tier: "RECOMMENDED",
    name: "Paket Growth",
    price: 1_500_000,
    unit: "/bulan",
    includes: ["8 desain Feed", "8 video Reels", "12 Instagram Story", "Caption dan hashtag", "Content planning", "Posting dan penjadwalan", "1x kunjungan produksi konten (maks. 2 jam)", "Monthly report"],
    fit: "Cocok untuk cafe, salon, restoran, dan bisnis yang ingin berkembang.",
    recommended: true,
  },
  {
    id: "professional",
    tier: "PROFESSIONAL",
    name: "Paket Professional",
    price: 2_500_000,
    unit: "/bulan",
    includes: ["12 desain Feed", "12 video Reels", "20 Instagram Story", "Caption dan copywriting", "Content planning", "Posting dan penjadwalan", "2x kunjungan produksi konten", "Optimasi profil Instagram", "Monthly report"],
    fit: "Cocok untuk brand yang membutuhkan pengelolaan lebih intensif.",
  },
];

export const sosmedMonthlyPackage = (id: string) => SOSMED_MONTHLY_PACKAGES.find((p) => p.id === id)!;

// Promo khusus UMKM = Paket Growth (Rp1.500.000 per bulan).
export const SOSMED_UMKM_PROMO = (() => {
  const g = sosmedMonthlyPackage("growth");
  return { name: "Promo Sosmed UMKM", price: g.price, unit: g.unit, tagline: g.fit, includes: g.includes };
})();

// Layanan tambahan — harga dari daftar harga yang sama.
export type SosmedAddon = { label: string; price: string };

export const SOSMED_ADDONS: SosmedAddon[] = [
  { label: "Tambahan 1 Reels", price: "Rp100.000" },
  { label: "Tambahan 1 desain Feed", price: "Rp50.000" },
  { label: "Foto produk", price: "Mulai Rp300.000" },
  { label: "Video promosi bisnis", price: "Mulai Rp500.000" },
  { label: "Talent / model", price: "Menyesuaikan" },
  { label: "Meta Ads management", price: "Mulai Rp300.000" },
  { label: "TikTok management", price: "Mulai Rp500.000" },
];
