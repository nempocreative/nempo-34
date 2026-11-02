export interface SubKategori {
  label: string;
  fee: number;
  ageGroup?: string;
}

export interface Perlombaan {
  id: string;
  title: string;
  category: string;
  deadline: string;
  prizePool: number;
  image: string;
  description: string;
  organizer: string;
  participants?: number;
  status: "open" | "upcoming" | "closed";
  featured?: boolean;
  location: string;
  subKategori: SubKategori[];
  syarat?: string[];
  paymentInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export const mockPerlombaan: Perlombaan[] = [
  {
    id: "1",
    title: "Garut Photography Contest 2025",
    category: "Fotografi",
    deadline: "30 Mei 2025",
    prizePool: 15000000,
    image: "",
    description: "Lomba fotografi dengan tema pesona alam dan budaya Garut. Terbuka untuk semua fotografer Indonesia.",
    organizer: "Dinas Pariwisata Garut",
    participants: 142,
    status: "open",
    featured: true,
    location: "Garut, Jawa Barat",
    subKategori: [
      { label: "Kategori Pelajar (SMP/SMA)", fee: 30000, ageGroup: "< 18 tahun" },
      { label: "Kategori Umum", fee: 75000, ageGroup: "18 tahun ke atas" },
      { label: "Kategori Profesional", fee: 150000, ageGroup: "Fotografer berpengalaman" },
    ],
    syarat: [
      "Karya orisinal, belum pernah dipublikasikan",
      "Format JPEG/PNG, min. resolusi 3000×2000 px",
      "Maksimal 3 karya per peserta",
      "Tidak menggunakan AI generatif",
    ],
    paymentInfo: {
      bankName: "BRI",
      accountNumber: "1234-5678-9012-3456",
      accountName: "Dinas Pariwisata Garut",
    },
  },
  {
    id: "2",
    title: "Lomba Memasak Kuliner Khas Garut",
    category: "Kuliner",
    deadline: "15 Jun 2025",
    prizePool: 10000000,
    image: "",
    description: "Ciptakan inovasi masakan berbasis bahan lokal Garut. Tampilkan kreasi terbaik Anda!",
    organizer: "UMKM Garut Bersatu",
    participants: 88,
    status: "open",
    featured: true,
    location: "Gedung Pertemuan Garut",
    subKategori: [
      { label: "Kategori Makanan Utama", fee: 50000 },
      { label: "Kategori Kue & Jajanan Tradisional", fee: 50000 },
      { label: "Kategori Minuman Kreatif", fee: 40000 },
    ],
    syarat: [
      "Bahan utama wajib dari produk lokal Garut",
      "Peserta hadir langsung pada hari H",
      "Membawa peralatan memasak sendiri",
      "Satu tim maksimal 3 orang",
    ],
    paymentInfo: {
      bankName: "BCA",
      accountNumber: "7890-1234-5678",
      accountName: "UMKM Garut Bersatu",
    },
  },
  {
    id: "3",
    title: "Garut Trail Run 2025",
    category: "Olahraga",
    deadline: "05 Jul 2025",
    prizePool: 20000000,
    image: "",
    description: "Lomba lari lintas alam melintasi kawasan Gunung Papandayan. Kategori 10K, 21K, dan 42K.",
    organizer: "Komunitas Runner Garut",
    participants: 310,
    status: "open",
    featured: true,
    location: "Gunung Papandayan",
    subKategori: [
      { label: "10K — Fun Run", fee: 100000, ageGroup: "Semua usia" },
      { label: "21K — Half Trail", fee: 175000, ageGroup: "Min. 17 tahun" },
      { label: "42K — Full Trail", fee: 250000, ageGroup: "Min. 18 tahun" },
    ],
    syarat: [
      "Peserta wajib dalam kondisi sehat",
      "Wajib mengenakan pakaian olahraga & sepatu trail",
      "Mengisi form medis saat daftar",
      "Tidak memindahtangankan nomor BIB",
    ],
    paymentInfo: {
      bankName: "Mandiri",
      accountNumber: "1100-2233-4455-6677",
      accountName: "Komunitas Runner Garut",
    },
  },
  {
    id: "4",
    title: "Festival Tari Sunda Kreasi",
    category: "Budaya",
    deadline: "20 Jul 2025",
    prizePool: 12000000,
    image: "",
    description: "Ajang kreativitas tari tradisional Sunda tingkat provinsi dengan berbagai kategori usia.",
    organizer: "Sanggar Seni Pasundan",
    participants: 65,
    status: "upcoming",
    featured: true,
    location: "Gedung Kesenian Garut",
    subKategori: [
      { label: "Kategori Anak (SD)", fee: 75000, ageGroup: "6–12 tahun" },
      { label: "Kategori Remaja (SMP/SMA)", fee: 100000, ageGroup: "13–18 tahun" },
      { label: "Kategori Dewasa / Umum", fee: 150000, ageGroup: "18 tahun ke atas" },
    ],
    syarat: [
      "Membawakan tari kreasi Sunda",
      "Durasi penampilan 5–8 menit",
      "Kostum sesuai tema dan kategori",
      "Satu grup 3–10 penari",
    ],
    paymentInfo: {
      bankName: "BNI",
      accountNumber: "9988-7766-5544",
      accountName: "Sanggar Seni Pasundan",
    },
  },
  {
    id: "5",
    title: "Lomba Desain Batik Garutan",
    category: "Seni",
    deadline: "10 Agu 2025",
    prizePool: 8000000,
    image: "",
    description: "Kompetisi desain motif batik Garutan untuk melestarikan warisan budaya lokal.",
    organizer: "Dekranasda Garut",
    participants: 47,
    status: "upcoming",
    featured: true,
    location: "Museum Batik Garut",
    subKategori: [
      { label: "Kategori Pelajar", fee: 35000, ageGroup: "Maks. 18 tahun" },
      { label: "Kategori Umum / Pengrajin", fee: 85000 },
    ],
    syarat: [
      "Desain orisinal belum pernah dipublikasikan",
      "Mengandung motif khas Garut / Priangan",
      "Dikirim dalam format digital (PDF/AI/PNG 300dpi)",
    ],
    paymentInfo: {
      bankName: "BSI",
      accountNumber: "7128-3390-0012",
      accountName: "Dekranasda Kabupaten Garut",
    },
  },
  {
    id: "6",
    title: "Lomba Video Pendek Pariwisata",
    category: "Kreativitas",
    deadline: "28 Feb 2025",
    prizePool: 7500000,
    image: "",
    description: "Buat video pendek terbaik tentang keindahan wisata Garut untuk media sosial.",
    organizer: "Nempo Organizer",
    participants: 201,
    status: "closed",
    location: "Online",
    subKategori: [
      { label: "Kategori Pelajar", fee: 0 },
      { label: "Kategori Umum", fee: 50000 },
    ],
    syarat: [
      "Durasi video 30 detik – 3 menit",
      "Upload ke Instagram / TikTok + tag @nempo.id",
      "Lokasi syuting di wilayah Garut",
    ],
    paymentInfo: {
      bankName: "BRI",
      accountNumber: "0088-1234-5555-6789",
      accountName: "Nempo Organizer Official",
    },
  },
];
