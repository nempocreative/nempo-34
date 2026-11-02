// Website packages supplied by the user; legacy digital services stay separate.

export const WEBSITE_PACKAGES = [
  {
    id: "landing-page", name: "Landing Page", price: 1_500_000,
    detail: "Satu halaman untuk memperkenalkan produk atau jasa.",
    items: ["Website 1 halaman", "Responsive mobile & desktop", "Informasi produk / jasa", "Tombol WhatsApp", "Google Maps", "Integrasi Instagram"],
  },
  {
    id: "umkm", name: "Website UMKM", price: 2_500_000,
    detail: "Website usaha dengan informasi lengkap dan mudah ditemukan.",
    items: ["Maksimal 5 halaman", "Home, About, Produk, Galeri, Kontak", "Responsive", "WhatsApp", "Google Maps", "SEO dasar"],
  },
  {
    id: "company-profile", name: "Company Profile", price: 4_000_000,
    detail: "Profil perusahaan profesional dengan artikel dan portofolio.",
    items: ["Maksimal 10 halaman", "Desain profesional", "Profil perusahaan", "Layanan dan portfolio", "Artikel / berita", "Dashboard admin", "SEO dasar"],
  },
  {
    id: "professional", name: "Website Professional", price: 7_500_000,
    detail: "Tampilan dan fitur yang dirancang mengikuti kebutuhan bisnis.",
    items: ["Desain UI/UX custom", "Dashboard admin", "Manajemen konten", "Fitur sesuai kebutuhan", "SEO dasar", "Integrasi API sederhana"],
  },
  {
    id: "ecommerce", name: "Website E-Commerce", price: 8_500_000,
    detail: "Toko online untuk mengelola produk dan pesanan pelanggan.",
    items: ["Katalog produk", "Keranjang belanja", "Checkout", "Manajemen produk", "Dashboard admin", "Order management", "Integrasi WhatsApp"],
  },
] as const;

export const WEBSITE_EXCLUSIONS = {
  paymentGateway: true,
  complexSystems: true,
  customIntegrations: true,
};

export const WEBSITE_ADDITIONAL_FEES = [
  { id: "domain", name: "Domain", price: 200_000, unit: "/tahun", startingFrom: true },
  { id: "hosting", name: "Hosting", price: 500_000, unit: "/tahun", startingFrom: true },
  { id: "maintenance", name: "Maintenance", price: 300_000, maxPrice: 1_000_000, unit: "/bulan", startingFrom: false },
  { id: "content", name: "Update konten", price: 250_000, unit: "/bulan", startingFrom: true },
  { id: "seo", name: "SEO bulanan", price: 750_000, unit: "/bulan", startingFrom: true },
];

export function websiteConsultUrl(base: string, packageId: string) {
  const selected = WEBSITE_PACKAGES.find((p) => p.id === packageId);
  if (!selected) return base;
  const url = new URL(base);
  url.searchParams.set("text", `Halo Nempo, saya ingin konsultasi paket ${selected.name} (${webRupiah(selected.price)}).`);
  return url.toString();
}

export type WebProject = { id: string; name: string; price: number; billing: string; detail: string; items: string[] };

export const WEB_PROJECTS: WebProject[] = [
  {
    id: "company",
    name: "Company Website",
    price: 1_500_000,
    billing: "sekali buat",
    detail: "Kesan pertama yang kuat untuk usaha, komunitas, atau instansi.",
    items: ["Profil usaha", "Portofolio", "Form kontak"],
  },
  {
    id: "link-bio",
    name: "Link Bio",
    price: 49_000,
    billing: "per bulan",
    detail: "Satu halaman untuk semua tautan bisnis dari Instagram, TikTok, atau WhatsApp.",
    items: ["Satu tautan untuk semua kanal", "Profil dan katalog singkat", "Statistik kunjungan"],
  },
  {
    id: "ticketing",
    name: "Event Ticketing",
    price: 499_000,
    billing: "per event",
    detail: "Website penjualan tiket lengkap untuk event, konser, dan lomba.",
    items: ["Tiket online", "QR check-in", "Dashboard peserta"],
  },
];

export type WebPlan = {
  id: string;
  name: string;
  eyebrow: string;
  price: number;
  regularPrice: number;
  setup: number;
  setupRegular: number;
  note: string;
  items: string[];
  bestFor: string;
  featured?: boolean;
};

export const WEB_PLANS: WebPlan[] = [
  {
    id: "mulai-online", name: "Mulai Online", eyebrow: "Paket ringan",
    price: 79_000, regularPrice: 99_000, setup: 100_000, setupRegular: 200_000,
    note: "1 usaha · 1 cabang · 2 modul",
    items: ["Link Bio + katalog singkat", "QR Menu yang mudah diperbarui", "Setup tampilan & konfigurasi awal"],
    bestFor: "Usaha yang baru mulai go digital.",
  },
  {
    id: "operasional-rapi", name: "Operasional Rapi", eyebrow: "Paling dipilih",
    price: 249_000, regularPrice: 399_000, setup: 250_000, setupRegular: 450_000,
    note: "1 usaha · 1 cabang · hingga 4 modul",
    items: ["Kasir sederhana untuk transaksi harian", "Stok & HPP dasar", "Laporan penjualan harian", "Setup alur kerja awal"],
    bestFor: "Cafe, F&B, dan toko yang ingin lebih tertib.",
    featured: true,
  },
  {
    id: "usaha-bertumbuh", name: "Usaha Bertumbuh", eyebrow: "Pelanggan tumbuh",
    price: 399_000, regularPrice: 649_000, setup: 350_000, setupRegular: 650_000,
    note: "1 usaha · 1 cabang · hingga 6 modul",
    items: ["CRM pelanggan dan riwayat interaksi", "Loyalty sederhana: poin & stamp", "Marketing Tools untuk campaign", "Setup segmentasi pelanggan awal"],
    bestFor: "Usaha yang sudah punya pelanggan tetap.",
  },
  {
    id: "super-app", name: "Super App", eyebrow: "Terhubung",
    price: 699_000, regularPrice: 1_099_000, setup: 750_000, setupRegular: 1_200_000,
    note: "1 usaha · 1 cabang · modul tambahan opsional",
    items: ["Pilih hingga 10 modul bisnis", "Dashboard terpadu untuk memantau usaha", "Modul saling terhubung", "Pendampingan implementasi awal"],
    bestFor: "Bisnis dengan alur operasional yang lebih kompleks.",
  },
];

/** First month = monthly price + one-time setup. */
export const firstMonthTotal = (p: WebPlan) => p.price + p.setup;
export const monthlySaving = (p: WebPlan) => p.regularPrice - p.price;

export const webRupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
