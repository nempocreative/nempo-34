import { useEffect, useState } from "react";
import { Handshake, Image as ImageIcon, Plus, Save, Trash2 } from "lucide-react";
import { api } from "@/apps/admin/lib/api";
import { Field, inputCls, textareaCls } from "@/apps/admin/components/modal";
import { ImageUpload } from "@/apps/admin/components/image-upload";
import { MultiImageUpload } from "@/apps/admin/components/multi-image-upload";

type Stat = { value: string; label: string };
type Theme = { title: string; desc: string; color: string };
type Step = { no: string; title: string; desc: string; color: string };
type CollaborationModel = { label: string; title: string; desc: string; note: string; points: string[] };
type Why = { title: string; desc: string };
type Portfolio = { title: string; category: string; location: string; image: string; services: string; result: string };
type Service = { no: string; title: string; items: string[] };
type SocialPackage = { name: string; price: string; features: string[] };
type WebsitePackage = { name: string; prices: { duration: string; price: string }[]; features: string[] };
type PackageCard = { name: string; originalPrice: string; price: string };
type Feature = { title: string; desc: string };
type PartnershipArea = { id: string; no: string; title: string; description: string; offerings: string[] };

type PartnershipContent = {
  hero: {
    eyebrow: string; titleLine1: string; titleLine2: string; description: string;
    primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string;
    captionEyebrow: string; captionTitle: string;
    photoNote: string; smallStatValue: string; smallStatLabel: string; bottomLabel: string; bottomItems: string[];
  };
  heroImages: string[];
  heroStats: Stat[];
  themes: Theme[];
  collabSteps: Step[];
  collaborationModels: CollaborationModel[];
  whyUs: Why[];
  portfolio: Portfolio[];
  services: Service[];
  socialPackages: SocialPackage[];
  websitePackages: WebsitePackage[];
  packageCards: PackageCard[];
  features: Feature[];
  partnershipAreas: PartnershipArea[];
  cta: { eyebrow: string; titleLine1: string; titleLine2: string; description: string; buttonLabel: string; emailText: string };
};

const DEFAULT_CONTENT: PartnershipContent = {
  hero: {
    eyebrow: "Nempo / kerja sama",
    titleLine1: "Biar tempatmu",
    titleLine2: "ditemukan.",
    description: "Kamu punya kafe, destinasi, atau acara yang ingin dikenal lebih banyak orang? Ceritakan dulu. Kita cari cara yang paling masuk akal untuk membawanya lebih jauh.",
    primaryLabel: "Bahas konsep event",
    primaryHref: "https://ig.me/m/nempo.id",
    secondaryLabel: "Lihat cara kerja",
    secondaryHref: "#cara-kolaborasi",
    captionEyebrow: "Di balik setiap kolaborasi",
    captionTitle: "Ada obrolan yang dimulai dari satu meja.",
    photoNote: "Foto nyata dari cerita lokal Nempo",
    smallStatValue: "500+",
    smallStatLabel: "event dikelola",
    bottomLabel: "Yang bisa kami bantu",
    bottomItems: ["Event & aktivasi", "Promosi", "Ticketing", "Digital system"],
  },
  heroImages: [
    "images/hero/papandayan.webp", "images/hero/karnaval.webp", "images/hero/kolaborasi.webp",
    "images/hero/dpakar.webp", "images/hero/sampireun.webp", "images/hero/sate-maranggi.webp",
    "images/hero/gunung-guntur.webp",
  ],
  heroStats: [
    { value: "500+", label: "Event Dikelola" }, { value: "47K+", label: "Pengguna Aktif" },
    { value: "38", label: "Kecamatan" }, { value: "10+", label: "Layanan" },
  ],
  themes: [
    { title: "Music DJ Night", desc: "DJ set, lighting, dan dance floor.", color: "#3fa9f5" },
    { title: "Glow in the Dark", desc: "Face painting neon yang unik dan seru.", color: "#e57552" },
    { title: "Live Acoustic", desc: "Musik santai untuk suasana yang hangat.", color: "#d99b7c" },
    { title: "Sunset Picnic", desc: "Piknik sore dengan view dan aktivitas seru.", color: "#c8834d" },
    { title: "Creative Workshop", desc: "Kelas kreatif, craft, dan aktivitas hands-on.", color: "#e8b54f" },
    { title: "Bazar Kuliner", desc: "Jelajah rasa, tenant lokal, dan live cooking.", color: "#d45f50" },
    { title: "Fun Run & Sport Day", desc: "Aktivitas sehat untuk komunitas dan brand.", color: "#5b9a78" },
    { title: "Community Gathering", desc: "Bangun koneksi lewat games dan networking.", color: "#6489a5" },
    { title: "Festival Lokal", desc: "Rayakan cerita lokal dengan panggung dan pasar kreatif.", color: "#a86e81" },
    { title: "Kids & Family Day", desc: "Keseruan ramah keluarga untuk semua usia.", color: "#4d9c91" },
    { title: "Open Mic Night", desc: "Panggung terbuka untuk musik, cerita, dan talenta lokal.", color: "#8b78b4" },
    { title: "Brand Activation", desc: "Bikin brand hadir lebih dekat lewat pengalaman yang berkesan.", color: "#477f91" },
  ],
  collabSteps: [
    { no: "01", title: "Ceritakan idemu", desc: "Bagikan konsep event, lokasi, dan target audiensmu.", color: "#0194f3" },
    { no: "02", title: "Rancang bersama", desc: "Nempo bantu konsep, promosi, ticketing, dan operasional.", color: "#0b8fbe" },
    { no: "03", title: "Event makin dikenal", desc: "Jangkau lebih banyak penjelajah dan ukur hasilnya.", color: "#0052b0" },
  ],
  collaborationModels: [
    {
      label: "Model 01",
      title: "Fee Event",
      desc: "Biaya kerja sama ditentukan di awal berdasarkan kebutuhan event, ruang lingkup pekerjaan, dan target yang ingin dicapai.",
      note: "Cocok untuk event dengan kebutuhan produksi dan operasional yang sudah jelas.",
      points: ["Budget dan scope lebih mudah direncanakan", "Rincian pekerjaan dibahas sejak awal", "Cocok untuk event dengan target tetap"],
    },
    {
      label: "Model 02",
      title: "% Sharing",
      desc: "Kerja sama berbasis persentase dari hasil event atau penjualan, dengan pembagian yang disepakati bersama sesuai kontribusi masing-masing pihak.",
      note: "Cocok untuk event yang ingin bertumbuh bersama dan membagi risiko secara proporsional.",
      points: ["Persentase dibicarakan secara terbuka", "Pembagian mengikuti kontribusi dan peran", "Skema lebih fleksibel untuk event berkembang"],
    },
  ],
  whyUs: [
    { title: "Bisa diandalkan", desc: "Alur tiket dan event yang jelas, dengan tim yang ikut menjaga detailnya." },
    { title: "Lebih mudah ditemukan", desc: "Bawa cerita tempat dan eventmu ke orang-orang yang memang sedang mencari." },
    { title: "Dibantu sampai selesai", desc: "Bukan cuma tayang. Tim Nempo ikut menjawab dan membantu saat dibutuhkan." },
    { title: "Sederhana dipakai", desc: "Pantau kebutuhan promosi dan ticketing dari perangkat yang biasa kamu pakai." },
  ],
  portfolio: [
    { title: "House of Maru", category: "Mitra tempat", location: "Garut", image: "images/hero/dpakar.webp", services: "Publikasi · Promosi digital", result: "Cerita tempat dikenalkan sebagai bagian dari pilihan lokal yang bisa ditemukan di Nempo.id." },
    { title: "Kala Muda", category: "Mitra tempat", location: "Garut", image: "images/hero/sate-maranggi.webp", services: "Publikasi · Promosi digital", result: "Membawa cerita tempat dan suasananya lebih dekat kepada penjelajah lokal." },
    { title: "Biang Coffee", category: "Mitra tempat", location: "Garut", image: "images/hero/kolaborasi.webp", services: "Publikasi · Promosi digital", result: "Tempat ngopi lokal masuk ke dalam cerita dan rekomendasi yang dibawa Nempo." },
    { title: "Kopi Jaya", category: "Mitra tempat", location: "Garut", image: "images/hero/papandayan.webp", services: "Publikasi · Promosi digital", result: "Membantu tempat lokal tampil lebih mudah ditemukan oleh audiens Nempo." },
    { title: "Domusa", category: "Mitra bisnis", location: "Garut", image: "images/hero/gunung-guntur.webp", services: "Kolaborasi brand · Publikasi", result: "Brand mendapat ruang untuk hadir di dalam ekosistem cerita lokal Nempo." },
    { title: "MAXI.ID COM", category: "Mitra brand", location: "Garut", image: "images/hero/karnaval.webp", services: "Kolaborasi brand · Promosi", result: "Kolaborasi brand ditempatkan dekat dengan komunitas, event, dan aktivitas lokal." },
    { title: "Temu Tarung", category: "Event olahraga", location: "Garut", image: "images/hero/kolaborasi.webp", services: "Ticketing event · Promosi", result: "Event olahraga hadir dengan informasi acara dan akses ticketing yang lebih terarah." },
    { title: "Situ Bagendit", category: "Destinasi wisata", location: "Garut", image: "images/hero/papandayan.webp", services: "Publikasi destinasi · Promosi", result: "Cerita destinasi lokal dibawa lebih dekat kepada orang yang sedang mencari pengalaman di Garut." },
  ],
  services: [
    { no: "01", title: "Penjualan Tiket", items: ["Ticketing Event", "Ticketing Wisata", "Registrasi Seminar", "QR Check-In System", "Dashboard Penjualan", "Payment Gateway", "Laporan Pengunjung"] },
    { no: "02", title: "Event Organizer", items: ["Festival & Konser", "Sport Event", "Touring & Gathering", "Pameran & Expo", "Community Event", "Corporate Event", "Brand Activation"] },
    { no: "03", title: "Sistem Digital", items: ["Website Development", "Sistem Reservasi", "Sistem Ticketing", "Membership System", "Dashboard Monitoring", "Aplikasi Web", "Custom Software"] },
    { no: "04", title: "Media & Promosi", items: ["Publikasi Media", "Press Release", "Media Partner", "Liputan Event", "Media Exposure", "Digital Publication"] },
    { no: "05", title: "Destinasi Wisata", items: ["Pengelolaan Tiket Wisata", "Pemasaran Destinasi", "Paket Wisata", "Event Wisata", "Visitor Experience", "Digitalisasi Wisata"] },
    { no: "06", title: "Sponsorship", items: ["Pencarian Sponsor", "Sponsorship Management", "Brand Matching", "Proposal Sponsorship", "Aktivasi Sponsor", "Partnership Program"] },
    { no: "07", title: "Komunitas", items: ["Pengembangan Komunitas", "Program Member", "Kompetisi", "Workshop", "Gathering", "Networking Event"] },
    { no: "08", title: "Pengembangan Bisnis", items: ["Konsultasi Bisnis", "Strategi Pemasaran", "Digital Transformation", "Revenue Optimization", "Project Management", "Business Collaboration"] },
  ],
  socialPackages: [
    { name: "Instagram Ads", price: "Rp300.000", features: ["Request dedicated priority", "CTA link direct to event detail", "Single/multiple content, short video (Reels)"] },
    { name: "Instagram Feed", price: "Rp1.250.000", features: ["1 Post", "Material dari Nempo.id", "Caption dari event creator", "3 main hashtags + 2 tag"] },
    { name: "Instagram Story", price: "Rp250.000", features: ["1 Post", "CTA link direct to event detail", "Material dari Nempo.id"] },
    { name: "Instagram Reels", price: "Rp650.000", features: ["1 Post", "Material dari Nempo.id", "3 main hashtags + 5 tag"] },
    { name: "Instagram Highlight", price: "Rp500.000", features: ["3 content highlight", "Material dedicated Feed, Story & Reels"] },
    { name: "TikTok Post (Foto)", price: "Rp400.000", features: ["1 Post", "Material dari Nempo.id", "3 main hashtags + 3 tag"] },
    { name: "TikTok Post (Video)", price: "Rp500.000", features: ["1 Post max. 1 menit", "Material dari Nempo.id", "3 main hashtags + 3 tag"] },
  ],
  websitePackages: [
    { name: "Dedicated Hero Banner", prices: [{ duration: "2 Minggu", price: "Rp2.500.000" }, { duration: "1 Bulan", price: "Rp4.000.000" }], features: ["Direct link detail Nempo.id"] },
    { name: "Campaign Banner", prices: [{ duration: "2 Minggu", price: "Rp750.000" }, { duration: "1 Bulan", price: "Rp1.500.000" }], features: ["Direct event detail Nempo.id", "Materials campaign from Nempo.id"] },
    { name: "Event Recommendation", prices: [{ duration: "2 Minggu", price: "Rp250.000" }, { duration: "1 Bulan", price: "Rp750.000" }], features: ["Direct event detail Nempo.id", "Position after hero banner section"] },
  ],
  packageCards: [
    { name: "Website 2 Weeks", originalPrice: "Rp5.000.000", price: "Rp4.250.000" },
    { name: "Website 1 Month", originalPrice: "Rp7.500.000", price: "Rp6.250.000" },
    { name: "Social Media", originalPrice: "Rp5.000.000", price: "Rp4.000.000" },
    { name: "All Promotion", originalPrice: "Rp10.000.000", price: "Rp7.500.000" },
  ],
  features: [
    { title: "Manajemen Tiket Terintegrasi", desc: "Sistem end-to-end mulai penjualan, antrian, QR check-in, hingga laporan — semua dalam satu platform." },
    { title: "Pelaporan Real-Time", desc: "Pantau penjualan secara langsung tanpa menunggu laporan akhir." },
    { title: "Laporan Detail Penjualan", desc: "Laporan komprehensif per transaksi dan hasil penjualan via email." },
    { title: "Akses Multi-Platform", desc: "Dashboard diakses dari desktop maupun mobile kapan saja." },
    { title: "Dedicated Support", desc: "Tim dukungan siap membantu teknis dan operasional event Anda." },
    { title: "QR & Scan System", desc: "Sistem barcode & QR check-in real-time untuk pengunjung event." },
    { title: "Payment Gateway Lengkap", desc: "Mendukung transfer bank, e-wallet, kartu kredit, dan QRIS." },
    { title: "Notifikasi Otomatis", desc: "Konfirmasi tiket dan pengingat event dikirim otomatis ke pembeli." },
    { title: "Kalkulator Biaya", desc: "Simulasi biaya transparan sebelum event dimulai, tanpa kejutan." },
  ],
  partnershipAreas: [
    {
      id: "tourism-culinary",
      no: "01",
      title: "Tourism & Culinary",
      description: "Bangun kehadiran yang membuat cafe, destinasi, dan kuliner bukan hanya terlihat, tetapi mendatangkan kunjungan, transaksi, dan kolaborasi baru.",
      offerings: [
        "Review & Mini Series Experience — cerita episodik yang membuat tempat lebih mudah ditemukan dan dipercaya.",
        "Paket Foto, Video & Reels — produksi aset visual yang siap dipakai untuk promosi dan media sosial.",
        "Social Media Management — strategi konten, penjadwalan, publikasi, dan pengelolaan kanal media sosial.",
        "Business Super App — satu ruang kerja untuk Kasir, QR Menu, Booking & Reservasi, CRM, Loyalty & Membership, Dapur Stock, Gudang, HPP, Resep, Invoice & Faktur, Human Resource, Marketing Tools, Link Bio, Sistem Antrian, serta Pembelian & Supplier.",
        "Voucher Kolaborasi & Promo Bersama — kode promo, bundling, dan program bagi hasil untuk mendorong kunjungan.",
        "Podcast On Location — obrolan dari cafe, destinasi, atau tempat makan untuk membangun awareness dan peluang sponsor.",
        "Creator Visit & Campaign — kunjungan creator yang diarahkan pada jangkauan, engagement, dan kunjungan nyata.",
        "Listing & Discovery Optimization — bantu tempat lebih mudah ditemukan melalui Nempo, Google Maps, dan kanal digital.",
        "Event Cafe & Culinary Experience — konsep acara, aktivasi, ticketing, dan kolaborasi brand untuk menciptakan traffic baru.",
        "Ticketing, Booking & QR Check-in — kelola reservasi, akses masuk, dan data pengunjung dalam satu alur.",
        "Membership & Repeat Visit Program — program loyalitas, benefit member, dan penawaran untuk mendorong kunjungan ulang.",
        "Custom Campaign & Kolaborasi Lainnya — paket promosi yang disusun sesuai target, musim, dan budget bisnis.",
      ],
    },
    {
      id: "hospitality-travel-adventure",
      no: "02",
      title: "Hospitality, Travel & Adventure",
      description: "Bangun pengalaman perjalanan yang lebih mudah direncanakan, dari tempat menginap sampai aktivitas petualangan.",
      offerings: [
        "Profil Penginapan & Venue — tampilkan fasilitas, suasana, lokasi, dan informasi penting agar lebih mudah ditemukan.",
        "Paket Perjalanan & Open Trip — susun itinerary, paket aktivitas, dan penawaran perjalanan yang siap dipromosikan.",
        "Promosi Aktivitas Adventure — bawa aktivitas alam, outdoor, dan pengalaman lokal kepada audiens yang tepat.",
        "Sistem Booking & Reservasi — kelola kamar, venue, trip, aktivitas, jadwal, dan slot kunjungan dalam satu alur.",
        "Business Super App — satu ruang kerja untuk Booking & Reservasi, Event Ticketing, CRM, Loyalty & Membership, Marketing Tools, Company Website, Link Bio, Invoice & Faktur, Human Resource, serta laporan operasional.",
      ],
    },
    {
      id: "news-journalism",
      no: "03",
      title: "News & Journalism",
      description: "Bawa informasi, cerita warga, dan kabar daerah kepada pembaca dengan konteks yang dekat dan bertanggung jawab.",
      offerings: [
        "Liputan & Artikel Berita — sajikan kabar daerah, cerita warga, dan informasi publik dengan konteks yang dekat.",
        "Press Release & Distribusi Media — bantu menyusun rilis berita dan menyebarkannya ke kanal media yang relevan.",
        "Media Partner untuk Event — dukung event melalui publikasi, peliputan, dan penguatan jangkauan audiens.",
        "Dokumentasi Cerita Komunitas — angkat aktivitas, tokoh, dan gerakan komunitas menjadi cerita yang bermakna.",
        "Business Super App — satu ruang kerja untuk Company Website, Marketing Tools, CRM, Link Bio, Human Resource, Invoice & Faktur, serta laporan operasional.",
      ],
    },
    {
      id: "event-entertainment",
      no: "04",
      title: "Event & Entertainment",
      description: "Rancang acara yang lebih siap dipromosikan, dihadiri, dan dikenang oleh komunitas serta audiens yang tepat.",
      offerings: [
        "Konsep & Produksi Event — rancang konsep, rundown, pengalaman pengunjung, dan kebutuhan produksi dari awal sampai selesai.",
        "Promosi & Campaign Event — susun strategi komunikasi, materi promosi, dan campaign untuk menjangkau audiens yang tepat.",
        "Ticketing & QR Check-in — jual tiket, atur kuota, validasi akses, dan pantau data pengunjung secara real-time.",
        "Brand Activation & Sponsorship — hadirkan brand melalui pengalaman, aktivasi, dan kolaborasi sponsor yang relevan.",
        "Business Super App — satu ruang kerja untuk Event Ticketing, Marketing Tools, CRM, Booking & Reservasi, Company Website, Link Bio, Invoice & Faktur, Human Resource, serta laporan event.",
      ],
    },
    {
      id: "digital-product",
      no: "05",
      title: "Digital Product",
      description: "Kembangkan produk digital yang membantu bisnis, tempat, event, dan komunitas bekerja dengan alur yang lebih rapi.",
      offerings: [
        "Website & Landing Page — bangun kehadiran digital yang cepat, jelas, dan sesuai kebutuhan brand.",
        "Sistem Reservasi & Ticketing — kelola jadwal, slot, pemesanan, tiket, dan akses pengguna dalam satu alur.",
        "Dashboard Operasional — pantau transaksi, pelanggan, stok, aktivitas, dan laporan dari satu tempat.",
        "Produk Digital Custom — kembangkan aplikasi web, sistem internal, atau fitur khusus sesuai proses bisnis.",
        "Business Super App — satu ruang kerja modular untuk Company Website, Booking & Reservasi, Event Ticketing, Kasir, QR Menu, CRM, Marketing Tools, Invoice & Faktur, Link Bio, serta laporan operasional.",
      ],
    },
    {
      id: "talent-influencer",
      no: "06",
      title: "Talent & Influencer",
      description: "Hubungkan talent, creator, dan influencer dengan brand atau event yang punya cerita dan audiens yang sesuai.",
      offerings: [
        "Talent Sourcing & Matching — temukan talent, creator, dan influencer yang sesuai dengan karakter brand atau event.",
        "Creator Campaign & Endorsement — rancang campaign, brief, deliverables, dan kolaborasi yang terukur.",
        "Produksi Konten Kolaborasi — kembangkan konsep, produksi foto atau video, hingga aset siap publikasi.",
        "Talent untuk Event & Activation — hadirkan host, performer, creator, atau influencer untuk menghidupkan pengalaman audiens.",
        "Business Super App — satu ruang kerja untuk CRM, Marketing Tools, Link Bio, Company Website, Booking & Reservasi, Event Ticketing, Invoice & Faktur, serta laporan campaign.",
      ],
    },
    {
      id: "merchandise",
      no: "07",
      title: "Merchandise",
      description: "Buat produk fisik yang memperpanjang cerita brand, event, komunitas, atau destinasi ke luar dari momen kolaborasi.",
      offerings: [
        "Konsep & Desain Produk — kembangkan identitas merchandise yang sesuai dengan brand, event, komunitas, atau destinasi.",
        "Paket Merchandise Event — siapkan paket produk untuk peserta, tamu, sponsor, komunitas, dan kebutuhan acara.",
        "Produksi Apparel & Souvenir — produksi kaos, tote bag, aksesori, perlengkapan, dan souvenir dengan kualitas yang terukur.",
        "Packaging & Distribusi — rapikan kemasan, siapkan pengiriman, dan atur distribusi produk ke pelanggan atau venue.",
        "Business Super App — satu ruang kerja untuk Kasir, Gudang, Pembelian & Supplier, CRM, Loyalty & Membership, Marketing Tools, Invoice & Faktur, Link Bio, serta laporan penjualan.",
      ],
    },
  ],
  cta: {
    eyebrow: "Siap Berkolaborasi?",
    titleLine1: "Punya rencana?",
    titleLine2: "Mari ngobrol dulu.",
    description: "Belum punya proposal lengkap tidak apa-apa. Ceritakan tempat atau eventmu, kami bantu menyusun langkah berikutnya.",
    buttonLabel: "Chat via DM Instagram",
    emailText: "Atau email ke hello@nempo.id",
  },
};

function cloneDefaults(): PartnershipContent {
  return JSON.parse(JSON.stringify(DEFAULT_CONTENT)) as PartnershipContent;
}

function normalizeContent(value: unknown): PartnershipContent {
  const incoming = (value && typeof value === "object" && !Array.isArray(value)) ? value as Partial<PartnershipContent> : {};
  const defaults = cloneDefaults();
  const mergePartnershipAreas = (areas: unknown): PartnershipArea[] => {
    if (!Array.isArray(areas) || areas.length === 0) return defaults.partnershipAreas;
    const defaultIds = new Set(defaults.partnershipAreas.map(area => area.id));
    const savedAreas = areas
      .filter((area): area is Record<string, unknown> => Boolean(area) && typeof area === "object" && !Array.isArray(area))
      .map((area, index) => {
        const id = typeof area.id === "string" && area.id.trim() ? area.id.trim() : "";
        const fallback = defaults.partnershipAreas.find(item => item.id === id);
        const offerings = Array.isArray(area.offerings)
          ? area.offerings.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
          : [];
        return {
          id,
          no: typeof area.no === "string" && area.no.trim() ? area.no : fallback?.no ?? String(index + 1).padStart(2, "0"),
          title: typeof area.title === "string" && area.title.trim() ? area.title : fallback?.title ?? "",
          description: typeof area.description === "string" ? area.description : fallback?.description ?? "",
          offerings: offerings.length > 0 ? offerings : fallback?.offerings ?? [],
        };
      })
      .filter(area => area.id && area.title && area.offerings.length > 0);
    const savedById = new Map(savedAreas.map(area => [area.id, area]));
    const mergedDefaults = defaults.partnershipAreas.map(area => savedById.get(area.id) ?? area);
    const customAreas = savedAreas.filter(area => !defaultIds.has(area.id));
    return [...mergedDefaults, ...customAreas];
  };
  return {
    ...defaults,
    ...incoming,
    hero: { ...defaults.hero, ...(incoming.hero ?? {}) },
    cta: { ...defaults.cta, ...(incoming.cta ?? {}) },
    heroImages: Array.isArray(incoming.heroImages) && incoming.heroImages.length ? incoming.heroImages.map(String) : defaults.heroImages,
    heroStats: Array.isArray(incoming.heroStats) && incoming.heroStats.length ? incoming.heroStats : defaults.heroStats,
    themes: Array.isArray(incoming.themes) && incoming.themes.length ? incoming.themes : defaults.themes,
    collabSteps: Array.isArray(incoming.collabSteps) && incoming.collabSteps.length ? incoming.collabSteps : defaults.collabSteps,
    collaborationModels: Array.isArray(incoming.collaborationModels) && incoming.collaborationModels.length ? incoming.collaborationModels : defaults.collaborationModels,
    whyUs: Array.isArray(incoming.whyUs) && incoming.whyUs.length ? incoming.whyUs : defaults.whyUs,
    portfolio: Array.isArray(incoming.portfolio) && incoming.portfolio.length ? incoming.portfolio : defaults.portfolio,
    services: Array.isArray(incoming.services) && incoming.services.length ? incoming.services : defaults.services,
    socialPackages: Array.isArray(incoming.socialPackages) && incoming.socialPackages.length ? incoming.socialPackages : defaults.socialPackages,
    websitePackages: Array.isArray(incoming.websitePackages) && incoming.websitePackages.length ? incoming.websitePackages : defaults.websitePackages,
    packageCards: Array.isArray(incoming.packageCards) && incoming.packageCards.length ? incoming.packageCards : defaults.packageCards,
    features: Array.isArray(incoming.features) && incoming.features.length ? incoming.features : defaults.features,
    partnershipAreas: mergePartnershipAreas(incoming.partnershipAreas),
  };
}

const lines = (value: string[]) => value.join("\n");
const parseLines = (value: string) => value.split("\n").map(v => v.trim()).filter(Boolean);

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 border-b border-gray-100 pb-3">
        <h2 className="font-bold text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500" aria-label="Hapus item">
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

export default function PartnershipPage() {
  const [form, setForm] = useState<PartnershipContent>(cloneDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.partnership.get()
      .then((data: { content?: unknown }) => setForm(normalizeContent(data.content)))
      .catch(() => window.alert("Konten kerja sama belum bisa dimuat. Data awal tetap digunakan."))
      .finally(() => setLoading(false));
  }, []);

  const updateHero = (key: keyof PartnershipContent["hero"], value: string | string[]) =>
    setForm(prev => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
  const updateCta = (key: keyof PartnershipContent["cta"], value: string) =>
    setForm(prev => ({ ...prev, cta: { ...prev.cta, [key]: value } }));

  async function save() {
    setSaving(true);
    try {
      await api.partnership.update(form);
      window.alert("Konten halaman kerja sama berhasil disimpan.");
    } catch (err: any) {
      window.alert("Gagal menyimpan: " + (err?.message ?? "Coba lagi."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="py-20 text-center text-sm text-gray-400">Memuat konten kerja sama...</div>;

  return (
    <div className="space-y-5 pb-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-blue-600" />
            <h1 className="text-xl font-black text-gray-900">Kerja Sama</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Kelola seluruh informasi halaman kerja sama, termasuk foto, portofolio, layanan, dan paket promosi.</p>
        </div>
        <button type="button" onClick={save} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60">
          <Save className="h-4 w-4" /> {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </button>
      </div>

      <Section title="Hero halaman" description="Teks pembuka, CTA, caption collage, dan label strip informasi di bagian atas halaman.">
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Field label="Eyebrow"><input className={inputCls} value={form.hero.eyebrow} onChange={e => updateHero("eyebrow", e.target.value)} /></Field>
          <Field label="Label CTA utama"><input className={inputCls} value={form.hero.primaryLabel} onChange={e => updateHero("primaryLabel", e.target.value)} /></Field>
          <Field label="Link CTA utama"><input className={inputCls} value={form.hero.primaryHref} onChange={e => updateHero("primaryHref", e.target.value)} placeholder="https://..." /></Field>
          <Field label="Judul baris pertama"><input className={inputCls} value={form.hero.titleLine1} onChange={e => updateHero("titleLine1", e.target.value)} /></Field>
          <Field label="Label link sekunder"><input className={inputCls} value={form.hero.secondaryLabel} onChange={e => updateHero("secondaryLabel", e.target.value)} /></Field>
          <Field label="Link sekunder"><input className={inputCls} value={form.hero.secondaryHref} onChange={e => updateHero("secondaryHref", e.target.value)} placeholder="#cara-kolaborasi atau /halaman" /></Field>
          <Field label="Judul baris kedua"><input className={inputCls} value={form.hero.titleLine2} onChange={e => updateHero("titleLine2", e.target.value)} /></Field>
          <Field label="Stat kecil"><input className={inputCls} value={form.hero.smallStatValue} onChange={e => updateHero("smallStatValue", e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="Deskripsi hero"><textarea className={textareaCls} rows={3} value={form.hero.description} onChange={e => updateHero("description", e.target.value)} /></Field></div>
          <Field label="Eyebrow caption foto"><input className={inputCls} value={form.hero.captionEyebrow} onChange={e => updateHero("captionEyebrow", e.target.value)} /></Field>
          <Field label="Label stat kecil"><input className={inputCls} value={form.hero.smallStatLabel} onChange={e => updateHero("smallStatLabel", e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="Judul caption foto"><input className={inputCls} value={form.hero.captionTitle} onChange={e => updateHero("captionTitle", e.target.value)} /></Field></div>
          <Field label="Catatan foto"><input className={inputCls} value={form.hero.photoNote} onChange={e => updateHero("photoNote", e.target.value)} /></Field>
          <Field label="Label strip bawah"><input className={inputCls} value={form.hero.bottomLabel} onChange={e => updateHero("bottomLabel", e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="Isi strip bawah (satu item per baris)"><textarea className={textareaCls} rows={3} value={lines(form.hero.bottomItems)} onChange={e => updateHero("bottomItems", parseLines(e.target.value))} /></Field></div>
        </div>
      </Section>

      <Section title="Foto collage hero" description="Unggah sampai 8 foto. Foto akan diputar dalam collage tiga kolom di desktop dan mobile.">
        <MultiImageUpload value={form.heroImages} onChange={heroImages => setForm(prev => ({ ...prev, heroImages }))} max={8} />
      </Section>

      <Section title="Statistik hero" description="Empat angka ringkas yang tampil di halaman kerja sama.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {form.heroStats.map((stat, index) => (
            <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-gray-400">Stat {index + 1}</span><RemoveButton onClick={() => setForm(p => ({ ...p, heroStats: p.heroStats.filter((_, i) => i !== index) }))} /></div>
              <input className={inputCls + " mb-2"} value={stat.value} placeholder="500+" onChange={e => setForm(p => ({ ...p, heroStats: p.heroStats.map((x, i) => i === index ? { ...x, value: e.target.value } : x) }))} />
              <input className={inputCls} value={stat.label} placeholder="Event Dikelola" onChange={e => setForm(p => ({ ...p, heroStats: p.heroStats.map((x, i) => i === index ? { ...x, label: e.target.value } : x) }))} />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setForm(p => ({ ...p, heroStats: [...p.heroStats, { value: "", label: "" }] }))} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><Plus className="h-3.5 w-3.5" /> Tambah statistik</button>
      </Section>

      <Section title="Tema event" description="Kartu inspirasi tema yang tampil di bagian awal halaman.">
        <div className="grid gap-3 sm:grid-cols-2">
          {form.themes.map((theme, index) => (
            <div key={index} className="rounded-xl border border-gray-100 p-3">
              <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-gray-400">Tema {index + 1}</span><RemoveButton onClick={() => setForm(p => ({ ...p, themes: p.themes.filter((_, i) => i !== index) }))} /></div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <input className={inputCls} value={theme.title} placeholder="Nama tema" onChange={e => setForm(p => ({ ...p, themes: p.themes.map((x, i) => i === index ? { ...x, title: e.target.value } : x) }))} />
                <input type="color" className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 bg-white p-1" value={theme.color} onChange={e => setForm(p => ({ ...p, themes: p.themes.map((x, i) => i === index ? { ...x, color: e.target.value } : x) }))} />
              </div>
              <textarea className={textareaCls + " mt-2"} rows={2} value={theme.desc} placeholder="Deskripsi singkat" onChange={e => setForm(p => ({ ...p, themes: p.themes.map((x, i) => i === index ? { ...x, desc: e.target.value } : x) }))} />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setForm(p => ({ ...p, themes: [...p.themes, { title: "", desc: "", color: "#0194f3" }] }))} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><Plus className="h-3.5 w-3.5" /> Tambah tema</button>
      </Section>

      <Section title="Cara kolaborasi & alasan memilih Nempo">
        <div className="grid gap-3 lg:grid-cols-3">
          {form.collabSteps.map((step, index) => (
            <div key={index} className="rounded-xl border border-gray-100 p-3">
              <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-gray-400">Langkah {index + 1}</span><RemoveButton onClick={() => setForm(p => ({ ...p, collabSteps: p.collabSteps.filter((_, i) => i !== index) }))} /></div>
              <div className="grid grid-cols-[70px_1fr] gap-2"><input className={inputCls} value={step.no} onChange={e => setForm(p => ({ ...p, collabSteps: p.collabSteps.map((x, i) => i === index ? { ...x, no: e.target.value } : x) }))} /><input className={inputCls} value={step.title} placeholder="Judul" onChange={e => setForm(p => ({ ...p, collabSteps: p.collabSteps.map((x, i) => i === index ? { ...x, title: e.target.value } : x) }))} /></div>
              <textarea className={textareaCls + " mt-2"} rows={2} value={step.desc} placeholder="Deskripsi" onChange={e => setForm(p => ({ ...p, collabSteps: p.collabSteps.map((x, i) => i === index ? { ...x, desc: e.target.value } : x) }))} />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setForm(p => ({ ...p, collabSteps: [...p.collabSteps, { no: String(p.collabSteps.length + 1).padStart(2, "0"), title: "", desc: "", color: "#0194f3" }] }))} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><Plus className="h-3.5 w-3.5" /> Tambah langkah</button>
        <div className="my-6 border-t border-gray-100 pt-5">
          <h3 className="text-sm font-bold text-gray-700">Sistem kerja sama</h3>
          <p className="mt-1 text-xs text-gray-500">Jelaskan pilihan fee event dan skema persentase sharing yang bisa dibicarakan dengan calon mitra.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {form.collaborationModels.map((model, index) => (
              <div key={index} className="rounded-xl border border-gray-100 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">Model {index + 1}</span>
                  <RemoveButton onClick={() => setForm(p => ({ ...p, collaborationModels: p.collaborationModels.filter((_, i) => i !== index) }))} />
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <input className={inputCls} value={model.label} placeholder="Model 01" onChange={e => setForm(p => ({ ...p, collaborationModels: p.collaborationModels.map((x, i) => i === index ? { ...x, label: e.target.value } : x) }))} />
                  <input className={inputCls} value={model.title} placeholder="Fee Event / % Sharing" onChange={e => setForm(p => ({ ...p, collaborationModels: p.collaborationModels.map((x, i) => i === index ? { ...x, title: e.target.value } : x) }))} />
                </div>
                <textarea className={textareaCls + " mt-2"} rows={3} value={model.desc} placeholder="Penjelasan model kerja sama" onChange={e => setForm(p => ({ ...p, collaborationModels: p.collaborationModels.map((x, i) => i === index ? { ...x, desc: e.target.value } : x) }))} />
                <input className={inputCls + " mt-2"} value={model.note} placeholder="Cocok untuk..." onChange={e => setForm(p => ({ ...p, collaborationModels: p.collaborationModels.map((x, i) => i === index ? { ...x, note: e.target.value } : x) }))} />
                <textarea className={textareaCls + " mt-2"} rows={3} value={lines(model.points)} placeholder="Satu poin per baris" onChange={e => setForm(p => ({ ...p, collaborationModels: p.collaborationModels.map((x, i) => i === index ? { ...x, points: parseLines(e.target.value) } : x) }))} />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setForm(p => ({ ...p, collaborationModels: [...p.collaborationModels, { label: `Model 0${p.collaborationModels.length + 1}`, title: "", desc: "", note: "", points: [] }] }))} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><Plus className="h-3.5 w-3.5" /> Tambah model kerja sama</button>
        </div>
        <div className="my-6 border-t border-gray-100" />
        <div className="grid gap-3 sm:grid-cols-2">
          {form.whyUs.map((item, index) => (
            <div key={index} className="rounded-xl border border-gray-100 p-3">
              <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-gray-400">Alasan {index + 1}</span><RemoveButton onClick={() => setForm(p => ({ ...p, whyUs: p.whyUs.filter((_, i) => i !== index) }))} /></div>
              <input className={inputCls} value={item.title} placeholder="Judul" onChange={e => setForm(p => ({ ...p, whyUs: p.whyUs.map((x, i) => i === index ? { ...x, title: e.target.value } : x) }))} />
              <textarea className={textareaCls + " mt-2"} rows={2} value={item.desc} placeholder="Deskripsi" onChange={e => setForm(p => ({ ...p, whyUs: p.whyUs.map((x, i) => i === index ? { ...x, desc: e.target.value } : x) }))} />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setForm(p => ({ ...p, whyUs: [...p.whyUs, { title: "", desc: "" }] }))} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><Plus className="h-3.5 w-3.5" /> Tambah alasan</button>
      </Section>

      <Section title="Portofolio kerja sama" description="Foto, nama, lokasi, layanan, dan hasil singkat setiap kerja sama yang ditampilkan.">
        <div className="space-y-4">
          {form.portfolio.map((item, index) => (
            <div key={index} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between"><span className="text-sm font-bold text-gray-700">Portofolio {index + 1}</span><RemoveButton onClick={() => setForm(p => ({ ...p, portfolio: p.portfolio.filter((_, i) => i !== index) }))} /></div>
              <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
                <div><ImageUpload value={item.image} onChange={image => setForm(p => ({ ...p, portfolio: p.portfolio.map((x, i) => i === index ? { ...x, image } : x) }))} /><p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400"><ImageIcon className="h-3 w-3" /> Foto portofolio</p></div>
                <div className="grid gap-x-3 sm:grid-cols-2">
                  <Field label="Nama"><input className={inputCls} value={item.title} onChange={e => setForm(p => ({ ...p, portfolio: p.portfolio.map((x, i) => i === index ? { ...x, title: e.target.value } : x) }))} /></Field>
                  <Field label="Kategori"><input className={inputCls} value={item.category} onChange={e => setForm(p => ({ ...p, portfolio: p.portfolio.map((x, i) => i === index ? { ...x, category: e.target.value } : x) }))} /></Field>
                  <Field label="Lokasi"><input className={inputCls} value={item.location} onChange={e => setForm(p => ({ ...p, portfolio: p.portfolio.map((x, i) => i === index ? { ...x, location: e.target.value } : x) }))} /></Field>
                  <Field label="Layanan"><input className={inputCls} value={item.services} onChange={e => setForm(p => ({ ...p, portfolio: p.portfolio.map((x, i) => i === index ? { ...x, services: e.target.value } : x) }))} /></Field>
                  <div className="sm:col-span-2"><Field label="Hasil singkat"><textarea className={textareaCls} rows={2} value={item.result} onChange={e => setForm(p => ({ ...p, portfolio: p.portfolio.map((x, i) => i === index ? { ...x, result: e.target.value } : x) }))} /></Field></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setForm(p => ({ ...p, portfolio: [...p.portfolio, { title: "", category: "", location: "", image: "", services: "", result: "" }] }))} className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><Plus className="h-3.5 w-3.5" /> Tambah portofolio</button>
      </Section>

      <Section title="Layanan Nempo" description="Isi layanan dipisahkan per baris. Tiga item pertama tampil langsung, sisanya diringkas.">
        <div className="grid gap-3 sm:grid-cols-2">
          {form.services.map((service, index) => (
            <div key={index} className="rounded-xl border border-gray-100 p-3">
              <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-gray-400">Layanan {service.no}</span><RemoveButton onClick={() => setForm(p => ({ ...p, services: p.services.filter((_, i) => i !== index) }))} /></div>
              <div className="grid grid-cols-[70px_1fr] gap-2"><input className={inputCls} value={service.no} onChange={e => setForm(p => ({ ...p, services: p.services.map((x, i) => i === index ? { ...x, no: e.target.value } : x) }))} /><input className={inputCls} value={service.title} placeholder="Nama layanan" onChange={e => setForm(p => ({ ...p, services: p.services.map((x, i) => i === index ? { ...x, title: e.target.value } : x) }))} /></div>
              <textarea className={textareaCls + " mt-2"} rows={4} value={lines(service.items)} placeholder="Satu item per baris" onChange={e => setForm(p => ({ ...p, services: p.services.map((x, i) => i === index ? { ...x, items: parseLines(e.target.value) } : x) }))} />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setForm(p => ({ ...p, services: [...p.services, { no: String(p.services.length + 1).padStart(2, "0"), title: "", items: [] }] }))} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><Plus className="h-3.5 w-3.5" /> Tambah layanan</button>
      </Section>

      <Section title="Bidang kerja sama" description="Kategori utama yang tampil sebagai tab pada bagian awal halaman publik.">
        <div className="space-y-3">
          {form.partnershipAreas.map((area, index) => (
            <div key={area.id || index} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">Bidang {index + 1}</span>
                <RemoveButton onClick={() => setForm(p => ({ ...p, partnershipAreas: p.partnershipAreas.filter((_, i) => i !== index) }))} />
              </div>
              <div className="grid gap-3 sm:grid-cols-[80px_1fr_1fr]">
                <Field label="Nomor">
                  <input className={inputCls} value={area.no} placeholder="01" onChange={e => setForm(p => ({ ...p, partnershipAreas: p.partnershipAreas.map((x, i) => i === index ? { ...x, no: e.target.value } : x) }))} />
                </Field>
                <Field label="ID unik">
                  <input className={inputCls} value={area.id} placeholder="tourism-culinary" onChange={e => setForm(p => ({ ...p, partnershipAreas: p.partnershipAreas.map((x, i) => i === index ? { ...x, id: e.target.value } : x) }))} />
                </Field>
                <Field label="Judul bidang">
                  <input className={inputCls} value={area.title} placeholder="Tourism & Culinary" onChange={e => setForm(p => ({ ...p, partnershipAreas: p.partnershipAreas.map((x, i) => i === index ? { ...x, title: e.target.value } : x) }))} />
                </Field>
              </div>
              <Field label="Deskripsi">
                <textarea className={textareaCls} rows={2} value={area.description} placeholder="Jelaskan bentuk kolaborasi di bidang ini." onChange={e => setForm(p => ({ ...p, partnershipAreas: p.partnershipAreas.map((x, i) => i === index ? { ...x, description: e.target.value } : x) }))} />
              </Field>
              <Field label="Layanan yang tersedia (satu item per baris)">
                <textarea className={textareaCls} rows={4} value={lines(area.offerings)} placeholder={"Profil destinasi atau tempat makan\nKonten editorial dan foto"} onChange={e => setForm(p => ({ ...p, partnershipAreas: p.partnershipAreas.map((x, i) => i === index ? { ...x, offerings: parseLines(e.target.value) } : x) }))} />
              </Field>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setForm(p => ({ ...p, partnershipAreas: [...p.partnershipAreas, { id: `area-${p.partnershipAreas.length + 1}`, no: String(p.partnershipAreas.length + 1).padStart(2, "0"), title: "", description: "", offerings: [] }] }))} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><Plus className="h-3.5 w-3.5" /> Tambah bidang kerja sama</button>
      </Section>

      <Section title="Paket promosi & fitur platform">
        <h3 className="mb-3 text-sm font-bold text-gray-700">Social Media</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {form.socialPackages.map((pkg, index) => (
            <div key={index} className="rounded-xl border border-gray-100 p-3">
              <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-gray-400">Paket {index + 1}</span><RemoveButton onClick={() => setForm(p => ({ ...p, socialPackages: p.socialPackages.filter((_, i) => i !== index) }))} /></div>
              <div className="grid grid-cols-2 gap-2"><input className={inputCls} value={pkg.name} placeholder="Nama paket" onChange={e => setForm(p => ({ ...p, socialPackages: p.socialPackages.map((x, i) => i === index ? { ...x, name: e.target.value } : x) }))} /><input className={inputCls} value={pkg.price} placeholder="Harga" onChange={e => setForm(p => ({ ...p, socialPackages: p.socialPackages.map((x, i) => i === index ? { ...x, price: e.target.value } : x) }))} /></div>
              <textarea className={textareaCls + " mt-2"} rows={3} value={lines(pkg.features)} placeholder="Fitur, satu per baris" onChange={e => setForm(p => ({ ...p, socialPackages: p.socialPackages.map((x, i) => i === index ? { ...x, features: parseLines(e.target.value) } : x) }))} />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setForm(p => ({ ...p, socialPackages: [...p.socialPackages, { name: "", price: "", features: [] }] }))} className="my-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><Plus className="h-3.5 w-3.5" /> Tambah paket social media</button>
        <h3 className="mb-3 mt-3 border-t border-gray-100 pt-5 text-sm font-bold text-gray-700">Website</h3>
        <div className="grid gap-3 lg:grid-cols-3">
          {form.websitePackages.map((pkg, index) => (
            <div key={index} className="rounded-xl border border-gray-100 p-3">
              <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-gray-400">Paket {index + 1}</span><RemoveButton onClick={() => setForm(p => ({ ...p, websitePackages: p.websitePackages.filter((_, i) => i !== index) }))} /></div>
              <input className={inputCls + " mb-2"} value={pkg.name} placeholder="Nama paket" onChange={e => setForm(p => ({ ...p, websitePackages: p.websitePackages.map((x, i) => i === index ? { ...x, name: e.target.value } : x) }))} />
              {pkg.prices.slice(0, 2).map((price, priceIndex) => <div key={priceIndex} className="mb-2 grid grid-cols-2 gap-2"><input className={inputCls} value={price.duration} placeholder="Durasi" onChange={e => setForm(p => ({ ...p, websitePackages: p.websitePackages.map((x, i) => i === index ? { ...x, prices: x.prices.map((y, j) => j === priceIndex ? { ...y, duration: e.target.value } : y) } : x) }))} /><input className={inputCls} value={price.price} placeholder="Harga" onChange={e => setForm(p => ({ ...p, websitePackages: p.websitePackages.map((x, i) => i === index ? { ...x, prices: x.prices.map((y, j) => j === priceIndex ? { ...y, price: e.target.value } : y) } : x) }))} /></div>)}
              <textarea className={textareaCls} rows={3} value={lines(pkg.features)} placeholder="Fitur, satu per baris" onChange={e => setForm(p => ({ ...p, websitePackages: p.websitePackages.map((x, i) => i === index ? { ...x, features: parseLines(e.target.value) } : x) }))} />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setForm(p => ({ ...p, websitePackages: [...p.websitePackages, { name: "", prices: [{ duration: "", price: "" }, { duration: "", price: "" }], features: [] }] }))} className="my-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><Plus className="h-3.5 w-3.5" /> Tambah paket website</button>
        <h3 className="mb-3 mt-3 border-t border-gray-100 pt-5 text-sm font-bold text-gray-700">Kartu paket</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {form.packageCards.map((pkg, index) => (
            <div key={index} className="rounded-xl border border-gray-100 p-3">
              <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-gray-400">Kartu {index + 1}</span><RemoveButton onClick={() => setForm(p => ({ ...p, packageCards: p.packageCards.filter((_, i) => i !== index) }))} /></div>
              <input className={inputCls + " mb-2"} value={pkg.name} placeholder="Nama kartu" onChange={e => setForm(p => ({ ...p, packageCards: p.packageCards.map((x, i) => i === index ? { ...x, name: e.target.value } : x) }))} />
              <input className={inputCls + " mb-2"} value={pkg.originalPrice} placeholder="Harga coret" onChange={e => setForm(p => ({ ...p, packageCards: p.packageCards.map((x, i) => i === index ? { ...x, originalPrice: e.target.value } : x) }))} />
              <input className={inputCls} value={pkg.price} placeholder="Harga promo" onChange={e => setForm(p => ({ ...p, packageCards: p.packageCards.map((x, i) => i === index ? { ...x, price: e.target.value } : x) }))} />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setForm(p => ({ ...p, packageCards: [...p.packageCards, { name: "", originalPrice: "", price: "" }] }))} className="my-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><Plus className="h-3.5 w-3.5" /> Tambah kartu paket</button>
        <h3 className="mb-3 mt-3 border-t border-gray-100 pt-5 text-sm font-bold text-gray-700">Fitur platform</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {form.features.map((feature, index) => (
            <div key={index} className="rounded-xl border border-gray-100 p-3">
              <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-gray-400">Fitur {index + 1}</span><RemoveButton onClick={() => setForm(p => ({ ...p, features: p.features.filter((_, i) => i !== index) }))} /></div>
              <input className={inputCls} value={feature.title} placeholder="Judul fitur" onChange={e => setForm(p => ({ ...p, features: p.features.map((x, i) => i === index ? { ...x, title: e.target.value } : x) }))} />
              <textarea className={textareaCls + " mt-2"} rows={3} value={feature.desc} placeholder="Deskripsi fitur" onChange={e => setForm(p => ({ ...p, features: p.features.map((x, i) => i === index ? { ...x, desc: e.target.value } : x) }))} />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setForm(p => ({ ...p, features: [...p.features, { title: "", desc: "" }] }))} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><Plus className="h-3.5 w-3.5" /> Tambah fitur</button>
      </Section>

      <Section title="CTA penutup">
        <div className="grid gap-x-4 sm:grid-cols-2">
          {(["eyebrow", "titleLine1", "titleLine2", "buttonLabel", "emailText"] as const).map(key => (
            <Field key={key} label={{ eyebrow: "Label CTA", titleLine1: "Judul baris pertama", titleLine2: "Judul baris kedua", buttonLabel: "Label tombol", emailText: "Teks email" }[key]}>
              <input className={inputCls} value={form.cta[key]} onChange={e => updateCta(key, e.target.value)} />
            </Field>
          ))}
          <div className="sm:col-span-2"><Field label="Deskripsi CTA"><textarea className={textareaCls} rows={3} value={form.cta.description} onChange={e => updateCta("description", e.target.value)} /></Field></div>
        </div>
      </Section>

      <div className="flex justify-end pt-1">
        <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60">
          <Save className="h-4 w-4" /> {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </button>
      </div>
    </div>
  );
}