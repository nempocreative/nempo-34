import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import "./digital-services.css";
import digitalServicesHeroImage from "@/assets/generated_images/digital-services-hero.jpg";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/lib/wouter";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  BadgeCheck,
  BookOpen,
  Calculator,
  Check,
  ChefHat,
  Circle,
  ChevronLeft,
  ChevronRight,
  ContactRound,
  FileText,
  Globe2,
  Heart,
  GraduationCap,
  Link2,
  ListOrdered,
  LayoutDashboard,
  Mail,
  Megaphone,
  Menu,
  MonitorSmartphone,
  MousePointer2,
  Palette,
  QrCode,
  Receipt,
  ReceiptText,
  Send,
  ShoppingBag,
  Smartphone,
  Star,
  Store,
  Ticket,
  Truck,
  Users,
  UserRound,
  Warehouse,
  WalletCards,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";

type PlatformId =
  | "super-app"
  | "ticketing"
  | "kasir"
  | "invitation"
  | "company"
  | "memories"
  | "marketing"
  | "crm"
  | "qr-menu"
  | "invoice"
  | "dapur-stock"
  | "gudang"
  | "hpp"
  | "resep"
  | "human-resource"
  | "link-bio"
  | "antrian"
  | "booking"
  | "loyalty"
  | "purchasing";

type Platform = {
  id: PlatformId;
  label: string;
  title: string;
  description: string;
  accent: string;
  accentSoft: string;
  icon: LucideIcon;
  features: string[];
  number: string;
  featured?: boolean;
};

const platforms: Platform[] = [
  {
    id: "super-app",
    label: "BUSINESS SUPER APP",
    title: "Business Super App",
    description:
      "Satu ruang kerja untuk menghubungkan pelanggan, penjualan, stok, dapur, keuangan, resep, supplier, dan tim dalam satu alur bisnis.",
    accent: "#0f766e",
    accentSoft: "#d7f1eb",
    icon: LayoutDashboard,
    features: ["Semua modul bisnis terhubung", "Satu dashboard untuk memantau usaha", "Bisa tumbuh sesuai kebutuhan"],
    number: "01",
    featured: true,
  },
  {
    id: "ticketing",
    label: "EVENT TICKETING",
    title: "Event Ticketing",
    description:
      "Jual tiket, atur kuota, dan pantau penjualan event dari satu dashboard yang rapi.",
    accent: "#ee6a4d",
    accentSoft: "#fbe0d7",
    icon: Ticket,
    features: ["Tiket online", "Check-in QR", "Dashboard penjualan"],
    number: "02",
  },
  {
    id: "kasir",
    label: "F&B POS",
    title: "Kasir",
    description:
      "Bantu tim kasir bekerja lebih cepat dengan order, stok, dan laporan penjualan yang terhubung.",
    accent: "#c9972c",
    accentSoft: "#f7e9b9",
    icon: ReceiptText,
    features: ["Order & meja", "Stok bahan", "Laporan harian"],
    number: "03",
  },
  {
    id: "invitation",
    label: "DIGITAL INVITATION",
    title: "Wedding Invitation",
    description:
      "Undangan wedding online yang personal, elegan, dan mudah dibagikan kepada keluarga serta tamu undangan.",
    accent: "#9b6b9f",
    accentSoft: "#eadcea",
    icon: Mail,
    features: ["RSVP online", "Galeri momen", "Ucapan tamu"],
    number: "04",
  },
  {
    id: "company",
    label: "COMPANY WEBSITE",
    title: "Company Website",
    description:
      "Bangun kesan pertama yang kuat dengan website company yang cepat, jelas, dan siap berkembang.",
     accent: "#0f766e",
     accentSoft: "#d7f1eb",
    icon: Globe2,
    features: ["Profil perusahaan", "Portofolio", "Form kontak"],
    number: "05",
  },
  {
    id: "memories",
    label: "MEMORIES BOOK",
    title: "Yearbook",
    description:
      "Simpan cerita satu angkatan dalam yearbook digital yang hangat, interaktif, dan mudah dibagikan.",
    accent: "#5570b8",
    accentSoft: "#e2e7f7",
    icon: GraduationCap,
    features: ["Profil angkatan", "Galeri kenangan", "Pesan teman"],
    number: "06",
  },
  {
    id: "marketing",
    label: "MARKETING TOOLS",
    title: "Marketing Tools",
    description:
      "Buat promosi lebih terarah dengan tools untuk merencanakan konten, mengelola campaign, dan membaca performa.",
    accent: "#d96c3f",
    accentSoft: "#f8e2d8",
    icon: Megaphone,
    features: ["Kalender konten", "Campaign terarah", "Analitik performa"],
    number: "07",
  },
  {
    id: "crm",
    label: "CUSTOMER RELATIONSHIP",
    title: "CRM",
    description:
      "Simpan data pelanggan, catat interaksi, dan bangun hubungan yang lebih dekat supaya pelanggan datang kembali.",
    accent: "#0f766e",
    accentSoft: "#d7f1eb",
    icon: ContactRound,
    features: ["Data pelanggan terpusat", "Riwayat interaksi", "Tindak lanjut lebih terarah"],
    number: "08",
  },
  {
    id: "qr-menu",
    label: "DIGITAL MENU",
    title: "QR Menu",
    description:
      "Buat pelanggan bisa melihat menu terbaru, harga, dan rekomendasi hanya dengan memindai satu QR code.",
    accent: "#0f766e",
    accentSoft: "#d7f1eb",
    icon: QrCode,
    features: ["Menu mudah diperbarui", "Foto dan detail produk", "Pesan dari meja"],
    number: "09",
  },
  {
    id: "invoice",
    label: "FINANCE & BILLING",
    title: "Invoice dan Faktur",
    description:
      "Buat invoice dan faktur dengan lebih rapi, lalu pantau status pembayaran tanpa harus mencari-cari dokumen.",
    accent: "#0891b2",
    accentSoft: "#cffafe",
    icon: FileText,
    features: ["Invoice profesional", "Faktur lebih tertata", "Status pembayaran"],
    number: "10",
  },
  {
    id: "dapur-stock",
    label: "KITCHEN OPERATIONS",
    title: "Dapur Stock",
    description:
      "Pantau bahan masuk, pemakaian, dan kebutuhan dapur agar operasional tetap siap dan minim bahan terbuang.",
    accent: "#0f766e",
    accentSoft: "#d7f1eb",
    icon: ChefHat,
    features: ["Stok bahan dapur", "Pencatatan pemakaian", "Peringatan stok menipis"],
    number: "11",
  },
  {
    id: "gudang",
    label: "INVENTORY MANAGEMENT",
    title: "Gudang",
    description:
      "Kelola stok dan pergerakan barang dari satu tempat, supaya tim tahu apa yang tersedia dan ke mana barang pergi.",
    accent: "#0f766e",
    accentSoft: "#d7f1eb",
    icon: Warehouse,
    features: ["Stok antar lokasi", "Barang masuk dan keluar", "Riwayat pergerakan"],
    number: "12",
  },
  {
    id: "hpp",
    label: "COST CONTROL",
    title: "HPP",
    description:
      "Hitung harga pokok penjualan dengan lebih jelas agar harga jual dan margin bisnis bisa ditentukan dengan percaya diri.",
    accent: "#be123c",
    accentSoft: "#ffe4e6",
    icon: Calculator,
    features: ["Komponen biaya terukur", "Margin lebih mudah dipantau", "Dasar harga jual yang jelas"],
    number: "13",
  },
  {
    id: "resep",
    label: "RECIPE MANAGEMENT",
    title: "Resep",
    description:
      "Simpan resep dan takaran standar agar rasa, porsi, dan biaya produksi tetap konsisten di setiap penyajian.",
    accent: "#0f766e",
    accentSoft: "#d7f1eb",
    icon: BookOpen,
    features: ["Resep dan takaran standar", "Versi resep terkontrol", "Terhubung ke HPP"],
    number: "14",
  },
  {
    id: "human-resource",
    label: "PEOPLE OPERATIONS",
    title: "Human Resource",
    description:
      "Rapikan data tim, jadwal, dan kebutuhan administrasi supaya pengelolaan orang di dalam bisnis terasa lebih ringan.",
    accent: "#0f766e",
    accentSoft: "#d7f1eb",
    icon: UserRound,
    features: ["Data anggota tim", "Jadwal kerja", "Administrasi lebih rapi"],
    number: "15",
  },
  {
    id: "link-bio",
    label: "DIGITAL PROFILE",
    title: "Link Bio",
    description:
      "Satukan semua tautan penting bisnis dalam satu halaman yang mudah dibagikan dari Instagram, TikTok, atau WhatsApp.",
    accent: "#0f766e",
    accentSoft: "#e6f6f3",
    icon: Link2,
    features: ["Satu tautan untuk semua kanal", "Profil dan katalog singkat", "Statistik kunjungan"],
    number: "16",
  },
  {
    id: "antrian",
    label: "QUEUE MANAGEMENT",
    title: "Sistem Antrian",
    description:
      "Buat alur kunjungan lebih nyaman dengan nomor antrian, panggilan pelanggan, dan status layanan yang bisa dipantau.",
    accent: "#0f766e",
    accentSoft: "#d7f1eb",
    icon: ListOrdered,
    features: ["Ambil nomor online", "Panggil antrian", "Pantau waktu tunggu"],
    number: "17",
  },
  {
    id: "booking",
    label: "RESERVATION SYSTEM",
    title: "Booking & Reservasi",
    description:
      "Atur jadwal kunjungan, reservasi meja, atau pemesanan layanan tanpa bentrok dan tanpa bolak-balik mencatat.",
    accent: "#0d9488",
    accentSoft: "#ccfbf1",
    icon: CalendarDays,
    features: ["Jadwal dan slot tersedia", "Konfirmasi otomatis", "Riwayat reservasi"],
    number: "18",
  },
  {
    id: "loyalty",
    label: "CUSTOMER RETENTION",
    title: "Loyalty & Membership",
    description:
      "Beri alasan pelanggan untuk kembali dengan poin, benefit, dan program membership yang terhubung ke data pelanggan.",
    accent: "#0f766e",
    accentSoft: "#d7f1eb",
    icon: Star,
    features: ["Poin dan stamp digital", "Benefit member", "Promo lebih personal"],
    number: "19",
  },
  {
    id: "purchasing",
    label: "PROCUREMENT",
    title: "Pembelian & Supplier",
    description:
      "Kelola kebutuhan belanja, pesanan supplier, dan penerimaan barang agar stok selalu punya dasar yang jelas.",
    accent: "#0f766e",
    accentSoft: "#d7f1eb",
    icon: Truck,
    features: ["Pesanan pembelian", "Data supplier", "Penerimaan barang"],
    number: "20",
  },
];

const activeButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl";

const pricingPlans = [
  {
    icon: Smartphone,
    eyebrow: "Paket ringan",
    title: "Mulai Online",
    price: "Rp79.000",
    regularPrice: "Rp99.000",
    saving: "Hemat Rp20.000/bulan",
    suffix: "/ bulan",
    setup: "Setup promo sekali bayar · Rp100.000",
    setupRegular: "Normal Rp200.000",
    description: "Untuk usaha yang ingin terlihat lebih siap dan mudah ditemukan pelanggan.",
    items: ["Link Bio + katalog singkat", "QR Menu yang mudah diperbarui", "Setup tampilan & konfigurasi awal"],
    note: "1 usaha · 1 cabang · 2 modul",
    firstMonth: "Rp179.000",
    bestFor: "Cocok untuk usaha yang baru mulai go digital.",
  },
  {
    icon: Store,
    eyebrow: "Paling dipilih",
    title: "Operasional Rapi",
    price: "Rp249.000",
    regularPrice: "Rp399.000",
    saving: "Hemat Rp150.000/bulan",
    suffix: "/ bulan",
    setup: "Setup promo sekali bayar · Rp250.000",
    setupRegular: "Normal Rp450.000",
    description: "Untuk mencatat transaksi, stok, dan laporan harian tanpa tambah rumit.",
    items: ["Kasir sederhana untuk transaksi harian", "Stok & HPP dasar", "Laporan penjualan harian", "Setup alur kerja awal"],
    note: "1 usaha · 1 cabang · hingga 4 modul",
    featured: true,
    firstMonth: "Rp499.000",
    bestFor: "Cocok untuk cafe, F&B, dan toko yang ingin lebih tertib.",
  },
  {
    icon: ContactRound,
    eyebrow: "Pelanggan tumbuh",
    title: "Usaha Bertumbuh",
    price: "Rp399.000",
    regularPrice: "Rp649.000",
    saving: "Hemat Rp250.000/bulan",
    suffix: "/ bulan",
    setup: "Setup promo sekali bayar · Rp350.000",
    setupRegular: "Normal Rp650.000",
    description: "Untuk usaha yang ingin pelanggan kembali dan promosi lebih terarah.",
    items: ["CRM pelanggan dan riwayat interaksi", "Loyalty sederhana: poin & stamp", "Marketing Tools untuk campaign", "Setup segmentasi pelanggan awal"],
    note: "1 usaha · 1 cabang · hingga 6 modul",
    firstMonth: "Rp749.000",
    bestFor: "Cocok untuk usaha yang sudah punya pelanggan tetap.",
  },
  {
    icon: LayoutDashboard,
    eyebrow: "Terhubung",
    title: "Super App",
    price: "Rp699.000",
    regularPrice: "Rp1.099.000",
    saving: "Hemat Rp400.000/bulan",
    suffix: "/ bulan",
    setup: "Setup promo sekali bayar · Rp750.000",
    setupRegular: "Normal Rp1.200.000",
    description: "Untuk menyatukan modul penting bisnis dalam satu ruang kerja yang bisa berkembang.",
    items: ["Pilih hingga 10 modul bisnis", "Dashboard terpadu untuk memantau usaha", "Modul saling terhubung", "Pendampingan implementasi awal"],
    note: "1 usaha · 1 cabang · modul tambahan opsional",
    firstMonth: "Rp1.449.000",
    bestFor: "Cocok untuk bisnis dengan alur operasional yang lebih kompleks.",
  },
];

const unitServices = [
  { icon: Mail, title: "Wedding Invitation", price: "Rp199.000", billing: "sekali bayar", detail: "RSVP, galeri, ucapan, musik, dan link share" },
  { icon: Ticket, title: "Event Ticketing", price: "Rp499.000", billing: "per event", detail: "Tiket online, QR check-in, dan dashboard peserta" },
  { icon: ReceiptText, title: "Kasir", price: "Rp149.000", billing: "per bulan", detail: "Order, meja, stok bahan, dan laporan harian" },
  { icon: Globe2, title: "Company Website", price: "Rp1.500.000", billing: "sekali buat", detail: "Profil usaha, portofolio, dan form kontak" },
  { icon: GraduationCap, title: "Yearbook Digital", price: "Rp15.000", billing: "per siswa", detail: "Profil angkatan, galeri, dan pesan teman" },
  { icon: Megaphone, title: "Marketing Tools", price: "Rp249.000", billing: "per bulan", detail: "Kalender konten, campaign, dan analitik" },
  { icon: ContactRound, title: "CRM", price: "Rp149.000", billing: "per bulan", detail: "Data pelanggan, riwayat interaksi, dan follow-up" },
  { icon: QrCode, title: "QR Menu", price: "Rp49.000", billing: "per bulan", detail: "Menu digital, foto produk, dan update harga" },
  { icon: FileText, title: "Invoice & Faktur", price: "Rp79.000", billing: "per bulan", detail: "Invoice profesional dan status pembayaran" },
  { icon: ChefHat, title: "Dapur Stock", price: "Rp99.000", billing: "per bulan", detail: "Stok bahan, pemakaian, dan peringatan stok" },
  { icon: Warehouse, title: "Gudang", price: "Rp99.000", billing: "per bulan", detail: "Barang masuk, keluar, dan riwayat pergerakan" },
  { icon: Calculator, title: "HPP", price: "Rp79.000", billing: "per bulan", detail: "Komponen biaya, margin, dan dasar harga jual" },
  { icon: BookOpen, title: "Resep", price: "Rp79.000", billing: "per bulan", detail: "Resep standar, takaran, dan kontrol versi" },
  { icon: UserRound, title: "Human Resource", price: "Rp129.000", billing: "per bulan", detail: "Data tim, jadwal kerja, dan administrasi" },
  { icon: Link2, title: "Link Bio", price: "Rp49.000", billing: "per bulan", detail: "Satu halaman untuk semua tautan bisnis" },
  { icon: ListOrdered, title: "Sistem Antrian", price: "Rp149.000", billing: "per bulan", detail: "Nomor online, panggilan, dan status layanan" },
  { icon: CalendarDays, title: "Booking & Reservasi", price: "Rp149.000", billing: "per bulan", detail: "Jadwal, slot, konfirmasi, dan riwayat reservasi" },
  { icon: Star, title: "Loyalty & Membership", price: "Rp129.000", billing: "per bulan", detail: "Poin, stamp, benefit, dan promo pelanggan" },
  { icon: Truck, title: "Pembelian & Supplier", price: "Rp99.000", billing: "per bulan", detail: "Pesanan pembelian, supplier, dan penerimaan barang" },
  { icon: LayoutDashboard, title: "Business Super App", price: "Rp699.000", billing: "mulai per bulan", detail: "Gabungkan hingga 10 modul dalam satu dashboard" },
];

const unitPriceFilters = ["Semua layanan", "Bulanan", "Sekali bayar", "Event & sekolah"] as const;

type UnitPriceFilter = (typeof unitPriceFilters)[number];

function getUnitPriceFilter(billing: string): Exclude<UnitPriceFilter, "Semua layanan"> {
  if (billing.includes("bulan")) return "Bulanan";
  if (billing.includes("bayar") || billing.includes("buat")) return "Sekali bayar";
  return "Event & sekolah";
}

function getSuperAppDemoHref(serviceId: PlatformId) {
  const moduleId = serviceId === "super-app" ? "business-super-app" : serviceId === "memories" ? "yearbook" : serviceId;
  if (moduleId === "ticketing") return "/digital-services/ticketing";
  if (moduleId === "kasir") return "/digital-services/kasir";
  if (moduleId === "invitation") return "/digital-services/invitation";
  if (moduleId === "company") return "/digital-services/company";
  if (moduleId === "yearbook") return "/digital-services/yearbook";
  if (moduleId === "marketing") return "/digital-services/marketing";
  if (moduleId === "qr-menu") return "/digital-services/qr-menu";
  if (moduleId === "crm") return "/digital-services/crm";
  if (moduleId === "invoice") return "/digital-services/invoice";
  if (moduleId === "dapur-stock") return "/digital-services/dapur-stock";
  if (moduleId === "hpp") return "/digital-services/hpp";
  if (moduleId === "resep") return "/digital-services/resep";
  if (moduleId === "human-resource") return "/digital-services/human-resource";
  if (moduleId === "link-bio") return "/digital-services/link-bio";
  if (moduleId === "antrian") return "/digital-services/antrian";
  if (moduleId === "booking") return "/digital-services/booking";
  if (moduleId === "purchasing") return "/digital-services/purchasing";
  if (moduleId === "loyalty") return "/digital-services/loyalty";
  if (moduleId === "gudang") return "/digital-services/gudang";
  return `/digital-services/super-app?module=${moduleId}`;
}

export default function DigitalServicesPage() {
  const [selectedId, setSelectedId] = useState<PlatformId>("super-app");
  const [unitPriceFilter, setUnitPriceFilter] = useState<UnitPriceFilter>("Semua layanan");
  const [consultation, setConsultation] = useState({
    businessType: "",
    branches: "1",
    needs: "",
    modules: "",
  });
  const [consultationReady, setConsultationReady] = useState(false);
  const servicesCarouselRef = useRef<HTMLDivElement>(null);
  const selected = platforms.find((platform) => platform.id === selectedId) ?? platforms[0];
  const visibleUnitServices = unitServices.filter(({ billing }) =>
    unitPriceFilter === "Semua layanan" || getUnitPriceFilter(billing) === unitPriceFilter
  );

  const moveServicesCarousel = (direction: number) => {
    servicesCarouselRef.current?.scrollBy({
      left: direction * servicesCarouselRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const handleConsultationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const summary = [
      "Halo Nempo, saya ingin konsultasi Digi Nempo.",
      `Jenis bisnis: ${consultation.businessType}`,
      `Jumlah cabang: ${consultation.branches}`,
      `Kebutuhan utama: ${consultation.needs}`,
      `Layanan yang diminati: ${consultation.modules || "Mohon dibantu rekomendasikan"}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      // Clipboard may be unavailable in an embedded preview; Instagram still opens.
    }
    setConsultationReady(true);
    window.open(NEMPO_CONSULT_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <Layout>
      <SEO
        title="Digi Nempo"
        description="Digi Nempo menghadirkan solusi digital yang saling terhubung untuk bisnis: Business Super App, CRM, QR Menu, invoice, stok, HPP, resep, antrian, reservasi, dan lainnya."
        keywords="Business Super App, CRM, QR Menu, invoice, faktur, stok dapur, gudang, HPP, resep, Human Resource, Link Bio, Sistem Antrian, Booking, Loyalty, Supplier, digitalisasi bisnis Garut"
        path="/digital-services"
      />

      <main className="digital-services-page min-h-screen overflow-x-clip bg-gray-50">
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-7 lg:px-8">
            <div className="flex items-center justify-between gap-5">
              <div>
                <h1 className="mt-1 text-2xl font-extrabold leading-tight text-cyan-600 md:text-3xl">Digi Nempo</h1>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">Pilih layanan digital sesuai kebutuhanmu.</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl">
                <MonitorSmartphone className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
              {[
                 { label: "Pilihan layanan", icon: LayoutDashboard },
                 { label: "Harga paket & satuan", icon: Check },
                 { label: "Demo tersedia", icon: BadgeCheck },
              ].map(({ label, icon: Icon }) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-cyan-100 bg-cyan-50/70 px-3 py-1.5 text-[11px] font-bold text-cyan-700">
                  <Icon className="h-3.5 w-3.5" /> {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-8 px-4 pb-24 pt-6 md:pb-10 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-white shadow-sm sm:rounded-3xl">
            <div className="grid items-center gap-5 p-4 sm:gap-6 sm:p-8 lg:grid-cols-[1.1fr_.9fr] lg:p-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Digi Nempo</p>
                <h2 className="mt-2 max-w-xl text-[2rem] font-extrabold leading-[1.12] tracking-tight text-gray-900 sm:text-4xl sm:leading-tight">
                  Layanan digital untuk bisnis, event, dan usaha lokal.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                   Pilih layanan yang kamu butuhkan. Lihat demo, cek harga, lalu konsultasikan penyiapannya dengan tim Nempo.
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <a href="#harga-satuan" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-cyan-600/20 transition-colors hover:bg-cyan-700 sm:w-auto">
                    Lihat harga <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="#platforms" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 py-3 text-sm font-bold text-cyan-700 transition-colors hover:bg-cyan-50 sm:w-auto">
                    Lihat layanan <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <figure className="relative min-h-[270px] overflow-hidden rounded-2xl border-4 border-white bg-[#123e55] shadow-lg shadow-cyan-900/10 sm:min-h-[340px]">
                <img
                  src={digitalServicesHeroImage}
                  alt="Pemilik usaha lokal mengelola bisnis dengan perangkat digital"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123e55]/90 via-[#123e55]/15 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-[#123e55]/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                  Digital workspace
                </div>
                <figcaption className="absolute inset-x-4 bottom-4">
                  <p className="text-lg font-black leading-tight text-white sm:text-xl">Kerja lebih rapi, tumbuh lebih siap.</p>
                  <p className="mt-1 max-w-xs text-xs leading-5 text-white/75">Satu ekosistem untuk membantu usaha bergerak lebih ringan.</p>
                </figcaption>
              </figure>
            </div>
          </section>

          <section id="platforms">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                  <h2 className="text-xl font-extrabold text-gray-900">Pilih layanan</h2>
                  <p className="mt-1 text-xs text-gray-400">Klik layanan untuk melihat fungsi dan demo yang tersedia.</p>
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="text-xs font-bold text-cyan-600">Layanan digital</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveServicesCarousel(-1)}
                    aria-label="Layanan sebelumnya"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-100 bg-white text-cyan-700 shadow-sm transition-colors hover:bg-cyan-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveServicesCarousel(1)}
                    aria-label="Layanan berikutnya"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-100 bg-white text-cyan-700 shadow-sm transition-colors hover:bg-cyan-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

             <div ref={servicesCarouselRef} className="services-carousel-scroll overflow-x-auto px-1 py-1 pb-2">
              <div className="services-carousel-track">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = platform.id === selected.id;
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => setSelectedId(platform.id)}
                    aria-pressed={isSelected}
                    aria-label={`Pilih layanan ${platform.title}`}
                    className={`service-platform-card group relative min-h-[150px] rounded-2xl border p-4 text-left shadow-sm sm:min-h-[170px] ${isSelected ? "service-platform-card-active border-cyan-300" : "border-gray-100 bg-white"}`}
                    style={isSelected ? { backgroundColor: platform.accentSoft } : undefined}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Icon className="h-5 w-5" style={{ color: platform.accent }} />
                    </div>
                     <h3 className="mt-8 text-sm font-extrabold leading-tight text-gray-800">{platform.title}</h3>
                     <p className="mt-1 text-[11px] leading-4 text-gray-400">{platform.features[0]}</p>
                     <ArrowUpRight className="absolute bottom-3 right-4 h-4 w-4 text-gray-300 transition-colors group-hover:text-cyan-600" />
                  </button>
                );
              })}
              </div>
            </div>
            <p className="mt-2 text-center text-[10px] font-semibold text-gray-400 sm:hidden">Geser untuk melihat layanan lainnya</p>

            <div className="mt-5 grid overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:rounded-3xl lg:grid-cols-[.78fr_1.22fr]">
              <div className="p-4 sm:p-7 lg:p-8" key={selected.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ backgroundColor: selected.accentSoft, color: selected.accent }}>
                    <selected.icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-gray-50 px-3 py-1.5 text-[10px] font-bold text-gray-500">Detail layanan</span>
                </div>
                <h3 className="mt-2 max-w-md text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">{selected.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">{selected.description}</p>
                <div className="mt-5 space-y-2.5">
                  {selected.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5 text-sm font-semibold text-gray-700">
                      <span className="grid h-5 w-5 place-items-center rounded-full text-white" style={{ backgroundColor: selected.accent }}>
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>
                <Link href={getSuperAppDemoHref(selected.id)} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-cyan-600/20 transition-colors hover:bg-cyan-700">
                  Lihat demo layanan <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div id="service-preview" className="border-t border-gray-100 p-2.5 sm:p-5 lg:border-l lg:border-t-0" style={{ backgroundColor: selected.accentSoft }} key={`preview-${selected.id}`}>
                <PlatformPreview platform={selected} />
              </div>
            </div>
          </section>

          <section id="paket">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Paket layanan</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight text-gray-900">Gabungkan layanan dengan harga lebih hemat.</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Paket cocok untuk bisnis yang membutuhkan lebih dari satu layanan.
              </p>
             <p className="mt-3 inline-flex max-w-2xl rounded-xl border border-cyan-100 bg-cyan-50/70 px-3 py-2 text-[11px] leading-5 text-cyan-800">
                  <strong className="mr-1">Catatan:</strong> bulan pertama mencakup paket dan setup satu kali. Bulan berikutnya hanya biaya paket.
              </p>
            </div>
             <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {pricingPlans.map(({ icon: Icon, eyebrow, title, price, regularPrice, saving, suffix, setup, setupRegular, description, items, note, firstMonth, bestFor, featured }, index) => (
                  <div
                    key={title}
                     className={`pricing-card group relative flex h-full flex-col rounded-2xl border p-4 shadow-sm sm:rounded-3xl sm:p-5 ${featured ? "pricing-card-featured border-cyan-300 bg-cyan-50/60 ring-2 ring-cyan-100" : "border-gray-100 bg-white"}`}
                    style={{ "--pricing-delay": `${index * 90}ms` } as React.CSSProperties}
                  >
                   <div className="pricing-card-glow" aria-hidden="true" />
                   <div className="pricing-card-orbit pricing-card-orbit-one" aria-hidden="true" />
                   <div className="pricing-card-orbit pricing-card-orbit-two" aria-hidden="true" />
                   <span className={`pricing-card-badge absolute right-4 top-4 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${featured ? "bg-cyan-600 text-white" : "bg-orange-50 text-orange-600"}`}>
                     <span className="pricing-card-badge-dot" aria-hidden="true" /> {featured ? "Rekomendasi" : "Harga promo"}
                   </span>
                   <div className="pricing-card-icon-wrap flex items-center justify-between">
                     <div className={`pricing-card-icon grid h-10 w-10 place-items-center rounded-xl ${featured ? "bg-cyan-600 text-white" : "bg-gray-100 text-cyan-700"}`}><Icon className="h-5 w-5" /></div>
                   </div>
                   <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-600">{eyebrow}</p>
                   <h3 className="mt-1 text-base font-extrabold text-gray-900">{title}</h3>
                   <div className="pricing-card-price mt-4">
                     <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-orange-600">Harga promo</p>
                     <div className="mt-0.5 flex items-baseline gap-1">
                       <span className="tabular-nums text-2xl font-black tracking-tight text-gray-900">{price}</span>
                       <span className="text-xs font-semibold text-gray-400">{suffix}</span>
                     </div>
                     <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
                       <span className="tabular-nums text-gray-400 line-through">{regularPrice}</span>
                       <span className="pricing-card-saving text-emerald-600">{saving}</span>
                     </div>
                   </div>
                    <div className="pricing-card-first-month mt-3 rounded-2xl border border-orange-100 bg-orange-50/70 p-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-orange-700">Bayar bulan pertama</p>
                      <p className="mt-1 text-xl font-black tracking-tight text-gray-900">{firstMonth}</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-gray-500">{price} paket + {setup.replace("Setup promo sekali bayar · ", "")} setup</p>
                      <p className="mt-1 text-[10px] font-semibold text-gray-400 line-through">{setupRegular}</p>
                    </div>
                    <p className="mt-3 min-h-10 text-xs leading-5 text-gray-500">{description}</p>
                    <div className="pricing-card-features mt-4 rounded-2xl bg-gray-50 p-3.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-500">Dapat apa saja?</p>
                      <div className="mt-2.5 space-y-2">
                        {items.map((item) => <div key={item} className="flex items-start gap-2 text-xs font-semibold leading-4 text-gray-700"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-600" /> {item}</div>)}
                      </div>
                   </div>
                    <p className="mt-3 text-[10px] font-semibold leading-4 text-gray-500"><span className="font-black text-gray-700">Untuk siapa?</span> {bestFor}</p>
                    <p className="mt-3 border-t border-gray-100 pt-3 text-[10px] font-semibold text-gray-400">{note} · bulan berikutnya {price}</p>
                    <a href="#konsultasi" className={`pricing-card-cta mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 pt-2.5 text-xs font-bold transition-colors ${featured ? "bg-cyan-600 text-white hover:bg-cyan-700" : "border border-cyan-200 bg-white text-cyan-700 hover:bg-cyan-50"}`}>
                     Konsultasikan paket <ArrowRight className="h-3.5 w-3.5" />
                   </a>
                 </div>
               ))}
             </div>
            <p className="mt-3 text-center text-[10px] font-semibold leading-5 text-gray-400">
              Promo launching berlaku untuk pelanggan baru dalam periode terbatas. Modul tambahan mulai Rp50.000/bulan; harga final menyesuaikan jumlah modul, data, dan kebutuhan tampilan.
            </p>
          </section>

          <section id="harga-satuan" className="overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-sm">
            <div className="grid gap-6 bg-gradient-to-br from-cyan-50 via-white to-amber-50/60 p-5 sm:p-7 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Harga satuan</p>
                <h2 className="mt-2 max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">Bayar hanya layanan yang kamu pilih.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                  Lihat harga awal dan cara pembayarannya di bawah.
                </p>
                <div className="mt-4 grid gap-2 text-[10px] font-bold text-cyan-700 sm:grid-cols-2">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 shadow-sm"><BadgeCheck className="h-3.5 w-3.5 shrink-0" /> Harga mulai jelas</span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 shadow-sm"><Check className="h-3.5 w-3.5 shrink-0" /> Bisa tambah layanan</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-600">Contoh mulai paling ringan</p>
                <div className="mt-3 space-y-2">
                  {unitServices.filter(({ title }) => ["Link Bio", "QR Menu", "Invoice & Faktur"].includes(title)).map(({ title, price, billing }) => (
                    <div key={title} className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <span className="text-xs font-bold text-gray-700">{title}</span>
                      <span className="text-right">
                        <strong className="block text-sm font-black text-cyan-700">{price}</strong>
                        <small className="block text-[9px] font-semibold text-gray-400">{billing}</small>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">Pilih layanan yang paling relevan</h3>
                  <p className="mt-1 text-xs text-gray-400">Harga awal yang transparan untuk kebutuhan bisnis, event, dan personal.</p>
                </div>
                <span className="text-[10px] font-bold text-gray-400">Harga mulai</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter harga layanan">
                {unitPriceFilters.map((filter) => {
                  const active = unitPriceFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setUnitPriceFilter(filter)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[10px] font-extrabold transition-colors ${
                        active
                          ? "border-cyan-600 bg-cyan-600 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-500 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleUnitServices.map(({ title, price, billing, detail }) => (
                  <div key={title} className="group flex min-h-[178px] flex-col rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50/40 hover:shadow-sm">
                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold leading-5 text-gray-900">{title}</h3>
                      <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                        <span className="tabular-nums text-base font-black text-cyan-700">{price}</span>
                        <span className="rounded-full bg-white px-1.5 py-0.5 text-[9px] font-bold text-gray-400">{billing}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-[11px] leading-4 text-gray-500">{detail}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setConsultation((current) => ({ ...current, modules: title }));
                        document.getElementById("konsultasi")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[10px] font-black text-cyan-700 transition-colors hover:text-cyan-900"
                    >
                      Bahas layanan ini <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                    </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                  <p className="text-xs leading-5 text-violet-900">
                    <strong>Wedding Invitation mulai Rp199.000 sekali bayar.</strong> Sudah termasuk RSVP, galeri, ucapan tamu, musik, dan link undangan. Custom domain, revisi tambahan, dan kebutuhan khusus dapat dikonsultasikan terpisah.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl bg-gray-50 px-4 py-3 sm:flex-row sm:items-center">
                <p className="text-[10px] font-semibold leading-5 text-gray-500">Harga satuan cocok untuk mulai dari satu kebutuhan. Kalau mengambil 2 layanan atau lebih, paket promo di atas biasanya lebih hemat.</p>
                <a href="#paket" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-3.5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-orange-600">
                  Bandingkan dengan paket <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </section>

           <section id="cara-mulai" className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Cara mulai</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight text-gray-900">Tiga langkah untuk mulai.</h2>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                  { title: "Pilih layanan", text: "Tentukan layanan atau paket yang kamu butuhkan." },
                  { title: "Konsultasi", text: "Bahas kebutuhan, harga, dan isi layanan dengan Nempo." },
                  { title: "Setup", text: "Tim Nempo menyiapkan sistem sesuai kesepakatan." },
                ].map(({ title, text }) => (
                  <div key={title} className="rounded-2xl bg-gray-50 p-4">
                    <h3 className="text-sm font-extrabold text-gray-800">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-gray-500">{text}</p>
                  </div>
                ))}
            </div>
          </section>

          <section id="konsultasi" className="grid overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-sm lg:grid-cols-[.78fr_1.22fr]">
            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-5 text-[#123e55] sm:p-7 lg:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border-[24px] border-cyan-200/30" />
              <div className="pointer-events-none absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-cyan-200/30 blur-3xl" />
              <div className="relative">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-700">Konsultasi Digi Nempo</p>
                <h2 className="mt-4 max-w-sm text-2xl font-extrabold leading-tight sm:text-3xl">Belum yakin memilih layanan?</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                  Isi data singkat di samping. Kami bantu memilih layanan, paket, dan kebutuhan setup.
                </p>
                <div className="mt-8 border-t border-cyan-200/70 pt-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-700">Yang dibahas</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Layanan", "Harga", "Setup"].map((item) => (
                      <span key={item} className="rounded-full border border-cyan-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold text-cyan-800">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={handleConsultationSubmit} className="p-5 sm:p-7 lg:p-8">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-600">Form kebutuhan</p>
                <h3 className="mt-2 text-xl font-extrabold leading-tight text-gray-900">Kirim kebutuhanmu</h3>
                <p className="mt-2 text-xs leading-5 text-gray-500">Jawab singkat. Ringkasannya akan disiapkan untuk chat WhatsApp.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-gray-700">
                  Jenis bisnis
                  <input
                    required
                    value={consultation.businessType}
                    onChange={(event) => setConsultation((current) => ({ ...current, businessType: event.target.value }))}
                    placeholder="Contoh: cafe, salon, retail"
                    className="mt-2 w-full rounded-xl border border-cyan-100 bg-white px-3 py-3 text-sm font-normal text-gray-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
                <label className="text-xs font-bold text-gray-700">
                  Jumlah cabang
                  <select
                    value={consultation.branches}
                    onChange={(event) => setConsultation((current) => ({ ...current, branches: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-cyan-100 bg-white px-3 py-3 text-sm font-normal text-gray-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="1">1 cabang</option>
                    <option value="2–5">2–5 cabang</option>
                    <option value="6+">6 cabang atau lebih</option>
                  </select>
                </label>
              </div>
              <label className="mt-4 block text-xs font-bold text-gray-700">
                Kendala utama saat ini
                <textarea
                  required
                  value={consultation.needs}
                  onChange={(event) => setConsultation((current) => ({ ...current, needs: event.target.value }))}
                  placeholder="Contoh: stok sering tidak sesuai dan laporan masih manual"
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-cyan-100 bg-white px-3 py-3 text-sm font-normal text-gray-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </label>
              <label className="mt-4 block text-xs font-bold text-gray-700">
                Layanan yang diminati <span className="font-normal text-gray-400">(opsional)</span>
                <input
                  value={consultation.modules}
                  onChange={(event) => setConsultation((current) => ({ ...current, modules: event.target.value }))}
                  placeholder="Contoh: CRM, Kasir, Gudang"
                  className="mt-2 w-full rounded-xl border border-cyan-100 bg-white px-3 py-3 text-sm font-normal text-gray-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </label>
               <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                   <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-cyan-600/20 transition-colors hover:bg-cyan-700 sm:w-auto">
                  Kirim ke Instagram <ArrowUpRight className="h-4 w-4" />
                </button>
                {consultationReady ? <span className="text-xs font-semibold text-emerald-600">Ringkasan sudah disiapkan untuk chat WhatsApp.</span> : null}
              </div>
              <p className="mt-4 text-[10px] leading-4 text-gray-400">Instagram Nempo akan terbuka di tab baru.</p>
            </form>
          </section>

           <section id="faq" className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Pertanyaan yang sering muncul</p>
              <h2 className="mt-2 text-2xl font-extrabold text-gray-900">Masih ingin tahu sebelum mulai?</h2>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {[
                { question: "Bisa mulai dari satu layanan?", answer: "Bisa. Pilih satu layanan, lalu tambahkan layanan lain saat dibutuhkan." },
                { question: "Apakah harga sudah termasuk setup?", answer: "Paket menampilkan biaya setup satu kali dan biaya bulanan secara terpisah." },
                { question: "Bisa disesuaikan dengan bisnis saya?", answer: "Bisa. Detail kebutuhan dan penyesuaian dibahas saat konsultasi." },
                { question: "Bagaimana cara memulai?", answer: "Pilih layanan, isi form konsultasi, lalu lanjutkan pembahasan melalui WhatsApp Nempo." },
              ].map(({ question, answer }) => (
                <details key={question} className="group rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-extrabold text-gray-800">
                    {question}
                    <ChevronRight className="h-4 w-4 shrink-0 text-cyan-600 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 max-w-xl text-xs leading-5 text-gray-500">{answer}</p>
                </details>
              ))}
            </div>
          </section>

           <section className="rounded-2xl bg-[#0f766e] p-4 text-white shadow-lg shadow-teal-800/20 sm:rounded-3xl sm:p-8">
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Siap merapikan bisnis?</p>
                <h2 className="mt-2 max-w-2xl text-2xl font-extrabold leading-tight sm:text-3xl">Ceritakan kebutuhanmu, kami bantu pilihkan alurnya.</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">Sebutkan jenis bisnis, kendala utama, dan layanan yang sedang kamu pertimbangkan.</p>
              </div>
               <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#0f766e] transition-colors hover:bg-[#f2f8f7] sm:w-auto">
                Konsultasi sekarang <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}

function RouteMap() {
  const routeItems = [
    { icon: Ticket, label: "Ticketing", detail: "Event & check-in", accent: "coral" },
    { icon: ReceiptText, label: "F&B POS", detail: "Order & operasional", accent: "sun" },
    { icon: Mail, label: "Invitation", detail: "Momen & RSVP", accent: "sea" },
    { icon: Globe2, label: "Company", detail: "Brand & website", accent: "lilac" },
    { icon: GraduationCap, label: "Memories Book", detail: "Yearbook & cerita", accent: "coral" },
  ];

  return (
    <div className="route-card rise-in delay-2 mx-auto w-full max-w-[520px]">
      <div className="relative z-10 flex items-start justify-between border-b border-[#f5efe4]/25 px-5 py-4">
         <div><p className="mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#f3c968]">Nempo / digital map</p><p className="display mt-1 text-xl font-black tracking-[-0.04em] text-[#f5efe4]">Lima arah. Satu sistem.</p></div>
         <span className="mono border border-[#f5efe4]/25 px-2 py-1 text-[9px] font-bold text-[#f3c968]">05</span>
      </div>
      <div className="route-map-grid">
        {routeItems.map(({ icon: Icon, label, detail, accent }, index) => (
             <div key={label} className={`route-map-item ${accent} ${index === routeItems.length - 1 ? "route-map-item-wide" : ""}`}>
            <div className="flex items-start justify-between">
              <div className="route-map-icon"><Icon className="h-4 w-4" /></div>
              <span className="mono text-[8px] font-bold opacity-60">0{index + 1}</span>
            </div>
            <div className="mt-5">
              <p className="text-[11px] font-black tracking-[-0.02em]">{label}</p>
              <p className="mono mt-1 text-[8px] uppercase tracking-[0.08em] opacity-55">{detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mono flex items-center justify-between border-t border-[#f5efe4]/25 px-5 py-3 text-[8px] font-bold uppercase tracking-[0.14em] text-[#f5efe4]/55">
         <span>One studio / five products</span>
        <span className="text-[#f3c968]">Built in Garut</span>
      </div>
    </div>
  );
}

function HeroCommandCenter() {
  return (
    <div className="relative mx-auto h-[390px] w-full max-w-xl sm:h-[430px]">
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/15 blur-3xl" />
      <div className="absolute left-6 top-10 h-56 w-56 rounded-full border border-cyan-200/10" />
      <div className="absolute bottom-2 right-4 h-40 w-40 rounded-full border border-violet-200/10" />

      <div className="absolute left-0 top-12 z-10 w-56 -rotate-6 rounded-3xl border border-violet-200/20 bg-[#f4efff] p-3 text-slate-900 shadow-2xl shadow-black/20 sm:left-3 sm:w-64">
        <div className="flex items-center justify-between border-b border-violet-200/70 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Ticket className="h-3.5 w-3.5" />
            </div>
            <p className="text-[10px] font-black">Event ticketing</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-violet-500">Riuh Rona</p>
          <p className="mt-1 text-xs font-black">Tiket event lebih rapi</p>
          <div className="mt-3 flex gap-1.5">
            {["Tiket", "QR", "Tamu"].map((item) => (
              <span key={item} className="rounded-full bg-violet-50 px-2 py-1 text-[8px] font-bold text-violet-600">{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-2 z-10 w-52 rotate-6 rounded-3xl border border-cyan-100/40 bg-[#e8fbff] p-3 text-slate-900 shadow-2xl shadow-black/20 sm:right-1 sm:w-60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-600 text-white">
              <Globe2 className="h-3.5 w-3.5" />
            </div>
            <p className="text-[10px] font-black">Company website</p>
          </div>
          <Menu className="h-4 w-4 text-cyan-700" />
        </div>
        <div className="relative mt-3 h-24 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-900 p-3 text-white">
          <div className="absolute -right-5 -top-8 h-24 w-24 rounded-full border border-white/30" />
          <p className="relative text-[8px] font-bold text-white/70">ARUNA STUDIO</p>
          <p className="relative mt-5 max-w-[8rem] text-sm font-black leading-tight">Make your brand matter.</p>
        </div>
      </div>

      <div className="absolute inset-x-7 top-14 z-20 overflow-hidden rounded-[2rem] border border-white/20 bg-[#0c2344]/90 p-3 shadow-2xl shadow-black/35 backdrop-blur-md sm:inset-x-14 sm:top-16 sm:p-4">
        <div className="flex items-center justify-between border-b border-white/10 px-2 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-300 text-[#07152f]">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-black">Digi Nempo</p>
              <p className="text-[9px] text-white/40">Satu ruang untuk semua alur</p>
            </div>
          </div>
           <LayoutDashboard className="h-4 w-4 text-cyan-200" />
        </div>
        <div className="relative mt-3 overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-[#173968] via-[#103055] to-[#0c2344] p-4 sm:p-5">
          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-cyan-300/15 blur-2xl" />
          <div className="relative">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-cyan-200/75">Digital product studio</p>
            <p className="mt-3 max-w-[15rem] text-2xl font-black leading-[0.95] tracking-tight text-white sm:text-3xl">
              Build something people remember.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="h-1.5 w-16 rounded-full bg-cyan-300" />
              <span className="h-1.5 w-7 rounded-full bg-violet-300" />
              <span className="h-1.5 w-2 rounded-full bg-pink-300" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-1 pt-3 sm:grid-cols-4">
          {[
            { icon: Ticket, label: "Ticketing", color: "#c4b5fd" },
            { icon: Store, label: "F&B POS", color: "#fdba74" },
            { icon: Mail, label: "Invitation", color: "#f9a8d4" },
            { icon: Globe2, label: "Company", color: "#67e8f9" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-2">
              <Icon className="h-3.5 w-3.5" style={{ color }} />
              <span className="text-[8px] font-bold text-white/60">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-3 right-1 z-30 flex w-48 items-center gap-3 rounded-2xl border border-pink-100/40 bg-white p-3 text-slate-900 shadow-2xl shadow-black/25 sm:right-4 sm:w-56">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
          <Mail className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-black">Invitation digital</p>
          <p className="mt-1 text-[9px] leading-4 text-gray-400">Buat momen terasa lebih dekat.</p>
        </div>
        <ArrowRight className="ml-auto h-4 w-4 text-pink-500" />
      </div>

      <div className="absolute bottom-0 left-8 z-30 flex items-center gap-2 rounded-full border border-orange-100/30 bg-orange-100 px-3 py-2 text-orange-700 shadow-xl shadow-black/20 sm:left-14">
        <Store className="h-3.5 w-3.5" />
        <span className="text-[9px] font-black">Kasir F&B</span>
      </div>
    </div>
  );
}

function PreviewShell({
  platform,
  children,
}: {
  platform: Platform;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto h-full max-w-2xl overflow-hidden rounded-3xl border border-[#e5dbd0] bg-[#fbfaf7] shadow-[0_18px_45px_rgba(83,56,39,0.12)]">
      <div className="flex items-center gap-1.5 border-b border-[#eee5dc] bg-[#fbfaf7] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <div className="ml-3 flex-1 rounded-lg bg-[#f5f0e9] px-3 py-1.5 text-[9px] text-[#9b8778]">
          demo.nempo.id/{platform.id}
        </div>
      </div>
      {children}
    </div>
  );
}

function PlatformPreview({ platform }: { platform: Platform }) {
  switch (platform.id) {
    case "super-app":
      return <BusinessSuitePreview platform={platform} />;
    case "ticketing":
      return <TicketingPreview platform={platform} />;
    case "kasir":
      return <KasirPreview platform={platform} />;
    case "invitation":
      return <InvitationPreview platform={platform} />;
    case "company":
      return <CompanyPreview platform={platform} />;
    case "memories":
      return <MemoriesBookPreview platform={platform} />;
    case "marketing":
      return <MarketingToolsPreview platform={platform} />;
    case "crm":
    case "qr-menu":
    case "invoice":
    case "dapur-stock":
    case "gudang":
    case "hpp":
    case "resep":
    case "human-resource":
    case "link-bio":
    case "antrian":
    case "booking":
    case "loyalty":
    case "purchasing":
      return <BusinessSuitePreview platform={platform} />;
  }
}

function BusinessSuitePreview({ platform }: { platform: Platform }) {
  const Icon = platform.icon;
  const moduleCards = platform.featured
    ? platforms.slice(1, 7)
    : [platform, ...platforms.filter((item) => item.featured).slice(0, 1)];

  return (
    <PreviewShell platform={platform}>
      <div className="min-h-[390px] bg-[#f3faf8] p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.18em]" style={{ color: platform.accent }}>
              {platform.featured ? "Business Super App" : "Business module"}
            </p>
            <h4 className="mt-1 text-lg font-black tracking-tight text-slate-900 sm:text-xl">
              {platform.featured ? "Semua alur bisnis dalam satu ruang" : platform.title}
            </h4>
            <p className="mt-1 text-[9px] text-gray-400">
              {platform.featured ? "Data yang saling terhubung, keputusan yang lebih cepat." : platform.description}
            </p>
          </div>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white shadow-sm" style={{ backgroundColor: platform.accent }}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: platform.featured ? "Pelanggan aktif" : "Data tercatat", value: platform.featured ? "1.248" : "248", change: "+12,8%" },
            { label: "Transaksi hari ini", value: "86", change: "+8,4%" },
            { label: "Stok perlu dicek", value: "12", change: "Perlu perhatian" },
            { label: "Tim bertugas", value: "24", change: "Hari ini" },
          ].map(({ label, value, change }) => (
            <div key={label} className="rounded-2xl border border-teal-100 bg-white p-2.5">
              <p className="truncate text-[7px] font-bold uppercase tracking-[0.08em] text-gray-400">{label}</p>
              <p className="mt-2 text-sm font-black tracking-tight text-slate-900">{value}</p>
              <p className={`mt-1 text-[7px] font-bold ${change === "Perlu perhatian" ? "text-orange-500" : "text-emerald-600"}`}>{change}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-2xl border border-teal-100 bg-white p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-800">{platform.featured ? "Modul yang terhubung" : `Alur ${platform.title}`}</p>
                <p className="mt-1 text-[7px] text-gray-400">Dikelola dari satu dashboard</p>
              </div>
              <LayoutDashboard className="h-3.5 w-3.5" style={{ color: platform.accent }} />
            </div>
            <div className="mt-3 space-y-2">
              {moduleCards.slice(0, 4).map((module) => {
                const ModuleIcon = module.icon;
                return (
                  <div key={module.id} className="flex items-center gap-2 rounded-xl bg-[#f3faf8] px-2.5 py-2">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-white" style={{ color: module.accent }}>
                      <ModuleIcon className="h-3 w-3" />
                    </span>
                    <span className="min-w-0 truncate text-[8px] font-black text-slate-700">{module.title}</span>
                    <Check className="ml-auto h-3 w-3 shrink-0 text-emerald-500" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-800">Aktivitas terbaru</p>
              <Receipt className="h-3.5 w-3.5" style={{ color: platform.accent }} />
            </div>
            <div className="mt-4 space-y-3">
              {[
                { title: platform.featured ? "Order baru masuk" : `${platform.title} diperbarui`, value: "Baru saja" },
                { title: "Stok berhasil disinkronkan", value: "5 menit lalu" },
                { title: "Laporan siap dilihat", value: "12 menit lalu" },
              ].map(({ title, value }, index) => (
                <div key={title} className="flex items-center gap-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-teal-50 text-[8px] font-black" style={{ color: platform.accent }}>0{index + 1}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[8px] font-black text-slate-800">{title}</p>
                    <p className="mt-0.5 text-[7px] text-gray-400">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-teal-100 bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-black text-slate-800">{platform.featured ? "Fondasi bisnis yang lebih rapi" : "Yang bisa kamu pantau"}</p>
            <span className="text-[8px] font-bold" style={{ color: platform.accent }}>Lihat detail</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {platform.features.map((feature) => (
              <span key={feature} className="rounded-full bg-teal-50 px-2.5 py-1 text-[7px] font-bold text-teal-700">{feature}</span>
            ))}
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

function MarketingToolsPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="min-h-[390px] bg-[#fff9f5] p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#d96c3f]">Marketing workspace</p>
            <h4 className="mt-1 text-lg font-black tracking-tight text-slate-900 sm:text-xl">Campaign overview</h4>
            <p className="mt-1 text-[9px] text-gray-400">Semua rencana promosi dalam satu ruang.</p>
          </div>
          <button type="button" className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#d96c3f] px-2.5 py-2 text-[8px] font-black text-white shadow-sm">
            <Megaphone className="h-3 w-3" /> Campaign baru
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Reach", value: "48,2K", change: "+18,4%" },
            { label: "Engagement", value: "7,8%", change: "+2,1%" },
            { label: "Campaign aktif", value: "08", change: "Bulan ini" },
            { label: "Konten terjadwal", value: "24", change: "Minggu ini" },
          ].map(({ label, value, change }) => (
            <div key={label} className="rounded-2xl border border-orange-100 bg-white p-2.5">
              <p className="truncate text-[7px] font-bold uppercase tracking-[0.08em] text-gray-400">{label}</p>
              <p className="mt-2 text-sm font-black tracking-tight text-slate-900">{value}</p>
              <p className="mt-1 text-[7px] font-bold text-emerald-500">{change}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-2xl border border-orange-100 bg-white p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-800">Performa campaign</p>
                <p className="mt-1 text-[7px] text-gray-400">7 hari terakhir</p>
              </div>
              <span className="border border-orange-100 bg-orange-50 px-2 py-1 text-[7px] font-bold text-[#d96c3f]">Mingguan</span>
            </div>
            <div className="mt-4 flex h-24 items-end gap-1.5 border-b border-gray-100 px-1">
              {[35, 48, 42, 62, 56, 76, 90].map((height, index) => (
                <div key={index} className="group flex flex-1 flex-col items-center justify-end gap-1">
                  <span className={`w-full max-w-5 ${index === 6 ? "bg-[#d96c3f]" : "bg-orange-200"} transition-all group-hover:bg-[#d96c3f]`} style={{ height: `${height}%` }} />
                  <span className="text-[7px] text-gray-400">{["S", "S", "R", "K", "J", "S", "M"][index]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-800">Konten teratas</p>
              <Megaphone className="h-3.5 w-3.5 text-[#d96c3f]" />
            </div>
            <div className="mt-4 space-y-3">
              {[
                { title: "Promo akhir pekan", value: "12,4K reach" },
                { title: "Cerita dari Garut", value: "8,9K reach" },
                { title: "Event bulan ini", value: "6,2K reach" },
              ].map(({ title, value }, index) => (
                <div key={title} className="flex items-center gap-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-orange-50 text-[8px] font-black text-[#d96c3f]">0{index + 1}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[8px] font-black text-slate-800">{title}</p>
                    <p className="mt-0.5 text-[7px] text-gray-400">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-orange-100 bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-black text-slate-800">Jadwal konten</p>
            <span className="text-[8px] font-bold text-[#d96c3f]">Lihat kalender</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["Sen · 12", "Rab · 14", "Jum · 16"].map((date, index) => (
              <div key={date} className="rounded-xl bg-orange-50 px-2 py-2">
                <p className="text-[7px] font-bold text-[#d96c3f]">{date}</p>
                <p className="mt-1 truncate text-[8px] font-black text-slate-700">{["Video destinasi", "Carousel promo", "Story event"][index]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

function TicketingPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="ticketing-preview grid min-h-[390px] grid-cols-[6.5rem_1fr] bg-[#f5f0e9] sm:grid-cols-[8rem_1fr]">
        <aside className="flex flex-col border-r border-gray-100 bg-gray-50/70 p-3 text-gray-600 sm:p-4">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
            <div className="grid h-7 w-7 place-items-center rounded-xl bg-[#ee6a4d] text-white">
              <Ticket className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[9px] font-black leading-none text-gray-900">NEMPO</p>
              <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.14em] text-gray-400">Ticketing</p>
            </div>
          </div>
          <div className="mt-5 space-y-1">
            {[
              { icon: LayoutDashboard, label: "Overview", active: true },
              { icon: CalendarDays, label: "Event" },
              { icon: Ticket, label: "Tiket" },
              { icon: QrCode, label: "Check-in" },
              { icon: WalletCards, label: "Keuangan" },
            ].map(({ icon: Icon, label, active }) => (
              <div key={label} className={`flex items-center gap-2 rounded-xl px-2 py-2 text-[8px] font-bold ${active ? "bg-white text-cyan-700 shadow-sm" : "text-gray-400"}`}>
                <Icon className="h-3 w-3 shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto border-t border-gray-200 pt-3">
            <p className="text-[7px] uppercase tracking-[0.14em] text-gray-400">Workspace</p>
            <p className="mt-1 truncate text-[8px] font-bold text-gray-600">Nempo Creative</p>
          </div>
        </aside>

        <div className="min-w-0 p-3 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#ee6a4d]">Overview event</p>
              <h4 className="mt-1 text-lg font-black tracking-tight text-slate-900 sm:text-xl">Ringkasan penjualan</h4>
              <p className="mt-1 text-[9px] text-gray-400">Pantau performa event dari satu tempat.</p>
            </div>
            <button type="button" className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#ee6a4d] px-2.5 py-2 text-[8px] font-black text-white shadow-sm">
              <span className="text-sm leading-none">+</span> Event baru
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Total penjualan", value: "Rp24,8 jt", change: "+18,4%", icon: WalletCards },
              { label: "Tiket terjual", value: "1.248", change: "+12,8%", icon: Ticket },
              { label: "Check-in", value: "68,2%", change: "842 tamu", icon: QrCode },
              { label: "Event aktif", value: "04", change: "Minggu ini", icon: CalendarDays },
            ].map(({ label, value, change, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-gray-100 bg-white p-2.5">
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate text-[7px] font-bold uppercase tracking-[0.08em] text-gray-400">{label}</p>
                  <Icon className="h-3 w-3 shrink-0 text-cyan-600" />
                </div>
                <p className="mt-2 text-sm font-black tracking-tight text-slate-900">{value}</p>
                <p className="mt-1 text-[7px] font-bold text-emerald-500">{change}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-[1.15fr_.85fr]">
            <div className="rounded-2xl border border-gray-100 bg-white p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-800">Penjualan tiket</p>
                  <p className="mt-1 text-[7px] text-gray-400">7 hari terakhir</p>
                </div>
                <span className="border border-emerald-100 bg-emerald-50 px-2 py-1 text-[7px] font-bold text-emerald-600">+24,6%</span>
              </div>
              <div className="mt-4 flex h-24 items-end gap-1.5 border-b border-gray-100 px-1">
                {[32, 48, 42, 66, 54, 78, 92].map((height, index) => (
                  <div key={index} className="group flex flex-1 flex-col items-center justify-end gap-1">
                    <span className={`w-full max-w-5 ${index === 6 ? "bg-[#ee6a4d]" : "bg-cyan-200"} transition-all group-hover:bg-cyan-500`} style={{ height: `${height}%` }} />
                    <span className="text-[7px] text-gray-400">{["S", "S", "R", "K", "J", "S", "M"][index]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-3">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black text-slate-800">Check-in hari ini</p>
                <QrCode className="h-3.5 w-3.5 text-cyan-600" />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full border-[7px] border-cyan-100 border-t-cyan-600 border-r-cyan-600">
                  <span className="text-sm font-black text-slate-900">68%</span>
                </div>
                <div className="space-y-2 text-[8px]">
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 bg-cyan-600" /><span className="text-gray-500">Sudah hadir</span><b className="text-slate-800">842</b></div>
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 bg-cyan-100" /><span className="text-gray-500">Belum hadir</span><b className="text-slate-800">406</b></div>
                </div>
              </div>
              <button type="button" className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-cyan-200 py-2 text-[8px] font-black text-cyan-700">
                Buka scanner <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-gray-100 bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-800">Event mendatang</p>
              <span className="text-[8px] font-bold text-cyan-700">Lihat semua</span>
            </div>
            <div className="mt-3 space-y-2">
              {[
                { name: "Riuh Rona Vol. 3", date: "21 Sep · Garut", sold: "842/1.000", color: "bg-[#ee6a4d]" },
                { name: "Nempo Creative Market", date: "05 Okt · Bandung", sold: "406/600", color: "bg-violet-500" },
              ].map((event) => (
                <div key={event.name} className="flex items-center gap-2 border-t border-gray-100 pt-2">
                  <span className={`h-7 w-1.5 ${event.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[8px] font-black text-slate-800">{event.name}</p>
                    <p className="mt-0.5 text-[7px] text-gray-400">{event.date}</p>
                  </div>
                  <span className="text-[8px] font-bold text-slate-600">{event.sold}</span>
                  <ArrowRight className="h-3 w-3 text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

function KasirPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="kasir-preview grid min-h-[390px] grid-cols-[1fr_14rem] bg-[#fffaf5] sm:grid-cols-[1fr_16rem]">
        <div className="min-w-0 border-r border-orange-100 p-3 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-orange-500">Kopi Nempo · POS</p>
              <h4 className="mt-1 text-lg font-black tracking-tight text-slate-900 sm:text-xl">Buat pesanan</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 border border-emerald-100 bg-emerald-50 px-2 py-1.5 text-[7px] font-bold text-emerald-600 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
              </span>
              <button type="button" className="grid h-7 w-7 place-items-center border border-orange-100 bg-white text-orange-500">
                <Menu className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 overflow-hidden">
            {["Semua menu", "Kopi", "Makanan", "Snack"].map((category, index) => (
              <button key={category} type="button" className={`shrink-0 px-2.5 py-1.5 text-[8px] font-bold ${index === 0 ? "!bg-orange-500 !text-white" : "border border-orange-100 bg-white text-gray-500"}`}>
                {category}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              { name: "Kopi Susu Gula Aren", price: "Rp18.000", tone: "bg-[#ead1a8]", mark: "KS" },
              { name: "Americano", price: "Rp15.000", tone: "bg-[#c8b09b]", mark: "AM" },
              { name: "Croissant Butter", price: "Rp22.000", tone: "bg-[#f0c878]", mark: "CB" },
              { name: "Matcha Latte", price: "Rp24.000", tone: "bg-[#b8c9a3]", mark: "ML" },
              { name: "Nasi Ayam Sambal", price: "Rp28.000", tone: "bg-[#e7a475]", mark: "NA" },
              { name: "French Fries", price: "Rp16.000", tone: "bg-[#e6c06c]", mark: "FF" },
            ].map((item) => (
              <button key={item.name} type="button" className="group overflow-hidden border border-orange-100 bg-white text-left transition-transform hover:-translate-y-0.5">
                <div className={`relative grid h-12 place-items-center ${item.tone}`}>
                  <span className="font-black tracking-tight text-white/75">{item.mark}</span>
                  <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center bg-white/80 text-[10px] text-orange-600">+</span>
                </div>
                <div className="p-2">
                  <p className="truncate text-[8px] font-black text-slate-800">{item.name}</p>
                  <p className="mt-1 text-[8px] font-bold text-orange-600">{item.price}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-orange-100 pt-3">
            <div className="flex items-center gap-2">
              <Store className="h-3.5 w-3.5 text-orange-500" />
              <span className="text-[8px] font-bold text-gray-500">Meja tersedia 08/12</span>
            </div>
            <span className="text-[8px] font-black text-orange-600">Kelola meja →</span>
          </div>
        </div>

        <aside className="bg-[#211b45] p-3 text-white sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-orange-300">Order #0248</p>
              <p className="mt-1 text-[9px] text-white/45">Meja 07 · Dine in</p>
            </div>
            <ShoppingBag className="h-4 w-4 text-orange-300" />
          </div>
          <div className="mt-5 space-y-3">
            {[
              { name: "Kopi Susu Gula Aren", qty: "2x", price: "Rp36.000" },
              { name: "Croissant Butter", qty: "1x", price: "Rp22.000" },
              { name: "French Fries", qty: "1x", price: "Rp16.000" },
            ].map((item) => (
              <div key={item.name} className="flex items-start gap-2 border-b border-white/10 pb-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center bg-white/10 text-[8px] font-black text-orange-300">{item.qty}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[8px] font-bold text-white/80">{item.name}</p>
                  <p className="mt-1 text-[8px] text-white/40">{item.price}</p>
                </div>
                <button type="button" className="text-[8px] text-white/30">×</button>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 text-[8px]">
            <div className="flex justify-between text-white/45"><span>Subtotal</span><span>Rp74.000</span></div>
            <div className="flex justify-between text-white/45"><span>Pajak 10%</span><span>Rp7.400</span></div>
            <div className="flex justify-between border-t border-white/15 pt-3 text-[11px] font-black"><span>Total</span><span className="text-orange-300">Rp81.400</span></div>
          </div>
          <button type="button" className="!bg-orange-500 !text-white mt-5 flex w-full items-center justify-center gap-1.5 py-2.5 text-[9px] font-black">
            <ReceiptText className="h-3.5 w-3.5" /> Bayar sekarang
          </button>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[7px] text-white/35">
            <Check className="h-3 w-3 text-emerald-300" /> Tersimpan otomatis
          </div>
        </aside>
      </div>
    </PreviewShell>
  );
}

function InvitationPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="relative overflow-hidden bg-[#fff9fb] p-3 sm:p-5">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-pink-200/50 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-rose-100 blur-2xl" />
        <div className="relative overflow-hidden border border-pink-100 bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-pink-100 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-pink-100 text-pink-500">
                <HeartIcon />
              </div>
              <span className="font-serif text-[11px] font-semibold tracking-wide text-slate-800">Alya & Reza</span>
            </div>
            <nav className="hidden items-center gap-4 text-[8px] font-bold text-gray-400 sm:flex">
              <span className="text-pink-500">Home</span><span>Our story</span><span>Acara</span><span>RSVP</span>
            </nav>
            <span className="text-[8px] font-black uppercase tracking-[0.16em] text-pink-400 sm:hidden">Undangan</span>
          </header>

          <div className="grid items-center gap-4 px-4 py-5 sm:grid-cols-[1.05fr_.95fr] sm:px-7 sm:py-6">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.25em] text-pink-400">The wedding of</p>
              <h4 className="mt-2 font-serif text-4xl font-semibold leading-[0.9] tracking-tight text-slate-800 sm:text-5xl">Alya<br /><span className="text-pink-400">&amp; Reza</span></h4>
              <p className="mt-4 max-w-[15rem] text-[9px] leading-5 text-gray-500">Dengan penuh sukacita, kami mengundang Anda untuk hadir di hari bahagia kami.</p>
              <div className="mt-4 flex items-center gap-2 text-[8px] font-bold text-slate-700">
                <CalendarDays className="h-3.5 w-3.5 text-pink-500" />
                <span>Sabtu, 12 Oktober 2026</span>
              </div>
              <button type="button" className="!bg-pink-500 !text-white mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[9px] font-black shadow-lg shadow-pink-500/20">
                Buka undangan <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#e8b7bd] via-[#f7d9d8] to-[#f6eee6] sm:h-48">
              <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border border-white/60" />
              <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full border border-white/60" />
              <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70" />
              <div className="relative flex h-full flex-col items-center justify-center text-center">
                <span className="text-[8px] font-black uppercase tracking-[0.24em] text-white/75">Save the date</span>
                <span className="mt-2 font-serif text-2xl font-semibold text-white">12 . 10 . 26</span>
                <span className="mt-2 text-[8px] font-bold text-white/75">The Papandayan · Garut</span>
              </div>
               <Heart className="absolute left-4 top-4 h-4 w-4 fill-white/65 text-white/65" />
               <Heart className="absolute bottom-4 right-5 h-3.5 w-3.5 fill-white/65 text-white/65" />
            </div>
          </div>

          <div className="grid grid-cols-4 border-t border-pink-100 bg-[#fffafd]">
            {[
              { value: "124", label: "Hari" },
              { value: "08", label: "Jam" },
              { value: "42", label: "Menit" },
              { value: "16", label: "Detik" },
            ].map(({ value, label }) => (
              <div key={label} className="border-r border-pink-100 px-2 py-3 text-center last:border-r-0">
                <p className="font-serif text-lg font-semibold text-slate-800">{value}</p>
                <p className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.12em] text-pink-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-pink-100 px-4 py-3 sm:px-7">
            <div>
              <p className="text-[8px] font-black text-slate-800">Resepsi pernikahan</p>
              <p className="mt-1 text-[8px] text-gray-400">Sabtu, 12 Oktober · 18.30 WIB</p>
            </div>
            <span className="border border-pink-200 px-2 py-1 text-[7px] font-black text-pink-500">RSVP online</span>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

function CompanyPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="min-h-[390px] bg-[#f7fcfd] p-3 sm:p-5">
        <div className="flex items-center justify-between border-b border-cyan-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center bg-cyan-600 text-white">
              <Globe2 className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-[10px] font-black tracking-[0.08em] text-slate-800">ARUNA</span>
              <span className="block text-[7px] font-bold uppercase tracking-[0.18em] text-cyan-600">Digital studio</span>
            </div>
          </div>
          <div className="hidden items-center gap-4 text-[8px] font-bold text-gray-500 sm:flex">
            <span className="text-cyan-600">Home</span><span>About</span><span>Services</span><span>Work</span>
          </div>
          <button type="button" className="hidden items-center gap-1.5 border border-cyan-200 px-2.5 py-1.5 text-[8px] font-black text-cyan-700 sm:flex">
            Let&apos;s talk <ArrowUpRight className="h-3 w-3" />
          </button>
          <Menu className="h-4 w-4 text-gray-500 sm:hidden" />
        </div>

        <div className="grid items-center gap-5 py-5 sm:grid-cols-[1.05fr_.95fr] sm:py-6">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-cyan-600">Creative digital partner</p>
            <h4 className="mt-2 max-w-[18rem] text-3xl font-black leading-[0.95] tracking-[-0.06em] text-slate-900 sm:text-4xl">
              Make your brand <span className="text-cyan-600">matter.</span>
            </h4>
            <p className="mt-3 max-w-xs text-[9px] leading-5 text-gray-500">
              Strategi, desain, dan teknologi untuk bisnis yang ingin bergerak lebih jauh.
            </p>
            <button type="button" className="!bg-cyan-600 !text-white mt-4 inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[9px] font-black">
              Lihat portofolio <ArrowRight className="h-3 w-3" />
            </button>
            <div className="mt-5 flex items-center gap-4 border-t border-cyan-100 pt-3">
              <div><p className="text-base font-black text-slate-900">24</p><p className="text-[7px] font-bold uppercase tracking-[0.1em] text-gray-400">Projects</p></div>
              <div><p className="text-base font-black text-slate-900">08</p><p className="text-[7px] font-bold uppercase tracking-[0.1em] text-gray-400">Years</p></div>
              <div><p className="text-base font-black text-slate-900">12</p><p className="text-[7px] font-bold uppercase tracking-[0.1em] text-gray-400">Clients</p></div>
            </div>
          </div>
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-cyan-500 via-cyan-700 to-[#102e65] p-4 sm:h-52">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/30" />
            <div className="absolute -bottom-12 -left-10 h-36 w-36 rounded-full border border-white/20" />
            <div className="absolute right-8 top-12 h-20 w-20 rotate-12 border border-white/25" />
            <div className="absolute bottom-5 right-5 h-16 w-16 rounded-full bg-cyan-200/40 blur-xl" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/70">Selected work / 01</p>
                <ArrowUpRight className="h-4 w-4 text-white/75" />
              </div>
              <div>
                <p className="text-[8px] font-bold text-white/60">Identity &amp; digital experience</p>
                <div className="mt-1 flex items-end justify-between">
                  <p className="text-3xl font-black tracking-tighter text-white">ARUNA</p>
                  <Palette className="h-7 w-7 text-cyan-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-cyan-100 pt-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[9px] font-black text-slate-800">Apa yang kami kerjakan</p>
            <span className="text-[8px] font-bold text-cyan-600">Lihat layanan →</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Palette, title: "Brand strategy", text: "Positioning & identity" },
              { icon: Globe2, title: "Web development", text: "Fast & thoughtful web" },
              { icon: MonitorSmartphone, title: "Digital campaign", text: "Reach the right people" },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="border border-cyan-100 bg-white p-2.5">
                <Icon className="h-3.5 w-3.5 text-cyan-600" />
                <p className="mt-2 text-[8px] font-black leading-3 text-slate-700">{title}</p>
                <p className="mt-1 text-[7px] leading-3 text-gray-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-cyan-100 pt-3">
          <p className="text-[8px] font-bold text-gray-400">Let&apos;s build something meaningful.</p>
          <span className="flex items-center gap-1 text-[8px] font-black text-cyan-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Available for work</span>
        </div>
      </div>
    </PreviewShell>
  );
}

function MemoriesBookPreview({ platform }: { platform: Platform }) {
  return (
    <PreviewShell platform={platform}>
      <div className="min-h-[390px] bg-[#f4f6ff] p-3 sm:p-5">
        <header className="flex items-center justify-between border-b border-[#dbe2f6] pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center bg-[#5570b8] text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.08em] text-slate-800">MEMORIES BOOK</p>
              <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-[#5570b8]">SMA NEMPO · 2026</p>
            </div>
          </div>
          <nav className="hidden items-center gap-4 text-[8px] font-bold text-gray-400 sm:flex">
            <span className="text-[#5570b8]">Home</span><span>Angkatan</span><span>Galeri</span><span>Pesan</span>
          </nav>
          <button type="button" className="flex items-center gap-1.5 border border-[#c8d2f0] px-2.5 py-1.5 text-[8px] font-black text-[#5570b8]">
            <Users className="h-3 w-3" /> XII IPA 2
          </button>
        </header>

        <div className="grid items-center gap-5 py-5 sm:grid-cols-[.9fr_1.1fr] sm:py-6">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#5570b8]">Memories book / angkatan 2026</p>
            <h4 className="mt-2 max-w-[18rem] text-3xl font-black leading-[0.95] tracking-[-0.06em] text-slate-900 sm:text-4xl">
              We came.<br /><span className="text-[#5570b8]">We grew.</span><br />We remember.
            </h4>
            <p className="mt-3 max-w-xs text-[9px] leading-5 text-gray-500">
              Satu ruang digital untuk menyimpan cerita, wajah, dan tawa dari perjalanan satu angkatan.
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" className="!bg-[#5570b8] !text-white inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[9px] font-black">
                Buka yearbook <ArrowRight className="h-3 w-3" />
              </button>
              <button type="button" className="border border-[#c8d2f0] bg-white px-3 py-2.5 text-[9px] font-black text-[#5570b8]">
                Lihat angkatan
              </button>
            </div>
          </div>

          <div className="relative h-48 overflow-hidden bg-[#dfe5f7] p-3 sm:h-52">
            <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#5570b8]/20" />
            <div className="absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-white/70" />
            <div className="relative flex items-center justify-between">
              <span className="text-[8px] font-black uppercase tracking-[0.18em] text-[#5570b8]">Class of 2026</span>
              <ArrowUpRight className="h-4 w-4 text-[#5570b8]" />
            </div>
            <div className="relative mt-4 grid grid-cols-3 gap-2">
              <div className="mt-4 h-24 bg-gradient-to-b from-[#f1c5b9] to-[#8c6e83] p-2">
                <div className="flex h-full items-end border border-white/45 p-1.5"><span className="text-[8px] font-black text-white">NADIA</span></div>
              </div>
              <div className="h-28 bg-gradient-to-b from-[#a8c7d9] to-[#435a7d] p-2 shadow-lg shadow-[#5570b8]/20">
                <div className="flex h-full items-end border border-white/45 p-1.5"><span className="text-[8px] font-black text-white">RAYHAN</span></div>
              </div>
              <div className="mt-2 h-24 bg-gradient-to-b from-[#e5d1a2] to-[#7d6d53] p-2">
                <div className="flex h-full items-end border border-white/45 p-1.5"><span className="text-[8px] font-black text-white">SALMA</span></div>
              </div>
            </div>
            <div className="relative mt-2 flex items-center justify-between">
              <span className="text-[8px] font-bold text-[#5570b8]">180 students · 12 classes</span>
              <GraduationCap className="h-4 w-4 text-[#5570b8]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-[#dbe2f6] pt-3">
          {[
            { icon: Users, title: "Profil angkatan", text: "Kenal lebih dekat" },
            { icon: Palette, title: "Galeri kenangan", text: "Momen tak terlupa" },
            { icon: Mail, title: "Pesan teman", text: "Kata untuk nanti" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="border border-[#dbe2f6] bg-white p-2.5">
              <Icon className="h-3.5 w-3.5 text-[#5570b8]" />
              <p className="mt-2 text-[8px] font-black leading-3 text-slate-700">{title}</p>
              <p className="mt-1 text-[7px] leading-3 text-gray-400">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#dbe2f6] pt-3">
          <p className="text-[8px] font-bold text-gray-400">A story worth keeping, together.</p>
          <span className="text-[8px] font-black text-[#5570b8]">Made for your class ↗</span>
        </div>
      </div>
    </PreviewShell>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}