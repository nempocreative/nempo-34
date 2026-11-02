/**
 * Isi lonceng notifikasi (header) dan halaman /notifikasi.
 *
 * Satu sumber browser-safe: semua teks diambil dari halaman yang benar-benar
 * ada di situs ini — harga dari modul data layanan, judul acara dari
 * portofolio event, dan kanal kontak dari src/lib/contact.ts.
 * Nada penulisannya ajakan santai ("ayo join", "buat acara bareng kita"),
 * bukan daftar resmi.
 * Tidak ada tabel notifikasi di basis data, jadi isinya diambil dari konten
 * situs ini sendiri.
 */

export type NotificationType = "info" | "update" | "promo" | "event" | "warning";

export type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  /** Halaman tujuan. Harus rute yang terdaftar di src/nempo-app.tsx. */
  href: string;
  /** Berapa jam lalu notifikasi ini muncul, dihitung dari sekarang. */
  hoursAgo: number;
};

export const notificationItems: NotificationItem[] = [
  {
    id: 1,
    type: "event",
    title: "Ayo intip event terbaru kita!",
    message:
      "Riuh Rona — 5 September 2026 di Maru — baru masuk portofolio. Dari Secangkir Kopi sampai Grand Opening GGS Beauty, semuanya ada di bagian Event halaman Portofolio. Mau acaramu ikut tampil di sini?",
    href: "/portofolio#event",
    hoursAgo: 1,
  },
  {
    id: 2,
    type: "update",
    title: "Ayo join Nempo Community!",
    message:
      "Open recruitment dibuka buat pelajar, mahasiswa, dan umum — tanpa biaya pendaftaran. Isi formulirnya sebentar, nanti tim Nempo nyapa kamu lewat WhatsApp.",
    href: "/recruitment",
    hoursAgo: 3,
  },
  {
    id: 3,
    type: "info",
    title: "Semua karya kita, satu halaman",
    message:
      "Poster event, hasil kelola sosmed (Beauty, Fashion, Food, Cafe, Event, Skincare), dan 16 tema undangan digital — lihat satu-satu lalu pilih favoritmu di halaman Portofolio.",
    href: "/portofolio",
    hoursAgo: 6,
  },
  {
    id: 4,
    type: "promo",
    title: "Sosmed UMKM kamu, biar kita yang garap!",
    message:
      "Paket Growth Rp1.500.000/bulan: 8 desain Feed, 8 video Reels, 12 Instagram Story, content planning, posting dan penjadwalan, 1x kunjungan produksi konten, dan monthly report. Mulai minggu ini juga bisa.",
    href: "/sosmed-management",
    hoursAgo: 9,
  },
  {
    id: 5,
    type: "info",
    title: "Mau nikah? Bikin bareng kita!",
    message:
      "Essential Rp2.500.000 (tim 4), Signature Rp4.000.000 (tim 6), Premium Rp6.000.000 (tim 8) — Signature ke atas sudah termasuk undangan digital dan sawer. Konsultasinya gratis, tinggal chat.",
    href: "/wedding-organizer",
    hoursAgo: 20,
  },
  {
    id: 6,
    type: "update",
    title: "16 tema undangan, pilih yang cocok!",
    message:
      "Biru Bunga, Peach Klasik, Navy Elegan, Mocca Hangat, Hitam Mewah, Biru Taman, Rose Dusty, Merah Marun — masing-masing ada versi foto dan tanpa foto. Buka demonya, siapa tahu langsung jatuh hati.",
    href: "/wedding-invitation",
    hoursAgo: 26,
  },
  {
    id: 7,
    type: "promo",
    title: "Butuh desain kece? Mulai Rp35.000!",
    message:
      "Instagram Story Rp35.000, Feed Rp50.000, Poster/Flyer Rp100.000, Banner Rp150.000, Logo Rp500.000, Branding Identity Rp1.500.000. Bilang aja idenya, kita yang bikinin.",
    href: "/design-creative",
    hoursAgo: 30,
  },
  {
    id: 8,
    type: "info",
    title: "Punya usaha? Wajib punya website!",
    message:
      "Landing Page Rp1.500.000, Website UMKM Rp2.500.000, Company Profile Rp4.000.000, Website Professional Rp7.500.000, Website E-Commerce Rp8.500.000. Biar bisnismu tampil lebih meyakinkan.",
    href: "/web-development",
    hoursAgo: 40,
  },
  {
    id: 9,
    type: "info",
    title: "Ada ide acara? Buat bareng kita!",
    message:
      "Chat WhatsApp +62 857-2498-1356, DM Instagram @nempo.id, atau TikTok @nempo.id — semua kanalnya ada di halaman Contact. Konsultasi dulu, gratis kok.",
    href: "/contact",
    hoursAgo: 50,
  },
  {
    id: 10,
    type: "info",
    title: "Harga jelas, nggak ada yang disembunyiin",
    message:
      "Daftar harga tiap layanan dan ketentuan kerja sama bisa kamu cek sendiri di halaman Price List sebelum ngobrol sama tim.",
    href: "/kerja-sama",
    hoursAgo: 60,
  },
  {
    id: 11,
    type: "info",
    title: "Butuh talent buat acaramu?",
    message:
      "Daftar talent dan influencer yang bisa diajak kerja sama ada di halaman Talent Management, lengkap dengan contoh karyanya.",
    href: "/talent",
    hoursAgo: 70,
  },
  {
    id: 12,
    type: "info",
    title: "Coba sendiri demo sistem usaha kita!",
    message:
      "Super App, kasir, ticketing, QR menu, dan layanan digital lain bisa langsung dicoba di halaman Business System. Iseng coba juga boleh kok.",
    href: "/business-system",
    hoursAgo: 80,
  },
];

export type Notification = NotificationItem & { created_at: string };

/** Urut dari yang terbaru, dengan created_at dihitung dari hari ini. */
export function buildNotifications(now: Date = new Date()): Notification[] {
  return notificationItems
    .map((item) => ({
      ...item,
      created_at: new Date(now.getTime() - item.hoursAgo * 3_600_000).toISOString(),
    }))
    .sort((a, b) => a.hoursAgo - b.hoursAgo);
}
