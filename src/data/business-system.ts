// Business System & Digital Solutions — katalog resmi Nempo Creative (dari dokumen harga pengguna).
// Browser-safe: hanya data dan pembuat tautan WhatsApp.
import { NEMPO_WA_URL } from "@/lib/contact";

export type BizSystem = {
  id: string;
  name: string;
  price: number;
  startingFrom: boolean;
  desc: string;
  features: string[];
  target: string;
};

export const BIZ_OPERATIONAL: BizSystem[] = [
  {
    id: "qr-menu", name: "QR Digital Menu", price: 750_000, startingFrom: false,
    desc: "Menu digital yang dapat diakses pelanggan melalui pemindaian QR Code tanpa perlu menggunakan menu fisik.",
    features: ["Kategori dan daftar menu", "Foto dan deskripsi produk", "Harga dan variasi produk", "Informasi produk tersedia / habis", "Dashboard admin untuk mengubah menu", "QR Code khusus setiap meja atau outlet"],
    target: "Cafe, restoran, coffee shop, dan rumah makan.",
  },
  {
    id: "pos", name: "POS / Sistem Kasir", price: 2_500_000, startingFrom: false,
    desc: "Sistem untuk mencatat transaksi penjualan, menghitung pembayaran, dan memantau aktivitas kasir secara digital.",
    features: ["Input transaksi penjualan", "Keranjang belanja", "Pembayaran tunai dan non-tunai", "Cetak atau kirim struk", "Diskon dan pajak", "Riwayat transaksi", "Rekap penjualan harian", "Manajemen akun kasir"],
    target: "Retail, cafe, restoran, toko, dan minimarket.",
  },
  {
    id: "antrian", name: "Sistem Antrian", price: 1_500_000, startingFrom: false,
    desc: "Sistem pengelolaan nomor antrean untuk mengatur urutan pelayanan pelanggan secara otomatis.",
    features: ["Pengambilan nomor antrean", "Nomor antrean otomatis", "Layar display antrean", "Panggilan nomor antrean", "Pengaturan loket atau petugas", "Status menunggu, dipanggil, dan selesai", "Riwayat pelayanan"],
    target: "Klinik, salon, bank, kantor pelayanan, dan rumah sakit.",
  },
  {
    id: "reservasi", name: "Sistem Reservasi & Booking", price: 2_000_000, startingFrom: false,
    desc: "Sistem pemesanan jadwal atau tempat secara online sehingga pelanggan dapat melakukan reservasi tanpa harus datang langsung.",
    features: ["Formulir reservasi online", "Kalender ketersediaan", "Pemilihan tanggal dan jam", "Konfirmasi booking", "Status pembayaran", "Riwayat reservasi", "Dashboard pengelola"],
    target: "Hotel, villa, salon, cafe, lapangan olahraga, dan tempat wisata.",
  },
  {
    id: "membership", name: "Sistem Membership & Loyalty", price: 1_500_000, startingFrom: false,
    desc: "Sistem untuk mengelola keanggotaan pelanggan dan memberikan program loyalitas agar pelanggan kembali bertransaksi.",
    features: ["Registrasi member", "Profil pelanggan", "Kartu member digital", "Poin transaksi", "Riwayat pembelian", "Tingkatan membership", "Reward dan penukaran poin"],
    target: "Cafe, salon, toko retail, gym, dan bisnis jasa.",
  },
  {
    id: "voucher", name: "Sistem Voucher & Promotion", price: 1_500_000, startingFrom: false,
    desc: "Sistem untuk membuat, membagikan, dan memantau penggunaan voucher promosi bisnis.",
    features: ["Pembuatan kode voucher", "Diskon nominal dan persentase", "QR Code voucher", "Masa berlaku voucher", "Batas penggunaan", "Validasi voucher", "Laporan penggunaan promo"],
    target: "Cafe, restoran, event organizer, retail, dan brand.",
  },
  {
    id: "ticketing", name: "Sistem Ticketing Event", price: 3_500_000, startingFrom: false,
    desc: "Sistem penjualan tiket acara secara online dengan pengelolaan data peserta dan validasi tiket digital.",
    features: ["Pembuatan event", "Kategori dan harga tiket", "Pemesanan tiket", "Tiket digital QR Code", "Validasi tiket saat masuk", "Database peserta", "Rekap penjualan tiket"],
    target: "Event organizer, konser, festival, seminar, dan kompetisi.",
  },
];

export const BIZ_MANAGEMENT: BizSystem[] = [
  {
    id: "cms", name: "CMS (Content Management System)", price: 2_000_000, startingFrom: false,
    desc: "Sistem pengelolaan konten website yang memungkinkan pemilik bisnis memperbarui informasi tanpa harus mengubah kode program.",
    features: ["Dashboard administrator", "Manajemen halaman website", "Pengelolaan artikel dan berita", "Upload gambar dan dokumen", "Manajemen kategori", "Pengaturan SEO dasar", "Hak akses pengguna"],
    target: "Perusahaan, instansi, sekolah, organisasi, dan media.",
  },
  {
    id: "finance", name: "Finance Management System", price: 2_500_000, startingFrom: false,
    desc: "Sistem untuk mencatat dan memantau kondisi keuangan bisnis secara terstruktur.",
    features: ["Pencatatan pemasukan", "Pencatatan pengeluaran", "Pengelolaan kas", "Kategori transaksi", "Laporan laba dan rugi sederhana", "Laporan arus kas", "Rekap keuangan bulanan", "Export laporan"],
    target: "UMKM, perusahaan, cafe, restoran, dan organisasi.",
  },
  {
    id: "inventory", name: "Inventory Management System", price: 2_500_000, startingFrom: false,
    desc: "Sistem untuk mengontrol persediaan barang, bahan baku, dan produk agar stok lebih mudah dipantau.",
    features: ["Data barang dan produk", "Kode SKU / barcode", "Stok masuk dan keluar", "Stok minimum", "Notifikasi stok menipis", "Riwayat pergerakan barang", "Penyesuaian stok", "Laporan persediaan"],
    target: "Toko, gudang, retail, cafe, restoran, dan distributor.",
  },
  {
    id: "warehouse", name: "Warehouse & Stokis Management", price: 2_500_000, startingFrom: false,
    desc: "Sistem untuk mengelola stok barang pada gudang utama, gudang cabang, maupun jaringan stokis dan distributor.",
    features: ["Manajemen gudang", "Manajemen stokis", "Distribusi barang", "Transfer stok antar-gudang", "Penerimaan dan pengeluaran barang", "Data supplier", "Laporan stok per lokasi"],
    target: "Distributor, supplier, grosir, dan perusahaan dengan beberapa lokasi penyimpanan.",
  },
  {
    id: "purchasing", name: "Purchasing Management System", price: 2_000_000, startingFrom: false,
    desc: "Sistem untuk mengelola pembelian barang dan kebutuhan operasional bisnis dari supplier.",
    features: ["Data supplier", "Permintaan pembelian", "Purchase Order (PO)", "Penerimaan barang", "Status pembayaran supplier", "Riwayat pembelian", "Laporan pengadaan"],
    target: "Perusahaan, restoran, toko, distributor, dan manufaktur.",
  },
  {
    id: "crm", name: "CRM (Customer Relationship Management)", price: 2_500_000, startingFrom: false,
    desc: "Sistem untuk mengelola data pelanggan, prospek penjualan, dan riwayat komunikasi dalam satu tempat.",
    features: ["Database pelanggan", "Data kontak dan profil", "Riwayat transaksi", "Pipeline calon pelanggan", "Follow-up pelanggan", "Catatan komunikasi", "Laporan penjualan"],
    target: "Agency, perusahaan, sales, properti, dan bisnis jasa.",
  },
  {
    id: "hr-payroll", name: "HR & Payroll System", price: 3_500_000, startingFrom: false,
    desc: "Sistem untuk mengelola administrasi karyawan, absensi, penggajian, dan informasi kepegawaian.",
    features: ["Database karyawan", "Jabatan dan divisi", "Absensi karyawan", "Pengelolaan cuti", "Perhitungan gaji", "Tunjangan dan potongan", "Slip gaji digital", "Laporan penggajian"],
    target: "UMKM, perusahaan, organisasi, dan instansi.",
  },
  {
    id: "attendance", name: "Attendance Management System", price: 1_500_000, startingFrom: false,
    desc: "Sistem untuk mencatat kehadiran karyawan dan memantau kedisiplinan kerja.",
    features: ["Check-in dan check-out", "Absensi berbasis lokasi", "Rekap kehadiran", "Riwayat keterlambatan", "Pengaturan jadwal kerja", "Laporan kehadiran", "Dashboard administrator"],
    target: "Kantor, toko, perusahaan, dan bisnis dengan karyawan.",
  },
];

export type BizIndustry = { id: string; name: string; price: number; fungsi: string };

export const BIZ_INDUSTRY: BizIndustry[] = [
  { id: "salon", name: "Salon Management", price: 5_000_000, fungsi: "Booking, kasir, layanan, member, dan komisi karyawan" },
  { id: "cafe", name: "Cafe & Restaurant Management", price: 7_500_000, fungsi: "POS, QR menu, kitchen, stok, dan keuangan" },
  { id: "hotel", name: "Hotel & Villa Management", price: 7_500_000, fungsi: "Reservasi kamar, check-in, check-out, dan pembayaran" },
  { id: "school", name: "School Management", price: 7_500_000, fungsi: "Data siswa, guru, kelas, dan administrasi" },
  { id: "clinic", name: "Clinic Management", price: 7_500_000, fungsi: "Registrasi, antrean, jadwal, dan administrasi klinik" },
  { id: "rental", name: "Rental Management", price: 3_000_000, fungsi: "Data unit, booking, transaksi, dan pengembalian" },
  { id: "property", name: "Property Management", price: 5_000_000, fungsi: "Data properti, listing, prospek, dan transaksi" },
  { id: "travel", name: "Travel Management", price: 5_000_000, fungsi: "Paket wisata, booking, jadwal, dan pelanggan" },
  { id: "event", name: "Event Management", price: 5_000_000, fungsi: "Registrasi, peserta, rundown, dan operasional acara" },
  { id: "cooperative", name: "Cooperative Management", price: 7_500_000, fungsi: "Anggota, simpanan, pinjaman, dan laporan" },
];

export const BIZ_INDUSTRY_NOTE =
  "Harga di atas merupakan harga mulai untuk lingkup fitur dasar. Modul khusus dan kebutuhan regulasi industri dihitung terpisah.";

export const BIZ_BUNDLES = [
  {
    id: "small-business", name: "Small Business System", price: 3_500_000, startingFrom: false, recommended: false,
    forWho: "Untuk UMKM dan bisnis kecil",
    items: ["QR Digital Menu", "Manajemen produk", "Dashboard admin", "Laporan sederhana", "Manajemen kategori", "Akses melalui smartphone"],
  },
  {
    id: "business-management", name: "Business Management System", price: 7_500_000, startingFrom: false, recommended: true,
    forWho: "Untuk cafe, restoran, dan toko",
    items: ["POS / Sistem Kasir", "Inventory Management", "Finance Management", "Data produk dan supplier", "Laporan penjualan", "Dashboard admin", "Manajemen karyawan dasar"],
  },
  {
    id: "enterprise", name: "Enterprise Management System", price: 15_000_000, startingFrom: true, recommended: false,
    forWho: "Untuk perusahaan dan bisnis multi-cabang",
    items: ["Finance Management", "Inventory & Warehouse", "Purchasing Management", "HR & Payroll", "CRM", "Multi-user & hak akses", "Multi-cabang", "Dashboard laporan terpusat"],
  },
] as const;

export type BizMaintenance = { id: string; name: string; price: number | null; startingFrom: boolean; unit: string; quoteNote: string };

export const BIZ_MAINTENANCE: BizMaintenance[] = [
  { id: "basic", name: "Maintenance Basic", price: 150_000, startingFrom: false, unit: "/bulan", quoteNote: "" },
  { id: "business", name: "Maintenance Business", price: 300_000, startingFrom: false, unit: "/bulan", quoteNote: "" },
  { id: "professional", name: "Maintenance Professional", price: 500_000, startingFrom: false, unit: "/bulan", quoteNote: "" },
  { id: "enterprise", name: "Maintenance Enterprise", price: 1_000_000, startingFrom: true, unit: "/bulan", quoteNote: "" },
  { id: "backup", name: "Backup Database", price: 100_000, startingFrom: true, unit: "/bulan", quoteNote: "" },
  { id: "hosting", name: "Hosting & Server", price: null, startingFrom: false, unit: "", quoteNote: "Sesuai spesifikasi" },
  { id: "support", name: "Technical Support", price: null, startingFrom: false, unit: "", quoteNote: "Sesuai paket" },
];

export const BIZ_MAINTENANCE_SCOPE = [
  "Monitoring website dan sistem.",
  "Perbaikan bug pada fitur yang sudah disepakati.",
  "Backup database berkala sesuai paket.",
  "Pemeriksaan keamanan dasar.",
  "Bantuan teknis penggunaan sistem.",
];

export const BIZ_MAINTENANCE_EXCLUSION =
  "Maintenance tidak otomatis mencakup pembuatan fitur baru, perubahan besar, atau penambahan modul.";

export const BIZ_TERMS = [
  { label: "Pembayaran awal", detail: "DP 50%" },
  { label: "Pembayaran akhir", detail: "50% setelah testing dan sebelum serah terima" },
  { label: "Revisi", detail: "Sesuai ruang lingkup dan kesepakatan" },
  { label: "Domain & hosting", detail: "Terpisah jika belum termasuk paket" },
  { label: "Training", detail: "1 sesi pelatihan dasar" },
  { label: "Garansi bug", detail: "30 hari setelah serah terima" },
  { label: "Fitur tambahan", detail: "Dihitung berdasarkan estimasi" },
  { label: "Source code", detail: "Sesuai kesepakatan kontrak" },
];

export const BIZ_TAGLINE = "Technology that moves your business forward.";

export const BIZ_CUSTOM = {
  name: "Custom Development",
  desc: "Web app, API, integrasi, dan sistem khusus. Alur kerja, jumlah pengguna, dan fitur dihitung dari hasil analisis kebutuhan — penawaran disusun setelah brief dibahas.",
  items: ["Web application", "Integrasi API & payment", "Otomatisasi alur kerja", "Sistem sesuai regulasi industri"],
};

export const bizRupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

/** WhatsApp link with the system name and price already typed into the chat. */
export function bizConsultUrl(label: string, price?: number | null, startingFrom = false) {
  const priceText = price == null ? "" : ` — ${startingFrom ? "mulai " : ""}${bizRupiah(price)}`;
  return `${NEMPO_WA_URL}?text=${encodeURIComponent(`Halo Nempo, saya mau tanya soal ${label}${priceText}`)}`;
}
