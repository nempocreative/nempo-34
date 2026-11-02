import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import "./price-list.css";
import { NEMPO_INSTAGRAM_HANDLE, NEMPO_INSTAGRAM_URL, NEMPO_CONSULT_URL } from "@/lib/contact";
import {
  MessageCircle, Instagram, Video,
  BarChart3, FileText, Send, Headset, Ticket, Award, Wallet,
  QrCode, Calculator, LayoutTemplate, Megaphone,
  Monitor, Newspaper, Mountain, Users, Briefcase,
  Globe, Handshake, MapPin, Zap, CheckCircle, ArrowRight, ArrowUpRight,
  ChevronLeft, ChevronRight, Shield, Clock, TrendingUp, Music2, Paintbrush, Mic2,
} from "lucide-react";
import adventureHeroImage from "@/assets/5c92c12744ccc725fce2d971df3dd4b4_1789407665394.jpg";
import stayHeroImage from "@/assets/4a995825d019114708a042b06256a9f9_1789407625253.jpg";
import eventHeroImage from "@/assets/6999fa21d5935dd58a0c1c2e375212a1_1789407991954.jpg";
import natureHeroImage from "@/assets/e51616056f69ad317e6c3a4e960c52f4_1789408035923.jpg";
import culinaryHeroImage from "@/assets/c225d4fb4ba1595ae8e06fe3c5abeb05_1789408460390.jpg";
import venueHeroImage from "@/assets/36b2a2caf7f2749ca53bb3190322259d_1789408390264.jpg";
import collaborationHeroImage from "@/assets/076ae51bf23030e0b8cfb7975b94609a_1789408708055.jpg";
import kalaMudaHeroImage from "@/assets/94d218d05080a6554bc7214283cb8a88_1789408730013.jpg";
import digiNempoHeroImage from "@/assets/d8bb582f2f075b716c1d0d1dc01bb672_1789408801865.jpg";
import collageMountainImage from "@/assets/generated_images/collage-mountain-view.jpg";
import collageFoodImage from "@/assets/generated_images/collage-local-food.jpg";
import collageCommunityImage from "@/assets/generated_images/collage-community.jpg";

/* ─────────────────────────────────────────────────────────────────── */
/*  DATA                                                               */
/* ─────────────────────────────────────────────────────────────────── */

const HOME_HERO_IMAGES = [
  natureHeroImage,
  culinaryHeroImage,
  eventHeroImage,
  stayHeroImage,
  adventureHeroImage,
  venueHeroImage,
  collaborationHeroImage,
  kalaMudaHeroImage,
  digiNempoHeroImage,
  collageMountainImage,
  collageFoodImage,
  collageCommunityImage,
];

const HERO_COLLAGE_TRACKS = [
  HOME_HERO_IMAGES.slice(0, 4),
  HOME_HERO_IMAGES.slice(4, 8),
  HOME_HERO_IMAGES.slice(8, 12),
];

const SERVICES = [
  { no: "01", title: "Penjualan Tiket",             color: "#0194f3", from: "#0194f3", to: "#0052b0", icon: Ticket,    items: ["Ticketing Event", "Ticketing Wisata", "Registrasi Seminar", "QR Check-In System", "Dashboard Penjualan", "Payment Gateway", "Laporan Pengunjung"] },
  { no: "02", title: "Event Organizer",             color: "#7c3aed", from: "#7c3aed", to: "#5b21b6", icon: Briefcase, items: ["Festival & Konser", "Sport Event", "Touring & Gathering", "Pameran & Expo", "Community Event", "Corporate Event", "Brand Activation"] },
  { no: "03", title: "Sistem Digital",              color: "#0891b2", from: "#0891b2", to: "#0e7490", icon: Monitor,   items: ["Website Development", "Sistem Reservasi", "Sistem Ticketing", "Membership System", "Dashboard Monitoring", "Aplikasi Web", "Custom Software"] },
  { no: "04", title: "Media & Promosi",             color: "#059669", from: "#059669", to: "#047857", icon: Newspaper, items: ["Publikasi Media", "Press Release", "Media Partner", "Liputan Event", "Media Exposure", "Digital Publication"] },
  { no: "05", title: "Destinasi Wisata",            color: "#16a34a", from: "#16a34a", to: "#15803d", icon: Mountain,  items: ["Pengelolaan Tiket Wisata", "Pemasaran Destinasi", "Paket Wisata", "Event Wisata", "Visitor Experience", "Digitalisasi Wisata"] },
  { no: "06", title: "Sponsorship",                color: "#9333ea", from: "#9333ea", to: "#7e22ce", icon: Handshake, items: ["Pencarian Sponsor", "Sponsorship Management", "Brand Matching", "Proposal Sponsorship", "Aktivasi Sponsor", "Partnership Program"] },
  { no: "07", title: "Komunitas",                  color: "#0284c7", from: "#0284c7", to: "#0369a1", icon: Users,     items: ["Pengembangan Komunitas", "Program Member", "Kompetisi", "Workshop", "Gathering", "Networking Event"] },
  { no: "08", title: "Pengembangan Bisnis",         color: "#475569", from: "#475569", to: "#334155", icon: Briefcase, items: ["Konsultasi Bisnis", "Strategi Pemasaran", "Digital Transformation", "Revenue Optimization", "Project Management", "Business Collaboration"] },
];

const SERVICE_SUMMARIES = [
  "Buat akses masuk dan data pengunjung event lebih teratur.",
  "Dari konsep sampai hari pelaksanaan, satu tim ikut merapikan detailnya.",
  "Bangun sistem yang membantu operasional berjalan lebih ringan.",
  "Bawa cerita event, tempat, dan brand ke audiens yang tepat.",
  "Jadikan destinasi lebih mudah ditemukan dan dinikmati pengunjung.",
  "Temukan bentuk kolaborasi yang relevan untuk brand dan komunitas.",
  "Hidupkan ruang bertemu yang membuat komunitas terus tumbuh.",
  "Rancang langkah bisnis yang lebih terarah dari kebutuhan nyata.",
];

const HERO_STATS = [
  { val: "500+", label: "Event Dikelola",   icon: Ticket },
  { val: "47K+", label: "Pengguna Aktif",   icon: Users },
  { val: "38",   label: "Kecamatan",        icon: MapPin },
  { val: "10+",  label: "Layanan",          icon: LayoutTemplate },
];

const COLLAB_STEPS = [
  { no: "01", title: "Ceritakan idemu", desc: "Bagikan konsep event, lokasi, dan target audiensmu.", icon: MessageCircle, color: "#0194f3" },
  { no: "02", title: "Rancang bersama", desc: "Nempo bantu konsep, promosi, ticketing, dan operasional.", icon: Handshake, color: "#0b8fbe" },
  { no: "03", title: "Event makin dikenal", desc: "Jangkau lebih banyak penjelajah dan ukur hasilnya.", icon: TrendingUp, color: "#0052b0" },
];

const EVENT_THEMES = [
  { title: "Music DJ Night", desc: "DJ set, lighting, dan dance floor.", icon: Music2, color: "#3fa9f5" },
  { title: "Glow in the Dark", desc: "Face painting neon yang unik dan seru.", icon: Paintbrush, color: "#e57552" },
  { title: "Live Acoustic", desc: "Musik santai untuk suasana yang hangat.", icon: Music2, color: "#d99b7c" },
  { title: "Sunset Picnic", desc: "Piknik sore dengan view dan aktivitas seru.", icon: Mountain, color: "#c8834d" },
  { title: "Creative Workshop", desc: "Kelas kreatif, craft, dan aktivitas hands-on.", icon: Paintbrush, color: "#e8b54f" },
  { title: "Bazar Kuliner", desc: "Jelajah rasa, tenant lokal, dan live cooking.", icon: Ticket, color: "#d45f50" },
  { title: "Fun Run & Sport Day", desc: "Aktivitas sehat untuk komunitas dan brand.", icon: TrendingUp, color: "#5b9a78" },
  { title: "Community Gathering", desc: "Bangun koneksi lewat games dan networking.", icon: Users, color: "#6489a5" },
  { title: "Festival Lokal", desc: "Rayakan cerita lokal dengan panggung dan pasar kreatif.", icon: Megaphone, color: "#a86e81" },
  { title: "Kids & Family Day", desc: "Keseruan ramah keluarga untuk semua usia.", icon: Ticket, color: "#4d9c91" },
  { title: "Open Mic Night", desc: "Panggung terbuka untuk musik, cerita, dan talenta lokal.", icon: Mic2, color: "#8b78b4" },
  { title: "Brand Activation", desc: "Bikin brand hadir lebih dekat lewat pengalaman yang berkesan.", icon: Megaphone, color: "#477f91" },
];
function EventThemeCard({ theme }: { theme: typeof EVENT_THEMES[number] }) {
  const ThemeIcon = theme.icon;
  return (
    <div
      className="price-list-theme-card relative flex min-h-[155px] min-w-0 flex-col overflow-hidden rounded-xl border bg-white p-4 text-gray-900 sm:p-5"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f1f5f4] text-[#0b79b5]">
          <ThemeIcon className="h-4 w-4" />
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-300">Format event</span>
      </div>
      <div className="mt-auto">
        <div className="mb-3 flex items-center justify-between">
          <span className="h-px w-10 bg-[#0b79b5]" />
        </div>
        <p className="text-sm font-bold leading-tight sm:text-base">{theme.title}</p>
        <p className="mt-1.5 max-w-xs text-[10px] leading-[1.45] text-gray-500 sm:text-xs">{theme.desc}</p>
      </div>
    </div>
  );
}

const WHY_US = [
  { icon: Shield,     title: "Bisa diandalkan",       desc: "Alur tiket dan event yang jelas, dengan tim yang ikut menjaga detailnya." },
  { icon: TrendingUp, title: "Lebih mudah ditemukan", desc: "Bawa cerita tempat dan eventmu ke orang-orang yang memang sedang mencari." },
  { icon: Clock,      title: "Dibantu sampai selesai", desc: "Bukan cuma tayang. Tim Nempo ikut menjawab dan membantu saat dibutuhkan." },
  { icon: Globe,      title: "Sederhana dipakai",     desc: "Pantau kebutuhan promosi dan ticketing dari perangkat yang biasa kamu pakai." },
];

const PORTFOLIO_ITEMS = [
  {
    title: "House of Maru",
    category: "Mitra tempat",
    location: "Garut",
    image: "images/hero/dpakar.webp",
    services: "Publikasi · Promosi digital",
    result: "Cerita tempat dikenalkan sebagai bagian dari pilihan lokal yang bisa ditemukan di Nempo Organizer.",
  },
  {
    title: "Kala Muda",
    category: "Mitra tempat",
    location: "Garut",
    image: "images/hero/sate-maranggi.webp",
    services: "Publikasi · Promosi digital",
    result: "Membawa cerita tempat dan suasananya lebih dekat kepada penjelajah lokal.",
  },
  {
    title: "Biang Coffee",
    category: "Mitra tempat",
    location: "Garut",
    image: "images/hero/kolaborasi.webp",
    services: "Publikasi · Promosi digital",
    result: "Tempat ngopi lokal masuk ke dalam cerita dan rekomendasi yang dibawa Nempo.",
  },
  {
    title: "Kopi Jaya",
    category: "Mitra tempat",
    location: "Garut",
    image: "images/hero/papandayan.webp",
    services: "Publikasi · Promosi digital",
    result: "Membantu tempat lokal tampil lebih mudah ditemukan oleh audiens Nempo.",
  },
  {
    title: "Domusa",
    category: "Mitra bisnis",
    location: "Garut",
    image: "images/hero/gunung-guntur.webp",
    services: "Kolaborasi brand · Publikasi",
    result: "Brand mendapat ruang untuk hadir di dalam ekosistem cerita lokal Nempo.",
  },
  {
    title: "MAXI.ID COM",
    category: "Mitra brand",
    location: "Garut",
    image: "images/hero/karnaval.webp",
    services: "Kolaborasi brand · Promosi",
    result: "Kolaborasi brand ditempatkan dekat dengan komunitas, event, dan aktivitas lokal.",
  },
  {
    title: "Temu Tarung",
    category: "Event olahraga",
    location: "Garut",
    image: "images/hero/kolaborasi.webp",
    services: "Ticketing event · Promosi",
    result: "Event olahraga hadir dengan informasi acara dan akses ticketing yang lebih terarah.",
  },
  {
    title: "Situ Bagendit",
    category: "Destinasi wisata",
    location: "Garut",
    image: "images/hero/papandayan.webp",
    services: "Publikasi destinasi · Promosi",
    result: "Cerita destinasi lokal dibawa lebih dekat kepada orang yang sedang mencari pengalaman di Garut.",
  },
];

const TABS = ["Social Media", "Website", "Package"] as const;
type Tab = typeof TABS[number];

interface PricePackage { name: string; icon: React.ReactNode; price: string; accent: string; features: string[] }
interface WebsitePackage { name: string; icon: React.ReactNode; prices: { duration: string; price: string }[]; features: string[] }

const WEBSITE_PACKAGES: WebsitePackage[] = [
  { name: "Dedicated Hero Banner", icon: <LayoutTemplate className="h-4 w-4" />,
    prices: [{ duration: "2 Minggu", price: "Rp2.500.000" }, { duration: "1 Bulan", price: "Rp4.000.000" }],
    features: ["Direct link detail Nempo Organizer"] },
  { name: "Campaign Banner", icon: <Megaphone className="h-4 w-4" />,
    prices: [{ duration: "2 Minggu", price: "Rp750.000" }, { duration: "1 Bulan", price: "Rp1.500.000" }],
    features: ["Direct event detail Nempo Organizer", "Materials campaign from Nempo Organizer"] },
  { name: "Event Recommendation", icon: <Megaphone className="h-4 w-4" />,
    prices: [{ duration: "2 Minggu", price: "Rp250.000" }, { duration: "1 Bulan", price: "Rp750.000" }],
    features: ["Direct event detail Nempo Organizer", "Position after hero banner section"] },
];

interface PackageCard { name: string; icon: React.ReactNode; originalPrice: string; price: string }
const PACKAGE_CARDS: PackageCard[] = [
  { name: "Website 2 Weeks", icon: <LayoutTemplate className="h-4 w-4" />, originalPrice: "Rp5.000.000", price: "Rp4.250.000" },
  { name: "Website 1 Month", icon: <LayoutTemplate className="h-4 w-4" />, originalPrice: "Rp7.500.000", price: "Rp6.250.000" },
  { name: "Social Media",    icon: <Instagram className="h-4 w-4" />,      originalPrice: "Rp5.000.000", price: "Rp4.000.000" },
  { name: "All Promotion",   icon: <Award className="h-4 w-4" />,          originalPrice: "Rp10.000.000", price: "Rp7.500.000" },
];
const PACKAGE_TABLE_COLUMNS = ["Website 2 Weeks", "Website 1 Month", "Social Media", "All Promotion"] as const;
const PACKAGE_TABLE_ROWS: { name: string; values: string[] }[] = [
  { name: "Dedicated Hero Banner",   values: ["check", "check", "x",                  "2 Minggu"] },
  { name: "Campaign Hero Banner",    values: ["check", "check", "x",                  "2 Minggu"] },
  { name: "Campaign Banner",         values: ["check", "check", "x",                  "2 Minggu"] },
  { name: "Rekomendasi Event",       values: ["check", "check", "x",                  "2 Minggu"] },
  { name: "Instagram Ads",           values: ["x",     "x",     "Rp300.000/minggu",   "Rp300.000/minggu"] },
  { name: "Instagram Feed",          values: ["x",     "x",     "2x Post",            "2x Post"] },
  { name: "Instagram Story",         values: ["x",     "x",     "2x Post",            "2x Post"] },
  { name: "Instagram Reels",         values: ["x",     "x",     "1x Post",            "1x Post"] },
  { name: "Instagram Highlight",     values: ["x",     "x",     "1x Post",            "1x Post"] },
];

const SOCIAL_MEDIA_PACKAGES: PricePackage[] = [
  { name: "Instagram Ads",      icon: <Instagram className="h-5 w-5" />, price: "Rp300.000",   accent: "#0194f3", features: ["Request dedicated priority", "CTA link direct to event detail", "Single/multiple content, short video (Reels)"] },
  { name: "Instagram Feed",     icon: <Instagram className="h-5 w-5" />, price: "Rp1.250.000", accent: "#0194f3", features: ["1 Post", "Material dari Nempo Organizer", "Caption dari event creator", "3 main hashtags + 2 tag"] },
  { name: "Instagram Story",    icon: <Instagram className="h-5 w-5" />, price: "Rp250.000",   accent: "#0194f3", features: ["1 Post", "CTA link direct to event detail", "Material dari Nempo Organizer"] },
  { name: "Instagram Reels",    icon: <Instagram className="h-5 w-5" />, price: "Rp650.000",   accent: "#0194f3", features: ["1 Post", "Material dari Nempo Organizer", "3 main hashtags + 5 tag"] },
  { name: "Instagram Highlight",icon: <Instagram className="h-5 w-5" />, price: "Rp500.000",   accent: "#0194f3", features: ["3 content highlight", "Material dedicated Feed, Story & Reels"] },
  { name: "TikTok Post (Foto)", icon: <Video className="h-5 w-5" />,      price: "Rp400.000",   accent: "#0194f3", features: ["1 Post", "Material dari Nempo Organizer", "3 main hashtags + 3 tag"] },
  { name: "TikTok Post (Video)",icon: <Video className="h-5 w-5" />,      price: "Rp500.000",   accent: "#0194f3", features: ["1 Post max. 1 menit", "Material dari Nempo Organizer", "3 main hashtags + 3 tag"] },
];

const FEATURES = [
  { title: "Manajemen Tiket Terintegrasi",  desc: "Sistem end-to-end mulai penjualan, antrian, QR check-in, hingga laporan — semua dalam satu platform.", icon: <Ticket className="h-5 w-5" />,   big: true },
  { title: "Pelaporan Real-Time",            desc: "Pantau penjualan secara langsung tanpa menunggu laporan akhir.",                                           icon: <BarChart3 className="h-5 w-5" /> },
  { title: "Laporan Detail Penjualan",       desc: "Laporan komprehensif per transaksi dan hasil penjualan via email.",                                        icon: <FileText className="h-5 w-5" /> },
  { title: "Akses Multi-Platform",           desc: "Dashboard diakses dari desktop maupun mobile kapan saja.",                                                 icon: <Globe className="h-5 w-5" /> },
  { title: "Dedicated Support",              desc: "Tim dukungan siap membantu teknis dan operasional event Anda.",                                             icon: <Headset className="h-5 w-5" /> },
  { title: "QR & Scan System",               desc: "Sistem barcode & QR check-in real-time untuk pengunjung event.",                                           icon: <QrCode className="h-5 w-5" /> },
  { title: "Payment Gateway Lengkap",        desc: "Mendukung transfer bank, e-wallet, kartu kredit, dan QRIS.",                                               icon: <Wallet className="h-5 w-5" /> },
  { title: "Notifikasi Otomatis",            desc: "Konfirmasi tiket dan pengingat event dikirim otomatis ke pembeli.",                                        icon: <Send className="h-5 w-5" /> },
  { title: "Kalkulator Biaya",               desc: "Simulasi biaya transparan sebelum event dimulai, tanpa kejutan.",                                          icon: <Calculator className="h-5 w-5" /> },
];

type CmsStat = { value: string; label: string };
type CmsTheme = { title: string; desc: string; color: string };
type CmsStep = { no: string; title: string; desc: string; color: string };
type CmsCollabModel = { label: string; title: string; desc: string; note: string; points: string[] };
type CmsWhy = { title: string; desc: string };
type CmsPortfolio = { title: string; category: string; location: string; image: string; services: string; result: string };
type CmsService = { no: string; title: string; items: string[] };
type CmsSocialPackage = { name: string; price: string; features: string[] };
type CmsWebsitePackage = { name: string; prices: { duration: string; price: string }[]; features: string[] };
type CmsPackageCard = { name: string; originalPrice: string; price: string };
type CmsFeature = { title: string; desc: string };
type CmsPartnershipArea = {
  id: string;
  no: string;
  title: string;
  description: string;
  offerings: string[];
};

type PartnershipContent = {
  hero: {
    eyebrow: string; titleLine1: string; titleLine2: string; description: string;
    primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string;
    captionEyebrow: string; captionTitle: string;
    photoNote: string; smallStatValue: string; smallStatLabel: string; bottomLabel: string; bottomItems: string[];
  };
  heroImages: string[];
  heroStats: CmsStat[];
  themes: CmsTheme[];
  collabSteps: CmsStep[];
  collaborationModels: CmsCollabModel[];
  whyUs: CmsWhy[];
  portfolio: CmsPortfolio[];
  services: CmsService[];
  socialPackages: CmsSocialPackage[];
  websitePackages: CmsWebsitePackage[];
  packageCards: CmsPackageCard[];
  features: CmsFeature[];
  partnershipAreas: CmsPartnershipArea[];
  cta: { eyebrow: string; titleLine1: string; titleLine2: string; description: string; buttonLabel: string; emailText: string };
};

const PARTNERSHIP_AREA_ICONS = [Globe, Mountain, Newspaper, Ticket, Monitor, Mic2, Award] as const;

const DEFAULT_PARTNERSHIP_AREAS: CmsPartnershipArea[] = [
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
];

const DEFAULT_PARTNERSHIP_CONTENT: PartnershipContent = {
  hero: {
    eyebrow: "Nempo / kerja sama",
    titleLine1: "Biar tempatmu",
    titleLine2: "ditemukan.",
    description: "Kamu punya kafe, destinasi, atau acara yang ingin dikenal lebih banyak orang? Ceritakan dulu. Kita cari cara yang paling masuk akal untuk membawanya lebih jauh.",
    primaryLabel: "Bahas konsep event",
    primaryHref: NEMPO_CONSULT_URL,
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
  heroImages: HOME_HERO_IMAGES,
  heroStats: HERO_STATS.map(stat => ({ value: stat.val, label: stat.label })),
  themes: EVENT_THEMES.map(({ title, desc, color }) => ({ title, desc, color })),
  collabSteps: COLLAB_STEPS.map(({ no, title, desc, color }) => ({ no, title, desc, color })),
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
  whyUs: WHY_US.map(({ title, desc }) => ({ title, desc })),
  portfolio: PORTFOLIO_ITEMS,
  services: SERVICES.map(({ no, title, items }) => ({ no, title, items })),
  socialPackages: SOCIAL_MEDIA_PACKAGES.map(({ name, price, features }) => ({ name, price, features })),
  websitePackages: WEBSITE_PACKAGES.map(({ name, prices, features }) => ({ name, prices, features })),
  packageCards: PACKAGE_CARDS.map(({ name, originalPrice, price }) => ({ name, originalPrice, price })),
  features: FEATURES.map(({ title, desc }) => ({ title, desc })),
  partnershipAreas: DEFAULT_PARTNERSHIP_AREAS,
  cta: {
    eyebrow: "Siap Berkolaborasi?",
    titleLine1: "Punya rencana?",
    titleLine2: "Mari ngobrol dulu.",
    description: "Belum punya proposal lengkap tidak apa-apa. Ceritakan tempat atau eventmu, kami bantu menyusun langkah berikutnya.",
    buttonLabel: "Chat via WhatsApp",
    emailText: "Atau email ke hello@nempo.id",
  },
};

function mergePartnershipContent(value: unknown): PartnershipContent {
  const incoming = value && typeof value === "object" && !Array.isArray(value)
    ? value as Partial<PartnershipContent>
    : {};
  const defaults = DEFAULT_PARTNERSHIP_CONTENT;
  const arrayOrDefault = <T,>(value: T[] | undefined, fallback: T[]) =>
    Array.isArray(value) && value.length > 0 ? value : fallback;
  const mergePartnershipAreas = (areas: unknown): CmsPartnershipArea[] => {
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
    heroImages: arrayOrDefault(incoming.heroImages, defaults.heroImages),
    heroStats: arrayOrDefault(incoming.heroStats, defaults.heroStats),
    themes: arrayOrDefault(incoming.themes, defaults.themes),
    collabSteps: arrayOrDefault(incoming.collabSteps, defaults.collabSteps),
    collaborationModels: arrayOrDefault(incoming.collaborationModels, defaults.collaborationModels),
    whyUs: arrayOrDefault(incoming.whyUs, defaults.whyUs),
    portfolio: arrayOrDefault(incoming.portfolio, defaults.portfolio),
    services: arrayOrDefault(incoming.services, defaults.services),
    socialPackages: arrayOrDefault(incoming.socialPackages, defaults.socialPackages),
    websitePackages: arrayOrDefault(incoming.websitePackages, defaults.websitePackages),
    packageCards: arrayOrDefault(incoming.packageCards, defaults.packageCards),
    features: arrayOrDefault(incoming.features, defaults.features),
    partnershipAreas: mergePartnershipAreas(incoming.partnershipAreas),
  };
}

function contentImageUrl(value: string): string {
  if (/^(?:https?:|\/)/i.test(value)) return value;
  return `${import.meta.env.BASE_URL}${value}`;
}

function buildHeroTracks(images: string[]): string[][] {
  const pool = Array.from(new Set(images.filter(Boolean)));
  if (pool.length < 12) return HERO_COLLAGE_TRACKS;
  return [pool.slice(0, 4), pool.slice(4, 8), pool.slice(8, 12)];
}

/* ─────────────────────────────────────────────────────────────────── */
/*  PAGE                                                               */
/* ─────────────────────────────────────────────────────────────────── */
export default function PriceListPage() {
  const [tab, setTab]           = useState<Tab>("Social Media");
  const [hargaTiket, setHargaTiket] = useState("");
  const [feeType, setFeeType]   = useState<"partner" | "mainpower">("partner");
  const themeCarouselRef = useRef<HTMLDivElement>(null);
  const [partnershipContent, setPartnershipContent] = useState<PartnershipContent>(DEFAULT_PARTNERSHIP_CONTENT);
  const [activeAreaId, setActiveAreaId] = useState(DEFAULT_PARTNERSHIP_AREAS[0].id);

  useEffect(() => {
    fetch("/api/partnership")
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (data?.content) setPartnershipContent(mergePartnershipContent(data.content));
      })
      .catch(() => {});
  }, []);

  const content = partnershipContent;
  const heroTracks = buildHeroTracks(content.heroImages);
  const eventThemes = content.themes.map((theme, index) => ({
    ...theme,
    icon: EVENT_THEMES[index % EVENT_THEMES.length]?.icon ?? Megaphone,
  }));
  const collabSteps = content.collabSteps.map((step, index) => ({
    ...step,
    icon: COLLAB_STEPS[index % COLLAB_STEPS.length]?.icon ?? Handshake,
  }));
  const whyUs = content.whyUs.map((item, index) => ({ ...item, icon: WHY_US[index % WHY_US.length]?.icon ?? Shield }));
  const services = content.services.map((service, index) => ({
    ...service,
    summary: SERVICE_SUMMARIES[index % SERVICE_SUMMARIES.length],
    icon: SERVICES[index % SERVICES.length]?.icon ?? Briefcase,
    color: SERVICES[index % SERVICES.length]?.color ?? "#0194f3",
    from: SERVICES[index % SERVICES.length]?.from ?? "#0194f3",
    to: SERVICES[index % SERVICES.length]?.to ?? "#0052b0",
  }));
  const socialMediaPackages = content.socialPackages.map((pkg, index) => ({
    ...pkg,
    icon: SOCIAL_MEDIA_PACKAGES[index % SOCIAL_MEDIA_PACKAGES.length]?.icon ?? <Instagram className="h-5 w-5" />,
    accent: SOCIAL_MEDIA_PACKAGES[index % SOCIAL_MEDIA_PACKAGES.length]?.accent ?? "#0194f3",
  }));
  const websitePackages = content.websitePackages.map((pkg, index) => ({
    ...pkg,
    icon: WEBSITE_PACKAGES[index % WEBSITE_PACKAGES.length]?.icon ?? <LayoutTemplate className="h-4 w-4" />,
  }));
  const packageCards = content.packageCards.map((pkg, index) => ({
    ...pkg,
    icon: PACKAGE_CARDS[index % PACKAGE_CARDS.length]?.icon ?? <LayoutTemplate className="h-4 w-4" />,
  }));
  const features = content.features.map((feature, index) => ({
    ...feature,
    icon: FEATURES[index % FEATURES.length]?.icon ?? <CheckCircle className="h-5 w-5" />,
    big: index === 0,
  }));
  const activeArea = content.partnershipAreas.find((area) => area.id === activeAreaId) ?? content.partnershipAreas[0];
  const activeAreaIndex = Math.max(0, content.partnershipAreas.findIndex((area) => area.id === activeArea?.id));
  const ActiveAreaIcon = PARTNERSHIP_AREA_ICONS[activeAreaIndex % PARTNERSHIP_AREA_ICONS.length];

  const harga          = Number(hargaTiket.replace(/\D/g, "")) || 0;
  const feeRate        = feeType === "partner" ? 0.05 : 0.10;
  const biayaTransaksi = harga > 0 ? Math.round(harga * feeRate) : 0;
  const scrollThemeCarousel = (direction: -1 | 1) => {
    const carousel = themeCarouselRef.current;
    if (!carousel) return;
    carousel.scrollBy({
      left: direction * carousel.clientWidth * (window.innerWidth < 640 ? 0.86 : 0.36),
      behavior: "smooth",
    });
  };

  return (
    <Layout>
      <SEO
        title="Kerja Sama"
        description="Temukan bentuk kerja sama pariwisata, kuliner, hospitality, media, event, produk digital, talent, influencer, dan merchandise bersama Nempo Organizer."
        keywords="kerja sama Nempo Organizer, partnership Garut, promosi event Garut, merchandise custom, digital product, talent influencer, hospitality, media partner, layanan kolaborasi Nempo"
        path="/kerja-sama"
      />

      <div className="price-list-page min-h-screen pb-20">

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <div className="price-list-hero relative overflow-hidden border-b border-blue-100 bg-white">
          <div className="relative z-10 mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
              <div className="price-list-hero-copy max-w-xl">
                <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#0194f3]">
                  <span className="h-px w-8 bg-[#0194f3]" /> {content.hero.eyebrow}
                </p>
                <h1 className="max-w-lg text-5xl font-black leading-[0.9] tracking-[-0.06em] text-[#102a43] sm:text-6xl lg:text-[5.15rem]">
                  {content.hero.titleLine1}
                  <span className="mt-2 block">{content.hero.titleLine2}</span>
                </h1>
                <p className="mt-7 max-w-md text-sm leading-[1.8] text-[#52637a] sm:text-base">
                  {content.hero.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={content.hero.primaryHref}
                    target="_blank" rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 rounded-full px-5 py-3.5 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(1,148,243,0.24)] active:scale-95"
                    style={{ background: "var(--pl-coral)" }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {content.hero.primaryLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href={content.hero.secondaryHref}
                    className="group inline-flex items-center gap-2 text-sm font-bold text-[#102a43] transition-colors hover:text-[#0194f3]"
                  >
                    {content.hero.secondaryLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
                <p className="mt-5 text-[10px] font-medium text-[#7a8da3]">Untuk tempat, acara, dan brand lokal</p>
              </div>

              <div className="price-list-hero-photo relative mx-auto w-full max-w-[620px] lg:ml-auto">
                <div className="price-list-hero-collage relative aspect-[1.12/1] overflow-hidden rounded-[2.25rem] border border-blue-100 bg-[#eaf4ff] shadow-[0_24px_70px_rgba(1,71,130,0.16)] sm:aspect-[1.35/1]">
                  <div className="price-list-collage-grid" aria-hidden="true">
                    {heroTracks.map((track, trackIndex) => (
                      <div
                        key={trackIndex}
                        className={`price-list-collage-track ${trackIndex === 1 ? "price-list-collage-track-reverse" : ""}`}
                      >
                        {[...track, ...track].map((image, imageIndex) => (
                          <div className="price-list-collage-card" key={`${image}-${imageIndex}`}>
                            <img
                              src={contentImageUrl(image)}
                              alt=""
                              loading={trackIndex === 0 && imageIndex === 0 ? "eager" : "lazy"}
                              onError={(event) => {
                                const target = event.currentTarget;
                                if (target.dataset.fallbackApplied === "true") return;
                                target.dataset.fallbackApplied = "true";
                                 target.src = contentImageUrl(image.replace(/\.webp$/i, ".jpg"));
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="price-list-hero-collage-overlay absolute inset-0 bg-gradient-to-t from-[#073b68]/85 via-[#073b68]/10 to-transparent" />
                  <div className="price-list-hero-collage-caption absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-7">
                    <div>
                       <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9ed8ff]">{content.hero.captionEyebrow}</p>
                       <p className="mt-1.5 max-w-xs text-lg font-bold leading-tight text-white sm:text-2xl">{content.hero.captionTitle}</p>
                    </div>
                    <div className="hidden shrink-0 border-l border-white/30 pl-4 text-right sm:block">
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/55">Nempo</p>
                    </div>
                  </div>
                </div>
                 <div className="mt-4 hidden border border-blue-200 bg-white px-4 py-3 shadow-[0_12px_24px_rgba(1,71,130,0.12)] sm:inline-block">
                   <p className="font-mono text-xl font-medium leading-none text-[#0194f3]">{content.hero.smallStatValue}</p>
                   <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#71849a]">{content.hero.smallStatLabel}</p>
                </div>
                 <p className="mt-4 text-right text-[9px] font-medium text-[#7a8da3] sm:pr-1">{content.hero.photoNote}</p>
              </div>
            </div>

             <div className="mt-7 grid grid-cols-2 gap-2 border-t border-blue-100 pt-5 sm:grid-cols-4 sm:gap-4">
               {content.heroStats.map((stat) => (
                 <div key={`${stat.value}-${stat.label}`} className="rounded-2xl border border-blue-100 bg-white/80 px-3 py-3">
                   <p className="font-mono text-xl font-semibold leading-none text-[#0194f3]">{stat.value}</p>
                   <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#71849a]">{stat.label}</p>
                 </div>
               ))}
             </div>

            <div className="price-list-hero-bottom mt-12 grid gap-6 border-t border-blue-100 pt-5 sm:grid-cols-[0.8fr_1.2fr] sm:items-center">
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a8da3]">{content.hero.bottomLabel}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[#102a43]">
                 {content.hero.bottomItems.map(item => <span key={item}>{item}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* ══ QUICK NAV ══════════════════════════════════════════════════ */}
        <nav aria-label="Navigasi kerja sama" className="price-list-quick-nav mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-blue-100 bg-white/80 p-1.5 shadow-[0_8px_24px_rgba(1,71,130,0.06)] backdrop-blur-sm">
            <span className="hidden shrink-0 px-3 text-[9px] font-black uppercase tracking-[0.18em] text-[#938782] sm:block">Lihat juga</span>
            {[
              { label: "Layanan kerja sama", href: "#layanan-kerja-sama" },
              { label: "Tema event", href: "#tema-event" },
              { label: "Cara kerja", href: "#cara-kolaborasi" },
              { label: "Portofolio", href: "#portofolio" },
              { label: "Layanan", href: "#layanan" },
              { label: "Paket promosi", href: "#paket-promosi" },
              { label: "Kalkulator", href: "#biaya-transaksi" },
            ].map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-xl px-3 py-2 text-[10px] font-bold transition-colors hover:bg-blue-50 hover:text-[#0194f3] ${
                  index === 0 ? "bg-blue-50 text-[#0194f3]" : "text-[#5d7187]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* ══ LAYANAN KERJA SAMA ═════════════════════════════════════════ */}
        <section id="layanan-kerja-sama" className="price-list-section price-list-partnership-areas mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
          <div className="price-list-partnership-selector overflow-hidden rounded-3xl border border-[#e5ddd3] bg-[#fffdf9] shadow-[0_1px_0_rgba(23,50,67,.04)]">
            <div className="price-list-partnership-header relative overflow-hidden p-5 sm:p-8 lg:flex lg:items-end lg:justify-between lg:gap-10">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f0c997]">Nempo / partnerships</p>
                  <span className="h-px w-10 bg-white/25" />
                  <span className="font-mono text-[10px] text-white/45">{String(content.partnershipAreas.length).padStart(2, "0")} bidang</span>
                </div>
                <h2 className="max-w-2xl text-2xl font-black leading-[1.05] tracking-[-0.03em] text-white sm:text-3xl">
                  Satu kebutuhan, satu bentuk kolaborasi yang jelas.
                </h2>
              </div>
              <p className="relative z-10 mt-4 max-w-md text-sm leading-[1.75] text-white/65 lg:mt-0 lg:text-right">
                Setiap bidang punya layanan yang bisa dirangkai sesuai kebutuhan tempat, brand, event, atau cerita yang ingin kamu bawa lebih jauh.
              </p>
            </div>

            <div className="grid lg:grid-cols-[17rem_1fr]">
              <nav className="price-list-partnership-tabs border-b border-[#e5ddd3] bg-[#fbfaf7] lg:border-b-0 lg:border-r" role="tablist" aria-label="Pilihan layanan kerja sama Nempo">
                <div className="flex min-w-max gap-2 overflow-x-auto p-3 lg:block lg:min-w-0 lg:space-y-1 lg:overflow-visible lg:p-4">
                  {content.partnershipAreas.map((area, index) => {
                    const isActive = activeArea?.id === area.id;
                    return (
                      <button
                        key={area.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`partnership-area-panel-${area.id}`}
                        onClick={() => setActiveAreaId(area.id)}
                        className={`price-list-partnership-tab group flex w-full min-w-max items-center gap-3 rounded-xl px-3 py-3 text-left transition-all lg:min-w-0 ${
                          isActive ? "price-list-partnership-tab-active bg-[#0b79b5] text-white" : "text-[#52637a] hover:bg-white hover:text-[#0b79b5]"
                        }`}
                      >
                        <span className={`price-list-partnership-tab-number font-mono text-[10px] ${isActive ? "text-[#f0c997]" : "text-[#a5b0b7]"}`}>
                          {area.no || String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 text-[11px] font-extrabold whitespace-nowrap lg:whitespace-normal">{area.title}</span>
                        <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${isActive ? "text-white" : "text-[#a5b0b7]"} ${isActive ? "lg:block" : "hidden lg:block"}`} />
                      </button>
                    );
                  })}
                </div>
              </nav>

              <div className="price-list-partnership-panel min-w-0 bg-white">
                {activeArea && (
                  <article
                    id={`partnership-area-panel-${activeArea.id}`}
                    role="tabpanel"
                    aria-label={activeArea.title}
                    className="relative overflow-hidden p-5 sm:p-8 lg:p-10"
                  >
                    <span className="price-list-partnership-watermark pointer-events-none absolute -right-2 -top-8 font-black leading-none text-[#f4f0e9]" aria-hidden="true">
                      {activeArea.no}
                    </span>
                    <div className="flex items-start gap-4">
                      <span className="price-list-partnership-icon relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eef7ff] text-[#0b79b5]">
                        <ActiveAreaIcon className="h-5 w-5" />
                      </span>
                      <div className="relative z-10">
                        <p className="font-mono text-[10px] font-medium tracking-[0.16em] text-[#c9965b]">Layanan {activeArea.no}</p>
                        <h3 className="mt-1 text-xl font-black leading-tight text-[#173243] sm:text-2xl">{activeArea.title}</h3>
                      </div>
                    </div>
                    <p className="relative z-10 mt-5 max-w-2xl text-sm leading-[1.8] text-[#6d777b]">{activeArea.description}</p>

                    <div className="mt-8 border-t border-[#e5ddd3] pt-5">
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b79b5]">Layanan yang tersedia</p>
                        <span className="font-mono text-[10px] text-[#a5b0b7]">{activeArea.offerings.length} pilihan</span>
                      </div>
                      <div className="mt-2 grid sm:grid-cols-2 sm:gap-x-8">
                        {activeArea.offerings.map((offering, index) => (
                          <div key={offering} className="price-list-partnership-offering group flex items-start gap-4 border-b border-[#eee8e0] py-4 last:border-0 sm:[&:nth-last-child(2)]:border-0">
                            <span className="font-mono text-[10px] font-medium text-[#c9965b]">{String(index + 1).padStart(2, "0")}</span>
                            <span className="flex-1 text-sm font-bold leading-relaxed text-[#365a77]">{offering}</span>
                            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[#a5b0b7] transition-colors group-hover:text-[#0b79b5]" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="price-list-partnership-cta mt-8 flex flex-col gap-3 border-t border-[#e5ddd3] pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-md text-xs leading-relaxed text-[#8a9292]">Belum menemukan layanan yang pas? Ceritakan kebutuhannya, lalu kita susun bentuk kerja samanya.</p>
                      <a
                        href={NEMPO_CONSULT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0b79b5] px-4 py-3 text-xs font-extrabold text-white transition-colors hover:bg-[#173243]"
                      >
                        Konsultasikan layanan <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </article>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══ PILIHAN TEMA EVENT ═════════════════════════════════════════ */}
        <section id="tema-event" className="price-list-section price-list-themes mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
          <div className="price-list-theme-panel relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="relative z-10">
                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#0194f3]">Beberapa cara untuk mulai</p>
                  <h2 className="max-w-xl text-2xl font-black leading-[1.05] tracking-[-0.03em] text-gray-900 sm:text-3xl">Pilih format yang pas.</h2>
                </div>
                 <div className="flex items-end justify-between gap-4 sm:block sm:text-right">
                   <p className="max-w-sm text-xs leading-[1.7] text-gray-500">
                     Tidak ada paket yang harus dipaksakan. Kita mulai dari kebutuhan tempat, pengunjung, dan cerita yang ingin kamu bawa.
                   </p>
                   <div className="flex shrink-0 gap-2 sm:mt-4 sm:justify-end">
                     <button
                       type="button"
                       onClick={() => scrollThemeCarousel(-1)}
                       className="grid h-9 w-9 place-items-center rounded-full border border-[#e5ddd3] text-[#0b79b5] transition-colors hover:border-[#0b79b5] hover:bg-[#0b79b5] hover:text-white"
                       aria-label="Lihat format sebelumnya"
                     >
                       <ChevronLeft className="h-4 w-4" />
                     </button>
                     <button
                       type="button"
                       onClick={() => scrollThemeCarousel(1)}
                       className="grid h-9 w-9 place-items-center rounded-full border border-[#e5ddd3] text-[#0b79b5] transition-colors hover:border-[#0b79b5] hover:bg-[#0b79b5] hover:text-white"
                       aria-label="Lihat format berikutnya"
                     >
                       <ChevronRight className="h-4 w-4" />
                     </button>
                   </div>
                 </div>
              </div>

               <div ref={themeCarouselRef} className="price-list-theme-carousel" aria-label="Tema event">
                 <div className="price-list-theme-carousel-track">
                   {eventThemes.map((theme) => (
                     <div className="price-list-theme-carousel-item" key={theme.title}>
                       <EventThemeCard theme={theme} />
                     </div>
                   ))}
                 </div>
              </div>
              <p className="mt-5 text-xs text-gray-500">
                Punya bentuk acara sendiri? <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-[#0194f3] underline decoration-[#0194f3]/30 underline-offset-4 hover:decoration-[#0194f3]">Ceritakan idemu ke tim Nempo</a>.
              </p>
            </div>
          </div>
        </section>

        {/* ══ CARA KOLABORASI ════════════════════════════════════════════ */}
        <section id="cara-kolaborasi" className="price-list-section max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
          <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl" />
            <div className="relative z-10">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#0194f3]">Cara kita bekerja</p>
                  <h2 className="text-xl font-black leading-tight text-gray-900 sm:text-2xl">Mulai dari obrolan yang jelas.</h2>
                </div>
                <p className="max-w-sm text-xs leading-relaxed text-gray-400 sm:text-right">
                  Satu tim untuk membantu merapikan ide, menjangkau orang yang tepat, dan melihat hasilnya.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                  {collabSteps.map((step, index) => {
                    const StepIcon = step.icon;
                  return (
                    <div key={step.no} className="price-list-step-card relative rounded-2xl border p-4 transition-all duration-300">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#eef6fb] text-[#0b79b5]">
                          <StepIcon className="h-4 w-4" />
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-gray-900">{step.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-7 border-t border-[#e5ddd3] pt-6">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#0b79b5]">Sistem kerja sama</p>
                    <h3 className="text-lg font-black leading-tight text-gray-900 sm:text-xl">Pilih skema yang paling masuk akal.</h3>
                  </div>
                  <p className="max-w-sm text-xs leading-relaxed text-gray-400 sm:text-right">
                    Kita bicarakan modelnya sejak awal agar peran, biaya, dan pembagian hasil sama-sama jelas.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {content.collaborationModels.map((model, index) => (
                    <article key={`${model.title}-${index}`} className="rounded-2xl border border-[#e5ddd3] bg-[#fffdf9] p-4 sm:p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="font-mono text-xs font-medium tracking-[0.12em] text-[#0b79b5]">{model.label || `Model 0${index + 1}`}</span>
                        <span className="h-px w-10 bg-[#0b79b5]" />
                      </div>
                      <h4 className="text-base font-black text-gray-900 sm:text-lg">{model.title}</h4>
                      <p className="mt-2 text-xs leading-[1.7] text-gray-500">{model.desc}</p>
                      <p className="mt-4 border-l-2 border-[#0b79b5] pl-3 text-[11px] font-semibold leading-relaxed text-[#365a77]">{model.note}</p>
                      <ul className="mt-4 space-y-2 border-t border-[#e5ddd3] pt-4">
                        {model.points.map(point => (
                          <li key={point} className="flex gap-2 text-[11px] leading-relaxed text-gray-500">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b79b5]" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ WHY US ════════════════════════════════════════════════════ */}
        <div className="price-list-section price-list-proof max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {whyUs.map((w) => {
              const WhyIcon = w.icon;
              return (
                <div key={w.title}
                  className="price-list-proof-card rounded-2xl border bg-white p-4 transition-all duration-200 sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#eef6fb] text-[#0b79b5]">
                      <WhyIcon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="font-extrabold text-gray-900 text-xs sm:text-[13px] leading-snug mb-1">{w.title}</p>
                  <p className="text-gray-400 text-[10px] sm:text-xs leading-relaxed hidden sm:block">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ PORTOFOLIO ══════════════════════════════════════════════════ */}
        <section id="portofolio" className="price-list-section price-list-portfolio max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#0194f3]">Jejak kolaborasi</p>
              <h2 className="max-w-xl text-2xl font-black leading-[1.05] tracking-[-0.03em] text-gray-900 sm:text-3xl">
                Tempat, brand, dan event yang pernah kami bantu.
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-[1.7] text-gray-500 sm:text-right">
              Cerita, dokumentasi, dan kolaborasi terbaru kami bagikan melalui Instagram Nempo.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-[#f8fcff] via-white to-[#eef7ff] p-6 shadow-sm sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#0194f3]/10 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-[#0b79b5]">
                  <Instagram className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ikuti perjalanan Nempo</span>
                </div>
                <p className="mt-3 text-xl font-black tracking-[-0.03em] text-[#173243] sm:text-2xl">
                  Lihat tempat, brand, dan event yang kami bantu di {NEMPO_INSTAGRAM_HANDLE}.
                </p>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#6d777b]">
                  Temukan cerita terbaru, dokumentasi kolaborasi, dan kabar dari ekosistem lokal Nempo.
                </p>
              </div>
              <a
                href={NEMPO_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0b79b5] px-5 py-3 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-[#173243] hover:shadow-lg"
              >
                <Instagram className="h-4 w-4" />
                Buka Instagram
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ══ LAYANAN ═══════════════════════════════════════════════════ */}
        <div id="layanan" className="price-list-section price-list-services max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14">
          <div className="price-list-service-catalog overflow-hidden rounded-3xl border border-[#e5ddd3] bg-[#fffdf9]">
            <div className="price-list-service-catalog-header flex flex-col gap-5 border-b border-[#e5ddd3] p-5 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#0b79b5]">Yang bisa kita kerjakan</p>
                  <span className="h-px w-8 bg-[#c9965b]" />
                </div>
                <h2 className="text-2xl font-black leading-[1.05] tracking-[-0.03em] text-gray-900 sm:text-3xl">Layanan yang tumbuh dari kebutuhanmu.</h2>
                <p className="mt-3 text-sm leading-[1.7] text-gray-500">Pilih satu atau susun beberapa layanan sekaligus. Kita bicarakan bentuk kerja yang paling masuk akal untuk tempat, brand, atau eventmu.</p>
              </div>
              <div className="price-list-service-catalog-note shrink-0 border-l-2 border-[#0b79b5] pl-3">
                <span className="block font-mono text-xl font-medium leading-none text-[#0b79b5]">{services.length.toString().padStart(2, "0")}</span>
                <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.16em] text-[#7a8da3]">bidang layanan</span>
              </div>
            </div>

            <div className="grid gap-x-10 px-5 sm:grid-cols-2 sm:px-8">
              {services.map((s) => {
                const ServiceIcon = s.icon;
                return (
                  <article key={s.no} className="price-list-service-card group">
                    <div className="flex items-start gap-4 py-6 sm:py-7">
                      <div className="flex w-10 shrink-0 flex-col items-center gap-3">
                        <span className="font-mono text-sm font-medium tracking-[-0.04em] text-[#c9965b]">{s.no}</span>
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f1f5f4] text-[#0b79b5] transition-colors group-hover:bg-[#0b79b5] group-hover:text-white">
                          <ServiceIcon className="h-4 w-4" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="text-base font-black leading-tight text-gray-900 sm:text-lg">{s.title}</h3>
                          <span className="shrink-0 font-mono text-[9px] font-medium uppercase tracking-[0.1em] text-[#a5b0b7]">{s.items.length} layanan</span>
                        </div>
                        <p className="price-list-service-summary mt-2 max-w-sm text-xs leading-[1.65] text-[#6d777b]">{s.summary}</p>
                        <div className="price-list-service-items mt-4" aria-label={`Cakupan layanan ${s.title}`}>
                          {s.items.map((item, index) => (
                            <span key={item} className="price-list-service-item">
                              <span className="font-mono text-[9px] text-[#c9965b]">{String(index + 1).padStart(2, "0")}</span>
                              {item}
                            </span>
                          ))}
                        </div>
                        <a
                          href={NEMPO_CONSULT_URL}
                          target="_blank" rel="noopener noreferrer"
                          className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0b79b5] transition-all hover:gap-2.5 active:scale-95"
                        >
                          Bahas layanan <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="price-list-service-catalog-footer flex flex-col gap-3 border-t border-[#e5ddd3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-xs leading-relaxed text-[#6d777b]">Belum yakin mulai dari mana? Ceritakan kebutuhanmu, kami bantu pilihkan bidang yang paling relevan.</p>
              <a
                href={NEMPO_CONSULT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 text-xs font-extrabold text-[#0b79b5] transition-colors hover:text-[#173243]"
              >
                Konsultasi gratis <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* ══ PAKET PROMOSI ═════════════════════════════════════════════ */}
        <div id="paket-promosi" className="price-list-section price-list-pricing max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
            <div>
              <div className="flex items-center gap-3 mb-2">
            <div className="h-7 w-1 rounded-full" style={{ background: "var(--pl-coral)" }} />
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#0194f3]">Eksposur Maksimal</p>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 ml-4">Paket Promosi Event</h2>
              <p className="text-gray-400 text-sm mt-0.5 ml-4">Pilihan ruang promosi yang bisa disesuaikan dengan eventmu</p>
            </div>
            {/* Tabs */}
            <div className="flex items-center gap-1.5 bg-white rounded-2xl border border-gray-100 p-1.5 shadow-sm w-fit">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    tab === t
                      ? "text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                   style={tab === t ? { background: "var(--pl-coral)" } : {}}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* ── Social Media Tab ── */}
          {tab === "Social Media" && (
             <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {socialMediaPackages.map((pkg) => (
                <div key={pkg.name}
                  className="price-list-package-card group flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300">
                  {/* Color stripe */}
                  <div className="h-px w-full shrink-0 bg-[#0b79b5]" />
                  <div className="p-4 flex flex-col flex-1">
                    {/* Number + name */}
                    <div className="flex items-center gap-2.5 mb-4">
                      <p className="font-extrabold text-gray-900 text-xs leading-snug">{pkg.name}</p>
                    </div>
                    {/* Price */}
                    <div className="mb-4">
                      <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-0.5">Mulai dari</p>
                      <p className="font-black text-gray-900 text-2xl leading-none">{pkg.price}</p>
                    </div>
                    {/* CTA */}
                    <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-white py-2.5 rounded-xl mb-4 active:scale-95 transition-all"
                     style={{ background: "var(--pl-coral)" }}>
                      <Instagram className="h-3 w-3" /> Hubungi via WhatsApp
                    </a>
                    {/* Features */}
                    <div className="space-y-1.5 flex-1">
                      {pkg.features.map((f, i) => (
                        <div key={i} className="flex gap-2 text-[10px] text-gray-400 leading-snug">
                          <CheckCircle className="h-3 w-3 text-[#0194f3] shrink-0 mt-[1px]" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Website Tab ── */}
          {tab === "Website" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {websitePackages.map((pkg, idx) => (
                <div key={pkg.name}
                  className={`group bg-white rounded-2xl border hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col ${
                    idx === 0 ? "border-[#0b79b5]/40 ring-1 ring-[#0b79b5]/10" : "border-gray-100"
                  }`}>
                  <div className="h-px w-full shrink-0 bg-[#0b79b5]" />
                  <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-5">
                      <div>
                        <p className="font-extrabold text-gray-900 text-sm">{pkg.name}</p>
                        {idx === 0 && <span className="text-[9px] font-black uppercase tracking-wide text-[#0194f3] flex items-center gap-1">Paling Populer</span>}
                      </div>
                    </div>
                    {/* Duration prices */}
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {pkg.prices.map((p) => (
                        <div key={p.duration} className="rounded-xl px-3 py-3 bg-gradient-to-br from-blue-50 to-white border border-[#0194f3]/15">
                          <p className="text-[#0194f3] text-[10px] font-bold uppercase tracking-wide">{p.duration}</p>
                          <p className="text-gray-900 font-black text-base">{p.price}</p>
                        </div>
                      ))}
                    </div>
                    <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-xs font-bold text-white py-3 rounded-xl mb-4 active:scale-95 transition-all"
                       style={{ background: "var(--pl-coral)" }}>
                      <Instagram className="h-3.5 w-3.5" /> Hubungi via WhatsApp
                    </a>
                    <div className="space-y-2 flex-1">
                      {pkg.features.map((f, i) => (
                        <div key={i} className="flex gap-2 text-xs text-gray-400">
                          <CheckCircle className="h-3.5 w-3.5 text-[#0194f3] shrink-0 mt-px" /><span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Package Tab ── */}
          {tab === "Package" && (
            <>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {packageCards.map((pkg, idx) => {
                  const isRecommended = idx === 3;
                  return (
                    <div key={pkg.name}
                      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:shadow-xl ${
                        isRecommended ? "z-10 border-[#0b79b5] shadow-sm ring-1 ring-[#0b79b5]/20 sm:scale-[1.02]" : "border-gray-100"
                      }`}>
                      <div className="h-px w-full shrink-0 bg-[#0b79b5]" />
                      <div className="p-4 sm:p-5 flex flex-col flex-1">
                        {isRecommended && (
                          <span className="self-start mb-3 rounded-full bg-[#0194f3] px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-white shadow-sm">
                            Paling Cocok
                          </span>
                        )}
                        <div className="flex items-center gap-2.5 mb-4">
                          <p className="font-extrabold text-gray-900 text-xs sm:text-sm leading-snug">{pkg.name}</p>
                        </div>
                        <p className="text-gray-300 text-xs line-through mb-0.5">{pkg.originalPrice}</p>
                        <p className="font-black text-gray-900 text-xl sm:text-2xl mb-5 leading-none">{pkg.price}</p>
                        <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer"
                          className="mt-auto flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl active:scale-95 transition-all"
                          style={{
                            background: isRecommended ? "linear-gradient(135deg,#65b9f5,#0194f3)" : "linear-gradient(135deg,#0194f3,#0052b0)",
                            color: "#fff",
                          }}>
                          <MessageCircle className="h-3 w-3" /> Pesan Sekarang
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile comparison */}
              <div className="sm:hidden space-y-3 mb-4">
                <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest">Perbandingan Fitur</p>
                {PACKAGE_TABLE_COLUMNS.map((col, colIdx) => (
                  <div key={col} className="bg-white rounded-2xl border border-gray-100 p-4">
                    <p className="font-extrabold text-gray-900 text-sm mb-3">{col}</p>
                    <div className="space-y-2.5">
                      {PACKAGE_TABLE_ROWS.map((row) => {
                        const v = row.values[colIdx];
                        return (
                          <div key={row.name} className="flex items-center justify-between gap-3 text-xs">
                            <span className="text-gray-500">{row.name}</span>
                            {v === "check"
                              ? <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black flex items-center justify-center shrink-0">✓</span>
                              : v === "x"
                                ? <span className="text-gray-300 font-bold shrink-0">—</span>
                                : <span className="text-gray-700 font-semibold text-right shrink-0">{v}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop comparison table */}
              <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between"
                  style={{ background: "var(--pl-paper-deep)" }}>
                  <p className="font-extrabold text-gray-800 text-sm">Perbandingan Fitur Paket</p>
                  <span className="text-[10px] text-gray-400 font-medium">✓ = Termasuk · — = Tidak tersedia</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[540px]">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/60">
                        <th className="text-left font-bold text-gray-500 px-6 py-3.5 w-52">Fitur</th>
                        {PACKAGE_TABLE_COLUMNS.map((col, i) => (
                          <th key={col} className={`text-center font-bold px-4 py-3.5 whitespace-nowrap ${i === 3 ? "text-[#0194f3]" : "text-gray-700"}`}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {PACKAGE_TABLE_ROWS.map((row, ri) => (
                        <tr key={row.name} className={`border-b border-gray-50 last:border-0 ${ri % 2 === 1 ? "bg-gray-50/40" : ""}`}>
                          <td className="px-6 py-3 text-gray-600 font-medium">{row.name}</td>
                          {row.values.map((v, i) => (
                            <td key={i} className="px-4 py-3 text-center">
                              {v === "check"
                                ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 font-black text-[10px]">✓</span>
                                : v === "x"
                                  ? <span className="text-gray-300 font-bold">—</span>
                                  : <span className="text-gray-700 font-semibold">{v}</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ══ BIAYA TRANSAKSI ═══════════════════════════════════════════ */}
        <div id="biaya-transaksi" className="price-list-section price-list-calculator max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16">
          <div id="fitur-platform" className="flex items-center gap-3 mb-2">
            <div className="h-7 w-1 rounded-full" style={{ background: "var(--pl-teal)" }} />
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#0194f3]">Transparan & kompetitif</p>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-1 ml-4">Biaya Transaksi Tiket</h2>
           <p className="text-gray-400 text-sm mb-7 ml-4">Hitungannya sederhana, supaya kamu tahu dari awal.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12">

            {/* Model kerja sama */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2"
                style={{ background: "var(--pl-paper-deep)" }}>
                <Handshake className="h-4 w-4 text-[#0194f3]" />
                <p className="font-extrabold text-gray-800 text-sm">Model Kerja Sama</p>
              </div>
              <div className="p-5 space-y-3">
                {/* 5% */}
                <div className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-white p-4">
                  <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: "var(--pl-coral)", boxShadow: "none" }}>
                    <span className="text-white font-black text-xl">5%</span>
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm">Jual Tiket Partner</p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                      Platform listing tiket + <span className="font-bold text-[#0194f3]">FREE promosi</span> di Nempo Organizer. Biaya 5% per tiket terjual.
                    </p>
                  </div>
                </div>
                {/* 10% */}
                <div className="flex items-start gap-4 p-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-white">
                  <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                     style={{ background: "var(--pl-teal)", boxShadow: "none" }}>
                    <span className="text-white font-black text-xl">10%</span>
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm">Include Main Power</p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                      Termasuk <span className="font-bold text-[#0194f3]">tim operasional</span> on-site Nempo Organizer. Biaya 10% per tiket terjual.
                    </p>
                  </div>
                </div>
                <div className="pt-1 space-y-1.5">
                  {["Biaya Admin ditanggung oleh Event Creator", "Pajak Hiburan Daerah tergantung jenis event"].map((t, i) => (
                    <p key={i} className="text-gray-400 text-xs flex gap-2 items-start">
                      <span className="shrink-0 w-1 h-1 rounded-full bg-gray-300 mt-[6px]" />{t}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Kalkulator */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2"
                style={{ background: "var(--pl-paper-deep)" }}>
                <Calculator className="h-4 w-4 text-[#0194f3]" />
                <p className="font-extrabold text-gray-800 text-sm">Simulasi Biaya Transaksi</p>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Tipe Kerja Sama</p>
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  {(["partner", "mainpower"] as const).map((type) => (
                    <button key={type} onClick={() => setFeeType(type)}
                      className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 transition-all ${
                        feeType === type
                          ? type === "partner"
                            ? "border-emerald-400 bg-emerald-50 shadow-md shadow-emerald-100"
                            : "border-[#0194f3] bg-blue-50 shadow-md shadow-blue-100"
                          : "border-gray-100 bg-gray-50 hover:border-gray-200"
                      }`}>
                      <span className={`font-black text-2xl leading-none ${
                        feeType === type ? (type === "partner" ? "text-emerald-600" : "text-[#0194f3]") : "text-gray-300"
                      }`}>
                        {type === "partner" ? "5%" : "10%"}
                      </span>
                      <span className={`text-[10px] font-bold text-center leading-tight px-1 ${
                        feeType === type ? (type === "partner" ? "text-emerald-700" : "text-[#0172B1]") : "text-gray-400"
                      }`}>
                        {type === "partner" ? "Jual Tiket Partner" : "Include Main Power"}
                      </span>
                    </button>
                  ))}
                </div>

                <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">Harga Tiket (Rp)</label>
                <div className="flex items-center gap-2 mb-5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#0194f3] focus-within:bg-blue-50/30 transition-all">
                  <span className="text-gray-400 font-bold text-sm">Rp</span>
                  <input type="text" inputMode="numeric" value={hargaTiket}
                    onChange={(e) => setHargaTiket(e.target.value)} placeholder="0"
                    className="bg-transparent flex-1 outline-none text-gray-900 font-bold text-base placeholder-gray-300" />
                </div>

                <div className={`rounded-2xl px-5 py-4 ${
                  feeType === "partner"
                    ? "bg-gradient-to-r from-emerald-50 to-white border border-emerald-100"
                    : "bg-gradient-to-r from-blue-50 to-white border border-blue-100"
                }`}>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Biaya Transaksi</p>
                      <p className={`font-black text-3xl leading-none ${feeType === "partner" ? "text-emerald-600" : "text-[#0194f3]"}`}>
                        Rp{biayaTransaksi.toLocaleString("id")}
                      </p>
                      <p className="text-gray-400 text-[10px] mt-1">per tiket ({feeType === "partner" ? "5%" : "10%"})</p>
                    </div>
                    {harga > 0 && (
                      <div className="text-right shrink-0">
                        <p className="text-gray-400 text-[10px] mb-0.5">Kamu terima</p>
                        <p className="font-black text-gray-800 text-xl leading-none">Rp{(harga - biayaTransaksi).toLocaleString("id")}</p>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 text-[10px] mt-2">* Simulasi estimasi. Nominal aktual mengikuti metode pembayaran.</p>
              </div>
            </div>
          </div>

          {/* ── Fitur Platform ── */}
          <div className="flex items-center gap-3 mb-2">
            <div className="h-7 w-1 rounded-full" style={{ background: "var(--pl-coral)" }} />
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#0194f3]">Sudah termasuk</p>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-1 ml-4">Fitur Platform</h2>
          <p className="text-gray-400 text-sm mb-7 ml-4">Lengkap untuk kelola event dari awal sampai selesai</p>

           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {features.map((f, idx) => (
              <div key={f.title}
                className={`rounded-2xl p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                  idx === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
                style={idx === 0
                   ? { background: "#2f4a47", boxShadow: "none" }
                  : { background: "#fffdf9", border: "1px solid #e2e8df" }}>
                <div className="mb-4 flex items-center justify-between">
                  <span className={`font-mono text-lg font-medium ${idx === 0 ? "text-white/70" : "text-[#0b79b5]"}`}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className={`h-px w-8 ${idx === 0 ? "bg-white/50" : "bg-[#0b79b5]"}`} />
                </div>
                <p className={`font-extrabold text-sm sm:text-[15px] mb-1.5 ${idx === 0 ? "text-white" : "text-gray-900"}`}>{f.title}</p>
                <p className={`text-xs sm:text-[13px] leading-relaxed ${idx === 0 ? "text-blue-100/70" : "text-gray-500"}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ CTA BOTTOM ════════════════════════════════════════════════ */}
        <div className="price-list-section price-list-final-cta max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10"
             style={{ background: "#fffdf9" }}>
            {/* Decoration */}
             <div className="pointer-events-none absolute -top-14 -right-14 w-64 h-64 rounded-full opacity-15 blur-2xl"
              style={{ background: "radial-gradient(circle, #bfe5ff, transparent)" }} />
            <div className="pointer-events-none absolute bottom-0 left-1/4 w-48 h-48 rounded-full opacity-10 blur-xl"
                     style={{ background: "radial-gradient(circle, #d9f1ff, transparent)" }} />
            <div className="pointer-events-none absolute -bottom-8 -right-8 w-40 h-40 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-4 -right-4 w-24 h-24 rounded-full border border-white/10" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              <div className="text-center sm:text-left">
                 <div className="inline-flex items-center gap-2 rounded-full border border-[#e5ddd3] bg-[#f1f5f4] px-3 py-1.5 mb-4">
                   <Zap className="h-3 w-3 text-[#0b79b5]" />
                   <span className="text-[#0b79b5] text-[11px] font-black uppercase tracking-widest">{content.cta.eyebrow}</span>
                </div>
                  <p className="text-[#173243] font-black text-2xl sm:text-3xl leading-tight mb-2">
                    {content.cta.titleLine1}<br />{content.cta.titleLine2}
                </p>
                 <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                    {content.cta.description}
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-3 shrink-0">
                  <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-7 py-4 rounded-2xl font-extrabold text-sm active:scale-95 transition-all"
                  style={{ background: "linear-gradient(135deg,#25D366,#1EBE57)", boxShadow: "0 6px 24px rgba(37,211,102,0.45)", color: "#fff" }}>
                  <MessageCircle className="h-5 w-5" />
                   {content.cta.buttonLabel}
                  <ArrowRight className="h-4 w-4" />
                </a>
                 <p className="text-gray-400 text-[11px]">{content.cta.emailText}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="price-list-mobile-cta sm:hidden">
          <div className="rounded-2xl border border-[#e5ddd3] bg-white p-3 shadow-[0_8px_28px_rgba(23,50,67,0.14)]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0b79b5]">Punya ide event?</p>
                <p className="mt-1 text-[11px] font-extrabold leading-tight text-[#173243]">Ceritakan kebutuhanmu ke tim Nempo.</p>
              </div>
              <a
                href={NEMPO_CONSULT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2.5 text-[11px] font-extrabold text-white shadow-sm"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Chat via DM</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
